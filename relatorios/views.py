from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Relatorio
from .serializers import RelatorioSerializer
from familias.models import Familia
from membros.models import Membro
from presencas.models import Presenca
from cestas.models import EntregaDeCesta
from turmas.models import Turma
from core.permissions import IsStaffOrReadOnly
from django.db.models import Count, Avg, Q, Case, When, FloatField
from datetime import datetime, timedelta
from django.db.models.functions import ExtractMonth, ExtractYear

class RelatorioViewSet(viewsets.ModelViewSet):
    queryset = Relatorio.objects.all()
    serializer_class = RelatorioSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]

    @action(detail=False, methods=['get'])
    def frequencia(self, request):
        """
        Get attendance frequency report with detailed statistics
        """
        from django.db.models import Count, Avg
        from datetime import datetime
        
        # Get date range from parameters
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        
        # If no date range provided, use current month
        if not data_inicio or not data_fim:
            current = datetime.now()
            data_inicio = current.replace(day=1)
            data_fim = current.replace(day=current.day)
        
        # Get attendance statistics
        frequencia = Presenca.objects.filter(
            data__range=[data_inicio, data_fim]
        ).values(
            'membro__nome',
            'membro__familia__nome'
        ).annotate(
            total_presencas=Count('id', filter=Q(presente=True)),
            total_encontros=Count('id'),
            percentual_presenca=Avg(
                Case(
                    When(presente=True, then=1),
                    When(presente=False, then=0),
                    output_field=FloatField()
                )
            ) * 100
        ).order_by('-percentual_presenca')
        
        # Get global statistics
        total_membros = frequencia.count()
        total_presencas = sum([f['total_presencas'] for f in frequencia])
        total_encontros = sum([f['total_encontros'] for f in frequencia])
        media_presenca = (total_presencas / total_encontros * 100) if total_encontros > 0 else 0
        
        return Response({
            'frequencia': list(frequencia),
            'statistics': {
                'total_membros': total_membros,
                'total_presencas': total_presencas,
                'total_encontros': total_encontros,
                'media_presenca': media_presenca,
                'periodo': {
                    'inicio': data_inicio,
                    'fim': data_fim
                }
            },
            'status_code': 200
        })

    @action(detail=False, methods=['get'])
    def cestas(self, request):
        """
        Get basket delivery report with detailed statistics
        """
        from django.db.models import Count, Avg
        from datetime import datetime
        
        # Get date range from parameters
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        
        # If no date range provided, use current month
        if not data_inicio or not data_fim:
            current = datetime.now()
            data_inicio = current.replace(day=1)
            data_fim = current.replace(day=current.day)
        
        # Get deliveries by month
        cestas = EntregaCesta.objects.filter(
            data_entrega__range=[data_inicio, data_fim]
        ).annotate(
            mes=ExtractMonth('data_entrega'),
            ano=ExtractYear('data_entrega')
        ).values('mes', 'ano').annotate(
            total_entregas=Count('id'),
            total_familias=Count('familia', distinct=True),
            media_por_familia=Avg(
                Count('id') / Count('familia', distinct=True)
            )
        ).order_by('ano', 'mes')
        
        # Get global statistics
        total_entregas = sum([c['total_entregas'] for c in cestas])
        total_familias = sum([c['total_familias'] for c in cestas])
        
        return Response({
            'cestas': list(cestas),
            'statistics': {
                'total_entregas': total_entregas,
                'total_familias': total_familias,
                'media_entregas_por_mes': total_entregas / len(cestas) if cestas else 0,
                'periodo': {
                    'inicio': data_inicio,
                    'fim': data_fim
                }
            },
            'status_code': 200
        })

    @action(detail=False, methods=['get'])
    def tamanhos(self, request):
        """
        Get size distribution report with detailed statistics
        """
        # Get size distribution
        tamanhos = Membro.objects.values(
            'tamanho_calcao', 'tamanho_calca', 'tamanho_blusa'
        ).annotate(
            calcao_count=Count('tamanho_calcao'),
            calca_count=Count('tamanho_calca'),
            blusa_count=Count('tamanho_blusa')
        )
        
        # Aggregate by size
        calcoes = tamanhos.values('tamanho_calcao').annotate(
            quantidade=Count('tamanho_calcao')
        ).exclude(tamanho_calcao__isnull=True)
        
        calcas = tamanhos.values('tamanho_calca').annotate(
            quantidade=Count('tamanho_calca')
        ).exclude(tamanho_calca__isnull=True)
        
        blusas = tamanhos.values('tamanho_blusa').annotate(
            quantidade=Count('tamanho_blusa')
        ).exclude(tamanho_blusa__isnull=True)
        
        # Calculate statistics
        total_membros = Membro.objects.count()
        total_calcoes = sum([c['quantidade'] for c in calcoes])
        total_calcas = sum([c['quantidade'] for c in calcas])
        total_blusas = sum([b['quantidade'] for b in blusas])
        
        return Response({
            'distribuicao': {
                'calcoes': list(calcoes),
                'calcas': list(calcas),
                'blusas': list(blusas)
            },
            'statistics': {
                'total_membros': total_membros,
                'total_calcoes': total_calcoes,
                'total_calcas': total_calcas,
                'total_blusas': total_blusas,
                'percentual_calcoes': (total_calcoes / total_membros * 100) if total_membros > 0 else 0,
                'percentual_calcas': (total_calcas / total_membros * 100) if total_membros > 0 else 0,
                'percentual_blusas': (total_blusas / total_membros * 100) if total_membros > 0 else 0
            },
            'status_code': 200
        })

    @action(detail=False, methods=['get'])
    def programas(self, request):
        """
        Get social programs report with detailed statistics
        """
        # Get program distribution
        programas = Familia.objects.values(
            'programas_sociais'
        ).annotate(
            total_familias=Count('id'),
            percentual=Avg(
                Case(
                    When(programas_sociais=True, then=1),
                    When(programas_sociais=False, then=0),
                    output_field=FloatField()
                )
            ) * 100
        ).exclude(programas_sociais__isnull=True)
        
        # Calculate statistics
        total_familias = Familia.objects.count()
        total_com_programas = sum([p['total_familias'] for p in programas])
        
        return Response({
            'programas': list(programas),
            'statistics': {
                'total_familias': total_familias,
                'total_com_programas': total_com_programas,
                'percentual_com_programas': (total_com_programas / total_familias * 100) if total_familias > 0 else 0,
                'programas_ativos': len(programas)
            },
            'status_code': 200
        })

    @action(detail=False, methods=['get'])
    def resumo(self, request):
        """
        Get comprehensive summary report
        """
        # Get attendance statistics
        frequencia = self.frequencia(request)
        
        # Get basket delivery statistics
        cestas = self.cestas(request)
        
        # Get size distribution statistics
        tamanhos = self.tamanhos(request)
        
        # Get program statistics
        programas = self.programas(request)
        
        return Response({
            'resumo': {
                'frequencia': frequencia.data['statistics'],
                'cestas': cestas.data['statistics'],
                'tamanhos': tamanhos.data['statistics'],
                'programas': programas.data['statistics']
            },
            'status_code': 200
        })

from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Presenca
from .serializers import PresencaSerializer
from membros.models import Membro
from turmas.models import Turma
from core.permissions import IsStaffOrReadOnly

class PresencaViewSet(viewsets.ModelViewSet):
    queryset = Presenca.objects.all()
    serializer_class = PresencaSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        presenca = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def report(self, request):
        membro_id = request.query_params.get('membro')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = self.get_queryset()
        if membro_id:
            queryset = queryset.filter(membro_id=membro_id)
        if start_date:
            queryset = queryset.filter(data__gte=start_date)
        if end_date:
            queryset = queryset.filter(data__lte=end_date)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()
        membro_id = self.request.query_params.get('membro')
        turma_id = self.request.query_params.get('turma')
        data = self.request.query_params.get('data')
        
        if membro_id:
            queryset = queryset.filter(membro_id=membro_id)
        if turma_id:
            queryset = queryset.filter(turma_id=turma_id)
        if data:
            queryset = queryset.filter(data=data)
        
        return queryset

    @action(detail=False, methods=['get'])
    def turma(self, request, turma_id=None, data=None):
        """
        Get presenças by turma and date
        """
        if not turma_id or not data:
            raise ValidationError({
                'error': 'turma_id and data are required',
                'status_code': 400
            })
            
        queryset = self.get_queryset().filter(
            turma_id=turma_id,
            data=data
        )
        
        # Add attendance statistics
        total_membros = queryset.count()
        presentes = queryset.filter(presente=True).count()
        ausentes = total_membros - presentes
        
        return Response({
            'presencas': PresencaSerializer(queryset, many=True).data,
            'statistics': {
                'total_membros': total_membros,
                'presentes': presentes,
                'ausentes': ausentes,
                'percentual_presenca': (presentes / total_membros * 100) if total_membros > 0 else 0
            }
        })

    @action(detail=True, methods=['put'])
    def update_presenca(self, request, pk=None):
        """
        Update single presence status
        """
        presenca = self.get_object()
        
        # Check if user has permission to update
        if not request.user.is_staff:
            raise PermissionDenied({
                'error': 'You do not have permission to update attendance',
                'status_code': 403
            })
            
        presente = request.data.get('presente')
        if presente is None:
            raise ValidationError({
                'error': 'presente field is required',
                'status_code': 400
            })
            
        presenca.presente = presente
        presenca.save()
        
        return Response({
            'message': 'Attendance updated successfully',
            'data': PresencaSerializer(presenca).data,
            'status_code': 200
        })

    @action(detail=False, methods=['get'])
    def frequencia(self, request):
        """
        Get attendance frequency report
        """
        current_year = datetime.now().year
        
        # Get attendance statistics by month
        frequencia = Presenca.objects.filter(
            data__year=current_year
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
        
        return Response(frequencia)

    @action(detail=False, methods=['get'])
    def historico(self, request):
        """
        Get attendance history for a member
        """
        membro_id = request.query_params.get('membro_id')
        
        if not membro_id:
            raise ValidationError({
                'error': 'membro_id is required',
                'status_code': 400
            })
            
        historico = Presenca.objects.filter(
            membro_id=membro_id
        ).order_by('-data')
        
        return Response({
            'historico': PresencaSerializer(historico, many=True).data,
            'total_presencas': historico.filter(presente=True).count(),
            'total_ausencias': historico.filter(presente=False).count()
        })

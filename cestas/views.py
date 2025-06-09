from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import mixins
from rest_framework import generics
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.db.models import Count, Avg, Q
from datetime import datetime
from .models import EntregaDeCesta
from .serializers import EntregaDeCestaSerializer
from core.permissions import IsStaffOrReadOnly
from familias.models import Familia

class EntregaDeCestaViewSet(viewsets.ModelViewSet):
    queryset = EntregaDeCesta.objects.all()
    serializer_class = EntregaDeCestaSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]

    def get_queryset(self):
        queryset = self.queryset
        familia_id = self.request.query_params.get('familia_id')
        data_inicio = self.request.query_params.get('data_inicio')
        data_fim = self.request.query_params.get('data_fim')
        
        if familia_id:
            queryset = queryset.filter(familia_id=familia_id)
        if data_inicio:
            queryset = queryset.filter(data_entrega__gte=data_inicio)
        if data_fim:
            queryset = queryset.filter(data_entrega__lte=data_fim)
        
        return queryset

    @action(detail=False, methods=['get'])
    def familia(self, request, familia_id=None):
        """
        Get basket deliveries by family with statistics
        """
        if not familia_id:
            raise ValidationError({
                'error': 'familia_id is required',
                'status_code': 400
            })
            
        queryset = self.get_queryset().filter(familia_id=familia_id)
        
        # Calculate statistics
        total_entregas = queryset.count()
        total_meses = queryset.values('data_entrega__month', 'data_entrega__year').distinct().count()
        media_por_mes = total_entregas / (total_meses or 1)
        
        return Response({
            'entregas': EntregaCestaSerializer(queryset, many=True).data,
            'statistics': {
                'total_entregas': total_entregas,
                'total_meses': total_meses,
                'media_por_mes': media_por_mes,
                'ultimo_entrega': queryset.order_by('-data_entrega').first().data_entrega if total_entregas > 0 else None
            }
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get basket delivery statistics with detailed breakdown
        """
        from django.db.models import Count, Avg
        from datetime import datetime
        
        # Get current year and month
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        # Get deliveries by month
        deliveries = EntregaCesta.objects.filter(
            data_entrega__year=current_year,
            data_entrega__month=current_month
        )
        
        # Calculate statistics
        total_entregas = deliveries.count()
        total_familias = deliveries.values('familia').distinct().count()
        media_por_familia = total_entregas / (total_familias or 1)
        
        # Get delivery frequency
        frequencia = deliveries.values('data_entrega').annotate(
            count=Count('id')
        ).order_by('data_entrega')
        
        return Response({
            'statistics': {
                'total_entregas': total_entregas,
                'total_familias': total_familias,
                'media_por_familia': media_por_familia,
                'frequencia': list(frequencia)
            },
            'status_code': 200
        })

    @action(detail=False, methods=['get'])
    def historico(self, request):
        """
        Get basket delivery history
        """
        familia_id = request.query_params.get('familia_id')
        
        if not familia_id:
            raise ValidationError({
                'error': 'familia_id is required',
                'status_code': 400
            })
            
        historico = EntregaCesta.objects.filter(
            familia_id=familia_id
        ).order_by('-data_entrega')
        
        return Response({
            'historico': EntregaCestaSerializer(historico, many=True).data,
            'total_entregas': historico.count(),
            'ultima_entrega': historico.first().data_entrega if historico.exists() else None
        })

    @action(detail=False, methods=['post'])
    def batch_create(self, request):
        """
        Create multiple basket deliveries at once
        """
        if not request.user.is_staff:
            raise PermissionDenied({
                'error': 'You do not have permission to create multiple deliveries',
                'status_code': 403
            })
            
        data = request.data
        if not isinstance(data, list):
            raise ValidationError({
                'error': 'Data must be a list of deliveries',
                'status_code': 400
            })
            
        created_deliveries = []
        for delivery_data in data:
            serializer = EntregaCestaSerializer(data=delivery_data)
            if serializer.is_valid():
                delivery = serializer.save()
                created_deliveries.append(serializer.data)
            else:
                raise ValidationError({
                    'error': serializer.errors,
                    'status_code': 400
                })
                
        return Response({
            'message': 'Deliveries created successfully',
            'data': created_deliveries,
            'status_code': 201
        })

from rest_framework import serializers
from .models import Relatorio

class RelatorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relatorio
        fields = [
            'id',
            'tipo',
            'data_geracao',
            'periodo_inicio',
            'periodo_fim',
            'descricao',
            'arquivo',
            'ativo',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'data_geracao', 'created_at', 'updated_at']

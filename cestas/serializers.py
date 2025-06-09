from rest_framework import serializers
from .models import EntregaDeCesta
from familias.serializers import FamiliaSerializer

class EntregaDeCestaSerializer(serializers.ModelSerializer):
    familia = FamiliaSerializer(read_only=True)
    familia_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = EntregaDeCesta
        fields = [
            'id',
            'familia',
            'data_entrega',
            'observacoes',
            'ativo',
            'created_at',
            'updated_at',
            'familia_id'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

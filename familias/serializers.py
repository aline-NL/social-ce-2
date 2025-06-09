from rest_framework import serializers
from .models import Familia
from membros.models import Membro
from membros.serializers import MembroSerializer

class FamiliaSerializer(serializers.ModelSerializer):
    membros = MembroSerializer(many=True, read_only=True)

    class Meta:
        model = Familia
        fields = [
            'id',
            'nome',
            'endereco',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado',
            'cep',
            'telefone',
            'email',
            'programas_sociais',
            'membros',
            'ativo',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

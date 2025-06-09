from rest_framework import serializers
from .models import Membro
from familias.models import Familia

class MembroSerializer(serializers.ModelSerializer):
    familia_nome = serializers.CharField(source='familia.nome', read_only=True)

    class Meta:
        model = Membro
        fields = [
            'id',
            'nome',
            'data_nascimento',
            'sexo',
            'familia',
            'familia_nome',
            'cpf',
            'rg',
            'nis',
            'grau_parentesco',
            'declaracao_matricula',
            'foto_3x4',
            'ativo',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

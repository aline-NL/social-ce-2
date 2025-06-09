from rest_framework import serializers
from .models import Turma

class TurmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turma
        fields = [
            'id',
            'nome',
            'idade_minima',
            'idade_maxima',
            'ativo',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

from rest_framework import serializers
from .models import Presenca
from membros.serializers import MembroSerializer
from turmas.serializers import TurmaSerializer

class PresencaSerializer(serializers.ModelSerializer):
    membro = MembroSerializer(read_only=True)
    turma = TurmaSerializer(read_only=True)
    membro_id = serializers.IntegerField(write_only=True)
    turma_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Presenca
        fields = [
            'id',
            'membro',
            'turma',
            'data',
            'presente',
            'membro_id',
            'turma_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

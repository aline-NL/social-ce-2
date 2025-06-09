from django.db import models
from familias.models import Familia
from membros.models import Membro
from turmas.models import Turma
from cestas.models import EntregaDeCesta
from presencas.models import Presenca

class Relatorio(models.Model):
    TIPO_CHOICES = [
        ('FREQUENCIA', 'Relatório de Frequência'),
        ('CESTA', 'Relatório de Entrega de Cestas'),
        ('GERAL', 'Relatório Geral'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    data_geracao = models.DateTimeField(auto_now_add=True)
    periodo_inicio = models.DateField()
    periodo_fim = models.DateField()
    descricao = models.TextField(blank=True, null=True)
    arquivo = models.FileField(upload_to='relatorios/', null=True, blank=True)
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Relatório'
        verbose_name_plural = 'Relatórios'
        ordering = ['-data_geracao']

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.data_geracao.strftime('%d/%m/%Y %H:%M')}"

from django.db import models
from django.utils.translation import gettext_lazy as _
from datetime import date
from familias.models import Familia


class EntregaDeCesta(models.Model):
    familia = models.ForeignKey(
        Familia,
        on_delete=models.CASCADE,
        related_name='entregas_de_cesta',
        verbose_name=_('família')
    )
    data_entrega = models.DateField(default=date.today, verbose_name=_('data da entrega'))
    observacoes = models.TextField(blank=True, null=True, verbose_name=_('observações'))
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True, verbose_name=_('ativo'))

    class Meta:
        verbose_name = _('entrega de cesta')
        verbose_name_plural = _('entregas de cesta')
        ordering = ['-data_entrega']
        constraints = [
            models.UniqueConstraint(
                fields=['familia', 'data_entrega'],
                name='unique_familia_data_entrega'
            )
        ]

    def __str__(self):
        return f"{self.familia.nome} - {self.data_entrega.strftime('%d/%m/%Y')}"

    @property
    def mes_ano(self):
        """Returns the month and year of the delivery."""
        return self.data_entrega.strftime('%m/%Y')

# Create your models here.

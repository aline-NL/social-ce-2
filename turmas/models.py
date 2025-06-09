from django.db import models
from django.utils.translation import gettext_lazy as _


class Turma(models.Model):
    nome = models.CharField(max_length=100, verbose_name=_('nome da turma'))
    idade_minima = models.PositiveSmallIntegerField(verbose_name=_('idade mínima'))
    idade_maxima = models.PositiveSmallIntegerField(verbose_name=_('idade máxima'))
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True, verbose_name=_('ativo'))

    class Meta:
        verbose_name = _('turma')
        verbose_name_plural = _('turmas')
        ordering = ['nome']

    def __str__(self):
        return self.nome

    @property
    def faixa_etaria(self):
        """Returns the age range as a string."""
        return f"{self.idade_minima} a {self.idade_maxima} anos"

    def idade_valida(self, idade: int) -> bool:
        """Checks if an age is within the valid range for this turma."""
        return self.idade_minima <= idade <= self.idade_maxima

# Create your models here.

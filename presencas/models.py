from django.db import models
from django.utils.translation import gettext_lazy as _
from datetime import date
from membros.models import Membro


class Presenca(models.Model):
    membro = models.ForeignKey(
        Membro,
        on_delete=models.CASCADE,
        related_name='presencas',
        verbose_name=_('membro')
    )
    data = models.DateField(default=date.today, verbose_name=_('data do encontro'))
    presente = models.BooleanField(default=True, verbose_name=_('presente'))
    turma = models.ForeignKey(
        'turmas.Turma',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('turma')
    )
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True, verbose_name=_('ativo'))

    class Meta:
        verbose_name = _('presença')
        verbose_name_plural = _('presenças')
        ordering = ['-data']
        constraints = [
            models.UniqueConstraint(
                fields=['membro', 'data'],
                name='unique_membro_data'
            )
        ]

    def __str__(self):
        return f"{self.membro.nome_completo} - {self.data}"

    @property
    def idade_do_membro(self):
        """Returns the member's age at the time of this presence."""
        if self.data:
            today = self.data
        else:
            today = date.today()
        
        born = self.membro.data_nascimento
        if born:
            return today.year - born.year - ((today.month, today.day) < (born.month, born.day))
        return None

    def turma_sugerida(self):
        """Suggests a turma based on member's age."""
        from turmas.models import Turma
        idade = self.idade_do_membro
        if idade is not None:
            return Turma.objects.filter(
                idade_minima__lte=idade,
                idade_maxima__gte=idade,
                ativo=True
            ).first()
        return None

# Create your models here.

from django.db import models
from django.utils.translation import gettext_lazy as _
from familias.models import Familia


class Membro(models.Model):
    nome = models.CharField(_('Nome'), max_length=100)
    data_nascimento = models.DateField(_('Data de Nascimento'))
    sexo = models.CharField(
        _('Sexo'),
        max_length=1,
        choices=[('M', _('Masculino')), ('F', _('Feminino'))]
    )
    familia = models.ForeignKey(
        Familia,
        on_delete=models.CASCADE,
        related_name='membros_membros'
    )
    cpf = models.CharField(_('CPF'), max_length=14, blank=True, null=True)
    rg = models.CharField(_('RG'), max_length=15, blank=True, null=True)
    nis = models.CharField(_('NIS'), max_length=15, blank=True, null=True)
    grau_parentesco = models.CharField(
        _('Grau de Parentesco'),
        max_length=50,
        choices=[
            ('PAI', _('Pai')),
            ('MAE', _('Mãe')),
            ('FILHO', _('Filho')),
            ('ESPOSO', _('Esposo')),
            ('ESPOSA', _('Esposa')),
            ('OUTRO', _('Outro'))
        ]
    )
    declaracao_matricula = models.FileField(
        _('Declaração de Matrícula'),
        upload_to='membros/declaracoes/',
        blank=True,
        null=True
    )
    foto_3x4 = models.ImageField(
        _('Foto 3x4'),
        upload_to='membros/fotos/',
        blank=True,
        null=True
    )
    ativo = models.BooleanField(_('Ativo'), default=True)
    created_at = models.DateTimeField(_('Criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Atualizado em'), auto_now=True)

    class Meta:
        verbose_name = _('Membro')
        verbose_name_plural = _('Membros')
        ordering = ['nome']

    def __str__(self):
        return self.nome

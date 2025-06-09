from django.db import models
from django.core.validators import MinLengthValidator
from django.utils.translation import gettext_lazy as _


class Familia(models.Model):
    nome = models.CharField(max_length=200, blank=True, null=True, verbose_name=_('nome da família'))
    
    # Endereço
    cep = models.CharField(max_length=9, blank=True, null=True, verbose_name=_('CEP'))
    logradouro = models.CharField(max_length=200, blank=True, null=True, verbose_name=_('logradouro'))
    numero = models.CharField(max_length=20, blank=True, null=True, verbose_name=_('número'))
    complemento = models.CharField(max_length=200, blank=True, null=True, verbose_name=_('complemento'))
    bairro = models.CharField(max_length=100, blank=True, null=True, verbose_name=_('bairro'))
    cidade = models.CharField(max_length=100, blank=True, null=True, verbose_name=_('cidade'))
    estado = models.CharField(max_length=2, blank=True, null=True, verbose_name=_('estado'))
    
    # Informações adicionais
    observacoes = models.TextField(blank=True, null=True, verbose_name=_('observações gerais'))
    recebe_programas_sociais = models.BooleanField(default=False, verbose_name=_('recebe programas sociais?'))
    programas_sociais = models.TextField(blank=True, null=True, verbose_name=_('quais programas sociais?'))
    
    # Controle
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True, verbose_name=_('ativo'))

    class Meta:
        verbose_name = _('família')
        verbose_name_plural = _('famílias')
        ordering = ['nome']

    def __str__(self):
        return self.nome or f'Família #{self.id}'


class Responsavel(models.Model):
    SEXO_CHOICES = [
        ('M', _('Masculino')),
        ('F', _('Feminino')),
        ('O', _('Outro')),
    ]
    
    familia = models.ForeignKey(
        Familia, 
        on_delete=models.CASCADE, 
        related_name='responsaveis',
        verbose_name=_('família')
    )
    nome_completo = models.CharField(max_length=200, verbose_name=_('nome completo'))
    cpf = models.CharField(
        max_length=14, 
        blank=True, 
        null=True, 
        validators=[MinLengthValidator(11)],
        verbose_name=_('CPF')
    )
    telefone = models.CharField(max_length=20, verbose_name=_('telefone'))
    email = models.EmailField(blank=True, null=True, verbose_name=_('e-mail'))
    sexo = models.CharField(
        max_length=1, 
        choices=SEXO_CHOICES, 
        blank=True, 
        null=True, 
        verbose_name=_('sexo')
    )
    data_nascimento = models.DateField(blank=True, null=True, verbose_name=_('data de nascimento'))
    parentesco = models.CharField(max_length=100, blank=True, null=True, verbose_name=_('parentesco'))
    
    # Controle
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True, verbose_name=_('ativo'))

    class Meta:
        verbose_name = _('responsável')
        verbose_name_plural = _('responsáveis')
        ordering = ['nome_completo']

    def __str__(self):
        return self.nome_completo


class Membro(models.Model):
    SEXO_CHOICES = [
        ('M', _('Masculino')),
        ('F', _('Feminino')),
        ('O', _('Outro')),
    ]

    familia = models.ForeignKey(
        Familia,
        on_delete=models.CASCADE,
        related_name='membros',
        verbose_name=_('família')
    )
    nome_completo = models.CharField(max_length=200, verbose_name=_('nome completo'))
    data_nascimento = models.DateField(verbose_name=_('data de nascimento'))
    sexo = models.CharField(
        max_length=1,
        choices=SEXO_CHOICES,
        blank=True, 
        null=True, 
        verbose_name=_('sexo')
    )
    estudando = models.BooleanField(default=False, verbose_name=_('está estudando?'))
    escola = models.CharField(max_length=200, blank=True, null=True, verbose_name=_('nome da escola'))
    serie_escolar = models.CharField(max_length=50, blank=True, null=True, verbose_name=_('série escolar'))
    declaracao_matricula = models.ImageField(upload_to='membros/declaracoes_matricula/', blank=True, null=True, verbose_name=_('declaração de matrícula'))
    foto_3x4 = models.ImageField(upload_to='membros/fotos_3x4/', blank=True, null=True, verbose_name=_('foto 3x4'))
    rg = models.CharField(max_length=20, blank=True, null=True, verbose_name=_('RG'))
    nis = models.CharField(max_length=20, blank=True, null=True, verbose_name=_('NIS'))

    # Controle
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True, verbose_name=_('ativo'))

    class Meta:
        verbose_name = _('membro da família')
        verbose_name_plural = _('membros da família')
        ordering = ['nome_completo']

    def __str__(self):
        return self.nome_completo


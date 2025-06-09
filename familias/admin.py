from django.contrib import admin
from .models import Familia, Responsavel


class ResponsavelInline(admin.TabularInline):
    model = Responsavel
    extra = 1
    fields = ('nome_completo', 'cpf', 'telefone', 'email', 'parentesco')


@admin.register(Familia)
class FamiliaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'bairro', 'cidade', 'recebe_programas_sociais', 'ativo')
    list_filter = ('bairro', 'cidade', 'recebe_programas_sociais', 'ativo')
    search_fields = ('nome', 'logradouro', 'bairro', 'cidade', 'programas_sociais')
    inlines = [ResponsavelInline]
    fieldsets = (
        (None, {
            'fields': ('nome', 'ativo')
        }),
        ('Endereço', {
            'fields': ('cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado')
        }),
        ('Informações Adicionais', {
            'fields': ('recebe_programas_sociais', 'programas_sociais', 'observacoes'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Responsavel)
class ResponsavelAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'familia', 'cpf', 'telefone', 'email')
    list_filter = ('familia',)
    search_fields = ('nome_completo', 'cpf', 'telefone', 'email')

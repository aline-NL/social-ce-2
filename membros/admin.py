from django.contrib import admin
from familias.models import Membro


@admin.register(Membro)
class MembroAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'familia', 'data_nascimento', 'sexo', 'ativo')
    list_filter = ('sexo', 'ativo', 'familia')
    search_fields = ('nome_completo', 'cpf', 'rg', 'nis', 'escola')
    list_select_related = ('familia',)
    date_hierarchy = 'data_nascimento'
    
    fieldsets = (
        (None, {
            'fields': ('nome_completo', 'familia', 'data_nascimento', 'sexo')
        }),
        ('Documentos', {
            'fields': ('cpf', 'rg', 'nis')
        }),
        ('Escolaridade', {
            'fields': ('estudando', 'escola', 'serie_escolar', 'declaracao_matricula'),
            'classes': ('collapse',)
        }),
        ('Fotos', {
            'fields': ('foto_3x4',),
            'classes': ('collapse',)
        }),
        ('Controle', {
            'fields': ('ativo', 'data_criacao', 'data_atualizacao'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('data_criacao', 'data_atualizacao')

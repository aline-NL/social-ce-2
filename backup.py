import os
import datetime
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Backup do banco de dados'

    def handle(self, *args, **options):
        # Configurações do banco de dados
        db_config = settings.DATABASES['default']
        
        # Nome do arquivo de backup
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = os.path.join(backup_dir, f'backup_{timestamp}.sql')
        
        # Comando de backup
        backup_cmd = f'pg_dump -U {db_config["USER"]} -d {db_config["NAME"]} > {backup_file}'
        
        # Executa o backup
        try:
            os.system(backup_cmd)
            self.stdout.write(self.style.SUCCESS(f'Backup criado com sucesso em {backup_file}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erro ao criar backup: {str(e)}'))

import os
import datetime
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Limpa backups antigos'

    def handle(self, *args, **options):
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        if not os.path.exists(backup_dir):
            return

        # Mantém apenas os últimos 7 dias de backups
        days_to_keep = 7
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days_to_keep)

        # Lista todos os arquivos de backup
        for filename in os.listdir(backup_dir):
            if filename.endswith('.sql'):
                filepath = os.path.join(backup_dir, filename)
                file_date = datetime.datetime.strptime(
                    filename.split('_')[1].split('.')[0],
                    '%Y%m%d_%H%M%S'
                )
                
                if file_date < cutoff_date:
                    try:
                        os.remove(filepath)
                        self.stdout.write(self.style.SUCCESS(f'Backup removido: {filename}'))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f'Erro ao remover backup {filename}: {str(e)}'))

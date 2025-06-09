
"""
WSGI config for the project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""
import os
import sys

# Adiciona o diretório do projeto ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configura o módulo de settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Importa a aplicação WSGI do Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_()

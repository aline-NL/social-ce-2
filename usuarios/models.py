from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O e-mail é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('tipo', 'admin')
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractUser):
    TIPO_USUARIO_CHOICES = [
        ('admin', 'Administrador'),
        ('atendente', 'Atendente'),
        ('visualizador', 'Visualizador'),
    ]
    
    username = None
    email = models.EmailField(_('endereço de email'), unique=True)
    tipo = models.CharField(max_length=12, choices=TIPO_USUARIO_CHOICES, default='atendente')
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UsuarioManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'usuário'
        verbose_name_plural = 'usuários'

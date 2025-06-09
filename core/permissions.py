from rest_framework.permissions import BasePermission
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _

class IsStaffOrReadOnly(BasePermission):
    """
    The request is authenticated as a staff user, or is a read-only request.
    """
    def has_permission(self, request, view):
        return bool(
            request.method in ('GET', 'HEAD', 'OPTIONS') or
            request.user and
            request.user.is_authenticated and
            request.user.is_staff
        )

class IsSuperUserOrReadOnly(BasePermission):
    """
    The request is authenticated as a superuser, or is a read-only request.
    """
    def has_permission(self, request, view):
        return bool(
            request.method in ('GET', 'HEAD', 'OPTIONS') or
            request.user and
            request.user.is_authenticated and
            request.user.is_superuser
        )

class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return obj.owner == request.user

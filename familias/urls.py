from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FamiliaViewSet

router = DefaultRouter()
router.register(r'familias', FamiliaViewSet, basename='familia')

urlpatterns = [
    path('', include(router.urls)),
]

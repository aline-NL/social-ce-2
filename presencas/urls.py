from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PresencaViewSet

router = DefaultRouter()
router.register(r'presencas', PresencaViewSet)

urlpatterns = router.urls

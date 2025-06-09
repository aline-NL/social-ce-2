from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import EntregaDeCestaViewSet

router = DefaultRouter()
router.register(r'cestas', EntregaDeCestaViewSet)

urlpatterns = router.urls

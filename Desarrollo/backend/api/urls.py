from django.urls import path, include
from rest_framework.routers import DefaultRouter # type: ignore
from .views import (
    EstresEstudianteViewSet, EstresEstudianteCargaTrabajoViewSet, ia_view
)

router = DefaultRouter()
router.register(r'estres-estudiantes', EstresEstudianteViewSet, basename='estres-estudiantes')
router.register(r'estres-estudiantes-carga-trabajo', EstresEstudianteCargaTrabajoViewSet, basename='estres-carga-trabajo')

urlpatterns = [
    path('', include(router.urls)),
    path('ia/', ia_view),  # Nueva ruta para el endpoint /ia
]
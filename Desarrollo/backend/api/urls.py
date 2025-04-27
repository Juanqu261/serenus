from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RolViewSet, PersonaViewSet, EstudianteViewSet, EstresViewSet,
    EstresEstudianteViewSet, EstresEstudianteCargaTrabajoViewSet, ia_view
)

router = DefaultRouter()
router.register(r'roles', RolViewSet)
router.register(r'personas', PersonaViewSet)
router.register(r'estudiantes', EstudianteViewSet)
router.register(r'estres', EstresViewSet, basename='estres')
router.register(r'estres-estudiantes', EstresEstudianteViewSet, basename='estres-estudiantes')
router.register(r'estres-estudiantes-carga-trabajo', EstresEstudianteCargaTrabajoViewSet, basename='estres-carga-trabajo')

urlpatterns = [
    path('', include(router.urls)),
    path('ia/', ia_view),  # Nueva ruta para el endpoint /ia
]
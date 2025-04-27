from django.urls import path, include
from rest_framework.routers import DefaultRouter  # type: ignore
from .views import (
    RolViewSet, PersonaViewSet, EstudianteViewSet, EstresViewSet,
    EstresEstudianteViewSet, EstresEstudianteCargaTrabajoViewSet
)

router = DefaultRouter()
router.register(r'roles', RolViewSet)
router.register(r'personas', PersonaViewSet)
router.register(r'estudiantes', EstudianteViewSet)
router.register(r'estres', EstresViewSet, basename='estres')  # Se asegura un basename único
router.register(r'estres-estudiantes', EstresEstudianteViewSet, basename='estres-estudiantes')  # Nombre único
router.register(r'estres-estudiantes-carga-trabajo', EstresEstudianteCargaTrabajoViewSet, basename='estres-carga-trabajo')  # Nombre único

urlpatterns = [
    path('', include(router.urls)),
]
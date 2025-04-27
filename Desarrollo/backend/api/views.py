from rest_framework import viewsets  # type: ignore
from .models import Rol, Persona, Estudiante, Estres, carga_trabajo
from .serializers import (
    RolSerializer, PersonaSerializer, EstudianteSerializer, EstresSerializer,
    EstresEstudianteCargaTrabajoSerializer
)

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = []  # Eliminar restricciones de permisos

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = []  # Eliminar restricciones de permisos

class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
    permission_classes = []  # Eliminar restricciones de permisos

class EstresViewSet(viewsets.ModelViewSet):
    queryset = Estres.objects.all()
    serializer_class = EstresSerializer
    permission_classes = []  # Eliminar restricciones de permisos

# Vista para el primer endpoint: Estres y Estudiante
class EstresEstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estres.objects.select_related('estudiante_id').all()
    serializer_class = EstresSerializer
    permission_classes = []  # Eliminar restricciones de permisos

# Vista para el segundo endpoint: Estres, Estudiante y carga_trabajo
class EstresEstudianteCargaTrabajoViewSet(viewsets.ModelViewSet):
    queryset = Estres.objects.prefetch_related('estudiante_id__carga_trabajo_set').all()
    serializer_class = EstresEstudianteCargaTrabajoSerializer
    permission_classes = []  # Eliminar restricciones de permisos
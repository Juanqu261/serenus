from rest_framework import viewsets, permissions  # type: ignore
from .models import Rol, Persona, Estudiante, Estres, carga_trabajo
from .serializers import (
    RolSerializer, PersonaSerializer, EstudianteSerializer, EstresSerializer,
    EstresEstudianteCargaTrabajoSerializer
)

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [permissions.IsAdminUser]  # Solo admins pueden modificar roles

class PersonaViewSet(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer

class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer


class EstresViewSet(viewsets.ModelViewSet):
    queryset = Estres.objects.all()
    serializer_class = EstresSerializer

# Vista para el primer endpoint: Estres y Estudiante
class EstresEstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estres.objects.select_related('estudiante_id').all()
    serializer_class = EstresSerializer
    permission_classes = [permissions.AllowAny]

# Vista para el segundo endpoint: Estres, Estudiante y carga_trabajo
class EstresEstudianteCargaTrabajoViewSet(viewsets.ModelViewSet):
    queryset = Estres.objects.prefetch_related('estudiante_id__carga_trabajo_set').all()
    serializer_class = EstresEstudianteCargaTrabajoSerializer
    permission_classes = [permissions.AllowAny]
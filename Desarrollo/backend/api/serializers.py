from rest_framework import serializers  # type: ignore
from .models import (
    Rol, Persona, Estudiante, carga_trabajo, Estres, Asignatura, Evaluacion, Asistencia, Recomendaciones
)

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['usuario', 'rol']
        extra_kwargs = {'contraseña': {'write_only': True}}

class EstresSerializer(serializers.ModelSerializer):
    recomendaciones = serializers.StringRelatedField()  # Para mostrar la descripción de las recomendaciones

    class Meta:
        model = Estres
        fields = '__all__'

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = '__all__'

class carga_trabajoSerializer(serializers.ModelSerializer):  # Renombrado desde MateriaEstudianteSerializer
    class Meta:
        model = carga_trabajo
        fields = '__all__'

# Serializador para el segundo endpoint: Estres, Estudiante y carga_trabajo
class EstresEstudianteCargaTrabajoSerializer(serializers.ModelSerializer):
    estudiante = EstudianteSerializer(source='estudiante_id')
    carga_trabajo = carga_trabajoSerializer(source='estudiante_id.carga_trabajo_set', many=True)

    class Meta:
        model = Estres
        fields = ['estudiante', 'nivel_de_estres', 'escala_de_accion', 'recomendaciones', 'carga_trabajo']
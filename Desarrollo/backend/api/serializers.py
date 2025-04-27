from rest_framework import serializers # type: ignore
from .models import (
    Rol, Persona, Estudiante, carga_trabajo, Estres, Recomendaciones
)

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = '__all__'

class EstresSerializer(serializers.ModelSerializer):
    estudiante = EstudianteSerializer(source='estudiante_id')  # Relación con Estudiante
    recomendaciones = serializers.StringRelatedField()  # Mostrar descripción de recomendaciones

    class Meta:
        model = Estres
        fields = '__all__'

class carga_trabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = carga_trabajo
        fields = '__all__'

class RecomendacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recomendaciones
        fields = ['descripcion']

# Serializador para el primer endpoint: Estres y Estudiante
class EstresEstudianteSerializer(serializers.ModelSerializer):
    estudiante = EstudianteSerializer(source='estudiante_id')
    recomendaciones = RecomendacionesSerializer(source='recomendaciones_id')  # Agregamos el serializador de recomendaciones

    class Meta:
        model = Estres
        fields = ['estudiante', 'nivel_de_estres', 'escala_de_accion', 'recomendaciones']

# Serializador para el segundo endpoint: Estres, Estudiante y carga_trabajo
class EstresEstudianteCargaTrabajoSerializer(serializers.ModelSerializer):
    estudiante = EstudianteSerializer(source='estudiante_id')  # Relación con Estudiante
    carga_trabajo = carga_trabajoSerializer(source='estudiante_id.carga_trabajo_set', many=True)  # Relación con carga_trabajo

    class Meta:
        model = Estres
        fields = ['estudiante', 'nivel_de_estres', 'escala_de_accion', 'recomendaciones', 'carga_trabajo']
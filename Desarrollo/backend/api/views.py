from rest_framework import viewsets  # type: ignore
from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from .models import Estres
from .serializers import (
    EstresEstudianteSerializer,
    EstresEstudianteCargaTrabajoSerializer
)
from .psych_ai import psychology_ai  # Importando nuestra IA de psicología


# Vista para el primer endpoint: Estres y Estudiante
class EstresEstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estres.objects.select_related('estudiante_id').all()  # Optimiza la consulta con select_related
    serializer_class = EstresEstudianteSerializer
    permission_classes = []  # Sin restricciones de permisos

# Vista para el segundo endpoint: Estres, Estudiante y carga_trabajo
class EstresEstudianteCargaTrabajoViewSet(viewsets.ModelViewSet):
    queryset = Estres.objects.prefetch_related('estudiante_id__carga_trabajo_set').all()  # Optimiza con prefetch_related
    serializer_class = EstresEstudianteCargaTrabajoSerializer
    permission_classes = []  # Eliminar restricciones de permisos

@api_view(['POST'])
def ia_view(request):
    """
    Vista para el endpoint de IA experta en psicología.
    Recibe un mensaje del usuario y devuelve la respuesta de la IA.
    
    Parámetros esperados en el request:
    - message: El mensaje del usuario
    - reset_memory (opcional): Si es True, reinicia la memoria de la conversación
    
    Retorna:
    - response: La respuesta de la IA
    """
    data = request.data
    message = data.get('message')
    reset_memory = data.get('reset_memory', False)
    
    if reset_memory:
        psychology_ai.reset_memory()
        return Response({"message": "Memoria de conversación reiniciada"})
    
    if not message:
        return Response(
            {"error": "Se requiere un mensaje para la IA"}, 
            status=400
        )
    
    try:
        response = psychology_ai.process_message(message)
        print(f"Mensaje procesado: {response}")
        return Response({"response": response})
    except Exception as e:
        return Response(
            {"error": f"Error al procesar el mensaje: {str(e)}"}, 
            status=500
        )
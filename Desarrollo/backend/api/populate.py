import os
import sys
import django

# Agregar el directorio raiz del proyecto al PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Rol, Persona, Estudiante, Estres, carga_trabajo, Recomendaciones
from django.db import transaction

@transaction.atomic
def populate_database():
    # Crear estudiantes
    estudiante1 = Estudiante.objects.create(
        cedula=123456,
        nombres="Juan",
        apellidos="Pérez",
        fecha_de_nacimiento="2000-01-01",
        promedio_actual=4.5,
        promedio_acumulado=4.2,
        avance=80.0,
        horas_de_dedicacion=20
    )
    estudiante2 = Estudiante.objects.create(
        cedula=654321,
        nombres="María",
        apellidos="Gómez",
        fecha_de_nacimiento="1999-05-15",
        promedio_actual=3.8,
        promedio_acumulado=3.9,
        avance=60.0,
        horas_de_dedicacion=15
    )

    # Crear más estudiantes para casos de prueba
    estudiante3 = Estudiante.objects.create(
        cedula=789012,
        nombres="Carlos",
        apellidos="Rodríguez",
        fecha_de_nacimiento="2001-03-12",
        promedio_actual=4.8,
        promedio_acumulado=4.7,
        avance=90.0,
        horas_de_dedicacion=10  # Pocas horas pero alto rendimiento
    )
    
    estudiante4 = Estudiante.objects.create(
        cedula=345678,
        nombres="Ana",
        apellidos="Martínez",
        fecha_de_nacimiento="2000-07-23",
        promedio_actual=3.2,
        promedio_acumulado=3.5,
        avance=45.0,
        horas_de_dedicacion=30  # Muchas horas pero rendimiento moderado
    )
    
    estudiante5 = Estudiante.objects.create(
        cedula=901234,
        nombres="Pablo",
        apellidos="Sánchez",
        fecha_de_nacimiento="1998-11-05",
        promedio_actual=2.9,
        promedio_acumulado=3.1,
        avance=75.0,
        horas_de_dedicacion=12  # Rezagado académicamente
    )
    
    estudiante6 = Estudiante.objects.create(
        cedula=567890,
        nombres="Laura",
        apellidos="Torres",
        fecha_de_nacimiento="2002-09-30",
        promedio_actual=4.1,
        promedio_acumulado=3.7,
        avance=25.0,
        horas_de_dedicacion=40  # Estudiante de primeros semestres con alta dedicación
    )
    
    estudiante7 = Estudiante.objects.create(
        cedula=234567,
        nombres="Miguel",
        apellidos="López",
        fecha_de_nacimiento="1999-04-18",
        promedio_actual=3.6,
        promedio_acumulado=3.6,
        avance=95.0,
        horas_de_dedicacion=18  # Estudiante a punto de graduarse
    )

    # Crear recomendaciones basadas en niveles de estrés
    recomendacion_nivel_bajo = Recomendaciones.objects.create(
        descripcion="Mantén tus buenos hábitos. Continúa usando herramientas como Google Calendar para organizar tus tareas y practica técnicas breves de respiración entre clases."
    )
    
    recomendacion_nivel_medio = Recomendaciones.objects.create(
        descripcion="Practica técnicas de regulación emocional como la auto-observación y realiza una rutina diaria de relajación. Recuerda que no siempre se puede hacer todo perfecto."
    )
    
    recomendacion_nivel_alto = Recomendaciones.objects.create(
        descripcion="Te recomendamos hablar con un psicólogo o tutor. Aprende técnicas de afrontamiento activas y busca un espacio donde puedas expresar tus preocupaciones sin miedo a ser juzgado."
    )
    
    recomendacion_nivel_muy_alto = Recomendaciones.objects.create(
        descripcion="Necesitas apoyo emocional inmediato. Por favor, contacta con un profesional de salud mental lo antes posible. No te enfrentes a esto solo."
    )
    
    recomendacion_proactiva = Recomendaciones.objects.create(
        descripcion="Establece límites claros entre tus horas de estudio y descanso. Considera incluir actividad física regular para liberar tensión."
    )

    # Crear niveles de estres
    Estres.objects.create(
        estudiante_id=estudiante1,
        nivel_de_estres=7.5,
        escala_de_accion=8.0,
        recomendaciones_id=recomendacion_nivel_alto
    )
    Estres.objects.create(
        estudiante_id=estudiante2,
        nivel_de_estres=5.0,
        escala_de_accion=6.0,
        recomendaciones_id=recomendacion_nivel_medio
    )
    Estres.objects.create(
        estudiante_id=estudiante3,
        nivel_de_estres=2.0,  # Nivel bajo
        escala_de_accion=1.0,
        recomendaciones_id=recomendacion_nivel_bajo
    )
    
    Estres.objects.create(
        estudiante_id=estudiante4,
        nivel_de_estres=5.5,  # Nivel medio
        escala_de_accion=2.0,
        recomendaciones_id=recomendacion_nivel_medio
    )
    
    Estres.objects.create(
        estudiante_id=estudiante5,
        nivel_de_estres=7.8,  # Nivel alto
        escala_de_accion=3.0,
        recomendaciones_id=recomendacion_nivel_alto
    )
    
    Estres.objects.create(
        estudiante_id=estudiante6,
        nivel_de_estres=9.5,  # Nivel muy alto
        escala_de_accion=4.0,
        recomendaciones_id=recomendacion_nivel_muy_alto
    )
    
    Estres.objects.create(
        estudiante_id=estudiante7,
        nivel_de_estres=6.2,  # Nivel medio-alto
        escala_de_accion=2.5,
        recomendaciones_id=recomendacion_proactiva
    )

    # Crear carga de trabajo
    carga_trabajo.objects.create(
        estudiante_id=estudiante1,
        semestre="2023-1",
        creditos=20,
        numero_asignaturas=5,
        horas_dedicadas=25
    )
    carga_trabajo.objects.create(
        estudiante_id=estudiante2,
        semestre="2023-1",
        creditos=16,
        numero_asignaturas=4,
        horas_dedicadas=18
    )
    carga_trabajo.objects.create(
        estudiante_id=estudiante3,
        semestre="2023-1",
        creditos=16,
        numero_asignaturas=4,
        horas_dedicadas=10
    )
    
    carga_trabajo.objects.create(
        estudiante_id=estudiante4,
        semestre="2023-1",
        creditos=22,
        numero_asignaturas=6,
        horas_dedicadas=30
    )
    
    carga_trabajo.objects.create(
        estudiante_id=estudiante5,
        semestre="2023-1",
        creditos=12,
        numero_asignaturas=3,
        horas_dedicadas=12
    )
    
    carga_trabajo.objects.create(
        estudiante_id=estudiante6,
        semestre="2023-1",
        creditos=24,
        numero_asignaturas=7,
        horas_dedicadas=40
    )
    
    carga_trabajo.objects.create(
        estudiante_id=estudiante7,
        semestre="2023-1",
        creditos=10,
        numero_asignaturas=3,
        horas_dedicadas=18
    )

    print("Base de datos poblada con datos de prueba.")

if __name__ == "__main__":
    populate_database()

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
    # Crear roles
    rol_admin = Rol.objects.create(nombre="Admin")
    rol_estudiante = Rol.objects.create(nombre="Estudiante")

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

    # Crear recomendaciones
    recomendacion1 = Recomendaciones.objects.create(
        descripcion="Practica ejercicios de respiración para reducir el estrés."
    )
    recomendacion2 = Recomendaciones.objects.create(
        descripcion="Organiza tu tiempo para mejorar tu rendimiento académico."
    )

    # Crear niveles de estres
    Estres.objects.create(
        estudiante_id=estudiante1,
        nivel_de_estres=7.5,
        escala_de_accion=8.0,
        recomendaciones_id=recomendacion1
    )
    Estres.objects.create(
        estudiante_id=estudiante2,
        nivel_de_estres=5.0,
        escala_de_accion=6.0,
        recomendaciones_id=recomendacion2
    )

    # Crear carga de trabajo
    carga_trabajo.objects.create(
        estudiante_id=estudiante1,
        semestre="2023-1",
        creditos=20,
        asistencia=90.0,
        numero_asignaturas=5,
        horas_dedicadas=25
    )
    carga_trabajo.objects.create(
        estudiante_id=estudiante2,
        semestre="2023-1",
        creditos=15,
        asistencia=85.0,
        numero_asignaturas=4,
        horas_dedicadas=18
    )

    print("Base de datos poblada con datos de prueba.")

if __name__ == "__main__":
    populate_database()

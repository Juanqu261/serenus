from django.contrib import admin
from .models import Rol, Persona, Estudiante, Estres

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('nombre',)  # Cambiado 'id' por 'nombre', que es la clave primaria

@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'rol_id')  # Cambiado 'rol' por 'rol_id', que es el campo en el modelo
    search_fields = ('usuario',)

@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ('cedula', 'nombres', 'apellidos', 'promedio_actual')
    search_fields = ('nombres', 'apellidos', 'cedula')

@admin.register(Estres)
class EstresAdmin(admin.ModelAdmin):
    list_display = ('estudiante_id', 'nivel_de_estres', 'escala_de_accion')  # Cambiado 'estudiante' por 'estudiante_id'
    search_fields = ('estudiante_id__nombres', 'estudiante_id__apellidos')
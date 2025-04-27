from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class Rol(models.Model):
    nombre = models.CharField(max_length=100, primary_key=True)  # Se usa como clave primaria
    
    class Meta:
        db_table = 'rol'
    
    def __str__(self):
        return self.nombre

class PersonaManager(BaseUserManager):
    def create_user(self, usuario, contraseña=None, rol=None):
        if not usuario:
            raise ValueError('El usuario debe tener un email')
        
        persona = self.model(
            usuario=self.normalize_email(usuario),
            rol_id=rol  # Ajuste para usar el nuevo campo con _id
        )
        
        persona.set_password(contraseña)
        persona.save(using=self._db)
        return persona

class Persona(AbstractBaseUser):
    usuario = models.EmailField(max_length=100, unique=True)
    contraseña = models.CharField(max_length=100)
    rol_id = models.ForeignKey(Rol, on_delete=models.CASCADE, db_column='rol_id')  # Se agrega _id
    
    objects = PersonaManager()
    
    USERNAME_FIELD = 'usuario'
    REQUIRED_FIELDS = ['rol_id']
    
    class Meta:
        db_table = 'persona'
    
    def __str__(self):
        return self.usuario

class Estudiante(models.Model):
    cedula = models.IntegerField(primary_key=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    fecha_de_nacimiento = models.DateField()
    promedio_actual = models.FloatField()
    promedio_acumulado = models.FloatField()
    avance = models.FloatField()
    horas_de_dedicacion = models.IntegerField()
    
    class Meta:
        db_table = 'estudiante'
    
    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

class carga_trabajo(models.Model):  # Renombrado desde MateriaEstudiante
    estudiante_id = models.ForeignKey(Estudiante, on_delete=models.CASCADE, db_column='estudiante_id')
    semestre = models.CharField(max_length=100)
    creditos = models.IntegerField()
    asistencia = models.FloatField()
    numero_asignaturas = models.IntegerField()
    horas_dedicadas = models.IntegerField()

    class Meta:
        db_table = 'carga_trabajo'  # Cambiado el nombre de la tabla
        unique_together = (('estudiante_id', 'semestre'),)

    def __str__(self):
        return f"{self.estudiante_id} - {self.semestre}"

class Recomendaciones(models.Model):
    descripcion = models.TextField(max_length=1000)

    class Meta:
        db_table = 'recomendaciones'

    def __str__(self):
        return self.descripcion[:50]  # Retorna los primeros 50 caracteres

class Estres(models.Model):
    estudiante_id = models.OneToOneField(Estudiante, on_delete=models.CASCADE, primary_key=True, db_column='estudiante_id')  # Se agrega _id
    nivel_de_estres = models.FloatField()
    escala_de_accion = models.FloatField()
    recomendaciones_id = models.ForeignKey(Recomendaciones, on_delete=models.CASCADE, db_column='recomendaciones_id')  # Se agrega _id

    class Meta:
        db_table = 'estres'

    def __str__(self):
        return f"Estres de {self.estudiante_id}"

class Asignatura(models.Model):
    nombre = models.CharField(max_length=100, primary_key=True)  # Se usa como clave primaria
    tasa_desercion = models.FloatField()
    tasa_aprobacion = models.FloatField()
    horario = models.CharField(max_length=100)

    class Meta:
        db_table = 'asignatura'

    def __str__(self):
        return self.nombre
    
class Asistencia(models.Model):
    estudiante_id = models.ForeignKey(Estudiante, on_delete=models.CASCADE, db_column='estudiante_id')  # Se agrega _id
    asignatura_id = models.ForeignKey(Asignatura, on_delete=models.CASCADE, db_column='asignatura_id')  # Se agrega _id
    porcentaje_asistencia = models.FloatField()
    interacciones_plataforma = models.IntegerField()
    nota = models.FloatField()  # Campo fusionado de RendimientoAcademico
    repetida = models.BooleanField(default=False)  # Campo fusionado de RendimientoAcademico

    class Meta:
        db_table = 'asistencia'
        unique_together = (('estudiante_id', 'asignatura_id'),)

    def __str__(self):
        return f"Asistencia de {self.estudiante_id} en {self.asignatura_id}"

class Evaluacion(models.Model):
    asignatura_id = models.ForeignKey(Asignatura, on_delete=models.CASCADE, db_column='asignatura_id')  # Se agrega _id
    tipo = models.CharField(max_length=50)  # Ejemplo: "Examen", "Proyecto"
    peso = models.FloatField()
    fecha = models.DateField()

    class Meta:
        db_table = 'evaluacion'

    def __str__(self):
        return f"{self.tipo} - {self.asignatura_id}"
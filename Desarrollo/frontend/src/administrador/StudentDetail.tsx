import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Interfaz para los datos del estudiante que coincide con la API actualizada
interface Estudiante {
  cedula: number;
  nombres: string;
  apellidos: string;
  fecha_de_nacimiento: string;
  promedio_actual: number;
  promedio_acumulado: number;
  avance: number;
  horas_de_dedicacion: number;
}

interface CargaTrabajo {
  id: number;
  semestre: string;
  creditos: number;
  numero_asignaturas: number;
  horas_dedicadas: number;
  estudiante_id: number;
}

interface EstudianteConEstres {
  estudiante: Estudiante;
  nivel_de_estres: number;
  escala_de_accion: number;
  recomendaciones: {
    descripcion: string;
  };
  carga_trabajo: CargaTrabajo[];
}

// Componente para la recta numérica
interface NumberLineProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
}

const NumberLine: React.FC<NumberLineProps> = ({ value, min, max, label, unit = '', color = 'blue' }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}{unit}</span>
      </div>
      <div className="relative h-4 bg-gray-200 rounded-full">
        {/* Marcas de la escala */}
        {[...Array(5)].map((_, index) => {
          const markPosition = (index + 1) * 20;
          return (
            <div 
              key={index}
              className="absolute w-1 h-2 bg-gray-400 transform -translate-x-1/2"
              style={{ left: `${markPosition}%`, bottom: '-8px' }}
            ></div>
          );
        })}
        
        {/* Línea de valor */}
        <div 
          className={`absolute h-full rounded-full bg-${color}-500 flex items-center justify-end pr-1`}
          style={{ width: `${percentage}%`, minWidth: '1.5rem' }}
        >
        </div>
        
        {/* Valores min-max */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
};

// Componente del termómetro
interface ThermometerProps {
  stressLevel: number; // 0-10
}

const Thermometer: React.FC<ThermometerProps> = ({ stressLevel }) => {
  const percentage = (stressLevel / 10) * 100;
  
  // Determinar el color basado en el nivel de estrés
  const getColor = () => {
    if (stressLevel <= 3) return 'bg-gradient-to-t from-green-500 to-green-300';
    if (stressLevel <= 6) return 'bg-gradient-to-t from-yellow-500 to-yellow-300';
    if (stressLevel <= 8) return 'bg-gradient-to-t from-orange-500 to-orange-300';
    return 'bg-gradient-to-t from-red-500 to-red-300';
  };
  
  // Determinar el texto basado en el nivel de estrés
  const getStressText = () => {
    if (stressLevel <= 3) return 'Bajo';
    if (stressLevel <= 6) return 'Medio';
    return 'Alto';
  };
  
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Nivel de Estrés</h3>
      
      <div className="relative h-64 w-16 mb-4">
        {/* Contenedor del termómetro */}
        <div className="absolute bottom-0 left-0 right-0 h-56 rounded-t-full bg-gray-200 border border-gray-300 overflow-hidden">
          {/* Líquido del termómetro */}
          <div 
            className={`absolute bottom-0 left-0 right-0 rounded-t-full transition-all duration-500 ${getColor()}`}
            style={{ height: `${percentage}%` }}
          ></div>
          
          {/* Líneas de medición */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-0.5 bg-gray-400 left-0"
              style={{ bottom: `${i * 10}%` }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <span className={`text-2xl font-bold ${
          stressLevel <= 3 ? 'text-green-600' : 
          stressLevel <= 6 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {stressLevel}/10
        </span>
        <p className="text-gray-600">{getStressText()}</p>
      </div>
    </div>
  );
};

// Componente para mostrar las recomendaciones
interface RecommendationProps {
  text: string;
}

const Recommendation: React.FC<RecommendationProps> = ({ text }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Recomendación
      </h3>
      <p className="text-blue-700">{text}</p>
    </div>
  );
};

// Componente para mostrar la carga de trabajo académico
interface WorkloadCardProps {
  cargaTrabajo: CargaTrabajo;
}

const WorkloadCard: React.FC<WorkloadCardProps> = ({ cargaTrabajo }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Semestre {cargaTrabajo.semestre}</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Créditos</span>
          <span className="text-xl font-bold text-blue-600">{cargaTrabajo.creditos}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Asignaturas</span>
          <span className="text-xl font-bold text-purple-600">{cargaTrabajo.numero_asignaturas}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Horas dedicadas</span>
          <span className="text-xl font-bold text-orange-600">{cargaTrabajo.horas_dedicadas} h</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">H/Crédito</span>
          <span className="text-xl font-bold text-emerald-600">
            {(cargaTrabajo.horas_dedicadas / cargaTrabajo.creditos).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

const StudentDetail: React.FC = () => {
  const { studentId } = useParams<{ studentId?: string }>();
  const navigate = useNavigate();
  const [estudianteData, setEstudianteData] = useState<EstudianteConEstres | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstudianteDetalle = async () => {
      if (!studentId) return;
      
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/estres-estudiantes-carga-trabajo/');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data: EstudianteConEstres[] = await response.json();
        const estudiante = data.find(item => item.estudiante.cedula === parseInt(studentId));
        
        if (estudiante) {
          setEstudianteData(estudiante);
          setError(null);
        } else {
          setError('Estudiante no encontrado');
        }
      } catch (err) {
        console.error('Error al cargar el detalle del estudiante:', err);
        setError('No se pudieron cargar los datos del estudiante. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstudianteDetalle();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !estudianteData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-red-600">{error || 'Estudiante no encontrado'}</h2>
        <button 
          onClick={() => navigate('/admin')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  const { estudiante, nivel_de_estres, recomendaciones, carga_trabajo } = estudianteData;
  const nombreCompleto = `${estudiante.nombres} ${estudiante.apellidos}`;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-800">
          Perfil de {nombreCompleto} <span className="text-lg font-normal text-gray-600">#{estudiante.cedula}</span>
        </h1>
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la lista
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Datos académicos */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Datos Académicos</h2>
            
            <NumberLine 
              label="Promedio actual"
              value={estudiante.promedio_actual}
              min={0}
              max={5}
              color="blue"
            />
            
            <NumberLine 
              label="Promedio acumulado"
              value={estudiante.promedio_acumulado}
              min={0}
              max={5}
              color="green"
            />
            
            <NumberLine 
              label="Tiempo de dedicación semanal"
              value={estudiante.horas_de_dedicacion}
              min={0}
              max={48} // Asumiendo un máximo de 48 horas semanales
              unit="h"
              color="yellow"
            />
            
            <NumberLine 
              label="Porcentaje de avance en el programa"
              value={estudiante.avance}
              min={0}
              max={100}
              unit="%"
              color="red"
            />
          </div>

          {/* Sección de Carga Académica */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Carga Académica</h2>
            
            {carga_trabajo && carga_trabajo.length > 0 ? (
              carga_trabajo.map(carga => (
                <WorkloadCard key={carga.id} cargaTrabajo={carga} />
              ))
            ) : (
              <p className="text-gray-500 italic">No hay información de carga académica disponible</p>
            )}
          </div>
        </div>
        
        {/* Columna derecha - Termómetro de estrés y recomendaciones */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            {/* Escala de acción */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Datos de Estrés</h2>
            
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-2">Escala de acción</h3>
              <div className="relative h-4 bg-gray-200 rounded-full mb-2">
                <div 
                  className="absolute h-full rounded-full bg-indigo-500"
                  style={{ width: `${(estudianteData.escala_de_accion / 10) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 - Baja</span>
                <span>5 - Media</span>
                <span>10 - Alta</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Nivel de urgencia: <span className="font-semibold">{estudianteData.escala_de_accion.toFixed(1)}/10</span>
              </p>
            </div>
            
            <div className="flex justify-center">
              <Thermometer stressLevel={nivel_de_estres} />
            </div>
          </div>
          
          {/* Recomendaciones */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Plan de Acción</h2>
            <Recommendation text={recomendaciones.descripcion} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
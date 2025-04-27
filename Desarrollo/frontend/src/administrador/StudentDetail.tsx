import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Interfaz para los datos del estudiante
interface StudentData {
  id: number;
  name: string;
  academicAverage: number; // 0-5
  attendancePercentage: number; // 0-100
  weeklyDedication: number; // en horas
  programProgress: number; // 0-100
  stressLevel: number; // 0-10
  credits: number; // para calcular el tiempo máximo de dedicación
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
          <div className={`h-6 w-6 absolute right-0 transform translate-x-1/2 -translate-y-1 bg-${color}-600 rounded-full border-2 border-white`}></div>
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
        
        {/* Bulbo del termómetro */}
        <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-full ${getColor()} border border-gray-300`}></div>
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

const StudentDetail: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos desde API
    setLoading(true);
    
    // Aquí normalmente harías una llamada a tu API
    setTimeout(() => {
      // Datos simulados del estudiante
      const mockStudentData: StudentData = {
        id: parseInt(studentId || '0'),
        name: 'Ana Martínez',
        academicAverage: 4.2, // de 5
        attendancePercentage: 85, // %
        weeklyDedication: 12, // horas
        programProgress: 68, // %
        stressLevel: 7, // de 10
        credits: 6 // cantidad de créditos
      };
      
      setStudent(mockStudentData);
      setLoading(false);
    }, 800);
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-red-600">Estudiante no encontrado</h2>
        <button 
          onClick={() => navigate('/admin')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-800">
          Perfil de {student.name} <span className="text-lg font-normal text-gray-600">#{student.id}</span>
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna izquierda - Datos académicos */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Datos Académicos</h2>
            
            <NumberLine 
              label="Promedio académico"
              value={student.academicAverage}
              min={0}
              max={5}
              color="blue"
            />
            
            <NumberLine 
              label="Porcentaje de asistencia"
              value={student.attendancePercentage}
              min={0}
              max={100}
              unit="%"
              color="green"
            />
            
            <NumberLine 
              label="Tiempo de dedicación semanal"
              value={student.weeklyDedication}
              min={0}
              max={student.credits * 3}
              unit="h"
              color="purple"
            />
            
            <NumberLine 
              label="Porcentaje de avance en el programa"
              value={student.programProgress}
              min={0}
              max={100}
              unit="%"
              color="indigo"
            />
          </div>
          
          {/* Columna derecha - Termómetro de estrés */}
          <div className="flex justify-center">
            <Thermometer stressLevel={student.stressLevel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
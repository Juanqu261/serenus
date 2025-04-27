import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Definir la interfaz para estudiantes que coincide con la API
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

interface EstudianteConEstres {
  estudiante: Estudiante;
  nivel_de_estres: number;
  escala_de_accion: number;
  recomendaciones: {
    descripcion: string;
  };
}

const StudentList: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<EstudianteConEstres[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar datos de estudiantes desde la API
  useEffect(() => {
    const fetchEstudiantes = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/estres-estudiantes/');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data: EstudianteConEstres[] = await response.json();
        setEstudiantes(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los estudiantes:', err);
        setError('No se pudieron cargar los datos de estudiantes. Por favor, intente más tarde.');
        // Usar datos de respaldo en caso de error
        setEstudiantes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

  // Función para navegar a la vista detallada
  const handleRowClick = (cedula: number) => {
    navigate(`/admin/student/${cedula}`);
  };

  // Función para ordenar por nivel de estrés
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Obtener nombre completo del estudiante
  const getNombreCompleto = (estudiante: Estudiante) => {
    return `${estudiante.nombres} ${estudiante.apellidos}`;
  };

  // Filtrar y ordenar estudiantes
  const filteredAndSortedStudents = estudiantes
    .filter(item => getNombreCompleto(item.estudiante).toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.nivel_de_estres - b.nivel_de_estres;
      } else {
        return b.nivel_de_estres - a.nivel_de_estres;
      }
    });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Panel de Administrador - Estudiantes</h1>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={toggleSortOrder}
                >
                  Nivel de Estrés
                  <span className="ml-1">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedStudents.length > 0 ? (
                filteredAndSortedStudents.map(item => (
                  <tr 
                    key={item.estudiante.cedula} 
                    onClick={() => handleRowClick(item.estudiante.cedula)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getNombreCompleto(item.estudiante)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className={`
                          mr-2 font-semibold
                          ${item.nivel_de_estres <= 3 ? 'text-green-600' : ''}
                          ${item.nivel_de_estres > 3 && item.nivel_de_estres <= 6 ? 'text-yellow-600' : ''}
                          ${item.nivel_de_estres > 6 ? 'text-red-600' : ''}
                        `}>
                          {item.nivel_de_estres.toFixed(1)}
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              item.nivel_de_estres <= 3 ? 'bg-green-500' : 
                              item.nivel_de_estres <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(item.nivel_de_estres / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron estudiantes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
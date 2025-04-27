import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Definir la interfaz para estudiantes
interface Student {
  id: number;
  name: string;
  stressLevel: number;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  // Datos de estudiantes de ejemplo (en una app real, se cargarían de una API)
  useEffect(() => {
    // Simular carga de datos
    const mockStudents: Student[] = [
      { id: 1, name: 'Ana Martínez', stressLevel: 7 },
      { id: 2, name: 'Carlos López', stressLevel: 4 },
      { id: 3, name: 'María Rodríguez', stressLevel: 8 },
      { id: 4, name: 'Juan Gómez', stressLevel: 3 },
      { id: 5, name: 'Sofía Hernández', stressLevel: 6 },
      { id: 6, name: 'Diego Pérez', stressLevel: 9 },
      { id: 7, name: 'Valentina Torres', stressLevel: 5 },
      { id: 8, name: 'Mateo Sánchez', stressLevel: 2 },
    ];
    setStudents(mockStudents);
  }, []);

  // Función para navegar a la vista detallada
  const handleRowClick = (studentId: number) => {
    // Use absolute path for navigation
    navigate(`/admin/student/${studentId}`);
  };

  // Función para ordenar por nivel de estrés
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Filtrar y ordenar estudiantes
  const filteredAndSortedStudents = students
    .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.stressLevel - b.stressLevel;
      } else {
        return b.stressLevel - a.stressLevel;
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
              filteredAndSortedStudents.map(student => (
                <tr 
                  key={student.id} 
                  onClick={() => handleRowClick(student.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span className={`
                        mr-2 font-semibold
                        ${student.stressLevel <= 3 ? 'text-green-600' : ''}
                        ${student.stressLevel > 3 && student.stressLevel <= 6 ? 'text-yellow-600' : ''}
                        ${student.stressLevel > 6 ? 'text-red-600' : ''}
                      `}>
                        {student.stressLevel}
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            student.stressLevel <= 3 ? 'bg-green-500' : 
                            student.stressLevel <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(student.stressLevel / 10) * 100}%` }}
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
    </div>
  );
};

export default StudentList;
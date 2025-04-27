import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentList from './StudentList';
import StudentDetail from './StudentDetail';

function Admin() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="student/:studentId" element={<StudentDetail />} />
        {/* Redirigir cualquier otra ruta */}
        {/* <Route path="*" element={<Navigate to="/admin" replace />} /> */}
      </Routes>
    </div>
  );
}

export default Admin;
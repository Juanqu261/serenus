import { Routes, Route, Navigate } from 'react-router-dom';
import Ruta from './estudiante/Ruta'; // Corrected import path
import Admin from './administrador/administrador';
import Login from './login/Login'; // Import the new Login component
import LessonView from './estudiante/LessonView'; // Import the LessonView component

function App() {
  // In a real app, you'd have state to track if the user is logged in and their role.
  // For this example, we'll just define the routes.

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/estudiante" element={<Ruta />} />
      <Route path="/estudiante/leccion/:lessonId" element={<LessonView />} />
      
      {/* Redirect root path to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> Optional: Add a catch-all route for unknown paths */}
    </Routes>
  );
}
export default App;

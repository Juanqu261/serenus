import { Routes, Route, Navigate } from 'react-router-dom';
import Chatbot from './chatbotui/Chatbot'; // Corrected import path
import Admin from './administrador/administrador';
import Login from './login/Login'; // Import the new Login component

function App() {
  // In a real app, you'd have state to track if the user is logged in and their role.
  // For this example, we'll just define the routes.

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/admin" element={<Admin />} />
      {/* Redirect root path to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Optional: Add a catch-all route for unknown paths */}
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
}
export default App;

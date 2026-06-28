import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Importación de componentes globales
import {Navbar} from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Vistas
import Home from './pages/Home';
import { Login } from './pages/Login';
import Register  from './pages/Register';
import  PostDetail  from './pages/PostDetail';
import Profile  from './pages/Profile';
import  CreatePost from './pages/CreatePost';


function App() {
  return (
    <AuthProvider>
      <Router>
        {/* El Navbar queda fuera de <Routes> para que esté visible en toda la app */}
        <Navbar /> 
        
        {/* Un contenedor principal para darle márgenes a todas las vistas */}
        <main className="main-container">
          <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route path="/" element={<Home />} /> {/* Feed principal [cite: 27, 28] */}
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} /> 
            <Route path="/post/:id" element={<PostDetail />} /> {/* Vista de detalle [cite: 40] */}

            {/* --- RUTAS PROTEGIDAS --- */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile /> {/* Solo visible si está logueado [cite: 50, 51] */}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-post" 
              element={
                <ProtectedRoute>
                  <CreatePost /> {/* Solo visible si está logueado [cite: 60, 61] */}
                </ProtectedRoute>
              } 
            />

            {/* --- RUTA DE RESPALDO (404) --- */}
            {/* Si el usuario ingresa una URL que no existe, lo mandamos a la Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
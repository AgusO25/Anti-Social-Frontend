import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      backgroundColor: '#343a40', 
      color: 'white',
      marginBottom: '20px'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          UnaHur Anti-Social
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        
        {auth?.user ? (
          <>
            <Link to="/create-post" style={{ color: '#28a745', textDecoration: 'none', fontWeight: 'bold' }}>+ Post</Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Mi Perfil ({auth.user.nickName})</Link>
            <button 
              onClick={handleLogout}
              style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Ingresar</Link>
            <Link to="/register" style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 10px', borderRadius: '4px', textDecoration: 'none' }}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};
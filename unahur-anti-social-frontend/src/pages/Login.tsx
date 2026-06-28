import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; // Importamos los estilos

export const Login = () => {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== '123456') {
      setError('Contraseña incorrecta.');
      return;
    }

    try {
      // Ajustado a la ruta estándar que suele usar JSON Server o el backend de la cátedra
      const response = await fetch('http://localhost:3000/users'); 
      
      if (!response.ok) {
        throw new Error('Error al conectar con la API');
      }

      interface User { id: number; nickName: string; }
      const users: User[] = await response.json();

      const userExists = users.find((user: User) => user.nickName === nickName);

      if (userExists) {
        auth?.login({ id: userExists.id, nickName: userExists.nickName }); // Ajustado a los parámetros de tu AuthContext
        navigate('/');
      } else {
        setError('El usuario no existe. Verifica tu nickName.');
      }

    } catch (err) {
      console.error(err);
      setError('Hubo un problema al intentar conectar con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Tu Nickname" 
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Contraseña (123456)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-btn">
            Entrar
          </button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [nickName, setNickName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación de campos requeridos (solo el nickName)
    if (!nickName.trim()) {
      setError('Por favor, ingresa un Nickname.');
      return;
    }

    setIsLoading(true);

    try {
      // Petición POST al backend
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickName }), 
      });

      if (!response.ok) {
        throw new Error('No se pudo crear el usuario. Es posible que el nickName ya esté en uso.');
      }

      setSuccess('¡Usuario creado con éxito! Redirigiendo al login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Hubo un problema al conectar con el servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nickname (Único)" 
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              required
            />
          </div>

          {error && <p className="message error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Registrarme'}
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
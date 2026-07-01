import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PostCard, { type Post } from '../components/PostCard';
import './Profile.css';

export default function Profile() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Si por alguna razón no hay usuario logueado, no intentamos hacer el fetch
    if (!auth?.user) return;

    // Guardamos el id del usuario en una constante para evitar que TypeScript
    // crea que `auth.user` puede ser nulo dentro de la función async.
    const userId = auth.user.id;

    const fetchUserPosts = async () => {
      try {
        // Consultamos a la API usando el userId con Axios
        const response = await axios.get(`http://localhost:3000/api/posts?userId=${userId}`);
        
        // Axios parsea el JSON automáticamente
        setPosts(response.data);
      } catch (err) {
        // Tipado estricto para capturar errores del backend
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Error al cargar tus publicaciones');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido al conectar con el servidor.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [auth?.user]);

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  // Verificación de seguridad (aunque ProtectedRoute ya debería atajar esto)
  if (!auth?.user) return null;

  return (
    <div className="profile-container">
      {/* Encabezado del Perfil */}
      <div className="profile-header">
        <div className="profile-info">
          <h2>@{auth.user.nickName}</h2>
          <p>Bienvenido a tu perfil</p>
        </div>
        
        {/* Botón para cerrar sesión */}
        <button onClick={handleLogout} className="profile-logout-btn">
          Cerrar Sesión
        </button>
      </div>

      {/* Feed del Usuario */}
      <div className="user-feed">
        <h3>Mis Publicaciones</h3>

        {loading && <p>Cargando tus posts...</p>}
        {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {posts.length === 0 ? (
              <p style={{ color: '#888' }}>Aún no has creado ninguna publicación.</p>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id || post.id} post={post} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
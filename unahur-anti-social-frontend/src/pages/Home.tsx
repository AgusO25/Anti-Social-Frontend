import { useState, useEffect } from 'react';
import PostCard, { type Post } from '../components/PostCard'; // Importamos componente e interfaz
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (!response.ok) {
          throw new Error('Error al cargar las publicaciones');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido al conectar con el servidor.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-container">
      <div className="welcome-banner">
        <h1>UnaHur Anti-Social Net</h1>
        <p>Añadir descripción piola.</p>
      </div>

      {loading && <p className="loading-text">Cargando el feed...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="feed">
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0a0a0' }}>Aún no hay publicaciones.</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} /> /* Renderizamos el componente modular */
            ))
          )}
        </div>
      )}
    </div>
  );
}
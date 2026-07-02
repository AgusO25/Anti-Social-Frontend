import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import type { Post } from '../interfaces/Post'; 
import PostService from '../services/postService';
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Obtenemos las publicaciones utilizando el Service.
        const data = await PostService.getPosts();

        // Guardamos las publicaciones en el estado.
        setPosts(data);
      } catch (err) {
        // El Service ya se encarga de Axios.
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar las publicaciones.');
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
              <PostCard key={post._id} post={post} /> /* Renderizamos el componente modular */
            ))
          )}
        </div>
      )}
    </div>
  );
}
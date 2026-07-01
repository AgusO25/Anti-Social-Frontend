import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import './PostDetail.css';

// Interfaces para tipar los datos recibidos de la API
interface PostData {
  id?: number | string;
  _id?: number | string;
  description: string;
  userId?: number | string;
  tags?: string[];
  // Agregamos la propiedad para las imágenes incrustadas que devuelve tu backend
  images?: { id?: string | number; _id?: string | number; url: string }[];
}

export default function PostDetail() {
  // Capturamos el :id de la URL
  const { id } = useParams(); 

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // 1. Buscamos la info principal del post usando Axios
        const postRes = await axios.get(`http://localhost:3000/api/posts/${id}`);
        // Axios procesa el JSON automáticamente y lo deja en .data
        setPost(postRes.data);

      } catch (err) {
        console.error(err);
        
        // 2. Tipado seguro de errores con Axios y TypeScript
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Publicación no encontrada');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error inesperado');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Cargando publicación...</p>;
  if (error) return <p style={{ textAlign: 'center', color: '#ff4d4d', marginTop: '40px' }}>{error}</p>;
  if (!post) return <p style={{ textAlign: 'center', marginTop: '40px' }}>No se encontró el post.</p>;

  // Obtenemos el ID correcto para MongoDB o SQL
  const validPostId = post._id || post.id;

  return (
    <div>
      <Link to="/" className="back-link">
        ← Volver al feed
      </Link>

      <div className="post-detail-container">
        {/* Descripción completa */}
        <p className="post-detail-description">{post.description}</p>

        {/* Imágenes renderizadas directamente desde el objeto post */}
        {post.images && post.images.length > 0 && (
          <div className="post-detail-images">
            {post.images.map((img, index) => (
              <img 
                // Añadida la key obligatoria de React para iteraciones
                key={img._id || img.id || index} 
                src={img.url} 
                alt="Adjunto del post" 
                className="post-detail-image" 
              />
            ))}
          </div>
        )}

        {/* Etiquetas */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-detail-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Componente modular de comentarios asegurando que le pasamos un ID válido */}
        {validPostId && (
          <CommentSection postId={validPostId as string | number} />
        )}
      </div>
    </div>
  );
}
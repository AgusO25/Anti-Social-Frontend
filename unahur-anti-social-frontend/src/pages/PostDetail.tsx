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
 tags?: (string | { _id?: string | number; id?: string | number; name: string })[];
  // 1. Cambiamos esto a un array de strings
  images?: string[];
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
            {/* 2. Ahora map recorre textos, así que lo pasamos directo al src */}
            {post.images.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt="Adjunto del post"
                className="post-detail-image"
              />
            ))}
          </div>
        )}

        {/* Etiquetas */}
       {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {/* Quitamos el :any porque ya tipamos la interfaz arriba */}
            {post.tags.map((tag, index) => {
              // TypeScript ahora sabe que si es un string, lo usa directo. 
              // Si no, sabe de forma segura que es un objeto con una propiedad 'name'.
              const tagName = typeof tag === 'string' ? tag : tag.name; 
              
              return (
                <span key={index} className="tag">#{tagName}</span>
              );
            })}
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
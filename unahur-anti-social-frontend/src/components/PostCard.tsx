import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface Post {
  id?: number | string; 
  _id?: number | string; 
  description: string;
  userId: number;
  tags?: string[];
  // Agregamos la propiedad 'images' por si tu backend incrusta un array de imágenes
  images?: { url: string }[]; 
  imageUrl?: string; 
  commentsCount?: number;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const postId = post._id || post.id;
  
  const [commentsCount, setCommentsCount] = useState<number>(post.commentsCount || 0);

  // Intentamos obtener la imagen del array incrustado 'images' o de 'imageUrl'
  const displayImageUrl = post.imageUrl || (post.images && post.images.length > 0 ? post.images[0].url : null);

  useEffect(() => {
    // Si el post ya trae la cantidad de comentarios desde el backend, evitamos hacer la petición
    if (post.commentsCount !== undefined) return;

    const fetchComments = async () => {
      try {
        // Usamos axios en lugar de fetch
        const res = await axios.get(`http://localhost:3000/api/posts/${postId}/comments`);
        // Axios guarda la respuesta en .data
        setCommentsCount(res.data.length);
      } catch (err) {
        // En un simple log no hace falta tipar el error de forma estricta
        console.error(`Error al cargar comentarios del post ${postId}:`, err);
      }
    };

    fetchComments();
  }, [postId, post.commentsCount]);

  return (
    <div className="post-card">
      <p className="post-description">{post.description}</p>
      
      {/* Mostramos la imagen usando displayImageUrl */}
      {displayImageUrl && (
        <img 
          src={displayImageUrl} 
          alt="Adjunto del post" 
          className="post-detail-image" 
        />
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-footer">
        <span className="comments-count">
          💬 {commentsCount} comentarios
        </span>
        
        <Link to={`/post/${postId}`} className="btn-read-more">
          Ver más
        </Link>
      </div>
    </div>
  );
}
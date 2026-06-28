import { Link } from 'react-router-dom';

// Definimos la interfaz del Post aquí para tipar las props
export interface Post {
  id: number;
  description: string;
  userId: number;
  tags?: string[];
  imageUrl?: string;
  commentsCount?: number;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="post-card">
      <p className="post-description">{post.description}</p>
      
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt="Imagen adjunta" 
          style={{ width: '100%', borderRadius: '8px', margin: '16px 0', maxHeight: '400px', objectFit: 'cover' }} 
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
          💬 {post.commentsCount || 0} comentarios //AÑADIR SVG PARA REEMPLAZAR EL EMOJI
        </span>
        
        <Link to={`/post/${post.id}`} className="btn-read-more">
          Ver más
        </Link>
      </div>
    </div>
  );
}
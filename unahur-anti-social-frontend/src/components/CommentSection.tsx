import { useState, useEffect, useContext, type FormEvent } from 'react';
import { AuthContext } from '../context/AuthContext';
import './CommentSection.css';

interface Comment {
  id: number;
  text: string; // Dependiendo de tu API, esto podría llamarse 'description' o 'content'
  postId: number;
  userId: number;
}

interface CommentSectionProps {
  postId: number | string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const auth = useContext(AuthContext);

  // Cargar lista de comentarios visibles
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`);
        if (!response.ok) throw new Error('Error al cargar los comentarios');
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Manejo del formulario controlado
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Verificación de campo obligatorio
    if (!newComment.trim()) return;

    if (!auth?.user) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }

    setSubmitting(true);

    try {
      // Envío mediante POST /comments
      // Envío mediante POST /api/posts/:id/comments
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Mandamos lo básico. Si el backend usa otro nombre para el texto, nos avisará.
          text: newComment, 
          user_nickName: auth.user.nickName
        }),
      });

      if (!response.ok) {
        // Capturamos el error exacto del backend
        const errorData = await response.json();
        console.error("Detalle exacto del 400 en Comentarios:", errorData);
        throw new Error(JSON.stringify(errorData));
      }
      const createdComment = await response.json();
      
      // Actualizamos el estado local para mostrar el comentario instantáneamente
      setComments([...comments, createdComment]);
      setNewComment(''); // Limpiamos el input

    } catch (err) {
      console.error("DEBUG DEL ERROR:", err);
      console.error(err);
      if (err instanceof Error) setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-container">
      <h3 className="comments-title">Comentarios ({comments.length})</h3>

      {loading ? (
        <p>Cargando comentarios...</p>
      ) : (
        <div className="comments-list">
          {comments.length === 0 ? (
            <p style={{ color: '#888' }}>No hay comentarios aún. ¡Sé el primero!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                {/* Si tu API trae datos del usuario, podrías mostrar el nombre aquí */}
                <p>{comment.text}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Formulario para agregar comentario */}
      {auth?.user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            className="comment-input"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          {error && <p style={{ color: '#ff4d4d', fontSize: '14px', margin: 0 }}>{error}</p>}
          <button type="submit" className="comment-submit-btn" disabled={submitting || !newComment.trim()}>
            {submitting ? 'Enviando...' : 'Comentar'}
          </button>
        </form>
      ) : (
        <p className="login-prompt">Debes iniciar sesión para dejar un comentario.</p>
      )}
    </div>
  );
}
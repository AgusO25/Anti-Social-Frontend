import axios from 'axios';
import { useState, useEffect, useContext, type FormEvent } from 'react';
import { AuthContext } from '../context/AuthContext';
import './CommentSection.css';

interface Comment {
  id: number;
  text: string;
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
        const response = await axios.get(`http://localhost:3000/api/posts/${postId}/comments`);
        setComments(response.data);
      } catch (err) {
        console.error('Error al cargar los comentarios:', err);
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
      // Envío mediante POST /api/posts/:id/comments usando Axios
      const response = await axios.post(`http://localhost:3000/api/posts/${postId}/comments`, {
        text: newComment, 
        user_nickName: auth.user.nickName
      });

      const createdComment = response.data;
      
      // Actualizamos el estado local para mostrar el comentario instantáneamente
      setComments([...comments, createdComment]);
      setNewComment(''); // Limpiamos el input

   } catch (err) {
      console.error("DEBUG DEL ERROR:", err);
      
      // 2. Usamos el comprobador nativo de Axios
      if (axios.isAxiosError(err)) {
        // Aquí adentro, TypeScript ya sabe de forma segura que es un error de Axios
        const backendMessage = err.response?.data?.message || err.response?.data?.errors;
        setError(backendMessage ? JSON.stringify(backendMessage) : 'Error al comunicarse con el servidor');
      } 
      // 3. Capturamos errores genéricos de JavaScript (ej. problemas de red)
      else if (err instanceof Error) {
        setError(err.message);
      } 
      // 4. Fallback por si ocurre algo rarísimo
      else {
        setError('Ocurrió un error inesperado');
      }
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
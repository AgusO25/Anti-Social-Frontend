import { useState, useEffect, useContext, type FormEvent } from 'react';
import { AuthContext } from '../context/AuthContext';
import CommentService from '../services/commentService';
import type { Comment } from '../interfaces/Comment';
import './CommentSection.css';

interface CommentSectionProps {
  postId: number | string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  // Obtenemos el usuario logueado desde el contexto.
  const auth = useContext(AuthContext);

  // Estado con la lista de comentarios.
  const [comments, setComments] = useState<Comment[]> ([]);

  // Estado del textarea.
  const [newComment, setNewComment] = useState('');

  // Estado de carga inicial.
  const [loading, setLoading] = useState(true);

  // Estado mientras se envia un comentario.
  const [submitting, setSubmitting] = useState(false);

  // Estado para mostrar errores.
  const [error, setError] = useState('');

  // Al cargar el componene, obtenemos todos los comentarios que le pertenecen a la publi.
  useEffect(() => {

    const fetchComments = async () => {
      try{
        const data = await CommentService.getComments(postId);

        setComments(data);
      } catch (err){
        console.error("Error al cargar comentarios:", err);
      } finally {
        setLoading(false)
      }
    };
    fetchComments();
  }, [postId]);

  // Manejo del envio del formulario para crear un nuevo comentario.
  const handleSubmit = async (e: FormEvent) => {
    
    e.preventDefault();

    setError('');

    // Se valida que exista el texto.
    if (!auth?.user){

      setError("Debes iniciar sesión para comentar.");

      return;
    }
    setSubmitting(true);

    try {
      // Se crea el comentario usando el SERVICE. EL componene no conoce Axios ni la URL del back.
      const createdComment = await CommentService.createComment(
        postId,
        newComment,
        auth.user.nickName,

      );
      // Agregamos el comentario recien creado al estado para que aparezca sin recargar.
      setComments((prevComments) => [
        ...prevComments,
        createdComment
      ]);
      // Limpiamos el textarea.
      setNewComment('');
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        
        setError(err.message);
      } else {
        setError("Error al enviar el comentario.");
      }

    } finally {

      setSubmitting(false);
    }
  };

  return (

    <div className="comments-container">

      <h3 className="comments-title">

        Comentarios ({comments.length})

      </h3>

      {

        loading ?

          (

            <p>Cargando comentarios...</p>

          )

          :

          (

            <div className="comments-list">

              {

                comments.length === 0 ?

                  (

                    <p style={{ color: "#888" }}>

                      No hay comentarios aún. ¡Sé el primero!

                    </p>

                  )

                  :

                  (

                    comments.map((comment) => (

                      <div
                        key={comment._id}
                        className="comment-item"
                      >

                        <p>{comment.text}</p>

                      </div>

                    ))

                  )

              }

            </div>

          )

      }

      {

        auth?.user ?

          (

            <form
              onSubmit={handleSubmit}
              className="comment-form"
            >

              <textarea

                className="comment-input"

                placeholder="Escribe un comentario..."

                value={newComment}

                onChange={(e) => setNewComment(e.target.value)}

                required

              />

              {

                error &&

                <p
                  style={{
                    color: "#ff4d4d",
                    fontSize: "14px",
                    margin: 0
                  }}
                >

                  {error}

                </p>

              }

              <button

                type="submit"

                className="comment-submit-btn"

                disabled={
                  submitting ||
                  !newComment.trim()
                }

              >

                {

                  submitting ?

                    "Enviando..."

                    :

                    "Comentar"

                }

              </button>

            </form>

          )

          :

          (

            <p className="login-prompt">

              Debes iniciar sesión para dejar un comentario.

            </p>

          )

      }

    </div>

  );
}
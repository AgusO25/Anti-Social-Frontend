import { useParams } from 'react-router-dom';

export default function PostDetail() {
  // useParams captura el ":id" de la URL
  const { id } = useParams(); 

  return (
    <div>
      <h2>Detalle de la Publicación: {id}</h2>
      <p>Vista accesible desde /post/:id.</p>
      <p>Aquí mostraremos la descripción completa y la lista de comentarios.</p>
    </div>
  );
}
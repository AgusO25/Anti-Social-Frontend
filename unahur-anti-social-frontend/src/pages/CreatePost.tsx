import axios from 'axios';
import { useState, useEffect, useContext, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CreatePost.css';

interface Tag {
  _id: number;
  name: string;
}

export default function CreatePost() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Cargar etiquetas usando Axios
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tags');
        setAvailableTags(response.data);
      } catch (err) {
        console.error('Error al cargar etiquetas:', err);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  // Manejo etiquetas
  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  // 2. Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !auth?.user) return;

    setSubmitting(true);
    setError(''); // Limpiamos errores previos al reintentar

    try {
      // 1. Crear el post (SIN etiquetas ni imágenes, solo lo básico)
      const postResponse = await axios.post('http://localhost:3000/api/posts', {
        description,
        user_nickName: auth.user.nickName
      });

      const createdPost = postResponse.data;
      const postId = createdPost._id || createdPost.id;

      // 2. Si hay etiquetas, las asignamos una por una al post creado
      if (selectedTags.length > 0) {
        for (const tagName of selectedTags) {
          await axios.post(`http://localhost:3000/api/posts/${postId}/tags`, {
            name: tagName // Ajusta esto si tu backend pide { name: ... }
          });
        }
      }

      // 3. Si hay imagen, la subimos (FormData para Multer)
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        await axios.post(`http://localhost:3000/api/posts/${postId}/images`, formData);
      }

      navigate('/profile');
    } catch (err) {
      console.error("DEBUG DEL ERROR:", err);

      // Tipado estricto para capturar el error exacto del backend
      if (axios.isAxiosError(err)) {
        const backendMessage = err.response?.data?.message || err.response?.data?.errors;
        setError(backendMessage ? JSON.stringify(backendMessage) : 'Error al procesar la solicitud');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="create-post-title">Nueva Publicación</h2>
      <form onSubmit={handleSubmit} className="create-post-form">

        <div className="form-group">
          <label htmlFor="description">¿Qué estás pensando? *</label>
          <textarea id="description" className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Imagen (Opcional)</label>
          <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} accept="image/*" className="form-input" />
        </div>

        <div className="form-group">
          <label>Etiquetas</label>
          {loadingTags ? <p>Cargando...</p> : (
            <div className="tags-container">
              {availableTags.map(tag => (
                <label key={tag._id || tag.name} className="tag-checkbox-label">
                  <input type="checkbox" checked={selectedTags.includes(tag.name)} onChange={() => toggleTag(tag.name)} />
                  #{tag.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {error && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</p>}
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Publicando...' : 'Crear Publicación'}
        </button>
      </form>
    </div>
  );
}
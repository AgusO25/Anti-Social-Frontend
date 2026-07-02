import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import PostCard from '../components/PostCard';

import type { Post } from '../interfaces/Post';

import PostService from '../services/postService';

import './Profile.css';

export default function Profile() {

  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {

    if (!auth?.user) return;

    const fetchUserPosts = async () => {

      try {

        // Obtenemos todas las publicaciones.
        const data = await PostService.getPosts();

        // Filtramos únicamente las del usuario logueado.
        const userPosts = data.filter(
          (post) => post.user_nickName === auth.user?.nickName
        );

        setPosts(userPosts);

      } catch (err) {

        if (err instanceof Error) {

          setError(err.message);

        } else {

          setError('Error al cargar tus publicaciones.');

        }

      } finally {

        setLoading(false);

      }

    };

    fetchUserPosts();

  }, [auth?.user]);

  const handleLogout = () => {

    auth?.logout();

    navigate('/login');

  };

  if (!auth?.user) return null;

  return (

    <div className="profile-container">

      <div className="profile-header">

        <div className="profile-info">

          <h2>@{auth.user.nickName}</h2>

          <p>Bienvenido a tu perfil</p>

        </div>

        <button
          onClick={handleLogout}
          className="profile-logout-btn"
        >

          Cerrar Sesión

        </button>

      </div>

      <div className="user-feed">

        <h3>Mis Publicaciones</h3>

        {loading && <p>Cargando tus posts...</p>}

        {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}

        {!loading && !error && (

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >

            {posts.length === 0 ? (

              <p style={{ color: '#888' }}>

                Aún no has creado ninguna publicación.

              </p>

            ) : (

              posts.map((post) => (

                <PostCard
                  key={post._id || post.id}
                  post={post}
                />

              ))

            )}

          </div>

        )}

      </div>

    </div>

  );

}
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetch } from '../../hooks/useFetch';
import { Post } from '../../model/types';
import style from './CreatePost.module.css';

export default function CreatePost() {
  const { state } = useAuthContext();
  const [title, setTitle] = useState<string>('');
  const [postUserId, setPostUserId] = useState<number>();
  const [content, setContent] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();
  const queryString = useLocation();
  const locationPath = queryString.pathname.split('/')[2];

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    setIsPending(true);
    const fetchData = async function () {
      try {
        const res = await fetch('http://localhost:5000/posts/' + id);

        if (!res.ok) {
          throw Error(res.statusText);
        }
        const data: Post = await res.json();

        setTitle(data.title);
        setContent(data.body);
        setPostUserId(data.userId);
        setError(null);
        setIsPending(false);
      } catch (err: any) {
        console.error(err.message);
        setError(err.message);
        setIsPending(false);
      }
    };

    if (locationPath === 'edit') {
      fetchData();
    } else {
      setTitle('');
      setContent('');
      setIsPending(false);
    }
  }, [locationPath, id]);

  const { postData, data } = useFetch<Post>(
    'http://localhost:5000/posts',
    'POST'
  );
  const handleSubmit = function (e: React.SyntheticEvent) {
    e.preventDefault();
    postData({
      userId: state.user?.id,
      title: title,
      body: content,
    });
  };

  useEffect(() => {
    if (data) {
      navigate('/posts');
    }
  }, [navigate, data]);

  return (
    <div>
      {error && <p>{error.message}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {!isPending &&
        (state.user?.id === postUserId || locationPath === 'createPost') && (
          <div className={style.create}>
            <h2 className={style['create-post-head']}> Add new post</h2>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Post title: </span>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </label>
              <label>
                <span>Post content: </span>
                <textarea
                  rows={10}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </label>
              <button className={`btn ${style.create__btn}`}>Submit</button>
            </form>
          </div>
        )}
      {!isPending &&
        state.user?.id !== postUserId &&
        locationPath !== 'createPost' && (
          <div>
            <h2 className={style['create-post-head']}>Access denied</h2>
          </div>
        )}
    </div>
  );
}
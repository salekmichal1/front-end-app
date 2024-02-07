import { Link, useLocation, useNavigate } from 'react-router-dom';
import AlbumsSearch from '../../components/AlbumsSearch';
import { useFetch } from '../../hooks/useFetch';
import { Album } from '../../model/types';
import style from './SearchAlbums.module.css';
import { ReactComponent as AlbumIcon } from './../../assets/photo_library.svg';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function SearchAlbums() {
  const { state } = useAuthContext();
  const queryString: string = useLocation().search;
  const queryParams: URLSearchParams = new URLSearchParams(queryString);
  const query: string | null = queryParams.get('q');

  const url = 'https://front-end-app-server.onrender.com/albums/?q=' + query;
  const { data, isPending, error } = useFetch<Album[]>(url);

  const navigate = useNavigate();
  return (
    <div>
      <h2 className={style['albums-head']}>Albums</h2>
      <div className={style.albums__controls}>
        <AlbumsSearch />
        <Link
          className={`btn ${style['create-album-btn']}`}
          to="/albums/createAlbum">
          Add album
        </Link>
      </div>
      {isPending && <p className="loading">Loading...</p>}
      {error && <p>{error.toString()}</p>}

      {data?.length === 0 && <p className="loading">Posts not found </p>}

      {data && (
        <div className={style.albums}>
          {data
            .filter(album => album.userId === state.user?.id)
            .map(album => (
              <div key={album.id} className={style['albums__item']}>
                <AlbumIcon className={style['albums__icon']} />
                <p>{album.title}</p>

                <button
                  className={`btn ${style.albums__btn}`}
                  onClick={() => navigate(`/albums/edit/${album.id}`)}>
                  Open album
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

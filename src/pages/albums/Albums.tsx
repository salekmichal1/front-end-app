import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlbumsSearch from '../../components/AlbumsSearch';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetch } from '../../hooks/useFetch';
import { Album, Photo } from '../../model/types';
import style from './Albums.module.css';
import { ReactComponent as AlbumIcon } from './../../assets/photo_library.svg';

export default function Albums() {
  const { state } = useAuthContext();
  const [albumIdForDelete, setAlbumIdForDelete] = useState<number>();
  const navigate = useNavigate();
  const {
    getData: getAlbumData,
    data: albumData,
    isPending,
    error,
  } = useFetch<Album[]>(
    'http://localhost:7000/albums?userId=' + state.user?.id
  );

  const { getData: getPhotosData, data: photosData } = useFetch<Photo[]>(
    `http://localhost:8000/photos?albumId=${albumIdForDelete}`
  );

  const { deleteData: deleteAlbum, data: albumDeleteData } = useFetch<Album>(
    `http://localhost:7000/albums/${albumIdForDelete}`,
    'DELETE'
  );

  const handleDelete = function (albumId: number) {
    setAlbumIdForDelete(albumId);
    getPhotosData();
    deleteAlbum();
  };

  useEffect(() => {
    if (photosData && photosData.length > 0) {
      const deletePhotos = async function () {
        try {
          for (let i = 0; i < photosData.length; i++) {
            const resPhotos = await fetch(
              `http://localhost:8000/photos/${photosData[i].id}`,
              {
                method: 'DELETE',
              }
            );
            if (!resPhotos.ok) {
              throw Error(resPhotos.statusText);
            }
            const dataPhotos: string = await resPhotos.json();
            console.log(dataPhotos);
          }
        } catch (err: any) {
          console.error(err.message);
        }
      };

      deletePhotos();
    }
    getAlbumData();
  }, [albumDeleteData, photosData]);

  return (
    <div>
      <h2 className={style['albums-head']}>Albums</h2>
      <div className={style.albums__controls}>
        <AlbumsSearch />
        <Link className={`btn ${style['create-album-btn']}`} to="createAlbum">
          Add album
        </Link>
      </div>
      {isPending && <p className="loading">Loading...</p>}
      {error && <p>{error.toString()}</p>}
      {albumData && (
        <div className={style.albums}>
          {albumData.map(album => (
            <div key={album.id} className={style['albums__item']}>
              <AlbumIcon className={style['albums__icon']} />
              <p>{album.title}</p>

              <button
                className={`btn ${style.albums__btn}`}
                onClick={() => navigate(`/albums/edit/${album.id}`)}>
                Open album
              </button>
              <button
                className={`btn ${style.albums__btn}`}
                onClick={() => handleDelete(album.id)}>
                Delete album
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

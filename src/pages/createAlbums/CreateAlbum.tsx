import LightGallery from 'lightgallery/react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Album, Photo } from '../../model/types';

// styles
import style from './CreateAlbum.module.css';
import 'lightgallery/css/lightgallery.css';
import { useFetch } from '../../hooks/useFetch';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function CreateAlbum() {
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [albumUserId, setAlbumUserId] = useState<number>();
  const [photos, setPhotos] = useState<Photo[]>();
  const [newPhoto, setNewPhoto] = useState<string>('');
  const [addingNewPhotos, setAddingNewPhotos] = useState<string[]>([]);
  const [fetchingNewPhotos, setFetchingNewPhotos] = useState<string[]>([]);
  const [photoValidateWarn, setPhotoValidateWarn] = useState<boolean>(false);
  const [photoIdForDelete, setPhotoIdForDelete] = useState<number>();

  const addPhotoInput = useRef<HTMLInputElement>(null);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();
  const queryString = useLocation();
  const locationPath: string = queryString.pathname.split('/')[2];

  const params = useParams();
  const id: string | undefined = params.id;

  const { state } = useAuthContext();
  const { postData: postAlbumData, data: albumData } = useFetch<Album>(
    'http://localhost:7000/albums',
    'POST'
  );

  const { patchData: patchAlbumData } = useFetch<Album>(
    `http://localhost:7000/albums/${id}`,
    'PATCH'
  );

  const { deleteData: deletePhotos, data: photosDeleteData } = useFetch<Photo>(
    `http://localhost:8000/photos/${photoIdForDelete}`,
    'DELETE'
  );

  useEffect(() => {
    setIsPending(true);
    const fetchData = async function () {
      try {
        const resPhotos = await fetch(
          'http://localhost:8000/photos?albumId=' + id
        );
        const resAlbum = await fetch('http://localhost:7000/albums/' + id);
        if (!resPhotos.ok) {
          throw Error(resPhotos.statusText);
        }
        if (!resAlbum.ok) {
          throw Error(resAlbum.statusText);
        }

        const dataPhotos: Photo[] = await resPhotos.json();
        const dataAlbum: Album = await resAlbum.json();

        setPhotos(dataPhotos);
        setAlbumTitle(dataAlbum.title);
        setAlbumUserId(dataAlbum.userId);
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
      setPhotos([]);
      setAlbumTitle('');
      setIsPending(false);
    }
  }, [locationPath, id, fetchingNewPhotos, photosDeleteData]);

  const handleSubmitAdd = function (e: React.SyntheticEvent) {
    e.preventDefault();
    postAlbumData({
      userId: state.user?.id,
      title: albumTitle,
    });
  };

  const handleSubmitUpdate = function (e: React.SyntheticEvent) {
    e.preventDefault();
    if (locationPath === 'edit' && addingNewPhotos) {
      patchAlbumData({
        userId: state.user?.id,
        title: albumTitle,
      });

      // addingNewPhotos.forEach(photo =>
      //   postPhotosData({
      //     albumId: id,
      //     title: 'title',
      //     url: photo,
      //     thumbnailUrl: photo,
      //   })
      // );

      const postData = async function () {
        setIsPending(true);
        try {
          for (let i = 0; i < addingNewPhotos.length; i++) {
            const resPhotos = await fetch('http://localhost:8000/photos', {
              method: 'POST',
              body: JSON.stringify({
                albumId: Number(id),
                title: 'title',
                url: addingNewPhotos[i],
                thumbnailUrl: addingNewPhotos[i],
              }),
              headers: { 'Content-Type': 'application/json' },
            });
            if (!resPhotos.ok) {
              throw Error(resPhotos.statusText);
            }
            const dataPhotos: string = await resPhotos.json();
            console.log(dataPhotos);

            setFetchingNewPhotos(prev => [...prev, dataPhotos]);
          }
          setIsPending(false);
        } catch (err: any) {
          console.error(err.message);
          setError(err.message);
          setIsPending(false);
        }
      };
      postData();
      setAddingNewPhotos([]);
      setFetchingNewPhotos([]);
    }
  };

  useEffect(() => {
    if (albumData && locationPath !== 'edit') {
      navigate(`/albums/edit/${albumData.id}`);
    }
  }, [navigate, albumData, locationPath]);

  const handleAdd = function () {
    const photo = newPhoto.trim();

    if (photo && !addingNewPhotos.includes(photo)) {
      setAddingNewPhotos(prevState => [...prevState, photo]);
    }
    setNewPhoto('');
    addPhotoInput.current?.focus();
  };

  const checkPhotoUrl = function (e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    if (urlPattern.test(newPhoto)) {
      setPhotoValidateWarn(false);
      handleAdd();
    } else {
      setPhotoValidateWarn(true);
    }
  };

  const handleDeleteLink = function (index: number) {
    setAddingNewPhotos([
      ...addingNewPhotos.slice(0, index),
      ...addingNewPhotos.slice(index + 1, addingNewPhotos.length),
    ]);
  };

  const handleDeletePhoto = function (photoId: number) {
    setPhotoIdForDelete(photoId);
    deletePhotos();
  };

  function LightGalleryItem(props: {
    src: string;
    thumbnailUrl: string;
    photoTitle: string;
    photoId: number;
  }) {
    return (
      <div className={style.photos__item}>
        <a className={`gallery-item`} data-src={props.src}>
          <img
            className={style.photos__img}
            src={props.thumbnailUrl}
            alt="photo"
          />
          <p>{props.photoTitle}</p>
        </a>
        <button
          className={`btn ${style['delete-btn']}`}
          onClick={() => handleDeletePhoto(props.photoId)}>
          Delete
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && <p>{error.message}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {!isPending && locationPath !== 'edit' && (
        // adding new gallery
        <div className={style.create}>
          <h2 className={style['create-album-head']}> Add new album</h2>
          <form onSubmit={handleSubmitAdd}>
            <label>
              <span>Album title: </span>
              <input
                type="text"
                value={albumTitle}
                onChange={e => setAlbumTitle(e.target.value)}
                required
              />
            </label>

            <button className={`btn ${style.create__btn}`}>Submit</button>
          </form>
        </div>
      )}

      {!isPending &&
        photos &&
        locationPath === 'edit' &&
        state.user?.id === albumUserId && (
          // showing and editing gallery
          <>
            <div className={style.create}>
              <h2 className={style['create-album-head']}> Edit album</h2>
              <form onSubmit={handleSubmitUpdate}>
                <label>
                  <span>Album title: </span>
                  <input
                    type="text"
                    value={albumTitle}
                    onChange={e => setAlbumTitle(e.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Add photos: </span>
                  <div className={style['photos__add-input']}>
                    <input
                      type="url"
                      onChange={e => setNewPhoto(e.target.value)}
                      value={newPhoto}
                      ref={addPhotoInput}
                    />

                    <button className="btn" onClick={checkPhotoUrl}>
                      Add
                    </button>
                  </div>
                  {photoValidateWarn && (
                    <p className={style['photos__url-tip']}>
                      Not valid url address
                    </p>
                  )}
                </label>
                <p>Currently adding photos:</p>

                {addingNewPhotos.map((photo, index) => (
                  <p
                    className={style.photos__link}
                    key={index}
                    onClick={() => handleDeleteLink(index)}>
                    {photo}
                  </p>
                ))}
                {addingNewPhotos.length !== 0 && (
                  <p className={style.photos__tip}>
                    Click on link to dalete from list
                  </p>
                )}
                <button className={`btn`}>Submit</button>
              </form>
            </div>
            <h2 className={style['create-album-head']}> Photos</h2>
            <LightGallery
              selector=".gallery-item"
              elementClassNames={style.photos__container}>
              {photos.map(photo => (
                <LightGalleryItem
                  src={photo.url}
                  thumbnailUrl={photo.thumbnailUrl}
                  photoTitle={photo.title}
                  photoId={photo.id}
                />
              ))}
            </LightGallery>
          </>
        )}
      {!isPending &&
        photos &&
        locationPath === 'edit' &&
        state.user?.id !== albumUserId && (
          <h2 className={style['create-album-head']}> Access denied</h2>
        )}
    </div>
  );
}

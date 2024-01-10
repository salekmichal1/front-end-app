import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './AlbumsSearch.module.css';

export default function AlbumsSearch() {
  const [phrase, setPhrase] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    navigate(`/albums/searchAlbums?q=${phrase}`);
  };
  return (
    <div className={style['search-bar']}>
      <form onSubmit={handleSearch}>
        {/* <label htmlFor="search">Search:</label> */}
        <input
          className={style['search-bar__input']}
          type="text"
          id="search"
          onChange={event => setPhrase(event.target.value)}
          placeholder="Search albums..."
          required
        />
        <button className="btn" type="submit">
          Find
        </button>
      </form>
    </div>
  );
}

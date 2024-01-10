import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './PostSearch.module.css';

export default function PostsSearch() {
  const [phrase, setPhrase] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    navigate(`/posts/searchPosts?q=${phrase}`);
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
          placeholder="Search posts..."
          required
        />
        <button className="btn" type="submit">
          Find
        </button>
      </form>
    </div>
  );
}

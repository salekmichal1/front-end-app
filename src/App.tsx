import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import UserPanel from './pages/userPanel/UserPanel';
import { useAuthContext } from './hooks/useAuthContext';
import Albums from './pages/albums/Albums';
import Posts from './pages/posts/Posts';
import CreatePost from './pages/createPost/CreatePost';
import SearchPosts from './pages/searchPosts/SearchPosts';
import SearchAlbums from './pages/searchAlbums/SearchAlbums';
import CreateAlbum from './pages/createAlbums/CreateAlbum';

function App() {
  const { state } = useAuthContext();
  return (
    <div className="App">
      {state.authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={state.user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!state.user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!state.user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/userPanel"
              element={state.user ? <UserPanel /> : <Navigate to="/login" />}
            />
            <Route
              path="/albums"
              element={state.user ? <Albums /> : <Navigate to="/login" />}
            />
            <Route
              path="/posts"
              element={state.user ? <Posts /> : <Navigate to="/login" />}
            />
            <Route
              path="/posts/createPost"
              element={state.user ? <CreatePost /> : <Navigate to="/login" />}
            />
            <Route
              path="/posts/edit/:id"
              element={state.user ? <CreatePost /> : <Navigate to="/login" />}
            />
            <Route
              path="/posts/searchPosts"
              element={state.user ? <SearchPosts /> : <Navigate to="/login" />}
            />
            <Route
              path="/albums/searchAlbums"
              element={state.user ? <SearchAlbums /> : <Navigate to="/login" />}
            />
            <Route
              path="/albums/createAlbum"
              element={state.user ? <CreateAlbum /> : <Navigate to="/login" />}
            />
            <Route
              path="/albums/edit/:id"
              element={state.user ? <CreateAlbum /> : <Navigate to="/login" />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;

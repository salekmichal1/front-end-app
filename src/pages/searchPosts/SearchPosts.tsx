import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Comments from '../../components/Comments';
import PostsSearch from '../../components/PostsSearch';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetch } from '../../hooks/useFetch';
import { Post, UserElement, Comment } from '../../model/types';
import style from './SearchPosts.module.css';

export default function SearchPosts() {
  const queryString: string = useLocation().search;
  const queryParams: URLSearchParams = new URLSearchParams(queryString);
  const query: string | null = queryParams.get('q');

  const url = 'http://localhost:5000/posts/?q=' + query;
  const { data, isPending, error } = useFetch<Post[]>(url);

  const { state } = useAuthContext();
  const navigate = useNavigate();

  const {
    data: usersData,
    isPending: usersPending,
    error: usersError,
  } = useFetch<UserElement[]>('http://localhost:3000/users');

  const {
    data: commentsData,
    isPending: commentsPending,
    error: commentsError,
  } = useFetch<Comment[]>('http://localhost:6001/comments');

  console.log(commentsData);

  return (
    <div>
      <h2 className={style['posts-head']}>Posts</h2>
      <div className={style.posts__controls}>
        <PostsSearch />
        <Link to="/posts/createPost">
          <button className={`btn ${style.posts__btn}`}>Add post</button>
        </Link>
      </div>
      {isPending && usersPending && <p className="loading">Loading...</p>}
      {error && usersError && (
        <p>
          {error.toString()}, {usersError.toString()}
        </p>
      )}
      <div className={style.posts}>
        {commentsPending && <p className="loading">Loading...</p>}
        {data &&
          usersData &&
          data.map(post => (
            <div key={post.id} className={style['post-item']}>
              <h2 className={style['post-item__title']}>Title: {post.title}</h2>
              <p className={style['post-item__content']}> {post.body}</p>
              <p>
                Post created by: #
                {usersData.some(user => user.id === post.userId)
                  ? usersData
                      .filter(user => user.id === post.userId)
                      .map(user => user.username)
                  : 'Annonymus'}
              </p>
              {state.user?.id === post.userId && (
                <button
                  className={`btn ${style['post-item__btn']}`}
                  onClick={() => navigate(`/posts/edit/${post.id}`)}>
                  Edit post
                </button>
              )}
              {/* {commentsData &&
                commentsData.some(comment => comment.postId === post.id)
                  ? commentsData
                      .filter(comment => comment.postId === post.id)
                      .map(comment => <p className=''> {comment.body} </p>)
                  : 'No comment'} */}

              {commentsData && (
                <Comments
                  postId={post.id}
                  commentsData={commentsData}
                  commentsPending={commentsPending}
                  commentsError={commentsError}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

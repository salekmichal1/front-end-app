import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Comments from '../../components/Comments';
import PostsSearch from '../../components/PostsSearch';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetch } from '../../hooks/useFetch';
import { Comment, Post, UserElement } from '../../model/types';
import style from './Posts.module.css';

export default function Posts() {
  const { state } = useAuthContext();
  const [postForDeleteId, setPostForDeleteId] = useState<number>();
  const navigate = useNavigate();

  const {
    getData,
    data: postsData,
    isPending: postsIsPending,
    error: postsError,
  } = useFetch<Post[]>('http://localhost:5000/posts');

  const { deleteData, data: postDeleteData } = useFetch<Post>(
    `http://localhost:5000/posts/${postForDeleteId}`,
    'DELETE'
  );

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

  const handleDelete = function (postId: number) {
    setPostForDeleteId(postId);
    deleteData();
  };

  useEffect(() => {
    getData();
  }, [postDeleteData, postsData]);

  return (
    <div>
      <h2 className={style['posts-head']}>Posts</h2>
      <div className={style.posts__controls}>
        <PostsSearch />
        <Link to="createPost">
          <button className={`btn ${style.posts__btn}`}>Add post</button>
        </Link>
      </div>
      {postsIsPending && usersPending && <p className="loading">Loading...</p>}
      {postsError && usersError && (
        <p>
          {postsError.toString()}, {usersError.toString()}
        </p>
      )}
      <div className={style.posts}>
        {postsData &&
          usersData &&
          postsData.map(post => (
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
                <>
                  <button
                    className={`btn ${style['post-item__btn']}`}
                    onClick={() => navigate(`/posts/edit/${post.id}`)}>
                    Edit post
                  </button>
                  <button
                    className={`btn ${style['post-item__btn']}`}
                    onClick={() => handleDelete(post.id)}>
                    Delete post
                  </button>
                </>
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
              {!commentsData && <p className="loading">No comments to load</p>}
            </div>
          ))}
      </div>
    </div>
  );
}

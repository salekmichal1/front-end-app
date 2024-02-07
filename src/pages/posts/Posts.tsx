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
    getData: getPosts,
    data: postsData,
    isPending: postsIsPending,
    error: postsError,
  } = useFetch<Post[]>('https://front-end-app-server.onrender.com/posts');

  const { deleteData: deltePosts, data: postDeleteData } = useFetch<Post>(
    `https://front-end-app-server.onrender.com/posts/${postForDeleteId}`,
    'DELETE'
  );

  const {
    data: usersData,
    isPending: usersPending,
    error: usersError,
  } = useFetch<UserElement[]>(
    'https://front-end-app-server.onrender.com/users'
  );

  const {
    getData: getComments,
    data: commentsData,
    isPending: commentsPending,
    error: commentsError,
  } = useFetch<Comment[]>('https://front-end-app-server.onrender.com/comments');

  const handleDelete = function (postId: number) {
    setPostForDeleteId(postId);
    getComments();
    deltePosts();
  };

  const deleteComments = async function () {
    const commentsForDelete = commentsData?.filter(
      comment => comment.postId === postForDeleteId
    );

    try {
      if (commentsForDelete) {
        for (let i = 0; i < commentsForDelete.length; i++) {
          const resCommentsDelete = await fetch(
            `https://front-end-app-server.onrender.com/comments/${commentsForDelete[i].id}`,
            {
              method: 'DELETE',
            }
          );
          if (!resCommentsDelete.ok) {
            throw Error(resCommentsDelete.statusText);
          }
          const dataCommentsDelete: string = await resCommentsDelete.json();
          console.log(dataCommentsDelete);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    deleteComments();
    getPosts();
  }, [postDeleteData]);

  return (
    <div>
      <h2 className={style['posts-head']}>Posts</h2>
      <div className={style.posts__controls}>
        <PostsSearch />
        <Link className={`btn ${style['create-post-btn']}`} to="createPost">
          Add post
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

import { Fragment, useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFetch } from '../hooks/useFetch';
import { Comment } from '../model/types';
import style from './Comments.module.css';

export default function Comments({
  postId,
  commentsData,
  commentsPending,
  commentsError,
}: {
  postId: number;
  commentsData: Comment[];
  commentsPending: boolean;
  commentsError: String | Error | null;
}) {
  const { state } = useAuthContext();
  const [commentDataState, setCommentDataState] =
    useState<Comment[]>(commentsData);
  const [comment, setComment] = useState<string>();
  const { postData, data } = useFetch<Comment>(
    'https://front-end-app-server.onrender.com/comments',
    'POST'
  );

  const handleSubmit = function (e: React.SyntheticEvent) {
    e.preventDefault();
    postData({
      postId: postId,
      name: '',
      email: state.user?.email,
      body: comment,
    });
    setComment('');
  };

  useEffect(() => {
    if (data) {
      setCommentDataState(prev => [...prev, data]);
    }
  }, [data]);

  return (
    <div className={style['comments-container']}>
      <h2>Comments:</h2>
      <div className={style.comments}>
        {commentsPending && <p className="loading">Loading...</p>}
        {commentsError && <p className="">{commentsError.toString()}</p>}
        {commentDataState &&
          commentDataState.map(comment =>
            comment.postId === postId ? (
              <Fragment key={comment.id}>
                <p className={style['comment-user']}>User: @{comment.email}</p>
                <p key={comment.id} className={style.comment}>
                  Wrote: {comment.body}
                </p>
              </Fragment>
            ) : (
              ''
            )
          )}
        {/* {commentsData.some(comment => comment.postId === post.id)
          //   ? commentsData
          //       .filter(comment => comment.postId === post.id)
          //       .map(comment => comment.body)
          //   : 'No comment'} */}
      </div>
      <form className={style['commnets-form']} onSubmit={handleSubmit}>
        <label>
          <span>Write comment: </span>
          <textarea
            rows={6}
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
          />
        </label>
        <button className={`btn ${style['comments-container__btn']}`}>
          Add comment
        </button>
      </form>
    </div>
  );
}

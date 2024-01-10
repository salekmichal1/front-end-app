import { Post, Todo } from '../model/types';
import style from './Todo.module.css';

import { ReactComponent as DeleteIcon } from './../assets/delete.svg';
import { ReactComponent as EditIcon } from './../assets/edit.svg';
import { ReactComponent as DoneIcon } from './../assets/done.svg';
import { ReactComponent as BlockIcon } from './../assets/block.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useAuthContext } from '../hooks/useAuthContext';

export default function TodoList(todos: { todos: Todo[] }) {
  const { state } = useAuthContext();

  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

  const [todoUrlIdStatus, setTodoUrlIdStatus] = useState<number>();
  const [todoUrlIdEdit, setTodoUrlIdEdit] = useState<number>();

  const [editingTodoId, setEditingTodo] = useState<number | null>(null);
  const [editingTodoText, setEditingTodoText] = useState<string | null>(null);

  // const [todoPostId, setTodoPostId] = useState<number | null>(null);

  const [todoDeleteId, setTodoDeleteId] = useState<number | null>(null);

  const [todosArr, setTodosArr] = useState<Todo[]>(todos.todos);
  const ref = useRef<HTMLInputElement>(null);

  const { patchData: patchDataStatus } = useFetch<Todo>(
    `http://localhost:4000/todos/${todoUrlIdStatus}`,
    'PATCH'
  );

  const { patchData: patchDataEdit } = useFetch<Todo>(
    `http://localhost:4000/todos/${todoUrlIdEdit}`,
    'PATCH'
  );

  const { postData, data } = useFetch<Todo>(
    `http://localhost:4000/todos/`,
    'POST'
  );

  const { deleteData } = useFetch<Todo>(
    `http://localhost:4000/todos/${todoDeleteId}`,
    'DELETE'
  );

  // swtiching between todo status
  useEffect(() => {
    if (todoUrlIdStatus) {
      patchDataStatus({ completed: taskCompleted });
    }
  }, [todoUrlIdStatus, taskCompleted]);

  const handleEditStart = function (id: number) {
    setEditingTodo(id);
  };

  // use effect for focusing todo when starting editidng
  useEffect(() => {
    ref.current?.focus();
  }, [editingTodoId]);

  const handleEditdDone = function (e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      console.log(editingTodoText);

      if (editingTodoText) {
        patchDataEdit({ title: editingTodoText });
      }
      setEditingTodo(null);
      // setEditingTodoText(null);
    }
  };

  const handleEditdDoneLostFocus = function () {
    console.log(editingTodoText);

    if (editingTodoText) {
      patchDataEdit({ title: editingTodoText });
    }
    setEditingTodo(null);
    // setEditingTodoText(null);
  };

  useEffect(() => {
    if (todoDeleteId) {
      setTodosArr(prev => prev.filter(todo => todo.id !== todoDeleteId));
      deleteData();
    }
  }, [todoDeleteId]);

  const handleAddTodo = function () {
    // const lastTodoId = Math.max.apply(
    //   Math,
    //   todosArr.map(todo => todo.id)
    // );

    if (state.user?.id) {
      postData({
        userId: state.user.id,
        title: '',
        completed: false,
      });
    }
    console.log(data);

    // setTodoPostId(lastTodoId);
  };

  useEffect(() => {
    if (data) {
      setTodosArr(prev => [...prev, data]);
    }
  }, [data]);

  // const handleDelete = function (id: number) {
  //   if (todoDeleteId) {
  //     setTodosArr(prev => prev.filter(todo => todo.id !== todoDeleteId));
  //     console.log(todosArr);

  //     // deleteData();
  //   }
  // };

  return (
    <div className={style['todo-list']}>
      {todosArr.map(todo => (
        <div key={todo.id} className={style.todo}>
          <div className={style['todo__icons']}>
            {todo.completed === true ? (
              <BlockIcon
                className={`${style['block-icon']} ${style.todo__icon}`}
                onClick={() => {
                  setTodoUrlIdStatus(todo.id);
                  setTaskCompleted(false);

                  todo.completed = false;
                }}
              />
            ) : (
              <DoneIcon
                className={`${style['done-icon']} ${style.todo__icon}`}
                onClick={() => {
                  setTodoUrlIdStatus(todo.id);
                  setTaskCompleted(true);

                  todo.completed = true;
                }}
              />
            )}
            <EditIcon
              className={`${style['edit-icon']} ${style.todo__icon}`}
              onClick={() => {
                handleEditStart(todo.id);
                setTodoUrlIdEdit(todo.id);
              }}
            />
            <DeleteIcon
              className={`${style['delete-icon']} ${style.todo__icon}`}
              onClick={() => {
                setTodoDeleteId(todo.id);
                // handleDelete(todo.id);
              }}
            />
          </div>
          <p>Status: {todo.completed ? 'Finished' : 'Unfinished'}</p>

          {editingTodoId !== todo.id && <p>Task: {todo.title}</p>}
          {editingTodoId === todo.id && (
            <div className={style['todo__input-box']}>
              <p>Task: </p>
              <input
                className={style.todo__input}
                ref={ref}
                onFocus={e => setEditingTodoText(e.target.value)}
                onChange={e => {
                  todo.title = e.target.value;
                  setEditingTodoText(e.target.value);
                }}
                defaultValue={todo.title}
                onKeyDown={handleEditdDone}
                onBlur={handleEditdDoneLostFocus}
              />
            </div>
          )}
        </div>
      ))}
      <button className={style.todo__btn} onClick={handleAddTodo}>
        Add todo
      </button>
    </div>
  );
}

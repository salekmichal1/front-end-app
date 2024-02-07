import TodoList from '../../components/TodoList';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetch } from '../../hooks/useFetch';
import { Todo } from '../../model/types';

export default function Home() {
  const { state } = useAuthContext();
  const { data, isPending, error } = useFetch<Todo[]>(
    `https://front-end-app-server.onrender.com/todos?userId=${state.user?.id}`
  );

  return (
    <div>
      {error && <p>{error.toString()}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && <TodoList todos={data} />}
    </div>
  );
}

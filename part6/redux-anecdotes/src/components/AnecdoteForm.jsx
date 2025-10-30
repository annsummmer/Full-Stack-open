import {useDispatch} from "react-redux";
import {setNotification, showNotification} from "../reducers/notificationsReducer.js";
import {addNewAnecdote} from "../reducers/anecdoteReducer.js";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const newAnecdote = event.target.anecdote.value;

    await dispatch(addNewAnecdote(newAnecdote));

    dispatch(setNotification(`You have just created new anecdote ${newAnecdote}.`, 3));
    event.target.anecdote.value = '';
  }

  return <div>
    <h2>create new</h2>
    <form onSubmit={addAnecdote}>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  </div>
};

export default AnecdoteForm;
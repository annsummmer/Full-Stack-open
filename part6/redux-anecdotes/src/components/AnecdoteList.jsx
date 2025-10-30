import {useDispatch, useSelector} from "react-redux";
import {increaseAnecdoteVote} from "../reducers/anecdoteReducer.js";
import {setNotification} from "../reducers/notificationsReducer.js";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.anecdotes;
    }
    return state.anecdotes.filter(anecdote => {
      return anecdote.content.toLowerCase().includes(state.filter.toLowerCase());
    });
  });

  const vote = async (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };
    await dispatch(increaseAnecdoteVote(updatedAnecdote));
    dispatch(setNotification(`You have just upvoted ${anecdote.content}.`, 3));
  };

  return <>
    {anecdotes.map(anecdote => (
      <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
      ))}
  </>
};

export default AnecdoteList;
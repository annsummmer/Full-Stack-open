import AnecdoteForm from './components/AnecdoteForm.jsx';
import Notification from './components/Notification.jsx';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getAnecdotes, upvoteAnecdote} from "./requests.js";
import {useContext} from "react";
import NotificationContext from "./context/NotificationContext.jsx";

const App = () => {
  const queryClient = useQueryClient();
  const { notificationDispatch } = useContext(NotificationContext);

  const newUpvoteMutation = useMutation({
    mutationFn: upvoteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
    }
  });

  const handleVote = (anecdote) => {
    newUpvoteMutation.mutate({...anecdote, votes: anecdote.votes + 1});

    notificationDispatch({type: 'SET_NOTIFICATION', payload: `${anecdote.content} was upvoted successfully`});
    setTimeout(() => {
      notificationDispatch({type: 'REMOVE_NOTIFICATION'});
    }, 2000);
  };

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  });

  if (result.isLoading) {
    return <div>anecdotes service not available due to problems in server</div>
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App;

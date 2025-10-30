import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postAnecdote} from "../requests.js";
import {useContext} from "react";
import NotificationContext from "../context/NotificationContext.jsx";

const AnecdoteForm = () => {
  const { notificationDispatch } = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: postAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
    },
    onError: (value) => {
      console.log(value)
      notificationDispatch({type: 'SET_NOTIFICATION', payload: `${value}. A note has to be 5 char long`});
      setTimeout(() => {
        notificationDispatch({type: 'REMOVE_NOTIFICATION'});
      }, 2000);
    }
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    console.log('new anecdote');
    newAnecdoteMutation.mutate({content, votes: 0});
    notificationDispatch({type: 'SET_NOTIFICATION', payload: `${content} was created successfully`});
    setTimeout(() => {
      notificationDispatch({type: 'REMOVE_NOTIFICATION'});
    }, 2000);
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

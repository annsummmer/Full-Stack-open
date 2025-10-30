import {createSlice, current} from "@reduxjs/toolkit";
import * as anecdotesService from "../services/anecdotesService.js";

const getId = () => (100_000 * Math.random()).toFixed(0);

const Anecdote = anecdoteText => ({
  content: anecdoteText,
  id: getId(),
  votes: 0
});

const AnecdotesSlice = createSlice({
  name: 'Anecdotes',
  initialState: [],
  reducers: {
    createAnecdote: (state, action) => {
      const newAnecdote = Anecdote(action.payload);
      state.push(newAnecdote);
      return state;
    },
    upvoteAnecdote: (state, action) => {
      const anecdoteToUpvote = state.find(a => a.id === action.payload.id);
      anecdoteToUpvote.votes++;
      state.sort((a, b) => b.votes - a.votes);
      console.log(anecdoteToUpvote);
      return state;
    },
    setAnecdotes(state, action) {
      return action.payload;
    }
  }
});

const { setAnecdotes } = AnecdotesSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll();
    dispatch(setAnecdotes(anecdotes));
  }
}

export const addNewAnecdote = (content) => {
  return async (dispatch) => {
    await anecdotesService.createNew(content);
    dispatch(createAnecdote(content));
  }
}

export const increaseAnecdoteVote = (content) => {
  return async (dispatch) => {
    await anecdotesService.updateVote(content);
    dispatch(upvoteAnecdote(content));
  }
}

export const { createAnecdote, upvoteAnecdote } = AnecdotesSlice.actions;
export default AnecdotesSlice.reducer;

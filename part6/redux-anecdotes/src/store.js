import { configureStore } from '@reduxjs/toolkit'

import filterReducer from './reducers/filterReducer'
import anecdoteReducer from "./reducers/anecdoteReducer.js";
import notificationsReducer from "./reducers/notificationsReducer.js";

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationsReducer,
  }
});

export default store;
import AnecdoteList from "./components/AnecdoteList.jsx";
import AnecdoteForm from "./components/AnecdoteForm.jsx";
import Filter from "./components/Filter.jsx";
import Notification from "./components/Notification.jsx";
import {useDispatch, useSelector} from "react-redux";
import {hideNotification} from "./reducers/notificationsReducer.js";
import {useEffect} from "react";
import {initializeAnecdotes} from "./reducers/anecdoteReducer.js";

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.notification);

  useEffect( () => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      {notification !== '' && <Notification notification={notification}/>}
      <Filter />
      <AnecdoteList/>
      <AnecdoteForm />
    </div>
  )
}

export default App;

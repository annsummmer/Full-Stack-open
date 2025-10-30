import {filterChange} from "../reducers/filterReducer.js";
import {useDispatch} from "react-redux";
import {setNotification, showNotification} from "../reducers/notificationsReducer.js";

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(filterChange(event.target.value));
    dispatch(setNotification(`The term to filter anecdotes is ${event.target.value}.`, 3));
  };
  const style = {
    marginBottom: 10
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
}

export default Filter;
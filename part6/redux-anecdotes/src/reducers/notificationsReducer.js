import {createSlice} from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification: (state, action) => {
      console.log(action.payload);
      return action.payload;
    },
    hideNotification: () => {
      return '';
    }
  }
});

export const { showNotification, hideNotification } = notificationsSlice.actions;

export const setNotification = (content, timeout) => {
  return (dispatch) => {
    dispatch(showNotification(content));
    setTimeout(() => {
      dispatch(hideNotification());
    }, timeout * 1000);
  }
}

export default notificationsSlice.reducer;
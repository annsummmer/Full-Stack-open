import { useState, useEffect, useContext } from 'react';
import LoginForm from './components/LoginForm.jsx';
import BlogsList from './components/BlogsList.jsx';
import CreateBlogForm from './components/CreateBlogForm.jsx';
import Notification from './components/Notification.jsx';
import Togglable from './components/Togglable.jsx';
import { BlogProvider } from './context/BlogsContext.jsx';
import { useAuthenticate } from './hooks/useAuthenticate.js';
import { useNotification } from './hooks/useNotification.js';

const App = () => {
  const { login, logout, user } = useAuthenticate();
  const { showNotification, errorMessage, successMessage } = useNotification();

  const onLogin = (username, password) => login(
    username,
    password,
    () => showNotification(`User ${username} has been logged in`, 'success'),
    () => showNotification('wrong credentials', 'error'),
  );

  const handleLogout = async () => {
    logout(() => showNotification(`User ${user.username} has been logged out`, 'success'));
  };

  return (
    <BlogProvider>
      <>
        <div id="notification-placeholder">
          {errorMessage && <Notification message={errorMessage} status='error'/>}
          {successMessage && <Notification message={successMessage} status='success'/>}
        </div>
        {!user && <LoginForm handleLogin={onLogin}/>}
        {user && <>
          <div>
            <h2 key={0}>blogs</h2>
            <div key={1}>{user.username} is logged in
              <button onClick={handleLogout}>Logout</button>
            </div>
            <BlogsList key="blogs-list"/>
            <Togglable key={3} showButtonLabel="create new blog" hideButtonLabel="cancel">
              <CreateBlogForm
                onPostCreateSuccess={newBlog => showNotification(`new ${newBlog.title} blog was created successfully.`, 'success')}
                onPostCreateError={error => showNotification(error.response?.data?.message, 'error')}
              />
            </Togglable>
          </div>
        </>
        }
      </>
    </BlogProvider>
  );
};

export default App;
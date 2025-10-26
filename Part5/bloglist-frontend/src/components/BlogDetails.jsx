import styles from './BlogDetails.module.css';
import {useContext, useEffect, useMemo, useState} from 'react';
import { BlogContext } from '../context/BlogsContext.jsx';
import {useNotification} from "../hooks/useNotification.js";
import Notification from "./Notification.jsx";
import {createPortal} from "react-dom";

import {LOGGED_IN_USER_KEY} from "../hooks/useAuthenticate.js";

const BlogDetails = ({ blog }) => {
  const { showNotification, errorMessage, successMessage } = useNotification();
  const { fetchBlogs, updateBlog, deleteBlog } = useContext(BlogContext);

  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);

  useEffect(() => {
    const loggedUserId = JSON.parse(window.localStorage.getItem(LOGGED_IN_USER_KEY)).id;
    if (loggedUserId === blog.user.id) {
      setDeleteButtonVisible(true);
    }
  }, []);

  const handleLikeClick = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    };
    try {
      await updateBlog(updatedBlog);
      await fetchBlogs();
      showNotification(`Thanks for your like to the blog ${blog.title}.`, 'success');
    } catch (e) {
      showNotification(`Sorry, there was an error. Your like to the ${blog.title} was not added.`, 'error');
    }
  };

  const handleDeleteBlog = async () => {
    const decision = window.confirm('Are you sure you want to delete this blog?');
    if (decision) {
      try {
        await deleteBlog(blog.id);
        showNotification(`${blog.title} was deleted.`, 'success');
        await fetchBlogs();
      } catch (e) {
        showNotification(`Sorry, there was an error. ${blog.title} was not deleted.`, 'error');
      }
    }
  };

  return <>
    {createPortal(
      <div>
        {errorMessage && <Notification message={errorMessage} status='error'/>}
        {successMessage && <Notification message={successMessage} status='success'/>}
      </div>,
      document.getElementById('notification-placeholder')
    )}
    <div className={styles.blogExpanded}>
      <p>ID: {blog.id}</p>
      <p>url:
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>Likes: {blog.likes}
        <button onClick={handleLikeClick}>Like</button>
      </p>
      <p>User: {blog.user?.name}</p>
      {deleteButtonVisible && <button onClick={handleDeleteBlog}>remove</button>}
    </div>
  </>;
};

export default BlogDetails;
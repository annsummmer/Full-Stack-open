import axios from 'axios';
import { LOGGED_IN_USER_KEY } from './useAuthenticate.js';
import { useEffect, useState } from 'react';

const baseUrl = '/api/blogs';

export const useBlogsService = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const { data: currentBlogs } = await axios.get(baseUrl);
    currentBlogs.sort((a, b) => {
      return b.likes - a.likes;
    });
    setBlogs(currentBlogs);
  };

  const setAuthHeader = () => {
    const loggedUserJSON = window.localStorage.getItem(LOGGED_IN_USER_KEY);
    return {
      headers: { Authorization: `Bearer ${JSON.parse(loggedUserJSON).token}` } // ASK: is it ok to take token from user
    };
  };

  const postNewBlog = async (blog) => {
    const config = setAuthHeader();

    const response = await axios.post(baseUrl, blog, config);
    return response.data;
  };

  const updateBlog = async (blog) => {
    const config = setAuthHeader();

    const url = `${baseUrl}/${blog.id}`;
    const response = await axios.put(url, blog, config);
    return response.data;
  };

  const deleteBlog = async (blogId) => {
    const config = setAuthHeader();

    const url = `${baseUrl}/${blogId}`;
    const response = await axios.delete(url, config);
    return response.data;
  };

  return {
    blogs,
    fetchBlogs,
    postNewBlog,
    updateBlog,
    deleteBlog,
  };
};
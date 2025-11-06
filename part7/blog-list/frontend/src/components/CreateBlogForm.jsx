import Input from './Input.jsx';
import { useContext, useState } from 'react';
import { BlogContext } from '../context/BlogsContext.jsx';
import {LOGGED_IN_USER_KEY} from "../hooks/useAuthenticate.js";

const CreateBlogForm = ({ onPostCreateSuccess, onPostCreateError }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const { fetchBlogs, postNewBlog } = useContext(BlogContext);

  const loggedUser = JSON.parse(window.localStorage.getItem(LOGGED_IN_USER_KEY));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newBlog = {
      title,
      author,
      url,
      user: loggedUser.id
    };

    try {
      await postNewBlog(newBlog);
      onPostCreateSuccess(newBlog);
      await fetchBlogs();
    } catch (error) {
      onPostCreateError(error);
    }

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return <>
    <h2>Create new</h2>
    <form onSubmit={handleSubmit}>
      <Input key="title-input" label="Title" value={title} onChange={setTitle}/>
      <Input key="author-input" label="Author" value={author} onChange={setAuthor}/>
      <Input key="url-input" label="URL" value={url} onChange={setUrl}/>
      <button type="submit">
        Create
      </button>
    </form>
  </>;
};

export default CreateBlogForm;
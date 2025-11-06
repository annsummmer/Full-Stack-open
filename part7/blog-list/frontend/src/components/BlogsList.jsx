import Blog from './Blog.jsx';
import { useContext } from 'react';
import { BlogContext } from '../context/BlogsContext.jsx';

const BlogsList = () => {
  const { blogs } = useContext(BlogContext);
  console.log(blogs);
  return <>
    <ul>
      {blogs.map(blog =>
        <li key={blog.id}>
          <Blog blog={blog} />
        </li>
      )}
    </ul>
  </>;
};


export default BlogsList;
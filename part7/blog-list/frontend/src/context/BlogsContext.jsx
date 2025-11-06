import { createContext } from 'react';
import { useBlogsService } from '../hooks/useBlogsService.js';

export const BlogContext = createContext( {
  blogs: [],
  fetchBlogs: () => [],
  deleteBlog: () => [],
  updateBlog: () => [],
  postNewBlog: () => [],
});

export const BlogProvider = ({ children }) => {
  const { blogs, fetchBlogs, deleteBlog, updateBlog, postNewBlog } = useBlogsService();

  return (
    <BlogContext value={{ blogs, fetchBlogs, deleteBlog, updateBlog, postNewBlog }}>
      {children}
    </BlogContext>
  );
};

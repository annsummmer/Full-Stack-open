import Togglable from './Togglable.jsx';
import BlogDetails from './BlogDetails.jsx';

const Blog = ({ blog }) => (
  <div>
    <span>{blog.title}</span> - <span>{blog.author}</span>
    <Togglable showButtonLabel="view" hideButtonLabel="hide">
      <BlogDetails blog={blog} />
    </Togglable>
  </div>
);

export default Blog;
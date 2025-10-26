import { render, screen } from '@testing-library/react';
import Blog from "./Blog.jsx";

test('renders content', () => {

  const blog = {
    title: 'Here is the title',
    author: 'He is the author',
    url: 'http://localhost/heIsTheAuthor',
  };

  render(<Blog blog={blog} />);

  const title = screen.getByText('Here is the title', { exact: false });
  const author = screen.getByText('He is the author');
  const url = screen.getByText('http://localhost/heIsTheAuthor');
  const likes = screen.getByText('Likes:');

  expect(title, author).toBeDefined();
  expect(url, likes).not.toBeVisible();
});

import { render, screen } from '@testing-library/react';
import Togglable from './Togglable';
import styles from "./BlogDetails.module.css";
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('<Togglable />', () => {
  const handleLikeClick = vi.fn();
  const blog = {
    title: 'Here is the title',
    author: 'He is the author',
    url: 'http://localhost/heIsTheAuthor',
    likes: 10,
    id: 1,
    user: {
      name: 'John',
      id: 1111,
    }
  };

  beforeEach(() => {
    render(
      <Togglable showButtonLabel="view" hideButtonLabel="hide">
        <div className={styles.blogExpanded}>
          <p>ID: {blog.id}</p>
          <p>url:
            <a href={blog.url}>{blog.url}</a>
          </p>
          <p>Likes: {blog.likes}
            <button onClick={handleLikeClick}>Like</button>
          </p>
          <p>User: {blog.user?.name}</p>
          <button >remove</button>
        </div>
      </Togglable>
    );
  });

  test('renders its children', () => {
    screen.getByText('Likes: 10');
  });

  test('at start the children are not displayed', () => {
    const element = screen.getByText('User:', { exact: false });
    expect(element).not.toBeVisible();
  });

  test('after "View" button click the children are displayed', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByRole('button', { name: /view/i });
    await user.click(viewButton);

    const removeButton = screen.getByText('remove');
    const likes = screen.getByText('Likes:', {exact: false});

    expect(likes, removeButton).toBeVisible();
  });

  test('after two "like" button clicks, event handler gets called twice ', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByRole('button', { name: /view/i });
    await user.click(viewButton);

    const likeButton = screen.getByRole('button', { name: /Like/i });

    handleLikeClick.mockClear();

    await user.click(likeButton);
    await user.click(likeButton);

    expect(handleLikeClick.mock.calls).toHaveLength(2);
  });

});
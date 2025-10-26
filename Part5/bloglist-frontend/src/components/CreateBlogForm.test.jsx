import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {vi} from 'vitest';
import CreateBlogForm from "./CreateBlogForm.jsx";
import {LOGGED_IN_USER_KEY} from "../hooks/useAuthenticate.js";
import {BlogContext} from "../context/BlogsContext.jsx";

describe('<CreateBlogForm />', () => {
  const user = userEvent.setup();
  const fetchBlogs = vi.fn();
  const postNewBlog = vi.fn();
  const onPostCreateSuccess = vi.fn();
  const onPostCreateError = vi.fn();

  beforeEach(() => {
    window.localStorage.setItem(LOGGED_IN_USER_KEY, '{"id": "test"}');
    render(
      <BlogContext value={{fetchBlogs, postNewBlog}}>
        <CreateBlogForm onPostCreateError={onPostCreateError} onPostCreateSuccess={onPostCreateSuccess}/>
      </BlogContext>);
  });

  afterEach(() => {
    window.localStorage.removeItem(LOGGED_IN_USER_KEY);
    fetchBlogs.mockClear();
    postNewBlog.mockClear();
    onPostCreateSuccess.mockClear();
    onPostCreateError.mockClear();
  });

  test('<CreateBlogForm /> calls the event handler it received from context ', async () => {
    const title = screen.getByLabelText(/Title/i);
    const author = screen.getByLabelText(/Author/i);
    const url = screen.getByLabelText(/URL/i);

    await user.type(title, 'title testing a form...');
    await user.type(author, 'author testing a form...');
    await user.type(url, 'url testing a form...');

    const createButton = screen.getByRole('button', {name: /create/i});
    await user.click(createButton);

    expect(onPostCreateSuccess).toBeCalledTimes(1);
    expect(onPostCreateError).not.toHaveBeenCalled();
    expect(postNewBlog.mock.calls).toHaveLength(1);
    expect(postNewBlog).toHaveBeenCalledWith({
      title: 'title testing a form...',
      author: 'author testing a form...',
      url: 'url testing a form...',
      user: 'test'
    });
    expect(fetchBlogs.mock.calls).toHaveLength(1);
    expect(title.value).toEqual('');
    expect(author.value).toEqual('');
    expect(url.value).toEqual('');
  });

  test('<CreateBlogForm /> throws error if the form is not filled in correctly', async () => {
    const blog = {
      title: '',
      author: "",
      url: "",
      user: "test"
    }

    postNewBlog.mockRejectedValue(new Error("400, bad request"))
    const title = screen.getByLabelText(/Title/i);
    const author = screen.getByLabelText(/Author/i);
    const url = screen.getByLabelText(/URL/i);

    await user.type(title, '..');

    const createButton = screen.getByRole('button', {name: /create/i});
    await user.click(createButton);

    expect(postNewBlog).toHaveBeenCalledWith({...blog, title: '..'});
    expect(onPostCreateError).toBeCalledTimes(1);
    expect(fetchBlogs).not.toHaveBeenCalled();

    await user.type(author, '...');
    await user.click(createButton);

    expect(postNewBlog).toHaveBeenCalledWith({...blog, author: '...'});
    expect(onPostCreateError).toBeCalledTimes(2);
    expect(fetchBlogs).not.toHaveBeenCalled();

    await user.type(url, '....');
    await user.click(createButton);

    expect(postNewBlog).toHaveBeenCalledWith({...blog, url: '....'});
    expect(onPostCreateError).toBeCalledTimes(3);
    expect(fetchBlogs).not.toHaveBeenCalled();
  });
});

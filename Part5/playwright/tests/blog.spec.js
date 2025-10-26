const { test, describe, expect, beforeEach, afterEach } = require('@playwright/test')

let blogs = [
  {
    title: "React patterns 100 likes",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 100
  },
  {
    title: "React patterns 50 like",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 50
  },
  {
    title: "React patterns 0 likes",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 0
  }
];

const createUser = async (page, request) => {
  await request.post('http://localhost:5173/api/users', {
    data: {
      name: 'Anna',
      username: 'test',
      password: 'test'
    }
  });
}

const login = async page => {
  await page.getByLabel('username').fill('test');
  await page.getByLabel('password').fill('test');
  await page.getByRole('button', {name: 'login'}).click();
}
const resetPage = async (request) => {
  await request.post('http://localhost:5173/api/testing/reset');
}

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await createUser(page, request);

    await page.goto('http://localhost:5173');
  });

  afterEach(async ({request}) => {
    await resetPage(request);
  });

  test('Login form is shown', async ({page}) => {
    const locator = page.getByText(/Log in to application/i);
    await expect(locator).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('test');
      await page.getByLabel('password').fill('test');

      await page.getByRole('button', {name: 'login'}).click();

      await expect(page.getByText('test is logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('test 1');
      await page.getByLabel('password').fill('test1');

      await page.getByRole('button', {name: 'login'}).click();

      await expect(page.getByText(/wrong credentials/i)).toBeVisible();
    });
  });

  describe('when logged in', () => {
    beforeEach(async ({page}) => login(page));

    test('a new blog can be created', async ({page}) => {
      const title = 'blog title';
      const author = 'test';

      await page.getByRole('button', {name: 'create new blog'}).click();
      await page.getByLabel(/title/i).fill(title);
      await page.getByLabel(/author/i).fill(author);
      await page.getByLabel(/url/i).fill('test');
      await page.getByRole('button', {name: /create/i}).click();

      await expect(page.getByText(`new ${title} blog was created successfully`)).toBeVisible();
      await expect(page.getByText(`${title} - ${author}`)).toBeVisible();
    });

    describe('when a blog is added', () => {
      beforeEach(async ({page}) => {
        await page.getByRole('button', {name: 'create new blog'}).click();
        await page.getByLabel(/title/i).fill('blog title');
        await page.getByLabel(/author/i).fill('test');
        await page.getByLabel(/url/i).fill('test');
        await page.getByRole('button', {name: /create/i}).click();
      });

      test('a blog can be liked', async ({page}) => {
        await page.getByRole('button', {name: /view/i}).click();

        await page.getByRole('button', {name: /like/i}).click();
        await expect(page.getByText(/likes: 1/i)).toBeVisible();
      });

      test('a blog can be deleted', async ({page}) => {
        await page.getByRole('button', {name: /view/i}).click();
        await page.getByRole('button', {name: /remove/i}).click();
        page.on('dialog', async dialog => {
          await dialog.accept();
          await expect(page.getByText(/blog title/i)).not.toBeVisible();
        });
      });

      describe('when a user who has no added blogs is logged in', () => {
        // Make a test that ensures that only the user who added the blog sees the blog's delete button.
        test('delete blog button is not visible', async ({page, request}) => {
          await request.post('http://localhost:5173/api/users', {
            data: {
              name: 'user with no blogs',
              username: 'noBlogsUser',
              password: 'noBlogsUser'
            }
          });

          await page.getByRole('button', {name: /logout/i}).click();

          await page.getByLabel('username').fill('noBlogsUser');
          await page.getByLabel('password').fill('noBlogsUser');

          await page.getByRole('button', {name: 'login'}).click();

          await page.getByRole('button', {name: /view/i}).click();

          await expect(page.getByText(/remove/i)).not.toBeVisible();
        });
      });
    });

  });
});

// Do a test that ensures that the blogs are arranged in the order
// according to the likes, the blog with the most likes first.
describe('Blogs page when the user is logged in and there are 3 blogs', () => {
  beforeEach(async ({page, request}) => {
    await page.goto('http://localhost:5173');

    await createUser(page, request);

    const response = await request.get('http://localhost:5173/api/users');
    const user = await response.json();

    blogs.forEach(blog => blog.user = user[0].id);

    await request.post('http://localhost:5173/api/testing/blogsMany', {
      data: blogs
    });

    await page.reload();
    await login(page);
  });

  afterEach(async ({request}) => {
    await resetPage(request);
  });

  test('user can see the blog with 100 likes at the top of the list', async ({page}) => {
    await page.getByRole('listitem').nth(0).getByRole('button', { name: 'View' }).click();
    await expect(page.getByText(/likes: 100/i)).toBeVisible();
  });

  test('user can see the blog with 50 like second blog .....', async ({page}) => {
    await page.getByRole('listitem').nth(1).getByRole('button', { name: 'View' }).click();
    await expect(page.getByText(/likes: 50/i)).toBeVisible();
  });

  test('user can see the blog with 0 likes at the bottom of the list', async ({page}) => {
    await page.getByRole('listitem').nth(2).getByRole('button', { name: 'View' }).click();
    await expect(page.getByText(/likes: 0/i)).toBeVisible();
  });
});

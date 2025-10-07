const assert = require('node:assert')
const {test, after, beforeEach, describe, afterEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')
const Blog = require('../models/blog')
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const api = supertest(app)

const getToken = async () => {
  const user = await User({
    username: 'test_user',
    name: 'test@example.com',
    passwordHash: 'password123',
  }).save();

  const userForToken = {
    username: user.username,
    id: user._id.toString(),
  };

  return jwt.sign(userForToken, process.env.SECRET, {expiresIn: '2 days'});
};

describe('when there is initially some blogs saved', () => {
  let token;

  beforeEach(async () => {
    await Blog.deleteMany({})
    token = await getToken();
    const user = await User.findOne({});

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog({...blog, user: user._id.toString()}));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray)
  });

  afterEach(async () => {
    await User.deleteMany({});
    token = null;
  });

  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const user = await User.findOne({});

    assert.deepEqual(response.body, helper.initialBlogs.map(blog => ({
      ...blog,
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
      }
    })));
  })

  test('created blog has unique id property', async () => {
    const newBlog = await helper.createdBlog();
    const response = await api.get('/api/blogs');

    const idsFromDb = response.body.map(blog => blog._id);

    assert.equal(idsFromDb.includes(newBlog._id.toString()), true)
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: "New React patterns",
        author: "New Michael Chan",
        user: "68de9313bae81c5913c424bb",
        url: "https://reactpatterns.com/",
        likes: 100,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const contents = blogsAtEnd.map(n => n.title)
      assert(contents.includes(newBlog.title))
    })

    test('succeeds with a valid data but without likes', async () => {
      const newBlog = {
        title: "11 React patterns",
        author: "11 Michael Chan",
        url: "https://reactpatterns.com/",
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const blogFromDb = blogsAtEnd.find(b => b.title === newBlog.title);

      assert.equal(blogFromDb.likes, 0)
    });

    test('failed without title', async () => {
      const blog = {
        author: "1 Edsger W. Dijkstra",
        url: "https://reactpatterns.com/",
        likes: 25,
      }

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)

      const blogs = await helper.blogsInDb()

      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    });

    test('failed without url', async () => {
      const blog = {
        title: "1 Go To Statement Considered Harmful",
        author: "1 Edsger W. Dijkstra",
        likes: 25,
      }

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)

      const blogs = await helper.blogsInDb()

      assert.strictEqual(blogs.length, helper.initialBlogs.length)
    });
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogToDelete = helper.initialBlogs[0];

      await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .send() // no blog needed?
        .expect(200)

      const dbBlogsAfterDeletion = await helper.blogsInDb()

      assert.strictEqual(dbBlogsAfterDeletion.length, helper.initialBlogs.length - 1)
      assert(!dbBlogsAfterDeletion.includes(blogToDelete))
    })

    test('fails with status code 400 if id is invalid', async () => {
      await api
        .delete(`/api/blogs/123`)
        .send()
        .expect(400)

      const dbBlogs = await helper.blogsInDb()

      assert.strictEqual(dbBlogs.length, helper.initialBlogs.length)
    })
  })

  describe('update of a new note', () => {
    test('succeeds with valid data', async () => {
      const blogToUpdate = helper.initialBlogs[0];
      blogToUpdate.title = 'Test blog title'

      await api
        .put(`/api/blogs/${blogToUpdate._id}`)
        .send(blogToUpdate)
        .expect(200)

      const dbBlogsAfterUpdate = await helper.blogsInDb()

      assert.strictEqual(dbBlogsAfterUpdate.length, helper.initialBlogs.length)
      assert(blogToUpdate.title, 'Test blog title')
    })
  })
  after(async () => {
    await mongoose.connection.close()
  })
})
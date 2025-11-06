const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {name: 1, username: 1});
  response.json(blogs)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const user = request.user;

  if (!user) {
    return response
      .status(400)
      .json({ error: 'userId missing or not valid' })
  }

  const id = request.params.id;

  if (!user.blogs.includes(id)) {
    return response
      .status(400)
      .json({ error: 'You are not authorized to delete this blog' })
  }

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id)
    response.json(deletedBlog).status(204)
  } catch (error) {
    response.status(400).json(error)
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const blog = new Blog({...request.body, user: request.body.user})
  console.log(request.body);

  const user = request.user;
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).json(error)
  }
})

blogRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
  const user = request.user;

  const id = request.params.id

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, request.body, {new: true});
    response.json(updatedBlog).status(204)
  } catch (error) {
    response.status(400).json(error)
  }
})

module.exports = blogRouter


// {
//   "author": "test",
//   "url": "https://",
//   "likes": "10",
//   "title": "testTitle",
//   "userId": "68de077407ee1e13a2aba616"
// }
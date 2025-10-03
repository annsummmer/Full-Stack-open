const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: [3, 'Blog title must be at least 3 characters long.'],
    required: [true, 'Blog title required']
  },
  author: {
    type: String,
    minLength: [3, 'Blog author must be at least 3 characters long.'],
  },
  url: {
    type: String,
    required: [true, 'Blog url required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Blog', blogSchema)
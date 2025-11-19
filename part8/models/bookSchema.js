const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number, // or string
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [{ type: String }]
});


booksSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

booksSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', booksSchema);
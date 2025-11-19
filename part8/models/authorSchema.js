const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  booksCount: {
    type: Number
  },
  born: {
    type: Number,
  }
});

authorsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

authorsSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Author', authorsSchema);
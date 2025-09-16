const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

mongoose.set('strictQuery',false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', noteSchema);

const person = new Person({
  name: 'Miia',
  number: '+380632671662',
})

// person.save().then(result => {
//   console.log('person saved!', result)
//   mongoose.connection.close();
// })

Person.find({name: 'Miia'}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})
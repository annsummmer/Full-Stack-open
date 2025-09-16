require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'))

app.use(morgan('tiny'));

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log(persons);
    response.json(persons)
  })
});

app.get('/info', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end(`Phonebook has info for ${persons.length} people. \n${new Date().toString()}`);
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
  .catch(error => {
    console.log(error);
    response.status(400).send({ error: 'malformatted id' })
  })
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id === id);

  response.status(204).end();
});


app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson)
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
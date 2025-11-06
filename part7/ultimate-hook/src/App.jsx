import { useState, useEffect } from 'react'
import axios from 'axios';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const clear = () => {
    setValue('');
  }

  return [{
    type,
    value,
    onChange,
  }, clear];
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  const getResources = async () => {
    const { data: currentResources } = await axios.get(baseUrl);
    setResources(currentResources);
  };

  useEffect(() => {
    getResources();
    }, []
  )

  const create = async (resource) => {

    const response = await axios.post(baseUrl, resource);
    getResources();
    return response.data;
  };

  const service = {
    create
  };

  return [
    resources, service
  ]
}

const App = () => {
  const [contentProps, contentClear] = useField('text');
  const [nameProps, nameClear] = useField('text');
  const [numberProps, numberClear] = useField('text');

  const [notes, noteService] = useResource('http://localhost:3005/notes');
  const [persons, personService] = useResource('http://localhost:3005/persons');

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: contentProps.value });
    contentClear();
  };
 
  const handlePersonSubmit = (event) => {
    event.preventDefault();
    nameClear();
    numberClear();
    personService.create({ name: nameProps.value, number: numberProps.value});
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...contentProps} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...nameProps} /> <br/>
        number <input {...numberProps} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App;
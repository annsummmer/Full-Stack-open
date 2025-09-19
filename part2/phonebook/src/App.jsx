import {useEffect, useState} from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import personsService from "./services/personsService.js";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState({text: '', status: ''});

  useEffect(() => {
    personsService.getAll()
      .then(response => setPersons(response));
  }, []);

  const addPerson = (e) => {
    e.preventDefault();
    const existing = persons.find(persons => persons.name === newName);
    if (existing) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        console.log({...existing, number: newNumber});
        personsService.update({...existing, number: newNumber})
          .then((updatedPerson) => {
            console.log(updatedPerson)
            setPersons(persons.map(p => p.id === existing.id ? updatedPerson : p));
            showMessage(`${updatedPerson.name} - ${updatedPerson.number} was updated in the phonebook`, 'success');
            clearInputs();
          });
      }
    } else {
      personsService.create({name: newName, number: newNumber})
        .then(addedPerson => {
          setPersons([...persons, addedPerson]);
          showMessage(`${addedPerson.name} - ${addedPerson.number} was added to the phonebook`, 'success');
          clearInputs();
        }).catch(error => {
          showMessage(`${error.response.data}`, 'error');
      });
    }
  }

  const deletePerson = (person) => {
    if (confirm(`delete ${person.name}?`)) {
      personsService.deletePerson(person.id)
        .then(deletedPerson => {
          const updatedPersons = persons.filter(person => person.id !== deletedPerson.id);
          setPersons(updatedPersons);
        });
    }
  }

  const clearInputs = () => {
    setNewName('');
    setNewNumber('');
  }

  const showMessage = (msg, status) => {
    if (status === 'success') {
      setNotificationMessage({text: msg, status: 'success'});
    } else if (status === 'error') {
      setNotificationMessage({text: msg, status: 'error'});
    }

    setTimeout(() => {
      setNotificationMessage({text: '', status: ''});
    }, 3000);
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        onFilterChange={handleFilterChange}
        filterVal={filter}
      />
      <h2>Add a new</h2>
      <Notification message={notificationMessage}/>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterVal={filter}
        onDeletePerson={deletePerson}
      />
    </div>
  );
}

export default App
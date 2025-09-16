const Persons = ({persons, filterVal, onDeletePerson}) => {
  console.log(persons)
  return (<ul>
    { persons.filter(person => person.name.toLowerCase().includes(filterVal.toLowerCase())).map(
      (person) => {
        return (<li key={person.id}>
          {person.name} - {person.number} &nbsp;
          <button onClick={() => onDeletePerson(person)}>delete</button>
        </li>)
      })
    }
  </ul>);
}

export default Persons;
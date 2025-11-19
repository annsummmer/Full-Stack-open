import {useState} from "react";
import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";
import {ALL_AUTHORS} from "../App.jsx";

const UPDATE_BIRTHYEAR = gql`
mutation editAuthor($author: EditAuthorInput!) {
  editAuthor(author: $author) {
    name
    born
  }
}
`

const Authors = ({ show, result }) => {
  const [born, setBorn] = useState('');
  const [name, setName] = useState('');
  const [author, setAuthor] = useState();

  const [ updateAuthor ] = useMutation(UPDATE_BIRTHYEAR,  {
    refetchQueries: [
      { query: ALL_AUTHORS },
      'allAuthors',
    ]
  });

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors;

  const submit = (e) => {
    e.preventDefault();

    const variables = {
      author: {name, born: Number(born)}
    }

    updateAuthor({variables});
    setAuthor(null);
  }

  const edit = (author) => {
    setAuthor(author);
    setBorn(author.born);
    setName(author.name);
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born} <button onClick={() => edit(a)}>Edit </button></td>
              <td>{a.booksCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {author && <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
        <div>name: {name}</div>
        <div>
          born
          <input
            type="number"
            value={born || ''}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
        </form>
      </div>}
    </div>
  )
}

export default Authors

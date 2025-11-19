import { useState } from 'react';
import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";
import Notify from "./Notify.jsx";

const CREATE_BOOK = gql`
mutation AddBook($book: AddBookInput!) {
  addBook(book: $book) {
    title
    published
    author {
      booksCount
      born
      id
      name
    }
    id
    genres
  }
}
`

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (err) => {
      setErrorMessage(err.message);
    }
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    const variables = {
      book: {
        title,
        published: Number(published),
        author,
        genres
      }
    }

    createBook({ variables });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  }

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
};

export default NewBook;
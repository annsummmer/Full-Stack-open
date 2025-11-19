import {gql} from "@apollo/client";
import {useQuery} from "@apollo/client/react";

const ALL_BOOKS = gql`
  query ($genre: String) {
    allBooks (genre: $genre) {
      books {
        author {
          name
        }
        genres
        published
        title
      }    
      genres
    }
  }
`

const Books = ({ show }) => {

  const {data, loading, refetch} = useQuery(ALL_BOOKS, {
    pollInterval: 10000
  });

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>
  }

  const books = data.allBooks.books;
  const genres = data.allBooks.genres;

  const filterBooksByGenre = (genre) => {
    refetch({ genre } );
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      <div>Filter by Genre:
        <ul>
          {Array.from(genres).map(genre => (
            <li key={genre}><button onClick={() => filterBooksByGenre(genre)}>{genre}</button></li>
          ))}
        </ul></div>
    </div>
  )
}

export default Books

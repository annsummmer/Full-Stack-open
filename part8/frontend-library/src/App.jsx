import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import {gql} from "@apollo/client";
import {useApolloClient, useQuery} from "@apollo/client/react";
import Login from "./components/login.jsx";
import Notify from "./components/Notify.jsx";

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name,
      id,
      born,
      booksCount
    }
  }
`

const App = () => {
  const [page, setPage] = useState("authors");
  const result = useQuery(ALL_AUTHORS, {pollInterval: 10000});
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.removeItem("user-token");
    client.resetStore();
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <Login setToken={setToken} setError={setErrorMessage}/>
      </>
    )
  }


  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors result={result} show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

    </div>
  );
};

export default App;

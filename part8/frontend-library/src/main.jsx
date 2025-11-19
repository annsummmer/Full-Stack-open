import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {ApolloClient, gql, HttpLink, InMemoryCache} from "@apollo/client";
import {ApolloProvider} from "@apollo/client/react";
import {SetContextLink} from "@apollo/client/link/context";

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('user-token');
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});



const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: 'http://localhost:4000'})),
  cache: new InMemoryCache(),
});

const query = gql`
  query {
    allAuthors  {
      name,
      id,
      born
    }
  }
`

client.query({ query })
  .then((response) => {
    console.log(response.data);
  });

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);

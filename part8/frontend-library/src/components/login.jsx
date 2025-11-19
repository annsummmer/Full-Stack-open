import {useEffect, useState} from 'react';
import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";

const LOGIN = gql`
mutation Login($username: String! $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

const Login = ({setError, setToken}) => {
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.message);
    }
  });

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('user-token', token);
      setError('');
    }
  }, [result.data]);


  const submit = (e) => {
    e.preventDefault();

    login({variables: {username, password}});
  }

  return <form onSubmit={submit}>
    <div>
      name
      <input
        value={username}
        onChange={({ target }) => setUserName(target.value)}
      />
    </div>
    <div>
      password
      <input
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>
};

export default Login;
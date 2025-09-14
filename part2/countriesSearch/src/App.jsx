import {useEffect, useState} from "react";

import axios from 'axios';
import CountryDetails from "./components/CountryDetails.jsx";
import CountriesList from "./components/CountriesList.jsx";

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';

const get = () => {
  const request = axios.get(`${baseUrl}`);
  return request.then(response => response.data);
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    get().then(response => setCountries(response));
  }, []);

  const handleTermChange = (e) => {
    const newValue = e.target.value;
    setTerm(newValue);
  }

  const filteredCountries = countries.filter(country => country.name.official.toLowerCase().includes(term.toLowerCase()));

  return (
    <>
      <h1>Countries search:</h1>
      <label>
        find countries <input value={term} onChange={handleTermChange} name="termInput"/>
      </label>
      <div>
        {
          filteredCountries.length === 1
            ? <CountryDetails key={term} country={filteredCountries[0]}/>
            : <CountriesList countries={filteredCountries}/>
        }
      </div>
    </>
  );
}

export default App
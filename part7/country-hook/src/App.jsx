import React, {useState, useEffect} from 'react';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (!name) {
      return;
    }

    let canceled = false;

    const getCountry = async () => {
      try {
        const response = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`);
        if (canceled) {
          return;
        }

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        const foundCountry = {
          name: data.name.common,
          capital: data.capital[0],
          population: data.population,
          flag: data.flag,
        }
        setCountry(foundCountry);
      } catch (error) {
        setCountry({});
        console.error(error.message);
      }
    }

    getCountry();

    return () => {
      canceled = true;
    }

  }, [name]);

  return country;
}

const Country = ({country}) => {
  if (!country.name) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.name} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div>
      <div>flag {country.flag}</div>
    </div>
  )
}

const App = () => {
  const nameInputProps = useField('text');
  const [countryName, setCountryName] = useState('');
  const country = useCountry(countryName);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCountryName(nameInputProps.value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input {...nameInputProps} />
        <button>find</button>
      </form>

      {country && <Country country={country}/>}
    </div>
  )
}

export default App
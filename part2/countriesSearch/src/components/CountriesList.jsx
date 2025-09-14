import CountryDetails from "./CountryDetails.jsx";
import {useState} from "react";

const CountriesList = ({countries}) => {
  const [countryToShow, setCountryToShow] = useState(null);
  console.log(countryToShow) // going back bug

  if (countries.length > 10) {
    return 'too many matches, specify another term';
  }

  if (countryToShow) {
    return (<CountryDetails country={countryToShow}/>);
  }

  return (
    <ul>{
      countries.map(
        (country) => {
          return (
            <li key={country.name.official}>
              {country.name.official} &nbsp;
              <button onClick={() => setCountryToShow(country)}>show</button>
            </li>
          );
        })
    }</ul>
  );
}

export default CountriesList;
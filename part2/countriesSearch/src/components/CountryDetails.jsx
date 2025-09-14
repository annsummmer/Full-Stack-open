const CountryDetails = ({country}) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <img alt={country.flags.alt} src={`https://flagcdn.com/w320/${country.cca2?.toLowerCase()}.png` || ''} />
      <h3>Languages</h3>
      <ul>{Object.keys(country.languages).map(
        lang => <li key={country.languages[lang]}>{country.languages[lang]}</li>)
      }</ul>
    </>
  )
}

export default CountryDetails;
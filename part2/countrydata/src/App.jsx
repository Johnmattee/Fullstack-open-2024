import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSelectedCountry(null);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div>
        find countries: <input value={filter} onChange={handleFilterChange} />
      </div>
      <CountryList
        countries={filteredCountries}
        setSelectedCountry={setSelectedCountry}
      />
      {selectedCountry && <CountryDetail country={selectedCountry} />}
    </div>
  );
};

const CountryList = ({ countries, setSelectedCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />;
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.cca3}>
          {country.name.common}
          <button onClick={() => setSelectedCountry(country)}>show</button>
        </li>
      ))}
    </ul>
  );
};

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="100"
      />
    </div>
  );
};

export default App;

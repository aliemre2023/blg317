import React, { useState, useEffect } from "react";
import "./styles.css"
function Countries() {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/countries")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div class="container">
        <h1>Countries</h1>
        <div class="search-bar" action="{{ url_for('countries') }}" method="get"> 
            <input type="text" name="query" placeholder="Search..." value=""></input>
            <img class="search-icon" src=" url_for(images/search-icon.png" alt="search icon"></img>
        </div>
        <div class="flag-grid">
            {countries.map((country,index) => (
              <div class="flag-card">
                <img
              src={country.flag_link}
              alt={`Flag of ${country.name}`}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://image.milimaj.com/i/milliyet/75/869x477/5c8d865a45d2a05010d80795.jpg';
              }}
            />
                <p>{ country.name }</p>
            </div>
            ))}
            
        </div>
    </div>
  );
}
export default Countries;
import React, { useState, useEffect } from "react";
import "./styles.css"
function Countries() {
  const [countries, setCountries] = useState([]);

  const [tempText, setTempText] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event) => {
    setTempText(event.target.value)
  };

  const searchFlags = () => {
    setSearchText(tempText.trim());
  }
  
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/countries?name=${searchText}`)
      .then((response) => response.json())
      .then((data) => {
        setTotalPages(data.total_pages);
        setCountries(data.countries);
      })
      .catch((error) => console.log(error));
  }, [searchText]);


  return (
    <div class="container">
        <div class="top">
        <h1>Countries</h1>
        <div class="search-bar"> 
            <input type="text" name="query" placeholder="Search..." value={`${tempText}`} onChange={handleInputChange}></input>
            <img class="search-icon" src="/search-icon.png" alt="search icon" onClick={searchFlags}></img>
        </div>
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
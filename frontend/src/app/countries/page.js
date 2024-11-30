'use client';

import './styles.css';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { useRouter } from 'next/navigation';

function Countries() {
    const router = useRouter();

    const [teamCounts, setTeamCounts] = useState([]); // Correct state definition
    const [playerCounts, setPlayerCounts] = useState([]);

    const [countries, setCountries] = useState([]);
    const [totalCountries, setTotalCountries] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [tempText, setTempText] = useState('');

    const handleInputChange = (event) => {
        const value = event.target.value;
        setTempText(value);

        clearTimeout(window.searchDebounce); // clear debounce
        window.searchDebounce = setTimeout(() => {
            setSearchText(value.trim());
            setCurrentPage(1);
        }, 300); // delay
    };

    const searchFlags = () => {
        setCurrentPage(1);
        setSearchText(tempText.trim());
    };

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/countries?page=${currentPage}&name=${searchText}`)
            .then((response) => response.json())
            .then((data) => {
                setTotalCountries(data.total_countries);
                setCountries(data.countries);
            })
            .catch((error) => console.log(error));
    }, [currentPage, searchText]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/numberOfTeams')
            .then((response) => response.json())
            .then((data) => {
                //console.log(data); // Debugging
                setTeamCounts(data.numberOfTeams);
            })
            .catch((error) => console.log(error));

        fetch('http://127.0.0.1:5000/api/numberOfPlayers')
            .then((response) => response.json())
            .then((data) => {
                //console.log(data); // Debugging
                setPlayerCounts(data.numberOfPlayers);
            })
            .catch((error) => console.log(error));
    }, []);

    const getTeamCount = (countryId) => {
        const countryData = teamCounts.find((team) => team.country_id === countryId);
        return countryData ? countryData.team_count : 0;
    };

    const getPlayerCount = (countryId) => {
        const countryData = playerCounts.find((player) => player.country_id === countryId);
        return countryData ? countryData.player_count : 0;
    };

    return (
        <div className="container">
            <div className="top">
                <div className="grid mt-1 mx-auto w-10 bg-primary-reverse">
                    <div className="col-4 md:col-2">
                        <Button
                            className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                            onClick={() => {
                                router.replace('/');
                            }}
                            label="Home"
                        >
                            {' '}
                        </Button>
                    </div>
                    <div className="col-4 md:col-8">
                        <div className="text-center p-3 border-round-sm font-bold">COUNTRIES</div>  
                    </div>
                    <div className="col-4 md:col-2"></div>
                </div>
                <div className="search_bar mt-3">
                    <InputText
                        className="p-inputtext-sm"
                        name="query"
                        placeholder="Search..."
                        onChange={handleInputChange}
                    />
                    <i className="search_icon fa-solid fa-magnifying-glass" onClick={searchFlags}></i>
                </div>
            </div>
            <div className="flag_grid">
                {countries.map((country, index) => (
                    <div
                        className="flag_card"
                        key={index}
                        onClick={() => {
                            router.push(`countries/${country.country_id}`);
                        }}
                    >
                        <img
                            src={country.flag_link}
                            alt={`Flag of ${country.name}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    'https://image.milimaj.com/i/milliyet/75/869x477/5c8d865a45d2a05010d80795.jpg';
                            }}
                        />
                        <p>{country.name}</p>
                        <div className="country_info">
                            <div className="icon_container">
                                <span>{getTeamCount(country.country_id)}</span>
                                <img src="/default_team.png" alt="Team Icon" className="iconSize" />
                            </div>

                            <div className="icon_container">
                                <img src="/default_player.png" alt="Player Icon" className="iconSize" />
                                <span>{getPlayerCount(country.country_id)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Paginator
                className="pagination w-full"
                style={{ bottom: 0 }}
                first={firstIndex}
                rows={24}
                totalRecords={totalCountries}
                onPageChange={(e) => {
                    setFirstIndex(e.first);
                    setCurrentPage(e.page + 1);
                }}
            ></Paginator>
        </div>
    );
}

export default Countries;

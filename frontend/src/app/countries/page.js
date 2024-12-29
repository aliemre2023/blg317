'use client';

import React, { useState, useEffect } from 'react';
import GridView from '@/components/GridView';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
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
            .then((response) => {
                const data = response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Unknown error');
                }
                return data;
            })
            .then((data) => {
                setTotalCountries(data.total_countries);
                setCountries(data.countries);
            })
            .catch((error) => console.log(error));
    }, [currentPage, searchText]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/numberOfTeams')
            .then((response) => {
                const data = response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Unknown error');
                }
                return data;
            })
            .then((data) => {
                //console.log(data); // Debugging
                setTeamCounts(data.numberOfTeams);
            })
            .catch((error) => console.log(error));

        fetch('http://127.0.0.1:5000/api/numberOfPlayers')
            .then((response) => {
                const data = response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Unknown error');
                }
                return data;
            })
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

    const gridCardTemplate = (options) => {
        return (
            <div
                className="grid-card"
                key={options.country_id}
                onClick={() => {
                    router.push(`countries/${options.country_id}`);
                }}
            >
                <img
                    src={options.flag_link}
                    alt={`Flag of ${options.name}`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://image.milimaj.com/i/milliyet/75/869x477/5c8d865a45d2a05010d80795.jpg';
                    }}
                />
                <p>{options.name}</p>
                <div className="country-info">
                    <div className="icon-container">
                        <span>{getTeamCount(options.country_id)}</span>
                        <img src="/default_team.png" alt="Team Icon" className="iconSize" />
                    </div>

                    <div className="icon-container">
                        <img src="/default_player.png" alt="Player Icon" className="iconSize" />
                        <span>{getPlayerCount(options.country_id)}</span>
                    </div>
                </div>
            </div>
        );
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
                <div className="search-bar mt-3">
                    <InputText
                        className="p-inputtext-sm"
                        name="query"
                        placeholder="Search..."
                        onChange={handleInputChange}
                    />
                    <i className="search-icon fa-solid fa-magnifying-glass" onClick={searchFlags}></i>
                </div>
            </div>
            <GridView
                data={countries}
                totalRecords={totalCountries}
                first={firstIndex}
                setFirst={setFirstIndex}
                setCurrentPage={setCurrentPage}
                gridCardTemplate={gridCardTemplate}
                noMatchMessage={'No countries match your search.'}
            />
        </div>
    );
}

export default Countries;

'use client';

import './styles.scss';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { useRouter } from 'next/navigation';

function Teams() {
    const router = useRouter();

    const [teams, setTeams] = useState([]);
    const [totalTeams, setTotalTeams] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [tempText, setTempText] = useState('');

    // debounce logic
    const handleInputChange = (event) => {
        const value = event.target.value;
        setTempText(value);

        clearTimeout(window.searchDebounce);
        window.searchDebounce = setTimeout(() => {
            setSearchText(value.trim());
            setCurrentPage(1);
        }, 300); // delay
    };

    const searchTeams = () => {
        setCurrentPage(1);
        setSearchText(tempText.trim());
    };

    // Fetch teams based on search and pagination
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/teams?page=${currentPage}&nickname=${searchText}`)
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                setTotalTeams(data.total_teams);
                setTeams(data.teams);
            })
            .catch((error) => console.log('Error fetching teams:', error));
    }, [currentPage, searchText]);

    return (
        <div className="container">
            <div className="top">
                <div className="grid mt-1 mx-auto w-10 bg-primary-reverse">
                    <div className="col-4 md:col-2">
                        <Button
                            className="mt-0 bg-primary h-full w-full font-bold text-center"
                            onClick={() => {
                                router.replace('/');
                            }}
                            label="Home"
                        />
                    </div>
                    <div className="col-4 md:col-8">
                        <div className="text-center p-3 border-round-sm font-bold">TEAMS</div>
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
                    <i className="search-icon fa-solid fa-magnifying-glass" onClick={searchTeams}></i>
                </div>
            </div>
            <div className="grid-view">
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <div
                            className="grid-card"
                            key={team.team_id}
                            onClick={() => {
                                router.push(`teams/${team.team_id}`);
                            }}
                        >
                            <img
                                src={team.logo_url}
                                alt={`Logo of ${team.nickname}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/null_team.png';
                                }}
                            />
                            <div>{team.nickname}</div>
                        </div>
                    ))
                ) : (
                    <p>No teams match your search.</p>
                )}
            </div>
            <Paginator
                className="pagination w-full"
                style={{ bottom: 0 }}
                first={firstIndex}
                rows={24}
                totalRecords={totalTeams}
                onPageChange={(e) => {
                    setFirstIndex(e.first);
                    setCurrentPage(e.page + 1);
                }}
            ></Paginator>
        </div>
    );
}

export default Teams;

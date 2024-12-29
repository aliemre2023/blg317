'use client';

import React, { useState, useEffect } from 'react';
import GridView from '@/components/GridView';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
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
            .then((response) => {
                const data = response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Unknown error');
                }
                return data;
            })
            .then((data) => {
                // console.log(data);
                setTotalTeams(data.total_teams);
                setTeams(data.teams);
            })
            .catch((error) => console.log('Error fetching teams:', error));
    }, [currentPage, searchText]);

    const gridCardTemplate = (options) => {
        return (
            <div
                className="grid-card"
                key={options.team_id}
                onClick={() => {
                    router.push(`teams/${options.team_id}`);
                }}
            >
                <img
                    src={options.logo_url}
                    alt={`Logo of ${options.nickname}`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/null_team.png';
                    }}
                />
                <div>{options.nickname}</div>
            </div>
        );
    };

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
            <GridView
                data={teams}
                totalRecords={totalTeams}
                first={firstIndex}
                setFirst={setFirstIndex}
                setCurrentPage={setCurrentPage}
                gridCardTemplate={gridCardTemplate}
                noMatchMessage={'No teams match your search.'}
            />
        </div>
    );
}

export default Teams;

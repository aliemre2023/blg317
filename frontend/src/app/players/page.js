'use client';

import React, { useState, useEffect } from 'react';
import GridView from '@/components/GridView';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';

function Players() {
    const router = useRouter();

    const [players, setPlayers] = useState([]);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [tempText, setTempText] = useState('');
    const [isActive, setIsActive] = useState(false);

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

    const searchPlayers = () => {
        setCurrentPage(1);
        setSearchText(tempText.trim());
    };

    const activePlayersCheckbox = (e) => {
        setIsActive(e.checked);
    }

    // Fetch players based on search and pagination
    useEffect(() => {
        let url = `http://127.0.0.1:5000/api/players?page=${currentPage}&name=${searchText}`;
        if (isActive) {
            url += "&is_active=1";
        }
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setTotalPlayers(data.total_players);
                setPlayers(data.players);
            })
            .catch((error) => console.log('Error fetching players:', error));
    }, [currentPage, searchText, isActive]);

    const gridCardTemplate = (options) => {
        return (
            <div
                className="grid-card"
                key={options.player_id}
                onClick={() => {
                    router.push(`/players/${options.player_id}`);
                }}
            >
                <div>
                    <img
                        src={'/player_images/' + options.png_name}
                        alt={`image of ${options.player_id}`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/null_player.jpg';
                        }}
                    />
                    <div>{`${options.first_name} ${options.last_name}`}</div>
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
                            className="mt-0 bg-primary h-full w-full font-bold text-center"
                            onClick={() => {
                                router.replace('/');
                            }}
                            label="Home"
                        />
                    </div>
                    <div className="col-4 md:col-8">
                        <div className="text-center p-3 border-round-sm font-bold">PLAYERS</div>
                    </div>
                    <div className="col-4 md:col-2"></div>
                </div>
                <div className="search-bar mt-3">
                    <div className='align-items-center items-center mr-4'>
                        <div className='text-xs bg-primary -mb-2'>Only Active</div>

                        <Checkbox
                            className = "bg-reverse"
                            inputId="isActive"
                            checked={isActive}
                            onChange={activePlayersCheckbox}
                            label="Active Players"
                        />
                        
                    </div>
                    <InputText
                        className="p-inputtext-sm"
                        name="query"
                        placeholder="Search..."
                        onChange={handleInputChange}
                    />
                    <i className="search-icon fa-solid fa-magnifying-glass" onClick={searchPlayers}></i>
                </div>
            </div>
            <GridView
                data={players}
                totalRecords={totalPlayers}
                first={firstIndex}
                setFirst={setFirstIndex}
                setCurrentPage={setCurrentPage}
                gridCardTemplate={gridCardTemplate}
                noMatchMessage={'No players match your search.'}
            />
        </div>
    );
}

export default Players;

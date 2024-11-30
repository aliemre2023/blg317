'use client';

import './styles.css';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { useRouter } from 'next/navigation';

function Players() {
    const router = useRouter();

    const [players, setPlayers] = useState([]);
    const [totalPlayers, setTotalPlayers] = useState(0);
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

    const searchPlayers = () => {
        setCurrentPage(1);
        setSearchText(tempText.trim());
    };

    // Fetch players based on search and pagination
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/players?page=${currentPage}&name=${searchText}`)
            .then((response) => response.json())
            .then((data) => {
                setTotalPlayers(data.total_players);
                setPlayers(data.players);
            })
            .catch((error) => console.log('Error fetching players:', error));
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
                        <div className="text-center p-3 border-round-sm font-bold">PLAYERS</div>
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
                    <i className="search_icon fa-solid fa-magnifying-glass" onClick={searchPlayers}></i>
                </div>
            </div>
            <div className="player_grid">
                {players.length > 0 ? (
                    players.map((player) => (
                        <div className="player_card" key={player.player_id}>
                            <div className="player_details">
                                <img
                                    src={"/player_images/" + player.png_name}
                                    alt={`image of ${player.player_id}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/null_player.jpg';
                                    }}
                                />
                                <div>{`${player.first_name} ${player.last_name}`}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No players match your search.</p>
                )}
            </div>
            <Paginator
                className="pagination w-full"
                style={{ bottom: 0 }}
                first={firstIndex}
                rows={24}
                totalRecords={totalPlayers}
                onPageChange={(e) => {
                    setFirstIndex(e.first);
                    setCurrentPage(e.page + 1);
                }}
            ></Paginator>
        </div>
    );
}

export default Players;

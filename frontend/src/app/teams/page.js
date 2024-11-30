'use client';

import styles from '../page.module.css';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

function Teams() {
    const router = useRouter();
    const [teams, setTeams] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [tempText, setTempText] = useState('');
    const [searchText, setSearchText] = useState('');

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const handlePreviousClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

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

    // Fetch teams based on search and pagination
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/teams?page=${currentPage}&nickname=${searchText}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setTotalPages(data.total_pages);
                setTeams(data.teams);
            })
            .catch((error) => console.log('Error fetching teams:', error));
    }, [currentPage, searchText]);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
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
                <div className={styles.search_bar}>
                    <input
                        type="text"
                        name="query"
                        placeholder="Search Teams..."
                        value={tempText}
                        onChange={handleInputChange}
                    />
                    <img
                        className={styles.search_icon}
                        src="/search-icon.png"
                        alt="search icon"
                        onClick={() => setSearchText(tempText.trim())} // Trigger search on click
                    />
                </div>
            </div>
            <div className={styles.flag_grid}>
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <div className={styles.flag_card} key={team.team_id}>
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
            <div className={styles.pagination}>
                <button disabled={currentPage === 1} onClick={handlePreviousClick}>
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => handlePageClick(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <button disabled={currentPage === totalPages} onClick={handleNextClick}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Teams;

'use client';

import styles from './page.module.css';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

function Countries() {
    const [countries, setCountries] = useState([]);

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

    const handleInputChange = (event) => {
        setTempText(event.target.value);
    };

    const searchFlags = () => {
        setCurrentPage(1);
        setSearchText(tempText.trim());
    };

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/countries?page=${currentPage}&name=${searchText}`)
            .then((response) => response.json())
            .then((data) => {
                setTotalPages(data.total_pages);
                setCountries(data.countries);
            })
            .catch((error) => console.log(error));
    }, [currentPage, searchText]);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <h1>Countries</h1>
                <div className={styles.search_bar}>
                    <input
                        type="text"
                        name="query"
                        placeholder="Search..."
                        value={`${tempText}`}
                        onChange={handleInputChange}
                    ></input>
                    <Image
                        className={styles.search_icon}
                        src="/search-icon.png"
                        alt="search icon"
                        onClick={searchFlags}
                    ></Image>
                </div>
            </div>
            <div className={styles.flag_grid}>
                {countries.map((country, index) => (
                    <div className={styles.flag_card} key={index}>
                        <Image
                            src={country.flag_link}
                            alt={`Flag of ${country.name}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    'https://image.milimaj.com/i/milliyet/75/869x477/5c8d865a45d2a05010d80795.jpg';
                            }}
                        />
                        <p>{country.name}</p>
                    </div>
                ))}
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

                <button className={styles.button} disabled={currentPage === totalPages} onClick={handleNextClick}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Countries;

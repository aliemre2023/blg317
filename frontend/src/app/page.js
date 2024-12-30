'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';

function Page() {
    const router = useRouter();
    const [lastGames, setLastGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quote, setQuote] = useState({});

    useEffect(() => {
        // Fetch the last games from the API
        fetch('http://127.0.0.1:5000/api/getLastGames') // Adjust API endpoint if necessary
            .then((response) => {
                const data = response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Unknown error');
                }
                return data;
            })
            .then((data) => {
                setLastGames(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching last games:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/randomQuote')
            .then((response) => {
                const data = response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Unknown error');
                }
                return data;
            })
            .then((data) => {
                // console.log(data.quote[0])
                setQuote(data.quote[0])
                // console.log(quote)
            })
            .catch((error) => {
                console.error('Quote Fetching Error', error);
            });
    }, []);

    const handleClick_player = (player_id) => {
        router.push(`/players/${player_id}`);
    };

    const handleClick_game = (game_id) => {
        router.push(`/games/${game_id}`);
    };

    return (
        <div className="h-auto">
            <div className="grid mt-1 w-full bg-primary">
                <div className="col-8 col-offset-2">
                    <div className="text-center p-3 border-round-sm font-bold">NBA-DATABASE PROJECT</div>
                </div>
            </div>
            <div className="grid mt-0 w-10 mx-auto bg-primary-reverse">
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/countries');
                        }}
                        label="Countries"
                    />
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/teams');
                        }}
                        label="Teams"
                    />
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/players');
                        }}
                        label="Players"
                    />
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/games');
                        }}
                        label="Games"
                    />
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/admin/signup');
                        }}
                        label="SignUp"
                    />
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/admin/login');
                        }}
                        label="LogIn"
                    />
                </div>
            </div>
            <div className="lg:flex h-auto mt-2 w-10 mx-auto justify-content-center align-content-center fadeindown animation-ease-in animation-duration-1000 surface-ground pl-2 pt-2 pb-2 pr-2">
                <div className="lg:col-4 md:col-8 sm:col-8 my-auto mx-auto bg-primary border-2 border-yellow-300 p-4 border-round-md">
                    <img
                        className="w-full h-40 object-cover rounded-lg mb-4 bg-primary-reverse border-round-md cursor-pointer"
                        src={'player_images/' + quote.png_name}
                        alt={quote.player_name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/coolface.png';
                        }}
                        onClick={() => handleClick_player(quote.player_id)}
                    />
                    <p className="w-full text-center text-xl font-semibold">"{quote.quote}"</p>
                    <p className="w-full text-center text-lg bg-primary-reverse mt-2 border-round-md">
                        - {quote.player_name}
                    </p>
                </div>
                <div className="lg:col-8">
                    <h2 className="text-4xl mb-4 text-center">Last 5 Games</h2>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <table className="table-auto border-collapse border border-gray-300 w-full">
                            <thead>
                                <tr className="bg-primary-reverse text-center">
                                    <th className="border border-gray-300 col-2 py-2">Date</th>
                                    <th className="border border-gray-300 col-2 py-2">Home Team</th>
                                    <th className="border border-gray-300 col-2 py-2">Score</th>
                                    <th className="border border-gray-300 col-2 py-2">Away Team</th>
                                    <th className="border border-gray-300 col-2 py-2">Official</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lastGames.map((game) => (
                                    <tr
                                        key={game.game_id}
                                        className="text-center cursor-pointer"
                                        onClick={() => handleClick_game(game.game_id)}
                                    >
                                        <td className="border border-gray-300 col-2 py-2">{game.date.split(' ')[0]}</td>
                                        <td className="border border-gray-300 col-2 py-2">{game.home_team_name}</td>
                                        <td className="border border-gray-300 col-2 py-2">
                                            {game.home_team_score} - {game.away_team_score}
                                        </td>
                                        <td className="border border-gray-300 col-2 py-2">{game.away_team_name}</td>
                                        <td className="border border-gray-300 col-2 py-2">{game.official_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page;

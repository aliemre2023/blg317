'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';

function Page() {
    const router = useRouter();
    const [lastGames, setLastGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the last games from the API
        fetch('http://localhost:5000/api/getLastGames') // Adjust API endpoint if necessary
            .then((response) => response.json())
            .then((data) => {
                setLastGames(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching last games:', error);
                setLoading(false);
            });
    }, []);

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
                            router.push('/countries');
                        }}
                        label="Countries"
                    />
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/countries');
                        }}
                        label="Countries"
                    />
                </div>
                <div className="mt-0 py-1 col-12 lg:col-4">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/countries');
                        }}
                        label="Countries"
                    />
                </div>
            </div>
            <div className="prime-flex h-30rem mt-2 w-10 mx-auto justify-content-center align-content-center fadeindown animation-ease-in animation-duration-1000 surface-ground">
                <div className="w-full">
                    <h2 className="text-4xl mb-4 text-center">Last 5 Games</h2>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <table className="table-auto border-collapse border border-gray-300 w-full">
                            <thead>
                                <tr className="bg-primary-reverse text-center">
                                    <th className="border border-gray-300 px-4 py-2">Date</th>
                                    <th className="border border-gray-300 px-4 py-2">Home Team</th>
                                    <th className="border border-gray-300 px-4 py-2">Score</th>
                                    <th className="border border-gray-300 px-4 py-2">Away Team</th>
                                    <th className="border border-gray-300 px-4 py-2">Official</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lastGames.map((game) => (
                                    <tr key={game.game_id} className="text-center">
                                        <td className="border border-gray-300 px-4 py-2">{game.date}</td>
                                        <td className="border border-gray-300 px-4 py-2">{game.home_team_name}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {game.home_team_score} - {game.away_team_score}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{game.away_team_name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{game.official_name}</td>
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

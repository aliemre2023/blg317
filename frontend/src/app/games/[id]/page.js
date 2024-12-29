'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Image } from 'primereact/image';

export default function gameInfo({ params }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [gameInfo, setGameInfo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setGameInfo(null);
        fetch(`http://127.0.0.1:5000/api/games/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data || Object.keys(data).length === 0) {
                    router.replace('/404');
                } else {
                    setGameInfo(data);
                }
            })
            .catch(() => {
                router.replace('/404');
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleClick = (teamId) => {
        router.push(`/teams/${teamId}`); 
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!gameInfo) {
        return null;
    }

    return (
        <div className="w-screen">
            <div className="w-screen">
                <div className="grid mt-1 mx-auto w-10 bg-primary-reverse">
                    <div className="col-2 md:col-1 flex align-items-center">
                        <Button
                            className="mt-0 bg-primary h-3rem md:min-h-full w-full font-bold text-center w-full"
                            onClick={() => {
                                router.back();
                            }}
                            icon="pi pi-angle-left"
                        >
                            {''}
                        </Button>
                    </div>
                    <div className="col-4 md:col-2 flex align-items-center">
                        <Button
                            className="mt-0 bg-primary h-3rem md:min-h-full w-full font-bold text-center w-full"
                            onClick={() => {
                                router.replace('/');
                            }}
                            label="Home"
                        >
                            {' '}
                        </Button>
                    </div>
                    <div className="col-6 md:col-8">
                        <div className="text-center p-3 border-round-sm text-xl font-bold">
                            {gameInfo.home_team_name?.toUpperCase()} VS {gameInfo.away_team_name?.toUpperCase()}
                        </div>
                    </div>
                    <div className="col-0 md:col-2"></div>
                </div>
            </div>
            
            <div className="w-screen">
                <div className="grid mt-4 w-10 mx-auto">
                    <div className="col-12 px-0 surface-ground">
                        <div className="flex flex-wrap w-full">
                            
                            <div className="flex flex-wrap justify-content-center w-full mx-0 text-center">
                                <div className="w-4 mt-2 text-xl bg-primary-reverse align-items-center justify-content-center flex border-round-md">
                                    {gameInfo.home_team_name}
                                </div>
                                <div className="w-4 mt-2 text-xl bg-primary-reverse ml-8 align-items-center justify-content-center flex border-round-md">
                                    {gameInfo.away_team_name}
                                </div>

                                <div className="w-4 mt-2 text-xl align-items-center justify-content-center flex">
                                    <img
                                    
                                        src={gameInfo.home_team_logo}
                                        alt={`Logo of ${gameInfo.home_team_name}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/null_team.png';
                                        }}
                                        onClick={() => handleClick(gameInfo.home_team_id)}
                                        className="w-8 h-8 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain cursor-pointer" 
                                    />
                                </div>
                                <div className="w-4 mt-2 text-xl ml-8 align-items-center justify-content-center flex">
                                    <img
                                        src={gameInfo.away_team_logo}
                                        alt={`Logo of ${gameInfo.away_team_name}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/null_team.png';
                                        }}
                                        onClick={() => handleClick(gameInfo.away_team_id)}
                                        className="w-8 h-8 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain cursor-pointer" 
                                    />
                                </div>

                                <div className="w-4 mt-2 text-4xl font-bold align-items-center justify-content-center flex">
                                    {gameInfo.home_team_score} 
                                </div>
                                <div className='w-1 text-4xl font-bold'>-</div>
                                <div className="w-4 mt-2 text-4xl font-bold align-items-center justify-content-center flex">
                                    {gameInfo.away_team_score}
                                </div>


                                <div className='w-12 flex justify-content-center pt-6'>
                                    <div className="w-6 text-xl bg-primary-reverse font-medium align-items-center justify-content-center border-round-md">
                                        QUARTER POINTS
                                    </div>
                                </div>
                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        {gameInfo.home_qtr1_points}
                                    </div>
                                    <div className="w-3 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        1st Quarter
                                    </div>
                                    <div className="w-1 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.away_qtr1_points}
                                    </div>
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        {gameInfo.home_qtr2_points}
                                    </div>
                                    <div className="w-3 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        2nd Quarter
                                    </div>
                                    <div className="w-1 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.away_qtr2_points}
                                    </div>
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        {gameInfo.home_qtr3_points}
                                    </div>
                                    <div className="w-3 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        3th Quarter
                                    </div>
                                    <div className="w-1 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.away_qtr3_points}
                                    </div>
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        {gameInfo.home_qtr4_points}
                                    </div>
                                    <div className="w-3 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        4th Quarter
                                    </div>
                                    <div className="w-1 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.away_qtr4_points}
                                    </div>
                                </div>



                                <div className='w-12 flex justify-content-center pt-6'>
                                    <div className="w-6 text-xl bg-primary-reverse font-medium align-items-center justify-content-center border-round-md">
                                        REBOUND / BLOCK / STEAL
                                    </div>
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        {gameInfo.home_rebounds}
                                    </div>
                                    <div className="w-3 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        Rebound
                                    </div>
                                    <div className="w-1 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.away_rebounds}
                                    </div>
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        {gameInfo.home_blocks}
                                    </div>
                                    <div className="w-3 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        Block
                                    </div>
                                    <div className="w-1 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.away_blocks}
                                    </div>
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        {gameInfo.home_steals}
                                    </div>
                                    <div className="w-3 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        Steal
                                    </div>
                                    <div className="w-1 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.away_steals}
                                    </div>
                                </div>

                                <div className='w-12 flex justify-content-center pt-6'>
                                    <div className="w-6 text-xl bg-primary-reverse font-medium align-items-center justify-content-center border-round-md">
                                        OTHER INFOS
                                    </div>
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-2 md:w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        Official
                                    </div> 
                                    <div className="w-2 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.official_name}
                                    </div> 
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-2 md:w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        Season
                                    </div> 
                                    <div className="w-2 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex">
                                        {gameInfo.season}
                                    </div> 
                                </div>

                                <div className='w-12  flex justify-content-center align-items-center'>
                                    <div className="w-2 md:w-1 mt-2 bg-primary-reverse align-items-center justify-content-center flex">
                                        Date
                                    </div> 
                                    <div className="w-2 mt-2 bg-primary-reverse ml-4 align-items-center justify-content-center flex flex-wrap">
                                        {gameInfo.date && gameInfo.date.split(' ')[0]}
                                    </div> 
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

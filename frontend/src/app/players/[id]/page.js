'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Image } from 'primereact/image';

export default function playerInfo({ params }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [playerInfo, setPlayerInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch(`https://blg317api.onrender.com/api/players/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Player not found');
                }
                return response.json();
            })
            .then((data) => {
                setPlayerInfo(data);
            })
            .catch(() => {
                router.replace('/404');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!playerInfo) {
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
                            {playerInfo.name?.toUpperCase()}
                        </div>
                    </div>
                    <div className="col-0 md:col-1"></div>
                </div>
            </div>
            <div className="w-screen">
                <div className="grid mt-4 w-10 mx-auto">
                    <div className="col-12 px-0 surface-ground">
                        <div className="flex flex-wrap w-full">
                            <div className="flex justify-content-center w-full">
                                <Image
                                    src={'/player_images/' + playerInfo.player_img}
                                    alt={`Photo201939 of ${playerInfo.name}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/null_player.jpg';
                                    }}
                                    width="250"
                                ></Image>
                            </div>
                            <div className="flex flex-wrap justify-content-center w-full mx-0 text-center">
                                <div className="w-3"></div>
                                <div className="w-6 text-xl bg-primary-reverse font-medium">
                                    {playerInfo.name + ' (' + playerInfo.position + ')'}
                                </div>
                                <div className="w-3"></div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    Height
                                </div>
                                <div className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse">
                                    {playerInfo.height}
                                </div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    Weight
                                </div>
                                <div className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse">
                                    {playerInfo.weight}
                                </div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    Date of Birth
                                </div>
                                <div className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse">
                                    {playerInfo.birthDate}
                                </div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    College
                                </div>
                                <div className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse">
                                    {playerInfo.college}
                                </div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    Country
                                </div>
                                <div
                                    onClick={() => {
                                        router.push(`/countries/${playerInfo.country_id}`);
                                    }}
                                    className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse"
                                >
                                    <img
                                        src={playerInfo.country_flag}
                                        style={{ width: '5%' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                'https://image.milimaj.com/i/milliyet/75/869x477/5c8d865a45d2a05010d80795.jpg';
                                        }}
                                        alt={'Flag of' + playerInfo.country}
                                    />
                                    {playerInfo.country}
                                </div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    Active Team
                                </div>
                                <div
                                    onClick={() => {
                                        router.push(`/teams/${playerInfo.active_team_id}`);
                                    }}
                                    className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse"
                                >
                                    <img
                                        src={playerInfo.active_team_logo}
                                        style={{ width: '5%' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/null_team.png';
                                        }}
                                        alt={'Flag of' + playerInfo.active_team_name}
                                    />
                                    {playerInfo.active_team_name}
                                </div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    Drafted Team
                                </div>
                                <div
                                    onClick={() => {
                                        router.push(`/teams/${playerInfo.drafted_team_id}`);
                                    }}
                                    className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse"
                                >
                                    <img
                                        src={playerInfo.drafted_team_logo}
                                        style={{ width: '5%' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/null_team.png';
                                        }}
                                        alt={'Flag of' + playerInfo.drafted_team_name}
                                    />
                                    {playerInfo.drafted_team_name}
                                </div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    College
                                </div>
                                <div className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse">
                                    {playerInfo.college}
                                </div>
                                <div className="w-4 mt-2 bg-primary-reverse font-medium align-items-center justify-content-center flex">
                                    Draft
                                </div>
                                <div className="w-4 ml-8 flex justify-content-center align-items-center bg-primary-reverse mt-2  bg-primary-reverse">
                                    {playerInfo.draft_year && playerInfo.overall_pick
                                        ? `${playerInfo.draft_year} - Pick: ${playerInfo.overall_pick}`
                                        : 'No Data'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import TeamTable from '@/components/tables/TeamTable';
import PlayerTable from '@/components/tables/PlayerTable';
import GameTable from '@/components/tables/GameTable';
import { Dropdown } from 'primereact/dropdown';

export default function Admin() {
    const [selectedTable, setSelectedTable] = useState('players');

    const tables = [
        { name: 'Players', value: 'players' },
        { name: 'Teams', value: 'teams' },
        { name: 'Games', value: 'games' },
    ];

    return (
        <div className="flex-column align-items-center">
            <div className="flex justify-content-center">
                <Dropdown
                    className="mt-4"
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.value)}
                    options={tables}
                    optionLabel="name"
                    placeholder="Select a Table"
                />
            </div>
            {selectedTable === 'players' && <PlayerTable />}
            {selectedTable === 'teams' && <TeamTable />}
            {selectedTable === 'games' && <GameTable />}
        </div>
    );
}

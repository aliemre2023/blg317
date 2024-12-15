'use client';

import React, { useState } from 'react';
import TeamTable from '@/components/tables/TeamTable';
import { Dropdown } from 'primereact/dropdown';

export default function Admin() {
    const [selectedTable, setSelectedTable] = useState('countries');

    const tables = [
        { name: 'Countries', value: 'countries' },
        { name: 'Teams', value: 'teams' },
        { name: 'Players', value: 'players' },
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
            {selectedTable === 'teams' && <TeamTable />}
        </div>
    );
}

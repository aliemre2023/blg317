'use client';

import './styles.css';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { TabMenu } from 'primereact/tabmenu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

export default function Page({ params }) {
    const router = useRouter();
    const { id } = React.use(params);

    const [activeIndex, setActiveIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportPage, setReportPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [data, setData] = useState([]);

    const items = [
        { label: 'Teams', icon: <img src="/default_team.png" className="mr-2" style={{ width: 24, height: 24 }} /> },
        {
            label: 'Players',
            icon: <img src="/default_player.png" className="mr-2" style={{ width: 24, height: 24 }} />,
        },
    ];

    useEffect(() => {
        setData([]);

        let request = `http://127.0.0.1:5000/api/country/${id}/`;
        if (activeIndex == 0) request += 'teams';
        else if (activeIndex == 1) request += 'players';

        fetch(`${request}?page=${currentPage}&limit=${limit}`)
            .then((response) => response.json())
            .then((data) => {
                if (activeIndex == 0) {
                    setTotalRecords(data.totalCountryTeams);
                    setData(data.counrtyTeams);
                } else if (activeIndex == 1) {
                    setTotalRecords(data.totalCountryPlayers);
                    setData(data.counrtyPlayers);
                }
            })
            .catch((error) => console.log(error));
    }, [activeIndex, currentPage, limit]);

    const instagramTemplate = (options) => {
        return (
            <i
                className="fa-brands fa-instagram"
                style={{ cursor: 'pointer' }}
                onClick={() => window.open(options.instagram, '_blank')}
            ></i>
        );
    };

    const dataTablePaginatorTamplate = {
        layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
        FirstPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}
                >
                    <span className="p-3 pi pi-angle-double-left"></span>
                </button>
            );
        },
        PrevPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}
                >
                    <span className="p-3 pi pi-angle-left"></span>
                </button>
            );
        },
        NextPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}
                >
                    <span className="p-3 pi pi-angle-right"></span>
                </button>
            );
        },
        LastPageLink: (options) => {
            return (
                <button
                    type="button"
                    className={options.className}
                    onClick={options.onClick}
                    disabled={options.disabled}
                >
                    <span className="p-3 pi pi-angle-double-right"></span>
                </button>
            );
        },
        PageLinks: (options) => {
            if (
                (options.view.startPage === options.page && options.view.startPage !== 0) ||
                (options.view.endPage === options.page && options.page + 1 !== options.totalPages)
            ) {
                const className = classNames(options.className, { 'p-disabled': true });

                return (
                    <span className={className} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                </button>
            );
        },
        RowsPerPageDropdown: (options) => {
            const dropdownOptions = [
                { label: '10', value: 10 },
                { label: '25', value: 25 },
                { label: '50', value: 50 },
            ];

            return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
        },
        CurrentPageReport: (options) => {
            return (
                <span className="mx-3">
                    {'Go to'}
                    <InputText
                        size="2"
                        className="ml-1"
                        value={reportPage}
                        disabled={options?.totalPages?.length === 0 || !options.totalPages}
                        onKeyDown={(e) => onPageInputKeyDown(e, options)}
                        onChange={(e) => setReportPage(e.target.value)}
                    />
                    {options?.totalRecords !== 0 ? (
                        <span className="mx-2">{`${options?.currentPage} / ${options?.totalPages}`}</span>
                    ) : (
                        ''
                    )}
                </span>
            );
        },
    };

    const onPageInputKeyDown = (event, options) => {
        if (event.key === 'Enter') {
            const page = parseInt(reportPage);
            if (page < 1 || page > options.totalPages) {
                console.log('page out of bounds');
            } else {
                const first = page ? options.rows * (page - 1) : 0;
                setCurrentPage(reportPage);
                setFirstIndex(first);
            }
        }
    };

    const dataTable = {
        0: (
            <DataTable
                header={
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                }
                className="datatable"
                value={data}
                lazy
                paginator
                paginatorTemplate={dataTablePaginatorTamplate}
                page={currentPage}
                first={firstIndex}
                rows={limit}
                totalRecords={totalRecords}
                rowsPerPageOptions={[10, 25, 50]}
                onPage={(e) => {
                    setLimit(e.rows);
                    setFirstIndex(e.first);
                    setReportPage(e.page + 1);
                    setCurrentPage(e.page + 1);
                }}
                size="small"
                scrollHeight="60vh"
                stripedRows
            >
                <Column field="team_id" header="ID"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="owner" header="Owner"></Column>
                <Column field="general_manager" header="General Manager"></Column>
                <Column field="headcoach" header="Headcoach"></Column>
                <Column field="city_name" header="City"></Column>
                <Column field="arena_name" header="Arena"></Column>
                <Column field="year_founded" header="Year Founded"></Column>
                <Column field="instagram" header="Instagram" body={instagramTemplate}></Column>
            </DataTable>
        ),
        1: (
            <DataTable
                header={
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                }
                className="datatable"
                value={data}
                lazy
                paginator
                paginatorTemplate={dataTablePaginatorTamplate}
                page={currentPage}
                first={firstIndex}
                rows={limit}
                totalRecords={totalRecords}
                rowsPerPageOptions={[10, 25, 50]}
                onPage={(e) => {
                    setLimit(e.rows);
                    setFirstIndex(e.first);
                    setReportPage(e.page + 1);
                    setCurrentPage(e.page + 1);
                }}
                size="small"
                scrollHeight="60vh"
                stripedRows
            >
                <Column field="player_id" header="ID"></Column>
                <Column field="first_name" header="First Name"></Column>
                <Column field="last_name" header="Last Name"></Column>
                <Column field="height" header="Height (inch)"></Column>
                <Column field="weight" header="Weight (pound)"></Column>
                <Column field="birth_date" header="Birth Date"></Column>
                <Column field="college" header="College"></Column>
            </DataTable>
        ),
    }[activeIndex];

    return (
        <div className="container">
            <div className="top">
                <div className="grid mt-1 mx-auto w-10 bg-primary-reverse">
                    <div className="col-2 md:col-1">
                        <Button
                            className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                            onClick={() => {
                                router.replace('/countries');
                            }}
                            icon="pi pi-angle-left"
                        >
                            {''}
                        </Button>
                    </div>
                    <div className="col-4 md:col-2">
                        <Button
                            className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                            onClick={() => {
                                router.replace('/');
                            }}
                            label="Home"
                        >
                            {' '}
                        </Button>
                    </div>
                    <div className="col-6 md:col-9">
                        <div className="text-center p-3 border-round-sm font-bold">COUNTRIES</div>
                    </div>
                </div>
            </div>
            <div className="datatable-wrapper">{dataTable}</div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { TabMenu } from 'primereact/tabmenu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import lazyLoad from '@/lib/lazyLoadFilters';

export default function Page({ params }) {
    const router = useRouter();
    const { id } = React.use(params);

    const [countryName, setCountryName] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportPage, setReportPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [data, setData] = useState([]);
    const [filters, setFilters] = useState(null);
    const [lazyFilters, setLazyFilters] = useState(null);
    const [multiSortMeta, setMultiSortMeta] = useState(null);

    const items = [
        { label: 'Teams', icon: <img src="/default_team.png" className="mr-2" style={{ width: 24, height: 24 }} /> },
        {
            label: 'Players',
            icon: <img src="/default_player.png" className="mr-2" style={{ width: 24, height: 24 }} />,
        },
    ];

    useEffect(() => {
        const fetchCountryInfo = async () => {
            try {
                const countryInfoResponse = await fetch(`https://blg317api.onrender.com/api/country/${id}`);
                const countryInfoData = await countryInfoResponse.json();
                if(!countryInfoResponse.ok) {
                    throw new Error(countryInfoData.error || 'Unknown error');
                }

                // console.log(countryInfoData);
                if (countryInfoData.country_playercount <= 0 && countryInfoData.country_teamcount <= 0) {
                    router.replace('/404');
                    return;
                }

                setCountryName(countryInfoData.country_name);
                setData([]);

                let request = `https://blg317api.onrender.com/api/country/${id}/`;
                if (activeIndex === 0) request += 'teams';
                else if (activeIndex === 1) request += 'players';

                const filters = lazyFilters ? lazyLoad(lazyFilters) : {};
                const sorts = multiSortMeta
                    ? multiSortMeta.map((sort) => ({
                          [sort.field]: sort.order > 0 ? 'ASC' : 'DESC',
                      }))
                    : [];

                const countryResponse = await fetch(`${request}?page=${currentPage}&limit=${limit}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filters, sorts }),
                });
                const countryData = await countryResponse.json();
                if (!countryResponse.ok) {
                    throw new Error(countryData.error || 'Unknown error');
                }

                if (countryData) {
                    if (activeIndex === 0) {
                        setTotalRecords(countryData.totalCountryTeams);
                        setData(countryData.counrtyTeams);
                    } else if (activeIndex === 1) {
                        setTotalRecords(countryData.totalCountryPlayers);
                        setData(countryData.counrtyPlayers);
                    }
                }
            } catch (error) {
                console.error(error);
                router.replace('/404');
            }
        };
        fetchCountryInfo();
    }, [activeIndex, currentPage, limit, lazyFilters, multiSortMeta]);

    useEffect(() => {
        initFilters();
    }, [activeIndex]);

    const initFilters = () => {
        if (activeIndex === 0) {
            setFilters({
                name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
                owner: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
                general_manager: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
                headcoach: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
                city_name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
                arena_name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
                year_founded: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                },
            });
            setLazyFilters({
                name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
                owner: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
                general_manager: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
                headcoach: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
                city_name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
                arena_name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
                year_founded: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                    type: 'Integer',
                },
            });
        } else if (activeIndex === 1) {
            setFilters({
                first_name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
                last_name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
                height: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                },
                weight: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                },
                birth_date: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
                },
                college: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                },
            });
            setLazyFilters({
                first_name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
                last_name: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
                height: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                    type: 'Integer',
                },
                weight: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                    type: 'Integer',
                },
                birth_date: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
                    type: 'Date',
                },
                college: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                    type: 'String',
                },
            });
        }
    };

    const clearFilter = () => {
        initFilters();
        setMultiSortMeta(null);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                <Button className="mr-6" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            </div>
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

    const dateFilterTemplate = (options) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                dateFormat="dd/mm/yy"
                placeholder="dd/mm/yyyy"
                mask="99/99/9999"
            />
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
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

    const onFilter = (e) => {
        const _filters = e.filters;
        setFilters(_filters);
        setLazyFilters(
            Object.keys(_filters).reduce((acc, filterKey) => {
                const lazyFilterValue = lazyFilters[filterKey] || {};
                acc[filterKey] = {
                    ..._filters[filterKey],
                    type: lazyFilterValue?.type,
                };
                return acc;
            }, {}),
        );
    };

    const onSort = (e) => {
        setMultiSortMeta(e.multiSortMeta);
    };

    const dataTable = {
        0: (
            <DataTable
                header={renderHeader}
                className="datatable"
                value={data}
                filters={filters}
                onFilter={(e) => onFilter(e)}
                sortMode="multiple"
                removableSort
                multiSortMeta={multiSortMeta}
                onSort={(e) => onSort(e)}
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
                onRowClick={(e) => router.replace(`/teams/${e.data.team_id}`)}
                size="small"
                scrollable
                scrollHeight="60vh"
                stripedRows
            >
                <Column field="team_id" sortable header="#"></Column>
                <Column field="name" filter sortable header="Name"></Column>
                <Column field="owner" filter sortable header="Owner"></Column>
                <Column field="general_manager" filter sortable header="General Manager"></Column>
                <Column field="headcoach" filter sortable header="Headcoach"></Column>
                <Column field="city_name" filter sortable header="City"></Column>
                <Column field="arena_name" filter sortable header="Arena"></Column>
                <Column field="year_founded" filter sortable dataType="numeric" header="Year Founded"></Column>
            </DataTable>
        ),
        1: (
            <DataTable
                header={renderHeader}
                className="datatable"
                value={data}
                filters={filters}
                onFilter={(e) => onFilter(e)}
                sortMode="multiple"
                removableSort
                multiSortMeta={multiSortMeta}
                onSort={(e) => onSort(e)}
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
                onRowClick={(e) => router.replace(`/players/${e.data.player_id}`)}
                size="small"
                scrollable
                scrollHeight="60vh"
                stripedRows
            >
                <Column field="player_id" sortable header="#"></Column>
                <Column field="first_name" filter sortable header="First Name"></Column>
                <Column field="last_name" filter sortable header="Last Name"></Column>
                <Column field="height" filter sortable dataType="numeric" header="Height"></Column>
                <Column field="weight" filter sortable dataType="numeric" header="Weight"></Column>
                <Column
                    field="birth_date"
                    filter
                    sortable
                    dataType="date"
                    body={(rowData) => formatDate(rowData.birth_date)}
                    filterElement={dateFilterTemplate}
                    header="Birth Date"
                ></Column>
                <Column field="college" filter sortable header="College"></Column>
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
                                router.back();
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
                        <div className="text-center p-3 border-round-sm font-bold">{countryName}</div>
                    </div>
                </div>
            </div>
            <div className="datatable-wrapper mt-7">{dataTable}</div>
        </div>
    );
}

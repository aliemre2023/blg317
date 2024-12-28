import React, { useState, useEffect, useRef, Fragment } from 'react';
import GameModal from '@/components/modals/GameModal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FilterOperator, FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import classNames from 'classnames';
import lazyLoad from '@/lib/lazyLoadFilters';

export default function GameTable() {
    const toast = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [reportPage, setReportPage] = useState(1);
    const [firstIndex, setFirstIndex] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [data, setData] = useState([]);
    const [filters, setFilters] = useState(null);
    const [lazyFilters, setLazyFilters] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    const [modalType, setModalType] = useState('');

    const [deleteItemModalVisible, setDeleteItemModalVisible] = useState(false);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
    const [itemToDelete, setItemToDelete] = useState('');

    useEffect(() => {
        setData([]);

        const queries = lazyFilters ? lazyLoad(lazyFilters) : {};

        fetch(`http://127.0.0.1:5000/api/admin/games?page=${currentPage}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...queries }),
        })
            .then((response) => response.json())
            .then((data) => {
                setTotalRecords(data.totalGames);
                setData(data.games);
            })
            .catch((error) => console.log(error));
    }, [currentPage, limit, lazyFilters]);

    useEffect(() => {
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            game_id: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
            },
            home_team_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            away_team_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            official_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            season: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            home_team_score: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            away_team_score: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            home_qtr1_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            home_qtr2_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            home_qtr3_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            home_qtr4_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            away_qtr1_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            away_qtr2_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            away_qtr3_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            away_qtr4_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            home_rebounds: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            home_blocks: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            home_steals: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            away_rebounds: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            away_blocks: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            away_steals: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
        });
        setLazyFilters({
            game_id: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
                type: 'Date',
            },
            home_team_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            away_team_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            official_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            season: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            home_team_score: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            away_team_score: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            home_qtr1_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            home_qtr2_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            home_qtr3_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            home_qtr4_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            away_qtr1_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            away_qtr2_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            away_qtr3_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            away_qtr4_points: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            home_rebounds: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            home_blocks: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            home_steals: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            away_rebounds: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            away_blocks: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            away_steals: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
        });
    };

    const clearFilter = () => {
        initFilters();
    };

    const deleteTeam = (game_id) => () => {
        fetch(`http://127.0.0.1:5000/api/admin/games/${game_id}`, { method: 'DELETE' })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
                else toast.current.show({ severity: 'error', summary: 'Error', detail: data.error, life: 3000 });
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setDeleteButtonDisabled(true);
                setDeleteItemModalVisible(false);
            });
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <Button
                    className="mr-6"
                    icon="pi pi-plus"
                    label="Add Game"
                    outlined
                    onClick={() => {
                        setModalType('add');
                        setModalVisible(true);
                    }}
                />
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

    const actionsTemplate = (options) => {
        return (
            <div className="flex flex-row">
                <span
                    className="pi pi-pen-to-square mx-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setModalType('edit');
                        setModalData(options);
                        setModalVisible(true);
                    }}
                ></span>
                <span
                    className="pi pi-trash mx-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setItemToDelete(options);
                        setDeleteItemModalVisible(true);
                    }}
                ></span>
            </div>
        );
    };

    const deleteItemDialogFooter = (
        <Fragment>
            <div className="flex justify-content-center">
                <InputText
                    type="text"
                    onChange={(e) => {
                        if (`${itemToDelete.home_team_name} - ${itemToDelete.away_team_name}` === e.target.value)
                            setDeleteButtonDisabled(false);
                        else setDeleteButtonDisabled(true);
                    }}
                    className="p-inputtext-lg p-d-block mb-5 col-10 text-center p-invalid"
                    placeholder="Type item name to confirm delete"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !deleteButtonDisabled) {
                            deleteTeam(itemToDelete.game_id);
                        }
                    }}
                />
            </div>
            <div className="flex justify-content-center">
                <Button
                    label="No"
                    icon="pi pi-times"
                    className="p-button-danger delete-button-no w-3"
                    onClick={() => setDeleteItemModalVisible(false)}
                />
                <Button
                    label="Yes"
                    disabled={deleteButtonDisabled}
                    icon="pi pi-check"
                    className="p-button-danger delete-button-yes w-3"
                    onClick={deleteTeam(itemToDelete.game_id)}
                />
            </div>
        </Fragment>
    );

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

    return (
        <div className="datatable-wrapper mt-5">
            <DataTable
                header={renderHeader}
                className="datatable"
                value={data}
                filters={filters}
                onFilter={(e) => onFilter(e)}
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
                scrollable
                scrollHeight="60vh"
                stripedRows
            >
                <Column field="game_id" filter dataType="numeric" header="#"></Column>
                <Column
                    field="date"
                    filter
                    dataType="date"
                    body={(rowData) => formatDate(rowData.date)}
                    filterElement={dateFilterTemplate}
                    header="Date"
                ></Column>
                <Column field="home_team_name" filter header="Home Team"></Column>
                <Column field="away_team_name" filter header="Away_Team"></Column>
                <Column field="official_name" filter header="Offical"></Column>
                <Column field="season" filter dataType="numeric" header="Season"></Column>
                <Column field="home_team_score" filter dataType="numeric" header="Home Score"></Column>
                <Column field="away_team_score" filter dataType="numeric" header="Away Score"></Column>
                <Column field="home_qtr1_points" filter dataType="numeric" header="Home QTR1 Points"></Column>
                <Column field="home_qtr2_points" filter dataType="numeric" header="Home QTR2 Points"></Column>
                <Column field="home_qtr3_points" filter dataType="numeric" header="Home QTR3 Points"></Column>
                <Column field="home_qtr4_points" filter dataType="numeric" header="Home QTR4 Points"></Column>
                <Column field="away_qtr1_points" filter dataType="numeric" header="Away QTR1 Points"></Column>
                <Column field="away_qtr2_points" filter dataType="numeric" header="Away QTR2 Points"></Column>
                <Column field="away_qtr3_points" filter dataType="numeric" header="Away QTR3 Points"></Column>
                <Column field="away_qtr4_points" filter dataType="numeric" header="Away QTR4 Points"></Column>
                <Column field="home_rebounds" filter dataType="numeric" header="Home Rebounds"></Column>
                <Column field="home_blocks" filter dataType="numeric" header="Home Blocks"></Column>
                <Column field="home_steals" filter dataType="numeric" header="Home Steals"></Column>
                <Column field="away_rebounds" filter dataType="numeric" header="Away Rebounds"></Column>
                <Column field="away_blocks" filter dataType="numeric" header="Away Blocks"></Column>
                <Column field="away_steals" filter dataType="numeric" header="Away Steals"></Column>
                <Column body={(rowData) => actionsTemplate(rowData)}></Column>
            </DataTable>
            <GameModal
                {...(modalType === 'edit' ? modalData : {})}
                visible={modalVisible}
                setVisible={setModalVisible}
                type={modalType}
            />
            <Dialog
                visible={deleteItemModalVisible}
                style={{ width: '40rem' }}
                modal
                closable={false}
                footer={deleteItemDialogFooter}
                onHide={() => setDeleteItemModalVisible(false)}
            >
                <div className="flex align-items-center justify-content-center text-xl">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'tomato' }} />
                    {itemToDelete && (
                        <span>
                            {'To delete item, please type the name' + ' '}
                            <b>{`${itemToDelete.home_team_name} - ${itemToDelete.away_team_name}`}</b>
                        </span>
                    )}
                </div>
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
}

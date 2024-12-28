import React, { useState, useEffect, useRef, Fragment } from 'react';
import PlayerModal from '@/components/modals/PlayerModal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { FilterOperator, FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import classNames from 'classnames';
import lazyLoad from '@/lib/lazyLoadFilters';

export default function TeamTable() {
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

        fetch(`http://127.0.0.1:5000/api/admin/players?page=${currentPage}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...queries }),
        })
            .then((response) => response.json())
            .then((data) => {
                setTotalRecords(data.totalPlayers);
                setData(data.players);
            })
            .catch((error) => console.log(error));
    }, [currentPage, limit, lazyFilters]);

    useEffect(() => {
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            player_id: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
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
            country_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            team_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
            position: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            from_year: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            to_year: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            jersey: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
        });
        setLazyFilters({
            player_id: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
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
            country_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            team_name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            is_active: { value: null, matchMode: FilterMatchMode.EQUALS, type: 'Boolean' },
            position: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                type: 'String',
            },
            from_year: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            to_year: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
            jersey: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
                type: 'Integer',
            },
        });
    };

    const clearFilter = () => {
        initFilters();
    };

    const deleteTeam = (player_id) => () => {
        fetch(`http://127.0.0.1:5000/api/admin/players/${player_id}`, { method: 'DELETE' })
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
                    label="Add Player"
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

    const isActiveBodyTemplate = (options) => {
        return (
            <i
                className={classNames(
                    'pi',
                    {
                        'true-icon pi-check-circle text-green-500': options.is_active === 1,
                        'false-icon pi-times-circle text-red-500': options.is_active === 0,
                    },
                    'h-full w-full flex justify-content-center',
                )}
            ></i>
        );
    };

    const isActiveFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label className="font-bold">Active</label>
                <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        );
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
                        if (`${itemToDelete.first_name} ${itemToDelete.last_name}` === e.target.value)
                            setDeleteButtonDisabled(false);
                        else setDeleteButtonDisabled(true);
                    }}
                    className="p-inputtext-lg p-d-block mb-5 col-10 text-center p-invalid"
                    placeholder="Type item name to confirm delete"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !deleteButtonDisabled) {
                            deleteTeam(itemToDelete.player_id);
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
                    onClick={deleteTeam(itemToDelete.player_id)}
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
                <Column field="player_id" filter dataType="numeric" header="#"></Column>
                <Column field="first_name" filter header="First Name"></Column>
                <Column field="last_name" filter header="Last Name"></Column>
                <Column field="height" filter dataType="numeric" header="Height"></Column>
                <Column field="weight" filter dataType="numeric" header="Weight"></Column>
                <Column
                    field="birth_date"
                    filter
                    dataType="date"
                    body={(rowData) => formatDate(rowData.birth_date)}
                    filterElement={dateFilterTemplate}
                    header="Birth Date"
                ></Column>
                <Column field="college" filter header="College"></Column>
                <Column field="country_name" filter header="Country"></Column>
                <Column field="team_name" filter header="Team"></Column>
                <Column
                    field="is_active"
                    filter
                    dataType="boolean"
                    body={(rowData) => isActiveBodyTemplate(rowData)}
                    filterElement={isActiveFilterTemplate}
                    header="Is Active"
                ></Column>
                <Column field="position" filter header="Position"></Column>
                <Column field="from_year" filter dataType="numeric" header="From Year"></Column>
                <Column field="to_year" filter dataType="numeric" header="To Year"></Column>
                <Column field="jersey" filter dataType="numeric" header="Jersey Number"></Column>
                <Column body={(rowData) => actionsTemplate(rowData)}></Column>
            </DataTable>
            <PlayerModal
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
                            <b>{`${itemToDelete.first_name} ${itemToDelete.last_name}`}</b>
                        </span>
                    )}
                </div>
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
}

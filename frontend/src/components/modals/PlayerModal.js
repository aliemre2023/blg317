import React, { useState, useEffect, useRef } from 'react';
import UseUnsavedChangesWarning from '../UseUnsavedChangesWarning';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';

export default function PlayerModal({
    player_id,
    first_name,
    last_name,
    height,
    weight,
    birth_date,
    college,
    country_id,
    team_id,
    is_active,
    position,
    from_year,
    to_year,
    jersey,
    season_exp,
    visible,
    setVisible,
    type,
}) {
    const toast = useRef(null);
    const [warningVisible, setWarningVisible] = useState(false);

    const [fields, setFields] = useState([
        { name: 'player.first_name', type: 'text', label: 'First Name' },
        { name: 'player.last_name', type: 'text', label: 'Last Name' },
        { name: 'player.height', type: 'number', label: 'Height' },
        { name: 'player.weight', type: 'number', label: 'Weight' },
        { name: 'player.birth_date', type: 'date', label: 'Birth Date' },
        { name: 'player.college', type: 'text', label: 'College' },
        { name: 'player.country_id', type: 'option', label: 'Country' },
        { name: 'player_info.team_id', type: 'option', label: 'Team' },
        { name: 'player_info.is_active', type: 'boolean', label: 'Active' },
        { name: 'player_info.position', type: 'text', label: 'Position' },
        { name: 'player_info.from_year', type: 'number', label: 'From Year' },
        { name: 'player_info.to_year', type: 'number', label: 'To Year' },
        { name: 'player_info.jersey', type: 'number', label: 'Jersey' },
        { name: 'player_info.season_exp', type: 'number', label: 'Season Exp' },
    ]);

    const validationSchema = Yup.object().shape({
        player: Yup.object().shape({
            first_name: Yup.string()
                .required("First Name can't be empty.")
                .test('test-first-name', "First Name can't be empty.", function (value) {
                    return value.trim().length > 0;
                }),
            last_name: Yup.string()
                .required("Last Name can't be empty.")
                .test('test-last-name', "Last Name can't be empty.", function (value) {
                    return value.trim().length > 0;
                }),
            height: Yup.number()
                .required("Height can't be empty.")
                .test('test-height', 'Height must be greater than 0.', function (value) {
                    return value > 0;
                }),
            weight: Yup.number()
                .required("Weight can't be empty.")
                .test('test-weight', 'Weight must be greater than 0.', function (value) {
                    return value > 0;
                }),
            birth_date: Yup.date().required("Birth Date can't be empty."),
            college: Yup.string()
                .required("Collage can't be empty.")
                .test('test-first-name', "Collage can't be empty.", function (value) {
                    return value.trim().length > 0;
                }),
            country_id: Yup.number().required("Country can't be empty."),
        }),
        player_info: Yup.object().shape({
            team_id: Yup.number().required("Team can't be empty."),
            position: Yup.string().required("Position can't be empty."),
            from_year: Yup.number()
                .required("From Year can't be empty.")
                .test('test-from-year', 'From Year must be greater than 1900.', function (value) {
                    return value > 1900;
                }),
            to_year: Yup.number()
                .required("To Year can't be empty.")
                .test('test-to-year', 'To Year must be greater than From Year.', function (value) {
                    return value > 1900 && value >= formik.values.player_info.from_year;
                }),
            jersey: Yup.number()
                .required("Jersey can't be empty.")
                .test('test-jersey', 'Jersey must be greater than 0.', function (value) {
                    return value > 0;
                }),
            season_exp: Yup.number().required("Season Exp can't be empty."),
        }),
    });

    const formik = useFormik({
        initialValues: {
            player: {
                first_name: first_name || '',
                last_name: last_name || '',
                height: height || 0,
                weight: weight || 0,
                birth_date: birth_date ? new Date(birth_date) : null,
                college: college || '',
                country_id: country_id || null,
            },
            player_info: {
                team_id: team_id || null,
                is_active: is_active === 1 ? true : false,
                position: position || '',
                from_year: from_year || 0,
                to_year: to_year || 0,
                jersey: jersey || 0,
                season_exp: season_exp || 0,
            },
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (data) => {
            handleSubmit(data);
        },
    });
    const { values, initialValues } = formik;

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const countriesResponse = await fetch(`http://127.0.0.1:5000/api/countries/options`);
                const countriesData = await countriesResponse.json();
                const countriesOptions = countriesData.map((item) => ({
                    label: item.name,
                    value: item.country_id,
                }));

                const teamsResponse = await fetch(`http://127.0.0.1:5000/api/teams/options`);
                const teamsData = await teamsResponse.json();
                const teamsOptions = teamsData.map((item) => ({
                    label: item.nickname,
                    value: item.team_id,
                }));

                setFields((prevFields) =>
                    prevFields.map((field) => {
                        if (field.name === 'player.country_id') {
                            return { ...field, options: countriesOptions };
                        }
                        if (field.name === 'player_info.team_id') {
                            return { ...field, options: teamsOptions };
                        }
                        return field;
                    }),
                );
            } catch (error) {
                console.error('Options fetch error:', error);
            }
        };

        fetchOptions();
    }, []);

    const handleSubmit = (data) => {
        const changedData = Object.keys(data).reduce((acc, key) => {
            const nestedChanges = Object.keys(data[key]).reduce((nestedAcc, nestedKey) => {
                if (data[key][nestedKey] !== initialValues[key][nestedKey]) {
                    nestedAcc[nestedKey] = data[key][nestedKey];
                }
                return nestedAcc;
            }, {});

            if (Object.keys(nestedChanges).length > 0) {
                acc[key] = nestedChanges;
            }
            return acc;
        }, {});

        if (changedData?.player?.birth_date) {
            const date = changedData?.player?.birth_date;
            const yyyy = date.getFullYear();
            let mm = date.getMonth() + 1;
            let dd = date.getDate();

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            changedData.player.birth_date = yyyy + '-' + mm + '-' + dd + ' 00:00:00';
        }

        if (changedData?.player_info?.is_active)
            changedData.player_info.is_active = changedData.player_info.is_active ? 1 : 0;

        fetch(`http://127.0.0.1:5000/api/admin/players/${player_id || 0}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changedData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: data.message,
                        life: 3000,
                    });
                else
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: data.error,
                        life: 3000,
                    });
            })
            .catch((error) => console.log(error))
            .finally(() => {
                formik.resetForm();
                setVisible(false);
            });
    };

    const isFormFieldValid = (fieldName) => {
        const nameParts = fieldName.split('.');
        const touchedField = nameParts.reduce((acc, part) => acc?.[part], formik.touched);
        const errorField = nameParts.reduce((acc, part) => acc?.[part], formik.errors);

        return !!(touchedField && errorField);
    };
    const getFormErrorMessage = (fieldName) => {
        const nameParts = fieldName.split('.');
        const errorField = nameParts.reduce((acc, part) => acc?.[part], formik.errors);
        return isFormFieldValid(fieldName) && <small className="p-error">{errorField}</small>;
    };

    const declareUserDecision = (userDecision) => {
        if (userDecision) {
            setWarningVisible(false);
            formik.resetForm();
            setVisible(false);
        } else {
            setWarningVisible(false);
        }
    };

    function getNestedValue(obj, path) {
        return path.split('.').reduce((acc, key) => acc && acc[key], obj);
    }

    const checkForChanges = () => {
        const changes = Object.keys(values).reduce((acc, key) => {
            const nestedChanges = Object.keys(values[key]).reduce((nestedAcc, nestedKey) => {
                const currentValue = values[key][nestedKey];
                const initialValue = initialValues[key][nestedKey];
                if (
                    (currentValue instanceof Date &&
                        initialValue instanceof Date &&
                        currentValue.getTime() !== initialValue.getTime()) ||
                    (!(currentValue instanceof Date) && currentValue !== initialValue)
                ) {
                    nestedAcc[nestedKey] = values[key][nestedKey];
                }
                return nestedAcc;
            }, {});

            if (Object.keys(nestedChanges).length > 0) {
                acc[key] = nestedChanges;
            }
            return acc;
        }, {});

        if (Object.keys(changes).length > 0) {
            setVisible(true);
            setWarningVisible(true);
        } else {
            setVisible(false);
            formik.resetForm();
        }
    };

    const fieldTemplate = (field, index) => {
        if (field.type === 'text') {
            return (
                <>
                    <label>{field.label}</label>
                    <InputText
                        name={field.name}
                        value={getNestedValue(values, field.name)}
                        className={classNames({
                            'p-invalid': isFormFieldValid(field.name),
                        })}
                        onChange={(e) => {
                            formik.handleChange(e);
                        }}
                    />
                </>
            );
        } else if (field.type === 'number') {
            return (
                <>
                    <label>{field.label}</label>
                    <InputNumber
                        name={field.name}
                        value={getNestedValue(values, field.name)}
                        className={classNames({
                            'p-invalid': isFormFieldValid(field.name),
                        })}
                        useGrouping={false}
                        onChange={(e) => {
                            formik.handleChange(e.originalEvent);
                        }}
                    />
                </>
            );
        } else if (field.type === 'option') {
            return (
                <>
                    <label>{field.label}</label>
                    <Dropdown
                        name={field.name}
                        value={getNestedValue(values, field.name)}
                        options={field.options}
                        optionLabel="label"
                        filter
                        checkmark
                        className={classNames({
                            'p-invalid': isFormFieldValid(field.name),
                        })}
                        onChange={(e) => {
                            formik.setFieldValue(field.name, e.value);
                        }}
                    />
                </>
            );
        } else if (field.type === 'boolean') {
            return (
                <div className="flex align-items-center gap-3">
                    <InputSwitch
                        name={field.name}
                        checked={getNestedValue(values, field.name)}
                        onChange={(e) => {
                            formik.handleChange(e.originalEvent);
                        }}
                    />
                    <label>{field.label}</label>
                </div>
            );
        } else if (field.type === 'date') {
            return (
                <>
                    <label>{field.label}</label>
                    <Calendar
                        name={field.name}
                        value={new Date(getNestedValue(values, field.name))}
                        className={classNames({
                            'p-invalid': isFormFieldValid(field.name),
                        })}
                        onChange={(e) => {
                            formik.handleChange(e);
                        }}
                        dateFormat="dd/mm/yy"
                        showIcon
                    />
                </>
            );
        } else {
            return <></>;
        }
    };

    return (
        <>
            <UseUnsavedChangesWarning visible={warningVisible} declareUserDecision={declareUserDecision} />
            <Sidebar
                visible={visible}
                onHide={() => {
                    checkForChanges();
                }}
                position="right"
                style={{ width: '35rem' }}
            >
                <div className="modal-header flex justify-content-between">
                    <div className="flex align-items-center">
                        <i
                            className="pi pi-chevron-left mr-2 text-2xl text-primary"
                            style={{ cursor: 'pointer' }}
                            onClick={() => checkForChanges()}
                        ></i>

                        <h2 className="m-0 font-bold">{type === 'add' ? 'Add Player' : 'Edit Player'}</h2>
                    </div>

                    <Button
                        className="p-button-primary w-3"
                        type="submit"
                        label="Save"
                        onClick={(e) => {
                            formik.handleSubmit(e);
                        }}
                    />
                </div>
                <Divider />
                <div className="modal-content-container">
                    <div className="flex flex-column">
                        {fields.map((field, index) => {
                            return (
                                <div key={index} className="field flex flex-column">
                                    {fieldTemplate(field, index)}
                                    {getFormErrorMessage(field.name)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Sidebar>
            <Toast ref={toast} />
        </>
    );
}

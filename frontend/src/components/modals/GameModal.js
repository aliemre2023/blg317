import React, { useState, useRef, useEffect } from 'react';
import UseUnsavedChangesWarning from '../UseUnsavedChangesWarning';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import { Dropdown } from 'primereact/dropdown';

export default function PlayerModal({
    game_id,
    date,
    home_team_id,
    away_team_id,
    official_id,
    season,
    home_team_score,
    away_team_score,
    home_qtr1_points,
    home_qtr2_points,
    home_qtr3_points,
    home_qtr4_points,
    away_qtr2_points,
    away_qtr3_points,
    away_qtr1_points,
    away_qtr4_points,
    home_rebounds,
    home_blocks,
    home_steals,
    away_rebounds,
    away_blocks,
    away_steals,
    visible,
    setVisible,
    type,
}) {
    const toast = useRef(null);
    const [warningVisible, setWarningVisible] = useState(false);

    const [fields, setFields] = useState([
        { name: 'game.date', type: 'date', label: 'Date' },
        { name: 'game.home_team_id', type: 'option', label: 'Home Team' },
        { name: 'game.away_team_id', type: 'option', label: 'Away Team' },
        { name: 'game.official_id', type: 'option', label: 'Offical' },
        { name: 'game_stat.season', type: 'number', label: 'Season' },
        { name: 'game_stat.home_team_score', type: 'number', label: 'Home Team Score' },
        { name: 'game_stat.away_team_score', type: 'number', label: 'Away Team Score' },
        { name: 'game_stat.home_qtr1_points', type: 'number', label: 'Home QTR1 Points' },
        { name: 'game_stat.home_qtr2_points', type: 'number', label: 'Home QTR2 Points' },
        { name: 'game_stat.home_qtr3_points', type: 'number', label: 'Home QTR3 Points' },
        { name: 'game_stat.home_qtr4_points', type: 'number', label: 'Home QTR4 Points' },
        { name: 'game_stat.away_qtr1_points', type: 'number', label: 'Away QTR1 Points' },
        { name: 'game_stat.away_qtr2_points', type: 'number', label: 'Away QTR2 Points' },
        { name: 'game_stat.away_qtr3_points', type: 'number', label: 'Away QTR3 Points' },
        { name: 'game_stat.away_qtr4_points', type: 'number', label: 'Away QTR4 Points' },
        { name: 'game_stat.home_rebounds', type: 'number', label: 'Home Rebounds' },
        { name: 'game_stat.home_blocks', type: 'number', label: 'Home Blocks' },
        { name: 'game_stat.home_steals', type: 'number', label: 'Home Steals' },
        { name: 'game_stat.away_rebounds', type: 'number', label: 'Away Rebounds' },
        { name: 'game_stat.away_blocks', type: 'number', label: 'Away Blocks' },
        { name: 'game_stat.away_steals', type: 'number', label: 'Away Steals' },
    ]);

    const validationSchema = Yup.object().shape({
        game: Yup.object().shape({
            date: Yup.date().required("Date can't be empty."),
            home_team_id: Yup.number().required("Home Team can't be empty."),
            away_team_id: Yup.number().required("Away Team can't be empty."),
            official_id: Yup.number().required("Official can't be empty."),
        }),
        game_stat: Yup.object().shape({
            season: Yup.number()
                .required("Season can't be empty.")
                .test('test-season', 'Season must be greater than 0.', (value) => value > 0),
            home_team_score: Yup.number().required("Home Team Score can't be empty."),
            away_team_score: Yup.number().required("Away Team Score can't be empty."),
            home_qtr1_points: Yup.number().required("Home QTR1 Points can't be empty."),
            home_qtr2_points: Yup.number().required("Home QTR2 Points can't be empty."),
            home_qtr3_points: Yup.number().required("Home QTR3 Points can't be empty."),
            home_qtr4_points: Yup.number().required("Home QTR4 Points can't be empty."),
            away_qtr1_points: Yup.number().required("Away QTR1 Points can't be empty."),
            away_qtr2_points: Yup.number().required("Away QTR2 Points can't be empty."),
            away_qtr3_points: Yup.number().required("Away QTR3 Points can't be empty."),
            away_qtr4_points: Yup.number().required("Away QTR4 Points can't be empty."),
            home_rebounds: Yup.number().required("Home Rebounds can't be empty."),
            home_blocks: Yup.number().required("Home Blocks can't be empty."),
            home_steals: Yup.number().required("Home Steals can't be empty."),
            away_rebounds: Yup.number().required("Away Rebounds can't be empty."),
            away_blocks: Yup.number().required("Away Blocks can't be empty."),
            away_steals: Yup.number().required("Away Steals can't be empty."),
        }),
    });

    const formik = useFormik({
        initialValues: {
            game: {
                date: date ? new Date(date) : null,
                home_team_id: home_team_id || null,
                away_team_id: away_team_id || null,
                official_id: official_id || null,
            },
            game_stat: {
                season: season || 0,
                home_team_score: home_team_score || 0,
                away_team_score: away_team_score || 0,
                home_qtr1_points: home_qtr1_points || 0,
                home_qtr2_points: home_qtr2_points || 0,
                home_qtr3_points: home_qtr3_points || 0,
                home_qtr4_points: home_qtr4_points || 0,
                away_qtr1_points: away_qtr1_points || 0,
                away_qtr2_points: away_qtr2_points || 0,
                away_qtr3_points: away_qtr3_points || 0,
                away_qtr4_points: away_qtr4_points || 0,
                home_rebounds: home_rebounds || 0,
                home_blocks: home_blocks || 0,
                home_steals: home_steals || 0,
                away_rebounds: away_rebounds || 0,
                away_blocks: away_blocks || 0,
                away_steals: away_steals || 0,
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
                const officialsResponse = await fetch(`https://blg317api.onrender.com/api/officials/options`);
                const officialsData = await officialsResponse.json();
                const officialsOptions = officialsData.map((item) => ({
                    label: item.official_name,
                    value: item.official_id,
                }));

                const teamsResponse = await fetch(`https://blg317api.onrender.com/api/teams/options`);
                const teamsData = await teamsResponse.json();
                const teamsOptions = teamsData.map((item) => ({
                    label: item.nickname,
                    value: item.team_id,
                }));

                setFields((prevFields) =>
                    prevFields.map((field) => {
                        if (field.name === 'game.official_id') {
                            return { ...field, options: officialsOptions };
                        }
                        if (field.name === 'game.home_team_id' || field.name === 'game.away_team_id') {
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

        if (changedData?.game?.date) {
            const date = changedData?.game?.date;
            const yyyy = date.getFullYear();
            let mm = date.getMonth() + 1;
            let dd = date.getDate();

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            changedData.game.date = yyyy + '-' + mm + '-' + dd + ' 00:00:00';
        }

        fetch(`https://blg317api.onrender.com/api/admin/games/${game_id || 0}`, {
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
            );
        } else if (field.type === 'number') {
            return (
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
            );
        } else if (field.type === 'boolean') {
            return (
                <InputSwitch
                    name={field.name}
                    checked={getNestedValue(values, field.name)}
                    onChange={(e) => {
                        formik.handleChange(e.originalEvent);
                    }}
                />
            );
        } else if (field.type === 'option') {
            return (
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
            );
        } else if (field.type === 'date') {
            return (
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

                        <h2 className="m-0 font-bold">{type === 'add' ? 'Add Game' : 'Edit Game'}</h2>
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
                                    <label>{field.label}</label>
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

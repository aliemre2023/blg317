import React, { useState, useRef } from 'react';
import UseUnsavedChangesWarning from '../UseUnsavedChangesWarning';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';

export default function TeamModal({
    team_id,
    name,
    abbreviation,
    owner,
    general_manager,
    headcoach,
    city_id,
    arena_id,
    year_founded,
    facebook,
    instagram,
    twitter,
    logo_url,
    visible,
    setVisible,
    type,
}) {
    const toast = useRef(null);
    const [warningVisible, setWarningVisible] = useState(false);

    const fields = [
        { name: 'team_name', type: 'text', label: 'Team Name' },
        { name: 'abbreviation', type: 'text', label: 'Abbreviation' },
        { name: 'owner', type: 'text', label: 'Owner' },
        { name: 'general_manager', type: 'text', label: 'General Manager' },
        { name: 'headcoach', type: 'text', label: 'Headcoach' },
        { name: 'city_id', type: 'number', label: 'City' },
        { name: 'arena_id', type: 'number', label: 'Arena' },
        { name: 'year_founded', type: 'number', label: 'Year Founded' },
        { name: 'facebook', type: 'url', label: 'Facebook', icon: 'fa-brands fa-facebook-f' },
        { name: 'instagram', type: 'url', label: 'Instagram', icon: 'pi pi-instagram' },
        { name: 'twitter', type: 'url', label: 'Twitter', icon: 'pi pi-twitter' },
        { name: 'logo_url', type: 'url', label: 'Logo Url', icon: 'pi pi-image' },
    ];

    const validationSchema = Yup.object().shape({
        teamName: Yup.string().required("Team Name can't be empty."),
        abbreviation: Yup.string().required("Abbreviation can't be empty."),
        owner: Yup.string().required("Owner can't be empty."),
        generalManager: Yup.string().required("General Manager can't be empty."),
        headcoach: Yup.string().required("Headcoach can't be empty."),
        cityId: Yup.number()
            .required("City can't be empty.")
            .test('test-city', 'City can not be 0.', function (value) {
                return value !== 0;
            }),
        arenaId: Yup.number()
            .required("Arena can't be empty.")
            .test('test-arena', 'Arena can not be 0.', function (value) {
                return value !== 0;
            }),
        yearFounded: Yup.number()
            .required("Year Founded can't be empty.")
            .test('test-year', 'Year Founded can not be 0.', function (value) {
                return value !== 0;
            }),
    });

    const formik = useFormik({
        initialValues: {
            team_name: name || '',
            abbreviation: abbreviation || '',
            owner: owner || '',
            general_manager: general_manager || '',
            headcoach: headcoach || '',
            city_id: city_id || 0,
            arena_id: arena_id || 0,
            year_founded: year_founded || 0,
            facebook: facebook || '',
            instagram: instagram || '',
            twitter: twitter || '',
            logo_url: logo_url || '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (data) => {
            formik.resetForm();
        },
    });

    const isFormFieldValid = (name) => {
        const nameParts = name.split('.');
        const touchedField = nameParts.reduce((acc, part) => acc?.[part], formik.touched);
        const errorField = nameParts.reduce((acc, part) => acc?.[part], formik.errors);

        return !!(touchedField && errorField);
    };
    const getFormErrorMessage = (name) => {
        const nameParts = name.split('.');
        const errorField = nameParts.reduce((acc, part) => acc?.[part], formik.errors);
        return isFormFieldValid(name) && <small className="p-error">{errorField}</small>;
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

    const fieldTemplate = (field) => {
        if (field.type === 'text') {
            return (
                <InputText
                    name={field.name}
                    value={formik.values[field.name]}
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
                    value={formik.values[field.name]}
                    className={classNames({
                        'p-invalid': isFormFieldValid(field.name),
                    })}
                    useGrouping={false}
                    onChange={(e) => {
                        formik.handleChange(e.originalEvent);
                    }}
                />
            );
        } else if (field.type === 'url') {
            return (
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">{field.icon ? <i className={field.icon}></i> : 'www'}</span>
                    <InputText
                        name={field.name}
                        value={formik.values[field.name]}
                        className={classNames({
                            'p-invalid': isFormFieldValid(field.name),
                        })}
                        onChange={(e) => {
                            formik.handleChange(e);
                        }}
                    />
                </div>
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
                position="right"
                style={{ width: '35rem' }}
            >
                <div className="modal-header flex justify-content-between">
                    <div className="flex align-items-center">
                        <i
                            className="pi pi-chevron-left mr-2 text-2xl text-primary"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setVisible(false)}
                        ></i>

                        <h2 className="m-0 font-bold">{type === 'add' ? 'Add Team' : 'Edit Team'}</h2>
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
                                    {fieldTemplate(field)}
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

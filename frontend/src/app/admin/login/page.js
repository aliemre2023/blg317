'use client';

import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const toast = useRef(null);
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();

        fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    toast.current.show({
                        severity: 'succes',
                        summary: 'Succes',
                        detail: 'Successfully logged in',
                        life: 3000,
                    });
                    router.replace('/admin');
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Invalid Credentials',
                        detail: 'Please check your username and password',
                        life: 3000,
                    });
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="flex justify-content-center">
            <form className="p-fluid flex justify-content-center flex-column mt-8" onSubmit={(e) => submitHandler(e)}>
                <h5 className="font-bold text-3xl text-center mb-4">Login</h5>
                <div className="p-inputgroup mb-3">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-user"></i>
                    </span>
                    <InputText
                        id="loginUsername"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-key"></i>
                    </span>
                    <Password
                        id="loginPassword"
                        placeholder="password"
                        feedback={false}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        toggleMask
                    />
                </div>
                <Button type="submit" className="m-auto mt-4 w-full" label="Login"></Button>
                <Toast ref={toast} />
            </form>
        </div>
    );
}

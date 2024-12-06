'use client';

import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';

export default function login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState(null);
    const router = useRouter();

    const goToSignUp = () => {
        router.push('/panel/signup');  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userName || !password) {
            setErrorMessage('Please fill out all fields');
            return;
        }

        setErrorMessage(''); // Clear previous errors
        const data = { user_name: userName, password }; // Prepare data to send

        try {
            console.log("in registerUser2");

            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user_name: userName, password: password}),
            });

            if (!response.ok) {
                throw new Error('Invalid username or password');
            }

            const result = await response.json();
            console.log('Login Success:', result);

            setSuccessMessage('Login successful! Redirecting...');
            setTimeout(() => {
                router.push('/'); // Redirect after successful login
            }, 2000);
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage(error.message);
        }
    };
    

    return (
        <div className="container">
            <div className="top">
                <div className="grid mt-1 mx-auto w-10 bg-primary-reverse">
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
                    <div className="col-4 md:col-8">
                        <div className="text-center p-3 border-round-sm font-bold">LOG IN</div>
                    </div>
                    <div className="col-4 md:col-2"></div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form" method='POST'>
                             
                <div className="field">
                    <label htmlFor="user_name" className="col-12 mb-2 md:col-2 md:mb-0">Username</label>
                    <input
                        id="user_name"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="password" className="col-12 mb-2 md:col-2 md:mb-0">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <button type="submit" className="submit-btn">Log In</button>
            </form>

            <div>
                <button onClick={goToSignUp} className="text-base p-2 bg-primary text-white rounded-md">
                    Don't you have an account 
                    <img src='/mousydog.png' className='w-2rem' alt="mousydog"/>
                    , Let's sign
                    <img src='/coolface.png' className='w-2rem' alt="coolface"/>
                </button>
            </div>
        </div>
    );
}

'use client';

import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';

export default function signup() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState(null);
    const router = useRouter();

    const goToLogIn = () => {
        router.push('/panel/login');  
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (!userName || !password || !email) {
            setErrorMessage('Please fill out all fields');
            return;
        }

        setErrorMessage(''); // Clear previous errors
        setFormData({ user_name: userName, password, mail: email }); // Trigger `useEffect
    };

    useEffect(() => {
        if (!formData) return;
        console.log(formData);

        const registerUser = async () => {
            console.log("in registerUser");
            try {
                console.log("in registerUser2");

                const response = await fetch('http://127.0.0.1:5000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_name: userName, password, mail: email }),
                });
                
                console.log("in registerUser3");

                if (!response.ok) {
                    console.log("in registerUser5");
                    const errorData = await response.json();
                    console.log("in registerUser6");
                    throw new Error(errorData.error || 'Registration failed');
                }
                console.log("in registerUser4");

                const result = await response.json();
                setSuccessMessage('Registration successful! Redirecting...');
                setTimeout(() => {
                    router.push('/panel/login'); // Redirect after successful login
                }, 2000);
                console.log('Registration successful:', result);

            } catch (error) {
                console.error('Error during registration:', error.message);
                setErrorMessage(error.message);
            }
        };

        registerUser();
    }, [formData]);

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
                        <div className="text-center p-3 border-round-sm font-bold">SIGN UP</div>
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
                    <label htmlFor="email" className="col-12 mb-2 md:col-2 md:mb-0">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                <div className="field">
                    <label htmlFor="confirm_password" className="col-12 mb-2 md:col-2 md:mb-0">Confirm Password</label>
                    <input
                        id="confirm_password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <button type="submit" className="submit-btn">Sign Up</button>
            </form>

            <div>
                <button onClick={goToLogIn} className="text-base p-2 bg-primary text-white rounded-md">
                    Do you have an account 
                    <img src='/mousydog.png' className='w-2rem' alt="mousydog"/>
                    , Come to log
                    <img src='/coolface.png' className='w-2rem' alt="coolface"/>
                </button>
            </div>
        </div>
    );
}

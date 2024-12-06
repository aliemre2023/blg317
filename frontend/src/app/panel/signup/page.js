'use client';

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
            <h1 className="title">Sign Up</h1>
            <form onSubmit={handleSubmit} className="form" method='POST'>
                             
                <div className="field">
                    <label htmlFor="user_name">Username</label>
                    <input
                        id="user_name"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="confirm_password">Confirm Password</label>
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
        </div>
    );
}

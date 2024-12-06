'use client';

import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './styles.css';

export default function Panel() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const [formData, setFormData] = useState(null); // track submitted data

    const goToSignUp = () => {
        router.push('/panel/signup');  
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

        setErrorMessage(''); // clear prevv err
        console.log('Form submitted:', { userName, password, email});

        // API Stuff

    };

    return (
        <div className='container'>
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
                        <div className="text-center p-3 border-round-sm font-bold">LOGIN</div>
                    </div>
                </div>
            </div>
            <div className='content'>
            <form onSubmit={handleSubmit} className="form">
                <div className="field grid">
                    <label htmlFor="user_name" className="col-fixed" style={{ width: '100px' }}>Username</label>
                    <div className="col">
                        <input
                            id="user_name"
                            type="text"
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary ml-4"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="field grid">
                    <label htmlFor="email" className="col-fixed" style={{ width: '100px' }}>Email</label>
                    <div className="col">
                        <input
                            id="email"
                            type="email"
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary ml-4"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="field grid">
                    <label htmlFor="password" className="col-fixed" style={{ width: '100px' }}>Password</label>
                    <div className="col">
                        <input
                            id="password"
                            type="password"
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary ml-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="field grid">
                    <label htmlFor="confirm_password" className="col-fixed" style={{ width: '100px' }}>Confirm Password</label>
                    <div className="col">
                        <input
                            id="confirm_password"
                            type="password"
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary ml-4"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="error-box">
                        <p>{errorMessage}</p>
                    </div>
                )}

                <button type="submit" className="submit-btn">Submit</button>
            </form>

            <div>
                <button onClick={goToSignUp} className="text-base p-2 bg-primary text-white rounded-md">
                    Don't you have an account 
                    <img src='/mousydog.png' className='w-2rem' alt="mousydog"/>
                    , Create one 
                    <img src='/coolface.png' className='w-2rem' alt="coolface"/>
                </button>
            </div>
        </div>
        </div>
    );
}

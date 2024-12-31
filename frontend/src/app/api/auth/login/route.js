import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const apiResponse = await fetch('https://blg317api.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (apiResponse.ok) {
            const data = await apiResponse.json();

            const response = NextResponse.json({ success: true, message: 'Login succesfull' }, { status: 200 });
            response.cookies.set('auth-token', data.token, {
                httpOnly: true,
                maxAge: 60 * 60,
            });
            return response;
        }

        return apiResponse;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

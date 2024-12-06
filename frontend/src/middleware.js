import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const isLoginPage = request.url.includes('/admin/login');
    const isSignupPage = request.url.includes('/admin/signup');

    if (isLoginPage || isSignupPage) {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth-token');

    if (token) {
        try {
            const secretKey = new TextEncoder().encode(process.env.SECRET_KEY);
            const decoded = await jwtVerify(token.value, secretKey);

            if (decoded?.payload?.username) {
                return NextResponse.next();
            } else {
                const loginUrl = new URL('/admin/login', request.url);
                return NextResponse.redirect(loginUrl);
            }
        } catch (error) {
            console.log(error);
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/admin/:path*'],
};

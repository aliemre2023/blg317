'use client';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

export default function Page404() {
    const router = useRouter();
    return (
        <div className="h-screen bg-primary flex justify-content-center flex-wrap flex-row align-content-center">
            <div className="text-center bg-primary text-4xl font-semibold w-full h-auto">404 Not Found</div>
            <div className="text-center bg-primary text-2xl font-medium w-full h-auto">Please go to the Home Page</div>
            <div>
                <Button
                    className="mt-0 bg-primary-reverse h-full w-full font-bold text-center"
                    onClick={() => {
                        router.replace('/');
                    }}
                    label="Home"
                />
            </div>
        </div>
    );
}

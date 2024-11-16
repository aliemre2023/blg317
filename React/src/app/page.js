'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

function Page() {
    const router = useRouter();

    return (
        <div className="prime-flex flex-row justify-content-center align-content-center h-screen w-screen">
            <div className="text-center">
                <div>Welcome to main page</div>
                <Button
                    className="mt-2"
                    onClick={() => {
                        router.push('/countries');
                    }}
                >
                    Countries
                </Button>
            </div>
        </div>
    );
}

export default Page;

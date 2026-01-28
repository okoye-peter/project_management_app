import React from 'react';

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-dark-secondary">
            <main className="min-h-screen flex-1 p-8">
                <h1 className="text-4xl font-bold">Home</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Welcome to the Project Management App.
                </p>
            </main>
        </div>
    );
}

'use client'

import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAppSelector } from '@/lib/redux/hooks';


const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
    const isSidebarCollapsed = useAppSelector((state) => state.theme.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    useEffect(() => {
        // add dark class to html element where isDarkMode is true and remove otherwise
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    return (
        <div className='flex w-full min-h-screen text-gray-900 bg-gray-50 dark:bg-dark-secondary dark:text-gray-100'>
            {/* sidebar */}
            <Sidebar />

            <main className={`flex w-full flex-col bg-gray-50 dark:bg-dark-secondary transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "" : "md:pl-64"}`}>
                {/* navbar */}
                <Navbar />
                {children}
            </main>
        </div>
    )
}

export default DashboardWrapper
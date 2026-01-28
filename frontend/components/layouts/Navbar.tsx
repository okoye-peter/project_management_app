'use client'

import { Menu, Moon, Search, Settings, Sun } from 'lucide-react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks'
import { setIsDarkMode, setIsSidebarCollapsed } from '@/libs/redux/features/theme/themeSlice'
const Navbar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector((state) => state.theme.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    return (
        <div className='flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-black'>
            {/* search Bar */}
            <div className="flex items-center gap-8">
                {/* toggle sidebar collapse status */}
                {
                    isSidebarCollapsed && (
                        <button
                            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
                        >
                            <Menu className="size-8 dark:text-white" />
                        </button>
                    )
                }
                <div className="relative flex h-min w-50">
                    <Search className="absolute mr-2 transform -translate-y-1/2 cursor-pointer left-1 top-1/2 size-5 dark:text-white" />
                    <input
                        type="search"
                        placeholder='Search...'
                        className='w-full p-2 pl-8 bg-gray-100 border-none rounded focus:border-transparent focus:outline-none placeholder:text-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400'
                    />
                </div>
            </div>

            {/* Icons */}
            <div className="flex items-center">
                <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className={`rounded p-2 ${isDarkMode ? 'dark:hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                    {
                        isDarkMode ?
                        <Sun className='cursor-pointer size-5 dark:text-white' />
                        :
                        <Moon className='cursor-pointer size-5 dark:text-white' />
                    }
                </button>
                <Link
                    href="/settings"
                    className={`rounded p-2 h-min w-min ${isDarkMode ? 'dark:hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                    <Settings className="cursor-pointer size-5 dark:text-white" />
                </Link>
                <div className="ml-2 mr-5 hidden min-h-[1.5em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
            </div>
        </div>
    )
}

export default Navbar;
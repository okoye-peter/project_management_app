'use client';

import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, Home, Layers3, LockIcon, Search, Settings, ShieldAlert, User, Users, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import SidebarLink from './SidebarLink';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks';
import { setIsSidebarCollapsed } from '@/libs/redux/features/theme/themeSlice';
import { useGetProjectsQuery } from '@/libs/redux/services/api';

const Sidebar = () => {
    const [showProject, setShowProject] = useState(false);
    const [showPriority, setShowPriority] = useState(false);

    const { data: projectResponse, isLoading: projectsIsLoading, isError: ErrorLoadingProjects } = useGetProjectsQuery();

    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector((state) => state.theme.isSidebarCollapsed);

    const links = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Briefcase, label: 'Timeline', href: '/timeline' },
        { icon: Search, label: 'Search', href: '/search' },
        { icon: Settings, label: 'Settings', href: '/settings' },
        { icon: User, label: 'Users', href: '/users' },
        { icon: Users, label: 'Teams', href: '/teams' },
    ]

    const priorities = [
        { icon: AlertCircle, label: 'Urgent', href: '/priorities/urgent' },
        { icon: ShieldAlert, label: 'High', href: '/priorities/high' },
        { icon: AlertTriangle, label: 'Medium', href: '/priorities/medium' },
        { icon: AlertOctagon, label: 'Low', href: '/priorities/low' },
        { icon: Layers3, label: 'Backlog', href: '/priorities/backlog' },
    ]

    const sidebarClasses = `fixed flex flex-col justify-between shadow-xl transition-all duration-300 ease-in-out h-full z-40 dark:bg-black overflow-hidden bg-white ${isSidebarCollapsed ? 'w-0 md:w-0' : 'w-64'
        }`;

    return (
        <>
            {/* Backdrop overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out md:hidden z-30 ${isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-50'
                    }`}
                onClick={() => dispatch(setIsSidebarCollapsed(true))}
            />

            <div className={sidebarClasses}>
                <div className="flex flex-col justify-start w-full h-full">
                    {/* TOP LOGO */}
                    <div className="z-50 flex items-center justify-between w-64 px-6 bg-white min-h-16 ot-3 dark:bg-black">
                        <div className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
                            COLLAB
                        </div>
                        {
                            !isSidebarCollapsed
                            &&
                            (
                                <button
                                    className='py-3 transition-all duration-200 hover:scale-110'
                                    onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
                                >
                                    <X className='text-gray-800 transition-colors size-6 hover:text-gray-500 dark:text-white dark:hover:text-gray-400' />
                                </button>
                            )
                        }
                    </div>
                    {/* TEAM */}
                    <div className='flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700'>
                        <Image src='/logo.jpeg' alt='Logo' width={40} height={60} />
                        <div>
                            <h3 className="font-bold tracking-wide text-md dark:text-gray-200 whitespace-nowrap">
                                COLLAB TEAM
                            </h3>
                            <div className="flex items-start gap-2 mt-1">
                                <LockIcon className='mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400' />
                                <p className='text-xs text-gray-500 whitespace-nowrap'>Private</p>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Links */}
                    <nav className='z-10 w-full'>
                        {
                            links.map((link) => (
                                <SidebarLink key={link.label} Icon={link.icon} label={link.label} href={link.href} />
                            ))
                        }
                    </nav>

                    {/* project Link */}
                    <button
                        onClick={() => setShowProject((prev) => !prev)}
                        className='flex items-center justify-between w-full px-8 py-3 text-gray-500 cursor-pointer'
                    >
                        <span className=''>Projects</span>
                        <ChevronDown className={`size-5 transition-transform duration-300 ${showProject ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                    {/* Project List */}
                    {showProject && !projectsIsLoading && !ErrorLoadingProjects && projectResponse?.data?.map((project) => (
                        <SidebarLink key={project.id} Icon={Briefcase} label={project.name} href={`/projects/${project.id}`} />
                    ))}


                    {/* Priority Link */}
                    <button
                        onClick={() => setShowPriority((prev) => !prev)}
                        className='flex items-center justify-between w-full px-8 py-3 text-gray-500 cursor-pointer'
                    >
                        <span className=''>Priority</span>
                        <ChevronDown className={`size-5 transition-transform duration-300 ${showPriority ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                    {/* Priority List */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showPriority ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        {
                            priorities.map((priority) => (
                                <SidebarLink key={priority.label} Icon={priority.icon} label={priority.label} href={priority.href} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;
import { useAppSelector } from '@/lib/redux/hooks';
import { useGetTasksQuery } from '@/lib/redux/services/api';
import React from 'react'
import LoadingOverlay from '../LoadingOverlay';
import { goeyToast } from 'goey-toast';
import Header from '../Header';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import { TaskStatus, TaskPriority } from '@/types';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

type Props = {
    id: string;
    setIsNewTaskModalOpen: (value: boolean) => void;
}

const columns: GridColDef[] = [
    {
        field: 'title',
        headerName: 'Title',
        width: 200,
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 300,
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params) => {
            let className = 'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ';
            let label = '';

            switch (params.value) {
                case TaskStatus.TODO:
                case 'TODO':
                    className += 'bg-blue-100 text-blue-800';
                    label = 'To Do';
                    break;
                case TaskStatus.IN_PROGRESS:
                case 'IN_PROGRESS':
                    className += 'bg-yellow-100 text-yellow-800';
                    label = 'In Progress';
                    break;
                case TaskStatus.IN_REVIEW:
                case 'IN_REVIEW':
                    className += 'bg-orange-100 text-orange-800';
                    label = 'In Review';
                    break;
                case TaskStatus.BLOCKED:
                case 'BLOCKED':
                    className += 'bg-red-100 text-red-800';
                    label = 'Blocked';
                    break;
                case TaskStatus.DONE:
                case 'DONE':
                    className += 'bg-green-100 text-green-800';
                    label = 'Done';
                    break;
                case TaskStatus.CANCELLED:
                case 'CANCELLED':
                    className += 'bg-gray-100 text-gray-800';
                    label = 'Cancelled';
                    break;
                default:
                    className += 'bg-gray-100 text-gray-800';
                    label = String(params.value);
            }

            return (
                <span className={className}>
                    {label}
                </span>
            )
        }
    },
    {
        field: 'priority',
        headerName: 'Priority',
        width: 130,
        renderCell: (params) => {
            let className = 'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ';
            let label = '';

            switch (params.value) {
                case TaskPriority.URGENT:
                case 'URGENT':
                    className += 'bg-red-200 text-red-700';
                    label = 'Urgent';
                    break;
                case TaskPriority.HIGH:
                case 'HIGH':
                    className += 'bg-yellow-200 text-yellow-700';
                    label = 'High';
                    break;
                case TaskPriority.MEDIUM:
                case 'MEDIUM':
                    className += 'bg-green-200 text-green-700';
                    label = 'Medium';
                    break;
                case TaskPriority.LOW:
                case 'LOW':
                    className += 'bg-blue-200 text-blue-700';
                    label = 'Low';
                    break;
                default:
                    className += 'bg-gray-200 text-gray-700';
                    label = params.value ? String(params.value) : 'Normal';
            }

            return (
                <span className={className}>
                    {label}
                </span>
            )
        }
    },
    {
        field: 'tags',
        headerName: 'Tags',
        width: 75,
    },
    {
        field: 'startDate',
        headerName: 'Start Date',
        width: 130,
    },
    {
        field: 'dueDate',
        headerName: 'Due Date',
        width: 130,
    },
    {
        field: 'author',
        headerName: 'Author',
        width: 150,
        renderCell: (params) => {
            return (
                <>
                    {
                        params.row?.author ? (

                            <div className='flex items-center gap-2'>
                                <Avatar
                                    src={params.row.author?.profilePictureUrl}
                                    alt={params.row.author?.username}
                                    className='h-8 w-8'
                                />
                                <span className='text-sm font-medium'>{params.row.author?.username}</span>
                            </div>
                        )
                            :
                            'Unknown'
                    }
                </>
            )
        }
    },
    {
        field: 'assignee',
        headerName: 'Assignee',
        width: 150,
        renderCell: (params) => {
            return (
                <>
                    {
                        params.row?.assignee ? (

                            <div className='flex items-center gap-2'>
                                <Avatar
                                    src={params.row.assignee?.profilePictureUrl}
                                    alt={params.row.assignee?.username}
                                    className='h-8 w-8'
                                />
                                <span className='text-sm font-medium'>{params.row.assignee?.username}</span>
                            </div>
                        )
                            :
                            'Unassigned'
                    }
                </>
            )
        }
    },
    {
        field: 'points',
        headerName: 'Points',
        width: 200,
    },
];

const TableView = ({ id, setIsNewTaskModalOpen }: Props) => {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });

    if (isLoading) {
        return <LoadingOverlay isActive={true} message='Loading tasks...' subMessage='Please wait a moment' />
    }

    if (error) {
        const errorMessage =
            'data' in error ? (error.data as { message?: string })?.message || 'An error occurred' :
                'message' in error ? error.message : 'An error occurred';

        goeyToast.error('Error loading tasks...', {
            description: errorMessage,
            duration: 5000,
        });
    }


    return (
        <div className='h-[540px] w-full px-4 pb-8 xl:px-6'>
            <div className="pt-5">
                <Header name="Table" isSmallText />
            </div>
            <DataGrid
                rows={tasks?.data || []}
                columns={columns}
                className={`${dataGridClassNames} rounded-lg!`}
                sx={dataGridSxStyles(isDarkMode)}
            />
        </div>
    )
}

export default TableView
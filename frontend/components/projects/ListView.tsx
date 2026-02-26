import { useGetTasksQuery } from '@/lib/redux/services/api';
import React from 'react'
import LoadingOverlay from '../LoadingOverlay';
import { goeyToast } from 'goey-toast';
import Header from '../Header';
import TaskCard from '../TaskCard';

type Props = {
    id: string;
    setIsNewTaskModalOpen: (value: boolean) => void;
}

const ListView = ({ id, setIsNewTaskModalOpen }: Props) => {
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
        <div className='px-4 pb-8 xl:px-6'>
            <div className="pt-5">
                <Header name='List' />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
                {
                    tasks?.data?.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
            </div>
        </div>
    )
}

export default ListView
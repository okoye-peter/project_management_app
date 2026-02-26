import { useAppSelector } from '@/libs/redux/hooks';
import { useGetTasksQuery } from '@/libs/redux/services/api';
import { DisplayOption, Gantt, ViewMode, Task } from 'gantt-task-react'
import { useMemo, useState } from 'react';
import LoadingOverlay from '../LoadingOverlay';
import { goeyToast } from 'goey-toast';

type Props = {
    id: string;
    setIsNewTaskModalOpen: (value: boolean) => void;
}

type TaskTypeItems = 'task' | 'milestone' | 'projects';

const TimeLineView = ({ id, setIsNewTaskModalOpen }: Props) => {

    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: 'en-US',
    });

    const ganttTasks: Task[] = useMemo(() => {
        return (
            tasks?.data?.map((task) => ({
                name: task.title.toLocaleLowerCase(),
                start: new Date(task.startDate as string),
                end: new Date(task.dueDate as string),
                id: `Task-${task.id}`,
                type: 'task' as const,
                progress: task.points ? (task.points / 10) * 100 : 0,
                isDisabled: false
            })) || []
        )
    }, [tasks?.data])


    const handleViewModeChanges = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    }


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
        <div className='px-4 xl:px-6'>
            <div className='flex flex-wrap items-center justify-between gap-2 py-5'>
                <h1 className="me-2 text-lg font-bold dark:text0white">Project Tasks Timeline</h1>

                <div className="relative inline-block w-64">
                    <select
                        className='focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white'
                        value={displayOptions.viewMode}
                        onChange={handleViewModeChanges}
                    >
                        <option value={ViewMode.Day}>Day</option>
                        <option value={ViewMode.Week}>Week</option>
                        <option value={ViewMode.Month}>Month</option>
                    </select>
                </div>
            </div>
            <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
                <div className='timeline'>
                    <Gantt
                        tasks={ganttTasks}
                        viewMode={displayOptions.viewMode}
                        columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                        listCellWidth='100px'
                        barBackgroundColor={isDarkMode ? '#101214' : '#aeb8c2'}
                        barBackgroundSelectedColor={isDarkMode ? '#000' : '#9ba1e6'}
                    />
                </div>

            </div>
        </div>
    )
}



export default TimeLineView
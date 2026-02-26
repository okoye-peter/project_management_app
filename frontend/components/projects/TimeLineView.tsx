import { useAppSelector } from '@/lib/redux/hooks';
import { useGetTasksQuery } from '@/lib/redux/services/api';
import { DisplayOption, Gantt, ViewMode, Task } from 'gantt-task-react'
import { useMemo, useState } from 'react';
import LoadingOverlay from '../LoadingOverlay';
import { goeyToast } from 'goey-toast';
import 'gantt-task-react/dist/index.css';

type Props = {
    id: string;
    setIsNewTaskModalOpen: (value: boolean) => void;
}

const TimeLineView = ({ id, setIsNewTaskModalOpen }: Props) => {

    const capitalizeEachWord = (sentence: string) => {
        // 1. Convert the sentence to lowercase to ensure consistent casing.
        const lowerCased = sentence.toLowerCase();

        // 2. Split the string into an array of words using space as a delimiter.
        const words = lowerCased.split(' ');

        // 3. Iterate over each word and capitalize the first letter.
        const capitalizedWords = words.map(word => {
            if (word.length === 0) return '';
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

        // 4. Join the words back into a single string with spaces.
        return capitalizedWords.join(' ');
    }

    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: 'en-US',
    });

    const ganttTasks: Task[] = useMemo(() => {
        return (
            tasks?.data?.map((task) => ({
                name: capitalizeEachWord(task.title),
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
                <div className='timeline overflow-x-auto overflow-y-hidden'>
                    <div style={{ minWidth: '800px' }}>
                        <Gantt
                            tasks={ganttTasks}
                            viewMode={displayOptions.viewMode}
                            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                            listCellWidth="150px"
                            TaskListHeader={({ headerHeight, rowWidth, fontFamily, fontSize }) => (
                                <div
                                    className="flex items-center text-sm font-semibold dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary"
                                    style={{ height: headerHeight, fontFamily, fontSize }}
                                >
                                    <div className="px-2" style={{ width: rowWidth, minWidth: rowWidth, maxWidth: rowWidth }}>
                                        Name
                                    </div>
                                    <div className="px-2 border-l border-gray-300 dark:border-gray-700" style={{ width: rowWidth, minWidth: rowWidth, maxWidth: rowWidth }}>
                                        From
                                    </div>
                                    <div className="px-2 border-l border-gray-300 dark:border-gray-700" style={{ width: rowWidth, minWidth: rowWidth, maxWidth: rowWidth }}>
                                        To
                                    </div>
                                </div>
                            )}
                            TaskListTable={({ rowHeight, rowWidth, tasks, fontFamily, fontSize, locale }) => (
                                <div className="bg-white dark:bg-dark-secondary" style={{ fontFamily, fontSize }}>
                                    {tasks.map((t) => (
                                        <div
                                            key={t.id}
                                            className="flex items-center border-b border-gray-200 dark:border-gray-800"
                                            style={{ height: rowHeight }}
                                        >
                                            <div
                                                className="px-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-700 dark:text-gray-200"
                                                style={{ width: rowWidth, minWidth: rowWidth, maxWidth: rowWidth }}
                                                title={t.name}
                                            >
                                                {t.name}
                                            </div>
                                            <div
                                                className="px-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-800"
                                                style={{ width: rowWidth, minWidth: rowWidth, maxWidth: rowWidth }}
                                                title={t.start.toLocaleDateString(locale)}
                                            >
                                                {t.start.toLocaleDateString(locale)}
                                            </div>
                                            <div
                                                className="px-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-800"
                                                style={{ width: rowWidth, minWidth: rowWidth, maxWidth: rowWidth }}
                                                title={t.end.toLocaleDateString(locale)}
                                            >
                                                {t.end.toLocaleDateString(locale)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            barBackgroundColor={isDarkMode ? '#101214' : '#aeb8c2'}
                            barBackgroundSelectedColor={isDarkMode ? '#000' : '#9ba1a6'}
                        />
                    </div>
                </div>
                <div className="px-4 pb-5 pt-1">
                    <button
                        className='flex items-center rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 text-sm'
                        onClick={() => setIsNewTaskModalOpen(true)}
                    >
                        Add New Task
                    </button>
                </div>
            </div>
        </div>
    )
}



export default TimeLineView
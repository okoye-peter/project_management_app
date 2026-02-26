import { useGetTasksQuery, useUpdateTaskStatusMutation } from '@/lib/redux/services/api';
import { format } from 'date-fns';
import LoadingOverlay from '../LoadingOverlay';
import { goeyToast } from 'goey-toast';
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TaskPriority, TaskStatus, type Task as TypeTask } from '@/types';
import { EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react';
import Image from 'next/image';
import TaskCommentsModal from './TaskCommentsModal';

type Props = {
    id: string;
    setIsNewTaskModalOpen: (value: boolean) => void;
}

const taskStatuses = [
    {
        id: 'todo',
        name: 'To Do',
        value: TaskStatus.TODO
    },
    {
        id: 'in-progress',
        name: 'In Progress',
        value: TaskStatus.IN_PROGRESS
    },
    {
        id: 'in-review',
        name: 'In Review',
        value: TaskStatus.IN_REVIEW
    },
    {
        id: 'done',
        name: 'Done',
        value: TaskStatus.DONE
    },
]

/**
 * BoardView Component
 * This is the main container for the drag-and-drop Kanban board.
 * It manages fetching tasks for a specific project and updating their statuses.
 *
 * @param {string} id - The ID of the project whose tasks are being displayed.
 * @param {function} setIsNewTaskModalOpen - Function to control the visibility of the "New Task" modal.
 */
const BoardView = ({ id, setIsNewTaskModalOpen }: Props) => {
    // Fetch tasks for the current project using the provided project ID
    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });

    // Hook to handle updating a task's status on the backend
    const [updateTaskStatus, { isLoading: isUpdatingTaskStatus }] = useUpdateTaskStatusMutation();

    // Callback triggered when a task is successfully dropped into a new status column
    const moveTask = (taskId: number, newStatus: TaskStatus) => {
        updateTaskStatus({ projectId: Number(id), taskId, status: newStatus });
    };

    if (isLoading || isUpdatingTaskStatus) {
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
        <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                {taskStatuses.map((status) => (
                    <TaskColumn
                        key={status.id}
                        status={status.value}
                        title={status.name}
                        tasks={tasks?.data || []}
                        moveTask={moveTask}
                        setIsNewTaskModalOpen={setIsNewTaskModalOpen}
                    />
                ))}
            </div>
        </DndProvider>
    )
}

interface TaskColumnProps {
    status: TaskStatus;
    title: string;
    tasks: TypeTask[];
    moveTask: (taskId: number, newStatus: TaskStatus) => void;
    setIsNewTaskModalOpen: (isOpen: boolean) => void;
}

/**
 * TaskColumn Component
 * Represents a single status column (e.g., "To Do", "In Progress", "Done") on the Kanban board.
 * Acts as a drop target area where tasks can be dragged and dropped into to change their status.
 *
 * @param {TaskStatus} status - The status category associated with this column.
 * @param {string} title - The display name of the column.
 * @param {TypeTask[]} tasks - The complete list of tasks to filter by status.
 * @param {function} moveTask - Callback used to update a task's status upon dropping.
 * @param {function} setIsNewTaskModalOpen - Function to open the task creation modal.
 */
const TaskColumn = ({
    status,
    title,
    tasks,
    moveTask,
    setIsNewTaskModalOpen
}: TaskColumnProps) => {
    // Configure react-dnd to make this column a drop target for 'task' items
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'task',
        // When a task is dropped over this column, its status is updated to this column's status
        drop: (item: { id: number }) => moveTask(item.id, status),
        collect: (monitor) => ({
            // Flag to conditionally style the column when an item is actively being dragged over it
            isOver: !!monitor.isOver(),
        }),
    }));

    // Calculate how many tasks currently exist in this column based on their status
    const tasksCount = tasks.filter((task) => task.status === status).length;

    const statusColor: Record<TaskStatus, string> = {
        [TaskStatus.TODO]: '#2563EB',
        [TaskStatus.IN_PROGRESS]: '#059669',
        [TaskStatus.IN_REVIEW]: '#D97706',
        [TaskStatus.BLOCKED]: '#DC2626',
        [TaskStatus.DONE]: '#000000',
        [TaskStatus.CANCELLED]: '#6B7280',
    };

    return (
        <div ref={(instance) => { drop(instance); }} className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? 'bg-blue-100 dark:bg-neutral-950' : ''}`}>
            <div className="mb-3 flex w-full">
                <div
                    className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
                    style={{ backgroundColor: statusColor[status] }}
                />
                <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
                    <h3 className='flex items-center text-lg font-semibold dark:text-white'>
                        {title} {" "}
                        <span
                            className='ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary'
                            style={{ width: "1.5rem", height: "1.5rem" }}
                        >{tasksCount}</span>
                    </h3>
                    <div className="flex items-center gap-1">
                        <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
                            <EllipsisVertical size={26} />
                        </button>
                        <button
                            className="flex size-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
                            onClick={() => setIsNewTaskModalOpen(true)}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {tasks.filter((task) => task.status === status).map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}

interface TaskCardProps {
    task: TypeTask;
}

// Helper component to render a pill-shaped badge for the task's priority level
const PriorityTag = ({ priority }: { priority: TaskPriority }) => (
    <div
        className={`rounded-full px-2 py-1 text-xs font-semibold 
            ${priority === TaskPriority.URGENT
                ? 'bg-red-200 text-red-700'
                : priority === TaskPriority.HIGH ? 'bg-yellow-200 text-yellow-700'
                    : priority === TaskPriority.MEDIUM ? 'bg-green-200 text-green-700'
                        : priority === TaskPriority.LOW ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700'
            }
        `}
    >
        {priority === TaskPriority.URGENT ? "Urgent"
            : priority === TaskPriority.HIGH ? "High"
                : priority === TaskPriority.MEDIUM ? "Medium"
                    : priority === TaskPriority.LOW ? "Low"
                        : "Normal"}
    </div>
);

/**
 * TaskCard Component
 * Represents an individual project task. It acts as a draggable item that can be
 * picked up and moved across different TaskColumns to update its status.
 *
 * @param {TypeTask} task - The details of the task to render.
 */
const TaskCard = ({ task }: TaskCardProps) => {
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

    // Configure react-dnd to make this card a draggable source
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'task',
        // Payload that tracks the task being moved (via its identifier)
        item: { id: task.id },
        collect: (monitor) => ({
            // Flag to conditionally style the card while it is actively being dragged
            isDragging: !!monitor.isDragging(),
        }),
    }));

    // Extract tags for rendering individual UI badges
    const taskTagsSplit = task.tags;

    // Format start date and due date into localized short formats (e.g., '10/25/2023')
    const formattedStartDate = task.startDate ? format(new Date(task.startDate), 'P') : '';
    const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'P') : '';

    // Calculate the total number of comments on this task for the footer display
    const numberOfComments = (task.comments?.length || 0).toString();

    return (
        <div
            ref={(instance) => {
                drag(instance)
            }}
            className={`mb-3 rounded-md bg-white shadow dark:shadow-lg dark:bg-dark-secondary ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            {/* Display the first attached image as a cover photo for the task card if available */}
            {task.attachments && task.attachments.length > 0 && (
                <Image
                    src={`/${task.attachments[0].url}`}
                    alt={task.attachments[0].name as string}
                    width={400}
                    height={200}
                    className="w-full h-auto rounded-t-md"
                />
            )}

            <div className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {/* Render the task's priority tag if it has one */}
                        {task.priority !== undefined && <PriorityTag priority={task.priority} />}

                        {/* Render tag labels associated with this task */}
                        <div className="flex gap-2">
                            {taskTagsSplit?.map((tag, index) => (
                                <div
                                    key={`task-tags-split-${index}`}
                                    className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                                >
                                    {" "}
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Action menu button for additional task actions */}
                    <button className='flex h-6 w-4 shrink-0 items-center justify-center dark:text-neutral-500'>
                        <EllipsisVertical size={26} />
                    </button>
                </div>

                {/* Task Title & Story Points Section */}
                <div className='my-3 flex justify-between'>
                    <h4 className='text-md font-bold dark:text-white capitalize'>{task.title}</h4>
                    {/* Only render story points if they are defined as a number */}
                    {
                        typeof task.points === 'number' && (
                            <div className='text-xs font-semibold dark:text-white'>
                                {task.points} pts
                            </div>
                        )
                    }
                </div>

                {/* Task Start and Due Dates line */}
                <div className="text-xs text-gray-500 dark:text-neutral-500">
                    {formattedStartDate && <span>{formattedStartDate} - </span>}

                    {formattedDueDate && <span>{formattedDueDate}</span>}
                </div>

                {/* Short preview of the task's description */}
                <p className='text-sm text-gray-600 dark:text-neutral-500'>{task.description}</p>

                {/* Footer Section: Display Assignee, Author Avatars, and Comments Count */}
                <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark">
                    <div className="mt-3 flex items-center justify-between">
                        {/* Overlapping circular avatars for users involved in the task */}
                        <div className="flex -space-x-[6px] overflow-hidden">
                            {task.assignee && (
                                <Image
                                    src={task.assignee.profilePictureUrl as string}
                                    alt={task.assignee.username as string}
                                    width={30}
                                    height={30}
                                    className="size-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                                />
                            )}

                            {task.author && (
                                <Image
                                    src={task.author.profilePictureUrl as string}
                                    alt={task.author.username as string}
                                    width={30}
                                    height={30}
                                    className="size-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                                />
                            )}
                        </div>
                        {/* Comments counter */}
                        <button
                            onClick={() => setIsCommentsModalOpen(true)}
                            className="flex items-center text-gray-500 transition-colors hover:text-blue-500 dark:text-neutral-500 dark:hover:text-blue-400"
                        >
                            <MessageSquareMore size={20} />
                            <span className="ml-1 text-sm dark:text-neutral-400">
                                {numberOfComments}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Modal overlay attached to card logic */}
            {isCommentsModalOpen && (
                <TaskCommentsModal
                    isOpen={isCommentsModalOpen}
                    onClose={() => setIsCommentsModalOpen(false)}
                    taskId={task.id}
                    taskTitle={task.title}
                />
            )}
        </div>
    );
}


export default BoardView
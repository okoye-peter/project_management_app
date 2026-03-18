import React, { useState } from 'react';
import Modal from '../modals/Index';
import { useCreateTaskMutation } from '@/lib/redux/services/api';
import { goeyToast } from 'goey-toast';
import { TaskPriority, TaskStatus } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
};

const NewTaskModal = ({ isOpen, onClose, projectId }: Props) => {
    const [createTask, { isLoading }] = useCreateTaskMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.BACKLOG);
    const [tags, setTags] = useState<string[]>([]);
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [authorUserId, setAuthorUserId] = useState<string>('');
    const [assignedUserId, setAssignedUserId] = useState<string>('');


    const [errors, setErrors] = useState({ title: false });

    // Reset state when modal closes
    const handleClose = () => {
        setTitle('');
        setDescription('');
        setStatus(TaskStatus.TODO);
        setPriority(TaskPriority.BACKLOG);
        setTags([]);
        setStartDate('');
        setDueDate('');
        setAuthorUserId('');
        setAssignedUserId('');
        setErrors({ title: false });
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            title: !title.trim(),
        };

        if (newErrors.title) {
            setErrors(newErrors);
            goeyToast.error('the title field is required');
            return;
        }

        try {
            await createTask({
                projectId: Number(projectId),
                task: {
                    title,
                    description,
                    status: (status as unknown) as TaskStatus,
                    priority: (priority as unknown) as TaskPriority,
                    tags,
                    startDate,
                    dueDate,
                    authorUserId: parseInt(authorUserId),
                    assignedUserId: parseInt(assignedUserId),
                }
            }).unwrap();

            goeyToast.success('Task created successfully');
            handleClose();
        } catch (error) {
            console.error('Failed to create project:', error);
            // Default error message, can be refined based on backend response
            goeyToast.error('Failed to create project. Please try again.');
        }
    };

    const selectStyles = "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
    const inputStyles = "mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm dark:bg-dark-secondary dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500";
    const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            name="New Task"
        >
            <form onSubmit={handleSubmit} className="mt-2 space-y-5">
                {/* Project Name */}
                <div>
                    <label htmlFor="title" className={labelStyles}>
                        Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors({ ...errors, title: false });
                        }}
                        className={`${inputStyles} ${errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-stroke-dark'}`}
                        placeholder="task title"
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-500">Task title is required.</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className={labelStyles}>
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        className={`${inputStyles} resize-none border-gray-300 dark:border-stroke-dark`}
                        placeholder="task description"
                    />
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="startDate" className={labelStyles}>
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={`${inputStyles} border-gray-300 dark:border-stroke-dark`}
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className={labelStyles}>
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className={`${inputStyles} border-gray-300 dark:border-stroke-dark`}
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className={labelStyles}>
                            Status
                        </label>
                        <select
                            className={selectStyles}
                            value={status}
                            onChange={(e) => setStatus(TaskStatus[e.target.value as keyof typeof TaskStatus])}
                        >
                            <option value="">Select Status</option>
                            <option value={TaskStatus.TODO}>To Do</option>
                            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                            <option value={TaskStatus.IN_REVIEW}>Under Review</option>
                            <option value={TaskStatus.DONE}>Done</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dueDate" className={labelStyles}>
                            Priority
                        </label>
                        <select
                            className={selectStyles}
                            value={priority}
                            onChange={(e) => setPriority(TaskPriority[e.target.value as keyof typeof TaskPriority])}
                        >
                            <option value="">Select Priority</option>
                            <option value={TaskPriority.URGENT}>Urgent</option>
                            <option value={TaskPriority.HIGH}>High</option>
                            <option value={TaskPriority.MEDIUM}>Medium</option>
                            <option value={TaskPriority.LOW}>Low</option>
                            <option value={TaskPriority.BACKLOG}>Backlog</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tags" className={labelStyles}>
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={tags.join(',')}
                            onChange={(e) => {
                                setTags([...e.target.value.split(',')]);
                            }}
                            className={`${inputStyles} ${errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-stroke-dark'}`}
                            placeholder="task title"
                        />
                    </div>
                    <div>
                        <label htmlFor="tags" className={labelStyles}>
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={tags.join(',')}
                            onChange={(e) => {
                                setTags([...e.target.value.split(',')]);
                            }}
                            className={`${inputStyles} ${errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-stroke-dark'}`}
                            placeholder="task title"
                        />
                    </div>
                    <div>
                        <label htmlFor="taskAuthor" className={labelStyles}>
                            Task Author
                        </label>
                        <input
                            type="text"
                            id="taskAuthor"
                            value={assignedUserId}
                            onChange={(e) => {
                                setAssignedUserId(e.target.value);
                            }}
                            className={`${inputStyles} ${errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-stroke-dark'}`}
                            placeholder="task title"
                        />
                    </div>
                    <div>
                        <label htmlFor="assignedUser" className={labelStyles}>
                            Assigned User
                        </label>
                        <input
                            type="text"
                            id="assignedUser"
                            value={assignedUserId}
                            onChange={(e) => {
                                setAssignedUserId(e.target.value);
                            }}
                            className={`${inputStyles} ${errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-stroke-dark'}`}
                            placeholder="task title"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-stroke-dark">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-300 dark:hover:bg-stroke-dark"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Create Task'}
                    </button>
                </div>

            </form>
        </Modal>
    );
};

export default NewTaskModal;
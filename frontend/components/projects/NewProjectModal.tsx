import React, { useState } from 'react';
import Modal from '../modals/Index';
import { useCreateProjectMutation } from '@/lib/redux/services/api';
import { goeyToast } from 'goey-toast';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const NewProjectModal = ({ isOpen, onClose }: Props) => {
    const [createProject, { isLoading }] = useCreateProjectMutation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');

    const [errors, setErrors] = useState({ name: false, description: false });

    // Reset state when modal closes
    const handleClose = () => {
        setName('');
        setDescription('');
        setStartDate('');
        setDueDate('');
        setErrors({ name: false, description: false });
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            name: !name.trim(),
            description: !description.trim(),
        };

        if (newErrors.name || newErrors.description) {
            setErrors(newErrors);
            goeyToast.error('Please fill in all required fields');
            return;
        }

        try {
            await createProject({
                name,
                description,
                // Only send dates if they are provided
                ...(startDate && { startDate }),
                ...(dueDate && { dueDate })
            }).unwrap();

            goeyToast.success('Project created successfully');
            handleClose();
        } catch (error) {
            console.error('Failed to create project:', error);
            // Default error message, can be refined based on backend response
            goeyToast.error('Failed to create project. Please try again.');
        }
    };

    const inputStyles = "mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm dark:bg-dark-secondary dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500";
    const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            name="New Project"
        >
            <form onSubmit={handleSubmit} className="mt-2 space-y-5">
                {/* Project Name */}
                <div>
                    <label htmlFor="name" className={labelStyles}>
                        Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrors({ ...errors, name: false });
                        }}
                        className={`${inputStyles} ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-stroke-dark'}`}
                        placeholder="e.g. Website Redesign"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">Project name is required.</p>}
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
                            setErrors({ ...errors, description: false });
                        }}
                        className={`${inputStyles} resize-none ${errors.description ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-stroke-dark'}`}
                        placeholder="Briefly describe the project goals..."
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-500">Description is required.</p>}
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
                            className={`${inputStyles} border-gray-300 dark:border-[#2d3135]`}
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
                            className={`${inputStyles} border-gray-300 dark:border-[#2d3135]`}
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
                        {isLoading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NewProjectModal;
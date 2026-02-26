import { Task } from '@/types'
import React from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import { Calendar, Paperclip, MessageSquare, Clock } from 'lucide-react'

type Props = {
    task: Task
}

const TaskCard = ({ task }: Props) => {
    // Function to get priority styles
    const getPriorityStyles = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
            case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400';
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
            case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    // Function to get status styles
    const getStatusStyles = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'todo': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
            case 'in_review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400';
            case 'done': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
            case 'blocked': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
            case 'cancelled': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    // Format status and priority texts to be readable (e.g., "in_progress" -> "In Progress")
    const formatEnumText = (text?: string) => {
        if (!text) return 'Unknown';
        return text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    return (
        <div className='flex flex-col justify-between group rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 dark:bg-dark-secondary dark:border-stroke-dark dark:text-white'>
            <div>
                {/* Header: Badges & ID */}
                <div className='flex items-center justify-between mb-3'>
                    <div className='flex gap-2 items-center flex-wrap'>
                        {task.priority_text && (
                            <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full ${getPriorityStyles(task.priority_text)}`}>
                                {formatEnumText(task.priority_text)}
                            </span>
                        )}
                        {task.status_text && (
                            <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full ${getStatusStyles(task.status_text)}`}>
                                {formatEnumText(task.status_text)}
                            </span>
                        )}
                    </div>
                    <span className='text-xs font-semibold text-gray-400 dark:text-neutral-500'>
                        #{task.id}
                    </span>
                </div>

                {/* Title */}
                <h3 className='text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2'>
                    {task.title}
                </h3>

                {/* Description */}
                {task.description && (
                    <p className='text-sm text-gray-500 dark:text-neutral-400 mb-4 line-clamp-2'>
                        {task.description}
                    </p>
                )}

                {/* Attachments Preview - If any */}
                {task.attachments && task.attachments.length > 0 && (
                    <div className='mb-4 mt-2'>
                        <div className='flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-neutral-400 mb-2'>
                            <Paperclip size={14} /> <span>Attachments</span>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {task.attachments.slice(0, 3).map((attachment) => (
                                <div key={attachment.id} className="relative h-12 w-16 overflow-hidden rounded-md border border-gray-200 dark:border-stroke-dark group-hover:opacity-90 transition-opacity">
                                    <Image
                                        src={attachment.url}
                                        alt={attachment.name || 'Attachment'}
                                        fill
                                        className='object-cover'
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                            ))}
                            {task.attachments.length > 3 && (
                                <div className="flex h-12 w-16 items-center justify-center rounded-md bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-stroke-dark text-xs font-medium text-gray-500 dark:text-neutral-400">
                                    +{task.attachments.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className='mt-4 pt-4 border-t border-gray-100 dark:border-stroke-dark'>
                {/* Dates & Metrics */}
                <div className='flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-neutral-400'>
                    <div className='flex items-center gap-4'>
                        {(task.startDate || task.dueDate) && (
                            <div className='flex items-center gap-1.5 font-medium'>
                                <Calendar size={13} className="text-gray-400" />
                                <span>
                                    {task.startDate && format(new Date(task.startDate), 'MMM d')}
                                    {task.dueDate && ` - ${format(new Date(task.dueDate), 'MMM d')}`}
                                </span>
                            </div>
                        )}
                        {(task.comments && task.comments.length > 0) && (
                            <div className='flex items-center gap-1 font-medium'>
                                <MessageSquare size={13} className="text-gray-400" />
                                <span>{task.comments.length}</span>
                            </div>
                        )}
                    </div>
                    {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                            {task.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="bg-gray-50 border border-gray-100 dark:bg-dark-bg dark:border-stroke-dark text-gray-600 dark:text-neutral-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                                    {tag}
                                </span>
                            ))}
                            {task.tags.length > 2 && (
                                <span className="text-[10px] font-medium text-gray-400 ml-0.5">+{task.tags.length - 2}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Users & Updated At */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2.5'>
                        {/* Assignee & Author Avatars */}
                        <div className="flex -space-x-2 overflow-hidden">
                            {task.assignee ? (
                                <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-dark-secondary flex items-center justify-center relative shadow-sm" title={`Assignee: ${task.assignee.username}`}>
                                    {task.assignee.profilePictureUrl ? (
                                        <Image
                                            src={task.assignee.profilePictureUrl}
                                            alt={task.assignee.username}
                                            fill
                                            className='rounded-full object-cover'
                                        />
                                    ) : (
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                            {task.assignee.username.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="h-7 w-7 rounded-full bg-gray-50 dark:bg-dark-bg border-2 border-white dark:border-dark-secondary flex items-center justify-center border-dashed" title="Unassigned">
                                    <span className="text-[10px] font-medium text-gray-400">?</span>
                                </div>
                            )}

                            {/* Author (if different from assignee) */}
                            {task.author && task.author.id !== task.assignee?.id && (
                                <div className="h-7 w-7 rounded-full bg-orange-100 dark:bg-orange-900 border-2 border-white dark:border-dark-secondary flex items-center justify-center relative shadow-sm" title={`Author: ${task.author.username}`}>
                                    {task.author.profilePictureUrl ? (
                                        <Image
                                            src={task.author.profilePictureUrl}
                                            alt={task.author.username}
                                            fill
                                            className='rounded-full object-cover'
                                        />
                                    ) : (
                                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                                            {task.author.username.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-neutral-300">
                            {task.assignee?.username ?? 'Unassigned'}
                        </span>
                    </div>

                    <div className='flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500' title={`Updated: ${task.updatedAt ? format(new Date(task.updatedAt), 'PP') : 'N/A'}`}>
                        <Clock size={12.5} />
                        <span>
                            {task.updatedAt ? format(new Date(task.updatedAt), 'MMM d') : '-'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskCard
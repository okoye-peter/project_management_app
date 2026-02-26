import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

type Comment = {
    id: string;
    text: string;
    author: {
        name: string;
        avatar?: string;
    };
    createdAt: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    taskId: number;
};

// Generate some mock initial comments
const getInitialMockComments = (taskId: number): Comment[] => Array.from({ length: 10 }).map((_, i) => ({
    id: `mock-${i}`,
    text: `This is mock comment ${i + 1} for task ${taskId}. It helps demonstrate the UI.`,
    author: {
        name: 'Mock User',
    },
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
})).reverse(); // Oldest first

const TaskCommentsModal = ({ isOpen, onClose, taskId }: Props) => {
    const [comments, setComments] = useState<Comment[]>(() => getInitialMockComments(taskId));
    const [newCommentText, setNewCommentText] = useState('');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Reset when modal opens for a new task
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    const [prevTaskId, setPrevTaskId] = useState(taskId);

    if (isOpen !== prevIsOpen || taskId !== prevTaskId) {
        setPrevIsOpen(isOpen);
        setPrevTaskId(taskId);
        if (isOpen) {
            setComments(getInitialMockComments(taskId));
            setHasMore(true);
            setNewCommentText('');
        }
    }

    // Scroll to bottom when a new comment is added (but not on load more to avoid jumping)
    useEffect(() => {
        if (bottomRef.current && comments.length === 11) { // rough check for new comment (initial 10 + 1)
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [comments.length]);

    const handleScroll = async () => {
        if (!scrollContainerRef.current || isLoadingMore || !hasMore) return;

        // Check if we've scrolled near the top/bottom for pagination. 
        // For comments, "load more" usually happens when scrolling UP (older comments), 
        // but the prompt says: "let the comment load more while people scroll to the bottom."
        // We'll implement infinite scroll towards the bottom here.
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

        // If user is within 50px of the bottom
        if (scrollHeight - scrollTop - clientHeight < 50) {
            await loadMoreComments();
        }
    };

    const loadMoreComments = async () => {
        setIsLoadingMore(true);
        // TODO: Replace with actual backend endpoint call
        // const response = await fetch(`/api/tasks/${taskId}/comments?page=...`);

        // Simulating network delay
        setTimeout(() => {
            const moreComments: Comment[] = Array.from({ length: 5 }).map((_, i) => ({
                id: `mock-more-${Date.now()}-${i}`,
                text: `Older mock comment ${i + 1} loaded via infinite scroll.`,
                author: { name: 'Mock User' },
                createdAt: new Date(Date.now() - (comments.length + i) * 3600000).toISOString(),
            }));

            setComments(prev => [...prev, ...moreComments]);
            setIsLoadingMore(false);

            // Stop after loading a few pages of mocks
            if (comments.length > 25) setHasMore(false);
        }, 1000);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        // TODO: Call backend endpoint to post new comment
        // await fetch(`/api/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify({ text: newCommentText }) });

        const newComment: Comment = {
            id: `new-${Date.now()}`,
            text: newCommentText,
            author: { name: 'Current User' }, // Replace with authenticated user details
            createdAt: new Date().toISOString(),
        };

        setComments(prev => [...prev, newComment]);
        setNewCommentText('');

        // Scroll to the latest comment
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex h-full max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-dark-secondary">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b p-4 sm:p-6 dark:border-stroke-dark">
                    <div>
                        <h2 className="text-xl font-bold dark:text-white">Task Comments</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Task #{taskId}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors dark:text-neutral-400 dark:hover:bg-dark-tertiary"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Comments List (Scrollable) */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-dark-bg"
                >
                    {comments.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-gray-500">
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-4">
                                    {/* Avatar */}
                                    <div className="shrink-0">
                                        {comment.author.avatar ? (
                                            <Image
                                                src={comment.author.avatar}
                                                alt={comment.author.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold dark:bg-blue-900/50 dark:text-blue-400">
                                                {comment.author.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Comment Content */}
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {comment.author.name}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-neutral-400">
                                                {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                                            </span>
                                        </div>
                                        <div className="rounded-2xl rounded-tl-none bg-white p-3 shadow-sm dark:bg-dark-secondary text-sm text-gray-700 dark:text-neutral-300">
                                            {comment.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoadingMore && (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </div>

                {/* Comment Input Area */}
                <div className="border-t bg-white p-4 sm:p-6 dark:border-stroke-dark dark:bg-dark-secondary">
                    <form onSubmit={handleAddComment} className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-stroke-dark dark:bg-dark-bg dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={!newCommentText.trim()}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskCommentsModal;

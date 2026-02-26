import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../Header';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    name: string;
};

const Index = ({ children, isOpen, onClose, name }: Props) => {
    // Only render the portal if we are in the browser
    if (typeof window === 'undefined') return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex h-full w-full items-center justify-center p-4 sm:p-6"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm dark:bg-neutral-950/60"
                    />

                    {/* MODAL CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-dark-secondary dark:ring-white/10"
                    >
                        {/* HEADER SECTION */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-stroke-dark">
                            <Header name={name} isSmallText />
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-tertiary dark:hover:text-gray-100"
                                aria-label="Close modal"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* BODY CONTENT */}
                        <div className="px-6 py-6 pb-8">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Index;
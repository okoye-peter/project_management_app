import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    isActive: boolean;
    message?: string;
    subMessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isActive,
    message = "Processing Request...",
    subMessage = "Please wait a moment",
}) => {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/20 dark:bg-black/30"
                    style={{ WebkitBackdropFilter: "blur(8px)" }} // for Safari support
                >
                    {/* Main loader container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{
                            type: "spring",
                            bounce: 0.4,
                            duration: 0.6,
                            delay: 0.1,
                        }}
                        className="flex flex-col items-center justify-center space-y-5 p-8 sm:p-10 rounded-3xl bg-white/60 dark:bg-slate-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/40 dark:border-white/10"
                    >
                        {/* Animated Rings Container */}
                        <div className="relative flex items-center justify-center w-28 h-28">
                            {/* Outer Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-[3px] border-t-blue-500 border-r-indigo-400 border-b-transparent border-l-transparent dark:border-t-blue-400 dark:border-r-indigo-300"
                            />
                            {/* Inner Ring */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                                className="absolute inset-3 rounded-full border-[3px] border-t-purple-500 border-l-pink-400 border-b-transparent border-r-transparent dark:border-t-purple-400 dark:border-l-pink-300"
                            />
                            {/* Core Icon Pulse */}
                            <motion.div
                                animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut",
                                }}
                                className="text-blue-600 dark:text-blue-400"
                            >
                                <Loader2 className="w-10 h-10 animate-spin" />
                            </motion.div>
                        </div>

                        {/* Messaging */}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="text-center font-sans tracking-tight"
                            >
                                <h3 className="text-xl font-bold bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    {message}
                                </h3>
                                {subMessage && (
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 animate-pulse">
                                        {subMessage}
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingOverlay;

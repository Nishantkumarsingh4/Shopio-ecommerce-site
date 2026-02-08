"use client";

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const ConfirmModal = () => {
    const { confirmDialog, closeConfirmation } = useToast();

    if (!confirmDialog) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={() => closeConfirmation(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-[#121212] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Decorative Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>

                <div className="p-8 sm:p-10 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-14 w-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                            <AlertCircle className="h-7 w-7 text-indigo-400" />
                        </div>
                        <button
                            onClick={() => closeConfirmation(false)}
                            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight mb-3 uppercase">Are you sure?</h2>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-10 tracking-tight">
                        {confirmDialog.message}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => closeConfirmation(false)}
                            className="py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-[0.2em] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => closeConfirmation(true)}
                            className="py-4 px-6 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                        >
                            Confirm Action
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

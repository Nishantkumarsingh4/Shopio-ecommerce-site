"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const Toast = () => {
    const { toast, hideToast } = useToast();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (toast) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [toast]);

    if (!toast) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div className={`fixed top-5 right-5 z-[9999] transition-all duration-500 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
            <div className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[300px] ${isSuccess
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                <div className={`p-2 rounded-xl ${isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {isSuccess ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>

                <div className="flex-grow">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">
                        {isSuccess ? 'Success Notification' : 'Error Notification'}
                    </p>
                    <p className="text-sm font-bold tracking-tight">
                        {toast.message}
                    </p>
                </div>

                <button
                    onClick={hideToast}
                    className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <X className="h-4 w-4 opacity-50" />
                </button>

                {/* Progress Bar Animation */}
                <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all rounded-b-2xl animate-toast-progress" style={{ width: '100%' }}></div>
            </div>
        </div>
    );
};

export default Toast;

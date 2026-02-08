"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    const askConfirmation = useCallback((message) => {
        return new Promise((resolve) => {
            setConfirmDialog({ message, resolve });
        });
    }, []);

    const closeConfirmation = useCallback((result) => {
        if (confirmDialog) {
            confirmDialog.resolve(result);
            setConfirmDialog(null);
        }
    }, [confirmDialog]);

    return (
        <ToastContext.Provider value={{
            showToast,
            hideToast,
            toast,
            confirmDialog,
            askConfirmation,
            closeConfirmation
        }}>
            {children}
        </ToastContext.Provider>
    );
};

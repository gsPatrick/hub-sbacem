"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "./Input";

export function Dialog({ open, onOpenChange, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => onOpenChange(false)}
            />

            {/* Content */}
            <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>
    );
}

export function DialogHeader({ className, ...props }) {
    return (
        <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props} />
    )
}

export function DialogFooter({ className, ...props }) {
    return (
        <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)} {...props} />
    )
}

export function DialogTitle({ className, ...props }) {
    return (
        <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
    )
}

export function DialogDescription({ className, ...props }) {
    return (
        <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
    )
}

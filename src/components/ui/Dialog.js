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
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 hover:bg-slate-100 p-1"
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
        <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-6", className)} {...props} />
    )
}

export function DialogFooter({ className, ...props }) {
    return (
        <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 mt-8 pt-4 border-t border-slate-100", className)} {...props} />
    )
}

export function DialogTitle({ className, ...props }) {
    return (
        <h2 className={cn("text-xl font-bold leading-none tracking-tight text-[#152341]", className)} {...props} />
    )
}

export function DialogDescription({ className, ...props }) {
    return (
        <p className={cn("text-sm text-slate-500", className)} {...props} />
    )
}

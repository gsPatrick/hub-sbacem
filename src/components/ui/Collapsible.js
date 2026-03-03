
"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "./Input";

export const Collapsible = ({
    title,
    children,
    isOpen: controlledIsOpen,
    onToggle,
    error = false,
    className
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    useEffect(() => {
        if (error && !isOpen) {
            if (onToggle) onToggle(true);
            else setInternalIsOpen(true);
        }
    }, [error, isOpen, onToggle]);

    const handleToggle = () => {
        if (onToggle) onToggle(!isOpen);
        else setInternalIsOpen(!isOpen);
    };

    return (
        <div className={cn(
            "border-2 rounded-lg overflow-hidden transition-all duration-300 bg-white shadow-sm",
            error ? "border-red-500 shadow-red-50" : "border-slate-100",
            className
        )}>
            <button
                type="button"
                onClick={handleToggle}
                className={cn(
                    "w-full flex items-center justify-between p-4 text-left font-bold uppercase tracking-widest text-xs transition-colors",
                    isOpen ? "bg-slate-50 text-[#152341]" : "text-slate-500 hover:bg-slate-50"
                )}
            >
                <span className="flex items-center gap-2">
                    {title}
                    {error && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black animate-pulse">Atenção</span>}
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[1000px] opacity-100 p-6" : "max-h-0 opacity-0 p-0"
            )}>
                {children}
            </div>
        </div>
    );
};

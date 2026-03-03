import { cn } from "./Input";

export function Badge({ children, variant = "default", className }) {
    const variants = {
        default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
        destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
        outline: "border border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200",
    };

    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
            {children}
        </span>
    );
}

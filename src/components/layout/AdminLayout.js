"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/components/ui/Input";
import Link from "next/link";
import {
    Users,
    Settings,
    Shield,
    LogOut,
    Activity
} from "lucide-react";

const menuItems = [
    { icon: Users, label: "Usuários", href: "/admin?tab=users" },
    { icon: Settings, label: "Sistemas", href: "/admin?tab=systems" },
    { icon: Activity, label: "Auditoria", href: "/admin?tab=audit" },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        localStorage.removeItem("central_access_token");
        window.location.href = "/login";
    };

    return (
        <div className="flex h-screen bg-[#F4F7F9] text-[#152341] font-sans overflow-hidden">
            {/* Main Content (Full Width) */}
            <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="flex items-center">
                            <Shield className="h-7 w-7 text-[#c11e3c]" />
                            <span className="ml-2 font-black tracking-tighter text-xl text-[#152341] uppercase">CENTRAL</span>
                        </Link>

                        <div className="hidden md:flex ml-8 border-l border-slate-200 pl-8 space-x-6">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2",
                                        pathname.includes(item.href.split('?')[0])
                                            ? "text-[#c11e3c]"
                                            : "text-slate-400 hover:text-[#152341]"
                                    )}
                                >
                                    <item.icon className="h-3.5 w-3.5" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end text-sm mr-2 hidden sm:flex">
                            <div className="font-bold text-[#152341] uppercase leading-tight">Administrador</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Acesso Master</div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-[#c11e3c] border border-red-100 rounded-sm hover:bg-red-50 uppercase tracking-widest transition-all"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            SAIR
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
                    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

"use client";

import { useState } from "react";
import {
    Users,
    Settings,
    Shield,
    LogOut,
    Menu,
    Activity
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/Input";

const menuItems = [
    { icon: Users, label: "Governança de Usuários", href: "/admin" },
    { icon: Settings, label: "Registro de Sistemas", href: "/admin/systems" },
    { icon: Activity, label: "Auditoria e Logs", href: "/admin/audit" },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-[#F4F7F9] text-[#152341] font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 w-64 shadow-sm",
                    !sidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
                )}
            >
                <div className="h-16 flex items-center justify-center border-b border-slate-200">
                    <Shield className="h-8 w-8 text-[#152341]" />
                    {sidebarOpen && <span className="ml-2 font-bold tracking-tight text-lg text-[#152341] uppercase">CENTRAL</span>}
                </div>

                <nav className="flex-1 py-6 space-y-1 px-3">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-3 text-sm font-bold rounded-sm transition-colors group uppercase tracking-wide",
                                pathname === item.href
                                    ? "bg-[#152341]/5 text-[#152341] border-l-4 border-[#c11e3c]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-[#152341]"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 flex-shrink-0", pathname === item.href ? "text-[#c11e3c]" : "text-slate-400 group-hover:text-[#152341]")} />
                            {sidebarOpen && <span className="ml-3 truncate">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button className="flex items-center w-full px-2 py-2 text-sm font-bold text-[#c11e3c] rounded-sm hover:bg-red-50 uppercase tracking-wide">
                        <LogOut className="h-5 w-5 mr-3" />
                        {sidebarOpen && "Encerrar Sessão"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn("flex-1 flex flex-col min-h-0 transition-all duration-300 ml-0 lg:ml-64", !sidebarOpen && "lg:ml-20")}>
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex items-center ml-auto">
                        <div className="text-sm text-right mr-4 hidden sm:block">
                            <div className="font-bold text-[#152341] uppercase">Administrador</div>
                            <div className="text-xs text-slate-500">Acesso Master</div>
                        </div>
                        <div className="h-9 w-9 rounded-sm bg-[#152341] flex items-center justify-center text-white font-bold text-xs">
                            AD
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

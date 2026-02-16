"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { FileText, Database, Users, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/components/ui/Input";

const systems = [
    {
        id: "sat-1",
        name: "Gestão Documental",
        access: true,
        icon: FileText,
    },
    {
        id: "sat-2",
        name: "Motor OCR",
        access: true,
        icon: Database,
    },
    {
        id: "sat-3",
        name: "Portal do Associado",
        access: false,
        icon: Users,
    }
];

export default function HubPage() {
    const openSystem = (sysId) => {
        console.log("Iniciando acesso ao sistema:", sysId);
    };

    return (
        <div className="min-h-screen bg-[#F4F7F9] text-[#152341] p-6 lg:p-12 flex flex-col items-center">

            {/* --- HEADER LOGOS --- */}
            <div className="w-full max-w-7xl flex flex-col items-center mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="flex items-center gap-10 opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/sbacem.png" alt="SBACEM" className="h-16 lg:h-20 w-auto object-contain hover:scale-105 transition-transform" />
                    <div className="h-12 w-1 bg-slate-300 rounded-full"></div>
                    <img src="/figa.png" alt="FIGA" className="h-16 lg:h-20 w-auto object-contain hover:scale-105 transition-transform" />
                </div>
            </div>

            {/* --- SYSTEM CARDS (LARGE & DENSE) --- */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
                {systems.map((sys, idx) => (
                    <button
                        key={sys.id}
                        onClick={() => sys.access && openSystem(sys.id)}
                        disabled={!sys.access}
                        className={cn(
                            "group relative flex flex-col items-center justify-center h-80 w-full rounded-lg bg-gradient-to-br from-[#152341] to-[#0f172a] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-[#c11e3c]/20 hover:-translate-y-2 overflow-hidden",
                            !sys.access ? "opacity-80 grayscale cursor-not-allowed border-4 border-slate-700" : "shadow-xl border-b-8 border-[#c11e3c]"
                        )}
                        style={{ animationDelay: `${idx * 150}ms` }}
                    >
                        {/* Dense Texture Overlay */}
                        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-5 mix-blend-overlay group-hover:opacity-10 transition-opacity" />

                        {/* Radial Highlight on Hover */}
                        <div className="absolute inset-0 bg-[#c11e3c] opacity-0 group-hover:opacity-5 transition-opacity duration-700 blur-xl" />

                        {/* Icon Container */}
                        <div className={cn(
                            "mb-8 p-6 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-lg",
                            sys.access ? "bg-white/5 text-white ring-1 ring-white/10 group-hover:bg-white/10" : "bg-slate-800 text-slate-500"
                        )}>
                            {sys.access ? <sys.icon className="h-12 w-12" /> : <Lock className="h-12 w-12" />}
                        </div>

                        {/* Name */}
                        <h3 className="text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider text-center group-hover:text-[#c11e3c] transition-colors drop-shadow-md">
                            {sys.name}
                        </h3>

                        {/* Heavy Hover Action Indicator */}
                        {sys.access && (
                            <div className="absolute bottom-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Acessar</span>
                                <ChevronRight className="h-5 w-5 text-[#c11e3c]" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-24 pb-8 text-center text-xs text-slate-400 font-bold uppercase tracking-widest opacity-60">
                Infraestrutura Centralizada &copy; 2026
            </div>
        </div>
    );
}

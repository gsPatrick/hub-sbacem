"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { FileText, Database, Users, ChevronRight, Lock, Monitor, Shield, RefreshCw } from "lucide-react";
import { cn } from "@/components/ui/Input";
import { api } from "@/lib/api";

const ICON_MAP = {
    "Gestão Documental": FileText,
    "Motor OCR": Database,
    "Portal do Associado": Users,
    "Associação": Users,
    "OCR": Database,
    "PDF": FileText,
};

export default function HubPage() {
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("central_access_token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setIsSuperAdmin(payload.is_superadmin || false);
            } catch (e) {
                console.error("Erro ao decodificar token");
            }
        }
        fetchMySystems();
    }, []);

    const fetchMySystems = async () => {
        try {
            const response = await api.get("/users/me/systems");
            setSystems(response.data);
        } catch (error) {
            console.error("Erro ao buscar sistemas:", error);
        } finally {
            setLoading(false);
        }
    };

    const openSystem = (system) => {
        console.log("Iniciando acesso ao sistema:", system.name);
        const token = localStorage.getItem("central_access_token");

        // Redirect to verification flow in backend, passing token explicitly
        const verifyUrl = `https://api.sbacem.com.br/apicentralizadora/auth/verify-session-browser?system_id=${system.id}&redirect_url=${encodeURIComponent(system.base_url)}&token=${token}`;
        window.location.href = verifyUrl;
    };

    const getIcon = (name) => {
        return ICON_MAP[name] || Monitor;
    };

    return (
        <div className="min-h-screen bg-[#F4F7F9] text-[#152341] p-6 lg:p-12 flex flex-col items-center">

            {/* --- HEADER LOGOS --- */}
            <div className="w-full max-w-7xl flex flex-col items-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="flex items-center gap-10 opacity-90">
                    <img src="/sbacem.png" alt="SBACEM" className="h-16 lg:h-20 w-auto object-contain" />
                    <div className="h-12 w-1 bg-slate-300 rounded-full"></div>
                    <img src="/figa.png" alt="FIGA" className="h-16 lg:h-20 w-auto object-contain" />
                </div>
                <h1 className="mt-8 text-4xl font-black tracking-tighter text-[#152341] uppercase">Hub de Aplicações</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Selecione o ecossistema para acesso autenticado</p>

                {isSuperAdmin && (
                    <button
                        onClick={() => window.location.href = '/admin'}
                        className="mt-6 flex items-center gap-2 px-6 py-2 bg-white text-[#c11e3c] border-2 border-[#c11e3c] font-black uppercase tracking-tighter text-xs hover:bg-[#c11e3c] hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                    >
                        <Shield className="h-4 w-4" />
                        Acessar Painel de Controle
                    </button>
                )}
            </div>

            {/* --- SYSTEM CARDS --- */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 font-sans">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-slate-300 rounded-full blur-2xl opacity-20 animate-ping" />
                            <div className="relative h-20 w-20 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-xl">
                                <Shield className="h-10 w-10 text-[#152341] animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600 drop-shadow-sm text-center">
                            Sincronizando Autorizações
                        </h2>
                        <div className="w-32 h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-[#152341] animate-[progress_2s_ease-in-out_infinite]" />
                        </div>
                    </div>
                ) : (
                    <>
                        {systems.map((sys, idx) => {
                            const IconComp = getIcon(sys.name);
                            return (
                                <button
                                    key={sys.id}
                                    onClick={() => openSystem(sys)}
                                    className={cn(
                                        "group relative flex flex-col items-center justify-center h-80 w-full rounded-lg bg-gradient-to-br from-[#152341] to-[#0f172a] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-[#c11e3c]/20 hover:-translate-y-2 overflow-hidden shadow-xl border-b-8 border-[#c11e3c]"
                                    )}
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-5 mix-blend-overlay group-hover:opacity-10 transition-opacity" />
                                    <div className="absolute inset-0 bg-[#c11e3c] opacity-0 group-hover:opacity-5 transition-opacity duration-700 blur-xl" />

                                    <div className={cn(
                                        "mb-8 p-6 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-lg bg-white/5 text-white ring-1 ring-white/10 group-hover:bg-white/10"
                                    )}>
                                        <IconComp className="h-12 w-12" />
                                    </div>

                                    <h3 className="text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider text-center group-hover:text-[#c11e3c] transition-colors drop-shadow-md">
                                        {sys.name}
                                    </h3>

                                    <div className="absolute bottom-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Acessar</span>
                                        <ChevronRight className="h-5 w-5 text-[#c11e3c]" />
                                    </div>
                                </button>
                            );
                        })}
                        {systems.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white/50 rounded-lg border-2 border-dashed border-slate-200">
                                <Lock className="h-16 w-16 text-slate-300 mb-4" />
                                <h2 className="text-xl font-bold text-[#152341] uppercase tracking-tight">Nenhum Acesso Localizado</h2>
                                <p className="text-slate-500 text-sm mt-2 text-center max-w-sm">Sua conta não possui permissões vinculadas a nenhum sistema satélite. Entre em contato com a administração.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-24 pb-8 text-center text-xs text-slate-400 font-bold uppercase tracking-widest opacity-60">
                Infraestrutura Centralizada &copy; 2026
            </div>
        </div>
    );
}

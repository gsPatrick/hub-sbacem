"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, Info } from "lucide-react";
import HubGraphic from "@/components/ui/HubGraphic";

export default function UnauthorizedPage() {
    return (
        <main className="relative min-h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Graphic Component (Locked State via Prop if needed, but we'll use a special overlay) */}
            <div className="absolute inset-0 z-0 opacity-40">
                <HubGraphic isAuthenticating={true} />
            </div>

            {/* Content Card */}
            <div className="relative z-10 max-w-md w-full bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center">
                {/* Icon Header */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#c11e3c]/10 border border-[#c11e3c]/30 mb-6 relative">
                    <ShieldAlert className="h-10 w-10 text-[#c11e3c]" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-[#c11e3c] rounded-full animate-ping" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Acesso Negado</h1>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Você não possui permissão para acessar este sistema. Se você acredita que isso é um erro, entre em contato com o administrador do sistema.
                </p>

                {/* Detail List */}
                <div className="bg-[#0f172a]/50 rounded-2xl p-4 border border-slate-800 mb-8 text-left space-y-3">
                    <div className="flex items-start gap-3">
                        <Lock className="h-4 w-4 text-slate-500 mt-0.5" />
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</p>
                            <p className="text-sm text-slate-300">Acesso Não Autorizado</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Info className="h-4 w-4 text-slate-500 mt-0.5" />
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ação Recomendada</p>
                            <p className="text-sm text-slate-300">Solicite permissão no Painel de Controle.</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href="/hub"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#c11e3c] hover:bg-[#a01932] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#c11e3c]/20 group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Voltar para o Hub
                    </Link>

                    <button
                        onClick={() => window.location.href = "/login"}
                        className="w-full py-3 text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors"
                    >
                        Sair da Conta
                    </button>
                </div>
            </div>

            {/* Footer decoration */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-30 select-none pointer-events-none">
                <span className="text-[10px] text-slate-600 font-mono tracking-[0.5em] uppercase">Security Protocol Violation • Code 403</span>
            </div>
        </main>
    );
}

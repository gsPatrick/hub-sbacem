"use client";

import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Shield, Server } from "lucide-react";
import { cn } from "@/components/ui/Input";

export default function UserModal({ open, onOpenChange }) {
    const [activeTab, setActiveTab] = useState("identity");

    // Mock State
    const [isAdmin, setIsAdmin] = useState(false);
    const [systems, setSystems] = useState({
        "sat-1": { name: "Processamento PDF", access: false },
        "sat-2": { name: "Sistema OCR", access: true },
        "sat-3": { name: "Gestão Associados", access: false },
    });

    const toggleSystem = (key) => {
        setSystems(prev => ({
            ...prev,
            [key]: { ...prev[key], access: !prev[key].access }
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader>
                <DialogTitle className="text-[#152341] uppercase tracking-wide">Cadastro de Credencial</DialogTitle>
                <DialogDescription>
                    Gerenciamento do ciclo de vida da identidade. Todas as ações são auditadas.
                </DialogDescription>
            </DialogHeader>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                <button
                    onClick={() => setActiveTab("identity")}
                    className={cn(
                        "px-4 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors",
                        activeTab === "identity"
                            ? "border-[#c11e3c] text-[#c11e3c]"
                            : "border-transparent text-slate-500 hover:text-[#152341]"
                    )}
                >
                    Dados & Perfil
                </button>
                <button
                    onClick={() => setActiveTab("access")}
                    className={cn(
                        "px-4 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors",
                        activeTab === "access"
                            ? "border-[#c11e3c] text-[#c11e3c]"
                            : "border-transparent text-slate-500 hover:text-[#152341]"
                    )}
                >
                    Matriz de Acesso
                </button>
            </div>

            <div className="space-y-6 py-2">
                {activeTab === "identity" && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#152341] uppercase">E-mail Corporativo</label>
                            <Input placeholder="colaborador@empresa.com.br" className="rounded-sm border-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#152341] uppercase">Senha Temporária</label>
                            <Input type="password" placeholder="••••••••" className="rounded-sm border-slate-300" />
                        </div>

                        <div className="p-4 border border-slate-200 rounded-sm bg-slate-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-sm", isAdmin ? "bg-red-100 text-[#c11e3c]" : "bg-slate-200 text-slate-600")}>
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-[#152341] uppercase">Privilégios Administrativos</div>
                                        <div className="text-xs text-slate-500">Concede controle total sobre o Hub Central.</div>
                                    </div>
                                </div>
                                {/* Toggle Switch */}
                                <button
                                    onClick={() => setIsAdmin(!isAdmin)}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#c11e3c] focus:ring-offset-2",
                                        isAdmin ? "bg-[#c11e3c]" : "bg-slate-300"
                                    )}
                                >
                                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out", isAdmin ? "translate-x-6" : "translate-x-1")} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "access" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="text-xs uppercase font-bold text-slate-500 mb-2 tracking-wider">Permissões de Sistemas</div>
                        {Object.entries(systems).map(([key, sys]) => (
                            <div key={key} className="flex items-center justify-between p-3 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Server className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-bold text-[#152341]">{sys.name}</span>
                                </div>
                                <button
                                    onClick={() => toggleSystem(key)}
                                    className={cn(
                                        "text-[10px] font-bold px-3 py-1 rounded-sm transition-colors uppercase tracking-wide border",
                                        sys.access
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-slate-50 text-slate-500 border-slate-200"
                                    )}
                                >
                                    {sys.access ? "AUTORIZADO" : "BLOQUEADO"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)} className="uppercase text-xs font-bold tracking-wide">Cancelar Operação</Button>
                <Button onClick={() => onOpenChange(false)} className="bg-[#152341] hover:bg-[#0f172a] text-white uppercase text-xs font-bold tracking-wide">Salvar Alterações</Button>
            </DialogFooter>
        </Dialog>
    );
}

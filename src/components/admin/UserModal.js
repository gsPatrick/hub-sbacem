import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Shield, Server, Plus, Loader2 } from "lucide-react";
import { cn } from "@/components/ui/Input";
import { api } from "@/lib/api";
import SystemModal from "./SystemModal";

export default function UserModal({ open, onOpenChange, onSuccess }) {
    const [activeTab, setActiveTab] = useState("identity");
    const [isLoading, setIsLoading] = useState(false);
    const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    // Systems State
    const [systems, setSystems] = useState([]);
    const [selectedSystemIds, setSelectedSystemIds] = useState([]);

    // Fetch systems when modal opens
    useEffect(() => {
        if (open) {
            fetchSystems();
        } else {
            // Reset form on close
            setEmail("");
            setPassword("");
            setIsAdmin(false);
            setSelectedSystemIds([]);
            setActiveTab("identity");
        }
    }, [open]);

    const fetchSystems = async () => {
        try {
            const res = await api.get("/systems/");
            setSystems(res.data);
        } catch (error) {
            console.error("Failed to fetch systems", error);
        }
    };

    const toggleSystem = (systemId) => {
        setSelectedSystemIds(prev =>
            prev.includes(systemId)
                ? prev.filter(id => id !== systemId)
                : [...prev, systemId]
        );
    };

    const handleSave = async () => {
        if (!email || !password) {
            alert("Por favor, preencha e-mail e senha.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Create User
            const userPayload = {
                email,
                password,
                is_superadmin: isAdmin,
                role: isAdmin ? "admin" : "user" // Simple role mapping
            };

            const userRes = await api.post("/users/", userPayload);
            const newUserId = userRes.data.id;

            // 2. Grant Access to Selected Systems
            if (selectedSystemIds.length > 0) {
                await Promise.all(selectedSystemIds.map(systemId =>
                    api.post("/access/grant", {
                        user_id: newUserId,
                        system_id: systemId
                    })
                ));
            }

            if (onSuccess) onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to create user", error);
            alert("Erro ao criar usuário. Verifique se o e-mail já existe.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300" />
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#152341] to-[#c11e3c] uppercase tracking-tighter">
                        Nova Credencial
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Configure a identidade e as permissões de acesso do colaborador.
                    </DialogDescription>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6 mt-4">
                    <button
                        onClick={() => setActiveTab("identity")}
                        className={cn(
                            "px-4 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-all duration-300",
                            activeTab === "identity"
                                ? "border-[#c11e3c] text-[#c11e3c]"
                                : "border-transparent text-slate-400 hover:text-[#152341] hover:border-slate-300"
                        )}
                    >
                        Identidade
                    </button>
                    <button
                        onClick={() => setActiveTab("access")}
                        className={cn(
                            "px-4 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-all duration-300",
                            activeTab === "access"
                                ? "border-[#c11e3c] text-[#c11e3c]"
                                : "border-transparent text-slate-400 hover:text-[#152341] hover:border-slate-300"
                        )}
                    >
                        Acessos
                    </button>
                </div>

                <div className="p-6 space-y-6 min-h-[300px] max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {activeTab === "identity" && (
                        <div className="space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-[#c11e3c] transition-colors">
                                    E-mail Corporativo
                                </label>
                                <Input
                                    placeholder="colaborador@empresa.com.br"
                                    className="h-12 px-4 rounded-xl border-slate-200 focus:border-[#c11e3c] focus:ring-[#c11e3c]/20 transition-all bg-slate-50/50 focus:bg-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-[#c11e3c] transition-colors">
                                    Senha de Acesso
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-12 px-4 rounded-xl border-slate-200 focus:border-[#c11e3c] focus:ring-[#c11e3c]/20 transition-all bg-slate-50/50 focus:bg-white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="mt-6 p-5 border border-slate-200/60 rounded-xl bg-gradient-to-br from-slate-50 to-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500",
                                            isAdmin ? "bg-red-100 text-[#c11e3c] scale-110 shadow-lg shadow-red-100" : "bg-slate-100 text-slate-400"
                                        )}>
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold gap-2 flex items-center text-[#152341] uppercase tracking-wide">
                                                Administrador Master
                                                {isAdmin && <span className="flex h-2 w-2 rounded-full bg-[#c11e3c] motion-safe:animate-pulse"></span>}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5">Autorização total para o Hub.</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsAdmin(!isAdmin)}
                                        className={cn(
                                            "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#c11e3c] focus:ring-offset-2",
                                            isAdmin ? "bg-[#c11e3c] shadow-inner" : "bg-slate-200"
                                        )}
                                    >
                                        <span className={cn(
                                            "inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-500 shadow-sm",
                                            isAdmin ? "translate-x-6" : "translate-x-1"
                                        )} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "access" && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-[#152341] uppercase tracking-wide">Vinculação de Sistemas</h3>
                                    <p className="text-xs text-slate-500 mt-1">Autorize o login SSO para esta credencial.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-[#c11e3c] border-[#c11e3c]/20 hover:bg-[#c11e3c]/10 h-8 text-[10px] uppercase font-bold tracking-widest rounded-lg"
                                    onClick={() => setIsSystemModalOpen(true)}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Novo
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {systems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-300 text-center">
                                        <Server className="h-8 w-8 text-slate-300 mb-2" />
                                        <p className="text-slate-500 font-medium text-sm">Nenhum sistema cadastrado.</p>
                                        <p className="text-slate-400 text-xs mt-1">Clique em "Novo" para adicionar.</p>
                                    </div>
                                ) : (
                                    systems.map((sys) => {
                                        const hasAccess = selectedSystemIds.includes(sys.id);
                                        return (
                                            <div 
                                                key={sys.id} 
                                                onClick={() => toggleSystem(sys.id)}
                                                className={cn(
                                                    "group flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300",
                                                    hasAccess 
                                                        ? "border-[#c11e3c]/40 bg-red-50/30 hover:border-[#c11e3c] hover:bg-red-50/50 shadow-sm" 
                                                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                                                        hasAccess ? "bg-[#c11e3c]/10 text-[#c11e3c]" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                                    )}>
                                                        <Server className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-[#152341] block">{sys.name}</span>
                                                        <span className="text-xs text-slate-400 block mt-0.5">{sys.base_url}</span>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                                        hasAccess ? "border-[#c11e3c] bg-[#c11e3c]" : "border-slate-300"
                                                    )}>
                                                        {hasAccess && (
                                                            <svg className="w-3 h-3 text-white animate-in zoom-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-2 border-t border-slate-100 mt-2 bg-slate-50/50">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        className="uppercase text-xs font-bold tracking-widest text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl px-6" 
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-[#c11e3c] hover:bg-[#a01830] text-white uppercase text-xs font-bold tracking-widest rounded-xl px-8 shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
                        ) : (
                            "Criar Credencial"
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>

            <SystemModal
                open={isSystemModalOpen}
                onOpenChange={setIsSystemModalOpen}
                onSuccess={fetchSystems}
            />
        </>
    );
}

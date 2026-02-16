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
                                <Input
                                    placeholder="colaborador@empresa.com.br"
                                    className="rounded-sm border-slate-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#152341] uppercase">Senha</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="rounded-sm border-slate-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
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
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Permissões de Sistemas</div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#c11e3c] hover:bg-[#c11e3c]/10 h-7 text-xs uppercase font-bold"
                                    onClick={() => setIsSystemModalOpen(true)}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Novo Sistema
                                </Button>
                            </div>

                            {systems.length === 0 ? (
                                <div className="text-center p-6 bg-slate-50 rounded-sm border border-dashed border-slate-300 text-slate-400 text-sm">
                                    Nenhum sistema disponível.
                                </div>
                            ) : (
                                systems.map((sys) => {
                                    const hasAccess = selectedSystemIds.includes(sys.id);
                                    return (
                                        <div key={sys.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Server className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm font-bold text-[#152341]">{sys.name}</span>
                                            </div>
                                            <button
                                                onClick={() => toggleSystem(sys.id)}
                                                className={cn(
                                                    "text-[10px] font-bold px-3 py-1 rounded-sm transition-colors uppercase tracking-wide border",
                                                    hasAccess
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-slate-50 text-slate-500 border-slate-200"
                                                )}
                                            >
                                                {hasAccess ? "AUTORIZADO" : "BLOQUEADO"}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="uppercase text-xs font-bold tracking-wide" disabled={isLoading}>Cancelar Operação</Button>
                    <Button
                        onClick={handleSave}
                        className="bg-[#152341] hover:bg-[#0f172a] text-white uppercase text-xs font-bold tracking-wide"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </Dialog>

            <SystemModal
                open={isSystemModalOpen}
                onOpenChange={setIsSystemModalOpen}
                onSuccess={() => {
                    fetchSystems(); // Refresh list after creating new system
                }}
            />
        </>
    );
}

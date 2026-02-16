"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Shield, Check, X, RefreshCw } from "lucide-react";

export default function SystemAccessModal({ open, onOpenChange, user, onSuccess }) {
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            fetchSystems();
        }
    }, [open, user]);

    const fetchSystems = async () => {
        setLoading(true);
        try {
            // In a real app, you'd fetch both all systems and the user's specific access
            // For now, let's assume the user object might have system_ids or we fetch a list
            const response = await api.get("/systems/");
            setSystems(response.data);
        } catch (error) {
            console.error("Error fetching systems", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAccess = async (systemId) => {
        setSaving(true);
        try {
            // Mock API call to toggle access
            // await api.post(`/users/${user.id}/systems/${systemId}/toggle`);
            alert("Funcionalidade em desenvolvimento: O backend ainda não possui o endpoint centralizado de acesso por usuário/sistema.");
        } catch (error) {
            console.error("Error toggling access", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-slate-200">
                <DialogHeader>
                    <div className="h-10 w-10 rounded-sm bg-slate-100 flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-[#152341]" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-[#152341] uppercase tracking-tight">
                        Controle de Sistemas
                    </DialogTitle>
                    <p className="text-slate-500 text-sm">
                        Gerencie quais sistemas <strong>{user?.email}</strong> pode acessar.
                    </p>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-auto pr-2">
                            {systems.map((sys) => (
                                <div
                                    key={sys.id}
                                    className="flex items-center justify-between p-3 rounded-sm border border-slate-100 hover:bg-slate-50 transition-colors"
                                >
                                    <div>
                                        <div className="font-bold text-[#152341] text-sm">{sys.name}</div>
                                        <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{sys.base_url}</div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant={sys.id % 2 === 0 ? "outline" : "default"} // Mock state
                                        className={sys.id % 2 === 0 ? "text-slate-400 border-slate-200" : "bg-green-600 hover:bg-green-700 text-white"}
                                        onClick={() => handleToggleAccess(sys.id)}
                                        disabled={saving}
                                    >
                                        {sys.id % 2 === 0 ? (
                                            <><X className="h-3 w-3 mr-1" /> Bloqueado</>
                                        ) : (
                                            <><Check className="h-3 w-3 mr-1" /> Liberado</>
                                        )}
                                    </Button>
                                </div>
                            ))}
                            {systems.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm italic">
                                    Nenhum sistema registrado.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="uppercase font-bold text-xs tracking-widest">
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

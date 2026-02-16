"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
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
    const [userSystemIds, setUserSystemIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        if (open) {
            fetchSystems();
        }
    }, [open, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allSystemsRes, userSystemsRes] = await Promise.all([
                api.get("/systems/"),
                api.get(`/users/${user.id}/systems`)
            ]);
            setSystems(allSystemsRes.data);
            setUserSystemIds(userSystemsRes.data.map(s => s.id));
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAccess = async (systemId) => {
        setSavingId(systemId);
        const hasAccess = userSystemIds.includes(systemId);

        try {
            if (hasAccess) {
                await api.post("/access/revoke", {
                    user_id: user.id,
                    system_id: systemId
                });
                setUserSystemIds(prev => prev.filter(id => id !== systemId));
            } else {
                await api.post("/access/grant", {
                    user_id: user.id,
                    system_id: systemId
                });
                setUserSystemIds(prev => [...prev, systemId]);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error toggling access", error);
            alert("Erro ao alterar acesso.");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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

            <div className="py-2 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[300px] overflow-auto pr-2">
                        {systems.map((sys) => {
                            const isLiberado = userSystemIds.includes(sys.id);
                            const isSaving = savingId === sys.id;

                            return (
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
                                        variant={!isLiberado ? "outline" : "default"}
                                        className={!isLiberado ? "text-slate-400 border-slate-200" : "bg-green-600 hover:bg-green-700 text-white"}
                                        onClick={() => handleToggleAccess(sys.id)}
                                        disabled={!!savingId}
                                    >
                                        {isSaving ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : isLiberado ? (
                                            <><Check className="h-3 w-3 mr-1" /> Liberado</>
                                        ) : (
                                            <><X className="h-3 w-3 mr-1" /> Bloqueado</>
                                        )}
                                    </Button>
                                </div>
                            );
                        })}
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
        </Dialog>
    );
}

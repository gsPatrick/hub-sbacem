"use client";

import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

export default function SystemModal({ open, onOpenChange, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        base_url: ""
    });

    const handleSubmit = async () => {
        if (!formData.name || !formData.base_url) return;

        setIsLoading(true);
        try {
            await api.post("/systems/", formData);
            if (onSuccess) onSuccess();
            onOpenChange(false);
            setFormData({ name: "", base_url: "" });
        } catch (error) {
            console.error("Failed to create system", error);
            alert("Erro ao criar sistema. Verifique os dados.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader>
                <DialogTitle className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#152341] to-[#c11e3c] uppercase tracking-tighter">
                    Cadastro de Sistema
                </DialogTitle>
                <p className="text-sm font-medium text-slate-500 mt-2">
                    Adicione um novo sistema satélite ao ecossistema Hub Central.
                </p>
            </DialogHeader>

            <div className="py-6 space-y-6 flex-1">
                <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-[#c11e3c] transition-colors">
                        Nome do Sistema
                    </label>
                    <Input
                        placeholder="Ex: Gestão Associados"
                        className="h-12 px-4 rounded-xl border-slate-200 focus:border-[#c11e3c] focus:ring-[#c11e3c]/20 transition-all bg-slate-50/50 focus:bg-white"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-[#c11e3c] transition-colors">
                        URL Base (HTTPS)
                    </label>
                    <Input
                        placeholder="Ex: https://app.sbacem.com.br"
                        className="h-12 px-4 rounded-xl border-slate-200 focus:border-[#c11e3c] focus:ring-[#c11e3c]/20 transition-all bg-slate-50/50 focus:bg-white"
                        value={formData.base_url}
                        onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                    />
                </div>
            </div>

            <DialogFooter>
                <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)} 
                    disabled={isLoading}
                    className="uppercase text-xs font-bold tracking-widest text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl px-6" 
                >
                    Cancelar
                </Button>
                <Button
                    className="bg-[#c11e3c] hover:bg-[#a01830] text-white uppercase text-xs font-bold tracking-widest rounded-xl px-8 shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? "Processando..." : "Salvar Matriz"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

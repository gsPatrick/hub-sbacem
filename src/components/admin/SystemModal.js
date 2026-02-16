"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Cadastro de Sistema</DialogTitle>
                    <p className="text-sm text-slate-500">Adicione um novo sistema satélite ao ecossistema.</p>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nome do Sistema</label>
                        <Input
                            placeholder="Ex: Gestão Associados"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">URL Base (HTTPS)</label>
                        <Input
                            placeholder="Ex: https://app.sbacem.com.br"
                            value={formData.base_url}
                            onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-[#c11e3c] hover:bg-[#a01830] text-white font-bold"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Salvando..." : "Salvar Sistema"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

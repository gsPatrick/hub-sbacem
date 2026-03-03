"use client";

import { X, CheckCircle, XCircle, Clock, MapPin, User, Music, Phone, Mail, CreditCard, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProposalDetailModal({ open, onOpenChange, proposalId, onSuccess }) {
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (open && proposalId) {
            fetchProposal();
        } else {
            setProposal(null);
        }
    }, [open, proposalId]);

    const fetchProposal = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/proposals/${proposalId}`);
            setProposal(res.data);
        } catch (error) {
            console.error("Error fetching proposal detail", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (newStatus) => {
        setActionLoading(true);
        try {
            await api.post(`/proposals/bulk/status`, {
                ids: [proposalId],
                status: newStatus
            });
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating status", error);
        } finally {
            setActionLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-4 bg-[#152341] text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                            <FileText size={20} className="text-[#c11e3c]" />
                            Detalhamento da Proposta
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            Protocolo: {proposal?.protocol || "..."}
                        </p>
                    </div>
                    <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c11e3c]"></div>
                    </div>
                ) : !proposal ? (
                    <div className="flex-1 p-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                        Proposta não encontrada.
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Situação Atual:</div>
                                <Badge variant={proposal.status === 'APROVADA' ? 'success' : proposal.status === 'REJEITADA' ? 'destructive' : 'warning'}>
                                    {proposal.status}
                                </Badge>
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Recebida em: {new Date(proposal.createdAt).toLocaleString('pt-BR')}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Identificação */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <User size={16} className="text-[#c11e3c]" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#152341]">Titularidade</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Nome Completo</label>
                                        <p className="text-sm font-bold text-[#152341]">{proposal.person.fullName}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">CPF</label>
                                            <p className="text-sm font-bold text-[#152341]">{proposal.person.cpfMasked}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Nascimento</label>
                                            <p className="text-sm font-bold text-[#152341]">{proposal.person.birthDate || "---"}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-slate-300" />
                                            <span className="text-xs font-medium text-slate-600">{proposal.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-slate-300" />
                                            <span className="text-xs font-medium text-slate-600">{proposal.celular}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Artístico / Gestão */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <Music size={16} className="text-[#c11e3c]" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#152341]">Dados Artísticos & Gestão</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Nome Artístico</label>
                                        <p className="text-sm font-bold text-[#152341]">{proposal.person.artisticName || "NÃO INFORMADO"}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Associação</label>
                                            <Badge className="bg-[#152341] hover:bg-[#152341]">{proposal.person.association || "PENDENTE"}</Badge>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">CAE / IPI</label>
                                            <p className="text-sm font-mono font-bold text-[#152341]">{proposal.person.cae_ipi || "---"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">IPN</label>
                                        <p className="text-sm font-mono font-bold text-[#152341]">{proposal.person.ipn || "---"}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Endereço */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <MapPin size={16} className="text-[#c11e3c]" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#152341]">Residência</h3>
                                </div>
                                <div className="text-sm text-slate-600 font-medium">
                                    {proposal.address.street}, {proposal.address.number}<br />
                                    {proposal.address.complement && <span className="text-xs text-slate-400">{proposal.address.complement}<br /></span>}
                                    {proposal.address.district} — {proposal.address.city}/{proposal.address.state}<br />
                                    CEP: {proposal.address.cep}
                                </div>
                            </section>

                            {/* Financeiro */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                    <CreditCard size={16} className="text-[#c11e3c]" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#152341]">Dados Bancários</h3>
                                </div>
                                {proposal.bankAccounts.length > 0 ? (
                                    proposal.bankAccounts.map(bank => (
                                        <div key={bank.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <p className="text-xs font-black text-[#152341] uppercase tracking-tight">{bank.bankCode}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">AG: {bank.agencyMasked} | CC: {bank.accountMasked}</p>
                                            <p className="text-[10px] text-[#c11e3c] font-black uppercase mt-1">{bank.accountType}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Nenhum dado bancário informado.</p>
                                )}
                            </section>
                        </div>

                        {/* Documentos */}
                        <section className="space-y-4 pt-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <FileText size={16} className="text-[#c11e3c]" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#152341]">Documentação Anexa</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {proposal.documents?.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg text-[#152341]">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{doc.type}</p>
                                                <p className="text-xs font-bold text-[#152341] truncate max-w-[150px]">{doc.fileName}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-[#c11e3c] h-8 w-8 p-0" onClick={() => window.open(doc.url, '_blank')}>
                                            <ExternalLink size={14} />
                                        </Button>
                                    </div>
                                ))}
                                {(!proposal.documents || proposal.documents.length === 0) && (
                                    <p className="text-xs text-slate-400 italic col-span-2">Nenhum documento anexo.</p>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <Button variant="ghost" className="uppercase text-[10px] font-black tracking-widest text-slate-400" onClick={() => onOpenChange(false)}>
                        Fechar Janela
                    </Button>
                    <div className="flex gap-3">
                        {proposal?.status !== 'REJEITADA' && (
                            <Button
                                variant="destructive"
                                className="uppercase text-[10px] font-black tracking-widest h-10 px-6 bg-transparent text-red-600 border border-red-600 hover:bg-red-50"
                                onClick={() => handleAction('REJEITADA')}
                                disabled={actionLoading}
                            >
                                <XCircle className="mr-2 h-3.5 w-3.5" /> Rejeitar Proposta
                            </Button>
                        )}
                        {proposal?.status !== 'APROVADA' && (
                            <Button
                                className="uppercase text-[10px] font-black tracking-widest h-10 px-6 bg-[#152341] hover:bg-[#c11e3c]"
                                onClick={() => handleAction('APROVADA')}
                                disabled={actionLoading}
                            >
                                <CheckCircle className="mr-2 h-3.5 w-3.5" /> Aprovar Titular
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

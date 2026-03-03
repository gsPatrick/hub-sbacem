
"use client";

import { useState, useCallback } from "react";
import {
    User,
    MapPin,
    Music,
    FileCheck,
    ChevronRight,
    ChevronLeft,
    Upload,
    Check,
    AlertCircle,
    Loader2,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Collapsible } from "@/components/ui/Collapsible";

// Configuração do Backend (Flask)
const BACKEND_URL = "http://localhost:5001/api";

const STAGES = [
    { id: 1, name: "Dados", icon: User },
    { id: 2, name: "Artístico", icon: Music },
    { id: 3, name: "Documentos", icon: Upload },
    { id: 4, name: "Assinatura", icon: FileCheck },
];

export default function FiliacaoDigital() {
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState({
        nome_completo: "",
        cpf: "",
        email: "",
        celular: "",
        data_nascimento: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
        perfil_artistico: "",
        nome_artistico: "",
        associacao: "",
        numero_cae_ipi: "",
        ipn: "",
        // Dados Bancários (Simulado para o fix do mobile)
        banco: "",
        agencia: "",
        conta: "",
    });

    const [files, setFiles] = useState({
        identificacao: null,
        residencia: null,
    });

    const [uploadStatus, setUploadStatus] = useState({
        identificacao: 'idle', // idle, sending, success, error
        residencia: 'idle',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [protocolo, setProtocolo] = useState(null);
    const [draftId, setDraftId] = useState(null);
    const [draftToken, setDraftToken] = useState(null);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[field];
                return newErrs;
            });
        }
    };

    const handleFileUpload = (type, file) => {
        setFiles(prev => ({ ...prev, [type]: file }));
        setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        if (step === 1) {
            if (!form.nome_completo) newErrors.nome_completo = "Campo obrigatório";
            if (!form.cpf) newErrors.cpf = "Campo obrigatório";
            if (!form.email) newErrors.email = "Campo obrigatório";

            // Simulação de erro bancário para teste do mobile fix
            if (!form.banco) newErrors.banco = "Informe o banco";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSaveDraft = async () => {
        setIsSavingDraft(true);
        try {
            const url = draftId 
                ? `${BACKEND_URL}/public/drafts/${draftId}` 
                : `${BACKEND_URL}/public/drafts`;
            
            const method = draftId ? "PATCH" : "POST";
            const headers = { "Content-Type": "application/json" };
            if (draftId && draftToken) headers["x-draft-token"] = draftToken;

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify({ data: form, draftToken: draftToken }),
            });

            const result = await response.json();
            if (!draftId && result.draftId) {
                setDraftId(result.draftId);
                setDraftToken(result.draftToken);
            }
            alert("Rascunho salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar rascunho:", error);
            alert("Erro ao salvar rascunho.");
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));
        if (files.identificacao) formData.append('identificacao', files.identificacao);
        if (files.residencia) formData.append('residencia', files.residencia);
        
        if (draftId) formData.append('draftId', draftId);
        if (draftToken) formData.append('draftToken', draftToken);

        try {
            const response = await fetch(`${BACKEND_URL}/propostas`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                setProtocolo(result.protocolo);
                setCurrentStep(5); // Success state
            }
        } catch (error) {
            console.error("Erro no envio:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Renderiza o seletor de passos
    const renderStepper = () => (
        <div className="flex justify-between items-center mb-12 w-full max-w-xl mx-auto">
            {STAGES.map((s, idx) => {
                const Icon = s.icon;
                const isCompleted = currentStep > s.id;
                const isActive = currentStep === s.id;

                return (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? "bg-[#c11e3c] text-white" :
                                    isActive ? "bg-[#152341] text-white ring-4 ring-[#c11e3c]/20" :
                                        "bg-white text-slate-300 border-2 border-slate-100"
                                }`}>
                                {isCompleted ? <Check size={20} fontWeight="bold" /> : <Icon size={20} />}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-[#152341]" : "text-slate-400"
                                }`}>{s.name}</span>
                        </div>
                        {idx < STAGES.length - 1 && (
                            <div className="flex-1 h-0.5 bg-slate-100 mx-2 -translate-y-3">
                                <div className={`h-full bg-[#c11e3c] transition-all duration-700 ${isCompleted ? "w-full" : "w-0"
                                    }`} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F4F7F9] text-[#152341] flex flex-col items-center py-12 px-6">
            {/* Header */}
            <header className="w-full max-w-4xl flex items-center justify-between mb-16 px-4">
                <img src="/sbacem.png" alt="SBACEM" className="h-12 w-auto" />
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-[#c11e3c] uppercase tracking-[0.3em]">Filiação Digital</span>
                    <span className="text-xs font-bold text-slate-400">PROTOCOLO: {protocolo || "---"}</span>
                </div>
            </header>

            {/* Stepper */}
            {currentStep <= 4 && renderStepper()}

            {/* Form Card */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="h-2 bg-gradient-to-r from-[#152341] to-[#c11e3c]" />

                <div className="p-8 lg:p-12">
                    {/* STEP 1: DADOS PESSOAIS */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-slate-100 rounded-lg text-[#152341]">
                                    <User size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter">Identificação & Localização</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Nome Completo"
                                    placeholder="Como no RG"
                                    value={form.nome_completo}
                                    onChange={(e) => updateField('nome_completo', e.target.value)}
                                    error={errors.nome_completo}
                                />
                                <Input
                                    label="CPF"
                                    placeholder="000.000.000-00"
                                    value={form.cpf}
                                    onChange={(e) => updateField('cpf', e.target.value)}
                                    error={errors.cpf}
                                />
                            </div>

                            {/* Endereço */}
                            <div className="pt-4 border-t border-slate-50 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#c11e3c]">Residência</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="CEP"
                                        value={form.cep}
                                        onChange={(e) => updateField('cep', e.target.value)}
                                    />
                                    <Input
                                        label="Cidade"
                                        value={form.cidade}
                                        onChange={(e) => updateField('cidade', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* DADOS BANCÁRIOS (Mobile Fix - Collapsible) */}
                            <div className="pt-6">
                                <Collapsible
                                    title="Dados Bancários para Recebimento"
                                    error={!!(errors.banco || errors.agencia || errors.conta)}
                                >
                                    <div className="space-y-6">
                                        <Input
                                            label="Banco"
                                            placeholder="Ex: Itaú, Bradesco"
                                            value={form.banco}
                                            onChange={(e) => updateField('banco', e.target.value)}
                                            error={errors.banco}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Agência" value={form.agencia} onChange={(e) => updateField('agencia', e.target.value)} />
                                            <Input label="Conta" value={form.conta} onChange={(e) => updateField('conta', e.target.value)} />
                                        </div>
                                    </div>
                                </Collapsible>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PERFIL ARTÍSTICO */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-slate-100 rounded-lg text-[#152341]">
                                    <Music size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter">Trajetória Artística</h2>
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed">
                                Conte-nos um pouco sobre sua carreira. Isso nos ajuda a otimizar a gestão dos seus direitos.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Nome Artístico"
                                    placeholder="Ex: Seu Nome de Palco"
                                    value={form.nome_artistico}
                                    onChange={(e) => updateField('nome_artistico', e.target.value)}
                                />
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Associação</label>
                                    <select
                                        className="h-10 px-3 bg-white border-2 border-slate-100 rounded-lg focus:border-[#c11e3c] outline-none transition-all text-sm font-medium"
                                        value={form.associacao}
                                        onChange={(e) => updateField('associacao', e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="UBC">UBC</option>
                                        <option value="ABRAMUS">ABRAMUS</option>
                                        <option value="SICAM">SICAM</option>
                                        <option value="SOCINPRO">SOCINPRO</option>
                                        <option value="AMAR">AMAR</option>
                                        <option value="ASSIM">ASSIM</option>
                                        <option value="SADEMBRA">SADEMBRA</option>
                                    </select>
                                </div>
                                <Input
                                    label="Número CAE / IPI"
                                    placeholder="000.00.00.00"
                                    value={form.numero_cae_ipi}
                                    onChange={(e) => updateField('numero_cae_ipi', e.target.value)}
                                />
                                <Input
                                    label="IPN"
                                    placeholder="Identificador Internacional"
                                    value={form.ipn}
                                    onChange={(e) => updateField('ipn', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Resumo da Trajetória</label>
                                <textarea
                                    className="w-full h-32 p-4 border-2 border-slate-100 rounded-lg focus:border-[#c11e3c] outline-none transition-all text-sm font-medium"
                                    placeholder="Descreva seus principais trabalhos, parcerias e objetivos..."
                                    value={form.perfil_artistico}
                                    onChange={(e) => updateField('perfil_artistico', e.target.value)}
                                />
                            </div>

                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Enriquecer via Redes Sociais</h4>
                                <div className="flex gap-4">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg font-bold text-xs hover:bg-green-600 transition-colors">
                                        Spotify
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg font-bold text-xs hover:bg-red-700 transition-colors">
                                        YouTube
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: DOCUMENTOS (Opcionais com Feedback) */}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-slate-100 rounded-lg text-[#152341]">
                                    <Upload size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter">Comprovação (Opcional)</h2>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { id: 'identificacao', label: 'Documento de Identidade', desc: 'RG, CNH ou Passaporte' },
                                    { id: 'residencia', label: 'Comprovante de Residência', desc: 'Conta de luz, água ou telefone' }
                                ].map((doc) => (
                                    <div key={doc.id} className="relative group">
                                        <div className="flex items-center justify-between p-6 border-2 border-dashed border-slate-200 rounded-2xl group-hover:border-[#c11e3c]/30 transition-all bg-white">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-full ${uploadStatus[doc.id] === 'success' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    {uploadStatus[doc.id] === 'success' ? <Check size={20} /> : <Upload size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black uppercase tracking-tight">{doc.label}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.desc}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Badge variant={
                                                    uploadStatus[doc.id] === 'success' ? 'success' :
                                                        uploadStatus[doc.id] === 'sending' ? 'warning' : 'neutral'
                                                }>
                                                    {uploadStatus[doc.id] === 'success' ? 'VINCULADO' :
                                                        uploadStatus[doc.id] === 'sending' ? 'ENVIANDO...' : 'PENDENTE'}
                                                </Badge>

                                                <input
                                                    type="file"
                                                    id={`file-${doc.id}`}
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => document.getElementById(`file-${doc.id}`).click()}
                                                >
                                                    {files[doc.id] ? 'Trocar' : 'Selecionar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-amber-50 rounded-lg flex items-start gap-3">
                                <AlertCircle className="text-amber-600 shrink-0" size={18} />
                                <p className="text-xs font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
                                    Os documentos não são obrigatórios para o envio da proposta, mas podem agilizar a análise pela diretoria.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: REVISÃO & ASSINATURA */}
                    {currentStep === 4 && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-slate-100 rounded-lg text-[#152341]">
                                    <FileCheck size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter">Finalização & Assinatura</h2>
                            </div>

                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                                    Ao clicar em finalizar, você receberá um link da <strong className="text-[#152341]">CLICKSIGN</strong> no e-mail <br />
                                    <span className="text-[#c11e3c] font-black underline">{form.email}</span> <br />
                                    para a assinatura oficial do termo de filiação.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="mt-12 flex justify-between gap-4">
                        {currentStep > 1 && (
                            <Button variant="ghost" className="font-black uppercase tracking-widest" onClick={prevStep}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="border-slate-200 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50"
                            onClick={handleSaveDraft}
                            disabled={isSavingDraft}
                        >
                            {isSavingDraft ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Salvar Rascunho
                        </Button>
                        <Button
                            className="flex-1 bg-[#152341] hover:bg-[#c11e3c] font-black uppercase tracking-widest h-14 group"
                            onClick={currentStep === 4 ? handleSubmit : nextStep}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin mr-2" />
                            ) : null}
                            {currentStep === 4 ? "Finalizar Proposta" : "Continuar"}
                            {!isSubmitting && <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">
                Infraestrutura SBACEM &copy; 2026 <br />
                <span className="opacity-50">Desenvolvido por figa.app.br</span>
            </footer>

            {/* Success Overay */}
            {currentStep === 5 && (
                <div className="fixed inset-0 bg-[#152341]/95 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl animate-in zoom-in-90 duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Sucesso!</h2>
                        <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs leading-relaxed">
                            Sua proposta foi processada com sucesso. <br />
                            Anote seu protocolo de acompanhamento:
                        </p>
                        <div className="bg-slate-100 p-6 rounded-2xl mb-8 flex flex-col gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo de Segurança</span>
                            <span className="text-4xl font-black text-[#152341] tracking-tighter">{protocolo}</span>
                        </div>
                        <Button className="w-full h-12 bg-[#152341] font-black uppercase tracking-widest" onClick={() => window.location.href = '/'}>
                            Voltar ao Dashboard
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

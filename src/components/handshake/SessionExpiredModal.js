import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SessionExpiredModal({ onVerify, systemName }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#152341]/80 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-2xl max-w-sm w-full text-center">
                <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-slate-500" />
                </div>

                <h2 className="text-xl font-bold mb-2 text-[#152341] uppercase">Sessão Expirada</h2>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    Sua sessão segura para <strong>{systemName}</strong> foi encerrada por inatividade. Revalide sua identidade para continuar.
                </p>

                <Button onClick={onVerify} className="w-full bg-[#c11e3c] hover:bg-[#a01830] text-white font-bold uppercase tracking-wide h-11">
                    Revalidar Acesso
                </Button>
            </div>
        </div>
    );
}

import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AccessDeniedScreen({ systemName, onBackToHub }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F4F7F9] text-[#152341]">
            <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-md max-w-md w-full text-center">
                <div className="mx-auto h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert className="h-8 w-8 text-[#c11e3c]" />
                </div>

                <h1 className="text-2xl font-bold mb-2 uppercase tracking-wide text-[#152341]">Acesso Negado</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Sua credencial não possui autorização vigente para o sistema <strong className="text-[#152341]">{systemName}</strong>.
                    <br />Entre em contato com o administrador de segurança.
                </p>

                <Button onClick={onBackToHub} className="w-full bg-[#152341] hover:bg-[#0f172a] text-white font-bold uppercase tracking-wide h-12">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retornar ao Painel
                </Button>
            </div>
        </div>
    );
}

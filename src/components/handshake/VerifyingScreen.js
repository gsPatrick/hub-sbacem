import { Loader2 } from "lucide-react";

export default function VerifyingScreen({ message = "Validando credenciais de segurança...", color = "#c11e3c" }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
            <Loader2
                className="h-12 w-12 animate-spin mb-4"
                style={{ color: color }}
            />
            <h2 className="text-lg font-bold text-[#152341] uppercase tracking-wide">
                {message}
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
                Estabelecendo conexão segura com o Hub Central...
            </p>
        </div>
    );
}

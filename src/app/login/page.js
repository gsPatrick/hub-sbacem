"use client";

import { useState } from "react";
import HubGraphic from "@/components/ui/HubGraphic";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Scene Interaction Flags
    const [isFocused, setIsFocused] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("Tentativa de acesso:", email);

            // Handshake Simulation
            setTimeout(() => {
                if (email === "admin@admin.com") {
                    router.push("/admin");
                } else {
                    router.push("/hub");
                }
                setLoading(false);
            }, 2000);
        } catch (err) {
            setError("Credenciais inválidas. Verifique seus dados.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-[#F4F7F9]">
            {/* LADO ESQUERDO: Gráfico Institucional */}
            <div className="relative w-full h-[40vh] lg:h-screen lg:w-1/2 bg-[#0f172a] overflow-hidden order-1 lg:order-1 border-b-4 lg:border-b-0 lg:border-r-4 border-[#152341]">
                <div className="absolute inset-0 z-0">
                    <HubGraphic isAuthenticating={loading} isFocused={isFocused} />
                </div>

                {/* Título Sobreposto (Discreto) */}
                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <h2 className="text-white/80 font-bold uppercase tracking-widest text-xs lg:text-sm">
                        Infraestrutura Central
                    </h2>
                    <p className="text-slate-500 text-[10px] lg:text-xs">
                        Monitoramento de acesso v2.1
                    </p>
                </div>
            </div>

            {/* LADO DIREITO: Formulário */}
            <div className="flex w-full h-[60vh] lg:h-screen lg:w-1/2 items-center justify-center bg-white p-6 lg:p-16 order-2 lg:order-2 shadow-2xl z-20">
                <div className="w-full max-w-sm lg:max-w-md space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Logos */}
                    <div className="flex flex-col items-center text-center space-y-4 lg:space-y-8">
                        <div className="flex items-center gap-6 lg:gap-8 justify-center opacity-100">
                            <div className="h-12 lg:h-16 w-auto relative flex items-center justify-center">
                                <img src="/sbacem.png" alt="Logo SBACEM" className="h-10 lg:h-12 w-auto object-contain hover:scale-105 transition-transform" />
                            </div>
                            <div className="h-8 lg:h-10 w-px bg-slate-200"></div>
                            <div className="h-12 lg:h-16 w-auto relative flex items-center justify-center">
                                <img src="/figa.png" alt="Logo FIGA" className="h-10 lg:h-12 w-auto object-contain hover:scale-105 transition-transform" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-[#152341] uppercase">
                                Portal Corporativo
                            </h2>
                            <p className="text-xs lg:text-sm text-slate-500 mt-2 font-medium">
                                Autenticação segura de múltiplos fatores.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 lg:space-y-6 mt-4 lg:mt-8">
                        <div className="space-y-2">
                            <label className="text-xs lg:text-sm font-bold text-[#152341] uppercase tracking-wide flex items-center gap-2">
                                <UserIcon className="h-3 w-3 text-[#c11e3c]" /> Identificação
                            </label>
                            <Input
                                type="email"
                                placeholder="usuario@dominio.com.br"
                                className="h-12 border-slate-300 focus:border-[#c11e3c] focus:ring-[#c11e3c] rounded-sm bg-slate-50 text-slate-900 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs lg:text-sm font-bold text-[#152341] uppercase tracking-wide flex items-center gap-2">
                                    <Lock className="h-3 w-3 text-[#c11e3c]" /> Senha
                                </label>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-12 border-slate-300 focus:border-[#c11e3c] focus:ring-[#c11e3c] rounded-sm bg-slate-50 text-slate-900 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-xs text-[#c11e3c] font-bold bg-red-50 p-3 rounded-sm border-l-4 border-[#c11e3c] uppercase shadow-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#c11e3c] hover:bg-[#a01830] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? "Estabelecendo Conexão..." : "Acessar Sistema"}
                        </Button>
                    </form>

                    <div className="text-center space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            Conexão Criptografada (TLS 1.3)
                        </p>
                        <p className="text-[10px] text-slate-300">
                            &copy; 2026 Centralizadora V2
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

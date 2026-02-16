"use client";

import { ShieldCheck, Database, FileText, Activity, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function HubGraphic({ isAuthenticating }) {
    const lineColor = "#334155"; // Slate-700
    const activeLineColor = "#c11e3c"; // Crimson
    const [systems, setSystems] = useState([]);

    useEffect(() => {
        const fetchSystems = async () => {
            try {
                const res = await fetch("https://api.sbacem.com.br/apicentralizadora/systems/public");
                if (res.ok) {
                    const data = await res.json();
                    setSystems(data);
                }
            } catch (err) {
                console.error("Failed to fetch systems:", err);
                // Fallback to static names if API fails
                setSystems([
                    { id: 1, name: "Intelligence" },
                    { id: 2, name: "CRM" },
                    { id: 3, name: "Sistema Cadastro" },
                    { id: 4, name: "Fonogramas" }
                ]);
            }
        };
        fetchSystems();
    }, []);

    // Helper to get system name or fallback
    const getSysName = (index, fallback) => {
        return systems[index]?.name || fallback;
    };

    return (
        <div className="w-full h-full flex items-center justify-center relative bg-[#0f172a] overflow-hidden">
            {/* Background Grid Pattern - Moving */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    transformOrigin: 'center',
                    animation: 'spin-slow 200s linear infinite'
                }}>
            </div>

            {/* Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#152341]/30 to-[#0f172a]" />

            <div className="relative w-[600px] h-[600px] flex items-center justify-center">

                {/* Concentric Rings (Animated) */}
                <div className={`absolute border border-slate-700/40 border-dashed rounded-full w-[280px] h-[280px] animate-reverse-spin ${isAuthenticating ? 'border-[#c11e3c]/30' : ''}`} />
                <div className="absolute border border-slate-800/60 rounded-full w-[450px] h-[450px] animate-spin-subtle" />
                <div className="absolute border border-slate-900/50 rounded-full w-[600px] h-[600px] animate-pulse" />

                {/* --- CONNECTION LINES (SVG) --- */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={lineColor} stopOpacity="0.1" />
                            <stop offset="50%" stopColor={isAuthenticating ? activeLineColor : "#64748b"} stopOpacity="1" />
                            <stop offset="100%" stopColor={lineColor} stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    <g className="opacity-60">
                        <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-flow" />
                        <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-flow" style={{ animationDelay: '0.5s' }} />
                        <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-flow" style={{ animationDelay: '0.2s' }} />
                        <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-flow" style={{ animationDelay: '0.7s' }} />
                    </g>
                </svg>

                {/* --- CENTRAL HUB --- */}
                <div className={`relative z-10 flex flex-col items-center justify-center w-36 h-36 bg-[#152341] rounded-full border-4 shadow-2xl transition-all duration-700 ${isAuthenticating ? 'border-[#c11e3c] shadow-[#c11e3c]/50 scale-110' : 'border-slate-600'}`}>
                    <div className="absolute inset-0 rounded-full bg-[#152341] z-0" />
                    <div className={`z-10 flex flex-col items-center transition-all duration-300 ${isAuthenticating ? 'scale-110' : ''}`}>
                        <ShieldCheck className={`h-10 w-10 transition-colors duration-500 mb-1 ${isAuthenticating ? 'text-white' : 'text-slate-300'}`} />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">HUB</span>
                        <div className="flex items-center gap-1 mt-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${isAuthenticating ? 'bg-[#c11e3c] animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
                            <span className="text-[8px] text-slate-500 font-mono">ONLINE</span>
                        </div>
                    </div>
                    {isAuthenticating && (
                        <div className="absolute inset-0 w-full h-full rounded-full border-4 border-t-[#c11e3c] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                    )}
                </div>

                {/* --- SATELLITE NODES --- */}
                {/* Node 1: Intelligence */}
                <div className="absolute top-[18%] left-[18%] flex flex-col items-center gap-2 animate-float" style={{ animationDelay: '0s' }}>
                    <div className={`p-3 rounded-full bg-[#0f172a] border border-slate-700 shadow-xl relative group`}>
                        <Database className={`h-5 w-5 ${isAuthenticating ? 'text-[#c11e3c]' : 'text-slate-400'}`} />
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase trekking-wider bg-[#0f172a]/90 px-3 py-1 rounded border border-slate-800 shadow-lg">{getSysName(0, "INTELLIGENCE")}</div>
                </div>

                {/* Node 2: CRM */}
                <div className="absolute top-[18%] right-[18%] flex flex-col items-center gap-2 animate-float" style={{ animationDelay: '1s' }}>
                    <div className={`p-3 rounded-full bg-[#0f172a] border border-slate-700 shadow-xl relative`}>
                        <FileText className={`h-5 w-5 ${isAuthenticating ? 'text-[#c11e3c]' : 'text-slate-400'}`} />
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase trekking-wider bg-[#0f172a]/90 px-3 py-1 rounded border border-slate-800 shadow-lg">{getSysName(1, "CRM")}</div>
                </div>

                {/* Node 3: Cadastro */}
                <div className="absolute bottom-[18%] left-[18%] flex flex-col items-center gap-2 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="text-[9px] text-slate-400 font-bold uppercase trekking-wider bg-[#0f172a]/90 px-3 py-1 rounded border border-slate-800 shadow-lg">{getSysName(2, "CADASTRO")}</div>
                    <div className={`p-3 rounded-full bg-[#0f172a] border border-slate-700 shadow-xl relative`}>
                        <Activity className={`h-5 w-5 ${isAuthenticating ? 'text-[#c11e3c]' : 'text-slate-400'}`} />
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Node 4: Fonogramas */}
                <div className="absolute bottom-[18%] right-[18%] flex flex-col items-center gap-2 animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="text-[9px] text-slate-400 font-bold uppercase trekking-wider bg-[#0f172a]/90 px-3 py-1 rounded border border-slate-800 shadow-lg">{getSysName(3, "FONOGRAMAS")}</div>
                    <div className={`p-3 rounded-full bg-[#0f172a] border border-slate-700 shadow-xl relative`}>
                        <Wifi className={`h-5 w-5 ${isAuthenticating ? 'text-[#c11e3c]' : 'text-slate-400'}`} />
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>

            </div>

            {/* Floating Metrics */}
            <div className="absolute bottom-6 left-6 grid grid-cols-2 gap-x-6 gap-y-1 text-[10px] font-mono text-slate-500 opacity-70">
                <div>UPLINK: <span className="text-slate-300">1.2 GB/s</span></div>
                <div>LATENCY: <span className="text-green-500">14ms</span></div>
                <div>ENCRYPTION: <span className="text-slate-300">AES-256</span></div>
                <div>NODES: <span className="text-green-500">{systems.length || 4} ACTIVE</span></div>
            </div>
        </div>
    );
}

"use client";

// Layout limpo para o Hub, sem header padrão, permitindo design imersivo na página.
export default function HubLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-[#c11e3c] selection:text-white">
            {children}
        </div>
    );
}

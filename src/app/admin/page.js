"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import UserModal from "@/components/admin/UserModal";

export default function AdminDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([
        { id: 1, email: "admin@admin.com", is_superadmin: true, role: "Super Administrador", systems: ["Todos"] },
        { id: 2, email: "analista@empresa.com.br", is_superadmin: false, role: "Analista", systems: ["OCR", "Gestão"] },
    ]);
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter((u) => u.email.includes(search));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#152341] uppercase">Governança de Identidades</h1>
                    <p className="text-slate-500 text-sm mt-1">Gerenciamento centralizado de credenciais e permissões.</p>
                </div>
                <Button className="bg-[#c11e3c] hover:bg-[#a01830] text-white font-bold uppercase tracking-wide rounded-sm" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Usuário
                </Button>
            </div>

            <div className="flex items-center space-x-4 bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar credencial..."
                        className="pl-10 h-10 border-slate-300 rounded-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Credencial</th>
                            <th className="px-6 py-4">Perfil (Hub)</th>
                            <th className="px-6 py-4">Acessos Concedidos</th>
                            <th className="px-6 py-4">Situação</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-[#152341]">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_superadmin ? (
                                        <Badge variant="destructive" className="uppercase text-[10px] font-bold tracking-wide">Admin Master</Badge>
                                    ) : (
                                        <span className="text-slate-500 font-medium">Usuário Padrão</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1 flex-wrap">
                                        {user.systems.map((sys) => (
                                            <Badge key={sys} variant="outline" className="text-slate-600 border-slate-300 font-medium">{sys}</Badge>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center font-medium text-green-700">
                                        <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                                        Ativo
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="hover:bg-slate-100 text-slate-500 hover:text-[#152341]">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Nenhum registro encontrado.</div>
                )}
            </div>

            <UserModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
}

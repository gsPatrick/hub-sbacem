"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, Plus, MoreHorizontal, LayoutGrid, FileText, Users, Shield } from "lucide-react";
import UserModal from "@/components/admin/UserModal";
import SystemModal from "@/components/admin/SystemModal";
import SystemAccessModal from "@/components/admin/SystemAccessModal";
import { api } from "@/lib/api";

function AdminDashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabFromUrl = searchParams.get("tab") || "users";

    const [activeTab, setActiveTab] = useState(tabFromUrl); // users, systems, audit

    useEffect(() => {
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.push(`/admin?tab=${tab}`, { scroll: false });
    };
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [users, setUsers] = useState([]);
    const [systems, setSystems] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, systemsRes, auditRes] = await Promise.all([
                api.get("/users/"),
                api.get("/systems/"),
                api.get("/audit/")
            ]);
            setUsers(usersRes.data);
            setSystems(systemsRes.data);
            setAuditLogs(auditRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredUsers = users.filter((u) => u.email.includes(search));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#152341] uppercase">Governança de Identidades</h1>
                    <p className="text-slate-500 text-sm mt-1">Gerenciamento centralizado de credenciais, sistemas e auditoria.</p>
                </div>
                <div className="flex gap-2">
                    {activeTab === "users" && (
                        <Button className="bg-[#c11e3c] hover:bg-[#a01830] text-white font-bold uppercase tracking-wide rounded-sm" onClick={() => setIsUserModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Usuário
                        </Button>
                    )}
                    {activeTab === "systems" && (
                        <Button className="bg-[#152341] hover:bg-[#0e172b] text-white font-bold uppercase tracking-wide rounded-sm" onClick={() => setIsSystemModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Sistema
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => handleTabChange("users")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === "users" ? "border-[#c11e3c] text-[#c11e3c]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                    <Users className="h-4 w-4" /> Usuários
                </button>
                <button
                    onClick={() => handleTabChange("systems")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === "systems" ? "border-[#c11e3c] text-[#c11e3c]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                    <LayoutGrid className="h-4 w-4" /> Sistemas
                </button>
                <button
                    onClick={() => handleTabChange("audit")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === "audit" ? "border-[#c11e3c] text-[#c11e3c]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                    <FileText className="h-4 w-4" /> Auditoria
                </button>
            </div>

            {/* Content Users */}
            {activeTab === "users" && (
                <>
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
                                            <div className={`flex items-center font-medium ${user.is_active ? "text-green-700" : "text-red-700"}`}>
                                                <div className={`h-2 w-2 rounded-full mr-2 ${user.is_active ? "bg-green-600" : "bg-red-600"}`} />
                                                {user.is_active ? "Ativo" : "Inativo"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-[#152341] hover:bg-slate-100 font-bold uppercase text-[10px] tracking-widest"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsAccessModalOpen(true);
                                                    }}
                                                >
                                                    <Shield className="h-3 w-3 mr-1" /> Acessos
                                                </Button>
                                                {user.is_active ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                        onClick={async () => {
                                                            if (!confirm("Deseja desativar este usuário?")) return;
                                                            await api.patch(`/users/${user.id}/deactivate`);
                                                            fetchData();
                                                        }}
                                                    >
                                                        Desativar
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={async () => {
                                                            await api.patch(`/users/${user.id}/activate`);
                                                            fetchData();
                                                        }}
                                                    >
                                                        Ativar
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={async () => {
                                                        if (!confirm("Tem certeza que deseja EXCLUIR este usuário? Essa ação é irreversível.")) return;
                                                        await api.delete(`/users/${user.id}`);
                                                        fetchData();
                                                    }}
                                                >
                                                    Excluir
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!loading && filteredUsers.length === 0 && (
                            <div className="p-12 text-center text-slate-500">Nenhum registro encontrado.</div>
                        )}
                    </div>
                </>
            )}

            {/* Content Systems */}
            {activeTab === "systems" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systems.map((sys) => (
                        <div key={sys.id} className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg text-[#152341]">{sys.name}</h3>
                                    <Badge variant="outline">ID: {sys.id}</Badge>
                                </div>
                                <p className="text-sm text-slate-500 truncate">{sys.base_url}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                <Button variant="ghost" size="sm" className="text-[#c11e3c]">Configurar</Button>
                            </div>
                        </div>
                    ))}
                    {systems.length === 0 && !loading && (
                        <div className="col-span-full p-12 text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-sm">
                            Nenhum sistema cadastrado.
                        </div>
                    )}
                </div>
            )}

            {/* Content Audit */}
            {activeTab === "audit" && (
                <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Data/Hora</th>
                                <th className="px-6 py-4">Ação</th>
                                <th className="px-6 py-4">Usuário (Admin)</th>
                                <th className="px-6 py-4">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#152341]">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4">
                                        ID {log.user_id}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 truncate max-w-xs">
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {auditLogs.length === 0 && !loading && (
                        <div className="p-12 text-center text-slate-500">Nenhum registro de auditoria.</div>
                    )}
                </div>
            )}

            <UserModal open={isUserModalOpen} onOpenChange={setIsUserModalOpen} onSuccess={fetchData} />
            <SystemModal open={isSystemModalOpen} onOpenChange={setIsSystemModalOpen} onSuccess={fetchData} />
            <SystemAccessModal
                open={isAccessModalOpen}
                onOpenChange={setIsAccessModalOpen}
                user={selectedUser}
                onSuccess={fetchData}
            />
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c11e3c]"></div>
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}

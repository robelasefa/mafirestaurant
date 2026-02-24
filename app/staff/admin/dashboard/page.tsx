"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from 'sweetalert2';
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    needsPasswordChange: boolean;
    createdAt: string;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("staff");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "Admin Dashboard | Mafi Restaurant";
        if (status === "loading") return;

        if (!session || session.user?.role !== "admin") {
            router.push("/staff");
            return;
        }

        fetchUsers();
    }, [session, status, router]);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/staff/admin/users");
            if (response.ok) {
                const result = await response.json();
                setUsers(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/staff/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
            });
            const data = await res.json();

            if (res.ok) {
                Swal.fire('Invited!', `Added with temporary password "password123". They will be forced to change it on login.`, 'success');
                setInviteEmail("");
                setUsers([data.user, ...users]);
            } else {
                Swal.fire('Error', data.error, 'error');
            }
        } catch {
            Swal.fire('Error', 'Network Error', 'error');
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        const res = await fetch("/api/staff/admin/users", {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, role: newRole })
        });
        if (res.ok) {
            setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
            Swal.fire({ toast: true, position: 'top-end', text: 'Role Updated!', icon: 'success', timer: 2000, showConfirmButton: false });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (session?.user?.id === id) {
            Swal.fire('Error', "You cannot delete yourself!", 'error');
            return;
        }

        const { isConfirmed } = await Swal.fire({
            title: `Remove ${name || 'user'}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
        });

        if (isConfirmed) {
            const res = await fetch('/api/staff/admin/users', {
                method: 'DELETE',
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id));
                Swal.fire('Deleted', 'User removed from system.', 'success');
            }
        }
    };

    if (status === "loading" || isLoading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
                <div className="absolute inset-2 border-r-2 border-primary/50 rounded-full animate-spin-slow" />
            </div>
            <p className="text-primary font-serif italic tracking-widest animate-pulse">Initializing Administrative Systems...</p>
        </div>
    );

    return (
        <section className="bg-background min-h-screen py-12 px-4 md:px-8 overflow-hidden relative">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-16 animate-slide-up relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-primary/20 pb-10">
                    <div>
                        <h1 className="text-4xl md:text-7xl font-serif font-bold text-primary mb-2">
                            Governance
                        </h1>
                        <p className="text-foreground-muted italic text-lg tracking-wide">System intelligence & authority management.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => router.push('/staff/manage-bookings')}
                            variant="gold"
                            size="lg"
                            className="rounded-full px-8 shadow-gold"
                        >
                            Logistics Portal
                        </Button>
                    </div>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: "Site Traversal", value: "1,248", detail: "+14% this week", icon: <TrendingUp className="w-5 h-5" /> },
                        { label: "Historical Records", value: "84", detail: "Total bookings", icon: <FileText className="w-5 h-5" /> },
                        { label: "Pending Decrees", value: "5", detail: "Awaiting review", icon: <CheckCircle className="w-5 h-5 text-primary" />, highlight: "text-primary" },
                        { label: "Active Personnel", value: users.length, detail: "Authorized agents", icon: <Users className="w-5 h-5" /> }
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-dark border border-primary/10 p-8 rounded-[2rem] shadow-elegant hover:shadow-gold/20 transition-all group">
                            <div className="flex items-center gap-4 text-primary/60 mb-6 uppercase tracking-widest text-[10px] font-bold">
                                {stat.icon} <span>{stat.label}</span>
                            </div>
                            <div className={`text-5xl font-bold mb-3 ${stat.highlight || 'text-foreground-accent'}`}>{stat.value}</div>
                            <div className="text-xs text-foreground-muted font-mono uppercase tracking-tighter">{stat.detail}</div>
                        </div>
                    ))}
                </div>

                {/* Management Section */}
                <div className="grid lg:grid-cols-12 gap-10">

                    {/* Invite Form */}
                    <div className="lg:col-span-4 glass-dark border border-primary/20 p-10 rounded-[2.5rem] shadow-elegant h-fit relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                        <h3 className="text-2xl font-serif font-bold text-primary mb-8">Authorize Personnel</h3>
                        <form onSubmit={handleInvite} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Member Email</label>
                                <Input
                                    required
                                    type="email"
                                    placeholder="agent@grandhorizon.com"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    className="rounded-2xl h-12"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Access Tier</label>
                                <select
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value)}
                                    className="flex h-12 w-full rounded-2xl border border-primary/20 bg-background/50 px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                >
                                    <option value="staff" className="bg-black">Staff (Logistics Only)</option>
                                    <option value="admin" className="bg-black">Admin (Full Dominion)</option>
                                </select>
                            </div>
                            <Button type="submit" variant="gold" className="w-full h-14 rounded-2xl shadow-gold mt-4 text-xs tracking-[0.2em] font-bold">
                                DISPATCH INVITATION
                            </Button>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="lg:col-span-8 glass-dark border border-primary/20 rounded-[2.5rem] shadow-elegant overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-primary/10 bg-primary/5 flex justify-between items-center">
                            <h3 className="text-2xl font-serif font-bold text-primary">Authority Registry</h3>
                            <span className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em]">Confidential</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-primary/10">
                                        <th className="py-6 px-8 text-[10px] font-bold text-primary uppercase tracking-widest">Personnel</th>
                                        <th className="py-6 px-8 text-[10px] font-bold text-primary uppercase tracking-widest text-center">Security Status</th>
                                        <th className="py-6 px-8 text-[10px] font-bold text-primary uppercase tracking-widest text-center">Clearance</th>
                                        <th className="py-6 px-8 text-[10px] font-bold text-primary uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/10">
                                    {users.map(u => (
                                        <tr key={u.id} className="group hover:bg-primary/5 transition-all">
                                            <td className="py-6 px-8">
                                                <div className="font-bold text-foreground-accent text-lg">{u.name || "Registry Pending"}</div>
                                                <div className="text-xs text-foreground-muted font-mono">{u.email}</div>
                                            </td>
                                            <td className="py-6 px-8 text-center">
                                                {u.needsPasswordChange ?
                                                    <span className="text-[9px] font-bold bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest">Action Required</span>
                                                    :
                                                    <span className="text-[9px] font-bold bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-widest">Verified</span>
                                                }
                                            </td>
                                            <td className="py-6 px-8 text-center">
                                                <select
                                                    disabled={session?.user?.id === u.id}
                                                    value={u.role}
                                                    onChange={e => handleRoleChange(u.id, e.target.value)}
                                                    className="bg-transparent border border-primary/20 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                                                >
                                                    <option value="admin" className="bg-black">Admin</option>
                                                    <option value="staff" className="bg-black">Staff</option>
                                                </select>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <button
                                                    onClick={() => handleDelete(u.id, u.name)}
                                                    disabled={session?.user?.id === u.id}
                                                    className="text-foreground-muted hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10 disabled:opacity-0"
                                                >
                                                    <span className="text-xs uppercase font-bold tracking-tighter">Deauthorize</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

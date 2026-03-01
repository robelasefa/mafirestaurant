"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MafiSwal } from "@/lib/mafi-swal";
import { Users, FileText, CheckCircle } from "lucide-react";

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
    const [bookingStats, setBookingStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
    });

    useEffect(() => {
        document.title = "Admin Dashboard | Mafi Restaurant";
        if (status === "loading") return;

        if (!session || session.user?.role !== "admin") {
            router.push("/staff");
            return;
        }

        fetchUsers();
        fetchBookingStats();
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

    const fetchBookingStats = async () => {
        try {
            const response = await fetch("/api/bookings");
            if (!response.ok) return;
            const result = await response.json();
            const bookings = result.data || [];
            const total = bookings.length;
            const pending = bookings.filter((b: { status: string }) => b.status === "pending").length;
            const approved = bookings.filter((b: { status: string }) => b.status === "approved").length;
            setBookingStats({ total, pending, approved });
        } catch (error) {
            console.error("Error fetching booking stats:", error);
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
                await MafiSwal.success('Staff Invited', `Temporary password for <strong>${inviteEmail}</strong>:<br/><code class="px-2 py-1 rounded bg-black/60 border border-primary/40 text-primary text-sm">${data.tempPassword}</code><br/><span class="text-xs text-foreground-muted block mt-2">Share this password securely. They will be forced to change it on first login.</span>`);
                setInviteEmail("");
                setUsers([data.user, ...users]);
            } else {
                await MafiSwal.error('Error', data.error || 'Failed to invite staff member.');
            }
        } catch {
            await MafiSwal.error('Error', 'Network error. Please try again.');
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
            await MafiSwal.info('Success', 'Role updated');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (session?.user?.id === id) {
            await MafiSwal.error('Error', 'You cannot delete yourself.');
            return;
        }

        const { isConfirmed } = await MafiSwal.confirm(`Remove ${name || 'user'}?`, 'This action cannot be undone.', 'Remove');
        if (isConfirmed) {
            const res = await fetch('/api/staff/admin/users', {
                method: 'DELETE',
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id));
                await MafiSwal.success('Deleted', 'User removed from system.');
            }
        }
    };

    if (status === "loading" || isLoading) return <div className="min-h-screen items-center flex justify-center text-primary">Loading...</div>;

    return (
        <section className="bg-background min-h-screen py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">

                {/* Top bar: back + welcome */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <Button
                        variant="outline"
                        className="border-primary/40 text-primary hover:bg-primary/10 w-full md:w-auto"
                        onClick={() => router.push('/')}
                    >
                        Back to Home
                    </Button>
                    <div className="text-right w-full md:w-auto">
                        <p className="text-sm uppercase tracking-wide text-foreground-muted">
                            Signed in as
                        </p>
                        <p className="text-lg font-semibold text-primary">
                            {session?.user?.name || "Admin"}
                        </p>
                    </div>
                </div>

                {/* Header */}
                <div className="bg-background-subtle border border-primary/20 p-8 rounded-2xl shadow-elegant">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">Admin Dashboard</h1>
                    <p className="text-foreground-muted">
                        System overview & staff management
                    </p>
                    <div className="mt-4">
                        <Button onClick={() => router.push('/staff/manage-bookings')} variant="luxury">
                            View Bookings Portal
                        </Button>
                    </div>
                </div>

                {/* Analytics Overview - Live Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-background-accent border border-primary/15 p-5 rounded-xl shadow-sm transition-colors duration-200 hover:border-primary/40 hover:bg-background-subtle">
                        <div className="flex items-center gap-4 text-primary mb-2"><FileText /> <span className="font-semibold text-lg">Total Bookings</span></div>
                        <div className="text-3xl font-bold text-foreground">{bookingStats.total}</div>
                        <div className="text-xs text-foreground-muted mt-2">Across all time</div>
                    </div>
                    <div className="bg-background-accent border border-primary/15 p-5 rounded-xl shadow-sm transition-colors duration-200 hover:border-primary/40 hover:bg-background-subtle">
                        <div className="flex items-center gap-4 text-primary mb-2"><CheckCircle /> <span className="font-semibold text-lg">Pending Requests</span></div>
                        <div className="text-3xl font-bold text-amber-400">{bookingStats.pending}</div>
                        <div className="text-xs text-foreground-muted mt-2">Awaiting review</div>
                    </div>
                    <div className="bg-background-accent border border-primary/15 p-5 rounded-xl shadow-sm transition-colors duration-200 hover:border-primary/40 hover:bg-background-subtle">
                        <div className="flex items-center gap-4 text-primary mb-2"><CheckCircle /> <span className="font-semibold text-lg">Approved Bookings</span></div>
                        <div className="text-3xl font-bold text-green-400">{bookingStats.approved}</div>
                        <div className="text-xs text-foreground-muted mt-2">Confirmed events</div>
                    </div>
                    <div className="bg-background-accent border border-primary/15 p-5 rounded-xl shadow-sm transition-colors duration-200 hover:border-primary/40 hover:bg-background-subtle">
                        <div className="flex items-center gap-4 text-primary mb-2"><Users /> <span className="font-semibold text-lg">Active Staff</span></div>
                        <div className="text-3xl font-bold text-foreground">{users.length}</div>
                        <div className="text-xs text-foreground-muted mt-2">Accounts with access</div>
                    </div>
                </div>

                {/* Staff Management Section */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Invite Form */}
                    <div className="bg-background-subtle border border-primary/20 p-8 rounded-2xl shadow-elegant h-fit">
                        <h3 className="text-2xl font-serif font-bold text-primary mb-6">Invite Staff</h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground-muted mb-2 block">Email Address</label>
                                <Input
                                    required
                                    type="email"
                                    placeholder="staff@mafi.com"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    className="w-full bg-background border-primary/30 text-foreground"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground-muted mb-2 block">System Role</label>
                                <select
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value)}
                                    className="w-full h-10 px-3 bg-background border border-primary/30 rounded-md text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="staff">Staff (Bookings Only)</option>
                                    <option value="admin">Administrator (Full Access)</option>
                                </select>
                            </div>
                            <Button type="submit" variant="gold" className="w-full mt-4">Send Invite</Button>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="lg:col-span-2 bg-background-subtle border border-primary/20 rounded-2xl shadow-elegant overflow-hidden">
                        <div className="p-6 border-b border-primary/10 bg-background-accent">
                            <h3 className="text-2xl font-serif font-bold text-primary">Manage Authority</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-background/50 border-b border-primary/10">
                                    <tr>
                                        <th className="py-4 px-6 font-medium text-primary">Member</th>
                                        <th className="py-4 px-6 font-medium text-primary">Account Security</th>
                                        <th className="py-4 px-6 font-medium text-primary">Role</th>
                                        <th className="py-4 px-6 font-medium text-primary text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-background/30 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-foreground">{u.name || "Pending..."}</div>
                                                <div className="text-sm text-foreground-muted">{u.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {u.needsPasswordChange ?
                                                    <span className="text-xs font-semibold bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20">Pending Setup</span>
                                                    :
                                                    <span className="text-xs font-semibold bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">Secured</span>
                                                }
                                            </td>
                                            <td className="py-4 px-6">
                                                <select
                                                    disabled={session?.user?.id === u.id} // Prevents admin from demoting themselves by accident
                                                    value={u.role}
                                                    onChange={e => handleRoleChange(u.id, e.target.value)}
                                                    className="bg-transparent border border-primary/30 rounded px-2 py-1 text-sm font-medium text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="staff">Staff</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleDelete(u.id, u.name)}
                                                    disabled={session?.user?.id === u.id}
                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3 text-xs"
                                                >
                                                    Remove
                                                </Button>
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

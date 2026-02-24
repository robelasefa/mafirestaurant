"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from 'sweetalert2';

export default function SetupPassword() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/staff/login");
        } else if (status === "authenticated" && !session?.user?.needsPasswordChange) {
            router.push("/staff/admin/dashboard");
        }
    }, [status, session, router]);

    if (status === "loading" || status === "unauthenticated" || (status === "authenticated" && !session?.user?.needsPasswordChange)) {
        return <div className="text-center py-20 text-primary">Loading...</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return Swal.fire("Error", "Passwords do not match.", "error");
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/staff/setup-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: password }),
            });

            if (res.ok) {
                await Swal.fire("Success!", "Your password has been securely updated.", "success");
                // Logout user explicitly to refresh the JWT session payload
                await signOut({ redirect: false });
                router.push("/staff/login");
            } else {
                const data = await res.json();
                Swal.fire("Error", data.error || "Failed to setup password", "error");
            }
        } catch {
            Swal.fire("Error", "A network error occurred.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-background min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full animate-slide-up text-center relative z-10">

                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
                        Security Setup
                    </h1>
                    <p className="text-foreground-muted italic tracking-wide">
                        Choose a secure credential to activate your access.
                    </p>
                </div>

                <div className="glass-dark rounded-[2.5rem] shadow-elegant p-10 border border-primary/20 text-left">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <div className="space-y-3">
                            <Label htmlFor="password text-[10px] uppercase tracking-[0.2em] font-bold text-primary">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="rounded-2xl h-12"
                                placeholder="Min. 6 characters"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="confirmPassword text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="rounded-2xl h-12"
                                placeholder="Verify password"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="gold"
                            className="w-full h-14 rounded-2xl text-xs font-bold tracking-[0.2em] shadow-gold mt-4 uppercase"
                            disabled={isLoading}
                        >
                            {isLoading ? "PROVISIONING..." : "ACTIVATE ACCOUNT"}
                        </Button>

                    </form>
                </div>

                <p className="mt-8 text-[10px] text-foreground-muted/50 uppercase tracking-[0.3em] font-mono">
                    GRAND HORIZON ADMINISTRATIVE PROTOCOL
                </p>
            </div>
        </section>
    );
}

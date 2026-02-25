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

    const [name, setName] = useState("");
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

    useEffect(() => {
        if (session?.user?.name && !name) {
            setName(session.user.name);
        }
    }, [session, name]);

    if (status === "loading" || status === "unauthenticated" || (status === "authenticated" && !session?.user?.needsPasswordChange)) {
        return <div className="text-center py-20 text-primary">Loading...</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return Swal.fire({
                title: "Error",
                text: "Passwords do not match.",
                icon: "error",
                confirmButtonColor: "#d4af37",
                background: "#02010a",
                color: "#f9fafb",
            });
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/staff/setup-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: password, name }),
            });

            if (res.ok) {
                await Swal.fire({
                    title: "Success!",
                    text: "Your password has been securely updated.",
                    icon: "success",
                    confirmButtonColor: "#d4af37",
                    background: "#02010a",
                    color: "#f9fafb",
                });
                // Logout user explicitly to refresh the JWT session payload
                await signOut({ redirect: false });
                router.push("/staff/login");
            } else {
                const data = await res.json();
                Swal.fire({
                    title: "Error",
                    text: data.error || "Failed to setup password",
                    icon: "error",
                    confirmButtonColor: "#d4af37",
                    background: "#02010a",
                    color: "#f9fafb",
                });
            }
        } catch {
            Swal.fire({
                title: "Error",
                text: "A network error occurred.",
                icon: "error",
                confirmButtonColor: "#d4af37",
                background: "#02010a",
                color: "#f9fafb",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-background min-h-screen flex items-center justify-center py-20 px-4">
            <div className="max-w-md w-full animate-fade-in text-center">

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                    Security Setup
                </h1>
                <p className="text-foreground-muted mb-8">
                    Please tell us your name and choose a secure password to activate your staff account.
                </p>

                <div className="bg-background rounded-2xl shadow-elegant p-8 border border-primary/20 text-left">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-2"
                                placeholder="e.g. Amanuel Bekele"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-2"
                                placeholder="Must be at least 6 characters"
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-2"
                                placeholder="Retype password"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="gold"
                            size="lg"
                            className="w-full text-lg py-6 mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save & Continue"}
                        </Button>

                    </form>
                </div>
            </div>
        </section>
    );
}

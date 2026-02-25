"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function SetupPassword() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formError, setFormError] = useState<string>("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/staff/login");
        } else if (status === "authenticated" && !session?.user?.needsPasswordChange) {
            router.push("/staff");
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

    const validateField = (field: string, value: string) => {
        switch (field) {
            case "name": {
                if (!value.trim()) return "Please enter your full name.";
                if (value.trim().length < 2) return "Name must be at least 2 characters.";
                return "";
            }
            case "password": {
                if (!value) return "Password is required.";
                if (value.length < 6) return "Password must be at least 6 characters.";
                return "";
            }
            case "confirmPassword": {
                if (!value) return "Please confirm your password.";
                if (value !== password) return "Passwords do not match.";
                return "";
            }
            default:
                return "";
        }
    };

    const handleBlur = (field: string, value: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        const nextErrors: Record<string, string> = {
            name: validateField("name", name),
            password: validateField("password", password),
            confirmPassword: validateField("confirmPassword", confirmPassword),
        };
        setErrors(nextErrors);
        setTouched({ name: true, password: true, confirmPassword: true });
        if (Object.values(nextErrors).some(Boolean)) return;

        setIsLoading(true);

        try {
            const res = await fetch("/api/staff/setup-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: password, name }),
            });

            if (res.ok) {
                // Re-sign in so JWT picks up needsPasswordChange=false (no extra login step)
                const email = session?.user?.email;
                if (!email) {
                    setFormError("Your session is missing an email. Please log in again.");
                    router.push("/staff/login");
                    return;
                }

                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setFormError("Password updated, but sign-in failed. Please log in again.");
                    router.push("/staff/login");
                    return;
                }

                router.push("/staff");
            } else {
                const data = await res.json();
                setFormError(data.error || "Failed to set up password.");
            }
        } catch {
            setFormError("A network error occurred.");
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
                        {formError && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                                {formError}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={(e) => handleBlur("name", e.target.value)}
                                required
                                className={`mt-2 ${errors.name && touched.name ? "border-amber-500 focus-visible:ring-amber-500/20" : ""}`}
                                placeholder="e.g. Amanuel Bekele"
                            />
                            {errors.name && touched.name && (
                                <p className="mt-2 text-sm text-amber-600 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative mt-2">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (touched.password) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                password: validateField("password", e.target.value),
                                            }));
                                        }
                                    }}
                                    onBlur={(e) => handleBlur("password", e.target.value)}
                                    required
                                    className={`${errors.password && touched.password ? "border-amber-500 focus-visible:ring-amber-500/20" : ""} pr-10`}
                                    placeholder="Must be at least 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-foreground-muted hover:text-primary"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && touched.password && (
                                <p className="mt-2 text-sm text-amber-600 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative mt-2">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (touched.confirmPassword) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                confirmPassword: validateField("confirmPassword", e.target.value),
                                            }));
                                        }
                                    }}
                                    onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                                    required
                                    className={`${errors.confirmPassword && touched.confirmPassword ? "border-amber-500 focus-visible:ring-amber-500/20" : ""} pr-10`}
                                    placeholder="Retype password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-foreground-muted hover:text-primary"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && touched.confirmPassword && (
                                <p className="mt-2 text-sm text-amber-600 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                    {errors.confirmPassword}
                                </p>
                            )}
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

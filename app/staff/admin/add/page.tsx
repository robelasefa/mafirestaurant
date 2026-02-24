"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


export default function AddStaff() {
  useEffect(() => {
    document.title = "Add Staff | Mafi Restaurant"
  }, []);
  
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"staff" | "admin">("staff");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-destructive text-xl">Access denied. Admin only.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add staff member.");
      } else {
        setSuccess(`Staff member ${data.user.name} added successfully!`);
        setName("");
        setEmail("");
        setPassword("");
        setRole("staff");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-12 animate-slide-up">
      <div className="glass-dark rounded-[2.5rem] p-12 shadow-elegant border border-primary/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-primary mb-3">
              Personnel Registry
            </h1>
            <p className="text-foreground-muted text-sm tracking-widest uppercase">Create New Authorized Access</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-center text-sm">
              {success}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Label htmlFor="name" className="ml-1">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-2xl"
                placeholder="Ex. Julian Vance"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl"
                placeholder="name@grandhorizon.com"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="ml-1">Secure Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-2xl"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="role" className="ml-1">Security Clearance</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "staff" | "admin")}
                className="flex h-14 w-full rounded-2xl border border-primary/20 bg-background/50 backdrop-blur-sm px-6 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="staff" className="bg-black text-white">Staff Access</option>
                <option value="admin" className="bg-black text-white">Administrative Access</option>
              </select>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <Button type="submit" variant="gold" size="lg" disabled={isLoading} className="w-full h-14 rounded-2xl text-lg tracking-widest uppercase shadow-gold">
                {isLoading ? "AUTHORIZING..." : "REGISTER PERSONNEL"}
              </Button>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full text-center text-xs text-foreground-muted hover:text-primary transition-colors tracking-widest uppercase py-2"
              >
                Cancel and Return
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

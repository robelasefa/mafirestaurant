"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  useEffect(() => {
    document.title = "Staff Login | Mafi Restaurant"
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // Redirect to staff root which middleware catches and routes to specific dashboards!
        router.push("/staff");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full animate-slide-up">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-foreground-muted italic text-lg">
            Excellence begins with service.
          </p>
          <div className="w-16 h-0.5 bg-primary/40 mx-auto mt-6" />
        </div>

        <div className="glass-dark rounded-[2rem] shadow-glow p-10 border border-primary/30 relative overflow-hidden group">
          {/* Decorative accent */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Staff Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/40 border-primary/20"
                placeholder="staff@mafirestaurant.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/40 border-primary/20"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full text-lg py-7 shadow-gold hover:shadow-glow rounded-xl font-bold transition-all duration-500"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Authorize Access"}
            </Button>
          </form>

          <div className="mt-10 text-center relative z-10">
            <p className="text-xs text-foreground-muted uppercase tracking-widest opacity-60">
              Restricted Area • Mafi Personnel Only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
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
        // Redirect to staff booking management page
        router.push("/staff/manage-bookings");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <section className="bg-background min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Staff Login
          </h1>
          <p className="text-foreground-muted">
            Access the booking management system
          </p>
        </div>

        <div className="bg-background rounded-2xl shadow-elegant p-8 border border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-primary font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2"
                placeholder="staff@mafirestaurant.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-primary font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary mt-2"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full text-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-foreground-muted">
              This area is restricted to Mafi Restaurant staff only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
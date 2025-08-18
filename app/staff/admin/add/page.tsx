"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Add Staff Member | Mafi Restaurant",
};

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
    <section className="max-w-md mx-auto p-6 bg-background-subtle rounded-2xl shadow-elegant mt-16">
      <h1 className="text-3xl font-bold text-primary mb-6">Add Staff Member</h1>

      {error && <div className="text-destructive mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Staff Name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="staff@example.com"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter a secure password"
          />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "staff" | "admin")}
            className="w-full p-2 border rounded"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button type="submit" variant="gold" size="lg" disabled={isLoading} className="w-full">
          {isLoading ? "Adding..." : "Add Staff"}
        </Button>
      </form>
    </section>
  );
}

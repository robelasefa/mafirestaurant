"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  date: string;
  time: string;
  purpose: string | null;
  status: "pending" | "confirmed" | "approved" | "rejected";
  createdAt: string;
}

const statusColors = {
  pending: "bg-muted text-foreground-accent border border-primary/20",
  confirmed: "bg-foreground-accent text-background border border-primary",
  approved: "bg-primary text-background border border-primary",
  rejected: "bg-destructive text-destructive-foreground border border-destructive/60",
};

export default function ManageBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Manage Bookings | Mafi Restaurant"
    if (status === "loading") return;

    if (!session || (session.user?.role !== "staff" && session.user?.role !== "admin")) {
      router.push("/staff/login");
      return;
    }

    fetchBookings();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        alert(`Booking ${status} successfully!`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking status. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        alert("Booking deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking. Please try again.");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
          Manage Meeting Hall Bookings
        </h1>
        <div className="text-foreground-muted">
          Welcome, {session?.user?.name}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-background-subtle rounded-2xl shadow-elegant border border-primary/20">
          <thead>
            <tr className="text-left text-primary text-lg">
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Organization</th>
              <th className="py-4 px-4">Booking At</th>
              <th className="py-4 px-4">Purpose</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-foreground-muted text-xl">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-primary/10 hover:bg-background-accent transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-foreground-accent">{b.name}</td>
                  <td className="py-4 px-4">{b.organization || "-"}</td>
                  <td className="py-4 px-4">{new Date(b.bookingAt).toLocaleString()}</td>
                  <td className="py-4 px-4 max-w-xs truncate" title={b.purpose || ""}>{b.purpose || "-"}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[b.status]}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary hover:text-background transition-elegant"
                      onClick={() => handleStatus(b.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/30 text-destructive hover:bg-destructive hover:text-background transition-elegant"
                      onClick={() => handleStatus(b.id, "rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground-muted hover:text-destructive"
                      onClick={() => handleDelete(b.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

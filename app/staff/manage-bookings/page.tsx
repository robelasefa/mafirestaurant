"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Swal from 'sweetalert2';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  bookingAt: string;
  purpose: string | null;
  status: "pending" | "approved" | "rejected";
  letterUrl: string | null;
  createdAt: string;
}

const statusColors = {
  pending: "bg-muted text-foreground-accent border border-primary/20",
  approved: "bg-primary text-background border border-primary",
  rejected: "bg-destructive text-destructive-foreground border border-destructive/60",
};

export default function ManageBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Manage Bookings | Mafi Restaurant";
    if (status === "loading") return;

    if (
      !session ||
      (session.user?.role !== "staff" && session.user?.role !== "admin")
    ) {
      router.push("/staff/login");
      return;
    }

    fetchBookings();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const result = await response.json();
        setBookings(result.data || []);
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
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b))
        );

        Swal.fire({
          title: 'Success!',
          text: `Booking ${status} successfully!`,
          icon: 'success',
          confirmButtonColor: '#d4af37',
          background: '#02010a',
          color: '#f9fafb',
        });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error updating booking status. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d4af37',
        background: '#02010a',
        color: '#f9fafb',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#4b5563',
      background: '#02010a',
      color: '#f9fafb',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Booking deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#d4af37',
          background: '#02010a',
          color: '#f9fafb',
        });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error deleting booking. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d4af37',
        background: '#02010a',
        color: '#f9fafb',
      });
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
    <section className="bg-background min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
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
              {session?.user?.name || "Staff"}
            </p>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
            Manage Meeting Hall Bookings
          </h1>
          <p className="text-foreground-muted">
            Review, approve, or reject upcoming reservation requests.
          </p>
        </div>

        <div className="overflow-x-auto">
        <table className="min-w-full bg-background-subtle rounded-2xl shadow-elegant border border-primary/20">
          <thead>
            <tr className="text-left text-primary text-lg">
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Phone</th>
              <th className="py-4 px-4">Organization</th>
              <th className="py-4 px-4">Booking At</th>
              <th className="py-4 px-4">Purpose</th>
              <th className="py-4 px-4">Letter</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-foreground-muted text-xl"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-primary/10 hover:bg-background-accent transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-foreground-accent">
                    {b.name}
                  </td>
                  <td className="py-4 px-4">{b.email}</td>
                  <td className="py-4 px-4">{b.phone || "-"}</td>
                  <td className="py-4 px-4">{b.organization || "-"}</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {new Date(b.bookingAt).toLocaleDateString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-sm text-foreground-muted">
                        {new Date(b.bookingAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-4 px-4 max-w-xs truncate"
                    title={b.purpose || ""}
                  >
                    {b.purpose || "-"}
                  </td>
                  <td className="py-4 px-4">
                    {b.letterUrl ? (
                      <a
                        href={b.letterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium flex items-center gap-1"
                      >
                        📄 View Letter
                      </a>
                    ) : (
                      <span className="text-foreground-muted">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[b.status]
                        }`}
                    >
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-24 rounded-lg border-primary/30 text-foreground-muted hover:bg-primary hover:text-background hover:border-primary transition-elegant box-border"
                        onClick={() => handleStatus(b.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-24 rounded-lg border-primary/30 text-foreground-muted hover:bg-primary hover:text-background hover:border-primary transition-elegant box-border"
                        onClick={() => handleStatus(b.id, "rejected")}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-24 rounded-lg border-primary/30 text-foreground-muted hover:bg-destructive hover:text-background hover:border-destructive transition-elegant box-border"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </section>
  );
}

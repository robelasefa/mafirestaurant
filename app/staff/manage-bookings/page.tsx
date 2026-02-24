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
          confirmButtonColor: '#d4af37'
        });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error updating booking status. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d4af37'
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
      cancelButtonColor: '#d33',
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
          confirmButtonColor: '#d4af37'
        });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Error deleting booking. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d4af37'
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
    <section className="max-w-7xl mx-auto px-4 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-primary/20 pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-2">
            Reservations
          </h1>
          <p className="text-foreground-muted italic">Manage hall bookings and guest requests.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="glass px-6 py-3 rounded-full border-primary/30">
            <span className="text-primary/60 text-xs uppercase tracking-widest block mb-1">Active Session</span>
            <span className="text-foreground-accent font-bold">{session?.user?.name}</span>
          </div>
          {session?.user?.role === "admin" && (
            <Button
              variant="gold"
              size="lg"
              className="rounded-full px-8 shadow-gold"
              onClick={() => router.push('/staff/admin/add')}
            >
              + Add Personnel
            </Button>
          )}
        </div>
      </div>

      <div className="glass-dark rounded-[2.5rem] shadow-elegant border border-primary/20 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <table className="min-w-full">
            <thead>
              <tr className="text-left border-b border-primary/10 bg-primary/5">
                <th className="py-6 px-6 text-primary uppercase tracking-widest text-xs font-bold">Client Details</th>
                <th className="py-6 px-6 text-primary uppercase tracking-widest text-xs font-bold">Contact Info</th>
                <th className="py-6 px-6 text-primary uppercase tracking-widest text-xs font-bold">Schedule</th>
                <th className="py-6 px-6 text-primary uppercase tracking-widest text-xs font-bold">Documentation</th>
                <th className="py-6 px-6 text-primary uppercase tracking-widest text-xs font-bold">Status</th>
                <th className="py-6 px-6 text-primary uppercase tracking-widest text-xs font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-24 text-center text-foreground-muted italic text-xl"
                  >
                    No pending or historical bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="group hover:bg-primary/5 transition-all duration-300"
                  >
                    <td className="py-6 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground-accent text-lg">{b.name}</span>
                        <span className="text-xs text-foreground-muted uppercase tracking-tighter mt-1">{b.organization || "Private Event"}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col text-sm space-y-1">
                        <span className="text-foreground-accent/80">{b.email}</span>
                        <span className="text-foreground-muted font-mono">{b.phone || "No Phone"}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">
                          {new Date(b.bookingAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-foreground-muted font-mono uppercase">
                          {new Date(b.bookingAt).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col gap-2">
                        {b.letterUrl ? (
                          <a
                            href={b.letterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass px-3 py-1 rounded-md text-xs text-primary hover:bg-primary hover:text-black transition-all inline-fit w-fit"
                          >
                            VIEW LETTER
                          </a>
                        ) : (
                          <span className="text-xs text-foreground-muted/50 italic font-light tracking-widest">NO DOCS</span>
                        )}
                        <p className="text-xs text-foreground-muted max-w-[150px] truncate" title={b.purpose || ""}>
                          {b.purpose || "No purpose stated"}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${statusColors[b.status]
                          }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {b.status === "pending" && (
                          <>
                            <Button
                              variant="gold"
                              size="sm"
                              className="h-8 px-4 text-[10px] rounded-full"
                              onClick={() => handleStatus(b.id, "approved")}
                            >
                              APPROVE
                            </Button>
                            <Button
                              variant="luxury"
                              size="sm"
                              className="h-8 px-4 text-[10px] rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                              onClick={() => handleStatus(b.id, "rejected")}
                            >
                              REJECT
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-foreground-muted hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(b.id)}
                        >
                          ✕
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

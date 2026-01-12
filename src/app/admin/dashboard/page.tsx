"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BookingWithDetails } from "@/types/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Mail, Loader2, LogOut } from "lucide-react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [adminEmail, setAdminEmail] = useState("");

    useEffect(() => {
        // Check if admin is logged in
        const session = localStorage.getItem("admin_session");
        if (!session) {
            router.push("/admin/login");
            return;
        }

        const admin = JSON.parse(session);
        setAdminEmail(admin.email);

        fetchBookings();
    }, [router]);

    async function fetchBookings() {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select(`
          *,
          customer:customers(*),
          service_package:service_packages(*)
        `)
                .order("booking_date", { ascending: true })
                .order("booking_time", { ascending: true });

            if (error) throw error;

            setBookings(data as unknown as BookingWithDetails[]);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function updateStatus(bookingId: string, newStatus: string) {
        try {
            const { error } = await supabase
                .from("bookings")
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq("id", bookingId);

            if (error) throw error;

            // Refresh bookings
            fetchBookings();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Något gick fel vid uppdatering");
        }
    }

    function handleLogout() {
        localStorage.removeItem("admin_session");
        router.push("/admin/login");
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/50";
            case "confirmed": return "bg-green-500/10 text-green-500 border-green-500/50";
            case "completed": return "bg-blue-500/10 text-blue-500 border-blue-500/50";
            case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/50";
            default: return "bg-muted";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending": return "Väntande";
            case "confirmed": return "Bekräftad";
            case "completed": return "Genomförd";
            case "cancelled": return "Avbokad";
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                            <p className="text-muted-foreground mt-2">Inloggad som: {adminEmail}</p>
                        </div>
                        <Button onClick={handleLogout} variant="outline">
                            <LogOut className="h-4 w-4 mr-2" />
                            Logga ut
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Totalt</CardDescription>
                                <CardTitle className="text-3xl">{bookings.length}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Väntande</CardDescription>
                                <CardTitle className="text-3xl">
                                    {bookings.filter(b => b.status === "pending").length}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Bekräftade</CardDescription>
                                <CardTitle className="text-3xl">
                                    {bookings.filter(b => b.status === "confirmed").length}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardDescription>Genomförda</CardDescription>
                                <CardTitle className="text-3xl">
                                    {bookings.filter(b => b.status === "completed").length}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Bookings List */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Alla bokningar</h2>
                        {bookings.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6 text-center text-muted-foreground">
                                    Inga bokningar ännu
                                </CardContent>
                            </Card>
                        ) : (
                            bookings.map((booking) => (
                                <Card key={booking.id} className={`border-2 ${getStatusColor(booking.status)}`}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="flex items-center gap-2">
                                                    {booking.booking_number}
                                                    <span className="text-sm font-normal text-muted-foreground">
                                                        • {booking.service_package.name}
                                                    </span>
                                                </CardTitle>
                                                <CardDescription className="mt-2">
                                                    {booking.customer.name} • {booking.customer.email} • {booking.customer.phone}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={booking.status}
                                                    onValueChange={(value) => updateStatus(booking.id, value)}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Väntande</SelectItem>
                                                        <SelectItem value="confirmed">Bekräftad</SelectItem>
                                                        <SelectItem value="completed">Genomförd</SelectItem>
                                                        <SelectItem value="cancelled">Avbokad</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(booking.booking_date).toLocaleDateString('sv-SE')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{booking.booking_time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>{booking.address}, {booking.city}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-sm">
                                            <span className="font-semibold">Bil:</span> {booking.customer.car_model}
                                            {booking.customer.license_plate && ` (${booking.customer.license_plate})`}
                                        </div>
                                        {booking.special_requests && (
                                            <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                                                <span className="font-semibold">Önskemål:</span> {booking.special_requests}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
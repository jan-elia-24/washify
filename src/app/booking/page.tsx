"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { BookingWithDetails } from "@/types/database";
import { Search, Calendar, Clock, MapPin, Mail, Loader2 } from "lucide-react";

export default function BookingPage() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  async function searchBooking() {
    if (!bookingNumber.trim()) {
      setError("Ange ett bokningsnummer");
      return;
    }

    setIsSearching(true);
    setError("");
    setBooking(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(`
          *,
          customer:customers(*),
          service_package:service_packages(*)
        `)
        .eq("booking_number", bookingNumber.trim())
        .single();

      if (fetchError || !data) {
        setError("Ingen bokning hittades med detta nummer");
        return;
      }

      setBooking(data as unknown as BookingWithDetails);
    } catch (err) {
      setError("Något gick fel. Försök igen.");
    } finally {
      setIsSearching(false);
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Väntar på bekräftelse";
      case "confirmed": return "Bekräftad";
      case "completed": return "Genomförd";
      case "cancelled": return "Avbokad";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/50";
      case "confirmed": return "bg-green-500/10 text-green-500 border-green-500/50";
      case "completed": return "bg-blue-500/10 text-blue-500 border-blue-500/50";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/50";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Hitta din bokning</CardTitle>
              <CardDescription>Ange ditt bokningsnummer för att se detaljer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="T.ex. W12345678"
                  value={bookingNumber}
                  onChange={(e) => setBookingNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchBooking()}
                  className="uppercase"
                />
                <Button onClick={searchBooking} disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Sök
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Booking Details */}
          {booking && (
            <>
              {/* Status Card */}
              <Card className={`border-2 ${getStatusColor(booking.status)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Bokningsnummer: {booking.booking_number}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Status: <span className="font-semibold">{getStatusText(booking.status)}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Bokningsdetaljer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Package */}
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{booking.service_package.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.service_package.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tid: {booking.service_package.duration_minutes} minuter
                      </p>
                    </div>
                    <p className="text-xl font-bold">{booking.total_price} kr</p>
                  </div>

                  {/* Date & Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Datum</p>
                        <p className="font-semibold">{new Date(booking.booking_date).toLocaleDateString('sv-SE')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tid</p>
                        <p className="font-semibold">{booking.booking_time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Plats</p>
                      <p className="font-semibold">{booking.address}</p>
                      <p className="text-sm">{booking.postal_code} {booking.city}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kontaktuppgifter</p>
                      <p className="font-semibold">{booking.customer.name}</p>
                      <p className="text-sm">{booking.customer.email}</p>
                      <p className="text-sm">{booking.customer.phone}</p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Bil:</span> {booking.customer.car_model}
                        {booking.customer.license_plate && ` (${booking.customer.license_plate})`}
                      </p>
                    </div>
                  </div>

                  {booking.special_requests && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Särskilda önskemål</p>
                      <p>{booking.special_requests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
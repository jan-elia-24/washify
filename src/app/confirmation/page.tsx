import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, MapPin, Mail } from "lucide-react";
import { BookingWithDetails } from "@/types/database";

async function getBooking(bookingNumber: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      customer:customers(*),
      service_package:service_packages(*)
    `)
    .eq("booking_number", bookingNumber)
    .single();

  if (error) {
    console.error("Error fetching booking:", error);
    return null;
  }

  return data as unknown as BookingWithDetails;
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const params = await searchParams;
  const bookingNumber = params.booking;

  if (!bookingNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Bokningsnummer saknas</CardTitle>
            <CardDescription>Vi kunde inte hitta din bokning.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/book">Gör en ny bokning</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const booking = await getBooking(bookingNumber);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Bokning hittades inte</CardTitle>
            <CardDescription>Bokningen med nummer {bookingNumber} kunde inte hittas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/book">Gör en ny bokning</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Card */}
          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <CardTitle className="text-3xl">Bokning bekräftad!</CardTitle>
              <CardDescription className="text-lg">
                Ditt bokningsnummer är: <span className="font-mono font-bold text-foreground">{booking.booking_number}</span>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Booking Details */}
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

          {/* Info Card */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                En bekräftelse har skickats till <strong>{booking.customer.email}</strong>.
                Vi kontaktar dig senast 24 timmar innan din bokade tid för att bekräfta.
                Spara ditt bokningsnummer för framtida referens.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <Link href="/">Tillbaka till start</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/book">Gör ny bokning</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
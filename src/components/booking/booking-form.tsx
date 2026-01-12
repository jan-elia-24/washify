"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { ServicePackage } from "@/types/database";
import { Loader2 } from "lucide-react";

const bookingSchema = z.object({
  servicePackageId: z.string().min(1, "Välj ett tvättpaket"),
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().regex(/^[0-9+\s-]{10,}$/, "Ogiltigt telefonnummer"),
  carModel: z.string().min(2, "Ange bilmodell"),
  licensePlate: z.string().optional(),
  address: z.string().min(5, "Ange fullständig adress"),
  postalCode: z.string()
    .transform((val) => val.replace(/\s/g, ""))
    .refine((val) => /^\d{5}$/.test(val), "Ogiltigt postnummer (5 siffror)"),
  city: z.string().min(2, "Ange stad"),
  bookingDate: z.string().min(1, "Välj datum").refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Du kan inte välja ett datum som har passerat"),
  bookingTime: z.string().min(1, "Välj tid"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  packages: ServicePackage[];
}

export function BookingForm({ packages }: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      servicePackageId: "",
      name: "",
      email: "",
      phone: "",
      carModel: "",
      licensePlate: "",
      address: "",
      postalCode: "",
      city: "",
      bookingDate: "",
      bookingTime: "",
      specialRequests: "",
    },
  });

  async function onSubmit(values: BookingFormValues) {
    setIsSubmitting(true);

    try {
      // Generate booking number
      const bookingNumber = `W${Date.now().toString().slice(-8)}`;

      // Get selected package
      const selectedPackage = packages.find(p => p.id === values.servicePackageId);
      if (!selectedPackage) throw new Error("Paket hittades inte");

      // Create customer
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
          name: values.name,
          email: values.email,
          phone: values.phone,
          car_model: values.carModel,
          license_plate: values.licensePlate || null,
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          booking_number: bookingNumber,
          customer_id: customer.id,
          service_package_id: values.servicePackageId,
          booking_date: values.bookingDate,
          booking_time: values.bookingTime,
          address: values.address,
          postal_code: values.postalCode,
          city: values.city,
          status: "pending",
          special_requests: values.specialRequests || null,
          total_price: selectedPackage.price,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Send confirmation email
      try {
        await fetch("/api/send-booking-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: values.email,
            customerName: values.name,
            bookingNumber,
            serviceName: selectedPackage.name,
            servicePrice: selectedPackage.price,
            bookingDate: values.bookingDate,
            bookingTime: values.bookingTime,
            address: values.address,
            city: values.city,
            postalCode: values.postalCode,
            carModel: values.carModel,
            licensePlate: values.licensePlate,
          }),
        });
        // Don't block booking if email fails
      } catch (emailError) {
        console.error("Email error:", emailError);
      }

      // Redirect to confirmation
      router.push(`/confirmation?booking=${bookingNumber}`);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Något gick fel vid bokningen. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Boka din biltvätt</CardTitle>
        <CardDescription>Fyll i formuläret så kontaktar vi dig för bekräftelse</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Package */}
            <FormField
              control={form.control}
              name="servicePackageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Välj tvättpaket *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj ett paket" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.price} kr ({pkg.duration_minutes} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kontaktuppgifter</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Namn *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ditt namn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-post *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="din@epost.se" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon *</FormLabel>
                    <FormControl>
                      <Input placeholder="070-123 45 67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Car Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Biluppgifter</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="carModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bilmodell *</FormLabel>
                      <FormControl>
                        <Input placeholder="T.ex. Volvo V40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registreringsnummer</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Plats för tvätt</h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adress *</FormLabel>
                    <FormControl>
                      <Input placeholder="Gatuadress" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postnummer *</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stad *</FormLabel>
                      <FormControl>
                        <Input placeholder="Stockholm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Välj tid</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bookingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Datum *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bookingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tid *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Special Requests */}
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Särskilda önskemål</FormLabel>
                  <FormControl>
                    <Textarea placeholder="T.ex. extra smutsig, husdjurshår..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bokar...
                </>
              ) : (
                "Bekräfta bokning"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
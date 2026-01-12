import { supabase } from "@/lib/supabase";
import { ServicePackage } from "@/types/database";
import { BookingForm } from "@/components/booking/booking-form";

async function getServicePackages() {
  const { data, error } = await supabase
    .from("service_packages")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching packages:", error);
    return [];
  }

  return data as ServicePackage[];
}

export default async function BookPage() {
  const packages = await getServicePackages();

  return (
    <div className="min-h-screen py-12">
      <div className="container px-6">
        <BookingForm packages={packages} />
      </div>
    </div>
  );
}
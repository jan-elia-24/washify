export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  car_model: string;
  license_plate: string | null;
  created_at: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  service_package_id: string;
  booking_date: string;
  booking_time: string;
  address: string;
  postal_code: string | null;
  city: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special_requests: string | null;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface BookingWithDetails extends Booking {
  customer: Customer;
  service_package: ServicePackage;
}

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
}
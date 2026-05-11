// src/lib/supabase/types.ts

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type ServiceCategory = "hair" | "skin" | "nails" | "massage";

// ─────────────────────────────────────────────
// TABLE ROW TYPES
// ─────────────────────────────────────────────

export interface Profile {
  id:         string;
  full_name:  string;
  email:      string;
  phone:      string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id:          string;
  name:        string;
  category:    ServiceCategory;
  duration:    number;
  price:       number;
  description: string | null;
  active:      boolean;
  created_at:  string;
  updated_at:  string;
}

export interface Stylist {
  id:          string;
  name:        string;
  bio:         string | null;
  photo_url:   string | null;
  specialties: string[];
  active:      boolean;
  created_at:  string;
  updated_at:  string;
}

export interface Booking {
  id:         string;
  user_id:    string;
  service_id: string;
  stylist_id: string;
  date:       string;
  time_slot:  string;
  status:     BookingStatus;
  notes:      string | null;
  created_at: string;
  updated_at: string;
  guest_name?: string | null;
}

// ─────────────────────────────────────────────
// DATABASE TYPE
// Written to match the exact internal shape
// that @supabase/supabase-js expects
// ─────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row:    Profile;
        Insert: {
          id:         string;
          full_name:  string;
          email:      string;
          phone?:     string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:        string;
          full_name?: string;
          email?:     string;
          phone?:     string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row:    Service;
        Insert: {
          id?:          string;
          name:         string;
          category:     ServiceCategory;
          duration:     number;
          price:        number;
          description?: string | null;
          active?:      boolean;
          created_at?:  string;
          updated_at?:  string;
        };
        Update: {
          id?:          string;
          name?:        string;
          category?:    ServiceCategory;
          duration?:    number;
          price?:       number;
          description?: string | null;
          active?:      boolean;
          updated_at?:  string;
        };
        Relationships: [];
      };
      stylists: {
        Row:    Stylist;
        Insert: {
          id?:          string;
          name:         string;
          bio?:         string | null;
          photo_url?:   string | null;
          specialties?: string[];
          active?:      boolean;
          created_at?:  string;
          updated_at?:  string;
        };
        Update: {
          id?:          string;
          name?:        string;
          bio?:         string | null;
          photo_url?:   string | null;
          specialties?: string[];
          active?:      boolean;
          updated_at?:  string;
        };
        Relationships: [];
      };
      bookings: {
        Row:    Booking;
        Insert: {
          id?:        string;
          user_id:    string;
          service_id: string;
          stylist_id: string;
          date:       string;
          time_slot:  string;
          status?:    BookingStatus;
          notes?:     string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:        string;
          user_id?:   string;
          service_id?: string;
          stylist_id?: string;
          date?:      string;
          time_slot?: string;
          status?:    BookingStatus;
          notes?:     string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      booking_status:   BookingStatus;
      service_category: ServiceCategory;
    };
    CompositeTypes: Record<string, never>;
  };
};

// ─────────────────────────────────────────────
// JOINED TYPES
// ─────────────────────────────────────────────

export interface BookingWithDetails extends Booking {
  service: Pick<Service, "id" | "name" | "category" | "duration" | "price">;
  stylist: Pick<Stylist, "id" | "name" | "specialties">;
  profile?: Pick<Profile, "full_name" | "email" | "phone">;
  guest_name?: string | null;
}

// ─────────────────────────────────────────────
// FORM TYPES
// ─────────────────────────────────────────────

export interface RegisterFormData {
  full_name:       string;
  email:           string;
  password:        string;
  confirmPassword: string;
  phone?:          string;
}

export interface LoginFormData {
  email:    string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface BookingFormData {
  service_id: string;
  stylist_id: string;
  date:       string;
  time_slot:  string;
  notes?:     string;
  service_duration?: number;
}

export interface ServiceFormData {
  name:        string;
  category:    ServiceCategory;
  duration:    number;
  price:       number;
  description: string;
  active:      boolean;
}

export interface StylistFormData {
  name:        string;
  bio:         string;
  specialties: string;
  active:      boolean;
}

export interface ContactFormData {
  name:    string;
  email:   string;
  phone?:  string;
  message: string;
}

// ─────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data:    T;
  message?: string;
}

export interface ApiError {
  success: false;
  error:   string;
  code?:   string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────────
// AVAILABILITY TYPES
// ─────────────────────────────────────────────

export interface AvailabilityRequest {
  stylist_id:       string;
  date:             string;
  service_duration: number;
}

export interface AvailabilityResponse {
  date:            string;
  stylist_id:      string;
  booked_slots:    string[];
  available_slots: string[];
}

// ─────────────────────────────────────────────
// ADMIN TYPES
// ─────────────────────────────────────────────

export interface AdminSession {
  authenticated: boolean;
  username:      string;
  expires_at:    number;
}

export interface DashboardStats {
  bookings_today:      number;
  bookings_this_week:  number;
  bookings_this_month: number;
  revenue_this_month:  number;
}

// ─────────────────────────────────────────────
// EMAILJS PAYLOAD
// ─────────────────────────────────────────────

export interface EmailConfirmationPayload {
  to_name:       string;
  to_email:      string;
  service_name:  string;
  stylist_name:  string;
  booking_date:  string;
  booking_time:  string;
  booking_id:    string;
  salon_address: string;
  salon_phone:   string;
}
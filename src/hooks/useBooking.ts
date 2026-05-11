// src/hooks/useBooking.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBookingStore } from "@/store/bookingStore";
import { generateTimeSlotsWithAvailability } from "@/lib/time-slots";
import { buildEmailPayload, sendBookingConfirmation } from "@/lib/emailjs";
import type {
  Service,
  Stylist,
  Booking,
  BookingFormData,
} from "@/lib/supabase/types";
import type { TimeSlot } from "@/lib/time-slots";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface UseServicesReturn {
  services: Service[];
  loading:  boolean;
  error:    string | null;
  refetch:  () => Promise<void>;
}

export interface UseStylestsReturn {
  stylists: Stylist[];
  loading:  boolean;
  error:    string | null;
}

export interface UseAvailabilityReturn {
  timeSlots: TimeSlot[];
  loading:   boolean;
  error:     string | null;
  refetch:   () => Promise<void>;
}

export interface UseSubmitBookingReturn {
  submitBooking: (
    data: BookingFormData & {
      userId:    string;
      userEmail: string;
      userName:  string;
    }
  ) => Promise<boolean>;
  loading: boolean;
  error:   string | null;
}

// ─────────────────────────────────────────────
// useServices
// ─────────────────────────────────────────────

export function useServices(category?: string): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      const res  = await fetch(`/api/services${params.size ? `?${params}` : ""}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error ?? "Failed to load services.");
      setServices(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
}

// ─────────────────────────────────────────────
// useStylists
// ─────────────────────────────────────────────

export function useStylists(_serviceId?: string): UseStylestsReturn {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchStylists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res  = await fetch("/api/stylists");
      const json = await res.json();

      if (!json.success) throw new Error(json.error ?? "Failed to load stylists.");
      setStylists(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stylists.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStylists();
  }, [fetchStylists]);

  return { stylists, loading, error };
}

// ─────────────────────────────────────────────
// useAvailability
// ─────────────────────────────────────────────

export function useAvailability(
  stylistId:       string,
  date:            string,
  serviceDuration: number
): UseAvailabilityReturn {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!stylistId || !date || !serviceDuration) {
      setTimeSlots([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        stylist_id:       stylistId,
        date,
        service_duration: serviceDuration.toString(),
      });

      const res  = await fetch(`/api/availability?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to fetch availability.");
      }

      const slots = generateTimeSlotsWithAvailability(
        date,
        json.data.booked_slots as string[],
        serviceDuration
      );

      setTimeSlots(slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load time slots.");
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  }, [stylistId, date, serviceDuration]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return { timeSlots, loading, error, refetch: fetchAvailability };
}

// ─────────────────────────────────────────────
// useSubmitBooking
// ─────────────────────────────────────────────

export function useSubmitBooking(): UseSubmitBookingReturn {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // Public reads (services/stylists) still use the browser client — they are
  // unrestricted by RLS. The booking INSERT goes through the API route so the
  // server-side cookie-based client handles auth, avoiding browser-client
  // token-refresh hangs in production.
  const supabase = createClient();

  const {
    setSubmitting,
    setSubmitError,
    setConfirmedBookingId,
  } = useBookingStore();

  const submitBooking = useCallback(
    async (
      data: BookingFormData & {
        userId:    string;
        userEmail: string;
        userName:  string;
      }
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      setSubmitting(true);
      setSubmitError(null);

      try {
        // ── Step 1: Re-check slot availability ──

        const checkParams = new URLSearchParams({
          stylist_id:       data.stylist_id,
          date:             data.date,
          service_duration: (data.service_duration ?? 30).toString(),
        });

        const checkRes  = await fetch(`/api/availability?${checkParams}`);
        const checkJson = await checkRes.json();

        if (checkJson.success) {
          const bookedSlots = checkJson.data.booked_slots as string[];
          if (bookedSlots.includes(data.time_slot)) {
            const msg = "This time slot was just booked. Please select another time.";
            setError(msg);
            setSubmitError(msg);
            return false;
          }
        }

        // ── Step 2: Insert booking via API route ──
        // Using the server-side route avoids browser-client token-refresh
        // hangs when the Supabase session needs to be validated in production.

        const insertRes  = await fetch("/api/bookings", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            service_id: data.service_id,
            stylist_id: data.stylist_id,
            date:       data.date,
            time_slot:  data.time_slot,
            notes:      data.notes ?? undefined,
            guest_name: data.userName !== data.userEmail ? data.userName : undefined,
          }),
        });

        const insertJson = await insertRes.json();

        if (!insertJson.success) {
          throw new Error(insertJson.error ?? "Booking could not be created. Please try again.");
        }

        const booking = insertJson.data as Booking;

        // ── Step 3: Fetch service and stylist names ──

        const [serviceRes, stylistRes] = await Promise.all([
          supabase.from("services").select("name").eq("id", data.service_id).single(),
          supabase.from("stylists").select("name").eq("id", data.stylist_id).single(),
        ]);

        const serviceData = serviceRes.data as unknown as { name: string } | null;
        const stylistData = stylistRes.data as unknown as { name: string } | null;

        const serviceName = serviceData?.name ?? "Service";
        const stylistName = stylistData?.name ?? "Specialist";

        // ── Step 4: Send confirmation email ──

        const emailPayload = buildEmailPayload({
          bookingId:   booking.id,
          userName:    data.userName,
          userEmail:   data.userEmail,
          serviceName,
          stylistName,
          date:        data.date,
          timeSlot:    data.time_slot,
        });

        sendBookingConfirmation(emailPayload).catch((err) => {
          console.error("Email confirmation failed:", err);
        });

        // ── Step 5: Update store ──

        setConfirmedBookingId(booking.id);

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.";
        setError(message);
        setSubmitError(message);
        return false;
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
    [supabase, setSubmitting, setSubmitError, setConfirmedBookingId]
  );

  return { submitBooking, loading, error };
}

// ─────────────────────────────────────────────
// useFeaturedServices
// ─────────────────────────────────────────────

export function useFeaturedServices(names: readonly string[]) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res  = await fetch("/api/services");
        const json = await res.json();
        if (json.success) {
          const all = (json.data ?? []) as Service[];
          setServices(all.filter((s) => names.includes(s.name)));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { services, loading };
}
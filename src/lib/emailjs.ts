// src/lib/emailjs.ts
// Client-side EmailJS helper — called after successful booking confirmation
// All keys are NEXT_PUBLIC_ because EmailJS runs entirely in the browser
// Never call this from API routes or server components

import emailjs from "@emailjs/browser";
import type { EmailConfirmationPayload } from "./supabase/types";
import { SALON } from "./constants";
import { formatDateLabel, formatTimeLabel } from "./time-slots";

// ─────────────────────────────────────────────
// INITIALISE
// Call once before sending — safe to call
// multiple times, EmailJS handles deduplication
// ─────────────────────────────────────────────

export function initEmailJS(): void {
  emailjs.init({
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
  });
}

// ─────────────────────────────────────────────
// SEND BOOKING CONFIRMATION
// Sends a confirmation email to the customer
// after their booking is written to Supabase
//
// Parameters match the EmailJS template variables
// exactly — if you rename variables in the
// EmailJS dashboard, update them here too
// ─────────────────────────────────────────────

export async function sendBookingConfirmation(
  payload: EmailConfirmationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    initEmailJS();

    const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;

    if (!serviceId || !templateId) {
      console.error("EmailJS service ID or template ID not configured.");
      return {
        success: false,
        error:   "Email service not configured.",
      };
    }

    // Template variables — these must match the
    // variable names inside your EmailJS template exactly
    const templateParams = {
      to_name:       payload.to_name,
      to_email:      payload.to_email,
      service_name:  payload.service_name,
      stylist_name:  payload.stylist_name,
      booking_date:  payload.booking_date,
      booking_time:  payload.booking_time,
      booking_id:    payload.booking_id,
      salon_name:    SALON.name,
      salon_address: payload.salon_address,
      salon_phone:   payload.salon_phone,
      salon_email:   SALON.email,
    };

    await emailjs.send(serviceId, templateId, templateParams);

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send confirmation email.";
    console.error("EmailJS error:", message);
    return { success: false, error: message };
  }
}

// ─────────────────────────────────────────────
// BUILD PAYLOAD HELPER
// Constructs the EmailConfirmationPayload from
// the raw booking data returned after Supabase insert
// Call this right before sendBookingConfirmation()
// ─────────────────────────────────────────────

export function buildEmailPayload({
  bookingId,
  userName,
  userEmail,
  serviceName,
  stylistName,
  date,
  timeSlot,
}: {
  bookingId:   string;
  userName:    string;
  userEmail:   string;
  serviceName: string;
  stylistName: string;
  date:        string;   // "YYYY-MM-DD"
  timeSlot:    string;   // "HH:MM"
}): EmailConfirmationPayload {
  return {
    to_name:       userName,
    to_email:      userEmail,
    service_name:  serviceName,
    stylist_name:  stylistName,
    booking_date:  formatDateLabel(date),      // "Saturday, 14 June 2025"
    booking_time:  formatTimeLabel(timeSlot),  // "3:30 PM"
    booking_id:    bookingId,
    salon_address: SALON.address.full,
    salon_phone:   SALON.phone,
  };
}
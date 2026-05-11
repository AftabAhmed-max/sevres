// src/store/bookingStore.ts
// Zustand store for the multi-step booking flow
// Persists step state across component re-renders
// Cleared after successful booking confirmation

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Service, Stylist } from "@/lib/supabase/types";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type BookingStep = 1 | 2 | 3 | 4;

export interface BookingState {
  // ── Current step ──
  currentStep: BookingStep;

  // ── Step 1: Selected service ──
  selectedService: Service | null;

  // ── Step 2: Selected stylist ──
  selectedStylist: Stylist | null;

  // ── Step 3: Selected date and time ──
  selectedDate: string;      // "YYYY-MM-DD"
  selectedTimeSlot: string;  // "HH:MM"

  // ── Step 4: Notes (optional) ──
  notes: string;

  // ── Loading and error states ──
  isSubmitting: boolean;
  submitError: string | null;

  // ── Confirmation (post-booking) ──
  confirmedBookingId: string | null;

  // ── Category filter on step 1 ──
  activeCategory: string;
}

export interface BookingActions {
  // Navigation
  setStep:     (step: BookingStep) => void;
  nextStep:    () => void;
  prevStep:    () => void;

  // Step 1
  setService:  (service: Service | null) => void;
  setCategory: (category: string) => void;

  // Step 2
  setStylist:  (stylist: Stylist | null) => void;

  // Step 3
  setDate:     (date: string) => void;
  setTimeSlot: (slot: string) => void;

  // Step 4
  setNotes:    (notes: string) => void;

  // Submission
  setSubmitting:        (loading: boolean) => void;
  setSubmitError:       (error: string | null) => void;
  setConfirmedBookingId:(id: string | null) => void;

  // Reset
  resetBooking: () => void;
}

export type BookingStore = BookingState & BookingActions;

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

const initialState: BookingState = {
  currentStep:         1,
  selectedService:     null,
  selectedStylist:     null,
  selectedDate:        "",
  selectedTimeSlot:    "",
  notes:               "",
  isSubmitting:        false,
  submitError:         null,
  confirmedBookingId:  null,
  activeCategory:      "all",
};

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
  ...initialState,

  // ── Navigation ──

  setStep: (step) => {
    set({ currentStep: step });
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 4) {
      set({ currentStep: (currentStep + 1) as BookingStep });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as BookingStep });
    }
  },

  // ── Step 1: Service ──

  setService: (service) => {
    set({
      selectedService:  service,
      // Clear downstream selections when service changes
      selectedStylist:  null,
      selectedDate:     "",
      selectedTimeSlot: "",
      submitError:      null,
    });
  },

  setCategory: (category) => {
    set({ activeCategory: category });
  },

  // ── Step 2: Stylist ──

  setStylist: (stylist) => {
    set({
      selectedStylist:  stylist,
      // Clear downstream selections when stylist changes
      selectedDate:     "",
      selectedTimeSlot: "",
      submitError:      null,
    });
  },

  // ── Step 3: Date & Time ──

  setDate: (date) => {
    set({
      selectedDate:     date,
      // Clear time slot when date changes
      selectedTimeSlot: "",
      submitError:      null,
    });
  },

  setTimeSlot: (slot) => {
    set({
      selectedTimeSlot: slot,
      submitError:      null,
    });
  },

  // ── Step 4: Notes ──

  setNotes: (notes) => {
    set({ notes });
  },

  // ── Submission states ──

  setSubmitting: (loading) => {
    set({ isSubmitting: loading });
  },

  setSubmitError: (error) => {
    set({ submitError: error });
  },

  setConfirmedBookingId: (id) => {
    set({ confirmedBookingId: id });
  },

  // ── Reset ──
  // Called after successful booking or when
  // user navigates away from the booking flow

  resetBooking: () => {
    set({ ...initialState });
  },
}),
    {
      name: "sevres-booking",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep:      state.currentStep,
        selectedService:  state.selectedService,
        selectedStylist:  state.selectedStylist,
        selectedDate:     state.selectedDate,
        selectedTimeSlot: state.selectedTimeSlot,
        notes:            state.notes,
        activeCategory:   state.activeCategory,
      }),
    }
  )
);

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────

export function useStepValidity() {
  const step1Valid = useBookingStore((state) => state.selectedService !== null);
  const step2Valid = useBookingStore((state) => state.selectedStylist !== null);
  const step3Valid = useBookingStore((state) => state.selectedDate !== "" && state.selectedTimeSlot !== "");
  const step4Valid = true;
  return { step1Valid, step2Valid, step3Valid, step4Valid };
}

export function useBookingSummary() {
  const service   = useBookingStore((state) => state.selectedService);
  const stylist   = useBookingStore((state) => state.selectedStylist);
  const date      = useBookingStore((state) => state.selectedDate);
  const timeSlot  = useBookingStore((state) => state.selectedTimeSlot);
  const notes     = useBookingStore((state) => state.notes);
  const bookingId = useBookingStore((state) => state.confirmedBookingId);
  return { service, stylist, date, timeSlot, notes, bookingId };
}

export function useBookingNavigation() {
  const currentStep = useBookingStore((state) => state.currentStep);
  const nextStep    = useBookingStore((state) => state.nextStep);
  const prevStep    = useBookingStore((state) => state.prevStep);
  const setStep     = useBookingStore((state) => state.setStep);
  return { currentStep, nextStep, prevStep, setStep };
}
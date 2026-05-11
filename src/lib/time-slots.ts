// src/lib/time-slots.ts
// Generates available time slots for a given date
// Accounts for salon hours, closed days, and service duration

import { BOOKING, SALON } from "./constants";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TimeSlot {
  time: string;        // "HH:MM" 24-hour e.g. "14:30"
  label: string;       // "2:30 PM" — displayed in UI
  available: boolean;  // false if booked or blocked
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// Convert "HH:MM" to total minutes from midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Convert total minutes from midnight to "HH:MM"
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Convert "HH:MM" 24h to "H:MM AM/PM" for display
export function formatTimeLabel(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

// Format a date string "YYYY-MM-DD" to human readable
// e.g. "Saturday, 14 June 2025"
export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Format a date string "YYYY-MM-DD" to short form
// e.g. "Sat, 14 Jun"
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Get day of week from date string (0 = Sunday, 1 = Monday ...)
export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + "T00:00:00").getDay();
}

// Check if a date is a closed day for the salon
export function isSalonClosed(dateStr: string): boolean {
  const day = getDayOfWeek(dateStr);
  return (BOOKING.closedDays as readonly number[]).includes(day);
}

// Check if a date is in the past
export function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + "T00:00:00");
  return date < today;
}

// Get today's date as "YYYY-MM-DD"
export function getTodayString(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = (today.getMonth() + 1).toString().padStart(2, "0");
  const d = today.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Get minimum bookable date (today) as "YYYY-MM-DD"
export function getMinDate(): string {
  return getTodayString();
}

// Get maximum bookable date (3 months from today) as "YYYY-MM-DD"
export function getMaxDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ─────────────────────────────────────────────
// CORE: GENERATE ALL SLOTS FOR A DATE
// Returns every possible slot for that day
// based on salon opening hours — does NOT
// account for bookings (that's layered on top)
// ─────────────────────────────────────────────

export function generateSlotsForDate(dateStr: string): string[] {
  if (isSalonClosed(dateStr)) return [];

  const dayOfWeek = getDayOfWeek(dateStr);
  const isSunday = dayOfWeek === 0;

  const firstSlot = isSunday
    ? BOOKING.sundayFirstSlot
    : BOOKING.firstSlot;

  const lastSlot = isSunday
    ? BOOKING.sundayLastSlot
    : BOOKING.lastSlot;

  const startMinutes = timeToMinutes(firstSlot);
  const endMinutes   = timeToMinutes(lastSlot);
  const interval     = BOOKING.slotDurationMinutes;

  const slots: string[] = [];
  let current = startMinutes;

  while (current <= endMinutes) {
    slots.push(minutesToTime(current));
    current += interval;
  }

  return slots;
}

// ─────────────────────────────────────────────
// CORE: GENERATE SLOTS WITH AVAILABILITY
// Takes booked slots from DB and service duration
// to mark which slots are unavailable
// bookedSlots: string[] of "HH:MM" already taken
// serviceDuration: number in minutes
// ─────────────────────────────────────────────

export function generateTimeSlotsWithAvailability(
  dateStr: string,
  bookedSlots: string[],
  serviceDuration: number
): TimeSlot[] {
  const allSlots = generateSlotsForDate(dateStr);

  if (allSlots.length === 0) return [];

  // Build a set of all minutes that are blocked
  // A booked slot at HH:MM blocks from HH:MM until
  // HH:MM + serviceDuration (exclusive of end)
  const blockedMinutes = new Set<number>();

  bookedSlots.forEach((slot) => {
    const slotStart = timeToMinutes(slot);
    // Block every 30-min increment covered by this booking
    for (
      let t = slotStart;
      t < slotStart + serviceDuration;
      t += BOOKING.slotDurationMinutes
    ) {
      blockedMinutes.add(t);
    }
  });

  // Also block slots where the service would run past closing time
  const dayOfWeek = getDayOfWeek(dateStr);
  const isSunday  = dayOfWeek === 0;
  const closingTime = isSunday
    ? BOOKING.sundayLastSlot
    : BOOKING.lastSlot;
  const closingMinutes = timeToMinutes(closingTime) + BOOKING.slotDurationMinutes;

  return allSlots.map((slot) => {
    const slotMinutes = timeToMinutes(slot);
    const slotEnd     = slotMinutes + serviceDuration;

    const isBlocked =
      blockedMinutes.has(slotMinutes) || slotEnd > closingMinutes;

    // If today, also block slots that have already passed
    const isToday = dateStr === getTodayString();
    let isPast    = false;

    if (isToday) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      // Add 30-min buffer so user can't book something starting immediately
      isPast = slotMinutes <= nowMinutes + 30;
    }

    return {
      time:      slot,
      label:     formatTimeLabel(slot),
      available: !isBlocked && !isPast,
    };
  });
}

// ─────────────────────────────────────────────
// WEEKLY CALENDAR HELPERS
// Returns an array of 7 date strings starting
// from the given start date for the weekly view
// ─────────────────────────────────────────────

export function getWeekDates(startDateStr: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDateStr + "T00:00:00");

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    dates.push(`${y}-${m}-${day}`);
  }

  return dates;
}

// Get the Monday of the current week as "YYYY-MM-DD"
// Used to initialise the weekly calendar view
export function getCurrentWeekMonday(): string {
  const today = new Date();
  const day   = today.getDay(); // 0 = Sunday
  // If Sunday (0), go back 6 days; else go back (day - 1) days
  const diff  = day === 0 ? -6 : 1 - day;
  today.setDate(today.getDate() + diff);
  const y = today.getFullYear();
  const m = (today.getMonth() + 1).toString().padStart(2, "0");
  const d = today.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Short day labels for calendar header
export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Full day labels for accessibility
export const DAY_LABELS_FULL = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday", "Sunday",
];

// ─────────────────────────────────────────────
// PRICE FORMATTER
// Formats a number as Indian Rupees
// e.g. 3500 → "₹3,500"
// ─────────────────────────────────────────────

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style:    "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────
// DURATION FORMATTER
// Formats minutes into readable string
// e.g. 90 → "1 hr 30 min", 60 → "1 hr"
// ─────────────────────────────────────────────

export function formatDuration(minutes: number): string {
  const hrs  = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs === 0)  return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}
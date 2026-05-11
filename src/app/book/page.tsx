// src/app/book/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingProgress from "@/components/booking/BookingProgress";
import StepService from "@/components/booking/StepService";
import StepStylist from "@/components/booking/StepStylist";
import StepDateTime from "@/components/booking/StepDateTime";
import StepConfirm from "@/components/booking/StepConfirm";
import { useBookingStore } from "@/store/bookingStore";
export default function BookPage() {
  const searchParams                 = useSearchParams();
  const { currentStep, setService, resetBooking } = useBookingStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Pre-select service if ?service=id is in the URL
  useEffect(() => {
    const serviceId = searchParams.get("service");
    if (!serviceId) return;

    const load = async () => {
      const res  = await fetch(`/api/services?id=${serviceId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setService(json.data as never);
      }
    };

    load();
  }, []);                                          // eslint-disable-line react-hooks/exhaustive-deps

  // Reset booking on unmount
  useEffect(() => {
    return () => {
      // Only reset if booking was not confirmed
      if (!useBookingStore.getState().confirmedBookingId) {
        resetBooking();
      }
    };
  }, []);                                          // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight:       "100svh",
          backgroundColor: "#FAF7F2",
          paddingTop:      "8rem",
          paddingBottom:   "6rem",
        }}
      >
        <div className="container-sevres">
          {/* Page header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="eyebrow">Reserve Your Ritual</span>
            <h1
              style={{
                fontFamily:    "'Cormorant Garamond', Georgia, serif",
                fontSize:      "clamp(2rem, 4vw, 3.5rem)",
                fontWeight:    300,
                color:         "#2C1810",
                letterSpacing: "-0.02em",
                lineHeight:    1.1,
              }}
            >
              Book an appointment
            </h1>
          </div>

          {/* Step progress indicator */}
          <BookingProgress />

          {/* Step content */}
          <div
            style={{
              maxWidth:        "860px",
              margin:          "0 auto",
              backgroundColor: "#FFFFFF",
              borderRadius:    "1rem",
              border:          "1px solid rgba(196,149,106,0.15)",
              boxShadow:       "0 4px 40px rgba(44,24,16,0.07)",
              padding:         "clamp(1.5rem, 4vw, 3rem)",
            }}
          >
            {currentStep === 1 && <StepService />}
            {currentStep === 2 && <StepStylist />}
            {currentStep === 3 && <StepDateTime />}
            {currentStep === 4 && <StepConfirm />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
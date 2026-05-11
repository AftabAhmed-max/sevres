// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SALON } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Toast from "@/components/ui/Toast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name:    "",
    email:   "",
    phone:   "",
    message: "",
  });
  const [loading, setLoading]   = useState(false);
  const [toast,   setToast]     = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission — replace with EmailJS or API route if needed
    await new Promise((r) => setTimeout(r, 1200));

    setToast({
      message: "Thank you. We will be in touch within 24 hours.",
      type:    "success",
    });
    setForm({ name: "", email: "", phone: "", message: "" });
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          style={{
            backgroundColor: "#FAF7F2",
            paddingTop:      "10rem",
            paddingBottom:   "5rem",
            textAlign:       "center",
          }}
        >
          <div className="container-sevres">
            <span className="eyebrow">Get in Touch</span>
            <h1
              style={{
                fontFamily:    "'Cormorant Garamond', Georgia, serif",
                fontSize:      "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight:    300,
                color:         "#2C1810",
                letterSpacing: "-0.02em",
                marginBottom:  "1rem",
              }}
            >
              We would love to hear from you.
            </h1>
            <div className="divider-rose" />
          </div>
        </section>

        {/* ── Content ── */}
        <section style={{ padding: "2rem 0 6rem" }}>
          <div className="container-sevres">
            <div
              className="contact-grid"
              style={{
                display:             "grid",
                gridTemplateColumns: "1fr 1.4fr",
                gap:                 "5rem",
                alignItems:          "start",
              }}
            >
              {/* Left — Info */}
              <div>
                <h2
                  style={{
                    fontFamily:   "'Cormorant Garamond', Georgia, serif",
                    fontSize:     "1.875rem",
                    fontWeight:   400,
                    color:        "#2C1810",
                    marginBottom: "2rem",
                  }}
                >
                  Studio information
                </h2>

                <div
                  style={{
                    display:       "flex",
                    flexDirection: "column",
                    gap:           "1.5rem",
                    marginBottom:  "3rem",
                  }}
                >
                  {[
                    {
                      icon:  <MapPin size={16} />,
                      label: "Address",
                      value: SALON.address.full,
                    },
                    {
                      icon:  <Phone size={16} />,
                      label: "Phone",
                      value: SALON.phone,
                    },
                    {
                      icon:  <Mail size={16} />,
                      label: "Email",
                      value: SALON.email,
                    },
                    {
                      icon:  <Clock size={16} />,
                      label: "Hours",
                      value: `${SALON.hours.weekdays}\n${SALON.hours.sunday}\n${SALON.hours.monday}`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
                    >
                      <div
                        style={{
                          width:           "40px",
                          height:          "40px",
                          borderRadius:    "9999px",
                          backgroundColor: "rgba(196,149,106,0.1)",
                          display:         "flex",
                          alignItems:      "center",
                          justifyContent:  "center",
                          color:           "#C4956A",
                          flexShrink:      0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily:    "'DM Sans', sans-serif",
                            fontSize:      "0.6875rem",
                            fontWeight:    500,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color:         "#8B7355",
                            marginBottom:  "0.25rem",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize:   "0.9375rem",
                            color:      "#2C1810",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div
                  style={{
                    borderRadius: "0.75rem",
                    overflow:     "hidden",
                    border:       "1px solid rgba(196,149,106,0.15)",
                    height:       "240px",
                  }}
                >
                  <iframe
                    src={SALON.map.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Sèvres & Co. location map"
                  />
                </div>
              </div>

              {/* Right — Form */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius:    "1rem",
                  border:          "1px solid rgba(196,149,106,0.15)",
                  boxShadow:       "0 4px 40px rgba(44,24,16,0.07)",
                  padding:         "2.5rem",
                }}
              >
                <h2
                  style={{
                    fontFamily:   "'Cormorant Garamond', Georgia, serif",
                    fontSize:     "1.875rem",
                    fontWeight:   400,
                    color:        "#2C1810",
                    marginBottom: "0.5rem",
                  }}
                >
                  Send us a message
                </h2>
                <p
                  style={{
                    fontFamily:   "'DM Sans', sans-serif",
                    fontSize:     "0.9rem",
                    color:        "#8B7355",
                    marginBottom: "2rem",
                    lineHeight:   1.6,
                  }}
                >
                  For bookings, please use our{" "}
                  <a
                    href="/book"
                    style={{ color: "#C4956A", textDecoration: "underline" }}
                  >
                    online booking page
                  </a>
                  . For all other enquiries, we respond within 24 hours.
                </p>

                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  <div>
                    <label className="label-sevres">Full Name *</label>
                    <input
                      className="input-sevres"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="label-sevres">Email Address *</label>
                    <input
                      className="input-sevres"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="label-sevres">Phone (optional)</label>
                    <input
                      className="input-sevres"
                      type="tel"
                      placeholder="+91 98200 00000"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-sevres">Message *</label>
                    <textarea
                      className="input-sevres"
                      rows={5}
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      required
                      style={{ resize: "vertical", minHeight: "120px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{
                      opacity: loading ? 0.7 : 1,
                      cursor:  loading ? "not-allowed" : "pointer",
                      marginTop: "0.5rem",
                    }}
                  >
                    {loading ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </>
  );
}
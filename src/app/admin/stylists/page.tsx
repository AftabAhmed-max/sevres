// src/app/admin/stylists/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { getAdminSession } from "@/lib/admin-auth";
import StylistForm from "@/components/admin/StylistForm";
import InitialsAvatar from "@/components/ui/InitialsAvatar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { Plus, Pencil, UserX, UserCheck } from "lucide-react";
import type { Stylist, StylistFormData } from "@/lib/supabase/types";

export default function AdminStylistsPage() {
  const [stylists,  setStylists]  = useState<Stylist[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [formOpen,  setFormOpen]  = useState(false);
  const [editing,   setEditing]   = useState<Stylist | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState<{ message: string; type: "success" | "error" } | null>(null);

  const getAuthHeader = (): string => {
    const session = getAdminSession();
    if (!session) return "";
    return `Bearer ${btoa(JSON.stringify(session))}`;
  };

  const fetchStylists = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/stylists", {
        headers: { Authorization: getAuthHeader() },
      });
      const json = await res.json();
      if (json.success) setStylists(json.data);
    } catch {
      setToast({ message: "Failed to load stylists.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);                                        // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchStylists();
  }, []);                                        // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (data: StylistFormData) => {
    setSaving(true);
    try {
      const isEdit = !!editing;
      const url    = "/api/admin/stylists";
      const method = isEdit ? "PATCH" : "POST";
      const body   = isEdit
        ? { stylist_id: editing!.id, ...data }
        : data;

      const res  = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization:  getAuthHeader(),
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!json.success) {
        setToast({ message: json.error ?? "Save failed.", type: "error" });
        return;
      }

      setToast({
        message: isEdit ? "Specialist updated successfully." : "Specialist added successfully.",
        type:    "success",
      });
      setFormOpen(false);
      setEditing(null);
      await fetchStylists();
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (stylist: Stylist) => {
    try {
      const res  = await fetch("/api/admin/stylists", {
        method:  "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization:  getAuthHeader(),
        },
        body: JSON.stringify({
          stylist_id: stylist.id,
          active:     !stylist.active,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setToast({ message: json.error ?? "Update failed.", type: "error" });
        return;
      }

      setToast({
        message: `${stylist.name} ${!stylist.active ? "reactivated" : "deactivated"} successfully.`,
        type:    "success",
      });
      await fetchStylists();
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    }
  };

  const active   = stylists.filter((s) =>  s.active);
  const inactive = stylists.filter((s) => !s.active);

  const StylistCard = ({ stylist }: { stylist: Stylist }) => (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius:    "0.75rem",
        border:          `1px solid ${stylist.active ? "rgba(196,149,106,0.12)" : "rgba(139,115,85,0.1)"}`,
        padding:         "1.5rem",
        opacity:         stylist.active ? 1 : 0.7,
        display:         "flex",
        alignItems:      "flex-start",
        gap:             "1rem",
        boxShadow:       "0 2px 20px rgba(44,24,16,0.05)",
      }}
    >
      {/* Avatar */}
      <div style={{ flexShrink: 0 }}>
        <InitialsAvatar name={stylist.name} size={52} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display:        "flex",
            alignItems:     "flex-start",
            justifyContent: "space-between",
            gap:            "0.5rem",
            marginBottom:   "0.375rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   "1.1875rem",
              fontWeight: 400,
              color:      "#2C1810",
              lineHeight: 1.2,
            }}
          >
            {stylist.name}
          </h3>
          <span
            className="badge"
            style={{
              backgroundColor: stylist.active
                ? "rgba(184,150,90,0.12)"
                : "rgba(139,115,85,0.1)",
              color:     stylist.active ? "#B8965A" : "#8B7355",
              flexShrink: 0,
            }}
          >
            {stylist.active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Specialties */}
        <p
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      "0.6875rem",
            fontWeight:    500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "#C4956A",
            marginBottom:  "0.5rem",
          }}
        >
          {stylist.specialties.join(" · ")}
        </p>

        {/* Bio */}
        {stylist.bio && (
          <p
            style={{
              fontFamily:          "'DM Sans', sans-serif",
              fontSize:            "0.8375rem",
              color:               "#8B7355",
              lineHeight:          1.65,
              display:             "-webkit-box",
              WebkitLineClamp:     2,
              WebkitBoxOrient:     "vertical" as const,
              overflow:            "hidden",
              marginBottom:        "1rem",
            }}
          >
            {stylist.bio}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button
            onClick={() => { setEditing(stylist); setFormOpen(true); }}
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "0.375rem",
              fontFamily:      "'DM Sans', sans-serif",
              fontSize:        "0.75rem",
              fontWeight:      500,
              letterSpacing:   "0.08em",
              textTransform:   "uppercase",
              color:           "#8B7355",
              backgroundColor: "transparent",
              border:          "1.5px solid rgba(139,115,85,0.25)",
              borderRadius:    "9999px",
              padding:         "0.375rem 0.875rem",
              cursor:          "pointer",
              transition:      "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C4956A";
              e.currentTarget.style.color       = "#C4956A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(139,115,85,0.25)";
              e.currentTarget.style.color       = "#8B7355";
            }}
          >
            <Pencil size={11} /> Edit
          </button>

          <button
            onClick={() => handleToggleActive(stylist)}
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "0.375rem",
              fontFamily:      "'DM Sans', sans-serif",
              fontSize:        "0.75rem",
              fontWeight:      500,
              letterSpacing:   "0.08em",
              textTransform:   "uppercase",
              color:           stylist.active ? "#8B7355" : "#B8965A",
              backgroundColor: "transparent",
              border:          `1.5px solid ${stylist.active ? "rgba(139,115,85,0.25)" : "rgba(184,150,90,0.3)"}`,
              borderRadius:    "9999px",
              padding:         "0.375rem 0.875rem",
              cursor:          "pointer",
              transition:      "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(196,149,106,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {stylist.active
              ? <><UserX size={11} /> Deactivate</>
              : <><UserCheck size={11} /> Reactivate</>
            }
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   "2.5rem",
          flexWrap:       "wrap",
          gap:            "1rem",
        }}
      >
        <div>
          <span className="eyebrow">Manage</span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   "clamp(1.75rem, 3vw, 2.75rem)",
              fontWeight: 400,
              color:      "#2C1810",
            }}
          >
            Specialists
          </h1>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="btn-primary btn-sm"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={15} />
          Add Specialist
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "4rem 0" }}>
          <LoadingSpinner message="Loading specialists…" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Active */}
          <div>
            <div
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <h2
                style={{
                  fontFamily:    "'DM Sans', sans-serif",
                  fontSize:      "0.6875rem",
                  fontWeight:    500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:         "#C4956A",
                }}
              >
                Active Specialists
              </h2>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(196,149,106,0.15)" }} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   "0.75rem",
                  color:      "#8B7355",
                }}
              >
                {active.length} specialist{active.length !== 1 ? "s" : ""}
              </span>
            </div>

            {active.length === 0 ? (
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   "0.9rem",
                  color:      "#8B7355",
                  textAlign:  "center",
                  padding:    "2rem 0",
                }}
              >
                No active specialists. Add one above.
              </p>
            ) : (
              <div
                style={{
                  display:             "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap:                 "1.25rem",
                }}
              >
                {active.map((s) => <StylistCard key={s.id} stylist={s} />)}
              </div>
            )}
          </div>

          {/* Inactive */}
          {inactive.length > 0 && (
            <div>
              <div
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <h2
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontSize:      "0.6875rem",
                    fontWeight:    500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color:         "#8B7355",
                  }}
                >
                  Inactive
                </h2>
                <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(139,115,85,0.1)" }} />
              </div>
              <div
                style={{
                  display:             "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap:                 "1.25rem",
                }}
              >
                {inactive.map((s) => <StylistCard key={s.id} stylist={s} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form modal */}
      <StylistForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSave={handleSave}
        stylist={editing}
        loading={saving}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .stylists-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
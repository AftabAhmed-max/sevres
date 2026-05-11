// src/app/admin/services/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { getAdminSession } from "@/lib/admin-auth";
import ServiceForm from "@/components/admin/ServiceForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { formatPrice, formatDuration } from "@/lib/time-slots";
import { Plus, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import type { Service, ServiceFormData } from "@/lib/supabase/types";

export default function AdminServicesPage() {
  const [services,  setServices]  = useState<Service[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [formOpen,  setFormOpen]  = useState(false);
  const [editing,   setEditing]   = useState<Service | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [toast,     setToast]     = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { } = useAdmin();

  const getAuthHeader = (): string => {
    const session = getAdminSession();
    if (!session) return "";
    return `Bearer ${btoa(JSON.stringify(session))}`;
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/services", {
        headers: { Authorization: getAuthHeader() },
      });
      const json = await res.json();
      if (json.success) setServices(json.data);
    } catch {
      setToast({ message: "Failed to load services.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);                                        // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchServices();
  }, []);                                        // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (data: ServiceFormData) => {
    setSaving(true);
    try {
      const isEdit = !!editing;
      const url    = "/api/admin/services";
      const method = isEdit ? "PATCH" : "POST";
      const body   = isEdit
        ? { service_id: editing!.id, ...data }
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
        message: isEdit ? "Service updated successfully." : "Service created successfully.",
        type:    "success",
      });
      setFormOpen(false);
      setEditing(null);
      await fetchServices();
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (service: Service) => {
    try {
      const res  = await fetch("/api/admin/services", {
        method:  "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization:  getAuthHeader(),
        },
        body: JSON.stringify({
          service_id: service.id,
          active:     !service.active,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setToast({ message: json.error ?? "Update failed.", type: "error" });
        return;
      }

      setToast({
        message: `Service ${!service.active ? "made visible" : "hidden"} successfully.`,
        type:    "success",
      });
      await fetchServices();
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    }
  };

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
    setDeleting(service.id);
    try {
      const res  = await fetch(`/api/admin/services?service_id=${service.id}`, {
        method:  "DELETE",
        headers: { Authorization: getAuthHeader() },
      });
      const json = await res.json();

      if (!json.success) {
        setToast({ message: json.error ?? "Delete failed.", type: "error" });
        return;
      }

      setToast({ message: "Service deleted successfully.", type: "success" });
      await fetchServices();
    } catch {
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setDeleting(null);
    }
  };

  const CATEGORY_LABELS: Record<string, string> = {
    hair:    "Hair",
    skin:    "Skin",
    nails:   "Nails",
    massage: "Massage",
  };

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

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
            Services
          </h1>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="btn-primary btn-sm"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={15} />
          Add Service
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: "4rem 0" }}>
          <LoadingSpinner message="Loading services…" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              {/* Category heading */}
              <div
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "0.75rem",
                  marginBottom: "1rem",
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
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(196,149,106,0.15)" }} />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize:   "0.75rem",
                    color:      "#8B7355",
                  }}
                >
                  {items.length} service{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Services table */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius:    "0.75rem",
                  border:          "1px solid rgba(196,149,106,0.12)",
                  overflow:        "hidden",
                  width:           "100%",
                }}
              >
                <div style={{ overflowX: "auto" }}>
                <table className="admin-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: "200px" }}>Service</th>
                      <th style={{ minWidth: "100px" }}>Duration</th>
                      <th style={{ minWidth: "100px" }}>Price</th>
                      <th style={{ minWidth: "80px"  }}>Status</th>
                      <th style={{ minWidth: "100px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((service) => (
                      <tr key={service.id}>
                        {/* Name + description */}
                        <td>
                          <p
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize:   "0.9375rem",
                              fontWeight: 500,
                              color:      service.active ? "#2C1810" : "#8B7355",
                            }}
                          >
                            {service.name}
                          </p>
                          {service.description && (
                            <p
                              style={{
                                fontFamily:          "'DM Sans', sans-serif",
                                fontSize:            "0.8rem",
                                color:               "#8B7355",
                                marginTop:           "0.2rem",
                                display:             "-webkit-box",
                                WebkitLineClamp:     1,
                                WebkitBoxOrient:     "vertical" as const,
                                overflow:            "hidden",
                              }}
                            >
                              {service.description}
                            </p>
                          )}
                        </td>

                        {/* Duration */}
                        <td>
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize:   "0.875rem",
                              color:      "#2C1810",
                            }}
                          >
                            {formatDuration(service.duration)}
                          </span>
                        </td>

                        {/* Price */}
                        <td>
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize:   "1.0625rem",
                              fontWeight: 500,
                              color:      "#2C1810",
                            }}
                          >
                            {formatPrice(service.price)}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: service.active
                                ? "rgba(184,150,90,0.12)"
                                : "rgba(139,115,85,0.1)",
                              color: service.active ? "#B8965A" : "#8B7355",
                            }}
                          >
                            {service.active ? "Visible" : "Hidden"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {/* Edit */}
                            <button
                              onClick={() => { setEditing(service); setFormOpen(true); }}
                              title="Edit service"
                              style={{
                                width:           "30px",
                                height:          "30px",
                                borderRadius:    "9999px",
                                border:          "1.5px solid rgba(139,115,85,0.25)",
                                backgroundColor: "transparent",
                                color:           "#8B7355",
                                display:         "flex",
                                alignItems:      "center",
                                justifyContent:  "center",
                                cursor:          "pointer",
                                transition:      "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor     = "#C4956A";
                                e.currentTarget.style.color           = "#C4956A";
                                e.currentTarget.style.backgroundColor = "rgba(196,149,106,0.06)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor     = "rgba(139,115,85,0.25)";
                                e.currentTarget.style.color           = "#8B7355";
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <Pencil size={13} />
                            </button>

                            {/* Toggle visibility */}
                            <button
                              onClick={() => handleToggleVisibility(service)}
                              title={service.active ? "Hide service" : "Show service"}
                              style={{
                                width:           "30px",
                                height:          "30px",
                                borderRadius:    "9999px",
                                border:          "1.5px solid rgba(139,115,85,0.25)",
                                backgroundColor: "transparent",
                                color:           "#8B7355",
                                display:         "flex",
                                alignItems:      "center",
                                justifyContent:  "center",
                                cursor:          "pointer",
                                transition:      "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor     = "#C4956A";
                                e.currentTarget.style.color           = "#C4956A";
                                e.currentTarget.style.backgroundColor = "rgba(196,149,106,0.06)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor     = "rgba(139,115,85,0.25)";
                                e.currentTarget.style.color           = "#8B7355";
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              {service.active ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(service)}
                              disabled={deleting === service.id}
                              title="Delete service"
                              style={{
                                width:           "30px",
                                height:          "30px",
                                borderRadius:    "9999px",
                                border:          "1.5px solid rgba(180,60,60,0.25)",
                                backgroundColor: "transparent",
                                color:           "rgba(180,60,60,0.7)",
                                display:         "flex",
                                alignItems:      "center",
                                justifyContent:  "center",
                                cursor:          deleting === service.id ? "not-allowed" : "pointer",
                                opacity:         deleting === service.id ? 0.5 : 1,
                                transition:      "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (deleting !== service.id) {
                                  e.currentTarget.style.borderColor     = "rgba(180,60,60,0.6)";
                                  e.currentTarget.style.color           = "rgb(180,60,60)";
                                  e.currentTarget.style.backgroundColor = "rgba(180,60,60,0.06)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor     = "rgba(180,60,60,0.25)";
                                e.currentTarget.style.color           = "rgba(180,60,60,0.7)";
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      <ServiceForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSave={handleSave}
        service={editing}
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
    </div>
  );
}
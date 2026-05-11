// src/components/admin/ServiceForm.tsx
"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service, ServiceFormData } from "@/lib/supabase/types";

interface ServiceFormProps {
  open:     boolean;
  onClose:  () => void;
  onSave:   (data: ServiceFormData) => Promise<void>;
  service?: Service | null;
  loading?: boolean;
}

const EMPTY: ServiceFormData = {
  name:        "",
  category:    "hair",
  duration:    60,
  price:       0,
  description: "",
  active:      true,
};

export default function ServiceForm({
  open,
  onClose,
  onSave,
  service,
  loading = false,
}: ServiceFormProps) {
  const [form,   setForm]   = useState<ServiceFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});

  useEffect(() => {
    if (service) {
      setForm({
        name:        service.name,
        category:    service.category,
        duration:    service.duration,
        price:       service.price,
        description: service.description ?? "",
        active:      service.active,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [service, open]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof ServiceFormData, string>> = {};
    if (!form.name.trim())          e.name     = "Name is required.";
    if (form.duration < 15)         e.duration = "Duration must be at least 15 minutes.";
    if (form.price < 0)             e.price    = "Price must be a positive number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form);
  };

  const update = (field: keyof ServiceFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value;
      setForm((p) => ({ ...p, [field]: value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={service ? "Edit Service" : "Add Service"}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        {/* Name */}
        <div>
          <label className="label-sevres">Service Name *</label>
          <input
            className={`input-sevres ${errors.name ? "input-error" : ""}`}
            type="text"
            placeholder="e.g. Balayage & Highlights"
            value={form.name}
            onChange={update("name")}
            required
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="label-sevres">Category *</label>
          <select
            className="input-sevres"
            value={form.category}
            onChange={update("category")}
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration + Price */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:                 "1rem",
          }}
        >
          <div>
            <label className="label-sevres">Duration (min) *</label>
            <input
              className={`input-sevres ${errors.duration ? "input-error" : ""}`}
              type="number"
              min={15}
              step={15}
              value={form.duration}
              onChange={update("duration")}
              required
            />
            {errors.duration && <p className="error-text">{errors.duration}</p>}
          </div>
          <div>
            <label className="label-sevres">Price (₹) *</label>
            <input
              className={`input-sevres ${errors.price ? "input-error" : ""}`}
              type="number"
              min={0}
              step={1}
              value={form.price}
              onChange={update("price")}
              required
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label-sevres">Description</label>
          <textarea
            className="input-sevres"
            rows={3}
            placeholder="Brief description shown to clients…"
            value={form.description}
            onChange={update("description")}
            style={{ resize: "vertical", minHeight: "80px" }}
          />
        </div>

        {/* Active toggle */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "0.875rem 1rem",
            backgroundColor: "#FAF7F2",
            borderRadius:   "0.5rem",
            border:         "1px solid rgba(196,149,106,0.15)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "0.875rem",
                fontWeight: 500,
                color:      "#2C1810",
              }}
            >
              Visible to clients
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "0.8rem",
                color:      "#8B7355",
              }}
            >
              Toggle off to hide this service from the booking flow
            </p>
          </div>
          <label
            style={{ position: "relative", display: "inline-block", width: "44px", height: "24px", flexShrink: 0 }}
          >
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position:        "absolute",
                inset:           0,
                backgroundColor: form.active ? "#C4956A" : "rgba(139,115,85,0.25)",
                borderRadius:    "9999px",
                cursor:          "pointer",
                transition:      "background-color 0.3s ease",
              }}
            >
              <span
                style={{
                  position:        "absolute",
                  top:             "3px",
                  left:            form.active ? "23px" : "3px",
                  width:           "18px",
                  height:          "18px",
                  backgroundColor: "#FFFFFF",
                  borderRadius:    "9999px",
                  transition:      "left 0.3s ease",
                  boxShadow:       "0 1px 4px rgba(0,0,0,0.2)",
                }}
              />
            </span>
          </label>
        </div>

        {/* Actions */}
        <div
          style={{
            display:        "flex",
            gap:            "0.75rem",
            justifyContent: "flex-end",
            paddingTop:     "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary btn-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary btn-sm"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, minWidth: "100px" }}
          >
            {loading ? "Saving…" : service ? "Save Changes" : "Add Service"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
// src/components/admin/StylistForm.tsx
"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import InitialsAvatar from "@/components/ui/InitialsAvatar";
import type { Stylist, StylistFormData } from "@/lib/supabase/types";

interface StylistFormProps {
  open:     boolean;
  onClose:  () => void;
  onSave:   (data: StylistFormData) => Promise<void>;
  stylist?: Stylist | null;
  loading?: boolean;
}

const EMPTY: StylistFormData = {
  name:        "",
  bio:         "",
  specialties: "",
  active:      true,
};

export default function StylistForm({
  open,
  onClose,
  onSave,
  stylist,
  loading = false,
}: StylistFormProps) {
  const [form,   setForm]   = useState<StylistFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof StylistFormData, string>>>({});

  useEffect(() => {
    if (stylist) {
      setForm({
        name:        stylist.name,
        bio:         stylist.bio ?? "",
        specialties: stylist.specialties.join(", "),
        active:      stylist.active,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [stylist, open]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof StylistFormData, string>> = {};
    if (!form.name.trim())        e.name        = "Name is required.";
    if (!form.specialties.trim()) e.specialties = "At least one specialty is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form);
  };

  const update = (field: keyof StylistFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={stylist ? "Edit Specialist" : "Add Specialist"}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        {/* Avatar preview */}
        {form.name && (
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "1rem",
              padding:        "1rem",
              backgroundColor: "#FAF7F2",
              borderRadius:   "0.5rem",
              border:         "1px solid rgba(196,149,106,0.15)",
            }}
          >
            <InitialsAvatar name={form.name} size={48} />
            <div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize:   "1.125rem",
                  fontWeight: 400,
                  color:      "#2C1810",
                }}
              >
                {form.name}
              </p>
              {form.specialties && (
                <p
                  style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontSize:      "0.75rem",
                    color:         "#C4956A",
                    letterSpacing: "0.08em",
                  }}
                >
                  {form.specialties
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 3)
                    .join(" · ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="label-sevres">Full Name *</label>
          <input
            className={`input-sevres ${errors.name ? "input-error" : ""}`}
            type="text"
            placeholder="e.g. Isabelle Morel"
            value={form.name}
            onChange={update("name")}
            required
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        {/* Specialties */}
        <div>
          <label className="label-sevres">Specialties * (comma-separated)</label>
          <input
            className={`input-sevres ${errors.specialties ? "input-error" : ""}`}
            type="text"
            placeholder="e.g. Balayage, Colour, Keratin"
            value={form.specialties}
            onChange={update("specialties")}
          />
          {errors.specialties ? (
            <p className="error-text">{errors.specialties}</p>
          ) : (
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "0.75rem",
                color:      "#8B7355",
                marginTop:  "0.375rem",
              }}
            >
              Separate each specialty with a comma
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="label-sevres">Bio</label>
          <textarea
            className="input-sevres"
            rows={4}
            placeholder="A short professional biography shown to clients…"
            value={form.bio}
            onChange={update("bio")}
            style={{ resize: "vertical", minHeight: "100px" }}
          />
        </div>

        {/* Active toggle */}
        <div
          style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            padding:         "0.875rem 1rem",
            backgroundColor: "#FAF7F2",
            borderRadius:    "0.5rem",
            border:          "1px solid rgba(196,149,106,0.15)",
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
              Active & bookable
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize:   "0.8rem",
                color:      "#8B7355",
              }}
            >
              Toggle off to remove from booking flow without deleting
            </p>
          </div>
          <label
            style={{
              position: "relative",
              display:  "inline-block",
              width:    "44px",
              height:   "24px",
              flexShrink: 0,
            }}
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
            style={{ opacity: loading ? 0.7 : 1, minWidth: "120px" }}
          >
            {loading ? "Saving…" : stylist ? "Save Changes" : "Add Specialist"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
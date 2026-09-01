// FILE: src/app/admin/yogacourse/online-yogacourse-seatbooking/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "@/assets/style/Admin/yogacourse/100hourscourse/Seatsmodule.module.css";

interface FormData {
  startDate: string;
  endDate: string;
  usd200: string;
  usd300: string;
  inr200: string;
  inr300: string;
  totalSeats: string;
  bookedSeats: string;
  note: string;
}

interface FormErrors {
  startDate?: string;
  endDate?: string;
  usd200?: string;
  usd300?: string;
  inr200?: string;
  inr300?: string;
  totalSeats?: string;
  bookedSeats?: string;
}

export default function OnlineSeatsEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>({
    startDate: "",
    endDate: "",
    usd200: "",
    usd300: "",
    inr200: "",
    inr300: "",
    totalSeats: "7",
    bookedSeats: "0",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ── Fetch existing data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/online-seats/get-batch/${id}`);
        const d = res.data.data;

        const toDateInput = (val: string | Date | undefined) => {
          if (!val) return "";
          const dt = new Date(val);
          if (isNaN(dt.getTime())) return "";
          return dt.toISOString().split("T")[0];
        };

        setForm({
          startDate:   toDateInput(d.startDate),
          endDate:     toDateInput(d.endDate),
          usd200:      String(d.usd200      ?? ""),
          usd300:      String(d.usd300      ?? ""),
          inr200:      String(d.inr200      ?? ""),
          inr300:      String(d.inr300      ?? ""),
          totalSeats:  String(d.totalSeats  ?? 7),
          bookedSeats: String(d.bookedSeats ?? 0),
          note:        d.note ?? "",
        });
      } catch {
        toast.error("Failed to fetch batch");
        router.replace("/admin/yogacourse/online-yogacourse-seatbooking");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const set = (key: keyof FormData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined } as FormErrors));
  };

  /* ── Date preview ── */
  const formatDate = (d: string) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const dateRangePreview =
    form.startDate && form.endDate
      ? `${formatDate(form.startDate)} – ${formatDate(form.endDate)}`
      : null;

  /* ── Validate ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate <= form.startDate)
      e.endDate = "End date must be after start date";
    if (!form.usd200.trim()) e.usd200 = "200 Hr USD fee is required";
    if (!form.usd300.trim()) e.usd300 = "300 Hr USD fee is required";
    if (!form.inr200.trim()) e.inr200 = "200 Hr INR fee is required";
    if (!form.inr300.trim()) e.inr300 = "300 Hr INR fee is required";
    if (
      !form.totalSeats.trim() ||
      isNaN(Number(form.totalSeats)) ||
      Number(form.totalSeats) < 1
    )
      e.totalSeats = "Valid total seats required (min 1)";
    if (form.bookedSeats.trim() && isNaN(Number(form.bookedSeats)))
      e.bookedSeats = "Valid number required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await api.put(`/online-seats/update-batch/${id}`, {
        startDate:   form.startDate,
        endDate:     form.endDate,
        usd200:      form.usd200,
        usd300:      form.usd300,
        inr200:      form.inr200,
        inr300:      form.inr300,
        totalSeats:  Number(form.totalSeats),
        bookedSeats: Number(form.bookedSeats),
        note:        form.note,
      });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/online-yogacourse-seatbooking"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className={styles.formPage}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeletonField} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Batch Updated!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const remaining = Number(form.totalSeats) - Number(form.bookedSeats);
  const isFull = Number(form.bookedSeats) >= Number(form.totalSeats);

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link
          href="/admin/yogacourse/online-yogacourse-seatbooking"
          className={styles.breadcrumbLink}
        >
          Online Seats & Dates
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Batch</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Batch</h1>
        <p className={styles.pageSubtitle}>
          Update dates, 200 Hr & 300 Hr fees, seat availability and note for this batch
        </p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ── BATCH DATES ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Batch Dates</h3>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Start Date<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>Course start date</p>
              <div
                className={`${styles.inputWrap} ${
                  errors.startDate ? styles.inputError : ""
                } ${
                  form.startDate && !errors.startDate ? styles.inputSuccess : ""
                }`}
              >
                <input
                  type="date"
                  className={styles.input}
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </div>
              {errors.startDate && (
                <p className={styles.errorMsg}>⚠ {errors.startDate}</p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                End Date<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>Course end date</p>
              <div
                className={`${styles.inputWrap} ${
                  errors.endDate ? styles.inputError : ""
                } ${
                  form.endDate && !errors.endDate ? styles.inputSuccess : ""
                }`}
              >
                <input
                  type="date"
                  className={styles.input}
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={(e) => set("endDate", e.target.value)}
                />
              </div>
              {errors.endDate && (
                <p className={styles.errorMsg}>⚠ {errors.endDate}</p>
              )}
            </div>
          </div>

          {dateRangePreview && (
            <div className={styles.datePreview}>
              <span className={styles.datePreviewIcon}>📅</span>
              <span className={styles.datePreviewText}>{dateRangePreview}</span>
              <span className={styles.datePreviewNote}>
                — It will be displayed like this on the frontend
              </span>
            </div>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── 200 HR FEES ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>200 Hour Course Fees</h3>
          </div>
          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Fee (USD)<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 399</p>
              <div
                className={`${styles.inputWrapPrefix} ${
                  errors.usd200 ? styles.inputError : ""
                } ${form.usd200 && !errors.usd200 ? styles.inputSuccess : ""}`}
              >
                <span className={styles.prefix}>$</span>
                <input
                  type="number"
                  className={styles.inputPrefixed}
                  placeholder="399"
                  value={form.usd200}
                  onChange={(e) => set("usd200", e.target.value)}
                />
              </div>
              {errors.usd200 && (
                <p className={styles.errorMsg}>⚠ {errors.usd200}</p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Fee (INR)<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 20000</p>
              <div
                className={`${styles.inputWrapPrefix} ${
                  errors.inr200 ? styles.inputError : ""
                } ${form.inr200 && !errors.inr200 ? styles.inputSuccess : ""}`}
              >
                <span className={styles.prefix}>₹</span>
                <input
                  type="number"
                  className={styles.inputPrefixed}
                  placeholder="20000"
                  value={form.inr200}
                  onChange={(e) => set("inr200", e.target.value)}
                />
              </div>
              {errors.inr200 && (
                <p className={styles.errorMsg}>⚠ {errors.inr200}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── 300 HR FEES ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>300 Hour Course Fees</h3>
          </div>
          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Fee (USD)<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 499</p>
              <div
                className={`${styles.inputWrapPrefix} ${
                  errors.usd300 ? styles.inputError : ""
                } ${form.usd300 && !errors.usd300 ? styles.inputSuccess : ""}`}
              >
                <span className={styles.prefix}>$</span>
                <input
                  type="number"
                  className={styles.inputPrefixed}
                  placeholder="499"
                  value={form.usd300}
                  onChange={(e) => set("usd300", e.target.value)}
                />
              </div>
              {errors.usd300 && (
                <p className={styles.errorMsg}>⚠ {errors.usd300}</p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Fee (INR)<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 25000</p>
              <div
                className={`${styles.inputWrapPrefix} ${
                  errors.inr300 ? styles.inputError : ""
                } ${form.inr300 && !errors.inr300 ? styles.inputSuccess : ""}`}
              >
                <span className={styles.prefix}>₹</span>
                <input
                  type="number"
                  className={styles.inputPrefixed}
                  placeholder="25000"
                  value={form.inr300}
                  onChange={(e) => set("inr300", e.target.value)}
                />
              </div>
              {errors.inr300 && (
                <p className={styles.errorMsg}>⚠ {errors.inr300}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── SEAT MANAGEMENT ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Seat Management</h3>
          </div>

          <div className={styles.seatInfoBanner}>
            <span className={styles.seatInfoIcon}>ℹ</span>
            <p className={styles.seatInfoText}>
              <strong>Total Seats</strong> — maximum capacity.{" "}
              <strong>Booked Seats</strong> — auto-increments on each
              registration. It is shown here for reference only.
            </p>
          </div>

          <div className={styles.twoCol}>
            {/* Total Seats */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Total Seats<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>Maximum capacity for this batch</p>
              <div
                className={`${styles.inputWrap} ${
                  errors.totalSeats ? styles.inputError : ""
                } ${
                  form.totalSeats && !errors.totalSeats
                    ? styles.inputSuccess
                    : ""
                }`}
              >
                <input
                  type="number"
                  className={styles.input}
                  min="1"
                  max="100"
                  placeholder="7"
                  value={form.totalSeats}
                  onChange={(e) => set("totalSeats", e.target.value)}
                />
              </div>
              {errors.totalSeats && (
                <p className={styles.errorMsg}>⚠ {errors.totalSeats}</p>
              )}
            </div>

            {/* Booked Seats — read-only, auto-managed */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Booked Seats
              </label>
              <p className={styles.fieldHint}>
                Auto-managed (based on registrations)
              </p>
              <div className={`${styles.inputWrap} ${styles.inputDisabled}`}>
                <input
                  type="number"
                  className={styles.input}
                  value={form.bookedSeats}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Live preview */}
          {form.totalSeats && form.bookedSeats && (
            <div className={styles.seatsPreview}>
              <span className={styles.seatsPreviewLabel}>Preview:</span>
              {isFull ? (
                <span className={styles.badgeFull}>Fully Booked</span>
              ) : (
                <span className={styles.badgeOpen}>
                  {remaining} / {form.totalSeats} Seats Available
                </span>
              )}
            </div>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── NOTE ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Batch Note</h3>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Note
            </label>
            <p className={styles.fieldHint}>
              Shown below the batch card on frontend (e.g. advance payment info, special offer)
            </p>
            <div className={styles.noteInputWrap}>
              <span className={styles.noteIcon}>📝</span>
              <textarea
                className={styles.noteTextarea}
                rows={3}
                maxLength={400}
                placeholder="e.g. An advance payment of USD 200 is required to confirm your seat."
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
              />
              <span className={styles.noteCharCount}>
                {form.note.length}/400
              </span>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* Actions */}
        <div className={styles.formActions}>
          <Link
            href="/admin/yogacourse/online-yogacourse-seatbooking"
            className={styles.cancelBtn}
          >
            ← Cancel
          </Link>
          <button
            type="button"
            className={`${styles.submitBtn} ${
              isSubmitting ? styles.submitBtnLoading : ""
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} /> Updating…
              </>
            ) : (
              <>
                <span>✦</span> Update Batch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
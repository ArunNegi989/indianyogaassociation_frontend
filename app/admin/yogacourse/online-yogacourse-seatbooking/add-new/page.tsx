// FILE: src/app/admin/dashboard/online-seats/add-new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/100hourscourse/Seatsmodule.module.css";

interface FormData {
  startDate: string;
  endDate: string;
  usd200: string;
  usd300: string;
  inr200: string;
  inr300: string;
  totalSeats: string;
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
}

const EMPTY: FormData = {
  startDate: "",
  endDate: "",
  usd200: "",
  usd300: "",
  inr200: "",
  inr300: "",
  totalSeats: "7",
  note: "",
};

export default function OnlineSeatsAddPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await api.post("/online-seats/create-batch", {
        startDate: form.startDate,
        endDate: form.endDate,
        usd200: form.usd200,
        usd300: form.usd300,
        inr200: form.inr200,
        inr300: form.inr300,
        totalSeats: Number(form.totalSeats),
        bookedSeats: 0,
        note: form.note,
      });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/online-yogacourse-seatbooking"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Batch Added!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

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
        <span className={styles.breadcrumbCurrent}>Add Batch</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add New Batch</h1>
        <p className={styles.pageSubtitle}>
          Fill in all batch details — dates, 200 Hr & 300 Hr fees, and seat count
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
                — It will appear like this on the frontend.
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
              Only set the <strong>Total Seats</strong>. Booked seats will start
              from <strong>0</strong> and will automatically increase whenever a
              student submits the registration form.
            </p>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Total Seats<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Maximum capacity for this batch (Online batches typically 5–7)
            </p>
            <div
              className={`${styles.inputWrap} ${styles.inputWrapNarrow} ${
                errors.totalSeats ? styles.inputError : ""
              } ${
                form.totalSeats && !errors.totalSeats ? styles.inputSuccess : ""
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

          {form.totalSeats &&
            !isNaN(Number(form.totalSeats)) &&
            Number(form.totalSeats) > 0 && (
              <div className={styles.seatsPreview}>
                <span className={styles.seatsPreviewLabel}>Preview:</span>
                <span className={styles.badgeOpen}>
                  {form.totalSeats} / {form.totalSeats} Seats Available
                </span>
                <span className={styles.seatsPreviewNote}>
                  (It will automatically decrease as registrations come in)
                </span>
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
              Shown below the batch card on frontend (e.g. special offer, advance payment info)
            </p>
            <div className={styles.noteInputWrap}>
              <span className={styles.noteIcon}>📝</span>
              <textarea
                className={styles.noteTextarea}
                rows={3}
                maxLength={400}
                placeholder="e.g. An advance payment of USD 200 is required to confirm your seat. Remaining fee payable within first two weeks."
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
                <span className={styles.spinner} /> Saving…
              </>
            ) : (
              <>
                <span>✦</span> Add Batch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/200hr-seatsbatch.module.css";

interface FormData {
  startDate: string;
  endDate: string;
  usdFee: string;
  inrFee: string;
  dormPrice: string;
  twinPrice: string;
  privatePrice: string;
  totalSeats: string;
  bookedSeats: string;
  note: string;
}

interface FormErrors {
  startDate?: string;
  endDate?: string;
  usdFee?: string;
  inrFee?: string;
  dormPrice?: string;
  twinPrice?: string;
  privatePrice?: string;
  totalSeats?: string;
  bookedSeats?: string;
}

export default function Goa300hrSeatsEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>({
    startDate: "", endDate: "",
    usdFee: "", inrFee: "",
    dormPrice: "", twinPrice: "", privatePrice: "",
    totalSeats: "50", bookedSeats: "0", note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/goa-300hr-seats/getBatch/${id}`);
        const d = res.data.data;
        const toDateInput = (val: string | Date | undefined) => {
          if (!val) return "";
          const dt = new Date(val);
          if (isNaN(dt.getTime())) return "";
          return dt.toISOString().split("T")[0];
        };
        setForm({
          startDate:    toDateInput(d.startDate),
          endDate:      toDateInput(d.endDate),
          usdFee:       d.usdFee       ?? "",
          inrFee:       d.inrFee       ?? "",
          dormPrice:    String(d.dormPrice    ?? ""),
          twinPrice:    String(d.twinPrice    ?? ""),
          privatePrice: String(d.privatePrice ?? ""),
          totalSeats:   String(d.totalSeats   ?? 50),
          bookedSeats:  String(d.bookedSeats  ?? 0),
          note:         d.note ?? "",
        });
      } catch {
        toast.error("Failed to fetch batch");
        router.replace("/admin/yogacourse/yoga-goa-in-india/yoga-goa-300hr-seats");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const set = (key: keyof FormData, val: string) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined } as FormErrors));
  };

  const formatDate = (d: string) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const dateRangePreview =
    form.startDate && form.endDate
      ? `${formatDate(form.startDate)} – ${formatDate(form.endDate)}`
      : null;

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate)   e.endDate   = "End date is required";
    if (form.startDate && form.endDate && form.endDate <= form.startDate)
      e.endDate = "End date must be after start date";
    if (!form.usdFee.trim())        e.usdFee       = "USD fee is required";
    if (!form.inrFee.trim())        e.inrFee       = "INR fee is required";
    if (!form.dormPrice.trim())     e.dormPrice    = "Dorm price is required";
    if (!form.twinPrice.trim())     e.twinPrice    = "Twin price is required";
    if (!form.privatePrice.trim())  e.privatePrice = "Private price is required";
    if (!form.totalSeats.trim() || isNaN(Number(form.totalSeats)) || Number(form.totalSeats) < 1)
      e.totalSeats = "Valid total seats required (min 1)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await api.put(`/goa-300hr-seats/updateBatch/${id}`, {
        startDate:    form.startDate,
        endDate:      form.endDate,
        usdFee:       form.usdFee,
        inrFee:       form.inrFee,
        dormPrice:    Number(form.dormPrice),
        twinPrice:    Number(form.twinPrice),
        privatePrice: Number(form.privatePrice),
        totalSeats:   Number(form.totalSeats),
        bookedSeats:  Number(form.bookedSeats),
        note:         form.note,
      });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/yoga-goa-in-india/yoga-goa-300hr-seats"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.formPage}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonField} />)}
        </div>
      </div>
    );
  }

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
      <div className={styles.breadcrumb}>
        <Link href="/admin/yogacourse/yoga-goa-in-india/yoga-goa-300hr-seats" className={styles.breadcrumbLink}>
          GOA 300hr — Seats & Dates
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Batch</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Batch — 300 Hour GOA</h1>
        <p className={styles.pageSubtitle}>Update date, fees, seat availability and note for this batch</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* BATCH DATES */}
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
              <div className={`${styles.inputWrap} ${errors.startDate ? styles.inputError : ""} ${form.startDate && !errors.startDate ? styles.inputSuccess : ""}`}>
                <input type="date" className={styles.input}
                  value={form.startDate} onChange={e => set("startDate", e.target.value)} />
              </div>
              {errors.startDate && <p className={styles.errorMsg}>⚠ {errors.startDate}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                End Date<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>Course end date</p>
              <div className={`${styles.inputWrap} ${errors.endDate ? styles.inputError : ""} ${form.endDate && !errors.endDate ? styles.inputSuccess : ""}`}>
                <input type="date" className={styles.input}
                  value={form.endDate} min={form.startDate || undefined}
                  onChange={e => set("endDate", e.target.value)} />
              </div>
              {errors.endDate && <p className={styles.errorMsg}>⚠ {errors.endDate}</p>}
            </div>
          </div>
          {dateRangePreview && (
            <div className={styles.datePreview}>
              <span className={styles.datePreviewIcon}>📅</span>
              <span className={styles.datePreviewText}>{dateRangePreview}</span>
              <span className={styles.datePreviewNote}>— Frontend pe aisa dikhega</span>
            </div>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* COURSE FEES */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Course Fees</h3>
          </div>
          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Fee (USD)<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 950 USD</p>
              <div className={`${styles.inputWrap} ${errors.usdFee ? styles.inputError : ""} ${form.usdFee && !errors.usdFee ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input} placeholder="950 USD"
                  value={form.usdFee} maxLength={30} onChange={e => set("usdFee", e.target.value)} />
              </div>
              {errors.usdFee && <p className={styles.errorMsg}>⚠ {errors.usdFee}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Fee (INR)<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 38,000 INR</p>
              <div className={`${styles.inputWrap} ${errors.inrFee ? styles.inputError : ""} ${form.inrFee && !errors.inrFee ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input} placeholder="38,000 INR"
                  value={form.inrFee} maxLength={30} onChange={e => set("inrFee", e.target.value)} />
              </div>
              {errors.inrFee && <p className={styles.errorMsg}>⚠ {errors.inrFee}</p>}
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ROOM PRICES */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Room Prices (USD)</h3>
          </div>
          <div className={styles.threeCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Dormitory<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 949</p>
              <div className={`${styles.inputWrapPrefix} ${errors.dormPrice ? styles.inputError : ""} ${form.dormPrice && !errors.dormPrice ? styles.inputSuccess : ""}`}>
                <span className={styles.prefix}>$</span>
                <input type="number" className={styles.inputPrefixed} placeholder="949"
                  value={form.dormPrice} onChange={e => set("dormPrice", e.target.value)} />
              </div>
              {errors.dormPrice && <p className={styles.errorMsg}>⚠ {errors.dormPrice}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Twin Sharing<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 1049</p>
              <div className={`${styles.inputWrapPrefix} ${errors.twinPrice ? styles.inputError : ""} ${form.twinPrice && !errors.twinPrice ? styles.inputSuccess : ""}`}>
                <span className={styles.prefix}>$</span>
                <input type="number" className={styles.inputPrefixed} placeholder="1049"
                  value={form.twinPrice} onChange={e => set("twinPrice", e.target.value)} />
              </div>
              {errors.twinPrice && <p className={styles.errorMsg}>⚠ {errors.twinPrice}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Private Room<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>e.g. 1249</p>
              <div className={`${styles.inputWrapPrefix} ${errors.privatePrice ? styles.inputError : ""} ${form.privatePrice && !errors.privatePrice ? styles.inputSuccess : ""}`}>
                <span className={styles.prefix}>$</span>
                <input type="number" className={styles.inputPrefixed} placeholder="1249"
                  value={form.privatePrice} onChange={e => set("privatePrice", e.target.value)} />
              </div>
              {errors.privatePrice && <p className={styles.errorMsg}>⚠ {errors.privatePrice}</p>}
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* SEAT MANAGEMENT */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Seat Management</h3>
          </div>
          <div className={styles.seatInfoBanner}>
            <span className={styles.seatInfoIcon}>ℹ</span>
            <p className={styles.seatInfoText}>
              <strong>Total Seats</strong> — maximum capacity.{" "}
              <strong>Booked Seats</strong> — auto-increments on each registration. You can manually correct if needed.
            </p>
          </div>
          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Total Seats<span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>Maximum capacity for this batch</p>
              <div className={`${styles.inputWrap} ${errors.totalSeats ? styles.inputError : ""} ${form.totalSeats && !errors.totalSeats ? styles.inputSuccess : ""}`}>
                <input type="number" className={styles.input} min="1" max="500"
                  placeholder="50" value={form.totalSeats}
                  onChange={e => set("totalSeats", e.target.value)} />
              </div>
              {errors.totalSeats && <p className={styles.errorMsg}>⚠ {errors.totalSeats}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Booked Seats
              </label>
              <p className={styles.fieldHint}>Auto-managed (based on registrations)</p>
              <div className={`${styles.inputWrap} ${styles.inputDisabled}`}>
                <input type="number" className={styles.input} value={form.bookedSeats} disabled />
              </div>
            </div>
          </div>
          {form.totalSeats && form.bookedSeats && (
            <div className={styles.seatsPreview}>
              <span className={styles.seatsPreviewLabel}>Preview:</span>
              {isFull
                ? <span className={styles.badgeFull}>Fully Booked</span>
                : <span className={styles.badgeOpen}>{remaining} / {form.totalSeats} Seats Available</span>
              }
            </div>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* NOTE */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Table Note</h3>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Note
            </label>
            <p className={styles.fieldHint}>Shown below the dates table on the frontend</p>
            <div className={styles.noteInputWrap}>
              <span className={styles.noteIcon}>📝</span>
              <textarea className={styles.noteTextarea} rows={3} maxLength={400}
                placeholder="e.g. A $50 USD early bird discount is available..."
                value={form.note} onChange={e => set("note", e.target.value)} />
              <span className={styles.noteCharCount}>{form.note.length}/400</span>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/yogacourse/yoga-goa-in-india/yoga-goa-300hr-seats" className={styles.cancelBtn}>
            ← Cancel
          </Link>
          <button
            type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <><span className={styles.spinner} /> Updating…</>
              : <><span>✦</span> Update Batch</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}

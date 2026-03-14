"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/ourmission/Ourmission.module.css";
// import api from "@/lib/api";

/* ── Types ── */
interface FormData {
  blockType: "mission" | "why" | "";
  heading: string;
  seoTagline: string;       // mission block only
  paraOne: string;
  paraTwo: string;
  paraThree: string;        // optional 3rd para
  leadBold: string;         // why block only — bold opening phrase
}

interface FormErrors {
  blockType?: string;
  heading?: string;
  paraOne?: string;
  paraTwo?: string;
}

export default function AddOurMissionPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    blockType: "",
    heading: "",
    seoTagline: "",
    paraOne: "",
    paraTwo: "",
    paraThree: "",
    leadBold: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.blockType) e.blockType = "Block type is required";
    if (!form.heading.trim()) e.heading = "Heading is required";
    if (!form.paraOne.trim()) e.paraOne = "Paragraph 1 is required";
    if (!form.paraTwo.trim()) e.paraTwo = "Paragraph 2 is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        blockType: form.blockType,
        heading: form.heading,
        ...(form.blockType === "mission" && { seoTagline: form.seoTagline }),
        ...(form.blockType === "why" && { leadBold: form.leadBold }),
        paragraphs: [form.paraOne, form.paraTwo, form.paraThree].filter(Boolean),
      };
      // await api.post("/our-mission/create", payload);
      console.log("Payload:", payload);
      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/ourmission"), 1500);
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to save");
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
          <h2 className={styles.successTitle}>Block Saved!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const isMission = form.blockType === "mission";
  const isWhy = form.blockType === "why";

  return (
    <div className={styles.formPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/ourmission" className={styles.breadcrumbLink}>Our Mission</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Block</span>
      </div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Add Mission Block</h1>
          <p className={styles.pageSubtitle}>Create a new content block for the Our Mission section</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ── Block Type ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Block Type</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Select Block Type<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Choose which part of the Our Mission page this block belongs to</p>
            <div
              className={`${styles.inputWrap} ${errors.blockType ? styles.inputError : ""} ${form.blockType ? styles.inputSuccess : ""}`}
              style={{ position: "relative" }}
            >
              <select
                className={styles.input}
                value={form.blockType}
                onChange={(e) => set("blockType", e.target.value as FormData["blockType"])}
                style={{ cursor: "pointer", appearance: "none", paddingRight: "2.2rem" }}
              >
                <option value="">— Select block type —</option>
                <option value="mission">Mission Block (Our Mission heading + paragraphs)</option>
                <option value="why">Why YTTC Block (Why Yoga Teacher Training is for Everyone?)</option>
              </select>
              <span style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#a07840", fontSize: "0.75rem" }}>▾</span>
            </div>
            {errors.blockType && <p className={styles.errorMsg}>⚠ {errors.blockType}</p>}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── Heading & Meta ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Heading & Identity</h3>
          </div>

          {/* Heading */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Section Heading<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              {isMission ? 'Displayed as H2 — e.g. "Our Mission"'
                : isWhy ? 'Displayed as H3 — e.g. "Why Yoga Teacher Training is for Everyone?"'
                : 'Select a block type first'}
            </p>
            <div className={`${styles.inputWrap} ${errors.heading ? styles.inputError : ""} ${form.heading && !errors.heading ? styles.inputSuccess : ""}`}>
              <input
                type="text"
                className={styles.input}
                placeholder={
                  isMission ? "e.g. Our Mission"
                    : isWhy ? "e.g. Why Yoga Teacher Training is for Everyone?"
                    : "Select block type first…"
                }
                value={form.heading}
                maxLength={150}
                disabled={!form.blockType}
                onChange={(e) => set("heading", e.target.value)}
              />
              <span className={styles.charCount}>{form.heading.length}/150</span>
            </div>
            {errors.heading && <p className={styles.errorMsg}>⚠ {errors.heading}</p>}
          </div>

          {/* SEO Tagline — mission only */}
          {isMission && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                SEO Tagline
              </label>
              <p className={styles.fieldHint}>Small italic subtitle shown below the heading — used for SEO (e.g. Yoga Teacher Training in Rishikesh India)</p>
              <div className={`${styles.inputWrap} ${form.seoTagline ? styles.inputSuccess : ""}`}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Yoga Teacher Training in Rishikesh India"
                  value={form.seoTagline}
                  maxLength={120}
                  onChange={(e) => set("seoTagline", e.target.value)}
                />
                <span className={styles.charCount}>{form.seoTagline.length}/120</span>
              </div>
            </div>
          )}

          {/* Lead Bold — why only */}
          {isWhy && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Lead Bold Phrase
              </label>
              <p className={styles.fieldHint}>Bolded opening phrase inside the first paragraph (e.g. "What does the Journey Entail?")</p>
              <div className={`${styles.inputWrap} ${form.leadBold ? styles.inputSuccess : ""}`}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. What does the Journey Entail?"
                  value={form.leadBold}
                  maxLength={100}
                  onChange={(e) => set("leadBold", e.target.value)}
                />
                <span className={styles.charCount}>{form.leadBold.length}/100</span>
              </div>
              {form.leadBold && (
                <span className={styles.leadBoldPreview}>{form.leadBold}</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── Paragraphs ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Body Paragraphs</h3>
            <span className={styles.sectionBadge}>
              {[form.paraOne, form.paraTwo, form.paraThree].filter(Boolean).length} / 3
            </span>
          </div>

          {/* Para 1 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Paragraph 1<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              {isMission
                ? "About yoga as a way of life, and AYM's mission"
                : isWhy
                ? "Main body paragraph — begins with the Lead Bold phrase if set"
                : "Main body paragraph"}
            </p>
            <div className={`${styles.inputWrap} ${errors.paraOne ? styles.inputError : ""} ${form.paraOne && !errors.paraOne ? styles.inputSuccess : ""}`}>
              <textarea
                className={`${styles.input} ${styles.textarea} ${styles.textareaTall}`}
                placeholder={
                  isMission
                    ? "e.g. The practice of yoga extends far beyond the exercises; it's a mindful way of life…"
                    : isWhy
                    ? "e.g. Whether you are a student looking for clarity, a homemaker seeking balance…"
                    : "Enter paragraph content…"
                }
                value={form.paraOne}
                maxLength={2000}
                rows={5}
                disabled={!form.blockType}
                onChange={(e) => set("paraOne", e.target.value)}
              />
              <span className={styles.charCount}>{form.paraOne.length}/2000</span>
            </div>
            {errors.paraOne && <p className={styles.errorMsg}>⚠ {errors.paraOne}</p>}
          </div>

          {/* Para 2 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Paragraph 2<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              {isMission
                ? "Closing motivational line about Rishikesh"
                : isWhy
                ? "Second paragraph — philosophical / deeper reflection"
                : "Second body paragraph"}
            </p>
            <div className={`${styles.inputWrap} ${errors.paraTwo ? styles.inputError : ""} ${form.paraTwo && !errors.paraTwo ? styles.inputSuccess : ""}`}>
              <textarea
                className={`${styles.input} ${styles.textarea} ${styles.textareaTall}`}
                placeholder={
                  isMission
                    ? "e.g. Enhance your yoga journey paired with the spiritual vibe of Rishikesh…"
                    : isWhy
                    ? "e.g. It's Not About Poses — It's About Presence. In every Yoga journey…"
                    : "Enter second paragraph…"
                }
                value={form.paraTwo}
                maxLength={2000}
                rows={5}
                disabled={!form.blockType}
                onChange={(e) => set("paraTwo", e.target.value)}
              />
              <span className={styles.charCount}>{form.paraTwo.length}/2000</span>
            </div>
            {errors.paraTwo && <p className={styles.errorMsg}>⚠ {errors.paraTwo}</p>}
          </div>

          {/* Para 3 — optional */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Paragraph 3 <span style={{ fontSize: "0.7rem", color: "#a07840", fontFamily: "'Cormorant Garamond', serif", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <p className={styles.fieldHint}>Additional paragraph if needed — leave blank to skip</p>
            <div className={`${styles.inputWrap} ${form.paraThree ? styles.inputSuccess : ""}`}>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Optional third paragraph…"
                value={form.paraThree}
                maxLength={2000}
                rows={4}
                disabled={!form.blockType}
                onChange={(e) => set("paraThree", e.target.value)}
              />
              <span className={styles.charCount}>{form.paraThree.length}/2000</span>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/dashboard/ourmission" className={styles.cancelBtn}>← Cancel</Link>
          <button
            type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <><span className={styles.spinner} /> Saving…</>
              : <><span>✦</span> Save Block</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}
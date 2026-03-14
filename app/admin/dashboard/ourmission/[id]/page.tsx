"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/ourmission/Ourmission.module.css";
// import api from "@/lib/api";

/* ── Types ── */
interface FormData {
  blockType: "mission" | "why" | "";
  heading: string;
  seoTagline: string;
  paraOne: string;
  paraTwo: string;
  paraThree: string;
  leadBold: string;
}

interface FormErrors {
  blockType?: string;
  heading?: string;
  paraOne?: string;
  paraTwo?: string;
}

/* ── Mock fetch by id ── */
const MOCK_DATA: Record<string, Partial<FormData>> = {
  "1": {
    blockType: "mission",
    heading: "Our Mission",
    seoTagline: "Yoga Teacher Training in Rishikesh India",
    paraOne: "The practice of yoga extends far beyond the exercises; it's a mindful way of life. As yoga practitioners and advocates, we want to teach this to everyone and help them attain self-fulfilment. With our comprehensive yoga teacher training courses, we aim to introduce every budding yogi to the inner well-being attained through Yoga. We help students become certified yoga teachers in India.",
    paraTwo: "Enhance your yoga journey paired with the spiritual vibe of Rishikesh, and watch the magic unwind yourself.",
    paraThree: "",
    leadBold: "",
  },
  "2": {
    blockType: "why",
    heading: "Why Yoga Teacher Training is for Everyone?",
    seoTagline: "",
    leadBold: "What does the Journey Entail?",
    paraOne: "Whether you are a student looking for clarity, a homemaker seeking balance or a professional longing to destress, YTTC is a way forward to return home — to you, yourself, where you truly belong. It is not mandatory that you become a teacher, but it surely prepares you to be a better human being, enabling you to handle your life well wherever you are placed.",
    paraTwo: "It's Not About Poses — It's About Presence. In every Yoga journey, there comes a moment when the focus shifts from the external to internal, from the body to the mind, from perfecting a pose to perfecting presence — the complete alignment of body, breath and mind.",
    paraThree: "",
  },
};

export default function EditOurMissionPage() {
  const router = useRouter();
  const params = useParams();
  const blockId = params?.id as string;

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── Fetch ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const res = await api.get(`/our-mission/${blockId}`);
        // const data = res.data.data;
        const data = MOCK_DATA[blockId] ?? {};
        setForm({
          blockType: data.blockType ?? "",
          heading: data.heading ?? "",
          seoTagline: data.seoTagline ?? "",
          paraOne: data.paraOne ?? "",
          paraTwo: data.paraTwo ?? "",
          paraThree: data.paraThree ?? "",
          leadBold: data.leadBold ?? "",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (blockId) fetchData();
  }, [blockId]);

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
      // await api.put(`/our-mission/${blockId}`, payload);
      console.log("Update payload:", payload);
      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/ourmission"), 1500);
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <p className={styles.successText}>Loading block…</p>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Block Updated!</h2>
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
        <span className={styles.breadcrumbCurrent}>Edit Block</span>
      </div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Edit Mission Block</h1>
          <p className={styles.pageSubtitle}>Update content for this Our Mission section block</p>
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
              Block Type<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Changing block type will preserve content but hide type-specific fields</p>
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
                : 'Heading text for the block'}
            </p>
            <div className={`${styles.inputWrap} ${errors.heading ? styles.inputError : ""} ${form.heading && !errors.heading ? styles.inputSuccess : ""}`}>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Our Mission"
                value={form.heading}
                maxLength={150}
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
              <p className={styles.fieldHint}>Small italic subtitle below heading — used for SEO</p>
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
              <p className={styles.fieldHint}>Bolded opening phrase inside the first paragraph</p>
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
              {isMission ? "About yoga as a way of life and AYM's mission"
                : isWhy ? "Main body — begins with Lead Bold phrase if set"
                : "First body paragraph"}
            </p>
            <div className={`${styles.inputWrap} ${errors.paraOne ? styles.inputError : ""} ${form.paraOne && !errors.paraOne ? styles.inputSuccess : ""}`}>
              <textarea
                className={`${styles.input} ${styles.textarea} ${styles.textareaTall}`}
                value={form.paraOne}
                maxLength={2000}
                rows={5}
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
              {isMission ? "Closing motivational line about Rishikesh"
                : isWhy ? "Philosophical / deeper reflection paragraph"
                : "Second body paragraph"}
            </p>
            <div className={`${styles.inputWrap} ${errors.paraTwo ? styles.inputError : ""} ${form.paraTwo && !errors.paraTwo ? styles.inputSuccess : ""}`}>
              <textarea
                className={`${styles.input} ${styles.textarea} ${styles.textareaTall}`}
                value={form.paraTwo}
                maxLength={2000}
                rows={5}
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
              Paragraph 3
              <span style={{ fontSize: "0.7rem", color: "#a07840", fontFamily: "'Cormorant Garamond', serif", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <p className={styles.fieldHint}>Additional paragraph — leave blank to skip</p>
            <div className={`${styles.inputWrap} ${form.paraThree ? styles.inputSuccess : ""}`}>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                value={form.paraThree}
                maxLength={2000}
                rows={4}
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
              ? <><span className={styles.spinner} /> Updating…</>
              : <><span>✦</span> Update Block</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}
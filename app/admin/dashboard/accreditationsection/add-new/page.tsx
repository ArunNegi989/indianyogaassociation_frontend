"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/accreditationsection/Accreditationsection.module.css";
// import api from "@/lib/api";

/* ─────────────────────── Types ─────────────────────── */
interface CertItem {
  label: string;
  tag: string;
  alt: string;
  imagePreview: string;
}

interface BadgeItem {
  icon: string;
  text: string;
}

interface FormData {
  // Auth Section
  sectionTitle: string;
  authPara1: string;
  authPara2: string;
  authPara3: string;
  authPara4: string;
  imageCaption: string;
  pullQuote: string;
  // Video + Immerse
  videoSrc: string;
  immerseTitle: string;
  immersePara1: string;
  immersePara2: string;
  immerseCtaText: string;
  immerseCtaLink: string;
  // Recognition
  recognitionTitle: string;
  recognitionPara1: string;
  recognitionPara2: string;
  // Certs & Badges
  certs: CertItem[];
  badges: BadgeItem[];
}

interface FormErrors {
  sectionTitle?: string;
  authPara1?: string; authPara2?: string; authPara3?: string; authPara4?: string;
  pullQuote?: string;
  videoSrc?: string;
  immerseTitle?: string; immersePara1?: string; immersePara2?: string;
  immerseCtaText?: string; immerseCtaLink?: string;
  recognitionTitle?: string; recognitionPara1?: string; recognitionPara2?: string;
  certs?: string; badges?: string;
}

const EMPTY_CERT: CertItem = { label: "", tag: "", alt: "", imagePreview: "" };
const EMPTY_BADGE: BadgeItem = { icon: "", text: "" };

const INITIAL: FormData = {
  sectionTitle: "",
  authPara1: "", authPara2: "", authPara3: "", authPara4: "",
  imageCaption: "", pullQuote: "",
  videoSrc: "",
  immerseTitle: "", immersePara1: "", immersePara2: "",
  immerseCtaText: "", immerseCtaLink: "",
  recognitionTitle: "",
  recognitionPara1: "", recognitionPara2: "",
  certs: [{ ...EMPTY_CERT }],
  badges: [{ ...EMPTY_BADGE }],
};

/* ─────────────────────── Main ─────────────────────── */
export default function AddAccreditationSectionPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"auth" | "video" | "recognition" | "certs">("auth");

  const set = (key: keyof FormData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  /* cert helpers */
  const updateCert = (i: number, field: keyof CertItem, val: string) =>
    setForm((p) => { const c = [...p.certs]; c[i] = { ...c[i], [field]: val }; return { ...p, certs: c }; });

  const handleCertImage = (i: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      setForm((p) => { const c = [...p.certs]; c[i] = { ...c[i], imagePreview: e.target?.result as string }; return { ...p, certs: c }; });
    reader.readAsDataURL(file);
  };

  const addCert = () => { if (form.certs.length < 6) setForm((p) => ({ ...p, certs: [...p.certs, { ...EMPTY_CERT }] })); };
  const removeCert = (i: number) => setForm((p) => ({ ...p, certs: p.certs.filter((_, idx) => idx !== i) }));

  /* badge helpers */
  const updateBadge = (i: number, field: keyof BadgeItem, val: string) =>
    setForm((p) => { const b = [...p.badges]; b[i] = { ...b[i], [field]: val }; return { ...p, badges: b }; });

  const addBadge = () => { if (form.badges.length < 6) setForm((p) => ({ ...p, badges: [...p.badges, { ...EMPTY_BADGE }] })); };
  const removeBadge = (i: number) => setForm((p) => ({ ...p, badges: p.badges.filter((_, idx) => idx !== i) }));

  /* validation */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.sectionTitle.trim())     e.sectionTitle     = "Section title is required";
    if (!form.authPara1.trim())        e.authPara1        = "Paragraph 1 is required";
    if (!form.authPara2.trim())        e.authPara2        = "Paragraph 2 is required";
    if (!form.authPara3.trim())        e.authPara3        = "Paragraph 3 is required";
    if (!form.authPara4.trim())        e.authPara4        = "Paragraph 4 is required";
    if (!form.pullQuote.trim())        e.pullQuote        = "Pull quote is required";
    if (!form.videoSrc.trim())         e.videoSrc         = "Video URL is required";
    else if (!/^https?:\/\/.+/.test(form.videoSrc.trim())) e.videoSrc = "Enter a valid URL";
    if (!form.immerseTitle.trim())     e.immerseTitle     = "Immerse title is required";
    if (!form.immersePara1.trim())     e.immersePara1     = "Paragraph 1 is required";
    if (!form.immerseCtaText.trim())   e.immerseCtaText   = "CTA text is required";
    if (!form.immerseCtaLink.trim())   e.immerseCtaLink   = "CTA link is required";
    else if (!/^(https?:\/\/.+\..+|\/[^\s]*)$/.test(form.immerseCtaLink.trim())) e.immerseCtaLink = "Enter a valid URL or path";
    if (!form.recognitionTitle.trim()) e.recognitionTitle = "Recognition title is required";
    if (!form.recognitionPara1.trim()) e.recognitionPara1 = "Paragraph 1 is required";
    if (form.certs.some((c) => !c.label.trim() || !c.tag.trim())) e.certs = "All certificate label & tag fields must be filled";
    if (form.badges.some((b) => !b.icon.trim() || !b.text.trim())) e.badges = "All badge fields must be filled";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    const valid = validate();
    if (!valid) {
      if (errors.sectionTitle || errors.authPara1 || errors.authPara2 || errors.authPara3 || errors.authPara4 || errors.pullQuote) setActiveTab("auth");
      else if (errors.videoSrc || errors.immerseTitle || errors.immersePara1 || errors.immerseCtaText || errors.immerseCtaLink) setActiveTab("video");
      else if (errors.recognitionTitle || errors.recognitionPara1) setActiveTab("recognition");
      else setActiveTab("certs");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = { ...form };
      // await api.post("/accreditation/create", payload);
      console.log("Payload:", payload);
      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/accreditation"), 1500);
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
          <h2 className={styles.successTitle}>Section Saved!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    auth: !!(errors.sectionTitle || errors.authPara1 || errors.authPara2 || errors.authPara3 || errors.authPara4 || errors.pullQuote),
    video: !!(errors.videoSrc || errors.immerseTitle || errors.immersePara1 || errors.immerseCtaText || errors.immerseCtaLink),
    recognition: !!(errors.recognitionTitle || errors.recognitionPara1),
    certs: !!(errors.certs || errors.badges),
  };

  return (
    <div className={styles.page}>

      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard/accreditation")}>Accreditation</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Section</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add Accreditation Section</h1>
        <p className={styles.pageSubtitle}>Fill in all the details to configure the Accreditation &amp; Recognition section</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Tab Nav */}
      <div className={styles.tabNav}>
        {(["auth", "video", "recognition", "certs"] as const).map((tab) => {
          const labels = { auth: "① Auth Section", video: "② Video & Immerse", recognition: "③ Recognition", certs: "④ Certs & Badges" };
          return (
            <button key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${tabErrors[tab] ? styles.tabBtnError : ""}`}
              onClick={() => setActiveTab(tab)}>
              {tabErrors[tab] && <span className={styles.tabDot} />}
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div className={styles.formCard}>

        {/* ══════════ TAB 1 — AUTH SECTION ══════════ */}
        {activeTab === "auth" && (
          <>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Section Header</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Section Title (H2)<span className={styles.required}>*</span></label>
                <p className={styles.fieldHint}>Main heading shown at the top of the auth section</p>
                <div className={`${styles.inputWrap} ${errors.sectionTitle ? styles.inputError : ""} ${form.sectionTitle && !errors.sectionTitle ? styles.inputSuccess : ""}`}>
                  <textarea className={`${styles.input} ${styles.textarea}`}
                    placeholder="e.g. Authentic, Internationally recognized Yoga Teacher Training Certification School in Rishikesh"
                    value={form.sectionTitle} maxLength={200} rows={2}
                    onChange={(e) => set("sectionTitle", e.target.value)} />
                  <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form.sectionTitle.length}/200</span>
                </div>
                {errors.sectionTitle && <p className={styles.errorMsg}>⚠ {errors.sectionTitle}</p>}
              </div>
            </div>

            <div className={styles.formDivider} />

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Left Column — Body Paragraphs</h3>
              </div>

              {([
                { key: "authPara1" as const, label: "Paragraph 1", hint: "Accreditation overview — Yoga Alliance USA & YCB", ph: "Our Yoga Teacher Training in Rishikesh is accredited by Yoga Alliance USA…" },
                { key: "authPara2" as const, label: "Paragraph 2", hint: "Curriculum structure — beginner to advanced",        ph: "Our yoga school in Rishikesh offers a well-structured and updated curriculum…" },
                { key: "authPara3" as const, label: "Paragraph 3", hint: "Specialized programs (Kundalini, Prenatal, Hatha)",  ph: "Our training is deeply rooted in traditional yoga practices…" },
                { key: "authPara4" as const, label: "Paragraph 4", hint: "Online training & closing note",                    ph: "In addition to our immersive teacher training courses, we provide online…" },
              ]).map(({ key, label, hint, ph }) => (
                <div key={key} className={styles.fieldGroup}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}<span className={styles.required}>*</span></label>
                  <p className={styles.fieldHint}>{hint}</p>
                  <div className={`${styles.inputWrap} ${errors[key] ? styles.inputError : ""} ${form[key] && !errors[key] ? styles.inputSuccess : ""}`}>
                    <textarea className={`${styles.input} ${styles.textarea}`} placeholder={ph}
                      value={form[key]} maxLength={600} rows={3}
                      onChange={(e) => set(key, e.target.value)} />
                    <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form[key].length}/600</span>
                  </div>
                  {errors[key] && <p className={styles.errorMsg}>⚠ {errors[key]}</p>}
                </div>
              ))}
            </div>

            <div className={styles.formDivider} />

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Right Column — Image &amp; Quote</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Main Section Image</label>
                <p className={styles.fieldHint}>Upload curriculum/study materials image (recommended 420×300px)</p>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => setForm((p) => ({ ...p, _mainImagePreview: ev.target?.result } as any));
                    reader.readAsDataURL(file);
                  }} />
                  <span className={styles.uploadIcon}>📷</span>
                  <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                  <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Image Caption</label>
                <p className={styles.fieldHint}>Small caption displayed below the image</p>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input}
                    placeholder="e.g. AYM Study Materials & Curriculum"
                    value={form.imageCaption} maxLength={80}
                    onChange={(e) => set("imageCaption", e.target.value)} />
                  <span className={styles.charCount}>{form.imageCaption.length}/80</span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Pull Quote<span className={styles.required}>*</span></label>
                <p className={styles.fieldHint}>Short quote shown in the styled blockquote with " " marks</p>
                <div className={`${styles.inputWrap} ${errors.pullQuote ? styles.inputError : ""} ${form.pullQuote && !errors.pullQuote ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input}
                    placeholder='e.g. Learn, grow, and transform.'
                    value={form.pullQuote} maxLength={120}
                    onChange={(e) => set("pullQuote", e.target.value)} />
                  <span className={styles.charCount}>{form.pullQuote.length}/120</span>
                </div>
                {errors.pullQuote && <p className={styles.errorMsg}>⚠ {errors.pullQuote}</p>}
              </div>
            </div>
          </>
        )}

        {/* ══════════ TAB 2 — VIDEO & IMMERSE ══════════ */}
        {activeTab === "video" && (
          <>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Video Block</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Video URL<span className={styles.required}>*</span></label>
                <p className={styles.fieldHint}>YouTube link (youtu.be or youtube.com/watch) or direct MP4 URL</p>
                <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.videoSrc ? styles.inputError : ""} ${form.videoSrc && !errors.videoSrc ? styles.inputSuccess : ""}`}>
                  <span className={styles.inputPrefix}>🎬</span>
                  <input type="text" className={`${styles.input} ${styles.inputPrefixed}`}
                    placeholder="https://youtu.be/A-Zcjg1_y5U or https://…/video.mp4"
                    value={form.videoSrc}
                    onChange={(e) => set("videoSrc", e.target.value)} />
                </div>
                {errors.videoSrc && <p className={styles.errorMsg}>⚠ {errors.videoSrc}</p>}
                {form.videoSrc && !errors.videoSrc && (
                  <div className={styles.videoPreviewBadge}>
                    ✓ {form.videoSrc.includes("youtu") ? "YouTube link detected" : "Direct video URL detected"}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formDivider} />

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Immerse Block</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Immerse Title (H3)<span className={styles.required}>*</span></label>
                <p className={styles.fieldHint}>Heading displayed beside the video</p>
                <div className={`${styles.inputWrap} ${errors.immerseTitle ? styles.inputError : ""} ${form.immerseTitle && !errors.immerseTitle ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input}
                    placeholder="e.g. Immerse Yourself in Yoga in Rishikesh"
                    value={form.immerseTitle} maxLength={120}
                    onChange={(e) => set("immerseTitle", e.target.value)} />
                  <span className={styles.charCount}>{form.immerseTitle.length}/120</span>
                </div>
                {errors.immerseTitle && <p className={styles.errorMsg}>⚠ {errors.immerseTitle}</p>}
              </div>

              {([
                { key: "immersePara1" as const, label: "Paragraph 1", hint: "About Rishikesh — yoga capital setting", ph: "Rishikesh, the Yoga Capital of the World, invites you to embark…", req: true },
                { key: "immersePara2" as const, label: "Paragraph 2", hint: "Breathwork, asanas, meditation — optional closing note", ph: "From mastering breathwork and asanas to exploring meditation…", req: false },
              ]).map(({ key, label, hint, ph, req }) => (
                <div key={key} className={styles.fieldGroup}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}{req && <span className={styles.required}>*</span>}</label>
                  <p className={styles.fieldHint}>{hint}</p>
                  <div className={`${styles.inputWrap} ${errors[key] ? styles.inputError : ""} ${form[key] && !errors[key] ? styles.inputSuccess : ""}`}>
                    <textarea className={`${styles.input} ${styles.textarea}`} placeholder={ph}
                      value={form[key]} maxLength={500} rows={3}
                      onChange={(e) => set(key, e.target.value)} />
                    <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form[key].length}/500</span>
                  </div>
                  {errors[key as keyof FormErrors] && <p className={styles.errorMsg}>⚠ {errors[key as keyof FormErrors]}</p>}
                </div>
              ))}

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>CTA Button Text<span className={styles.required}>*</span></label>
                  <p className={styles.fieldHint}>Text on the Know More button</p>
                  <div className={`${styles.inputWrap} ${errors.immerseCtaText ? styles.inputError : ""} ${form.immerseCtaText && !errors.immerseCtaText ? styles.inputSuccess : ""}`}>
                    <input type="text" className={styles.input}
                      placeholder="e.g. Know More About AYM"
                      value={form.immerseCtaText} maxLength={60}
                      onChange={(e) => set("immerseCtaText", e.target.value)} />
                    <span className={styles.charCount}>{form.immerseCtaText.length}/60</span>
                  </div>
                  {errors.immerseCtaText && <p className={styles.errorMsg}>⚠ {errors.immerseCtaText}</p>}
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>CTA Button Link<span className={styles.required}>*</span></label>
                  <p className={styles.fieldHint}>URL or path</p>
                  <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.immerseCtaLink ? styles.inputError : ""} ${form.immerseCtaLink && !errors.immerseCtaLink ? styles.inputSuccess : ""}`}>
                    <span className={styles.inputPrefix}>🔗</span>
                    <input type="text" className={`${styles.input} ${styles.inputPrefixed}`}
                      placeholder="/about or https://…"
                      value={form.immerseCtaLink}
                      onChange={(e) => set("immerseCtaLink", e.target.value)} />
                  </div>
                  {errors.immerseCtaLink && <p className={styles.errorMsg}>⚠ {errors.immerseCtaLink}</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════ TAB 3 — RECOGNITION ══════════ */}
        {activeTab === "recognition" && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Recognition &amp; Endorsements</h3>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Recognition Title (H2)<span className={styles.required}>*</span></label>
              <p className={styles.fieldHint}>Section heading for the recognition block</p>
              <div className={`${styles.inputWrap} ${errors.recognitionTitle ? styles.inputError : ""} ${form.recognitionTitle && !errors.recognitionTitle ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input}
                  placeholder="e.g. Recognition & Endorsements"
                  value={form.recognitionTitle} maxLength={120}
                  onChange={(e) => set("recognitionTitle", e.target.value)} />
                <span className={styles.charCount}>{form.recognitionTitle.length}/120</span>
              </div>
              {errors.recognitionTitle && <p className={styles.errorMsg}>⚠ {errors.recognitionTitle}</p>}
            </div>

            {([
              { key: "recognitionPara1" as const, label: "Paragraph 1", hint: "YCB & Yoga Alliance accreditation + Yoga Alliance registration info", ph: "At AYM Yoga School in Rishikesh, all our programs are accredited by…", req: true },
              { key: "recognitionPara2" as const, label: "Paragraph 2", hint: "Best yoga TTC pitch — optional closing paragraph",                  ph: "If you're looking for the best Yoga TTC in Rishikesh…",             req: false },
            ]).map(({ key, label, hint, ph, req }) => (
              <div key={key} className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}{req && <span className={styles.required}>*</span>}</label>
                <p className={styles.fieldHint}>{hint}</p>
                <div className={`${styles.inputWrap} ${errors[key] ? styles.inputError : ""} ${form[key] && !errors[key] ? styles.inputSuccess : ""}`}>
                  <textarea className={`${styles.input} ${styles.textarea}`} placeholder={ph}
                    value={form[key]} maxLength={600} rows={4}
                    onChange={(e) => set(key, e.target.value)} />
                  <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form[key].length}/600</span>
                </div>
                {errors[key as keyof FormErrors] && <p className={styles.errorMsg}>⚠ {errors[key as keyof FormErrors]}</p>}
              </div>
            ))}
          </div>
        )}

        {/* ══════════ TAB 4 — CERTS & BADGES ══════════ */}
        {activeTab === "certs" && (
          <>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Certificate Cards</h3>
                <span className={styles.sectionBadge}>{form.certs.length}/6</span>
              </div>
              <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                Clickable certificate cards shown in the recognition grid (max 6)
              </p>
              {errors.certs && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.certs}</p>}

              <div className={styles.certsList}>
                {form.certs.map((cert, i) => (
                  <div key={i} className={styles.certCard}>
                    <div className={styles.certCardHeader}>
                      <span className={styles.certCardNum}>{i + 1}</span>
                      <span className={styles.certCardTitle}>Certificate #{i + 1}</span>
                      <button type="button" className={styles.removeBtn} onClick={() => removeCert(i)}
                        disabled={form.certs.length <= 1}>✕ Remove</button>
                    </div>

                    <div className={styles.certCardBody}>
                      <div className={styles.certImageUpload}>
                        <label className={`${styles.uploadArea} ${styles.uploadAreaSm}`}>
                          <input type="file" accept="image/*" className={styles.fileInput}
                            onChange={(e) => handleCertImage(i, e.target.files?.[0] || null)} />
                          {cert.imagePreview
                            ? <img src={cert.imagePreview} alt="preview" className={styles.certImgPreview} />
                            : (<><span className={styles.uploadIcon}>🏅</span><span className={styles.uploadText}>Upload Certificate Image</span><span className={styles.uploadSubtext}>JPG, PNG, WEBP</span></>)}
                        </label>
                      </div>

                      <div className={styles.certFields}>
                        <div className={styles.twoCol}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Label<span className={styles.required}>*</span></label>
                            <p className={styles.fieldHint}>Card footer name</p>
                            <div className={styles.inputWrap}>
                              <input type="text" className={styles.input}
                                placeholder="e.g. Yoga Alliance USA — RYS 500"
                                value={cert.label} maxLength={60}
                                onChange={(e) => updateCert(i, "label", e.target.value)} />
                            </div>
                          </div>
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Tag<span className={styles.required}>*</span></label>
                            <p className={styles.fieldHint}>Small tag chip above label</p>
                            <div className={styles.inputWrap}>
                              <input type="text" className={styles.input}
                                placeholder="e.g. International Recognition"
                                value={cert.tag} maxLength={40}
                                onChange={(e) => updateCert(i, "tag", e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                          <label className={styles.label}><span className={styles.labelIcon}>✦</span>Alt Text</label>
                          <p className={styles.fieldHint}>Accessibility description for screen readers & SEO</p>
                          <div className={styles.inputWrap}>
                            <input type="text" className={styles.input}
                              placeholder="e.g. Yoga Alliance USA — Certificate of Registration RYS 500"
                              value={cert.alt} maxLength={150}
                              onChange={(e) => updateCert(i, "alt", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {form.certs.length < 6 && (
                <button type="button" className={styles.addBtn} onClick={addCert}>+ Add Certificate Card</button>
              )}
            </div>

            <div className={styles.formDivider} />

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Bottom Badges Row</h3>
                <span className={styles.sectionBadge}>{form.badges.length}/6</span>
              </div>
              <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                Accreditation badges shown in the row at the bottom of the recognition section (max 6)
              </p>
              {errors.badges && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.badges}</p>}

              <div className={styles.badgesList}>
                {form.badges.map((badge, i) => (
                  <div key={i} className={styles.badgeRow}>
                    <div className={styles.badgeIndex}>{i + 1}</div>
                    <div className={styles.badgeFields}>
                      <div className={`${styles.inputWrap} ${styles.badgeIconInput}`}>
                        <input type="text" className={styles.input}
                          placeholder="Icon (e.g. 🏅)"
                          value={badge.icon} maxLength={4}
                          onChange={(e) => updateBadge(i, "icon", e.target.value)} />
                      </div>
                      <div className={styles.inputWrap} style={{ flex: 1 }}>
                        <input type="text" className={styles.input}
                          placeholder="Badge text (e.g. Yoga Alliance USA — RYS 200 & 300 & 500)"
                          value={badge.text} maxLength={80}
                          onChange={(e) => updateBadge(i, "text", e.target.value)} />
                      </div>
                    </div>
                    <button type="button" className={styles.removeBadgeBtn}
                      onClick={() => removeBadge(i)} disabled={form.badges.length <= 1}>✕</button>
                  </div>
                ))}
              </div>
              {form.badges.length > 0 && (
                <div className={styles.badgePreview}>
                  {form.badges.filter((b) => b.icon || b.text).map((b, i) => (
                    <div key={i} className={styles.badgeChip}>
                      <span className={styles.badgeChipIcon}>{b.icon}</span>
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>
              )}
              {form.badges.length < 6 && (
                <button type="button" className={styles.addBtn} onClick={addBadge}>+ Add Badge</button>
              )}
            </div>
          </>
        )}

        <div className={styles.formDivider} />

        {/* Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/dashboard/accreditation" className={styles.cancelBtn}>← Cancel</Link>
          <div className={styles.actionsRight}>
            {activeTab !== "auth" && (
              <button type="button" className={styles.prevBtn}
                onClick={() => {
                  const order = ["auth", "video", "recognition", "certs"];
                  const idx = order.indexOf(activeTab);
                  setActiveTab(order[idx - 1] as any);
                }}>
                ← Previous
              </button>
            )}
            {activeTab !== "certs" ? (
              <button type="button" className={styles.nextBtn}
                onClick={() => {
                  const order = ["auth", "video", "recognition", "certs"];
                  const idx = order.indexOf(activeTab);
                  setActiveTab(order[idx + 1] as any);
                }}>
                Next →
              </button>
            ) : (
              <button type="button"
                className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
                onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Save Section</>}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
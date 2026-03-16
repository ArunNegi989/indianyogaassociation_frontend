"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/yogateachertraning/AddHomeAbout.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface StatItem { value: string; label: string; }

interface FormData {
  superTitle: string; mainTitle: string;
  stats: StatItem[];
  paraOne: string; paraTwo: string; paraThree: string;
  accreditations: string;
  quoteText: string; paraRight: string;
  yogaStyles: string; paraSmall: string;
  ctaText: string; ctaLink: string;
}

interface FormErrors {
  superTitle?: string; mainTitle?: string; stats?: string;
  paraOne?: string; paraTwo?: string; paraThree?: string;
  quoteText?: string; paraRight?: string; yogaStyles?: string;
  ctaText?: string; ctaLink?: string;
}

export default function AddHomeAboutPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    superTitle: "", mainTitle: "",
    stats: [{ value: "", label: "" }],
    paraOne: "", paraTwo: "", paraThree: "", accreditations: "",
    quoteText: "", paraRight: "", yogaStyles: "", paraSmall: "",
    ctaText: "", ctaLink: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const updateStat = (i: number, field: keyof StatItem, val: string) => {
    setForm((p) => {
      const stats = [...p.stats];
      stats[i] = { ...stats[i], [field]: val };
      return { ...p, stats };
    });
  };

  const addStat = () => {
    if (form.stats.length >= 6) return;
    setForm((p) => ({ ...p, stats: [...p.stats, { value: "", label: "" }] }));
  };

  const removeStat = (i: number) =>
    setForm((p) => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.superTitle.trim()) e.superTitle = "Super title is required";
    if (!form.mainTitle.trim()) e.mainTitle = "Main title is required";
    if (form.stats.some((s) => !s.value.trim() || !s.label.trim())) e.stats = "All stat fields must be filled";
    if (!form.paraOne.trim()) e.paraOne = "Paragraph 1 is required";
    if (!form.paraTwo.trim()) e.paraTwo = "Paragraph 2 is required";
    if (!form.paraThree.trim()) e.paraThree = "Paragraph 3 is required";
    if (!form.quoteText.trim()) e.quoteText = "Quote text is required";
    if (!form.paraRight.trim()) e.paraRight = "Right paragraph is required";
    if (!form.yogaStyles.trim()) e.yogaStyles = "At least one yoga style is required";
    if (!form.ctaText.trim()) e.ctaText = "CTA text is required";
    if (!form.ctaLink.trim()) e.ctaLink = "CTA link is required";
    else if (!/^(https?:\/\/.+\..+|\/[^\s]*)$/.test(form.ctaLink.trim()))
      e.ctaLink = "Enter a valid URL or path";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

    useEffect(() => {

  const checkExisting = async () => {

    try {

      const res = await api.get("/home-about/get-home-about");

      if (res.data.data) {

        toast.error("Home About already exists. You can edit it.");

        router.replace("/admin/dashboard/homeabout");

      }

    } catch (error) {
      console.log(error);
    }

  };

  checkExisting();

}, []);

 const handleSubmit = async () => {

  if (!validate()) return;

  try {

    setIsSubmitting(true);

    const payload = {
      ...form,
      accreditations: form.accreditations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      yogaStyles: form.yogaStyles
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    await api.post("/home-about/create-home-about", payload);

    setSubmitted(true);

    setTimeout(() => {
      router.push("/admin/dashboard/yogateachertraning");
    }, 1500);

  } catch (error: any) {

    alert(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to save"
    );

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



  return (
    <div className={styles.page}>

      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard/homeabout")}>Home About</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Section</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add Home About Section</h1>
        <p className={styles.pageSubtitle}>Fill in all the details to configure the About section</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ── Section Header ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Section Header</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Super Title<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Small label shown above the main heading</p>
            <div className={`${styles.inputWrap} ${errors.superTitle ? styles.inputError : ""} ${form.superTitle && !errors.superTitle ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. Yoga Teacher Training in Rishikesh" value={form.superTitle} maxLength={100} onChange={(e) => set("superTitle", e.target.value)} />
              <span className={styles.charCount}>{form.superTitle.length}/100</span>
            </div>
            {errors.superTitle && <p className={styles.errorMsg}>⚠ {errors.superTitle}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Main Title (H2)<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Primary heading displayed prominently in the section</p>
            <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""} ${form.mainTitle && !errors.mainTitle ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`} placeholder="e.g. Get Certified From the Oldest Yoga Teacher Training School in Rishikesh, India" value={form.mainTitle} maxLength={200} rows={3} onChange={(e) => set("mainTitle", e.target.value)} />
              <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form.mainTitle.length}/200</span>
            </div>
            {errors.mainTitle && <p className={styles.errorMsg}>⚠ {errors.mainTitle}</p>}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── Stats ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Stats Row</h3>
            <span className={styles.sectionBadge}>{form.stats.length}/6</span>
          </div>
          <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>Highlight cards shown below the heading (max 6)</p>
          {errors.stats && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.stats}</p>}

          <div className={styles.statsGrid}>
            {form.stats.map((stat, i) => (
              <div key={i} className={styles.statRow}>
                <div className={styles.statIndex}>{i + 1}</div>
                <div className={styles.statFields}>
                  <div className={`${styles.inputWrap} ${styles.statInput}`}>
                    <input type="text" className={styles.input} placeholder="Value (e.g. 100K+)" value={stat.value} maxLength={20} onChange={(e) => updateStat(i, "value", e.target.value)} />
                  </div>
                  <div className={`${styles.inputWrap} ${styles.statInput}`}>
                    <input type="text" className={styles.input} placeholder="Label (e.g. Certified Teachers)" value={stat.label} maxLength={30} onChange={(e) => updateStat(i, "label", e.target.value)} />
                  </div>
                </div>
                <button type="button" className={styles.removeStatBtn} onClick={() => removeStat(i)} disabled={form.stats.length <= 1}>✕</button>
              </div>
            ))}
          </div>
          {form.stats.length < 6 && (
            <button type="button" className={styles.addStatBtn} onClick={addStat}>+ Add Stat</button>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── Body Left ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Body — Left Column</h3>
          </div>

          {([
            { key: "paraOne", label: "Paragraph 1", hint: "About Rishikesh — the yoga capital", ph: "e.g. Rishikesh, known globally as the 'Yoga Capital of the World'…" },
            { key: "paraTwo", label: "Paragraph 2", hint: "About AYM School & its founding", ph: "e.g. AYM Yoga School — one of the most respected…" },
            { key: "paraThree", label: "Paragraph 3", hint: "Vision & mission statement", ph: "e.g. Yogi Chetan Mahesh founded AYM with a vision to certify 100,000+ teachers…" },
          ] as const).map(({ key, label, hint, ph }) => (
            <div key={key} className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}<span className={styles.required}>*</span></label>
              <p className={styles.fieldHint}>{hint}</p>
              <div className={`${styles.inputWrap} ${errors[key] ? styles.inputError : ""} ${form[key] && !errors[key] ? styles.inputSuccess : ""}`}>
                <textarea className={`${styles.input} ${styles.textarea}`} placeholder={ph} value={form[key]} maxLength={500} rows={3} onChange={(e) => set(key, e.target.value)} />
                <span className={`${styles.charCount} ${styles.charCountBottom}`}>{(form[key] as string).length}/500</span>
              </div>
              {errors[key] && <p className={styles.errorMsg}>⚠ {errors[key]}</p>}
            </div>
          ))}

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Accreditation Badges</label>
            <p className={styles.fieldHint}>Comma-separated (e.g. 🏅 Yoga Alliance USA, 🏛️ YCB Ministry of AYUSH)</p>
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} placeholder="🏅 Yoga Alliance USA — RYS 200 & 300, 🏛️ YCB — Ministry of AYUSH, Govt. of India" value={form.accreditations} rows={2} maxLength={400} onChange={(e) => set("accreditations", e.target.value)} />
            </div>
            {form.accreditations && (
              <div className={styles.badgePreview}>
                {form.accreditations.split(",").map((b) => b.trim()).filter(Boolean).map((b, i) => (
                  <span key={i} className={styles.badgeChip}>{b}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── Body Right ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Body — Right Column</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Pull Quote<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Displayed as a styled blockquote with " " marks</p>
            <div className={`${styles.inputWrap} ${errors.quoteText ? styles.inputError : ""} ${form.quoteText && !errors.quoteText ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`} placeholder="e.g. Deepen Your Practice with Certified Yoga Teacher Training in Rishikesh, India" value={form.quoteText} maxLength={200} rows={2} onChange={(e) => set("quoteText", e.target.value)} />
              <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form.quoteText.length}/200</span>
            </div>
            {errors.quoteText && <p className={styles.errorMsg}>⚠ {errors.quoteText}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Right Column Paragraph<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Description about AYM's accreditations and uniqueness</p>
            <div className={`${styles.inputWrap} ${errors.paraRight ? styles.inputError : ""} ${form.paraRight && !errors.paraRight ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`} placeholder="e.g. AYM Yoga School offers authentic, in-depth Yoga Teacher Training Courses…" value={form.paraRight} maxLength={600} rows={4} onChange={(e) => set("paraRight", e.target.value)} />
              <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form.paraRight.length}/600</span>
            </div>
            {errors.paraRight && <p className={styles.errorMsg}>⚠ {errors.paraRight}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Yoga Styles<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Comma-separated styles shown as chips</p>
            <div className={`${styles.inputWrap} ${errors.yogaStyles ? styles.inputError : ""} ${form.yogaStyles && !errors.yogaStyles ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. Hatha Yoga, Ashtanga Yoga, Kundalini Yoga, Vinyasa Flow" value={form.yogaStyles} onChange={(e) => set("yogaStyles", e.target.value)} />
            </div>
            {errors.yogaStyles && <p className={styles.errorMsg}>⚠ {errors.yogaStyles}</p>}
            {form.yogaStyles && (
              <div className={styles.badgePreview}>
                {form.yogaStyles.split(",").map((s) => s.trim()).filter(Boolean).map((s, i) => (
                  <span key={i} className={styles.styleChip}>{s}</span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Curriculum Summary</label>
            <p className={styles.fieldHint}>Short note shown below the yoga style chips</p>
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} placeholder="e.g. Our curriculum covers asanas, meditation, breathwork, yoga philosophy…" value={form.paraSmall} maxLength={400} rows={2} onChange={(e) => set("paraSmall", e.target.value)} />
              <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form.paraSmall.length}/400</span>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── CTA ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Call to Action</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>CTA Text<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Descriptive text shown next to the CTA button</p>
            <div className={`${styles.inputWrap} ${errors.ctaText ? styles.inputError : ""} ${form.ctaText && !errors.ctaText ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`} placeholder="e.g. Explore life-changing professional yoga courses at AYM Yoga School" value={form.ctaText} maxLength={200} rows={2} onChange={(e) => set("ctaText", e.target.value)} />
              <span className={`${styles.charCount} ${styles.charCountBottom}`}>{form.ctaText.length}/200</span>
            </div>
            {errors.ctaText && <p className={styles.errorMsg}>⚠ {errors.ctaText}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>CTA Button Link<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>URL or path the button links to</p>
            <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.ctaLink ? styles.inputError : ""} ${form.ctaLink && !errors.ctaLink ? styles.inputSuccess : ""}`}>
              <span className={styles.inputPrefix}>🔗</span>
              <input type="text" className={`${styles.input} ${styles.inputPrefixed}`} placeholder="/yoga-teacher-training or https://…" value={form.ctaLink} onChange={(e) => set("ctaLink", e.target.value)} />
            </div>
            {errors.ctaLink && <p className={styles.errorMsg}>⚠ {errors.ctaLink}</p>}
          </div>
        </div>

        <div className={styles.formDivider} />

        <div className={styles.formActions}>
          <Link href="/admin/dashboard/homeabout" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button" className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Save Section</>}
          </button>
        </div>

      </div>
    </div>
  );
}
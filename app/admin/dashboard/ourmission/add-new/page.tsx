"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/dashboard/ourmission/Ourmission.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface FormData {
  missionHeading:    string;
  missionSeoTagline: string;
  missionParaOne:    string;
  missionParaTwo:    string;
  missionParaThree:  string;
  whyHeading:        string;
  whyLeadBold:       string;
  whyParaOne:        string;
  whyParaTwo:        string;
  whyParaThree:      string;
}

/* ─── Advanced Jodit config — same as AYM Full Page ─── */
function useJoditConfig(height = 250) {
  return useCallback(
    () => ({
      readonly: false,
      height,
      toolbarButtonSize: "small" as const,
      toolbarAdaptive:   false,
      buttons: [
        "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|",
        "outdent", "indent", "|",
        "font", "fontsize", "brush", "|",
        "link", "unlink", "|",
        "align", "|",
        "undo", "redo", "|",
        "hr", "eraser", "copyformat", "|",
        "fullsize",
      ],
      statusbar:              false,
      showXPathInStatusbar:   false,
      showCharsCounter:       false,
      showWordsCounter:       false,
      askBeforePasteHTML:     false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste:   "insert_clear_html" as const,
      style: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize:   "0.95rem",
        color:      "#3d1f00",
        background: "#fffdf8",
      },
    }),
    [height]
  );
}

const plain    = (v: string) => v.replace(/<[^>]*>/g, "").trim();
const notEmpty = (v: string) => !!plain(v) || "This field is required";

/* ─── Reusable JoditField ─── */
interface JoditFieldProps {
  label:     string;
  hint?:     string;
  value:     string;
  onChange:  (v: string) => void;
  error?:    string;
  maxLength?: number;
  height?:   number;
  required?: boolean;
  optional?: boolean;
}

function JoditField({
  label, hint, value, onChange, error,
  maxLength = 2000, height = 220,
  required = false, optional = false,
}: JoditFieldProps) {
  const config = useJoditConfig(height);
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
        {required && <span className={styles.required}>*</span>}
        {optional && (
          <span style={{ fontSize: "0.7rem", color: "#a07840", fontFamily: "'Cormorant Garamond', serif", textTransform: "none", letterSpacing: 0, marginLeft: "0.3rem" }}>
            (optional)
          </span>
        )}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div style={{ border: error ? "1.5px solid #c0392b" : "1.5px solid #e8d5b5", borderRadius: "8px", overflow: "hidden", transition: "border-color 0.2s" }}>
        <JoditEditor
          value={value}
          config={config()}
          onBlur={(content) => onChange(content)}
          onChange={() => {}}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
        {error ? <p className={styles.errorMsg} style={{ margin: 0 }}>⚠ {error}</p> : <span />}
        <span className={styles.charCount} style={{ position: "static" }}>
          {plain(value).length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

export default function AddOurMissionPage() {
  const router = useRouter();

  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormData>({
    defaultValues: {
      missionHeading: "", missionSeoTagline: "",
      missionParaOne: "", missionParaTwo: "", missionParaThree: "",
      whyHeading: "", whyLeadBold: "",
      whyParaOne: "", whyParaTwo: "", whyParaThree: "",
    },
  });

  const missionHeading    = watch("missionHeading");
  const missionSeoTagline = watch("missionSeoTagline");
  const whyHeading        = watch("whyHeading");
  const whyLeadBold       = watch("whyLeadBold");

  const onSubmit = async (data: FormData) => {
    const payload = {
      missionBlock: {
        heading:    data.missionHeading.trim(),
        seoTagline: data.missionSeoTagline.trim(),
        paragraphs: [data.missionParaOne, data.missionParaTwo, data.missionParaThree].filter((p) => plain(p) !== ""),
      },
      whyBlock: {
        heading:  data.whyHeading.trim(),
        leadBold: data.whyLeadBold.trim(),
        paragraphs: [data.whyParaOne, data.whyParaTwo, data.whyParaThree].filter((p) => plain(p) !== ""),
      },
    };
    await api.post("/our-mission/add-our-mission", payload);
    setTimeout(() => router.push("/admin/dashboard/ourmission"), 1500);
  };

  if (isSubmitSuccessful) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Blocks Saved!</h2>
        <p className={styles.successText}>Redirecting…</p>
      </div>
    </div>
  );

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/ourmission" className={styles.breadcrumbLink}>Our Mission</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Block</span>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Add Mission Blocks</h1>
          <p className={styles.pageSubtitle}>Fill both sections — Our Mission &amp; Why YTTC — in one go</p>
        </div>
      </div>
      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ══ OUR MISSION BLOCK ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Our Mission Block</h3>
          </div>

          {/* Heading */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Section Heading<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Displayed as H2 — e.g. &quot;Our Mission&quot;</p>
            <div className={`${styles.inputWrap} ${errors.missionHeading ? styles.inputError : missionHeading ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} maxLength={150} placeholder="e.g. Our Mission"
                {...register("missionHeading", { required: "Mission heading is required" })} />
              <span className={styles.charCount}>{missionHeading.length}/150</span>
            </div>
            {errors.missionHeading && <p className={styles.errorMsg}>⚠ {errors.missionHeading.message}</p>}
          </div>

          {/* SEO Tagline */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>SEO Tagline
              <span style={{ fontSize: "0.7rem", color: "#a07840", fontFamily: "'Cormorant Garamond', serif", textTransform: "none", letterSpacing: 0, marginLeft: "0.3rem" }}>(optional)</span>
            </label>
            <p className={styles.fieldHint}>Small italic subtitle — e.g. &quot;Yoga Teacher Training in Rishikesh India&quot;</p>
            <div className={`${styles.inputWrap} ${missionSeoTagline ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} maxLength={120} placeholder="e.g. Yoga Teacher Training in Rishikesh India" {...register("missionSeoTagline")} />
              <span className={styles.charCount}>{missionSeoTagline.length}/120</span>
            </div>
          </div>

          <Controller name="missionParaOne" control={control}
            rules={{ required: "Paragraph 1 is required", validate: notEmpty }}
            render={({ field, fieldState }) => (
              <JoditField label="Paragraph 1" hint="About yoga as a way of life, and AYM's mission"
                value={field.value} onChange={field.onChange} error={fieldState.error?.message} height={220} required />
            )} />

          <Controller name="missionParaTwo" control={control}
            rules={{ required: "Paragraph 2 is required", validate: notEmpty }}
            render={({ field, fieldState }) => (
              <JoditField label="Paragraph 2" hint="Closing motivational line about Rishikesh"
                value={field.value} onChange={field.onChange} error={fieldState.error?.message} height={220} required />
            )} />

          <Controller name="missionParaThree" control={control}
            render={({ field }) => (
              <JoditField label="Paragraph 3" hint="Additional paragraph — leave blank to skip"
                value={field.value} onChange={field.onChange} height={180} optional />
            )} />
        </div>

        <div className={styles.formDivider} />
        <div className={styles.ornament} style={{ margin: "0.5rem 0 1.5rem" }}>
          <span>❧</span><div className={styles.ornamentLine} /><span>✦ ॐ ✦</span><div className={styles.ornamentLine} /><span>❧</span>
        </div>
        <div className={styles.formDivider} />

        {/* ══ WHY YTTC BLOCK ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Why YTTC Block</h3>
          </div>

          {/* Why Heading */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Section Heading<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Displayed as H3 — e.g. &quot;Why Yoga Teacher Training is for Everyone?&quot;</p>
            <div className={`${styles.inputWrap} ${errors.whyHeading ? styles.inputError : whyHeading ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} maxLength={150} placeholder="e.g. Why Yoga Teacher Training is for Everyone?"
                {...register("whyHeading", { required: "Why YTTC heading is required" })} />
              <span className={styles.charCount}>{whyHeading.length}/150</span>
            </div>
            {errors.whyHeading && <p className={styles.errorMsg}>⚠ {errors.whyHeading.message}</p>}
          </div>

          {/* Lead Bold */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Lead Bold Phrase
              <span style={{ fontSize: "0.7rem", color: "#a07840", fontFamily: "'Cormorant Garamond', serif", textTransform: "none", letterSpacing: 0, marginLeft: "0.3rem" }}>(optional)</span>
            </label>
            <p className={styles.fieldHint}>Bolded opening phrase — e.g. &quot;What does the Journey Entail?&quot;</p>
            <div className={`${styles.inputWrap} ${whyLeadBold ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} maxLength={100} placeholder="e.g. What does the Journey Entail?" {...register("whyLeadBold")} />
              <span className={styles.charCount}>{whyLeadBold.length}/100</span>
            </div>
            {whyLeadBold && <span className={styles.leadBoldPreview}>{whyLeadBold}</span>}
          </div>

          <Controller name="whyParaOne" control={control}
            rules={{ required: "Paragraph 1 is required", validate: notEmpty }}
            render={({ field, fieldState }) => (
              <JoditField label="Paragraph 1" hint="Main body — begins with Lead Bold if set"
                value={field.value} onChange={field.onChange} error={fieldState.error?.message} height={220} required />
            )} />

          <Controller name="whyParaTwo" control={control}
            rules={{ required: "Paragraph 2 is required", validate: notEmpty }}
            render={({ field, fieldState }) => (
              <JoditField label="Paragraph 2" hint="Philosophical / deeper reflection"
                value={field.value} onChange={field.onChange} error={fieldState.error?.message} height={220} required />
            )} />

          <Controller name="whyParaThree" control={control}
            render={({ field }) => (
              <JoditField label="Paragraph 3" hint="Additional paragraph — leave blank to skip"
                value={field.value} onChange={field.onChange} height={180} optional />
            )} />
        </div>

        <div className={styles.formDivider} />

        <div className={styles.formActions}>
          <Link href="/admin/dashboard/ourmission" className={styles.cancelBtn}>← Cancel</Link>
          <button type="submit" className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Save Both Blocks</>}
          </button>
        </div>

      </form>
    </div>
  );
}
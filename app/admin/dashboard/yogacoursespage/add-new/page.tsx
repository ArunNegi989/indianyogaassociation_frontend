"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import styles from "@/assets/style/Admin/dashboard/yogacoursespage/Yogacoursessection.module.css";
import api from "@/lib/api";

/* ══════════════════════════════════════════════════════
   Jodit — SSR disabled
══════════════════════════════════════════════════════ */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */
const CERT_OPTIONS = ["100 Hour", "200 RYT", "300 RYT", "500 RYT"];
const STYLE_OPTIONS = [
  "Ashtanga / Hatha",
  "Hatha / Ashtanga Yoga",
  "Multi-Style Yoga",
  "Hatha / Multi-Style",
  "Kundalini Yoga",
  "Yin Yoga",
  "Vinyasa Flow",
];

type TabId = "courses" | "who" | "teachersHeader" | "founder" | "teachers";
const TAB_LABELS: Record<TabId, string> = {
  courses:        "① Courses",
  who:            "② Who Section",
  teachersHeader: "③ Teachers Intro",
  founder:        "④ Founder",
  teachers:       "⑤ Teachers Grid",
};

/* ══════════════════════════════════════════════════════
   FORM TYPES
══════════════════════════════════════════════════════ */
interface CourseItem {
  name: string; hours: string; days: string; style: string;
  duration: string; certificate: string; feeShared: string; feePrivate: string;
  color: string; imgUrl: string; imgPreview: string; imgFile: File | null;
  detailsLink: string; bookLink: string;
}
interface TeacherItem {
  name: string; surname: string;
  imgUrl: string; imgPreview: string; imgFile: File | null;
}

/* Each tab has its own form type */
interface CoursesForm {
  eyebrow: string; sectionTitle: string; sectionDesc: string;
  courses: CourseItem[];
}
interface WhoForm {
  eyebrow: string; sectionTitle: string;
  para1: string; para2: string; para3: string; para4: string; para5: string;
  chips: { label: string }[];
  quoteText: string; quoteAttrib: string;
}
interface TeachersHeaderForm {
  eyebrow: string; sectionTitle: string;
  introPara1: string; introPara1Highlight: string;
  introPara2: string; introPara2Highlight: string;
  ctaBtnText: string; ctaBtnLink: string;
}
interface FounderForm {
  eyebrow: string; name: string;
  imgUrl: string; imgPreview: string; imgFile: File | null; imgAlt: string;
  para1: string; para2: string; para3: string; para3Highlight: string;
  detailsBtnText: string; detailsBtnLink: string;
  bookBtnText: string; bookBtnLink: string;
}
interface TeachersForm {
  teachers: TeacherItem[];
}

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function stripHtml(html: string): string {
  if (!html) return "";
  let text = html.replace(/<[^>]*>/g, " ");
  text = text
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  return text.replace(/\s+/g, " ").trim();
}
function isRteEmpty(val: string): boolean {
  if (!val) return true;
  return stripHtml(val) === "" || val === "<p><br></p>" || val === "<p></p>";
}
function getImageUrl(path: string | undefined | null): string {
  if (!path || path.trim() === "") return "";
  if (/^https?:\/\//.test(path)) return path;
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/* ══════════════════════════════════════════════════════
   JODIT CONFIG
══════════════════════════════════════════════════════ */
function useJoditConfig() {
  return useMemo(() => ({
    readonly: false, toolbar: true, spellcheck: false, language: "en",
    toolbarButtonSize: "small" as const, toolbarAdaptive: false,
    showCharsCounter: false, showWordsCounter: false, showXPathInStatusbar: false,
    askBeforePasteHTML: false, askBeforePasteFromWord: false,
    buttons: ["bold","italic","underline","strikethrough","|","brush","font","fontsize","|","align","|","ul","ol","|","link","|","undo","redo","|","source"],
    height: 180,
    style: { fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#3d1d00", background: "#fff" },
    placeholder: "Type and format your text here…",
  }), []);
}

/* ══════════════════════════════════════════════════════
   DUAL IMAGE FIELD
══════════════════════════════════════════════════════ */
interface DualImageProps {
  label: string; hint: string; urlVal: string; previewVal: string; err?: string;
  onUrlChange: (url: string) => void;
  onFileChange: (file: File | null, preview: string) => void;
  recommendedSize?: string;
  required?: boolean;
}
function DualImageField({ label, hint, urlVal, previewVal, err, onUrlChange, onFileChange, recommendedSize = "600×400px", required = true }: DualImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePreview = previewVal || (urlVal ? getImageUrl(urlVal) : "");
  const handleFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onFileChange(file, e.target?.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}{required && <span className={styles.required}>*</span>}
      </label>
      <p className={styles.fieldHint}>{hint}</p>
      <div className={styles.dualImgWrapper}>
        <div className={styles.dualImgLeft}>
          <p className={styles.dualImgSubLabel}>Option A — Paste URL</p>
          <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${err && !urlVal ? styles.inputError : ""} ${urlVal && !err ? styles.inputSuccess : ""}`}>
            <span className={styles.inputPrefix}>🔗</span>
            <input type="text" className={`${styles.input} ${styles.inputPrefixed}`}
              placeholder="https://…" value={urlVal} onChange={(e) => onUrlChange(e.target.value)} />
          </div>
          <p className={styles.dualImgOrDivider}><span>— or —</span></p>
          <p className={styles.dualImgSubLabel}>Option B — Upload File</p>
          <label className={`${styles.uploadArea} ${styles.uploadAreaSm}`} style={{ cursor: "pointer" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0] || null); }}>
            <input ref={fileInputRef} type="file" accept="image/*" className={styles.fileInput}
              onChange={(e) => handleFile(e.target.files?.[0] || null)} />
            <span className={styles.uploadIcon}>🖼</span>
            <span className={styles.uploadText}>Click or drag &amp; drop</span>
            <span className={styles.uploadSubtext}>JPG, PNG, WEBP — {recommendedSize}</span>
          </label>
        </div>
        <div className={styles.dualImgRight}>
          <p className={styles.dualImgSubLabel}>Preview</p>
          {activePreview ? (
            <div className={styles.dualImgPreviewBox}>
              <img src={activePreview} alt="preview" className={styles.dualImgPreviewImg}
                onError={(e) => (e.currentTarget.style.display = "none")} />
              <button type="button" className={styles.dualImgClear} title="Clear image"
                onClick={() => { onUrlChange(""); onFileChange(null, ""); if (fileInputRef.current) fileInputRef.current.value = ""; }}>✕</button>
            </div>
          ) : (
            <div className={styles.dualImgPlaceholder}><span>🖼</span><span>No image yet</span></div>
          )}
        </div>
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PLAIN FIELD PRIMITIVES
══════════════════════════════════════════════════════ */
function TXT({ label, hint, val, err, onCh, ph, max = 150, req = true }:
  { label: string; hint: string; val: string; err?: string; onCh: (v: string) => void; ph: string; max?: number; req?: boolean }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}{req && <span className={styles.required}>*</span>}</label>
      <p className={styles.fieldHint}>{hint}</p>
      <div className={`${styles.inputWrap} ${err ? styles.inputError : ""} ${val && !err ? styles.inputSuccess : ""}`}>
        <input type="text" className={styles.input} placeholder={ph} value={val} maxLength={max} onChange={(e) => onCh(e.target.value)} />
        <span className={styles.charCount}>{val.length}/{max}</span>
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}
function TA({ label, hint, val, err, onCh, ph, rows = 3, max = 600, req = true }:
  { label: string; hint: string; val: string; err?: string; onCh: (v: string) => void; ph: string; rows?: number; max?: number; req?: boolean }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}{req && <span className={styles.required}>*</span>}</label>
      <p className={styles.fieldHint}>{hint}</p>
      <div className={`${styles.inputWrap} ${err ? styles.inputError : ""} ${val && !err ? styles.inputSuccess : ""}`}>
        <textarea className={`${styles.input} ${styles.textarea}`} placeholder={ph} value={val} maxLength={max} rows={rows} onChange={(e) => onCh(e.target.value)} />
        <span className={`${styles.charCount} ${styles.charCountBottom}`}>{val.length}/{max}</span>
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}
function LNKF({ label, hint, val, err, onCh, ph, req = false }:
  { label: string; hint: string; val: string; err?: string; onCh: (v: string) => void; ph: string; req?: boolean }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}{req && <span className={styles.required}>*</span>}</label>
      <p className={styles.fieldHint}>{hint}</p>
      <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${err ? styles.inputError : ""} ${val && !err ? styles.inputSuccess : ""}`}>
        <span className={styles.inputPrefix}>🔗</span>
        <input type="text" className={`${styles.input} ${styles.inputPrefixed}`} placeholder={ph} value={val} onChange={(e) => onCh(e.target.value)} />
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}
function RTE({ label, hint, val, err, onCh, req = true }:
  { label: string; hint: string; val: string; err?: string; onCh: (v: string) => void; req?: boolean }) {
  const config = useJoditConfig();
  const edRef  = useRef(null);
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}{req && <span className={styles.required}>*</span>}</label>
      <p className={styles.fieldHint}>{hint}</p>
      <div className={`${styles.joditWrap} ${err ? styles.joditError : ""} ${val && !isRteEmpty(val) && !err ? styles.joditSuccess : ""}`}>
        <JoditEditor ref={edRef} value={val} config={config} onBlur={(v) => onCh(v)} />
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DEFAULT VALUES
══════════════════════════════════════════════════════ */
const DEFAULT_COURSE: CourseItem = {
  name:"", hours:"", days:"", style:"", duration:"", certificate:"",
  feeShared:"", feePrivate:"", color:"#8B5E3C",
  imgUrl:"", imgPreview:"", imgFile:null, detailsLink:"#", bookLink:"#",
};
const DEFAULT_TEACHER: TeacherItem = {
  name:"", surname:"", imgUrl:"", imgPreview:"", imgFile:null,
};

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function AddYogaCoursesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("courses");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ══════════ FORM: COURSES ══════════ */
  const coursesForm = useForm<CoursesForm>({
    defaultValues: {
      eyebrow:"", sectionTitle:"", sectionDesc:"",
      courses:[{ ...DEFAULT_COURSE }],
    },
  });
  const { fields: courseFields, append: appendCourse, remove: removeCourse } =
    useFieldArray({ control: coursesForm.control, name: "courses" });

  /* ══════════ FORM: WHO ══════════ */
  const whoForm = useForm<WhoForm>({
    defaultValues: {
      eyebrow:"", sectionTitle:"",
      para1:"", para2:"", para3:"", para4:"", para5:"",
      chips:[{ label:"" },{ label:"" },{ label:"" },{ label:"" },{ label:"" },{ label:"" }],
      quoteText:"", quoteAttrib:"",
    },
  });
  const { fields: chipFields, append: appendChip, remove: removeChip } =
    useFieldArray({ control: whoForm.control, name: "chips" });

  /* ══════════ FORM: TEACHERS HEADER ══════════ */
  const thForm = useForm<TeachersHeaderForm>({
    defaultValues: {
      eyebrow:"", sectionTitle:"",
      introPara1:"", introPara1Highlight:"",
      introPara2:"", introPara2Highlight:"",
      ctaBtnText:"", ctaBtnLink:"",
    },
  });

  /* ══════════ FORM: FOUNDER ══════════ */
  const founderForm = useForm<FounderForm>({
    defaultValues: {
      eyebrow:"", name:"",
      imgUrl:"", imgPreview:"", imgFile:null, imgAlt:"",
      para1:"", para2:"", para3:"", para3Highlight:"",
      detailsBtnText:"", detailsBtnLink:"#",
      bookBtnText:"Book Now", bookBtnLink:"#",
    },
  });
  const founderImgUrl     = founderForm.watch("imgUrl");
  const founderImgPreview = founderForm.watch("imgPreview");

  /* ══════════ FORM: TEACHERS ══════════ */
  const teachersForm = useForm<TeachersForm>({
    defaultValues: { teachers:[{ ...DEFAULT_TEACHER }] },
  });
  const { fields: teacherFields, append: appendTeacher, remove: removeTeacher } =
    useFieldArray({ control: teachersForm.control, name: "teachers" });

  /* ══════════ TAB ERROR FLAGS (for dot indicators) ══════════ */
  const tabErr: Record<TabId, boolean> = {
    courses:        Object.keys(coursesForm.formState.errors).length > 0,
    who:            Object.keys(whoForm.formState.errors).length > 0,
    teachersHeader: Object.keys(thForm.formState.errors).length > 0,
    founder:        Object.keys(founderForm.formState.errors).length > 0,
    teachers:       Object.keys(teachersForm.formState.errors).length > 0,
  };

  /* ══════════════════════════════════════════════════════
     FINAL SUBMIT — validates ALL 5 forms then POSTs /create
  ══════════════════════════════════════════════════════ */
  const handleFinalSubmit = async () => {
    /* Trigger validation on all forms */
    const [v1, v2, v3, v4, v5] = await Promise.all([
      coursesForm.trigger(),
      whoForm.trigger(),
      thForm.trigger(),
      founderForm.trigger(),
      teachersForm.trigger(),
    ]);

    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      /* Switch to first tab that has errors */
      if (!v1) setActiveTab("courses");
      else if (!v2) setActiveTab("who");
      else if (!v3) setActiveTab("teachersHeader");
      else if (!v4) setActiveTab("founder");
      else setActiveTab("teachers");
      alert("Please fill all required fields. The tab with errors has been highlighted.");
      return;
    }

    try {
      setIsSubmitting(true);

      const cData = coursesForm.getValues();
      const wData = whoForm.getValues();
      const tHData = thForm.getValues();
      const fData = founderForm.getValues();
      const tData = teachersForm.getValues();

      /* ── Detect file uploads ── */
      const hasFiles =
        cData.courses.some((c) => c.imgFile) ||
        !!fData.imgFile ||
        tData.teachers.some((t) => t.imgFile);

      /* ── Build clean payload ── */
      const payload = {
        sectionHeader: {
          eyebrow:      stripHtml(cData.eyebrow),
          sectionTitle: stripHtml(cData.sectionTitle),
          sectionDesc:  stripHtml(cData.sectionDesc),
        },
        courses: cData.courses.map((c, i) => ({
          hours:       stripHtml(c.hours),
          days:        stripHtml(c.days),
          name:        stripHtml(c.name),
          style:       c.style,
          duration:    stripHtml(c.duration),
          certificate: c.certificate,
          feeShared:   stripHtml(c.feeShared),
          feePrivate:  stripHtml(c.feePrivate),
          color:       c.color,
          imgUrl:      c.imgFile ? `__upload_courseImg_${i}` : c.imgUrl,
          detailsLink: c.detailsLink || "#",
          bookLink:    c.bookLink    || "#",
        })),
        who: {
          eyebrow:      stripHtml(wData.eyebrow),
          sectionTitle: stripHtml(wData.sectionTitle),
          para1:        stripHtml(wData.para1),
          para2:        stripHtml(wData.para2),
          para3:        stripHtml(wData.para3),
          para4:        stripHtml(wData.para4),
          para5:        stripHtml(wData.para5),
          chips:        wData.chips.map((c) => stripHtml(c.label)).filter(Boolean),
          quoteText:    stripHtml(wData.quoteText),
          quoteAttrib:  stripHtml(wData.quoteAttrib),
        },
        teachersHeader: {
          eyebrow:             stripHtml(tHData.eyebrow),
          sectionTitle:        stripHtml(tHData.sectionTitle),
          introPara1:          stripHtml(tHData.introPara1),
          introPara1Highlight: stripHtml(tHData.introPara1Highlight),
          introPara2:          stripHtml(tHData.introPara2),
          introPara2Highlight: stripHtml(tHData.introPara2Highlight),
          ctaBtnText:          stripHtml(tHData.ctaBtnText),
          ctaBtnLink:          tHData.ctaBtnLink,
        },
        founder: {
          eyebrow:        stripHtml(fData.eyebrow),
          name:           stripHtml(fData.name),
          imgUrl:         fData.imgFile ? "__upload_founderImg" : fData.imgUrl,
          imgAlt:         stripHtml(fData.imgAlt),
          para1:          stripHtml(fData.para1),
          para2:          stripHtml(fData.para2),
          para3:          stripHtml(fData.para3),
          para3Highlight: stripHtml(fData.para3Highlight),
          detailsBtnText: stripHtml(fData.detailsBtnText),
          detailsBtnLink: fData.detailsBtnLink || "#",
          bookBtnText:    stripHtml(fData.bookBtnText),
          bookBtnLink:    fData.bookBtnLink    || "#",
        },
        teachers: tData.teachers
          .filter((t) => t.name.trim() && t.surname.trim())
          .map((t, i) => ({
            name:    stripHtml(t.name),
            surname: stripHtml(t.surname),
            imgUrl:  t.imgFile ? `__upload_teacherImg_${i}` : t.imgUrl,
          })),
      };

      if (hasFiles) {
        const fd = new FormData();
        cData.courses.forEach((c, i) => { if (c.imgFile) fd.append(`courseImg_${i}`, c.imgFile!); });
        if (fData.imgFile) fd.append("founderImg", fData.imgFile);
        tData.teachers.forEach((t, i) => { if (t.imgFile) fd.append(`teacherImg_${i}`, t.imgFile!); });
        fd.append("data", JSON.stringify(payload));
        await api.post("/yoga-courses/create", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/yoga-courses/create", payload);
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yogacoursespage"), 1500);
    } catch (err: any) {
      console.error("Save error:", err);
      alert(err?.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ══════════ SUCCESS SCREEN ══════════ */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Page Created!</h2>
          <p className={styles.successText}>Redirecting to yoga courses list…</p>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard")}>Dashboard</button>
        <span className={styles.breadcrumbSep}>›</span>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard/yogacoursespage")}>Yoga Courses</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add New</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add — Yoga Courses &amp; Teachers Page</h1>
        <p className={styles.pageSubtitle}>Fill each section and submit on the last tab</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Tab Nav */}
      <div className={styles.tabNav}>
        {(Object.keys(TAB_LABELS) as TabId[]).map((tab) => (
          <button key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${tabErr[tab] ? styles.tabBtnError : ""}`}
            onClick={() => setActiveTab(tab)}>
            {tabErr[tab] && <span className={styles.tabDot} />}
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          TAB 1 — COURSES
      ══════════════════════════════════════════════════ */}
      {activeTab === "courses" && (
        <div className={styles.formCard}>
          {/* Section Header */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Section Header</h3></div>
            <Controller control={coursesForm.control} name="eyebrow" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TXT label="Eyebrow Text" hint='Small text above the heading — e.g. "Sacred Path of Yoga"' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Sacred Path of Yoga" max={80} />
              )} />
            <Controller control={coursesForm.control} name="sectionTitle" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TXT label="Section Title (H2)" hint="Main heading of the courses section" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Join Our Yoga Teacher Training in Rishikesh" />
              )} />
            <Controller control={coursesForm.control} name="sectionDesc" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TA label="Section Description" hint="Paragraph shown below the heading" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="Ready to embark on a transformative path…" max={400} rows={3} />
              )} />
          </div>

          <div className={styles.formDivider} />

          {/* Course Cards */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Course Cards</h3>
              <span className={styles.sectionBadge}>{courseFields.length}/20</span>
            </div>
            <div className={styles.certsList}>
              {courseFields.map((field, i) => {
                const imgUrl     = coursesForm.watch(`courses.${i}.imgUrl`);
                const imgPreview = coursesForm.watch(`courses.${i}.imgPreview`);
                const color      = coursesForm.watch(`courses.${i}.color`);
                const feeShared  = coursesForm.watch(`courses.${i}.feeShared`);
                const feePrivate = coursesForm.watch(`courses.${i}.feePrivate`);
                const errs       = coursesForm.formState.errors.courses?.[i];

                return (
                  <div key={field.id} className={styles.certCard}>
                    <div className={styles.certCardHeader}>
                      <span className={styles.certCardNum}>{i + 1}</span>
                      <span className={styles.certCardTitle}>Course #{i + 1} — {coursesForm.watch(`courses.${i}.name`) || "Untitled"}</span>
                      <button type="button" className={styles.removeBtn} onClick={() => removeCourse(i)} disabled={courseFields.length <= 1}>✕ Remove</button>
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <div className={styles.twoCol}>
                        <Controller control={coursesForm.control} name={`courses.${i}.name`} rules={{ required: "Required" }}
                          render={({ field: f, fieldState: fs }) => (
                            <TXT label="Course Name" hint="Full name shown on the card" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. Beginner Yoga Course" max={100} />
                          )} />
                        <Controller control={coursesForm.control} name={`courses.${i}.hours`} rules={{ required: "Required" }}
                          render={({ field: f, fieldState: fs }) => (
                            <TXT label="Hours Label" hint="Badge on card image — e.g. 100 HOUR YOGA" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. 100 HOUR YOGA" max={30} />
                          )} />
                      </div>
                      <div className={styles.twoCol}>
                        <Controller control={coursesForm.control} name={`courses.${i}.days`} rules={{ required: "Required" }}
                          render={({ field: f, fieldState: fs }) => (
                            <TXT label="Days Label" hint="Image tag — e.g. 14 Days Program" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. 14 Days Program" max={30} />
                          )} />
                        <Controller control={coursesForm.control} name={`courses.${i}.duration`} rules={{ required: "Required" }}
                          render={({ field: f, fieldState: fs }) => (
                            <TXT label="Duration" hint="Meta row value — e.g. 14 Days" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. 14 Days" max={20} />
                          )} />
                      </div>
                      <div className={styles.twoCol}>
                        {/* Style select */}
                        <div className={styles.fieldGroup}>
                          <label className={styles.label}><span className={styles.labelIcon}>✦</span>Course Style<span className={styles.required}>*</span></label>
                          <p className={styles.fieldHint}>Type of yoga taught</p>
                          <Controller control={coursesForm.control} name={`courses.${i}.style`} rules={{ required: "Required" }}
                            render={({ field: f, fieldState: fs }) => (
                              <>
                                <select className={`${styles.select} ${fs.error ? styles.inputError : ""}`} value={f.value} onChange={f.onChange}>
                                  <option value="">— Select Style —</option>
                                  {STYLE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                                {fs.error && <p className={styles.errorMsg}>⚠ {fs.error.message}</p>}
                              </>
                            )} />
                        </div>
                        {/* Certificate select */}
                        <div className={styles.fieldGroup}>
                          <label className={styles.label}><span className={styles.labelIcon}>✦</span>Certificate<span className={styles.required}>*</span></label>
                          <p className={styles.fieldHint}>International certification level</p>
                          <Controller control={coursesForm.control} name={`courses.${i}.certificate`} rules={{ required: "Required" }}
                            render={({ field: f, fieldState: fs }) => (
                              <>
                                <select className={`${styles.select} ${fs.error ? styles.inputError : ""}`} value={f.value} onChange={f.onChange}>
                                  <option value="">— Select —</option>
                                  {CERT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                                {fs.error && <p className={styles.errorMsg}>⚠ {fs.error.message}</p>}
                              </>
                            )} />
                        </div>
                      </div>
                      <div className={styles.twoCol}>
                        <Controller control={coursesForm.control} name={`courses.${i}.feeShared`} rules={{ required: "Required" }}
                          render={({ field: f, fieldState: fs }) => (
                            <div className={styles.fieldGroup}>
                              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Shared Room Fee (USD)<span className={styles.required}>*</span></label>
                              <p className={styles.fieldHint}>Price for shared accommodation</p>
                              <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${fs.error ? styles.inputError : ""} ${f.value && !fs.error ? styles.inputSuccess : ""}`}>
                                <span className={styles.inputPrefix}>$</span>
                                <input type="number" className={`${styles.input} ${styles.inputPrefixed}`} placeholder="500" value={f.value} onChange={f.onChange} />
                              </div>
                              {fs.error && <p className={styles.errorMsg}>⚠ {fs.error.message}</p>}
                            </div>
                          )} />
                        <Controller control={coursesForm.control} name={`courses.${i}.feePrivate`} rules={{ required: "Required" }}
                          render={({ field: f, fieldState: fs }) => (
                            <div className={styles.fieldGroup}>
                              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Private Room Fee (USD)<span className={styles.required}>*</span></label>
                              <p className={styles.fieldHint}>Price for private accommodation</p>
                              <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${fs.error ? styles.inputError : ""} ${f.value && !fs.error ? styles.inputSuccess : ""}`}>
                                <span className={styles.inputPrefix}>$</span>
                                <input type="number" className={`${styles.input} ${styles.inputPrefixed}`} placeholder="550" value={f.value} onChange={f.onChange} />
                              </div>
                              {fs.error && <p className={styles.errorMsg}>⚠ {fs.error.message}</p>}
                            </div>
                          )} />
                      </div>

                      {feeShared && feePrivate && (
                        <div style={{ marginBottom: "1rem" }}>
                          <span className={styles.feeBadge}>Preview: {feeShared} USD / {feePrivate} USD</span>
                        </div>
                      )}

                      {/* Dual Image */}
                      <DualImageField
                        label="Card Image"
                        hint="Upload a file OR paste an image URL (600×400px recommended)"
                        urlVal={imgUrl}
                        previewVal={imgPreview}
                        err={errs?.imgUrl?.message}
                        onUrlChange={(url) => {
                          coursesForm.setValue(`courses.${i}.imgUrl`, url);
                          coursesForm.setValue(`courses.${i}.imgFile`, null);
                          coursesForm.setValue(`courses.${i}.imgPreview`, "");
                          if (url) coursesForm.clearErrors(`courses.${i}.imgUrl`);
                        }}
                        onFileChange={(file, preview) => {
                          coursesForm.setValue(`courses.${i}.imgFile`, file);
                          coursesForm.setValue(`courses.${i}.imgPreview`, preview);
                          if (file) {
                            coursesForm.setValue(`courses.${i}.imgUrl`, "");
                            coursesForm.clearErrors(`courses.${i}.imgUrl`);
                          }
                        }}
                        recommendedSize="600×400px"
                      />

                      {/* Accent Color */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}><span className={styles.labelIcon}>✦</span>Accent Color</label>
                        <p className={styles.fieldHint}>Card overlay gradient color (--card-color)</p>
                        <div className={styles.colorInputWrap}>
                          <div className={styles.colorSwatch} style={{ background: color, position: "relative" }}>
                            <input type="color" value={color}
                              onChange={(e) => coursesForm.setValue(`courses.${i}.color`, e.target.value)}
                              style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                          </div>
                          <input type="text" className={styles.colorHexInput} value={color} maxLength={7}
                            onChange={(e) => coursesForm.setValue(`courses.${i}.color`, e.target.value)} />
                        </div>
                      </div>

                      <div className={styles.twoCol}>
                        <Controller control={coursesForm.control} name={`courses.${i}.detailsLink`}
                          render={({ field: f }) => (
                            <LNKF label='"More Details" Button Link' hint='href for the "More Details" button' val={f.value} onCh={f.onChange} ph="/courses/beginner or #" />
                          )} />
                        <Controller control={coursesForm.control} name={`courses.${i}.bookLink`}
                          render={({ field: f }) => (
                            <LNKF label='"Book Now" Button Link' hint='href for the "Book Now" button' val={f.value} onCh={f.onChange} ph="/book or #" />
                          )} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {courseFields.length < 20 && (
              <button type="button" className={styles.addBtn} onClick={() => appendCourse({ ...DEFAULT_COURSE })}>
                + Add Course Card
              </button>
            )}
          </div>

          <div className={styles.formDivider} />
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/yogacoursespage" className={styles.cancelBtn}>← Cancel</Link>
            <button type="button" className={styles.submitBtn} onClick={() => setActiveTab("who")}>
              Next: Who Section →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 2 — WHO
      ══════════════════════════════════════════════════ */}
      {activeTab === "who" && (
        <div className={styles.formCard}>
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Section Head</h3></div>
            <div className={styles.twoCol}>
              <Controller control={whoForm.control} name="eyebrow" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Eyebrow" hint='Small label above heading — e.g. "Open to All Seekers"' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Open to All Seekers" max={80} />
                )} />
              <Controller control={whoForm.control} name="sectionTitle" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Section Title (H2)" hint="Main heading of the who section" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Who Can Join Yoga TTC in Rishikesh?" />
                )} />
            </div>
          </div>
          <div className={styles.formDivider} />
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Left Column — 5 Body Paragraphs</h3></div>
            {(["para1","para2","para3","para4","para5"] as const).map((key, pi) => (
              <Controller key={key} control={whoForm.control} name={key}
                rules={{ validate: (v) => !isRteEmpty(v) || "Required" }}
                render={({ field, fieldState }) => (
                  <RTE label={`Paragraph ${pi + 1}`} hint="" val={field.value} err={fieldState.error?.message} onCh={field.onChange} />
                )} />
            ))}
          </div>
          <div className={styles.formDivider} />
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Feature Chips (✦ items)</h3>
              <span className={styles.sectionBadge}>{chipFields.length}/8</span>
            </div>
            <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>The ✦ chip items shown in the decorative right column</p>
            <div className={styles.badgesList}>
              {chipFields.map((field, i) => (
                <div key={field.id} className={styles.badgeRow}>
                  <div className={styles.badgeIndex}>{i + 1}</div>
                  <Controller control={whoForm.control} name={`chips.${i}.label`} rules={{ required: "Required" }}
                    render={({ field: f, fieldState: fs }) => (
                      <div className={styles.inputWrap} style={{ flex: 1 }}>
                        <input type="text" className={`${styles.input} ${fs.error ? styles.inputError : ""}`}
                          placeholder="e.g. Age 18–50 Welcome" value={f.value} maxLength={40} onChange={f.onChange} />
                      </div>
                    )} />
                  <button type="button" className={styles.removeBadgeBtn} onClick={() => removeChip(i)} disabled={chipFields.length <= 1}>✕</button>
                </div>
              ))}
            </div>
            {/* Live preview */}
            {whoForm.watch("chips").filter((c) => c.label.trim()).length > 0 && (
              <div className={styles.badgePreview}>
                {whoForm.watch("chips").filter((c) => c.label.trim()).map((c, i) => (
                  <div key={i} className={styles.badgeChip}><span className={styles.badgeChipIcon}>✦</span>{c.label}</div>
                ))}
              </div>
            )}
            {chipFields.length < 8 && (
              <button type="button" className={styles.addBtn} onClick={() => appendChip({ label: "" })}>+ Add Chip</button>
            )}
          </div>
          <div className={styles.formDivider} />
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Quote Block</h3></div>
            <Controller control={whoForm.control} name="quoteText" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TA label="Quote Text" hint='Do not include quote marks — frontend adds them' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="Yoga is the journey of the self, through the self, to the self." max={200} rows={2} />
              )} />
            <Controller control={whoForm.control} name="quoteAttrib" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TXT label="Quote Attribution" hint='Author / source line — e.g. "— Bhagavad Gita"' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="— Bhagavad Gita" max={80} />
              )} />
          </div>
          <div className={styles.formDivider} />
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setActiveTab("courses")}>← Previous</button>
            <button type="button" className={styles.submitBtn} onClick={() => setActiveTab("teachersHeader")}>
              Next: Teachers Intro →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 3 — TEACHERS HEADER
      ══════════════════════════════════════════════════ */}
      {activeTab === "teachersHeader" && (
        <div className={styles.formCard}>
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Section Head</h3></div>
            <div className={styles.twoCol}>
              <Controller control={thForm.control} name="eyebrow" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Eyebrow" hint='Small label above heading — e.g. "Masters of the Ancient Art"' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Masters of the Ancient Art" max={80} />
                )} />
              <Controller control={thForm.control} name="sectionTitle" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Section Title (H2)" hint="Main heading of the teachers section" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Our Experienced Yoga Teachers" />
                )} />
            </div>
          </div>
          <div className={styles.formDivider} />
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Intro Paragraphs</h3></div>
            <Controller control={thForm.control} name="introPara1" rules={{ validate: (v) => !isRteEmpty(v) || "Required" }}
              render={({ field, fieldState }) => (
                <RTE label="Intro Paragraph 1" hint="About the team — use Bold for keywords." val={field.value} err={fieldState.error?.message} onCh={field.onChange} />
              )} />
            <Controller control={thForm.control} name="introPara1Highlight" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TXT label="Paragraph 1 — Bold Highlight (plain)" hint="Exact phrase from para 1 wrapped in <strong>" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. hatha yoga teacher training in Rishikesh" max={120} />
              )} />
            <Controller control={thForm.control} name="introPara2" rules={{ validate: (v) => !isRteEmpty(v) || "Required" }}
              render={({ field, fieldState }) => (
                <RTE label="Intro Paragraph 2" hint="About online courses — use Bold for keywords." val={field.value} err={fieldState.error?.message} onCh={field.onChange} />
              )} />
            <Controller control={thForm.control} name="introPara2Highlight" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TXT label="Paragraph 2 — Bold Highlight (plain)" hint="Exact phrase from para 2 wrapped in <strong>" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. online yoga instructor courses in Rishikesh" max={120} />
              )} />
          </div>
          <div className={styles.formDivider} />
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>CTA Button</h3></div>
            <div className={styles.twoCol}>
              <Controller control={thForm.control} name="ctaBtnText" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Button Text" hint="Label shown on the CTA button" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Our Teachers' Information" max={80} />
                )} />
              <Controller control={thForm.control} name="ctaBtnLink" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <LNKF label="Button Link" hint="href for the CTA button" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="/teachers or #" req />
                )} />
            </div>
          </div>
          <div className={styles.formDivider} />
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setActiveTab("who")}>← Previous</button>
            <button type="button" className={styles.submitBtn} onClick={() => setActiveTab("founder")}>
              Next: Founder →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 4 — FOUNDER
      ══════════════════════════════════════════════════ */}
      {activeTab === "founder" && (
        <div className={styles.formCard}>
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Founder Identity</h3></div>
            <div className={styles.twoCol}>
              <Controller control={founderForm.control} name="eyebrow" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Eyebrow / Role Label" hint='Small text above name — e.g. "Founder of AYM Yoga School"' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Founder of AYM Yoga School" max={80} />
                )} />
              <Controller control={founderForm.control} name="name" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Founder Name (H3)" hint="Full display name" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Yogi Chetan Mahesh" max={80} />
                )} />
            </div>
          </div>
          <div className={styles.formDivider} />
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Founder Photo</h3></div>
            <DualImageField
              label="Founder Photo" hint="Upload a file OR paste an image URL. Recommended 500×600px."
              urlVal={founderImgUrl} previewVal={founderImgPreview}
              err={founderForm.formState.errors.imgUrl?.message}
              onUrlChange={(url) => { founderForm.setValue("imgUrl", url); founderForm.setValue("imgFile", null); founderForm.setValue("imgPreview", ""); }}
              onFileChange={(file, preview) => { founderForm.setValue("imgFile", file); founderForm.setValue("imgPreview", preview); if (file) founderForm.setValue("imgUrl", ""); }}
              recommendedSize="500×600px"
              required={false}
            />
            <Controller control={founderForm.control} name="imgAlt" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TXT label="Image Alt Text" hint='Accessibility alt text' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Yogi Chetan Mahesh — Founder of AYM Yoga School" max={150} />
              )} />
          </div>
          <div className={styles.formDivider} />
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Bio Paragraphs</h3></div>
            {(["para1","para2","para3"] as const).map((key, pi) => (
              <Controller key={key} control={founderForm.control} name={key}
                rules={{ validate: (v) => !isRteEmpty(v) || "Required" }}
                render={({ field, fieldState }) => (
                  <RTE label={`Paragraph ${pi + 1}`} hint="" val={field.value} err={fieldState.error?.message} onCh={field.onChange} />
                )} />
            ))}
            <Controller control={founderForm.control} name="para3Highlight" rules={{ required: "Required" }}
              render={({ field, fieldState }) => (
                <TXT label="Paragraph 3 — Bold Highlight (plain)" hint="Exact phrase from para 3 wrapped in <strong>" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Gold Medal recipient" max={80} />
              )} />
          </div>
          <div className={styles.formDivider} />
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Action Buttons</h3></div>
            <div className={styles.twoCol}>
              <Controller control={founderForm.control} name="detailsBtnText" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label='"Know More" Button Text' hint="Label for the details button" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Know More About Yogi Chetan Mahesh" max={80} />
                )} />
              <Controller control={founderForm.control} name="detailsBtnLink" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <LNKF label='"Know More" Button Link' hint="href for the details button" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="/about/founder or #" req />
                )} />
            </div>
            <div className={styles.twoCol}>
              <Controller control={founderForm.control} name="bookBtnText" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label='"Book Now" Button Text' hint="Label for the book button" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Book Now" max={40} />
                )} />
              <Controller control={founderForm.control} name="bookBtnLink" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <LNKF label='"Book Now" Button Link' hint="href for the book button" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="/book or #" req />
                )} />
            </div>
          </div>
          <div className={styles.formDivider} />
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setActiveTab("teachersHeader")}>← Previous</button>
            <button type="button" className={styles.submitBtn} onClick={() => setActiveTab("teachers")}>
              Next: Teachers Grid →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 5 — TEACHERS GRID  (final submit here)
      ══════════════════════════════════════════════════ */}
      {activeTab === "teachers" && (
        <div className={styles.formCard}>
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Teacher Cards</h3>
              <span className={styles.sectionBadge}>{teacherFields.length}/10</span>
            </div>
            <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
              Each card shows name, surname, and photo in the grid below the founder block.
            </p>
            <div className={styles.certsList}>
              {teacherFields.map((field, i) => {
                const imgUrl     = teachersForm.watch(`teachers.${i}.imgUrl`);
                const imgPreview = teachersForm.watch(`teachers.${i}.imgPreview`);

                return (
                  <div key={field.id} className={styles.certCard}>
                    <div className={styles.certCardHeader}>
                      <span className={styles.certCardNum}>{i + 1}</span>
                      <span className={styles.certCardTitle}>
                        Teacher #{i + 1} — {teachersForm.watch(`teachers.${i}.name`) ? `${teachersForm.watch(`teachers.${i}.name`)} ${teachersForm.watch(`teachers.${i}.surname`)}` : "Untitled"}
                      </span>
                      <button type="button" className={styles.removeBtn} onClick={() => removeTeacher(i)} disabled={teacherFields.length <= 1}>✕ Remove</button>
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <div className={styles.twoCol}>
                        <Controller control={teachersForm.control} name={`teachers.${i}.name`} rules={{ required: "Required" }}
                          render={({ field: f, fieldState: fs }) => (
                            <TXT label="First Name" hint="Include title — e.g. Dr. / Yogi" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. Dr. Mahesh or Yogi Deepak" max={60} />
                          )} />
                        <Controller control={teachersForm.control} name={`teachers.${i}.surname`} rules={{ required: "Required" }}
                          render={({ field: f, fieldState: fs }) => (
                            <TXT label="Surname" hint="Shown below the first name on the card" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. Bhatt" max={60} />
                          )} />
                      </div>
                      <DualImageField
                        label="Teacher Photo" hint="Upload a file OR paste an image URL. Recommended 300×350px."
                        urlVal={imgUrl} previewVal={imgPreview}
                        onUrlChange={(url) => { teachersForm.setValue(`teachers.${i}.imgUrl`, url); teachersForm.setValue(`teachers.${i}.imgFile`, null); teachersForm.setValue(`teachers.${i}.imgPreview`, ""); }}
                        onFileChange={(file, preview) => { teachersForm.setValue(`teachers.${i}.imgFile`, file); teachersForm.setValue(`teachers.${i}.imgPreview`, preview); if (file) teachersForm.setValue(`teachers.${i}.imgUrl`, ""); }}
                        recommendedSize="300×350px"
                        required={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {teacherFields.length < 10 && (
              <button type="button" className={styles.addBtn} onClick={() => appendTeacher({ ...DEFAULT_TEACHER })}>
                + Add Teacher
              </button>
            )}
          </div>
          <div className={styles.formDivider} />
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setActiveTab("founder")}>← Previous</button>
            <button
              type="button"
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <><span className={styles.spinner} /> Creating…</>
                : <><span>✦</span> Create Yoga Courses Page</>}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
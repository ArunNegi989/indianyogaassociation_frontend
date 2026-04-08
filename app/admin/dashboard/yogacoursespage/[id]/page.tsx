"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
   Jodit Editor — SSR disabled
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
interface CourseFormItem {
  _id?: string;
  name: string; hours: string; days: string; style: string;
  duration: string; certificate: string; feeShared: string; feePrivate: string;
  color: string; imgUrl: string; imgPreview: string; imgFile: File | null;
  detailsLink: string; bookLink: string;
}
interface TeacherFormItem {
  _id?: string;
  name: string; surname: string;
  imgUrl: string; imgPreview: string; imgFile: File | null;
}
interface CoursesForm {
  eyebrow: string; sectionTitle: string; sectionDesc: string;
  courses: CourseFormItem[];
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
  teachers: TeacherFormItem[];
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
}
function DualImageField({ label, hint, urlVal, previewVal, err, onUrlChange, onFileChange, recommendedSize = "600×400px" }: DualImageProps) {
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
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}<span className={styles.required}>*</span></label>
      <p className={styles.fieldHint}>{hint}</p>
      <div className={styles.dualImgWrapper}>
        <div className={styles.dualImgLeft}>
          <p className={styles.dualImgSubLabel}>Option A — Paste URL</p>
          <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${err && !urlVal ? styles.inputError : ""} ${urlVal && !err ? styles.inputSuccess : ""}`}>
            <span className={styles.inputPrefix}>🔗</span>
            <input type="text" className={`${styles.input} ${styles.inputPrefixed}`} placeholder="https://…" value={urlVal} onChange={(e) => onUrlChange(e.target.value)} />
          </div>
          <p className={styles.dualImgOrDivider}><span>— or —</span></p>
          <p className={styles.dualImgSubLabel}>Option B — Upload File</p>
          <label className={`${styles.uploadArea} ${styles.uploadAreaSm}`} style={{ cursor: "pointer" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0] || null); }}>
            <input ref={fileInputRef} type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleFile(e.target.files?.[0] || null)} />
            <span className={styles.uploadIcon}>🖼</span>
            <span className={styles.uploadText}>Click or drag &amp; drop</span>
            <span className={styles.uploadSubtext}>JPG, PNG, WEBP — {recommendedSize}</span>
          </label>
        </div>
        <div className={styles.dualImgRight}>
          <p className={styles.dualImgSubLabel}>Preview</p>
          {activePreview ? (
            <div className={styles.dualImgPreviewBox}>
              <img src={activePreview} alt="preview" className={styles.dualImgPreviewImg} onError={(e) => (e.currentTarget.style.display = "none")} />
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
   SMALL FIELD PRIMITIVES
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
  const config  = useJoditConfig();
  const edRef   = useRef(null);
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
   SAVED TOAST (inline green chip)
══════════════════════════════════════════════════════ */
function SavedChip({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.55rem 1rem", background:"rgba(74,140,42,0.1)", border:"1px solid rgba(74,140,42,0.3)", borderRadius:8, fontFamily:"'Cormorant Garamond', serif", fontSize:"0.88rem", color:"#2a5e1e", fontStyle:"italic" }}>
      ✓ Saved successfully
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SUBMIT HELPER — builds FormData or JSON and calls API
══════════════════════════════════════════════════════ */
async function submitSection(section: TabId, payload: any, files: { key: string; file: File }[]) {
  if (files.length > 0) {
    const fd = new FormData();
    files.forEach(({ key, file }) => fd.append(key, file));
    fd.append("data", JSON.stringify(payload));
    await api.patch(`/yoga-courses/update-section/${section}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    await api.patch(`/yoga-courses/update-section/${section}`, payload);
  }
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function EditYogaCoursesPage() {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError]   = useState<string | null>(null);
  const [activeTab, setActiveTab]     = useState<TabId>("courses");
  const [savedTab, setSavedTab]       = useState<TabId | null>(null);

  /* ── Per-tab submitting flags ── */
  const [submitting, setSubmitting] = useState<Record<TabId, boolean>>({
    courses: false, who: false, teachersHeader: false, founder: false, teachers: false,
  });
  const setTabSubmitting = (tab: TabId, v: boolean) =>
    setSubmitting((p) => ({ ...p, [tab]: v }));

  /* ══════════ FORM: COURSES ══════════ */
  const coursesForm = useForm<CoursesForm>({
    defaultValues: {
      eyebrow: "", sectionTitle: "", sectionDesc: "",
      courses: [{
        name:"", hours:"", days:"", style:"", duration:"", certificate:"",
        feeShared:"", feePrivate:"", color:"#8B5E3C",
        imgUrl:"", imgPreview:"", imgFile:null, detailsLink:"#", bookLink:"#",
      }],
    },
  });
  const { fields: courseFields, append: appendCourse, remove: removeCourse } =
    useFieldArray({ control: coursesForm.control, name: "courses" });

  /* ══════════ FORM: WHO ══════════ */
  const whoForm = useForm<WhoForm>({
    defaultValues: {
      eyebrow:"", sectionTitle:"", para1:"", para2:"", para3:"", para4:"", para5:"",
      chips:[{ label:"" }], quoteText:"", quoteAttrib:"",
    },
  });
  const { fields: chipFields, append: appendChip, remove: removeChip } =
    useFieldArray({ control: whoForm.control, name: "chips" });

  /* ══════════ FORM: TEACHERS HEADER ══════════ */
  const thForm = useForm<TeachersHeaderForm>({
    defaultValues: {
      eyebrow:"", sectionTitle:"", introPara1:"", introPara1Highlight:"",
      introPara2:"", introPara2Highlight:"", ctaBtnText:"", ctaBtnLink:"",
    },
  });

  /* ══════════ FORM: FOUNDER ══════════ */
  const founderForm = useForm<FounderForm>({
    defaultValues: {
      eyebrow:"", name:"", imgUrl:"", imgPreview:"", imgFile:null, imgAlt:"",
      para1:"", para2:"", para3:"", para3Highlight:"",
      detailsBtnText:"", detailsBtnLink:"#", bookBtnText:"Book Now", bookBtnLink:"#",
    },
  });
  const founderImgUrl     = founderForm.watch("imgUrl");
  const founderImgPreview = founderForm.watch("imgPreview");

  /* ══════════ FORM: TEACHERS ══════════ */
  const teachersForm = useForm<TeachersForm>({
    defaultValues: { teachers:[{ name:"", surname:"", imgUrl:"", imgPreview:"", imgFile:null }] },
  });
  const { fields: teacherFields, append: appendTeacher, remove: removeTeacher } =
    useFieldArray({ control: teachersForm.control, name: "teachers" });

  /* ══════════ FETCH & RESET ALL FORMS ══════════ */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/yoga-courses/get");
        const d   = res.data?.data;
        if (!d) return;

        /* Courses */
        coursesForm.reset({
          eyebrow:      d.sectionHeader?.eyebrow      || "",
          sectionTitle: d.sectionHeader?.sectionTitle || "",
          sectionDesc:  d.sectionHeader?.sectionDesc  || "",
          courses: (d.courses || []).map((c: any) => ({
            _id:         c._id,
            name:        c.name        || "",
            hours:       c.hours       || "",
            days:        c.days        || "",
            style:       c.style       || "",
            duration:    c.duration    || "",
            certificate: c.certificate || "",
            feeShared:   c.feeShared   || "",
            feePrivate:  c.feePrivate  || "",
            color:       c.color       || "#8B5E3C",
            imgUrl:      c.imgUrl      || "",
            imgPreview:  "",
            imgFile:     null,
            detailsLink: c.detailsLink || "#",
            bookLink:    c.bookLink    || "#",
          })),
        });

        /* Who */
        whoForm.reset({
          eyebrow:      d.who?.eyebrow      || "",
          sectionTitle: d.who?.sectionTitle || "",
          para1:        d.who?.para1        || "",
          para2:        d.who?.para2        || "",
          para3:        d.who?.para3        || "",
          para4:        d.who?.para4        || "",
          para5:        d.who?.para5        || "",
          chips:        (d.who?.chips || [""]).map((c: string) => ({ label: c })),
          quoteText:    d.who?.quoteText    || "",
          quoteAttrib:  d.who?.quoteAttrib  || "",
        });

        /* Teachers Header */
        thForm.reset({
          eyebrow:             d.teachersHeader?.eyebrow             || "",
          sectionTitle:        d.teachersHeader?.sectionTitle        || "",
          introPara1:          d.teachersHeader?.introPara1          || "",
          introPara1Highlight: d.teachersHeader?.introPara1Highlight || "",
          introPara2:          d.teachersHeader?.introPara2          || "",
          introPara2Highlight: d.teachersHeader?.introPara2Highlight || "",
          ctaBtnText:          d.teachersHeader?.ctaBtnText          || "",
          ctaBtnLink:          d.teachersHeader?.ctaBtnLink          || "",
        });

        /* Founder */
        founderForm.reset({
          eyebrow:        d.founder?.eyebrow        || "",
          name:           d.founder?.name           || "",
          imgUrl:         d.founder?.imgUrl         || "",
          imgPreview:     "",
          imgFile:        null,
          imgAlt:         d.founder?.imgAlt         || "",
          para1:          d.founder?.para1          || "",
          para2:          d.founder?.para2          || "",
          para3:          d.founder?.para3          || "",
          para3Highlight: d.founder?.para3Highlight || "",
          detailsBtnText: d.founder?.detailsBtnText || "",
          detailsBtnLink: d.founder?.detailsBtnLink || "#",
          bookBtnText:    d.founder?.bookBtnText    || "Book Now",
          bookBtnLink:    d.founder?.bookBtnLink    || "#",
        });

        /* Teachers */
        teachersForm.reset({
          teachers: (d.teachers || []).map((t: any) => ({
            _id:        t._id,
            name:       t.name    || "",
            surname:    t.surname || "",
            imgUrl:     t.imgUrl  || "",
            imgPreview: "",
            imgFile:    null,
          })),
        });
      } catch (err: any) {
        setFetchError(err?.response?.data?.message || "Failed to load data");
      } finally {
        setPageLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ══════════ SAVED TOAST HELPER ══════════ */
  const showSaved = (tab: TabId) => {
    setSavedTab(tab);
    setTimeout(() => setSavedTab(null), 2500);
  };

  /* ══════════ SUBMIT — COURSES ══════════
     THE FIX: payload must be { sectionHeader:{...}, courses:[...] }
     NOT just the courses array — the controller now expects this shape.
  ══════════════════════════════════════════════════════ */
  const onSubmitCourses: SubmitHandler<CoursesForm> = async (data) => {
    setTabSubmitting("courses", true);
    try {
      const files: { key: string; file: File }[] = [];
      const coursesPayload = data.courses.map((c, i) => {
        if (c.imgFile) files.push({ key: `courseImg_${i}`, file: c.imgFile });
        return {
          ...(c._id ? { _id: c._id } : {}),
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
        };
      });

      /* ✅ Send as { sectionHeader, courses } — matches controller fix */
      const payload = {
        sectionHeader: {
          eyebrow:      stripHtml(data.eyebrow),
          sectionTitle: stripHtml(data.sectionTitle),
          sectionDesc:  stripHtml(data.sectionDesc),
        },
        courses: coursesPayload,
      };

      await submitSection("courses", payload, files);
      showSaved("courses");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save courses.");
    } finally {
      setTabSubmitting("courses", false);
    }
  };

  /* ══════════ SUBMIT — WHO ══════════ */
  const onSubmitWho: SubmitHandler<WhoForm> = async (data) => {
    setTabSubmitting("who", true);
    try {
      const payload = {
        eyebrow:      stripHtml(data.eyebrow),
        sectionTitle: stripHtml(data.sectionTitle),
        para1:        stripHtml(data.para1),
        para2:        stripHtml(data.para2),
        para3:        stripHtml(data.para3),
        para4:        stripHtml(data.para4),
        para5:        stripHtml(data.para5),
        chips:        data.chips.map((c) => stripHtml(c.label)).filter(Boolean),
        quoteText:    stripHtml(data.quoteText),
        quoteAttrib:  stripHtml(data.quoteAttrib),
      };
      await submitSection("who", payload, []);
      showSaved("who");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save who section.");
    } finally {
      setTabSubmitting("who", false);
    }
  };

  /* ══════════ SUBMIT — TEACHERS HEADER ══════════ */
  const onSubmitTH: SubmitHandler<TeachersHeaderForm> = async (data) => {
    setTabSubmitting("teachersHeader", true);
    try {
      const payload = {
        eyebrow:             stripHtml(data.eyebrow),
        sectionTitle:        stripHtml(data.sectionTitle),
        introPara1:          stripHtml(data.introPara1),
        introPara1Highlight: stripHtml(data.introPara1Highlight),
        introPara2:          stripHtml(data.introPara2),
        introPara2Highlight: stripHtml(data.introPara2Highlight),
        ctaBtnText:          stripHtml(data.ctaBtnText),
        ctaBtnLink:          data.ctaBtnLink,
      };
      await submitSection("teachersHeader", payload, []);
      showSaved("teachersHeader");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save teachers header.");
    } finally {
      setTabSubmitting("teachersHeader", false);
    }
  };

  /* ══════════ SUBMIT — FOUNDER ══════════ */
  const onSubmitFounder: SubmitHandler<FounderForm> = async (data) => {
    setTabSubmitting("founder", true);
    try {
      const files: { key: string; file: File }[] = [];
      if (data.imgFile) files.push({ key: "founderImg", file: data.imgFile });
      const payload = {
        eyebrow:        stripHtml(data.eyebrow),
        name:           stripHtml(data.name),
        imgUrl:         data.imgFile ? "__upload_founderImg" : data.imgUrl,
        imgAlt:         stripHtml(data.imgAlt),
        para1:          stripHtml(data.para1),
        para2:          stripHtml(data.para2),
        para3:          stripHtml(data.para3),
        para3Highlight: stripHtml(data.para3Highlight),
        detailsBtnText: stripHtml(data.detailsBtnText),
        detailsBtnLink: data.detailsBtnLink || "#",
        bookBtnText:    stripHtml(data.bookBtnText),
        bookBtnLink:    data.bookBtnLink    || "#",
      };
      await submitSection("founder", payload, files);
      showSaved("founder");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save founder.");
    } finally {
      setTabSubmitting("founder", false);
    }
  };

  /* ══════════ SUBMIT — TEACHERS ══════════ */
  const onSubmitTeachers: SubmitHandler<TeachersForm> = async (data) => {
    setTabSubmitting("teachers", true);
    try {
      const files: { key: string; file: File }[] = [];
      const payload = data.teachers
        .filter((t) => t.name.trim() && t.surname.trim())
        .map((t, i) => {
          if (t.imgFile) files.push({ key: `teacherImg_${i}`, file: t.imgFile });
          return {
            ...(t._id ? { _id: t._id } : {}),
            name:    stripHtml(t.name),
            surname: stripHtml(t.surname),
            imgUrl:  t.imgFile ? `__upload_teacherImg_${i}` : t.imgUrl,
          };
        });
      await submitSection("teachers", payload, files);
      showSaved("teachers");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save teachers.");
    } finally {
      setTabSubmitting("teachers", false);
    }
  };

  /* ══════════ LOADING / ERROR SCREENS ══════════ */
  if (pageLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonField} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }
  if (fetchError) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <h2 className={styles.emptyTitle}>Failed to load data</h2>
          <p className={styles.emptyText}>{fetchError}</p>
          <button className={styles.addBtn} onClick={() => window.location.reload()}>↺ Retry</button>
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
        <span className={styles.breadcrumbCurrent}>Edit Page Content</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.editBadge}>✏️ Edit mode — changes save per section</div>
        <h1 className={styles.pageTitle}>Edit — Yoga Courses &amp; Teachers Page</h1>
        <p className={styles.pageSubtitle}>All sections pre-filled with current live data. Save each tab independently.</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Tabs */}
      <div className={styles.tabNav}>
        {(Object.keys(TAB_LABELS) as TabId[]).map((tab) => (
          <button key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(tab)}>
            {savedTab === tab ? "✓ " : ""}{TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          TAB 1 — COURSES
      ══════════════════════════════════════════════════ */}
      {activeTab === "courses" && (
        <form onSubmit={coursesForm.handleSubmit(onSubmitCourses)}>
          <div className={styles.formCard}>

            {/* Section Header */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Section Header</h3></div>
              <Controller control={coursesForm.control} name="eyebrow" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Eyebrow Text" hint='Small text above the heading' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Sacred Path of Yoga" max={80} />
                )} />
              <Controller control={coursesForm.control} name="sectionTitle" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Section Title (H2)" hint="Main heading of the courses section" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Join Our Yoga Teacher Training in Rishikesh" />
                )} />
              <Controller control={coursesForm.control} name="sectionDesc" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TA label="Section Description" hint="Paragraph below the heading" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="Ready to embark on a transformative path…" max={400} rows={3} />
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
                  const errors     = coursesForm.formState.errors.courses?.[i];

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
                              <TXT label="Course Name" hint="Full name shown on card" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. Beginner Yoga Course" max={100} />
                            )} />
                          <Controller control={coursesForm.control} name={`courses.${i}.hours`} rules={{ required: "Required" }}
                            render={({ field: f, fieldState: fs }) => (
                              <TXT label="Hours Label" hint="Badge on image — e.g. 100 HOUR YOGA" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. 100 HOUR YOGA" max={30} />
                            )} />
                        </div>
                        <div className={styles.twoCol}>
                          <Controller control={coursesForm.control} name={`courses.${i}.days`} rules={{ required: "Required" }}
                            render={({ field: f, fieldState: fs }) => (
                              <TXT label="Days Label" hint="Image tag — e.g. 14 Days Program" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. 14 Days Program" max={30} />
                            )} />
                          <Controller control={coursesForm.control} name={`courses.${i}.duration`} rules={{ required: "Required" }}
                            render={({ field: f, fieldState: fs }) => (
                              <TXT label="Duration" hint="Meta value — e.g. 14 Days" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. 14 Days" max={20} />
                            )} />
                        </div>
                        <div className={styles.twoCol}>
                          {/* Style */}
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
                          {/* Certificate */}
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
                                <p className={styles.fieldHint}>Shared accommodation price</p>
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
                                <p className={styles.fieldHint}>Private accommodation price</p>
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
                          hint="Upload a new file OR paste/update an image URL"
                          urlVal={imgUrl}
                          previewVal={imgPreview}
                          err={errors?.imgUrl?.message}
                          onUrlChange={(url) => {
                            coursesForm.setValue(`courses.${i}.imgUrl`, url);
                            coursesForm.setValue(`courses.${i}.imgFile`, null);
                            coursesForm.setValue(`courses.${i}.imgPreview`, "");
                          }}
                          onFileChange={(file, preview) => {
                            coursesForm.setValue(`courses.${i}.imgFile`, file);
                            coursesForm.setValue(`courses.${i}.imgPreview`, preview);
                            if (file) coursesForm.setValue(`courses.${i}.imgUrl`, "");
                          }}
                          recommendedSize="600×400px"
                        />

                        {/* Color */}
                        <div className={styles.fieldGroup}>
                          <label className={styles.label}><span className={styles.labelIcon}>✦</span>Accent Color</label>
                          <p className={styles.fieldHint}>Card overlay gradient (--card-color)</p>
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
                <button type="button" className={styles.addBtn} onClick={() =>
                  appendCourse({ name:"", hours:"", days:"", style:"", duration:"", certificate:"", feeShared:"", feePrivate:"", color:"#8B5E3C", imgUrl:"", imgPreview:"", imgFile:null, detailsLink:"#", bookLink:"#" })
                }>+ Add Course Card</button>
              )}
            </div>

            <div className={styles.formDivider} />
            <div className={styles.formActions}>
              <Link href="/admin/dashboard/yogacoursespage" className={styles.cancelBtn}>← Back to List</Link>
              <div className={styles.actionsRight}>
                <SavedChip show={savedTab === "courses"} />
                <button type="submit" className={`${styles.submitBtn} ${submitting.courses ? styles.submitBtnLoading : ""}`} disabled={submitting.courses}>
                  {submitting.courses ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Update Courses Section</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 2 — WHO
      ══════════════════════════════════════════════════ */}
      {activeTab === "who" && (
        <form onSubmit={whoForm.handleSubmit(onSubmitWho)}>
          <div className={styles.formCard}>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Section Head</h3></div>
              <div className={styles.twoCol}>
                <Controller control={whoForm.control} name="eyebrow" rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <TXT label="Eyebrow" hint="Small label above heading" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Open to All Seekers" max={80} />
                  )} />
                <Controller control={whoForm.control} name="sectionTitle" rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <TXT label="Section Title (H2)" hint="Main heading" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Who Can Join Yoga TTC?" />
                  )} />
              </div>
            </div>
            <div className={styles.formDivider} />
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Left Column — 5 Body Paragraphs</h3></div>
              {(["para1","para2","para3","para4","para5"] as const).map((key, pi) => (
                <Controller key={key} control={whoForm.control} name={key} rules={{ validate: (v) => !isRteEmpty(v) || "Required" }}
                  render={({ field, fieldState }) => (
                    <RTE label={`Paragraph ${pi + 1}`} hint="" val={field.value} err={fieldState.error?.message} onCh={field.onChange} />
                  )} />
              ))}
            </div>
            <div className={styles.formDivider} />
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Feature Chips</h3>
                <span className={styles.sectionBadge}>{chipFields.length}/8</span>
              </div>
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
              {chipFields.length < 8 && (
                <button type="button" className={styles.addBtn} onClick={() => appendChip({ label: "" })}>+ Add Chip</button>
              )}
            </div>
            <div className={styles.formDivider} />
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Quote Block</h3></div>
              <Controller control={whoForm.control} name="quoteText" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TA label="Quote Text" hint='Do not include quote marks' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="Yoga is the journey…" max={200} rows={2} />
                )} />
              <Controller control={whoForm.control} name="quoteAttrib" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Quote Attribution" hint='e.g. "— Bhagavad Gita"' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="— Bhagavad Gita" max={80} />
                )} />
            </div>
            <div className={styles.formDivider} />
            <div className={styles.formActions}>
              <Link href="/admin/dashboard/yogacoursespage" className={styles.cancelBtn}>← Back to List</Link>
              <div className={styles.actionsRight}>
                <SavedChip show={savedTab === "who"} />
                <button type="submit" className={`${styles.submitBtn} ${submitting.who ? styles.submitBtnLoading : ""}`} disabled={submitting.who}>
                  {submitting.who ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Update Who Section</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 3 — TEACHERS HEADER
      ══════════════════════════════════════════════════ */}
      {activeTab === "teachersHeader" && (
        <form onSubmit={thForm.handleSubmit(onSubmitTH)}>
          <div className={styles.formCard}>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Section Head</h3></div>
              <div className={styles.twoCol}>
                <Controller control={thForm.control} name="eyebrow" rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <TXT label="Eyebrow" hint="Small label above heading" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Masters of the Ancient Art" max={80} />
                  )} />
                <Controller control={thForm.control} name="sectionTitle" rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <TXT label="Section Title (H2)" hint="Main heading" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Our Experienced Yoga Teachers" />
                  )} />
              </div>
            </div>
            <div className={styles.formDivider} />
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Intro Paragraphs</h3></div>
              <Controller control={thForm.control} name="introPara1" rules={{ validate: (v) => !isRteEmpty(v) || "Required" }}
                render={({ field, fieldState }) => (
                  <RTE label="Intro Paragraph 1" hint="About the team" val={field.value} err={fieldState.error?.message} onCh={field.onChange} />
                )} />
              <Controller control={thForm.control} name="introPara1Highlight" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Paragraph 1 — Bold Highlight" hint="Phrase wrapped in <strong>" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. hatha yoga teacher training in Rishikesh" max={120} />
                )} />
              <Controller control={thForm.control} name="introPara2" rules={{ validate: (v) => !isRteEmpty(v) || "Required" }}
                render={({ field, fieldState }) => (
                  <RTE label="Intro Paragraph 2" hint="About online courses" val={field.value} err={fieldState.error?.message} onCh={field.onChange} />
                )} />
              <Controller control={thForm.control} name="introPara2Highlight" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Paragraph 2 — Bold Highlight" hint="Phrase wrapped in <strong>" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. online yoga instructor courses" max={120} />
                )} />
            </div>
            <div className={styles.formDivider} />
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>CTA Button</h3></div>
              <div className={styles.twoCol}>
                <Controller control={thForm.control} name="ctaBtnText" rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <TXT label="Button Text" hint="Label on the CTA button" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Our Teachers' Information" max={80} />
                  )} />
                <Controller control={thForm.control} name="ctaBtnLink" rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <LNKF label="Button Link" hint="href for the CTA button" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="/teachers or #" req />
                  )} />
              </div>
            </div>
            <div className={styles.formDivider} />
            <div className={styles.formActions}>
              <Link href="/admin/dashboard/yogacoursespage" className={styles.cancelBtn}>← Back to List</Link>
              <div className={styles.actionsRight}>
                <SavedChip show={savedTab === "teachersHeader"} />
                <button type="submit" className={`${styles.submitBtn} ${submitting.teachersHeader ? styles.submitBtnLoading : ""}`} disabled={submitting.teachersHeader}>
                  {submitting.teachersHeader ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Update Teachers Intro</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 4 — FOUNDER
      ══════════════════════════════════════════════════ */}
      {activeTab === "founder" && (
        <form onSubmit={founderForm.handleSubmit(onSubmitFounder)}>
          <div className={styles.formCard}>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Founder Identity</h3></div>
              <div className={styles.twoCol}>
                <Controller control={founderForm.control} name="eyebrow" rules={{ required: "Required" }}
                  render={({ field, fieldState }) => (
                    <TXT label="Eyebrow / Role Label" hint='Small text above name' val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Founder of AYM Yoga School" max={80} />
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
                label="Founder Photo" hint="Upload a new file OR paste/update an image URL. Recommended 500×600px."
                urlVal={founderImgUrl} previewVal={founderImgPreview}
                err={founderForm.formState.errors.imgUrl?.message}
                onUrlChange={(url) => { founderForm.setValue("imgUrl", url); founderForm.setValue("imgFile", null); founderForm.setValue("imgPreview", ""); }}
                onFileChange={(file, preview) => { founderForm.setValue("imgFile", file); founderForm.setValue("imgPreview", preview); if (file) founderForm.setValue("imgUrl", ""); }}
                recommendedSize="500×600px"
              />
              <Controller control={founderForm.control} name="imgAlt" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Image Alt Text" hint="Accessibility alt text" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Yogi Chetan Mahesh — Founder" max={150} />
                )} />
            </div>
            <div className={styles.formDivider} />
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Bio Paragraphs</h3></div>
              {(["para1","para2","para3"] as const).map((key, pi) => (
                <Controller key={key} control={founderForm.control} name={key} rules={{ validate: (v) => !isRteEmpty(v) || "Required" }}
                  render={({ field, fieldState }) => (
                    <RTE label={`Paragraph ${pi + 1}`} hint="" val={field.value} err={fieldState.error?.message} onCh={field.onChange} />
                  )} />
              ))}
              <Controller control={founderForm.control} name="para3Highlight" rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TXT label="Paragraph 3 — Bold Highlight" hint="Phrase from para 3 wrapped in <strong>" val={field.value} err={fieldState.error?.message} onCh={field.onChange} ph="e.g. Gold Medal recipient" max={80} />
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
              <Link href="/admin/dashboard/yogacoursespage" className={styles.cancelBtn}>← Back to List</Link>
              <div className={styles.actionsRight}>
                <SavedChip show={savedTab === "founder"} />
                <button type="submit" className={`${styles.submitBtn} ${submitting.founder ? styles.submitBtnLoading : ""}`} disabled={submitting.founder}>
                  {submitting.founder ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Update Founder</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════
          TAB 5 — TEACHERS GRID
      ══════════════════════════════════════════════════ */}
      {activeTab === "teachers" && (
        <form onSubmit={teachersForm.handleSubmit(onSubmitTeachers)}>
          <div className={styles.formCard}>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Teacher Cards</h3>
                <span className={styles.sectionBadge}>{teacherFields.length}/10</span>
              </div>
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
                              <TXT label="First Name" hint="Include title — Dr. / Yogi" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. Dr. Mahesh" max={60} />
                            )} />
                          <Controller control={teachersForm.control} name={`teachers.${i}.surname`} rules={{ required: "Required" }}
                            render={({ field: f, fieldState: fs }) => (
                              <TXT label="Surname" hint="Shown below the first name" val={f.value} err={fs.error?.message} onCh={f.onChange} ph="e.g. Bhatt" max={60} />
                            )} />
                        </div>
                        <DualImageField
                          label="Teacher Photo" hint="Upload a new file OR paste/update an image URL. Recommended 300×350px."
                          urlVal={imgUrl} previewVal={imgPreview}
                          onUrlChange={(url) => { teachersForm.setValue(`teachers.${i}.imgUrl`, url); teachersForm.setValue(`teachers.${i}.imgFile`, null); teachersForm.setValue(`teachers.${i}.imgPreview`, ""); }}
                          onFileChange={(file, preview) => { teachersForm.setValue(`teachers.${i}.imgFile`, file); teachersForm.setValue(`teachers.${i}.imgPreview`, preview); if (file) teachersForm.setValue(`teachers.${i}.imgUrl`, ""); }}
                          recommendedSize="300×350px"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {teacherFields.length < 10 && (
                <button type="button" className={styles.addBtn} onClick={() =>
                  appendTeacher({ name:"", surname:"", imgUrl:"", imgPreview:"", imgFile:null })
                }>+ Add Teacher</button>
              )}
            </div>
            <div className={styles.formDivider} />
            <div className={styles.formActions}>
              <Link href="/admin/dashboard/yogacoursespage" className={styles.cancelBtn}>← Back to List</Link>
              <div className={styles.actionsRight}>
                <SavedChip show={savedTab === "teachers"} />
                <button type="submit" className={`${styles.submitBtn} ${submitting.teachers ? styles.submitBtnLoading : ""}`} disabled={submitting.teachers}>
                  {submitting.teachers ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Update Teachers Grid</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

    </div>
  );
}
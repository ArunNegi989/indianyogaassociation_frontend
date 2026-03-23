"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const joditConfig = {
  readonly: false, toolbar: true, spellcheck: true, language: "en",
  toolbarButtonSize: "medium", toolbarAdaptive: false,
  showCharsCounter: false, showWordsCounter: false, showXPathInStatusbar: false,
  askBeforePasteHTML: false, askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  buttons: ["bold","italic","underline","strikethrough","|","font","fontsize","brush","|","paragraph","align","|","ul","ol","|","link","|","undo","redo","|","selectall","cut","copy","paste"],
  uploader: { insertImageAsBase64URI: true },
  height: 220, placeholder: "",
} as any;

const isEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";

/* ─── Divider ─── */
function D() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
      margin: "0.4rem 0 1.8rem"
    }} />
  );
}

/* ─── Section wrapper ─── */
function Sec({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {badge && <span className={styles.sectionBadge}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

/* ─── Field wrapper ─── */
function F({ label, hint, req, children }: { label: string; hint?: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {req && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  );
}

/* ─── Lazy Jodit: editor only mounts when scrolled into view ─── */
function LazyJodit({
  label, hint, cr, err, clr, ph = "Start typing…", h = 200, required = false,
}: {
  label: string; hint?: string; cr: React.MutableRefObject<string>;
  err?: string; clr?: () => void; ph?: string; h?: number; required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "300px" }   // 300px pehle load shuru ho jata hai
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleChange = useCallback((v: string) => {
    cr.current = v;
    if (clr && !isEmpty(v)) clr();
  }, [cr, clr]);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div
        ref={wrapRef}
        className={`${styles.joditWrap} ${err ? styles.joditError : ""}`}
        style={{ minHeight: h }}
      >
        {visible ? (
          <JoditEditor
            config={{ ...joditConfig, placeholder: ph, height: h }}
            onChange={handleChange}
          />
        ) : (
          <div style={{
            height: h,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#faf8f4", border: "1px solid #e8d5b5",
            borderRadius: 8, color: "#bbb", fontSize: 13, cursor: "default",
          }}>
            ✦ Scroll to load editor…
          </div>
        )}
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}

/* ─── String list ─── */
function StrList({ items, onAdd, onRemove, onUpdate, max = 30, ph, label }: {
  items: string[]; onAdd: () => void; onRemove: (i: number) => void;
  onUpdate: (i: number, v: string) => void; max?: number; ph?: string; label: string;
}) {
  return (
    <>
      <div className={styles.listItems}>
        {items.map((val, i) => (
          <div key={i} className={styles.listItemRow}>
            <span className={styles.listNum}>{i + 1}</span>
            <div className={`${styles.inputWrap} ${styles.listInput}`}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                value={val}
                placeholder={ph || "Enter item…"}
                onChange={e => onUpdate(i, e.target.value)}
              />
            </div>
            <button
              type="button"
              className={styles.removeItemBtn}
              onClick={() => onRemove(i)}
              disabled={items.length <= 1}
            >✕</button>
          </div>
        ))}
      </div>
      {items.length < max && (
        <button type="button" className={styles.addItemBtn} onClick={onAdd}>
          ＋ Add {label}
        </button>
      )}
    </>
  );
}

/* ─── Single image uploader ─── */
function SingleImg({ preview, badge, hint, error, onSelect, onRemove }: {
  preview: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void;
}) {
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!preview ? (
          <>
            <input
              type="file" accept="image/*"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
              }}
            />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>Click to Upload</span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={preview} alt="" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input
                type="file" accept="image/*" className={styles.imagePreviewOverlayInput}
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
                }}
              />
            </div>
            <button
              type="button"
              className={styles.removeImageBtn}
              onClick={e => { e.stopPropagation(); onRemove(); }}
            >✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ─── Form data type ─── */
interface FormData {
  slug: string; status: "Active" | "Inactive";
  pageMainH1: string; heroImgAlt: string;
  stat1Icon: string; stat1Val: string; stat1Title: string; stat1Desc: string;
  stat2Icon: string; stat2Val: string; stat2Title: string; stat2Desc: string;
  stat3Icon: string; stat3Val: string; stat3Title: string; stat3Desc: string;
  stat4Icon: string; stat4Val: string; stat4Title: string; stat4Desc: string;
  aimsH3: string; aimsKeyObjLabel: string;
  overviewH2: string; overviewCertName: string; overviewLevel: string;
  overviewEligibility: string; overviewMinAge: string; overviewCredits: string; overviewLanguage: string;
  upcomingDatesH2: string; upcomingDatesSubtext: string;
  feeIncludedTitle: string; feeNotIncludedTitle: string;
  syllabusH3: string;
  mod1Title: string; mod1Intro: string;
  mod2Title: string; mod2Intro: string;
  mod3Title: string; mod3Intro: string;
  mod4Title: string; mod4Intro: string;
  mod5Title: string; mod5Intro: string;
  mod6Title: string; mod6Intro: string;
  mod7Title: string; mod7Intro: string;
  mod8Title: string; mod8Intro: string;
  ashtangaH2: string; ashtangaSubtitle: string; ashtangaImgAlt: string;
  ashtangaPill1: string; ashtangaPill2: string; ashtangaPill3: string;
  primarySeriesH3: string; primarySeriesSubtext: string;
  hathaH2: string; hathaSubtitle: string; hathaImgAlt: string;
  hathaPill1: string; hathaPill2: string; hathaPill3: string;
  asanasH2: string; asanasSubtext: string;
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Content1AddNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  /* images */
  const [heroFile, setHeroFile]         = useState<File | null>(null);
  const [heroPrev, setHeroPrev]         = useState("");
  const [heroErr, setHeroErr]           = useState("");
  const [ashtangaFile, setAshtangaFile] = useState<File | null>(null);
  const [ashtangaPrev, setAshtangaPrev] = useState("");
  const [hathaFile, setHathaFile]       = useState<File | null>(null);
  const [hathaPrev, setHathaPrev]       = useState("");

  /* jodit refs — these never cause re-renders */
  const ip1Ref           = useRef("");
  const ip2Ref           = useRef("");
  const ip3Ref           = useRef("");
  const ip4Ref           = useRef("");
  const aimsIntroRef     = useRef("");
  const aimsOutroRef     = useRef("");
  const syllabusIntroRef = useRef("");
  const mod1Ref          = useRef("");
  const mod2Ref          = useRef("");
  const mod3Ref          = useRef("");
  const mod4Ref          = useRef("");
  const mod5Ref          = useRef("");
  const mod6Ref          = useRef("");
  const mod7Ref          = useRef("");
  const mod8Ref          = useRef("");
  const ashtangaRef      = useRef("");
  const primaryRef       = useRef("");
  const hathaRef         = useRef("");

  /* jodit validation errors */
  const [ip1Err,  setIp1Err]  = useState("");
  const [ip2Err,  setIp2Err]  = useState("");
  const [ip3Err,  setIp3Err]  = useState("");
  const [ip4Err,  setIp4Err]  = useState("");
  const [aimsErr, setAimsErr] = useState("");
  const [sylErr,  setSylErr]  = useState("");
  const [astErr,  setAstErr]  = useState("");
  const [htErr,   setHtErr]   = useState("");

  /* string lists */
  const [aimsBullets, setAimsBullets] = useState<string[]>([""]);
  const [inclFee,     setInclFee]     = useState<string[]>([""]);
  const [notInclFee,  setNotInclFee]  = useState<string[]>([""]);
  const [mod1Items,   setMod1Items]   = useState<string[]>([""]);
  const [mod2Items,   setMod2Items]   = useState<string[]>([""]);
  const [mod3Items,   setMod3Items]   = useState<string[]>([""]);
  const [mod4Items,   setMod4Items]   = useState<string[]>([""]);
  const [mod5Items,   setMod5Items]   = useState<string[]>([""]);
  const [mod6Items,   setMod6Items]   = useState<string[]>([""]);
  const [mod7Items,   setMod7Items]   = useState<string[]>([""]);
  const [mod8Items,   setMod8Items]   = useState<string[]>([""]);
  const [foundItems,  setFoundItems]  = useState<string[]>([""]);

  const [hatha43, setHatha43] = useState<{ n: string; name: string; sub: string }[]>([
    { n: "1", name: "", sub: "" },
  ]);
  const [weekGrid, setWeekGrid] = useState<{ week: string; icon: string; t1: string; d1: string; t2: string; d2: string }[]>([
    { week: "Week 1", icon: "☀️", t1: "", d1: "", t2: "", d2: "" },
  ]);

  /* Generic nested object updater */
  const upd = useCallback(<T,>(arr: T[], set: (v: T[]) => void, i: number, k: keyof T, v: string) => {
    const a = [...arr] as any[];
    a[i] = { ...a[i], [k]: v };
    set(a);
  }, []);

  /* react-hook-form — NO watch() call */
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      slug: "", status: "Active",
      pageMainH1: "200 Hour Yoga Teacher Training in Rishikesh",
      heroImgAlt: "Yoga Students Group",
      stat1Icon: "🕐", stat1Val: "21+",    stat1Title: "Years of Excellence",  stat1Desc: "Our syllabus has been developed over twenty years by dozens of experienced yoga masters.",
      stat2Icon: "👥", stat2Val: "9,075+", stat2Title: "Global Alumni",        stat2Desc: "Join the world's most famous AYM yoga teacher training alumni network.",
      stat3Icon: "⭐", stat3Val: "4.5",    stat3Title: "Star Rating",          stat3Desc: "Rated 4.5 stars on Google, Yoga Alliance, and Facebook by our trainees.",
      stat4Icon: "🔆", stat4Val: "200",    stat4Title: "Hour Certification",   stat4Desc: "Yoga Alliance approved certification recognized worldwide.",
      aimsH3: "200 Hour Yoga Teacher Training Rishikesh India - Aims & Objective",
      aimsKeyObjLabel: "The key aims and objectives of our 200 Hour Multi-Style Yoga Teacher Training Course in Rishikesh India is:",
      overviewH2: "Overview of 200 Hour Yoga Instructor Course Rishikesh India",
      overviewCertName: "200-hour yoga teacher training / Yoga Protocol Instructor (YPI)",
      overviewLevel: "Level-I", overviewMinAge: "No age limit", overviewCredits: "12 credits",
      overviewEligibility: "Physically fit and open for all.",
      overviewLanguage: "English; Hindi (Separate Groups)",
      upcomingDatesH2: "Upcoming Course Dates",
      upcomingDatesSubtext: "Choose your preferred accommodation. Prices include tuition and meals.",
      feeIncludedTitle: "Included in 200 Hour yoga ttc course in india",
      feeNotIncludedTitle: "Not Included in 200 hour yoga ttc course in Rishikesh",
      syllabusH3: "200 Hour Yoga Teacher Training In Rishikesh India - The Syllabus",
      mod1Title: "Module 1: The Philosophy of Yoga",              mod1Intro: "The course covers fundamental concepts underlying Ashtanga Yoga.",
      mod2Title: "Module 2: The Yogic Breathing Techniques/Pranayama", mod2Intro: "You will learn about different types of breathing used in pranayama.",
      mod3Title: "Module 3: The Shat Kriyas (Cleansing Detox)",   mod3Intro: "This module gives you understanding of the detoxification process.",
      mod4Title: "Module 4: Anatomy and Physiology",              mod4Intro: "Teacher will connect ancient science of yoga to the present science.",
      mod5Title: "Module 5: Knowledge of Meditation",             mod5Intro: "Meditation is the key part of yoga teacher training.",
      mod6Title: "Module 6: Mantras, Chants, and Prayers",        mod6Intro: "Mantras are coded in Sanskrit native language of India.",
      mod7Title: "Module 7: Mastering the Art of Teaching Yoga",  mod7Intro: "This module gives you the confidence to take your yoga classes to the next level.",
      mod8Title: "Module 8: Knowledge of Asanas (Yoga Postures)", mod8Intro: "By the end of your training, you will have learned all the poses.",
      ashtangaH2: "Module 8.1: Ashtanga Vinyasa Yoga",
      ashtangaSubtitle: "Discover the transformative practice that synchronizes breath with movement",
      ashtangaImgAlt: "Ashtanga Vinyasa Yoga",
      ashtangaPill1: "📋 Breath-synchronized movement", ashtangaPill2: "🧠 Calms the mind", ashtangaPill3: "🕉️ Ancient practice with modern application",
      primarySeriesH3: "Primary Series Curriculum",
      primarySeriesSubtext: "All students of 200 hour yoga teacher training will practice primary series which includes:",
      hathaH2: "Module 8.2: Hatha Yoga",
      hathaSubtitle: "Discover the traditional, ancient and classical yoga practice",
      hathaImgAlt: "Hatha Yoga",
      hathaPill1: "📋 Traditional & Ancient Practice", hathaPill2: "🎓 YCB Certification Board Level-I", hathaPill3: "✋ Expert Guidance & Correction",
      asanasH2: "Hatha Yoga Asanas",
      asanasSubtext: "Master these essential postures as part of your comprehensive training",
    },
  });

  /* ─── Module configs — memoized so they don't recreate on every render ─── */
  const modConfigs = useMemo(() => [
    { num: "1", name: "Philosophy of Yoga",            items: mod1Items, setItems: setMod1Items, bodyRef: mod1Ref },
    { num: "2", name: "Pranayama",                     items: mod2Items, setItems: setMod2Items, bodyRef: mod2Ref },
    { num: "3", name: "Shat Kriyas (Cleansing Detox)", items: mod3Items, setItems: setMod3Items, bodyRef: mod3Ref },
    { num: "4", name: "Anatomy and Physiology",        items: mod4Items, setItems: setMod4Items, bodyRef: mod4Ref },
    { num: "5", name: "Knowledge of Meditation",       items: mod5Items, setItems: setMod5Items, bodyRef: mod5Ref },
    { num: "6", name: "Mantras, Chants, and Prayers",  items: mod6Items, setItems: setMod6Items, bodyRef: mod6Ref },
    { num: "7", name: "Mastering the Art of Teaching", items: mod7Items, setItems: setMod7Items, bodyRef: mod7Ref },
    { num: "8", name: "Knowledge of Asanas",           items: mod8Items, setItems: setMod8Items, bodyRef: mod8Ref },
  ], [mod1Items, mod2Items, mod3Items, mod4Items, mod5Items, mod6Items, mod7Items, mod8Items]);

  /* ─── Submit ─── */
  const onSubmit = async (data: FormData) => {
    let hasErr = false;
    if (isEmpty(ip1Ref.current))           { setIp1Err("Required");  hasErr = true; }
    if (isEmpty(ip2Ref.current))           { setIp2Err("Required");  hasErr = true; }
    if (isEmpty(ip3Ref.current))           { setIp3Err("Required");  hasErr = true; }
    if (isEmpty(ip4Ref.current))           { setIp4Err("Required");  hasErr = true; }
    if (isEmpty(aimsIntroRef.current))     { setAimsErr("Required"); hasErr = true; }
    if (isEmpty(syllabusIntroRef.current)) { setSylErr("Required");  hasErr = true; }
    if (isEmpty(ashtangaRef.current))      { setAstErr("Required");  hasErr = true; }
    if (isEmpty(hathaRef.current))         { setHtErr("Required");   hasErr = true; }
    if (!heroFile)                         { setHeroErr("Hero image is required"); hasErr = true; }
    if (hasErr) return;

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      const richFields: [string, string][] = [
        ["introPara1",     ip1Ref.current],
        ["introPara2",     ip2Ref.current],
        ["introPara3",     ip3Ref.current],
        ["introPara4",     ip4Ref.current],
        ["aimsIntro",      aimsIntroRef.current],
        ["aimsOutro",      aimsOutroRef.current],
        ["syllabusIntro",  syllabusIntroRef.current],
        ["mod1Body",       mod1Ref.current],
        ["mod2Body",       mod2Ref.current],
        ["mod3Body",       mod3Ref.current],
        ["mod4Body",       mod4Ref.current],
        ["mod5Body",       mod5Ref.current],
        ["mod6Body",       mod6Ref.current],
        ["mod7Body",       mod7Ref.current],
        ["mod8Body",       mod8Ref.current],
        ["ashtangaDesc",   ashtangaRef.current],
        ["primaryIntro",   primaryRef.current],
        ["hathaDesc",      hathaRef.current],
      ];
      richFields.forEach(([k, v]) => fd.append(k, v));

      aimsBullets.forEach(v  => fd.append("aimsBullets", v));
      inclFee.forEach(v      => fd.append("includedFee", v));
      notInclFee.forEach(v   => fd.append("notIncludedFee", v));
      [mod1Items, mod2Items, mod3Items, mod4Items, mod5Items, mod6Items, mod7Items, mod8Items]
        .forEach((arr, i) => arr.forEach(v => fd.append(`mod${i + 1}Items`, v)));
      foundItems.forEach(v   => fd.append("foundationItems", v));
      fd.append("hatha43",   JSON.stringify(hatha43));
      fd.append("weekGrid",  JSON.stringify(weekGrid));
      fd.append("heroImage", heroFile!);
      if (ashtangaFile) fd.append("ashtangaImage", ashtangaFile);
      if (hathaFile)    fd.append("hathaImage",    hathaFile);

      await api.post("/yoga-200hr/content1/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/200hourscourse/200hr-content"), 1500);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── Success screen ─── */
  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Content 1 Saved!</h2>
        <p className={styles.successText}>Redirecting to list…</p>
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className={styles.formPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/yogacourse/200hourscourse/200hr-content")}
        >
         200 hour Content section first
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add New</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Add New — Content Part 1</h1>
          <p className={styles.pageSubtitle}>Sections 1–20 · Hero → Hatha Asanas</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ════ 1. HERO ════ */}
        <Sec title="Hero Section">
          <F label="Page Main H1 Heading">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("pageMainH1")} />
            </div>
          </F>
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg
              preview={heroPrev} badge="Hero" hint="SVG/JPG/PNG · 1180×540px" error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); }}
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Students Group" {...register("heroImgAlt")} />
            </div>
          </F>
        </Sec><D />

        {/* ════ 2. INTRO PARAGRAPHS ════ */}
        <Sec title="Introduction Paragraphs">
          <LazyJodit label="Paragraph 1 — Main Introduction"    cr={ip1Ref} err={ip1Err} clr={() => setIp1Err("")}  ph="Yoga means union…"                           required />
          <LazyJodit label="Paragraph 2 — Years of Experience"  cr={ip2Ref} err={ip2Err} clr={() => setIp2Err("")}  ph="With 25 Years of Experience…"               required />
          <LazyJodit label="Paragraph 3 — Daily Schedule"       cr={ip3Ref} err={ip3Err} clr={() => setIp3Err("")}  ph="Each day of the 200-hour course includes…"  required />
          <LazyJodit label="Paragraph 4 — Yoga Alliance"        cr={ip4Ref} err={ip4Err} clr={() => setIp4Err("")}  ph="We are among the best 200-hour yoga ttc…"   required />
        </Sec><D />

        {/* ════ 3. STATS ════ */}
        <Sec title="Stats Cards (4 cards)">
          {([1, 2, 3, 4] as const).map(n => (
            <div key={n} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Stat Card {n}</span>
              </div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid3}>
                  <F label="Icon"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`stat${n}Icon` as any)} /></div></F>
                  <F label="Value"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`stat${n}Val` as any)} /></div></F>
                  <F label="Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`stat${n}Title` as any)} /></div></F>
                </div>
                <F label="Description">
                  <div className={styles.inputWrap}>
                    <input className={`${styles.input} ${styles.inputNoCount}`} {...register(`stat${n}Desc` as any)} />
                  </div>
                </F>
              </div>
            </div>
          ))}
        </Sec><D />

        {/* ════ 4. AIMS ════ */}
        <Sec title="Aims & Objectives">
          <F label="Section H3 Heading">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("aimsH3")} />
            </div>
          </F>
          <LazyJodit
            label="Aims Introduction" cr={aimsIntroRef} err={aimsErr} clr={() => setAimsErr("")}
            ph="The 200 hour yoga teacher training is carefully designed…" h={180} required
          />
          <F label="Key Objectives Bold Label" hint="Bold sentence before bullet list">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("aimsKeyObjLabel")} />
            </div>
          </F>
          <F label="Aims Bullet Points">
            <StrList
              items={aimsBullets} label="Aim" ph="To deepen personal practice…"
              onAdd={() => setAimsBullets([...aimsBullets, ""])}
              onRemove={i => setAimsBullets(aimsBullets.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...aimsBullets]; a[i] = v; setAimsBullets(a); }}
            />
          </F>
          <LazyJodit
            label="Aims Outro Paragraph (optional)" cr={aimsOutroRef}
            ph="The 200-hour yoga training at AYM Yoga School offers…" h={180}
          />
        </Sec><D />

        {/* ════ 5. OVERVIEW ════ */}
        <Sec title="Course Overview Box">
          <F label="Overview H2 Heading">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewH2")} />
            </div>
          </F>
          <div className={styles.grid2}>
            <F label="Certification Name"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewCertName")} /></div></F>
            <F label="Course Level"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewLevel")} /></div></F>
          </div>
          <F label="Eligibility">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={2} {...register("overviewEligibility")} />
            </div>
          </F>
          <div className={styles.grid3}>
            <F label="Min Age"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewMinAge")} /></div></F>
            <F label="Credits"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewCredits")} /></div></F>
            <F label="Language"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewLanguage")} /></div></F>
          </div>
        </Sec><D />

        {/* ════ 6. UPCOMING DATES ════ */}
        <Sec title="Upcoming Course Dates — Headings" badge="Data from DB">
          <div className={styles.grid2}>
            <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("upcomingDatesH2")} /></div></F>
            <F label="Sub-text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("upcomingDatesSubtext")} /></div></F>
          </div>
        </Sec><D />

        {/* ════ 7. FEE ════ */}
        <Sec title="Fee — Included & Not Included">
          <F label="Included Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeIncludedTitle")} />
            </div>
          </F>
          <F label="Included Items">
            <StrList
              items={inclFee} label="Item" ph="Six days of yoga, meditation and theory classes…"
              onAdd={() => setInclFee([...inclFee, ""])}
              onRemove={i => setInclFee(inclFee.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...inclFee]; a[i] = v; setInclFee(a); }}
            />
          </F>
          <div style={{ marginTop: "1.2rem" }}>
            <F label="Not Included Section Title">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeNotIncludedTitle")} />
              </div>
            </F>
          </div>
          <F label="Not Included Items">
            <StrList
              items={notInclFee} label="Item" ph="Any Airfare."
              onAdd={() => setNotInclFee([...notInclFee, ""])}
              onRemove={i => setNotInclFee(notInclFee.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...notInclFee]; a[i] = v; setNotInclFee(a); }}
            />
          </F>
        </Sec><D />

        {/* ════ 8. SYLLABUS ════ */}
        <Sec title="Syllabus Section">
          <F label="Syllabus H3 Heading">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("syllabusH3")} />
            </div>
          </F>
          <LazyJodit
            label="Syllabus Introduction" cr={syllabusIntroRef} err={sylErr} clr={() => setSylErr("")}
            ph="It is our commitment as yoga school…" h={250} required
          />
        </Sec><D />

        {/* ════ 9–16. MODULES 1–8 ════ */}
        {modConfigs.map(({ num, name, items, setItems, bodyRef }) => (
          <div key={num}>
            <Sec title={`Module ${num}: ${name}`}>
              <F label="Module Title">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} {...register(`mod${num}Title` as any)} />
                </div>
              </F>
              <F label="Module Intro">
                <div className={styles.inputWrap}>
                  <textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3} {...register(`mod${num}Intro` as any)} />
                </div>
              </F>
              <F label="Topics List">
                <StrList
                  items={items} label="Topic" ph="Topic item…"
                  onAdd={() => setItems([...items, ""])}
                  onRemove={i => setItems(items.filter((_, x) => x !== i))}
                  onUpdate={(i, v) => { const a = [...items]; a[i] = v; setItems(a); }}
                />
              </F>
              <LazyJodit
                label="Module Extra Rich Text (optional)" cr={bodyRef}
                ph="Additional description…" h={160}
              />
            </Sec><D />
          </div>
        ))}

        {/* ════ 17. ASHTANGA ════ */}
        <Sec title="Module 8.1 — Ashtanga Vinyasa Yoga">
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ashtangaH2")} /></div></F>
          <F label="Sub-heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ashtangaSubtitle")} /></div></F>
          <F label="Ashtanga Image" hint="700×500px">
            <SingleImg
              preview={ashtangaPrev} badge="Ashtanga" hint="JPG/PNG · 700×500px"
              onSelect={(f, p) => { setAshtangaFile(f); setAshtangaPrev(p); }}
              onRemove={() => { setAshtangaFile(null); setAshtangaPrev(""); }}
            />
          </F>
          <F label="Image Alt Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ashtangaImgAlt")} /></div></F>
          <LazyJodit
            label="Ashtanga Description" cr={ashtangaRef} err={astErr} clr={() => setAstErr("")}
            ph="This form of yoga practice combines breath and body movements…" required
          />
          <div className={styles.grid3}>
            {([1, 2, 3] as const).map(n => (
              <F key={n} label={`Feature Pill ${n}`}>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} {...register(`ashtangaPill${n}` as any)} />
                </div>
              </F>
            ))}
          </div>
        </Sec><D />

        {/* ════ 18. PRIMARY SERIES ════ */}
        <Sec title="Primary Series Curriculum">
          <F label="Section H3"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("primarySeriesH3")} /></div></F>
          <F label="Sub-text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("primarySeriesSubtext")} /></div></F>
          <LazyJodit
            label="Primary Series Intro Paragraph (optional)" cr={primaryRef}
            ph="All students of 200 hour yoga teacher training will practice primary series…" h={180}
          />
          <F label="Foundation Items">
            <StrList
              items={foundItems} label="Item" ph="Introduction to ashtanga vinyasa yoga"
              onAdd={() => setFoundItems([...foundItems, ""])}
              onRemove={i => setFoundItems(foundItems.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...foundItems]; a[i] = v; setFoundItems(a); }}
            />
          </F>
          <F label="Week-by-Week Grid Cards">
            {weekGrid.map((wk, i) => (
              <div key={i} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Week Card {i + 1}</span>
                  <button
                    type="button" className={styles.removeNestedBtn}
                    onClick={() => setWeekGrid(weekGrid.filter((_, x) => x !== i))}
                    disabled={weekGrid.length <= 1}
                  >✕ Remove</button>
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid2}>
                    <F label="Week Label"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={wk.week} placeholder="Week 1" onChange={e => upd(weekGrid, setWeekGrid, i, "week", e.target.value)} /></div></F>
                    <F label="Icon"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={wk.icon} placeholder="☀️" onChange={e => upd(weekGrid, setWeekGrid, i, "icon", e.target.value)} /></div></F>
                    <F label="Item 1 Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={wk.t1} onChange={e => upd(weekGrid, setWeekGrid, i, "t1", e.target.value)} /></div></F>
                    <F label="Item 1 Desc"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={wk.d1} onChange={e => upd(weekGrid, setWeekGrid, i, "d1", e.target.value)} /></div></F>
                    <F label="Item 2 Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={wk.t2} onChange={e => upd(weekGrid, setWeekGrid, i, "t2", e.target.value)} /></div></F>
                    <F label="Item 2 Desc"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={wk.d2} onChange={e => upd(weekGrid, setWeekGrid, i, "d2", e.target.value)} /></div></F>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button" className={styles.addItemBtn}
              onClick={() => setWeekGrid([...weekGrid, { week: `Week ${weekGrid.length + 1}`, icon: "🧘", t1: "", d1: "", t2: "", d2: "" }])}
            >
              ＋ Add Week Card
            </button>
          </F>
        </Sec><D />

        {/* ════ 19. HATHA ════ */}
        <Sec title="Module 8.2 — Hatha Yoga">
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("hathaH2")} /></div></F>
          <F label="Sub-heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("hathaSubtitle")} /></div></F>
          <F label="Hatha Image" hint="700×500px">
            <SingleImg
              preview={hathaPrev} badge="Hatha" hint="JPG/PNG · 700×500px"
              onSelect={(f, p) => { setHathaFile(f); setHathaPrev(p); }}
              onRemove={() => { setHathaFile(null); setHathaPrev(""); }}
            />
          </F>
          <F label="Image Alt Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("hathaImgAlt")} /></div></F>
          <LazyJodit
            label="Hatha Description" cr={hathaRef} err={htErr} clr={() => setHtErr("")}
            ph="Hatha yoga is the traditional, ancient and classical yoga…" required
          />
          <div className={styles.grid3}>
            {([1, 2, 3] as const).map(n => (
              <F key={n} label={`Feature Pill ${n}`}>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} {...register(`hathaPill${n}` as any)} />
                </div>
              </F>
            ))}
          </div>
        </Sec><D />

        {/* ════ 20. HATHA 43 ASANAS ════ */}
        <Sec title="Hatha Yoga Asanas List" badge={`${hatha43.length} asanas`}>
          <div className={styles.grid2}>
            <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("asanasH2")} /></div></F>
            <F label="Sub-text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("asanasSubtext")} /></div></F>
          </div>
          {hatha43.map((a, i) => (
            <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
              <span className={styles.listNum}>{i + 1}</span>
              <div className={styles.inputWrap} style={{ width: 55, flexShrink: 0 }}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={a.n} placeholder="#" onChange={e => upd(hatha43, setHatha43, i, "n", e.target.value)} />
              </div>
              <div className={`${styles.inputWrap} ${styles.listInput}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={a.name} placeholder="Asana name" onChange={e => upd(hatha43, setHatha43, i, "name", e.target.value)} />
              </div>
              <div className={`${styles.inputWrap} ${styles.listInput}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={a.sub} placeholder="Sub name" onChange={e => upd(hatha43, setHatha43, i, "sub", e.target.value)} />
              </div>
              <button
                type="button" className={styles.removeItemBtn}
                onClick={() => setHatha43(hatha43.filter((_, x) => x !== i))}
                disabled={hatha43.length <= 1}
              >✕</button>
            </div>
          ))}
          <button
            type="button" className={styles.addItemBtn}
            onClick={() => setHatha43([...hatha43, { n: String(hatha43.length + 1), name: "", sub: "" }])}
          >
            ＋ Add Asana
          </button>
        </Sec><D />

        {/* ════ SLUG & STATUS ════ */}
        <Sec title="Page Settings">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="200-hour-yoga-teacher-training-rishikesh"
                  {...register("slug", { required: "Required" })}
                />
              </div>
              {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>}
            </F>
            <F label="Status">
              <div className={styles.selectWrap}>
                <select className={styles.select} {...register("status")}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
            </F>
          </div>
        </Sec>

      </div>{/* end formCard */}

      {/* Actions */}
      <div className={styles.formActions}>
        <Link href="/admin/dashboard/yoga-200hr/200hrcontent1" className={styles.cancelBtn}>
          ← Cancel
        </Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? <><span className={styles.spinner} /> Saving…</>
            : <><span>✦</span> Save Content 1</>
          }
        </button>
      </div>

    </div>
  );
}
"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────────── Jodit Config ─────────────────────────── */
const joditConfig = {
  readonly: false, toolbar: true, spellcheck: true, language: "en",
  toolbarButtonSize: "medium", toolbarAdaptive: false,
  showCharsCounter: false, showWordsCounter: false, showXPathInStatusbar: false,
  askBeforePasteHTML: false, askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  buttons: ["bold","italic","underline","strikethrough","|","font","fontsize","brush","|",
    "paragraph","align","|","ul","ol","|","link","|","undo","redo","|","selectall","cut","copy","paste"],
  uploader: { insertImageAsBase64URI: true },
  height: 220, placeholder: "",
} as any;

function isEditorEmpty(html: string) {
  return html.replace(/<[^>]*>/g, "").trim() === "";
}

/* ─────────────────────────── Helper UI ─────────────────────────── */
function Sec({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {badge && <span className={styles.sectionBadge}>{badge}</span>}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

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

function D() { return <div className={styles.sectionDivider}><span>❧</span></div>; }

function JoditField({ label, hint, contentRef, defaultValue = "", error, onClearError, placeholder = "Start typing…", height = 200 }: {
  label: string; hint?: string; contentRef: React.MutableRefObject<string>; defaultValue?: string;
  error?: string; onClearError: () => void; placeholder?: string; height?: number;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}<span className={styles.required}>*</span></label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={`${styles.joditWrap} ${error ? styles.joditError : ""}`}>
        <JoditEditor value={defaultValue} config={{ ...joditConfig, placeholder, height }}
          onChange={val => { contentRef.current = val; if (!isEditorEmpty(val)) onClearError(); }} />
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

function JoditOpt({ label, hint, contentRef, defaultValue = "", placeholder = "Start typing…", height = 180 }: {
  label: string; hint?: string; contentRef: React.MutableRefObject<string>; defaultValue?: string;
  placeholder?: string; height?: number;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={styles.joditWrap}>
        <JoditEditor value={defaultValue} config={{ ...joditConfig, placeholder, height }}
          onChange={val => { contentRef.current = val; }} />
      </div>
    </div>
  );
}

function MultiImageUpload({ files, previews, existingUrls = [], hint, label = "Image", onSelect, onRemove, onRemoveExisting, maxFiles = 8 }: {
  files: File[]; previews: string[]; existingUrls?: string[]; hint: string; label?: string;
  onSelect: (f: File[], p: string[]) => void; onRemove: (i: number) => void;
  onRemoveExisting: (i: number) => void; maxFiles?: number;
}) {
  const totalCount = existingUrls.length + files.length;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sel = Array.from(e.target.files || []);
    if (!sel.length) return;
    const nf = [...files, ...sel].slice(0, maxFiles - existingUrls.length);
    const np = [...previews, ...sel.map(f => URL.createObjectURL(f))].slice(0, maxFiles - existingUrls.length);
    onSelect(nf, np); e.target.value = "";
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "0.7rem" }}>
      {existingUrls.map((url, i) => (
        <div key={`ex-${i}`} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1.5px solid #c9a96e" }}>
          <span className={styles.imageBadge}>{label} {i + 1}</span>
          <img src={url} alt="" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
          <button type="button" className={styles.removeImageBtn} onClick={() => onRemoveExisting(i)}>✕</button>
        </div>
      ))}
      {previews.map((p, i) => (
        <div key={`new-${i}`} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1.5px dashed #c9a96e" }}>
          <span className={styles.imageBadge}>New {existingUrls.length + i + 1}</span>
          <img src={p} alt="" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
          <button type="button" className={styles.removeImageBtn} onClick={() => onRemove(i)}>✕</button>
        </div>
      ))}
      {totalCount < maxFiles && (
        <div className={styles.imageUploadZone} style={{ minHeight: 110, position: "relative" }}>
          <input type="file" accept="image/*" multiple onChange={handleChange}
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 2, width: "100%", height: "100%" }} />
          <div className={styles.imageUploadPlaceholder}>
            <span className={styles.imageUploadIcon}>🖼️</span>
            <span className={styles.imageUploadText}>Add Photo</span>
            <span className={styles.imageUploadSub}>{hint}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SingleImageUpload({ preview, existingUrl, badge, hint, error, onSelect, onRemove }: {
  preview: string; existingUrl?: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void;
}) {
  const displaySrc = preview || existingUrl || "";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    onSelect(file, URL.createObjectURL(file)); e.target.value = "";
  };
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${displaySrc ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!displaySrc ? (
          <>
            <input type="file" accept="image/*" onChange={handleChange} />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>Click to Upload</span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={displaySrc} alt="preview" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput} onChange={handleChange} />
            </div>
            <button type="button" className={styles.removeImageBtn} onClick={e => { e.stopPropagation(); onRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

function StringListField({ items, label, placeholder, onAdd, onRemove, onUpdate }: {
  items: string[]; label: string; placeholder: string;
  onAdd: () => void; onRemove: (i: number) => void; onUpdate: (i: number, v: string) => void;
}) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.4rem" }}>
          <span className={styles.listNum}>{i + 1}</span>
          <div className={`${styles.inputWrap} ${styles.listInput}`}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item}
              placeholder={placeholder} onChange={e => onUpdate(i, e.target.value)} />
          </div>
          <button type="button" className={styles.removeItemBtn}
            onClick={() => onRemove(i)} disabled={items.length <= 1}>✕</button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={onAdd}>＋ Add {label}</button>
    </div>
  );
}

function StarRatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
          style={{ fontSize: "1.6rem", cursor: "pointer", lineHeight: 1, userSelect: "none",
            color: star <= (hovered || value) ? "#f5a623" : "#d1c5b0", transition: "color 0.15s" }}>
          ★
        </span>
      ))}
      <span style={{ marginLeft: "0.4rem", fontSize: "0.85rem", color: "#8a7560", fontWeight: 500 }}>
        {value > 0 ? `${value} / 5` : "No rating"}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN EDIT FORM — CONTENT 2 (Sections 21–39)
══════════════════════════════════════════════════════════════════ */
export default function Content2Edit() {
  const router   = useRouter();
  const { id }   = useParams<{ id: string }>();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: { status: "Active" } });
  const w = watch();

  const [loading,      setLoading]      = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [fetchErr,     setFetchErr]     = useState("");

  /* ── Jodit Refs (initialized with "" — will be filled after API load) ── */
  const evalRef         = useRef("");
  const schedDescRef    = useRef("");
  const visaRef         = useRef("");
  const globalCert1Ref  = useRef("");
  const globalCert2Ref  = useRef("");
  const req1Ref         = useRef("");
  const req2Ref         = useRef("");
  const req3Ref         = useRef("");
  const req4Ref         = useRef("");
  const best200HrRef    = useRef("");
  const step1Ref        = useRef("");
  const step2Ref        = useRef("");
  const step3Ref        = useRef("");
  const step4Ref        = useRef("");

  /* ── Jodit default values for render ── */
  const [joditDefaults, setJoditDefaults] = useState<Record<string, string>>({});

  /* ── Dynamic lists ── */
  const [programs, setPrograms]   = useState<{ title: string; duration: string; start: string; oldPrice: string; price: string }[]>([]);
  const progRefs  = useRef<React.MutableRefObject<string>[]>([]);
  const [progDefaults, setProgDefaults] = useState<string[]>([]);

  const [reviews, setReviews]     = useState<{ name: string; role: string; rating: number }[]>([]);
  const revRefs   = useRef<React.MutableRefObject<string>[]>([]);
  const [revDefaults, setRevDefaults]   = useState<string[]>([]);

  /* ── Image states ── */
  const [accomFiles,    setAccomFiles]      = useState<File[]>([]);
  const [accomPrevs,    setAccomPrevs]      = useState<string[]>([]);
  const [accomExisting, setAccomExisting]   = useState<string[]>([]);
  const [foodFiles,     setFoodFiles]       = useState<File[]>([]);
  const [foodPrevs,     setFoodPrevs]       = useState<string[]>([]);
  const [foodExisting,  setFoodExisting]    = useState<string[]>([]);
  const [luxImgFiles,   setLuxImgFiles]     = useState<File[]>([]);
  const [luxImgPrevs,   setLuxImgPrevs]     = useState<string[]>([]);
  const [luxImgExisting,setLuxImgExisting]  = useState<string[]>([]);
  const [schedImgFiles, setSchedImgFiles]   = useState<File[]>([]);
  const [schedImgPrevs, setSchedImgPrevs]   = useState<string[]>([]);
  const [schedImgExisting,setSchedImgExisting]=useState<string[]>([]);
  const [reqImgFile,    setReqImgFile]      = useState<File | null>(null);
  const [reqImgPrev,    setReqImgPrev]      = useState("");
  const [reqImgExisting,setReqImgExisting]  = useState("");

  /* ── List states ── */
  const [inclFee,    setInclFee]    = useState<string[]>([""]);
  const [notInclFee, setNotInclFee] = useState<string[]>([""]);
  const [luxFeatures,setLuxFeatures]= useState<string[]>([""]);
  const [whatIncl,   setWhatIncl]   = useState<string[]>([""]);
  const [instrLangs, setInstrLangs] = useState([{ lang: "", note: "" }]);
  const [indianFees, setIndianFees] = useState([{ label: "", price: "" }]);
  const [schedRows,  setSchedRows]  = useState([{ time: "", activity: "" }]);
  const [faqItems,   setFaqItems]   = useState([{ q: "", a: "" }]);
  const [knowQA,     setKnowQA]     = useState([{ q: "", a: "" }]);

  /* ── Jodit errors ── */
  const [evErr, setEvErr] = useState("");

  /* ── Helper ── */
  const upd = <T,>(arr: T[], set: (v: T[]) => void, i: number, k: keyof T, v: string) => {
    const a = [...arr] as any[]; a[i] = { ...a[i], [k]: v }; set(a);
  };

  /* ══════════════════════════════════════
     FETCH EXISTING DATA
  ══════════════════════════════════════ */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/yoga-200hr/content2/${id}`);
        const d   = res.data?.data;

        // ── Text fields (react-hook-form reset) ──
        reset({
          evalH2: d.evalH2 ?? "",
          accommodationH2: d.accommodationH2 ?? "",
          foodH2: d.foodH2 ?? "",
          luxuryH2: d.luxuryH2 ?? "",
          indianFeeH2: d.indianFeeH2 ?? "",
          scheduleH2: d.scheduleH2 ?? "",
          moreInfoH2: d.moreInfoH2 ?? "",
          spanishChineseNote: d.spanishChineseNote ?? "",
          eligibilityInfoTitle: d.eligibilityInfoTitle ?? "",
          eligibilityInfoText: d.eligibilityInfoText ?? "",
          visaPassportTitle: d.visaPassportTitle ?? "",
          ctaTitle: d.ctaTitle ?? "",
          ctaSubtitle: d.ctaSubtitle ?? "",
          ctaPhone: d.ctaPhone ?? "",
          ctaApplyBtnText: d.ctaApplyBtnText ?? "",
          newProgramsH2: d.newProgramsH2 ?? "",
          newProgramsSubtext: d.newProgramsSubtext ?? "",
          globalCertH2: d.globalCertH2 ?? "",
          requirementsH2: d.requirementsH2 ?? "",
          requirementsImgAlt: d.requirementsImgAlt ?? "",
          whatYouNeedH2: d.whatYouNeedH2 ?? "",
          best200HrH4: d.best200HrH4 ?? "",
          whatsIncludedH4: d.whatsIncludedH4 ?? "",
          reviewsH2: d.reviewsH2 ?? "",
          reviewsSubtext: d.reviewsSubtext ?? "",
          videosH2: d.videosH2 ?? "",
          video1Label: d.video1Label ?? "", video1Url: d.video1Url ?? "", video1Thumb: d.video1Thumb ?? "",
          video2Label: d.video2Label ?? "", video2Url: d.video2Url ?? "", video2Thumb: d.video2Thumb ?? "",
          video3Label: d.video3Label ?? "", video3Url: d.video3Url ?? "", video3Thumb: d.video3Thumb ?? "",
          bookingH2: d.bookingH2 ?? "",
          step1Icon: d.step1Icon ?? "", step1Title: d.step1Title ?? "",
          step2Icon: d.step2Icon ?? "", step2Title: d.step2Title ?? "",
          step3Icon: d.step3Icon ?? "", step3Title: d.step3Title ?? "",
          step4Icon: d.step4Icon ?? "", step4Title: d.step4Title ?? "",
          faqH2: d.faqH2 ?? "",
          metaTitle: d.metaTitle ?? "",
          metaDesc: d.metaDesc ?? "",
          slug: d.slug ?? "",
          metaKeywords: d.metaKeywords ?? "",
          status: d.status ?? "Active",
        });

        // ── Jodit defaults ──
        const jd: Record<string, string> = {
          evalDesc: d.evalDesc ?? "",
          schedDesc: d.schedDesc ?? "",
          visaPassportDesc: d.visaPassportDesc ?? "",
          globalCert1: d.globalCert1 ?? "",
          globalCert2: d.globalCert2 ?? "",
          req1: d.req1 ?? "",
          req2: d.req2 ?? "",
          req3: d.req3 ?? "",
          req4: d.req4 ?? "",
          best200Hr: d.best200Hr ?? "",
          bookingStep1Desc: d.bookingStep1Desc ?? "",
          bookingStep2Desc: d.bookingStep2Desc ?? "",
          bookingStep3Desc: d.bookingStep3Desc ?? "",
          bookingStep4Desc: d.bookingStep4Desc ?? "",
        };
        setJoditDefaults(jd);
        // Populate refs
        evalRef.current         = jd.evalDesc;
        schedDescRef.current    = jd.schedDesc;
        visaRef.current         = jd.visaPassportDesc;
        globalCert1Ref.current  = jd.globalCert1;
        globalCert2Ref.current  = jd.globalCert2;
        req1Ref.current         = jd.req1;
        req2Ref.current         = jd.req2;
        req3Ref.current         = jd.req3;
        req4Ref.current         = jd.req4;
        best200HrRef.current    = jd.best200Hr;
        step1Ref.current        = jd.bookingStep1Desc;
        step2Ref.current        = jd.bookingStep2Desc;
        step3Ref.current        = jd.bookingStep3Desc;
        step4Ref.current        = jd.bookingStep4Desc;

        // ── Programs ──
        const progs = d.programs?.length ? d.programs : [{ title: "", duration: "", start: "", oldPrice: "", price: "", desc: "" }];
        setPrograms(progs.map((p: any) => ({ title: p.title ?? "", duration: p.duration ?? "", start: p.start ?? "", oldPrice: p.oldPrice ?? "", price: p.price ?? "" })));
        progRefs.current = progs.map(() => ({ current: "" }));
        setProgDefaults(progs.map((p: any) => p.desc ?? ""));
        progs.forEach((p: any, i: number) => { if (progRefs.current[i]) progRefs.current[i].current = p.desc ?? ""; });

        // ── Reviews ──
        const revs = d.reviews?.length ? d.reviews : [{ name: "", role: "", rating: 5, reviewText: "" }];
        setReviews(revs.map((r: any) => ({ name: r.name ?? "", role: r.role ?? "", rating: r.rating ?? 5 })));
        revRefs.current = revs.map(() => ({ current: "" }));
        setRevDefaults(revs.map((r: any) => r.reviewText ?? ""));
        revs.forEach((r: any, i: number) => { if (revRefs.current[i]) revRefs.current[i].current = r.reviewText ?? ""; });

        // ── Images ──
        setAccomExisting(d.accomImages ?? []);
        setFoodExisting(d.foodImages ?? []);
        setLuxImgExisting(d.luxImages ?? []);
        setSchedImgExisting(d.schedImages ?? []);
        setReqImgExisting(d.reqImage ?? "");

        // ── Lists ──
        setInclFee(d.inclFee?.length    ? d.inclFee    : [""]);
        setNotInclFee(d.notInclFee?.length ? d.notInclFee : [""]);
        setLuxFeatures(d.luxFeatures?.length ? d.luxFeatures : [""]);
        setWhatIncl(d.whatIncl?.length  ? d.whatIncl   : [""]);
        setInstrLangs(d.instrLangs?.length ? d.instrLangs : [{ lang: "", note: "" }]);
        setIndianFees(d.indianFees?.length ? d.indianFees : [{ label: "", price: "" }]);
        setSchedRows(d.schedRows?.length ? d.schedRows  : [{ time: "", activity: "" }]);
        setFaqItems(d.faqItems?.length   ? d.faqItems   : [{ q: "", a: "" }]);
        setKnowQA(d.knowQA?.length       ? d.knowQA     : [{ q: "", a: "" }]);

      } catch {
        setFetchErr("Record load nahi ho saka.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ══════════════════════════════════════
     SUBMIT (PUT)
  ══════════════════════════════════════ */
  const onSubmit = async (data: any) => {
    if (isEditorEmpty(evalRef.current)) { setEvErr("Required"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    setIsSubmitting(true);
    try {
      const fd = new FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v ?? "")));

      fd.append("evalDesc",         evalRef.current);
      fd.append("schedDesc",        schedDescRef.current);
      fd.append("visaPassportDesc", visaRef.current);
      fd.append("globalCert1",      globalCert1Ref.current);
      fd.append("globalCert2",      globalCert2Ref.current);
      fd.append("req1",             req1Ref.current);
      fd.append("req2",             req2Ref.current);
      fd.append("req3",             req3Ref.current);
      fd.append("req4",             req4Ref.current);
      fd.append("best200Hr",        best200HrRef.current);
      fd.append("bookingStep1Desc", step1Ref.current);
      fd.append("bookingStep2Desc", step2Ref.current);
      fd.append("bookingStep3Desc", step3Ref.current);
      fd.append("bookingStep4Desc", step4Ref.current);

      const progs = programs.map((p, i) => ({ ...p, desc: progRefs.current[i]?.current ?? "" }));
      fd.append("programs", JSON.stringify(progs));

      const revs = reviews.map((r, i) => ({ ...r, reviewText: revRefs.current[i]?.current ?? "" }));
      fd.append("reviews", JSON.stringify(revs));

      fd.append("inclFee",     JSON.stringify(inclFee));
      fd.append("notInclFee",  JSON.stringify(notInclFee));
      fd.append("luxFeatures", JSON.stringify(luxFeatures));
      fd.append("whatIncl",    JSON.stringify(whatIncl));
      fd.append("instrLangs",  JSON.stringify(instrLangs));
      fd.append("indianFees",  JSON.stringify(indianFees));
      fd.append("schedRows",   JSON.stringify(schedRows));
      fd.append("faqItems",    JSON.stringify(faqItems));
      fd.append("knowQA",      JSON.stringify(knowQA));

      // Existing image URLs to keep
      fd.append("keepAccomImages",  JSON.stringify(accomExisting));
      fd.append("keepFoodImages",   JSON.stringify(foodExisting));
      fd.append("keepLuxImages",    JSON.stringify(luxImgExisting));
      fd.append("keepSchedImages",  JSON.stringify(schedImgExisting));
      fd.append("keepReqImage",     reqImgExisting);

      // New images
      accomFiles.forEach(f    => fd.append("accomImages",  f));
      foodFiles.forEach(f     => fd.append("foodImages",   f));
      luxImgFiles.forEach(f   => fd.append("luxImages",    f));
      schedImgFiles.forEach(f => fd.append("schedImages",  f));
      if (reqImgFile) fd.append("reqImage", reqImgFile);

      await api.put(`/yoga-200hr/content2/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yoga-200hr/200hrcontent2/list"), 1500);
    } catch {
      alert("Update nahi ho saka. Dobara try karo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className={styles.loadingWrap} style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <span className={styles.spinner} style={{ width: 40, height: 40 }} />
        <span style={{ color: "#8a7560" }}>Data load ho raha hai…</span>
      </div>
    );
  }

  /* ── Fetch error ── */
  if (fetchErr) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyOm}>⚠</div>
        <h3 className={styles.emptyTitle}>{fetchErr}</h3>
        <Link href="/admin/dashboard/yoga-200hr/200hrcontent2/list" className={styles.addNewBtn}>← Back to List</Link>
      </div>
    );
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successOm}>ॐ</div>
        <h2 className={styles.successTitle}>Content 2 Updated!</h2>
        <p className={styles.successText}>List page pe redirect ho rahe hain…</p>
      </div>
    );
  }

  /* ══════════════════════════════════════ RENDER ══════════════════════════════════════ */
  return (
    <div className={styles.pageWrap}>

      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/dashboard/yoga-200hr/200hrcontent2/list" className={styles.backLink}>← Back to List</Link>
          <h1 className={styles.pageTitle}>Edit — Content Part 2</h1>
          <p className={styles.pageSubtitle}>Sections 21–39: Evaluation · Accommodation · Food · Schedule · Programs · Reviews · FAQ · SEO</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ════ 21. EVALUATION ════ */}
        <Sec title="Evaluation & Certification">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("evalH2")} /></div>
          </F>
          <JoditField label="Evaluation Description" contentRef={evalRef} defaultValue={joditDefaults.evalDesc}
            error={evErr} onClearError={() => setEvErr("")} placeholder="There will be practical and theoretical exam…" height={220} />
        </Sec>
        <D />

        {/* ════ 22. ACCOMMODATION ════ */}
        <Sec title="Accommodation">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("accommodationH2")} /></div>
          </F>
          <F label="Accommodation Images" hint="Up to 8 photos">
            <MultiImageUpload files={accomFiles} previews={accomPrevs} existingUrls={accomExisting}
              hint="JPG/PNG · 400px wide" label="Room" maxFiles={8}
              onSelect={(f, p) => { setAccomFiles(f); setAccomPrevs(p); }}
              onRemove={i => { setAccomFiles(accomFiles.filter((_, x) => x !== i)); setAccomPrevs(accomPrevs.filter((_, x) => x !== i)); }}
              onRemoveExisting={i => setAccomExisting(accomExisting.filter((_, x) => x !== i))} />
          </F>
        </Sec>
        <D />

        {/* ════ 23. FOOD ════ */}
        <Sec title="Food">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("foodH2")} /></div>
          </F>
          <F label="Food Images" hint="Up to 8 photos">
            <MultiImageUpload files={foodFiles} previews={foodPrevs} existingUrls={foodExisting}
              hint="JPG/PNG · 400px wide" label="Food" maxFiles={8}
              onSelect={(f, p) => { setFoodFiles(f); setFoodPrevs(p); }}
              onRemove={i => { setFoodFiles(foodFiles.filter((_, x) => x !== i)); setFoodPrevs(foodPrevs.filter((_, x) => x !== i)); }}
              onRemoveExisting={i => setFoodExisting(foodExisting.filter((_, x) => x !== i))} />
          </F>
        </Sec>
        <D />

        {/* ════ 24. LUXURY ════ */}
        <Sec title="Luxury Room & Features">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("luxuryH2")} /></div>
          </F>
          <F label="Luxury Features List">
            <StringListField items={luxFeatures} label="Feature" placeholder="Accommodation (Private)"
              onAdd={() => setLuxFeatures([...luxFeatures, ""])}
              onRemove={i => setLuxFeatures(luxFeatures.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...luxFeatures]; a[i] = v; setLuxFeatures(a); }} />
          </F>
          <F label="Luxury Room Images" hint="Up to 4 images">
            <MultiImageUpload files={luxImgFiles} previews={luxImgPrevs} existingUrls={luxImgExisting}
              hint="JPG/PNG · 400px wide" label="Luxury" maxFiles={4}
              onSelect={(f, p) => { setLuxImgFiles(f); setLuxImgPrevs(p); }}
              onRemove={i => { setLuxImgFiles(luxImgFiles.filter((_, x) => x !== i)); setLuxImgPrevs(luxImgPrevs.filter((_, x) => x !== i)); }}
              onRemoveExisting={i => setLuxImgExisting(luxImgExisting.filter((_, x) => x !== i))} />
          </F>
        </Sec>
        <D />

        {/* ════ 25. INDIAN FEES ════ */}
        <Sec title="Course Fee for Indian Students">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("indianFeeH2")} /></div>
          </F>
          {indianFees.map((fee, i) => (
            <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem" }}>
              <span className={styles.listNum}>{i + 1}</span>
              <div className={`${styles.inputWrap} ${styles.listInput}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={fee.label} placeholder="Dormitory:"
                  onChange={e => upd(indianFees, setIndianFees, i, "label", e.target.value)} />
              </div>
              <div className={`${styles.inputWrap} ${styles.listInput}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={fee.price} placeholder="20,999 INR"
                  onChange={e => upd(indianFees, setIndianFees, i, "price", e.target.value)} />
              </div>
              <button type="button" className={styles.removeItemBtn}
                onClick={() => setIndianFees(indianFees.filter((_, x) => x !== i))} disabled={indianFees.length <= 1}>✕</button>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={() => setIndianFees([...indianFees, { label: "", price: "" }])}>＋ Add Fee Tier</button>
        </Sec>
        <D />

        {/* ════ 26. SCHEDULE ════ */}
        <Sec title="Class Schedule">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("scheduleH2")} /></div>
          </F>
          <JoditOpt label="Schedule Introduction" contentRef={schedDescRef} defaultValue={joditDefaults.schedDesc} placeholder="Planning on teaching yoga?…" height={180} />
          <F label="Schedule Rows (Time → Activity)">
            {schedRows.map((row, i) => (
              <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem" }}>
                <span className={styles.listNum}>{i + 1}</span>
                <div className={styles.inputWrap} style={{ width: 200, flexShrink: 0 }}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={row.time} placeholder="06:45 AM - 08:00 AM"
                    onChange={e => upd(schedRows, setSchedRows, i, "time", e.target.value)} />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={row.activity} placeholder="Pranayama / Meditation"
                    onChange={e => upd(schedRows, setSchedRows, i, "activity", e.target.value)} />
                </div>
                <button type="button" className={styles.removeItemBtn}
                  onClick={() => setSchedRows(schedRows.filter((_, x) => x !== i))} disabled={schedRows.length <= 1}>✕</button>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={() => setSchedRows([...schedRows, { time: "", activity: "" }])}>＋ Add Row</button>
          </F>
          <F label="Schedule Images" hint="Up to 4 images">
            <MultiImageUpload files={schedImgFiles} previews={schedImgPrevs} existingUrls={schedImgExisting}
              hint="JPG/PNG · 300px wide" label="Schedule" maxFiles={4}
              onSelect={(f, p) => { setSchedImgFiles(f); setSchedImgPrevs(p); }}
              onRemove={i => { setSchedImgFiles(schedImgFiles.filter((_, x) => x !== i)); setSchedImgPrevs(schedImgPrevs.filter((_, x) => x !== i)); }}
              onRemoveExisting={i => setSchedImgExisting(schedImgExisting.filter((_, x) => x !== i))} />
          </F>
        </Sec>
        <D />

        {/* ════ 27. MORE INFORMATION ════ */}
        <Sec title="More Information Section">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("moreInfoH2")} /></div>
          </F>
          <F label="Medium of Instruction Languages">
            {instrLangs.map((row, i) => (
              <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem" }}>
                <span className={styles.listNum}>{i + 1}</span>
                <div className={styles.inputWrap} style={{ width: 140, flexShrink: 0 }}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={row.lang} placeholder="English"
                    onChange={e => upd(instrLangs, setInstrLangs, i, "lang", e.target.value)} />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={row.note} placeholder="course happens every month"
                    onChange={e => upd(instrLangs, setInstrLangs, i, "note", e.target.value)} />
                </div>
                <button type="button" className={styles.removeItemBtn}
                  onClick={() => setInstrLangs(instrLangs.filter((_, x) => x !== i))} disabled={instrLangs.length <= 1}>✕</button>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={() => setInstrLangs([...instrLangs, { lang: "", note: "" }])}>＋ Add Language</button>
          </F>
          <F label="Spanish & Chinese Note">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("spanishChineseNote")} /></div>
          </F>
          <F label="Eligibility Criteria Sub-heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("eligibilityInfoTitle")} /></div>
          </F>
          <F label="Eligibility Criteria Text">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3} {...register("eligibilityInfoText")} /></div>
          </F>
          <F label="Visa & Passport Sub-heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("visaPassportTitle")} /></div>
          </F>
          <JoditOpt label="Visa & Passport Information" contentRef={visaRef} defaultValue={joditDefaults.visaPassportDesc} placeholder="You may need to have a valid tourist visa…" height={200} />
        </Sec>
        <D />

        {/* ════ 28. CTA BANNER ════ */}
        <Sec title="CTA Banner">
          <F label="CTA Title">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ctaTitle")} /></div>
          </F>
          <div className={styles.grid3}>
            <F label="CTA Subtitle"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ctaSubtitle")} /></div></F>
            <F label="Phone Number"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ctaPhone")} /></div></F>
            <F label="Apply Button Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ctaApplyBtnText")} /></div></F>
          </div>
        </Sec>
        <D />

        {/* ════ 29. NEW PROGRAMS ════ */}
        <Sec title="New 200 Hour Programs" badge={`${programs.length} programs`}>
          <div className={styles.grid2}>
            <F label="Section H2 Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("newProgramsH2")} /></div></F>
            <F label="Sub-text below heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("newProgramsSubtext")} /></div></F>
          </div>
          {programs.map((prog, i) => (
            <div key={i} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Program {i + 1}</span>
                <button type="button" className={styles.removeNestedBtn}
                  onClick={() => { setPrograms(programs.filter((_, x) => x !== i)); progRefs.current = progRefs.current.filter((_, x) => x !== i); }}
                  disabled={programs.length <= 1}>✕ Remove</button>
              </div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  <F label="Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.title} onChange={e => upd(programs, setPrograms, i, "title", e.target.value)} /></div></F>
                  <F label="Duration"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.duration} onChange={e => upd(programs, setPrograms, i, "duration", e.target.value)} /></div></F>
                  <F label="Start Date"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.start} onChange={e => upd(programs, setPrograms, i, "start", e.target.value)} /></div></F>
                  <F label="Old Price"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.oldPrice} onChange={e => upd(programs, setPrograms, i, "oldPrice", e.target.value)} /></div></F>
                  <F label="New Price"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.price} onChange={e => upd(programs, setPrograms, i, "price", e.target.value)} /></div></F>
                </div>
                <JoditOpt label="Program Description" contentRef={progRefs.current[i]} defaultValue={progDefaults[i] ?? ""} placeholder="Program description…" height={140} />
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn}
            onClick={() => { setPrograms([...programs, { title: "", duration: "", start: "", oldPrice: "", price: "" }]); progRefs.current = [...progRefs.current, { current: "" }]; }}>
            ＋ Add New Program
          </button>
        </Sec>
        <D />

        {/* ════ 30. GLOBALLY CERTIFIED ════ */}
        <Sec title="Get Globally Certified Section">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("globalCertH2")} /></div>
          </F>
          <JoditOpt label="Paragraph 1" contentRef={globalCert1Ref} defaultValue={joditDefaults.globalCert1} placeholder="At Association for Yoga and Meditation…" height={160} />
          <JoditOpt label="Paragraph 2" contentRef={globalCert2Ref} defaultValue={joditDefaults.globalCert2} placeholder="As the best 200 Hour Yoga Teacher Teaching Course…" height={160} />
        </Sec>
        <D />

        {/* ════ 31. REQUIREMENTS ════ */}
        <Sec title="Requirements — Enrolment Section">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("requirementsH2")} /></div>
          </F>
          <F label="Requirements Section Image" hint="Recommended 600×450px">
            <SingleImageUpload preview={reqImgPrev} existingUrl={reqImgExisting} badge="Requirements" hint="JPG / PNG · 600×450px"
              onSelect={(f, p) => { setReqImgFile(f); setReqImgPrev(p); setReqImgExisting(""); }}
              onRemove={() => { setReqImgFile(null); setReqImgPrev(""); setReqImgExisting(""); }} />
          </F>
          <F label="Requirements Image Alt Text">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("requirementsImgAlt")} /></div>
          </F>
          <JoditOpt label="Paragraph 1" contentRef={req1Ref} defaultValue={joditDefaults.req1} placeholder="AYM Yoga School provides…" height={160} />
          <JoditOpt label="Paragraph 2" contentRef={req2Ref} defaultValue={joditDefaults.req2} placeholder="The basic requirements for a 200 hour RYT…" height={160} />
          <JoditOpt label="Paragraph 3" contentRef={req3Ref} defaultValue={joditDefaults.req3} placeholder="The applicant must have…" height={140} />
          <JoditOpt label="Paragraph 4" contentRef={req4Ref} defaultValue={joditDefaults.req4} placeholder="The basics of anatomy should include…" height={140} />
        </Sec>
        <D />

        {/* ════ 32. WHAT YOU NEED TO KNOW ════ */}
        <Sec title="What You Need to Know — Q&A Blocks" badge={`${knowQA.length} blocks`}>
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("whatYouNeedH2")} /></div>
          </F>
          {knowQA.map((item, i) => (
            <div key={i} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Q&A Block {i + 1}</span>
                <button type="button" className={styles.removeNestedBtn}
                  onClick={() => setKnowQA(knowQA.filter((_, x) => x !== i))} disabled={knowQA.length <= 1}>✕ Remove</button>
              </div>
              <div className={styles.nestedCardBody}>
                <F label="Question / Sub-heading">
                  <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.q}
                    onChange={e => { const a = [...knowQA]; a[i] = { ...a[i], q: e.target.value }; setKnowQA(a); }} /></div>
                </F>
                <F label="Answer">
                  <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={5}
                    value={item.a} onChange={e => { const a = [...knowQA]; a[i] = { ...a[i], a: e.target.value }; setKnowQA(a); }} /></div>
                </F>
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={() => setKnowQA([...knowQA, { q: "", a: "" }])}>＋ Add Q&A Block</button>
        </Sec>
        <D />

        {/* ════ 33. BEST 200HR ════ */}
        <Sec title="Best 200 Hour Yoga Teacher Training">
          <F label="Sub-heading (H4)">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("best200HrH4")} /></div>
          </F>
          <JoditOpt label="Best 200hr Paragraph" contentRef={best200HrRef} defaultValue={joditDefaults.best200Hr} placeholder="Where is the best yoga teacher training…" height={160} />
        </Sec>
        <D />

        {/* ════ 34. WHAT'S INCLUDED IN FEE ════ */}
        <Sec title="What's Included in Fee (Final List)">
          <F label="Sub-heading (H4)">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("whatsIncludedH4")} /></div>
          </F>
          <F label="Included Items">
            <StringListField items={whatIncl} label="Item" placeholder="Yoga course fee."
              onAdd={() => setWhatIncl([...whatIncl, ""])}
              onRemove={i => setWhatIncl(whatIncl.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...whatIncl]; a[i] = v; setWhatIncl(a); }} />
          </F>
        </Sec>
        <D />

        {/* ════ 35. REVIEWS ════ */}
        <Sec title="Student Reviews" badge={`${reviews.length} reviews`}>
          <div className={styles.grid2}>
            <F label="Section H2 Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("reviewsH2")} /></div></F>
            <F label="Sub-text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("reviewsSubtext")} /></div></F>
          </div>
          {reviews.map((rev, i) => (
            <div key={i} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Review {i + 1}</span>
                <button type="button" className={styles.removeNestedBtn}
                  onClick={() => { setReviews(reviews.filter((_, x) => x !== i)); revRefs.current = revRefs.current.filter((_, x) => x !== i); }}
                  disabled={reviews.length <= 1}>✕ Remove</button>
              </div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  <F label="Name"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={rev.name}
                    onChange={e => { const a = [...reviews]; a[i] = { ...a[i], name: e.target.value }; setReviews(a); }} /></div></F>
                  <F label="Role / Location"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={rev.role}
                    onChange={e => { const a = [...reviews]; a[i] = { ...a[i], role: e.target.value }; setReviews(a); }} /></div></F>
                </div>
                <F label="Star Rating">
                  <StarRatingPicker value={rev.rating} onChange={val => { const a = [...reviews]; a[i] = { ...a[i], rating: val }; setReviews(a); }} />
                </F>
                <JoditOpt label="Review Text" contentRef={revRefs.current[i]} defaultValue={revDefaults[i] ?? ""} placeholder="Review text…" height={140} />
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn}
            onClick={() => { setReviews([...reviews, { name: "", role: "", rating: 5 }]); revRefs.current = [...revRefs.current, { current: "" }]; }}>
            ＋ Add Review
          </button>
        </Sec>
        <D />

        {/* ════ 36. VIDEO TESTIMONIALS ════ */}
        <Sec title="Video Testimonials">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("videosH2")} /></div>
          </F>
          {[1, 2, 3].map(n => (
            <div key={n} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Video {n}</span></div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid3}>
                  <F label="Label"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`video${n}Label`)} /></div></F>
                  <F label="YouTube URL"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`video${n}Url`)} /></div></F>
                  <F label="Thumbnail URL"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`video${n}Thumb`)} /></div></F>
                </div>
              </div>
            </div>
          ))}
        </Sec>
        <D />

        {/* ════ 37. BOOKING STEPS ════ */}
        <Sec title="How to Book — Steps (4)">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("bookingH2")} /></div>
          </F>
          {([
            [1, step1Ref, joditDefaults.bookingStep1Desc],
            [2, step2Ref, joditDefaults.bookingStep2Desc],
            [3, step3Ref, joditDefaults.bookingStep3Desc],
            [4, step4Ref, joditDefaults.bookingStep4Desc],
          ] as [number, React.MutableRefObject<string>, string][]).map(([n, ref, def]) => (
            <div key={n} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Step {n}</span></div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  <F label="Icon (emoji)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`step${n}Icon`)} /></div></F>
                  <F label="Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`step${n}Title`)} /></div></F>
                </div>
                <JoditOpt label="Step Description" contentRef={ref} defaultValue={def ?? ""} placeholder="Step description…" height={130} />
              </div>
            </div>
          ))}
        </Sec>
        <D />

        {/* ════ 38. FAQ ════ */}
        <Sec title="Frequently Asked Questions" badge={`${faqItems.length} questions`}>
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("faqH2")} /></div>
          </F>
          {faqItems.map((item, i) => (
            <div key={i} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>FAQ {i + 1}</span>
                <button type="button" className={styles.removeNestedBtn}
                  onClick={() => setFaqItems(faqItems.filter((_, x) => x !== i))} disabled={faqItems.length <= 1}>✕ Remove</button>
              </div>
              <div className={styles.nestedCardBody}>
                <F label="Question">
                  <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.q}
                    onChange={e => { const a = [...faqItems]; a[i] = { ...a[i], q: e.target.value }; setFaqItems(a); }} /></div>
                </F>
                <F label="Answer">
                  <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3}
                    value={item.a} onChange={e => { const a = [...faqItems]; a[i] = { ...a[i], a: e.target.value }; setFaqItems(a); }} /></div>
                </F>
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={() => setFaqItems([...faqItems, { q: "", a: "" }])}>＋ Add FAQ</button>
        </Sec>
        <D />

        {/* ════ 39. SEO & META ════ */}
        <Sec title="SEO & Meta">
          <F label="Meta Title" req>
            <div className={`${styles.inputWrap} ${errors.metaTitle ? styles.inputError : ""}`}>
              <input className={styles.input} maxLength={70} placeholder="200 Hour Yoga Teacher Training in Rishikesh | AYM"
                {...register("metaTitle", { required: "Required" })} />
              <span className={`${styles.charCount} ${styles.charCountMid}`}>{w.metaTitle?.length ?? 0}/70</span>
            </div>
            {errors.metaTitle && <p className={styles.errorMsg}>⚠ {errors.metaTitle.message as string}</p>}
          </F>
          <F label="Meta Description" req>
            <div className={`${styles.inputWrap} ${errors.metaDesc ? styles.inputError : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`} maxLength={160}
                placeholder="Short description for search engines..." {...register("metaDesc", { required: "Required" })} />
              <span className={styles.charCount}>{w.metaDesc?.length ?? 0}/160</span>
            </div>
            {errors.metaDesc && <p className={styles.errorMsg}>⚠ {errors.metaDesc.message as string}</p>}
          </F>
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} {...register("slug", { required: "Required" })} />
              </div>
              {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug.message as string}</p>}
            </F>
            <F label="Meta Keywords">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("metaKeywords")} /></div>
            </F>
          </div>
          <F label="Status">
            <div className={styles.selectWrap}>
              <select className={styles.select} {...register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
          </F>
        </Sec>

        {/* ── Submit ── */}
        <div className={styles.formActions}>
          <Link href="/admin/dashboard/yoga-200hr/200hrcontent2/list" className={styles.cancelBtn}>✕ Cancel</Link>
          <button
            type="submit"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <><span className={styles.spinner} /> Updating…</> : <><span>✦</span> Update Content 2</>}
          </button>
        </div>

      </form>
    </div>
  );
}
"use client";

import { useState, useRef, useCallback, useEffect, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter} from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/* ─────────────────────────────────────────
   JODIT CONFIG
───────────────────────────────────────── */
function makeConfig(ph: string, h: number) {
  return {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "middle" as const,
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html" as const,
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "font", "fontsize", "brush", "|",
      "paragraph", "align", "|",
      "ul", "ol", "|",
      "link", "|",
      "undo", "redo", "|",
      "selectall", "cut", "copy", "paste",
    ],
    uploader: { insertImageAsBase64URI: true },
    height: h,
    placeholder: ph,
    enter: "p" as const,
  };
}

/* ─── Divider ─── */
function D() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
      margin: "0.4rem 0 1.8rem",
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
        <span className={styles.labelIcon}>✦</span>
        {label}
        {req && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  );
}

/* ─── Stable Jodit ─── */
const StableJodit = memo(function StableJodit({
  onSave, value, ph = "Start typing…", h = 200, err,
}: { onSave: (v: string) => void; value?: string; ph?: string; h?: number; err?: string }) {
  const [visible, setVisible] = useState(false);
  const [editorValue, setEditorValue] = useState(value || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), [ph, h]);

  const handleChange = useCallback((val: string) => {
    setEditorValue(val);
    onSaveRef.current(val);
  }, []);

  useEffect(() => { setEditorValue(value || ""); }, [value]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: "300px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`${styles.joditWrap} ${err ? styles.joditError : ""}`} style={{ minHeight: h }}>
      {visible ? (
        <JoditEditor config={config} value={editorValue} onChange={handleChange} />
      ) : (
        <div style={{
          height: h, display: "flex", alignItems: "center", justifyContent: "center",
          background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8, color: "#bbb", fontSize: 13,
        }}>
          ✦ Scroll to load editor…
        </div>
      )}
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
});

/* ─── Rich List Item ─── */
const RichListItem = memo(function RichListItem({
  id, index, total, onSave, onRemove, value, ph,
}: { id: string; index: number; total: number; onSave: (id: string, v: string) => void; onRemove: (id: string) => void; value?: string; ph?: string }) {
  const handleSave = useCallback((v: string) => { onSave(id, v); }, [id, onSave]);
  return (
    <div className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardNum}>Paragraph {index + 1}</span>
        {total > 1 && (
          <button type="button" className={styles.removeNestedBtn} onClick={() => onRemove(id)}>
            ✕ Remove
          </button>
        )}
      </div>
      <div className={styles.nestedCardBody}>
        <StableJodit onSave={handleSave} value={value || ""} key={value} ph={ph} h={180} />
      </div>
    </div>
  );
});

/* ─── Single Image Uploader ─── */
function SingleImg({ preview, badge, hint, error, onSelect, onRemove }: {
  preview: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void;
}) {
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!preview ? (
          <>
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
            }} />
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
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput} onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
              }} />
            </div>
            <button type="button" className={styles.removeImageBtn} onClick={(e) => { e.stopPropagation(); onRemove(); }}>
              ✕
            </button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════
   SCHEDULE MANAGER
══════════════════════════════════════════ */
interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { id: "s1", time: "07.00h – 08.00h", activity: "Meditation / Pranayama" },
  { id: "s2", time: "08.00h – 08.30h", activity: "Tea" },
  { id: "s3", time: "08.30h – 10.00h", activity: "Pregnancy yoga" },
  { id: "s4", time: "10.00h – 10.30h", activity: "Breakfast" },
  { id: "s5", time: "10.30h – 11.30h", activity: "Philosophy" },
  { id: "s6", time: "12.00h – 13.00h", activity: "Teaching Practice" },
  { id: "s7", time: "13.00h – 14.45h", activity: "Lunch Break" },
  { id: "s8", time: "14.45h – 16.00h", activity: "Anatomy" },
  { id: "s9", time: "16.30h – 18.00h", activity: "Asana Practice" },
  { id: "s10", time: "19.30h – 20.30h", activity: "Light Dinner" },
];

function ScheduleManager({ items, onChange }: { items: ScheduleItem[]; onChange: (v: ScheduleItem[]) => void }) {
  const update = useCallback((id: string, field: keyof ScheduleItem, value: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }, [items, onChange]);

  const add = () => onChange([...items, { id: `s-${Date.now()}`, time: "", activity: "" }]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.6rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Schedule Row {idx + 1}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Time</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.time} placeholder="07.00h – 08.00h"
                    onChange={(e) => update(item.id, "time", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Activity</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.activity} placeholder="Meditation / Pranayama"
                    onChange={(e) => update(item.id, "activity", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Schedule Row
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   CURRICULUM MODULES MANAGER (Online/Offline)
══════════════════════════════════════════ */
interface CurriculumItem {
  id: string;
  title: string;
  hours: string;
}

const DEFAULT_CURRICULUM: CurriculumItem[] = [
  { id: "cu1", title: "Asana class, One pranayama, Meditation and Kriya Class", hours: "35" },
  { id: "cu2", title: "Teaching Methodology (TM) — Teaching Skills", hours: "10" },
  { id: "cu3", title: "Prenatal Anatomy & Physiology (AP)", hours: "10" },
  { id: "cu4", title: "Yoga Philosophy for Mothers (YPLE)", hours: "10" },
  { id: "cu5", title: "Practicum teaching and feedback (Online video watching – Self)", hours: "20" },
  { id: "cu6", title: "Supplementary hours – Mantra and Kirtan", hours: "2" },
];

function CurriculumManager({ items, onChange }: { items: CurriculumItem[]; onChange: (v: CurriculumItem[]) => void }) {
  const update = useCallback((id: string, field: keyof CurriculumItem, value: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }, [items, onChange]);

  const add = () => onChange([...items, { id: `cu-${Date.now()}`, title: "", hours: "" }]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.6rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Module {idx + 1}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup} style={{ gridColumn: "span 1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Module Title</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.title}
                    placeholder="Asana class, One pranayama…"
                    onChange={(e) => update(item.id, "title", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Hours</label>
                <div className={styles.inputWrap}>
                  <input type="number" className={styles.input} value={item.hours} placeholder="10"
                    onChange={(e) => update(item.id, "hours", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Module
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   HOURS SUMMARY MANAGER
══════════════════════════════════════════ */
interface HoursSummaryItem {
  id: string;
  label: string;
  value: string;
}

const DEFAULT_HOURS_SUMMARY: HoursSummaryItem[] = [
  { id: "hs1", label: "Total Hours", value: "100 Hours" },
  { id: "hs2", label: "Contact Hours", value: "35 + 10 + 10 + 10 + 20 + 2 = 87 Hours" },
  { id: "hs3", label: "Non-contact Hours", value: "13 Hours" },
  { id: "hs4", label: "Yoga Course Package Price", value: "USD 399" },
];

function HoursSummaryManager({ items, onChange }: { items: HoursSummaryItem[]; onChange: (v: HoursSummaryItem[]) => void }) {
  const update = useCallback((id: string, field: keyof HoursSummaryItem, value: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }, [items, onChange]);

  const add = () => onChange([...items, { id: `hs-${Date.now()}`, label: "", value: "" }]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.listItemRow}>
          <span className={styles.listNum}>{idx + 1}</span>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 2 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.label}
              placeholder="Label (e.g. Total Hours)" onChange={(e) => update(item.id, "label", e.target.value)} />
          </div>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 3 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.value}
              placeholder="Value (e.g. 100 Hours)" onChange={(e) => update(item.id, "value", e.target.value)} />
          </div>
          <button type="button" className={styles.removeItemBtn} onClick={() => remove(item.id)} disabled={items.length <= 1}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Row
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   HERO IMAGE GRID MANAGER (3 images)
══════════════════════════════════════════ */
interface HeroGridImage {
  file: File | null;
  preview: string;
  alt: string;
}

function HeroGridManager({ images, onChange }: {
  images: HeroGridImage[];
  onChange: (images: HeroGridImage[]) => void;
}) {
  const updateAlt = (idx: number, alt: string) => {
    const updated = [...images];
    updated[idx] = { ...updated[idx], alt };
    onChange(updated);
  };

  const updateImage = (idx: number, file: File, preview: string) => {
    const updated = [...images];
    updated[idx] = { ...updated[idx], file, preview };
    onChange(updated);
  };

  const removeImage = (idx: number) => {
    const updated = [...images];
    updated[idx] = { file: null, preview: "", alt: updated[idx].alt };
    onChange(updated);
  };

  return (
    <div className={styles.grid2} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
      {images.map((img, idx) => (
        <div key={idx} className={styles.fieldGroup}>
          <label className={styles.label} style={{ fontSize: "0.8rem" }}>Image {idx + 1}</label>
          <SingleImg
            preview={img.preview}
            badge={`Grid ${idx + 1}`}
            hint="JPG/PNG/WEBP · 600×400px"
            onSelect={(f, p) => updateImage(idx, f, p)}
            onRemove={() => removeImage(idx)}
          />
          <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={img.alt}
              placeholder={`Alt text for image ${idx + 1}`}
              onChange={(e) => updateAlt(idx, e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   useParaList HOOK
══════════════════════════════════════════ */
function useParaList(initId: string, initVal = "") {
  const [ids, setIds] = useState<string[]>([initId]);
  const ref = useRef<Record<string, string>>({ [initId]: initVal });

  const add = useCallback(() => {
    const id = `${initId}-${Date.now()}`;
    ref.current[id] = "";
    setIds((p) => [...p, id]);
  }, [initId]);

  const remove = useCallback((id: string) => {
    delete ref.current[id];
    setIds((p) => p.filter((x) => x !== id));
  }, []);

  const save = useCallback((id: string, v: string) => { ref.current[id] = v; }, []);

  const loadFromArray = useCallback((arr: string[], prefix: string) => {
    const newIds: string[] = [];
    arr.forEach((p, i) => {
      const id = `${prefix}${i}`;
      newIds.push(id);
      ref.current[id] = p;
    });
    setIds(newIds);
  }, []);

  return { ids, ref, add, remove, save, loadFromArray };
}

/* ══════════════════════════════════════════
   FORM VALUES INTERFACE
══════════════════════════════════════════ */
interface PageFormValues {
  slug: string;
  status: "Active" | "Inactive";
  /* Section 1 — Hero */
  pageTitleH1: string;
  heroImgAlt: string;
  /* Section 2 — Intro / About */
  introSectionTitle: string;
  introPara1: string;
  introPara2: string;
  introPara3: string;
  /* Section 3 — Course Features */
  featuresSectionTitle: string;
  featuresSuperLabel: string;
  featuresPara1: string;
  featuresPara2: string;
  /* Section 3a — Location */
  locationSubTitle: string;
  locationPara: string;
  /* Section 4 — Batch Table */
  batchSectionTitle: string;
  joinBtnText: string;
  joinBtnUrl: string;
  /* Section 5 — TTC Costs */
  costsSectionTitle: string;
  costsPara: string;
  /* Section 6 — Online Course */
  onlineSectionTitle: string;
  onlinePara: string;
  /* Meta */
  metaTitle: string;
  metaDescription: string;
}

/* ══════════════════════════════════════════
   MAIN FORM COMPONENT
══════════════════════════════════════════ */
export default function AddEditPrenatalYogaTTCPage() {
  const router = useRouter();
 
const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  /* ── Hero Image ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");

  /* ── Location Image ── */
  const [locationImageFile, setLocationImageFile] = useState<File | null>(null);
  const [locationImagePrev, setLocationImagePrev] = useState("");

  /* ── Hero Grid Images (3) ── */
  const [heroGridImages, setHeroGridImages] = useState<HeroGridImage[]>([
    { file: null, preview: "", alt: "Prenatal yoga pose with bolster" },
    { file: null, preview: "", alt: "Prenatal yoga pose with chair support" },
    { file: null, preview: "", alt: "Prenatal yoga triangle pose" },
  ]);

  /* ── Rich text refs ── */
  const introPara1Ref = useRef("");
  const introPara2Ref = useRef("");
  const introPara3Ref = useRef("");
  const featuresPara1Ref = useRef("");
  const featuresPara2Ref = useRef("");
  const locationParaRef = useRef("");
  const costParaRef = useRef("");
  const onlineParaRef = useRef("");

  /* ── Para lists (for sections that need multiple paragraphs) ── */
  const introExtraParaList = useParaList("iep1");
  const featuresExtraParaList = useParaList("fep1");
  const costsExtraParaList = useParaList("cep1");
  const onlineExtraParaList = useParaList("oep1");

  /* ── Dynamic lists ── */
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>(DEFAULT_CURRICULUM);
  const [hoursSummary, setHoursSummary] = useState<HoursSummaryItem[]>(DEFAULT_HOURS_SUMMARY);

  /* ── useForm ── */
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PageFormValues>({
    defaultValues: {
      slug: "",
      status: "Active",
      pageTitleH1: "Pregnancy Yoga Course in Rishikesh",
      heroImgAlt: "Yoga Students Group",
      introSectionTitle: "Pregnancy Yoga Course in Rishikesh",
      introPara1: "Pregnancy is one of the most crucial and beautiful phases in a woman's life. During this time, her body undergoes significant physical and emotional changes. To support women during this sacred journey, AYM Yoga School offers the best prenatal yoga teacher training in Rishikesh, including our specialized 85-hour prenatal yoga course designed to meet the needs of expecting mothers.",
      introPara2: "Our program blends traditional techniques with modern approaches, incorporating Garbh Sanskar practices to nurture both the mother and the baby. From mindfulness and emotional balance to building strength and preparing for childbirth, this certification course provides holistic support for a healthy and joyful pregnancy.",
      introPara3: "Join AYM - the trusted name in pregnancy and prenatal yoga in Rishikesh—and experience a transformative journey toward motherhood.",
      featuresSectionTitle: "Prenatal Yoga Teacher Training Course Features",
      featuresSuperLabel: "Course Structure",
      featuresPara1: "Being at the top of the list of best pregnancy yoga courses in Rishikesh, we offer tailored courses for pregnant women. We aim to offer a soothing journey towards a healthy pregnancy. Our courses include different forms and techniques of yoga and practical guidance.",
      featuresPara2: "All the techniques are beneficial for expecting mothers. In addition to teaching, our pregnancy yoga course in Rishikesh also involves practical workshops to offer you hands-on experience.",
      locationSubTitle: "Prenatal Yoga School in Rishikesh – Location",
      locationPara: "AYM Yoga Ashram is set back in the stunning location of Tapovan, Rishikesh and is surrounded by beautiful mountains, waterfalls, and supreme tranquility. The famous Laxman Jhula Bridge over the graceful and holy Ganges River is just a 12-minute walk from our ashram.",
      batchSectionTitle: "Upcoming Prenatal Yoga Teacher Training India 2026",
      joinBtnText: "Join Your Yoga Journey",
      joinBtnUrl: "#",
      costsSectionTitle: "Prenatal Yoga TTC Costs and How to Apply",
      costsPara: "Course Fee: 399 USD. This fee includes food, accommodation and course fees. To apply send us an email.",
      onlineSectionTitle: "Online Pregnancy Yoga Teacher Training in Rishikesh",
      onlinePara: "Detailed Structure of the course for online and offline course.",
      metaTitle: "Pregnancy Yoga Course in Rishikesh | AYM Yoga School",
      metaDescription: "Join AYM Yoga School for the best prenatal yoga teacher training in Rishikesh. 85-hour certified program blending traditional and modern techniques.",
    },
  });

  /* ── Fetch on edit ── */
  useEffect(() => {
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const res = await api.get(`/prenatal-page`);
      const d = res.data?.data;

      if (!d) return;

      setIsEdit(true); // 🔥 important

   const textFields: (keyof PageFormValues)[] = [
  "slug", "status", "pageTitleH1", "heroImgAlt",
  "introSectionTitle", "introPara1", "introPara2", "introPara3",
  "featuresSectionTitle", "featuresSuperLabel", "featuresPara1", "featuresPara2",
  "locationSubTitle", "locationPara",
  "batchSectionTitle", "joinBtnText", "joinBtnUrl",
  "costsSectionTitle", "costsPara",
  "onlineSectionTitle", "onlinePara",
  "metaTitle", "metaDescription",
];

     textFields.forEach((k) => {
  if (d[k] !== undefined) {
    setValue(k, d[k] as PageFormValues[typeof k]);
  }

  // ✅ RICH TEXT
introPara1Ref.current = d.introPara1 || "";
introPara2Ref.current = d.introPara2 || "";
introPara3Ref.current = d.introPara3 || "";

featuresPara1Ref.current = d.featuresPara1 || "";
featuresPara2Ref.current = d.featuresPara2 || "";

locationParaRef.current = d.locationPara || "";
costParaRef.current = d.costsPara || "";
onlineParaRef.current = d.onlinePara || "";

// ✅ IMAGES
if (d.heroImage) {
  setHeroPrev(BASE_URL + d.heroImage);
}

if (d.locationImage) {
  setLocationImagePrev(BASE_URL + d.locationImage);
}

// ✅ HERO GRID
if (d.heroGridImages?.length) {
  setHeroGridImages(
    d.heroGridImages.map((img: any) => ({
      file: null,
      preview: BASE_URL + img.url,
      alt: img.alt || "",
    }))
  );
}

// ✅ SCHEDULE
if (d.schedule) {
  setSchedule(
    d.schedule.map((s: any, i: number) => ({
      id: "s" + i,
      time: s.time,
      activity: s.activity,
    }))
  );
}

// ✅ CURRICULUM
if (d.curriculum) {
  setCurriculum(
    d.curriculum.map((c: any, i: number) => ({
      id: "cu" + i,
      title: c.title,
      hours: c.hours,
    }))
  );
}

// ✅ HOURS SUMMARY
if (d.hoursSummary) {
  setHoursSummary(
    d.hoursSummary.map((h: any, i: number) => ({
      id: "hs" + i,
      label: h.label,
      value: h.value,
    }))
  );
}

// ✅ EXTRA PARAGRAPHS
if (d.introExtraParagraphs) {
  introExtraParaList.loadFromArray(d.introExtraParagraphs, "iep");
}

if (d.featuresExtraParagraphs) {
  featuresExtraParaList.loadFromArray(d.featuresExtraParagraphs, "fep");
}

if (d.costsExtraParagraphs) {
  costsExtraParaList.loadFromArray(d.costsExtraParagraphs, "cep");
}

if (d.onlineExtraParagraphs) {
  onlineExtraParaList.loadFromArray(d.onlineExtraParagraphs, "oep");
}
});

      // rest same as your code
    } catch {
      toast.error("Failed to load page data");
    } finally {
      setLoadingData(false);
    }
  };

  fetchData();
}, []);
  /* ── Submit ── */
  const onSubmit = async (data: PageFormValues) => {
    if (!heroFile && !heroPrev) {
      setHeroErr("Hero image is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();

      /* Basic fields */
      Object.entries(data).forEach(([k, v]) => {
        const skipKeys = ["introPara1", "introPara2", "introPara3", "featuresPara1", "featuresPara2", "locationPara", "costsPara", "onlinePara"];
        if (!skipKeys.includes(k)) fd.append(k, v ?? "");
      });

      /* Rich text */
      fd.append("introPara1", introPara1Ref.current || "");
      fd.append("introPara2", introPara2Ref.current || "");
      fd.append("introPara3", introPara3Ref.current || "");
      fd.append("featuresPara1", featuresPara1Ref.current || "");
      fd.append("featuresPara2", featuresPara2Ref.current || "");
      fd.append("locationPara", locationParaRef.current || "");
      fd.append("costsPara", costParaRef.current || "");
      fd.append("onlinePara", onlineParaRef.current || "");

      /* Para lists */
      fd.append("introExtraParagraphs", JSON.stringify(introExtraParaList.ids.map(id => introExtraParaList.ref.current[id] || "")));
      fd.append("featuresExtraParagraphs", JSON.stringify(featuresExtraParaList.ids.map(id => featuresExtraParaList.ref.current[id] || "")));
      fd.append("costsExtraParagraphs", JSON.stringify(costsExtraParaList.ids.map(id => costsExtraParaList.ref.current[id] || "")));
      fd.append("onlineExtraParagraphs", JSON.stringify(onlineExtraParaList.ids.map(id => onlineExtraParaList.ref.current[id] || "")));

      /* Dynamic lists */
      fd.append("schedule", JSON.stringify(schedule));
      fd.append("curriculum", JSON.stringify(curriculum));
      fd.append("hoursSummary", JSON.stringify(hoursSummary));

      /* Hero grid images alts */
      fd.append("heroGridAlts", JSON.stringify(heroGridImages.map(i => i.alt)));

      /* Images */
      if (heroFile) fd.append("heroImage", heroFile);
      if (locationImageFile) fd.append("locationImage", locationImageFile);
      heroGridImages.forEach((img, idx) => {
        if (img.file) fd.append(`heroGridImage${idx}`, img.file);
      });

      if (isEdit) {
  await api.put("/prenatal-page", fd);
  toast.success("Page updated successfully");
} else {
  await api.post("/prenatal-page", fd);
  toast.success("Page created successfully");
}
      setSubmitted(true);
      setTimeout(() => { router.push("/admin/yogacourse/prenatal-yoga-course/prenatal-content"); }, 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading / Success screens ── */
  if (loadingData) return (
    <div className={styles.loadingWrap}>
      <span className={styles.spinner} />
      <span>Loading page data…</span>
    </div>
  );

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Prenatal Yoga Page {isEdit ? "Updated" : "Saved"}!</h2>
        <p className={styles.successText}>Redirecting to list…</p>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className={styles.formPage}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/prenatal-yoga-course/prenatal-content")}>
          Prenatal Yoga Content
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{isEdit ? "Edit Prenatal Yoga TTC Page" : "Add New Prenatal Yoga TTC Page"}</h1>
          <p className={styles.pageSubtitle}>
            Hero · Intro · Course Features · Location · Schedule · Batches · Costs · Online Course · SEO
          </p>
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

        {/* ══ 1. HERO SECTION ══ */}
        <Sec title="Hero Section" badge="Top Banner">
          <F label="Page H1 Heading" req>
            <div className={`${styles.inputWrap} ${errors.pageTitleH1 ? styles.inputError : ""}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                {...register("pageTitleH1", { required: "Required" })} />
            </div>
            {errors.pageTitleH1 && <p className={styles.errorMsg}>⚠ {errors.pageTitleH1.message}</p>}
          </F>

          <F label="Hero Banner Image" req hint="Recommended 1180×540px · Full-width banner">
            <SingleImg
              preview={heroPrev}
              badge="Hero Banner"
              hint="JPG/PNG/WEBP · 1180×540px"
              error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }}
            />
          </F>

          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("heroImgAlt")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 2. INTRO / ABOUT SECTION ══ */}
        <Sec title="Intro / About Section" badge="Section 1">
          <F label="Section Title (H1)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("introSectionTitle")} />
            </div>
          </F>

          <F label="Paragraph 1" hint="First intro paragraph about the course">
            <StableJodit
              onSave={(v) => { introPara1Ref.current = v; }}
             value={introPara1Ref.current || ""}
              key={introPara1Ref.current}
              ph="Pregnancy is one of the most crucial and beautiful phases…"
              h={160}
            />
          </F>

          <F label="Paragraph 2">
            <StableJodit
              onSave={(v) => { introPara2Ref.current = v; }}
              value={introPara2Ref.current}
              key={introPara2Ref.current}
              ph="Our program blends traditional techniques with modern approaches…"
              h={160}
            />
          </F>

          <F label="Paragraph 3">
            <StableJodit
              onSave={(v) => { introPara3Ref.current = v; }}
              value={introPara3Ref.current}
              key={introPara3Ref.current}
              ph="Join AYM - the trusted name in pregnancy and prenatal yoga…"
              h={130}
            />
          </F>

          <F label="Additional Paragraphs" hint="Add more intro paragraphs if needed">
            {introExtraParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={introExtraParaList.ids.length}
                onSave={introExtraParaList.save} onRemove={introExtraParaList.remove}
                value={introExtraParaList.ref.current[id]}
                ph="Additional intro content…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={introExtraParaList.add}>
              ＋ Add Paragraph
            </button>
          </F>

          <F label="Hero Section 3-Image Grid" hint="These 3 images appear below the intro text">
            <HeroGridManager images={heroGridImages} onChange={setHeroGridImages} />
          </F>
        </Sec>
        <D />

        {/* ══ 3. COURSE FEATURES SECTION ══ */}
        <Sec title="Course Features Section" badge="Section 2 · Warm BG">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("featuresSuperLabel")} placeholder="Course Structure" />
            </div>
          </F>

          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("featuresSectionTitle")} />
            </div>
          </F>

          <F label="Features Paragraph 1">
            <StableJodit
              onSave={(v) => { featuresPara1Ref.current = v; }}
              value={featuresPara1Ref.current}
              key={featuresPara1Ref.current}
              ph="Being at the top of the list of best pregnancy yoga courses in Rishikesh…"
              h={160}
            />
          </F>

          <F label="Features Paragraph 2">
            <StableJodit
              onSave={(v) => { featuresPara2Ref.current = v; }}
              value={featuresPara2Ref.current}
              key={featuresPara2Ref.current}
              ph="All the techniques are beneficial for expecting mothers…"
              h={160}
            />
          </F>

          <F label="Additional Feature Paragraphs" hint="Add more paragraphs about course features">
            {featuresExtraParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={featuresExtraParaList.ids.length}
                onSave={featuresExtraParaList.save} onRemove={featuresExtraParaList.remove}
                value={featuresExtraParaList.ref.current[id]}
                ph="More details about course features…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={featuresExtraParaList.add}>
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ══ 3a. LOCATION SUB-SECTION ══ */}
        <Sec title="Location Sub-Section" badge="Inside Vintage Card">
          <F label="Location Sub-Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("locationSubTitle")} />
            </div>
          </F>

          <F label="Location Description Paragraph">
            <StableJodit
              onSave={(v) => { locationParaRef.current = v; }}
              value={locationParaRef.current}
              key={locationParaRef.current}
              ph="AYM Yoga Ashram is set back in the stunning location of Tapovan, Rishikesh…"
              h={160}
            />
          </F>

          <F label="Daily Schedule" hint="Time slots shown in the schedule grid">
            <ScheduleManager items={schedule} onChange={setSchedule} />
          </F>

          <F label="Location Image" hint="Shown alongside the schedule · Recommended 700×500px">
            <SingleImg
              preview={locationImagePrev}
              badge="Location"
              hint="JPG/PNG/WEBP · 700×500px"
              onSelect={(f, p) => { setLocationImageFile(f); setLocationImagePrev(p); }}
              onRemove={() => { setLocationImageFile(null); setLocationImagePrev(""); }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 4. BATCH TABLE SECTION ══ */}
        <Sec title="Upcoming Batches / Dates Table" badge="Section 3 · Deep BG">
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("batchSectionTitle")} />
            </div>
          </F>

          <div className={styles.grid2}>
            <F label="Join Button Text">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} {...register("joinBtnText")} />
              </div>
            </F>
            <F label="Join Button URL">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} {...register("joinBtnUrl")}
                  placeholder="/yoga-registration or #apply" />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 5. COSTS & HOW TO APPLY SECTION ══ */}
        <Sec title="TTC Costs & How to Apply" badge="Pricing Info">
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("costsSectionTitle")} />
            </div>
          </F>

          <F label="Cost / Pricing Paragraph">
            <StableJodit
              onSave={(v) => { costParaRef.current = v; }}
              value={costParaRef.current}
              key={costParaRef.current}
              ph="Course Fee: 399 USD. This fee includes food, accommodation and course fees…"
              h={160}
            />
          </F>

          <F label="Additional Cost Paragraphs" hint="More details about pricing, what's included, etc.">
            {costsExtraParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={costsExtraParaList.ids.length}
                onSave={costsExtraParaList.save} onRemove={costsExtraParaList.remove}
                value={costsExtraParaList.ref.current[id]}
                ph="Additional pricing details…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={costsExtraParaList.add}>
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ══ 6. ONLINE COURSE SECTION ══ */}
        <Sec title="Online Pregnancy Yoga TTC Section" badge="Online / Offline">
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("onlineSectionTitle")} />
            </div>
          </F>

          <F label="Section Intro Paragraph">
            <StableJodit
              onSave={(v) => { onlineParaRef.current = v; }}
              value={onlineParaRef.current}
              key={onlineParaRef.current}
              ph="Detailed Structure of the course for online and offline course…"
              h={130}
            />
          </F>

          <F label="Additional Paragraphs">
            {onlineExtraParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={onlineExtraParaList.ids.length}
                onSave={onlineExtraParaList.save} onRemove={onlineExtraParaList.remove}
                value={onlineExtraParaList.ref.current[id]}
                ph="More details about the online course structure…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={onlineExtraParaList.add}>
              ＋ Add Paragraph
            </button>
          </F>

          <F label="Curriculum Modules" hint="Each module becomes a bullet point in the course outline">
            <CurriculumManager items={curriculum} onChange={setCurriculum} />
          </F>

          <F label="Hours Summary Table" hint="Rows shown below the curriculum (Total Hours, Contact Hours, etc.)">
            <HoursSummaryManager items={hoursSummary} onChange={setHoursSummary} />
          </F>
        </Sec>
        <D />

        {/* ══ 7. SEO & PAGE SETTINGS ══ */}
        <Sec title="SEO & Page Settings" badge="Meta · Slug · Status">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="pregnancy-yoga-course-rishikesh"
                  {...register("slug", { required: "Slug is required" })} />
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

          <F label="Meta Title" hint="SEO title tag — keep under 60 characters">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("metaTitle")}
                placeholder="Pregnancy Yoga Course in Rishikesh | AYM Yoga School" />
            </div>
          </F>

          <F label="Meta Description" hint="SEO description — keep under 160 characters">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                {...register("metaDescription")}
                placeholder="Join AYM Yoga School for the best prenatal yoga teacher training in Rishikesh…" />
            </div>
          </F>
        </Sec>

      </div>

      {/* ── Form Actions ── */}
      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/prenatal-yoga-course/prenatal-content" className={styles.cancelBtn}>
          ← Cancel
        </Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><span className={styles.spinner} /> Saving…</>
          ) : (
            <><span>✦</span> {isEdit ? "Update" : "Save"} Prenatal Yoga Page</>
          )}
        </button>
      </div>
    </div>
  );
}
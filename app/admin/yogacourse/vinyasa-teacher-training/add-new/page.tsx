"use client";

import { useState, useRef, useCallback, useEffect, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
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
      "bold","italic","underline","strikethrough","|",
      "font","fontsize","brush","|","paragraph","align","|",
      "ul","ol","|","link","|","undo","redo","|",
      "selectall","cut","copy","paste",
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
    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)", margin: "0.4rem 0 1.8rem" }} />
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
}: {
  onSave: (v: string) => void;
  value?: string; ph?: string; h?: number; err?: string;
}) {
  const [visible, setVisible] = useState(false);
  const initialValue = useRef(value || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), [ph, h]);
  const handleChange = useCallback((val: string) => { onSaveRef.current(val); }, []);

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
        <JoditEditor config={config} value={initialValue.current} onChange={handleChange} />
      ) : (
        <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8, color: "#bbb", fontSize: 13 }}>
          ✦ Scroll to load editor…
        </div>
      )}
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
});

/* ─── Rich List Item (for multiple paragraphs) ─── */
const RichListItem = memo(function RichListItem({
  id, index, total, onSave, onRemove, value, ph,
}: {
  id: string; index: number; total: number;
  onSave: (id: string, v: string) => void;
  onRemove: (id: string) => void;
  value?: string; ph?: string;
}) {
  const initialValue = useRef(value || "");
  const handleSave = useCallback((v: string) => { onSave(id, v); }, [id, onSave]);
  return (
    <div className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardNum}>Paragraph {index + 1}</span>
        {total > 1 && (
          <button type="button" className={styles.removeNestedBtn} onClick={() => onRemove(id)}>✕ Remove</button>
        )}
      </div>
      <div className={styles.nestedCardBody}>
        <StableJodit onSave={handleSave} value={initialValue.current} ph={ph} h={180} />
      </div>
    </div>
  );
});

/* ─── String List ─── */
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
              <input className={`${styles.input} ${styles.inputNoCount}`} value={val}
                placeholder={ph || "Enter item…"} onChange={(e) => onUpdate(i, e.target.value)} />
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => onRemove(i)} disabled={items.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {items.length < max && (
        <button type="button" className={styles.addItemBtn} onClick={onAdd}>＋ Add {label}</button>
      )}
    </>
  );
}

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
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
                }} />
            </div>
            <button type="button" className={styles.removeImageBtn} onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════
   PARA LIST HOOK
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
   SCHEDULE ROW MANAGER
══════════════════════════════════════════ */
interface ScheduleRow {
  id: string;
  date: string;
  dorm: string;
  shared: string;
  priv: string;
  availability: string;
}

const DEFAULT_SCHEDULE: ScheduleRow[] = [
  { id: "sr1", date: "05th Jan to 29th Jan 2026", dorm: "$749", shared: "$899", priv: "$1099", availability: "Available" },
  { id: "sr2", date: "03rd Feb to 27th Feb 2026", dorm: "$749", shared: "$899", priv: "$1099", availability: "Available" },
  { id: "sr3", date: "03rd Mar to 27th Mar 2026", dorm: "$749", shared: "$899", priv: "$1099", availability: "Available" },
  { id: "sr4", date: "03rd Apr to 27th Apr 2026", dorm: "$749", shared: "$899", priv: "$1099", availability: "Available" },
  { id: "sr5", date: "03rd May to 27th May 2026", dorm: "$749", shared: "$899", priv: "$1099", availability: "Available" },
];

function ScheduleManager({ items, onChange }: { items: ScheduleRow[]; onChange: (v: ScheduleRow[]) => void }) {
  const update = (id: string, field: keyof ScheduleRow, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () => onChange([...items, { id: `sr-${Date.now()}`, date: "", dorm: "", shared: "", priv: "", availability: "Available" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((i) => i.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Batch {idx + 1}: {item.date || "New Batch"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Date Range</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.date} placeholder="05th Jan to 29th Jan 2026"
                    onChange={(e) => update(item.id, "date", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Dormitory Price</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.dorm} placeholder="$749"
                    onChange={(e) => update(item.id, "dorm", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Shared Room Price</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.shared} placeholder="$899"
                    onChange={(e) => update(item.id, "shared", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Private Room Price</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.priv} placeholder="$1099"
                    onChange={(e) => update(item.id, "priv", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Availability Status</label>
                <div className={styles.selectWrap}>
                  <select className={styles.select} value={item.availability}
                    onChange={(e) => update(item.id, "availability", e.target.value)}>
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                    <option value="Few Seats Left">Few Seats Left</option>
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Batch / Schedule Row</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   TESTIMONIAL MANAGER
══════════════════════════════════════════ */
interface TestimonialItem {
  id: string;
  name: string;
  from: string;
  initials: string;
  quote: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "tm1",
    name: "Kaori Ueno",
    from: "Japan",
    initials: "KU",
    quote: "Every teachers are very knowledgeable, when student asks questions, they always explain a lot…",
  },
];

function TestimonialManager({ items, onChange }: { items: TestimonialItem[]; onChange: (v: TestimonialItem[]) => void }) {
  const update = (id: string, field: keyof TestimonialItem, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () => onChange([...items, { id: `tm-${Date.now()}`, name: "", from: "", initials: "", quote: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((i) => i.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Testimonial {idx + 1}: {item.name || "New"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Student Name</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.name} placeholder="Kaori Ueno"
                    onChange={(e) => update(item.id, "name", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Country / From</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.from} placeholder="Japan"
                    onChange={(e) => update(item.id, "from", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Avatar Initials (2 letters)</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.initials} placeholder="KU" maxLength={3}
                    onChange={(e) => update(item.id, "initials", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Testimonial Quote</label>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={5} value={item.quote}
                  placeholder="Write the student testimonial here…"
                  onChange={(e) => update(item.id, "quote", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Testimonial</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   FORM VALUES INTERFACE
══════════════════════════════════════════ */
interface PageFormValues {
  slug: string;
  status: "Active" | "Inactive";
  // Hero
  heroImgAlt: string;
  // Section 1 — Intro
  pageH1Title: string;
  introMainPara: string;
  // Course Details card
  courseDetailsTitle: string;
  courseDetailsIntro1: string;
  courseDetailsIntro2: string;
  // Who Can Apply card
  whoCanApplyTitle: string;
  whoCanApplyPara1: string;
  whoCanApplyPara2: string;
  // Section 2 — Promo Banner
  promoSchoolLabel: string;
  promoHeading: string;
  promoLocation: string;
  promoFeeLabel: string;
  promoFeeAmount: string;
  promoBtnLabel: string;
  promoBtnHref: string;
  // Certified Teachers
  certTeachersTitle: string;
  // Community
  communityTitle: string;
  // Accommodation
  accommodationTitle: string;
  // Section 3 — Certification
  certCardTitle: string;
  certCardPara: string;
  certDeepTitle: string;
  certDeepPara: string;
  // Schedule table footer
  schedBookLabel: string;
  schedRegisterText: string;
  schedPayText: string;
  schedDepositAmount: string;
  schedPayBtnLabel: string;
  schedPayBtnHref: string;
  // Testimonial section
  testimSectionTitle: string;
  testimIntroText: string;
}

/* ══════════════════════════════════════════
   MAIN FORM
══════════════════════════════════════════ */
export default function AddEditAshtangaVinyasaPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id as string;
  const isEdit = !!pageId && pageId !== "add-new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  /* ── Images ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [promoFile, setPromoFile] = useState<File | null>(null);
  const [promoPrev, setPromoPrev] = useState("");

  /* ── Rich text refs ── */
  const introMainParaRef = useRef("");
  const courseDetailsIntro1Ref = useRef("");
  const courseDetailsIntro2Ref = useRef("");
  const whoCanApplyPara1Ref = useRef("");
  const whoCanApplyPara2Ref = useRef("");
  const certTeachersParaRef = useRef("");
  const certTeachersPara2Ref = useRef("");
  const communityParaRef = useRef("");
  const accommodationPara1Ref = useRef("");
  const certCardParaRef = useRef("");
  const certDeepParaRef = useRef("");

  /* ── Para lists (multiple paragraphs) ── */
  const accommodationParaList = useParaList("ap1");
  const certTeachersParaList = useParaList("ctp1");
  const communityParaList = useParaList("cp1");

  /* ── Dynamic lists ── */
  const [learnItems, setLearnItems] = useState<string[]>([
    "How to teach professionally.",
    "How to instruct classes.",
    "Practice different Ashtanga Vinyasa yoga sequences.",
    "Adjusting and correcting.",
    "Alignments.",
    "Adopt and modify fundamental postures.",
    "History of ashtanga Vinyasa yoga.",
    "Different strategies.",
  ]);

  const [whoItems, setWhoItems] = useState<string[]>([
    "Looking forward to becoming a qualified yoga teacher globally.",
    "Looking for the best Ashtanga vinyasa yoga teacher training in Rishikesh to gain experience and comfortable accommodation.",
    "Looking forward to deepening your knowledge, practice and skills.",
    "Looking forward to sharing the teachings with others for a happy and meaningful life.",
  ]);

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(DEFAULT_SCHEDULE);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PageFormValues>({
    defaultValues: {
      slug: "",
      status: "Active",
      heroImgAlt: "Yoga Students Group",
      pageH1Title: "Ashtanga Vinyasa Yoga Teacher Training Course Rishikesh, India",
      courseDetailsTitle: "Ashtanga Vinyasa Yoga Course Details",
      whoCanApplyTitle: "Who can Apply for this Course?",
      promoSchoolLabel: "AYM YOGA SCHOOL · RISHIKESH",
      promoHeading: "Vinyasa Yoga Teacher Training",
      promoLocation: "Rishikesh, INDIA",
      promoFeeLabel: "Online Fee:",
      promoFeeAmount: "10,000 INR",
      promoBtnLabel: "Book Your Spot",
      promoBtnHref: "#schedule",
      certTeachersTitle: "Learn from Our Certified Yoga Teachers in Rishikesh",
      communityTitle: "Join Our Healing, Nurturing Community for Life",
      accommodationTitle: "Enjoy Comfortable Accommodation During your Stay",
      certCardTitle: "Our Teacher Training Course Certification",
      certDeepTitle: "Deepen your Practices and Become Globally Renowned",
      schedBookLabel: "Book Your Spot",
      schedRegisterText: "Register your spot",
      schedPayText: "by Paying $110 only",
      schedDepositAmount: "$110",
      schedPayBtnLabel: "🛒 Payments Page",
      schedPayBtnHref: "#",
      testimSectionTitle: "Testimonial",
      testimIntroText: "Let's see what Kaori Ueno from Japan experienced during her stay at AYM Yoga School:",
    },
  });

  /* ── Fetch on edit ── */
  useEffect(() => {
    if (!isEdit) return;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get(`/ashtanga-vinyasa-ttc/${pageId}`);
        const d = res.data.data;

        (["slug","status","heroImgAlt","pageH1Title","courseDetailsTitle",
          "whoCanApplyTitle","promoSchoolLabel","promoHeading","promoLocation",
          "promoFeeLabel","promoFeeAmount","promoBtnLabel","promoBtnHref",
          "certTeachersTitle","communityTitle","accommodationTitle",
          "certCardTitle","certDeepTitle","schedBookLabel","schedRegisterText",
          "schedPayText","schedDepositAmount","schedPayBtnLabel","schedPayBtnHref",
          "testimSectionTitle","testimIntroText",
        ] as (keyof PageFormValues)[]).forEach((k) => {
          if (d[k] !== undefined) setValue(k, d[k]);
        });

        introMainParaRef.current = d.introMainPara || "";
        courseDetailsIntro1Ref.current = d.courseDetailsIntro1 || "";
        courseDetailsIntro2Ref.current = d.courseDetailsIntro2 || "";
        whoCanApplyPara1Ref.current = d.whoCanApplyPara1 || "";
        whoCanApplyPara2Ref.current = d.whoCanApplyPara2 || "";
        certTeachersParaRef.current = d.certTeachersPara || "";
        certTeachersPara2Ref.current = d.certTeachersPara2 || "";
        communityParaRef.current = d.communityPara || "";
        accommodationPara1Ref.current = d.accommodationPara1 || "";
        certCardParaRef.current = d.certCardPara || "";
        certDeepParaRef.current = d.certDeepPara || "";

        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);
        if (d.promoImage) setPromoPrev(BASE_URL + d.promoImage);

        if (d.accommodationParagraphs?.length) accommodationParaList.loadFromArray(d.accommodationParagraphs, "ap");
        if (d.certTeachersParagraphs?.length) certTeachersParaList.loadFromArray(d.certTeachersParagraphs, "ctp");
        if (d.communityParagraphs?.length) communityParaList.loadFromArray(d.communityParagraphs, "cp");

        if (d.learnItems?.length) setLearnItems(d.learnItems);
        if (d.whoItems?.length) setWhoItems(d.whoItems);
        if (d.scheduleRows?.length) setScheduleRows(d.scheduleRows);
        if (d.testimonials?.length) setTestimonials(d.testimonials);

      } catch {
        toast.error("Failed to load");
        router.push("/admin/yogacourse/ashtanga-vinyasa-ttc");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, pageId]);

  /* ── Submit ── */
  const onSubmit = async (data: PageFormValues) => {
    if (!heroFile && !heroPrev) { setHeroErr("Hero image is required"); return; }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      fd.append("introMainPara", introMainParaRef.current);
      fd.append("courseDetailsIntro1", courseDetailsIntro1Ref.current);
      fd.append("courseDetailsIntro2", courseDetailsIntro2Ref.current);
      fd.append("whoCanApplyPara1", whoCanApplyPara1Ref.current);
      fd.append("whoCanApplyPara2", whoCanApplyPara2Ref.current);
      fd.append("certTeachersPara", certTeachersParaRef.current);
      fd.append("certTeachersPara2", certTeachersPara2Ref.current);
      fd.append("communityPara", communityParaRef.current);
      fd.append("accommodationPara1", accommodationPara1Ref.current);
      fd.append("certCardPara", certCardParaRef.current);
      fd.append("certDeepPara", certDeepParaRef.current);

      accommodationParaList.ids.forEach((id, i) => fd.append(`accommodationParagraphs[${i}]`, accommodationParaList.ref.current[id] || ""));
      certTeachersParaList.ids.forEach((id, i) => fd.append(`certTeachersParagraphs[${i}]`, certTeachersParaList.ref.current[id] || ""));
      communityParaList.ids.forEach((id, i) => fd.append(`communityParagraphs[${i}]`, communityParaList.ref.current[id] || ""));

      fd.append("learnItems", JSON.stringify(learnItems));
      fd.append("whoItems", JSON.stringify(whoItems));
      fd.append("scheduleRows", JSON.stringify(scheduleRows));
      fd.append("testimonials", JSON.stringify(testimonials));

      if (heroFile) fd.append("heroImage", heroFile);
      if (promoFile) fd.append("promoImage", promoFile);

      if (isEdit) {
        fd.append("_id", pageId);
        await api.put(`/ashtanga-vinyasa-ttc/update/${pageId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page updated successfully");
      } else {
        await api.post("/ashtanga-vinyasa-ttc/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page created successfully");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/ashtanga-vinyasa-ttc"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData)
    return (
      <div className={styles.loadingWrap}>
        <span className={styles.spinner} />
        <span>Loading page data…</span>
      </div>
    );

  if (submitted)
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Ashtanga Vinyasa TTC Page {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );

  /* ══ RENDER ══ */
  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/ashtanga-vinyasa-ttc")}>
          Ashtanga Vinyasa TTC
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{isEdit ? "Edit Ashtanga Vinyasa TTC Page" : "Add New Ashtanga Vinyasa TTC Page"}</h1>
          <p className={styles.pageSubtitle}>Hero · Intro · Course Details · Who Can Apply · Promo Banner · Teachers · Community · Accommodation · Certification · Schedule · Testimonial</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ 1. HERO ══ */}
        <Sec title="Hero Section" badge="Top Banner Image">
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg
              preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1180×540px" error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }}
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Students Group" {...register("heroImgAlt")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 2. PAGE INTRO ══ */}
        <Sec title="Page Introduction" badge="Section 1 · H1 + Intro Para">
          <F label="Page H1 Title" req>
            <div className={`${styles.inputWrap} ${errors.pageH1Title ? styles.inputError : ""}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Ashtanga Vinyasa Yoga Teacher Training Course Rishikesh, India"
                {...register("pageH1Title", { required: "Required" })} />
            </div>
            {errors.pageH1Title && <p className={styles.errorMsg}>⚠ {errors.pageH1Title.message}</p>}
          </F>
          <F label="Introduction Paragraph">
            <StableJodit
              onSave={(v) => { introMainParaRef.current = v; }}
              value={introMainParaRef.current} h={180}
              ph="Yoga is one of the most beneficial practices. Given its benefits, it is no surprise that people worldwide are participating in it…"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 3. COURSE DETAILS CARD ══ */}
        <Sec title="Course Details Card" badge="Vintage Card · What You'll Learn">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Ashtanga Vinyasa Yoga Course Details" {...register("courseDetailsTitle")} />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => { courseDetailsIntro1Ref.current = v; }}
              value={courseDetailsIntro1Ref.current} h={180}
              ph="At AYM, our Course follows the Ashtanga Vinyasa yoga tradition. The course structure follows the Yoga Alliance standards…"
            />
          </F>
          <F label="Paragraph 2 (before learn list)">
            <StableJodit
              onSave={(v) => { courseDetailsIntro2Ref.current = v; }}
              value={courseDetailsIntro2Ref.current} h={160}
              ph="You'll learn everything from theory to practical for students of all levels…"
            />
          </F>
          <F label="What You'll Learn — List Items" hint="These appear as numbered list in 2-column grid">
            <StrList
              items={learnItems} label="Learn Item"
              ph="How to teach professionally."
              onAdd={() => setLearnItems((p) => [...p, ""])}
              onRemove={(i) => { if (learnItems.length <= 1) return; setLearnItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...learnItems]; n[i] = v; setLearnItems(n); }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 4. WHO CAN APPLY ══ */}
        <Sec title="Who Can Apply" badge="Vintage Card · Target Audience">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Who can Apply for this Course?" {...register("whoCanApplyTitle")} />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => { whoCanApplyPara1Ref.current = v; }}
              value={whoCanApplyPara1Ref.current} h={170}
              ph="Ashtanga Vinyasa Yoga teacher training is not a retreat but a professional training course…"
            />
          </F>
          <F label="Paragraph 2 (before who list)">
            <StableJodit
              onSave={(v) => { whoCanApplyPara2Ref.current = v; }}
              value={whoCanApplyPara2Ref.current} h={150}
              ph="With our Course, you can expand your knowledge and practice for your personal and professional life…"
            />
          </F>
          <F label="Who Should Apply — List Points" hint="Each point appears as bullet with dot icon">
            <StrList
              items={whoItems} label="Who Item"
              ph="Looking forward to becoming a qualified yoga teacher globally."
              onAdd={() => setWhoItems((p) => [...p, ""])}
              onRemove={(i) => { if (whoItems.length <= 1) return; setWhoItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...whoItems]; n[i] = v; setWhoItems(n); }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 5. PROMO BANNER ══ */}
        <Sec title="Promo Banner" badge="Section 2 · Left Image + Right Text">
          <F label="Promo Banner Image" hint="Recommended 800×600px">
            <SingleImg
              preview={promoPrev} badge="Promo" hint="JPG/PNG/WEBP · 800×600px" error=""
              onSelect={(f, p) => { setPromoFile(f); setPromoPrev(p); }}
              onRemove={() => { setPromoFile(null); setPromoPrev(""); }}
            />
          </F>
          <div className={styles.grid2}>
            <F label="School Label (small text)">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="AYM YOGA SCHOOL · RISHIKESH" {...register("promoSchoolLabel")} />
              </div>
            </F>
            <F label="Main Heading">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Vinyasa Yoga Teacher Training" {...register("promoHeading")} />
              </div>
            </F>
            <F label="Location Text">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Rishikesh, INDIA" {...register("promoLocation")} />
              </div>
            </F>
            <F label="Fee Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Online Fee:" {...register("promoFeeLabel")} />
              </div>
            </F>
            <F label="Fee Amount">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="10,000 INR" {...register("promoFeeAmount")} />
              </div>
            </F>
            <F label="Button Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Book Your Spot" {...register("promoBtnLabel")} />
              </div>
            </F>
            <F label="Button Link href">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="#schedule" {...register("promoBtnHref")} />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 6. CERTIFIED TEACHERS ══ */}
        <Sec title="Certified Teachers Section" badge="Section 2 · Info Block">
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Learn from Our Certified Yoga Teachers in Rishikesh"
                {...register("certTeachersTitle")} />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => { certTeachersParaRef.current = v; }}
              value={certTeachersParaRef.current} h={180}
              ph="As the best Vinyasa yoga training centre in Rishikesh, we have the best certified yoga therapists and teachers…"
            />
          </F>
          <F label="Paragraph 2">
            <StableJodit
              onSave={(v) => { certTeachersPara2Ref.current = v; }}
              value={certTeachersPara2Ref.current} h={170}
              ph="The teachers use traditional teaching methods that encourage students to stay in the long term…"
            />
          </F>
          <F label="Additional Paragraphs">
            {certTeachersParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={certTeachersParaList.ids.length}
                onSave={certTeachersParaList.save} onRemove={certTeachersParaList.remove}
                value={certTeachersParaList.ref.current[id]} ph="Additional teacher info…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={certTeachersParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 7. COMMUNITY ══ */}
        <Sec title="Community Section" badge="Section 2 · Info Block">
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Join Our Healing, Nurturing Community for Life"
                {...register("communityTitle")} />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => { communityParaRef.current = v; }}
              value={communityParaRef.current} h={200}
              ph="Whether you're enrolling for our 500 hour Ashtanga Vinyasa yoga TTC in Rishikesh or the long-term courses…"
            />
          </F>
          <F label="Additional Paragraphs">
            {communityParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={communityParaList.ids.length}
                onSave={communityParaList.save} onRemove={communityParaList.remove}
                value={communityParaList.ref.current[id]} ph="More about community…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={communityParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 8. ACCOMMODATION ══ */}
        <Sec title="Accommodation Section" badge="Section 2 · Info Block">
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Enjoy Comfortable Accommodation During your Stay"
                {...register("accommodationTitle")} />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => { accommodationPara1Ref.current = v; }}
              value={accommodationPara1Ref.current} h={170}
              ph="We at AYM provide comfortable accommodation for both our teachers and students…"
            />
          </F>
          <F label="Additional Paragraphs">
            {accommodationParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={accommodationParaList.ids.length}
                onSave={accommodationParaList.save} onRemove={accommodationParaList.remove}
                value={accommodationParaList.ref.current[id]} ph="More about accommodation…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={accommodationParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 9. CERTIFICATION ══ */}
        <Sec title="Certification Section" badge="Section 3 · Vintage Card">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Our Teacher Training Course Certification" {...register("certCardTitle")} />
            </div>
          </F>
          <F label="Card Main Paragraph">
            <StableJodit
              onSave={(v) => { certCardParaRef.current = v; }}
              value={certCardParaRef.current} h={180}
              ph="At AYM, we are the best Ashtanga vinyasa yoga teacher training in Rishikesh and are a Yoga Alliance, USA member…"
            />
          </F>
          <F label="Sub-Heading (Deepen your Practices…)">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Deepen your Practices and Become Globally Renowned" {...register("certDeepTitle")} />
            </div>
          </F>
          <F label="Sub-Heading Paragraph">
            <StableJodit
              onSave={(v) => { certDeepParaRef.current = v; }}
              value={certDeepParaRef.current} h={180}
              ph="At AYM, we are your best ashtanga vinyasa yoga teacher training in Rishikesh. We are open to all and for people of all ages…"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 10. AVAILABILITY SCHEDULE TABLE ══ */}
        <Sec title="Availability Schedule Table" badge="Section 3 · Dates + Prices">
          <p className={styles.fieldHint} style={{ marginBottom: "0.8rem" }}>
            ℹ Add/remove batch rows. Each row has date range, dormitory price, shared room price, private room price, and availability status.
          </p>
          <ScheduleManager items={scheduleRows} onChange={setScheduleRows} />

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(224,123,0,0.06)", border: "1px dashed var(--saffron, #e07b00)", borderRadius: 6 }}>
            <p className={styles.fieldHint} style={{ fontWeight: 600, marginBottom: "0.8rem" }}>Table Footer Row — Book Your Spot</p>
            <div className={styles.grid2}>
              <F label="Book Your Spot Label">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="Book Your Spot" {...register("schedBookLabel")} />
                </div>
              </F>
              <F label="Register Text">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="Register your spot" {...register("schedRegisterText")} />
                </div>
              </F>
              <F label="Pay Text">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="by Paying $110 only" {...register("schedPayText")} />
                </div>
              </F>
              <F label="Deposit Amount">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="$110" {...register("schedDepositAmount")} />
                </div>
              </F>
              <F label="Payment Button Label">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="🛒 Payments Page" {...register("schedPayBtnLabel")} />
                </div>
              </F>
              <F label="Payment Button Link href">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="/payments" {...register("schedPayBtnHref")} />
                </div>
              </F>
            </div>
          </div>
        </Sec>
        <D />

        {/* ══ 11. TESTIMONIAL ══ */}
        <Sec title="Testimonial Section" badge="Section 3 · Student Reviews">
          <div className={styles.grid2}>
            <F label="Section Heading">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Testimonial" {...register("testimSectionTitle")} />
              </div>
            </F>
            <F label="Intro Text (before testimonials)">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Let's see what Kaori Ueno from Japan experienced…"
                  {...register("testimIntroText")} />
              </div>
            </F>
          </div>
          <F label="Testimonial Cards" hint="Add/remove student testimonials">
            <TestimonialManager items={testimonials} onChange={setTestimonials} />
          </F>
        </Sec>
        <D />

        {/* ══ 12. PAGE SETTINGS ══ */}
        <Sec title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="ashtanga-vinyasa-yoga-ttc-rishikesh"
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
        </Sec>

      </div>
      {/* /formCard */}

      {/* ── Actions ── */}
      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/ashtanga-vinyasa-ttc" className={styles.cancelBtn}>← Cancel</Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><span className={styles.spinner} /> Saving…</>
          ) : (
            <><span>✦</span> {isEdit ? "Update" : "Save"} Ashtanga Vinyasa TTC Page</>
          )}
        </button>
      </div>
    </div>
  );
}
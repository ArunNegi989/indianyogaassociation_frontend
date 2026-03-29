"use client";

import { useState, useRef, useCallback, useEffect, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const cleanHTML = (val?: string): string => {
  if (!val) return "";
  const text = val.replace(/<[^>]*>/g, "").trim();
  return text ? val.trim() : "";
};

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
      "font","fontsize","brush","|",
      "paragraph","align","|",
      "ul","ol","|",
      "link","|",
      "undo","redo","|",
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
}: { onSave: (v: string) => void; value?: string; ph?: string; h?: number; err?: string }) {
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "300px" });
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

/* ─── Rich List Item ─── */
const RichListItem = memo(function RichListItem({
  id, index, total, onSave, onRemove, value, ph,
}: { id: string; index: number; total: number; onSave: (id: string, v: string) => void; onRemove: (id: string) => void; value?: string; ph?: string }) {
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
  items: string[]; onAdd: () => void; onRemove: (i: number) => void; onUpdate: (i: number, v: string) => void; max?: number; ph?: string; label: string;
}) {
  return (
    <>
      <div className={styles.listItems}>
        {items.map((val, i) => (
          <div key={i} className={styles.listItemRow}>
            <span className={styles.listNum}>{i + 1}</span>
            <div className={`${styles.inputWrap} ${styles.listInput}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`} value={val} placeholder={ph || "Enter item…"} onChange={(e) => onUpdate(i, e.target.value)} />
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
  preview: string; badge?: string; hint: string; error?: string; onSelect: (f: File, p: string) => void; onRemove: () => void;
}) {
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!preview ? (
          <>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} />
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
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput} onChange={(e) => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} />
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
  const add = useCallback(() => { const id = `${initId}-${Date.now()}`; ref.current[id] = ""; setIds((p) => [...p, id]); }, [initId]);
  const remove = useCallback((id: string) => { delete ref.current[id]; setIds((p) => p.filter((x) => x !== id)); }, []);
  const save = useCallback((id: string, v: string) => { ref.current[id] = v; }, []);
  const loadFromArray = useCallback((arr: string[], prefix: string) => {
    const newIds: string[] = [];
    arr.forEach((p, i) => { const id = `${prefix}${i}`; newIds.push(id); ref.current[id] = p; });
    setIds(newIds);
  }, []);
  return { ids, ref, add, remove, save, loadFromArray };
}

/* ══════════════════════════════════════════
   CERT CARD MANAGER
══════════════════════════════════════════ */
interface CertCardItem {
  id: string;
  hours: string;
  sub: string;
  href: string;
  imgUrl: string;
  imgPreview: string;
  imgFile: File | null;
}

const DEFAULT_CERT_CARDS: CertCardItem[] = [
  { id: "cert1", hours: "200 Hour", sub: "Foundation Programme", href: "#200hr", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "cert2", hours: "300 Hour", sub: "Advanced Programme",   href: "#300hr", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "cert3", hours: "500 Hour", sub: "Master Programme",     href: "#500hr", imgUrl: "", imgPreview: "", imgFile: null },
];

function CertCardsManager({ items, onChange }: { items: CertCardItem[]; onChange: (v: CertCardItem[]) => void }) {
  const update = useCallback((id: string, field: keyof CertCardItem, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }, [items, onChange]);
  const updateMany = useCallback((id: string, patch: Partial<CertCardItem>) => {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, [items, onChange]);
  const add = () => onChange([...items, { id: `cert-${Date.now()}`, hours: "", sub: "", href: "#", imgUrl: "", imgPreview: "", imgFile: null }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((i) => i.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>{item.hours || `Card ${idx + 1}`}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Hours Label</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.hours} placeholder="200 Hour" onChange={(e) => update(item.id, "hours", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Programme Sub-label</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.sub} placeholder="Foundation Programme" onChange={(e) => update(item.id, "sub", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Card Link (href)</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.href} placeholder="#200hr" onChange={(e) => update(item.id, "href", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Image URL (optional)</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.imgUrl} placeholder="https://…" onChange={(e) => update(item.id, "imgUrl", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Or Upload Card Image</label>
              <SingleImg preview={item.imgPreview} badge="Cert" hint="JPG/PNG/WEBP · 600×400px" error=""
                onSelect={(f, p) => updateMany(item.id, { imgFile: f, imgPreview: p, imgUrl: "" })}
                onRemove={() => updateMany(item.id, { imgFile: null, imgPreview: "" })}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Cert Card</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   PRICING ROW MANAGER
══════════════════════════════════════════ */
interface PricingRowItem {
  id: string;
  date: string;
  usdFee: string;
  inrFee: string;
  dormPrice: string;
  twinPrice: string;
  privatePrice: string;
  totalSeats: string;
  bookedSeats: string;
}




/* ══════════════════════════════════════════
   ACCREDITATION LIST MANAGER (simple strings)
══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   FORM VALUES INTERFACE
══════════════════════════════════════════ */
interface HathaPageFormValues {
  slug: string;
  status: "Active" | "Inactive";

  // Hero
  heroImgAlt: string;

  // Intro Section
  introSectionTitle: string;
  introSideImgAlt: string;

  // What is Hatha Yoga
  whatSuperLabel: string;
  whatTitle: string;

  // Benefits
  benefitsSuperLabel: string;
  benefitsTitle: string;
  benefitsSideImgAlt: string;
  pullQuote: string;

  // Certification
  certSuperLabel: string;
  certTitle: string;

  // Ashram
  ashramSuperLabel: string;
  ashramTitle: string;
  ashramImgAlt: string;

  // Curriculum
  curriculumSuperLabel: string;
  curriculumTitle: string;

  // Pricing / Enrolment
  pricingSuperLabel: string;
  pricingTitle: string;
  pricingIntroPara: string;
  registrationFormLink: string;
  tableNote: string;
  joinBtnLabel: string;
  joinBtnHref: string;

  // Footer CTA
  footerTitle: string;
  footerSubtitle: string;
  applyBtnLabel: string;
  applyBtnHref: string;
  contactBtnLabel: string;
  contactEmail: string;
}

/* ══════════════════════════════════════════
   MAIN FORM
══════════════════════════════════════════ */
export default function AddEditHathaYogaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* ── Images ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");

  const [introSideFile, setIntroSideFile] = useState<File | null>(null);
  const [introSidePrev, setIntroSidePrev] = useState("");

  const [benefitsSideFile, setBenefitsSideFile] = useState<File | null>(null);
  const [benefitsSidePrev, setBenefitsSidePrev] = useState("");

  const [ashramFile, setAshramFile] = useState<File | null>(null);
  const [ashramPrev, setAshramPrev] = useState("");

  /* ── Rich text single refs ── */
  const benefitsIntroParaRef = useRef("");
  const certParaRef = useRef("");
  const pricingProgrammeParaRef = useRef("");

  /* ── Para lists ── */
  const introParaList = useParaList("ip1");
  const whatParaList = useParaList("wp1");
  const ashramParaList = useParaList("ap1");
  const programmeParaList = useParaList("pp1");

  /* ── Dynamic lists ── */
  const [accreditations, setAccreditations] = useState<string[]>([
    "✓ Yoga Alliance USA — RYS 200 / 300 / 500",
    "✓ Ministry of AYUSH, Government of India",
    "✓ International Yoga Federation",
    "✓ Internationally Recognised Certificate",
  ]);

  const [benefitsList, setBenefitsList] = useState<string[]>([
    "Promotes physical strength and flexibility",
    "Relieves stress and ensures deep relaxation",
    "Harmonizes the body's chakras and creates balanced energy",
    "Enhances lung capacity and improves respiratory health",
    "Provides focus, mental clarity and cognitive functioning",
    "Fosters a deep connection with oneself, nature and the universe",
    "Improves blood circulation, cardiovascular & hormonal health",
    "Promotes better sleep and healthy digestion",
    "Enhances overall well-being and promotes a fulfilling life",
  ]);

  const [certCards, setCertCards] = useState<CertCardItem[]>(DEFAULT_CERT_CARDS);

  const [courseDetailsList, setCourseDetailsList] = useState<string[]>([
    "Upa Yoga, Yogasana, Surya Kriya, Pranayama, Mantra Yoga, Nada Yoga and more",
    "Qualified instructors conduct both practical and theoretical classes",
    "Students are introduced to yogic physiology alongside Siddha medicine",
    "Excursions to holy places where inner peace can be discovered",
    "Introduction to yogic principles and ways to employ them in real life",
    "Students are helped to find inner peace through the hatha yoga TTC in India",
    "A sattvic diet is provided while practising hatha yoga to achieve fitness",
    "Tests and assessments to keep track of learning progress",
  ]);

 

  /* ── React Hook Form ── */
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<HathaPageFormValues>({
    defaultValues: {
      slug: "hatha-yoga-teacher-training-india",
      status: "Active",
      heroImgAlt: "Yoga Students Group",
      introSectionTitle: "A Sacred Path to Mastery",
      introSideImgAlt: "Yoga class in Rishikesh",
      whatSuperLabel: "Ancient Wisdom",
      whatTitle: "What is Hatha Yoga?",
      benefitsSuperLabel: "Transformation",
      benefitsTitle: "Benefits of Hatha Yoga",
      benefitsSideImgAlt: "Yoga Ashram Rishikesh",
      pullQuote: "Yoga is not about touching your toes. It is what you learn on the way down.",
      certSuperLabel: "Recognition",
      certTitle: "Hatha Yoga Certification",
      ashramSuperLabel: "Sacred Space",
      ashramTitle: "Hatha Yoga Ashram\nRishikesh, India",
      ashramImgAlt: "AYM Yoga Ashram",
      curriculumSuperLabel: "Syllabus",
      curriculumTitle: "Course Details of Hatha Yoga Teacher Training in India",
      pricingSuperLabel: "Enrolment",
      pricingTitle: "How to Apply for Hatha Yoga Course",
      pricingIntroPara: "To apply, fill the Registration Form and Deposit Advance Fee to secure your place in the teacher training programs in India.",
      registrationFormLink: "#",
      tableNote: "Note: Register your spot by paying $110 only as advance deposit.",
      joinBtnLabel: "Join Your Yoga Journey",
      joinBtnHref: "#",
      footerTitle: "Begin Your Sacred Journey",
      footerSubtitle: "Join thousands of students who have transformed their lives at AYM Yoga School",
      applyBtnLabel: "Apply Now",
      applyBtnHref: "#apply",
      contactBtnLabel: "Contact Us",
      contactEmail: "mailto:info@aymyogaschool.com",
    },
  });

  /* ── Fetch on edit ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get("/hatha-yoga");
        const d = res.data?.data;
        if (!d) { setIsEdit(false); return; }
        setIsEdit(true);

        const keys: (keyof HathaPageFormValues)[] = [
          "slug","status","heroImgAlt","introSectionTitle","introSideImgAlt",
          "whatSuperLabel","whatTitle","benefitsSuperLabel","benefitsTitle","benefitsSideImgAlt","pullQuote",
          "certSuperLabel","certTitle","ashramSuperLabel","ashramTitle","ashramImgAlt",
          "curriculumSuperLabel","curriculumTitle","pricingSuperLabel","pricingTitle",
          "pricingIntroPara","registrationFormLink","tableNote","joinBtnLabel","joinBtnHref",
          "footerTitle","footerSubtitle","applyBtnLabel","applyBtnHref","contactBtnLabel","contactEmail",
        ];
        keys.forEach((k) => { if (d[k] !== undefined) setValue(k, d[k] as any); });

        benefitsIntroParaRef.current = d.benefitsIntroPara || "";
        certParaRef.current = d.certPara || "";
        pricingProgrammeParaRef.current = d.pricingProgrammePara || "";

        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);
        if (d.introSideImage) setIntroSidePrev(BASE_URL + d.introSideImage);
        if (d.benefitsSideImage) setBenefitsSidePrev(BASE_URL + d.benefitsSideImage);
        if (d.ashramImage) setAshramPrev(BASE_URL + d.ashramImage);

        if (d.introParagraphs?.length) introParaList.loadFromArray(d.introParagraphs, "ip");
        if (d.whatParagraphs?.length) whatParaList.loadFromArray(d.whatParagraphs, "wp");
        if (d.ashramParagraphs?.length) ashramParaList.loadFromArray(d.ashramParagraphs, "ap");
        if (d.programmeParagraphs?.length) programmeParaList.loadFromArray(d.programmeParagraphs, "pp");

        if (Array.isArray(d.accreditations)) setAccreditations(d.accreditations);
        if (Array.isArray(d.benefitsList)) setBenefitsList(d.benefitsList);
        if (Array.isArray(d.courseDetailsList)) setCourseDetailsList(d.courseDetailsList);

        if (Array.isArray(d.certCards)) {
          setCertCards(d.certCards.map((c: any, i: number) => ({
            id: c._id || `cert-${i}`, hours: c.hours || "", sub: c.sub || "",
            href: c.href || "#", imgUrl: c.imgUrl || "",
            imgPreview: c.image ? BASE_URL + c.image : "", imgFile: null,
          })));
        }
      
      } catch {
        toast.error("Failed to load page data.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  /* ── Submit ── */
  const onSubmit = async (data: HathaPageFormValues) => {
    if (!heroFile && !heroPrev && !isEdit) {
      setHeroErr("Hero image is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      fd.append("benefitsIntroPara", benefitsIntroParaRef.current);
      fd.append("certPara", certParaRef.current);
      fd.append("pricingProgrammePara", pricingProgrammeParaRef.current);

      fd.append("introParagraphs", JSON.stringify(introParaList.ids.map((id) => cleanHTML(introParaList.ref.current[id])).filter(Boolean)));
      fd.append("whatParagraphs", JSON.stringify(whatParaList.ids.map((id) => cleanHTML(whatParaList.ref.current[id])).filter(Boolean)));
      fd.append("ashramParagraphs", JSON.stringify(ashramParaList.ids.map((id) => cleanHTML(ashramParaList.ref.current[id])).filter(Boolean)));
      fd.append("programmeParagraphs", JSON.stringify(programmeParaList.ids.map((id) => cleanHTML(programmeParaList.ref.current[id])).filter(Boolean)));

      fd.append("accreditations", JSON.stringify(accreditations.map((i) => i.trim()).filter(Boolean)));
      fd.append("benefitsList", JSON.stringify(benefitsList.map((i) => i.trim()).filter(Boolean)));
      fd.append("courseDetailsList", JSON.stringify(courseDetailsList.map((i) => i.trim()).filter(Boolean)));
      fd.append("certCards", JSON.stringify(certCards.map(({ imgFile, imgPreview, ...r }) => r)));
    

      if (heroFile) fd.append("heroImage", heroFile);
      if (introSideFile) fd.append("introSideImage", introSideFile);
      if (benefitsSideFile) fd.append("benefitsSideImage", benefitsSideFile);
      if (ashramFile) fd.append("ashramImage", ashramFile);

      certCards.forEach((c, i) => { if (c.imgFile) fd.append(`certCardImage_${i}`, c.imgFile); });

      if (isEdit) {
        await api.put("/hatha-yoga/update", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page updated successfully");
      } else {
        await api.post("/hatha-yoga/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page created successfully");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-teacher-training-content"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading / Success screens ── */
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
          <h2 className={styles.successTitle}>Hatha Yoga Page {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );

  /* ══ RENDER ══ */
  return (
    <div className={styles.formPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-teacher-training-content")}>
          Hatha Yoga
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{isEdit ? "Edit Hatha Yoga Page" : "Add New Hatha Yoga Page"}</h1>
          <p className={styles.pageSubtitle}>
            Hero · Intro · What is Hatha · Benefits · Certification · Ashram · Curriculum · Pricing · Footer CTA
          </p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ 1. HERO SECTION ══ */}
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

        {/* ══ 2. INTRO SECTION ══ */}
        <Sec title="Intro Section" badge="'A Sacred Path to Mastery'">
          <F label="Section Title" req>
            <div className={`${styles.inputWrap} ${errors.introSectionTitle ? styles.inputError : ""}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="A Sacred Path to Mastery" {...register("introSectionTitle", { required: "Required" })} />
            </div>
            {errors.introSectionTitle && <p className={styles.errorMsg}>⚠ {errors.introSectionTitle.message}</p>}
          </F>

          <F label="Intro Paragraphs" hint="Add all paragraphs for the left-side intro text block">
            {introParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={introParaList.ids.length}
                onSave={introParaList.save} onRemove={introParaList.remove}
                value={introParaList.ref.current[id]}
                ph="India, the birthplace of yoga, has shared its timeless yogic wisdom with the world…"
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={introParaList.add}>＋ Add Paragraph</button>
          </F>

          <div className={styles.grid2}>
            <F label="Side Image" hint="Right-side classroom/group photo · 900×600px">
              <SingleImg
                preview={introSidePrev} badge="Intro Side" hint="JPG/PNG/WEBP · 900×600px" error=""
                onSelect={(f, p) => { setIntroSideFile(f); setIntroSidePrev(p); }}
                onRemove={() => { setIntroSideFile(null); setIntroSidePrev(""); }}
              />
            </F>
            <F label="Side Image Alt Text">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga class in Rishikesh" {...register("introSideImgAlt")} />
              </div>
            </F>
          </div>

          <F label="Accreditation Badges (text list)" hint="Displayed in the accred box below the side image">
            <StrList
              items={accreditations} label="Accreditation"
              ph="✓ Yoga Alliance USA — RYS 200 / 300 / 500"
              onAdd={() => setAccreditations((p) => [...p, ""])}
              onRemove={(i) => { if (accreditations.length <= 1) return; setAccreditations((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...accreditations]; n[i] = v; setAccreditations(n); }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 3. WHAT IS HATHA YOGA ══ */}
        <Sec title="What is Hatha Yoga?" badge="Ancient Wisdom Section">
          <div className={styles.grid2}>
            <F label="Super Label (small text above title)">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Ancient Wisdom" {...register("whatSuperLabel")} />
              </div>
            </F>
            <F label="Section Title" req>
              <div className={`${styles.inputWrap} ${errors.whatTitle ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="What is Hatha Yoga?" {...register("whatTitle", { required: "Required" })} />
              </div>
              {errors.whatTitle && <p className={styles.errorMsg}>⚠ {errors.whatTitle.message}</p>}
            </F>
          </div>

          <F label="Section Paragraphs" hint="All body text paragraphs for this section">
            {whatParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={whatParaList.ids.length}
                onSave={whatParaList.save} onRemove={whatParaList.remove}
                value={whatParaList.ref.current[id]}
                ph="Hatha yoga can be understood as a traditional and classical yoga form…"
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={whatParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 4. BENEFITS SECTION ══ */}
        <Sec title="Benefits of Hatha Yoga" badge="Transformation Section">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Transformation" {...register("benefitsSuperLabel")} />
              </div>
            </F>
            <F label="Section Title" req>
              <div className={`${styles.inputWrap} ${errors.benefitsTitle ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Benefits of Hatha Yoga" {...register("benefitsTitle", { required: "Required" })} />
              </div>
              {errors.benefitsTitle && <p className={styles.errorMsg}>⚠ {errors.benefitsTitle.message}</p>}
            </F>
          </div>

          <F label="Intro Paragraph" hint="Short text above the numbered benefits list">
            <StableJodit
              onSave={(v) => { benefitsIntroParaRef.current = v; }}
              value={benefitsIntroParaRef.current} h={160}
              ph="It may not always be the right decision to learn yoga. Before you decide to take up the Hatha yoga teacher training course…"
            />
          </F>

          <F label="Benefits List" hint="Numbered list items (displayed as numbered bullets on page)">
            <StrList
              items={benefitsList} label="Benefit"
              ph="Promotes physical strength and flexibility"
              onAdd={() => setBenefitsList((p) => [...p, ""])}
              onRemove={(i) => { if (benefitsList.length <= 1) return; setBenefitsList((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...benefitsList]; n[i] = v; setBenefitsList(n); }}
            />
          </F>

          <div className={styles.grid2}>
            <F label="Side Image" hint="Right column ashram/yoga image · 1200×800px">
              <SingleImg
                preview={benefitsSidePrev} badge="Benefits Side" hint="JPG/PNG/WEBP · 1200×800px" error=""
                onSelect={(f, p) => { setBenefitsSideFile(f); setBenefitsSidePrev(p); }}
                onRemove={() => { setBenefitsSideFile(null); setBenefitsSidePrev(""); }}
              />
            </F>
            <F label="Side Image Alt Text">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Ashram Rishikesh" {...register("benefitsSideImgAlt")} />
              </div>
            </F>
          </div>

          <F label="Pull Quote" hint="Displayed as a decorative blockquote below the side image">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga is not about touching your toes. It is what you learn on the way down." {...register("pullQuote")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 5. CERTIFICATION SECTION ══ */}
        <Sec title="Hatha Yoga Certification" badge="Recognition Section">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Recognition" {...register("certSuperLabel")} />
              </div>
            </F>
            <F label="Section Title" req>
              <div className={`${styles.inputWrap} ${errors.certTitle ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Hatha Yoga Certification" {...register("certTitle", { required: "Required" })} />
              </div>
              {errors.certTitle && <p className={styles.errorMsg}>⚠ {errors.certTitle.message}</p>}
            </F>
          </div>

          <F label="Certification Body Paragraph">
            <StableJodit
              onSave={(v) => { certParaRef.current = v; }}
              value={certParaRef.current} h={200}
              ph="At AYM, regardless of the type of course programme the students might have chosen, they are provided with the certification at the end…"
            />
          </F>

          <F label="Certification Cards (200 / 300 / 500 Hr)" hint="Cards displayed in a row linking to each programme">
            <p className={styles.fieldHint} style={{ marginBottom: "0.8rem" }}>ℹ Default 3 cards: 200 Hr, 300 Hr, 500 Hr. You can add more or remove as needed.</p>
            <CertCardsManager items={certCards} onChange={setCertCards} />
          </F>
        </Sec>
        <D />

        {/* ══ 6. ASHRAM SECTION ══ */}
        <Sec title="Hatha Yoga Ashram" badge="Sacred Space Section">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Sacred Space" {...register("ashramSuperLabel")} />
              </div>
            </F>
            <F label="Section Title" req>
              <div className={`${styles.inputWrap} ${errors.ashramTitle ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Hatha Yoga Ashram, Rishikesh, India" {...register("ashramTitle", { required: "Required" })} />
              </div>
              {errors.ashramTitle && <p className={styles.errorMsg}>⚠ {errors.ashramTitle.message}</p>}
            </F>
          </div>

          <F label="Ashram Paragraphs" hint="All body text paragraphs for the ashram section">
            {ashramParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={ashramParaList.ids.length}
                onSave={ashramParaList.save} onRemove={ashramParaList.remove}
                value={ashramParaList.ref.current[id]}
                ph="At AYM, we are located in the world's most serene and beautiful place…"
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={ashramParaList.add}>＋ Add Paragraph</button>
          </F>

          <div className={styles.grid2}>
            <F label="Ashram Side Image" hint="Right column ashram photo · 1200×800px">
              <SingleImg
                preview={ashramPrev} badge="Ashram" hint="JPG/PNG/WEBP · 1200×800px" error=""
                onSelect={(f, p) => { setAshramFile(f); setAshramPrev(p); }}
                onRemove={() => { setAshramFile(null); setAshramPrev(""); }}
              />
            </F>
            <F label="Ashram Image Alt Text">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="AYM Yoga Ashram" {...register("ashramImgAlt")} />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 7. CURRICULUM / COURSE DETAILS ══ */}
        <Sec title="Course Details / Curriculum" badge="Syllabus Section">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Syllabus" {...register("curriculumSuperLabel")} />
              </div>
            </F>
            <F label="Section Title" req>
              <div className={`${styles.inputWrap} ${errors.curriculumTitle ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Course Details of Hatha Yoga Teacher Training in India" {...register("curriculumTitle", { required: "Required" })} />
              </div>
              {errors.curriculumTitle && <p className={styles.errorMsg}>⚠ {errors.curriculumTitle.message}</p>}
            </F>
          </div>

          <F label="Course Details List" hint="Displayed as a numbered grid on the page">
            <StrList
              items={courseDetailsList} label="Detail Item"
              ph="Upa Yoga, Yogasana, Surya Kriya, Pranayama, Mantra Yoga and more"
              onAdd={() => setCourseDetailsList((p) => [...p, ""])}
              onRemove={(i) => { if (courseDetailsList.length <= 1) return; setCourseDetailsList((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...courseDetailsList]; n[i] = v; setCourseDetailsList(n); }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 8. PRICING / ENROLMENT SECTION ══ */}
        <Sec title="How to Apply / Pricing" badge="Enrolment Section">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Enrolment" {...register("pricingSuperLabel")} />
              </div>
            </F>
            <F label="Section Title" req>
              <div className={`${styles.inputWrap} ${errors.pricingTitle ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="How to Apply for Hatha Yoga Course" {...register("pricingTitle", { required: "Required" })} />
              </div>
              {errors.pricingTitle && <p className={styles.errorMsg}>⚠ {errors.pricingTitle.message}</p>}
            </F>
          </div>

          <div className={styles.grid2}>
            <F label="Intro Paragraph">
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3} placeholder="To apply, fill the Registration Form and Deposit Advance Fee…" {...register("pricingIntroPara")} />
              </div>
            </F>
            <F label="Registration Form Link (href)">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="/yoga-registration?type=hatha" {...register("registrationFormLink")} />
              </div>
            </F>
          </div>

        

          <div className={styles.grid2}>
            <F label="Table Note">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Note: Register your spot by paying $110 only as advance deposit." {...register("tableNote")} />
              </div>
            </F>
          </div>

          <div className={styles.grid2}>
            <F label="Join Button Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Join Your Yoga Journey" {...register("joinBtnLabel")} />
              </div>
            </F>
            <F label="Join Button Link (href)">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="#" {...register("joinBtnHref")} />
              </div>
            </F>
          </div>

          <F label="Programme Overview Paragraphs" hint="Text block displayed below the pricing table">
            {programmeParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={programmeParaList.ids.length}
                onSave={programmeParaList.save} onRemove={programmeParaList.remove}
                value={programmeParaList.ref.current[id]}
                ph="Our Hatha Yoga Teacher Training in India is available in three distinctive programmes…"
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={programmeParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 9. FOOTER CTA SECTION ══ */}
        <Sec title="Footer CTA Section" badge="Begin Your Sacred Journey">
          <div className={styles.grid2}>
            <F label="CTA Title" req>
              <div className={`${styles.inputWrap} ${errors.footerTitle ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Begin Your Sacred Journey" {...register("footerTitle", { required: "Required" })} />
              </div>
              {errors.footerTitle && <p className={styles.errorMsg}>⚠ {errors.footerTitle.message}</p>}
            </F>
            <F label="CTA Subtitle">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Join thousands of students who have transformed their lives at AYM Yoga School" {...register("footerSubtitle")} />
              </div>
            </F>
          </div>
          <div className={styles.grid2}>
            <F label="Primary Button Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Apply Now" {...register("applyBtnLabel")} />
              </div>
            </F>
            <F label="Primary Button Link (href)">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="#apply" {...register("applyBtnHref")} />
              </div>
            </F>
            <F label="Secondary Button Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Contact Us" {...register("contactBtnLabel")} />
              </div>
            </F>
            <F label="Contact Email / href">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="mailto:info@aymyogaschool.com" {...register("contactEmail")} />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 10. PAGE SETTINGS ══ */}
        <Sec title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="hatha-yoga-teacher-training-india" {...register("slug", { required: "Slug is required" })} />
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
        <Link href="/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-teacher-training-content" className={styles.cancelBtn}>← Cancel</Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><span className={styles.spinner} /> Saving…</>
          ) : (
            <><span>✦</span> {isEdit ? "Update" : "Save"} Hatha Yoga Page</>
          )}
        </button>
      </div>
    </div>
  );
}
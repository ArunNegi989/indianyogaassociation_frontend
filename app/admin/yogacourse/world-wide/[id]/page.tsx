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

const isEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";

// ── Stable config factory
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

/* ── Divider ── */
function D() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
      margin: "0.4rem 0 1.8rem",
    }} />
  );
}

/* ── Section wrapper ── */
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

/* ── Field wrapper ── */
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

/* ════════════════════════════════════════
   StableJodit Component
════════════════════════════════════════ */
const StableJodit = memo(function StableJodit({
  onSave,
  ph = "Start typing…",
  h = 200,
  err,
  initialValue,
}: {
  onSave: (v: string) => void;
  ph?: string;
  h?: number;
  err?: string;
  initialValue?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(initialValue || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = useMemo(() => makeConfig(ph, h), []);

  const handleChange = useCallback((val: string) => {
    setValue(val);
    onSaveRef.current(val);
  }, []);

  useEffect(() => {
    if (initialValue && !value) {
      setValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`${styles.joditWrap} ${err ? styles.joditError : ""}`}
      style={{ minHeight: h }}
    >
      {visible ? (
        <JoditEditor 
          config={config} 
          value={value}
          onChange={handleChange} 
        />
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

/* ── LazyJodit ── */
const LazyJodit = memo(function LazyJodit({
  label, hint, cr, err, clr,
  ph = "Start typing…", h = 200, required = false, initialValue,
}: {
  label: string; hint?: string;
  cr: React.MutableRefObject<string>;
  err?: string; clr?: () => void;
  ph?: string; h?: number; required?: boolean;
  initialValue?: string;
}) {
  const handleSave = useCallback((v: string) => {
    cr.current = v;
    if (clr && !isEmpty(v)) clr();
  }, []);

  useEffect(() => {
    if (initialValue) {
      cr.current = initialValue;
    }
  }, [initialValue]);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <StableJodit onSave={handleSave} ph={ph} h={h} err={err} initialValue={initialValue} />
    </div>
  );
});

/* ── RichListItem ── */
const RichListItem = memo(function RichListItem({
  id, index, total, onSave, onRemove, ph, initialValue,
}: {
  id: string; index: number; total: number;
  onSave: (id: string, v: string) => void;
  onRemove: (id: string) => void;
  ph?: string;
  initialValue?: string;
}) {
  const handleSave = useCallback((v: string) => onSave(id, v), [id, onSave]);

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
        <StableJodit onSave={handleSave} ph={ph} h={180} initialValue={initialValue} />
      </div>
    </div>
  );
});

/* ── String list ── */
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
                onChange={(e) => onUpdate(i, e.target.value)}
              />
            </div>
            <button
              type="button" className={styles.removeItemBtn}
              onClick={() => onRemove(i)} disabled={items.length <= 1}
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

/* ── Single image uploader ── */
function SingleImg({ preview, badge, hint, error, onSelect, onRemove, existingUrl }: {
  preview: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void;
  existingUrl?: string;
}) {
  const [localPreview, setLocalPreview] = useState(preview);

  useEffect(() => {
    if (existingUrl && !preview) {
      setLocalPreview(existingUrl);
    }
  }, [existingUrl, preview]);

  const handleSelect = (f: File, p: string) => {
    setLocalPreview(p);
    onSelect(f, p);
  };

  const handleRemove = () => {
    setLocalPreview("");
    onRemove();
  };

  return (
    <div>
      <div className={`${styles.imageUploadZone} ${localPreview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!localPreview ? (
          <>
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { handleSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
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
            <img src={localPreview} alt="" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { handleSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
                }} />
            </div>
            <button type="button" className={styles.removeImageBtn}
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ════════════════════════════════════════
   BENEFIT ITEM (Transformation)
════════════════════════════════════════ */
interface BenefitItem {
  id: string; num: string; text: string;
}

function BenefitsManager({ items, onChange }: { items: BenefitItem[]; onChange: (items: BenefitItem[]) => void }) {
  const update = (id: string, text: string) => {
    onChange(items.map(i => i.id === id ? { ...i, text } : i));
  };
  const add = () => {
    const newNum = String(items.length + 1).padStart(2, '0');
    onChange([...items, { id: `b-${Date.now()}`, num: newNum, text: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    const filtered = items.filter(i => i.id !== id);
    const renumbered = filtered.map((item, idx) => ({ ...item, num: String(idx + 1).padStart(2, '0') }));
    onChange(renumbered);
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Benefit {item.num}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                <span className={styles.labelIcon}>✦</span>Benefit Text
              </label>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`}
                  rows={2} placeholder="Describe the benefit..." value={item.text}
                  onChange={(e) => update(item.id, e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Benefit</button>
    </div>
  );
}

/* ════════════════════════════════════════
   LOCATION ITEM
════════════════════════════════════════ */
interface LocationItem {
  id: string; name: string; flag: string; href: string; region: string;
}

function LocationsManager({ items, onChange }: { items: LocationItem[]; onChange: (items: LocationItem[]) => void }) {
  const update = (id: string, field: keyof LocationItem, value: string) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    onChange([...items, { id: `loc-${Date.now()}`, name: "", flag: "", href: "", region: "Asia" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Location</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2} style={{ marginBottom: "0.6rem" }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Location Name</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.name} placeholder="e.g. Yoga Teacher Training In Bali"
                    onChange={(e) => update(item.id, "name", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Flag Emoji</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.flag} placeholder="🇮🇳"
                    onChange={(e) => update(item.id, "flag", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>URL Slug / Path</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.href} placeholder="/world-wide/yoga-teacher-training-in-bali"
                    onChange={(e) => update(item.id, "href", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Region</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.region} placeholder="Asia / Europe / Pacific"
                    onChange={(e) => update(item.id, "region", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Location</button>
    </div>
  );
}

/* ════════════════════════════════════════
   STATS ITEMS
════════════════════════════════════════ */
interface StatItem {
  id: string; val: string; label: string;
}

function StatsManager({ items, onChange }: { items: StatItem[]; onChange: (items: StatItem[]) => void }) {
  const update = (id: string, field: "val" | "label", value: string) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    onChange([...items, { id: `stat-${Date.now()}`, val: "", label: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Statistic</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2} style={{ marginBottom: "0.6rem" }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Value (e.g. 19+)</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.val} placeholder="19+"
                    onChange={(e) => update(item.id, "val", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Label (e.g. Countries)</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.label} placeholder="Countries"
                    onChange={(e) => update(item.id, "label", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Statistic</button>
    </div>
  );
}

/* ── Form fields ── */
interface FormData {
  slug: string; status: "Active" | "Inactive";
  pageTitleH1: string; heroImgAlt: string;
  statsTitle: string;
  curriculumSubHeading: string;
  curriculumTitle: string;
  curriculumRightImageAlt: string;
  teacherTeamTitle: string;
  teacherTeamSubtitle: string;
  teacherTeamLeftImageAlt: string;
  teacherTeamBadgeValue: string;
  teacherTeamBadgeLabel: string;
  benefitsHeading: string;
  benefitsTitle: string;
  wellnessTitle: string;
  communityTitle: string;
  communitySubtext: string;
  locationsTitle: string;
  locationsSubtext: string;
  footerTitle: string;
  footerSubtext: string;
  footerMetaText: string;
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function EditWorldwidePage() {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  /* Hero Images */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [existingHeroUrl, setExistingHeroUrl] = useState("");
  
  /* Curriculum Right Image */
  const [curriculumRightImageFile, setCurriculumRightImageFile] = useState<File | null>(null);
  const [curriculumRightImagePrev, setCurriculumRightImagePrev] = useState("");
  const [existingCurriculumImageUrl, setExistingCurriculumImageUrl] = useState("");
  
  /* Teacher Team Left Image */
  const [teacherTeamLeftImageFile, setTeacherTeamLeftImageFile] = useState<File | null>(null);
  const [teacherTeamLeftImagePrev, setTeacherTeamLeftImagePrev] = useState("");
  const [existingTeacherImageUrl, setExistingTeacherImageUrl] = useState("");

  /* Rich text refs */
  const curriculumIntroRef = useRef("");
  const [curriculumIntroErr, setCurriculumIntroErr] = useState("");
  
  const teacherTeamDescriptionRef = useRef("");
  const wellnessDescriptionRef = useRef("");
  const communityDescriptionRef = useRef("");
  const benefitsSubtextRef = useRef("");

  /* Paragraph arrays */
  const [topParaIds, setTopParaIds] = useState<string[]>([]);
  const topParaRef = useRef<Record<string, string>>({});
  
  const [curriculumParaIds, setCurriculumParaIds] = useState<string[]>([]);
  const curriculumParaRef = useRef<Record<string, string>>({});

  /* Dynamic lists */
  const [curriculumItems, setCurriculumItems] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      slug: "", status: "Active",
      pageTitleH1: "",
      heroImgAlt: "",
      statsTitle: "",
      curriculumSubHeading: "",
      curriculumTitle: "",
      curriculumRightImageAlt: "",
      teacherTeamTitle: "",
      teacherTeamSubtitle: "",
      teacherTeamLeftImageAlt: "",
      teacherTeamBadgeValue: "",
      teacherTeamBadgeLabel: "",
      benefitsHeading: "",
      benefitsTitle: "",
      wellnessTitle: "",
      communityTitle: "",
      communitySubtext: "",
      locationsTitle: "",
      locationsSubtext: "",
      footerTitle: "",
      footerSubtext: "",
      footerMetaText: "",
    },
  });

  // Fetch data on mount
 useEffect(() => {
  const fetchData = async () => {
      try {
        const res = await api.get("/worldwide/content");

const data = res.data?.data;
        
        if (data) {
          // Set form values
          setValue("slug", data.slug || "");
          setValue("status", data.status || "Active");
          setValue("pageTitleH1", data.pageTitleH1 || "");
          setValue("heroImgAlt", data.heroImgAlt || "");
          setValue("statsTitle", data.statsTitle || "");
          setValue("curriculumSubHeading", data.curriculumSubHeading || "");
          setValue("curriculumTitle", data.curriculumTitle || "");
          setValue("curriculumRightImageAlt", data.curriculumRightImageAlt || "");
          setValue("teacherTeamTitle", data.teacherTeamTitle || "");
          setValue("teacherTeamSubtitle", data.teacherTeamSubtitle || "");
          setValue("teacherTeamLeftImageAlt", data.teacherTeamLeftImageAlt || "");
          setValue("teacherTeamBadgeValue", data.teacherTeamBadgeValue || "");
          setValue("teacherTeamBadgeLabel", data.teacherTeamBadgeLabel || "");
          setValue("benefitsHeading", data.benefitsHeading || "");
          setValue("benefitsTitle", data.benefitsTitle || "");
          setValue("wellnessTitle", data.wellnessTitle || "");
          setValue("communityTitle", data.communityTitle || "");
          setValue("communitySubtext", data.communitySubtext || "");
          setValue("locationsTitle", data.locationsTitle || "");
          setValue("locationsSubtext", data.locationsSubtext || "");
          setValue("footerTitle", data.footerTitle || "");
          setValue("footerSubtext", data.footerSubtext || "");
          setValue("footerMetaText", data.footerMetaText || "");
          
          // Set existing image URLs
          if (data.heroImage) {
  setExistingHeroUrl(
    process.env.NEXT_PUBLIC_API_URL + data.heroImage
  );
}
          if (data.curriculumRightImage) {
  setExistingCurriculumImageUrl(
    process.env.NEXT_PUBLIC_API_URL + data.curriculumRightImage
  );
}
         if (data.teacherTeamLeftImage) {
  setExistingTeacherImageUrl(
    process.env.NEXT_PUBLIC_API_URL + data.teacherTeamLeftImage
  );
}
          
          // Set rich text refs
          curriculumIntroRef.current = data.curriculumIntro || "";
          teacherTeamDescriptionRef.current = data.teacherTeamDescription || "";
          wellnessDescriptionRef.current = data.wellnessDescription || "";
          communityDescriptionRef.current = data.communityDescription || "";
          benefitsSubtextRef.current = data.benefitsSubtext || "";
          
          // Set top paragraphs
          if (data.topParagraphs && Array.isArray(data.topParagraphs)) {
            const ids: string[] = [];
            data.topParagraphs.forEach((para: string, idx: number) => {
              const id = `tp-${Date.now()}-${idx}`;
              ids.push(id);
              topParaRef.current[id] = para;
            });
            setTopParaIds(ids);
          } else {
            setTopParaIds(["tp1"]);
            topParaRef.current["tp1"] = "";
          }
          
          // Set curriculum paragraphs
          if (data.curriculumParagraphs && Array.isArray(data.curriculumParagraphs)) {
            const ids: string[] = [];
            data.curriculumParagraphs.forEach((para: string, idx: number) => {
              const id = `cp-${Date.now()}-${idx}`;
              ids.push(id);
              curriculumParaRef.current[id] = para;
            });
            setCurriculumParaIds(ids);
          } else {
            setCurriculumParaIds(["cp1"]);
            curriculumParaRef.current["cp1"] = "";
          }
          
          // Set dynamic lists
          if (data.curriculumItems) setCurriculumItems(data.curriculumItems);
          if (data.benefits) setBenefits(data.benefits);
          if (data.stats) setStats(data.stats);
          if (data.locations) setLocations(data.locations);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load data");
        router.push("/admin/worldwide/list");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  /* ── Stable para handlers ── */
  const addTopPara = useCallback(() => {
    const id = `tp-${Date.now()}`;
    topParaRef.current[id] = "";
    setTopParaIds(p => [...p, id]);
  }, []);
  const removeTopPara = useCallback((id: string) => {
    delete topParaRef.current[id];
    setTopParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurTopPara = useCallback((id: string, v: string) => {
    topParaRef.current[id] = v;
  }, []);

  const addCurriculumPara = useCallback(() => {
    const id = `cp-${Date.now()}`;
    curriculumParaRef.current[id] = "";
    setCurriculumParaIds(p => [...p, id]);
  }, []);
  const removeCurriculumPara = useCallback((id: string) => {
    delete curriculumParaRef.current[id];
    setCurriculumParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurCurriculumPara = useCallback((id: string, v: string) => {
    curriculumParaRef.current[id] = v;
  }, []);

  /* Curriculum items handlers */
  const addCurriculumItem = useCallback(() => setCurriculumItems(p => [...p, ""]), []);
  const updateCurriculumItem = useCallback((i: number, v: string) => {
    const newItems = [...curriculumItems];
    newItems[i] = v;
    setCurriculumItems(newItems);
  }, [curriculumItems]);
  const removeCurriculumItem = useCallback((i: number) => {
    if (curriculumItems.length <= 1) return;
    setCurriculumItems(p => p.filter((_, idx) => idx !== i));
  }, [curriculumItems]);

  const onSubmit = async (data: FormData) => {
    let hasErr = false;
    if (!heroFile && !existingHeroUrl) { setHeroErr("Hero image is required"); hasErr = true; }
    if (isEmpty(curriculumIntroRef.current)) { setCurriculumIntroErr("Required"); hasErr = true; }
    if (hasErr) return;

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));
      

      // Top section paragraphs
      topParaIds.forEach((id, i) => fd.append(`topPara${i + 1}`, topParaRef.current[id] || ""));
      fd.append("topParagraphCount", String(topParaIds.length));

      // Curriculum intro and paragraphs
      fd.append("curriculumIntro", curriculumIntroRef.current);
      curriculumParaIds.forEach((id, i) => fd.append(`curriculumPara${i + 1}`, curriculumParaRef.current[id] || ""));
      fd.append("curriculumParagraphCount", String(curriculumParaIds.length));

      // Rich text descriptions
      fd.append("teacherTeamDescription", teacherTeamDescriptionRef.current);
      fd.append("wellnessDescription", wellnessDescriptionRef.current);
      fd.append("communityDescription", communityDescriptionRef.current);
      fd.append("benefitsSubtext", benefitsSubtextRef.current);

      // JSON data
      fd.append("curriculumItems", JSON.stringify(curriculumItems));
      fd.append("benefits", JSON.stringify(benefits));
      fd.append("stats", JSON.stringify(stats));
      fd.append("locations", JSON.stringify(locations));

      // Images - only append if new files are selected
     // Images
if (heroFile) fd.append("heroImage", heroFile);
if (curriculumRightImageFile) fd.append("curriculumRightImage", curriculumRightImageFile);
if (teacherTeamLeftImageFile) fd.append("teacherTeamLeftImage", teacherTeamLeftImageFile);

// API
await api.put("/worldwide/content/update", fd, {
  headers: { "Content-Type": "multipart/form-data" },
});

      toast.success("Page updated successfully!");
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/world-wide"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.formPage}>
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
          <span>Loading page data...</span>
        </div>
      </div>
    );
  }

  if (submitted)
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Worldwide Page Updated!</h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/yogacourse/world-wide")}>
          Worldwide Content
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Page</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Edit Worldwide Landing Page</h1>
          <p className={styles.pageSubtitle}>Hero · Stats · Curriculum (What You'll Study) · Faculty · Benefits (Transformation) · Wellness · Community · Locations · CTA</p>
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

        {/* ════ 1. HERO SECTION ════ */}
        <Sec title="Hero Section">
          <F label="Page Main H1 Heading" req>
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                {...register("pageTitleH1", { required: true })} />
            </div>
          </F>
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg 
              preview={heroPrev} 
              existingUrl={existingHeroUrl}
              badge="Hero" 
              hint="JPG/PNG/WEBP · 1180×540px" 
              error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setExistingHeroUrl(""); }} 
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Yoga Students Group" {...register("heroImgAlt")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ════ 2. TOP SECTION PARAGRAPHS ════ */}
        <Sec title="Top Section Paragraphs" badge="Below Hero">
          <p className={styles.fieldHint}>Main body text below the hero section. You can add multiple paragraphs.</p>
          {topParaIds.map((id, i) => (
            <RichListItem
              key={id} id={id} index={i} total={topParaIds.length}
              onSave={blurTopPara}
              onRemove={removeTopPara}
              ph="AYM Yoga School offers comprehensive yoga teacher training programs worldwide..."
              initialValue={topParaRef.current[id]}
            />
          ))}
          <button type="button" className={styles.addItemBtn} onClick={addTopPara}>
            ＋ Add Paragraph
          </button>
        </Sec>
        <D />

        {/* ════ 3. STATS BAR ════ */}
        <Sec title="Stats Bar" badge="Dynamic Numbers">
          <F label="Stats Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("statsTitle")} />
            </div>
          </F>
          <StatsManager items={stats} onChange={setStats} />
        </Sec>
        <D />

        {/* ════ 4. CURRICULUM SECTION (What You'll Study) ════ */}
        <Sec title="Curriculum Section - What You'll Study" badge="Course Content">
          <F label="Curriculum Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("curriculumTitle")} />
            </div>
          </F>
          <F label="Course Curriculum">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("curriculumSubHeading")} />
            </div>
          </F>
          <F label="Curriculum Introduction Paragraph" req>
            <StableJodit
              onSave={(v) => { curriculumIntroRef.current = v; if (!isEmpty(v)) setCurriculumIntroErr(""); }}
              ph="Being one of the best yoga teacher training course providers in Rishikesh, we at AYM offer a comprehensive yoga curriculum..."
              h={180}
              err={curriculumIntroErr}
              initialValue={curriculumIntroRef.current}
            />
          </F>
          <F label="Additional Curriculum Paragraphs">
            {curriculumParaIds.map((id, i) => (
              <RichListItem
                key={id} id={id} index={i} total={curriculumParaIds.length}
                onSave={blurCurriculumPara}
                onRemove={removeCurriculumPara}
                ph="You'll learn about different topics and techniques of all levels..."
                initialValue={curriculumParaRef.current[id]}
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={addCurriculumPara}>
              ＋ Add Paragraph
            </button>
          </F>
          <F label="Curriculum List Items (What You'll Learn)">
            <StrList
              items={curriculumItems} label="Topic" ph="e.g. Foundations of yoga philosophy"
              onAdd={addCurriculumItem}
              onRemove={removeCurriculumItem}
              onUpdate={updateCurriculumItem}
            />
          </F>
          <F label="Curriculum Right Side Image">
            <SingleImg 
              preview={curriculumRightImagePrev} 
              existingUrl={existingCurriculumImageUrl}
              badge="Curriculum Image" 
              hint="Recommended size: 600×400px. Image on the right side of curriculum section"
              error="" 
              onSelect={(f, p) => { setCurriculumRightImageFile(f); setCurriculumRightImagePrev(p); }}
              onRemove={() => { setCurriculumRightImageFile(null); setCurriculumRightImagePrev(""); setExistingCurriculumImageUrl(""); }} 
            />
          </F>
          <F label="Curriculum Right Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("curriculumRightImageAlt")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ════ 5. TEACHER TEAM SECTION (Our Faculty) ════ */}
        <Sec title="Teacher Team Section - Our Faculty" badge="Instructors">
          <F label="Teacher Team Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("teacherTeamTitle")} />
            </div>
          </F>
          <F label="Teacher Team Subtitle">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("teacherTeamSubtitle")} />
            </div>
          </F>
          <F label="Teacher Team Description">
            <StableJodit
              onSave={(v) => { teacherTeamDescriptionRef.current = v; }}
              ph="At AYM, our yoga teacher training course is conducted by reputed teachers with years of experience..."
              h={200}
              initialValue={teacherTeamDescriptionRef.current}
            />
          </F>
          <F label="Teacher Team Left Side Image">
            <SingleImg 
              preview={teacherTeamLeftImagePrev} 
              existingUrl={existingTeacherImageUrl}
              badge="Faculty Image" 
              hint="Recommended size: 600×500px. Image on the left side of teacher section"
              error="" 
              onSelect={(f, p) => { setTeacherTeamLeftImageFile(f); setTeacherTeamLeftImagePrev(p); }}
              onRemove={() => { setTeacherTeamLeftImageFile(null); setTeacherTeamLeftImagePrev(""); setExistingTeacherImageUrl(""); }} 
            />
          </F>
          <F label="Teacher Team Left Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("teacherTeamLeftImageAlt")} />
            </div>
          </F>
          <div className={styles.grid2}>
            <F label="Badge Value (Years)">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("teacherTeamBadgeValue")} />
              </div>
            </F>
            <F label="Badge Label">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("teacherTeamBadgeLabel")} />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ════ 6. BENEFITS SECTION (Transformation) ════ */}
        <Sec title="Benefits Section - Transformation" badge="Course Benefits">
          <F label="Transformation">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("benefitsHeading")} />
            </div>
          </F>
          <F label="Benefits Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("benefitsTitle")} />
            </div>
          </F>
          <F label="Benefits Subtext (Introductory Text)">
            <StableJodit
              onSave={(v) => { benefitsSubtextRef.current = v; }}
              ph="How will the yoga teacher training course in Rishikesh benefit you? Well, here is what you need to know:"
              h={120}
              initialValue={benefitsSubtextRef.current}
            />
          </F>
          <BenefitsManager items={benefits} onChange={setBenefits} />
        </Sec>
        <D />

        {/* ════ 7. WELLNESS BOX ════ */}
        <Sec title="Wellness / Commitment Box">
          <F label="Wellness Box Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("wellnessTitle")} />
            </div>
          </F>
          <F label="Wellness Description">
            <StableJodit
              onSave={(v) => { wellnessDescriptionRef.current = v; }}
              ph="Want to live a peaceful and healthy life? At AYM, we welcome you as a part of our family..."
              h={180}
              initialValue={wellnessDescriptionRef.current}
            />
          </F>
        </Sec>
        <D />

        {/* ════ 8. COMMUNITY SECTION (Worldwide Network) ════ */}
        <Sec title="Community Section - Worldwide Network" badge="Global Reach">
          <F label="Community Section Subtext (Badge Text)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("communitySubtext")} />
            </div>
          </F>
          <F label="Community Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("communityTitle")} />
            </div>
          </F>
          <F label="Community Description">
            <StableJodit
              onSave={(v) => { communityDescriptionRef.current = v; }}
              ph="Whether you want to deepen your knowledge of yoga or take a step towards a new career..."
              h={200}
              initialValue={communityDescriptionRef.current}
            />
          </F>
        </Sec>
        <D />

        {/* ════ 9. LOCATIONS GRID (Our Global Reach) ════ */}
        <Sec title="Locations Grid - Our Global Reach" badge="Worldwide">
          <F label="Locations Section Subtext (Badge Text)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("locationsSubtext")} />
            </div>
          </F>
          <F label="Locations Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("locationsTitle")} />
            </div>
          </F>
          <LocationsManager items={locations} onChange={setLocations} />
        </Sec>
        <D />

        {/* ════ 10. FOOTER CTA ════ */}
        <Sec title="Footer Call to Action">
          <F label="Footer Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("footerTitle")} />
            </div>
          </F>
          <F label="Footer Subtext">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("footerSubtext")} />
            </div>
          </F>
          <F label="Footer Meta Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} placeholder="Yoga Alliance Certified · Est. 2001 · 19+ Countries" {...register("footerMetaText")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ════ 11. PAGE SETTINGS ════ */}
        <Sec title="Page Settings">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="yoga-teacher-training-worldwide"
                  {...register("slug", { required: "Required" })} />
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

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/world-wide" className={styles.cancelBtn}>
          ← Cancel
        </Link>
        <button type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting
            ? (<><span className={styles.spinner} /> Updating…</>)
            : (<><span>✦</span> Update Worldwide Page</>)
          }
        </button>
      </div>
    </div>
  );
}
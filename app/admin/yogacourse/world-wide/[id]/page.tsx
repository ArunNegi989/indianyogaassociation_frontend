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

const isEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";

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

function D() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
      margin: "0.4rem 0 1.8rem",
    }} />
  );
}

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

/* ── StableJodit ── */
const StableJodit = memo(function StableJodit({
  onSave, ph = "Start typing…", h = 200, err, initialValue,
}: {
  onSave: (v: string) => void; ph?: string; h?: number; err?: string; initialValue?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(initialValue || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), []);
  const handleChange = useCallback((val: string) => {
    setValue(val);
    onSaveRef.current(val);
  }, []);

  useEffect(() => {
    if (initialValue && !value) setValue(initialValue);
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
    <div ref={wrapRef} className={`${styles.joditWrap} ${err ? styles.joditError : ""}`} style={{ minHeight: h }}>
      {visible ? (
        <JoditEditor config={config} value={value} onChange={handleChange} />
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

/* ── RichListItem ── */
const RichListItem = memo(function RichListItem({
  id, index, total, onSave, onRemove, ph, initialValue,
}: {
  id: string; index: number; total: number;
  onSave: (id: string, v: string) => void;
  onRemove: (id: string) => void;
  ph?: string; initialValue?: string;
}) {
  const handleSave = useCallback((v: string) => onSave(id, v), [id, onSave]);
  return (
    <div className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardNum}>Paragraph {index + 1}</span>
        {total > 1 && (
          <button type="button" className={styles.removeNestedBtn} onClick={() => onRemove(id)}>✕ Remove</button>
        )}
      </div>
      <div className={styles.nestedCardBody}>
        <StableJodit onSave={handleSave} ph={ph} h={180} initialValue={initialValue} />
      </div>
    </div>
  );
});

/* ── StrList ── */
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
            <button type="button" className={styles.removeItemBtn}
              onClick={() => onRemove(i)} disabled={items.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {items.length < max && (
        <button type="button" className={styles.addItemBtn} onClick={onAdd}>＋ Add {label}</button>
      )}
    </>
  );
}

/* ── SingleImg ── */
function SingleImg({ preview, badge, hint, error, onSelect, onRemove, existingUrl }: {
  preview: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void;
  existingUrl?: string;
}) {
  const [localPreview, setLocalPreview] = useState(preview);

  useEffect(() => {
    if (existingUrl && !preview) setLocalPreview(existingUrl);
  }, [existingUrl, preview]);

  const handleSelect = (f: File, p: string) => { setLocalPreview(p); onSelect(f, p); };
  const handleRemove = () => { setLocalPreview(""); onRemove(); };

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
   SLIDER IMAGES MANAGER
════════════════════════════════════════ */
interface SliderImageItem {
  id: string;
  file: File | null;
  preview: string;
  existingUrl?: string;
}

function SliderImagesManager({
  items, onChange,
}: {
  items: SliderImageItem[];
  onChange: (items: SliderImageItem[]) => void;
}) {
  const handleAdd = () => {
    onChange([...items, { id: `sl-${Date.now()}`, file: null, preview: "" }]);
  };
  const handleRemove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };
  const handleSelect = (id: string, file: File, preview: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, file, preview } : i)));
  };
  const handleClearPreview = (id: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, file: null, preview: "", existingUrl: "" } : i)));
  };

  return (
    <div>
      <p className={styles.fieldHint}>
        Community section mein display hone wali slider images. Multiple images add kar sakte hain (max 10).
        Existing images neeche preview mein dikh rahe hain. Naye upload karne par replace ho jayenge.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {items.map((item, i) => {
          const displayPreview = item.preview || item.existingUrl || "";
          return (
            <div key={item.id} className={styles.nestedCard} style={{ padding: "0.8rem" }}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Slide {i + 1}</span>
                {items.length > 1 && (
                  <button type="button" className={styles.removeNestedBtn} onClick={() => handleRemove(item.id)}>
                    ✕
                  </button>
                )}
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <div className={`${styles.imageUploadZone} ${displayPreview ? styles.hasImage : ""}`}
                  style={{ minHeight: 120 }}>
                  {!displayPreview ? (
                    <>
                      <input type="file" accept="image/*" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { handleSelect(item.id, f, URL.createObjectURL(f)); e.target.value = ""; }
                      }} />
                      <div className={styles.imageUploadPlaceholder}>
                        <span className={styles.imageUploadIcon}>🖼️</span>
                        <span className={styles.imageUploadText} style={{ fontSize: 12 }}>Click to Upload</span>
                        <span className={styles.imageUploadSub}>1600×900px recommended</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.imagePreviewWrap}>
                      <img src={displayPreview} alt={`Slide ${i + 1}`} className={styles.imagePreview} />
                      <div className={styles.imagePreviewOverlay}>
                        <span className={styles.imagePreviewAction}>✎ Change</span>
                        <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) { handleSelect(item.id, f, URL.createObjectURL(f)); e.target.value = ""; }
                          }} />
                      </div>
                      <button type="button" className={styles.removeImageBtn}
                        onClick={(e) => { e.stopPropagation(); handleClearPreview(item.id); }}>✕</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {items.length < 10 && (
        <button type="button" className={styles.addItemBtn} onClick={handleAdd} style={{ marginTop: "0.8rem" }}>
          ＋ Add Slider Image
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   NAV ITEMS MANAGER
════════════════════════════════════════ */
interface NavItem {
  id_field: string;
  label: string;
  sectionId: string;
}

function NavItemsManager({ items, onChange }: { items: NavItem[]; onChange: (items: NavItem[]) => void }) {
  const update = (id: string, field: "label" | "sectionId", value: string) => {
    onChange(items.map((i) => (i.id_field === id ? { ...i, [field]: value } : i)));
  };
  const add = () => {
    onChange([...items, { id_field: `n-${Date.now()}`, label: "", sectionId: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id_field !== id));
  };

  return (
    <div>
      <p className={styles.fieldHint}>
        Add a sticky navigation bar at the top of the page.
        Label = what will be displayed. Section ID = the HTML id attribute of that section.
      </p>
      {items.map((item, i) => (
        <div key={item.id_field} className={styles.nestedCard} style={{ marginBottom: "0.6rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Nav Item {i + 1}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id_field)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Display Label</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.label} placeholder="e.g. CURRICULUM"
                    onChange={(e) => update(item.id_field, "label", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Section ID (HTML anchor)</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.sectionId} placeholder="e.g. curriculum"
                    onChange={(e) => update(item.id_field, "sectionId", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Nav Item</button>
    </div>
  );
}

/* ════════════════════════════════════════
   BENEFIT ITEM
════════════════════════════════════════ */
interface BenefitItem {
  id: string; num: string; text: string;
}

function BenefitsManager({ items, onChange }: { items: BenefitItem[]; onChange: (items: BenefitItem[]) => void }) {
  const update = (id: string, text: string) => onChange(items.map((i) => (i.id === id ? { ...i, text } : i)));
  const add = () => {
    const newNum = String(items.length + 1).padStart(2, "0");
    onChange([...items, { id: `b-${Date.now()}`, num: newNum, text: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    const filtered = items.filter((i) => i.id !== id);
    onChange(filtered.map((item, idx) => ({ ...item, num: String(idx + 1).padStart(2, "0") })));
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
  const update = (id: string, field: keyof LocationItem, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () => onChange([...items, { id: `loc-${Date.now()}`, name: "", flag: "", href: "", region: "Asia" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((i) => i.id !== id)); };
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
   STATS
════════════════════════════════════════ */
interface StatItem { id: string; val: string; label: string; }

function StatsManager({ items, onChange }: { items: StatItem[]; onChange: (items: StatItem[]) => void }) {
  const update = (id: string, field: "val" | "label", value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () => onChange([...items, { id: `stat-${Date.now()}`, val: "", label: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((i) => i.id !== id)); };
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
            <div className={styles.grid2}>
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

/* ════════════════════════════════════════
   FORM TYPES
════════════════════════════════════════ */
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
  footerApplyLink: string;
  footerEmailAddress: string;
}

/* ════════════════════════════════════════
   MAIN COMPONENT — EDIT
════════════════════════════════════════ */
export default function EditWorldwidePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  /* Images */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [existingHeroUrl, setExistingHeroUrl] = useState("");

  const [curriculumRightImageFile, setCurriculumRightImageFile] = useState<File | null>(null);
  const [curriculumRightImagePrev, setCurriculumRightImagePrev] = useState("");
  const [existingCurriculumImageUrl, setExistingCurriculumImageUrl] = useState("");

  const [teacherTeamLeftImageFile, setTeacherTeamLeftImageFile] = useState<File | null>(null);
  const [teacherTeamLeftImagePrev, setTeacherTeamLeftImagePrev] = useState("");
  const [existingTeacherImageUrl, setExistingTeacherImageUrl] = useState("");

  /* Slider images */
  const [sliderImages, setSliderImages] = useState<SliderImageItem[]>([
    { id: "sl1", file: null, preview: "" },
  ]);

  /* Rich text refs */
  const curriculumIntroRef = useRef("");
  const [curriculumIntroErr, setCurriculumIntroErr] = useState("");
  const teacherTeamDescriptionRef = useRef("");
  const wellnessDescriptionRef = useRef("");
  const communityDescriptionRef = useRef("");
  const benefitsSubtextRef = useRef("");

  /* Rich text initial values for StableJodit */
  const [richInitials, setRichInitials] = useState({
    curriculumIntro: "",
    teacherTeamDescription: "",
    wellnessDescription: "",
    communityDescription: "",
    benefitsSubtext: "",
  });

  /* Paragraph arrays */
  const [topParaIds, setTopParaIds] = useState<string[]>([]);
  const topParaRef = useRef<Record<string, string>>({});
  const [curriculumParaIds, setCurriculumParaIds] = useState<string[]>([]);
  const curriculumParaRef = useRef<Record<string, string>>({});

  /* Dynamic lists */
  const [curriculumItems, setCurriculumItems] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      slug: "", status: "Active",
      pageTitleH1: "", heroImgAlt: "", statsTitle: "",
      curriculumSubHeading: "", curriculumTitle: "", curriculumRightImageAlt: "",
      teacherTeamTitle: "", teacherTeamSubtitle: "", teacherTeamLeftImageAlt: "",
      teacherTeamBadgeValue: "", teacherTeamBadgeLabel: "",
      benefitsHeading: "", benefitsTitle: "", wellnessTitle: "",
      communityTitle: "", communitySubtext: "",
      locationsTitle: "", locationsSubtext: "",
      footerTitle: "", footerSubtext: "", footerMetaText: "",
      footerApplyLink: "", footerEmailAddress: "",
    },
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const resolveImg = (path?: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  /* ── Fetch existing data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/worldwide/content");
        const data = res.data?.data;

        if (data) {
          /* Plain fields */
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
          setValue("footerApplyLink", data.footerApplyLink || "");
          setValue("footerEmailAddress", data.footerEmailAddress || "");

          /* Existing image URLs */
          if (data.heroImage) setExistingHeroUrl(resolveImg(data.heroImage));
          if (data.curriculumRightImage) setExistingCurriculumImageUrl(resolveImg(data.curriculumRightImage));
          if (data.teacherTeamLeftImage) setExistingTeacherImageUrl(resolveImg(data.teacherTeamLeftImage));

          /* Rich text — set refs AND initial values for editors */
          const ci = data.curriculumIntro || "";
          const ttd = data.teacherTeamDescription || "";
          const wd = data.wellnessDescription || "";
          const cd = data.communityDescription || "";
          const bs = data.benefitsSubtext || "";
          curriculumIntroRef.current = ci;
          teacherTeamDescriptionRef.current = ttd;
          wellnessDescriptionRef.current = wd;
          communityDescriptionRef.current = cd;
          benefitsSubtextRef.current = bs;
          setRichInitials({
            curriculumIntro: ci,
            teacherTeamDescription: ttd,
            wellnessDescription: wd,
            communityDescription: cd,
            benefitsSubtext: bs,
          });

          /* Top paragraphs */
          if (data.topParagraphs?.length) {
            const ids: string[] = [];
            data.topParagraphs.forEach((para: string, idx: number) => {
              const id = `tp-${Date.now()}-${idx}`;
              ids.push(id);
              topParaRef.current[id] = para;
            });
            setTopParaIds(ids);
          } else {
            const id = "tp1";
            topParaRef.current[id] = "";
            setTopParaIds([id]);
          }

          /* Curriculum paragraphs */
          if (data.curriculumParagraphs?.length) {
            const ids: string[] = [];
            data.curriculumParagraphs.forEach((para: string, idx: number) => {
              const id = `cp-${Date.now()}-${idx}`;
              ids.push(id);
              curriculumParaRef.current[id] = para;
            });
            setCurriculumParaIds(ids);
          } else {
            const id = "cp1";
            curriculumParaRef.current[id] = "";
            setCurriculumParaIds([id]);
          }

          /* Dynamic lists */
          if (data.curriculumItems?.length) setCurriculumItems(data.curriculumItems);
          else setCurriculumItems([""]);

          if (data.benefits?.length) {
            setBenefits(data.benefits.map((b: any, idx: number) => ({
              id: `b-${Date.now()}-${idx}`,
              num: b.num || String(idx + 1).padStart(2, "0"),
              text: b.text || "",
            })));
          }

          if (data.stats?.length) {
            setStats(data.stats.map((s: any, idx: number) => ({
              id: `stat-${Date.now()}-${idx}`,
              val: s.val || "",
              label: s.label || "",
            })));
          }

          if (data.locations?.length) {
            setLocations(data.locations.map((l: any, idx: number) => ({
              id: `loc-${Date.now()}-${idx}`,
              name: l.name || "",
              flag: l.flag || "",
              href: l.href || "",
              region: l.region || "",
            })));
          }

          /* Nav items — backend stores { label, id } → map to { id_field, label, sectionId } */
          if (data.navItems?.length) {
            setNavItems(data.navItems.map((n: any, idx: number) => ({
              id_field: `n-${Date.now()}-${idx}`,
              label: n.label || "",
              sectionId: n.id || "",
            })));
          } else {
            setNavItems([{ id_field: "n1", label: "", sectionId: "" }]);
          }

          /* Community slider images — load existing URLs */
          if (data.communitySliderImages?.length) {
            setSliderImages(
              data.communitySliderImages.map((imgPath: string, idx: number) => ({
                id: `sl-${Date.now()}-${idx}`,
                file: null,
                preview: "",
                existingUrl: resolveImg(imgPath),
              }))
            );
          }
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load data");
        router.push("/admin/yogacourse/world-wide");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ── Para handlers ── */
  const addTopPara = useCallback(() => {
    const id = `tp-${Date.now()}`; topParaRef.current[id] = ""; setTopParaIds((p) => [...p, id]);
  }, []);
  const removeTopPara = useCallback((id: string) => {
    delete topParaRef.current[id]; setTopParaIds((p) => p.filter((x) => x !== id));
  }, []);
  const blurTopPara = useCallback((id: string, v: string) => { topParaRef.current[id] = v; }, []);

  const addCurriculumPara = useCallback(() => {
    const id = `cp-${Date.now()}`; curriculumParaRef.current[id] = ""; setCurriculumParaIds((p) => [...p, id]);
  }, []);
  const removeCurriculumPara = useCallback((id: string) => {
    delete curriculumParaRef.current[id]; setCurriculumParaIds((p) => p.filter((x) => x !== id));
  }, []);
  const blurCurriculumPara = useCallback((id: string, v: string) => { curriculumParaRef.current[id] = v; }, []);

  const addCurriculumItem = useCallback(() => setCurriculumItems((p) => [...p, ""]), []);
  const updateCurriculumItem = useCallback((i: number, v: string) => {
    setCurriculumItems((prev) => { const n = [...prev]; n[i] = v; return n; });
  }, []);
  const removeCurriculumItem = useCallback((i: number) => {
    if (curriculumItems.length <= 1) return;
    setCurriculumItems((p) => p.filter((_, idx) => idx !== i));
  }, [curriculumItems]);

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    let hasErr = false;
    if (!heroFile && !existingHeroUrl) { setHeroErr("Hero image is required"); hasErr = true; }
    if (isEmpty(curriculumIntroRef.current)) { setCurriculumIntroErr("Required"); hasErr = true; }
    if (hasErr) return;

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      /* Paragraphs */
      topParaIds.forEach((id, i) => fd.append(`topPara${i + 1}`, topParaRef.current[id] || ""));
      fd.append("topParagraphCount", String(topParaIds.length));

      fd.append("curriculumIntro", curriculumIntroRef.current);
      curriculumParaIds.forEach((id, i) => fd.append(`curriculumPara${i + 1}`, curriculumParaRef.current[id] || ""));
      fd.append("curriculumParagraphCount", String(curriculumParaIds.length));

      /* Rich text */
      fd.append("teacherTeamDescription", teacherTeamDescriptionRef.current);
      fd.append("wellnessDescription", wellnessDescriptionRef.current);
      fd.append("communityDescription", communityDescriptionRef.current);
      fd.append("benefitsSubtext", benefitsSubtextRef.current);

      /* JSON lists */
      fd.append("curriculumItems", JSON.stringify(curriculumItems));
      fd.append("benefits", JSON.stringify(benefits));
      fd.append("stats", JSON.stringify(stats));
      fd.append("locations", JSON.stringify(locations));
      fd.append("navItems", JSON.stringify(navItems.map((n) => ({ label: n.label, id: n.sectionId }))));

      /* Images — only new files */
      if (heroFile) fd.append("heroImage", heroFile);
      if (curriculumRightImageFile) fd.append("curriculumRightImage", curriculumRightImageFile);
      if (teacherTeamLeftImageFile) fd.append("teacherTeamLeftImage", teacherTeamLeftImageFile);

      /* Slider images — only newly selected files */
      sliderImages.forEach((item) => { if (item.file) fd.append("communitySliderImages", item.file); });

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

  /* ── Loading ── */
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

  /* ── Success ── */
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
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/world-wide")}>
          Worldwide Content
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Page</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Edit Worldwide Landing Page</h1>
          <p className={styles.pageSubtitle}>
            Page Settings · Sticky Nav · Hero · Stats · Curriculum · Faculty · Benefits · Wellness · Community · Slider · Locations · CTA
          </p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ════ 1. PAGE SETTINGS ════ */}
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
        <D />

        {/* ════ 2. STICKY NAV ════ */}
        <Sec title="Sticky Section Navigation" badge="Top Nav Bar">
          <NavItemsManager items={navItems} onChange={setNavItems} />
        </Sec>
        <D />

        {/* ════ 3. HERO SECTION ════ */}
        <Sec title="Hero Section">
          <F label="Page Main H1 Heading" req>
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                {...register("pageTitleH1", { required: true })} />
            </div>
          </F>
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg
              preview={heroPrev} existingUrl={existingHeroUrl}
              badge="Hero" hint="JPG/PNG/WEBP · 1180×540px" error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setExistingHeroUrl(""); }} />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Yoga Students Group" {...register("heroImgAlt")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ════ 4. TOP SECTION PARAGRAPHS ════ */}
        <Sec title="Top Section Paragraphs" badge="Below Hero">
          <p className={styles.fieldHint}>Hero ke neeche main body text. Multiple paragraphs add kar sakte hain.</p>
          {topParaIds.map((id, i) => (
            <RichListItem key={id} id={id} index={i} total={topParaIds.length}
              onSave={blurTopPara} onRemove={removeTopPara}
              ph="AYM Yoga School offers comprehensive yoga teacher training programs worldwide..."
              initialValue={topParaRef.current[id]} />
          ))}
          <button type="button" className={styles.addItemBtn} onClick={addTopPara}>＋ Add Paragraph</button>
        </Sec>
        <D />

        {/* ════ 5. STATS BAR ════ */}
        <Sec title="Stats Bar" badge="Dynamic Numbers">
          <F label="Stats Section Title">
            <div className={styles.inputWrap}><input className={styles.input} {...register("statsTitle")} /></div>
          </F>
          <StatsManager items={stats} onChange={setStats} />
        </Sec>
        <D />

        {/* ════ 6. CURRICULUM SECTION ════ */}
        <Sec title="Curriculum Section — What You'll Study" badge="Course Content">
          <F label="Curriculum Section Title">
            <div className={styles.inputWrap}><input className={styles.input} {...register("curriculumTitle")} /></div>
          </F>
          <F label="Course Curriculum Sub-Heading">
            <div className={styles.inputWrap}><input className={styles.input} {...register("curriculumSubHeading")} /></div>
          </F>
          <F label="Curriculum Introduction Paragraph" req>
            <StableJodit
              onSave={(v) => { curriculumIntroRef.current = v; if (!isEmpty(v)) setCurriculumIntroErr(""); }}
              ph="Being one of the best yoga teacher training course providers in Rishikesh..."
              h={180} err={curriculumIntroErr} initialValue={richInitials.curriculumIntro} />
          </F>
          <F label="Additional Curriculum Paragraphs">
            {curriculumParaIds.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={curriculumParaIds.length}
                onSave={blurCurriculumPara} onRemove={removeCurriculumPara}
                ph="You'll learn about different topics and techniques of all levels..."
                initialValue={curriculumParaRef.current[id]} />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={addCurriculumPara}>＋ Add Paragraph</button>
          </F>
          <F label="Curriculum List Items (What You'll Learn)">
            <StrList items={curriculumItems} label="Topic" ph="e.g. Foundations of yoga philosophy"
              onAdd={addCurriculumItem} onRemove={removeCurriculumItem} onUpdate={updateCurriculumItem} />
          </F>
          <F label="Curriculum Right Side Image">
            <SingleImg
              preview={curriculumRightImagePrev} existingUrl={existingCurriculumImageUrl}
              badge="Curriculum Image" hint="600×400px recommended" error=""
              onSelect={(f, p) => { setCurriculumRightImageFile(f); setCurriculumRightImagePrev(p); }}
              onRemove={() => { setCurriculumRightImageFile(null); setCurriculumRightImagePrev(""); setExistingCurriculumImageUrl(""); }} />
          </F>
          <F label="Curriculum Right Image Alt Text">
            <div className={styles.inputWrap}><input className={styles.input} {...register("curriculumRightImageAlt")} /></div>
          </F>
        </Sec>
        <D />

        {/* ════ 7. TEACHER TEAM SECTION ════ */}
        <Sec title="Teacher Team Section — Our Faculty" badge="Instructors">
          <F label="Teacher Team Title">
            <div className={styles.inputWrap}><input className={styles.input} {...register("teacherTeamTitle")} /></div>
          </F>
          <F label="Teacher Team Subtitle">
            <div className={styles.inputWrap}><input className={styles.input} {...register("teacherTeamSubtitle")} /></div>
          </F>
          <F label="Teacher Team Description">
            <StableJodit onSave={(v) => { teacherTeamDescriptionRef.current = v; }}
              ph="At AYM, our yoga teacher training course is conducted by reputed teachers..." h={200}
              initialValue={richInitials.teacherTeamDescription} />
          </F>
          <F label="Teacher Team Left Side Image">
            <SingleImg
              preview={teacherTeamLeftImagePrev} existingUrl={existingTeacherImageUrl}
              badge="Faculty Image" hint="600×500px recommended" error=""
              onSelect={(f, p) => { setTeacherTeamLeftImageFile(f); setTeacherTeamLeftImagePrev(p); }}
              onRemove={() => { setTeacherTeamLeftImageFile(null); setTeacherTeamLeftImagePrev(""); setExistingTeacherImageUrl(""); }} />
          </F>
          <F label="Teacher Team Left Image Alt Text">
            <div className={styles.inputWrap}><input className={styles.input} {...register("teacherTeamLeftImageAlt")} /></div>
          </F>
          <div className={styles.grid2}>
            <F label="Badge Value">
              <div className={styles.inputWrap}><input className={styles.input} {...register("teacherTeamBadgeValue")} /></div>
            </F>
            <F label="Badge Label">
              <div className={styles.inputWrap}><input className={styles.input} {...register("teacherTeamBadgeLabel")} /></div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ════ 8. BENEFITS SECTION ════ */}
        <Sec title="Benefits Section — Transformation" badge="Course Benefits">
          <F label="Section Badge Text (e.g. Transformation)">
            <div className={styles.inputWrap}><input className={styles.input} {...register("benefitsHeading")} /></div>
          </F>
          <F label="Benefits Section Title">
            <div className={styles.inputWrap}><input className={styles.input} {...register("benefitsTitle")} /></div>
          </F>
          <F label="Benefits Introductory Text">
            <StableJodit onSave={(v) => { benefitsSubtextRef.current = v; }}
              ph="How will the yoga teacher training course benefit you? Here is what you need to know:" h={120}
              initialValue={richInitials.benefitsSubtext} />
          </F>
          <BenefitsManager items={benefits} onChange={setBenefits} />
        </Sec>
        <D />

        {/* ════ 9. WELLNESS BOX ════ */}
        <Sec title="Wellness / Commitment Box">
          <F label="Wellness Box Title">
            <div className={styles.inputWrap}><input className={styles.input} {...register("wellnessTitle")} /></div>
          </F>
          <F label="Wellness Description">
            <StableJodit onSave={(v) => { wellnessDescriptionRef.current = v; }}
              ph="Want to live a peaceful and healthy life? At AYM, we welcome you..." h={180}
              initialValue={richInitials.wellnessDescription} />
          </F>
        </Sec>
        <D />

        {/* ════ 10. COMMUNITY SECTION ════ */}
        <Sec title="Community Section — Worldwide Network" badge="Global Reach">
          <F label="Community Badge Text">
            <div className={styles.inputWrap}><input className={styles.input} {...register("communitySubtext")} /></div>
          </F>
          <F label="Community Section Title">
            <div className={styles.inputWrap}><input className={styles.input} {...register("communityTitle")} /></div>
          </F>
          <F label="Community Description">
            <StableJodit onSave={(v) => { communityDescriptionRef.current = v; }}
              ph="Whether you want to deepen your knowledge of yoga or take a step towards a new career..." h={200}
              initialValue={richInitials.communityDescription} />
          </F>
          {/* ✅ Slider Images — with existing images pre-loaded */}
          <F label="Community Slider Images" hint="Existing images are shown below. Upload new ones to replace them (max 10 total).">
            <SliderImagesManager items={sliderImages} onChange={setSliderImages} />
          </F>
        </Sec>
        <D />

        {/* ════ 11. LOCATIONS GRID ════ */}
        <Sec title="Locations Grid — Our Global Reach" badge="Worldwide">
          <F label="Locations Badge Text">
            <div className={styles.inputWrap}><input className={styles.input} {...register("locationsSubtext")} /></div>
          </F>
          <F label="Locations Section Title">
            <div className={styles.inputWrap}><input className={styles.input} {...register("locationsTitle")} /></div>
          </F>
          <LocationsManager items={locations} onChange={setLocations} />
        </Sec>
        <D />

        {/* ════ 12. FOOTER CTA ════ */}
        <Sec title="Footer Call to Action">
          <F label="Footer Title">
            <div className={styles.inputWrap}><input className={styles.input} {...register("footerTitle")} /></div>
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
          <div className={styles.grid2}>
            <F label="Apply Now Button Link" hint="e.g. /apply">
              <div className={styles.inputWrap}>
                <input className={styles.input} placeholder="/apply" {...register("footerApplyLink")} />
              </div>
            </F>
            <F label="Email Address" hint="Email Us button ke liye">
              <div className={styles.inputWrap}>
                <input className={styles.input} placeholder="aymyogaschool@gmail.com" {...register("footerEmailAddress")} />
              </div>
            </F>
          </div>
        </Sec>

      </div>{/* /formCard */}

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/world-wide" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting
            ? (<><span className={styles.spinner} /> Updating…</>)
            : (<><span>✦</span> Update Worldwide Page</>)}
        </button>
      </div>
    </div>
  );
}
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  memo,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "paragraph",
      "align",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "|",
      "undo",
      "redo",
      "|",
      "selectall",
      "cut",
      "copy",
      "paste",
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
    <div
      style={{
        height: 1,
        background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
        margin: "0.4rem 0 1.8rem",
      }}
    />
  );
}

/* ─── Section wrapper ─── */
function Sec({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
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
function F({
  label,
  hint,
  req,
  children,
}: {
  label: string;
  hint?: string;
  req?: boolean;
  children: React.ReactNode;
}) {
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

/* ─────────────────────────────────────────
   STABLE JODIT  (lazy via IntersectionObserver)
───────────────────────────────────────── */
const StableJodit = memo(function StableJodit({
  onSave,
  value,
  ph = "Start typing…",
  h = 220,
  err,
}: {
  onSave: (v: string) => void;
  value?: string;
  ph?: string;
  h?: number;
  err?: string;
}) {
  const [visible, setVisible] = useState(false);
  const initialValue = useRef(value || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), [ph, h]);
  const handleChange = useCallback((val: string) => {
    onSaveRef.current(val);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
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
          value={initialValue.current}
          onChange={handleChange}
        />
      ) : (
        <div
          style={{
            height: h,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#faf8f4",
            border: "1px solid #e8d5b5",
            borderRadius: 8,
            color: "#bbb",
            fontSize: 13,
          }}
        >
          ✦ Scroll to load editor…
        </div>
      )}
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
});

/* ─────────────────────────────────────────
   DYNAMIC PARAGRAPH LIST
   — 1 para shown by default, Jodit editor per para
───────────────────────────────────────── */
interface ParaItem {
  id: string;
  value: string;
}

function mkPara(val = ""): ParaItem {
  return { id: `p-${Date.now()}-${Math.random()}`, value: val };
}

function DynamicParaList({
  items,
  onChange,
  ph = "Start typing paragraph…",
  addLabel = "Add Paragraph",
  minItems = 1,
}: {
  items: ParaItem[];
  onChange: (items: ParaItem[]) => void;
  ph?: string;
  addLabel?: string;
  minItems?: number;
}) {
  const handleChange = useCallback(
    (id: string, val: string) => {
      onChange(items.map((p) => (p.id === id ? { ...p, value: val } : p)));
    },
    [items, onChange],
  );

  const handleAdd = () => {
    onChange([...items, mkPara()]);
  };

  const handleRemove = (id: string) => {
    if (items.length <= minItems) return;
    onChange(items.filter((p) => p.id !== id));
  };

  return (
    <div>
      {items.map((para, i) => (
        <div
          key={para.id}
          className={styles.nestedCard}
          style={{ marginBottom: "0.85rem" }}
        >
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Paragraph {i + 1}</span>
            {items.length > minItems && (
              <button
                type="button"
                className={styles.removeNestedBtn}
                onClick={() => handleRemove(para.id)}
              >
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <StableJodit
              value={para.value}
              onSave={(val) => handleChange(para.id, val)}
              ph={ph}
              h={200}
            />
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={handleAdd}>
        ＋ {addLabel}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   STRING LIST
───────────────────────────────────────── */
function StrList({
  items,
  onAdd,
  onRemove,
  onUpdate,
  max = 30,
  ph,
  label,
}: {
  items: string[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onUpdate: (i: number, v: string) => void;
  max?: number;
  ph?: string;
  label: string;
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
              type="button"
              className={styles.removeItemBtn}
              onClick={() => onRemove(i)}
              disabled={items.length <= 1}
            >
              ✕
            </button>
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

/* ─────────────────────────────────────────
   SINGLE IMAGE UPLOADER
───────────────────────────────────────── */
function SingleImg({
  preview,
  badge,
  hint,
  error,
  onSelect,
  onRemove,
}: {
  preview: string;
  badge?: string;
  hint: string;
  error?: string;
  onSelect: (f: File, p: string) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <div
        className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}
        style={{ minHeight: preview ? "auto" : 140 }}
      >
        {!preview ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  onSelect(f, URL.createObjectURL(f));
                  e.target.value = "";
                }
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
                type="file"
                accept="image/*"
                className={styles.imagePreviewOverlayInput}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    onSelect(f, URL.createObjectURL(f));
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <button
              type="button"
              className={styles.removeImageBtn}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────
   MULTI IMAGE UPLOADER  (improved design)
───────────────────────────────────────── */
interface MultiImgItem {
  id: string;
  file?: File;
  preview: string;
}

function MultiImg({
  items,
  onChange,
  hint,
  max = 10,
  label,
}: {
  items: MultiImgItem[];
  onChange: (v: MultiImgItem[]) => void;
  hint: string;
  max?: number;
  label: string;
}) {
  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.slice(0, max - items.length).map((f) => ({
      id: `img-${Date.now()}-${Math.random()}`,
      file: f,
      preview: URL.createObjectURL(f),
    }));
    onChange([...items, ...newItems]);
    e.target.value = "";
  };
  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      {/* Empty state: full drop zone */}
      {items.length === 0 && (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            minHeight: 148,
            border: "2px dashed rgba(224,123,0,0.35)",
            borderRadius: 10,
            background: "rgba(255,250,242,0.6)",
            cursor: "pointer",
            transition: "all 0.22s",
            marginBottom: "0.75rem",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e07b00")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "rgba(224,123,0,0.35)")
          }
        >
          <span
            style={{
              fontSize: "2rem",
              color: "rgba(224,123,0,0.4)",
              lineHeight: 1,
            }}
          >
            🖼️
          </span>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.07em",
              color: "#a07840",
              textTransform: "uppercase",
            }}
          >
            Click to Upload Photos
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.8rem",
              color: "rgba(160,120,64,0.6)",
              fontStyle: "italic",
            }}
          >
            {hint}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleAdd}
          />
        </label>
      )}

      {/* Grid with thumbnails + add-more tile */}
      {items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e8d5b5",
                aspectRatio: "4/3",
                background: "#fdf7ee",
              }}
            >
              <img
                src={item.preview}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* hover overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(30,10,0,0)",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(30,10,0,0.28)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(30,10,0,0)")
                }
              />
              <button
                type="button"
                onClick={() => remove(item.id)}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  width: "1.6rem",
                  height: "1.6rem",
                  borderRadius: "50%",
                  background: "rgba(139,32,0,0.88)",
                  border: "1px solid rgba(196,74,0,0.5)",
                  color: "#ffe0cc",
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.18s",
                  zIndex: 2,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#c44a00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(139,32,0,0.88)")
                }
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add more tile */}
          {items.length < max && (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                border: "2px dashed rgba(224,123,0,0.35)",
                borderRadius: 8,
                background: "rgba(255,250,242,0.6)",
                cursor: "pointer",
                transition: "all 0.22s",
                aspectRatio: "4/3",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#e07b00")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(224,123,0,0.35)")
              }
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "rgba(224,123,0,0.5)",
                  lineHeight: 1,
                }}
              >
                ＋
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.72rem",
                  color: "#a07840",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "0 0.4rem",
                }}
              >
                {label}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleAdd}
              />
            </label>
          )}
        </div>
      )}

      <p className={styles.fieldHint} style={{ margin: 0 }}>
        {hint} ·{" "}
        <strong>
          {items.length}/{max}
        </strong>{" "}
        uploaded
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.1rem",
            fontSize: "1.5rem",
            lineHeight: 1,
            color:
              (hover || value) >= star ? "#e07b00" : "rgba(160,120,64,0.22)",
            transition: "color 0.15s, transform 0.12s",
            transform: hover === star ? "scale(1.2)" : "scale(1)",
          }}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.85rem",
            color: "#a07840",
            fontStyle: "italic",
            marginLeft: "0.3rem",
          }}
        >
          {value} / 5
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   FORM VALUES INTERFACE
───────────────────────────────────────── */
interface PageFormValues {
  slug: string;
  status: "Active" | "Inactive";
  pageMainH1: string;
  heroImgAlt: string;
  standApartH2: string;
  gainsH2: string;
  seatSectionH2: string;
  seatSectionSubtext: string;
  tableNoteText: string;
  tableNoteEmail: string;
  tableNoteAirportText: string;
  credibilityH2: string;
  durationH2: string;
  syllabusH2: string;
  eligibilityH3: string;
  evaluationH3: string;
  includedTitle: string;
  includedNote: string;
  notIncludedTitle: string;
  fictionH3: string;
  reviewsSectionH2: string;
  refundH3: string;
  refundPara: string;
  applyH3: string;
  applyPara: string;
  indianFeeH3: string;
}

/* ─────────────────────────────────────────
   REVIEW TYPE  (star rating + Jodit text)
───────────────────────────────────────── */
interface ReviewItem {
  name: string;
  platform: string;
  initial: string;
  rating: number;
  text: string;
}

/* ══════════════════════════════════════════
   MAIN FORM COMPONENT
══════════════════════════════════════════ */
export default function AddEdit500HrPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id as string;
  const isEdit = !!pageId && pageId !== "add-new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  /* ── Single Images ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [shivaFile, setShivaFile] = useState<File | null>(null);
  const [shivaPrev, setShivaPrev] = useState("");
  const [evalImgFile, setEvalImgFile] = useState<File | null>(null);
  const [evalImgPrev, setEvalImgPrev] = useState("");

  /* ── Multi Images ── */
  const [accomImgs, setAccomImgs] = useState<MultiImgItem[]>([]);
  const [foodImgs, setFoodImgs] = useState<MultiImgItem[]>([]);

  /* ── Dynamic Paragraph Lists (Jodit) ── */
  const [introParas, setIntroParas] = useState<ParaItem[]>([
    mkPara(
      "Welcome to our transformative 500 hour yoga teacher training course in Rishikesh…",
    ),
  ]);
  const [standApartParas, setStandApartParas] = useState<ParaItem[]>([
    mkPara(
      "Our school was established in 2005, and since then, thousands of yogis worldwide have marked their sacred yogic journeys through our Yoga TTC courses in India.",
    ),
  ]);
  const [gainsParas, setGainsParas] = useState<ParaItem[]>([
    mkPara(
      "This 500 hours of yoga TTC not only gives you the credibility to begin your classes as an advanced-level yoga teacher…",
    ),
  ]);
  const [credibilityParas, setCredibilityParas] = useState<ParaItem[]>([
    mkPara(
      "Once you have completed this course from our yoga school, you are eligible to register with the Yoga Certification Board (YCB) of the Ministry of Ayush - Government of India, as well as with international yoga authorities like Yoga Alliance, USA.",
    ),
  ]);
  const [durationParas, setDurationParas] = useState<ParaItem[]>([
    mkPara(
      "This is a two-month-long course (It takes a total of eight weeks of stay in Rishikesh to complete this program.)",
    ),
  ]);
  const [syllabusParas, setSyllabusParas] = useState<ParaItem[]>([
    mkPara(
      "Since this is a merged program of 200 hour of yoga TTC and 300 hour of yoga TTC courses, the curriculum is vast and advanced.",
    ),
  ]);
  const [eligibilityParas, setEligibilityParas] = useState<ParaItem[]>([
    mkPara(
      "A dedicated mindset to learn yoga is required to join this course.",
    ),
  ]);
  const [evaluationParas, setEvaluationParas] = useState<ParaItem[]>([
    mkPara(
      "At the end of each module, a written exam needs to be given (mostly open book exams). This helps you to retain the knowledge.",
    ),
  ]);
  const [fictionParas, setFictionParas] = useState<ParaItem[]>([
    mkPara(
      "Where 500 hrs yoga training, Search Blooms and Blossoms - AYM School of Yoga, Rishikesh…",
    ),
  ]);

  /* ── String Lists ── */
  const [includedItems, setIncludedItems] = useState<string[]>([
    "6 days yoga, meditation, and theory classes in a week, Sunday is free day",
    "58 nights of accommodation with meals",
    "One AYM t-shirt",
    "One yoga Bag for books and study material.",
    "One tour to local attraction during the course.",
    "3 meals, tea, filtered water (seven days a week except for lunch on Sunday).",
    "Teaching material, Course manual, common yoga mat in studio (not personal)",
    "Yoga Anatomy, Teaching methodology, philosophy, Ayurveda theory classes",
    "Free Wi-Fi, self-service laundry (washing machine)",
    "Yoga Alliance recognized certification after graduation.",
  ]);
  const [notIncludedItems, setNotIncludedItems] = useState<string[]>([
    "Airfare.",
    "Airport pickup (Extra Charges Applicable).",
    "Bus/train transfer (Extra Charges Applicable).",
    "Spa/massage treatments (Extra Charges Applicable).",
    "Air conditioner room (Extra Charges Applicable).",
    "Heater for a room (Extra Charges Applicable).",
  ]);
  const [indianFees, setIndianFees] = useState<string[]>([
    "Dormitory: 44,999 INR",
    "Shared Room: 54,999 INR",
    "Private Room: 94,999 INR",
    "Luxury Room: 1,49,999 INR",
  ]);

  /* ── Syllabus Modules ── */
  const [syllabusModules, setSyllabusModules] = useState<
    Array<{ label: string; text: string }>
  >([
    {
      label: "The Yogic Philosophy:",
      text: "Here, you will learn the history of yoga, the various paths of yoga, Patanjali Yoga Sutras, etc.",
    },
    {
      label: "Asana:",
      text: "Yoga Postures are taught in various styles (Hatha yoga, Ashtanga, Kundalini, Sivananda, power, flow, Iyengar style, etc.)",
    },
    {
      label: "Yoga Therapy:",
      text: "Sessions are planned in the second half of the 500 hours course on Yoga Therapy for the management of common diseases, etc.",
    },
    {
      label: "Pranayama:",
      text: "Various types of breathing exercises are taught practically.",
    },
    {
      label: "Meditation:",
      text: "Various methods of meditation are taught here.",
    },
    {
      label: "Anatomy Sessions & Alignment Classes:",
      text: "These sessions give you an idea about the structure of the human body.",
    },
    {
      label: "Yoga Teaching Techniques:",
      text: "Through these various techniques, you can manage a group of people when you conduct your yoga sessions.",
    },
  ]);

  /* ── Reviews (star rating + Jodit) ── */
  const [reviews, setReviews] = useState<ReviewItem[]>([
    { name: "", platform: "on Google", initial: "", rating: 5, text: "" },
  ]);

  /* ── React Hook Form ── */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PageFormValues>({
    defaultValues: {
      slug: "500-hour-yoga-teacher-training-india",
      status: "Active",
      pageMainH1: "500 Hour Yoga Teacher Training Course in Rishikesh",
      heroImgAlt: "Yoga Students Group",
      standApartH2:
        "What makes AYM School's Yoga Teachers Training Courses stand apart from the rest?",
      gainsH2:
        "What do I gain from the 500 Hour Yoga Teacher Training Course in Rishikesh?",
      seatSectionH2: "500 Hour Yoga Teacher Training India – Upcoming Batches",
      seatSectionSubtext: "",
      tableNoteText:
        "Course Fee: 1649 USD (Including: Dormitory Stay and Food) | For the upgrade you accommodation send us E-mail. Available accommodation Categories: Shared, Private and Luxury.",
      tableNoteEmail: "",
      tableNoteAirportText:
        "Airport pick up from Delhi airport to Yoga school Rishikesh will cost 90 USD and Round Trip 150 USD.",
      credibilityH2: "What is The Credibility of This Course?",
      durationH2: "How Long is The Duration of The Course?",
      syllabusH2: "Overview of Syllabus",
      eligibilityH3: "What are the Eligibility Criteria?",
      evaluationH3: "Is there an Evaluation Process for the Course?",
      includedTitle: "Included in the package of 500-Hour Courses in India",
      includedNote:
        "All items in the above included list are part of the course package. And incase you opt out any of these items, we will not be initiating a refund for that particular item.",
      notIncludedTitle: "Not Included",
      fictionH3:
        "500 Hour Yoga Teacher Training in Rishikesh, India: Separating Fact from Fiction",
      reviewsSectionH2: "Student's Reviews",
      refundH3: "What are the Refund Rules for the Course Fee?",
      refundPara:
        "You can reserve your spot by paying an advance booking fee of 215 USD. However, for any reason, if you couldn't join on the given date, a refund cannot be issued, but you will be allowed to utilize the amount for booking another yoga TTC from AYM School within one year.",
      applyH3: "How to Apply for the Course?",
      applyPara:
        "Fill out the online application form, and once you get our approval you could transfer the initial advance payment fee (either through Paypal or through bank transfer) to reserve your seat. You will get an email acknowledgment once we receive the advance fee.",
      indianFeeH3: "500 Hour Course Fee for Indian Students",
    },
  });

  /* ── Fetch on edit ── */
  useEffect(() => {
    if (!isEdit) return;
    const fetchData = async () => {
      setLoadingData(true);
      try {
       const res = await api.get("/yoga-500hr/content");
const d = res.data.data;
        

        const fields: (keyof PageFormValues)[] = [
          "slug",
          "status",
          "pageMainH1",
          "heroImgAlt",
          "standApartH2",
          "gainsH2",
          "seatSectionH2",
          "seatSectionSubtext",
          "tableNoteText",
          "tableNoteEmail",
          "tableNoteAirportText",
          "credibilityH2",
          "durationH2",
          "syllabusH2",
          "eligibilityH3",
          "evaluationH3",
          "includedTitle",
          "includedNote",
          "notIncludedTitle",
          "fictionH3",
          "reviewsSectionH2",
          "refundH3",
          "refundPara",
          "applyH3",
          "applyPara",
          "indianFeeH3",
        ];
        fields.forEach((k) => {
          if (d[k] !== undefined) setValue(k, d[k]);
        });

        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);
        if (d.shivaImage) setShivaPrev(BASE_URL + d.shivaImage);
        if (d.evalImage) setEvalImgPrev(BASE_URL + d.evalImage);

        if (d.accomImages?.length)
          setAccomImgs(
            d.accomImages.map((src: string, i: number) => ({
              id: `a${i}`,
              preview: BASE_URL + src,
            })),
          );
        if (d.foodImages?.length)
          setFoodImgs(
            d.foodImages.map((src: string, i: number) => ({
              id: `f${i}`,
              preview: BASE_URL + src,
            })),
          );
        if (d.includedItems?.length) setIncludedItems(d.includedItems);
        if (d.notIncludedItems?.length) setNotIncludedItems(d.notIncludedItems);
        if (d.indianFees?.length) setIndianFees(d.indianFees);
        if (d.syllabusModules?.length) setSyllabusModules(d.syllabusModules);

        // Load dynamic para arrays
        const toItems = (arr: string[] | undefined, fallback: ParaItem[]) =>
          arr?.length ? arr.map((v) => mkPara(v)) : fallback;
        if (d.introParas?.length)
          setIntroParas(toItems(d.introParas, introParas));
        if (d.standApartParas?.length)
          setStandApartParas(toItems(d.standApartParas, standApartParas));
        if (d.gainsParas?.length)
          setGainsParas(toItems(d.gainsParas, gainsParas));
        if (d.credibilityParas?.length)
          setCredibilityParas(toItems(d.credibilityParas, credibilityParas));
        if (d.durationParas?.length)
          setDurationParas(toItems(d.durationParas, durationParas));
        if (d.syllabusParas?.length)
          setSyllabusParas(toItems(d.syllabusParas, syllabusParas));
        if (d.eligibilityParas?.length)
          setEligibilityParas(toItems(d.eligibilityParas, eligibilityParas));
        if (d.evaluationParas?.length)
          setEvaluationParas(toItems(d.evaluationParas, evaluationParas));
        if (d.fictionParas?.length)
          setFictionParas(toItems(d.fictionParas, fictionParas));

        if (d.reviews?.length) setReviews(d.reviews);
      } catch {
        toast.error("Failed to load");
        router.push("/admin/yogacourse/500hourscourse/content");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, pageId]);

  /* ── Submit ── */
  const onSubmit = async (data: PageFormValues) => {
    if (!heroFile && !heroPrev) {
      setHeroErr("Hero image is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      // Dynamic para arrays → JSON arrays of HTML strings
      fd.append("introParas", JSON.stringify(introParas.map((p) => p.value)));
      fd.append(
        "standApartParas",
        JSON.stringify(standApartParas.map((p) => p.value)),
      );
      fd.append("gainsParas", JSON.stringify(gainsParas.map((p) => p.value)));
      fd.append(
        "credibilityParas",
        JSON.stringify(credibilityParas.map((p) => p.value)),
      );
      fd.append(
        "durationParas",
        JSON.stringify(durationParas.map((p) => p.value)),
      );
      fd.append(
        "syllabusParas",
        JSON.stringify(syllabusParas.map((p) => p.value)),
      );
      fd.append(
        "eligibilityParas",
        JSON.stringify(eligibilityParas.map((p) => p.value)),
      );
      fd.append(
        "evaluationParas",
        JSON.stringify(evaluationParas.map((p) => p.value)),
      );
      fd.append(
        "fictionParas",
        JSON.stringify(fictionParas.map((p) => p.value)),
      );

      fd.append("includedItems", JSON.stringify(includedItems));
      fd.append("notIncludedItems", JSON.stringify(notIncludedItems));
      fd.append("indianFees", JSON.stringify(indianFees));
      fd.append("syllabusModules", JSON.stringify(syllabusModules));
      fd.append("reviews", JSON.stringify(reviews));

      if (heroFile) fd.append("heroImage", heroFile);
      if (shivaFile) fd.append("shivaImage", shivaFile);
      if (evalImgFile) fd.append("evalImage", evalImgFile);
     accomImgs.forEach((img) => {
  if (img.file) fd.append("accomImage", img.file);
});

foodImgs.forEach((img) => {
  if (img.file) fd.append("foodImage", img.file);
});

      if (isEdit) {
        fd.append("_id", pageId);
        await api.put(`/yoga-500hr/content/update/${pageId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Page updated successfully");
      } else {
        await api.post("/yoga-500hr/content/create", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Page created successfully");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/500hourscourse/content"), 1500);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || e?.message || "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading / Success ── */
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
          <h2 className={styles.successTitle}>
            500hr Page {isEdit ? "Updated" : "Saved"}!
          </h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/yogacourse/500hourscourse/content")}
        >
          500hr Content
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {isEdit ? "Edit Page" : "Add New Page"}
        </span>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit
              ? "Edit 500 Hour Yoga TTC Page"
              : "Add New 500 Hour Yoga TTC Page"}
          </h1>
          <p className={styles.pageSubtitle}>
            Hero · Intro · Stand Apart · Gains · Seat · Credibility · Syllabus ·
            Included · Reviews · Footer
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
        {/* ══ 1. HERO ══ */}
        <Sec title="Hero Section" badge="Banner Image + H1">
          <F label="Page H1 Heading" req>
            <div
              className={`${styles.inputWrap} ${errors.pageMainH1 ? styles.inputError : ""}`}
            >
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("pageMainH1", { required: "Required" })}
              />
            </div>
            {errors.pageMainH1 && (
              <p className={styles.errorMsg}>⚠ {errors.pageMainH1.message}</p>
            )}
          </F>
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg
              preview={heroPrev}
              badge="Hero"
              hint="JPG/PNG/WEBP · 1180×540px"
              error={heroErr}
              onSelect={(f, p) => {
                setHeroFile(f);
                setHeroPrev(p);
                setHeroErr("");
              }}
              onRemove={() => {
                setHeroFile(null);
                setHeroPrev("");
                setHeroErr("Hero image is required");
              }}
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Yoga Students Group"
                {...register("heroImgAlt")}
              />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 2. INTRO PARAGRAPHS (dynamic Jodit) ══ */}
        <Sec
          title="Introduction Paragraphs"
          badge="Rich text · Add as many as needed"
        >
          <F
            label="Paragraphs"
            hint="Each paragraph supports full rich text — bold, italic, colors, links etc."
          >
            <DynamicParaList
              items={introParas}
              onChange={setIntroParas}
              ph="Write introduction paragraph…"
              addLabel="Add Paragraph"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 3. STAND APART (dynamic Jodit) ══ */}
        <Sec title="What Makes AYM Stand Apart" badge="Card section">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("standApartH2")}
              />
            </div>
          </F>
          <F label="Paragraphs" hint="Rich text paragraphs for this section">
            <DynamicParaList
              items={standApartParas}
              onChange={setStandApartParas}
              ph="Write what makes AYM stand apart…"
              addLabel="Add Paragraph"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 4. GAINS (dynamic Jodit) ══ */}
        <Sec title="What Do I Gain Section" badge="Inside card block">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("gainsH2")}
              />
            </div>
          </F>
          <F label="Paragraphs" hint="Rich text paragraphs for Gains section">
            <DynamicParaList
              items={gainsParas}
              onChange={setGainsParas}
              ph="Write what students gain…"
              addLabel="Add Paragraph"
            />
          </F>
          <F
            label="Shiva / Yoga Image (shown below gains text)"
            hint="Recommended 900×480px"
          >
            <SingleImg
              preview={shivaPrev}
              badge="Gains"
              hint="JPG/PNG/WEBP · Wide banner"
              onSelect={(f, p) => {
                setShivaFile(f);
                setShivaPrev(p);
              }}
              onRemove={() => {
                setShivaFile(null);
                setShivaPrev("");
              }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 5. SEAT SECTION ══ */}
        <Sec
          title="Seat Booking Section — Headings Only"
          badge="⚠ Seat data managed separately"
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              padding: "0.75rem 1rem",
              background: "rgba(224,123,0,0.06)",
              border: "1px solid rgba(224,123,0,0.2)",
              borderRadius: 8,
              marginBottom: "1.2rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.88rem",
              color: "#7a5c2e",
              lineHeight: 1.5,
            }}
          >
            <span style={{ flexShrink: 0 }}>ℹ️</span>
            <span>
              Seat batches are managed from the{" "}
              <strong>Seats Management</strong> panel. Here you can only edit
              the heading and note text for this section.
            </span>
          </div>
          <F label="Section H2 Title">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("seatSectionH2")}
              />
            </div>
          </F>
          <F label="Sub-text below heading (optional)">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Optional sub-text…"
                {...register("seatSectionSubtext")}
              />
            </div>
          </F>
          <F label="Table Note Text" hint="Shown below the seat table">
            <div className={styles.inputWrap}>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                rows={2}
                {...register("tableNoteText")}
              />
            </div>
          </F>
          <F label="Email for Accommodation Upgrade">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="info@aymyoga.com"
                {...register("tableNoteEmail")}
              />
            </div>
          </F>
          <F label="Airport Pickup Note">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("tableNoteAirportText")}
              />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 6. ACCOMMODATION IMAGES ══ */}
        <Sec title="Accommodation Images" badge="Carousel — up to 10">
          <F
            label="Upload Accommodation Photos"
            hint="JPG/PNG/WEBP · 400×300px each · Max 20"
          >
            <MultiImg
              items={accomImgs}
              onChange={setAccomImgs}
              hint="400×300px recommended"
              max={20}
              label="Add Photos"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 7. FOOD IMAGES ══ */}
        <Sec title="Food Images" badge="Carousel — up to 10">
          <F
            label="Upload Food Photos"
            hint="JPG/PNG/WEBP · 400×300px each · Max 20"
          >
            <MultiImg
              items={foodImgs}
              onChange={setFoodImgs}
              hint="400×300px recommended"
              max={20}
              label="Add Photos"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 8. INDIAN FEES ══ */}
        <Sec title="Indian Student Fee Chips" badge="Shown as 4 fee chips">
          <F label="H3 Heading">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("indianFeeH3")}
              />
            </div>
          </F>
          <F label="Fee Chips (one per line)">
            <StrList
              items={indianFees}
              label="Fee Chip"
              ph="Dormitory: 44,999 INR"
              onAdd={() => setIndianFees((p) => [...p, ""])}
              onRemove={(i) => {
                if (indianFees.length <= 1) return;
                setIndianFees((p) => p.filter((_, idx) => idx !== i));
              }}
              onUpdate={(i, v) => {
                const n = [...indianFees];
                n[i] = v;
                setIndianFees(n);
              }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 9. CREDIBILITY (dynamic Jodit) ══ */}
        <Sec title="Credibility" badge="Inside card block">
          <F label="Credibility H2 Heading">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("credibilityH2")}
              />
            </div>
          </F>
          <F label="Paragraphs">
            <DynamicParaList
              items={credibilityParas}
              onChange={setCredibilityParas}
              ph="Write credibility info…"
              addLabel="Add Paragraph"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 10. DURATION (dynamic Jodit) ══ */}
        <Sec title="Duration" badge="Inside card block">
          <F label="Duration H2 Heading">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("durationH2")}
              />
            </div>
          </F>
          <F label="Paragraphs">
            <DynamicParaList
              items={durationParas}
              onChange={setDurationParas}
              ph="Write duration info…"
              addLabel="Add Paragraph"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 11. SYLLABUS ══ */}
        <Sec title="Overview of Syllabus" badge="Modules list">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("syllabusH2")}
              />
            </div>
          </F>
          <F label="Intro Paragraphs">
            <DynamicParaList
              items={syllabusParas}
              onChange={setSyllabusParas}
              ph="Write syllabus intro…"
              addLabel="Add Paragraph"
            />
          </F>
          <F label="Syllabus Modules">
            <div>
              {syllabusModules.map((mod, i) => (
                <div
                  key={i}
                  className={styles.nestedCard}
                  style={{ marginBottom: "0.8rem" }}
                >
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardNum}>Module {i + 1}</span>
                    {syllabusModules.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeNestedBtn}
                        onClick={() =>
                          setSyllabusModules((p) =>
                            p.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className={styles.nestedCardBody}>
                    <div className={styles.grid2}>
                      <div className={styles.fieldGroup}>
                        <label
                          className={styles.label}
                          style={{ fontSize: "0.8rem" }}
                        >
                          Label (bold)
                        </label>
                        <div className={styles.inputWrap}>
                          <input
                            className={styles.input}
                            value={mod.label}
                            placeholder="The Yogic Philosophy:"
                            onChange={(e) => {
                              const n = [...syllabusModules];
                              n[i] = { ...n[i], label: e.target.value };
                              setSyllabusModules(n);
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={styles.fieldGroup}
                        style={{ gridColumn: "1/-1" }}
                      >
                        <label
                          className={styles.label}
                          style={{ fontSize: "0.8rem" }}
                        >
                          Description
                        </label>
                        <div className={styles.inputWrap}>
                          <textarea
                            className={`${styles.input} ${styles.textarea}`}
                            rows={2}
                            value={mod.text}
                            onChange={(e) => {
                              const n = [...syllabusModules];
                              n[i] = { ...n[i], text: e.target.value };
                              setSyllabusModules(n);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={() =>
                  setSyllabusModules((p) => [...p, { label: "", text: "" }])
                }
              >
                ＋ Add Module
              </button>
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 12. ELIGIBILITY + EVALUATION ══ */}
        <Sec title="Eligibility & Evaluation" badge="Two small cards + image">
          <div className={styles.grid2}>
            <div>
              <F label="Eligibility H3 Heading">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("eligibilityH3")}
                  />
                </div>
              </F>
              <F label="Eligibility Paragraphs">
                <DynamicParaList
                  items={eligibilityParas}
                  onChange={setEligibilityParas}
                  ph="Write eligibility criteria…"
                  addLabel="Add Paragraph"
                />
              </F>
              <F label="Evaluation H3 Heading">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("evaluationH3")}
                  />
                </div>
              </F>
              <F label="Evaluation Paragraphs">
                <DynamicParaList
                  items={evaluationParas}
                  onChange={setEvaluationParas}
                  ph="Write evaluation process…"
                  addLabel="Add Paragraph"
                />
              </F>
            </div>
            <div>
              <F label="Evaluation Side Image" hint="600×450px recommended">
                <SingleImg
                  preview={evalImgPrev}
                  badge="Eval"
                  hint="JPG/PNG/WEBP"
                  onSelect={(f, p) => {
                    setEvalImgFile(f);
                    setEvalImgPrev(p);
                  }}
                  onRemove={() => {
                    setEvalImgFile(null);
                    setEvalImgPrev("");
                  }}
                />
              </F>
            </div>
          </div>
        </Sec>
        <D />

        {/* ══ 13. INCLUDED / NOT INCLUDED ══ */}
        <Sec title="Included / Not Included" badge="Two column list">
          <div className={styles.grid2}>
            <div>
              <F label="Included Section Title">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("includedTitle")}
                  />
                </div>
              </F>
              <F label="Included Items">
                <StrList
                  items={includedItems}
                  label="Included Item"
                  ph="6 days yoga, meditation…"
                  onAdd={() => setIncludedItems((p) => [...p, ""])}
                  onRemove={(i) => {
                    if (includedItems.length <= 1) return;
                    setIncludedItems((p) => p.filter((_, idx) => idx !== i));
                  }}
                  onUpdate={(i, v) => {
                    const n = [...includedItems];
                    n[i] = v;
                    setIncludedItems(n);
                  }}
                />
              </F>
              <F label="Included Note (bottom footnote)">
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    {...register("includedNote")}
                  />
                </div>
              </F>
            </div>
            <div>
              <F label="Not Included Section Title">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("notIncludedTitle")}
                  />
                </div>
              </F>
              <F label="Not Included Items">
                <StrList
                  items={notIncludedItems}
                  label="Not Included Item"
                  ph="Airfare."
                  onAdd={() => setNotIncludedItems((p) => [...p, ""])}
                  onRemove={(i) => {
                    if (notIncludedItems.length <= 1) return;
                    setNotIncludedItems((p) => p.filter((_, idx) => idx !== i));
                  }}
                  onUpdate={(i, v) => {
                    const n = [...notIncludedItems];
                    n[i] = v;
                    setNotIncludedItems(n);
                  }}
                />
              </F>
            </div>
          </div>
        </Sec>
        <D />

        {/* ══ 14. FACT FROM FICTION (dynamic Jodit) ══ */}
        <Sec title="Separating Fact from Fiction" badge="Bordered box section">
          <F label="Box H3 Heading">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("fictionH3")}
              />
            </div>
          </F>
          <F label="Paragraphs">
            <DynamicParaList
              items={fictionParas}
              onChange={setFictionParas}
              ph="Write fact vs fiction content…"
              addLabel="Add Paragraph"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 15. STUDENT REVIEWS (star rating + Jodit) ══ */}
        <Sec
          title="Student Reviews"
          badge="Star rating + Rich text review cards"
        >
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("reviewsSectionH2")}
              />
            </div>
          </F>
          <F
            label="Review Cards"
            hint="Each review has a 5-star rating and rich text body"
          >
            <div>
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className={styles.nestedCard}
                  style={{ marginBottom: "1rem" }}
                >
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardNum}>Review {i + 1}</span>
                    {reviews.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeNestedBtn}
                        onClick={() =>
                          setReviews((p) => p.filter((_, idx) => idx !== i))
                        }
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className={styles.nestedCardBody}>
                    {/* Row 1: Name, Platform, Initial */}
                    <div
                      className={styles.grid2}
                      style={{ marginBottom: "1rem" }}
                    >
                      <div className={styles.fieldGroup} style={{ margin: 0 }}>
                        <label
                          className={styles.label}
                          style={{ fontSize: "0.75rem" }}
                        >
                          Reviewer Name
                        </label>
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={r.name}
                            placeholder="Christina Lin"
                            onChange={(e) => {
                              const n = [...reviews];
                              n[i] = { ...n[i], name: e.target.value };
                              setReviews(n);
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.fieldGroup} style={{ margin: 0 }}>
                        <label
                          className={styles.label}
                          style={{ fontSize: "0.75rem" }}
                        >
                          Platform Label
                        </label>
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={r.platform}
                            placeholder="on Google"
                            onChange={(e) => {
                              const n = [...reviews];
                              n[i] = { ...n[i], platform: e.target.value };
                              setReviews(n);
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.fieldGroup} style={{ margin: 0 }}>
                        <label
                          className={styles.label}
                          style={{ fontSize: "0.75rem" }}
                        >
                          Initial (avatar fallback)
                        </label>
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={r.initial}
                            placeholder="C"
                            maxLength={2}
                            onChange={(e) => {
                              const n = [...reviews];
                              n[i] = { ...n[i], initial: e.target.value };
                              setReviews(n);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Star Rating */}
                    <div
                      className={styles.fieldGroup}
                      style={{ marginBottom: "1rem" }}
                    >
                      <label
                        className={styles.label}
                        style={{ fontSize: "0.75rem", marginBottom: "0.45rem" }}
                      >
                        Star Rating
                      </label>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.45rem 0.85rem",
                          background: "#fffaf2",
                          border: "1.5px solid #e8d5b5",
                          borderRadius: 8,
                        }}
                      >
                        <StarRating
                          value={r.rating}
                          onChange={(val) => {
                            const n = [...reviews];
                            n[i] = { ...n[i], rating: val };
                            setReviews(n);
                          }}
                        />
                      </div>
                    </div>

                    {/* Row 3: Jodit Review Text */}
                    <div className={styles.fieldGroup} style={{ margin: 0 }}>
                      <label
                        className={styles.label}
                        style={{ fontSize: "0.75rem", marginBottom: "0.45rem" }}
                      >
                        Review Text
                        <span
                          className={styles.sectionBadge}
                          style={{ marginLeft: "0.5rem" }}
                        >
                          Rich Text
                        </span>
                      </label>
                      <StableJodit
                        value={r.text}
                        onSave={(val) => {
                          const n = [...reviews];
                          n[i] = { ...n[i], text: val };
                          setReviews(n);
                        }}
                        ph="Write the review here… (supports bold, italic, colors)"
                        h={180}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={() =>
                  setReviews((p) => [
                    ...p,
                    {
                      name: "",
                      platform: "on Google",
                      initial: "",
                      rating: 5,
                      text: "",
                    },
                  ])
                }
              >
                ＋ Add Review
              </button>
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 16. REFUND + HOW TO APPLY ══ */}
        <Sec
          title="Refund Rules & How to Apply"
          badge="Two info cards at bottom"
        >
          <div className={styles.grid2}>
            <div>
              <F label="Refund Rules H3 Heading">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("refundH3")}
                  />
                </div>
              </F>
              <F label="Refund Paragraph">
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={4}
                    {...register("refundPara")}
                  />
                </div>
              </F>
            </div>
            <div>
              <F label="How to Apply H3 Heading">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("applyH3")}
                  />
                </div>
              </F>
              <F label="How to Apply Paragraph">
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={4}
                    {...register("applyPara")}
                  />
                </div>
              </F>
            </div>
          </div>
        </Sec>
        <D />

        {/* ══ 17. PAGE SETTINGS ══ */}
        <Sec title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div
                className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}
              >
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="500-hour-yoga-teacher-training-india"
                  {...register("slug", { required: "Slug is required" })}
                />
              </div>
              {errors.slug && (
                <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>
              )}
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

      {/* Form Actions */}
      <div className={styles.formActions}>
        <Link
          href="/admin/yogacourse/500hourscourse/content"
          className={styles.cancelBtn}
        >
          ← Cancel
        </Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner} /> Saving…
            </>
          ) : (
            <>
              <span>✦</span> {isEdit ? "Update" : "Save"} 500hr Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}

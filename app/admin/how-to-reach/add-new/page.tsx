"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../HowToReachAdmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface StringItem { text: string }

interface ScheduleRowItem {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

type IconType = "plane" | "train" | "bus" | "car";

interface TravelCardItem {
  iconType: IconType;
  title: string;
  subtitle: string;
  desc: string;
  headerCol1: string;
  headerCol2: string;
  headerCol3: string;
  headerCol4: string;
  rows: ScheduleRowItem[];
  btnText: string;
  btnHref: string;
  linkText: string;
  linkHref: string;
}

interface FormData {
  // Section header
  badgeText: string;
  mainTitle: string;
  subTitle: string;

  // WhatsApp (used to build the default pickup enquiry link)
  whatsappNumber: string;
  whatsappMessage: string;

  // Travel options (By Air / By Train / By Bus / ...)
  travelCards: TravelCardItem[];

  // Pickup & Drop card
  pickupTitle: string;
  pickupSubtitle: string;
  pickupDesc: string;
  pickupHighlights: StringItem[];
  pickupBookBtnText: string;
  pickupWhatsappBtnText: string;

  // Map
  mapLabel: string;
  mapEmbedSrc: string;
  mapDirectionsText: string;
  mapDirectionsUrl: string;
}

const ICON_OPTIONS: { value: IconType; label: string; emoji: string }[] = [
  { value: "plane", label: "Airplane", emoji: "✈️" },
  { value: "train", label: "Train", emoji: "🚆" },
  { value: "bus", label: "Bus", emoji: "🚌" },
  { value: "car", label: "Car", emoji: "🚗" },
];

const INITIAL: FormData = {
  badgeText: "✦ Travel Guide",
  mainTitle: "How to Reach Us",
  subTitle: "Easy & Comfortable Travel Options to Reach Indian Yoga Association in Rishikesh — Delhi to Rishikesh travel options by air, train & bus.",

  whatsappNumber: "919528023390",
  whatsappMessage: "Namaste !! I would like to arrange a Pickup / Drop service for Indian Yoga Association, Rishikesh. Please guide me on the pickup point details.",

  travelCards: [
    {
      iconType: "plane",
      title: "By Airways",
      subtitle: "Fastest Way to Reach Rishikesh",
      desc: "Fly from Delhi (Indira Gandhi International Airport) to <strong>Jolly Grant Airport, Dehradun</strong> — approximately 20 km from Rishikesh. Taxis and private transfers are easily available.",
      headerCol1: "Airline", headerCol2: "Departs", headerCol3: "Arrives", headerCol4: "Duration",
      rows: [
        { col1: "IndiGo", col2: "06:30 AM", col3: "07:30 AM", col4: "1h" },
        { col1: "Air India", col2: "09:15 AM", col3: "10:20 AM", col4: "1h 5m" },
      ],
      btnText: "Check Flights on MakeMyTrip",
      btnHref: "https://www.makemytrip.com/flights/",
      linkText: "More Air Travel Details",
      linkHref: "#air-details",
    },
    {
      iconType: "train",
      title: "By Train",
      subtitle: "Affordable & Comfortable",
      desc: "Travel from New Delhi Railway Station to Rishikesh or <strong>Haridwar Junction</strong> (25 km from Rishikesh). Taxis and auto-rickshaws are always available.",
      headerCol1: "Train", headerCol2: "Departs", headerCol3: "Arrives", headerCol4: "Via",
      rows: [
        { col1: "Dehradun Shatabdi", col2: "06:45 AM", col3: "11:25 AM", col4: "Haridwar" },
        { col1: "Mussoorie Express", col2: "10:00 PM", col3: "05:30 AM", col4: "Haridwar" },
      ],
      btnText: "Book Train on IRCTC",
      btnHref: "https://www.irctc.co.in/",
      linkText: "More Train Travel Details",
      linkHref: "#train-details",
    },
    {
      iconType: "bus",
      title: "By Bus",
      subtitle: "Budget Friendly Option",
      desc: "Regular <strong>Volvo, AC and sleeper buses</strong> operate daily from Delhi to Rishikesh via scenic NH58, passing through the Shivalik foothills.",
      headerCol1: "Bus", headerCol2: "Departs", headerCol3: "Arrives", headerCol4: "Type",
      rows: [
        { col1: "Volvo AC", col2: "06:00 AM", col3: "11:30 AM", col4: "AC" },
        { col1: "Sleeper Coach", col2: "09:00 PM", col3: "04:00 AM", col4: "Sleeper" },
      ],
      btnText: "Book Bus on RedBus",
      btnHref: "https://www.redbus.in/",
      linkText: "More Bus Travel Details",
      linkHref: "#bus-details",
    },
  ],

  pickupTitle: "Pickup & Drop",
  pickupSubtitle: "Comfortable transfer service",
  pickupDesc: "Book a <strong>hassle-free pickup or drop</strong> from Jolly Grant Airport, Haridwar / Rishikesh Railway Station or Bus Stand directly to Indian Yoga Association. Available 24/7 on request.",
  pickupHighlights: [
    { text: "Airport · Railway · Bus Stand Transfers" },
    { text: "Comfortable AC vehicles for a relaxing ride" },
    { text: "Group bookings available for batches & retreats" },
    { text: "Instant WhatsApp confirmation & coordination" },
    { text: "Safe and reliable door-to-door service" },
    { text: "Experienced and professional drivers" },
  ],
  pickupBookBtnText: "Book Pickup / Drop",
  pickupWhatsappBtnText: "WhatsApp",

  mapLabel: "AYM Yoga School, Rishikesh",
  mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7440.5!2d78.320039!3d30.132348!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909165c44bab785%3A0x4119a3fa1806f00c!2sAYM%20YOGA%20SCHOOL!5e1!3m2!1sen!2sin",
  mapDirectionsText: "↗ Get Directions",
  mapDirectionsUrl: "https://maps.google.com/?q=Indian+Yoga+Association+Rishikesh",
};

const joditConfig = {
  readonly: false,
  height: 160,
  toolbarAdaptive: false,
  buttons: [
    "bold", "italic", "underline", "strikethrough", "|",
    "font", "fontsize", "brush", "|",
    "paragraph", "|", "ul", "ol", "|", "align", "|",
    "link", "unlink", "|", "undo", "redo", "|", "eraser", "fullsize",
  ],
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
  style: { fontFamily: "inherit", fontSize: "15px" },
};

/* ─────────────────────── Reusable: dynamic plain-string list (pickup highlights) ─────────────────────── */
function StringList({ register, name, label, placeholder = "Text", max = 15, fields, append, remove }: {
  register: any; name: string; label: string; placeholder?: string; max?: number;
  fields: any[]; append: (v: any) => void; remove: (i: number) => void;
}) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/{max}</span>
      </div>
      <div className={styles.itemsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{index + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input type="text" className={styles.input} placeholder={placeholder} {...register(`${name}.${index}.text`, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => remove(index)} disabled={fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {fields.length < max && <button type="button" className={styles.addBtn} onClick={() => append({ text: "" })}>+ Add</button>}
    </div>
  );
}

/* ─────────────────────── Reusable: one travel card (icon, desc, dynamic schedule rows) ─────────────────────── */
function TravelCardFields({ control, register, index, onRemove, canRemove }: {
  control: Control<FormData, any>; register: UseFormRegister<FormData>; index: number; onRemove: () => void; canRemove: boolean;
}) {
  const rowsArray = useFieldArray({ control, name: `travelCards.${index}.rows` });

  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Travel Option #{index + 1}</span>
        <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={onRemove} disabled={!canRemove}>✕</button>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Icon</label>
          <div className={styles.iconPreviewRow}>
            <span className={styles.iconPreviewBadge}>
              {ICON_OPTIONS.find((o) => o.value === (control._formValues?.travelCards?.[index]?.iconType))?.emoji ?? "✦"}
            </span>
            <div className={styles.inputWrap} style={{ flex: 1 }}>
              <select className={styles.select} {...register(`travelCards.${index}.iconType`, { required: true })}>
                {ICON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.emoji} {o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. By Airways" {...register(`travelCards.${index}.title`, { required: true })} /></div>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Subtitle</label>
        <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Fastest Way to Reach Rishikesh" {...register(`travelCards.${index}.subtitle`, { required: true })} /></div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description</label>
        <div className={styles.editorWrap}>
          <Controller
            name={`travelCards.${index}.desc`}
            control={control}
            render={({ field: f }) => <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Schedule Table Headers</label>
        <div className={styles.fourCol}>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Col 1" {...register(`travelCards.${index}.headerCol1`, { required: true })} /></div>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Col 2" {...register(`travelCards.${index}.headerCol2`, { required: true })} /></div>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Col 3" {...register(`travelCards.${index}.headerCol3`, { required: true })} /></div>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Col 4" {...register(`travelCards.${index}.headerCol4`, { required: true })} /></div>
        </div>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>Schedule Rows</h3>
        <span className={styles.sectionBadge}>{rowsArray.fields.length}/12</span>
      </div>
      <div className={styles.rowsList}>
        {rowsArray.fields.map((field, rIndex) => (
          <div key={field.id} className={styles.rowGrid}>
            <span className={styles.itemIndex}>{rIndex + 1}</span>
            <input className={styles.rowGridInput} placeholder="Col 1" {...register(`travelCards.${index}.rows.${rIndex}.col1`, { required: true })} />
            <input className={styles.rowGridInput} placeholder="Col 2" {...register(`travelCards.${index}.rows.${rIndex}.col2`, { required: true })} />
            <input className={styles.rowGridInput} placeholder="Col 3" {...register(`travelCards.${index}.rows.${rIndex}.col3`, { required: true })} />
            <input className={styles.rowGridInput} placeholder="Col 4" {...register(`travelCards.${index}.rows.${rIndex}.col4`, { required: true })} />
            <button type="button" className={styles.removeItemBtn} onClick={() => rowsArray.remove(rIndex)} disabled={rowsArray.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {rowsArray.fields.length < 12 && (
        <button type="button" className={styles.addBtn} onClick={() => rowsArray.append({ col1: "", col2: "", col3: "", col4: "" })}>+ Add Row</button>
      )}

      <div className={styles.formDivider} />

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Primary Button Text</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Check Flights on MakeMyTrip" {...register(`travelCards.${index}.btnText`, { required: true })} /></div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Primary Button Link</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="https://…" {...register(`travelCards.${index}.btnHref`, { required: true })} /></div>
        </div>
      </div>
      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Secondary Link Text</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="More Air Travel Details" {...register(`travelCards.${index}.linkText`, { required: true })} /></div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Secondary Link Href</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="#air-details" {...register(`travelCards.${index}.linkHref`, { required: true })} /></div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function HowToReachAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<"header" | "travel" | "pickup" | "map">("header");

  const { control, handleSubmit, register, formState: { errors }, watch, reset } = useForm<FormData>({
    defaultValues: INITIAL,
    mode: "onChange",
  });

  const watchAll = watch();
  const travelCardsArray = useFieldArray({ control, name: "travelCards" });
  const pickupHighlightsArray = useFieldArray({ control, name: "pickupHighlights" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/how-to-reach-section/${sectionId}`);
        const d = res.data.data;
        reset({
          badgeText: d.badgeText ?? INITIAL.badgeText,
          mainTitle: d.mainTitle ?? INITIAL.mainTitle,
          subTitle: d.subTitle ?? INITIAL.subTitle,

          whatsappNumber: d.whatsappNumber ?? INITIAL.whatsappNumber,
          whatsappMessage: d.whatsappMessage ?? INITIAL.whatsappMessage,

          travelCards: d.travelCards?.length ? d.travelCards : INITIAL.travelCards,

          pickupTitle: d.pickupTitle ?? INITIAL.pickupTitle,
          pickupSubtitle: d.pickupSubtitle ?? INITIAL.pickupSubtitle,
          pickupDesc: d.pickupDesc ?? INITIAL.pickupDesc,
          pickupHighlights: d.pickupHighlights?.length ? d.pickupHighlights.map((t: string) => ({ text: t })) : INITIAL.pickupHighlights,
          pickupBookBtnText: d.pickupBookBtnText ?? INITIAL.pickupBookBtnText,
          pickupWhatsappBtnText: d.pickupWhatsappBtnText ?? INITIAL.pickupWhatsappBtnText,

          mapLabel: d.mapLabel ?? INITIAL.mapLabel,
          mapEmbedSrc: d.mapEmbedSrc ?? INITIAL.mapEmbedSrc,
          mapDirectionsText: d.mapDirectionsText ?? INITIAL.mapDirectionsText,
          mapDirectionsUrl: d.mapDirectionsUrl ?? INITIAL.mapDirectionsUrl,
        });
      } catch {
        toast.error("Failed to fetch How To Reach section data");
        router.replace("/admin/how-to-reach");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const payload = {
        badgeText: data.badgeText,
        mainTitle: data.mainTitle,
        subTitle: data.subTitle,

        whatsappNumber: data.whatsappNumber,
        whatsappMessage: data.whatsappMessage,

        travelCards: data.travelCards,

        pickupTitle: data.pickupTitle,
        pickupSubtitle: data.pickupSubtitle,
        pickupDesc: data.pickupDesc,
        pickupHighlights: data.pickupHighlights.map((h) => h.text),
        pickupBookBtnText: data.pickupBookBtnText,
        pickupWhatsappBtnText: data.pickupWhatsappBtnText,

        mapLabel: data.mapLabel,
        mapEmbedSrc: data.mapEmbedSrc,
        mapDirectionsText: data.mapDirectionsText,
        mapDirectionsUrl: data.mapDirectionsUrl,
      };

      if (isEdit && sectionId) {
        await api.put(`/how-to-reach-section/${sectionId}`, payload);
      } else {
        await api.post("/how-to-reach-section", payload);
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/how-to-reach"), 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.formPage}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>{[...Array(5)].map((_, i) => <div key={i} className={styles.skeletonField} style={{ height: "52px" }} />)}</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>How To Reach Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    header: !!(errors.mainTitle || errors.subTitle),
    travel: !!errors.travelCards,
    pickup: !!(errors.pickupTitle || errors.pickupHighlights),
    map: !!(errors.mapLabel || errors.mapEmbedSrc),
  };

  const tabLabels = {
    header: "① Header",
    travel: "② Travel Options",
    pickup: "③ Pickup & Drop",
    map: "④ Map",
  };

  const tabOrder = ["header", "travel", "pickup", "map"] as const;

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/how-to-reach" className={styles.breadcrumbLink}>How To Reach Section</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit How To Reach Section" : "Add How To Reach Section"}</h1>
        <p className={styles.pageSubtitle}>Manage header text, travel options, the pickup &amp; drop card and the map for Indian Yoga Association.</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.tabNav}>
        {tabOrder.map((tab) => (
          <button key={tab} type="button" className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${tabErrors[tab] ? styles.tabBtnError : ""}`} onClick={() => setActiveTab(tab)}>
            {tabErrors[tab] && <span className={styles.tabDot} />}
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ══════════ TAB 1 — HEADER ══════════ */}
          {activeTab === "header" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Section Header</h3></div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Badge Text</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. ✦ Travel Guide" {...register("badgeText")} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Main Title (H2)<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""}`}>
                  <input type="text" className={styles.input} {...register("mainTitle", { required: "Required" })} />
                </div>
                {errors.mainTitle && <p className={styles.errorMsg}>⚠ {errors.mainTitle.message}</p>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Sub Title<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.subTitle ? styles.inputError : ""}`}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("subTitle", { required: "Required" })} />
                </div>
                {errors.subTitle && <p className={styles.errorMsg}>⚠ {errors.subTitle.message}</p>}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>WhatsApp Settings</h3></div>
              <p className={styles.fieldHint}>Used to build the WhatsApp enquiry link shown on the Pickup &amp; Drop card.</p>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>WhatsApp Number (with country code, no +)</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="919528023390" {...register("whatsappNumber", { required: true })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Default WhatsApp Message</label>
                <div className={styles.inputWrap}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("whatsappMessage", { required: true })} />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 2 — TRAVEL OPTIONS ══════════ */}
          {activeTab === "travel" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader} style={{ marginTop: "0.2rem" }}>
                <span className={styles.sectionBadge}>{travelCardsArray.fields.length}/6 travel options</span>
              </div>
              {travelCardsArray.fields.map((field, index) => (
                <TravelCardFields
                  key={field.id}
                  control={control}
                  register={register}
                  index={index}
                  onRemove={() => travelCardsArray.remove(index)}
                  canRemove={travelCardsArray.fields.length > 1}
                />
              ))}
              {travelCardsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    travelCardsArray.append({
                      iconType: "car",
                      title: "", subtitle: "", desc: "",
                      headerCol1: "", headerCol2: "", headerCol3: "", headerCol4: "",
                      rows: [{ col1: "", col2: "", col3: "", col4: "" }],
                      btnText: "", btnHref: "",
                      linkText: "", linkHref: "",
                    })
                  }
                >
                  + Add Travel Option
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 3 — PICKUP & DROP ══════════ */}
          {activeTab === "pickup" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Card Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.pickupTitle ? styles.inputError : ""}`}>
                    <input type="text" className={styles.input} {...register("pickupTitle", { required: "Required" })} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Card Subtitle</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("pickupSubtitle")} /></div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Description</label>
                <div className={styles.editorWrap}>
                  <Controller name="pickupDesc" control={control} render={({ field }) => <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />} />
                </div>
              </div>

              <StringList
                register={register}
                name="pickupHighlights"
                label="Highlights"
                placeholder="e.g. Comfortable AC vehicles for a relaxing ride"
                max={10}
                fields={pickupHighlightsArray.fields}
                append={pickupHighlightsArray.append}
                remove={pickupHighlightsArray.remove}
              />

              <div className={styles.formDivider} />

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>"Book" Button Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Book Pickup / Drop" {...register("pickupBookBtnText", { required: true })} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>WhatsApp Button Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="WhatsApp" {...register("pickupWhatsappBtnText", { required: true })} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 4 — MAP ══════════ */}
          {activeTab === "map" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Location Map</h3></div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Map Label<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.mapLabel ? styles.inputError : ""}`}>
                  <input type="text" className={styles.input} placeholder="e.g. AYM Yoga School, Rishikesh" {...register("mapLabel", { required: "Required" })} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Google Maps Embed URL<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.mapEmbedSrc ? styles.inputError : ""}`}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={3} placeholder="https://www.google.com/maps/embed?pb=…" {...register("mapEmbedSrc", { required: "Required" })} />
                </div>
                <p className={styles.fieldHint}>Copy this from Google Maps → Share → Embed a map → copy the src URL from the iframe code.</p>
                {watchAll.mapEmbedSrc && (
                  <div className={styles.editorWrap} style={{ marginTop: "0.6rem" }}>
                    <iframe src={watchAll.mapEmbedSrc} width="100%" height="220" style={{ border: 0, display: "block" }} loading="lazy" title="Map preview" />
                  </div>
                )}
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Directions Button Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="↗ Get Directions" {...register("mapDirectionsText")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Directions URL</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="https://maps.google.com/?q=…" {...register("mapDirectionsUrl")} /></div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.formDivider} />

          <div className={styles.formActions}>
            <Link href="/admin/how-to-reach" className={styles.cancelBtn}>← Cancel</Link>
            <div className={styles.actionsRight}>
              {activeTab !== "header" && (
                <button
                  key="prev-btn"
                  type="button"
                  className={styles.prevBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tabOrder[tabOrder.indexOf(activeTab) - 1]);
                  }}
                >
                  ← Previous
                </button>
              )}
              {activeTab !== "map" ? (
                <button
                  key="next-btn"
                  type="button"
                  className={styles.nextBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tabOrder[tabOrder.indexOf(activeTab) + 1]);
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  key="submit-btn"
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (<><span className={styles.spinner} /> Saving…</>) : (<><span>✦</span> {isEdit ? "Update Section" : "Save Section"}</>)}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
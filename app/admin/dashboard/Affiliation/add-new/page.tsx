"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Accreditationadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

/* ── JoditEditor: SSR disable (browser-only) ── */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface CardItem {
  title: string;
  icon: string;
  description: string;
  color: string;
}

interface GalleryImageItem {
  preview?: string;
  file?: File;
  existingUrl?: string;
}

interface RysImageItem {
  alt: string;
  preview?: string;
  file?: File;
  existingUrl?: string;
}

interface CertItem {
  type: string;
  description: string;
  preview?: string;
  file?: File;
  existingUrl?: string;
}

interface NoteItem {
  text: string;
}

interface ParagraphItem {
  text: string;
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Why Choose AYM cards
  accreditationCards: CardItem[];

  // Gallery carousel
  galleryImages: GalleryImageItem[];

  // Main intro
  mainTitle: string;
  introCardTitle: string;
  introParagraphs: ParagraphItem[];

  // RYS logo strip (Yoga Alliance registration proof images)
  rysImages: RysImageItem[];

  // Highlight box (register with Yoga Alliance USA)
  highlightTitle: string;
  highlightParagraphs: ParagraphItem[];
  yogaAllianceUrl: string;

  // Yoga Alliance certs section
  certsSectionTitle: string;
  certsSectionSubtitle: string;
  certs: CertItem[];

  // Ministry of AYUSH / Yoga Certification Board
  boardSectionTitle: string;
  boardSectionSubtitle: string;
  _boardCertPreview?: string;
  boardInfoTitle: string;
  boardInfoText: string;

  // International Yoga Federation
  iyfSectionTitle: string;
  iyfTitle: string;
  iyfParagraphs: ParagraphItem[];
  iyfFooterNotes: NoteItem[];
  _iyfLogoPreview?: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",
  accreditationCards: [
    { title: "Yoga Alliance USA", icon: "🏆", description: "Internationally recognized certification for yoga teachers", color: "#F15505" },
    { title: "Ministry of AYUSH", icon: "🇮🇳", description: "Government of India official yoga certification", color: "#1e40af" },
    { title: "International Yoga Federation", icon: "🌍", description: "Global yoga standards and teacher recognition", color: "#059669" },
  ],
  galleryImages: [{}],
  mainTitle: "Registered Yoga School in Rishikesh",
  introCardTitle: "Indian Yoga Association",
  introParagraphs: [{ text: "" }, { text: "" }],
  rysImages: [{ alt: "" }, { alt: "" }, { alt: "" }, { alt: "" }],
  highlightTitle: "📋 Register with Yoga Alliance USA",
  highlightParagraphs: [{ text: "" }, { text: "" }],
  yogaAllianceUrl: "https://www.yogaalliance.org",
  certsSectionTitle: "YOGA ALLIANCE, USA - RYS 200 & 300",
  certsSectionSubtitle: "Internationally Recognized Certifications",
  certs: [
    { type: "RYS", description: "RPYS Yoga Teacher Training Certification" },
    { type: "RYS 200", description: "200-Hour Advanced Yoga Teacher Training Certification" },
    { type: "RYS 300", description: "300-Hour Yoga Teacher Training Certification" },
    { type: "RYS 500", description: "500-Hour Yoga Teacher Training Certification" },
  ],
  boardSectionTitle: "Yoga Certification Board",
  boardSectionSubtitle: "Ministry of AYUSH, Government of India Official Recognition",
  boardInfoTitle: "Government Recognition",
  boardInfoText: "",
  iyfSectionTitle: "International Yoga Federation",
  iyfTitle: "Global Recognition & Standards",
  iyfParagraphs: [{ text: "" }, { text: "" }],
  iyfFooterNotes: [
    { text: "200, 300 and 500 hour yoga certifications at AYM School are recognized by Indian Yoga Alliance." },
    { text: "Association for Yoga and Meditation is a lifetime member of Yoga Alliance International." },
    { text: "International Quality Management System has recognized Association for Yoga and Meditation for its 200-hour, 300-hour and 500-hour yoga teacher training in Rishikesh, India." },
  ],
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const joditConfig = {
  readonly: false,
  height: 260,
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

/* ─────────────────────── Main ─────────────────────── */
export default function AccreditationAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [boardCertFile, setBoardCertFile] = useState<File | null>(null);
  const [iyfLogoFile, setIyfLogoFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<"hero" | "gallery" | "intro" | "highlight" | "board" | "iyf">("hero");

  const introEditorRef = useRef(null);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({ defaultValues: INITIAL, mode: "onChange" });

  const watchAll = watch();

  const cardsArray = useFieldArray({ control, name: "accreditationCards" });
  const galleryArray = useFieldArray({ control, name: "galleryImages" });
  const rysArray = useFieldArray({ control, name: "rysImages" });
  const certsArray = useFieldArray({ control, name: "certs" });
  const notesArray = useFieldArray({ control, name: "iyfFooterNotes" });
  const introParagraphsArray = useFieldArray({ control, name: "introParagraphs" });
  const highlightParagraphsArray = useFieldArray({ control, name: "highlightParagraphs" });
  const iyfParagraphsArray = useFieldArray({ control, name: "iyfParagraphs" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/affiliation/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? "Yoga Students Group",
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",
          accreditationCards: d.accreditationCards?.length ? d.accreditationCards : INITIAL.accreditationCards,
          galleryImages: d.galleryImages?.length
            ? d.galleryImages.map((url: string) => ({ existingUrl: url, preview: getImageUrl(url) }))
            : [{}],
          mainTitle: d.mainTitle ?? INITIAL.mainTitle,
          introCardTitle: d.introCardTitle ?? INITIAL.introCardTitle,
          introParagraphs: d.introParagraphs?.length
            ? d.introParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.introParagraphs,
          rysImages: d.rysImages?.length
            ? d.rysImages.map((r: any) => ({ alt: r.alt ?? "", existingUrl: r.image, preview: r.image ? getImageUrl(r.image) : "" }))
            : INITIAL.rysImages,
          highlightTitle: d.highlightTitle ?? INITIAL.highlightTitle,
          highlightParagraphs: d.highlightParagraphs?.length
            ? d.highlightParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.highlightParagraphs,
          yogaAllianceUrl: d.yogaAllianceUrl ?? INITIAL.yogaAllianceUrl,
          certsSectionTitle: d.certsSectionTitle ?? INITIAL.certsSectionTitle,
          certsSectionSubtitle: d.certsSectionSubtitle ?? INITIAL.certsSectionSubtitle,
          certs: d.certs?.length
            ? d.certs.map((c: any) => ({ type: c.type, description: c.description, existingUrl: c.image, preview: c.image ? getImageUrl(c.image) : "" }))
            : INITIAL.certs,
          boardSectionTitle: d.boardSectionTitle ?? INITIAL.boardSectionTitle,
          boardSectionSubtitle: d.boardSectionSubtitle ?? INITIAL.boardSectionSubtitle,
          _boardCertPreview: d.boardCertificateImage ? getImageUrl(d.boardCertificateImage) : "",
          boardInfoTitle: d.boardInfoTitle ?? INITIAL.boardInfoTitle,
          boardInfoText: d.boardInfoText ?? "",
          iyfSectionTitle: d.iyfSectionTitle ?? INITIAL.iyfSectionTitle,
          iyfTitle: d.iyfTitle ?? INITIAL.iyfTitle,
          iyfParagraphs: d.iyfParagraphs?.length
            ? d.iyfParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.iyfParagraphs,
          iyfFooterNotes: d.iyfFooterNotes?.length ? d.iyfFooterNotes.map((t: string) => ({ text: t })) : INITIAL.iyfFooterNotes,
          _iyfLogoPreview: d.iyfLogoImage ? getImageUrl(d.iyfLogoImage) : "",
        });
      } catch {
        toast.error("Failed to fetch accreditation section data");
        router.replace("/admin/dashboard/Affiliation");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Single image handlers ── */
  const handleHeroImage = (file: File | null) => {
    if (!file) return;
    setHeroFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_heroPreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleBoardCertImage = (file: File | null) => {
    if (!file) return;
    setBoardCertFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_boardCertPreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleIyfLogoImage = (file: File | null) => {
    if (!file) return;
    setIyfLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_iyfLogoPreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Array image handler (gallery / rys / certs) ── */
  const handleArrayImage = (
    arrayName: "galleryImages" | "rysImages" | "certs",
    index: number,
    file: File | null
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setValue(`${arrayName}.${index}.preview` as any, e.target?.result as string);
      setValue(`${arrayName}.${index}.file` as any, file as any);
    };
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Simple text fields
      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("mainTitle", data.mainTitle);
      formData.append("introCardTitle", data.introCardTitle);
      formData.append("highlightTitle", data.highlightTitle);
      formData.append("yogaAllianceUrl", data.yogaAllianceUrl);
      formData.append("certsSectionTitle", data.certsSectionTitle);
      formData.append("certsSectionSubtitle", data.certsSectionSubtitle);
      formData.append("boardSectionTitle", data.boardSectionTitle);
      formData.append("boardSectionSubtitle", data.boardSectionSubtitle);
      formData.append("boardInfoTitle", data.boardInfoTitle);
      formData.append("boardInfoText", data.boardInfoText);
      formData.append("iyfSectionTitle", data.iyfSectionTitle);
      formData.append("iyfTitle", data.iyfTitle);

      // Cards (no images, just emoji icon text)
      formData.append("accreditationCards", JSON.stringify(data.accreditationCards));

      // Dynamic paragraph lists (each stored as an array of HTML strings)
      formData.append("introParagraphs", JSON.stringify(data.introParagraphs.map((p) => p.text)));
      formData.append("highlightParagraphs", JSON.stringify(data.highlightParagraphs.map((p) => p.text)));
      formData.append("iyfParagraphs", JSON.stringify(data.iyfParagraphs.map((p) => p.text)));

      // Footer notes
      formData.append("iyfFooterNotes", JSON.stringify(data.iyfFooterNotes.map((n) => n.text)));

      // Single hero / board / iyf logo images
      if (heroFile) formData.append("heroImage", heroFile);
      if (boardCertFile) formData.append("boardCertificateImage", boardCertFile);
      if (iyfLogoFile) formData.append("iyfLogoImage", iyfLogoFile);

      // Gallery images: new files + retained existing urls
      const galleryExisting: string[] = [];
      data.galleryImages.forEach((g) => {
        if (g.file) formData.append("galleryImages", g.file);
        else if (g.existingUrl) galleryExisting.push(g.existingUrl);
      });
      formData.append("existingGalleryImages", JSON.stringify(galleryExisting));

      // RYS images: alt text array + files/existing urls (order matters)
      formData.append("rysImagesAlt", JSON.stringify(data.rysImages.map((r) => r.alt)));
      data.rysImages.forEach((r, i) => {
        if (r.file) formData.append(`rysImage_${i}`, r.file);
      });
      formData.append(
        "existingRysImages",
        JSON.stringify(data.rysImages.map((r) => (r.file ? null : r.existingUrl ?? null)))
      );

      // Certs: type/description array + files/existing urls (order matters)
      formData.append("certsData", JSON.stringify(data.certs.map((c) => ({ type: c.type, description: c.description }))));
      data.certs.forEach((c, i) => {
        if (c.file) formData.append(`certImage_${i}`, c.file);
      });
      formData.append(
        "existingCertImages",
        JSON.stringify(data.certs.map((c) => (c.file ? null : c.existingUrl ?? null)))
      );

      if (isEdit && sectionId) {
        await api.put(`/affiliation/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/affiliation", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/Affiliation"), 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading Skeleton ── */
  if (loadingData) {
    return (
      <div className={styles.formPage}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonField} style={{ height: "52px" }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Accreditation Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.accreditationCards),
    gallery: !!errors.galleryImages,
    intro: !!(errors.mainTitle || errors.introCardTitle || errors.introParagraphs || errors.rysImages),
    highlight: !!(errors.highlightTitle || errors.certsSectionTitle || errors.certs),
    board: !!(errors.boardSectionTitle || errors.boardInfoTitle || errors.boardInfoText),
    iyf: !!(errors.iyfSectionTitle || errors.iyfTitle || errors.iyfParagraphs || errors.iyfFooterNotes),
  };

  const tabLabels = {
    hero: "① Hero & Cards",
    gallery: "② Gallery",
    intro: "③ Intro & RYS",
    highlight: "④ Highlight & Certs",
    board: "⑤ AYUSH Board",
    iyf: "⑥ IYF Section",
  };

  const tabOrder = ["hero", "gallery", "intro", "highlight", "board", "iyf"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/Affiliation" className={styles.breadcrumbLink}>
          Accreditation Section
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Accreditation Section" : "Add Accreditation Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? "Update hero, gallery, certifications and all page content" : "Fill in every section of the Accreditation page"}
        </p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabOrder.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${tabErrors[tab] ? styles.tabBtnError : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabErrors[tab] && <span className={styles.tabDot} />}
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ══════════ TAB 1 — HERO & WHY CHOOSE AYM CARDS ══════════ */}
          {activeTab === "hero" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Hero Image</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Hero Banner Image
                  </label>
                  <p className={styles.fieldHint}>Recommended: 1180×540px — JPG, PNG, WEBP</p>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleHeroImage(e.target.files?.[0] || null)}
                    />
                    {watchAll._heroPreview ? (
                      <img src={watchAll._heroPreview} alt="preview" className={styles.imgPreview} />
                    ) : (
                      <>
                        <span className={styles.uploadIcon}>🏔️</span>
                        <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                        <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                      </>
                    )}
                  </label>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Hero Image Alt Text
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yoga Students Group"
                      {...register("heroImageAlt", { required: "Alt text is required" })}
                    />
                  </div>
                  {errors.heroImageAlt && <p className={styles.errorMsg}>⚠ {errors.heroImageAlt.message}</p>}
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>"Why Choose AYM?" Cards</h3>
                  <span className={styles.sectionBadge}>{cardsArray.fields.length}/6</span>
                </div>
                <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                  Icon (emoji), title, description and border color for each card.
                </p>

                <div className={styles.itemsList}>
                  {cardsArray.fields.map((field, index) => (
                    <div key={field.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{index + 1}</span>
                      <div className={styles.itemFields}>
                        <div className={styles.itemFieldsRow}>
                          <div className={styles.inputWrap} style={{ maxWidth: "70px" }}>
                            <input
                              type="text"
                              className={styles.input}
                              placeholder="🏆"
                              {...register(`accreditationCards.${index}.icon`, { required: true })}
                            />
                          </div>
                          <div className={styles.inputWrap} style={{ flex: 1 }}>
                            <input
                              type="text"
                              className={styles.input}
                              placeholder="Card title"
                              {...register(`accreditationCards.${index}.title`, { required: true })}
                            />
                          </div>
                          <div className={styles.colorFieldRow}>
                            <input
                              type="color"
                              className={styles.colorInput}
                              {...register(`accreditationCards.${index}.color`)}
                            />
                          </div>
                        </div>
                        <div className={styles.inputWrap}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="Card description"
                            {...register(`accreditationCards.${index}.description`, { required: true })}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.removeItemBtn}
                        onClick={() => cardsArray.remove(index)}
                        disabled={cardsArray.fields.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {cardsArray.fields.length < 6 && (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => cardsArray.append({ title: "", icon: "✦", description: "", color: "#F15505" })}
                  >
                    + Add Card
                  </button>
                )}
              </div>
            </>
          )}

          {/* ══════════ TAB 2 — GALLERY CAROUSEL ══════════ */}
          {activeTab === "gallery" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Gallery Carousel Images</h3>
                <span className={styles.sectionBadge}>{galleryArray.fields.length}/10</span>
              </div>
              <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                Images shown in the "AYM Yoga School Gallery" carousel.
              </p>

              <div className={styles.imageGridArray}>
                {galleryArray.fields.map((field, index) => {
                  const preview = watchAll.galleryImages?.[index]?.preview;
                  return (
                    <div key={field.id} className={styles.imageTile}>
                      {preview ? (
                        <img src={preview} alt={`gallery ${index + 1}`} className={styles.imageTileImg} />
                      ) : (
                        <label className={styles.imageTileEmpty}>
                          <span>📷</span>
                          <span>Upload</span>
                        </label>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.imageTileInput}
                        onChange={(e) => handleArrayImage("galleryImages", index, e.target.files?.[0] || null)}
                      />
                      {galleryArray.fields.length > 1 && (
                        <button
                          type="button"
                          className={styles.imageTileRemove}
                          onClick={() => galleryArray.remove(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}

                {galleryArray.fields.length < 10 && (
                  <button type="button" className={styles.addTile} onClick={() => galleryArray.append({})}>
                    + Add
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ══════════ TAB 3 — INTRO & RYS LOGOS ══════════ */}
          {activeTab === "intro" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Main Intro</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Main Title (H1)<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Registered Yoga School in Rishikesh"
                      {...register("mainTitle", { required: "Main title is required" })}
                    />
                  </div>
                  {errors.mainTitle && <p className={styles.errorMsg}>⚠ {errors.mainTitle.message}</p>}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Intro Card Title (H3)<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputWrap} ${errors.introCardTitle ? styles.inputError : ""}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Indian Yoga Association"
                      {...register("introCardTitle", { required: "Required" })}
                    />
                  </div>
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                  <span className={styles.labelIcon}>✦</span>
                  <h3 className={styles.sectionTitle} style={{ fontSize: "0.75rem" }}>Intro Paragraphs</h3>
                  <span className={styles.sectionBadge}>{introParagraphsArray.fields.length}/8</span>
                </div>
                <p className={styles.fieldHint}>Add as many paragraphs as needed for the intro card.</p>

                {introParagraphsArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.fieldGroup}>
                    <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
                      <label className={styles.label} style={{ marginBottom: 0 }}>
                        Paragraph {index + 1}
                        {index === 0 && <span className={styles.required}>*</span>}
                      </label>
                      <button
                        type="button"
                        className={styles.removeItemBtn}
                        style={{ marginLeft: "auto" }}
                        onClick={() => introParagraphsArray.remove(index)}
                        disabled={introParagraphsArray.fields.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={styles.editorWrap}>
                      <Controller
                        name={`introParagraphs.${index}.text`}
                        control={control}
                        rules={index === 0 ? { required: "Required" } : undefined}
                        render={({ field: f }) => (
                          <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />
                        )}
                      />
                    </div>
                    {errors.introParagraphs?.[index]?.text && (
                      <p className={styles.errorMsg}>⚠ {errors.introParagraphs[index]?.text?.message}</p>
                    )}
                  </div>
                ))}

                {introParagraphsArray.fields.length < 8 && (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => introParagraphsArray.append({ text: "" })}
                  >
                    + Add Paragraph
                  </button>
                )}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>RYS Registration Logos</h3>
                  <span className={styles.sectionBadge}>{rysArray.fields.length}/4</span>
                </div>
                <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                  The 4 RYS proof/logo images shown below the intro (RPYS, RYS 200, RYS 300, RYS 500).
                </p>

                <div className={styles.imageGridArray}>
                  {rysArray.fields.map((field, index) => {
                    const preview = watchAll.rysImages?.[index]?.preview;
                    return (
                      <div key={field.id}>
                        <div className={styles.imageTile}>
                          {preview ? (
                            <img src={preview} alt={`RYS ${index + 1}`} className={styles.imageTileImg} />
                          ) : (
                            <label className={styles.imageTileEmpty}>
                              <span>📄</span>
                              <span>Upload</span>
                            </label>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className={styles.imageTileInput}
                            onChange={(e) => handleArrayImage("rysImages", index, e.target.files?.[0] || null)}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ marginTop: "0.4rem" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="Alt text"
                            {...register(`rysImages.${index}.alt`)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 4 — HIGHLIGHT BOX & CERTS ══════════ */}
          {activeTab === "highlight" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Highlight Box</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Highlight Title<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputWrap} ${errors.highlightTitle ? styles.inputError : ""}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. 📋 Register with Yoga Alliance USA"
                      {...register("highlightTitle", { required: "Required" })}
                    />
                  </div>
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                  <span className={styles.labelIcon}>✦</span>
                  <h3 className={styles.sectionTitle} style={{ fontSize: "0.75rem" }}>Highlight Paragraphs</h3>
                  <span className={styles.sectionBadge}>{highlightParagraphsArray.fields.length}/8</span>
                </div>
                <p className={styles.fieldHint}>Add as many paragraphs as needed for the highlight box.</p>

                {highlightParagraphsArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.fieldGroup}>
                    <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
                      <label className={styles.label} style={{ marginBottom: 0 }}>
                        Paragraph {index + 1}
                      </label>
                      <button
                        type="button"
                        className={styles.removeItemBtn}
                        style={{ marginLeft: "auto" }}
                        onClick={() => highlightParagraphsArray.remove(index)}
                        disabled={highlightParagraphsArray.fields.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={styles.editorWrap}>
                      <Controller
                        name={`highlightParagraphs.${index}.text`}
                        control={control}
                        render={({ field: f }) => (
                          <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />
                        )}
                      />
                    </div>
                  </div>
                ))}

                {highlightParagraphsArray.fields.length < 8 && (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => highlightParagraphsArray.append({ text: "" })}
                  >
                    + Add Paragraph
                  </button>
                )}

                <div className={styles.fieldGroup} style={{ marginTop: "1.2rem" }}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Yoga Alliance Registration URL
                  </label>
                  <div className={`${styles.inputWrap} ${styles.inputWithPrefix}`}>
                    <span className={styles.inputPrefix}>🔗</span>
                    <input
                      type="text"
                      className={`${styles.input} ${styles.inputPrefixed}`}
                      placeholder="https://www.yogaalliance.org"
                      {...register("yogaAllianceUrl")}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Yoga Alliance Certs Section</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Section Title<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputWrap} ${errors.certsSectionTitle ? styles.inputError : ""}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. YOGA ALLIANCE, USA - RYS 200 & 300"
                      {...register("certsSectionTitle", { required: "Required" })}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Section Subtitle
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Internationally Recognized Certifications"
                      {...register("certsSectionSubtitle")}
                    />
                  </div>
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: "0.6rem" }}>
                  <span className={styles.sectionBadge}>{certsArray.fields.length}/6</span>
                </div>

                <div className={styles.itemsList}>
                  {certsArray.fields.map((field, index) => {
                    const preview = watchAll.certs?.[index]?.preview;
                    return (
                      <div key={field.id} className={styles.itemRow}>
                        <div className={styles.itemThumbInputWrap}>
                          {preview ? (
                            <img src={preview} alt={`cert ${index + 1}`} className={styles.itemThumb} />
                          ) : (
                            <div className={styles.itemThumb} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                              📜
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className={styles.imageTileInput}
                            onChange={(e) => handleArrayImage("certs", index, e.target.files?.[0] || null)}
                          />
                        </div>
                        <div className={styles.itemFields}>
                          <div className={styles.inputWrap}>
                            <input
                              type="text"
                              className={styles.input}
                              placeholder="e.g. RYS 200"
                              {...register(`certs.${index}.type`, { required: true })}
                            />
                          </div>
                          <div className={styles.inputWrap}>
                            <input
                              type="text"
                              className={styles.input}
                              placeholder="Certificate description"
                              {...register(`certs.${index}.description`, { required: true })}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.removeItemBtn}
                          onClick={() => certsArray.remove(index)}
                          disabled={certsArray.fields.length <= 1}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>

                {certsArray.fields.length < 6 && (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => certsArray.append({ type: "", description: "" })}
                  >
                    + Add Certification
                  </button>
                )}
              </div>
            </>
          )}

          {/* ══════════ TAB 5 — AYUSH / YOGA CERTIFICATION BOARD ══════════ */}
          {activeTab === "board" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Yoga Certification Board</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  Section Title<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.boardSectionTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga Certification Board"
                    {...register("boardSectionTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  Section Subtitle
                </label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Ministry of AYUSH, Government of India Official Recognition"
                    {...register("boardSectionSubtitle")}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  AYUSH Certificate Image
                </label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleBoardCertImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._boardCertPreview ? (
                    <img src={watchAll._boardCertPreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>📜</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  Info Heading<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.boardInfoTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Government Recognition"
                    {...register("boardInfoTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  Info Description<span className={styles.required}>*</span>
                </label>
                <div className={styles.editorWrap}>
                  <Controller
                    name="boardInfoText"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />
                    )}
                  />
                </div>
                {errors.boardInfoText && <p className={styles.errorMsg}>⚠ {errors.boardInfoText.message}</p>}
              </div>
            </div>
          )}

          {/* ══════════ TAB 6 — INTERNATIONAL YOGA FEDERATION ══════════ */}
          {activeTab === "iyf" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>International Yoga Federation</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  Section Title<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.iyfSectionTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. International Yoga Federation"
                    {...register("iyfSectionTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  Sub-heading (H3)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.iyfTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Global Recognition & Standards"
                    {...register("iyfTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.75rem" }}>Paragraphs</h3>
                <span className={styles.sectionBadge}>{iyfParagraphsArray.fields.length}/8</span>
              </div>
              <p className={styles.fieldHint}>Add as many paragraphs as needed for this section.</p>

              {iyfParagraphsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.fieldGroup}>
                  <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
                    <label className={styles.label} style={{ marginBottom: 0 }}>
                      Paragraph {index + 1}
                    </label>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => iyfParagraphsArray.remove(index)}
                      disabled={iyfParagraphsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.editorWrap}>
                    <Controller
                      name={`iyfParagraphs.${index}.text`}
                      control={control}
                      render={({ field: f }) => (
                        <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />
                      )}
                    />
                  </div>
                </div>
              ))}

              {iyfParagraphsArray.fields.length < 8 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => iyfParagraphsArray.append({ text: "" })}
                >
                  + Add Paragraph
                </button>
              )}

              <div className={styles.fieldGroup} style={{ marginTop: "1.2rem" }}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  IYF Logo Image
                </label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleIyfLogoImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._iyfLogoPreview ? (
                    <img src={watchAll._iyfLogoPreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🌍</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Footer Notes</h3>
                <span className={styles.sectionBadge}>{notesArray.fields.length}/6</span>
              </div>

              <div className={styles.itemsList}>
                {notesArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>✓</span>
                    <div className={styles.itemFields}>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Note text"
                          {...register(`iyfFooterNotes.${index}.text`, { required: true })}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => notesArray.remove(index)}
                      disabled={notesArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {notesArray.fields.length < 6 && (
                <button type="button" className={styles.addBtn} onClick={() => notesArray.append({ text: "" })}>
                  + Add Note
                </button>
              )}
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/Affiliation" className={styles.cancelBtn}>
              ← Cancel
            </Link>
            <div className={styles.actionsRight}>
              {activeTab !== "hero" && (
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
              {activeTab !== "iyf" ? (
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
                  className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} /> Saving…
                    </>
                  ) : (
                    <>
                      <span>✦</span> {isEdit ? "Update Section" : "Save Section"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
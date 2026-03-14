"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/blog/Blog.module.css";
// import api from "@/lib/api";

/* ═══════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════ */
export type SectionType = "heading" | "subheading" | "paragraph" | "images" | "divider";

export interface BlogImage {
  src: string;
  caption: string;
  tempUrlInput?: string;
}

export type ImageLayout = "single" | "two-col" | "three-col" | "wide";

export interface BlogSection {
  id: string;          // local unique key for React
  type: SectionType;
  text?: string;
  images?: BlogImage[];
  imageLayout?: ImageLayout;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  coverImage: string;
  tags: string[];
  content: BlogSection[];
}

interface FormErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  coverImage?: string;
  content?: string;
}

/* ═══════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════ */
let idCounter = 0;
const uid = () => `blk-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const TYPE_LABELS: Record<SectionType, string> = {
  heading: "H2 Heading",
  subheading: "H3 Subheading",
  paragraph: "Paragraph",
  images: "Image Block",
  divider: "Divider",
};

const LAYOUT_LABELS: Record<ImageLayout, string> = {
  single: "Single Image",
  "two-col": "2 Column",
  "three-col": "3 Column",
  wide: "Wide / Full",
};

const CATEGORY_OPTIONS = [
  "Yoga Teacher Training", "Yoga", "Ayurveda", "Yoga Retreats",
  "Lifestyle", "Health", "Meditation", "Philosophy", "Nutrition",
];

/* ═══════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════ */
export default function AddBlogPage() {
  const router = useRouter();
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [isCoverDragOver, setIsCoverDragOver] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<"published" | "draft" | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [autoSlug, setAutoSlug] = useState(true);

  const [form, setForm] = useState<FormData>({
    title: "", slug: "", excerpt: "", date: "",
    author: "", category: "", coverImage: "", tags: [],
    content: [],
  });

  /* ── Drag state for block reorder ── */
  const blockDragIdx = useRef<number | null>(null);

  /* ─────────────────────────────────────────────
     FORM FIELD SETTERS
  ────────────────────────────────────────────── */
  const set = (key: keyof Omit<FormData, "tags" | "content">, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleTitleChange = (val: string) => {
    setForm((p) => ({ ...p, title: val, ...(autoSlug ? { slug: slugify(val) } : {}) }));
    setErrors((p) => ({ ...p, title: undefined }));
  };

  /* Tags */
  const addTag = (val: string) => {
    const t = val.trim();
    if (!t || form.tags.includes(t)) return;
    setForm((p) => ({ ...p, tags: [...p.tags, t] }));
  };
  const removeTag = (t: string) =>
    setForm((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }));

  /* ─────────────────────────────────────────────
     COVER IMAGE
  ────────────────────────────────────────────── */
  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    set("coverImage", URL.createObjectURL(f));
    if (coverFileRef.current) coverFileRef.current.value = "";
  };
  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsCoverDragOver(false);
    const f = e.dataTransfer.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    set("coverImage", URL.createObjectURL(f));
  };
  const handleCoverUrl = () => {
    const url = coverUrlInput.trim();
    if (!url) return;
    set("coverImage", url); setCoverUrlInput("");
  };

  /* ─────────────────────────────────────────────
     CONTENT BLOCK OPERATIONS
  ────────────────────────────────────────────── */
  const addBlock = (type: SectionType) => {
    const newBlock: BlogSection = {
      id: uid(), type,
      ...(type === "images" ? { images: [{ src: "", caption: "" }], imageLayout: "single" } : {}),
      ...(type !== "images" && type !== "divider" ? { text: "" } : {}),
    };
    setForm((p) => ({ ...p, content: [...p.content, newBlock] }));
    setErrors((p) => ({ ...p, content: undefined }));
  };

  const updateBlock = (idx: number, partial: Partial<BlogSection>) =>
    setForm((p) => {
      const arr = [...p.content];
      arr[idx] = { ...arr[idx], ...partial };
      return { ...p, content: arr };
    });

  const removeBlock = (idx: number) =>
    setForm((p) => ({ ...p, content: p.content.filter((_, i) => i !== idx) }));

  /* Image sub-item operations */
  const addImageItem = (blockIdx: number) =>
    updateBlock(blockIdx, {
      images: [...(form.content[blockIdx].images ?? []), { src: "", caption: "" }],
    });

  const updateImageItem = (blockIdx: number, imgIdx: number, partial: Partial<BlogImage>) => {
    const imgs = [...(form.content[blockIdx].images ?? [])];
    imgs[imgIdx] = { ...imgs[imgIdx], ...partial };
    updateBlock(blockIdx, { images: imgs });
  };

  const removeImageItem = (blockIdx: number, imgIdx: number) => {
    const imgs = (form.content[blockIdx].images ?? []).filter((_, i) => i !== imgIdx);
    updateBlock(blockIdx, { images: imgs });
  };

  /* Image item file upload */
  const imageFileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const handleImageFile = (blockIdx: number, imgIdx: number, file: File) => {
    const url = URL.createObjectURL(file);
    updateImageItem(blockIdx, imgIdx, { src: url });
  };

  /* Block drag reorder */
  const handleBlockDragStart = (i: number) => { blockDragIdx.current = i; };
  const handleBlockDragEnter = (i: number) => {
    if (blockDragIdx.current === null || blockDragIdx.current === i) return;
    const arr = [...form.content];
    const [moved] = arr.splice(blockDragIdx.current, 1);
    arr.splice(i, 0, moved);
    blockDragIdx.current = i;
    setForm((p) => ({ ...p, content: arr }));
  };

  /* ─────────────────────────────────────────────
     VALIDATION
  ────────────────────────────────────────────── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!form.date.trim()) e.date = "Date is required";
    if (!form.category) e.category = "Category is required";
    if (!form.coverImage.trim()) e.coverImage = "Cover image is required";
    if (form.content.length === 0) e.content = "Add at least one content block";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ─────────────────────────────────────────────
     SUBMIT
  ────────────────────────────────────────────── */
  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && !validate()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        content: form.content.map(({ id, ...rest }) => rest), // strip local ids
        status: asDraft ? "Draft" : "Published",
      };
      // await api.post("/blogs/create", payload);
      console.log("Payload:", payload);
      setSubmitted(asDraft ? "draft" : "published");
      setTimeout(() => router.push("/admin/dashboard/blogs"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save");
    } finally { setIsSubmitting(false); }
  };

  /* ─────────────────────────────────────────────
     SUCCESS
  ────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>{submitted === "draft" ? "Saved as Draft!" : "Blog Published!"}</h2>
          <p className={styles.successText}>Redirecting to blog list…</p>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────── */
  return (
    <div className={styles.formPage}>

      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/blogs" className={styles.breadcrumbLink}>Blogs</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>New Post</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>New Blog Post</h1>
          <p className={styles.pageSubtitle}>Fill in meta, cover image, and build the content section by section</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══════════════════════════════
            1. META INFORMATION
        ══════════════════════════════ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Blog Meta</h3>
          </div>

          {/* Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Title<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>The main blog post title — shown in listings and at the top of the post</p>
            <div className={`${styles.inputWrap} ${errors.title ? styles.inputError : ""} ${form.title && !errors.title ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input}
                placeholder="e.g. Top 5 Advantages of Yoga Teacher Training Course"
                value={form.title} maxLength={200}
                onChange={(e) => handleTitleChange(e.target.value)} />
              <span className={styles.charCount}>{form.title.length}/200</span>
            </div>
            {errors.title && <p className={styles.errorMsg}>⚠ {errors.title}</p>}
          </div>

          {/* Slug */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>URL Slug<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>URL path — auto-generated from title. Edit manually to customise.</p>
            <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.slug ? styles.inputError : ""} ${form.slug && !errors.slug ? styles.inputSuccess : ""}`}
              style={{ display: "flex", alignItems: "center" }}>
              <span style={{ padding: "0 0.75rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "#a07840", borderRight: "1px solid #e8d5b5", whiteSpace: "nowrap", flexShrink: 0 }}>/blog/</span>
              <input type="text" className={styles.input}
                style={{ paddingLeft: "0.75rem" }}
                value={form.slug}
                onChange={(e) => { setAutoSlug(false); set("slug", e.target.value); }}
                placeholder="url-slug-here" />
            </div>
            {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug}</p>}
          </div>

          {/* Excerpt */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Excerpt<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Short summary shown on blog listing cards and in SEO meta description</p>
            <div className={`${styles.inputWrap} ${errors.excerpt ? styles.inputError : ""} ${form.excerpt && !errors.excerpt ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`}
                placeholder="A short, compelling summary of the post…"
                value={form.excerpt} maxLength={300} rows={3}
                onChange={(e) => set("excerpt", e.target.value)} />
              <span className={styles.charCount}>{form.excerpt.length}/300</span>
            </div>
            {errors.excerpt && <p className={styles.errorMsg}>⚠ {errors.excerpt}</p>}
          </div>

          {/* Date + Author + Category */}
          <div className={styles.threeCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Date<span className={styles.required}>*</span></label>
              <div className={`${styles.inputWrap} ${errors.date ? styles.inputError : ""} ${form.date ? styles.inputSuccess : ""}`}>
                <input type="date" className={styles.input} value={form.date}
                  onChange={(e) => set("date", e.target.value)} />
              </div>
              {errors.date && <p className={styles.errorMsg}>⚠ {errors.date}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Author</label>
              <div className={`${styles.inputWrap} ${form.author ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input}
                  placeholder="e.g. Swami Arvind"
                  value={form.author} maxLength={80}
                  onChange={(e) => set("author", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Category<span className={styles.required}>*</span></label>
              <div className={`${styles.inputWrap} ${errors.category ? styles.inputError : ""} ${form.category ? styles.inputSuccess : ""}`} style={{ position: "relative" }}>
                <select className={styles.input} style={{ cursor: "pointer", appearance: "none", paddingRight: "2rem" }}
                  value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="">— Select —</option>
                  {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
              {errors.category && <p className={styles.errorMsg}>⚠ {errors.category}</p>}
            </div>
          </div>

          {/* Tags */}
          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Tags</label>
            <p className={styles.fieldHint}>Type a tag and press Enter or comma to add</p>
            <div className={styles.tagsRow}>
              {form.tags.map((t) => (
                <span key={t} className={styles.tagChip}>
                  {t}
                  <button type="button" className={styles.tagRemove} onClick={() => removeTag(t)}>✕</button>
                </span>
              ))}
              <input
                type="text"
                className={styles.tagInput}
                placeholder={form.tags.length === 0 ? "Yoga, Rishikesh, Health…" : "Add tag…"}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag(tagInput);
                    setTagInput("");
                  }
                  if (e.key === "Backspace" && !tagInput && form.tags.length > 0) {
                    removeTag(form.tags[form.tags.length - 1]);
                  }
                }}
                onBlur={() => { if (tagInput.trim()) { addTag(tagInput); setTagInput(""); } }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══════════════════════════════
            2. COVER IMAGE
        ══════════════════════════════ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Cover Image</h3>
          </div>

          {errors.coverImage && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.coverImage}</p>}

          <div className={styles.coverImgArea}>
            {/* Preview */}
            <div className={styles.coverPreviewBox}>
              {form.coverImage
                ? <>
                    <img src={form.coverImage} alt="Cover" className={styles.coverPreviewImg} />
                    <div className={styles.coverOverlay}>
                      <button type="button" className={styles.removeImgBtn} onClick={() => set("coverImage", "")}>✕</button>
                    </div>
                  </>
                : <div className={styles.coverPreviewEmpty}>
                    <span className={styles.coverPreviewIcon}>🖼</span>
                    16:9 cover image
                  </div>
              }
            </div>

            {/* Controls */}
            <div className={styles.coverControls}>
              <div
                className={`${styles.uploadZone} ${isCoverDragOver ? styles.uploadZoneDragOver : ""}`}
                onClick={() => coverFileRef.current?.click()}
                onDrop={handleCoverDrop}
                onDragOver={(e) => { e.preventDefault(); setIsCoverDragOver(true); }}
                onDragLeave={() => setIsCoverDragOver(false)}
              >
                <span className={styles.uploadIcon}>📁</span>
                <p className={styles.uploadText}>Click or drag & drop</p>
                <p className={styles.uploadSubText}>JPG · PNG · WEBP</p>
                <input ref={coverFileRef} type="file" accept="image/*" className={styles.uploadInput} onChange={handleCoverFile} />
              </div>
              <div className={styles.urlRow}>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input}
                    placeholder="Or paste cover image URL"
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCoverUrl(); }} />
                </div>
                <button type="button" className={styles.addUrlBtn} onClick={handleCoverUrl}>Use URL</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══════════════════════════════
            3. CONTENT BUILDER
        ══════════════════════════════ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Content Blocks</h3>
            <span className={styles.sectionBadge}>{form.content.length} blocks · drag to reorder</span>
          </div>

          {errors.content && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.content}</p>}

          <div className={styles.contentBuilder}>
            {form.content.map((block, idx) => (
              <div
                key={block.id}
                className={`${styles.blockCard}`}
                draggable
                onDragStart={() => handleBlockDragStart(idx)}
                onDragEnter={() => handleBlockDragEnter(idx)}
                onDragEnd={() => { blockDragIdx.current = null; }}
                onDragOver={(e) => e.preventDefault()}
              >
                {/* Block header */}
                <div className={styles.blockCardHeader}>
                  <span className={styles.blockDragHandle}>⠿</span>
                  <span className={styles.blockNum}>{idx + 1}</span>
                  <span className={`${styles.blockTypeBadge} ${styles[`blockType${block.type.charAt(0).toUpperCase() + block.type.slice(1)}`]}`}>
                    {block.type === "heading" && "H2 "}
                    {block.type === "subheading" && "H3 "}
                    {block.type === "paragraph" && "¶ "}
                    {block.type === "images" && "🖼 "}
                    {block.type === "divider" && "— "}
                    {TYPE_LABELS[block.type]}
                  </span>
                  {block.type === "images" && (
                    <span style={{ marginLeft: "0.4rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", color: "#a07840", fontStyle: "italic" }}>
                      {block.imageLayout ? LAYOUT_LABELS[block.imageLayout] : ""}
                    </span>
                  )}
                  <button type="button" className={styles.blockRemoveBtn} onClick={() => removeBlock(idx)}>✕</button>
                </div>

                {/* Block body */}
                <div className={styles.blockCardBody}>

                  {/* HEADING / SUBHEADING */}
                  {(block.type === "heading" || block.type === "subheading") && (
                    <div className={styles.inputWrap} style={{ marginBottom: 0 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder={block.type === "heading" ? "e.g. What is Yoga Teacher Training?" : "e.g. 1. Deepened Self-Awareness"}
                        value={block.text ?? ""}
                        maxLength={200}
                        onChange={(e) => updateBlock(idx, { text: e.target.value })}
                      />
                      <span className={styles.charCount}>{(block.text ?? "").length}/200</span>
                    </div>
                  )}

                  {/* PARAGRAPH */}
                  {block.type === "paragraph" && (
                    <div className={styles.inputWrap} style={{ marginBottom: 0 }}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        style={{ minHeight: "7rem" }}
                        placeholder="Enter paragraph content here. This supports long-form text."
                        value={block.text ?? ""}
                        rows={5}
                        onChange={(e) => updateBlock(idx, { text: e.target.value })}
                      />
                      <span className={styles.charCount}>{(block.text ?? "").length}</span>
                    </div>
                  )}

                  {/* DIVIDER — no content */}
                  {block.type === "divider" && (
                    <div style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "#a07840", fontStyle: "italic", padding: "0.3rem 0" }}>
                      ✦ ॐ ✦ — A visual separator will be rendered here
                    </div>
                  )}

                  {/* IMAGES */}
                  {block.type === "images" && (
                    <>
                      {/* Layout picker */}
                      <div className={styles.layoutSelector}>
                        {(Object.keys(LAYOUT_LABELS) as ImageLayout[]).map((lay) => (
                          <button
                            key={lay}
                            type="button"
                            className={`${styles.layoutBtn} ${block.imageLayout === lay ? styles.layoutBtnActive : ""}`}
                            onClick={() => updateBlock(idx, { imageLayout: lay })}
                          >
                            {LAYOUT_LABELS[lay]}
                          </button>
                        ))}
                      </div>

                      {/* Image sub-items */}
                      <div className={styles.imageSubList}>
                        {(block.images ?? []).map((img, imgIdx) => (
                          <div key={imgIdx} className={styles.imageSubItem}>
                            {/* Thumb preview */}
                            {img.src
                              ? <img src={img.src} alt={img.caption || "img"} className={styles.imageSubThumb}
                                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                              : <div className={styles.imageSubThumbEmpty}>🖼</div>
                            }

                            <div className={styles.imageSubFields}>
                              {/* URL input */}
                              <div>
                                <p className={styles.imageSubLabel}>Image URL or Upload</p>
                                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                  <div className={styles.inputWrap} style={{ flex: 1 }}>
                                    <input type="text" className={styles.input}
                                      placeholder="Paste image URL…"
                                      value={img.tempUrlInput ?? img.src}
                                      onChange={(e) => updateImageItem(idx, imgIdx, { tempUrlInput: e.target.value })}
                                      onBlur={(e) => {
                                        const url = e.target.value.trim();
                                        if (url) updateImageItem(idx, imgIdx, { src: url, tempUrlInput: undefined });
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          const url = (e.target as HTMLInputElement).value.trim();
                                          if (url) updateImageItem(idx, imgIdx, { src: url, tempUrlInput: undefined });
                                        }
                                      }}
                                    />
                                  </div>
                                  <button type="button"
                                    style={{ padding: "0.45rem 0.65rem", border: "1.5px dashed rgba(224,123,0,0.35)", borderRadius: "6px", background: "transparent", cursor: "pointer", fontSize: "0.85rem", color: "#a07840", transition: "all 0.18s", whiteSpace: "nowrap" }}
                                    onClick={() => {
                                      const ref = imageFileRefs.current[`${idx}-${imgIdx}`];
                                      if (ref) ref.click();
                                    }}
                                  >📁</button>
                                  <input
                                    ref={(el) => { imageFileRefs.current[`${idx}-${imgIdx}`] = el; }}
                                    type="file" accept="image/*" style={{ display: "none" }}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleImageFile(idx, imgIdx, f);
                                      if (e.target) e.target.value = "";
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Caption */}
                              <div>
                                <p className={styles.imageSubLabel}>Caption</p>
                                <div className={styles.inputWrap}>
                                  <input type="text" className={styles.input}
                                    placeholder="e.g. Morning Asana Practice at AYM Yoga School, Rishikesh"
                                    value={img.caption} maxLength={200}
                                    onChange={(e) => updateImageItem(idx, imgIdx, { caption: e.target.value })} />
                                  <span className={styles.charCount} style={{ top: "50%", transform: "translateY(-50%)", bottom: "auto" }}>{img.caption.length}/200</span>
                                </div>
                              </div>
                            </div>

                            <button type="button" className={styles.imageSubRemove}
                              onClick={() => removeImageItem(idx, imgIdx)}
                              disabled={(block.images ?? []).length <= 1}>✕</button>
                          </div>
                        ))}
                      </div>

                      <button type="button" className={styles.addImageBtn} onClick={() => addImageItem(idx)}>
                        + Add Image
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add block buttons */}
            <div className={styles.addBlockRow}>
              <span className={styles.addBlockLabel}>+ Add Block:</span>
              {(["heading", "subheading", "paragraph", "images", "divider"] as SectionType[]).map((t) => (
                <button key={t} type="button" className={styles.addBlockBtn} onClick={() => addBlock(t)}>
                  {t === "heading" && "H2 Heading"}
                  {t === "subheading" && "H3 Subheading"}
                  {t === "paragraph" && "¶ Paragraph"}
                  {t === "images" && "🖼 Images"}
                  {t === "divider" && "— Divider"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/dashboard/blogs" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button" className={styles.draftBtn}
            onClick={() => handleSubmit(true)} disabled={isSubmitting}>
            Save as Draft
          </button>
          <button type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={() => handleSubmit(false)} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Publish Post</>}
          </button>
        </div>

      </div>
    </div>
  );
}
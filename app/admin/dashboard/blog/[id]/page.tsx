"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/blog/Blog.module.css";
// import api from "@/lib/api";

/* ════════════════════════════════════════
   TYPES (same as Add page)
════════════════════════════════════════ */
export type SectionType = "heading" | "subheading" | "paragraph" | "images" | "divider";
export type ImageLayout = "single" | "two-col" | "three-col" | "wide";

export interface BlogImage { src: string; caption: string; tempUrlInput?: string; }

export interface BlogSection {
  id: string;
  type: SectionType;
  text?: string;
  images?: BlogImage[];
  imageLayout?: ImageLayout;
}

interface FormData {
  title: string; slug: string; excerpt: string;
  date: string; author: string; category: string;
  coverImage: string; tags: string[];
  content: BlogSection[];
  status: "Published" | "Draft";
}

interface FormErrors {
  title?: string; slug?: string; excerpt?: string;
  date?: string; category?: string; coverImage?: string; content?: string;
}

/* ── Helpers ── */
let idCounter = 0;
const uid = () => `blk-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;

const TYPE_LABELS: Record<SectionType, string> = {
  heading: "H2 Heading", subheading: "H3 Subheading",
  paragraph: "Paragraph", images: "Image Block", divider: "Divider",
};
const LAYOUT_LABELS: Record<ImageLayout, string> = {
  single: "Single Image", "two-col": "2 Column",
  "three-col": "3 Column", wide: "Wide / Full",
};
const CATEGORY_OPTIONS = [
  "Yoga Teacher Training", "Yoga", "Ayurveda", "Yoga Retreats",
  "Lifestyle", "Health", "Meditation", "Philosophy", "Nutrition",
];

/* ── Mock existing blog data ── */
const MOCK_BLOG: Omit<FormData, "content"> & { rawContent: Omit<BlogSection, "id">[] } = {
  title: "Top 5 Advantages of Yoga Teacher Training Course",
  slug: "top-5-advantages-yoga-teacher-training-course",
  excerpt: "Yoga studios are booming now in every nook and corner of the world. But how do we know if the trainers there are qualified enough to guide others on yoga?",
  date: "2022-07-04",
  author: "Swami Arvind",
  category: "Yoga Teacher Training",
  coverImage: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&q=80",
  tags: ["Yoga Teacher Training", "Rishikesh", "Yoga"],
  status: "Published",
  rawContent: [
    { type: "heading", text: "What is Yoga Teacher Training?" },
    { type: "paragraph", text: "Yoga Teacher Training (YTT) is an immersive, transformative program designed for those who wish to deepen their personal yoga practice and share the ancient wisdom of yoga with others." },
    { type: "images", imageLayout: "two-col", images: [
      { src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80", caption: "Morning Asana Practice at AYM Yoga School, Rishikesh" },
      { src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80", caption: "Students in guided group practice session" },
    ]},
    { type: "heading", text: "Top 5 Advantages of Yoga Teacher Training" },
    { type: "subheading", text: "1. Deepened Self-Awareness & Personal Transformation" },
    { type: "paragraph", text: "One of the most profound gifts of a YTT program is the journey inward. Through daily asana practice, pranayama, and meditation, students cultivate a heightened awareness of their physical and mental patterns." },
    { type: "divider" },
    { type: "subheading", text: "5. Worldwide Career Opportunities" },
    { type: "paragraph", text: "A Yoga Alliance-certified YTT certificate from AYM Yoga School opens doors to teaching opportunities in studios, retreat centres, wellness resorts, cruise ships, and corporate wellness programs worldwide." },
  ],
};

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  const coverFileRef = useRef<HTMLInputElement>(null);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [isCoverDragOver, setIsCoverDragOver] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<"published" | "draft" | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<FormData>({
    title: "", slug: "", excerpt: "", date: "", author: "",
    category: "", coverImage: "", tags: [], content: [], status: "Draft",
  });

  const blockDragIdx = useRef<number | null>(null);
  const imageFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /* ── Fetch ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const res = await api.get(`/blogs/${blogId}`);
        // const data = res.data.data;
        const data = MOCK_BLOG;
        setForm({
          title: data.title, slug: data.slug, excerpt: data.excerpt,
          date: data.date, author: data.author, category: data.category,
          coverImage: data.coverImage, tags: data.tags ?? [],
          status: data.status,
          content: (data.rawContent).map((s) => ({ ...s, id: uid() })) as BlogSection[],
        });
      } catch (err) { console.log(err); }
      finally { setIsLoading(false); }
    };
    if (blogId) fetchData();
  }, [blogId]);

  /* ── Field setters ── */
  const set = (key: keyof Omit<FormData, "tags" | "content" | "status">, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const addTag = (val: string) => {
    const t = val.trim();
    if (!t || form.tags.includes(t)) return;
    setForm((p) => ({ ...p, tags: [...p.tags, t] }));
  };
  const removeTag = (t: string) => setForm((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }));

  /* ── Cover image ── */
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

  /* ── Block operations ── */
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

  const addImageItem = (blockIdx: number) =>
    updateBlock(blockIdx, { images: [...(form.content[blockIdx].images ?? []), { src: "", caption: "" }] });

  const updateImageItem = (blockIdx: number, imgIdx: number, partial: Partial<BlogImage>) => {
    const imgs = [...(form.content[blockIdx].images ?? [])];
    imgs[imgIdx] = { ...imgs[imgIdx], ...partial };
    updateBlock(blockIdx, { images: imgs });
  };

  const removeImageItem = (blockIdx: number, imgIdx: number) =>
    updateBlock(blockIdx, { images: (form.content[blockIdx].images ?? []).filter((_, i) => i !== imgIdx) });

  const handleBlockDragStart = (i: number) => { blockDragIdx.current = i; };
  const handleBlockDragEnter = (i: number) => {
    if (blockDragIdx.current === null || blockDragIdx.current === i) return;
    const arr = [...form.content];
    const [moved] = arr.splice(blockDragIdx.current, 1);
    arr.splice(i, 0, moved);
    blockDragIdx.current = i;
    setForm((p) => ({ ...p, content: arr }));
  };

  /* ── Validation ── */
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

  /* ── Submit ── */
  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && !validate()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        content: form.content.map(({ id, ...rest }) => rest),
        status: asDraft ? "Draft" : "Published",
      };
      // await api.put(`/blogs/${blogId}`, payload);
      console.log("Update payload:", payload);
      setSubmitted(asDraft ? "draft" : "published");
      setTimeout(() => router.push("/admin/dashboard/blogs"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to update");
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <p className={styles.successText}>Loading blog post…</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>{submitted === "draft" ? "Saved as Draft!" : "Blog Updated!"}</h2>
          <p className={styles.successText}>Redirecting to blog list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/blogs" className={styles.breadcrumbLink}>Blogs</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Post</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Edit Blog Post</h1>
          <p className={styles.pageSubtitle}>Update meta, cover image, and content blocks</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ META ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Blog Meta</h3>
            <span className={styles.sectionBadge}>{form.status}</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Title<span className={styles.required}>*</span></label>
            <div className={`${styles.inputWrap} ${errors.title ? styles.inputError : ""} ${form.title && !errors.title ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input}
                value={form.title} maxLength={200}
                onChange={(e) => set("title", e.target.value)} />
              <span className={styles.charCount}>{form.title.length}/200</span>
            </div>
            {errors.title && <p className={styles.errorMsg}>⚠ {errors.title}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>URL Slug<span className={styles.required}>*</span></label>
            <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""} ${form.slug && !errors.slug ? styles.inputSuccess : ""}`}
              style={{ display: "flex", alignItems: "center" }}>
              <span style={{ padding: "0 0.75rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "#a07840", borderRight: "1px solid #e8d5b5", whiteSpace: "nowrap", flexShrink: 0 }}>/blog/</span>
              <input type="text" className={styles.input} style={{ paddingLeft: "0.75rem" }}
                value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>
            {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Excerpt<span className={styles.required}>*</span></label>
            <div className={`${styles.inputWrap} ${errors.excerpt ? styles.inputError : ""} ${form.excerpt && !errors.excerpt ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`}
                value={form.excerpt} maxLength={300} rows={3}
                onChange={(e) => set("excerpt", e.target.value)} />
              <span className={styles.charCount}>{form.excerpt.length}/300</span>
            </div>
            {errors.excerpt && <p className={styles.errorMsg}>⚠ {errors.excerpt}</p>}
          </div>

          <div className={styles.threeCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Date<span className={styles.required}>*</span></label>
              <div className={`${styles.inputWrap} ${errors.date ? styles.inputError : ""} ${form.date ? styles.inputSuccess : ""}`}>
                <input type="date" className={styles.input} value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              {errors.date && <p className={styles.errorMsg}>⚠ {errors.date}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Author</label>
              <div className={`${styles.inputWrap} ${form.author ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input} value={form.author} maxLength={80}
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

          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Tags</label>
            <div className={styles.tagsRow}>
              {form.tags.map((t) => (
                <span key={t} className={styles.tagChip}>
                  {t}
                  <button type="button" className={styles.tagRemove} onClick={() => removeTag(t)}>✕</button>
                </span>
              ))}
              <input type="text" className={styles.tagInput}
                placeholder={form.tags.length === 0 ? "Yoga, Rishikesh…" : "Add tag…"}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); setTagInput(""); }
                  if (e.key === "Backspace" && !tagInput && form.tags.length > 0) removeTag(form.tags[form.tags.length - 1]);
                }}
                onBlur={() => { if (tagInput.trim()) { addTag(tagInput); setTagInput(""); } }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══ COVER IMAGE ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Cover Image</h3>
          </div>

          {errors.coverImage && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.coverImage}</p>}

          <div className={styles.coverImgArea}>
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
            <div className={styles.coverControls}>
              <div
                className={`${styles.uploadZone} ${isCoverDragOver ? styles.uploadZoneDragOver : ""}`}
                onClick={() => coverFileRef.current?.click()}
                onDrop={handleCoverDrop}
                onDragOver={(e) => { e.preventDefault(); setIsCoverDragOver(true); }}
                onDragLeave={() => setIsCoverDragOver(false)}
              >
                <span className={styles.uploadIcon}>📁</span>
                <p className={styles.uploadText}>Click or drag to replace</p>
                <p className={styles.uploadSubText}>JPG · PNG · WEBP</p>
                <input ref={coverFileRef} type="file" accept="image/*" className={styles.uploadInput} onChange={handleCoverFile} />
              </div>
              <div className={styles.urlRow}>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input} placeholder="Or paste cover URL"
                    value={coverUrlInput} onChange={(e) => setCoverUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCoverUrl(); }} />
                </div>
                <button type="button" className={styles.addUrlBtn} onClick={handleCoverUrl}>Use URL</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══ CONTENT BUILDER ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Content Blocks</h3>
            <span className={styles.sectionBadge}>{form.content.length} blocks · drag to reorder</span>
          </div>

          {errors.content && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.content}</p>}

          <div className={styles.contentBuilder}>
            {form.content.map((block, idx) => (
              <div key={block.id} className={styles.blockCard}
                draggable
                onDragStart={() => handleBlockDragStart(idx)}
                onDragEnter={() => handleBlockDragEnter(idx)}
                onDragEnd={() => { blockDragIdx.current = null; }}
                onDragOver={(e) => e.preventDefault()}>

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
                  {block.type === "images" && block.imageLayout && (
                    <span style={{ marginLeft: "0.4rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", color: "#a07840", fontStyle: "italic" }}>
                      {LAYOUT_LABELS[block.imageLayout]}
                    </span>
                  )}
                  <button type="button" className={styles.blockRemoveBtn} onClick={() => removeBlock(idx)}>✕</button>
                </div>

                <div className={styles.blockCardBody}>
                  {(block.type === "heading" || block.type === "subheading") && (
                    <div className={styles.inputWrap} style={{ marginBottom: 0 }}>
                      <input type="text" className={styles.input}
                        value={block.text ?? ""} maxLength={200}
                        placeholder={block.type === "heading" ? "H2 heading text…" : "H3 subheading text…"}
                        onChange={(e) => updateBlock(idx, { text: e.target.value })} />
                      <span className={styles.charCount}>{(block.text ?? "").length}/200</span>
                    </div>
                  )}

                  {block.type === "paragraph" && (
                    <div className={styles.inputWrap} style={{ marginBottom: 0 }}>
                      <textarea className={`${styles.input} ${styles.textarea}`}
                        style={{ minHeight: "7rem" }} value={block.text ?? ""} rows={5}
                        onChange={(e) => updateBlock(idx, { text: e.target.value })} />
                      <span className={styles.charCount}>{(block.text ?? "").length}</span>
                    </div>
                  )}

                  {block.type === "divider" && (
                    <div style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "#a07840", fontStyle: "italic", padding: "0.3rem 0" }}>
                      ✦ ॐ ✦ — A visual separator will be rendered here
                    </div>
                  )}

                  {block.type === "images" && (
                    <>
                      <div className={styles.layoutSelector}>
                        {(Object.keys(LAYOUT_LABELS) as ImageLayout[]).map((lay) => (
                          <button key={lay} type="button"
                            className={`${styles.layoutBtn} ${block.imageLayout === lay ? styles.layoutBtnActive : ""}`}
                            onClick={() => updateBlock(idx, { imageLayout: lay })}>
                            {LAYOUT_LABELS[lay]}
                          </button>
                        ))}
                      </div>

                      <div className={styles.imageSubList}>
                        {(block.images ?? []).map((img, imgIdx) => (
                          <div key={imgIdx} className={styles.imageSubItem}>
                            {img.src
                              ? <img src={img.src} alt={img.caption || "img"} className={styles.imageSubThumb}
                                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                              : <div className={styles.imageSubThumbEmpty}>🖼</div>
                            }
                            <div className={styles.imageSubFields}>
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
                                      }} />
                                  </div>
                                  <button type="button"
                                    style={{ padding: "0.45rem 0.65rem", border: "1.5px dashed rgba(224,123,0,0.35)", borderRadius: "6px", background: "transparent", cursor: "pointer", fontSize: "0.85rem", color: "#a07840" }}
                                    onClick={() => imageFileRefs.current[`${idx}-${imgIdx}`]?.click()}>📁</button>
                                  <input
                                    ref={(el) => { imageFileRefs.current[`${idx}-${imgIdx}`] = el; }}
                                    type="file" accept="image/*" style={{ display: "none" }}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) updateImageItem(idx, imgIdx, { src: URL.createObjectURL(f) });
                                      if (e.target) e.target.value = "";
                                    }} />
                                </div>
                              </div>
                              <div>
                                <p className={styles.imageSubLabel}>Caption</p>
                                <div className={styles.inputWrap}>
                                  <input type="text" className={styles.input}
                                    placeholder="Image caption…" value={img.caption} maxLength={200}
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

        <div className={styles.formActions}>
          <Link href="/admin/dashboard/blogs" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button" className={styles.draftBtn} onClick={() => handleSubmit(true)} disabled={isSubmitting}>
            Save as Draft
          </button>
          <button type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={() => handleSubmit(false)} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Update Post</>}
          </button>
        </div>

      </div>
    </div>
  );
}
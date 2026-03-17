"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/testimonialsvideo/Testimonials.module.css";
// import api from "@/lib/api";

/* ── YouTube ID extractor ── */
function getYoutubeId(input: string): string {
  if (!input) return "";
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const shorts = s.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return shorts[1];
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return watch[1];
  const short = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  const embed = s.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];
  return s;
}

/* ── Trust strip item ── */
interface TrustItem { icon: string; label: string; }

/* ── Form types ── */
type ReviewType = "video" | "text";

interface VideoForm {
  name: string; country: string; flag: string;
  youtubeUrl: string;
  quote: string; course: string; rating: number;
}

interface TextForm {
  name: string; role: string; avatarSrc: string;
  quote: string; rating: number;
}

/* ── Section-level fields (shared) ── */
interface SectionForm {
  superTitle: string;
  mainTitle: string;
  subtitle: string;
  trustItems: TrustItem[];
}

interface FormErrors {
  // Video testimonial fields
  name?: string;
  country?: string;
  youtubeUrl?: string;
  quote?: string;
  course?: string;
  // Text testimonial fields
  role?: string;
  avatarSrc?: string;
  // Section fields might also need validation
  superTitle?: string;
  mainTitle?: string;
  subtitle?: string;
}

const COURSE_OPTIONS = ["200hr YTT", "300hr YTT", "500hr YTT", "Online YTT", "Yoga Retreat", "Other"];
const FLAG_OPTIONS = [
  { flag: "🇺🇸", label: "United States" }, { flag: "🇬🇧", label: "United Kingdom" },
  { flag: "🇩🇪", label: "Germany" }, { flag: "🇫🇷", label: "France" },
  { flag: "🇳🇱", label: "Netherlands" }, { flag: "🇦🇺", label: "Australia" },
  { flag: "🇨🇦", label: "Canada" }, { flag: "🇮🇳", label: "India" },
  { flag: "🇧🇷", label: "Brazil" }, { flag: "🇲🇽", label: "Mexico" },
  { flag: "🇮🇹", label: "Italy" }, { flag: "🇪🇸", label: "Spain" },
  { flag: "🇯🇵", label: "Japan" }, { flag: "🇰🇷", label: "South Korea" },
  { flag: "🇸🇬", label: "Singapore" }, { flag: "🌍", label: "Other" },
];

export default function AddTestimonialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = (searchParams?.get("type") as ReviewType) ?? "video";

  const [reviewType, setReviewType] = useState<ReviewType>(defaultType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  /* ── Avatar upload ── */
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");

  /* ── Video form ── */
  const [videoForm, setVideoForm] = useState<VideoForm>({
    name: "", country: "", flag: "🇺🇸",
    youtubeUrl: "", quote: "", course: "200hr YTT", rating: 5,
  });

  /* ── Text form ── */
  const [textForm, setTextForm] = useState<TextForm>({
    name: "", role: "", avatarSrc: "", quote: "", rating: 5,
  });

  /* ── Section header form ── */
  const [sectionForm, setSectionForm] = useState<SectionForm>({
    superTitle: "Voices from Our Global Sangha",
    mainTitle: "Success Stories of Our Students",
    subtitle: "Hear the inspiring journeys of our students from around the world. Discover how their time in India transformed their practice and their lives.",
    trustItems: [
      { icon: "🌍", label: "Students from 50+ Countries" },
      { icon: "⭐", label: "4.9 / 5 Average Rating" },
      { icon: "🧘", label: "100,000+ Certified Teachers" },
    ],
  });

  /* ── Computed YouTube ID ── */
  const ytId = reviewType === "video" ? getYoutubeId(videoForm.youtubeUrl) : "";
  const ytIdValid = ytId.length === 11;

  /* ── Setters ── */
  const setVideo = (k: keyof VideoForm, v: string | number) =>
    setVideoForm((p) => ({ ...p, [k]: v }));
  const setText = (k: keyof TextForm, v: string | number) =>
    setTextForm((p) => ({ ...p, [k]: v }));
  const setSec = (k: keyof Omit<SectionForm, "trustItems">, v: string) =>
    setSectionForm((p) => ({ ...p, [k]: v }));

  const updateTrust = (i: number, field: keyof TrustItem, val: string) => {
    setSectionForm((p) => {
      const arr = [...p.trustItems];
      arr[i] = { ...arr[i], [field]: val };
      return { ...p, trustItems: arr };
    });
  };
  const addTrust = () => {
    if (sectionForm.trustItems.length >= 5) return;
    setSectionForm((p) => ({ ...p, trustItems: [...p.trustItems, { icon: "✦", label: "" }] }));
  };
  const removeTrust = (i: number) =>
    setSectionForm((p) => ({ ...p, trustItems: p.trustItems.filter((_, idx) => idx !== i) }));

  /* ── Avatar handlers ── */
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setText("avatarSrc", URL.createObjectURL(f));
    if (avatarFileRef.current) avatarFileRef.current.value = "";
  };
  const handleAvatarUrl = () => {
    const url = avatarUrlInput.trim();
    if (!url) return;
    setText("avatarSrc", url);
    setAvatarUrlInput("");
  };

  /* ── Star rating component ── */
  const StarInput = ({
    value, onChange,
  }: { value: number; onChange: (v: number) => void }) => (
    <div className={styles.starRatingInput}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button"
          className={`${styles.starBtn} ${s <= value ? styles.starBtnActive : ""}`}
          onClick={() => onChange(s)}>★</button>
      ))}
    </div>
  );

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (reviewType === "video") {
      if (!videoForm.name.trim()) e.name = "Name is required";
      if (!videoForm.country.trim()) e.country = "Country is required";
      if (!videoForm.youtubeUrl.trim()) e.youtubeUrl = "YouTube URL/ID is required";
      else if (!ytIdValid) e.youtubeUrl = "Could not extract a valid YouTube video ID";
      if (!videoForm.quote.trim()) e.quote = "Quote is required";
      if (!videoForm.course) e.course = "Course is required";
    } else {
      if (!textForm.name.trim()) e.name = "Name is required";
      if (!textForm.role.trim()) e.role = "Role is required";
      if (!textForm.quote.trim()) e.quote = "Quote is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const payload = reviewType === "video"
        ? { type: "video", ...videoForm, youtubeId: ytId, sectionMeta: sectionForm }
        : { type: "text", ...textForm, sectionMeta: sectionForm };
      // await api.post("/testimonials/create", payload);
      console.log("Payload:", payload);
      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/testimonials"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Testimonial Saved!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/testimonials" className={styles.breadcrumbLink}>Testimonials</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Review</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Add Testimonial</h1>
          <p className={styles.pageSubtitle}>Add a video or text review to the testimonials section</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ 1. REVIEW TYPE TOGGLE ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Review Type</h3>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Select Type</label>
            <p className={styles.fieldHint}>Video testimonials show YouTube embed + quote. Text reviews show card with avatar, name & quote.</p>
            <div className={styles.typeToggle}>
              <button type="button"
                className={`${styles.typeBtn} ${reviewType === "video" ? styles.typeBtnActive : ""}`}
                onClick={() => setReviewType("video")}>
                ▶ Video Testimonial
              </button>
              <button type="button"
                className={`${styles.typeBtn} ${reviewType === "text" ? styles.typeBtnActive : ""}`}
                onClick={() => setReviewType("text")}>
                ✦ Text Review
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══ 2A. VIDEO TESTIMONIAL FIELDS ══ */}
        {reviewType === "video" && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Video Testimonial Details</h3>
            </div>

            {/* Name + Country two-col */}
            <div className={styles.twoCol}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Student Name<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""} ${videoForm.name && !errors.name ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input} placeholder="e.g. Marit"
                    value={videoForm.name} maxLength={80}
                    onChange={(e) => setVideo("name", e.target.value)} />
                  <span className={styles.charCount}>{videoForm.name.length}/80</span>
                </div>
                {errors.name && <p className={styles.errorMsg}>⚠ {errors.name}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Country<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.country ? styles.inputError : ""} ${videoForm.country && !errors.country ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input} placeholder="e.g. Netherlands"
                    value={videoForm.country} maxLength={60}
                    onChange={(e) => setVideo("country", e.target.value)} />
                </div>
                {errors.country && <p className={styles.errorMsg}>⚠ {errors.country}</p>}
              </div>
            </div>

            {/* Flag + Course + Rating */}
            <div className={styles.threeCol}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Flag</label>
                <div className={styles.inputWrap} style={{ position: "relative" }}>
                  <select className={styles.select} value={videoForm.flag}
                    onChange={(e) => setVideo("flag", e.target.value)}>
                    {FLAG_OPTIONS.map((f) => (
                      <option key={f.flag} value={f.flag}>{f.flag} {f.label}</option>
                    ))}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Course<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.course ? styles.inputError : ""}`} style={{ position: "relative" }}>
                  <select className={styles.select} value={videoForm.course}
                    onChange={(e) => setVideo("course", e.target.value)}>
                    {COURSE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
                {errors.course && <p className={styles.errorMsg}>⚠ {errors.course}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Rating</label>
                <div className={styles.inputWrap} style={{ padding: "0 0.5rem" }}>
                  <div className={styles.starRatingInput}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button"
                        className={`${styles.starBtn} ${s <= videoForm.rating ? styles.starBtnActive : ""}`}
                        onClick={() => setVideo("rating", s)}>★</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube URL */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>YouTube URL or Video ID<span className={styles.required}>*</span></label>
              <p className={styles.fieldHint}>Paste full YouTube URL, Shorts link, or just the 11-character video ID</p>
              <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.youtubeUrl ? styles.inputError : ""} ${ytIdValid ? styles.inputSuccess : ""}`}>
                <span className={styles.inputPrefix}>▶</span>
                <input type="text" className={`${styles.input} ${styles.inputPrefixed}`}
                  placeholder="e.g. https://youtube.com/shorts/l12jCvLqUQg or l12jCvLqUQg"
                  value={videoForm.youtubeUrl}
                  onChange={(e) => setVideo("youtubeUrl", e.target.value)} />
              </div>
              {errors.youtubeUrl && <p className={styles.errorMsg}>⚠ {errors.youtubeUrl}</p>}

              {/* Live thumbnail preview */}
              {ytId && (
                <div className={styles.ytIdPreview}>
                  <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="Thumbnail"
                    className={styles.ytIdPreviewImg}
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                  <span className={styles.ytIdPreviewText}>
                    {ytIdValid ? `✓ Video ID: ${ytId}` : "⚠ Could not extract ID — check the URL"}
                  </span>
                </div>
              )}
            </div>

            {/* Quote */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Quote / Testimonial Text<span className={styles.required}>*</span></label>
              <p className={styles.fieldHint}>Full testimonial quote shown beside the video player</p>
              <div className={`${styles.inputWrap} ${errors.quote ? styles.inputError : ""} ${videoForm.quote && !errors.quote ? styles.inputSuccess : ""}`}>
                <textarea className={`${styles.input} ${styles.textarea} ${styles.textareaTall}`}
                  placeholder="e.g. Namaste, my name is Marit. I am from the Netherlands and I came to AYM…"
                  value={videoForm.quote} maxLength={1200} rows={5}
                  onChange={(e) => setVideo("quote", e.target.value)} />
                <span className={styles.charCount}>{videoForm.quote.length}/1200</span>
              </div>
              {errors.quote && <p className={styles.errorMsg}>⚠ {errors.quote}</p>}
            </div>
          </div>
        )}

        {/* ══ 2B. TEXT REVIEW FIELDS ══ */}
        {reviewType === "text" && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Text Review Details</h3>
            </div>

            {/* Name + Role */}
            <div className={styles.twoCol}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Reviewer Name<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""} ${textForm.name && !errors.name ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input} placeholder="e.g. Vinita Rai"
                    value={textForm.name} maxLength={80}
                    onChange={(e) => setText("name", e.target.value)} />
                  <span className={styles.charCount}>{textForm.name.length}/80</span>
                </div>
                {errors.name && <p className={styles.errorMsg}>⚠ {errors.name}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Role / Title<span className={styles.required}>*</span></label>
                <p className={styles.fieldHint}>e.g. Certified Yoga Teacher or Yoga Practitioner, Peru</p>
                <div className={`${styles.inputWrap} ${errors.role ? styles.inputError : ""} ${textForm.role && !errors.role ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input} placeholder="e.g. Certified Yoga Teacher"
                    value={textForm.role} maxLength={100}
                    onChange={(e) => setText("role", e.target.value)} />
                </div>
                {errors.role && <p className={styles.errorMsg}>⚠ {errors.role}</p>}
              </div>
            </div>

            {/* Avatar */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Avatar Photo</label>
              <p className={styles.fieldHint}>Upload or link a profile photo — if left blank, initials will be shown</p>
              <div className={styles.avatarUploadRow}>
                <div className={styles.avatarPreviewCircle}>
                  {textForm.avatarSrc
                    ? <img src={textForm.avatarSrc} alt={textForm.name} className={styles.avatarPreviewImg}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : textForm.name.charAt(0) || "?"}
                </div>
                <div className={styles.avatarControls}>
                  <div className={styles.uploadZoneSmall} onClick={() => avatarFileRef.current?.click()}>
                    <p className={styles.uploadText}>📁 Click to upload photo</p>
                    <input ref={avatarFileRef} type="file" accept="image/*" className={styles.uploadInput} onChange={handleAvatarFile} />
                  </div>
                  <div className={styles.urlRowSmall}>
                    <div className={styles.inputWrap}>
                      <input type="text" className={styles.input}
                        placeholder="Or paste avatar URL"
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAvatarUrl(); }} />
                    </div>
                    <button type="button" className={styles.addUrlBtn} onClick={handleAvatarUrl}>Use URL</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Star Rating</label>
              <div className={styles.inputWrap} style={{ padding: "0 0.5rem" }}>
                <div className={styles.starRatingInput}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button"
                      className={`${styles.starBtn} ${s <= textForm.rating ? styles.starBtnActive : ""}`}
                      onClick={() => setText("rating", s)}>★</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Review Quote<span className={styles.required}>*</span></label>
              <p className={styles.fieldHint}>The full review text — shown in the slider card</p>
              <div className={`${styles.inputWrap} ${errors.quote ? styles.inputError : ""} ${textForm.quote && !errors.quote ? styles.inputSuccess : ""}`}>
                <textarea className={`${styles.input} ${styles.textarea} ${styles.textareaTall}`}
                  placeholder="e.g. This is truly the best yoga school for 200-hour Yoga Teacher Training…"
                  value={textForm.quote} maxLength={800} rows={5}
                  onChange={(e) => setText("quote", e.target.value)} />
                <span className={styles.charCount}>{textForm.quote.length}/800</span>
              </div>
              {errors.quote && <p className={styles.errorMsg}>⚠ {errors.quote}</p>}
            </div>
          </div>
        )}

        <div className={styles.formDivider} />

        {/* ══ 3. SECTION META ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Section Header & Trust Strip</h3>
            <span className={styles.sectionBadge}>global settings</span>
          </div>
          <p className={styles.fieldHint} style={{ marginBottom: "1.2rem" }}>
            These settings apply to the whole testimonials section — super title, heading, subtitle and the trust strip at the bottom.
          </p>

          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Super Title</label>
              <div className={`${styles.inputWrap} ${sectionForm.superTitle ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input}
                  value={sectionForm.superTitle} maxLength={100}
                  onChange={(e) => setSec("superTitle", e.target.value)} />
                <span className={styles.charCount}>{sectionForm.superTitle.length}/100</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Main Title (H2)</label>
              <div className={`${styles.inputWrap} ${sectionForm.mainTitle ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input}
                  value={sectionForm.mainTitle} maxLength={150}
                  onChange={(e) => setSec("mainTitle", e.target.value)} />
                <span className={styles.charCount}>{sectionForm.mainTitle.length}/150</span>
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Subtitle</label>
            <div className={`${styles.inputWrap} ${sectionForm.subtitle ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`}
                value={sectionForm.subtitle} maxLength={300} rows={2}
                onChange={(e) => setSec("subtitle", e.target.value)} />
              <span className={styles.charCount}>{sectionForm.subtitle.length}/300</span>
            </div>
          </div>

          {/* Trust strip */}
          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Trust Strip Items</label>
            <p className={styles.fieldHint}>Stats shown at the bottom of the section — icon + label pairs</p>

            {sectionForm.trustItems.map((item, i) => (
              <div key={i} className={styles.trustItemCard}>
                <div className={styles.trustItemHeader}>
                  <span className={styles.trustItemNum}>{i + 1}</span>
                  <span className={styles.trustItemLabel}>Trust Item #{i + 1}</span>
                  <button type="button" className={styles.trustRemoveBtn}
                    onClick={() => removeTrust(i)}
                    disabled={sectionForm.trustItems.length <= 1}>✕</button>
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label} style={{ fontSize: "0.65rem" }}>Icon / Emoji</label>
                    <div className={`${styles.inputWrap} ${item.icon ? styles.inputSuccess : ""}`}>
                      <input type="text" className={styles.input}
                        placeholder="e.g. 🌍"
                        value={item.icon} maxLength={8}
                        onChange={(e) => updateTrust(i, "icon", e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label} style={{ fontSize: "0.65rem" }}>Label</label>
                    <div className={`${styles.inputWrap} ${item.label ? styles.inputSuccess : ""}`}>
                      <input type="text" className={styles.input}
                        placeholder="e.g. Students from 50+ Countries"
                        value={item.label} maxLength={60}
                        onChange={(e) => updateTrust(i, "label", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {sectionForm.trustItems.length < 5 && (
              <button type="button" className={styles.addTrustBtn} onClick={addTrust}>
                + Add Trust Item
              </button>
            )}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/dashboard/testimonials" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Save Testimonial</>}
          </button>
        </div>

      </div>
    </div>
  );
}
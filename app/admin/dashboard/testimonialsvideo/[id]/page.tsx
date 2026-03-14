"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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

type ReviewType = "video" | "text";
interface TrustItem { icon: string; label: string; }

interface VideoForm {
  name: string; country: string; flag: string;
  youtubeUrl: string; quote: string; course: string; rating: number;
}

interface TextForm {
  name: string; role: string; avatarSrc: string;
  quote: string; rating: number;
}

interface SectionForm {
  superTitle: string; mainTitle: string; subtitle: string;
  trustItems: TrustItem[];
}

interface FormErrors {
  name?: string; country?: string; youtubeUrl?: string;
  quote?: string; course?: string; role?: string;
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

/* ── Mock fetch ── */
const MOCK_VIDEO: VideoForm & { rating: number } = {
  name: "Marit", country: "Netherlands", flag: "🇳🇱",
  youtubeUrl: "l12jCvLqUQg", quote: "Namaste, my name is Marit. I am from the Netherlands and I came to AYM two weeks ago and I'm loving it so much. The teachers, they are amazing. They are guiding me through the practices very well and everybody else, they have such good eye for the little details.", course: "200hr YTT", rating: 5,
};

const MOCK_TEXT: TextForm & { rating: number } = {
  name: "Vinita Rai", role: "Certified Yoga Teacher", avatarSrc: "",
  quote: "This is truly the best yoga school for 200-hour Yoga Teacher Training. The environment is peaceful, supportive, and perfect for learning. The teachers are knowledgeable, the classes are well-structured, and the overall atmosphere helps you grow mentally, physically, and spiritually.", rating: 5,
};

const MOCK_SECTION: SectionForm = {
  superTitle: "Voices from Our Global Sangha",
  mainTitle: "Success Stories of Our Students",
  subtitle: "Hear the inspiring journeys of our students from around the world.",
  trustItems: [
    { icon: "🌍", label: "Students from 50+ Countries" },
    { icon: "⭐", label: "4.9 / 5 Average Rating" },
    { icon: "🧘", label: "100,000+ Certified Teachers" },
  ],
};

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const reviewId = params?.id as string;
  const typeParam = (searchParams?.get("type") as ReviewType) ?? "video";

  const [reviewType, setReviewType] = useState<ReviewType>(typeParam);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");

  const [videoForm, setVideoForm] = useState<VideoForm>({
    name: "", country: "", flag: "🇺🇸",
    youtubeUrl: "", quote: "", course: "200hr YTT", rating: 5,
  });

  const [textForm, setTextForm] = useState<TextForm>({
    name: "", role: "", avatarSrc: "", quote: "", rating: 5,
  });

  const [sectionForm, setSectionForm] = useState<SectionForm>({
    superTitle: "", mainTitle: "", subtitle: "",
    trustItems: [{ icon: "✦", label: "" }],
  });

  /* ── Fetch ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const res = await api.get(`/testimonials/${reviewId}`);
        // const data = res.data.data;
        if (typeParam === "video") {
          setVideoForm(MOCK_VIDEO);
        } else {
          setTextForm(MOCK_TEXT);
        }
        setSectionForm(MOCK_SECTION);
        setReviewType(typeParam);
      } catch (err) { console.log(err); }
      finally { setIsLoading(false); }
    };
    if (reviewId) fetchData();
  }, [reviewId, typeParam]);

  const ytId = reviewType === "video" ? getYoutubeId(videoForm.youtubeUrl) : "";
  const ytIdValid = ytId.length === 11;

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
      // await api.put(`/testimonials/${reviewId}`, payload);
      console.log("Update payload:", payload);
      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/testimonials"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to update");
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <p className={styles.successText}>Loading testimonial…</p>
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
          <h2 className={styles.successTitle}>Testimonial Updated!</h2>
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
        <span className={styles.breadcrumbCurrent}>Edit Review</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Edit Testimonial</h1>
          <p className={styles.pageSubtitle}>Update content for this {reviewType} review</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ TYPE INDICATOR ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Review Type</h3>
            <span className={styles.sectionBadge}>
              {reviewType === "video" ? "▶ Video Testimonial" : "✦ Text Review"}
            </span>
          </div>
          <div className={styles.typeToggle}>
            <button type="button"
              className={`${styles.typeBtn} ${reviewType === "video" ? styles.typeBtnActive : ""}`}
              onClick={() => setReviewType("video")}>▶ Video</button>
            <button type="button"
              className={`${styles.typeBtn} ${reviewType === "text" ? styles.typeBtnActive : ""}`}
              onClick={() => setReviewType("text")}>✦ Text</button>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══ VIDEO FIELDS ══ */}
        {reviewType === "video" && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Video Testimonial Details</h3>
            </div>

            <div className={styles.twoCol}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Student Name<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""} ${videoForm.name && !errors.name ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input} value={videoForm.name} maxLength={80}
                    onChange={(e) => setVideo("name", e.target.value)} />
                  <span className={styles.charCount}>{videoForm.name.length}/80</span>
                </div>
                {errors.name && <p className={styles.errorMsg}>⚠ {errors.name}</p>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Country<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.country ? styles.inputError : ""} ${videoForm.country && !errors.country ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input} value={videoForm.country} maxLength={60}
                    onChange={(e) => setVideo("country", e.target.value)} />
                </div>
                {errors.country && <p className={styles.errorMsg}>⚠ {errors.country}</p>}
              </div>
            </div>

            <div className={styles.threeCol}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Flag</label>
                <div className={styles.inputWrap} style={{ position: "relative" }}>
                  <select className={styles.select} value={videoForm.flag} onChange={(e) => setVideo("flag", e.target.value)}>
                    {FLAG_OPTIONS.map((f) => <option key={f.flag} value={f.flag}>{f.flag} {f.label}</option>)}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Course<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.course ? styles.inputError : ""}`} style={{ position: "relative" }}>
                  <select className={styles.select} value={videoForm.course} onChange={(e) => setVideo("course", e.target.value)}>
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

            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>YouTube URL or Video ID<span className={styles.required}>*</span></label>
              <p className={styles.fieldHint}>Paste full YouTube URL, Shorts link, or just the 11-character video ID</p>
              <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.youtubeUrl ? styles.inputError : ""} ${ytIdValid ? styles.inputSuccess : ""}`}>
                <span className={styles.inputPrefix}>▶</span>
                <input type="text" className={`${styles.input} ${styles.inputPrefixed}`}
                  value={videoForm.youtubeUrl}
                  onChange={(e) => setVideo("youtubeUrl", e.target.value)} />
              </div>
              {errors.youtubeUrl && <p className={styles.errorMsg}>⚠ {errors.youtubeUrl}</p>}
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

            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Quote / Testimonial Text<span className={styles.required}>*</span></label>
              <div className={`${styles.inputWrap} ${errors.quote ? styles.inputError : ""} ${videoForm.quote && !errors.quote ? styles.inputSuccess : ""}`}>
                <textarea className={`${styles.input} ${styles.textarea} ${styles.textareaTall}`}
                  value={videoForm.quote} maxLength={1200} rows={5}
                  onChange={(e) => setVideo("quote", e.target.value)} />
                <span className={styles.charCount}>{videoForm.quote.length}/1200</span>
              </div>
              {errors.quote && <p className={styles.errorMsg}>⚠ {errors.quote}</p>}
            </div>
          </div>
        )}

        {/* ══ TEXT REVIEW FIELDS ══ */}
        {reviewType === "text" && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Text Review Details</h3>
            </div>

            <div className={styles.twoCol}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Reviewer Name<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""} ${textForm.name && !errors.name ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input} value={textForm.name} maxLength={80}
                    onChange={(e) => setText("name", e.target.value)} />
                  <span className={styles.charCount}>{textForm.name.length}/80</span>
                </div>
                {errors.name && <p className={styles.errorMsg}>⚠ {errors.name}</p>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Role / Title<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.role ? styles.inputError : ""} ${textForm.role && !errors.role ? styles.inputSuccess : ""}`}>
                  <input type="text" className={styles.input} value={textForm.role} maxLength={100}
                    onChange={(e) => setText("role", e.target.value)} />
                </div>
                {errors.role && <p className={styles.errorMsg}>⚠ {errors.role}</p>}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Avatar Photo</label>
              <div className={styles.avatarUploadRow}>
                <div className={styles.avatarPreviewCircle}>
                  {textForm.avatarSrc
                    ? <img src={textForm.avatarSrc} alt={textForm.name} className={styles.avatarPreviewImg}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : textForm.name.charAt(0) || "?"}
                </div>
                <div className={styles.avatarControls}>
                  <div className={styles.uploadZoneSmall} onClick={() => avatarFileRef.current?.click()}>
                    <p className={styles.uploadText}>📁 Click to replace photo</p>
                    <input ref={avatarFileRef} type="file" accept="image/*" className={styles.uploadInput} onChange={handleAvatarFile} />
                  </div>
                  <div className={styles.urlRowSmall}>
                    <div className={styles.inputWrap}>
                      <input type="text" className={styles.input} placeholder="Or paste avatar URL"
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAvatarUrl(); }} />
                    </div>
                    <button type="button" className={styles.addUrlBtn} onClick={handleAvatarUrl}>Use URL</button>
                  </div>
                </div>
              </div>
            </div>

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

            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Review Quote<span className={styles.required}>*</span></label>
              <div className={`${styles.inputWrap} ${errors.quote ? styles.inputError : ""} ${textForm.quote && !errors.quote ? styles.inputSuccess : ""}`}>
                <textarea className={`${styles.input} ${styles.textarea} ${styles.textareaTall}`}
                  value={textForm.quote} maxLength={800} rows={5}
                  onChange={(e) => setText("quote", e.target.value)} />
                <span className={styles.charCount}>{textForm.quote.length}/800</span>
              </div>
              {errors.quote && <p className={styles.errorMsg}>⚠ {errors.quote}</p>}
            </div>
          </div>
        )}

        <div className={styles.formDivider} />

        {/* ══ SECTION META ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Section Header & Trust Strip</h3>
            <span className={styles.sectionBadge}>global settings</span>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Super Title</label>
              <div className={`${styles.inputWrap} ${sectionForm.superTitle ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input} value={sectionForm.superTitle} maxLength={100}
                  onChange={(e) => setSec("superTitle", e.target.value)} />
                <span className={styles.charCount}>{sectionForm.superTitle.length}/100</span>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Main Title</label>
              <div className={`${styles.inputWrap} ${sectionForm.mainTitle ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input} value={sectionForm.mainTitle} maxLength={150}
                  onChange={(e) => setSec("mainTitle", e.target.value)} />
                <span className={styles.charCount}>{sectionForm.mainTitle.length}/150</span>
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Subtitle</label>
            <div className={`${styles.inputWrap} ${sectionForm.subtitle ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`} value={sectionForm.subtitle} maxLength={300} rows={2}
                onChange={(e) => setSec("subtitle", e.target.value)} />
              <span className={styles.charCount}>{sectionForm.subtitle.length}/300</span>
            </div>
          </div>

          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Trust Strip Items</label>
            {sectionForm.trustItems.map((item, i) => (
              <div key={i} className={styles.trustItemCard}>
                <div className={styles.trustItemHeader}>
                  <span className={styles.trustItemNum}>{i + 1}</span>
                  <span className={styles.trustItemLabel}>Trust Item #{i + 1}</span>
                  <button type="button" className={styles.trustRemoveBtn}
                    onClick={() => removeTrust(i)} disabled={sectionForm.trustItems.length <= 1}>✕</button>
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label} style={{ fontSize: "0.65rem" }}>Icon</label>
                    <div className={`${styles.inputWrap} ${item.icon ? styles.inputSuccess : ""}`}>
                      <input type="text" className={styles.input} placeholder="🌍" value={item.icon} maxLength={8}
                        onChange={(e) => updateTrust(i, "icon", e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label} style={{ fontSize: "0.65rem" }}>Label</label>
                    <div className={`${styles.inputWrap} ${item.label ? styles.inputSuccess : ""}`}>
                      <input type="text" className={styles.input} placeholder="e.g. 4.9 / 5 Average Rating" value={item.label} maxLength={60}
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

        <div className={styles.formActions}>
          <Link href="/admin/dashboard/testimonials" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Updating…</> : <><span>✦</span> Update Testimonial</>}
          </button>
        </div>

      </div>
    </div>
  );
}
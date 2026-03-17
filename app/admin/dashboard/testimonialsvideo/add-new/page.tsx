"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Simple inline styles as fallback
const styles = {
  formPage: { padding: '2rem' },
  breadcrumb: { marginBottom: '1rem' },
  breadcrumbLink: { color: '#b87c4b', textDecoration: 'none' },
  breadcrumbSep: { margin: '0 0.5rem', color: '#666' },
  breadcrumbCurrent: { color: '#333' },
  pageHeader: { marginBottom: '2rem' },
  pageTitle: { fontSize: '2rem', color: '#333' },
  pageSubtitle: { color: '#666' },
  ornament: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  ornamentLine: { flex: 1, height: '1px', background: '#e0d6cc' },
  formCard: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  sectionBlock: { marginBottom: '2rem' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
  sectionIcon: { color: '#b87c4b' },
  sectionTitle: { fontSize: '1.25rem', margin: 0 },
  fieldGroup: { marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 500 },
  labelIcon: { marginRight: '0.5rem', color: '#b87c4b' },
  required: { color: '#dc2626', marginLeft: '0.25rem' },
  fieldHint: { fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' },
  inputWrap: { marginBottom: '0.25rem' },
  input: { width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' },
  textarea: { minHeight: '100px' },
  errorMsg: { color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' },
  formDivider: { height: '1px', background: '#e0d6cc', margin: '2rem 0' },
  typeToggle: { display: 'flex', gap: '1rem' },
  typeBtn: { padding: '0.5rem 1rem', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', cursor: 'pointer' },
  typeBtnActive: { background: '#b87c4b', color: '#fff', borderColor: '#b87c4b' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  threeCol: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  select: { width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' },
  selectArrow: { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  starRatingInput: { display: 'flex', gap: '0.25rem' },
  starBtn: { background: 'none', border: 'none', fontSize: '1.5rem', color: '#ddd', cursor: 'pointer' },
  starBtnActive: { color: '#fbbf24' },
  successScreen: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  successCard: { textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  successOm: { fontSize: '3rem', color: '#b87c4b' },
  successCheck: { fontSize: '4rem', color: '#10b981', margin: '1rem 0' },
  successTitle: { fontSize: '1.5rem', marginBottom: '0.5rem' },
  successText: { color: '#666' },
  formActions: { display: 'flex', justifyContent: 'space-between', marginTop: '2rem' },
  cancelBtn: { padding: '0.5rem 1rem', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', textDecoration: 'none', color: '#333' },
  submitBtn: { padding: '0.5rem 2rem', background: '#b87c4b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  submitBtnLoading: { opacity: 0.7, cursor: 'not-allowed' },
  spinner: { display: 'inline-block', width: '1rem', height: '1rem', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '0.5rem' },
  charCount: { fontSize: '0.75rem', color: '#666', textAlign: 'right', display: 'block' },
  inputError: { borderColor: '#dc2626' },
  inputSuccess: { borderColor: '#10b981' },
  inputWithPrefix: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  inputPrefix: { color: '#666' },
  inputPrefixed: { flex: 1 },
  videoPreviewBadge: { marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: '#f3f4f6', borderRadius: '4px', fontSize: '0.875rem' },
  ytIdPreview: { marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  ytIdPreviewImg: { width: '120px', height: '68px', objectFit: 'cover', borderRadius: '4px' },
  ytIdPreviewText: { fontSize: '0.875rem', color: '#666' }
} as const;

type StyleKey = keyof typeof styles;

// Create a proxy to handle style lookups
const styleProxy = new Proxy(styles, {
  get: (target, prop: string) => {
    return target[prop as StyleKey] || {};
  }
}) as Record<string, any>;

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

/* ── Types ── */
type ReviewType = "video" | "text";

interface VideoForm {
  name: string;
  country: string;
  flag: string;
  youtubeUrl: string;
  quote: string;
  course: string;
  rating: number;
}

interface TextForm {
  name: string;
  role: string;
  avatarSrc: string;
  quote: string;
  rating: number;
}

interface SectionForm {
  superTitle: string;
  mainTitle: string;
  subtitle: string;
}

const COURSE_OPTIONS = ["200hr YTT", "300hr YTT", "500hr YTT", "Online YTT", "Yoga Retreat", "Other"];
const FLAG_OPTIONS = [
  { flag: "🇺🇸", label: "United States" }, { flag: "🇬🇧", label: "United Kingdom" },
  { flag: "🇩🇪", label: "Germany" }, { flag: "🇫🇷", label: "France" },
  { flag: "🇳🇱", label: "Netherlands" }, { flag: "🇦🇺", label: "Australia" },
  { flag: "🇨🇦", label: "Canada" }, { flag: "🇮🇳", label: "India" },
  { flag: "🌍", label: "Other" },
];

export default function AddTestimonialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const typeParam = searchParams?.get("type");
  const defaultType: ReviewType = typeParam === "text" ? "text" : "video";

  const [reviewType, setReviewType] = useState<ReviewType>(defaultType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Video form ── */
  const [videoForm, setVideoForm] = useState<VideoForm>({
    name: "",
    country: "",
    flag: "🇺🇸",
    youtubeUrl: "",
    quote: "",
    course: "200hr YTT",
    rating: 5,
  });

  /* ── Text form ── */
  const [textForm, setTextForm] = useState<TextForm>({
    name: "",
    role: "",
    avatarSrc: "",
    quote: "",
    rating: 5,
  });

  /* ── Section header form ── */
  const [sectionForm, setSectionForm] = useState<SectionForm>({
    superTitle: "Voices from Our Global Sangha",
    mainTitle: "Success Stories of Our Students",
    subtitle: "Hear the inspiring journeys of our students from around the world.",
  });

  /* ── Computed YouTube ID ── */
  const ytId = reviewType === "video" ? getYoutubeId(videoForm.youtubeUrl) : "";
  const ytIdValid = ytId.length === 11;

  /* ── Setters ── */
  const setVideo = (k: keyof VideoForm, v: string | number) => {
    setVideoForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => {
      const newErrors = { ...p };
      delete newErrors[k];
      return newErrors;
    });
  };

  const setText = (k: keyof TextForm, v: string | number) => {
    setTextForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => {
      const newErrors = { ...p };
      delete newErrors[k];
      return newErrors;
    });
  };

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    
    if (reviewType === "video") {
      if (!videoForm.name.trim()) e.name = "Name is required";
      if (!videoForm.country.trim()) e.country = "Country is required";
      if (!videoForm.youtubeUrl.trim()) {
        e.youtubeUrl = "YouTube URL/ID is required";
      } else if (!ytIdValid) {
        e.youtubeUrl = "Could not extract a valid YouTube video ID";
      }
      if (!videoForm.quote.trim()) e.quote = "Quote is required";
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
      
      console.log("Payload:", payload);
      
      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/testimonials"), 1500);
    } catch (err) {
      alert("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styleProxy.successScreen}>
        <div style={styleProxy.successCard}>
          <div style={styleProxy.successOm}>ॐ</div>
          <div style={styleProxy.successCheck}>✓</div>
          <h2 style={styleProxy.successTitle}>Testimonial Saved!</h2>
          <p style={styleProxy.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styleProxy.formPage}>
      <div style={styleProxy.breadcrumb}>
        <Link href="/admin/dashboard/testimonials" style={styleProxy.breadcrumbLink}>
          Testimonials
        </Link>
        <span style={styleProxy.breadcrumbSep}>›</span>
        <span style={styleProxy.breadcrumbCurrent}>Add Review</span>
      </div>

      <div style={styleProxy.pageHeader}>
        <h1 style={styleProxy.pageTitle}>Add Testimonial</h1>
        <p style={styleProxy.pageSubtitle}>
          Add a video or text review to the testimonials section
        </p>
      </div>

      <div style={styleProxy.ornament}>
        <span>❧</span>
        <div style={styleProxy.ornamentLine} />
        <span>ॐ</span>
        <div style={styleProxy.ornamentLine} />
        <span>❧</span>
      </div>

      <div style={styleProxy.formCard}>

        {/* Review Type Toggle */}
        <div style={styleProxy.sectionBlock}>
          <div style={styleProxy.sectionHeader}>
            <span style={styleProxy.sectionIcon}>✦</span>
            <h3 style={styleProxy.sectionTitle}>Review Type</h3>
          </div>
          <div style={styleProxy.fieldGroup}>
            <label style={styleProxy.label}>
              <span style={styleProxy.labelIcon}>✦</span>
              Select Type
            </label>
            <p style={styleProxy.fieldHint}>
              Choose between video or text testimonial
            </p>
            <div style={styleProxy.typeToggle}>
              <button
                type="button"
                style={{
                  ...styleProxy.typeBtn,
                  ...(reviewType === "video" ? styleProxy.typeBtnActive : {})
                }}
                onClick={() => setReviewType("video")}
              >
                ▶ Video Testimonial
              </button>
              <button
                type="button"
                style={{
                  ...styleProxy.typeBtn,
                  ...(reviewType === "text" ? styleProxy.typeBtnActive : {})
                }}
                onClick={() => setReviewType("text")}
              >
                ✦ Text Review
              </button>
            </div>
          </div>
        </div>

        <div style={styleProxy.formDivider} />

        {/* Video Testimonial Fields */}
        {reviewType === "video" && (
          <div style={styleProxy.sectionBlock}>
            <div style={styleProxy.sectionHeader}>
              <span style={styleProxy.sectionIcon}>✦</span>
              <h3 style={styleProxy.sectionTitle}>Video Testimonial Details</h3>
            </div>

            <div style={styleProxy.twoCol}>
              <div style={styleProxy.fieldGroup}>
                <label style={styleProxy.label}>
                  <span style={styleProxy.labelIcon}>✦</span>
                  Student Name<span style={styleProxy.required}>*</span>
                </label>
                <div style={styleProxy.inputWrap}>
                  <input 
                    type="text" 
                    style={{
                      ...styleProxy.input,
                      ...(errors.name ? styleProxy.inputError : {}),
                      ...(videoForm.name && !errors.name ? styleProxy.inputSuccess : {})
                    }}
                    placeholder="e.g. Marit"
                    value={videoForm.name}
                    onChange={(e) => setVideo("name", e.target.value)}
                  />
                  <div style={styleProxy.charCount}>{videoForm.name.length}/80</div>
                </div>
                {errors.name && <p style={styleProxy.errorMsg}>⚠ {errors.name}</p>}
              </div>

              <div style={styleProxy.fieldGroup}>
                <label style={styleProxy.label}>
                  <span style={styleProxy.labelIcon}>✦</span>
                  Country<span style={styleProxy.required}>*</span>
                </label>
                <div style={styleProxy.inputWrap}>
                  <input 
                    type="text" 
                    style={{
                      ...styleProxy.input,
                      ...(errors.country ? styleProxy.inputError : {}),
                      ...(videoForm.country && !errors.country ? styleProxy.inputSuccess : {})
                    }}
                    placeholder="e.g. Netherlands"
                    value={videoForm.country}
                    onChange={(e) => setVideo("country", e.target.value)}
                  />
                </div>
                {errors.country && <p style={styleProxy.errorMsg}>⚠ {errors.country}</p>}
              </div>
            </div>

            <div style={styleProxy.threeCol}>
              <div style={styleProxy.fieldGroup}>
                <label style={styleProxy.label}>
                  <span style={styleProxy.labelIcon}>✦</span>
                  Flag
                </label>
                <div style={{ position: "relative" }}>
                  <select 
                    style={styleProxy.select}
                    value={videoForm.flag}
                    onChange={(e) => setVideo("flag", e.target.value)}
                  >
                    {FLAG_OPTIONS.map((f) => (
                      <option key={f.flag} value={f.flag}>{f.flag} {f.label}</option>
                    ))}
                  </select>
                  <span style={styleProxy.selectArrow}>▾</span>
                </div>
              </div>

              <div style={styleProxy.fieldGroup}>
                <label style={styleProxy.label}>
                  <span style={styleProxy.labelIcon}>✦</span>
                  Course
                </label>
                <div style={{ position: "relative" }}>
                  <select 
                    style={styleProxy.select}
                    value={videoForm.course}
                    onChange={(e) => setVideo("course", e.target.value)}
                  >
                    {COURSE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span style={styleProxy.selectArrow}>▾</span>
                </div>
              </div>

              <div style={styleProxy.fieldGroup}>
                <label style={styleProxy.label}>
                  <span style={styleProxy.labelIcon}>✦</span>
                  Rating
                </label>
                <div style={{ ...styleProxy.inputWrap, padding: "0 0.5rem" }}>
                  <div style={styleProxy.starRatingInput}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        type="button"
                        style={{
                          ...styleProxy.starBtn,
                          ...(s <= videoForm.rating ? styleProxy.starBtnActive : {})
                        }}
                        onClick={() => setVideo("rating", s)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={styleProxy.fieldGroup}>
              <label style={styleProxy.label}>
                <span style={styleProxy.labelIcon}>✦</span>
                YouTube URL<span style={styleProxy.required}>*</span>
              </label>
              <p style={styleProxy.fieldHint}>
                Paste YouTube URL or video ID
              </p>
              <div style={styleProxy.inputWithPrefix}>
                <span style={styleProxy.inputPrefix}>▶</span>
                <input 
                  type="text" 
                  style={{
                    ...styleProxy.input,
                    ...styleProxy.inputPrefixed,
                    ...(errors.youtubeUrl ? styleProxy.inputError : {}),
                    ...(ytIdValid ? styleProxy.inputSuccess : {})
                  }}
                  placeholder="e.g. https://youtube.com/watch?v=..."
                  value={videoForm.youtubeUrl}
                  onChange={(e) => setVideo("youtubeUrl", e.target.value)}
                />
              </div>
              {errors.youtubeUrl && <p style={styleProxy.errorMsg}>⚠ {errors.youtubeUrl}</p>}
              
              {ytId && (
                <div style={styleProxy.ytIdPreview}>
                  <img 
                    src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} 
                    alt=""
                    style={styleProxy.ytIdPreviewImg}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <span style={styleProxy.ytIdPreviewText}>
                    {ytIdValid ? `✓ Video ID: ${ytId}` : "Invalid ID"}
                  </span>
                </div>
              )}
            </div>

            <div style={styleProxy.fieldGroup}>
              <label style={styleProxy.label}>
                <span style={styleProxy.labelIcon}>✦</span>
                Quote<span style={styleProxy.required}>*</span>
              </label>
              <div style={styleProxy.inputWrap}>
                <textarea 
                  style={{
                    ...styleProxy.input,
                    ...styleProxy.textarea,
                    ...(errors.quote ? styleProxy.inputError : {}),
                    ...(videoForm.quote && !errors.quote ? styleProxy.inputSuccess : {})
                  }}
                  placeholder="Testimonial quote..."
                  value={videoForm.quote}
                  maxLength={1200}
                  rows={4}
                  onChange={(e) => setVideo("quote", e.target.value)}
                />
                <div style={styleProxy.charCount}>{videoForm.quote.length}/1200</div>
              </div>
              {errors.quote && <p style={styleProxy.errorMsg}>⚠ {errors.quote}</p>}
            </div>
          </div>
        )}

        {/* Text Review Fields */}
        {reviewType === "text" && (
          <div style={styleProxy.sectionBlock}>
            <div style={styleProxy.sectionHeader}>
              <span style={styleProxy.sectionIcon}>✦</span>
              <h3 style={styleProxy.sectionTitle}>Text Review Details</h3>
            </div>

            <div style={styleProxy.twoCol}>
              <div style={styleProxy.fieldGroup}>
                <label style={styleProxy.label}>
                  <span style={styleProxy.labelIcon}>✦</span>
                  Reviewer Name<span style={styleProxy.required}>*</span>
                </label>
                <div style={styleProxy.inputWrap}>
                  <input 
                    type="text" 
                    style={{
                      ...styleProxy.input,
                      ...(errors.name ? styleProxy.inputError : {}),
                      ...(textForm.name && !errors.name ? styleProxy.inputSuccess : {})
                    }}
                    placeholder="e.g. Vinita Rai"
                    value={textForm.name}
                    onChange={(e) => setText("name", e.target.value)}
                  />
                  <div style={styleProxy.charCount}>{textForm.name.length}/80</div>
                </div>
                {errors.name && <p style={styleProxy.errorMsg}>⚠ {errors.name}</p>}
              </div>

              <div style={styleProxy.fieldGroup}>
                <label style={styleProxy.label}>
                  <span style={styleProxy.labelIcon}>✦</span>
                  Role<span style={styleProxy.required}>*</span>
                </label>
                <p style={styleProxy.fieldHint}>e.g. Certified Yoga Teacher</p>
                <div style={styleProxy.inputWrap}>
                  <input 
                    type="text" 
                    style={{
                      ...styleProxy.input,
                      ...(errors.role ? styleProxy.inputError : {}),
                      ...(textForm.role && !errors.role ? styleProxy.inputSuccess : {})
                    }}
                    placeholder="e.g. Yoga Teacher, Peru"
                    value={textForm.role}
                    onChange={(e) => setText("role", e.target.value)}
                  />
                </div>
                {errors.role && <p style={styleProxy.errorMsg}>⚠ {errors.role}</p>}
              </div>
            </div>

            <div style={styleProxy.fieldGroup}>
              <label style={styleProxy.label}>
                <span style={styleProxy.labelIcon}>✦</span>
                Rating
              </label>
              <div style={{ ...styleProxy.inputWrap, padding: "0 0.5rem" }}>
                <div style={styleProxy.starRatingInput}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      type="button"
                      style={{
                        ...styleProxy.starBtn,
                        ...(s <= textForm.rating ? styleProxy.starBtnActive : {})
                      }}
                      onClick={() => setText("rating", s)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={styleProxy.fieldGroup}>
              <label style={styleProxy.label}>
                <span style={styleProxy.labelIcon}>✦</span>
                Quote<span style={styleProxy.required}>*</span>
              </label>
              <div style={styleProxy.inputWrap}>
                <textarea 
                  style={{
                    ...styleProxy.input,
                    ...styleProxy.textarea,
                    ...(errors.quote ? styleProxy.inputError : {}),
                    ...(textForm.quote && !errors.quote ? styleProxy.inputSuccess : {})
                  }}
                  placeholder="Review text..."
                  value={textForm.quote}
                  maxLength={800}
                  rows={4}
                  onChange={(e) => setText("quote", e.target.value)}
                />
                <div style={styleProxy.charCount}>{textForm.quote.length}/800</div>
              </div>
              {errors.quote && <p style={styleProxy.errorMsg}>⚠ {errors.quote}</p>}
            </div>
          </div>
        )}

        <div style={styleProxy.formDivider} />

        {/* Section Meta */}
        <div style={styleProxy.sectionBlock}>
          <div style={styleProxy.sectionHeader}>
            <span style={styleProxy.sectionIcon}>✦</span>
            <h3 style={styleProxy.sectionTitle}>Section Header</h3>
          </div>

          <div style={styleProxy.twoCol}>
            <div style={styleProxy.fieldGroup}>
              <label style={styleProxy.label}>
                <span style={styleProxy.labelIcon}>✦</span>
                Super Title
              </label>
              <div style={styleProxy.inputWrap}>
                <input 
                  type="text" 
                  style={styleProxy.input}
                  value={sectionForm.superTitle}
                  onChange={(e) => setSectionForm(p => ({ ...p, superTitle: e.target.value }))}
                />
              </div>
            </div>

            <div style={styleProxy.fieldGroup}>
              <label style={styleProxy.label}>
                <span style={styleProxy.labelIcon}>✦</span>
                Main Title
              </label>
              <div style={styleProxy.inputWrap}>
                <input 
                  type="text" 
                  style={styleProxy.input}
                  value={sectionForm.mainTitle}
                  onChange={(e) => setSectionForm(p => ({ ...p, mainTitle: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div style={styleProxy.fieldGroup}>
            <label style={styleProxy.label}>
              <span style={styleProxy.labelIcon}>✦</span>
              Subtitle
            </label>
            <div style={styleProxy.inputWrap}>
              <textarea 
                style={{ ...styleProxy.input, ...styleProxy.textarea }}
                value={sectionForm.subtitle}
                rows={2}
                onChange={(e) => setSectionForm(p => ({ ...p, subtitle: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div style={styleProxy.formDivider} />

        {/* Form Actions */}
        <div style={styleProxy.formActions}>
          <Link href="/admin/dashboard/testimonials" style={styleProxy.cancelBtn}>
            ← Cancel
          </Link>
          <button 
            type="button"
            style={{
              ...styleProxy.submitBtn,
              ...(isSubmitting ? styleProxy.submitBtnLoading : {})
            }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Testimonial"}
          </button>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
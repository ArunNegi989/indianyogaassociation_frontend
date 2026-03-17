"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "@/assets/style/Admin/dashboard/accreditationsection/Accreditationsection.module.css";
import api from "@/lib/api";

/* ─────────────────────── Types ─────────────────────── */

const getImageUrl = (path: string) => {
  if (!path) return "";
  const cleanPath = path.replace(/\\/g, "/");
  return `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
};
interface CertItem {
  label: string;
  tag: string;
  alt: string;
  image?: string;
  imagePreview?: string;
}

interface BadgeItem {
  icon: string;
  text: string;
}

interface FormData {
  sectionTitle: string;
  authPara1: string; authPara2: string; authPara3: string; authPara4: string;
  imageCaption: string; pullQuote: string;
  videoSrc: string;
  immerseTitle: string; immersePara1: string; immersePara2: string;
  immerseCtaText: string; immerseCtaLink: string;
  recognitionTitle: string;
  recognitionPara1: string; recognitionPara2: string;
  certs: CertItem[];
  badges: BadgeItem[];
  mainImage?: string;
  _mainImagePreview?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    sectionTitle: string;
    authPara1: string; authPara2: string; authPara3: string; authPara4: string;
    imageCaption?: string; pullQuote: string;
    videoSrc: string;
    immerseTitle: string; immersePara1: string; immersePara2?: string;
    immerseCtaText: string; immerseCtaLink: string;
    recognitionTitle: string;
    recognitionPara1: string; recognitionPara2?: string;
    certs?: CertItem[];
    badges?: BadgeItem[];
    mainImage?: string;
  };
}

const EMPTY_CERT: CertItem = { label: "", tag: "", alt: "", imagePreview: "" };
const EMPTY_BADGE: BadgeItem = { icon: "", text: "" };

/* ─────────────────────── Main ─────────────────────── */
export default function EditAccreditationSectionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"auth" | "video" | "recognition" | "certs">("auth");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [certFiles, setCertFiles] = useState<(File | null)[]>([]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      sectionTitle: "",
      authPara1: "", authPara2: "", authPara3: "", authPara4: "",
      imageCaption: "", pullQuote: "",
      videoSrc: "",
      immerseTitle: "", immersePara1: "", immersePara2: "",
      immerseCtaText: "", immerseCtaLink: "",
      recognitionTitle: "",
      recognitionPara1: "", recognitionPara2: "",
      certs: [{ ...EMPTY_CERT }],
      badges: [{ ...EMPTY_BADGE }],
    },
    mode: "onChange",
  });

  // Watch values for character counts and previews
  const watchAllFields = watch();

  /* ─────────────────────── Field Arrays ─────────────────────── */
  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certs",
  });

  const {
    fields: badgeFields,
    append: appendBadge,
    remove: removeBadge,
  } = useFieldArray({
    control,
    name: "badges",
  });

  /* fetch existing data */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse>(`/accreditation/${id}`);
        const d = res.data.data;
        
        // Prepare certs with imagePreview from existing images
        const certsWithPreview = d.certs?.map(cert => ({
  ...cert,
  imagePreview: cert.image ? getImageUrl(cert.image) : "",
})) || [{ ...EMPTY_CERT }];

        // Prepare badges with proper fallback
        const badgesWithFallback = d.badges?.length ? d.badges : [{ ...EMPTY_BADGE }];

        // Reset form with fetched data
        reset({
          sectionTitle: d.sectionTitle || "",
          authPara1: d.authPara1 || "",
          authPara2: d.authPara2 || "",
          authPara3: d.authPara3 || "",
          authPara4: d.authPara4 || "",
          imageCaption: d.imageCaption || "",
          pullQuote: d.pullQuote || "",
          videoSrc: d.videoSrc || "",
          immerseTitle: d.immerseTitle || "",
          immersePara1: d.immersePara1 || "",
          immersePara2: d.immersePara2 || "",
          immerseCtaText: d.immerseCtaText || "",
          immerseCtaLink: d.immerseCtaLink || "",
          recognitionTitle: d.recognitionTitle || "",
          recognitionPara1: d.recognitionPara1 || "",
          recognitionPara2: d.recognitionPara2 || "",
          certs: certsWithPreview,
          badges: badgesWithFallback,
          mainImage: d.mainImage,
        });

        // Initialize certFiles array with nulls (no new files initially)
        setCertFiles(new Array(certsWithPreview.length).fill(null));

        // Set main image preview if exists
       if (d.mainImage) {
  setValue("_mainImagePreview", getImageUrl(d.mainImage));
}

      } catch (err) {
        console.error("Failed to fetch accreditation data:", err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, reset, setValue]);

  /* ─────────────────────── Image Handlers ─────────────────────── */
  const handleMainImage = (file: File | null) => {
    if (!file) return;

    setMainImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setValue("_mainImagePreview", e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCertImage = (index: number, file: File | null) => {
    if (!file) return;

    // Store file for upload
    setCertFiles((prev) => {
      const arr = [...prev];
      arr[index] = file;
      return arr;
    });

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const currentCerts = getValues("certs");
      const updatedCerts = currentCerts.map((cert, i) => 
        i === index ? { ...cert, imagePreview: e.target?.result as string } : cert
      );
      setValue("certs", updatedCerts);
    };
    reader.readAsDataURL(file);
  };

  const addCert = () => {
    if (certFields.length < 6) {
      appendCert({ ...EMPTY_CERT });
      setCertFiles((prev) => [...prev, null]);
    }
  };

  const removeCertHandler = (index: number) => {
    removeCert(index);
    setCertFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addBadge = () => {
    if (badgeFields.length < 6) {
      appendBadge({ ...EMPTY_BADGE });
    }
  };

  /* ─────────────────────── Submit Handler ─────────────────────── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append all text fields
      const textFields: (keyof FormData)[] = [
        'sectionTitle', 'authPara1', 'authPara2', 'authPara3', 'authPara4',
        'imageCaption', 'pullQuote', 'videoSrc', 'immerseTitle', 'immersePara1',
        'immersePara2', 'immerseCtaText', 'immerseCtaLink', 'recognitionTitle',
        'recognitionPara1', 'recognitionPara2'
      ];

      textFields.forEach(field => {
        const value = data[field];
        if (value !== undefined && value !== null) {
          formData.append(field, String(value));
        }
      });

      // Prepare certs data without preview URLs
      const certsData = data.certs.map(cert => ({
        label: cert.label,
        tag: cert.tag,
        alt: cert.alt || "",
        image: cert.image, // Keep existing image path if any
      }));

      formData.append("certs", JSON.stringify(certsData));
      formData.append("badges", JSON.stringify(data.badges));

      // Append new main image if selected
      if (mainImageFile) {
        formData.append("mainImage", mainImageFile);
      }

      // Append new cert images
      certFiles.forEach((file) => {
        if (file) formData.append("certImages", file);
      });

      // API Call
      await api.put(`/accreditation/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/accreditationsection"), 1500);

    } catch (error: any) {
      console.error("Update error:", error);
      alert(error?.response?.data?.message || error?.message || "Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* loading skeleton */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard/accreditationsection")}>Accreditation</button>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Edit Section</span>
        </div>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Accreditation Section</h1>
          <p className={styles.pageSubtitle}>Loading...</p>
        </div>
        <div className={styles.formCard}>
          <div className={styles.skeletonField} style={{ height: '60px', marginBottom: '20px' }} />
          <div className={styles.skeletonField} style={{ height: '100px', marginBottom: '20px' }} />
          <div className={styles.skeletonField} style={{ height: '100px', marginBottom: '20px' }} />
          <div className={styles.skeletonField} style={{ height: '100px', marginBottom: '20px' }} />
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
          <h2 className={styles.successTitle}>Section Updated!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    auth: !!(errors.sectionTitle || errors.authPara1 || errors.authPara2 || errors.authPara3 || errors.authPara4 || errors.pullQuote),
    video: !!(errors.videoSrc || errors.immerseTitle || errors.immersePara1 || errors.immerseCtaText || errors.immerseCtaLink),
    recognition: !!(errors.recognitionTitle || errors.recognitionPara1),
    certs: !!(errors.certs || errors.badges),
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard/accreditationsection")}>Accreditation</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Section</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Accreditation Section</h1>
        <p className={styles.pageSubtitle}>Update the details of the Accreditation &amp; Recognition section</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Tab Nav */}
      <div className={styles.tabNav}>
        {(["auth", "video", "recognition", "certs"] as const).map((tab) => {
          const labels = { auth: "① Auth Section", video: "② Video & Immerse", recognition: "③ Recognition", certs: "④ Certs & Badges" };
          return (
            <button key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${tabErrors[tab] ? styles.tabBtnError : ""}`}
              onClick={() => setActiveTab(tab)}>
              {tabErrors[tab] && <span className={styles.tabDot} />}
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ══════════ TAB 1 — AUTH SECTION ══════════ */}
          {activeTab === "auth" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Section Header</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Section Title (H2)
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>Main heading shown at the top of the auth section</p>
                  <div className={`${styles.inputWrap} ${errors.sectionTitle ? styles.inputError : ""} ${watchAllFields.sectionTitle && !errors.sectionTitle ? styles.inputSuccess : ""}`}>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="e.g. Authentic, Internationally recognized Yoga Teacher Training Certification School in Rishikesh"
                      maxLength={200}
                      rows={2}
                      {...register("sectionTitle", { 
                        required: "Section title is required",
                        maxLength: { value: 200, message: "Maximum 200 characters" }
                      })}
                    />
                    <span className={`${styles.charCount} ${styles.charCountBottom}`}>
                      {watchAllFields.sectionTitle?.length || 0}/200
                    </span>
                  </div>
                  {errors.sectionTitle && <p className={styles.errorMsg}>⚠ {errors.sectionTitle.message}</p>}
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Left Column — Body Paragraphs</h3>
                </div>

                {[
                  { name: "authPara1" as const, label: "Paragraph 1", hint: "Accreditation overview — Yoga Alliance USA & YCB", ph: "Our Yoga Teacher Training in Rishikesh is accredited by Yoga Alliance USA…" },
                  { name: "authPara2" as const, label: "Paragraph 2", hint: "Curriculum structure — beginner to advanced", ph: "Our yoga school in Rishikesh offers a well-structured and updated curriculum…" },
                  { name: "authPara3" as const, label: "Paragraph 3", hint: "Specialized programs (Kundalini, Prenatal, Hatha)", ph: "Our training is deeply rooted in traditional yoga practices…" },
                  { name: "authPara4" as const, label: "Paragraph 4", hint: "Online training & closing note", ph: "In addition to our immersive teacher training courses, we provide online…" },
                ].map(({ name, label, hint, ph }) => (
                  <div key={name} className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>{label}
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>{hint}</p>
                    <div className={`${styles.inputWrap} ${errors[name] ? styles.inputError : ""} ${watchAllFields[name] && !errors[name] ? styles.inputSuccess : ""}`}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder={ph}
                        maxLength={600}
                        rows={3}
                        {...register(name, { 
                          required: `${label} is required`,
                          maxLength: { value: 600, message: "Maximum 600 characters" }
                        })}
                      />
                      <span className={`${styles.charCount} ${styles.charCountBottom}`}>
                        {watchAllFields[name]?.length || 0}/600
                      </span>
                    </div>
                    {errors[name] && <p className={styles.errorMsg}>⚠ {errors[name].message}</p>}
                  </div>
                ))}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Right Column — Image &amp; Quote</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>Main Section Image</label>
                  <p className={styles.fieldHint}>Upload new image to replace existing (leave empty to keep current)</p>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleMainImage(e.target.files?.[0] || null)}
                    />
                    {watchAllFields._mainImagePreview ? (
                      <img src={watchAllFields._mainImagePreview} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    ) : (
                      <>
                        <span className={styles.uploadIcon}>📷</span>
                        <span className={styles.uploadText}>Click to upload new image</span>
                        <span className={styles.uploadSubtext}>Leave empty to keep existing — JPG, PNG, WEBP</span>
                      </>
                    )}
                  </label>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>Image Caption</label>
                  <p className={styles.fieldHint}>Small caption displayed below the image</p>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. AYM Study Materials & Curriculum"
                      maxLength={80}
                      {...register("imageCaption")}
                    />
                    <span className={styles.charCount}>{watchAllFields.imageCaption?.length || 0}/80</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Pull Quote
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>Short quote shown in the styled blockquote with " " marks</p>
                  <div className={`${styles.inputWrap} ${errors.pullQuote ? styles.inputError : ""} ${watchAllFields.pullQuote && !errors.pullQuote ? styles.inputSuccess : ""}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder='e.g. Learn, grow, and transform.'
                      maxLength={120}
                      {...register("pullQuote", { 
                        required: "Pull quote is required",
                        maxLength: { value: 120, message: "Maximum 120 characters" }
                      })}
                    />
                    <span className={styles.charCount}>{watchAllFields.pullQuote?.length || 0}/120</span>
                  </div>
                  {errors.pullQuote && <p className={styles.errorMsg}>⚠ {errors.pullQuote.message}</p>}
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 2 — VIDEO & IMMERSE ══════════ */}
          {activeTab === "video" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Video Block</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Video URL
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>YouTube link (youtu.be or youtube.com/watch) or direct MP4 URL</p>
                  <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.videoSrc ? styles.inputError : ""} ${watchAllFields.videoSrc && !errors.videoSrc ? styles.inputSuccess : ""}`}>
                    <span className={styles.inputPrefix}>🎬</span>
                    <input
                      type="text"
                      className={`${styles.input} ${styles.inputPrefixed}`}
                      placeholder="https://youtu.be/... or https://…/video.mp4"
                      {...register("videoSrc", { 
                        required: "Video URL is required",
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Enter a valid URL"
                        }
                      })}
                    />
                  </div>
                  {errors.videoSrc && <p className={styles.errorMsg}>⚠ {errors.videoSrc.message}</p>}
                  {watchAllFields.videoSrc && !errors.videoSrc && (
                    <div className={styles.videoPreviewBadge}>
                      ✓ {watchAllFields.videoSrc.includes("youtu") ? "YouTube link detected" : "Direct video URL detected"}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Immerse Block</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Immerse Title (H3)
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>Heading displayed beside the video</p>
                  <div className={`${styles.inputWrap} ${errors.immerseTitle ? styles.inputError : ""} ${watchAllFields.immerseTitle && !errors.immerseTitle ? styles.inputSuccess : ""}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Immerse Yourself in Yoga in Rishikesh"
                      maxLength={120}
                      {...register("immerseTitle", { 
                        required: "Immerse title is required",
                        maxLength: { value: 120, message: "Maximum 120 characters" }
                      })}
                    />
                    <span className={styles.charCount}>{watchAllFields.immerseTitle?.length || 0}/120</span>
                  </div>
                  {errors.immerseTitle && <p className={styles.errorMsg}>⚠ {errors.immerseTitle.message}</p>}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Paragraph 1
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>About Rishikesh setting</p>
                  <div className={`${styles.inputWrap} ${errors.immersePara1 ? styles.inputError : ""} ${watchAllFields.immersePara1 && !errors.immersePara1 ? styles.inputSuccess : ""}`}>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="Rishikesh, the Yoga Capital of the World, invites you to embark…"
                      maxLength={500}
                      rows={3}
                      {...register("immersePara1", { 
                        required: "Paragraph 1 is required",
                        maxLength: { value: 500, message: "Maximum 500 characters" }
                      })}
                    />
                    <span className={`${styles.charCount} ${styles.charCountBottom}`}>
                      {watchAllFields.immersePara1?.length || 0}/500
                    </span>
                  </div>
                  {errors.immersePara1 && <p className={styles.errorMsg}>⚠ {errors.immersePara1.message}</p>}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Paragraph 2
                  </label>
                  <p className={styles.fieldHint}>Breathwork, asanas, meditation — optional</p>
                  <div className={styles.inputWrap}>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="From mastering breathwork and asanas to exploring meditation…"
                      maxLength={500}
                      rows={3}
                      {...register("immersePara2")}
                    />
                    <span className={`${styles.charCount} ${styles.charCountBottom}`}>
                      {watchAllFields.immersePara2?.length || 0}/500
                    </span>
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>CTA Button Text
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>Text on the Know More button</p>
                    <div className={`${styles.inputWrap} ${errors.immerseCtaText ? styles.inputError : ""} ${watchAllFields.immerseCtaText && !errors.immerseCtaText ? styles.inputSuccess : ""}`}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Know More About AYM"
                        maxLength={60}
                        {...register("immerseCtaText", { 
                          required: "CTA text is required",
                          maxLength: { value: 60, message: "Maximum 60 characters" }
                        })}
                      />
                      <span className={styles.charCount}>{watchAllFields.immerseCtaText?.length || 0}/60</span>
                    </div>
                    {errors.immerseCtaText && <p className={styles.errorMsg}>⚠ {errors.immerseCtaText.message}</p>}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>CTA Button Link
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>URL or path</p>
                    <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.immerseCtaLink ? styles.inputError : ""} ${watchAllFields.immerseCtaLink && !errors.immerseCtaLink ? styles.inputSuccess : ""}`}>
                      <span className={styles.inputPrefix}>🔗</span>
                      <input
                        type="text"
                        className={`${styles.input} ${styles.inputPrefixed}`}
                        placeholder="/about or https://…"
                        {...register("immerseCtaLink", { 
                          required: "CTA link is required",
                          pattern: {
                            value: /^(https?:\/\/.+\..+|\/[^\s]*)$/,
                            message: "Enter a valid URL or path"
                          }
                        })}
                      />
                    </div>
                    {errors.immerseCtaLink && <p className={styles.errorMsg}>⚠ {errors.immerseCtaLink.message}</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 3 — RECOGNITION ══════════ */}
          {activeTab === "recognition" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Recognition &amp; Endorsements</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Recognition Title (H2)
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>Section heading for the recognition block</p>
                <div className={`${styles.inputWrap} ${errors.recognitionTitle ? styles.inputError : ""} ${watchAllFields.recognitionTitle && !errors.recognitionTitle ? styles.inputSuccess : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Recognition & Endorsements"
                    maxLength={120}
                    {...register("recognitionTitle", { 
                      required: "Recognition title is required",
                      maxLength: { value: 120, message: "Maximum 120 characters" }
                    })}
                  />
                  <span className={styles.charCount}>{watchAllFields.recognitionTitle?.length || 0}/120</span>
                </div>
                {errors.recognitionTitle && <p className={styles.errorMsg}>⚠ {errors.recognitionTitle.message}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Paragraph 1
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>YCB & Yoga Alliance + registration info</p>
                <div className={`${styles.inputWrap} ${errors.recognitionPara1 ? styles.inputError : ""} ${watchAllFields.recognitionPara1 && !errors.recognitionPara1 ? styles.inputSuccess : ""}`}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="At AYM Yoga School in Rishikesh, all our programs are accredited by…"
                    maxLength={600}
                    rows={4}
                    {...register("recognitionPara1", { 
                      required: "Paragraph 1 is required",
                      maxLength: { value: 600, message: "Maximum 600 characters" }
                    })}
                  />
                  <span className={`${styles.charCount} ${styles.charCountBottom}`}>
                    {watchAllFields.recognitionPara1?.length || 0}/600
                  </span>
                </div>
                {errors.recognitionPara1 && <p className={styles.errorMsg}>⚠ {errors.recognitionPara1.message}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Paragraph 2
                </label>
                <p className={styles.fieldHint}>Best yoga TTC pitch — optional</p>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="If you're looking for the best Yoga TTC in Rishikesh…"
                    maxLength={600}
                    rows={4}
                    {...register("recognitionPara2")}
                  />
                  <span className={`${styles.charCount} ${styles.charCountBottom}`}>
                    {watchAllFields.recognitionPara2?.length || 0}/600
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 4 — CERTS & BADGES ══════════ */}
          {activeTab === "certs" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Certificate Cards</h3>
                  <span className={styles.sectionBadge}>{certFields.length}/6</span>
                </div>
                <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>Clickable certificate cards shown in the recognition grid (max 6)</p>

                <div className={styles.certsList}>
                  {certFields.map((field, index) => (
                    <div key={field.id} className={styles.certCard}>
                      <div className={styles.certCardHeader}>
                        <span className={styles.certCardNum}>{index + 1}</span>
                        <span className={styles.certCardTitle}>Certificate #{index + 1}</span>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeCertHandler(index)}
                          disabled={certFields.length <= 1}
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className={styles.certCardBody}>
                        <div className={styles.certImageUpload}>
                          <label className={`${styles.uploadArea} ${styles.uploadAreaSm}`}>
                            <input
                              type="file"
                              accept="image/*"
                              className={styles.fileInput}
                              onChange={(e) => handleCertImage(index, e.target.files?.[0] || null)}
                            />
                            {watchAllFields.certs?.[index]?.imagePreview ? (
                              <img 
                                src={watchAllFields.certs[index].imagePreview} 
                                alt="preview" 
                                className={styles.certImgPreview} 
                              />
                            ) : (
                              <>
                                <span className={styles.uploadIcon}>🏅</span>
                                <span className={styles.uploadText}>Upload / Replace Image</span>
                                <span className={styles.uploadSubtext}>JPG, PNG, WEBP</span>
                              </>
                            )}
                          </label>
                        </div>

                        <div className={styles.certFields}>
                          <div className={styles.twoCol}>
                            <div className={styles.fieldGroup}>
                              <label className={styles.label}>
                                <span className={styles.labelIcon}>✦</span>Label
                                <span className={styles.required}>*</span>
                              </label>
                              <p className={styles.fieldHint}>Card footer name</p>
                              <div className={styles.inputWrap}>
                                <input
                                  type="text"
                                  className={styles.input}
                                  placeholder="e.g. Yoga Alliance USA — RYS 500"
                                  maxLength={60}
                                  {...register(`certs.${index}.label`, { 
                                    required: "Label is required",
                                    maxLength: { value: 60, message: "Maximum 60 characters" }
                                  })}
                                />
                              </div>
                            </div>

                            <div className={styles.fieldGroup}>
                              <label className={styles.label}>
                                <span className={styles.labelIcon}>✦</span>Tag
                                <span className={styles.required}>*</span>
                              </label>
                              <p className={styles.fieldHint}>Small chip above label</p>
                              <div className={styles.inputWrap}>
                                <input
                                  type="text"
                                  className={styles.input}
                                  placeholder="e.g. International Recognition"
                                  maxLength={40}
                                  {...register(`certs.${index}.tag`, { 
                                    required: "Tag is required",
                                    maxLength: { value: 40, message: "Maximum 40 characters" }
                                  })}
                                />
                              </div>
                            </div>
                          </div>

                          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.label}>
                              <span className={styles.labelIcon}>✦</span>Alt Text
                            </label>
                            <p className={styles.fieldHint}>Accessibility & SEO description</p>
                            <div className={styles.inputWrap}>
                              <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. Yoga Alliance USA — Certificate of Registration RYS 500"
                                maxLength={150}
                                {...register(`certs.${index}.alt`)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {certFields.length < 6 && (
                  <button type="button" className={styles.addBtn} onClick={addCert}>
                    + Add Certificate Card
                  </button>
                )}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Bottom Badges Row</h3>
                  <span className={styles.sectionBadge}>{badgeFields.length}/6</span>
                </div>
                <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>Accreditation badges shown at the bottom of the recognition section (max 6)</p>

                <div className={styles.badgesList}>
                  {badgeFields.map((field, index) => (
                    <div key={field.id} className={styles.badgeRow}>
                      <div className={styles.badgeIndex}>{index + 1}</div>
                      <div className={styles.badgeFields}>
                        <div className={`${styles.inputWrap} ${styles.badgeIconInput}`}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="🏅"
                            maxLength={4}
                            {...register(`badges.${index}.icon`, { 
                              required: "Icon is required",
                              maxLength: { value: 4, message: "Maximum 4 characters" }
                            })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Yoga Alliance USA — RYS 200 & 300 & 500"
                            maxLength={80}
                            {...register(`badges.${index}.text`, { 
                              required: "Badge text is required",
                              maxLength: { value: 80, message: "Maximum 80 characters" }
                            })}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.removeBadgeBtn}
                        onClick={() => removeBadge(index)}
                        disabled={badgeFields.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {badgeFields.length > 0 && (
                  <div className={styles.badgePreview}>
                    {badgeFields.map((field, i) => (
                      <div key={field.id} className={styles.badgeChip}>
                        <span className={styles.badgeChipIcon}>{watchAllFields.badges?.[i]?.icon}</span>
                        <span>{watchAllFields.badges?.[i]?.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {badgeFields.length < 6 && (
                  <button type="button" className={styles.addBtn} onClick={addBadge}>
                    + Add Badge
                  </button>
                )}
              </div>
            </>
          )}

          <div className={styles.formDivider} />

          {/* Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/accreditationsection" className={styles.cancelBtn}>← Cancel</Link>
            <div className={styles.actionsRight}>
              {activeTab !== "auth" && (
                <button
                  type="button"
                  className={styles.prevBtn}
                  onClick={() => {
                    const order = ["auth", "video", "recognition", "certs"];
                    setActiveTab(order[order.indexOf(activeTab) - 1] as any);
                  }}
                >
                  ← Previous
                </button>
              )}
              
              {activeTab !== "certs" ? (
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={() => {
                    const order = ["auth", "video", "recognition", "certs"];
                    setActiveTab(order[order.indexOf(activeTab) + 1] as any);
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><span className={styles.spinner} /> Updating…</>
                  ) : (
                    <><span>✦</span> Update Section</>
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
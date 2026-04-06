"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/accreditationsection/Accreditationsection.module.css";
import api from "@/lib/api";

/* ─────────────────────── Types ─────────────────────── */
interface CertItem {
  label: string;
  tag: string;
  alt: string;
  imagePreview?: string;
  image?: File | string;
}

interface FormData {
  sectionTitle: string;
  authPara1: string;
  authPara2: string;
  authPara3: string;
  authPara4: string;
  imageCaption: string;
  pullQuote: string;
  videoSrc: string;
  immerseTitle: string;
  immersePara1: string;
  immersePara2: string;
  immerseCtaText: string;
  immerseCtaLink: string;
  recognitionTitle: string;
  recognitionPara1: string;
  recognitionPara2: string;
  courseCerts: CertItem[];
  awardCerts: CertItem[];
  mainImage?: File | string;
  _mainImagePreview?: string;
}

const EMPTY_CERT: CertItem = { label: "", tag: "", alt: "", imagePreview: "" };

const INITIAL: FormData = {
  sectionTitle: "",
  authPara1: "", authPara2: "", authPara3: "", authPara4: "",
  imageCaption: "", pullQuote: "",
  videoSrc: "",
  immerseTitle: "", immersePara1: "", immersePara2: "",
  immerseCtaText: "", immerseCtaLink: "",
  recognitionTitle: "",
  recognitionPara1: "", recognitionPara2: "",
  courseCerts: [{ ...EMPTY_CERT }],
  awardCerts:  [{ ...EMPTY_CERT }],
};

/* ─────────────────────── Main ─────────────────────── */
export default function AddAccreditationSectionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  const [courseCertFiles, setCourseCertFiles] = useState<(File | null)[]>([null]);
  const [awardCertFiles,  setAwardCertFiles]  = useState<(File | null)[]>([null]);

  const [activeTab, setActiveTab] = useState<"auth" | "video" | "recognition" | "certs">("auth");

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<FormData>({
    defaultValues: INITIAL,
    mode: "onChange",
  });

  const watchAllFields = watch();

  /* ─────────────────────── Field Arrays ─────────────────────── */
  const { fields: courseCertFields, append: appendCourseCert, remove: removeCourseCert } = useFieldArray({ control, name: "courseCerts" });
  const { fields: awardCertFields,  append: appendAwardCert,  remove: removeAwardCert  } = useFieldArray({ control, name: "awardCerts" });

  /* ─────────────────────── Image Handlers ─────────────────────── */
  const handleMainImage = (file: File | null) => {
    if (!file) return;
    setMainImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_mainImagePreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCourseCertImage = (index: number, file: File | null) => {
    if (!file) return;
    setCourseCertFiles((prev) => {
      const arr = [...prev];
      arr[index] = file;
      return arr;
    });
    const reader = new FileReader();
    reader.onload = (e) => {
      const current = getValues("courseCerts");
      setValue("courseCerts", current.map((cert, i) =>
        i === index ? { ...cert, imagePreview: e.target?.result as string } : cert
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleAwardCertImage = (index: number, file: File | null) => {
    if (!file) return;
    setAwardCertFiles((prev) => {
      const arr = [...prev];
      arr[index] = file;
      return arr;
    });
    const reader = new FileReader();
    reader.onload = (e) => {
      const current = getValues("awardCerts");
      setValue("awardCerts", current.map((cert, i) =>
        i === index ? { ...cert, imagePreview: e.target?.result as string } : cert
      ));
    };
    reader.readAsDataURL(file);
  };

  const addCourseCert = () => {
    if (courseCertFields.length < 4) {
      appendCourseCert({ ...EMPTY_CERT });
      setCourseCertFiles((prev) => [...prev, null]);
    }
  };

  const removeCourseCertHandler = (index: number) => {
    removeCourseCert(index);
    setCourseCertFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addAwardCert = () => {
    if (awardCertFields.length < 4) {
      appendAwardCert({ ...EMPTY_CERT });
      setAwardCertFiles((prev) => [...prev, null]);
    }
  };

  const removeAwardCertHandler = (index: number) => {
    removeAwardCert(index);
    setAwardCertFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* ─────────────────────── Submit ─────────────────────── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Text fields
      Object.entries(data).forEach(([key, value]) => {
        if (!["courseCerts", "awardCerts", "_mainImagePreview", "mainImage"].includes(key)) {
          formData.append(key, value as string);
        }
      });

      // Certs as JSON (strip imagePreview)
      formData.append(
        "courseCerts",
        JSON.stringify(data.courseCerts.map(({ label, tag, alt }) => ({ label, tag, alt })))
      );
      formData.append(
        "awardCerts",
        JSON.stringify(data.awardCerts.map(({ label, tag, alt }) => ({ label, tag, alt })))
      );

      // Main image
      if (mainImageFile) formData.append("mainImage", mainImageFile);

      // Course cert images
      const courseCertIndexList: number[] = [];
      courseCertFiles.forEach((file, idx) => {
        if (file) {
          formData.append("courseCertImages", file);
          courseCertIndexList.push(idx);
        }
      });
      if (courseCertIndexList.length > 0) {
        formData.append("courseCertImageIndexes", courseCertIndexList.join(","));
      }

      // Award cert images
      const awardCertIndexList: number[] = [];
      awardCertFiles.forEach((file, idx) => {
        if (file) {
          formData.append("awardCertImages", file);
          awardCertIndexList.push(idx);
        }
      });
      if (awardCertIndexList.length > 0) {
        formData.append("awardCertImageIndexes", awardCertIndexList.join(","));
      }

    await api.post("/accreditation", formData);

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/accreditationsection"), 1500);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────── Success Screen ─────────────────────── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Section Saved!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    auth: !!(errors.sectionTitle || errors.authPara1 || errors.authPara2 || errors.authPara3 || errors.authPara4 || errors.pullQuote),
    video: !!(errors.videoSrc || errors.immerseTitle || errors.immersePara1 || errors.immerseCtaText || errors.immerseCtaLink),
    recognition: !!(errors.recognitionTitle || errors.recognitionPara1),
    certs: !!(errors.courseCerts || errors.awardCerts),
  };

  /* ─────────────────────── Reusable Cert Cards Block ─────────────────────── */
  const renderCertCards = (
    type: "course" | "award",
    fields: typeof courseCertFields,
    fieldName: "courseCerts" | "awardCerts",
    onAdd: () => void,
    onRemove: (i: number) => void,
    onImageChange: (i: number, file: File | null) => void,
    heading: string,
    subheading: string,
  ) => (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>{heading}</h3>
        <span className={styles.sectionBadge}>{fields.length}/4</span>
      </div>
      <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>{subheading}</p>

      <div className={styles.certsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.certCard}>
            <div className={styles.certCardHeader}>
              <span className={styles.certCardNum}>{index + 1}</span>
              <span className={styles.certCardTitle}>
                {type === "course" ? "Course Certificate" : "Award"} #{index + 1}
              </span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(index)}
                disabled={fields.length <= 1}
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
                    onChange={(e) => onImageChange(index, e.target.files?.[0] || null)}
                  />
                  {watchAllFields[fieldName]?.[index]?.imagePreview ? (
                    <img
                      src={watchAllFields[fieldName][index].imagePreview}
                      alt="preview"
                      className={styles.certImgPreview}
                    />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🏅</span>
                      <span className={styles.uploadText}>Upload Image</span>
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
                        {...register(`${fieldName}.${index}.label`, {
                          required: "Label is required",
                          maxLength: { value: 60, message: "Maximum 60 characters" },
                        })}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>Tag
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>Small tag chip above label</p>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. International Recognition"
                        maxLength={40}
                        {...register(`${fieldName}.${index}.tag`, {
                          required: "Tag is required",
                          maxLength: { value: 40, message: "Maximum 40 characters" },
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>Alt Text</label>
                  <p className={styles.fieldHint}>Accessibility description for screen readers & SEO</p>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yoga Alliance USA — Certificate of Registration RYS 500"
                      maxLength={150}
                      {...register(`${fieldName}.${index}.alt`)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fields.length < 4 && (
        <button type="button" className={styles.addBtn} onClick={onAdd}>
          + Add {type === "course" ? "Course Certificate" : "Award"}
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard/accreditationsection")}>Accreditation</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Section</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add Accreditation Section</h1>
        <p className={styles.pageSubtitle}>Fill in all the details to configure the Accreditation &amp; Recognition section</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {(["auth", "video", "recognition", "certs"] as const).map((tab) => {
          const labels = {
            auth: "① Auth Section",
            video: "② Video & Immerse",
            recognition: "③ Recognition",
            certs: "④ Certs & Awards",
          };
          return (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${tabErrors[tab] ? styles.tabBtnError : ""}`}
              onClick={() => setActiveTab(tab)}
            >
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
                        maxLength: { value: 200, message: "Maximum 200 characters" },
                      })}
                    />
                    <span className={`${styles.charCount} ${styles.charCountBottom}`}>{watchAllFields.sectionTitle?.length || 0}/200</span>
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

                {([
                  { name: "authPara1" as const, label: "Paragraph 1", hint: "Accreditation overview — Yoga Alliance USA & YCB", ph: "Our Yoga Teacher Training in Rishikesh is accredited by Yoga Alliance USA…" },
                  { name: "authPara2" as const, label: "Paragraph 2", hint: "Curriculum structure — beginner to advanced", ph: "Our yoga school in Rishikesh offers a well-structured and updated curriculum…" },
                  { name: "authPara3" as const, label: "Paragraph 3", hint: "Specialized programs (Kundalini, Prenatal, Hatha)", ph: "Our training is deeply rooted in traditional yoga practices…" },
                  { name: "authPara4" as const, label: "Paragraph 4", hint: "Online training & closing note", ph: "In addition to our immersive teacher training courses, we provide online…" },
                ]).map(({ name, label, hint, ph }) => (
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
                          maxLength: { value: 600, message: "Maximum 600 characters" },
                        })}
                      />
                      <span className={`${styles.charCount} ${styles.charCountBottom}`}>{watchAllFields[name]?.length || 0}/600</span>
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
                  <p className={styles.fieldHint}>Upload curriculum/study materials image (recommended 420×300px)</p>
                  <label className={styles.uploadArea}>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleMainImage(e.target.files?.[0] || null)} />
                    {watchAllFields._mainImagePreview ? (
                      <img src={watchAllFields._mainImagePreview} alt="preview" style={{ maxWidth: "100%", maxHeight: "200px" }} />
                    ) : (
                      <>
                        <span className={styles.uploadIcon}>📷</span>
                        <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                        <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                      </>
                    )}
                  </label>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>Image Caption</label>
                  <p className={styles.fieldHint}>Small caption displayed below the image</p>
                  <div className={styles.inputWrap}>
                    <input type="text" className={styles.input} placeholder="e.g. AYM Study Materials & Curriculum" maxLength={80} {...register("imageCaption")} />
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
                        maxLength: { value: 120, message: "Maximum 120 characters" },
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
                      placeholder="https://youtu.be/A-Zcjg1_y5U or https://…/video.mp4"
                      {...register("videoSrc", {
                        required: "Video URL is required",
                        pattern: { value: /^https?:\/\/.+/, message: "Enter a valid URL" },
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
                        maxLength: { value: 120, message: "Maximum 120 characters" },
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
                  <p className={styles.fieldHint}>About Rishikesh — yoga capital setting</p>
                  <div className={`${styles.inputWrap} ${errors.immersePara1 ? styles.inputError : ""} ${watchAllFields.immersePara1 && !errors.immersePara1 ? styles.inputSuccess : ""}`}>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="Rishikesh, the Yoga Capital of the World, invites you to embark…"
                      maxLength={500}
                      rows={3}
                      {...register("immersePara1", {
                        required: "Paragraph 1 is required",
                        maxLength: { value: 500, message: "Maximum 500 characters" },
                      })}
                    />
                    <span className={`${styles.charCount} ${styles.charCountBottom}`}>{watchAllFields.immersePara1?.length || 0}/500</span>
                  </div>
                  {errors.immersePara1 && <p className={styles.errorMsg}>⚠ {errors.immersePara1.message}</p>}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>Paragraph 2</label>
                  <p className={styles.fieldHint}>Breathwork, asanas, meditation — optional closing note</p>
                  <div className={styles.inputWrap}>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="From mastering breathwork and asanas to exploring meditation…"
                      maxLength={500}
                      rows={3}
                      {...register("immersePara2", { maxLength: { value: 500, message: "Maximum 500 characters" } })}
                    />
                    <span className={`${styles.charCount} ${styles.charCountBottom}`}>{watchAllFields.immersePara2?.length || 0}/500</span>
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
                          maxLength: { value: 60, message: "Maximum 60 characters" },
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
                          pattern: { value: /^(https?:\/\/.+\..+|\/[^\s]*)$/, message: "Enter a valid URL or path" },
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
                      maxLength: { value: 120, message: "Maximum 120 characters" },
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
                <p className={styles.fieldHint}>YCB & Yoga Alliance accreditation + Yoga Alliance registration info</p>
                <div className={`${styles.inputWrap} ${errors.recognitionPara1 ? styles.inputError : ""} ${watchAllFields.recognitionPara1 && !errors.recognitionPara1 ? styles.inputSuccess : ""}`}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="At AYM Yoga School in Rishikesh, all our programs are accredited by…"
                    maxLength={600}
                    rows={4}
                    {...register("recognitionPara1", {
                      required: "Paragraph 1 is required",
                      maxLength: { value: 600, message: "Maximum 600 characters" },
                    })}
                  />
                  <span className={`${styles.charCount} ${styles.charCountBottom}`}>{watchAllFields.recognitionPara1?.length || 0}/600</span>
                </div>
                {errors.recognitionPara1 && <p className={styles.errorMsg}>⚠ {errors.recognitionPara1.message}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}><span className={styles.labelIcon}>✦</span>Paragraph 2</label>
                <p className={styles.fieldHint}>Best yoga TTC pitch — optional closing paragraph</p>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="If you're looking for the best Yoga TTC in Rishikesh…"
                    maxLength={600}
                    rows={4}
                    {...register("recognitionPara2", { maxLength: { value: 600, message: "Maximum 600 characters" } })}
                  />
                  <span className={`${styles.charCount} ${styles.charCountBottom}`}>{watchAllFields.recognitionPara2?.length || 0}/600</span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 4 — CERTS & AWARDS ══════════ */}
          {activeTab === "certs" && (
            <>
              {renderCertCards(
                "course",
                courseCertFields,
                "courseCerts",
                addCourseCert,
                removeCourseCertHandler,
                handleCourseCertImage,
                "Course Certificates",
                "Clickable course certificate cards shown in the recognition grid (max 4)",
              )}

              <div className={styles.formDivider} />

              {renderCertCards(
                "award",
                awardCertFields,
                "awardCerts",
                addAwardCert,
                removeAwardCertHandler,
                handleAwardCertImage,
                "Awards",
                "Clickable award cards shown in the recognition grid (max 4)",
              )}
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
                    <><span className={styles.spinner} /> Saving…</>
                  ) : (
                    <><span>✦</span> Save Section</>
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
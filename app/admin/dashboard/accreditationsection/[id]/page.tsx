"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "@/assets/style/Admin/dashboard/accreditationsection/Accreditationsection.module.css";
import api from "@/lib/api";

/* ─────────────────────── Helpers ─────────────────────── */
const getImageUrl = (path: string) => {
  if (!path) return "";
  return `${process.env.NEXT_PUBLIC_API_URL}/${path.replace(/\\/g, "/")}`;
};

/* ─────────────────────── Types ─────────────────────── */
interface AyushCourse {
  icon: string;
  level: string;
  name: string;
}

interface CertItem {
  label: string;
  tag: string;
  alt: string;
  image?: string;
  imagePreview?: string;
  // Award-specific fields
  descPara1?: string;
  descPara2?: string;
  metaPoint1?: string;
  metaPoint2?: string;
  metaPoint3?: string;
  metaPoint4?: string;
  pullQuote?: string;
  ayushSubtitle?: string;
  ayushCourses?: AyushCourse[];
  ayushFooter?: string;
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
  mainImage?: string;
  _mainImagePreview?: string;
}

const EMPTY_CERT: CertItem = { label: "", tag: "", alt: "", imagePreview: "" };

const EMPTY_AWARD_CERT: CertItem = {
  label: "",
  tag: "",
  alt: "",
  imagePreview: "",
  descPara1:
    "AYM Yoga School is proudly recognized and accredited by the Ministry of AYUSH, Government of India — a mark of authentic, quality yoga education that meets the highest national standards.",
  descPara2:
    "This prestigious recognition affirms our commitment to preserving the ancient wisdom of yoga while delivering structured, government-certified training programs to students worldwide.",
  metaPoint1: "Accredited by the Ministry of AYUSH, Govt. of India",
  metaPoint2: "Courses aligned with National Curriculum Framework for Yoga",
  metaPoint3: "Certifications recognized across India & internationally",
  metaPoint4: "Over 5,000+ certified yoga professionals trained",
  pullQuote:
    "A government-recognized institution dedicated to the authentic science of yoga and holistic wellness.",
  ayushSubtitle: "6 Government-Recognized Yoga Programs",
  ayushCourses: [
    { icon: "🧘", level: "Level 01", name: "Yoga Protocol Instructor" },
    { icon: "🌿", level: "Level 02", name: "Yoga Wellness Instructor" },
    { icon: "📋", level: "Level 03", name: "Yoga Teacher & Evaluator" },
    { icon: "🏅", level: "Level 04", name: "Yoga Master" },
    { icon: "🌸", level: "Level 05", name: "Assistant Yoga Therapist" },
    { icon: "⚕️", level: "Level 06", name: "Yoga Therapist" },
  ],
  ayushFooter:
    "All certifications are nationally recognized under the Ministry of AYUSH framework & accepted globally.",
};

/* ─────────────────────── Main ─────────────────────── */
export default function EditAccreditationSectionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "auth" | "video" | "recognition" | "certs"
  >("auth");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  const [courseCertFiles, setCourseCertFiles] = useState<(File | null)[]>([]);
  const [awardCertFiles, setAwardCertFiles] = useState<(File | null)[]>([]);

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
      authPara1: "",
      authPara2: "",
      authPara3: "",
      authPara4: "",
      imageCaption: "",
      pullQuote: "",
      videoSrc: "",
      immerseTitle: "",
      immersePara1: "",
      immersePara2: "",
      immerseCtaText: "",
      immerseCtaLink: "",
      recognitionTitle: "",
      recognitionPara1: "",
      recognitionPara2: "",
      courseCerts: [{ ...EMPTY_CERT }],
      awardCerts: [{ ...EMPTY_AWARD_CERT }],
    },
    mode: "onChange",
  });

  const watchAllFields = watch();

  /* ─────────────────────── Field Arrays ─────────────────────── */
  const {
    fields: courseCertFields,
    append: appendCourseCert,
    remove: removeCourseCert,
  } = useFieldArray({ control, name: "courseCerts" });
  const {
    fields: awardCertFields,
    append: appendAwardCert,
    remove: removeAwardCert,
  } = useFieldArray({ control, name: "awardCerts" });

  /* ─────────────────────── Fetch ─────────────────────── */
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/accreditation/${id}`);
        const d = res.data.data;

        const mapCourseCerts = (arr: CertItem[]) =>
          (arr || []).map((cert) => ({
            ...cert,
            imagePreview: cert.image ? getImageUrl(cert.image) : "",
          }));

        // For award certs, also merge default AYUSH structure if missing
        const mapAwardCerts = (arr: CertItem[]) =>
          (arr || []).map((cert) => ({
            ...EMPTY_AWARD_CERT,
            ...cert,
            imagePreview: cert.image ? getImageUrl(cert.image) : "",
            ayushCourses:
              cert.ayushCourses && cert.ayushCourses.length === 6
                ? cert.ayushCourses
                : EMPTY_AWARD_CERT.ayushCourses,
          }));

        const courseCertsWithPreview = mapCourseCerts(d.courseCerts);
        const awardCertsWithPreview = mapAwardCerts(d.awardCerts);

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
          courseCerts: courseCertsWithPreview.length
            ? courseCertsWithPreview
            : [{ ...EMPTY_CERT }],
          awardCerts: awardCertsWithPreview.length
            ? awardCertsWithPreview
            : [{ ...EMPTY_AWARD_CERT }],
          mainImage: d.mainImage,
        });

        setCourseCertFiles(
          new Array(courseCertsWithPreview.length || 1).fill(null)
        );
        setAwardCertFiles(
          new Array(awardCertsWithPreview.length || 1).fill(null)
        );

        if (d.mainImage) setValue("_mainImagePreview", getImageUrl(d.mainImage));
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset, setValue]);

  /* ─────────────────────── Image Handlers ─────────────────────── */
  const handleMainImage = (file: File | null) => {
    if (!file) return;
    setMainImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) =>
      setValue("_mainImagePreview", e.target?.result as string);
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
      setValue(
        "courseCerts",
        current.map((cert, i) =>
          i === index
            ? { ...cert, imagePreview: e.target?.result as string }
            : cert
        )
      );
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
      setValue(
        "awardCerts",
        current.map((cert, i) =>
          i === index
            ? { ...cert, imagePreview: e.target?.result as string }
            : cert
        )
      );
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
      appendAwardCert({ ...EMPTY_AWARD_CERT });
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
      const textFields: (keyof FormData)[] = [
        "sectionTitle",
        "authPara1",
        "authPara2",
        "authPara3",
        "authPara4",
        "imageCaption",
        "pullQuote",
        "videoSrc",
        "immerseTitle",
        "immersePara1",
        "immersePara2",
        "immerseCtaText",
        "immerseCtaLink",
        "recognitionTitle",
        "recognitionPara1",
        "recognitionPara2",
      ];
      textFields.forEach((field) => {
        const val = data[field];
        if (val !== undefined && val !== null)
          formData.append(field, String(val));
      });

      // Course certs — keep existing image path, strip imagePreview
      const mapCourseCertsForSave = (arr: CertItem[]) =>
        arr.map(({ label, tag, alt, image }) => ({
          label,
          tag,
          alt: alt || "",
          image: image || "",
        }));

      // Award certs — include all award-specific fields, strip imagePreview
      const mapAwardCertsForSave = (arr: CertItem[]) =>
        arr.map(
          ({
            label,
            tag,
            alt,
            image,
            descPara1,
            descPara2,
            metaPoint1,
            metaPoint2,
            metaPoint3,
            metaPoint4,
            pullQuote,
            ayushSubtitle,
            ayushCourses,
            ayushFooter,
          }) => ({
            label,
            tag,
            alt: alt || "",
            image: image || "",
            descPara1,
            descPara2,
            metaPoint1,
            metaPoint2,
            metaPoint3,
            metaPoint4,
            pullQuote,
            ayushSubtitle,
            ayushCourses,
            ayushFooter,
          })
        );

      formData.append(
        "courseCerts",
        JSON.stringify(mapCourseCertsForSave(data.courseCerts))
      );
      formData.append(
        "awardCerts",
        JSON.stringify(mapAwardCertsForSave(data.awardCerts))
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
        formData.append(
          "courseCertImageIndexes",
          courseCertIndexList.join(",")
        );
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
        formData.append(
          "awardCertImageIndexes",
          awardCertIndexList.join(",")
        );
      }

      await api.put(`/accreditation/${id}`, formData);
      setSubmitted(true);
      setTimeout(
        () => router.push("/admin/dashboard/accreditationsection"),
        1500
      );
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message || error?.message || "Failed to update"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────── Loading / Success ─────────────────────── */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <button
            className={styles.breadcrumbLink}
            onClick={() =>
              router.push("/admin/dashboard/accreditationsection")
            }
          >
            Accreditation
          </button>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Edit Section</span>
        </div>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Accreditation Section</h1>
          <p className={styles.pageSubtitle}>Loading…</p>
        </div>
        <div className={styles.formCard}>
          {[60, 100, 100, 100].map((h, i) => (
            <div
              key={i}
              className={styles.skeletonField}
              style={{ height: `${h}px`, marginBottom: "20px" }}
            />
          ))}
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
    auth: !!(
      errors.sectionTitle ||
      errors.authPara1 ||
      errors.authPara2 ||
      errors.authPara3 ||
      errors.authPara4 ||
      errors.pullQuote
    ),
    video: !!(
      errors.videoSrc ||
      errors.immerseTitle ||
      errors.immersePara1 ||
      errors.immerseCtaText ||
      errors.immerseCtaLink
    ),
    recognition: !!(errors.recognitionTitle || errors.recognitionPara1),
    certs: !!(errors.courseCerts || errors.awardCerts),
  };

  /* ─────────────────────── Course Cert Cards ─────────────────────── */
  const renderCourseCertCards = () => (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>Course Certificates</h3>
        <span className={styles.sectionBadge}>
          {courseCertFields.length}/4
        </span>
      </div>
      <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
        Clickable course certificate cards shown in the recognition grid (max 4)
      </p>

      <div className={styles.certsList}>
        {courseCertFields.map((field, index) => (
          <div key={field.id} className={styles.certCard}>
            <div className={styles.certCardHeader}>
              <span className={styles.certCardNum}>{index + 1}</span>
              <span className={styles.certCardTitle}>
                Course Certificate #{index + 1}
              </span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeCourseCertHandler(index)}
                disabled={courseCertFields.length <= 1}
              >
                ✕ Remove
              </button>
            </div>

            <div className={styles.certCardBody}>
              <div className={styles.certImageUpload}>
                <label
                  className={`${styles.uploadArea} ${styles.uploadAreaSm}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) =>
                      handleCourseCertImage(index, e.target.files?.[0] || null)
                    }
                  />
                  {watchAllFields.courseCerts?.[index]?.imagePreview ? (
                    <img
                      src={watchAllFields.courseCerts[index].imagePreview}
                      alt="preview"
                      className={styles.certImgPreview}
                    />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🏅</span>
                      <span className={styles.uploadText}>
                        Upload / Replace Image
                      </span>
                      <span className={styles.uploadSubtext}>
                        JPG, PNG, WEBP
                      </span>
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
                        {...register(`courseCerts.${index}.label`, {
                          required: "Label is required",
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
                        {...register(`courseCerts.${index}.tag`, {
                          required: "Tag is required",
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
                      {...register(`courseCerts.${index}.alt`)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courseCertFields.length < 4 && (
        <button
          type="button"
          className={styles.addBtn}
          onClick={addCourseCert}
        >
          + Add Course Certificate
        </button>
      )}
    </div>
  );

  /* ─────────────────────── Award Cert Cards (with all static fields) ─────────────────────── */
  const renderAwardCertCards = () => (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>Awards</h3>
        <span className={styles.sectionBadge}>{awardCertFields.length}/4</span>
      </div>
      <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
        Award cards with full description, AYUSH courses grid and meta points
        (max 4)
      </p>

      <div className={styles.certsList}>
        {awardCertFields.map((field, index) => (
          <div key={field.id} className={styles.certCard}>
            <div className={styles.certCardHeader}>
              <span className={styles.certCardNum}>{index + 1}</span>
              <span className={styles.certCardTitle}>Award #{index + 1}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeAwardCertHandler(index)}
                disabled={awardCertFields.length <= 1}
              >
                ✕ Remove
              </button>
            </div>

            {/* Image + Label/Tag/Alt */}
            <div className={styles.certCardBody}>
              <div className={styles.certImageUpload}>
                <label
                  className={`${styles.uploadArea} ${styles.uploadAreaSm}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) =>
                      handleAwardCertImage(index, e.target.files?.[0] || null)
                    }
                  />
                  {watchAllFields.awardCerts?.[index]?.imagePreview ? (
                    <img
                      src={watchAllFields.awardCerts[index].imagePreview}
                      alt="preview"
                      className={styles.certImgPreview}
                    />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🏅</span>
                      <span className={styles.uploadText}>
                        Upload / Replace Image
                      </span>
                      <span className={styles.uploadSubtext}>
                        JPG, PNG, WEBP
                      </span>
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
                        placeholder="e.g. Ministry of AYUSH"
                        maxLength={60}
                        {...register(`awardCerts.${index}.label`, {
                          required: "Label is required",
                        })}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>Tag
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>
                      Badge chip (e.g. Govt. Accredited)
                    </p>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Govt. Accredited"
                        maxLength={40}
                        {...register(`awardCerts.${index}.tag`, {
                          required: "Tag is required",
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Alt Text
                  </label>
                  <p className={styles.fieldHint}>
                    Accessibility & SEO description
                  </p>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Ministry of AYUSH Government Recognition Certificate"
                      maxLength={150}
                      {...register(`awardCerts.${index}.alt`)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── DESCRIPTION BLOCK ── */}
            <div className={styles.awardExtraBlock}>
              <div className={styles.awardExtraHeader}>
                <span className={styles.awardExtraIcon}>📝</span>
                <h4 className={styles.awardExtraTitle}>
                  Description (Middle Column)
                </h4>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Description
                  Paragraph 1
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  Main recognition description shown beside the award image
                </p>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="AYM Yoga School is proudly recognized and accredited by the Ministry of AYUSH…"
                    maxLength={400}
                    rows={3}
                    {...register(`awardCerts.${index}.descPara1`, {
                      required: "Description paragraph 1 is required",
                      maxLength: {
                        value: 400,
                        message: "Maximum 400 characters",
                      },
                    })}
                  />
                  <span
                    className={`${styles.charCount} ${styles.charCountBottom}`}
                  >
                    {watchAllFields.awardCerts?.[index]?.descPara1?.length ||
                      0}
                    /400
                  </span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Description
                  Paragraph 2
                </label>
                <p className={styles.fieldHint}>
                  Supporting paragraph about commitment and certification
                </p>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="This prestigious recognition affirms our commitment…"
                    maxLength={400}
                    rows={3}
                    {...register(`awardCerts.${index}.descPara2`, {
                      maxLength: {
                        value: 400,
                        message: "Maximum 400 characters",
                      },
                    })}
                  />
                  <span
                    className={`${styles.charCount} ${styles.charCountBottom}`}
                  >
                    {watchAllFields.awardCerts?.[index]?.descPara2?.length ||
                      0}
                    /400
                  </span>
                </div>
              </div>

              {/* ── META POINTS ── */}
              <div
                className={styles.awardExtraHeader}
                style={{ marginTop: "1.2rem" }}
              >
                <span className={styles.awardExtraIcon}>✅</span>
                <h4 className={styles.awardExtraTitle}>
                  Meta Points (Bullet List)
                </h4>
              </div>
              <p
                className={styles.fieldHint}
                style={{ marginBottom: "0.8rem" }}
              >
                4 bullet points shown as key highlights below the description
              </p>

              {(
                [
                  "metaPoint1",
                  "metaPoint2",
                  "metaPoint3",
                  "metaPoint4",
                ] as const
              ).map((pointKey, pi) => (
                <div className={styles.fieldGroup} key={pointKey}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Point {pi + 1}
                    <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder={
                        [
                          "e.g. Accredited by the Ministry of AYUSH, Govt. of India",
                          "e.g. Courses aligned with National Curriculum Framework for Yoga",
                          "e.g. Certifications recognized across India & internationally",
                          "e.g. Over 5,000+ certified yoga professionals trained",
                        ][pi]
                      }
                      maxLength={120}
                      {...register(`awardCerts.${index}.${pointKey}`, {
                        required: `Meta point ${pi + 1} is required`,
                        maxLength: {
                          value: 120,
                          message: "Maximum 120 characters",
                        },
                      })}
                    />
                    <span className={styles.charCount}>
                      {watchAllFields.awardCerts?.[index]?.[pointKey]
                        ?.length || 0}
                      /120
                    </span>
                  </div>
                </div>
              ))}

              {/* ── PULL QUOTE ── */}
              <div className={styles.fieldGroup} style={{ marginTop: "0.5rem" }}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Pull Quote
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  Italic styled quote at the bottom of the description column
                </p>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder='"A government-recognized institution dedicated to the authentic science of yoga…"'
                    maxLength={200}
                    {...register(`awardCerts.${index}.pullQuote`, {
                      required: "Pull quote is required",
                      maxLength: {
                        value: 200,
                        message: "Maximum 200 characters",
                      },
                    })}
                  />
                  <span className={styles.charCount}>
                    {watchAllFields.awardCerts?.[index]?.pullQuote?.length ||
                      0}
                    /200
                  </span>
                </div>
              </div>
            </div>

            {/* ── AYUSH COURSES BLOCK ── */}
            <div className={styles.awardExtraBlock}>
              <div className={styles.awardExtraHeader}>
                <span className={styles.awardExtraIcon}>🏛️</span>
                <h4 className={styles.awardExtraTitle}>
                  AYUSH Courses (Right Column)
                </h4>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>AYUSH Section
                  Subtitle
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  Subtitle shown below "AYUSH Certified Courses" header
                </p>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. 6 Government-Recognized Yoga Programs"
                    maxLength={80}
                    {...register(`awardCerts.${index}.ayushSubtitle`, {
                      required: "AYUSH subtitle is required",
                      maxLength: {
                        value: 80,
                        message: "Maximum 80 characters",
                      },
                    })}
                  />
                  <span className={styles.charCount}>
                    {watchAllFields.awardCerts?.[index]?.ayushSubtitle
                      ?.length || 0}
                    /80
                  </span>
                </div>
              </div>

              {/* 6 AYUSH Courses */}
              <p
                className={styles.fieldHint}
                style={{ marginBottom: "0.8rem" }}
              >
                6 AYUSH course boxes — each has an icon (emoji), level label,
                and course name
              </p>

              <div className={styles.ayushCoursesGrid}>
                {[0, 1, 2, 3, 4, 5].map((courseIndex) => (
                  <div
                    key={courseIndex}
                    className={styles.ayushCourseInputCard}
                  >
                    <div className={styles.ayushCourseInputNum}>
                      Course {courseIndex + 1}
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>
                        <span className={styles.labelIcon}>✦</span>Icon (emoji)
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="🧘"
                          maxLength={4}
                          {...register(
                            `awardCerts.${index}.ayushCourses.${courseIndex}.icon`
                          )}
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>
                        <span className={styles.labelIcon}>✦</span>Level
                        <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="e.g. Level 01"
                          maxLength={20}
                          {...register(
                            `awardCerts.${index}.ayushCourses.${courseIndex}.level`,
                            { required: "Level is required" }
                          )}
                        />
                      </div>
                    </div>

                    <div
                      className={styles.fieldGroup}
                      style={{ marginBottom: 0 }}
                    >
                      <label className={styles.label}>
                        <span className={styles.labelIcon}>✦</span>Course Name
                        <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="e.g. Yoga Protocol Instructor"
                          maxLength={60}
                          {...register(
                            `awardCerts.${index}.ayushCourses.${courseIndex}.name`,
                            { required: "Course name is required" }
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AYUSH Footer */}
              <div
                className={styles.fieldGroup}
                style={{ marginTop: "1.2rem" }}
              >
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>AYUSH Footer Text
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  Text at the bottom of the AYUSH courses column (global
                  recognition note)
                </p>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="e.g. All certifications are nationally recognized under the Ministry of AYUSH framework & accepted globally."
                    maxLength={200}
                    rows={2}
                    {...register(`awardCerts.${index}.ayushFooter`, {
                      required: "AYUSH footer text is required",
                      maxLength: {
                        value: 200,
                        message: "Maximum 200 characters",
                      },
                    })}
                  />
                  <span
                    className={`${styles.charCount} ${styles.charCountBottom}`}
                  >
                    {watchAllFields.awardCerts?.[index]?.ayushFooter?.length ||
                      0}
                    /200
                  </span>
                </div>
              </div>
            </div>
            {/* END AYUSH BLOCK */}
          </div>
        ))}
      </div>

      {awardCertFields.length < 4 && (
        <button type="button" className={styles.addBtn} onClick={addAwardCert}>
          + Add Award
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbLink}
          onClick={() =>
            router.push("/admin/dashboard/accreditationsection")
          }
        >
          Accreditation
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Section</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Accreditation Section</h1>
        <p className={styles.pageSubtitle}>
          Update the details of the Accreditation &amp; Recognition section
        </p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* Tab Nav */}
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
                    <span className={styles.labelIcon}>✦</span>Section Title
                    (H2)
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>
                    Main heading shown at the top of the auth section
                  </p>
                  <div
                    className={`${styles.inputWrap} ${errors.sectionTitle ? styles.inputError : ""} ${watchAllFields.sectionTitle && !errors.sectionTitle ? styles.inputSuccess : ""}`}
                  >
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      maxLength={200}
                      rows={2}
                      placeholder="e.g. Authentic, Internationally recognized Yoga Teacher Training Certification School in Rishikesh"
                      {...register("sectionTitle", {
                        required: "Section title is required",
                        maxLength: {
                          value: 200,
                          message: "Maximum 200 characters",
                        },
                      })}
                    />
                    <span
                      className={`${styles.charCount} ${styles.charCountBottom}`}
                    >
                      {watchAllFields.sectionTitle?.length || 0}/200
                    </span>
                  </div>
                  {errors.sectionTitle && (
                    <p className={styles.errorMsg}>
                      ⚠ {errors.sectionTitle.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>
                    Left Column — Body Paragraphs
                  </h3>
                </div>

                {(
                  [
                    {
                      name: "authPara1" as const,
                      label: "Paragraph 1",
                      hint: "Accreditation overview — Yoga Alliance USA & YCB",
                      ph: "Our Yoga Teacher Training in Rishikesh is accredited by Yoga Alliance USA…",
                    },
                    {
                      name: "authPara2" as const,
                      label: "Paragraph 2",
                      hint: "Curriculum structure — beginner to advanced",
                      ph: "Our yoga school in Rishikesh offers a well-structured and updated curriculum…",
                    },
                    {
                      name: "authPara3" as const,
                      label: "Paragraph 3",
                      hint: "Specialized programs (Kundalini, Prenatal, Hatha)",
                      ph: "Our training is deeply rooted in traditional yoga practices…",
                    },
                    {
                      name: "authPara4" as const,
                      label: "Paragraph 4",
                      hint: "Online training & closing note",
                      ph: "In addition to our immersive teacher training courses, we provide online…",
                    },
                  ] as const
                ).map(({ name, label, hint, ph }) => (
                  <div key={name} className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      {label}
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>{hint}</p>
                    <div
                      className={`${styles.inputWrap} ${errors[name] ? styles.inputError : ""} ${watchAllFields[name] && !errors[name] ? styles.inputSuccess : ""}`}
                    >
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder={ph}
                        maxLength={600}
                        rows={3}
                        {...register(name, {
                          required: `${label} is required`,
                          maxLength: {
                            value: 600,
                            message: "Maximum 600 characters",
                          },
                        })}
                      />
                      <span
                        className={`${styles.charCount} ${styles.charCountBottom}`}
                      >
                        {watchAllFields[name]?.length || 0}/600
                      </span>
                    </div>
                    {errors[name] && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors[name].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>
                    Right Column — Image &amp; Quote
                  </h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Main Section
                    Image
                  </label>
                  <p className={styles.fieldHint}>
                    Upload new image to replace existing (leave empty to keep
                    current)
                  </p>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) =>
                        handleMainImage(e.target.files?.[0] || null)
                      }
                    />
                    {watchAllFields._mainImagePreview ? (
                      <img
                        src={watchAllFields._mainImagePreview}
                        alt="preview"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    ) : (
                      <>
                        <span className={styles.uploadIcon}>📷</span>
                        <span className={styles.uploadText}>
                          Click to upload new image
                        </span>
                        <span className={styles.uploadSubtext}>
                          Leave empty to keep existing — JPG, PNG, WEBP
                        </span>
                      </>
                    )}
                  </label>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Image Caption
                  </label>
                  <p className={styles.fieldHint}>
                    Small caption displayed below the image
                  </p>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. AYM Study Materials & Curriculum"
                      maxLength={80}
                      {...register("imageCaption")}
                    />
                    <span className={styles.charCount}>
                      {watchAllFields.imageCaption?.length || 0}/80
                    </span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Pull Quote
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>
                    Short quote shown in the styled blockquote with " " marks
                  </p>
                  <div
                    className={`${styles.inputWrap} ${errors.pullQuote ? styles.inputError : ""} ${watchAllFields.pullQuote && !errors.pullQuote ? styles.inputSuccess : ""}`}
                  >
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Learn, grow, and transform."
                      maxLength={120}
                      {...register("pullQuote", {
                        required: "Pull quote is required",
                        maxLength: {
                          value: 120,
                          message: "Maximum 120 characters",
                        },
                      })}
                    />
                    <span className={styles.charCount}>
                      {watchAllFields.pullQuote?.length || 0}/120
                    </span>
                  </div>
                  {errors.pullQuote && (
                    <p className={styles.errorMsg}>
                      ⚠ {errors.pullQuote.message}
                    </p>
                  )}
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
                  <p className={styles.fieldHint}>
                    YouTube link (youtu.be or youtube.com/watch) or direct MP4
                    URL
                  </p>
                  <div
                    className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.videoSrc ? styles.inputError : ""} ${watchAllFields.videoSrc && !errors.videoSrc ? styles.inputSuccess : ""}`}
                  >
                    <span className={styles.inputPrefix}>🎬</span>
                    <input
                      type="text"
                      className={`${styles.input} ${styles.inputPrefixed}`}
                      placeholder="https://youtu.be/... or https://…/video.mp4"
                      {...register("videoSrc", {
                        required: "Video URL is required",
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Enter a valid URL",
                        },
                      })}
                    />
                  </div>
                  {errors.videoSrc && (
                    <p className={styles.errorMsg}>
                      ⚠ {errors.videoSrc.message}
                    </p>
                  )}
                  {watchAllFields.videoSrc && !errors.videoSrc && (
                    <div className={styles.videoPreviewBadge}>
                      ✓{" "}
                      {watchAllFields.videoSrc.includes("youtu")
                        ? "YouTube link detected"
                        : "Direct video URL detected"}
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
                    <span className={styles.labelIcon}>✦</span>Immerse Title
                    (H3)
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>
                    Heading displayed beside the video
                  </p>
                  <div
                    className={`${styles.inputWrap} ${errors.immerseTitle ? styles.inputError : ""} ${watchAllFields.immerseTitle && !errors.immerseTitle ? styles.inputSuccess : ""}`}
                  >
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Immerse Yourself in Yoga in Rishikesh"
                      maxLength={120}
                      {...register("immerseTitle", {
                        required: "Immerse title is required",
                        maxLength: {
                          value: 120,
                          message: "Maximum 120 characters",
                        },
                      })}
                    />
                    <span className={styles.charCount}>
                      {watchAllFields.immerseTitle?.length || 0}/120
                    </span>
                  </div>
                  {errors.immerseTitle && (
                    <p className={styles.errorMsg}>
                      ⚠ {errors.immerseTitle.message}
                    </p>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Paragraph 1
                    <span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>About Rishikesh setting</p>
                  <div
                    className={`${styles.inputWrap} ${errors.immersePara1 ? styles.inputError : ""} ${watchAllFields.immersePara1 && !errors.immersePara1 ? styles.inputSuccess : ""}`}
                  >
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      maxLength={500}
                      rows={3}
                      placeholder="Rishikesh, the Yoga Capital of the World, invites you to embark…"
                      {...register("immersePara1", {
                        required: "Paragraph 1 is required",
                        maxLength: {
                          value: 500,
                          message: "Maximum 500 characters",
                        },
                      })}
                    />
                    <span
                      className={`${styles.charCount} ${styles.charCountBottom}`}
                    >
                      {watchAllFields.immersePara1?.length || 0}/500
                    </span>
                  </div>
                  {errors.immersePara1 && (
                    <p className={styles.errorMsg}>
                      ⚠ {errors.immersePara1.message}
                    </p>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>Paragraph 2
                  </label>
                  <p className={styles.fieldHint}>
                    Breathwork, asanas, meditation — optional
                  </p>
                  <div className={styles.inputWrap}>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      maxLength={500}
                      rows={3}
                      placeholder="From mastering breathwork and asanas to exploring meditation…"
                      {...register("immersePara2")}
                    />
                    <span
                      className={`${styles.charCount} ${styles.charCountBottom}`}
                    >
                      {watchAllFields.immersePara2?.length || 0}/500
                    </span>
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>CTA Button
                      Text
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>
                      Text on the Know More button
                    </p>
                    <div
                      className={`${styles.inputWrap} ${errors.immerseCtaText ? styles.inputError : ""} ${watchAllFields.immerseCtaText && !errors.immerseCtaText ? styles.inputSuccess : ""}`}
                    >
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Know More About AYM"
                        maxLength={60}
                        {...register("immerseCtaText", {
                          required: "CTA text is required",
                          maxLength: {
                            value: 60,
                            message: "Maximum 60 characters",
                          },
                        })}
                      />
                      <span className={styles.charCount}>
                        {watchAllFields.immerseCtaText?.length || 0}/60
                      </span>
                    </div>
                    {errors.immerseCtaText && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors.immerseCtaText.message}
                      </p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>CTA Button
                      Link
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>URL or path</p>
                    <div
                      className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.immerseCtaLink ? styles.inputError : ""} ${watchAllFields.immerseCtaLink && !errors.immerseCtaLink ? styles.inputSuccess : ""}`}
                    >
                      <span className={styles.inputPrefix}>🔗</span>
                      <input
                        type="text"
                        className={`${styles.input} ${styles.inputPrefixed}`}
                        placeholder="/about or https://…"
                        {...register("immerseCtaLink", {
                          required: "CTA link is required",
                          pattern: {
                            value: /^(https?:\/\/.+\..+|\/[^\s]*)$/,
                            message: "Enter a valid URL or path",
                          },
                        })}
                      />
                    </div>
                    {errors.immerseCtaLink && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors.immerseCtaLink.message}
                      </p>
                    )}
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
                <h3 className={styles.sectionTitle}>
                  Recognition &amp; Endorsements
                </h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Recognition Title
                  (H2)
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  Section heading for the recognition block
                </p>
                <div
                  className={`${styles.inputWrap} ${errors.recognitionTitle ? styles.inputError : ""} ${watchAllFields.recognitionTitle && !errors.recognitionTitle ? styles.inputSuccess : ""}`}
                >
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Recognition & Endorsements"
                    maxLength={120}
                    {...register("recognitionTitle", {
                      required: "Recognition title is required",
                      maxLength: {
                        value: 120,
                        message: "Maximum 120 characters",
                      },
                    })}
                  />
                  <span className={styles.charCount}>
                    {watchAllFields.recognitionTitle?.length || 0}/120
                  </span>
                </div>
                {errors.recognitionTitle && (
                  <p className={styles.errorMsg}>
                    ⚠ {errors.recognitionTitle.message}
                  </p>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Paragraph 1
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  YCB & Yoga Alliance + registration info
                </p>
                <div
                  className={`${styles.inputWrap} ${errors.recognitionPara1 ? styles.inputError : ""} ${watchAllFields.recognitionPara1 && !errors.recognitionPara1 ? styles.inputSuccess : ""}`}
                >
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    maxLength={600}
                    rows={4}
                    placeholder="At AYM Yoga School in Rishikesh, all our programs are accredited by…"
                    {...register("recognitionPara1", {
                      required: "Paragraph 1 is required",
                      maxLength: {
                        value: 600,
                        message: "Maximum 600 characters",
                      },
                    })}
                  />
                  <span
                    className={`${styles.charCount} ${styles.charCountBottom}`}
                  >
                    {watchAllFields.recognitionPara1?.length || 0}/600
                  </span>
                </div>
                {errors.recognitionPara1 && (
                  <p className={styles.errorMsg}>
                    ⚠ {errors.recognitionPara1.message}
                  </p>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>Paragraph 2
                </label>
                <p className={styles.fieldHint}>
                  Best yoga TTC pitch — optional
                </p>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    maxLength={600}
                    rows={4}
                    placeholder="If you're looking for the best Yoga TTC in Rishikesh…"
                    {...register("recognitionPara2")}
                  />
                  <span
                    className={`${styles.charCount} ${styles.charCountBottom}`}
                  >
                    {watchAllFields.recognitionPara2?.length || 0}/600
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 4 — CERTS & AWARDS ══════════ */}
          {activeTab === "certs" && (
            <>
              {renderCourseCertCards()}
              <div className={styles.formDivider} />
              {renderAwardCertCards()}
            </>
          )}

          <div className={styles.formDivider} />

          {/* Actions */}
          <div className={styles.formActions}>
            <Link
              href="/admin/dashboard/accreditationsection"
              className={styles.cancelBtn}
            >
              ← Cancel
            </Link>
            <div className={styles.actionsRight}>
              {activeTab !== "auth" && (
                <button
                  type="button"
                  className={styles.prevBtn}
                  onClick={() => {
                    const order = ["auth", "video", "recognition", "certs"];
                    setActiveTab(
                      order[order.indexOf(activeTab) - 1] as any
                    );
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
                    setActiveTab(
                      order[order.indexOf(activeTab) + 1] as any
                    );
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
                    <>
                      <span className={styles.spinner} /> Updating…
                    </>
                  ) : (
                    <>
                      <span>✦</span> Update Section
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
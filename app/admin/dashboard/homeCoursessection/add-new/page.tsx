"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/dashboard/homeCoursessection/Coursessection.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

/* ── JoditEditor: SSR disable (browser-only) ── */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface CourseLink {
  label: string;
  href: string;
}

interface FormData {
  title: string;
  imageAlt: string;
  duration: string;
  level: string;
  description: string; // HTML from JoditEditor
  links: CourseLink[];
  enrollHref: string;
  exploreLabel: string;
  exploreHref: string;
  priceINR: string;
  priceUSD: string;
  totalSeats: number;
  order: number;
  _imagePreview?: string;
}

const EMPTY_LINK: CourseLink = { label: "", href: "" };

const INITIAL: FormData = {
  title: "",
  imageAlt: "",
  duration: "",
  level: "",
  description: "",
  links: [{ ...EMPTY_LINK }],
  enrollHref: "",
  exploreLabel: "",
  exploreHref: "",
  priceINR: "",
  priceUSD: "",
  totalSeats: 20,
  order: 0,
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`; 
};

/* ─────────────────────── Jodit Config ─────────────────────── */
const joditConfig = {
  readonly: false,
  height: 320,
  toolbarAdaptive: false,
  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "font",
    "fontsize",
    "brush",
    "|", // brush = text color
    "paragraph",
    "|",
    "ul",
    "ol",
    "|",
    "align",
    "|",
    "link",
    "unlink",
    "|",
    "undo",
    "redo",
    "|",
    "eraser",
    "fullsize",
  ],
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
  style: {
    fontFamily: "inherit",
    fontSize: "15px",
  },
};

/* ─────────────────────── Main ─────────────────────── */
export default function CourseAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const courseId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "basic" | "content" | "links" | "pricing"
  >("basic");

  const editorRef = useRef(null);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: INITIAL,
    mode: "onChange",
  });

  const watchAll = watch();

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({ control, name: "links" });

  /* ── Fetch existing data on edit ── */
  useEffect(() => {
    if (!isEdit || !courseId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/courses-section/${courseId}`);
        const d = res.data.data;
        reset({
          title: d.title ?? "",
          imageAlt: d.imageAlt ?? "",
          duration: d.duration ?? "",
          level: d.level ?? "",
          description: d.description ?? "",
          links: d.links?.length ? d.links : [{ ...EMPTY_LINK }],
          enrollHref: d.enrollHref ?? "",
          exploreLabel: d.exploreLabel ?? "",
          exploreHref: d.exploreHref ?? "",
          priceINR: d.priceINR ?? "",
          priceUSD: d.priceUSD ?? "",
          totalSeats: d.totalSeats ?? 20,
          order: d.order ?? 0,
          _imagePreview: d.image ? getImageUrl(d.image) : "",
        });
      } catch {
        toast.error("Failed to fetch course data");
        router.replace("/admin/dashboard/homeCoursessection");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, courseId, reset, router]);

  /* ── Image Handler ── */
  const handleImage = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) =>
      setValue("_imagePreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      const excluded = ["_imagePreview", "links"];
      Object.entries(data).forEach(([key, value]) => {
        if (!excluded.includes(key)) {
          formData.append(key, String(value));
        }
      });

      // Links as JSON
      formData.append("links", JSON.stringify(data.links));

      // Image
      if (imageFile) formData.append("image", imageFile);

      if (isEdit && courseId) {
        await api.put(`/courses-section/${courseId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/courses-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/homeCoursessection"), 1500);
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
            <div
              key={i}
              className={styles.skeletonField}
              style={{ height: "52px" }}
            />
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
          <h2 className={styles.successTitle}>
            Course {isEdit ? "Updated" : "Added"}!
          </h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  /* ── Tab error flags ── */
  const tabErrors = {
    basic: !!(
      errors.title ||
      errors.level ||
      errors.duration ||
      errors.imageAlt
    ),
    content: !!errors.description,
    links: !!(
      errors.links ||
      errors.enrollHref ||
      errors.exploreLabel ||
      errors.exploreHref
    ),
    pricing: !!(errors.priceINR || errors.priceUSD || errors.totalSeats),
  };

  const tabLabels = {
    basic: "① Basic Info",
    content: "② Description",
    links: "③ Links & CTA",
    pricing: "④ Pricing & Seats",
  };

  const tabOrder = ["basic", "content", "links", "pricing"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link
          href="/admin/dashboard/homeCoursessection"
          className={styles.breadcrumbLink}
        >
          Courses Section
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {isEdit ? "Edit Course" : "Add Course"}
        </span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {isEdit ? "Edit Course" : "Add New Course"}
        </h1>
        <p className={styles.pageSubtitle}>
          {isEdit
            ? "Update course details, pricing, seats and links"
            : "Fill in all the details to add a new yoga course or retreat"}
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
          {/* ══════════ TAB 1 — BASIC INFO ══════════ */}
          {activeTab === "basic" && (
            <>
              {/* Course Image */}
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Course Image</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Course Banner / Thumbnail Image
                  </label>
                  <p className={styles.fieldHint}>
                    Recommended size: 600×400px — JPG, PNG, WEBP (max 5MB)
                  </p>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleImage(e.target.files?.[0] || null)}
                    />
                    {watchAll._imagePreview ? (
                      <img
                        src={watchAll._imagePreview}
                        alt="preview"
                        className={styles.imgPreview}
                      />
                    ) : (
                      <>
                        <span className={styles.uploadIcon}>🏔️</span>
                        <span className={styles.uploadText}>
                          Click to upload or drag &amp; drop
                        </span>
                        <span className={styles.uploadSubtext}>
                          JPG, PNG, WEBP — max 5MB
                        </span>
                      </>
                    )}
                  </label>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Image Alt Text
                  </label>
                  <p className={styles.fieldHint}>
                    For accessibility and SEO (e.g. "Yoga Retreat in Rishikesh")
                  </p>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. 200 Hour Yoga Teacher Training Rishikesh"
                      maxLength={120}
                      {...register("imageAlt")}
                    />
                    <span className={styles.charCount}>
                      {watchAll.imageAlt?.length || 0}/120
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              {/* Basic Details */}
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Course Details</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Course Title (H3)<span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>
                    Main heading shown on the course card
                  </p>
                  <div
                    className={`${styles.inputWrap} ${errors.title ? styles.inputError : ""} ${watchAll.title && !errors.title ? styles.inputSuccess : ""}`}
                  >
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. 200 Hour Yoga Teacher Training Rishikesh"
                      maxLength={120}
                      {...register("title", {
                        required: "Course title is required",
                        maxLength: {
                          value: 120,
                          message: "Maximum 120 characters",
                        },
                      })}
                    />
                    <span className={styles.charCount}>
                      {watchAll.title?.length || 0}/120
                    </span>
                  </div>
                  {errors.title && (
                    <p className={styles.errorMsg}>⚠ {errors.title.message}</p>
                  )}
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      Duration<span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>
                      e.g. "24 Days" or "3, 7 Days"
                    </p>
                    <div
                      className={`${styles.inputWrap} ${errors.duration ? styles.inputError : ""} ${watchAll.duration && !errors.duration ? styles.inputSuccess : ""}`}
                    >
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. 24 Days"
                        maxLength={40}
                        {...register("duration", {
                          required: "Duration is required",
                          maxLength: {
                            value: 40,
                            message: "Maximum 40 characters",
                          },
                        })}
                      />
                    </div>
                    {errors.duration && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      Level<span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>
                      e.g. "Beginner", "Intermediate", "All Levels"
                    </p>
                    <div
                      className={`${styles.inputWrap} ${errors.level ? styles.inputError : ""} ${watchAll.level && !errors.level ? styles.inputSuccess : ""}`}
                    >
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Beginner / Foundation"
                        maxLength={60}
                        {...register("level", {
                          required: "Level is required",
                          maxLength: {
                            value: 60,
                            message: "Maximum 60 characters",
                          },
                        })}
                      />
                    </div>
                    {errors.level && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors.level.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Display Order
                  </label>
                  <p className={styles.fieldHint}>
                    Order in which this course appears on the homepage (0 =
                    first)
                  </p>
                  <div
                    className={styles.inputWrap}
                    style={{ maxWidth: "140px" }}
                  >
                    <input
                      type="number"
                      className={styles.input}
                      min={0}
                      max={99}
                      placeholder="0"
                      {...register("order", { min: 0 })}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 2 — DESCRIPTION (JoditEditor) ══════════ */}
          {activeTab === "content" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Course Description</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✦</span>
                  Description<span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  Rich text editor — bold, italic, color, links sab support
                  karta hai.
                </p>

                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <JoditEditor
                      ref={editorRef}
                      value={field.value}
                      config={joditConfig}
                      onBlur={(newContent) => field.onChange(newContent)}
                    />
                  )}
                />

                {errors.description && (
                  <p
                    className={styles.errorMsg}
                    style={{ marginTop: "0.5rem" }}
                  >
                    ⚠ {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ══════════ TAB 3 — LINKS & CTA ══════════ */}
          {activeTab === "links" && (
            <>
              {/* Course Links */}
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Course Sub-Links</h3>
                  <span className={styles.sectionBadge}>
                    {linkFields.length}/6
                  </span>
                </div>
                <p
                  className={styles.fieldHint}
                  style={{ marginBottom: "1rem" }}
                >
                  Bulleted links (with ✓ checkmark) shown inside the course
                  card.
                </p>

                <div className={styles.itemsList}>
                  {linkFields.map((field, index) => (
                    <div key={field.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{index + 1}</span>
                      <div className={styles.itemFields}>
                        <div className={styles.inputWrap} style={{ flex: 2 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 200 Hour Multi-style Yoga Teacher Training India."
                            maxLength={100}
                            {...register(`links.${index}.label`, {
                              required: "Link label is required",
                            })}
                          />
                        </div>
                        <div
                          className={`${styles.inputWrap} ${styles.inputWithPrefix}`}
                          style={{ flex: 1.2 }}
                        >
                          <span className={styles.inputPrefix}>🔗</span>
                          <input
                            type="text"
                            className={`${styles.input} ${styles.inputPrefixed}`}
                            placeholder="/course or https://…"
                            {...register(`links.${index}.href`, {
                              required: "Link URL is required",
                            })}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.removeItemBtn}
                        onClick={() => removeLink(index)}
                        disabled={linkFields.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {linkFields.length < 6 && (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => appendLink({ ...EMPTY_LINK })}
                  >
                    + Add Link
                  </button>
                )}
              </div>

              <div className={styles.formDivider} />

              {/* CTA Buttons */}
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>CTA Buttons</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Enroll Now — Link<span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>
                    URL for the "Enroll Now" button
                  </p>
                  <div
                    className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.enrollHref ? styles.inputError : ""} ${watchAll.enrollHref && !errors.enrollHref ? styles.inputSuccess : ""}`}
                  >
                    <span className={styles.inputPrefix}>🔗</span>
                    <input
                      type="text"
                      className={`${styles.input} ${styles.inputPrefixed}`}
                      placeholder="/enroll or https://…"
                      {...register("enrollHref", {
                        required: "Enroll link is required",
                      })}
                    />
                  </div>
                  {errors.enrollHref && (
                    <p className={styles.errorMsg}>
                      ⚠ {errors.enrollHref.message}
                    </p>
                  )}
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      Explore Button Label
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>
                      e.g. "Explore 200 Hour TTC"
                    </p>
                    <div
                      className={`${styles.inputWrap} ${errors.exploreLabel ? styles.inputError : ""} ${watchAll.exploreLabel && !errors.exploreLabel ? styles.inputSuccess : ""}`}
                    >
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Explore 200 Hour TTC"
                        maxLength={60}
                        {...register("exploreLabel", {
                          required: "Explore label is required",
                          maxLength: {
                            value: 60,
                            message: "Maximum 60 characters",
                          },
                        })}
                      />
                      <span className={styles.charCount}>
                        {watchAll.exploreLabel?.length || 0}/60
                      </span>
                    </div>
                    {errors.exploreLabel && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors.exploreLabel.message}
                      </p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      Explore Button Link
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>
                      URL for the "Explore" button
                    </p>
                    <div
                      className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.exploreHref ? styles.inputError : ""} ${watchAll.exploreHref && !errors.exploreHref ? styles.inputSuccess : ""}`}
                    >
                      <span className={styles.inputPrefix}>🔗</span>
                      <input
                        type="text"
                        className={`${styles.input} ${styles.inputPrefixed}`}
                        placeholder="/200-hour-yoga or https://…"
                        {...register("exploreHref", {
                          required: "Explore link is required",
                        })}
                      />
                    </div>
                    {errors.exploreHref && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors.exploreHref.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 4 — PRICING & SEATS ══════════ */}
          {activeTab === "pricing" && (
            <>
              {/* Pricing */}
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Course Pricing</h3>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      Price (INR)<span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>e.g. ₹58,000</p>
                    <div
                      className={`${styles.inputWrap} ${errors.priceINR ? styles.inputError : ""} ${watchAll.priceINR && !errors.priceINR ? styles.inputSuccess : ""}`}
                    >
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="₹58,000"
                        maxLength={20}
                        {...register("priceINR", {
                          required: "INR price is required",
                        })}
                      />
                    </div>
                    {errors.priceINR && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors.priceINR.message}
                      </p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      Price (USD)<span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>e.g. $699</p>
                    <div
                      className={`${styles.inputWrap} ${errors.priceUSD ? styles.inputError : ""} ${watchAll.priceUSD && !errors.priceUSD ? styles.inputSuccess : ""}`}
                    >
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="$699"
                        maxLength={20}
                        {...register("priceUSD", {
                          required: "USD price is required",
                        })}
                      />
                    </div>
                    {errors.priceUSD && (
                      <p className={styles.errorMsg}>
                        ⚠ {errors.priceUSD.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              {/* Seat Management — sirf totalSeats */}
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Seat Management</h3>
                </div>

                <div className={styles.seatsInfoBanner}>
                  <span className={styles.seatsInfoIcon}>ℹ</span>
                  <p className={styles.seatsInfoText}>
                    Just set the <strong>Total Seats</strong>. When a student
                    <strong> enrolls</strong> and submits the registration form,
                    the available seats will <strong>automatically</strong>{" "}
                    decrease — there is no need to update them manually.
                  </p>
                </div>

                <div
                  className={styles.fieldGroup}
                  style={{ maxWidth: "260px" }}
                >
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Total Seats<span className={styles.required}>*</span>
                  </label>
                  <p className={styles.fieldHint}>
                    Maximum batch capacity (e.g. 30)
                  </p>
                  <div
                    className={`${styles.inputWrap} ${errors.totalSeats ? styles.inputError : ""} ${watchAll.totalSeats && !errors.totalSeats ? styles.inputSuccess : ""}`}
                  >
                    <input
                      type="number"
                      className={styles.input}
                      min={1}
                      max={500}
                      placeholder="30"
                      {...register("totalSeats", {
                        required: "Total seats is required",
                        min: { value: 1, message: "Minimum 1 seat" },
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  {errors.totalSeats && (
                    <p className={styles.errorMsg}>
                      ⚠ {errors.totalSeats.message}
                    </p>
                  )}
                </div>

                {/* Preview bar */}
                {watchAll.totalSeats > 0 && (
                  <div style={{ marginTop: "0.6rem" }}>
                    <p
                      className={styles.fieldHint}
                      style={{ marginBottom: "0.4rem" }}
                    >
                      Preview:{" "}
                      <strong style={{ color: "#3d1d00" }}>
                        {watchAll.totalSeats} / {watchAll.totalSeats}
                      </strong>{" "}
                      seats available
                    </p>
                    <div
                      className={styles.seatsBar}
                      style={{ maxWidth: "320px", height: "8px" }}
                    >
                      {/* 0% filled initially */}
                      <div
                        className={styles.seatsBarFill}
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link
              href="/admin/dashboard/homeCoursessection"
              className={styles.cancelBtn}
            >
              ← Cancel
            </Link>
            <div className={styles.actionsRight}>
              {activeTab !== "basic" && (
                <button
                  type="button"
                  className={styles.prevBtn}
                  onClick={() => {
                    const idx = tabOrder.indexOf(activeTab);
                    setActiveTab(tabOrder[idx - 1]);
                  }}
                >
                  ← Previous
                </button>
              )}
              {activeTab !== "pricing" ? (
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={() => {
                    const idx = tabOrder.indexOf(activeTab);
                    setActiveTab(tabOrder[idx + 1]);
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
                      <span className={styles.spinner} /> Saving…
                    </>
                  ) : (
                    <>
                      <span>✦</span> {isEdit ? "Update Course" : "Save Course"}
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

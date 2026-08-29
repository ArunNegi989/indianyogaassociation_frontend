"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Rulesadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface ParagraphItem {
  text: string;
}

interface RuleItem {
  num: number;
  title: string;
  content: string;
}

interface CategoryItem {
  category: string;
  rules: RuleItem[];
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Page header
  pageTitle: string;
  brownBarLabel: string;

  // Rule categories (nested: category → rules)
  categories: CategoryItem[];

  // Agreement section
  agreementTitle: string;
  agreementParagraphs: ParagraphItem[];

  // Footer
  footerText: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",
  pageTitle: "Association for Yoga and Meditation's ( AYM Yoga School ) Rules for Students",
  brownBarLabel: "Rules for Yoga Teacher Training Students",

  categories: [
    {
      category: "Conduct & Behavior",
      rules: [
        { num: 1, title: "Respectful Behavior", content: "" },
        { num: 2, title: "Mutual Respect", content: "" },
        { num: 3, title: "Inappropriate Conduct", content: "" },
      ],
    },
  ],

  agreementTitle: "Student Agreement",
  agreementParagraphs: [{ text: "" }, { text: "" }],

  footerText: "© AYM Yoga School · Association for Yoga and Meditation · Rishikesh, India",
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const joditConfig = {
  readonly: false,
  height: 220,
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

/* ─────────────────────── Reusable: dynamic paragraph list (rich text) ─────────────────────── */
function ParagraphList({
  control,
  name,
  label,
}: {
  control: Control<FormData, any>;
  name: string;
  label: string;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.74rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/8</span>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} style={{ marginBottom: "0.9rem" }}>
          <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
            <label className={styles.label} style={{ marginBottom: 0 }}>
              Paragraph {index + 1}
            </label>
            <button
              type="button"
              className={styles.removeItemBtn}
              style={{ marginLeft: "auto" }}
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
            >
              ✕
            </button>
          </div>
          <div className={styles.editorWrap}>
            <Controller
              name={`${name}.${index}.text` as any}
              control={control}
              render={({ field: f }) => (
                <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />
              )}
            />
          </div>
        </div>
      ))}

      {fields.length < 8 && (
        <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>
          + Add Paragraph
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: one category card (nested rules array) ─────────────────────── */
function CategoryFields({
  control,
  register,
  index,
  onRemove,
  canRemove,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const rulesArray = useFieldArray({ control, name: `categories.${index}.rules` });

  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Category #{index + 1}</span>
        <button
          type="button"
          className={styles.removeItemBtn}
          style={{ marginLeft: "auto" }}
          onClick={onRemove}
          disabled={!canRemove}
        >
          ✕
        </button>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Category Name</label>
        <div className={styles.inputWrap}>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Conduct & Behavior"
            {...register(`categories.${index}.category`, { required: "Required" })}
          />
        </div>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Rules</h3>
        <span className={styles.sectionBadge}>{rulesArray.fields.length}/15</span>
      </div>

      <div className={styles.itemsList}>
        {rulesArray.fields.map((rField, rIndex) => (
          <div key={rField.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>#</span>
            <div className={styles.itemFields}>
              <div className={styles.itemFieldsRow}>
                <div className={styles.inputWrap} style={{ maxWidth: "90px" }}>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="No."
                    {...register(`categories.${index}.rules.${rIndex}.num`, {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className={styles.inputWrap} style={{ flex: 1 }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Rule title"
                    {...register(`categories.${index}.rules.${rIndex}.title`, { required: true })}
                  />
                </div>
              </div>
              <div className={styles.inputWrap}>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Rule content"
                  rows={3}
                  {...register(`categories.${index}.rules.${rIndex}.content`, { required: true })}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.removeItemBtn}
              onClick={() => rulesArray.remove(rIndex)}
              disabled={rulesArray.fields.length <= 1}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {rulesArray.fields.length < 15 && (
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => rulesArray.append({ num: rulesArray.fields.length + 1, title: "", content: "" })}
        >
          + Add Rule
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function RulesAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<"hero" | "categories" | "agreement" | "footer">("hero");

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
  const categoriesArray = useFieldArray({ control, name: "categories" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/rules-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",
          pageTitle: d.pageTitle ?? INITIAL.pageTitle,
          brownBarLabel: d.brownBarLabel ?? INITIAL.brownBarLabel,
          categories: d.categories?.length ? d.categories : INITIAL.categories,
          agreementTitle: d.agreementTitle ?? INITIAL.agreementTitle,
          agreementParagraphs: d.agreementParagraphs?.length
            ? d.agreementParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.agreementParagraphs,
          footerText: d.footerText ?? INITIAL.footerText,
        });
      } catch {
        toast.error("Failed to fetch rules section data");
        router.replace("/admin/dashboard/yoga-rules");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Hero image handler ── */
  const handleHeroImage = (file: File | null) => {
    if (!file) return;
    setHeroFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_heroPreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("pageTitle", data.pageTitle);
      formData.append("brownBarLabel", data.brownBarLabel);
      formData.append("agreementTitle", data.agreementTitle);
      formData.append("footerText", data.footerText);
      formData.append("heroImageAlt", data.heroImageAlt);

      formData.append("categories", JSON.stringify(data.categories));
      formData.append("agreementParagraphs", JSON.stringify(data.agreementParagraphs.map((p) => p.text)));

      if (heroFile) formData.append("heroImage", heroFile);

      if (isEdit && sectionId) {
        await api.put(`/rules-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/rules-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yoga-rules"), 1500);
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
          <h2 className={styles.successTitle}>Rules Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.pageTitle || errors.brownBarLabel),
    categories: !!errors.categories,
    agreement: !!(errors.agreementTitle || errors.agreementParagraphs),
    footer: !!errors.footerText,
  };

  const tabLabels = {
    hero: "① Hero & Page Title",
    categories: "② Rule Categories",
    agreement: "③ Agreement",
    footer: "④ Footer",
  };

  const tabOrder = ["hero", "categories", "agreement", "footer"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/yoga-rules" className={styles.breadcrumbLink}>
          Rules Section
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Rules Section" : "Add Rules Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? "Update hero, rule categories, agreement and footer" : "Fill in every section of the Rules page"}
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
          {/* ══════════ TAB 1 — HERO & PAGE TITLE ══════════ */}
          {activeTab === "hero" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Hero Image</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hero Banner Image</label>
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
                <label className={styles.label}>Hero Image Alt Text</label>
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

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Page Title (H1)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.pageTitle ? styles.inputError : ""}`}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Association for Yoga and Meditation's Rules for Students"
                    {...register("pageTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Brown Bar Label<span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>Text shown next to the mandala icon above the rules list.</p>
                <div className={`${styles.inputWrap} ${errors.brownBarLabel ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Rules for Yoga Teacher Training Students"
                    {...register("brownBarLabel", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 2 — RULE CATEGORIES ══════════ */}
          {activeTab === "categories" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Rule Categories</h3>
                <span className={styles.sectionBadge}>{categoriesArray.fields.length}/10</span>
              </div>
              <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                Each category has its own tab on the page, with a list of numbered rules inside.
              </p>

              {categoriesArray.fields.map((field, index) => (
                <CategoryFields
                  key={field.id}
                  control={control}
                  register={register}
                  index={index}
                  onRemove={() => categoriesArray.remove(index)}
                  canRemove={categoriesArray.fields.length > 1}
                />
              ))}

              {categoriesArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    categoriesArray.append({
                      category: "",
                      rules: [{ num: 1, title: "", content: "" }],
                    })
                  }
                >
                  + Add Category
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 3 — AGREEMENT SECTION ══════════ */}
          {activeTab === "agreement" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Student Agreement</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Agreement Title (H2)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.agreementTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Student Agreement"
                    {...register("agreementTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} name="agreementParagraphs" label="Agreement Paragraphs" />
            </div>
          )}

          {/* ══════════ TAB 4 — FOOTER ══════════ */}
          {activeTab === "footer" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Footer</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Footer Text<span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>Copyright / credit line shown at the bottom of the page.</p>
                <div className={`${styles.inputWrap} ${errors.footerText ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. © AYM Yoga School · Rishikesh, India"
                    {...register("footerText", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/yoga-rules" className={styles.cancelBtn}>
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
              {activeTab !== "footer" ? (
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
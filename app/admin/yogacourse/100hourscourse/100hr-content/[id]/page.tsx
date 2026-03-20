"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
  UseFieldArrayReturn,
  FieldValues,
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "@/assets/style/Admin/yogacourse/100hourscourse/Contentmodule.module.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ══════════════════════════════
   TYPES
══════════════════════════════ */
interface SylModule { title: string; desc: string; }
interface ScheduleItem { time: string; label: string; }

interface FormData {
  bannerImage: string;
  heroTitle: string;
  heroParagraphs: { value: string }[];
  transformTitle: string;
  transformParagraphs: { value: string }[];
  whatIsTitle: string;
  whatIsParagraphs: { value: string }[];
  whyChooseTitle: string;
  whyChooseParagraphs: { value: string }[];
  suitableTitle: string;
  suitableItems: { value: string }[];
  syllabusTitle: string;
  syllabusParagraphs: { value: string }[];
  syllabusLeft: SylModule[];
  syllabusRight: SylModule[];
  scheduleImage: string;
  scheduleItems: ScheduleItem[];
  soulShineText: string;
  soulShineImage: string;
  enrollTitle: string;
  enrollParagraphs: { value: string }[];
  enrollItems: { value: string }[];
  comprehensiveTitle: string;
  comprehensiveParagraphs: { value: string }[];
  certTitle: string;
  certParagraphs: { value: string }[];
  registrationTitle: string;
  registrationParagraphs: { value: string }[];
  includedItems: { value: string }[];
  notIncludedItems: { value: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFieldArray = UseFieldArrayReturn<FormData, any, "id">;

type TFieldName = keyof Pick<FormData,
  | "heroTitle" | "transformTitle" | "whatIsTitle" | "whyChooseTitle"
  | "suitableTitle" | "syllabusTitle" | "soulShineText" | "enrollTitle"
  | "comprehensiveTitle" | "certTitle" | "registrationTitle"
>;

/* ══════════════════════════════
   IMAGE HELPER
══════════════════════════════ */
const API = process.env.NEXT_PUBLIC_API_URL ?? "";

const toAbsoluteImg = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("http")) return url;
  return `${API}${url}`;
};

/* ══════════════════════════════
   DATA HELPERS
══════════════════════════════ */
const toValueArr = (val: unknown): { value: string }[] => {
  if (!Array.isArray(val) || val.length === 0) return [{ value: "" }];
  return val.map((v: unknown) => ({ value: typeof v === "string" ? v : "" }));
};
const toSylArr = (val: unknown): SylModule[] => {
  if (!Array.isArray(val) || val.length === 0) return [{ title: "", desc: "" }];
  return (val as Record<string, unknown>[]).map(v => ({
    title: typeof v.title === "string" ? v.title : "",
    desc:  typeof v.desc  === "string" ? v.desc  : "",
  }));
};
const toSchedArr = (val: unknown): ScheduleItem[] => {
  if (!Array.isArray(val) || val.length === 0) return [{ time: "", label: "" }];
  return (val as Record<string, unknown>[]).map(v => ({
    time:  typeof v.time  === "string" ? v.time  : "",
    label: typeof v.label === "string" ? v.label : "",
  }));
};

/* ══════════════════════════════
   JODIT CONFIG
══════════════════════════════ */
const joditCfg = (height = 220): object => ({
  readonly: false, toolbar: true, toolbarAdaptive: false,
  showCharsCounter: false, showWordsCounter: false, showXPathInStatusbar: false,
  askBeforePasteHTML: false, defaultActionOnPaste: "insert_clear_html",
  height, placeholder: "Start typing…",
  buttons: ["bold","italic","underline","strikethrough","|","brush","fontsize","|","align","|","ul","ol","|","link","|","undo","redo"],
  colorPickerDefaultTab: "text",
});

/* ══════════════════════════════
   EMPTY DEFAULTS
══════════════════════════════ */
const EMPTY: FormData = {
  bannerImage: "", heroTitle: "", heroParagraphs: [{ value: "" }],
  transformTitle: "", transformParagraphs: [{ value: "" }],
  whatIsTitle: "", whatIsParagraphs: [{ value: "" }],
  whyChooseTitle: "", whyChooseParagraphs: [{ value: "" }],
  suitableTitle: "", suitableItems: [{ value: "" }],
  syllabusTitle: "", syllabusParagraphs: [{ value: "" }],
  syllabusLeft: [{ title: "", desc: "" }], syllabusRight: [{ title: "", desc: "" }],
  scheduleImage: "", scheduleItems: [{ time: "", label: "" }],
  soulShineText: "", soulShineImage: "",
  enrollTitle: "", enrollParagraphs: [{ value: "" }], enrollItems: [{ value: "" }],
  comprehensiveTitle: "", comprehensiveParagraphs: [{ value: "" }],
  certTitle: "", certParagraphs: [{ value: "" }],
  registrationTitle: "", registrationParagraphs: [{ value: "" }],
  includedItems: [{ value: "" }], notIncludedItems: [{ value: "" }],
};

/* ══════════════════════════════════════════════════════
   ✅ SUB-COMPONENTS — OUTSIDE parent component
      Stable references = no unmount/remount on re-render
      = no focus loss when typing
══════════════════════════════════════════════════════ */

function TField({
  label, hint, name, placeholder = "", max = 250, required = true,
  register, watch, errors,
}: {
  label: string; hint?: string; name: TFieldName;
  placeholder?: string; max?: number; required?: boolean;
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
}) {
  const val = (watch(name) as string) ?? "";
  const err = errors[name];
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={`${styles.inputWrap} ${err ? styles.inputError : ""} ${val && !err ? styles.inputSuccess : ""}`}>
        <input type="text" className={styles.input} placeholder={placeholder} maxLength={max}
          {...register(name, { required: required ? "Required" : false })} />
        <span className={styles.charCount}>{val.length}/{max}</span>
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err.message as string}</p>}
    </div>
  );
}

function ParaBlock({
  label, arrayMethods, fieldArrayName, required = false, control,
}: {
  label: string; arrayMethods: AnyFieldArray; fieldArrayName: string;
  required?: boolean; control: Control<FormData>;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.paraStack}>
        {arrayMethods.fields.map((field, i) => (
          <div key={field.id} className={styles.paraItem}>
            <div className={styles.paraItemHeader}>
              <span className={styles.paraNum}>Para {i + 1}</span>
              <button type="button" className={styles.removeItemBtn}
                onClick={() => arrayMethods.remove(i)} disabled={arrayMethods.fields.length <= 1}>✕</button>
            </div>
            <div className={styles.joditWrap}>
              <Controller
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name={`${fieldArrayName}.${i}.value` as any}
                control={control}
                rules={required && i === 0 ? { required: "At least one paragraph required" } : {}}
                render={({ field: f }) => (
                  <JoditEditor value={f.value as string} config={joditCfg(200)}
                    onBlur={(v: string) => f.onChange(v)} />
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addItemBtn}
        onClick={() => (arrayMethods.append as (v: FieldValues) => void)({ value: "" })}>
        + Add Paragraph
      </button>
    </div>
  );
}

function ImgField({
  label, hint, fieldName, fileRef, inputRef, previewVal, setValue, onFileChange,
}: {
  label: string; hint?: string;
  fieldName: "bannerImage" | "scheduleImage" | "soulShineImage";
  fileRef: React.MutableRefObject<File | null>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  previewVal: string;
  setValue: UseFormSetValue<FormData>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={styles.imgUploadRow}>
        <div className={styles.imgPreviewBox}>
          {previewVal
            ? <img src={previewVal} alt="preview" className={styles.imgPreview} />
            : <span className={styles.imgPreviewEmpty}>🖼</span>}
        </div>
        <div className={styles.imgUploadControls}>
          <div className={styles.imgUploadZone} onClick={() => inputRef.current?.click()}>
            <span>📁 Click to upload</span>
            <span className={styles.imgUploadSub}>JPG · PNG · WEBP</span>
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={onFileChange} />
          <div className={styles.imgUrlRow}>
            <div className={styles.inputWrap}>
              <input type="text" className={styles.input} placeholder="Or paste image URL…"
                value={previewVal}
                onChange={e => { fileRef.current = null; setValue(fieldName, e.target.value); }} />
            </div>
            {previewVal && (
              <button type="button" className={styles.imgClearBtn}
                onClick={() => { fileRef.current = null; setValue(fieldName, ""); }}>✕</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListField({
  label, arrayMethods, fieldArrayName, placeholder, required = true, register,
}: {
  label: string; arrayMethods: AnyFieldArray; fieldArrayName: string;
  placeholder: string; required?: boolean; register: UseFormRegister<FormData>;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.listItems}>
        {arrayMethods.fields.map((field, i) => (
          <div key={field.id} className={styles.listItemRow}>
            <span className={styles.listNum}>{i + 1}</span>
            <div className={`${styles.inputWrap} ${styles.listInput}`}>
              <input type="text" className={styles.input} placeholder={placeholder} maxLength={300}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...register(`${fieldArrayName}.${i}.value` as any, {
                  required: required ? "This field is required" : false,
                })} />
            </div>
            <button type="button" className={styles.removeItemBtn}
              onClick={() => arrayMethods.remove(i)} disabled={arrayMethods.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addItemBtn}
        onClick={() => (arrayMethods.append as (v: FieldValues) => void)({ value: "" })}>
        + Add Item
      </button>
    </div>
  );
}

/* ══════════════════════════════
   MAIN COMPONENT
══════════════════════════════ */
export default function ContentEditPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params?.id as string | undefined;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(true);

  const bannerFileRef = useRef<HTMLInputElement | null>(null);
  const schedImgRef   = useRef<HTMLInputElement | null>(null);
  const soulImgRef    = useRef<HTMLInputElement | null>(null);
  const bannerFile    = useRef<File | null>(null);
  const schedFile     = useRef<File | null>(null);
  const soulFile      = useRef<File | null>(null);

  const {
    register, control, handleSubmit, watch, setValue, reset,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: EMPTY });

  const heroParagraphs          = useFieldArray({ control, name: "heroParagraphs" });
  const transformParagraphs     = useFieldArray({ control, name: "transformParagraphs" });
  const whatIsParagraphs        = useFieldArray({ control, name: "whatIsParagraphs" });
  const whyChooseParagraphs     = useFieldArray({ control, name: "whyChooseParagraphs" });
  const suitableItems           = useFieldArray({ control, name: "suitableItems" });
  const syllabusParagraphs      = useFieldArray({ control, name: "syllabusParagraphs" });
  const syllabusLeft            = useFieldArray({ control, name: "syllabusLeft" });
  const syllabusRight           = useFieldArray({ control, name: "syllabusRight" });
  const scheduleItems           = useFieldArray({ control, name: "scheduleItems" });
  const enrollParagraphs        = useFieldArray({ control, name: "enrollParagraphs" });
  const enrollItems             = useFieldArray({ control, name: "enrollItems" });
  const comprehensiveParagraphs = useFieldArray({ control, name: "comprehensiveParagraphs" });
  const certParagraphs          = useFieldArray({ control, name: "certParagraphs" });
  const registrationParagraphs  = useFieldArray({ control, name: "registrationParagraphs" });
  const includedItems           = useFieldArray({ control, name: "includedItems" });
  const notIncludedItems        = useFieldArray({ control, name: "notIncludedItems" });

  const bannerImageVal    = watch("bannerImage");
  const scheduleImageVal  = watch("scheduleImage");
  const soulShineImageVal = watch("soulShineImage");

  /* ── Fetch & prefill ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = id
          ? await api.get(`/100hr-content/get/${id}`)
          : await api.get("/100hr-content/get");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d: Record<string, any> = res.data.data;
        if (!d) {
          toast.error("No content found. Add content first.");
          router.replace("/admin/yogacourse/100hourscourse/100hr-content");
          return;
        }

        reset({
          bannerImage:             toAbsoluteImg(d.bannerImage    ?? ""),
          scheduleImage:           toAbsoluteImg(d.scheduleImage  ?? ""),
          soulShineImage:          toAbsoluteImg(d.soulShineImage ?? ""),
          heroTitle:               d.heroTitle               ?? "",
          heroParagraphs:          toValueArr(d.heroParagraphs),
          transformTitle:          d.transformTitle          ?? "",
          transformParagraphs:     toValueArr(d.transformParagraphs),
          whatIsTitle:             d.whatIsTitle             ?? "",
          whatIsParagraphs:        toValueArr(d.whatIsParagraphs),
          whyChooseTitle:          d.whyChooseTitle          ?? "",
          whyChooseParagraphs:     toValueArr(d.whyChooseParagraphs),
          suitableTitle:           d.suitableTitle           ?? "",
          suitableItems:           toValueArr(d.suitableItems),
          syllabusTitle:           d.syllabusTitle           ?? "",
          syllabusParagraphs:      toValueArr(d.syllabusParagraphs),
          syllabusLeft:            toSylArr(d.syllabusLeft),
          syllabusRight:           toSylArr(d.syllabusRight),
          scheduleItems:           toSchedArr(d.scheduleItems),
          soulShineText:           d.soulShineText           ?? "",
          enrollTitle:             d.enrollTitle             ?? "",
          enrollParagraphs:        toValueArr(d.enrollParagraphs),
          enrollItems:             toValueArr(d.enrollItems),
          comprehensiveTitle:      d.comprehensiveTitle      ?? "",
          comprehensiveParagraphs: toValueArr(d.comprehensiveParagraphs),
          certTitle:               d.certTitle               ?? "",
          certParagraphs:          toValueArr(d.certParagraphs),
          registrationTitle:       d.registrationTitle       ?? "",
          registrationParagraphs:  toValueArr(d.registrationParagraphs),
          includedItems:           toValueArr(d.includedItems),
          notIncludedItems:        toValueArr(d.notIncludedItems),
        });
      } catch {
        toast.error("Failed to fetch content");
        router.replace("/admin/yogacourse/100hourscourse/100hr-content");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router, reset]);

  /* ── Image handler ── */
  const handleImgFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileRef: React.MutableRefObject<File | null>,
    fieldName: "bannerImage" | "scheduleImage" | "soulShineImage"
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    fileRef.current = f;
    setValue(fieldName, URL.createObjectURL(f));
    e.target.value = "";
  };

  /* ── Submit PUT ── */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      const rawBanner = data.bannerImage.replace(API, "");
      const rawSched  = data.scheduleImage.replace(API, "");
      const rawSoul   = data.soulShineImage.replace(API, "");

      if (bannerFile.current) fd.append("bannerImage", bannerFile.current);
      else if (rawBanner) fd.append("bannerImageUrl", rawBanner);
      if (schedFile.current) fd.append("scheduleImage", schedFile.current);
      else if (rawSched) fd.append("scheduleImageUrl", rawSched);
      if (soulFile.current) fd.append("soulShineImage", soulFile.current);
      else if (rawSoul) fd.append("soulShineImageUrl", rawSoul);

      const payload = {
        ...data,
        bannerImage: undefined, scheduleImage: undefined, soulShineImage: undefined,
        heroParagraphs:          data.heroParagraphs.map(p => p.value),
        transformParagraphs:     data.transformParagraphs.map(p => p.value),
        whatIsParagraphs:        data.whatIsParagraphs.map(p => p.value),
        whyChooseParagraphs:     data.whyChooseParagraphs.map(p => p.value),
        suitableItems:           data.suitableItems.map(p => p.value),
        syllabusParagraphs:      data.syllabusParagraphs.map(p => p.value),
        enrollParagraphs:        data.enrollParagraphs.map(p => p.value),
        enrollItems:             data.enrollItems.map(p => p.value),
        comprehensiveParagraphs: data.comprehensiveParagraphs.map(p => p.value),
        certParagraphs:          data.certParagraphs.map(p => p.value),
        registrationParagraphs:  data.registrationParagraphs.map(p => p.value),
        includedItems:           data.includedItems.map(p => p.value),
        notIncludedItems:        data.notIncludedItems.map(p => p.value),
      };
      fd.append("data", JSON.stringify(payload));

      await api.put("/100hr-content/update", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/100hourscourse/100hr-content"), 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message ?? "Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className={styles.formPage}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonCard}>
        {[...Array(5)].map((_, i) => <div key={i} className={styles.skeletonField} />)}
      </div>
    </div>
  );

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Content Updated!</h2>
        <p className={styles.successText}>Redirecting…</p>
      </div>
    </div>
  );

  /* shared props */
  const fp = { register, watch, errors, control, setValue };

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/yogacourse/100hourscourse/100hr-content" className={styles.breadcrumbLink}>Page Content</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Content</span>
      </div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Page Content</h1>
        <p className={styles.pageSubtitle}>Update all content sections of the 100 Hour YTT page</p>
      </div>
      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.formCard}>

          {/* ══ BANNER ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Page Banner / Hero Image</h3></div>
            <ImgField label="Banner Image" hint="Main hero image shown at the top of the page"
              fieldName="bannerImage" fileRef={bannerFile} inputRef={bannerFileRef}
              previewVal={bannerImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, bannerFile, "bannerImage")} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ HERO ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Hero Section</h3></div>
            <TField label="Hero Title (H1)" name="heroTitle" max={200} {...fp} />
            <ParaBlock label="Hero Intro Text" arrayMethods={heroParagraphs} fieldArrayName="heroParagraphs" required control={fp.control} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ TRANSFORM ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Transform Your Practice</h3></div>
            <TField label="Section Title" name="transformTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={transformParagraphs} fieldArrayName="transformParagraphs" control={fp.control} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ WHAT IS ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>What is 100 Hour YTT?</h3></div>
            <TField label="Section Title" name="whatIsTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={whatIsParagraphs} fieldArrayName="whatIsParagraphs" control={fp.control} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ WHY CHOOSE ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Why Choose AYM?</h3></div>
            <TField label="Section Title" name="whyChooseTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={whyChooseParagraphs} fieldArrayName="whyChooseParagraphs" control={fp.control} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ SUITABLE ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Suitable For (List)</h3></div>
            <TField label="Section Title" name="suitableTitle" max={200} {...fp} />
            <ListField label="List Items" arrayMethods={suitableItems} fieldArrayName="suitableItems"
              placeholder="e.g. If you want to understand and study yoga holistically…" register={fp.register} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ SYLLABUS ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Syllabus Section</h3></div>
            <TField label="Syllabus Title" name="syllabusTitle" max={250} {...fp} />
            <ParaBlock label="Intro Paragraphs" arrayMethods={syllabusParagraphs} fieldArrayName="syllabusParagraphs" control={fp.control} />

            {/* Left Modules */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Left Column Modules<span className={styles.required}>*</span></label>
              <div className={styles.moduleList}>
                {syllabusLeft.fields.map((field, i) => (
                  <div key={field.id} className={styles.moduleCard}>
                    <div className={styles.moduleCardHeader}>
                      <span className={styles.moduleNum}>Module L{i + 1}</span>
                      <button type="button" className={styles.removeItemBtn} onClick={() => syllabusLeft.remove(i)} disabled={syllabusLeft.fields.length <= 1}>✕</button>
                    </div>
                    <div className={styles.moduleFields}>
                      <div className={styles.fieldGroup} style={{ marginBottom: "0.8rem" }}>
                        <label className={styles.labelSm}>Title</label>
                        <div className={`${styles.inputWrap} ${errors.syllabusLeft?.[i]?.title ? styles.inputError : ""}`}>
                          <input type="text" className={styles.input} placeholder="e.g. Practice of Yoga Techniques" maxLength={100}
                            {...register(`syllabusLeft.${i}.title`, { required: "Title required" })} />
                        </div>
                        {errors.syllabusLeft?.[i]?.title && <p className={styles.errorMsg}>⚠ {errors.syllabusLeft[i]?.title?.message}</p>}
                      </div>
                      <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                        <label className={styles.labelSm}>Description</label>
                        <div className={`${styles.inputWrap} ${errors.syllabusLeft?.[i]?.desc ? styles.inputError : ""}`}>
                          <textarea className={`${styles.input} ${styles.textarea}`} rows={3} placeholder="Module description…" maxLength={400}
                            {...register(`syllabusLeft.${i}.desc`, { required: "Description required" })} />
                        </div>
                        {errors.syllabusLeft?.[i]?.desc && <p className={styles.errorMsg}>⚠ {errors.syllabusLeft[i]?.desc?.message}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn} onClick={() => syllabusLeft.append({ title: "", desc: "" })}>+ Add Left Module</button>
            </div>

            {/* Right Modules */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Right Column Modules<span className={styles.required}>*</span></label>
              <div className={styles.moduleList}>
                {syllabusRight.fields.map((field, i) => (
                  <div key={field.id} className={styles.moduleCard}>
                    <div className={styles.moduleCardHeader}>
                      <span className={styles.moduleNum}>Module R{i + 1}</span>
                      <button type="button" className={styles.removeItemBtn} onClick={() => syllabusRight.remove(i)} disabled={syllabusRight.fields.length <= 1}>✕</button>
                    </div>
                    <div className={styles.moduleFields}>
                      <div className={styles.fieldGroup} style={{ marginBottom: "0.8rem" }}>
                        <label className={styles.labelSm}>Title</label>
                        <div className={`${styles.inputWrap} ${errors.syllabusRight?.[i]?.title ? styles.inputError : ""}`}>
                          <input type="text" className={styles.input} placeholder="e.g. Practicum" maxLength={100}
                            {...register(`syllabusRight.${i}.title`, { required: "Title required" })} />
                        </div>
                        {errors.syllabusRight?.[i]?.title && <p className={styles.errorMsg}>⚠ {errors.syllabusRight[i]?.title?.message}</p>}
                      </div>
                      <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                        <label className={styles.labelSm}>Description</label>
                        <div className={`${styles.inputWrap} ${errors.syllabusRight?.[i]?.desc ? styles.inputError : ""}`}>
                          <textarea className={`${styles.input} ${styles.textarea}`} rows={3} placeholder="Module description…" maxLength={400}
                            {...register(`syllabusRight.${i}.desc`, { required: "Description required" })} />
                        </div>
                        {errors.syllabusRight?.[i]?.desc && <p className={styles.errorMsg}>⚠ {errors.syllabusRight[i]?.desc?.message}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn} onClick={() => syllabusRight.append({ title: "", desc: "" })}>+ Add Right Module</button>
            </div>
          </div>
          <div className={styles.formDivider} />

          {/* ══ DAILY SCHEDULE ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Daily Schedule</h3></div>
            <ImgField label="Schedule Section Image" hint="Circular ornament image on the left side"
              fieldName="scheduleImage" fileRef={schedFile} inputRef={schedImgRef}
              previewVal={scheduleImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, schedFile, "scheduleImage")} />
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Schedule Items<span className={styles.required}>*</span></label>
              <div className={styles.schedList}>
                {scheduleItems.fields.map((field, i) => (
                  <div key={field.id} className={styles.schedRow}>
                    <span className={styles.schedRowNum}>{i + 1}</span>
                    <div className={styles.schedRowFields}>
                      <div className={`${styles.inputWrap} ${styles.schedTimeInput} ${errors.scheduleItems?.[i]?.time ? styles.inputError : ""}`}>
                        <input type="text" className={styles.input} placeholder="e.g. 07:00 Am - 08:00 Am" maxLength={40}
                          {...register(`scheduleItems.${i}.time`, { required: "Time required" })} />
                      </div>
                      <div className={`${styles.inputWrap} ${styles.schedLabelInput} ${errors.scheduleItems?.[i]?.label ? styles.inputError : ""}`}>
                        <input type="text" className={styles.input} placeholder="e.g. Pranayama and Meditation" maxLength={100}
                          {...register(`scheduleItems.${i}.label`, { required: "Label required" })} />
                      </div>
                    </div>
                    <button type="button" className={styles.removeItemBtn} onClick={() => scheduleItems.remove(i)} disabled={scheduleItems.fields.length <= 1}>✕</button>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn} onClick={() => scheduleItems.append({ time: "", label: "" })}>+ Add Schedule Item</button>
            </div>
          </div>
          <div className={styles.formDivider} />

          {/* ══ SOUL SHINE ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Let Your Soul Shine Banner</h3></div>
            <TField label="Banner Text" hint="Text overlay shown on the banner image" name="soulShineText" placeholder="Let Your Soul Shine" max={100} {...fp} />
            <ImgField label="Banner Image" hint="Full-width banner image (shown with text overlay)"
              fieldName="soulShineImage" fileRef={soulFile} inputRef={soulImgRef}
              previewVal={soulShineImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, soulFile, "soulShineImage")} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ WHY ENROL ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Why Enrol Section</h3></div>
            <TField label="Section Title" name="enrollTitle" max={250} {...fp} />
            <ParaBlock label="Intro Paragraphs" arrayMethods={enrollParagraphs} fieldArrayName="enrollParagraphs" control={fp.control} />
            <ListField label="Enrol Reasons" arrayMethods={enrollItems} fieldArrayName="enrollItems"
              placeholder="e.g. We have a sattvic and spiritual atmosphere…" register={fp.register} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ COMPREHENSIVE ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Comprehensive Section</h3></div>
            <TField label="Section Title" name="comprehensiveTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={comprehensiveParagraphs} fieldArrayName="comprehensiveParagraphs" control={fp.control} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ CERTIFICATION ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Certification</h3></div>
            <TField label="Section Title" name="certTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={certParagraphs} fieldArrayName="certParagraphs" control={fp.control} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ REGISTRATION ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Registration Process</h3></div>
            <TField label="Section Title" name="registrationTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={registrationParagraphs} fieldArrayName="registrationParagraphs" control={fp.control} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ FEE LISTS ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Fee — Included / Not Included</h3></div>
            <div className={styles.twoColSection}>
              <ListField label="Included in Fee" arrayMethods={includedItems} fieldArrayName="includedItems"
                placeholder="e.g. 14 Days Accommodation and 3 Meals / Day" register={fp.register} />
              <ListField label="Not Included in Fee" arrayMethods={notIncludedItems} fieldArrayName="notIncludedItems"
                placeholder="e.g. Air Ticket and Airport Pickup" register={fp.register} />
            </div>
          </div>
          <div className={styles.formDivider} />

          {/* ══ ACTIONS ══ */}
          <div className={styles.formActions}>
            <Link href="/admin/yogacourse/100hourscourse/100hr-content" className={styles.cancelBtn}>← Cancel</Link>
            <button type="submit"
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
              disabled={isSubmitting}>
              {isSubmitting ? <><span className={styles.spinner} /> Updating…</> : <><span>✦</span> Update Content</>}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
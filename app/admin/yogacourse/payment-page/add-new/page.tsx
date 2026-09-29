"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Paymentadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface KV { label: string; value: string }
interface PaypalOption { icon: string; title: string; link: string }
interface CardOption { badge: string; title: string; desc: string; link: string }
interface Bank { title: string; fields: KV[] }
interface Arrival { method: string; charge: string }
interface Policy { icon: string; title: string; text: string }

interface FormData {
  // Hero
  heroImageAlt: string;

  // Header
  superTitle: string;
  mainTitle: string;
  headerDesc: string; // rich text (links allowed)

  // Registration fee
  regFeeTitle: string;
  regFeeHighlight: string;
  regFeeText: string;

  // PayPal
  paypalTitle: string;
  paypalLink: string;
  paypalOptions: PaypalOption[];

  // UPI
  upiTitle: string;
  upiId: string;
  upiCopyLabel: string;
  upiQr1Alt: string;
  upiId2: string;
  upiCopyLabel2: string;
  upiQr2Alt: string;

  // Cards
  cardsTitle: string;
  cards: CardOption[];
  cardsBtnLabel: string;

  // Bank
  bankTitle: string;
  banks: Bank[];
  gstNoteOnline: string;

  // Western Union
  westernTitle: string;
  westernText: string;
  westernSendTo: string;
  westernAddress: string;
  westernNote: string;

  // Arrival
  arrivalTitle: string;
  arrivalIntro: string;
  arrivalMethods: Arrival[];
  gstNoteArrival: string;

  // Policies
  policies: Policy[];
}

type ImgKey = "heroImage" | "paypalLogo" | "upiQr1" | "upiQr2";

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",

  superTitle: "Reserve Your Sacred Journey",
  mainTitle: "Yoga Teacher Training — Payment Options",
  headerDesc:
    'Payment option to pay advance fee to reserve your spot for <a href="#">200-hour yoga ttc</a> or <a href="#">300-hour yoga ttc</a> or 500-hour yoga ttc at AYM Yoga School in Rishikesh India.',

  regFeeTitle: "Registration Fee",
  regFeeHighlight: "[₹$100 (Advance Fee) + $10 (Paypal Charge)] = $110",
  regFeeText:
    "To reserve seats at 200-hour, 300-hour, and 500-hour yoga teacher training pay {highlight}. After we receive your advance fee we will send you a confirmation E-mail and information about your course. This advance fee will be deducted from the total fee of the course. The rest of the yoga fee can be paid on arrival.",

  paypalTitle: "Pay Via PayPal",
  paypalLink: "https://www.paypal.com",
  paypalOptions: [
    { icon: "🌿", title: "Yoga Retreats / Sound Healing", link: "https://www.paypal.com" },
    { icon: "🕉️", title: "100 Hour / 200 Hour / 300 Hour", link: "https://www.paypal.com" },
    { icon: "☀️", title: "500 Hour", link: "https://www.paypal.com" },
    { icon: "🌸", title: "Prenatal Yoga", link: "https://www.paypal.com" },
    { icon: "🧘", title: "Meditation & Pranayama", link: "https://www.paypal.com" },
    { icon: "📿", title: "Online Course", link: "https://www.paypal.com" },
  ],

  upiTitle: "Pay via UPI",
  upiId: "maheshyogaexpert@okhdfcbank",
  upiCopyLabel: "Copy UPI ID",
  upiQr1Alt: "UPI QR Code - maheshyogaexpert@okhdfcbank",
  upiId2: "maheshyogaexpert@okhdfcbank",
  upiCopyLabel2: "Copy UPI ID",
  upiQr2Alt: "AYM Yoga School QR Code",

  cardsTitle: "Pay via Debit / Credit Cards",
  cardsBtnLabel: "Book Now",
  cards: [
    {
      badge: "INR",
      title: "For Indian Students — INR",
      desc: "You can pay via UPI, Wallet, Internet Banking and Debit/Credit Card. It's allowing to pay with Indian Account.",
      link: "#",
    },
    {
      badge: "USD",
      title: "For International Students — USD",
      desc: "You can pay Advance fee via Debit / Credit Card. It's allowing to pay in USD.",
      link: "#",
    },
    {
      badge: "EUR",
      title: "For International Students — EURO",
      desc: "You can pay Advance fee via Debit / Credit Card. It's allowing to pay in Euro.",
      link: "#",
    },
  ],

  bankTitle: "Direct Bank Transfer",
  banks: [
    {
      title: "Direct Bank Transfer 1",
      fields: [
        { label: "Account Holder", value: "Mahesh Chand" },
        { label: "Account Number", value: "07252020000801" },
        { label: "Account Type", value: "Current Account" },
        { label: "Swift Code", value: "HDFCINBB" },
        { label: "IFSC / MICR", value: "HDFC0000725" },
        { label: "Bank", value: "HDFC Bank" },
        { label: "Address", value: "53, MJ Mall, Railway Road Rishikesh, Uttarakhand India. Pin: 249201" },
      ],
    },
    {
      title: "Direct Bank Transfer 2",
      fields: [
        { label: "Account Holder", value: "Mahesh Chand" },
        { label: "Account Number", value: "00000010576247358" },
        { label: "Account Type", value: "Saving Account" },
        { label: "IFSC Code", value: "SBIN0002493" },
        { label: "MICR Code", value: "249002104" },
        { label: "Bank", value: "State Bank of India" },
        {
          label: "Address",
          value: "Swargashram Rishikesh Dist: Pauri Garhwa Garhwal, Uttarakhand, Pauri Garhwal, 249304",
        },
      ],
    },
  ],
  gstNoteOnline: "⚠ Note: Any Amount paid online — 5% GST (Tax) will be applicable.",

  westernTitle: "Western Money Union",
  westernText:
    "Western Money Union is also one of the fastest methods to send advance yoga deposit to reserve your seat in yoga TTC.",
  westernSendTo: "Mahesh Chand",
  westernAddress: "AYM Yoga School",
  westernNote:
    "Send us an email about the detail of your money transfer with the receipt and we will send you a confirmation for your course after receiving your payment. Applicant will bear all transition charges. Make sure the full amount of the course fee is available in an organization bank account.",

  arrivalTitle: "Payment Option on Arrival",
  arrivalIntro:
    "Our school would like it if you would pay the rest of the balance amount on arrival on the first day of yoga TTC at school office. We accept:",
  arrivalMethods: [
    { method: "Cash (INR, USD, AUD, EUR)", charge: "No Extra Charge" },
    { method: "Traveller Checks (USD)", charge: "No Extra Charge" },
    { method: "PayPal Payment", charge: "8% Extra Charge" },
    { method: "Credit / Debit Cards", charge: "3.5% Extra Charge" },
    { method: "American Express Cards", charge: "4.5% Extra Charge" },
  ],
  gstNoteArrival: "⚠ Note: Any Amount paid online or by bank transfer — GST rate of 5% is applicable.",

  policies: [
    {
      icon: "📜",
      title: "Terms & Conditions",
      text: "This policy applies to each participant of the Yoga TTC program and yoga retreat programs. After enrolling, students must adhere to all policies and conditions outlined by the school, acknowledge all information during registration, and strictly follow all disciplines and student guidelines during their stay.",
    },
    {
      icon: "🔒",
      title: "Privacy Policy",
      text: "We believe in keeping students' and participants' personal information confidential. Information provided during registration is solely for school purposes and kept strictly confidential. As a prestigious yoga institution, we will not share personal information with any third party unless required for contract registration.",
    },
    {
      icon: "↩️",
      title: "Cancellation & Refunds",
      text: "All payments for the courses are pre-contracted and hence cannot be refunded in case of any cancellation. The fees are non-negotiable. Students must inform the school beforehand via email so that space can be offered to someone else.",
    },
  ],
};

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const joditConfig = {
  readonly: false,
  height: 220,
  toolbarAdaptive: false,
  buttons: [
    "bold", "italic", "underline", "|", "paragraph", "|", "ul", "ol", "|",
    "link", "unlink", "|", "undo", "redo", "|", "eraser", "fullsize",
  ],
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
  style: { fontFamily: "inherit", fontSize: "15px" },
};

/* ─────────────────────── Small reusable pieces ─────────────────────── */
function TextField({
  label, hint, error, children,
}: { label: string; hint?: string; error?: boolean; children: React.ReactNode }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={`${styles.inputWrap} ${error ? styles.inputError : ""}`}>{children}</div>
    </div>
  );
}

function ImageField({
  label, preview, onFile, hint,
}: { label: string; preview?: string; onFile: (f: File | null) => void; hint?: string }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <label className={styles.uploadArea}>
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
        {preview ? (
          <img src={preview} alt="preview" className={styles.imgPreview} />
        ) : (
          <>
            <span className={styles.uploadIcon}>🖼️</span>
            <span className={styles.uploadText}>Click to upload</span>
            <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
          </>
        )}
      </label>
    </div>
  );
}

function SectionHead({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionIcon}>✦</span>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {badge && <span className={styles.sectionBadge}>{badge}</span>}
    </div>
  );
}

function RichField({
  control, name, label, hint,
}: { control: Control<FormData, any>; name: keyof FormData; label: string; hint?: string }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={styles.editorWrap}>
        <Controller
          name={name as any}
          control={control}
          render={({ field }) => (
            <JoditEditor value={field.value as string} config={joditConfig} onBlur={(c) => field.onChange(c)} />
          )}
        />
      </div>
    </div>
  );
}

/* One bank card with its own key/value rows */
function BankFields({
  control, register, index, onRemove, canRemove,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const rows = useFieldArray({ control, name: `banks.${index}.fields` });

  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Bank #{index + 1}</span>
        <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={onRemove} disabled={!canRemove}>
          ✕
        </button>
      </div>

      <TextField label="Card Title">
        <input className={styles.input} placeholder="e.g. Direct Bank Transfer 1" {...register(`banks.${index}.title`, { required: true })} />
      </TextField>

      <div className={styles.itemsList}>
        {rows.fields.map((r, ri) => (
          <div key={r.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{ri + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.itemFieldsRow}>
                <div className={styles.inputWrap} style={{ flex: 1 }}>
                  <input className={styles.input} placeholder="Label (e.g. Account Number)" {...register(`banks.${index}.fields.${ri}.label`, { required: true })} />
                </div>
                <div className={styles.inputWrap} style={{ flex: 2 }}>
                  <input className={styles.input} placeholder="Value" {...register(`banks.${index}.fields.${ri}.value`, { required: true })} />
                </div>
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => rows.remove(ri)} disabled={rows.fields.length <= 1}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {rows.fields.length < 15 && (
        <button type="button" className={styles.addBtn} onClick={() => rows.append({ label: "", value: "" })}>
          + Add Field
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
type Tab = "hero" | "fee" | "upi" | "bank" | "arrival" | "policies";
const tabOrder: Tab[] = ["hero", "fee", "upi", "bank", "arrival", "policies"];
const tabLabels: Record<Tab, string> = {
  hero: "① Hero & Header",
  fee: "② Fee & PayPal",
  upi: "③ UPI & Cards",
  bank: "④ Bank Transfer",
  arrival: "⑤ Western & Arrival",
  policies: "⑥ Policies",
};

export default function PaymentAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [files, setFiles] = useState<Record<ImgKey, File | null>>({
    heroImage: null, paypalLogo: null, upiQr1: null, upiQr2: null,
  });
  const [previews, setPreviews] = useState<Record<ImgKey, string>>({
    heroImage: "", paypalLogo: "", upiQr1: "", upiQr2: "",
  });

  const {
    control, handleSubmit, register, formState: { errors }, reset,
  } = useForm<FormData>({ defaultValues: INITIAL, mode: "onChange" });

  const paypalArr = useFieldArray({ control, name: "paypalOptions" });
  const cardsArr = useFieldArray({ control, name: "cards" });
  const banksArr = useFieldArray({ control, name: "banks" });
  const arrivalArr = useFieldArray({ control, name: "arrivalMethods" });
  const policiesArr = useFieldArray({ control, name: "policies" });

  /* ── Fetch existing data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/payment-section/${sectionId}`);
        const d = res.data.data;
        const merged: FormData = { ...INITIAL };
        (Object.keys(INITIAL) as (keyof FormData)[]).forEach((k) => {
          const v = d[k];
          if (v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)) (merged as any)[k] = v;
        });
        reset(merged);
        setPreviews({
          heroImage: getImageUrl(d.heroImage),
          paypalLogo: getImageUrl(d.paypalLogo),
          upiQr1: getImageUrl(d.upiQr1),
          upiQr2: getImageUrl(d.upiQr2),
        });
      } catch {
        toast.error("Failed to fetch payment section data");
        router.replace("/admin/yogacourse/payment-page");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Image handler ── */
  const handleImage = (key: ImgKey) => (file: File | null) => {
    if (!file) return;
    setFiles((p) => ({ ...p, [key]: file }));
    const reader = new FileReader();
    reader.onload = (e) => setPreviews((p) => ({ ...p, [key]: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      const arrayKeys = ["paypalOptions", "cards", "banks", "arrivalMethods", "policies"];

      (Object.keys(data) as (keyof FormData)[]).forEach((k) => {
        if (arrayKeys.includes(k)) fd.append(k, JSON.stringify(data[k]));
        else fd.append(k, data[k] as string);
      });

      (Object.keys(files) as ImgKey[]).forEach((k) => {
        if (files[k]) fd.append(k, files[k] as File);
      });

      const cfg = { headers: { "Content-Type": "multipart/form-data" } };
      if (isEdit && sectionId) await api.put(`/payment-section/${sectionId}`, fd, cfg);
      else await api.post("/payment-section", fd, cfg);

      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/payment-page"), 1500);
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
          <h2 className={styles.successTitle}>Payment Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors: Record<Tab, boolean> = {
    hero: !!(errors.heroImageAlt || errors.superTitle || errors.mainTitle),
    fee: !!(errors.regFeeTitle || errors.regFeeText || errors.paypalTitle || errors.paypalOptions),
    upi: !!(errors.upiTitle || errors.upiId || errors.upiId2 || errors.cardsTitle || errors.cards),
    bank: !!(errors.bankTitle || errors.banks),
    arrival: !!(errors.westernTitle || errors.arrivalTitle || errors.arrivalMethods),
    policies: !!errors.policies,
  };

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/yogacourse/payment-page" className={styles.breadcrumbLink}>Payment Section</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Payment Section" : "Add Payment Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? "Update every block of the Payment page" : "Fill in every section of the Payment page"}
        </p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Tabs */}
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
          {/* ══════════ TAB 1 — HERO & HEADER ══════════ */}
          {activeTab === "hero" && (
            <div className={styles.sectionBlock}>
              <SectionHead title="Hero Image" />
              <ImageField label="Hero Banner Image" preview={previews.heroImage} onFile={handleImage("heroImage")} />
              <TextField label="Hero Image Alt Text" error={!!errors.heroImageAlt}>
                <input className={styles.input} placeholder="e.g. Yoga Students Group" {...register("heroImageAlt", { required: "Required" })} />
              </TextField>

              <div className={styles.formDivider} />
              <SectionHead title="Page Header" />

              <TextField label="Super Title" hint="Small text above the main title.">
                <input className={styles.input} placeholder="Reserve Your Sacred Journey" {...register("superTitle", { required: "Required" })} />
              </TextField>
              <TextField label="Main Title (H1)" error={!!errors.mainTitle}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("mainTitle", { required: "Required" })} />
              </TextField>
              <RichField
                control={control}
                name="headerDesc"
                label="Header Description"
                hint="Use the link button to add links like '200-hour yoga ttc'."
              />
            </div>
          )}

          {/* ══════════ TAB 2 — FEE & PAYPAL ══════════ */}
          {activeTab === "fee" && (
            <div className={styles.sectionBlock}>
              <SectionHead title="Registration Fee" />
              <TextField label="Section Title">
                <input className={styles.input} {...register("regFeeTitle", { required: "Required" })} />
              </TextField>
              <TextField label="Highlighted Amount (bold)" hint="Shown in bold inside the paragraph, e.g. [₹$100 (Advance Fee) + $10 (Paypal Charge)] = $110">
                <input className={styles.input} {...register("regFeeHighlight", { required: "Required" })} />
              </TextField>
              <TextField label="Description" hint="Write {highlight} where the bold amount should appear.">
                <textarea className={`${styles.input} ${styles.textarea}`} rows={5} {...register("regFeeText", { required: "Required" })} />
              </TextField>

              <div className={styles.formDivider} />
              <SectionHead title="Pay Via PayPal" badge={`${paypalArr.fields.length}/12`} />

              <TextField label="Section Title">
                <input className={styles.input} {...register("paypalTitle", { required: "Required" })} />
              </TextField>
              <ImageField label="PayPal Button Logo" preview={previews.paypalLogo} onFile={handleImage("paypalLogo")} hint="Image shown inside every PayPal button." />

              <div className={styles.itemsList}>
                {paypalArr.fields.map((f, i) => (
                  <div key={f.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>{i + 1}</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
                          <input className={styles.input} placeholder="🌿" {...register(`paypalOptions.${i}.icon`)} />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input className={styles.input} placeholder="Card title" {...register(`paypalOptions.${i}.title`, { required: true })} />
                        </div>
                      </div>
                      <div className={styles.inputWrap}>
                        <input className={styles.input} placeholder="PayPal link (https://…)" {...register(`paypalOptions.${i}.link`)} />
                      </div>
                    </div>
                    <button type="button" className={styles.removeItemBtn} onClick={() => paypalArr.remove(i)} disabled={paypalArr.fields.length <= 1}>✕</button>
                  </div>
                ))}
              </div>
              {paypalArr.fields.length < 12 && (
                <button type="button" className={styles.addBtn} onClick={() => paypalArr.append({ icon: "", title: "", link: "" })}>
                  + Add PayPal Option
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 3 — UPI & CARDS ══════════ */}
          {activeTab === "upi" && (
            <div className={styles.sectionBlock}>
              <SectionHead title="Pay via UPI" />
              <TextField label="Section Title">
                <input className={styles.input} {...register("upiTitle", { required: "Required" })} />
              </TextField>
              <div className={styles.twoCol}>
                <div>
                  <ImageField label="UPI QR Code 1" preview={previews.upiQr1} onFile={handleImage("upiQr1")} />
                  <TextField label="QR 1 Alt Text">
                    <input className={styles.input} {...register("upiQr1Alt")} />
                  </TextField>
                  <TextField label="UPI ID 1" hint="Copied by the first card's button.">
                    <input className={styles.input} placeholder="name@okhdfcbank" {...register("upiId", { required: "Required" })} />
                  </TextField>
                  <TextField label="Copy Button Label 1">
                    <input className={styles.input} placeholder="Copy UPI ID" {...register("upiCopyLabel")} />
                  </TextField>
                </div>
                <div>
                  <ImageField label="UPI QR Code 2 (branded)" preview={previews.upiQr2} onFile={handleImage("upiQr2")} />
                  <TextField label="QR 2 Alt Text">
                    <input className={styles.input} {...register("upiQr2Alt")} />
                  </TextField>
                  <TextField label="UPI ID 2" hint="Copied by the second card's button.">
                    <input className={styles.input} placeholder="name@okhdfcbank" {...register("upiId2", { required: "Required" })} />
                  </TextField>
                  <TextField label="Copy Button Label 2">
                    <input className={styles.input} placeholder="Copy UPI ID" {...register("upiCopyLabel2")} />
                  </TextField>
                </div>
              </div>

              <div className={styles.formDivider} />
              <SectionHead title="Debit / Credit Cards" badge={`${cardsArr.fields.length}/6`} />

              <div className={styles.twoCol}>
                <TextField label="Section Title">
                  <input className={styles.input} {...register("cardsTitle", { required: "Required" })} />
                </TextField>
                <TextField label="Button Label">
                  <input className={styles.input} placeholder="Book Now" {...register("cardsBtnLabel")} />
                </TextField>
              </div>

              {cardsArr.fields.map((f, i) => (
                <div key={f.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Card #{i + 1}</span>
                    <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={() => cardsArr.remove(i)} disabled={cardsArr.fields.length <= 1}>✕</button>
                  </div>
                  <div className={styles.twoCol}>
                    <TextField label="Badge (INR / USD / EUR)">
                      <input className={styles.input} {...register(`cards.${i}.badge`, { required: true })} />
                    </TextField>
                    <TextField label="Button Link">
                      <input className={styles.input} placeholder="https://…" {...register(`cards.${i}.link`)} />
                    </TextField>
                  </div>
                  <TextField label="Title">
                    <input className={styles.input} {...register(`cards.${i}.title`, { required: true })} />
                  </TextField>
                  <TextField label="Description">
                    <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register(`cards.${i}.desc`, { required: true })} />
                  </TextField>
                </div>
              ))}
              {cardsArr.fields.length < 6 && (
                <button type="button" className={styles.addBtn} onClick={() => cardsArr.append({ badge: "", title: "", desc: "", link: "" })}>
                  + Add Card Option
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 4 — BANK ══════════ */}
          {activeTab === "bank" && (
            <div className={styles.sectionBlock}>
              <SectionHead title="Direct Bank Transfer" badge={`${banksArr.fields.length}/4`} />
              <TextField label="Section Title">
                <input className={styles.input} {...register("bankTitle", { required: "Required" })} />
              </TextField>

              {banksArr.fields.map((f, i) => (
                <BankFields
                  key={f.id}
                  control={control}
                  register={register}
                  index={i}
                  onRemove={() => banksArr.remove(i)}
                  canRemove={banksArr.fields.length > 1}
                />
              ))}
              {banksArr.fields.length < 4 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    banksArr.append({
                      title: "",
                      fields: [
                        { label: "Account Holder", value: "" },
                        { label: "Account Number", value: "" },
                        { label: "Bank", value: "" },
                      ],
                    })
                  }
                >
                  + Add Bank Account
                </button>
              )}

              <div className={styles.formDivider} />
              <TextField label="GST Note (below bank cards)">
                <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("gstNoteOnline")} />
              </TextField>
            </div>
          )}

          {/* ══════════ TAB 5 — WESTERN & ARRIVAL ══════════ */}
          {activeTab === "arrival" && (
            <div className={styles.sectionBlock}>
              <SectionHead title="Western Union" />
              <TextField label="Section Title">
                <input className={styles.input} {...register("westernTitle", { required: "Required" })} />
              </TextField>
              <TextField label="Intro Text">
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("westernText")} />
              </TextField>
              <div className={styles.twoCol}>
                <TextField label="Send Fee To">
                  <input className={styles.input} {...register("westernSendTo")} />
                </TextField>
                <TextField label="Address of Recipient">
                  <input className={styles.input} {...register("westernAddress")} />
                </TextField>
              </div>
              <TextField label="Note">
                <textarea className={`${styles.input} ${styles.textarea}`} rows={4} {...register("westernNote")} />
              </TextField>

              <div className={styles.formDivider} />
              <SectionHead title="Payment on Arrival" badge={`${arrivalArr.fields.length}/10`} />
              <TextField label="Section Title">
                <input className={styles.input} {...register("arrivalTitle", { required: "Required" })} />
              </TextField>
              <TextField label="Intro Text">
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("arrivalIntro")} />
              </TextField>

              <div className={styles.itemsList}>
                {arrivalArr.fields.map((f, i) => (
                  <div key={f.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>{i + 1}</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ flex: 2 }}>
                          <input className={styles.input} placeholder="Method (e.g. PayPal Payment)" {...register(`arrivalMethods.${i}.method`, { required: true })} />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input className={styles.input} placeholder="Charge (e.g. 8% Extra Charge)" {...register(`arrivalMethods.${i}.charge`, { required: true })} />
                        </div>
                      </div>
                    </div>
                    <button type="button" className={styles.removeItemBtn} onClick={() => arrivalArr.remove(i)} disabled={arrivalArr.fields.length <= 1}>✕</button>
                  </div>
                ))}
              </div>
              {arrivalArr.fields.length < 10 && (
                <button type="button" className={styles.addBtn} onClick={() => arrivalArr.append({ method: "", charge: "" })}>
                  + Add Method
                </button>
              )}
              <p className={styles.fieldHint} style={{ marginTop: "0.6rem" }}>
                Tip: charge text containing "No" is shown in green (free), others in orange.
              </p>

              <TextField label="GST Note (below arrival methods)">
                <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("gstNoteArrival")} />
              </TextField>
            </div>
          )}

          {/* ══════════ TAB 6 — POLICIES ══════════ */}
          {activeTab === "policies" && (
            <div className={styles.sectionBlock}>
              <SectionHead title="Policies" badge={`${policiesArr.fields.length}/6`} />

              {policiesArr.fields.map((f, i) => (
                <div key={f.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Policy #{i + 1}</span>
                    <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={() => policiesArr.remove(i)} disabled={policiesArr.fields.length <= 1}>✕</button>
                  </div>
                  <div className={styles.itemFieldsRow}>
                    <div style={{ maxWidth: "110px" }}>
                      <TextField label="Icon">
                        <input className={styles.input} placeholder="📜" {...register(`policies.${i}.icon`)} />
                      </TextField>
                    </div>
                    <div style={{ flex: 1 }}>
                      <TextField label="Title">
                        <input className={styles.input} {...register(`policies.${i}.title`, { required: true })} />
                      </TextField>
                    </div>
                  </div>
                  <TextField label="Text">
                    <textarea className={`${styles.input} ${styles.textarea}`} rows={5} {...register(`policies.${i}.text`, { required: true })} />
                  </TextField>
                </div>
              ))}
              {policiesArr.fields.length < 6 && (
                <button type="button" className={styles.addBtn} onClick={() => policiesArr.append({ icon: "", title: "", text: "" })}>
                  + Add Policy
                </button>
              )}
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/yogacourse/payment-page" className={styles.cancelBtn}>← Cancel</Link>
            <div className={styles.actionsRight}>
              {activeTab !== tabOrder[0] && (
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
              {activeTab !== tabOrder[tabOrder.length - 1] ? (
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
                <button key="submit-btn" type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? (<><span className={styles.spinner} /> Saving…</>) : (<><span>✦</span> {isEdit ? "Update Section" : "Save Section"}</>)}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
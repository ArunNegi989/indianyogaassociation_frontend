"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import styles from "../../assets/style/Home/Howtoreach.module.css";

const WHATSAPP_NUMBER = "918476898395";
const WHATSAPP_MSG = encodeURIComponent(
  "Namaste !! I would like to arrange a Pickup / Drop service for Indian Yoga Association, Rishikesh. Please guide me on the pickup point details.",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

interface ScheduleRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

interface ScheduleTableProps {
  headers: string[];
  rows: ScheduleRow[];
}

interface TravelCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  desc: string;
  headers: string[];
  rows: ScheduleRow[];
  btnText: string;
  btnHref: string;
  linkText: string;
  linkHref: string;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  altPhone: string;
  pickupLocation: string;
  dropLocation: string;
  arrivalDate: string;
  arrivalTime: string;
  guests: string;
  instructions: string;
  serviceType: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  altPhone?: string;
  pickupLocation?: string;
  dropLocation?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  guests?: string;
  instructions?: string;
  serviceType?: string;
}

const flights: ScheduleRow[] = [
  { col1: "IndiGo", col2: "06:30 AM", col3: "07:30 AM", col4: "1h" },
  { col1: "Air India", col2: "09:15 AM", col3: "10:20 AM", col4: "1h 5m" },
  { col1: "Vistara", col2: "01:40 PM", col3: "02:45 PM", col4: "1h 5m" },
  { col1: "SpiceJet", col2: "05:55 PM", col3: "07:00 PM", col4: "1h 5m" },
];

const trains: ScheduleRow[] = [
  { col1: "Dehradun Shatabdi", col2: "06:45 AM", col3: "11:25 AM", col4: "Haridwar" },
  { col1: "Mussoorie Express", col2: "10:00 PM", col3: "05:30 AM", col4: "Haridwar" },
  { col1: "Jan Shatabdi Exp.", col2: "03:20 PM", col3: "09:00 PM", col4: "Haridwar" },
  { col1: "Nanda Devi Exp.", col2: "11:50 PM", col3: "05:10 AM", col4: "Haridwar" },
];

const buses: ScheduleRow[] = [
  { col1: "Volvo AC", col2: "06:00 AM", col3: "11:30 AM", col4: "AC" },
  { col1: "Sleeper Coach", col2: "09:00 PM", col3: "04:00 AM", col4: "Sleeper" },
  { col1: "AC Seater", col2: "02:00 PM", col3: "07:30 PM", col4: "AC" },
  { col1: "Deluxe Bus", col2: "11:00 PM", col3: "05:30 AM", col4: "Deluxe" },
];

const PlaneIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
  </svg>
);

const TrainIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C8 2 4 2.5 4 6v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2H18v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zm0 2c3.51 0 5.44.48 5.93 1H6.07C6.56 4.48 8.49 4 12 4zM6 9V7h5v2H6zm11 0h-5V7h5v2zm-1 7H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z" />
  </svg>
);

const BusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
  </svg>
);

const WhatsAppIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CarIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

function ScheduleTable({ headers, rows }: ScheduleTableProps): React.ReactElement {
  return (
    <div className={styles.scheduleTable}>
      <div className={styles.scheduleHeader}>
        {headers.map((h) => (
          <span key={h} className={styles.scheduleHeaderCell}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`${styles.scheduleRow} ${i % 2 !== 0 ? styles.scheduleRowAlt : ""}`}
        >
          {Object.values(row).map((cell, j) => (
            <span key={j} className={styles.scheduleCell}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function TravelCard({
  icon, title, subtitle, desc, headers, rows, btnText, btnHref, linkText, linkHref,
}: TravelCardProps): React.ReactElement {
  return (
    <article className={styles.travelCard}>
      <div className={styles.travelHeader}>
        <div className={styles.iconCircle} aria-hidden="true">{icon}</div>
        <div>
          <h3 className={styles.travelTitle}>{title}</h3>
          <p className={styles.travelSubtitle}>{subtitle}</p>
        </div>
      </div>
      <p className={styles.travelDesc} dangerouslySetInnerHTML={{ __html: desc }} />
      <ScheduleTable headers={headers} rows={rows} />
      <div className={styles.cardActions}>
        <a href={btnHref} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
          {btnText}
        </a>
        <a href={linkHref} className={styles.linkSecondary}>{linkText} →</a>
      </div>
    </article>
  );
}

const STEPS = ["Contact", "Journey", "Details"];

function StepIndicator({ current }: { current: number }): React.ReactElement {
  return (
    <div className={styles.stepIndicator}>
      {STEPS.map((label, i) => (
        <div key={i} className={styles.stepItem}>
          <div
            className={`${styles.stepCircle} ${i < current ? styles.stepDone : i === current ? styles.stepActive : styles.stepPending}`}
          >
            {i < current ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <span className={`${styles.stepLabel} ${i === current ? styles.stepLabelActive : ""}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`${styles.stepConnector} ${i < current ? styles.stepConnectorDone : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function PickupCard(): React.ReactElement {
  const [step, setStep] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [expanded, setExpanded] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    fullName: "", email: "", phone: "", altPhone: "",
    pickupLocation: "", dropLocation: "", arrivalDate: "",
    arrivalTime: "", guests: "", instructions: "", serviceType: "",
  });

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string): boolean => /^[0-9]{10}$/.test(phone);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};
    if (currentStep === 0) {
      if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
      else if (form.fullName.trim().length < 3) newErrors.fullName = "Name must be at least 3 characters";
      if (!form.email.trim()) newErrors.email = "Email address is required";
      else if (!validateEmail(form.email)) newErrors.email = "Please enter a valid email address";
      if (!form.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!validatePhone(form.phone)) newErrors.phone = "Please enter a valid 10-digit phone number";
      if (form.altPhone && !validatePhone(form.altPhone)) newErrors.altPhone = "Please enter a valid 10-digit phone number";
    }
    if (currentStep === 1) {
      if (!form.serviceType) newErrors.serviceType = "Please select a service type";
      if (!form.guests) newErrors.guests = "Number of guests is required";
      else {
        const n = parseInt(form.guests);
        if (isNaN(n) || n < 1) newErrors.guests = "Please enter at least 1 guest";
        else if (n > 50) newErrors.guests = "Maximum 50 guests allowed";
      }
    }
    if (currentStep === 2) {
      if (!form.arrivalDate) newErrors.arrivalDate = "Arrival date is required";
      else {
        const selected = new Date(form.arrivalDate);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (selected < today) newErrors.arrivalDate = "Arrival date cannot be in the past";
      }
      if (!form.arrivalTime) newErrors.arrivalTime = "Arrival time is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleNext = (): void => { if (validateStep(step)) setStep((s) => Math.min(s + 1, 2)); };
  const handleBack = (): void => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    let isValid = true;
    for (let i = 0; i <= 2; i++) {
      if (!validateStep(i)) { isValid = false; setStep(i); break; }
    }
    if (isValid) setSubmitted(true);
  };

  const handleReset = (): void => {
    setSubmitted(false); setStep(0); setExpanded(false); setErrors({});
    setForm({ fullName: "", email: "", phone: "", altPhone: "", pickupLocation: "", dropLocation: "", arrivalDate: "", arrivalTime: "", guests: "", instructions: "", serviceType: "" });
  };

  return (
    <article className={`${styles.travelCard} ${styles.pickupCard}`}>
      {/* Card header */}
      <div className={styles.travelHeader}>
        <div className={`${styles.iconCircle} ${styles.iconCirclePickup}`} aria-hidden="true">
          <CarIcon />
        </div>
        <div>
          <h3 className={styles.travelTitle}>Pickup &amp; Drop</h3>
          <p className={styles.travelSubtitle}>Comfortable transfer service</p>
        </div>
      </div>

      <p className={styles.travelDesc}>
        Book a <strong>hassle-free pickup or drop</strong> from Jolly Grant Airport,
        Haridwar / Rishikesh Railway Station or Bus Stand directly to Indian Yoga Association.
        Enjoy a smooth, comfortable, and stress-free journey with our reliable transport
        service, <strong>available 24/7 on request</strong>. Our professional drivers ensure
        timely pickups and safe drop-offs so you can begin your yoga journey with ease.
      </p>

      {/* Highlights */}
      <ul className={styles.pickupHighlights}>
        <li><span className={styles.highlightDot} />Airport · Railway · Bus Stand Transfers</li>
        <li><span className={styles.highlightDot} />Comfortable AC vehicles for a relaxing ride</li>
        <li><span className={styles.highlightDot} />Group bookings available for batches &amp; retreats</li>
        <li><span className={styles.highlightDot} />Instant WhatsApp confirmation &amp; coordination</li>
        <li><span className={styles.highlightDot} />Safe and reliable door-to-door service</li>
        <li><span className={styles.highlightDot} />Experienced and professional drivers</li>
      </ul>

      {/* Toggle to expand form */}
      {!expanded && !submitted && (
        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setExpanded(true)}
          >
            Book Pickup / Drop
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waInlineBtn}
          >
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>
      )}

      {/* Expanded form */}
      {expanded && !submitted && (
        <div className={styles.pickupFormInCard}>
          <StepIndicator current={step} />
          <form onSubmit={handleSubmit} noValidate>

            {/* STEP 0 */}
            {step === 0 && (
              <div className={styles.formStep}>
                <div className={styles.formStepHeader}>
                  <span className={styles.formStepNum}>01</span>
                  <div>
                    <h4 className={styles.formStepTitle}>Contact Details</h4>
                    <p className={styles.formStepDesc}>We'll use these to confirm your transfer</p>
                  </div>
                </div>
                <div className={styles.formRowCard}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-fullName">
                      Full Name <span className={styles.required}>*</span>
                    </label>
                    <input id="pc-fullName" name="fullName" type="text" required placeholder="e.g. Arjun Sharma"
                      className={`${styles.formInput} ${errors.fullName ? styles.formInputError : ""}`}
                      value={form.fullName} onChange={handleChange} />
                    {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-email">
                      Email <span className={styles.required}>*</span>
                    </label>
                    <input id="pc-email" name="email" type="email" required placeholder="your@email.com"
                      className={`${styles.formInput} ${errors.email ? styles.formInputError : ""}`}
                      value={form.email} onChange={handleChange} />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-phone">
                      Phone <span className={styles.required}>*</span>
                    </label>
                    <input id="pc-phone" name="phone" type="tel" required placeholder="+91 XXXXX XXXXX"
                      className={`${styles.formInput} ${errors.phone ? styles.formInputError : ""}`}
                      value={form.phone} onChange={handleChange} />
                    {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-altPhone">Alternate Phone</label>
                    <input id="pc-altPhone" name="altPhone" type="tel" placeholder="+91 XXXXX XXXXX"
                      className={`${styles.formInput} ${errors.altPhone ? styles.formInputError : ""}`}
                      value={form.altPhone} onChange={handleChange} />
                    {errors.altPhone && <span className={styles.errorMessage}>{errors.altPhone}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className={styles.formStep}>
                <div className={styles.formStepHeader}>
                  <span className={styles.formStepNum}>02</span>
                  <div>
                    <h4 className={styles.formStepTitle}>Journey Info</h4>
                    <p className={styles.formStepDesc}>Tell us where and when to pick you up</p>
                  </div>
                </div>
                <div className={styles.formRowCard}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-serviceType">
                      Service Type <span className={styles.required}>*</span>
                    </label>
                    <select id="pc-serviceType" name="serviceType" required
                      className={`${styles.formSelect} ${errors.serviceType ? styles.formInputError : ""}`}
                      value={form.serviceType} onChange={handleChange}>
                      <option value="">Select service…</option>
                      <option>Airport Pickup</option>
                      <option>Airport Drop</option>
                      <option>Railway Pickup</option>
                      <option>Bus Stand Pickup</option>
                      <option>Both Pickup &amp; Drop</option>
                    </select>
                    {errors.serviceType && <span className={styles.errorMessage}>{errors.serviceType}</span>}
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-pickupLocation">Pickup Location</label>
                    <select id="pc-pickupLocation" name="pickupLocation" className={styles.formSelect}
                      value={form.pickupLocation} onChange={handleChange}>
                      <option value="">Select location…</option>
                      <option>Jolly Grant Airport (Dehradun)</option>
                      <option>Haridwar Railway Station</option>
                      <option>Rishikesh Railway Station</option>
                      <option>Rishikesh Bus Stand</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-dropLocation">Drop Location</label>
                    <input id="pc-dropLocation" name="dropLocation" type="text"
                      placeholder="e.g. Indian Yoga Association"
                      className={styles.formInput} value={form.dropLocation} onChange={handleChange} />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-guests">
                      No. of Guests <span className={styles.required}>*</span>
                    </label>
                    <input id="pc-guests" name="guests" type="number" min="1" max="50" required
                      placeholder="e.g. 2"
                      className={`${styles.formInput} ${errors.guests ? styles.formInputError : ""}`}
                      value={form.guests} onChange={handleChange} />
                    {errors.guests && <span className={styles.errorMessage}>{errors.guests}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className={styles.formStep}>
                <div className={styles.formStepHeader}>
                  <span className={styles.formStepNum}>03</span>
                  <div>
                    <h4 className={styles.formStepTitle}>Arrival &amp; Requests</h4>
                    <p className={styles.formStepDesc}>Almost done — a few final details</p>
                  </div>
                </div>
                <div className={styles.formRowCard}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-arrivalDate">
                      Arrival Date <span className={styles.required}>*</span>
                    </label>
                    <input id="pc-arrivalDate" name="arrivalDate" type="date" required
                      className={`${styles.formInput} ${errors.arrivalDate ? styles.formInputError : ""}`}
                      value={form.arrivalDate} onChange={handleChange} />
                    {errors.arrivalDate && <span className={styles.errorMessage}>{errors.arrivalDate}</span>}
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="pc-arrivalTime">
                      Arrival Time <span className={styles.required}>*</span>
                    </label>
                    <input id="pc-arrivalTime" name="arrivalTime" type="time" required
                      className={`${styles.formInput} ${errors.arrivalTime ? styles.formInputError : ""}`}
                      value={form.arrivalTime} onChange={handleChange} />
                    {errors.arrivalTime && <span className={styles.errorMessage}>{errors.arrivalTime}</span>}
                  </div>
                  <div className={`${styles.formField} ${styles.formFieldSpan2}`}>
                    <label className={styles.formLabel} htmlFor="pc-instructions">Special Instructions</label>
                    <textarea id="pc-instructions" name="instructions"
                      placeholder="Accessibility needs, extra luggage, dietary preferences…"
                      className={styles.formTextarea} value={form.instructions} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <p className={styles.summaryTitle}>📋 Booking Summary</p>
                  <div className={styles.summaryGrid}>
                    <span className={styles.summaryKey}>Name</span>
                    <span className={styles.summaryVal}>{form.fullName || "—"}</span>
                    <span className={styles.summaryKey}>Service</span>
                    <span className={styles.summaryVal}>{form.serviceType || "—"}</span>
                    <span className={styles.summaryKey}>From</span>
                    <span className={styles.summaryVal}>{form.pickupLocation || "—"}</span>
                    <span className={styles.summaryKey}>Guests</span>
                    <span className={styles.summaryVal}>{form.guests || "—"}</span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.formNav}>
              <button type="button" className={styles.navBtnBack}
                onClick={() => { if (step === 0) { setExpanded(false); setErrors({}); } else handleBack(); }}>
                ← {step === 0 ? "Cancel" : "Back"}
              </button>
              <div className={styles.formNavRight}>
                {step < 2 ? (
                  <button type="button" className={styles.navBtnNext} onClick={handleNext}>
                    Continue →
                  </button>
                ) : (
                  <button type="submit" className={styles.navBtnSubmit}>
                    Confirm Booking 🙏
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className={styles.waStrip}>
            <div className={styles.waStripLeft}>
              <WhatsAppIcon />
              <span>Prefer to chat? Connect on WhatsApp</span>
            </div>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.waStripBtn}>
              Open WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Success state */}
      {submitted && (
        <div className={styles.successState}>
          <div className={styles.successIcon}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h4 className={styles.successTitle}>Request Received!</h4>
          <p className={styles.successMsg}>
            Namaste, <strong>{form.fullName}</strong>! 🙏 Your pickup request has been submitted.
            Our team will reach out on <strong>{form.phone}</strong> to confirm.
          </p>
          <div className={styles.successActions}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.successWa}>
              <WhatsAppIcon /> Follow up on WhatsApp
            </a>
            <button className={styles.successReset} onClick={handleReset}>Submit Another</button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function HowToReach(): React.ReactElement {
  return (
    <section
      className={styles.reachSection}
      aria-label="How to Reach Indian Yoga Association"
      id="how-to-reach"
    >
      <div className={styles.omWatermark} aria-hidden="true">ॐ</div>
      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ── Header ── */}
        <div className={styles.headerWrap}>
          <span className={styles.badge}>✦ Travel Guide</span>
          <h2 className={styles.mainTitle}>How to Reach Us</h2>
          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
          <p className={styles.subTitle}>
            Easy &amp; Comfortable Travel Options to Reach{" "}
            <strong>Indian Yoga Association</strong> in Rishikesh — Delhi to
            Rishikesh travel options by air, train &amp; bus.
          </p>
        </div>

        {/* ── ROW 1: 3 travel cards ── */}
        <div className={styles.cardsGrid}>
          <TravelCard
            icon={<PlaneIcon />}
            title="By Airways"
            subtitle="Fastest Way to Reach Rishikesh"
            desc="Fly from Delhi (Indira Gandhi International Airport) to <strong>Jolly Grant Airport, Dehradun</strong> — approximately 20 km from Rishikesh. Taxis and private transfers are easily available. Indian Yoga Association provides pickup &amp; drop facility on request. Smooth and comfortable journey assured. Advance booking recommended for convenience."
            headers={["Airline", "Departs", "Arrives", "Duration"]}
            rows={flights}
            btnText="Check Flights on MakeMyTrip"
            btnHref="https://www.makemytrip.com/flights/"
            linkText="More Air Travel Details"
            linkHref="#air-details"
          />
          <TravelCard
            icon={<TrainIcon />}
            title="By Train"
            subtitle="Affordable & Comfortable"
            desc="Travel from New Delhi Railway Station to Rishikesh or <strong>Haridwar Junction</strong> (25 km from Rishikesh). Taxis and auto-rickshaws are always available for the onward journey to Indian Yoga Association, Rishikesh. Comfortable travel options available anytime.You can also opt for buses and private cabs for a smooth and affordable journey."
            headers={["Train", "Departs", "Arrives", "Via"]}
            rows={trains}
            btnText="Book Train on IRCTC"
            btnHref="https://www.irctc.co.in/"
            linkText="More Train Travel Details"
            linkHref="#train-details"
          />
          <TravelCard
            icon={<BusIcon />}
            title="By Bus"
            subtitle="Budget Friendly Option"
            desc="Regular <strong>Volvo, AC and sleeper buses</strong> operate daily from Delhi to Rishikesh. Travel time is approximately 5–6 hours via scenic NH58, passing through the beautiful Shivalik foothills. Comfortable and budget-friendly travel option. Multiple departures available throughout the day. Easy booking options available online."
            headers={["Bus", "Departs", "Arrives", "Type"]}
            rows={buses}
            btnText="Book Bus on RedBus"
            btnHref="https://www.redbus.in/"
            linkText="More Bus Travel Details"
            linkHref="#bus-details"
          />
        </div>

        {/* ── ROW 2: Pickup card (left) + Map (right) ── */}
        <div className={styles.bottomRow}>

          {/* Pickup & Drop card with embedded booking form */}
          <PickupCard />

          {/* Map */}
          <div className={styles.mapCard}>
            <div className={styles.mapLabel}>
              <span className={styles.mapLabelDot} />
              <span>Indian Yoga Association, Rishikesh</span>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7440.500180811323!2d78.320039!3d30.132348!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909165c44bab785%3A0x4119a3fa1806f00c!2sAYM%20YOGA%20SCHOOL!5e1!3m2!1sen!2sin!4v1771998100416!5m2!1sen!2sin"
              className={styles.mapIframe}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Indian Yoga Association Location Rishikesh"
            />
            <div className={styles.mapFooter}>
              <a
                href="https://maps.google.com/?q=Indian+Yoga+Association+Rishikesh"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapDirectionsBtn}
              >
                ↗ Get Directions
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.bottomBorder} />
    </section>
  );
}
"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../../assets/style/Contact-us/ContactPage.module.css";
import HowToReach from "@/components/home/Howtoreach";

/* ─── Types ─── */
interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  course: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

/* ─── Info items data ─── */
const INFO_ITEMS = [
  {
    icon: "🏫",
    title: "Our Ashram",
    text: "Upper Tapovan, Rishikesh\nUttarakhand – 249192, India",
  },
  { icon: "📞", title: "Official Phone", text: "+91 75002 77709" },
  { icon: "✉️", title: "Email Address", text: "aymindia@gmail.com" },
  {
    icon: "🕘",
    title: "Office Hours",
    text: "9:00 AM – 6:00 PM (IST)\nMonday to Saturday",
  },
];

/* ─── Social links ─── */
const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: "f" },
  { label: "Instagram", href: "https://instagram.com", icon: "✦" },
  { label: "YouTube", href: "https://youtube.com", icon: "▶" },
  { label: "WhatsApp", href: "https://wa.me/917500277709", icon: "W" },
];

/* ─── Course options ─── */
const COURSES = [
  "100 Hours TTC",
  "200 Hours TTC",
  "300 Hours TTC",
  "500 Hours TTC",
  "kundalini Yoga",
  "yoga teacher training in Rishikesh",
  "prenatal Yoga",
  "vinyasa Yoga",
  "yoga teacher in india",
   "Hatha Yoga",
   "yoga teacher training in Goa",
    "Ayurveda Course",
  "Yoga Retreat",
  "Online Course",
  "General Inquiry",
 
];

/* ─── Validate ─── */
function validate(form: FormState): FormErrors {
  const errs: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 3)
    errs.name = "Please enter your full name (min 3 chars)";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Please enter a valid email address";
  if (form.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone))
    errs.phone = "Please enter a valid phone number";
  if (!form.subject.trim())
    errs.subject = "Please enter a subject";
  if (!form.message.trim() || form.message.trim().length < 10)
    errs.message = "Message must be at least 10 characters";
  return errs;
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════ */
const ContactPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    course: "General Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [charCount, setCharCount] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  /* Scroll to success msg */
  useEffect(() => {
    if (status === "success" && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            subject: form.subject,
            course: form.course,
            message: form.message,
          }),
        }
      );

      if (!res.ok) throw new Error("Server error");

      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", course: "General Inquiry", message: "" });
      setCharCount(0);
    } catch {
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrors({});
    setForm({ name: "", email: "", phone: "", subject: "", course: "General Inquiry", message: "" });
    setCharCount(0);
  };

  /* ─── RENDER ─── */
  return (
    <div className={styles.page}>
      {/* Corner ornaments */}
      <span className={`${styles.cornerOrnament} ${styles.tl}`}>❧</span>
      <span className={`${styles.cornerOrnament} ${styles.tr}`}>❧</span>
      <span className={`${styles.cornerOrnament} ${styles.bl}`}>❧</span>
      <span className={`${styles.cornerOrnament} ${styles.br}`}>❧</span>

      <div className={styles.frame} />
      <div className={styles.watermark}>ॐ</div>

      {/* ══ TOP BAND ══ */}
      <div className={styles.topBand}>
        <div className={styles.topBandInner}>
          <div className={styles.schoolName}>AYM Yoga School</div>
          <div className={styles.tagline}>
            Indian Yoga Association · Est. Rishikesh, Uttarakhand
          </div>
          <div className={styles.topBandDivider}>
            <span className={styles.topBandLine} />
            <span className={styles.topBandGem}>◆</span>
            <span className={styles.topBandLine} />
          </div>
        </div>
      </div>

      {/* ══ INNER ══ */}
      <div className={styles.inner}>

        {/* Ornate divider */}
        <div className={styles.ornateDivider}>
          <span className={styles.divLine} />
          <span className={styles.diamond}>◆</span>
          <span className={styles.omGlyph}>ॐ</span>
          <span className={styles.diamond}>◆</span>
          <span className={styles.divLine} />
        </div>

        {/* Section heading */}
        <div className={styles.sectionHead}>
          <h1 className={styles.sectionTitle}>Reach Out to Us</h1>
          <p className={styles.sectionSubtitle}>
            The Indian Yoga Association, also known as the Association for Yoga and Meditation, is a national non-profit organisation registered under the Societies Registration Act with the Government of India. The Association manages the AYM Yoga School, which offers teacher training programs in Rishikesh, Goa, and many other locations, coming soon. It is registered with the Yoga Certification Board, under the Ministry of AYUSH, Government of India and Yoga Alliance, USA.
          </p>
        </div>

        {/* ══ HERO STATS BAR ══ */}
        <div className={styles.statsBar}>
          {[
            { num: "5000+", label: "Students Trained" },
            { num: "25+", label: "Years of Excellence" },
            { num: "40+", label: "Countries Reached" },
            { num: "24h", label: "Response Time" },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className={styles.mainGrid}>

          {/* ── LEFT: INFO PANEL ── */}
          <div className={styles.infoPanel}>
            {/* Decorative scroll top */}
            <div className={styles.scrollTop}>
              <div className={styles.scrollTopLine} />
              <span className={styles.scrollTopText}>Connect With Us</span>
              <div className={styles.scrollTopLine} />
            </div>

            {/* Contact info items */}
            <div className={styles.infoList}>
              {INFO_ITEMS.map((item) => (
                <div key={item.title} className={styles.infoItem}>
                  <div className={styles.infoIconWrap}>
                    <span className={styles.infoIcon}>{item.icon}</span>
                  </div>
                  <div className={styles.infoContent}>
                    <h4 className={styles.infoTitle}>{item.title}</h4>
                    <p className={styles.infoText}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className={styles.infoDivider}>
              <span className={styles.infoDivLine} />
              <span className={styles.infoDivGem}>✦</span>
              <span className={styles.infoDivLine} />
            </div>

            {/* Social Links */}
            <div className={styles.socialsWrap}>
              <p className={styles.socialsLabel}>Follow Our Journey</p>
              <div className={styles.socialsList}>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Testimonial snippet */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialQuote}>"</div>
              <p className={styles.testimonialText}>
                The team at AYM responded within hours and guided me through the
                entire enrollment process. Truly a life-changing experience.
              </p>
              <div className={styles.testimonialAuthor}>
                <span className={styles.testimonialName}>— Yogi Chetan Mahesh.</span>
                <span className={styles.testimonialOrigin}>Rishikesh ,India</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: CONTACT FORM ── */}
          <div className={styles.formPanel}>
            <div className={styles.formPanelHeader}>
              <h2 className={styles.formTitle}>Send Us a Message</h2>
              <p className={styles.formSubtitle}>
                Fill in the details below — we reply within 24 hours
              </p>
            </div>

            {/* SUCCESS STATE */}
            {status === "success" && (
              <div className={styles.successBox} ref={successRef}>
                <div className={styles.successIconWrap}>
                  <span className={styles.successIconSymbol}>🙏</span>
                </div>
                <h3 className={styles.successTitle}>
                  Namaste! Message Received.
                </h3>
                <p className={styles.successMsg}>
                  Thank you for reaching out. A confirmation has been sent to your
                  email. Our team shall connect with you within 24 hours.
                </p>
                <div className={styles.successDetails}>
                  <span className={styles.successDetailTag}>✓ Email Confirmation Sent</span>
                  <span className={styles.successDetailTag}>✓ Team Notified</span>
                </div>
                <button
                  className={styles.successResetBtn}
                  onClick={handleReset}
                  type="button"
                >
                  ✦ Send Another Message ✦
                </button>
              </div>
            )}

            {/* ERROR STATE */}
            {status === "error" && (
              <div className={styles.errorBanner}>
                <span>⚠️</span>
                <span>
                  Something went wrong. Please try again or reach us on WhatsApp.
                </span>
                <button
                  onClick={() => setStatus("idle")}
                  className={styles.errorDismiss}
                  type="button"
                >
                  ✕
                </button>
              </div>
            )}

            {/* FORM */}
            {status !== "success" && (
              <form
                onSubmit={handleSubmit}
                noValidate
                className={styles.form}
                aria-label="Contact form"
              >
                {/* Row 1: Name + Email */}
                <div className={styles.formRow}>
                  <div className={`${styles.formField} ${focusedField === "name" ? styles.formFieldFocused : ""}`}>
                    <label className={styles.formLabel} htmlFor="ct-name">
                      Full Name <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>✦</span>
                      <input
                        id="ct-name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        className={`${styles.formInput} ${errors.name ? styles.formInputError : ""}`}
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        required
                        aria-describedby={errors.name ? "name-err" : undefined}
                      />
                    </div>
                    {errors.name && (
                      <span id="name-err" className={styles.fieldError} role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.formField} ${focusedField === "email" ? styles.formFieldFocused : ""}`}>
                    <label className={styles.formLabel} htmlFor="ct-email">
                      Email Address <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>✉</span>
                      <input
                        id="ct-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className={`${styles.formInput} ${errors.email ? styles.formInputError : ""}`}
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        required
                        aria-describedby={errors.email ? "email-err" : undefined}
                      />
                    </div>
                    {errors.email && (
                      <span id="email-err" className={styles.fieldError} role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone + Course */}
                <div className={styles.formRow}>
                  <div className={`${styles.formField} ${focusedField === "phone" ? styles.formFieldFocused : ""}`}>
                    <label className={styles.formLabel} htmlFor="ct-phone">
                      Phone Number <span className={styles.optional}>(optional)</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>☎</span>
                      <input
                        id="ct-phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className={`${styles.formInput} ${errors.phone ? styles.formInputError : ""}`}
                        value={form.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    {errors.phone && (
                      <span className={styles.fieldError} role="alert">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.formField} ${focusedField === "course" ? styles.formFieldFocused : ""}`}>
                    <label className={styles.formLabel} htmlFor="ct-course">
                      Interested Course
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>☸</span>
                      <select
                        id="ct-course"
                        name="course"
                        className={styles.formSelect}
                        value={form.course}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("course")}
                        onBlur={() => setFocusedField(null)}
                      >
                        {COURSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subject full-width */}
                <div className={`${styles.formField} ${focusedField === "subject" ? styles.formFieldFocused : ""}`}>
                  <label className={styles.formLabel} htmlFor="ct-subject">
                    Subject <span className={styles.req}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>✎</span>
                    <input
                      id="ct-subject"
                      name="subject"
                      type="text"
                      placeholder="How can we help you?"
                      className={`${styles.formInput} ${errors.subject ? styles.formInputError : ""}`}
                      value={form.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                  {errors.subject && (
                    <span className={styles.fieldError} role="alert">
                      {errors.subject}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className={`${styles.formField} ${focusedField === "message" ? styles.formFieldFocused : ""}`}>
                  <label className={styles.formLabel} htmlFor="ct-message">
                    Your Message <span className={styles.req}>*</span>
                  </label>
                  <div className={styles.textareaWrapper}>
                    <textarea
                      id="ct-message"
                      name="message"
                      rows={6}
                      placeholder="Write your message here — tell us about your yoga journey goals, questions, or anything else…"
                      className={`${styles.formTextarea} ${errors.message ? styles.formInputError : ""}`}
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <span className={styles.charCount}>{charCount} chars</span>
                  </div>
                  {errors.message && (
                    <span className={styles.fieldError} role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`${styles.submitBtn} ${status === "sending" ? styles.submitBtnSending : ""}`}
                  disabled={status === "sending"}
                  aria-busy={status === "sending"}
                >
                  {status === "sending" ? (
                    <span className={styles.sendingContent}>
                      <span className={styles.sendingDot} />
                      <span className={styles.sendingDot} />
                      <span className={styles.sendingDot} />
                      <span>Sending your message…</span>
                    </span>
                  ) : (
                    <span>✦ Send Message ✦</span>
                  )}
                </button>

                <p className={styles.formNote}>
                  🔒 Your information is private and will never be shared.
                </p>
              </form>
            )}
          </div>
        </div>

       

        {/* Bottom ornate divider */}
        <div className={styles.ornateDivider} style={{ marginTop: "2.5rem" }}>
          <span className={styles.divLine} />
          <span className={styles.diamond}>◆</span>
          <span className={styles.omGlyph}>ॐ</span>
          <span className={styles.diamond}>◆</span>
          <span className={styles.divLine} />
        </div>
      </div>
      {/* /inner */}

      {/* ══ FOOTER BAND ══ */}
      <div className={styles.footerBand}>
        <p>
          The Indian Yoga Association · Registered under Societies Registration
          Act · Affiliated with Yoga Certification Board, Ministry of AYUSH,
          Govt. of India
        </p>
      </div>

      <HowToReach />
    </div>
  );
};

export default ContactPage;
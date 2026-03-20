"use client";
import React, { useState } from "react";
import styles from "@/assets/style/yoga-registration/Registerform.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

const howDidYouKnow = [
  "Google / Internet",
  "Social Media (Facebook / Instagram)",
  "YouTube",
  "Friend / Family Referral",
  "Travel Agent",
  "Blog / Article",
  "Other",
];

const yogaCourses = [
  "Yoga Retreats",
  "100 Hour Yoga TTC",
  "200 Hour Yoga TTC",
  "300 Hour Yoga TTC",
  "500 Hour Yoga TTC",
  "Prenatal Yoga TTC",
  "Online Yoga Course",
  "Yoga Wellness Instructor",
  "Yoga Teacher and Evaluator",
  "Yoga Master",
];

const locations = [
  "Please Select Location",
  "Rishikesh, India",
  "Online (Live)",
  "Online (Recorded)",
];

const chakraColors = [
  { name: "Muladhara",    color: "#c62828", label: "Root"      },
  { name: "Svadhisthana", color: "#e65100", label: "Sacral"    },
  { name: "Manipura",     color: "#f9a825", label: "Solar"     },
  { name: "Anahata",      color: "#2e7d32", label: "Heart"     },
  { name: "Vishuddha",    color: "#1565c0", label: "Throat"    },
  { name: "Ajna",         color: "#4527a0", label: "Third Eye" },
  { name: "Sahasrara",    color: "#6a1b9a", label: "Crown"     },
];

const INITIAL_FORM = {
  fullName:    "",
  email:       "",
  phone:       "",
  birthDate:   "",
  nationality: "",
  country:     "",
  address:     "",
  howKnow:     "Google / Internet",
  course:      "Yoga Retreats",
  startDate:   "",
  endDate:     "",
  location:    "Please Select Location",
  coupon:      "",
};

export default function RegisterForm() {
  const [gender, setGender]             = useState("Male");
  const [formData, setFormData]         = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.post("/email/send-email", { ...formData, gender });

      if (res.data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setGender("Male");
          setFormData(INITIAL_FORM);
        }, 2800);
      } else {
        alert("Failed ❌");
      }
    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.page}>

        {/* Fixed mandala background */}
        <div className={styles.bgMandala} aria-hidden="true">
          <svg viewBox="0 0 600 600">
            <g fill="none" stroke="#e07b00" strokeWidth="0.6" opacity="0.06">
              {[40, 80, 120, 160, 200, 240, 280].map((r, i) => (
                <circle key={i} cx="300" cy="300" r={r} />
              ))}
              {Array.from({ length: 48 }, (_, i) => {
                const a = (((i * 360) / 48) * Math.PI) / 180;
                return <line key={i} x1="300" y1="300" x2={300 + 280 * Math.cos(a)} y2={300 + 280 * Math.sin(a)} />;
              })}
              {[80, 160, 240].map((r, i) => (
                <polygon key={i} points={Array.from({ length: 12 }, (_, j) => {
                  const a = (((j * 360) / 12) * Math.PI) / 180;
                  return `${300 + r * Math.cos(a)},${300 + r * Math.sin(a)}`;
                }).join(" ")} />
              ))}
            </g>
          </svg>
        </div>

        <div className={styles.wrapper}>

          {/* ════ LEFT PANEL ════ */}
          <div className={styles.leftPanel}>
            <div className={styles.panelMandala} aria-hidden="true">
              <svg viewBox="0 0 400 400">
                <g fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1">
                  {[40, 80, 120, 160, 195].map((r, i) => (
                    <circle key={i} cx="200" cy="200" r={r} />
                  ))}
                  {Array.from({ length: 36 }, (_, i) => {
                    const a = (((i * 360) / 36) * Math.PI) / 180;
                    return <line key={i} x1="200" y1="200" x2={200 + 195 * Math.cos(a)} y2={200 + 195 * Math.sin(a)} />;
                  })}
                  {[80, 140].map((r, i) => (
                    <polygon key={i} points={Array.from({ length: 8 }, (_, j) => {
                      const a = (((j * 360) / 8) * Math.PI) / 180;
                      return `${200 + r * Math.cos(a)},${200 + r * Math.sin(a)}`;
                    }).join(" ")} />
                  ))}
                </g>
                <text x="200" y="215" textAnchor="middle" fontSize="52"
                  fill="rgba(255,255,255,0.18)" fontFamily="serif">ॐ</text>
              </svg>
            </div>

            <div className={styles.leftBgImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=900&q=80&fit=crop"
                alt="Yoga Teacher Training Rishikesh"
                className={styles.leftImg}
              />
            </div>
            <div className={styles.leftOverlay} />

            <div className={styles.leftContent}>
              <div className={styles.leftOm}>ॐ</div>
              <h2 className={styles.leftTitle}>
                Begin Your<br />
                <span className={styles.leftTitleAccent}>Sacred Journey</span>
              </h2>
              <div className={styles.leftDivider}>
                <span /><span className={styles.leftDivLine} /><span />
              </div>
              <p className={styles.leftSub}>
                AYM Yoga School · Rishikesh, India<br />
                <em>The Yoga Capital of the World</em>
              </p>

              <div className={styles.chakraStrip}>
                {chakraColors.map((c, i) => (
                  <div key={i} className={styles.chakraItem}
                    style={{ "--chakra-color": c.color } as React.CSSProperties}>
                    <div className={styles.chakraDot}>
                      <svg viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke={c.color} strokeWidth="1.2" opacity="0.8" />
                        <circle cx="20" cy="20" r="12" fill="none" stroke={c.color} strokeWidth="0.8" opacity="0.5" />
                        <circle cx="20" cy="20" r="6"  fill={c.color} opacity="0.7" />
                        {Array.from({ length: 8 }, (_, j) => {
                          const a = (((j * 360) / 8) * Math.PI) / 180;
                          const x1 = 20 + 12 * Math.cos(a), y1 = 20 + 12 * Math.sin(a);
                          const x2 = 20 + 17 * Math.cos(a), y2 = 20 + 17 * Math.sin(a);
                          return <line key={j} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.color} strokeWidth="1" opacity="0.6" />;
                        })}
                      </svg>
                    </div>
                    <span className={styles.chakraLabel}>{c.label}</span>
                  </div>
                ))}
              </div>

              <div className={styles.leftBadges}>
                <span className={styles.leftBadge}>Yoga Alliance USA</span>
                <span className={styles.leftBadge}>Ministry of AYUSH</span>
                <span className={styles.leftBadge}>YCB Certified</span>
              </div>
            </div>
          </div>

          {/* ════ RIGHT PANEL — Form ════ */}
          <div className={styles.rightPanel}>
            <div className={styles.formHeader}>
              <div className={styles.cornerMandala} aria-hidden="true">
                <svg viewBox="0 0 80 80">
                  <g fill="none" stroke="#e07b00" strokeWidth="0.8" opacity="0.4">
                    {[15, 25, 35].map((r, i) => <circle key={i} cx="0" cy="0" r={r} />)}
                    {Array.from({ length: 12 }, (_, i) => {
                      const a = (((i * 360) / 12) * Math.PI) / 180;
                      return <line key={i} x1="0" y1="0" x2={35 * Math.cos(a)} y2={35 * Math.sin(a)} />;
                    })}
                  </g>
                </svg>
              </div>
              <div className={`${styles.cornerMandala} ${styles.cornerMandalaRight}`} aria-hidden="true">
                <svg viewBox="0 0 80 80">
                  <g fill="none" stroke="#e07b00" strokeWidth="0.8" opacity="0.4">
                    {[15, 25, 35].map((r, i) => <circle key={i} cx="80" cy="0" r={r} />)}
                    {Array.from({ length: 12 }, (_, i) => {
                      const a = (((i * 360) / 12) * Math.PI) / 180;
                      return <line key={i} x1="80" y1="0" x2={80 + 35 * Math.cos(a)} y2={35 * Math.sin(a)} />;
                    })}
                  </g>
                </svg>
              </div>

              <h1 className={styles.formTitle}>
                Yoga Teacher Training Courses - Join Now!
              </h1>
              <div className={styles.formTitleUnderline} />
              <p className={styles.formSubtitle}>
                Secure your spot in our invigorating yoga classes today! Join our vibrant community
                of wellness enthusiasts and unlock the countless physical and mental benefits of yoga.
                Don&apos;t miss out – register now and embark on your journey to a healthier, more balanced life.
              </p>
            </div>

            <div className={styles.formBody}>

              {/* Full Name */}
              <div className={styles.fieldFull}>
                <label className={styles.label}>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName}
                  onChange={handleChange} placeholder="Enter full name" className={styles.input} />
              </div>

              {/* Email */}
              <div className={styles.fieldFull}>
                <label className={styles.label}>Email Address</label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Enter email address" className={styles.input} />
              </div>

              {/* Phone + Birth Date */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone}
                    onChange={handleChange} placeholder="Enter phone number" className={styles.input} />
                </div>
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Birth Date</label>
                  <input type="date" name="birthDate" value={formData.birthDate}
                    onChange={handleChange} className={styles.input} />
                </div>
              </div>

              {/* Gender */}
              <div className={styles.fieldFull}>
                <label className={styles.label}>Gender</label>
                <div className={styles.radioGroup}>
                  {["Male", "Female", "Prefer not to say"].map(g => (
                    <label key={g} className={styles.radioLabel}>
                      <input type="radio" name="gender" value={g}
                        checked={gender === g} onChange={() => setGender(g)} className={styles.radioInput} />
                      <span className={styles.radioCustom} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              {/* Nationality + Country */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Nationality</label>
                  <input type="text" name="nationality" value={formData.nationality}
                    onChange={handleChange} placeholder="Enter nationality" className={styles.input} />
                </div>
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Country</label>
                  <input type="text" name="country" value={formData.country}
                    onChange={handleChange} placeholder="Enter country" className={styles.input} />
                </div>
              </div>

              {/* Address */}
              <div className={styles.fieldFull}>
                <label className={styles.label}>Address</label>
                <input type="text" name="address" value={formData.address}
                  onChange={handleChange} placeholder="Enter street address" className={styles.input} />
              </div>

              {/* How did you know */}
              <div className={styles.fieldFull}>
                <label className={styles.label}>How did you know about AYM Yoga School?</label>
                <div className={styles.selectWrap}>
                  <select name="howKnow" value={formData.howKnow}
                    onChange={handleChange} className={styles.select}>
                    {howDidYouKnow.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>

              {/* Course */}
              <div className={styles.fieldFull}>
                <label className={styles.label}>Yoga Course Applied</label>
                <div className={styles.selectWrap}>
                  <select name="course" value={formData.course}
                    onChange={handleChange} className={styles.select}>
                    {yogaCourses.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>

              {/* Start Date + End Date */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Course Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate}
                    onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Course End Date</label>
                  <input type="date" name="endDate" value={formData.endDate}
                    onChange={handleChange} min={formData.startDate} className={styles.input} />
                </div>
              </div>

              {/* Location + Coupon */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Select Location for Course</label>
                  <div className={styles.selectWrap}>
                    <select name="location" value={formData.location}
                      onChange={handleChange} className={styles.select}>
                      {locations.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <span className={styles.selectArrow}>▾</span>
                  </div>
                </div>
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Coupon / Promo Code: ( Optional )</label>
                  <input type="text" name="coupon" value={formData.coupon}
                    onChange={handleChange} placeholder="Enter Code" className={styles.input} />
                </div>
              </div>

              {/* ── Submit / Success Area ── */}
              {submitSuccess ? (
                <div className={styles.successCard}>
                  <div className={styles.successRipple}>
                    <span /><span /><span />
                  </div>
                  <div className={styles.successCheck}>✓</div>
                  <p className={styles.successTitle}>Registration Submitted!</p>
                  <p className={styles.successSub}>Namaste 🙏 &nbsp;We&apos;ll be in touch soon.</p>
                  <p className={styles.successQuote}>
                    &ldquo;Yoga is the journey of the self, through the self, to the self.&rdquo;
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} />
                      <span className={styles.submitBtnText}>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.submitBtnText}>Submit</span>
                      <span className={styles.submitBtnArrow}>→</span>
                    </>
                  )}
                </button>
              )}

            </div>

            {/* Bottom ornament */}
            <div className={styles.bottomOrnament} aria-hidden="true">
              <svg viewBox="0 0 200 30" preserveAspectRatio="none">
                <g fill="none" stroke="#e07b00" strokeWidth="0.8" opacity="0.25">
                  <line x1="0" y1="15" x2="80" y2="15" />
                  <circle cx="100" cy="15" r="10" />
                  <circle cx="100" cy="15" r="6" />
                  <text x="100" y="20" textAnchor="middle" fontSize="10"
                    fill="#e07b00" fontFamily="serif" opacity="0.6">ॐ</text>
                  <line x1="120" y1="15" x2="200" y2="15" />
                </g>
              </svg>
            </div>
          </div>

        </div>
      </div>

      <HowToReach />
    </>
  );
}
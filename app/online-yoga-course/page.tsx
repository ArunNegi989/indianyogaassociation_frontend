"use client";
import React, { useState } from "react";
import styles from "@/assets/style/online-yoga-course/Onlineyogacourse.module.css";
import Image from "next/image";
import chakra1 from "@/assets/images/root-chakra.png";
import chakra2 from "@/assets/images/sacral-chakra.png";
import chakra3 from "@/assets/images/third-eye-chakra.png";
import chakra4 from "@/assets/images/solar-plexus-chakra.png";
import chakra5 from "@/assets/images/heart-chakra.png";
import chakra6 from "@/assets/images/throat-chakra.png";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/30.webp";

/* ── Video embed ── */
const HERO_VIDEO_URL =
  "https://www.youtube.com/embed/EJ6K-rhqevE?autoplay=1&mute=1&loop=1&playlist=EJ6K-rhqevE&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1";

/* ── Other course images ── */
const otherCourseImages = [
  "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  "https://images.unsplash.com/photo-1558017487-06bf9f82613a?w=600&q=80",
];

/* ── Why Choose image ── */
const WHY_IMAGE =
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const liveCourses = [
  {
    id: 1,
    title: "200 Hour Live Online",
    duration: "24 Days",
    style: "Hatha Yoga and Ashtanga Yoga",
    sessions: "15 Days | 2 Classes Daily",
    cert: "Yoga Alliance, USA",
    fee: "399 USD / 20,000 INR",
    benefits: [
      "Expert-Led Live Training - Learn from experienced yoga masters.",
      "Flexible & Interactive - Attend classes from anywhere in the world.",
      "Comprehensive Curriculum - Deep dive into asanas, pranayama, meditation & philosophy.",
      "Lifetime Access - Get recordings for future reference.",
      "Globally Recognized Certification - Start your career as a certified yoga instructor.",
      "Limited Seats Available! Enroll now to begin your transformational yoga journey!",
    ],
  },
  {
    id: 2,
    title: "300 Hour Live Online",
    duration: "28 Days",
    style: "Hatha Yoga and Multi-Style",
    sessions: "15 Days | 2 Classes Daily",
    cert: "Yoga Alliance, USA",
    fee: "499 USD / 25,000 INR",
    benefits: [
      "Advanced & Multi-Style Training - Expand your practice with diverse yoga styles.",
      "Expert Guidance - Learn from seasoned yoga masters in real-time.",
      "Interactive Learning - Engage in live sessions with personal mentorship.",
      "Flexible & Accessible - Train from anywhere with class recordings for future access.",
      "Globally Recognized Certification - Elevate your career as a certified yoga teacher.",
      "Upgrade Your Yoga Journey Today! Enroll now and take your practice to the next level.",
    ],
  },
];

const prenatalCourse = {
  title: "Prenatal Live Online",
  duration: "7 Days",
  style: "Multi-Style (Gentle Hatha, Restorative, Breathwork & More)",
  sessions: "7 Days | 2 Classes Daily",
  cert: "Yoga Alliance, USA",
  fee: "399 USD / 20,000 INR",
  benefits: [
    "Specialized Prenatal Training - Learn safe and effective yoga techniques for expectant mothers.",
    "Expert Guidance - Led by experienced prenatal yoga instructors.",
    "Holistic Approach - Covers asanas, breathwork, meditation & relaxation techniques.",
    "Flexible & Convenient - Train from home with recorded sessions for future reference.",
    "Globally Recognized Certification - Advance your career as a certified prenatal yoga teacher.",
    "Flexible & Convenient - Train from home with recorded sessions for future reference.",
  ],
};

const scheduleData = [
  { date: "01st Jun – 28th Jun 2025", h200: "20000 INR / 399 USD", h300: "25000 INR / 499 USD" },
  { date: "01st Jul – 28th July 2025", h200: "20000 INR / 399 USD", h300: "25000 INR / 499 USD" },
  { date: "01st Aug – 28th Aug 2025", h200: "20000 INR / 399 USD", h300: "25000 INR / 499 USD" },
  { date: "01st Sep – 28th Sep 2025", h200: "20000 INR / 399 USD", h300: "25000 INR / 499 USD" },
  { date: "01st Oct – 28th Oct 2025", h200: "20000 INR / 399 USD", h300: "25000 INR / 499 USD" },
  { date: "01st Nov – 28th Nov 2025", h200: "20000 INR / 399 USD", h300: "25000 INR / 499 USD" },
  { date: "01st Dec – 28th Dec 2025", h200: "20000 INR / 399 USD", h300: "25000 INR / 499 USD" },
];

const curriculumAreas = [
  {
    title: "Philosophy of Yoga",
    lines: ["20 hour live classes", "5 hours e-books and assignments"],
    symbol: "☸",
    color: "#e53935",
    image: chakra1,
  },
  {
    title: "Introduction to Yogic Anatomy",
    lines: ["20 hour Anatomy live lectures", "5 hours e-books self-study"],
    symbol: "ॐ",
    color: "#F15505",
    image: chakra2,
  },
  {
    title: "Pranayama and Meditation",
    lines: ["30 hour live lecture and practice", "Mudra, bandha, pranayama and meditation"],
    symbol: "◉",
    color: "#f9a825",
    image: chakra3,
  },
  {
    title: "Adjusting and Assisting Tips",
    lines: ["10 hours with hatha yoga + alignment", "Art of adjustment through guidance"],
    symbol: "✦",
    color: "#f9a825",
    image: chakra4,
  },
  {
    title: "Asana Practice",
    lines: ["35 hour Hatha yoga live classes", "35 hour Ashtanga yoga live classes"],
    symbol: "❋",
    color: "#43a047",
    image: chakra5,
  },
  {
    title: "Teaching Methodology",
    lines: ["10 hours Lecture on teaching practice", "30 hours teaching practice and 10 feedback"],
    symbol: "⬡",
    color: "#29b6f6",
    image: chakra6,
  },
];

const recordedCourses = [
  {
    title: "200 Hour Recorded Online Yoga Course",
    price: "$299",
    features: [
      "Yoga Manual",
      "Recorded lectures on philosophy",
      "EBooks and online resources",
      "Few live classes",
      "Hatha / Ashtanga Yoga",
      "Yoga TTC Certificate",
      "Live Exam",
    ],
  },
  {
    title: "300 Hour Recorded Online Yoga Course",
    price: "$399",
    features: [
      "Yoga Manual",
      "Recorded lectures on philosophy",
      "EBooks and online resources",
      "Few live classes",
      "Multi-Style Yoga",
      "Yoga TTC Certificate",
      "Live Exam",
    ],
  },
];

const otherCourses = [
  { title: "Hatha Yoga Alignment", hours: "35 Hour", price: "299 USD" },
  { title: "Pranayama and Meditation", hours: "20 Hour", price: "349 USD" },
  { title: "Ashtanga Vinyasa Primary Series", hours: "35 Hour", price: "299 USD" },
];

const faqs = [
  {
    q: "What are the eligibility criteria for joining this course?",
    a: "Anyone with a sincere interest in learning yoga and who is in reasonably good physical health is welcome to apply. Whether you are a beginner or have some prior experience, you can choose a course that suits your goals and level.",
  },
  {
    q: "How do I register for these courses?",
    a: "To secure your spot, an advance payment of USD 200 is required, along with a transaction fee of USD 15 (totaling USD 215). The remaining course fee can be paid within the first two weeks of your enrollment.",
  },
  {
    q: "How do I get the certification?",
    a: "Upon successful completion of the course and final assessments, you will be awarded a recognized certification. Your certificate will be shipped to the postal address you provide; please note that shipping charges will be borne by the participant.",
  },
  {
    q: "What is the group size of each class?",
    a: "To ensure personalized attention and effective guidance, each online training batch is intentionally limited to 5 to 7 participants. This allows our instructors to focus on alignment, posture corrections, and individual progress throughout the course.",
  },
  {
    q: "How are the courses designed?",
    a: "Our programs are thoughtfully designed with 2 to 4 live online classes per day, depending on factors such as your time zone, location, and batch size. After enrollment, our team will connect with you to finalize a suitable class schedule.",
  },
];

const whyReasons = [
  {
    title: "Learn from the Best",
    desc: "Our highly experienced yoga teachers bring years of expertise to guide you through every aspect of yoga.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
      </svg>
    ),
  },
  {
    title: "Comprehensive Curriculum",
    desc: "Dive deep into Hatha Yoga, Ashtanga Yoga, Vinyasa Yoga, meditation, pranayama, and yoga philosophy from home.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M8 17v4M16 17v4M8 21h8M9 10l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Globally Recognized Certification",
    desc: "Earn an internationally accredited yoga certification recognized by Yoga Alliance, USA.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" />
        <path d="M6 21v-1a6 6 0 0112 0v1" />
      </svg>
    ),
  },
  {
    title: "Interactive Live Sessions",
    desc: "Engage in real-time classes, one-on-one mentoring, and guided practice to ensure personal attention.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10l4.553-2.277A1 1 0 0121 8.677V15.32a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
  },
  {
    title: "Flexible Learning",
    desc: "Balance your yoga teacher training with your daily life through a well-structured and accessible online format.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  // ── 5 new entries ──
  {
    title: "Lifetime Access to Recordings",
    desc: "Every live session is recorded and made available to you forever — revisit any class, any time, at your own pace.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path d="M10 8l6 4-6 4V8z" fill="currentColor" opacity="0.25" />
        <path d="M10 8l6 4-6 4V8z" />
      </svg>
    ),
  },
  {
    title: "Small Batch Sizes",
    desc: "Classes are capped at 5–7 students per batch, ensuring every participant receives direct, personal feedback from instructors.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3" />
        <circle cx="15" cy="7" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6" />
      </svg>
    ),
  },
  {
    title: "Rooted in Rishikesh Tradition",
    desc: "Our teaching lineage comes directly from the Himalayan tradition of Rishikesh — the birthplace and world capital of yoga.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20l4-8 4 4 4-10 4 14" />
        <path d="M3 20h18" />
      </svg>
    ),
  },
  {
    title: "Multi-Language Support",
    desc: "Our instructors teach in both English and Hindi, making the course accessible to a diverse global and Indian student community.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    title: "Post-Course Mentorship",
    desc: "Your journey doesn't end at graduation. We offer continued guidance, community access, and support as you begin your teaching career.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 20h5v-1a4 4 0 00-5.5-3.7" />
        <path d="M9 20H4v-1a4 4 0 015.5-3.7" />
        <circle cx="12" cy="8" r="4" />
        <path d="M12 12v8" />
      </svg>
    ),
  },
];

const keyBenefits = [
  {
    title: "Start Anytime, From Anywhere",
    desc: "Enroll whenever you're ready. Our courses are open year-round and accessible globally from any device.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Yoga Alliance Certified",
    desc: "All our teacher training programs are recognized by Yoga Alliance (USA), ensuring international credibility.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: "Study at Your Own Pace",
    desc: "Our flexible format allows you to study at your own pace, making it easy to balance learning with personal life.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   SHARED UI COMPONENTS
───────────────────────────────────────────── */
function VintageHeading({ children, center = true }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={styles.vintageHeadingWrap} style={{ textAlign: center ? "center" : "left" }}>
      <h2 className={styles.vintageHeading}>{children}</h2>
      <div className={styles.headingUnderline} style={{ justifyContent: center ? "center" : "flex-start" }}>
        <div className={styles.headingDiamond} />
      </div>
    </div>
  );
}

function OmDivider() {
  return (
    <div className={styles.omDivider}>
      <div className={`${styles.divLine} ${styles.divLineLeft}`} />
      <span className={styles.divOm}>ॐ</span>
      <div className={`${styles.divLine} ${styles.divLineRight}`} />
    </div>
  );
}

/* Course detail icon helpers */
const CalendarIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <line x1="5" y1="1" x2="5" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="11" y1="1" x2="11" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const VideoIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.6" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M8 1l2 4 4.5.7-3.2 3.1.7 4.5L8 11.2 4 13.3l.7-4.5L1.5 5.7 6 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const DollarIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <text x="8" y="12" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="serif">$</text>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────────
   COURSE CARD COMPONENT
───────────────────────────────────────────── */
function CourseCard({ title, duration, style, sessions, cert, fee, benefits }: {
  title: string; duration: string; style: string; sessions: string; cert: string; fee: string; benefits: string[];
}) {
  return (
    <div className={styles.courseCard}>
      <div className={styles.courseCardHeader}>
        <h3 className={styles.courseCardTitle}>{title}</h3>
        <span className={styles.courseCardFeeTag}>{fee}</span>
      </div>
      <div className={styles.courseCardBody}>
        <div className={styles.courseCardLeft}>
          <ul className={styles.courseDetailList}>
            <li>
              <span className={styles.detailIcon}><CalendarIcon /></span>
              <span><strong>Duration:</strong>&nbsp;{duration}</span>
            </li>
            <li>
              <span className={styles.detailIcon}><UserIcon /></span>
              <span><strong>Course Style:</strong>&nbsp;{style}</span>
            </li>
            <li>
              <span className={styles.detailIcon}><VideoIcon /></span>
              <span><strong>Live Interactive Sessions:</strong>&nbsp;{sessions}</span>
            </li>
            <li>
              <span className={styles.detailIcon}><StarIcon /></span>
              <span><strong>Certificate:</strong>&nbsp;{cert}</span>
            </li>
            <li>
              <span className={styles.detailIcon}><DollarIcon /></span>
              <span><strong>Course Fee:</strong>&nbsp;{fee}</span>
            </li>
          </ul>
          <div className={styles.courseActions}>
            <a href="#" className={styles.btnPrimary}>Apply Now</a>
            <a href="#" className={styles.btnOutline}>Book Now</a>
          </div>
        </div>
        <div className={styles.courseCardRight}>
          <p className={styles.benefitsListTitle}>Key Benefits</p>
          <ul className={styles.benefitsList}>
            {benefits.map((b, j) => (
              <li key={j} className={styles.benefitsListItem}>
                <span className={styles.benefitCheck}><CheckIcon /></span>
                <span>
                  {b.includes(" - ") ? (
                    <><strong>{b.split(" - ")[0]}</strong>{" — " + b.split(" - ").slice(1).join(" - ")}</>
                  ) : b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
export default function OnlineYogaCourse() {
  return (
    <div className={styles.page}>
      {/* Mandala watermark */}
      <div className={styles.mandalaWatermark} aria-hidden="true">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#F15505" strokeWidth="0.5" opacity="0.07">
            {[30, 60, 90, 120, 150, 180, 210, 240].map((r, i) => (
              <circle key={i} cx="250" cy="250" r={r} />
            ))}
            {Array.from({ length: 36 }, (_, i) => {
              const a = (((i * 360) / 36) * Math.PI) / 180;
              return (
                <line key={i} x1="250" y1="250"
                  x2={250 + 240 * Math.cos(a)} y2={250 + 240 * Math.sin(a)} />
              );
            })}
            {[60, 120, 180].map((r, i) => (
              <polygon key={i}
                points={Array.from({ length: 8 }, (_, j) => {
                  const a = (((j * 360) / 8) * Math.PI) / 180;
                  return `${250 + r * Math.cos(a)},${250 + r * Math.sin(a)}`;
                }).join(" ")}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* ══════════════════════════════════════
          HERO IMAGE
      ══════════════════════════════════════ */}
      <section className={styles.heroSection}>
        <Image
          src={heroImg}
          alt="Yoga Students Group"
          width={1460}
          height={560}
          className={styles.heroImage}
          priority
        />
      </section>

      {/* ══════════════════════════════════════
          INTRO
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.introSection}`}>
        <div className={styles.container}>
          <div className={styles.introText}>
            <span className={styles.sectionEyebrow}>Rishikesh, India · Online</span>
            <VintageHeading>
              Online Yoga Teacher Training Course — Rishikesh, India
            </VintageHeading>
            <p className={styles.bodyPara}>
              At AYM Yoga School, Rishikesh, we bring you a professionally curated{" "}
              <strong>online Yoga Teacher Training Course</strong> designed for
              yoga enthusiasts worldwide. Whether you're a beginner or an
              experienced practitioner, our online yoga course offers the same
              depth and authenticity as our in-person training in Rishikesh, the{" "}
              <strong>Yoga Capital of the World</strong>.
            </p>
          </div>
          <OmDivider />
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE — with image & video on right
      ══════════════════════════════════════ */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Why Choose Us</span>
          <VintageHeading>Why Choose AYM Yoga School's Online Yoga Teacher Training Course?</VintageHeading>
          <div className={styles.whySplit}>
            {/* Left: reason cards */}
            <div className={styles.whyLeft}>
              <div className={styles.whyGrid}>
                {whyReasons.map((item, i) => (
                  <div
                    key={i}
                    className={styles.whyCard}
                    style={{ "--wi": i } as React.CSSProperties}
                  >
                    <div className={styles.whyIconBox}>{item.icon}</div>
                    <div className={styles.whyCardBody}>
                      <div className={styles.whyCardTitle}>{item.title}</div>
                      <div className={styles.whyCardDesc}>{item.desc}</div>
                    </div>
                    <div className={styles.whyCardLine} />
                  </div>
                ))}
              </div>
            </div>
            {/* Right: image stacked with video */}
            <div className={styles.whyRight}>
              <div className={styles.whyImageBox}>
                <img src={WHY_IMAGE} alt="Online yoga practice" />
                <div className={styles.whyCornerTl} />
                <div className={styles.whyCornerBr} />
                <div className={styles.whyImageBadge}>Since 2010 · Rishikesh</div>
              </div>
              <div className={styles.whyVideoBox}>
                <iframe
                  src={HERO_VIDEO_URL}
                  title="AYM Yoga School"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
                <div className={styles.whyVideoBadge}>
                  <span className={styles.pulseDot} /> Live Classes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          KEY BENEFITS
      ══════════════════════════════════════ */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Key Benefits</span>
          <VintageHeading>Key Benefits of Our Online Yoga Courses</VintageHeading>
          <div className={styles.benefitsGrid}>
            {keyBenefits.map((item, i) => (
              <div
                key={i}
                className={styles.benefitCard}
                style={{ "--bi": i } as React.CSSProperties}
              >
                <div className={styles.benefitIconWrap}>{item.icon}</div>
                <div className={styles.benefitCardNum}>{String(i + 1).padStart(2, "0")}</div>
                <div className={styles.benefitTitle}>{item.title}</div>
                <div className={styles.benefitDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          LIVE COURSES (200hr, 300hr, Prenatal)
      ══════════════════════════════════════ */}
      <section className={styles.coursesSection}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Live Online Courses</span>
          <VintageHeading>Our Live Online Yoga Teacher Training Courses</VintageHeading>
          {liveCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
          <CourseCard
            title={prenatalCourse.title}
            duration={prenatalCourse.duration}
            style={prenatalCourse.style}
            sessions={prenatalCourse.sessions}
            cert={prenatalCourse.cert}
            fee={prenatalCourse.fee}
            benefits={prenatalCourse.benefits}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          SCHEDULE TABLE
      ══════════════════════════════════════ */}
      <section className={styles.scheduleSection}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Upcoming Batches</span>
          <VintageHeading>Live Online Yoga Teacher Training Schedule</VintageHeading>
          <div className={styles.tableWrapper}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>200 Hour</th>
                  <th>300 Hour</th>
                  <th>Enroll</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, i) => (
                  <tr key={i}>
                    <td><span className={styles.tableDate}>{row.date}</span></td>
                    <td><span className={styles.tablePrice}>{row.h200}</span></td>
                    <td><span className={styles.tablePrice}>{row.h300}</span></td>
                    <td>
                      <a href="#" className={styles.tableApplyBtn}>
                        Open for Registration
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NOTE + FAQ
      ══════════════════════════════════════ */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.noteBox}>
            <strong>Please note:</strong> For these courses, there are a minimum of 2 live
            online sessions planned on a daily basis (maximum number of live sessions per
            day varies from course to course).
          </div>
          <span className={styles.sectionEyebrow}>FAQs</span>
          <VintageHeading>About Live Yoga Training Course</VintageHeading>
          <div className={styles.faqGrid}>
            {faqs.map((item, i) => (
              <div
                key={i}
                className={styles.faqCard}
                style={{ "--fi": i } as React.CSSProperties}
              >
                <p className={styles.faqQ}>{item.q}</p>
                <p className={styles.faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CURRICULUM
      ══════════════════════════════════════ */}
      <section className={styles.curriculumSection}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Curriculum</span>
          <VintageHeading>The Program Covers Following Basic Areas of Yoga</VintageHeading>
          <div className={styles.chakraGrid}>
            {curriculumAreas.map((area, i) => (
              <div
                key={i}
                className={styles.chakraCard}
                style={{ "--ci": i } as React.CSSProperties}
              >
                <div className={styles.chakraCardBg}>{area.symbol}</div>
                <div className={styles.chakraImageWrap}>
                  <Image
                    src={area.image}
                    alt={area.title}
                    width={130}
                    height={130}
                    className={styles.chakraImage}
                  />
                </div>
                <h4 className={styles.chakraTitle} style={{ color: area.color }}>
                  {area.title}
                </h4>
                <div className={styles.chakraCardDivider} />
                {area.lines.map((line, j) => (
                  <p key={j} className={styles.chakraLine}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          RECORDED COURSES
      ══════════════════════════════════════ */}
      <section className={styles.recordedSection}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Self-Paced Learning</span>
          <VintageHeading>Fully Recorded Online Yoga Teacher Training Course</VintageHeading>
          <div className={styles.recordedGrid}>
            {recordedCourses.map((rc, i) => (
              <div key={i} className={styles.recordedCard}>
                <div className={styles.recordedCardHeader}>
                  <span className={styles.recordedCardIcon}>✎</span>
                  <h4 className={styles.recordedCardTitle}>{rc.title}</h4>
                  <div className={styles.recordedCardPrice}>
                    <span className={styles.recordedPriceAmt}>{rc.price}</span>
                    <span className={styles.recordedPriceCur}>USD</span>
                  </div>
                </div>
                <div className={styles.recordedCardBody}>
                  <ul className={styles.recordedFeatureList}>
                    {rc.features.map((f, j) => (
                      <li key={j} className={styles.recordedFeatureItem}>
                        <span className={styles.featureCheckIcon}><CheckIcon /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#" className={styles.recordedApplyBtn}>
                    Apply Now
                    <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Info / Advantages box */}
          <div className={styles.infoBox}>
            <h4 className={styles.infoBoxTitle}>The Advantages of Fully Online Courses</h4>
            <p className={styles.infoBoxText}>
              In addition to the above courses, we have fully recorded online teachers' training
              courses for 200 hours yoga teachers' training as well as for 300 hours training program.
            </p>
            <ol className={styles.advantageList}>
              <li>You can start the course any time.</li>
              <li>These courses are recognized by Yoga Alliance, United States.</li>
              <li>
                The courses are based on self-paced learning modules, so you can study as per a
                schedule that fits you.
              </li>
            </ol>
            <p className={styles.infoBoxText}>
              In the 200 hours course you will learn about various yoga aasanas aka yoga postures,
              various breathing techniques, the yoga philosophy, alignment correction, anatomy of the
              human body, various meditation techniques, creating your own yogic sequence, various yoga
              teaching methodologies etc.
            </p>
            <h4 className={styles.infoBoxTitle}>How Do I Apply for These Courses?</h4>
            <p className={styles.infoBoxText}>
              Please reach out to us at{" "}
              <strong>aymyogaschool@gmail.com</strong>, or you may click the links provided in
              the webpage to fill the online registration and submit it. Once we receive the same,
              our team will reach out to you for further guidance.
            </p>
            <h4 className={styles.infoBoxTitle}>What Should I Do After the Registration Process?</h4>
            <p className={styles.infoBoxText}>
              Once the registration is done, we will be sharing the training materials of the course
              with you. It includes recorded training sessions as well as other course materials like
              e-books and yoga manual. There is a live exam that will be conducted; once you complete
              the same you will be provided with your certification.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OTHER LIVE COURSES
      ══════════════════════════════════════ */}
      <section className={styles.otherSection}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Specialised Programs</span>
          <VintageHeading>Other Live Online Yoga Courses</VintageHeading>
          <div className={styles.otherGrid}>
            {otherCourses.map((oc, i) => (
              <div
                key={i}
                className={styles.otherCard}
                style={{ "--oi": i } as React.CSSProperties}
              >
                <div className={styles.otherCardImage}>
                  <img
                    src={otherCourseImages[i]}
                    alt={oc.title}
                  />
                  <div className={styles.otherCardImageOverlay} />
                </div>
                <div className={styles.otherCardBody}>
                  <h4 className={styles.otherTitle}>{oc.title}</h4>
                  <p className={styles.otherMeta}>{oc.hours} · {oc.price}</p>
                  <a href="#" className={styles.otherCardBtn}>
                    Enquire Now
                    <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowToReach />
    </div>
  );
}
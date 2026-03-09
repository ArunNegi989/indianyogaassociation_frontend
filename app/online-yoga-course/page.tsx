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

const liveCourses = [
  {
    id: 1,
    title: "200 Hour Live Online",
    duration: "24 Days",
    style: "Hatha Yoga and Ashtanga Yoga",
    sessions: "15 Days | 2 Classes Daily",
    cert: "Yoga Alliance, USA",
    fee: "399 USD / 20,000 INR",
    chakraColor: "#e07b00",
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
    fee: "399 USD / 25,000 INR",
    chakraColor: "#e07b00",
    benefits: [
      "Advanced & Multi-Style Training - Expand your practice with diverse yoga styles.",
      "Expert Guidance - Learn from seasoned yoga masters in real-time.",
      "Interactive Learning - Engage in live sessions with personal mentorship.",
      "Flexible & Accessible - Train from anywhere with class recordings for future access.",
      "Globally Recognized Certification - Elevate your career as a certified yoga teacher.",
      "Upgrade Your Yoga Journey Today! Enroll now and take your practice to the next level..",
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
    "Globally Recognized Certification - Advance your career as a certified prenatal yoga teacher",
    "Flexible & Convenient - Train from home with recorded sessions for future reference",
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
    color: "#e07b00",
    image: chakra2,
  },
  {
    title: "Pranayama and Meditation",
    lines: ["30 hour live lecture and practice ons", "Mudra, bendha, pranayama and meditaion"],
    symbol: "◉",
    color: "#f9a825",
    image: chakra3,
  },
  {
    title: "Adjusting and Assisting Tips",
    lines: ["10 hours with hatha yoga + alignment", "Art of adjustment through mouth"],
    symbol: "✦",
    color: "#f9a825",
    image: chakra4,
  },
  {
    title: "Asana Practice",
    lines: ["35 hour Hatha yoga live classes", "35 hour ashtanga yoga live classes"],
    symbol: "❋",
    color: "#43a047",
    image: chakra5,
  },
  {
    title: "Teaching Methodology",
    lines: ["10 hours Lecture on teaching practice", "30 hours teaching practice and 10 feedback."],
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
  { title: "Pranayama and Mediation", hours: "20 Hour", price: "349 USD" },
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
    desc: "Our highly experienced yoga teachers bring years of expertise to guide you through every aspect of yoga, ensuring a seamless online learning experience.",
  },
  {
    title: "Comprehensive Curriculum",
    desc: "Dive deep into Hatha Yoga, Ashtanga Yoga, Vinyasa Yoga, meditation, pranayama, and yoga philosophy from the comfort of your home.",
  },
  {
    title: "Globally Recognized Certification",
    desc: "Earn an internationally accredited yoga certification recognized by Yoga Alliance, USA and the Government of India (Ministry of AYUSH & YCB).",
  },
  {
    title: "Interactive Live Sessions",
    desc: "Engage in real-time classes, one-on-one mentoring, and guided practice to ensure personal attention and progress.",
  },
  {
    title: "Flexible Learning",
    desc: "Balance your yoga teacher training course with your daily life through a well-structured and accessible online format.",
  },
];

function CourseBlock({ course }: { course: typeof liveCourses[0] }) {
  return (
    <div className={styles.courseBlock}>
      <div className={styles.courseBlockLeft}>
        <h3 className={styles.courseBlockTitle}>{course.title}</h3>
        <div className={styles.orangeUnderline} />
        <ul className={styles.courseDetailList}>
          <li>
            <span className={styles.detailIconWrap}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="13" rx="2" stroke="#e07b00" strokeWidth="1.4"/><line x1="5" y1="1" x2="5" y2="4" stroke="#e07b00" strokeWidth="1.4" strokeLinecap="round"/><line x1="11" y1="1" x2="11" y2="4" stroke="#e07b00" strokeWidth="1.4" strokeLinecap="round"/><line x1="1" y1="6" x2="15" y2="6" stroke="#e07b00" strokeWidth="1.4"/></svg>
            </span>
            <strong>Duration:</strong>&nbsp;{course.duration}
          </li>
          <li>
            <span className={styles.detailIconWrap}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="#e07b00" strokeWidth="1.4"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#e07b00" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </span>
            <strong>Course Style:</strong>&nbsp;{course.style}
          </li>
          <li>
            <span className={styles.detailIconWrap}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#e07b00" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" fill="#e07b00" opacity="0.6"/></svg>
            </span>
            <strong>Live Interactive Sessions:</strong>&nbsp;{course.sessions}
          </li>
          <li>
            <span className={styles.detailIconWrap}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2 4 4.5.7-3.2 3.1.7 4.5L8 11.2 4 13.3l.7-4.5L1.5 5.7 6 5z" stroke="#e07b00" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            </span>
            <strong>Certificate:</strong>&nbsp;{course.cert}
          </li>
          <li>
            <span className={styles.detailIconWrap}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#e07b00" strokeWidth="1.4"/><text x="8" y="12" textAnchor="middle" fontSize="9" fill="#e07b00" fontFamily="serif">$</text></svg>
            </span>
            <strong>Course Fee:</strong>&nbsp;{course.fee}
          </li>
        </ul>
        <a href="#" className={styles.applyBtn}>Apply Now</a>
      </div>
      <div className={styles.courseBlockRight}>
        <h4 className={styles.benefitsTitle}>Key Benefits:</h4>
        <ul className={styles.benefitsList}>
          {course.benefits.map((b, j) => (
            <li key={j} className={styles.benefitItem}>
              <span className={styles.fireIcon}>🏆</span>
              <span>{b.includes(" - ") ? <><strong>{b.split(" - ")[0]}</strong>{" - " + b.split(" - ").slice(1).join(" - ")}</> : b}</span>
            </li>
          ))}
        </ul>
        <a href="#" className={styles.bookBtn}>Book Now</a>
      </div>
    </div>
  );
}

export default function OnlineYogaCourse() {
  return (
    <div className={styles.page}>

      {/* ── Mandala background watermark ── */}
      <div className={styles.mandalaWatermark} aria-hidden="true">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#e07b00" strokeWidth="0.5" opacity="0.07">
            {[30, 60, 90, 120, 150, 180, 210, 240].map((r, i) => (
              <circle key={i} cx="250" cy="250" r={r} />
            ))}
            {Array.from({ length: 36 }, (_, i) => {
              const a = ((i * 360) / 36) * Math.PI / 180;
              return <line key={i} x1="250" y1="250" x2={250 + 240 * Math.cos(a)} y2={250 + 240 * Math.sin(a)} />;
            })}
            {[60, 120, 180].map((r, i) => (
              <polygon key={i} points={Array.from({ length: 8 }, (_, j) => {
                const a = ((j * 360) / 8) * Math.PI / 180;
                return `${250 + r * Math.cos(a)},${250 + r * Math.sin(a)}`;
              }).join(" ")} />
            ))}
          </g>
        </svg>
      </div>

      {/* ══════════════════════════════════════
          HERO — Screenshot 1
      ══════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleBold}>ONLINE YOGA</span>
            <span className={styles.heroTitleScript}>Course</span>
          </h1>
          <div className={styles.heroCourseCards}>
            {[
              { num: "100", label: "HOUR YOGA" },
              { num: "200", label: "HOUR YOGA" },
              { num: "300", label: "HOUR YOGA" },
              { num: "500", label: "HOUR YOGA" },
              { num: "100", label: "HOUR YOGA\nPRENATAL" },
            ].map((c, i) => (
              <div key={i} className={styles.heroCard}>
                <div className={styles.laptopWrap}>
                  <div className={styles.laptop}>
                    <div className={styles.laptopScreen} />
                  </div>
                  <div className={styles.laptopFoot} />
                </div>
                <p className={styles.heroCardNum}>{c.num}</p>
                <p className={styles.heroCardLabel}>{c.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroRightMandala} aria-hidden="true">
            <svg viewBox="0 0 300 300">
              <g fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
                {[30, 60, 90, 120, 145].map((r, i) => <circle key={i} cx="150" cy="150" r={r} />)}
                {Array.from({ length: 24 }, (_, i) => {
                  const a = ((i * 360) / 24) * Math.PI / 180;
                  return <line key={i} x1="150" y1="150" x2={150 + 145 * Math.cos(a)} y2={150 + 145 * Math.sin(a)} />;
                })}
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INTRO — Screenshot 2
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleOrange}>Online Yoga Teacher Training Course Rishikesh, India</h2>
          <div className={styles.orangeUnderline} />

          <p className={styles.bodyPara}>
            At AYM Yoga School, Rishikesh, we bring you a professionally curated{" "}
            <strong>online Yoga Teacher Training Course</strong> designed for yoga enthusiasts worldwide.
            Whether you're a beginner or an experienced practitioner, our online yoga course offers the
            same depth and authenticity as our in-person training in Rishikesh, the{" "}
            <strong>Yoga Capital of the World</strong>.
          </p>

          <h3 className={styles.sectionTitleOrange}>Why Choose AYM Yoga School's Online Yoga Teacher Training Course?</h3>
          <div className={styles.orangeUnderline} />

          <ul className={styles.fireList}>
            {whyReasons.map((item, i) => (
              <li key={i} className={styles.fireListItem}>
                <span className={styles.fireIcon}>🏆</span>
                <span><strong>{item.title}</strong>: {item.desc}</span>
              </li>
            ))}
          </ul>

          <h3 className={styles.sectionTitleOrange}>Key Benefits of Our Online Yoga Courses</h3>
          <div className={styles.orangeUnderline} />

          <ul className={styles.fireList}>
            <li className={styles.fireListItem}>
              <span className={styles.fireIcon}>🏆</span>
              <span><strong>Start Anytime, From Anywhere</strong>: Enroll whenever you're ready. Our courses are open year-round and accessible globally.</span>
            </li>
            <li className={styles.fireListItem}>
              <span className={styles.fireIcon}>🏆</span>
              <span><strong>Yoga Alliance Certified</strong>: All our teacher training programs are recognized by Yoga Alliance (USA), ensuring international credibility for your certification.</span>
            </li>
            <li className={styles.fireListItem}>
              <span className={styles.fireIcon}>🏆</span>
              <span><strong>Our flexible format</strong> allows you to study at your own pace, making it easy to balance your learning with your personal or professional life.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════
          LIVE COURSES — Screenshots 3 & 4
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          {liveCourses.map((course) => (
            <CourseBlock key={course.id} course={course} />
          ))}

          {/* Prenatal */}
          <div className={styles.courseBlock}>
            <div className={styles.courseBlockLeft}>
              <h3 className={styles.courseBlockTitle}>{prenatalCourse.title}</h3>
              <div className={styles.orangeUnderline} />
              <ul className={styles.courseDetailList}>
                <li><span className={styles.detailIconWrap}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="13" rx="2" stroke="#e07b00" strokeWidth="1.4"/><line x1="5" y1="1" x2="5" y2="4" stroke="#e07b00" strokeWidth="1.4" strokeLinecap="round"/><line x1="11" y1="1" x2="11" y2="4" stroke="#e07b00" strokeWidth="1.4" strokeLinecap="round"/><line x1="1" y1="6" x2="15" y2="6" stroke="#e07b00" strokeWidth="1.4"/></svg></span><strong>Duration:</strong>&nbsp;{prenatalCourse.duration}</li>
                <li><span className={styles.detailIconWrap}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="#e07b00" strokeWidth="1.4"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#e07b00" strokeWidth="1.4" strokeLinecap="round"/></svg></span><strong>Course Style:</strong>&nbsp;{prenatalCourse.style}</li>
                <li><span className={styles.detailIconWrap}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#e07b00" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" fill="#e07b00" opacity="0.6"/></svg></span><strong>Live Interactive Sessions:</strong>&nbsp;{prenatalCourse.sessions}</li>
                <li><span className={styles.detailIconWrap}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2 4 4.5.7-3.2 3.1.7 4.5L8 11.2 4 13.3l.7-4.5L1.5 5.7 6 5z" stroke="#e07b00" strokeWidth="1.2" strokeLinejoin="round"/></svg></span><strong>Certificate:</strong>&nbsp;{prenatalCourse.cert}</li>
                <li><span className={styles.detailIconWrap}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#e07b00" strokeWidth="1.4"/><text x="8" y="12" textAnchor="middle" fontSize="9" fill="#e07b00" fontFamily="serif">$</text></svg></span><strong>Course Fee:</strong>&nbsp;{prenatalCourse.fee}</li>
              </ul>
              <a href="#" className={styles.applyBtn}>Apply Now</a>
            </div>
            <div className={styles.courseBlockRight}>
              <h4 className={styles.benefitsTitle}>Key Benefits:</h4>
              <ul className={styles.benefitsList}>
                {prenatalCourse.benefits.map((b, j) => (
                  <li key={j} className={styles.benefitItem}>
                    <span className={styles.fireIcon}>🏆</span>
                    <span>{b.includes(" - ") ? <><strong>{b.split(" - ")[0]}</strong>{" - " + b.split(" - ").slice(1).join(" - ")}</> : b}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className={styles.bookBtn}>Book Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SCHEDULE TABLE — Screenshot 4 bottom
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.sectionTitleOrange}>Live Online Yoga Teacher Training Schedule</h3>
          <div className={styles.orangeUnderline} />
          <div className={styles.tableWrapper}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>200 Hour</th>
                  <th>300 Hour</th>
                  <th>Apply</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.h200}</td>
                    <td>{row.h300}</td>
                    <td><a href="#" className={styles.tableApply}>Open for Registartion</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT / FAQ — Screenshot 5
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.noteText}>
            Please note that for these courses, there are a minimum of 2 live online sessions which are planned on a daily basis (maximum number of live sessions per day varies from course to course).
          </p>

          <h3 className={styles.sectionTitleOrange}>About Live Yoga Training Course:</h3>
          <div className={styles.orangeUnderline} />

          <div className={styles.faqList}>
            {faqs.map((item, i) => (
              <div key={i} className={styles.faqBlock}>
                <p className={styles.faqQ}>{item.q}</p>
                <p className={styles.faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CURRICULUM — Screenshot 6 (with real images)
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.sectionTitleOrange}>The program covers following basic areas of yoga</h3>
          <div className={styles.orangeUnderline} />
          <div className={styles.chakraGrid}>
            {curriculumAreas.map((area, i) => (
              <div key={i} className={styles.chakraCard}>
                <div className={styles.chakraImageWrap}>
                  <Image
                    src={area.image}
                    alt={area.title}
                    width={140}
                    height={140}
                    className={styles.chakraImage}
                  />
                </div>
                <h4 className={styles.chakraTitle} style={{ color: area.color }}>
                  {area.title}
                </h4>
                {area.lines.map((line, j) => (
                  <p key={j} className={styles.chakraLine}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          RECORDED COURSES — Screenshot 7
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.sectionTitleOrange}>Fully Recorded Online Yoga Teacher Training Course</h3>
          <div className={styles.orangeUnderline} />
          <div className={styles.recordedGrid}>
            {recordedCourses.map((rc, i) => (
              <div key={i} className={styles.recordedCard}>
                <div className={styles.recordedPencilIcon}>✎</div>
                <h4 className={styles.recordedTitle}>{rc.title}</h4>
                <div className={styles.recordedUnderline} />
                <div className={styles.recordedPrice}>{rc.price}</div>
                <div className={styles.recordedDivider} />
                {rc.features.map((f, j) => (
                  <p key={j} className={styles.recordedFeature}>{f}</p>
                ))}
                <div className={styles.recordedDivider} />
                <a href="#" className={styles.applyLinkBtn}>Apply Now</a>
              </div>
            ))}
          </div>

          {/* Screenshot 8 text */}
          <div className={styles.recordedInfoBox}>
            <p>In addition to the above courses, we have fully recorded online teachers' training courses for 200 hours yoga teachers' training as well as for 300 hours training program.</p>
            <p><strong>The advantages of fully online courses are:</strong></p>
            <ol className={styles.advantageList}>
              <li>You can start the course any time.</li>
              <li>These courses are recognized by Yoga Alliance, United States.</li>
              <li>The courses are based on self-paced learning modules, so you can study as per a schedule that fits you.</li>
            </ol>
            <p>In the 200 hours course you will learn about various yoga aasanas aka yoga postures, various breathing techniques, the yoga philosophy, alignment correction, anatomy of the human body, various meditation techniques, creating your own yogic sequence, various yoga teaching methodologies etc.</p>
            <p><strong>How do I apply for these courses?</strong><br />
              Please reach out to us at aymyogaschool@gmail.com, or you may click the links provided in the webpage to fill the online registration and submit it. Once we receive the same, our team will reach out to you for further guidance.</p>
            <p><strong>What should I do after the registration process?</strong><br />
              Once the registration is done, we will be sharing the training materials of the course with you. It includes recorded training sessions as well as other course materials like e-books and yoga manual. There is a live exam that will be conducted, once you complete the same you will be provided with your certification.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OTHER LIVE COURSES — Screenshot 9
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.sectionTitleOrange}>Other Live Online Yoga Course</h3>
          <div className={styles.orangeUnderline} />
          <div className={styles.otherGrid}>
            {otherCourses.map((oc, i) => (
              <div key={i} className={styles.otherCard}>
                <div className={styles.otherFigureWrap}>
                  {i === 0 && (
                    <svg viewBox="0 0 80 80" className={styles.otherFigureSvg}>
                      <circle cx="40" cy="14" r="7" fill="none" stroke="#3d1d00" strokeWidth="1.5"/>
                      <line x1="40" y1="21" x2="40" y2="50" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M25 32 Q40 28 55 32" fill="none" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M40 50 L28 68" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M40 50 L52 68" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="10" y1="68" x2="70" y2="68" stroke="#3d1d00" strokeWidth="1.5"/>
                    </svg>
                  )}
                  {i === 1 && (
                    <svg viewBox="0 0 80 80" className={styles.otherFigureSvg}>
                      <circle cx="40" cy="12" r="6" fill="none" stroke="#3d1d00" strokeWidth="1.5"/>
                      <path d="M30 30 Q40 20 50 30 Q55 40 50 52 Q40 60 30 52 Q25 40 30 30Z" fill="none" stroke="#3d1d00" strokeWidth="1.5"/>
                      <line x1="40" y1="18" x2="40" y2="22" stroke="#3d1d00" strokeWidth="1.5"/>
                      <path d="M25 38 L15 42 M55 38 L65 42" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                  {i === 2 && (
                    <svg viewBox="0 0 80 80" className={styles.otherFigureSvg}>
                      <circle cx="40" cy="14" r="7" fill="none" stroke="#3d1d00" strokeWidth="1.5"/>
                      <line x1="40" y1="21" x2="40" y2="48" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M25 33 Q40 28 55 33" fill="none" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M40 48 Q32 58 22 65" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M40 48 Q48 58 58 65" stroke="#3d1d00" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <h4 className={styles.otherTitle}>{oc.title}</h4>
                <p className={styles.otherMeta}>{oc.hours} - {oc.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
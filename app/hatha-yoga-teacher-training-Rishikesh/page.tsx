"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/assets/style/hatha-yoga-teacher-training-Rishikesh/Hathayogapage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/15.webp";
/* ── Google / Unsplash image URLs ── */
const IMG = {
  hero: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80",
  classRoom:
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80",
  pose200:
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80",
  pose300:
    "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80",
  pose500:
    "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80",
  ashram:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
};

/* ── Chakra data ── */
const chakras = [
  {
    name: "Muladhara",
    color: "#c0392b",
    symbol: "◼",
    meaning: "Root — Stability",
  },
  {
    name: "Svadhisthana",
    color: "#e67e22",
    symbol: "◉",
    meaning: "Sacral — Creativity",
  },
  {
    name: "Manipura",
    color: "#f1c40f",
    symbol: "▲",
    meaning: "Solar Plexus — Power",
  },
  { name: "Anahata", color: "#27ae60", symbol: "✦", meaning: "Heart — Love" },
  {
    name: "Vishuddha",
    color: "#2980b9",
    symbol: "◎",
    meaning: "Throat — Truth",
  },
  {
    name: "Ajna",
    color: "#8e44ad",
    symbol: "◈",
    meaning: "Third Eye — Intuition",
  },
  {
    name: "Sahasrara",
    color: "#9b59b6",
    symbol: "✿",
    meaning: "Crown — Consciousness",
  },
];

/* ── Benefits ── */
const benefits = [
  "Promotes physical strength and flexibility",
  "Relieves stress and ensures deep relaxation",
  "Harmonizes the body's chakras and creates balanced energy",
  "Enhances lung capacity and improves respiratory health",
  "Provides focus, mental clarity and cognitive functioning",
  "Fosters a deep connection with oneself, nature and the universe",
  "Improves blood circulation, cardiovascular & hormonal health",
  "Promotes better sleep and healthy digestion",
  "Enhances overall well-being and promotes a fulfilling life",
];

/* ── Course details ── */
const courseDetails = [
  "Upa Yoga, Yogasana, Surya Kriya, Prayanama, Mantra Yoga, Nada Yoga and more",
  "Qualified instructors conduct both practical and theoretical classes",
  "Students are introduced to yogic physiology alongside Siddha medicine",
  "Excursions to holy places where inner peace can be discovered",
  "Introduction to yogic principles and ways to employ them in real life",
  "Students are helped to find inner peace through the hatha yoga TTC in India",
  "A sattvic diet is provided while practising hatha yoga to achieve fitness",
  "Tests and assessments to keep track of learning progress",
];

/* ── Pricing ── */
const pricing = [
  {
    date: "05th Jan to 29th Jan 2026",
    dorm: "$749",
    shared: "$999",
    pvt: "$1099",
  },
  {
    date: "03rd Feb to 27th Feb 2026",
    dorm: "$749",
    shared: "$999",
    pvt: "$1099",
  },
  {
    date: "03rd Mar to 27th Mar 2026",
    dorm: "$749",
    shared: "$999",
    pvt: "$1099",
  },
  {
    date: "03rd Apr to 27th Apr 2026",
    dorm: "$749",
    shared: "$999",
    pvt: "$1099",
  },
  {
    date: "03rd May to 27th May 2026",
    dorm: "$749",
    shared: "$999",
    pvt: "$1099",
  },
];

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function HathaYogaPage() {
  const [activeChakra, setActiveChakra] = useState<number | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);

  /* Intersection observer for scroll-reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(`.${styles.reveal}`)
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {/* ══ Mandala BG watermark ══ */}
      <div className={styles.mandalaWatermark} aria-hidden="true">
        <MandalaSVG opacity={0.04} size={700} />
      </div>
<section className={styles.heroSection}>
        <Image
          src={heroImg}
          alt="Yoga Students Group"
          width={1180}
          height={540}
          className={styles.heroImage}
          priority
        />
      </section>
      

      {/* ══════════════════════ INTRO ══════════════════════ */}
      <section className={`${styles.section} ${styles.introSection}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.introGrid}`}>
            <div className={styles.introText}>
              <h2 className={styles.sectionTitle}>A Sacred Path to Mastery</h2>
              <OrnamentDivider />
              <p className={styles.para}>
                Have you ever felt physically drained or mentally overwhelmed?
                You're not alone. In today's fast-paced, materialistic world,
                more people are turning to <strong>Hatha yoga</strong> as a
                time-tested way to restore balance, strength, and inner peace.
                This ancient practice harmonises the energy flow between the
                body, mind, and spirit, offering both physical and emotional
                healing.
              </p>
              <p className={styles.para}>
                At AYM Yoga School, we are recognized globally for our{" "}
                <strong>
                  200 Hour Hatha Yoga Teacher Training in Rishikesh
                </strong>
                , designed to help you master the foundations of Hatha yoga
                while deepening your spiritual and teaching journey.
              </p>
              <p className={styles.para}>
                Whether you're a beginner or an experienced practitioner, our{" "}
                <strong>Yoga Alliance certified Hatha YTT</strong> in Rishikesh
                is a transformative blend of traditional yogic wisdom and modern
                teaching methodology — supported by experienced teachers in the
                yoga capital of the world.
              </p>
              <p className={styles.paraSmall}>
                Looking to explore deeper paths? We also offer{" "}
                <strong>
                  300-Hour and 500-Hour Hatha Yoga Teacher Training
                </strong>{" "}
                in Rishikesh, ideal for those wanting to refine their personal
                practice and become internationally recognized instructors.
              </p>
            </div>
            <div className={styles.introImage}>
              <div className={styles.imageFrame}>
                <img src={IMG.classRoom} alt="Yoga class in Rishikesh" />
                <div className={styles.imageCaption}>
                  Morning Satsang · AYM Ashram
                </div>
              </div>
              <div className={styles.accredBox}>
                <p className={styles.accredTitle}>Accreditations</p>
                {[
                  "✓ Yoga Alliance USA — RYS 200 / 300 / 500",
                  "✓ Ministry of AYUSH, Government of India",
                  "✓ International Yoga Federation",
                  "✓ Internationally Recognised Certificate",
                ].map((a) => (
                  <span key={a} className={styles.accredBadge}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ WHAT IS HATHA ══════════════════════ */}
      <section className={`${styles.section} ${styles.whatSection}`}>
        <div className={styles.mandalaBg} aria-hidden="true">
          <MandalaRingSVG size={500} opacity={0.06} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <p className={styles.superLabel}>Ancient Wisdom</p>
            <h2 className={styles.sectionTitle}>What is Hatha Yoga?</h2>
            <OrnamentDivider />
            <p className={styles.paraCenter}>
              Hatha yoga can be understood as a traditional and classical yoga
              form. The term <em>hatha</em> refers to "force" or "effort." It
              balances the body's energy and focuses on physical postures
              (asanas) and breathing techniques (pranayama). A gentle and
              slow-paced style of yoga, it emphasizes balancing the body's
              energy centres (chakras) and channels (Nadis) and aims to
              cultivate focus and self-awareness.
            </p>
            <p className={styles.paraCenter}>
              If you seek meditative practices or in-depth knowledge of yoga's
              physical and energetic aspects, enrol in our{" "}
              <strong>
                200 hour Hatha yoga teacher training in Rishikesh.
              </strong>{" "}
              We are licensed and registered with Yoga Alliance and provide
              top-rated courses based on theoretical and practical learning
              methods.
            </p>
          </div>

          {/* Chakra Grid */}
          <div className={`${styles.reveal} ${styles.chakraGrid}`}>
            {chakras.map((c) => (
              <div
                key={c.name}
                className={styles.chakraCard}
                style={{ "--c": c.color } as React.CSSProperties}
              >
                <div className={styles.chakraGlyph}>{c.symbol}</div>
                <h4 className={styles.chakraName}>{c.name}</h4>
                <p className={styles.chakraMeaning}>{c.meaning}</p>
                <div className={styles.chakraBar} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ BENEFITS ══════════════════════ */}
      <section className={`${styles.section} ${styles.benefitsSection}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.benefitsGrid}`}>
            <div className={styles.benefitsLeft}>
              <p className={styles.superLabel}>Transformation</p>
              <h2 className={styles.sectionTitle}>Benefits of Hatha Yoga</h2>
              <OrnamentDivider />
              <p className={styles.para}>
                It may not always be the right decision to learn yoga. Before
                you decide to take up the{" "}
                <strong>
                  Hatha yoga teacher training course program in Rishikesh
                </strong>
                , let us tell you why you should stick to this decision.
              </p>
              <ol className={styles.benefitsList}>
                {benefits.map((b, i) => (
                  <li key={i} className={styles.benefitItem}>
                    <span className={styles.benefitNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.benefitsRight}>
              <div className={styles.imageFrameTall}>
                <img src={IMG.ashram} alt="Yoga Ashram Rishikesh" />
              </div>
              <div className={`${styles.pullQuote}`}>
                <span className={styles.quoteGlyph}>"</span>
                Yoga is not about touching your toes. It is what you learn on
                the way down.
                <span className={styles.quoteGlyph}>"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ CERTIFICATION ══════════════════════ */}
      <section className={`${styles.section} ${styles.certSection}`}>
        <div className={styles.certBg} aria-hidden="true">
          <MandalaRingSVG size={600} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <p className={styles.superLabel}>Recognition</p>
            <h2 className={styles.sectionTitle}>Hatha Yoga Certification</h2>
            <OrnamentDivider />
            <p className={styles.paraCenter}>
              At AYM, regardless of the type of course programme the students
              might have chosen, they are provided with the certification at the
              end. As India's leading{" "}
              <strong>hatha yoga teacher training institute</strong>, we provide
              sessions sincerely, tracking students' progress. Our teachers also
              conduct regular tests and assessments to ensure students know
              everything. Once the course is complete, we reward the knowledge
              and expertise of our students by offering them{" "}
              <strong>
                hatha yoga teacher training certification in India
              </strong>
              . Our certification can be used anywhere in the world to start
              one's career as a professional.
            </p>
          </div>
          <div className={`${styles.reveal} ${styles.certCards}`}>
            {[
              {
                h: "200 Hour",
                sub: "Foundation Programme",
                img: IMG.pose200,
                href: "#200hr",
              },
              {
                h: "300 Hour",
                sub: "Advanced Programme",
                img: IMG.pose300,
                href: "#300hr",
              },
              {
                h: "500 Hour",
                sub: "Master Programme",
                img: IMG.pose500,
                href: "#500hr",
              },
            ].map((c) => (
              <a key={c.h} href={c.href} className={styles.certCard}>
                <div className={styles.certCardImg}>
                  <img src={c.img} alt={c.h} />
                  <div className={styles.certCardOverlay} />
                </div>
                <div className={styles.certCardBody}>
                  <h3 className={styles.certCardTitle}>{c.h}</h3>
                  <p className={styles.certCardSub}>Hatha Yoga Course</p>
                  <p className={styles.certCardProg}>{c.sub}</p>
                  <span className={styles.certCardLink}>Explore →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ ASHRAM ══════════════════════ */}
      <section className={`${styles.section} ${styles.ashramSection}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.ashramGrid}`}>
            <div className={styles.ashramText}>
              <p className={styles.superLabel}>Sacred Space</p>
              <h2 className={styles.sectionTitle}>
                Hatha Yoga Ashram
                <br />
                Rishikesh, India
              </h2>
              <OrnamentDivider />
              <p className={styles.para}>
                At AYM, we are located in the world's most serene and beautiful
                place. Our classes are held in Rishikesh, which is known to be
                the birthplace of this aged old practice and heaven on earth.
                With a clean and well-maintained ambience created, we ensure
                that hygiene and peace are our priority.
              </p>
              <p className={styles.para}>
                As students come to our institution, we give them a quick tour
                before the{" "}
                <strong>hatha yoga teacher training course in India</strong>{" "}
                begins. They are shown their rooms, which are fully furnished
                with the basic amenities — from comfortable beds to access to
                hot water.
              </p>
              <p className={styles.para}>
                Far from the city's hustle, our yoga school brings students
                close to nature. Our ultimate aim is to provide students with
                spaces where they can grow, nurture and engage in this mindful
                practice with full attention.
              </p>
            </div>
            <div className={styles.ashramImage}>
              <div className={styles.imageFrame}>
                <img src={IMG.ashram} alt="AYM Yoga Ashram" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ CURRICULUM ══════════════════════ */}
      <section
        id="curriculum"
        className={`${styles.section} ${styles.curriculumSection}`}
      >
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <p className={styles.superLabel}>Syllabus</p>
            <h2 className={styles.sectionTitle}>
              Course Details of Hatha Yoga
              <br />
              Teacher Training in India
            </h2>
            <OrnamentDivider />
          </div>
          <div className={`${styles.reveal} ${styles.curriculumGrid}`}>
            {courseDetails.map((d, i) => (
              <div key={i} className={styles.curriculumItem}>
                <span className={styles.curriculumNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.curriculumText}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PRICING ══════════════════════ */}
      <section
        id="apply"
        className={`${styles.section} ${styles.pricingSection}`}
      >
        <div className={styles.pricingBg} aria-hidden="true">
          <MandalaRingSVG size={800} opacity={0.04} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <p className={styles.superLabel}>Enrolment</p>
            <h2 className={styles.sectionTitle}>
              How to Apply for
              <br />
              Hatha Yoga Course
            </h2>
            <OrnamentDivider />
            <p className={styles.paraCenter}>
              To apply, fill the{" "}
              <a href="#" className={styles.inlineLink}>
                Registration Form
              </a>{" "}
              and Deposit Advance Fee to secure your place in the teacher
              training programs in India.
            </p>
          </div>

          <div className={`${styles.reveal} ${styles.tableWrapper}`}>
            <table className={styles.pricingTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Dormitory</th>
                  <th>Shared Room</th>
                  <th>Private Room</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td className={styles.price}>{row.dorm}</td>
                    <td className={styles.price}>{row.shared}</td>
                    <td className={styles.price}>{row.pvt}</td>
                    <td>
                      <span className={styles.available}>Available</span>
                    </td>
                  </tr>
                ))}
                <tr className={styles.bookRow}>
                  <td>
                    <strong>Book Your Spot</strong>
                  </td>
                  <td colSpan={2}>Register your spot by Paying $110 only</td>
                  <td colSpan={2}>
                    <a href="#" className={styles.btnPrimary}>
                      💳 Payments Page
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Programme overview */}
          <div className={`${styles.reveal} ${styles.programmeBox}`}>
            <p className={styles.para}>
              Our <strong>Hatha Yoga Teacher Training in India</strong> is
              available in three distinctive programmes. We have 200 hour
              courses available for novices, whereas we have 300 hour courses
              for advanced learners. Anyone who wants to complete the course
              thoroughly and develop a career as a yoga practitioner can take up
              the <strong>500 hour yoga teacher training in India</strong>.
            </p>
            <p className={styles.para}>
              Our syllabus for each programme is created uniquely by our
              certified instructors, who aim to meet the global standard. At the
              end of the course, students are offered a{" "}
              <strong>
                recognized hatha yoga teacher training certification
              </strong>
              , which proves their expertise in the area — enabling them to
              kickstart their careers anywhere across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════ FOOTER CTA ══════════════════════ */}
      <section className={styles.footerCta}>
        <div className={styles.footerMandala} aria-hidden="true">
          <MandalaRingSVG size={400} opacity={0.1} />
        </div>
        <div className={styles.container}>
          <div className={styles.footerCtaInner}>
            <span className={styles.footerOm}>ॐ</span>
            <h2 className={styles.footerTitle}>Begin Your Sacred Journey</h2>
            <p className={styles.footerSub}>
              Join thousands of students who have transformed their lives at AYM
              Yoga School
            </p>
            <div className={styles.heroBtns}>
              <a href="#apply" className={styles.btnPrimary}>
                Apply Now
              </a>
              <a
                href="mailto:info@aymyogaschool.com"
                className={styles.btnOutline}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <HowToReach />
    </div>
  );
}

/* ════════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════════ */

function OrnamentDivider() {
  return (
    <div className={styles.ornamentDivider}>
      <span className={styles.ornLine} />
      <span className={styles.ornGlyph}>❧</span>
      <span className={styles.ornLine} />
    </div>
  );
}

function MandalaRingSVG({
  size = 300,
  opacity = 0.08,
}: {
  size?: number;
  opacity?: number;
}) {
  const n = 24;
  const cx = size / 2;
  const r1 = size * 0.44;
  const r2 = size * 0.35;
  const r3 = size * 0.24;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
    >
      <g stroke="#c46a00" strokeWidth="0.8" fill="none">
        <circle cx={cx} cy={cx} r={r1} />
        <circle cx={cx} cy={cx} r={r2} />
        <circle cx={cx} cy={cx} r={r3} />
        <circle cx={cx} cy={cx} r={size * 0.12} />
        {Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * 2 * Math.PI;
          const x1 = cx + r3 * Math.cos(a);
          const y1 = cx + r3 * Math.sin(a);
          const x2 = cx + r1 * Math.cos(a);
          const y2 = cx + r1 * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * 2 * Math.PI;
          const x1 = cx + (r2 - 12) * Math.cos(a);
          const y1 = cx + (r2 - 12) * Math.sin(a);
          const x2 = cx + (r2 + 12) * Math.cos(a);
          const y2 = cx + (r2 + 12) * Math.sin(a);
          return (
            <ellipse
              key={i}
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              rx={14}
              ry={5}
              transform={`rotate(${(i / 8) * 360} ${(x1 + x2) / 2} ${(y1 + y2) / 2})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function MandalaSVG({
  opacity = 0.05,
  size = 600,
}: {
  opacity?: number;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g
        stroke="#c46a00"
        strokeWidth="0.6"
        fill="none"
        transform={`translate(${size / 2},${size / 2})`}
      >
        {[0.46, 0.38, 0.28, 0.18, 0.09].map((r, ri) => (
          <circle key={ri} cx={0} cy={0} r={r * size} />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          const r0 = size * 0.09;
          const r1 = size * 0.46;
          return (
            <line
              key={i}
              x1={r0 * Math.cos(a)}
              y1={r0 * Math.sin(a)}
              x2={r1 * Math.cos(a)}
              y2={r1 * Math.sin(a)}
            />
          );
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 2 * Math.PI;
          const r = size * 0.32;
          return (
            <ellipse
              key={i}
              cx={r * Math.cos(a)}
              cy={r * Math.sin(a)}
              rx={size * 0.07}
              ry={size * 0.025}
              transform={`rotate(${(i / 12) * 360} ${r * Math.cos(a)} ${r * Math.sin(a)})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

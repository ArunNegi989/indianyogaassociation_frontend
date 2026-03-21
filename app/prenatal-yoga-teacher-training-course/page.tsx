"use client";

import React from "react";
import styles from "@/assets/style/prenatal-yoga-teacher-training-course/Pregnancyyogattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/12.webp";

/* ─────────────────────────────────────────
   MANDALA SVG
───────────────────────────────────────── */
const MandalaSVG = ({
  size = 300,
  c1 = "#e07b00",
  c2 = "#d4a017",
  sw = 0.5,
}: {
  size?: number;
  c1?: string;
  c2?: string;
  sw?: number;
}) => (
  <svg
    viewBox="0 0 300 300"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g fill="none" stroke={c1} strokeWidth={sw}>
      {[145, 125, 106, 88, 70, 52, 36, 22, 10].map((r, i) => (
        <circle key={i} cx="150" cy="150" r={r} />
      ))}
    </g>
    <g fill="none" stroke={c2} strokeWidth={sw * 0.65} opacity="0.45">
      {(
        [
          [150, 5, 150, 295],
          [5, 150, 295, 150],
          [47, 47, 253, 253],
          [253, 47, 47, 253],
          [10, 100, 290, 200],
          [10, 200, 290, 100],
          [100, 10, 200, 290],
          [200, 10, 100, 290],
        ] as number[][]
      ).map((d, i) => (
        <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} />
      ))}
    </g>
    <g fill="none" stroke={c2} strokeWidth={sw * 0.5} opacity="0.2">
      <ellipse cx="150" cy="150" rx="145" ry="62" />
      <ellipse cx="150" cy="150" rx="62" ry="145" />
      <ellipse cx="150" cy="150" rx="145" ry="95" />
      <ellipse cx="150" cy="150" rx="95" ry="145" />
    </g>
    <g fill="none" stroke={c1} strokeWidth={sw * 0.38} opacity="0.18">
      {[0, 30, 60, 90, 120, 150].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={150 + 148 * Math.cos(r)}
            y1={150 + 148 * Math.sin(r)}
            x2={150 - 148 * Math.cos(r)}
            y2={150 - 148 * Math.sin(r)}
          />
        );
      })}
    </g>
    <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
    <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.6" />
  </svg>
);

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
const OmDivider = () => (
  <div className={styles.omDiv}>
    <span className={styles.omLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.omLine} />
  </div>
);

/* ─────────────────────────────────────────
   SCHEDULE DATA
───────────────────────────────────────── */
const scheduleRows = [
  {
    date: "24th Jan to 31st Jan 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Feb to 03rd Mar 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Mar to 31st Mar 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Apr to 01st Apr 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th May to 31st May 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Jun to 01st Jun 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Jul to 31st Jul 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Aug to 31st Aug 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Sep to 01st Sep 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Oct to 31st Oct 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Nov to 01st Nov 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
  {
    date: "24th Dec to 31st Dec 2026",
    dorm: "$399",
    priv: "$499",
    lux: "$699",
  },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function PregnancyYogaTTC() {
  return (
    <div className={styles.page}>
      {/* ── Fixed Mandala Decorations ── */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={400} c1="#e07b00" c2="#d4a017" sw={0.44} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={360} c1="#d4a017" c2="#e07b00" sw={0.44} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={210} c1="#e07b00" c2="#d4a017" sw={0.58} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={210} c1="#d4a017" c2="#e07b00" sw={0.58} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />
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
      {/* ══════════════════════════════════════
          SECTION 1 — HERO INTRO + 3 IMAGES
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <h1 className={styles.heroTitle}>
            Pregnancy Yoga Course in Rishikesh
          </h1>
          <div className={styles.titleUnderline} />

          <p className={styles.bodyPara}>
            Pregnancy is one of the most crucial and beautiful phases in a
            woman's life. During this time, her body undergoes significant
            physical and emotional changes. To support women during this sacred
            journey, AYM Yoga School offers the best prenatal yoga teacher
            training in Rishikesh, including our specialized 85-hour prenatal
            yoga course designed to meet the needs of expecting mothers.
          </p>
          <p className={styles.bodyPara}>
            Our program blends traditional techniques with modern approaches,
            incorporating Garbh Sanskar practices to nurture both the mother and
            the baby. From mindfulness and emotional balance to building
            strength and preparing for childbirth, this certification course
            provides holistic support for a healthy and joyful pregnancy.
          </p>
          <p className={styles.bodyPara}>
            Join AYM - the trusted name in pregnancy and prenatal yoga in
            Rishikesh—and experience a transformative journey toward motherhood.
          </p>

          {/* 3-image grid */}
          <div className={styles.heroImageGrid}>
            <div className={styles.heroImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80"
                alt="Prenatal yoga pose with bolster"
                className={styles.heroImg}
                loading="eager"
              />
              <div className={styles.heroImgOverlay} />
            </div>
            <div className={styles.heroImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
                alt="Prenatal yoga pose with chair support"
                className={styles.heroImg}
                loading="eager"
              />
              <div className={styles.heroImgOverlay} />
            </div>
            <div className={styles.heroImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80"
                alt="Prenatal yoga triangle pose"
                className={styles.heroImg}
                loading="eager"
              />
              <div className={styles.heroImgOverlay} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — COURSE FEATURES
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          <h2 className={styles.sectionTitle}>
            Prenatal Yoga Teacher Training Course Features
          </h2>
          <div className={styles.titleUnderline} />

          <p className={styles.bodyPara}>
            Being at the top of the list of{" "}
            <strong>best pregnancy yoga courses in Rishikesh</strong>, we offer
            tailored courses for pregnant women. We aim to offer a soothing
            journey towards a healthy pregnancy. Our courses include different
            forms and techniques of yoga and practical guidance. It is a
            comprehensive program where students learn how to teach yoga to
            pregnant women.
          </p>
          <p className={styles.bodyPara}>
            All the techniques are beneficial for expecting mothers. In addition
            to teaching, our <strong>pregnancy yoga course in Rishikesh</strong>{" "}
            also involves practical workshops to offer you hands-on experience.
            Moreover, here is the detailed structure of the course:
          </p>

          {/* Location sub-section */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.subSectionTitle}>
              Prenatal Yoga School in Rishikesh – Location
            </h2>
            <div className={styles.subUnderline} />
            <p className={styles.bodyPara}>
              AYM Yoga Ashram is set back in the stunning location of Tapovan,
              Rishikesh and is surrounded by beautiful mountains, waterfalls,
              and supreme tranquility. The famous Laxman Jhula Bridge over the
              graceful and holy Ganges River is just a 12-minute walk from our
              ashram, allowing our students the opportunity to enjoy and immerse
              themselves in the exciting Indian culture during the days off.
            </p>

            {/* Schedule grid: left list + right image */}
            <div className="row g-4 align-items-start mt-2">
              <div className="col-12 col-lg-6">
                <div className={styles.scheduleBlock}>
                  <div className={styles.scheduleHeader}>
                    The program, a draft of a schedule:
                  </div>
                  <div className={styles.scheduleList}>
                    {[
                      ["07.00h – 08.00h", "Meditation / Pranayama"],
                      ["08.00h – 08.30h", "Tea"],
                      ["08.30h – 10.00h", "Pregnancy yoga"],
                      ["10.00h – 10.30h", "Breakfast"],
                      ["10.30h – 11.30h", "Philosophy"],
                      ["12.00h – 13.00h", "Teaching Practice"],
                      ["13.00h – 14.45h", "Lunch Break"],
                      ["14.45h – 16.00h", "Anatomy"],
                      ["16.30h – 18.00h", "Asana Practice"],
                      ["19.30h – 20.30h", "Light Dinner"],
                    ].map(([time, act], i) => (
                      <div key={i} className={styles.schedRow}>
                        <span className={styles.schedTime}>{time}</span>
                        <span className={styles.schedSep}>:</span>
                        <span className={styles.schedAct}>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className={styles.locationImgWrap}>
                  <img
                    src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80"
                    alt="AYM Yoga School Rishikesh studio class"
                    className={styles.locationImg}
                    loading="lazy"
                  />
                  <div className={styles.locationImgFrame} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — AVAILABILITY TABLE + COSTS + ONLINE
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDeep}`}>
        <div className="container px-3 px-md-4">
          {/* ── Schedule Table ── */}
          <h2 className={styles.sectionTitle}>
            Upcoming Prenatal Yoga Teacher Training India 2026
          </h2>
          <div className={styles.titleUnderline} />

          <div className={`table-responsive ${styles.tableWrap}`}>
            <table className={styles.schedTable}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>DORMITORY ACCOMMODATION</th>
                  <th>PRIVATE ACCOMMODATION</th>
                  <th>LUXURY ACCOMMODATION</th>
                  <th>AVAILABILITY</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.dorm}</td>
                    <td>{row.priv}</td>
                    <td>{row.lux}</td>
                    <td className={styles.availCell}>Available</td>
                  </tr>
                ))}
                <tr className={styles.bookRow}>
                  <td className={styles.bookLabel}>Book Your Spot</td>
                  <td>Register your spot</td>
                  <td>by Paying $110 only</td>
                  <td colSpan={2}>
                    <a href="#" className={styles.payBtn}>
                      🛒 Payments Page
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── TTC Costs ── */}
          <div className={styles.costsBlock}>
            <h2 className={styles.sectionTitle}>
              Prenatal Yoga TTC Costs and How to Apply
            </h2>
            <div className={styles.titleUnderline} />
            <p className={styles.bodyPara}>
              Course Fee: <strong>399 USD</strong>. This fee includes food,
              accommodation and course fees. To apply to send us an email.
            </p>
          </div>

          {/* ── Online Course ── */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.subSectionTitle}>
              Online Pregnancy Yoga Teacher Training in Rishikesh
            </h2>
            <div className={styles.subUnderline} />
            <p className={styles.bodyPara}>
              Detailed Structure of the course for online and offline course.
            </p>

            {/* Bullet items */}
            <ul className={styles.bulletList}>
              <li>
                2 Asana class, One pranayama, Meditation and Kriya Class - 35
                Hours
              </li>
              <li>
                Teaching Methodology (TM) Teaching Skills Teaching Methodology
                (TM) = 10.00 Hours Lecture and Practice on Teaching Methodology
              </li>
              <li>Prenatal Anatomy &amp; Physiology (AP) = 10.00 Hours</li>
              <li>
                Yoga Philosophy for Mothers, Yoga Philosophy/LifeStyle Ethics
                (YPLE) = 10.00 hours Philosophy of Yoga in Relation to Pregnancy
              </li>
              <li>
                Practicum teaching and feedback Practicum = 20.00 = Hours (
                Online watching of videos of yoga teaching) – Self
              </li>
              <li>Supplementary hours – Mantra and Kirtan = 2 Hours</li>
            </ul>

            {/* Hours summary */}
            <div className={styles.hoursSummary}>
              {[
                ["Total Hours", "100 Hours"],
                ["Contact Hours", "35 + 10 + 10 + 10 + 20 + 2 = 87 Hours"],
                ["Non-contact Hours", "13 Hours"],
                ["Yoga Course Package Price", "USD 399"],
              ].map(([label, value], i) => (
                <div key={i} className={styles.hoursRow}>
                  <span className={styles.hoursLabel}>{label}</span>
                  <span className={styles.hoursSep}>–</span>
                  <span className={styles.hoursValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <HowToReach />
    </div>
  );
}

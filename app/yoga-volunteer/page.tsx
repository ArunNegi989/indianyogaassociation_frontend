"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/assets/style/yoga-volunteer/Postyttcpage.module.css";
import HowToReach from "@/components/home/Howtoreach";

/* ── Inline SVG Mandala ── */
const MandalaIcon = ({
  size = 80,
  opacity = 0.18,
}: {
  size?: number;
  opacity?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    style={{ opacity }}
  >
    <circle cx="100" cy="100" r="95" stroke="#F15505" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="75" stroke="#F15505" strokeWidth="1" />
    <circle cx="100" cy="100" r="55" stroke="#F15505" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="35" stroke="#F15505" strokeWidth="1" />
    <circle
      cx="100"
      cy="100"
      r="15"
      stroke="#F15505"
      strokeWidth="2"
      fill="rgba(224,123,0,0.15)"
    />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      const x1 = 100 + 15 * Math.cos(r);
      const y1 = 100 + 15 * Math.sin(r);
      const x2 = 100 + 95 * Math.cos(r);
      const y2 = 100 + 95 * Math.sin(r);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#F15505"
          strokeWidth="0.8"
        />
      );
    })}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      const cx = 100 + 75 * Math.cos(r);
      const cy = 100 + 75 * Math.sin(r);
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="5"
          stroke="#F15505"
          strokeWidth="1"
          fill="rgba(224,123,0,0.2)"
        />
      );
    })}
    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      const cx = 100 + 55 * Math.cos(r);
      const cy = 100 + 55 * Math.sin(r);
      return (
        <polygon
          key={i}
          points={`${cx},${cy - 7} ${cx + 6},${cy + 4} ${cx - 6},${cy + 4}`}
          fill="rgba(224,123,0,0.25)"
          stroke="#F15505"
          strokeWidth="0.8"
        />
      );
    })}
  </svg>
);

const OmDivider = () => (
  <div className={styles.omDivider}>
    <div className={styles.dividerLine} />
    <span className={styles.omSymbol}>☸</span>
    <div className={styles.dividerLine} />
  </div>
);

const ChakraRow = () => {
  const chakras = [
    { name: "Muladhara", color: "#c0392b", symbol: "▼", label: "Root" },
    { name: "Svadhisthana", color: "#e67e22", symbol: "◎", label: "Sacral" },
    { name: "Manipura", color: "#f1c40f", symbol: "▲", label: "Solar" },
    { name: "Anahata", color: "#27ae60", symbol: "✦", label: "Heart" },
    { name: "Vishuddha", color: "#2980b9", symbol: "○", label: "Throat" },
    { name: "Ajna", color: "#8e44ad", symbol: "◈", label: "Third Eye" },
    { name: "Sahasrara", color: "#9b59b6", symbol: "✿", label: "Crown" },
  ];
  return (
    <div className={styles.chakraRow}>
      {chakras.map((c, i) => (
        <div key={i} className={styles.chakraItem}>
          <div
            className={styles.chakraCircle}
            style={{ borderColor: c.color, color: c.color }}
          >
            <span className={styles.chakraSymbol}>{c.symbol}</span>
          </div>
          <span className={styles.chakraName}>{c.name}</span>
          <span className={styles.chakraLabel}>{c.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function PostYTTCPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const programs = [
    {
      num: "01",
      title: "Yoga Volunteer Program",
      desc: "Students have to indulge in voluntary service in exchange for their stay. A sacred exchange of seva and spiritual growth.",
    },
    {
      num: "02",
      title: "Yoga Immersion",
      desc: "Immerse yourself in Teachings. Deep dive into the ancient wisdom passed down through Guru-parampara lineage.",
    },
    {
      num: "03",
      title: "Yoga Sadhana",
      desc: "They have to practice various asanas and meditation themselves to increase their learning and personal mastery.",
    },
    {
      num: "04",
      title: "Advance Yoga Sadhana",
      desc: "Inner awakening course — for those ready to transcend the ordinary and step into advanced yogic practices.",
      highlight: true,
    },
  ];

  const rules = [
    "You must devote your time to the activities of ashram.",
    "Students should not be allowed to leave ashram without permission (except on weekly free day) or at their designated time, with consent of your course director.",
    "Practitioners will have to follow the path of karma yoga (8 hours).",
    "It is expected for students to wake up and sleep on time.",
    "Use of electronic gadgets like mobile phone and tablets are not allowed in the ashrams except in their designated time frames. Heavy electrical items like iron are not permitted.",
    "Ashram has the right to decide your admission and period of stay; also ashram can refuse your visit without assigning any reason to you.",
    "Students have to keep their room neat and tidy and keep it the same as they were assigned.",
    "Giving clothes, money, and tips are not allowed as it affects the dignity of the ashram. If willing to provide monetary help, please donate it in the office.",
  ];

  const prohibited = [
    "Smoking, alcohol, non-vegetarian, and onion and garlic are not allowed.",
    "Photography, video, and audio recording during classes and ceremonies are allowed only with permission of director; pets are not allowed.",
    "Students are expected to respect local culture and tradition. Any public display of affection like a hug, kissing is not allowed. AYM Yoga Ashram highly condemns any harassment at staff, guest, and visitors.",
  ];

  return (
    <div className={`${styles.page} ${visible ? styles.visible : ""}`}>
      {/* Background Mandalas */}
      <div className={styles.bgMandala1}>
        <MandalaIcon size={500} opacity={0.05} />
      </div>
      <div className={styles.bgMandala2}>
        <MandalaIcon size={380} opacity={0.04} />
      </div>
      <div className={styles.bgMandala3}>
        <MandalaIcon size={300} opacity={0.05} />
      </div>

      {/* ── TOP BORDER ── */}
      <div className={styles.a} />

      {/* ══════════════════════════════════════
          HERO / HEADER
      ══════════════════════════════════════ */}
      <section className={styles.heroSection}>
        <div className={styles.heroMandalaLeft}>
          <MandalaIcon size={220} opacity={0.12} />
        </div>
        <div className={styles.heroMandalaRight}>
          <MandalaIcon size={220} opacity={0.12} />
        </div>

        <div className={styles.container}>
          <p className={styles.superTitle}>AYM Yogic Lineage</p>
          <h1 className={styles.heroTitle}>
            Welcome to AYM Yogic Lineage:
            <br />
            <em>Post YTTC course at AYM yoga</em>
          </h1>
          <OmDivider />

          <div className={styles.heroContent}>
            <p className={styles.heroPara}>
              Recently there are ample of yoga schools has opened in Rishikesh
              for various reasons. Some are solely focusing on yoga teacher
              training and while some are focusing on the lineage of ancient
              yoga.
            </p>
            <p className={styles.heroPara}>
              The AYM{" "}
              <span className={styles.highlight}>yoga ashram in Rishikesh</span>{" "}
              is the perfect blend of both. We at AYM yoga ashram strongly
              believe in following Guru parampara and create a strong bond with
              their disciples even after the completion of their yoga courses.
            </p>
            <p className={styles.heroPara}>
              The students who are willing to deepen their practice or sadhana
              under the guidance of our yoga gurus at AYM are welcome for
              post-yoga TTC in AYM yoga ashram. Our ashram firmly believes in
              creating a safe environment to encourage spirituality, respect,
              and moral and ethical behavior among our students.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CHAKRA SECTION
      ══════════════════════════════════════ */}
      <section className={styles.chakraSection}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>The Seven Sacred Centres</p>
          <ChakraRow />
        </div>
      </section>

      <OmDivider />

      {/* ══════════════════════════════════════
          POST TTC PROGRAMS
      ══════════════════════════════════════ */}
      <section className={styles.programSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.mandalaMini}>
              <MandalaIcon size={60} opacity={0.4} />
            </div>
            <h2 className={styles.sectionTitle}>Post TTC Yoga Program</h2>
            <div className={styles.mandalaMini}>
              <MandalaIcon size={60} opacity={0.4} />
            </div>
          </div>

          <div className={styles.programGrid}>
            {programs.map((p, i) => (
              <div
                key={i}
                className={`${styles.programCard} ${p.highlight ? styles.programCardHighlight : ""}`}
              >
                <div className={styles.programNum}>{p.num}</div>
                <div className={styles.programInner}>
                  <h3 className={styles.programTitle}>{p.title}</h3>
                  <p className={styles.programDesc}>{p.desc}</p>
                  {p.highlight && (
                    <span className={styles.innerBadge}>
                      ✦ Inner Awakening Course
                    </span>
                  )}
                </div>
                <div className={styles.programCorner} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <OmDivider />

      {/* ══════════════════════════════════════
          HOW TO APPLY
      ══════════════════════════════════════ */}
      <section className={styles.applySection}>
        <div className={styles.container}>
          <div className={styles.applyGrid}>
            <div className={styles.applyLeft}>
              <h2 className={styles.sectionTitle}>
                How to Apply &amp; Details of the Courses
              </h2>
              <p className={styles.applyPara}>
                Write us an email{" "}
                <span className={styles.emailBadge}>
                  aymyogaschool[at]gmail.com
                </span>{" "}
                for the details of Post TTC yoga programs which you want to
                apply.
              </p>
              <p className={styles.applyPara}>
                Our school is welcoming students for a volunteering position at
                the moment, so if you are willing to improve your spiritual
                education and enhance your yogic knowledge, then it is for you.
                You will be provided with{" "}
                <span className={styles.highlight}>
                  accommodation, food, and drop in facilities
                </span>{" "}
                in exchange for your services.
              </p>
              <p className={styles.applyPara}>
                Students who are willing to join must follow the discipline set
                by the school. Students behavior must be under the guidelines of
                ashram cultures.{" "}
                <em>One should not treat ashram like a resort.</em>
              </p>
            </div>
            <div className={styles.applyRight}>
              <div className={styles.applyMandala}>
                <MandalaIcon size={260} opacity={0.35} />
              </div>
              <div className={styles.applyQuote}>
                <span className={styles.quoteMarks}>"</span>
                One should not treat ashram like a resort — it is a place of
                inner transformation, discipline, and devotion.
                <span className={styles.quoteMarks}>"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OmDivider />

      {/* ══════════════════════════════════════
          RULES & REGULATIONS
      ══════════════════════════════════════ */}
      <section className={styles.rulesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.mandalaMini}>
              <MandalaIcon size={60} opacity={0.4} />
            </div>
            <h2 className={styles.sectionTitle}>
              Rules and Regulation of Yoga Volunteer Program
            </h2>
            <div className={styles.mandalaMini}>
              <MandalaIcon size={60} opacity={0.4} />
            </div>
          </div>

          <div className={styles.rulesGrid}>
            {rules.map((rule, i) => (
              <div key={i} className={styles.ruleItem}>
                <div className={styles.ruleDot}>{i + 1}</div>
                <p className={styles.ruleText}>{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OmDivider />

      {/* ══════════════════════════════════════
          DRESS CODE + PROHIBITED + ATTENDANCE
      ══════════════════════════════════════ */}
      <section className={styles.policiesSection}>
        <div className={styles.container}>
          <div className={styles.policiesGrid}>
            {/* Dress Code */}
            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>🧣</div>
              <h3 className={styles.policyTitle}>Dress Code</h3>
              <p className={styles.policyText}>
                Students are expected to wear modest clothing: tight clothing,
                clothes which reveal their shoulders, midriff, and legs are
                strictly prohibited.
              </p>
              <div className={styles.policySubtitle}>This includes:</div>
              <ul className={styles.policyList}>
                <li>
                  Shorts, leggings, low cut and sleeveless T-shirt and tank tops
                </li>
                <li>
                  Dress code and student behavior are in accordance with local
                  culture and for enhancing the spiritual atmosphere
                </li>
                <li>
                  Dress code should be maintained at all times, including yoga
                  classes
                </li>
              </ul>
            </div>

            {/* Prohibited Items */}
            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>🚫</div>
              <h3 className={styles.policyTitle}>Prohibited Items</h3>
              <ul className={styles.policyList}>
                {prohibited.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Attendance */}
            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>🪷</div>
              <h3 className={styles.policyTitle}>Attendance</h3>
              <p className={styles.policyText}>
                Your attendance at all ashram activities is mandatory while Post
                YYTC program at AYM. You are supposed to be on time for each
                program. Though only resident guest is allowed during asana
                classes.
              </p>

              <div
                className={styles.policySubtitle}
                style={{ marginTop: "1.4rem" }}
              >
                Silence
              </div>
              <p className={styles.policyText}>
                Guests are requested to keep silence during their meal, during
                the period of Satsang. Also, everyone has to keep their light
                off after <strong>10:30 PM</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaMandala}>
          <MandalaIcon size={400} opacity={0.07} />
        </div>
        <div className={styles.container}>
          <p className={styles.ctaSupra}>Begin Your Journey</p>
          <h2 className={styles.ctaTitle}>Ready to deepen your yogic path?</h2>
          <p className={styles.ctaText}>
            Connect with AYM Yoga Ashram in Rishikesh and embark on the
            transformative post-TTC journey under authentic Guru parampara
            guidance.
          </p>
          <div className={styles.ctaActions}>
            <a href="mailto:aymyogaschool@gmail.com" className={styles.ctaBtn}>
              Write to Us <span className={styles.ctaArrow}>→</span>
            </a>
            <div className={styles.ctaEmail}>aymyogaschool[at]gmail.com</div>
          </div>
        </div>
      </section>

      <div className={styles.bottomBorder} />
      <HowToReach />
    </div>
  );
}

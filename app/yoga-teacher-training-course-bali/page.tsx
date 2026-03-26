"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "@/assets/style/yoga-teacher-training-course-bali/Baliyogapage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/17.webp";
/* ─── Images ─── */
const IMG = {
  hero: heroImg,
  group:
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1100&q=80",
  ubud: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1100&q=80",
  teacher:
    "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80",
  temple:
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=80",
  rice: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80",
  practice:
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=80",
  garden:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1100&q=80",
};

/* ─── Chakras ─── */
const chakras = [
  {
    name: "Muladhara",
    color: "#c0392b",
    symbol: "◼",
    meaning: "Root · Earth · Stability",
    mantra: "LAM",
  },
  {
    name: "Svadhisthana",
    color: "#e67e22",
    symbol: "◉",
    meaning: "Sacral · Water · Creativity",
    mantra: "VAM",
  },
  {
    name: "Manipura",
    color: "#f1c40f",
    symbol: "▲",
    meaning: "Solar Plexus · Fire · Power",
    mantra: "RAM",
  },
  {
    name: "Anahata",
    color: "#27ae60",
    symbol: "✦",
    meaning: "Heart · Air · Love",
    mantra: "YAM",
  },
  {
    name: "Vishuddha",
    color: "#2980b9",
    symbol: "◎",
    meaning: "Throat · Ether · Truth",
    mantra: "HAM",
  },
  {
    name: "Ajna",
    color: "#8e44ad",
    symbol: "◈",
    meaning: "Third Eye · Light · Intuition",
    mantra: "OM",
  },
  {
    name: "Sahasrara",
    color: "#9b59b6",
    symbol: "✿",
    meaning: "Crown · Cosmic · Consciousness",
    mantra: "AH",
  },
];

/* ─── What Makes Bali Unique ─── */
const uniquePoints = [
  {
    icon: "🛕",
    title: "Hindu Culture & Ceremonies",
    body: "Home to various Hindu ceremonies and traditions. Since Bali is predominantly Hindu while the rest of Indonesia is Muslim, it creates a unique cultural vibe — creating the daily fabric of life here.",
  },
  {
    icon: "🌿",
    title: "Spiritual Hub of Asia",
    body: "Travelers flock from all over the world to this health and wellness hotspot. The mixture of culture, spirituality and the warmth of Balinese people make it a hub for yogis.",
  },
  {
    icon: "🏝️",
    title: "Island of the Gods",
    body: "Bali is an island situated between the Indian and Pacific Ocean — the only island in Indonesia which follows Hinduism, home to sacred religious sites like Uluwatu Temple.",
  },
  {
    icon: "🌄",
    title: "Ubud — Yoga Capital",
    body: "Our AYM yoga school is situated in Ubud, the yoga capital of Bali, a city with countless yoga retreats, studios, lush green paddy fields, picturesque temples and healthy food restaurants.",
  },
];

/* ─── Courses ─── */
const courses = [
  { hrs: "200", tag: "Foundation", color: "#e07b00" },
  { hrs: "300", tag: "Advanced", color: "#b85e00" },
  { hrs: "500", tag: "Mastery", color: "#7a3f00" },
];

/* ─── Highlights ─── */
const highlights = [
  "Comprehensive studies of Hatha Yoga, Kundalini yoga, and spiritual heart meditation",
  "Intense and regular practice of asanas (postures), Ashtanga yoga, vinyasa flow",
  "Purification techniques, breathing patterns, and meditations for full Hatha Yoga experience",
  "Extensive studies of yogic philosophy, meditation and mantra chanting",
  "Practice of pranayama and subtle energies channels of nadi and chakra",
];

/* ─── AYM Special ─── */
const aymSpecial = [
  {
    num: "01",
    title: "Steadiness of Practice",
    body: "Comprehensive knowledge of yoga techniques, skillfulness in yogic postures, and philosophy makes our curriculum the best yoga teacher training in Bali.",
  },
  {
    num: "02",
    title: "Coherent Structure",
    body: "We structured our curriculum so that even beginners and advanced practitioners obtain a comprehensive overview of Hatha Yoga.",
  },
  {
    num: "03",
    title: "Morning Rituals",
    body: "Our day begins with the practice of meditation, hatha yoga practice and morning chants; with personalised interaction to provide a family-like atmosphere.",
  },
  {
    num: "04",
    title: "Teaching Professionalisation",
    body: "During your yoga teacher training, we will provide plenty of opportunities to professionalise your teaching skills and help you market your new expertise.",
  },
  {
    num: "05",
    title: "Yoga Alliance Standards",
    body: "Our curriculum meets the standards of the internationally acclaimed Yoga Alliance. Our best yoga teachers provide the best conditions so they grow as best instructors.",
  },
];

/* ═══════════════════════════════════ MAIN ═══════════════════════════════════ */
export default function BaliYogaPage() {
  const [activeChakra, setActiveChakra] = useState<number | null>(null);
  const [hoveredChakra, setHoveredChakra] = useState<number | null>(null);

  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(`.${styles.reveal}`)
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {/* ══ Global mandala watermark ══ */}
      <div className={styles.pageWm} aria-hidden="true">
        <MandalaFull size={800} opacity={0.025} />
      </div>

      {/* ════════════ HERO ════════════ */}
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

      {/* ════════════ INTRO — What is Bali ════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.introBanner}`}>
            <div className={styles.introBannerDeco} aria-hidden="true">
              <MandalaRing size={180} opacity={0.1} />
            </div>
            <div className={styles.introBannerText}>
              <OmBar />
              <h2 className={styles.sectionTitle}>
                Bali: Take Your 200 Hour Yoga Teacher Training
                <br />
                to the Next Level in Paradise
              </h2>
              <p className={styles.para}>
                Bali is an Island situated between the Indian and Pacific Ocean
                and the only Island in Indonesia which follows Hinduism. The
                Island is home to a various religious site like Uluwatu Temple.
                Also known as the Islands of Gods and culture, it attracts
                tourists from all over the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ WHAT MAKES BALI UNIQUE ════════════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.mandalaBg} aria-hidden="true">
          <MandalaRing size={600} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Sacred Island</span>
            <h2 className={styles.sectionTitle}>
              What Make Bali Unique for
              <br />
              Yoga Teacher Training in Bali
            </h2>
            <OmBar />
            <p className={styles.paraCenter}>
              It is the home of various Hindus ceremonies and traditions.
              Travelers flock from all over the world to this health and
              wellness hotspot. Since Bali is predominantly Hindu while the rest
              of the country is Muslim, it creates a unique cultural vibe. All
              those Hindus ceremonies and traditions create the daily fabric of
              Life here, which make Bali very unique and sacred. Alike with the
              mixture of culture, spirituality and the warmth of Balinese people
              make it a hub for yogis and the best place for yoga teacher
              training.
            </p>
          </div>

          <div className={`${styles.reveal} ${styles.uniqueGrid}`}>
            {uniquePoints.map((u) => (
              <div key={u.title} className={styles.uniqueCard}>
                <span className={styles.uniqueIcon}>{u.icon}</span>
                <h4 className={styles.uniqueTitle}>{u.title}</h4>
                <p className={styles.uniqueBody}>{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ DESTINATION ════════════ */}
      <section id="destination" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.destGrid}`}>
            <div className={styles.destText}>
              <span className={styles.superLabel}>Our Location</span>
              <h2 className={styles.sectionTitle}>Our Destination</h2>
              <OmBar align="left" />
              <p className={styles.para}>
                Our AYM yoga school is situated in <strong>Ubud</strong>, the
                yoga capital of Bali, a city with numerous yoga retreats and
                studios. It also homes to countless yogis who came from all over
                the world — which make Ubud an excellent setting for yoga
                teacher training.
              </p>
              <p className={styles.para}>
                Filled with lush green paddy field, picturesque temple, art
                galleries, colourful market, and countless healthy food
                restaurants, you will fall in love with the dazzling town.
              </p>
              <div className={styles.destHighlights}>
                {[
                  "Ubud Monkey Forest",
                  "Tegalalang Rice Terraces",
                  "Sacred Tirta Empul Temple",
                  "Campuhan Ridge Walk",
                  "Goa Gajah — Elephant Cave",
                ].map((p) => (
                  <span key={p} className={styles.destChip}>
                    ✦ {p}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.destImages}>
              <div className={styles.destImgMain}>
                <img src={IMG.group} alt="Yoga group Bali" />
              </div>
              <div className={styles.destImgStack}>
                <div className={styles.destImgSmall}>
                  <img src={IMG.temple} alt="Bali temple" />
                </div>
                <div className={styles.destImgSmall}>
                  <img src={IMG.rice} alt="Rice terraces Ubud" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FULL-WIDTH IMAGE BREAK ════════════ */}
      <div className={styles.imgBreak}>
        <img
          src={IMG.garden}
          alt="Yoga in Bali garden"
          className={styles.imgBreakPhoto}
        />
        <div className={styles.imgBreakVeil} />
        <div className={styles.imgBreakQuote}>
          <OmBar />
          <p className={`${styles.pullQuote}`}>
            <span className={styles.qMark}>"</span>
            Yoga is not about touching your toes.
            <br />
            It is what you learn on the way down.
            <span className={styles.qMark}>"</span>
          </p>
        </div>
      </div>

      {/* ════════════ COURSES ════════════ */}
      <section
        id="courses"
        className={`${styles.section} ${styles.sectionTinted}`}
      >
        <div
          className={styles.mandalaBg}
          style={{ right: "-80px", left: "auto" }}
          aria-hidden="true"
        >
          <MandalaRing size={500} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Programmes</span>
            <h2 className={styles.sectionTitle}>Courses Provided</h2>
            <OmBar />
            <p className={styles.paraCenter}>
              Our curriculum caters to all the requirements of all yoga
              practitioners. If you want to immerse yourself in Yoga,
              meditation, and philosophy, we have training courses for you. Each
              training program is developed and run by our best Yoga teachers
              themselves. The programs vary from a yoga retreat to yoga teacher
              training of 200, 300 to 500 hours accreditations.
            </p>
          </div>

          <div className={`${styles.reveal} ${styles.coursesRow}`}>
            {courses.map((c) => (
              <div
                key={c.hrs}
                className={styles.courseCard}
                style={{ "--cc": c.color } as React.CSSProperties}
              >
                <div className={styles.courseCardMandala} aria-hidden="true">
                  <MandalaRing size={220} opacity={0.1} />
                </div>
                <div className={styles.courseHrs}>
                  {c.hrs}
                  <sub>HR</sub>
                </div>
                <div className={styles.courseTag}>{c.tag} Programme</div>
                <h3 className={styles.courseTitle}>
                  {c.hrs}-Hour Yoga Teacher Training in Bali
                </h3>
                <p className={styles.courseDesc}>
                  {c.hrs === "200" &&
                    "The internationally recognized standard certification to begin your journey as a yoga teacher. Ideal for beginners and those looking to deepen their personal practice."}
                  {c.hrs === "300" &&
                    "An advanced course for 200-hour certified teachers to expand their knowledge, skills and deepen their personal practice significantly."}
                  {c.hrs === "500" &&
                    "A comprehensive, advanced-level program for those seeking complete mastery in yoga instruction. Internationally recognised qualification."}
                </p>
                <a href="#apply" className={styles.courseBtn}>
                  Enquire →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ HIGHLIGHTS ════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.hlGrid}`}>
            <div className={styles.hlLeft}>
              <span className={styles.superLabel}>Curriculum</span>
              <h2 className={styles.sectionTitle}>Highlights of the Courses</h2>
              <OmBar align="left" />
              <p className={styles.para}>
                The keystone of our courses is comprehensive studies of Hatha
                Yoga, Kundalini yoga, and spiritual heart meditation. Our
                Courses includes the intense and regular practice of asanas
                (postures), Ashtanga yoga, vinyasa flow. To introduce full
                aspects of Hatha Yoga, we incorporate purification techniques,
                breathing patterns, and meditations.
              </p>
              <p className={styles.para}>
                Extensive studies of yogic philosophy frame our training
                courses, meditation and mantra chanting, the practice of
                pranayama and subtle energies channels of nadi and chakra.
              </p>
              <ul className={styles.hlList}>
                {highlights.map((h, i) => (
                  <li key={i} className={styles.hlItem}>
                    <span className={styles.hlBullet}>✦</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.hlRight}>
              <div className={styles.hlImageWrap}>
                <img src={IMG.practice} alt="Yoga practice Bali" />
                <div className={styles.hlImageFrame} />
                <div className={styles.hlImageMandala} aria-hidden="true">
                  <MandalaRing size={160} opacity={0.15} />
                </div>
              </div>
              <div className={styles.hlImageWrap2}>
                <img src={IMG.teacher} alt="Yoga teacher Bali" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ════════════ WHAT MAKES AYM SPECIAL ════════════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Why AYM</span>
            <h2 className={styles.sectionTitle}>
              What makes AYM yoga school
              <br />
              training special?
            </h2>
            <OmBar />
          </div>
          <div className={`${styles.reveal} ${styles.aymGrid}`}>
            {aymSpecial.map((a) => (
              <div key={a.num} className={styles.aymCard}>
                <div className={styles.aymNum}>{a.num}</div>
                <h4 className={styles.aymTitle}>{a.title}</h4>
                <p className={styles.aymBody}>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TEACHER PHOTO STRIP ════════════ */}
      <section className={styles.teacherStrip}>
        <div className={styles.teacherStripMandala} aria-hidden="true">
          <MandalaRing size={300} opacity={0.1} />
        </div>
        <OmBar dark />
        <div className={styles.teacherImgWrap}>
          <img
            src={IMG.ubud}
            alt="Yoga teacher Bali garden"
            className={styles.teacherImg}
          />
          <div className={styles.teacherImgVeil} />
        </div>
        <div className={styles.teacherCaption}>
          <OmBar dark />
          <p>
            Experience the transformative power of yoga in the heart of Bali
          </p>
        </div>
      </section>

     

      <HowToReach />
    </div>
  );
}

/* ─────────────── SUB-COMPONENTS ─────────────── */

function OmBar({
  align = "center",
  dark = false,
}: {
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div
      className={styles.omBar}
      style={{ justifyContent: align === "left" ? "flex-start" : "center" }}
    >
      <span
        className={styles.omBarLine}
        style={
          dark
            ? {
                background:
                  "linear-gradient(90deg,transparent,rgba(245,184,0,0.6),transparent)",
              }
            : {}
        }
      />
      <span
        className={styles.omBarGlyph}
        style={dark ? { color: "#f5b800" } : {}}
      >
        ॐ
      </span>
      <span
        className={styles.omBarLine}
        style={
          dark
            ? {
                background:
                  "linear-gradient(90deg,transparent,rgba(245,184,0,0.6),transparent)",
              }
            : {}
        }
      />
    </div>
  );
}

function MandalaRing({
  size = 300,
  opacity = 0.08,
}: {
  size?: number;
  opacity?: number;
}) {
  const c = size / 2;
  const rings = [0.46, 0.36, 0.26, 0.15].map((r) => r * size);
  const spokes = 24,
    petals = 16;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g stroke="#c46a00" strokeWidth="0.7" fill="none">
        {rings.map((r, i) => (
          <circle key={i} cx={c} cy={c} r={r} />
        ))}
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * 2 * Math.PI;
          return (
            <line
              key={i}
              x1={c + rings[2] * Math.cos(a)}
              y1={c + rings[2] * Math.sin(a)}
              x2={c + rings[0] * Math.cos(a)}
              y2={c + rings[0] * Math.sin(a)}
            />
          );
        })}
        {Array.from({ length: petals }).map((_, i) => {
          const a = (i / petals) * 2 * Math.PI;
          const r = rings[1];
          return (
            <ellipse
              key={i}
              cx={c + r * Math.cos(a)}
              cy={c + r * Math.sin(a)}
              rx={size * 0.065}
              ry={size * 0.022}
              transform={`rotate(${(i / petals) * 360} ${c + r * Math.cos(a)} ${c + r * Math.sin(a)})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function MandalaFull({
  size = 600,
  opacity = 0.05,
}: {
  size?: number;
  opacity?: number;
}) {
  const c = size / 2;
  const radii = [0.47, 0.39, 0.31, 0.23, 0.15, 0.08].map((r) => r * size);
  const colors = [
    "#c46a00",
    "#e07b00",
    "#b85e00",
    "#c46a00",
    "#e07b00",
    "#c46a00",
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g transform={`translate(${c},${c})`}>
        {radii.map((r, i) => (
          <circle
            key={i}
            cx={0}
            cy={0}
            r={r}
            stroke={colors[i]}
            strokeWidth="0.65"
            fill="none"
          />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          return (
            <line
              key={i}
              stroke="#c46a00"
              strokeWidth="0.5"
              x1={radii[4] * Math.cos(a)}
              y1={radii[4] * Math.sin(a)}
              x2={radii[0] * Math.cos(a)}
              y2={radii[0] * Math.sin(a)}
            />
          );
        })}
        {[
          { n: 8, r: 2, rOuter: 0.34 },
          { n: 16, r: 1, rOuter: 0.22 },
        ].map(({ n, r: ri, rOuter }, gi) =>
          Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * 2 * Math.PI;
            const R = rOuter * size;
            return (
              <ellipse
                key={`${gi}-${i}`}
                stroke="#c46a00"
                strokeWidth="0.55"
                fill="none"
                cx={R * Math.cos(a)}
                cy={R * Math.sin(a)}
                rx={size * (gi === 0 ? 0.07 : 0.04)}
                ry={size * 0.02}
                transform={`rotate(${(i / n) * 360} ${R * Math.cos(a)} ${R * Math.sin(a)})`}
              />
            );
          }),
        )}
        {/* Inner star */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * 2 * Math.PI;
          const r0 = radii[5],
            r1 = radii[4];
          return (
            <line
              key={`star-${i}`}
              stroke="#e07b00"
              strokeWidth="0.6"
              x1={r0 * Math.cos(a)}
              y1={r0 * Math.sin(a)}
              x2={r1 * Math.cos(a + Math.PI / 8)}
              y2={r1 * Math.sin(a + Math.PI / 8)}
            />
          );
        })}
      </g>
    </svg>
  );
}

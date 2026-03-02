"use client";
import React, { useState } from "react";
import styles from "@/assets/style/our-teachers/Teachers.module.css";

// ── Unsplash placeholder images ──────────────────────────────────
const teacher1 =
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&h=620&fit=crop&crop=face";
const teacher2 =
  "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=500&h=620&fit=crop&crop=face";
const teacher3 =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=620&fit=crop&crop=face";
const teacher4 =
  "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&h=620&fit=crop&crop=face";
const teacher5 =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=620&fit=crop&crop=face";
const teacher6 =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=620&fit=crop&crop=face";
const teacher7 =
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&h=620&fit=crop&crop=face";
const founderImg =
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&h=620&fit=crop&crop=face";

// ── Ornate Gold SVG Frame ─────────────────────────────────────────
const OrnateFrame: React.FC<{
  src: string;
  alt: string;
  size?: "lg" | "md" | "sm";
}> = ({ src, alt, size = "md" }) => (
  <div
    className={`${styles.frameWrap} ${styles[`frame${size.toUpperCase()}`]}`}
  >
    <svg
      className={styles.frameOrnament}
      viewBox="0 0 280 280"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f5b800" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="140" cy="140" r="135" fill="url(#goldGlow)" />
      <circle
        cx="140"
        cy="140"
        r="108"
        fill="none"
        stroke="#c8900a"
        strokeWidth="4"
      />
      <circle
        cx="140"
        cy="140"
        r="104"
        fill="none"
        stroke="#f5b800"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <circle
        cx="140"
        cy="140"
        r="99"
        fill="none"
        stroke="#d4a017"
        strokeWidth="0.8"
        opacity="0.5"
      />
      {Array.from({ length: 18 }, (_, i) => (
        <g key={i} transform={`rotate(${(i * 360) / 18}, 140, 140)`}>
          <ellipse
            cx="140"
            cy="31"
            rx="3"
            ry="7.5"
            fill="#c8900a"
            opacity="0.9"
          />
          <ellipse
            cx="140"
            cy="27"
            rx="1.8"
            ry="4"
            fill="#f5d040"
            opacity="0.85"
          />
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${(i * 360) / 8 + 22.5}, 140, 140)`}>
          <ellipse
            cx="140"
            cy="21"
            rx="7"
            ry="15"
            fill="#b87d08"
            opacity="0.9"
          />
          <ellipse
            cx="140"
            cy="16"
            rx="4"
            ry="8"
            fill="#d4a017"
            opacity="0.88"
          />
          <circle cx="140" cy="7" r="4" fill="#f5c030" opacity="0.95" />
          <circle cx="140" cy="3" r="2.2" fill="#fff0a0" opacity="0.9" />
        </g>
      ))}
      {[0, 90, 180, 270].map((angle) => (
        <g key={angle} transform={`rotate(${angle}, 140, 140)`}>
          <ellipse
            cx="140"
            cy="13"
            rx="11"
            ry="20"
            fill="#9a6a05"
            opacity="0.92"
          />
          <ellipse
            cx="140"
            cy="10"
            rx="6.5"
            ry="12"
            fill="#c8900a"
            opacity="0.88"
          />
          <ellipse
            cx="128"
            cy="20"
            rx="5"
            ry="11"
            fill="#b87d08"
            opacity="0.85"
            transform="rotate(-28, 128, 20)"
          />
          <ellipse
            cx="152"
            cy="20"
            rx="5"
            ry="11"
            fill="#b87d08"
            opacity="0.85"
            transform="rotate(28, 152, 20)"
          />
          <circle cx="140" cy="3" r="5" fill="#f5c030" opacity="0.97" />
          <circle cx="122" cy="12" r="3" fill="#f5b800" opacity="0.88" />
          <circle cx="158" cy="12" r="3" fill="#f5b800" opacity="0.88" />
          <circle cx="130" cy="27" r="2" fill="#f5d040" opacity="0.8" />
          <circle cx="150" cy="27" r="2" fill="#f5d040" opacity="0.8" />
        </g>
      ))}
      {[45, 135, 225, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle}, 140, 140)`}>
          <ellipse
            cx="140"
            cy="19"
            rx="4.5"
            ry="9"
            fill="#c8900a"
            opacity="0.72"
          />
          <ellipse
            cx="140"
            cy="15"
            rx="2.5"
            ry="5"
            fill="#f5b800"
            opacity="0.78"
          />
          <circle cx="140" cy="9" r="2.2" fill="#d4a017" opacity="0.72" />
        </g>
      ))}
      <circle cx="140" cy="140" r="92" fill="#f5e060" opacity="0.22" />
      <circle cx="140" cy="140" r="88" fill="#fdf8e8" opacity="0.55" />
    </svg>
    <img src={src} alt={alt} className={styles.framePhoto} />
  </div>
);

// ── Om Divider ────────────────────────────────────────────────────
const OmDivider: React.FC<{ color?: "saffron" | "gold" }> = ({
  color = "saffron",
}) => (
  <div
    className={`${styles.omDivider} ${color === "gold" ? styles.omDividerGold : ""}`}
  >
    <span className={styles.omLine} />
    <div className={styles.omCircle}>
      <span className={styles.omGlyph}>ॐ</span>
    </div>
    <span className={styles.omLine} />
  </div>
);

// ── Gold Separator ────────────────────────────────────────────────
const GoldSep: React.FC = () => <div className={styles.goldSep} />;

// ── Data ──────────────────────────────────────────────────────────
const FOUNDER = {
  name: "Yogi Chetan Mahesh",
  subtitle: "Founder Of AYM Yoga School",
  image: founderImg,
  bio: [
    "Yogi Chetan Mahesh Ji was born in a Vedic family, a family in which all the members used to chant Vedic mantras and practice yoga daily. During his childhood, he was influenced by his father and brother who taught yoga to him. And later he learned Yoga Asana with Yogi Balmukund Ji, Pranayama with Swami Vijayanada Ji, Philosophy from Swami Sivananda Maharaj Ji, Swami Dayananda Ji, and Osho Ji, and Samadhi with Swami Chinmayananda Ji and Piolet Baba Ji. In the year 1984, he became the champion of yoga sports in Haryana Province while studying in the school.",

    "After he finished secondary education, Yogi Mahesh went to study Bio-science with Yoga at college. After that, he studied the Master in Education which enhanced his teaching skills, helping him to efficiently explain Yoga anatomy and Physiology as well as Teaching Methodology. He continued to be a Yoga Sports Champion for five years at college, winning at all India Interuniversity Yoga Championships. During this period he met many famous yogis and learned different styles of yoga. In 2000 he became part of the National Institute for Yoga where he completed the one-year Diploma in Yoga along with Yoga Therapy and was invited to go to Germany by the India Government to teach yoga there. In 2003, after he has finished his Master in Science with a focus on Yoga, Yogi Mahesh continued to train yoga teachers in China, South Korea, Hong Kong, Singapore, Japan, and Malaysia, spreading practical knowledge of yoga worldwide.",
    "After that, Yogi Mahesh went to the Himalayas with his Spiritual Teacher Swami Tanmayananda and did spiritual practices, such as awakening the kundalini power, and learned several types of breathing and meditation techniques. He is very famous for his workshops on Ashtanga Yoga and Pranayama in South Korea and Malaysia. He was a faculty member of the Choone College at the Yoga Department in South Korea.",

    "In 2005 he became the founder secretary of the Association for Yoga and Meditation, where he has trained more than 10,000 yoga teachers up to now. He is fully committed to developing the best Yoga Teacher Training courses in India.",
  ],
};

const TEACHERS = [
  {
    name: "Ajay Kumar Ji",
    role: "Hatha Yoga · Teaching Methodology",
    image: teacher1,
    years: "12+ yrs",
    bio: [
      'Ajay Kumar is a dedicated Yoga practitioner and teacher from Rishikesh, India. He came to Yoga came at a young age and has studied formally at several respected Yoga institutions including a one-year Yoga internship at Sai Yoga Ashram, a six-month teacher training at Avdhoot Ashram (recognized by the International Yoga & Meditation Society) and teacher training at Sivananda Yoga Vedanta Dhanwanthari Ashram, Uttarakashi.',
      'Ajay has studied for many years with several senior Iyengar Certified Teachers in Rishikesh and outside Rishikesh , Hatha, and Ashtanga Yoga teachers . He was the residential Asana and meditation teacher at Vishwaguru Meditation & Yoga Institute, Sri Ved Niketan in Rishikesh for three years. He now primarily teaches Asana in Changsha, China with regular teaching visits to Shanghai, China and home to Rishikesh. Known to the community and his friends for his warm heart and sunny ever-present smile, he organically spreads the light and culture of Yoga.',
    ],
    education: [
      "Master's Degree in Yoga – 2021",
      "Formal Training at Rishikesh Gurus",
      "USA Yoga Alliance Certified",
    ],
    expertise: [
      "Hatha Yoga",
      "Ashtanga Yoga",
      "Shivananda Yoga",
      "Iyengar Yoga",
      "Power Yoga",
      "Pranayama",
    ],
  },
  {
    name: "Yogacharya Deepak Ji",
    role: "Multi-Style Yoga Teacher",
    image: teacher2,
    years: "8+ yrs",
    bio: [
      "Born in the mystical valleys of the Himalayas, one cannot resist the call of spirituality.",
      "He relocated to Rishikesh, known as the world's Yoga capital, to further explore his passion for Yoga. He became a part of the AYM Yoga School team in Rishikesh, a prominent yoga school in the area, working as both an apprentice and a teacher.",
      "Deepak is renowned for his skill in delivering an authentic comprehension of Yoga. With his unwavering commitment to Yoga, he has successfully led numerous yoga teacher training programs in Rishikesh. Deepak Bisht brings with him over 8+ years of experience in teaching and has successfully guided numerous students through the Yoga Teacher Training program.",
    ],
    education: [
      "Traditional Yoga Training in Rishikesh",
      "Deep study under traditional yoga teachers",
      "Continuous advanced training",
    ],
    expertise: [
      "Classical Hatha Yoga",
      "Ashtanga Vinyasa",
      "Pranayama & Breath Awareness",
      "Meditation",
      "Shatkarma",
    ],
  },
  {
    name: "Dr. Hemlata Ji",
    role: "Anatomy Teacher ",
    image: teacher3,
    years: "15+ yrs",
    bio: [
      "Dr. Hemlata was born in 1985 at New Tehri, located in the state of Uttarakhand. Hemlata's passion is to teach how your body works and how it could work better. With her knowledge and experience, she uses the multitude of skills she brings to each class to enrich people's lives to be mentally and physically stronger and more resilient, and better at balancing mental and emotional issues.",

"After school, Dr. Hemlata entered in Combined (P.G.) Institute of Medical Science and Research (CIMSR), Dehradun where she graduated with bachelor's degree in Physiotherapy. During graduation, she started working in the field of ‘Effect of physiotherapy on Rib-Fracture & Spinal-Cord Injuries'. She is an expert in the field of Yoga Anatomy & Physio-Yoga Therapy.",

"Hemlata Bahaguna was working in",
"2009-2010 CMI Hospital, Dehradun (Physiotherapy Department & Faculty of Anatomy).",

"2010-2011 Yashodha Hospital, Ghaziabad (Physiotherapy Department & Faculty of Anatomy).",

"2011- Present ShriKrishna Institute of Bio-Medical Science & Research (Physiotherapy Department & Faculty of Anatomy & Physiology).",

"Since 2019 she is teaching in AYM Yoga School and teaches yoga anatomy and physiology, yoga therapy."

,
    ],
    education: [
      "Master's in Naturopathy & Yogic Science",
      "20 Years Training – Bihar School of Yoga",
      "Yoga Alliance USA Certified – 2017",
    ],
    expertise: [
      "Kundalini Yoga",
      "Meditation & Consciousness",
      "Pranayama & Energy Awakening",
      "Raja Yoga",
      "Spiritual Philosophy",
    ],
  },
  {
    name: "Yogacharya Mahesh Bhatt Ji",
    role: "Yoga Philosophy / Therapy",
    image: teacher4,
    years: "10+ yrs",
    bio: [
      "Yogi Mahesh has done P.G. Diploma and Master in Yogic Sciences, and due to his excellent academic performance, he awarded a gold medal. Currently, he is pursuing Ph.D. in Yogic Science and is teaching Yoga Therapy along with Ayurveda and Philosophy. Other than that, Mahesh has also helped people to restore health through Acupressure and Marma Therapy.",
    ],
    education: [
      "M.A. in Yoga",
      "M.Sc. in Chemistry",
      "Ashram-based traditional training",
    ],
    expertise: [
      "Kundalini Yoga",
      "Yin Yoga",
      "Yoga Nidra",
      "Yoga Therapy",
      "Anatomy & Relaxation",
    ],
  },
  
  
];

const GUEST = [
  { name: "Guest Teacher 1", image: teacher1 },
  { name: "Guest Teacher 2", image: teacher2 },
  { name: "Guest Teacher 3", image: teacher3 },
  { name: "Guest Teacher 4", image: teacher4 },
  { name: "Guest Teacher 5", image: teacher5 },
  { name: "Guest Teacher 6", image: teacher6 },
  { name: "Guest Teacher 7", image: teacher7 },
  { name: "Guest Teacher 8", image: founderImg },
];

// ── Teacher Card ─────────────────────────────────────────────────
const TeacherCard: React.FC<{ teacher: (typeof TEACHERS)[0]; idx: number }> = ({
  teacher,
  idx,
}) => {
  const [open, setOpen] = useState(false);
  const isEven = idx % 2 === 1;

  return (
    <div className={`${styles.tCard} ${isEven ? styles.tCardReverse : ""}`}>
      {/* Image column */}
      <div className={styles.tImgCol}>
        <div className={styles.tImgWrapper}>
          <img src={teacher.image} alt={teacher.name} className={styles.tImg} />
          <div className={styles.tYearsBadge}>{teacher.years}</div>
          <div className={styles.tImgOverlay} />
        </div>
      </div>

      {/* Content column */}
      <div className={styles.tContent}>
        <div className={styles.tRoleTag}>{teacher.role}</div>
        <h3 className={styles.tName}>{teacher.name}</h3>
        <div className={styles.tDivider} />
      <div className={styles.tBio}>
  {Array.isArray(teacher.bio)
    ? teacher.bio.map((para, i) => (
        <p key={i}>{para}</p>
      ))
    : <p>{teacher.bio}</p>}
</div>

        <div
          className={`${styles.tDetails} ${open ? styles.tDetailsOpen : ""}`}
        >
          <div className={styles.tDetailBlock}>
            <h4 className={styles.tDetailTitle}>
              <span className={styles.tDetailIcon}>🎓</span> Education
            </h4>
            <ul className={styles.tList}>
              {teacher.education.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
          <div className={styles.tDetailBlock}>
            <h4 className={styles.tDetailTitle}>
              <span className={styles.tDetailIcon}>✦</span> Expertise
            </h4>
            <div className={styles.tChips}>
              {teacher.expertise.map((e, i) => (
                <span key={i} className={styles.tChip}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button className={styles.tToggle} onClick={() => setOpen(!open)}>
          {open ? "Show Less ▲" : "View Full Profile ▼"}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const Teachers: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* ── TOP BORDER ── */}
      <div className={styles.topBorder} />

      {/* ══════════════════════════════════════
          HERO / PAGE HEADER
      ══════════════════════════════════════ */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Our Faculty</p>
          <h1 className={styles.heroTitle}>
            Yoga Teachers in Rishikesh
            <br />
            India at AYM Yoga School
          </h1>
          <OmDivider />
          <p className={styles.heroSub}>
            Each of our teachers brings decades of authentic practice,
            traditional ashram training, and a lifelong dedication to the sacred
            science of yoga.
          </p>
          <div className={styles.heroBreadcrumb}>
            <span>Home</span>
            <span className={styles.breadSep}>/</span>
            <span>Our Teachers</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 1 — FOUNDER (centered, premium)
      ══════════════════════════════════════ */}
      <section className={styles.founderSection}>
        <div className={styles.outerPad}>
          <div className={styles.secLabel}>Founder & Director</div>
          <GoldSep />

          <div className={styles.founderGrid}>
            {/* Left — ornate frame */}
            <div className={styles.founderImgCol}>
              <OrnateFrame src={FOUNDER.image} alt={FOUNDER.name} size="lg" />
              <div className={styles.founderImgBadge}>Est. 2005</div>
            </div>

            {/* Right — text */}
            <div className={styles.founderTextCol}>
              <h2 className={styles.founderName}>{FOUNDER.name}</h2>
              <p className={styles.founderSubtitle}>{FOUNDER.subtitle}</p>
              <div className={styles.founderDivider} />
              {FOUNDER.bio.map((p, i) => (
                <p key={i} className={styles.founderPara}>
                  {p}
                </p>
              ))}
              <button className={styles.founderBtn}>
                More Information about Yogi Chetan Mahesh Ji
                <span className={styles.founderBtnArrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — FACULTY INTRO
      ══════════════════════════════════════ */}
      <section className={styles.facultyIntro}>
        <div className={styles.outerPad}>
          <GoldSep />
          <div className={styles.introWrap}>
            <p className={styles.introEyebrow}>Teaching Faculty</p>
            <h2 className={styles.introTitle}>
              Teaching Faculty — Aym Yoga School, Rishikesh
            </h2>
            <OmDivider />
            <p className={styles.introDesc}>
              Our teachers at Aym Yoga School are dedicated practitioners of
              traditional yoga, sharing authentic knowledge through discipline,
              compassion, and lived experience.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — TEACHER CARDS
          Alternating left/right with sticky image
      ══════════════════════════════════════ */}
      <section className={styles.teachersSection}>
        <div className={styles.outerPad}>
          {TEACHERS.map((t, idx) => (
            <div key={idx}>
              {idx > 0 && <GoldSep />}
              <TeacherCard teacher={t} idx={idx} />
            </div>
          ))}
          <GoldSep />
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — GUEST FACULTY GRID
          Ornate frames only, 4-col
      ══════════════════════════════════════ */}
      <section className={styles.guestSection}>
        <div className={styles.outerPad}>
          <div className={styles.guestHeader}>
            <p className={styles.introEyebrow}>More Experts</p>
            <h2 className={styles.guestTitle}>Guest &amp; Visiting Faculty</h2>
            <OmDivider />
          </div>
          <div className={styles.guestGrid}>
            {GUEST.map((t, i) => (
              <div key={i} className={styles.guestItem}>
                <OrnateFrame src={t.image} alt={t.name} size="sm" />
              </div>
            ))}
          </div>
          <GoldSep />
        </div>
      </section>

      {/* ── BOTTOM BORDER ── */}
      <div className={styles.topBorder} />
    </div>
  );
};

export default Teachers;

"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/kundalini-yoga-teacher-training-in-rishikesh/Kundaliniyogattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/10.webp";

/* ─────────────────────────────────────────
   MANDALA SVG COMPONENT
───────────────────────────────────────── */
const MandalaSVG = ({
  size = 300,
  color1 = "#e07b00",
  color2 = "#d4a017",
  strokeW = 0.5,
}: {
  size?: number;
  color1?: string;
  color2?: string;
  strokeW?: number;
}) => (
  <svg
    viewBox="0 0 300 300"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    width={size}
    height={size}
  >
    <g fill="none" stroke={color1} strokeWidth={strokeW}>
      {[145, 125, 105, 88, 70, 52, 36, 22, 10].map((r, i) => (
        <circle key={i} cx="150" cy="150" r={r} />
      ))}
    </g>
    <g fill="none" stroke={color2} strokeWidth={strokeW * 0.7} opacity="0.5">
      {[
        [150, 5, 150, 295],
        [5, 150, 295, 150],
        [47, 47, 253, 253],
        [253, 47, 47, 253],
        [10, 100, 290, 200],
        [10, 200, 290, 100],
        [100, 10, 200, 290],
        [200, 10, 100, 290],
      ].map((d, i) => (
        <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} />
      ))}
    </g>
    <g fill="none" stroke={color2} strokeWidth={strokeW * 0.6} opacity="0.28">
      <ellipse cx="150" cy="150" rx="145" ry="60" />
      <ellipse cx="150" cy="150" rx="60" ry="145" />
      <ellipse cx="150" cy="150" rx="145" ry="90" />
      <ellipse cx="150" cy="150" rx="90" ry="145" />
    </g>
    <g fill="none" stroke={color1} strokeWidth={strokeW * 0.5} opacity="0.2">
      {[0, 30, 60, 90, 120, 150].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 150 + 148 * Math.cos(rad),
          y1 = 150 + 148 * Math.sin(rad);
        const x2 = 150 - 148 * Math.cos(rad),
          y2 = 150 - 148 * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
    <circle cx="150" cy="150" r="5" fill={color1} opacity="0.45" />
    <circle cx="150" cy="150" r="2.5" fill={color2} opacity="0.6" />
  </svg>
);

/* ─────────────────────────────────────────
   CHAKRA SYMBOL SVG
───────────────────────────────────────── */
const ChakraSVG = ({
  size = 48,
  color = "#e07b00",
}: {
  size?: number;
  color?: string;
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
    />
    <circle
      cx="50"
      cy="50"
      r="36"
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      opacity="0.6"
    />
    <circle
      cx="50"
      cy="50"
      r="20"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.8"
    />
    <circle cx="50" cy="50" r="8" fill={color} opacity="0.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const r = (deg * Math.PI) / 180;
      return (
        <line
          key={deg}
          x1={50 + 22 * Math.cos(r)}
          y1={50 + 22 * Math.sin(r)}
          x2={50 + 44 * Math.cos(r)}
          y2={50 + 44 * Math.sin(r)}
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
        />
      );
    })}
    <text
      x="50"
      y="56"
      textAnchor="middle"
      fontSize="22"
      fill={color}
      fontFamily="serif"
      opacity="0.9"
    >
      ॐ
    </text>
  </svg>
);

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
const OmDivider = ({ centered = true }: { centered?: boolean }) => (
  <div className={`${styles.omDiv} ${centered ? styles.omDivCenter : ""}`}>
    <span className={styles.omLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.omLine} />
  </div>
);

/* ─────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────── */
const AccordionItem = ({
  num,
  title,
  items,
}: {
  num: number;
  title: string;
  items: string[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.accordItem} ${open ? styles.accordOpen : ""}`}>
      <button
        className={styles.accordHead}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={styles.accordNum}>{num}.</span>
        <span className={styles.accordTitle}>{title}</span>
        <span className={styles.accordIcon}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className={styles.accordBody}>
          {items.map((item, i) => (
            <div key={i} className={styles.accordCheck}>
              <span className={styles.checkMark}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   SYLLABUS DATA
───────────────────────────────────────── */
const syllabusData = [
  {
    title: "Kundalini Yoga Philosophy & History of Yoga",
    items: [
      "Introduction to Kundalini Yoga and its Origins",
      "The Tradition of Kundalini Yoga: Yogi Bhajan's Teachings",
      "Core Concepts: Prana, Nadis, Chakras, and Kundalini Energy",
      "Patanjali's Eight Limbs of Yoga and Their Relevance",
      "The Aquarian Age and Kundalini Yoga's Role",
      "Sat Nam: Truth as Identity",
    ],
  },
  {
    title: "Hatha yoga asana (Physical Postures) & Kriyas",
    items: [
      "Introduction to Kundalini Yoga Asanas",
      "Detailed study of fundamental postures",
      "Alignment, Benefits, and Contraindications",
      "Kundalini Kriyas: Explanation and Practice",
      "Set Structure: Warm-up, Kriya, Relaxation, Meditation",
      "Common Kundalini Yoga Lesson Sets",
      "Modifications and Use of Props",
    ],
  },
  {
    title: "Pranayama & Breathwork",
    items: [
      "The Science of Breath in Kundalini Yoga",
      "Basic Pranayamas: Long Deep Breathing, Breath of Fire, Sitali, Bhastrika",
      "Advanced Techniques: Alternate Nostril Breathing, One-Minute Breath",
      "Bandhas (Body Locks): Mula Bandha, Uddiyana Bandha, Jalandhara Bandha",
      "Breath Awareness in Kriya Practice",
    ],
  },
  {
    title: "Mantra, Mudra, and Naad Yoga",
    items: [
      "The Role of Mantra in Kundalini Yoga",
      "Pronunciation and Chanting Practice (e.g., Sat Nam, Ong Namo Guru Dev Namo)",
      "Understanding Naad (Sacred Sound)",
      "Common Mudras and Their Applications",
      "Incorporating Mantra and Mudra into Practice",
      "Using the Gong and Other sound Instruments for kundalini awakening",
    ],
  },
  {
    title: "Meditation & Dhyana",
    items: [
      "The Purpose and Types of Meditation in Kundalini Yoga",
      "Guided Meditations and Silent Practice",
      "Common Kundalini Meditations (e.g., Kirtan Kriya, Sodarshan Chakra Kriya)",
      "Using Breath, Mantra, and Mudra in Meditation",
      "Mindfulness and Concentration Techniques",
      "Developing a Personal Meditation Practice",
    ],
  },
  {
    title: "Anatomy & Physiology",
    items: [
      "Yogic and Western Anatomy Overview",
      "The Chakra System: 7 Major Chakras",
      "The Nadis: Ida, Pingala, Sushumna",
      "The Endocrine and Nervous Systems",
      "Impact of Kundalini Practice on Body Systems",
      "Injury Prevention and Safety in Practice",
    ],
  },
  {
    title: "Teaching Methodology & Practicum",
    items: [
      "Principles of Effective Teaching",
      "Sequencing Classes and Kriyas",
      "Voice, Language, and Presence",
      "Adjustments and Assists",
      "Managing Different Student Levels and Needs",
      "Leading Sadhana (Daily Practice)",
      "Class Management and Ethics",
      "Practicum: Practice Teaching (Peer and Public Classes)",
      "Feedback and Self-Reflection",
    ],
  },
  {
    title: "Yogic Lifestyle & Ethics",
    items: [
      "The Aquarian Teacher Code of Ethics",
      "Sattvic Diet and Lifestyle",
      "Seva (Selfless Service) and Sangat (Community)",
      "Sadhana: Daily Spiritual Practice",
      "Boundaries and Professional Ethics in Teaching",
    ],
  },
  {
    title: "Self-Study & Assignments (30 marks)",
    items: [
      "Daily Practice Journal",
      "Written Assignments on Philosophy and Anatomy",
      "Peer Teaching Observations",
      "Reading and Reflection Assignments",
    ],
  },
  {
    title: "Assessment & Certification (170 marks)",
    items: [
      "Written Examination on Philosophy and Anatomy",
      "Practical Teaching Assessment",
      "Attendance and Participation",
      "Final Kriya and Meditation Demonstration",
      "Yoga Alliance USA Registered Certificate upon completion",
    ],
  },
];

/* ─────────────────────────────────────────
   SCHEDULE TABLE DATA
───────────────────────────────────────── */
const scheduleData = [
  {
    date: "5th Dec to 27th Dec 2025",
    shared: "$1299",
    private: "$1499",
    luxury: "$1699",
  },
  {
    date: "5th Jan to 29th Jan 2026",
    shared: "$1299",
    private: "$1499",
    luxury: "$1699",
  },
  {
    date: "3rd Feb to 27th Feb 2026",
    shared: "$1299",
    private: "$1499",
    luxury: "$1699",
  },
  {
    date: "3rd Mar to 27th Mar 2026",
    shared: "$1299",
    private: "$1499",
    luxury: "$1699",
  },
  {
    date: "3rd Apr to 27th Apr 2026",
    shared: "$1299",
    private: "$1499",
    luxury: "$1699",
  },
  {
    date: "3rd May to 27th May 2026",
    shared: "$1299",
    private: "$1499",
    luxury: "$1699",
  },
  {
    date: "3rd Jun to 27th Jun 2026",
    shared: "$1299",
    private: "$1499",
    luxury: "$1699",
  },
  {
    date: "3rd Jul to 27th Jul 2026",
    shared: "$1299",
    private: "$1499",
    luxury: "$1699",
  },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function KundaliniYogaTTC() {
  return (
    <div className={styles.page}>
      {/* ── Fixed Mandala Decorations ── */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG
          size={380}
          color1="#e07b00"
          color2="#d4a017"
          strokeW={0.45}
        />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG
          size={340}
          color1="#d4a017"
          color2="#e07b00"
          strokeW={0.45}
        />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG
          size={200}
          color1="#e07b00"
          color2="#d4a017"
          strokeW={0.6}
        />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG
          size={200}
          color1="#d4a017"
          color2="#e07b00"
          strokeW={0.6}
        />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══════════════════════════════════════
          SECTION 1 — HERO + INTRO
      ══════════════════════════════════════ */}
       <section className={styles.heroSection}>
        <Image
          src={heroImg}
          alt="Yoga Students Group"
         
          className={styles.heroImage}
          priority
        />
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — WHAT IS KUNDALINI YOGA
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>
              What is Kundalini Yoga?
            </h2>
            <OmDivider />
            <p className={styles.bodyPara}>
              When we talk about the awakening of Kundalini, we have to
              understand what Kundalini is. Kundalini yoga can be understood as
              a practice that awakens the spiritual pranic force that energises
              your chakras. This force is usually dormant, lying quietly and
              coiled (like a snake) at the base of the spine, or root chakra.
              From where does this force come from in the root chakra? Who has
              created this? Actually, kundalini is that prana which is coiled
              like a kundal, and we are born with it; it is not created in our
              body. It flows in our pranic channels and chakras.
            </p>
            <p className={styles.bodyPara}>
              <strong>Kundal</strong> means a ring or a coil; in this, prana
              rotates in a coiled form, and when nadies are clean, this prana
              uncoils, resulting in the awakening of kundalini. We also know
              kundalini as Bhujangni energy, or coiled like a cobra.
            </p>
            <p className={styles.bodyPara}>
              Kundalini is the reserve spiritual energy that rotates at the base
              of the mooladhara chakra, and when uncloiled, can rise, infuse the
              body's cells and organs with extra life force, and confer special
              powers, qualities, and psychic abilities.
            </p>
            <p className={styles.bodyPara}>
              Our 200 Hour Kundalini Yoga Teacher Training in Rishikesh, India,
              focuses on awakening Kundalini energy by combining postures
              (asanas), breathing techniques (pranayama), Kundalini yoga
              meditation, chanting, and energy locks (bandhas). The primary goal
              of this practice is to raise energy through the chakras and
              promote spirituality within. Mantras and sounds resonate with the
              energy centres, and kundalini yoga promotes physical, mental, and
              emotional well-being.
            </p>
            <p className={styles.bodyPara}>
              At AYM, we offer an exclusive 300-hour Kundalini yoga teacher
              training course in Rishikesh, as well as a{" "}
              <strong>200-hour Kundalini yoga course</strong> that provides a
              deeper understanding of this practice. Under the guidance of our
              experienced instructors and the influence of the Ashram lifestyle,
              aspirants of the <strong>Kundalini YTTC in Rishikesh</strong> can
              feel rejuvenated and complete.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — ACTIVATE KUNDALINI
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {/* Inline chakra watermark */}
          <div className={styles.sectionChakra} aria-hidden="true">
            <ChakraSVG size={120} color="rgba(224,123,0,0.08)" />
          </div>

          <h2 className={styles.sectionTitleCenter}>
            Activate your Kundalini through the kundalini yoga TTC in rishikesh
            at AYM
          </h2>
          <OmDivider />
          <p className={styles.bodyPara}>
            When approached with care, patience, proper guidance, and a focus on
            spiritual growth, awakening your Kundalini energy can be an
            uplifting experience - bringing joy, heightened consciousness, and
            enhanced intuitive and psychic abilities. This is why many seekers
            pursue enlightenment through practices such as Kundalini yoga and
            meditation. However, if Kundalini energy is awakened suddenly -
            whether through yoga or by coming into contact with someone whose
            Kundalini is already active - and you are not prepared or have
            energetic blockages, the energy may become stuck.
          </p>
          <p className={styles.bodyPara}>
            If your Kundalini energy awakens unexpectedly and you are
            unprepared, it is essential to seek guidance from a traditional
            Kundalini yoga teacher who can support you through the awakening
            process. Remember, activating Kundalini power is only one way to
            access your chakras, your body, and your mental power. While the
            tradition of arousing Kundalini has endured for centuries, there are
            traditional and modern approaches to awakening your chakras.
            Traditional Kundalini yoga in Rishikesh is found only in a few of
            the oldest Kundalini yoga schools within the traditional yoga
            lineages.
          </p>

          {/* Benefits */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>
              What are the Benefits of Kundalini Yoga?
            </h2>
            <OmDivider />
            <p className={styles.bodyPara}>
              Is Kundalini yoga the right choice for you? Does it even provide
              any positive impact on the body? Can I benefit from it in any way?
              Well, of course, yes. It is natural to have such questions in mind
              if you have recently been interested in taking up the{" "}
              <strong>Kundalini YTT course in India</strong>.
            </p>
            <p className={styles.bodyPara}>
              You must know that enrolling in our{" "}
              <strong>Kundalini YTT course in Rishikesh</strong> at AYM will
              transform your personal and professional lives. So look at the
              benefits this yoga practice can offer and become firm in your
              decision.
            </p>

            <div className={styles.benefitGrid}>
              {[
                "It promotes spiritual growth, higher consciousness and self-awareness.",
                "This practice raises and balances energy, promoting overall well-being.",
                "It offers calmness to the mind and lowers stress and anxiety.",
                "Not only does it balance the nervous system, but it also improves flexibility and strengthens the immune system.",
                "As you take up kundalini Rishikesh yoga, it TTC enhances emotional intelligence, fosters inner peace and offers mental clarity.",
                "Kundalini yoga promotes self-growth, self-love, self-acceptance, self-healing, and cultivating intuition.",
                "It helps to overcome addictive behaviours and facilitates profound personal growth and spiritual evolution.",
              ].map((benefit, i) => (
                <div key={i} className={styles.benefitItem}>
                  <span className={styles.benefitNum}>{i + 1}.</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Highlights */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>
              Kundalini YTT Course Highlights at AYM in Rishikesh
            </h2>
            <OmDivider />
            <p className={styles.bodyPara}>
              At AYM, we offer the{" "}
              <strong>
                best Kundalini yoga teacher training course in rishikesh
              </strong>{" "}
              for aspiring students. Our course has been distinctively and
              masterfully designed to meet the expectations of our students and
              promote their teaching careers. Take a look at our course
              highlights by reading below:
            </p>

            <div className="row g-3 mt-2">
              {[
                {
                  title: "Daily Guided Practices",
                  desc: "Our Kundalini yoga teacher training programs have been carefully curated. Each class focuses on offering a deep understanding of this practice, and together, they promote physical, mental, and spiritual well-being.",
                },
                {
                  title: "Meditation and Breathing Techniques",
                  desc: "We offer a practical and theoretical understanding of kundalini yoga and powerful techniques that can foster calmness. We aim to introduce you to exclusive meditation and breathing techniques that bring mental peace and balance your energy.",
                },
                {
                  title: "Mantra and Chanting",
                  desc: "During the 300 hour Kundalini yoga teacher training in Rishikesh, we allow aspirants to experience the vibrational power of the mantras. This allows them to develop powerful consciousness and create a connection with the divine self.",
                },
                {
                  title: "Personalized Approach",
                  desc: "We believe in creating a long-lasting relationship with our students. This is why we provide our 500 hour kundalini YTTC in Rishikesh through a personalized approach. We provide guidance and support throughout the course. We are also transparent about the course and our students' progress.",
                },
                {
                  title: "Fostering Connection",
                  desc: "Students can find themselves in the company of like-minded individuals who help to instil confidence and a sense of trust. It allows them to connect with people who share their goals and are on a similar journey to success.",
                },
              ].map((h, i) => (
                <div key={i} className="col-12 col-md-6">
                  <div className={styles.highlightItem}>
                    <div className={styles.highlightDot} />
                    <div>
                      <strong className={styles.highlightTitle}>
                        {h.title}:
                      </strong>
                      <span className={styles.highlightDesc}> {h.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — SYLLABUS ACCORDION
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.syllabusWrap}>
            <div className={styles.syllabusHeader}>
              <h2 className={styles.syllabusBigTitle}>
                200-Hour Kundalini Yoga Teacher Training Syllabus
              </h2>
              <p className={styles.syllabusSchool}>Aym Yoga School</p>
            </div>

            <div className={styles.courseOverview}>
              <h3 className={styles.overviewTitle}>Course Overview:</h3>
              <p className={styles.bodyPara} style={{ marginBottom: 0 }}>
                This comprehensive 200-hour Kundalini Yoga Teacher Training in
                India at Aym Yoga School is designed to provide students with a
                deep understanding of Kundalini Yoga, including its philosophy,
                techniques, practice, teaching methodology, anatomy, and
                lifestyle. Upon completion, participants will be equipped to
                teach Kundalini Yoga classes with confidence and authenticity.
              </p>
            </div>

            <div className={styles.accordionWrap}>
              {syllabusData.map((item, i) => (
                <AccordionItem
                  key={i}
                  num={i + 1}
                  title={item.title}
                  items={item.items}
                />
              ))}
            </div>

            {/* Required Reading */}
            <div className={styles.readingBox}>
              <h3 className={styles.readingTitle}>
                Required Reading: Kundalini Yoga teacher training 200 hours
                India
              </h3>
              <ul className={styles.readingList}>
                <li>"The Aquarian Teacher" by Yogi Bhajan</li>
                <li>"Hatha yoga pradipika: Bihar school of Yoga</li>
                <li>"The Yoga Sutras of Patanjali"</li>
                <li>
                  Aym Yoga School Training Manual of Kundalini Yoga TTC in
                  Rishikesh.
                </li>
              </ul>
            </div>

            {/* Note */}
            <div className={styles.noteBox}>
              <h3 className={styles.noteTitle}>Note:</h3>
              <p className={styles.bodyPara} style={{ marginBottom: 0 }}>
                The above syllabus is in accordance with the specific guidelines
                and vision of Best Kundalini Yoga teacher training India at Aym
                Yoga School and the Yoga Alliance certified Kundalini Yoga
                India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — ELIGIBILITY + LOCATION + FACILITIES
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {/* Eligibility */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>
              Who Is Eligible to Join the Kundalini Yoga Teacher Training Course
              in Rishikesh?
            </h2>
            <OmDivider />
            <p className={styles.bodyPara}>
              Wondering if you will ever get the chance to complete your dream
              of becoming a yoga teacher? Aspirants often have the question of
              whether they are eligible enough to enrol in yoga teacher training
              in Rishikesh. But that's not right. At AYM, we offer courses to
              people from all regions and backgrounds.
            </p>
            <p className={styles.bodyPara}>
              There is no age boundary, and there are no qualification
              requirements. Also, you do not need to have any prior knowledge of
              yoga. We allow you to start right from scratch and foster skills
              until you reach the advanced level. All we need our aspirants to
              have is the motivation to learn yoga, be open-minded, and aim to
              build a career for themselves in this age-old practice.
            </p>
          </div>

          {/* Location */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>
              Is the Location Prime for Yoga Learning?
            </h2>
            <OmDivider />
            <p className={styles.bodyPara}>
              When learning yoga, we understand how much the surroundings and
              the environment matter. This is why we have chosen Rishikesh as
              our prime location for offering top kundalini yoga teacher
              training courses. Our institute is surrounded by lush greenery as
              it lies in the lap of the Himalayas.
            </p>
            <p className={styles.bodyPara}>
              Being surrounded by nature allows our students to connect with
              their higher selves and foster calmness. Our ashrams are
              traditionally established with a perfect blend of modern touches.
              Our studios are sound-proof and spacious enough to concentrate on
              your practices. Moreover, our studios are equipped with all the
              study materials required to complete the{" "}
              <strong>yoga TTC in Rishikesh</strong> without hassle.
            </p>
            <p className={styles.bodyPara}>
              Aspirants are provided accommodation that includes private rooms,
              shared rooms, and dormitories. Depending on their preference,
              students can pick any. In addition to this, we offer our{" "}
              <strong>kundalini yoga courses in Rishikesh</strong>, retreats,
              and workshops in India and across the globe.
            </p>
          </div>

          {/* Facilities */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>
              What Facilities are Included in the Course Fee?
            </h2>
            <OmDivider />
            <p className={styles.bodyPara}>
              Aspirants often worry that learning yoga will break the bank. If
              you are thinking the same, then there's no need to worry. Our 500
              hour kundalini yoga TTC programmes were masterfully prepared
              keeping the convenience and affordability of the students in mind.
              To reach everyone, we have offered our courses at a minimal fee.
              Not only that, our fee includes several facilities that students
              can enjoy during their course program. Some of them are listed
              below.
            </p>
            <div className="row g-2 mt-2">
              {[
                "Accommodation in spacious and furnished rooms with attached bathrooms.",
                "Guidance and access to highly skilled professionals in yoga.",
                "Access to study material includes online resources, yoga mats, books, and more.",
                "CCTV surveillance for extra security.",
                "Around-the-clock management support.",
                "Attend seminars, workshops, and other related events that promote yoga.",
                "Detox drinks and juices are offered.",
                "Vegetarian and healthy meals are provided three times a day.",
                "Access to free wifi and 24/7 hot water service is offered.",
                "A piece of Mala is provided to every student.",
                "Students are taken to nature excursions that elevate their experience.",
                "Kundalini yoga teacher training course certification is provided at the end of the course.",
              ].map((fac, i) => (
                <div key={i} className="col-12 col-md-6">
                  <div className={styles.facilityItem}>
                    <span className={styles.facNum}>{i + 1}.</span>
                    <span>{fac}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — DAILY SCHEDULE
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDeep}`}>
        <div className="container px-3 px-md-4">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-6">
              <h2 className={styles.sectionTitleLeft}>Daily Schedule</h2>
              <div className={styles.underlineLeft} />
              <div className={styles.scheduleList}>
                {[
                  ["06:30 AM", "Kundalini Pranayama and Meditation"],
                  ["08:00 AM", "Tea"],
                  ["08:30 AM", "Traditional Kundalini Tantra Theory & Asanas"],
                  ["10:00 AM", "Breakfast"],
                  ["11:00 AM", "Kundalini Philosophy"],
                  ["12:15 AM", "Yoga Alignment & Adjustment"],
                  ["01:30 PM", "Lunch - Rest/Self-Study"],
                  ["03:30 PM", "Yoga & Spritual Anatomy"],
                  ["05:30 PM", "Classical Hatha Yoga"],
                  ["07:30 PM", "Dinner"],
                ].map(([time, act], i) => (
                  <div key={i} className={styles.schedRow}>
                    <span className={styles.schedTime}>{time}</span>
                    <span className={styles.schedSep}>:</span>
                    <span className={styles.schedAct}>{act}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="row g-2">
                <div className="col-6">
                  <div className={styles.schedImgWrap}>
                    <img
                      src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80"
                      alt="Yoga practice by river"
                      className={styles.schedImg}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className={styles.schedImgWrap}>
                    <img
                      src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80"
                      alt="Kundalini yoga pose"
                      className={styles.schedImg}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 7 — WHY CHOOSE AYM + CLASS IMAGE
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <h2 className={styles.sectionTitleCenter}>
            Why Choose AYM Yoga School?
          </h2>
          <OmDivider />
          <div className="row g-3 mb-4">
            {[
              [
                "Tradition",
                "We follow Ancient Traditional yoga of The Himalayas.",
              ],
              [
                "Location",
                "We are located in a peaceful, serene, and beautiful place in Rishikesh.",
              ],
              [
                "Teacher",
                "We have 14+ experienced teachers under the guidance of Yogi Chetan Mahesh.",
              ],
              ["Courses", "We offer different important yoga courses."],
              [
                "Experiences",
                "Until now, our ashram has trained more than 6000+ yoga teachers worldwide.",
              ],
              [
                "Kundalini-Based Training",
                "Our primary purpose is to awaken the latent energy of our students.",
              ],
            ].map(([label, desc], i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className={styles.whyCard}>
                  <div className={styles.whyNum}>{i + 1}</div>
                  <div>
                    <strong className={styles.whyLabel}>{label}</strong>
                    <span className={styles.whyDesc}> - {desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Class photo */}
          <div className={styles.classImgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=85"
              alt="AYM Yoga School Kundalini class in Rishikesh"
              className={styles.classImg}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 8 — AVAILABILITY TABLE
      ══════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.sectionWarm}`}
        id="schedule"
      >
        <div className="container px-3 px-md-4">
          <h2 className={styles.sectionTitleCenter}>
            Availability Of The 200 Hour Kundalini Yoga TTC 2026
          </h2>
          <OmDivider />

          <div className={`table-responsive ${styles.tableWrap}`}>
            <table className={styles.availTable}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>SHARED ACCOMMODATION</th>
                  <th>PRIVATE ACCOMMODATION</th>
                  <th>LUXURY ACCOMMODATION</th>
                  <th>AVAILABILITY</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.shared}</td>
                    <td>{row.private}</td>
                    <td>{row.luxury}</td>
                    <td className={styles.availTd}>Available</td>
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
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 9 — WHY CHOOSE RISHIKESH + REFUND
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>
              Why choose Kundalini Yoga classes and training in rishikesh?
            </h2>
            <OmDivider />

            <h3 className={styles.subHeading}>
              Spiritual significance of Rishikesh:
            </h3>
            <p className={styles.bodyPara}>
              Rishikesh, situated on the banks of the sacred Ganges River and
              nestled in the foothills of the Himalayas, is globally recognized
              as the yoga capital of the world. In this vibrant city, there are
              many authentic yoga schools, and experienced teachers attract
              kundalini yoga seekers from every corner of the globe.
            </p>

            <h3 className={styles.subHeading}>
              Natural setting and serene environment of Rishikesh:
            </h3>
            <p className={styles.bodyPara}>
              The tranquil ambiance, combined with the region's powerful energy,
              creates an ideal environment for learning authentic Kundalini yoga
              in rishikesh. Whether you're a seasoned yogi or a curious
              beginner, Rishikesh provides the perfect setting to embark on a
              transformative journey through Kundalini yoga.
            </p>

            <h3 className={styles.subHeading}>
              Types of Kundalini Yoga Classes in Rishikesh
            </h3>
            <ul className={styles.bulletList}>
              <li>Beginner to advanced kundalini classes</li>
              <li>Kundalini yoga retreats and intensive courses</li>
              <li>Teacher training programs.</li>
            </ul>

            <h3 className={styles.subHeading}>
              Top Kundalini Yoga Schools and Centers in Rishikesh
            </h3>
            <p className={styles.bodyPara}>
              In recent times, Kundalini yoga has become popular, and many
              seekers are opting for it, and due to it, many Kundalini yoga
              schools in rishikesh are starting to surface. But only a few offer
              a structured, well-designed Kundalini yoga curriculum. AYM yoga
              school and Hatha yoga school are among the Top Kundalini Yoga
              Schools in Rishikesh.
            </p>
          </div>

          {/* Refund Policy */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>
              Refund Policy - AYM Yoga School
            </h2>
            <OmDivider />
            <div className="row g-3">
              {[
                "An advance course fee will not be refundable. Students can join us on other schedules in case of an emergency.",
                "If students cancel the course, we accept the cancellation, but the advance deposit will not be refunded in cancellation.",
                "There is no charge for course cancellation. The student has to inform by email.",
                "AYM Yoga School is not responsible for any mishappenings before the course schedule.",
              ].map((policy, i) => (
                <div key={i} className="col-12 col-md-6">
                  <div className={styles.policyItem}>
                    <span className={styles.policyNum}>{i + 1}.</span>
                    <span>{policy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <OmDivider />
        </div>
      </section>
      <HowToReach />
    </div>
  );
}

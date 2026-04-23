"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-college-in-rishikesh/Yogacollegerishikesh.module.css";
import yogabanner from "@/assets/images/yoga-college.jpg";
import image1 from "@/assets/images/200-hour-ayush-ministry-yoga-course-15-days.jpg";
import image2 from "@/assets/images/400-hour-yoga-program-ayush-ministry-28-days.jpg";
import image3 from "@/assets/images/800-hour-yoga.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/31.webp";
import Link from "next/link";

/* ══════════════════════════════════════
   PLACEHOLDER IMAGES & VIDEOS
══════════════════════════════════════ */
const IMGS = {
  yoga1:
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80",
  yoga2: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&q=80",
  yoga3: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=80",
  yoga4:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80",
  yoga5:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
  yoga6:
    "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=900&q=80",
  college:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80",
  rishikesh:
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80",
  career:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
  aim1: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&q=80",
  aim2: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80",
  aim3: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80",
};

const YT_ID = "X-4RQYlTRtk";
const YT_ID2 = "EJ6K-rhqevE";
const getEmbed = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`;

/* ══════════════════════════════════════
   TAB DATA
══════════════════════════════════════ */
const tabs = [
  {
    id: "protocol",
    label: "Yoga Protocol Instructor",
    hours: "200 HRS",
    content: {
      intro: `Yoga protocol instructor is a basic level of certification provided by AYM yoga school in Rishikesh for practitioners seeking a basic knowledge of yoga and its practices (yoga asanas) under the guidance of experienced yoga teachers. It is the best foundational yoga course for the practitioner who wants to teach yoga at the group level or an individual class.`,
      affiliation: `The yoga certification board accredits this 200-hour level-1 instructional yoga course by AYM yoga school in rishikesh.`,
      sections: [
        {
          title: "Aim and Objective",
          content: `To teach basic yoga at the group level in parks, community-level on/off the occasion of international yoga day.`,
          bullets: [
            "To promote health and wellness through the means of yoga.",
            "200 hours of instructional yoga course that can do in one go or parts.",
            "To cultivate yoga and its practices in the individual for his health and wellbeing.",
          ],
          images: [IMGS.aim1, IMGS.aim2, IMGS.aim3],
        },
        {
          title: "Duration of this course",
          content: `The duration of this 200 hour of instructional yoga course can be complete in the span of 1 to 3 months. If you complete this entire course in one go, you will complete it in 1 month as a full-time course or complete it in 3 months as a part-time.`,
        },
        {
          title: "Eligibility Criteria",
          items: [
            {
              label: "Personal attributes",
              text: "Individual needs to possess good communication skills, self-confidence, patience, and skills to understand the requirement and body language of the trainees.",
            },
            {
              label: "Academic qualification",
              text: "Trainee should have passed at least 10th std from a recognized board",
            },
            {
              label: "Age",
              text: "Age is no bar while applying for this yoga course.",
            },
            { label: "Medium of instruction", text: "English and Hindi." },
          ],
        },
        {
          title: "Evaluation",
          content: `After completing the level-1 yoga course, you will evaluate your performance on the various assessment given by the AYM yoga school in Rishikesh.`,
          extra:
            "Total marks distribution: 200 (Theory: 60 and Practical: 140)",
        },
        {
          title: "Syllabus",
          theory: [
            "Introduction to Yoga and Yogic Practices",
            "Introduction to Yoga Texts",
            "Yoga for Health Promotion",
          ],
          practical: [
            "Demonstration Skills",
            "Teaching Skills",
            "Application of knowledge",
            "Field Experience",
          ],
        },
      ],
    },
  },
  {
    id: "wellness",
    label: "Yoga Wellness Instructor",
    hours: "400 HRS",
    content: {
      intro: `Yoga wellness instructor is a Level-2 yoga instructor course for those practitioners who wants to start their career as a professional yoga instructor and want to teach yoga in groups or a school or a wellness center. This instructional yoga course is best for those who wish to impart yoga to individuals or in mass to promote health and wellness.`,
      affiliation: `This 400 hour level-2 yoga wellness instructor is a course registered with the yoga certification board, Government of India.`,
      sections: [
        {
          title: "Objectives of this course",
          bullets: [
            "To prepare the trainee for providing yoga and its teaching at the mass level.",
            "To prepare the trainee to start his career as a professional yoga teacher",
            "This yoga wellness instructor course is structured by AYM yoga school to provide basic knowledge of yoga and its physical, mental, and wellness practices in your daily life",
            "A 400-hour instructional yoga course for a yoga wellness instructor can be a full-time course and a part-time course.",
          ],
        },
        {
          title: "Duration of this course",
          content: `This 400 hour of level-2 yoga wellness course can be completed in the span of 3 months as a full-time course or you can complete this as a part-time course in the duration of 6 months.`,
        },
        {
          title: "Eligibility criteria",
          items: [
            {
              label: "Personal attributes",
              text: "The candidate should possess certain qualities such as confidence, self-discipline, patience, compassion and have a good command over the language so that one can teach with confidence.",
            },
            {
              label: "Academic qualification",
              text: "To pursue this course candidate should have completed his 12th standard from a recognized board.",
            },
            {
              label: "Age",
              text: "Age is no bar while applying for this yoga course.",
            },
            { label: "Medium of instruction", text: "English and Hindi." },
          ],
        },
        {
          title: "Evaluation",
          content: `After the successful completion of this course your performance will be evaluated on the basis of your performance by AYM yoga school in Rishikesh.`,
          extra:
            "Total marks distribution: 200 (Theory: 60 and Practical: 140)",
        },
        {
          title: "Syllabus",
          theory: [
            "Introduction to Yoga and Yogic Practices",
            "Introduction to Yoga Texts",
            "Yoga for health and wellness",
          ],
          practical: [
            "Demonstration of your yogic skills",
            "Demonstration of your teaching skill",
            "Your applied knowledge",
            "Your field experience",
          ],
        },
      ],
    },
  },
  {
    id: "teacher",
    label: "Yoga Teacher & Evaluator",
    hours: "800 HRS",
    content: {
      intro: `AYM yoga school in Rishikesh has 800 hours of level-3 yoga teacher and evaluator vocational yoga course in accreditation with yoga certification board, Government of India. 800 hour of instructional yoga course is for practitioners looking forward to starting their careers as master yoga trainers in the premier yoga institution, yoga studios, college, universities, etc.`,
      extra: `This 800 hour of training program by AYM yoga school in Rishikesh will train you as a master trainer of yoga and its practices.`,
      affiliation: `800 hours of level-3 yoga teacher and evaluator course is registered with yoga certification board.`,
      sections: [
        {
          title: "Objectives of this course",
          bullets: [
            "To prepare the student to teach yoga as a master yoga trainer so that he/she can teach yoga at a premier yoga institute.",
            "This 800 hour level-3 yoga teacher and evaluator training program by AYM yoga school in Rishikesh will provide you with all the knowledge of yoga and its practices.",
            "800 hour level-3 yoga course can be completed by the practitioner as a full-time course and also as a part-time course.",
          ],
        },
        {
          title: "Duration of this course",
          content: `One can complete this course in the duration of 9 months as a fulltime course. As a part-time: 15 months`,
        },
        {
          title: "Eligibility criteria",
          items: [
            {
              label: "Age",
              text: "Age is no bar while applying for this yoga course.",
            },
            {
              label: "Personal qualification",
              text: "To take admission in this course the candidate should be graduate from a recognized college or university.",
            },
            {
              label: "Personal attributes",
              text: "This vocational job requires good communication skill, active listening, confidence, patience, time management, command on the language, analytical skills, and ability to engage with students.",
            },
            { label: "Medium of instruction", text: "English and Hindi." },
          ],
        },
        {
          title: "Evaluation",
          content: `After the successful completion of this course your performance will be evaluated on the basis of your performance by AYM yoga school in Rishikesh.`,
          extra:
            "Total marks distribution: 200 (Theory: 60 and Practical: 140)",
        },
        {
          title: "Syllabus",
          theory: [
            "Introduction of yoga and its practices",
            "Brief introduction of yogic text",
            "Yoga and health",
            "Applied yoga knowledge",
          ],
          practical: [
            "Demonstration of your yogic skills",
            "Demonstration of your teaching skill",
            "Evaluation skills",
            "Your field experience",
            "Application of your yogic knowledge",
          ],
        },
      ],
    },
  },
  {
    id: "master",
    label: "Yoga Master",
    hours: "1600 HRS",
    content: {
      isYogaMaster: true,
      title: "Yoga Master",
      details: [
        { label: "Name of the Certification", text: "Yoga Master (YM)" },
      ],
      eligibility: [
        "For open candidates there is no eligibility criteria",
        "For admission in the course it is suggested that the candidate should be graduate in any stream from a recognized University or equivalent. However, the Yoga Institutions can define their own eligibility.",
      ],
      extraDetails: [
        { label: "Minimum age", text: "No age limit" },
        { label: "Credit points for certificate", text: "92 credits" },
        { label: "Duration of course", text: "Not less than 1600 hours." },
        {
          label: "Mark Distribution",
          text: "Total Marks: 200 (Theory: 120 + Practical: 80)",
        },
        {
          label: "Mode of Certification",
          text: "Offline / Online (All sessions will be online LIVE on zoom platform and we will share the session recording also)",
        },
        { label: "Start Date", text: "Every Month" },
      ],
      contact:
        "For further information, you can please visit (www.indianyogaassociation.com) or contact on: +91-7500277709",
      syllabus: {
        theory: [
          "Philosophical Foundation of Yoga - 30 Marks",
          "Principles and Practices of Yoga in Traditional Texts - 30 Marks",
          "Allied Science - 30 Marks",
          "Applied Yoga - 30",
        ],
        practical: [
          "Demonstration Skills - 15",
          "Teaching Skills - 15",
          "Evaluation Skills - 20",
          "Application of knowledge - 20",
          "Field Experience - 10",
        ],
      },
    },
  },
];

const certCards = [
  {
    title: "YOGA MASTER",
    exam: "Online / Offline.",
    fee: "10500 INR / 8500 INR",
    icon: "🏆",
  },
  {
    title: "ASSISTANT YOGA THERAPIST",
    exam: "Online / Offline.",
    fee: "9500 INR / 7500 INR",
    icon: "🌿",
  },
  {
    title: "YOGA THERAPIST",
    exam: "Online / Offline.",
    fee: "12500 INR / 10500 INR",
    icon: "✨",
  },
];

const inPersonCourses = [
  {
    title: "24 Days — 200 Hour Yoga Course in Rishikesh",
    startDate: "03rd of Every Month",
    endDate: "27th of Every Month",
    duration: "24 Days",
    cert: "Yoga Certification Board — YCB",
    accreditation: "Ministry of AYUSH, Government of India",
    fees: "35,000 INR",
    included: "Dormitory Accommodation + Food + Course Materials",
    image: image1,
    badge: "Level 1",
    color: "#F15505",
  },
  {
    title: "28 Days — 400 Hour Yoga Course in Rishikesh",
    startDate: "01st of Every Month",
    endDate: "28th of Every Month",
    duration: "28 Days",
    cert: "Yoga Certification Board — YCB",
    accreditation: "Ministry of AYUSH, Government of India",
    fees: "45,000 INR",
    included: "Dormitory Accommodation + Food + Course Materials",
    image: image2,
    badge: "Level 2",
    color: "#b8860b",
  },
  {
    title: "90 Days — 800 Hour Yoga Course in Rishikesh",
    startDate: "03rd of Every Month",
    endDate: "3 Months Program",
    duration: "90 Days",
    cert: "Yoga Certification Board — YCB",
    accreditation: "Ministry of AYUSH, Government of India",
    fees: "1,20,000 INR",
    included: "Private Accommodation + Food + Course Materials",
    image: image3,
    badge: "Level 3",
    color: "#1a4a4a",
  },
];

const collegeCourses = [
  "Certificate Course in Yoga (6 months) — 15,000 INR",
  "PG Diploma in Yoga (1 year) — 25,000 INR",
  "M.A. in Yoga (2 years) — 25,000 INR / Year",
];

const maObjectives = [
  "To equip students with research-based yoga.",
  "To uplift the knowledge of yoga therapy for healing different diseases.",
  "To prepare students to open their own yoga centers.",
  "To prepare students for joining higher courses in yoga like Ph.D in Yoga.",
  "To provide them deep insight in yoga sutra of Patanjali, Bhagwat Gita, Hatha Yoga Pradapika and Gherund Samhita.",
];

/* ══════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════ */
function MandalaSVG({
  size = 300,
  c1 = "#F15505",
  c2 = "#d4a017",
  sw = 0.5,
}: {
  size?: number;
  c1?: string;
  c2?: string;
  sw?: number;
}) {
  return (
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
          ] as number[][]
        ).map((d, i) => (
          <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} />
        ))}
      </g>
      <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
      <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.62" />
    </svg>
  );
}

function VintageHeading({
  children,
  center = true,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={styles.vintageHeadingWrap}
      style={{ textAlign: center ? "center" : "left" }}
    >
      <h2 className={styles.vintageHeading}>{children}</h2>
    </div>
  );
}

function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.omDividerWrap}>
      <div className={styles.omDivLine} />
      <div className={styles.omDivCenter}>
        <span className={styles.omSymbol}>ॐ</span>
        {label && <span className={styles.omDivLabel}>{label}</span>}
      </div>
      <div className={styles.omDivLine} />
    </div>
  );
}

function AutoVideo({ ytId, className }: { ytId: string; className?: string }) {
  return (
    <iframe
      src={getEmbed(ytId)}
      className={className || styles.autoVideoIframe}
      title="Yoga Video"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
      style={{ pointerEvents: "none" }}
    />
  );
}

function PulseDot() {
  return <span className={styles.pulseDot} />;
}

/* ══════════════════════════════════════
   TEXT + IMAGE / VIDEO ROWS
══════════════════════════════════════ */
function TextImageRow({
  children,
  imageUrl,
  imageAlt,
  badge,
  reverse = false,
}: {
  children: React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
      <div className={styles.tiText}>{children}</div>
      <div className={styles.tiImageWrap}>
        <div className={styles.tiImageFrame}>
          <img
            src={imageUrl}
            alt={imageAlt}
            className={styles.tiImage}
            loading="lazy"
          />
          <div className={styles.tiImageOverlay} />
          {badge && <div className={styles.tiImageBadge}>{badge}</div>}
          <div className={styles.tiImageCornerTl} />
          <div className={styles.tiImageCornerBr} />
        </div>
        <div className={styles.tiDotGrid} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.tiDot} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TextVideoRow({
  children,
  ytId,
  reverse = false,
}: {
  children: React.ReactNode;
  ytId: string;
  reverse?: boolean;
}) {
  return (
    <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
      <div className={styles.tiText}>{children}</div>
      <div className={styles.tiVideoWrap}>
        <div className={styles.tiVideoFrame}>
          <AutoVideo ytId={ytId} className={styles.tiVideoIframe} />
          <div className={styles.tiVideoBadge}>
            <PulseDot /> Live Classes
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SYLLABUS GRID
══════════════════════════════════════ */
function SyllabusGrid({
  theory,
  practical,
}: {
  theory: string[];
  practical: string[];
}) {
  return (
    <div className={styles.syllabusGrid}>
      <div className={styles.syllabusCol}>
        <div className={styles.syllabusColHead}>
          <span className={styles.syllabusColIcon}>📖</span> Theory
        </div>
        {theory.map((t, i) => (
          <div key={i} className={styles.syllabusItem}>
            <span className={styles.syllabusCheck}>✓</span>
            {t}
          </div>
        ))}
      </div>
      <div className={styles.syllabusCol}>
        <div className={styles.syllabusColHead}>
          <span className={styles.syllabusColIcon}>🧘</span> Practical
        </div>
        {practical.map((p, i) => (
          <div key={i} className={styles.syllabusItem}>
            <span className={styles.syllabusCheck}>✓</span>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   AIM IMAGES STRIP
══════════════════════════════════════ */
function AimImagesStrip({ images }: { images: string[] }) {
  return (
    <div className={styles.aimImagesStrip}>
      {images.map((src, i) => (
        <div
          key={i}
          className={styles.aimImageCard}
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          <img src={src} alt={`yoga practice ${i + 1}`} loading="lazy" />
          <div className={styles.aimImageOverlay} />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   TAB CONTENT
══════════════════════════════════════ */
function TabContent({ tab }: { tab: (typeof tabs)[0] }) {
  const c = tab.content as any;

  if (c.isYogaMaster) {
    return (
      <div className={styles.tabPane}>
        {/* Yoga Master Hero */}
        <div className={styles.yogaMasterHero}>
          <div className={styles.yogaMasterLeft}>
            <div className={styles.yogaMasterBadge}>🏅 YOGA MASTER (YM)</div>
            <h3 className={styles.yogaMasterTitle}>{c.title}</h3>
            {c.details.map((d: any, i: number) => (
              <p key={i} className={styles.tabBody}>
                <strong className={styles.tabStrong}>{d.label}:</strong>{" "}
                {d.text}
              </p>
            ))}
            <div className={styles.yogaMasterEligTitle}>
              Requirement / Eligibility
            </div>
            <ol className={styles.tabOl}>
              {c.eligibility.map((e: string, i: number) => (
                <li key={i}>{e}</li>
              ))}
            </ol>
          </div>
          <div className={styles.yogaMasterRight}>
            <div className={styles.yogaMasterVideoWrap}>
              <AutoVideo ytId={YT_ID} className={styles.yogaMasterVideo} />
              <div className={styles.yogaMasterVideoBadge}>
                <PulseDot /> Live Training
              </div>
            </div>
          </div>
        </div>

        {/* Extra details cards */}
        <div className={styles.yogaMasterDetails}>
          {c.extraDetails.map((d: any, i: number) => (
            <div key={i} className={styles.yogaMasterDetailCard}>
              <div className={styles.yogaMasterDetailLabel}>{d.label}</div>
              <div className={styles.yogaMasterDetailVal}>{d.text}</div>
            </div>
          ))}
        </div>

        <p className={styles.tabBodyContact}>{c.contact}</p>

        <VintageHeading>Syllabus</VintageHeading>
        <SyllabusGrid
          theory={c.syllabus.theory}
          practical={c.syllabus.practical}
        />

        <a href="#" className={styles.applyBtn}>
          Apply Now →
        </a>
      </div>
    );
  }

  return (
    <div className={styles.tabPane}>
      {/* Intro + video side by side */}
      <div className={styles.tabIntroRow}>
        <div className={styles.tabIntroText}>
          <p className={styles.tabBody}>{c.intro}</p>
          {c.extra && <p className={styles.tabBody}>{c.extra}</p>}
          <p className={styles.tabBody}>
            <strong className={styles.tabStrong}>Affiliation:</strong>{" "}
            {c.affiliation}
          </p>
        </div>
        <div className={styles.tabIntroVideo}>
          <div className={styles.tabVideoFrame}>
            <AutoVideo ytId={YT_ID} className={styles.tabVideoIframe} />
            <div className={styles.tabVideoBadge}>
              <PulseDot /> Daily Classes
            </div>
          </div>
        </div>
      </div>

      {c.sections.map((sec: any, i: number) => (
        <div key={i} className={styles.tabSection}>
          <h4 className={styles.tabSectionTitle}>{sec.title}</h4>
          {sec.content && <p className={styles.tabBody}>{sec.content}</p>}
          {sec.bullets && (
            <ul className={styles.tabUl}>
              {sec.bullets.map((b: string, j: number) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}
          {/* Aim images strip */}
          {sec.images && <AimImagesStrip images={sec.images} />}
          {sec.extra && (
            <p className={styles.tabBodyExtra}>
              <strong>{sec.extra}</strong>
            </p>
          )}
          {sec.items && (
            <div className={styles.eligibilityGrid}>
              {sec.items.map((item: any, j: number) => (
                <div key={j} className={styles.eligibilityCard}>
                  <div className={styles.eligibilityLabel}>{item.label}</div>
                  <div className={styles.eligibilityText}>{item.text}</div>
                </div>
              ))}
            </div>
          )}
          {sec.theory && (
            <SyllabusGrid theory={sec.theory} practical={sec.practical} />
          )}
        </div>
      ))}

      <a href="#" className={styles.applyBtn}>
        Apply Now →
      </a>
    </div>
  );
}

/* ══════════════════════════════════════
   IN-PERSON COURSE CARD
══════════════════════════════════════ */
function CourseCard({
  course,
  index,
}: {
  course: (typeof inPersonCourses)[0];
  index: number;
}) {
  const isReverse = index % 2 !== 0;
  const details = [
    { icon: "📅", label: "Start Date", value: course.startDate },
    { icon: "🏁", label: "End Date", value: course.endDate },
    { icon: "⏱️", label: "Duration", value: course.duration },
    { icon: "🎓", label: "Certification", value: course.cert },
    { icon: "🏛️", label: "Accreditation", value: course.accreditation },
    { icon: "💰", label: "Fees", value: course.fees },
    { icon: "✅", label: "Included", value: course.included },
  ];

  return (
    <div
      className={`${styles.courseCard} ${isReverse ? styles.courseCardReverse : ""}`}
    >
      <div className={styles.courseCardImgWrap}>
        <Image
          src={course.image}
          alt={course.title}
          fill
          className={styles.courseCardImg}
        />
        <div className={styles.courseCardImgOverlay} />
        <div
          className={styles.courseCardBadge}
          style={{ background: course.color }}
        >
          {course.badge}
        </div>
        <div className={styles.courseCardHoursTag}>{course.duration}</div>
      </div>
      <div className={styles.courseCardBody}>
        <h3 className={styles.courseCardTitle}>{course.title}</h3>
        <div
          className={styles.courseCardUnderline}
          style={{ background: course.color }}
        />
        <div className={styles.courseCardDetails}>
          {details.map((d, i) => (
            <div key={i} className={styles.courseCardDetailRow}>
              <span className={styles.courseCardDetailIcon}>{d.icon}</span>
              <span className={styles.courseCardDetailLabel}>{d.label}:</span>
              <span className={styles.courseCardDetailVal}>{d.value}</span>
            </div>
          ))}
        </div>
        <Link
          href="/yoga-registration"
          className={styles.bookSpotBtn}
          style={{
            background: `linear-gradient(135deg, ${course.color}, #f15505)`,
          }}
        >
          Book Your Spot →
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function YogaCollegeRishikesh() {
  const [activeTab, setActiveTab] = useState("protocol");

  return (
    <div className={styles.page}>
      {/* Mandalas */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={420} c1="#F15505" c2="#d4a017" sw={0.42} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={380} c1="#d4a017" c2="#F15505" sw={0.42} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <Image
          src={heroImg}
          alt="Yoga College in Rishikesh"
          width={1460}
          height={580}
          className={styles.heroImage}
          priority
        />
      </section>

      {/* ── HERO TITLE ── */}
      <section className={styles.heroTitleSection}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Yoga College in Rishikesh</h1>
          <div className={styles.heroUnderline} />
          <p className={styles.heroSubtitle}>
            AYM Yoga School — Ministry of AYUSH Certified Programs
          </p>
        </div>
      </section>

      {/* ── TABS SECTION ── */}
      <section className={styles.tabsSection}>
        <div className={styles.container}>
          {/* Tab Headers */}
          <div className={styles.tabHeaders}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabBtnHours}>{tab.hours}</span>
                <span className={styles.tabBtnLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className={styles.tabContentWrap}>
            {tabs.map((tab) =>
              activeTab === tab.id ? (
                <TabContent key={tab.id} tab={tab} />
              ) : null,
            )}
          </div>
        </div>
      </section>

      {/* ── FULL WIDTH AUTOPLAY VIDEO ── */}
      <section className={styles.fullVideoSection}>
        <div className={styles.fullVideoWrap}>
          <AutoVideo ytId={YT_ID2} className={styles.fullVideoIframe} />
          <div className={styles.fullVideoOverlay}>
            <div className={styles.fullVideoTextWrap}>
              <div className={styles.fullVideoBadge}>
                <PulseDot /> Live Yoga Classes
              </div>
              <h2 className={styles.fullVideoTitle}>
                Experience the Energy of Rishikesh
              </h2>
              <p className={styles.fullVideoSub}>
                Watch our students transform their practice in the yoga capital
                of the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATION CARDS ── */}
      <section className={styles.certSection}>
        <div className={styles.container}>
          <OmDivider label="Examinations" />
          <VintageHeading>Yoga Certification Exams</VintageHeading>
          <div className={styles.certGrid}>
            {certCards.map((card, i) => (
              <div key={i} className={styles.certCard}>
                <div className={styles.certCardTop}>
                  <span className={styles.certCardIcon}>{card.icon}</span>
                  <div className={styles.certCardGlow} />
                </div>
                <h3 className={styles.certTitle}>{card.title}</h3>
                <div className={styles.certDivider} />
                <div className={styles.certRow}>
                  <span className={styles.certLabel}>Exam Mode</span>
                  <span className={styles.certVal}>{card.exam}</span>
                </div>
                <div className={styles.certRow}>
                  <span className={styles.certLabel}>Exam Fee</span>
                  <span className={styles.certVal}>{card.fee}</span>
                </div>
                <div className={styles.certBtns}>
                  <a href="#" className={styles.certBtnOutline}>
                    More Details
                  </a>
                  <a href="#" className={styles.certBtnFill}>
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IN-PERSON COURSES ── */}
      <section className={styles.coursesSection}>
        <div className={styles.container}>
          <OmDivider label="In-Person Courses" />
          <VintageHeading>Yoga Courses in Rishikesh</VintageHeading>
          <p className={styles.coursesSub}>
            Ministry of AYUSH certified programs with accommodation, meals &
            certification included
          </p>
          <div className={styles.courseCardsWrap}>
            {inPersonCourses.map((course, i) => (
              <CourseCard key={i} course={course} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLEGE INFO — text left, image right ── */}
      <section className={styles.collegeSection}>
        <div className={styles.container}>
          <OmDivider label="About AYM Yoga College" />
          <TextImageRow
            imageUrl={IMGS.college}
            imageAlt="AYM Yoga College Rishikesh"
            badge="Est. 2016"
          >
            <VintageHeading center={false}>
              About AYM Yoga College
            </VintageHeading>
            <p className={styles.bodyPara}>
              AYM Yoga College was established on 21 June 2016 to spread the
              quality of higher yoga education in India. We are honored to
              inform everyone that AYM Yoga institutions has started AYM Yoga
              College (Yoga Mahavidhyalaya) in Rishikesh, India. The specialty
              of this college will be quality of teaching, research-oriented
              educational classes, participation of students in research
              projects, latest and up to date yoga and meditational practices,
              debates on yoga and meditational topics, guest lectures by known
              personalities from the field of yoga and meditation, job
              placements on national and international level.
            </p>

            <div className={styles.collegeHighlights}>
              {[
                "Quality Teaching",
                "Research-Oriented",
                "Guest Lectures",
                "Job Placement",
              ].map((h, i) => (
                <div key={i} className={styles.collegeHighlightChip}>
                  <span className={styles.collegeHighlightDot} />
                  {h}
                </div>
              ))}
            </div>
          </TextImageRow>

          {/* Courses Offered */}
          <div className={styles.collegeCourseWrap}>
            <VintageHeading>Courses Offered by AYM Yoga College</VintageHeading>
            <div className={styles.collegeCourseGrid}>
              {collegeCourses.map((c, i) => (
                <div key={i} className={styles.collegeCourseCard}>
                  <span className={styles.collegeCourseNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.collegeCourseText}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MA Objectives + image */}
          <TextImageRow
            imageUrl={IMGS.yoga2}
            imageAlt="M.A. Yoga Program"
            badge="M.A. Yoga"
            reverse={true}
          >
            <VintageHeading center={false}>
              Master of Yoga (M.A. Yoga) — Objectives
            </VintageHeading>
            <ol className={styles.objectivesList}>
              {maObjectives.map((o, i) => (
                <li key={i} className={styles.objectivesItem}>
                  <span className={styles.objectivesNum}>{i + 1}.</span>
                  <span>{o}</span>
                </li>
              ))}
            </ol>
          </TextImageRow>
        </div>
      </section>

      {/* ── MA ELIGIBILITY — text left, video right ── */}
      <section className={styles.maSection}>
        <div className={styles.container}>
          <OmDivider label="Admissions" />
          <TextVideoRow ytId={YT_ID} reverse={false}>
            <>
              <VintageHeading center={false}>
                Eligibility for M.A. Yoga / PG Diploma
              </VintageHeading>
              <p className={styles.bodyPara}>
                Bachelor's Degree from any University in any subject.
              </p>
              <div className={styles.maDetailsGrid}>
                {[
                  { label: "Duration", val: "2 years" },
                  { label: "Session Start", val: "Admission Open" },
                  { label: "Course Fee", val: "25,000 INR / Year" },
                  {
                    label: "Accommodation",
                    val: "Dormitory, Shared & Single rooms",
                  },
                ].map((d, i) => (
                  <div key={i} className={styles.maDetailCard}>
                    <div className={styles.maDetailLabel}>{d.label}</div>
                    <div className={styles.maDetailVal}>{d.val}</div>
                  </div>
                ))}
              </div>

              <VintageHeading center={false}>How to Apply</VintageHeading>
              <p className={styles.bodyPara}>
                You can buy the prospectus for MA and PG Diploma from AYM Yoga
                College office and submit it on given date along with admission
                fee. Admission will be based as per Uttarakhand Sanskrit
                University norms.
              </p>
            </>
          </TextVideoRow>
        </div>
      </section>

      {/* ── CAREER — text left, image right ── */}
      <section className={styles.careerSection}>
        <div className={styles.container}>
          <OmDivider label="Career Prospects" />
          <TextImageRow
            imageUrl={IMGS.career}
            imageAlt="Career options after yoga diploma"
            badge="Career Options"
          >
            <VintageHeading center={false}>
              Career Option after Diploma &amp; Masters
            </VintageHeading>
            <p className={styles.bodyPara}>
              The courses of Yoga and Meditation open a vast possibility and
              opportunities for job seeking aspirants. After completion of
              course, people can work in hospitals, health centers, health clubs
              or can practice on their own as yoga and meditation experts. They
              are also free to teach the same in colleges and universities.
            </p>
            <p className={styles.bodyPara}>
              They can also start their career as research associate/scholar,
              research analyst, consultant, freelancer or even certified
              instructor. There are vacancies in yoga, meditation and other
              related fields, which keep appearing online and offline and one
              needs to keep oneself updated to get the job of interest.
            </p>
            <p className={styles.bodyPara}>
              One can also start own work by becoming health advisor/counsellor
              and can offer people, their expert advice and services. Thus, this
              course has great potential when it comes to having good career
              prospects.
            </p>
            <div className={styles.careerOptions}>
              {[
                "Hospital & Health Centers",
                "Yoga Studios",
                "Colleges & Universities",
                "Research Scholar",
                "Freelancer / Consultant",
                "Own Yoga Center",
              ].map((o, i) => (
                <div key={i} className={styles.careerChip}>
                  <span className={styles.careerChipDot} />
                  {o}
                </div>
              ))}
            </div>
          </TextImageRow>
        </div>
      </section>

      <HowToReach />
    </div>
  );
}

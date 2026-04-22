"use client";
// YogaFAQ.tsx — Redesigned
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-ttc-faq/Yogafaq.module.css";
import yogaschool from "@/assets/images/front-yoga-school.jpg";
import yogabooks from "@/assets/images/Yoga-Books-Read-During-YTTC.jpg";
import aymyogaroom from "@/assets/images/Room.jpg";
import yogafood from "@/assets/images/Yogic-Foood.jpg";
import certificateimage from "@/assets/images/200-hours-yttc-sept.jpg";
import travelimage from "@/assets/images/Delhi-Airport-to-AYM-Yoga-School.jpg";
import HowToReach from "@/components/home/Howtoreach";

/* ============================================================
   SECTIONS CONFIG
   ============================================================ */
const SECTIONS = [
  { id: "about", label: "About AYM" },
  { id: "course", label: "Course" },
  { id: "accommodation", label: "Accommodation" },
  { id: "food", label: "Food & Meals" },
  { id: "visa", label: "Visa" },
  { id: "health", label: "Health & Safety" },
  { id: "cert", label: "Certification" },
  { id: "travel", label: "Travel" },
  { id: "pack", label: "What to Bring" },
  { id: "payment", label: "Payment" },
  { id: "common", label: "Common Questions" },
];

/* ============================================================
   SVG ICONS
   ============================================================ */
const icons: Record<string, React.ReactNode> = {
  school: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  book: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  bed: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4v16M2 8h20a2 2 0 012 2v10M2 16h20M22 20v-8" />
    </svg>
  ),
  leaf: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 19.34l1.23.66M17 8c.5 3-1 6-4 8M17 8c3-1 5-3 5-3s-2 8-9 10" />
    </svg>
  ),
  globe: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  heart: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  cert: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 17v4M16 17v4M8 21h8M9 10l2 2 4-4" />
    </svg>
  ),
  plane: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2l-2 .5L4 9l-.5 2 3 1 2 5 2-1 1 3z" />
    </svg>
  ),
  bag: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  card: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  qa: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  list: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
};

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M5 8l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ============================================================
   SHARED COMPONENTS
   ============================================================ */
type FrameSize = "lg" | "md" | "sm";
const ImgFrame: React.FC<{
  src: Parameters<typeof Image>[0]["src"];
  alt: string;
  size?: FrameSize;
  priority?: boolean;
}> = ({ src, alt, size = "md", priority = false }) => {
  const cls =
    size === "lg"
      ? styles.imgFrameLg
      : size === "sm"
        ? styles.imgFrameSm
        : styles.imgFrameMd;
  return (
    <div className={styles.imgCenter}>
      <div className={`${styles.imgFrame} ${cls}`}>
        <div className={`${styles.imgCorner} ${styles.imgCornerTl}`} />
        <div className={`${styles.imgCorner} ${styles.imgCornerTr}`} />
        <div className={`${styles.imgCorner} ${styles.imgCornerBl}`} />
        <div className={`${styles.imgCorner} ${styles.imgCornerBr}`} />
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width:575px) 100vw,(max-width:991px) 90vw,920px"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority={priority}
        />
      </div>
    </div>
  );
};

const SectionHeading: React.FC<{
  id: string;
  label: string;
  iconKey: string;
}> = ({ id, label, iconKey }) => (
  <div className={styles.sectionHeadingWrap}>
    <div className={styles.sectionIcon}>{icons[iconKey]}</div>
    <div className={styles.sectionTitleGroup}>
      <span className={styles.sectionLabel}>AYM Yoga School</span>
      <h2 className={styles.sectionTitle} id={id}>
        {label}
      </h2>
    </div>
    <div className={styles.sectionTitleLine} />
  </div>
);

const QA: React.FC<{ q: string; a: React.ReactNode; idx?: number }> = ({
  q,
  a,
  idx = 0,
}) => (
  <div
    className={styles.qaBlock}
    style={{ "--qi": idx } as React.CSSProperties}
  >
    <p className={styles.qaQuestion}>{q}</p>
    <div className={styles.qaAnswer}>{a}</div>
  </div>
);

const FAQItem: React.FC<{
  question: string;
  answer: string;
  defaultOpen?: boolean;
  idx?: number;
}> = ({ question, answer, defaultOpen = false, idx = 0 }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={styles.faqItem}
      style={{ "--ai": idx } as React.CSSProperties}
    >
      <button
        className={`${styles.faqQuestion} ${open ? styles.faqQOpen : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        type="button"
      >
        <span className={styles.faqQText}>{question}</span>
        <span
          className={`${styles.faqQIcon} ${open ? styles.faqQIconOpen : ""}`}
        >
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="6" y1="1" x2="6" y2="11" />
            <line x1="1" y1="6" x2="11" y2="6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className={styles.faqAnswer}>
          <p
            className={styles.faqAnswerText}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  );
};

const OmDivider = () => (
  <div className={styles.omDivider}>
    <div className={`${styles.omLine} ${styles.omLineL}`} />
    <span className={styles.omSymbol}>ॐ</span>
    <div className={`${styles.omLine} ${styles.omLineR}`} />
  </div>
);

/* ============================================================
   PAGE
   ============================================================ */
const YogaFAQ: React.FC = () => {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.pageWrapper}>
      {/* HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroMandalaBg} aria-hidden="true">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="#F15505" strokeWidth="0.5" opacity="0.12">
              {[30, 60, 90, 120, 150, 180, 210, 240].map((r, i) => (
                <circle key={i} cx="250" cy="250" r={r} />
              ))}
              {Array.from({ length: 36 }, (_, i) => {
                const a = (((i * 360) / 36) * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1="250"
                    y1="250"
                    x2={250 + 240 * Math.cos(a)}
                    y2={250 + 240 * Math.sin(a)}
                  />
                );
              })}
              {[80, 140, 200].map((r, i) => (
                <polygon
                  key={i}
                  points={Array.from({ length: 8 }, (_, j) => {
                    const a = (((j * 360) / 8) * Math.PI) / 180;
                    return `${250 + r * Math.cos(a)},${250 + r * Math.sin(a)}`;
                  }).join(" ")}
                />
              ))}
            </g>
          </svg>
        </div>
        <div className={styles.heroOrbL} aria-hidden="true" />
        <div className={styles.heroOrbR} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowLine} />
            AYM Yoga School · Rishikesh, India
            <span className={styles.heroEyebrowLine} />
          </div>
          <h1 className={styles.heroTitle}>
            Yoga Teacher Training{" "}
            <span className={styles.heroTitleAccent}>FAQ</span>
          </h1>
          <p className={styles.heroSub}>
            Everything you need to know before joining our certified yoga
            teacher training programs in Rishikesh.
          </p>
          <div className={styles.heroChips}>
            {[
              "200 Hours",
              "300 Hours",
              "500 Hours",
              "Online TTC",
              "Yoga Alliance USA",
            ].map((c) => (
              <span key={c} className={styles.heroChip}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STICKY NAV */}
      <nav className={styles.stickyNav} aria-label="FAQ sections">
        <div className={styles.stickyNavInner}>
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.navBtn} ${active === id ? styles.navBtnActive : ""}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className={styles.mainLayout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHead}>
              <span className={styles.sidebarHeadIcon}>{icons.list}</span>
              <span className={styles.sidebarHeadTxt}>Contents</span>
            </div>
            <ul className={styles.sidebarList}>
              {SECTIONS.map(({ id, label }) => (
                <li key={id} className={styles.sidebarItem}>
                  <button
                    type="button"
                    className={`${styles.sidebarBtn} ${active === id ? styles.sidebarBtnActive : ""}`}
                    onClick={() => scrollTo(id)}
                  >
                    <span className={styles.sidebarDot} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* CONTENT */}
        <main className={styles.mainContent}>
          {/* ABOUT */}
          <div id="about" className={styles.contentSection}>
            <SectionHeading
              id="about"
              label="About AYM — Association for Yoga and Meditation"
              iconKey="school"
            />
            <ImgFrame
              src={yogaschool}
              alt="AYM Yoga School Rishikesh"
              size="lg"
              priority
            />
            <p className={styles.bodyText}>
              AYM Yoga School is a non-profit organization registered with the
              Govt. of India in 2005. Located at Upper Tapovan, Laxman Jhulla,
              Rishikesh, it is surrounded by the Himalayas on all sides, full of
              lush green trees. The holy river Ganga flows through, providing a
              calm and peaceful effect on one's mind, body, and soul. The cool
              breeze in the early morning and evening makes life at the ashram
              soothing and comfortable.
            </p>
            <p className={styles.bodyText}>
              There is a local auto rickshaw which costs a few hundred rupees,
              or it is a 10-minute walk from the main road. The ashram has ample
              space for comfortable living.
            </p>
          </div>

          <OmDivider />

          {/* COURSE */}
          <div id="course" className={styles.contentSection}>
            <SectionHeading id="course" label="Course" iconKey="book" />
            <QA
              idx={0}
              q="Question 1: How much does tuition fee cost and what does it include?"
              a={
                <>
                  <div className={styles.feeGrid}>
                    {[
                      {
                        h: "200 Hour",
                        fees: [
                          "$749 — Dormitory",
                          "$899 — Shared",
                          "$1099 — Private",
                        ],
                      },
                      {
                        h: "300 Hour",
                        fees: [
                          "$849 — Dormitory",
                          "$999 — Shared",
                          "$1199 — Private",
                        ],
                      },
                      {
                        h: "500 Hour",
                        fees: [
                          "$1649 — Dormitory",
                          "$1949 — Shared",
                          "$2349 — Private",
                        ],
                      },
                    ].map((f) => (
                      <div key={f.h} className={styles.feeCard}>
                        <span className={styles.feeHours}>{f.h}</span>
                        {f.fees.map((fee) => (
                          <p key={fee} className={styles.feeRow}>
                            {fee}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                  <p className={styles.bodyText}>
                    <strong>Included in Course Fee:</strong>
                  </p>
                  <ul className={styles.includeList}>
                    {[
                      "Yoga course fee",
                      "Private / Shared / Dormitory accommodation",
                      "Yoga Alliance Certificate",
                      "Three meals with tea",
                      "Herbal Tea — 24×7",
                      "1 Out Tour — Sightseeing",
                      "1–2 Institute T-Shirts",
                      "1 Bag with Study material",
                      "Free Wi-Fi / Internet",
                      "Washing Machine for self clothes wash",
                    ].map((it) => (
                      <li key={it} className={styles.includeItem}>
                        <span className={styles.includeCheck}>
                          <CheckIcon />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </>
              }
            />
            <QA
              idx={1}
              q="Question 2: What subjects do you cover in your curriculum?"
              a={
                <>
                  <p className={styles.bodyText}>
                    <strong>Course Curriculum</strong>
                  </p>
                  <ol className={styles.numberedList}>
                    <li>
                      200 Hours yoga curriculum:{" "}
                      <a href="#" className={styles.link}>
                        See 200 Hours Yoga Teacher Training in Rishikesh
                      </a>
                    </li>
                    <li>
                      300 Hours yoga curriculum:{" "}
                      <a href="#" className={styles.link}>
                        See 300 Hours Yoga Teacher Training in Rishikesh
                      </a>
                    </li>
                    <li>
                      500 Hours yoga curriculum:{" "}
                      <a href="#" className={styles.link}>
                        See 500 Hours Yoga Teacher Training in Rishikesh
                      </a>
                    </li>
                  </ol>
                </>
              }
            />
            <QA
              idx={2}
              q="Question 3: How experienced in yoga do I need to be?"
              a={
                <>
                  <p className={styles.bodyText}>
                    <strong>200 Hours:</strong> Basic knowledge of yoga is
                    sufficient — this is a beginner-level course.
                  </p>
                  <p className={styles.bodyText}>
                    <strong>300 Hours:</strong> You should complete the 200 Hour
                    course before joining 300 Hours.
                  </p>
                </>
              }
            />
            <QA
              idx={3}
              q="Question 4: Do I need to study anything beforehand?"
              a={
                <>
                  <p className={styles.bodyText}>
                    Yes — reading about basic yoga poses and meditation will
                    help. Recommended books:
                  </p>
                  <ol className={styles.numberedList}>
                    <li>Light on Yoga</li>
                    <li>Yoga Sutra</li>
                    <li>Srimad Bhagavad Gita</li>
                    <li>Yoga Anatomy</li>
                  </ol>
                  <ImgFrame
                    src={yogabooks}
                    alt="Yoga books for YTTC"
                    size="sm"
                  />
                </>
              }
            />
            <QA
              idx={4}
              q="Question 5: What exams do I need to pass to graduate?"
              a={
                <p className={styles.bodyText}>
                  You need to pass your{" "}
                  <strong>Hatha and Ashtanga Yoga Practical Exam</strong> and a{" "}
                  <strong>25-Question</strong> Open Book Exam.
                </p>
              }
            />
          </div>

          <OmDivider />

          {/* ACCOMMODATION */}
          <div id="accommodation" className={styles.contentSection}>
            <SectionHeading
              id="accommodation"
              label="Accommodation at AYM"
              iconKey="bed"
            />
            <ImgFrame
              src={aymyogaroom}
              alt="AYM accommodation rooms"
              size="lg"
            />
            <p className={styles.bodyText}>
              The school provides residential accommodation. Choose a single or
              shared room per your requirement. Both have private bathrooms with
              shower and geyser. Rooms are clean, airy, and well-lit with clean
              bedsheets and pillows provided.
            </p>
            {[
              {
                q: "Question 1: Do I get a private room and shower?",
                a: "Yes — private room and attached bathroom with shower and warm water.",
              },
              {
                q: "Question 2: Can I stay if I arrive a few nights early?",
                a: "Yes, with an additional daily charge for those extra days.",
              },
              {
                q: "Question 3: How fast is your internet?",
                a: "Fast enough for surfing and online study throughout the school premises.",
              },
              {
                q: "Question 4: Can I share a room with a friend?",
                a: "Yes — we offer both single and shared accommodation options.",
              },
              {
                q: "Question 5: Do you have laundry facilities?",
                a: "Yes — laundry facility is available. You can also use our washing machine yourself.",
              },
              {
                q: "Question 6: A/C Rooms and Heater?",
                a: "A/C Room: USD 100 extra/month. Heater in winter: USD 100 extra/month.",
              },
            ].map((item, i) => (
              <QA
                key={i}
                idx={i}
                q={item.q}
                a={<p className={styles.bodyText}>{item.a}</p>}
              />
            ))}
          </div>

          <OmDivider />

          {/* FOOD */}
          <div id="food" className={styles.contentSection}>
            <SectionHeading
              id="food"
              label="Food & Meals at AYM"
              iconKey="leaf"
            />
            <ImgFrame src={yogafood} alt="Yogic food at AYM" size="lg" />
            <p className={styles.bodyText}>
              Ayurvedic food is provided thrice a day — completely vegetarian
              Indian food with healing properties. Cooked with Indian herbal
              spices: turmeric, coriander, cinnamon, cloves, ginger.
            </p>
            <p className={styles.bodyText}>
              <strong>Note:</strong> We do not provide eggs or non-vegetarian
              meals. We serve three meals plus tea.
            </p>
            <div className={styles.introText}>
              <strong>Daily Meal Plan</strong>
              <br />
              <strong>TEA —</strong> Milk tea / Herbal tea / Ayurvedic tea.
              <br />
              <strong>BREAKFAST —</strong> One solid item + fruit salad or juice
              or shake.
              <br />
              <strong>LUNCH —</strong> Pulses, vegetables, rice, chapatti, and
              salad — traditional Indian food.
              <br />
              <strong>DINNER —</strong> Same as lunch but lighter to aid
              digestion.
            </div>
          </div>

          <OmDivider />

          {/* VISA */}
          <div id="visa" className={styles.contentSection}>
            <SectionHeading id="visa" label="Visa" iconKey="globe" />
            <QA
              idx={0}
              q="Type of Visa Needed — Indian Tourist Visa"
              a={
                <p className={styles.bodyText}>
                  Apply for a <strong>Tourist Visa only.</strong> Mention
                  travel/meditation as the purpose of visit. Tourist Visa is
                  easy to obtain and of longer duration.
                </p>
              }
            />
            <QA
              idx={1}
              q="Help for Visa — Invitation Letter"
              a={
                <>
                  <p className={styles.bodyText}>
                    You don't need an invitation letter for a tourist visa. Do
                    not mention joining a yoga course in your application.
                  </p>
                  <p className={styles.bodyText}>
                    If required, we will provide an application letter on
                    request.
                  </p>
                </>
              }
            />
          </div>

          <OmDivider />

          {/* HEALTH */}
          <div id="health" className={styles.contentSection}>
            <SectionHeading
              id="health"
              label="Health & Safety"
              iconKey="heart"
            />
            {[
              {
                q: "Question 1: Is Rishikesh safe?",
                a: "Absolutely. Rishikesh is a holy city — people are friendly and helpful. It is a popular tourist destination and is safe at night.",
              },
              {
                q: "Question 2: Is the water safe to drink?",
                a: "Yes, it is generally safe. Bottled/Bisleri water is also available. At AYM, purified water is available in the kitchen.",
              },
              {
                q: "Question 3: Which vaccines should I get?",
                a: "No specific vaccines are required to travel to India. Consult your doctor for personal health concerns.",
              },
              {
                q: "Question 4: Should I bring any medicines?",
                a: "If you have any ailment, bring your prescribed medicines from your family doctor.",
              },
            ].map((item, i) => (
              <QA
                key={i}
                idx={i}
                q={item.q}
                a={<p className={styles.bodyText}>{item.a}</p>}
              />
            ))}
          </div>

          <OmDivider />

          {/* CERTIFICATION */}
          <div id="cert" className={styles.contentSection}>
            <SectionHeading id="cert" label="Certification" iconKey="cert" />
            <ImgFrame
              src={certificateimage}
              alt="AYM Yoga Certification ceremony"
              size="lg"
            />
            <QA
              idx={0}
              q="Question 1: Is your course certified to Yoga Alliance?"
              a={
                <p className={styles.bodyText}>
                  Yes — all courses are certified to and affiliated with{" "}
                  <strong>Yoga Alliance USA</strong> &amp; International Yoga
                  Federation.
                </p>
              }
            />
            <QA
              idx={1}
              q="Question 2: How do I register as a yoga teacher after graduating?"
              a={
                <p className={styles.bodyText}>
                  After completing your course you'll receive a Yoga Alliance
                  USA certificate. Visit the{" "}
                  <a href="#" className={styles.link}>
                    Official Yoga Alliance Website
                  </a>{" "}
                  to register as an RYT — then you can teach yoga worldwide.
                </p>
              }
            />
          </div>

          <OmDivider />

          {/* TRAVEL */}
          <div id="travel" className={styles.contentSection}>
            <SectionHeading id="travel" label="Travel" iconKey="plane" />
            <QA
              idx={0}
              q="Question 1: Which airport should I fly to?"
              a={
                <>
                  <p className={styles.bodyText}>
                    <strong>IGI Airport, New Delhi —</strong> We can provide
                    pickup. Distance: 250 km.
                  </p>
                  <p className={styles.bodyText}>
                    <strong>Jolly Grant Airport, Dehradun —</strong> We can
                    provide pickup. Distance: 20 km.
                  </p>
                </>
              }
            />
            <QA
              idx={1}
              q="Question 2: Do you provide transportation to/from airport?"
              a={
                <p className={styles.bodyText}>
                  Yes — pickup/taxi service available with additional charges.
                </p>
              }
            />
            <QA
              idx={2}
              q="Question 3: How do I get to Rishikesh?"
              a={
                <>
                  <ImgFrame
                    src={travelimage}
                    alt="Transport to Rishikesh"
                    size="md"
                  />
                  <p className={styles.bodyText}>
                    <strong>AYM Pickup (Delhi):</strong> USD 90 single. Return:
                    USD 150 total (USD 75 each way).
                  </p>
                  <p className={styles.bodyText}>
                    <strong>Taxi:</strong> USD 200–250 from Delhi Airport to
                    AYM.
                  </p>
                  <p className={styles.bodyText}>
                    <strong>Bus:</strong> Airport → Delhi ISBT → Bus to ISBT
                    Rishikesh (~7 hrs) → Taxi/auto to AYM.
                  </p>
                  <p className={styles.bodyText}>
                    <strong>Train:</strong> Delhi → Haridwar (no direct train to
                    Rishikesh) → Taxi/pickup ~USD 20.
                  </p>
                  <p className={styles.bodyText}>
                    <strong>From Dehradun (Jolly Grant):</strong> School pickup
                    or taxi — USD 20.
                  </p>
                </>
              }
            />
            {[
              {
                q: "Question 4: When should I book my arrival flight?",
                a: "Book at your convenience, but arrive at least one day before your course begins.",
              },
              {
                q: "Question 5: When should I book my departure flight?",
                a: "You are free to leave a day after your course is completed.",
              },
              {
                q: "Question 6: What if I need to switch my course date?",
                a: "Switch at least 1 week in advance. The course can be completed within 1 year from your first booking date.",
              },
            ].map((item, i) => (
              <QA
                key={i}
                idx={i + 3}
                q={item.q}
                a={<p className={styles.bodyText}>{item.a}</p>}
              />
            ))}
          </div>

          <OmDivider />

          {/* WHAT TO BRING */}
          <div id="pack" className={styles.contentSection}>
            <SectionHeading
              id="pack"
              label="What to Bring to the School?"
              iconKey="bag"
            />
            <QA
              idx={0}
              q="Question 1: What should I pack?"
              a={
                <p className={styles.bodyText}>
                  Summer: light cotton clothes. Winter: warm clothes — sweaters
                  and woolens.
                </p>
              }
            />
            <QA
              idx={1}
              q="Question 2: How much money should I bring?"
              a={
                <p className={styles.bodyText}>
                  Bring enough for your course fee, travel expenses, and some
                  extra for emergencies.
                </p>
              }
            />
          </div>

          <OmDivider />

          {/* PAYMENT */}
          <div id="payment" className={styles.contentSection}>
            <SectionHeading
              id="payment"
              label="Payment Options"
              iconKey="card"
            />
            <p className={styles.bodyText}>
              Balance is preferred on arrival at the school office. We accept:
            </p>
            <ol className={styles.numberedList}>
              <li>
                Cash — Indian Rupee, US Dollar, Australian Dollar, or Euro.
              </li>
              <li>
                Transferwise —{" "}
                <a
                  href="https://transferwise.com"
                  className={styles.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  transferwise.com
                </a>
              </li>
              <li>
                Credit Cards / Debit Cards{" "}
                <strong>[3.5% extra charge applies]</strong>
              </li>
            </ol>
          </div>

          <OmDivider />

          {/* COMMON QUESTIONS */}
          <div id="common" className={styles.contentSection}>
            <SectionHeading
              id="common"
              label="Common Questions — Yoga Teacher Training"
              iconKey="qa"
            />
            <div className={styles.accordionWrap}>
              {[
                {
                  q: "How long did it take you to become a yoga teacher?",
                  a: "You can enrol for our 200 hour yoga teacher training program. The duration is 24 days. After completion, you will be eligible to register as an RYT 200 with Yoga Alliance, USA.",
                  open: true,
                },
                {
                  q: "Where can I do online yoga teacher training?",
                  a: "AYM offers 200 hour and 300 hour online yoga teacher training programs — either live via Zoom or as recorded self-paced modules.",
                },
                {
                  q: "How to become a certified yoga teacher in India?",
                  a: "Enrol in a yoga teacher training program from a school recognized by Yoga Alliance USA.",
                },
                {
                  q: "Where is the best pregnancy yoga teacher training?",
                  a: "AYM Yoga School in Rishikesh offers the best pregnancy yoga teacher training — a balanced mix of theory and practical teaching specializing in prenatal yoga.",
                },
                {
                  q: "Where is the best yoga teacher training in India?",
                  a: "AYM Yoga School in Rishikesh — structured, comprehensive programs that make you an efficient yoga teacher with complete yogic knowledge.",
                },
                {
                  q: "How to become an Ayush certified yoga teacher?",
                  a: "Enrol in Ayush-certified yoga courses at AYM Yoga School in Rishikesh — the only YCB-recognized yoga school in Rishikesh.",
                },
                {
                  q: "Which is the best yoga school in Rishikesh?",
                  a: "AYM Yoga School is one of the best — with over a decade of offering Yoga Alliance-certified yoga teacher training courses.",
                },
                {
                  q: "What is the best place to learn yoga?",
                  a: "Rishikesh, Kerala, Dharamshala, Goa and Mysore are some of the best places to learn yoga.",
                },
                {
                  q: "Is Rishikesh the best place for yoga?",
                  a: "Yes — yoga was born in Rishikesh, the yoga capital of the world. The spiritual aura of the Ganga and the Himalayan landscape make it ideal for deepening your practice.",
                },
              ].map((item, i) => (
                <FAQItem
                  key={i}
                  idx={i}
                  question={item.q}
                  answer={item.a}
                  defaultOpen={item.open}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <HowToReach />
    </div>
  );
};

export default YogaFAQ;

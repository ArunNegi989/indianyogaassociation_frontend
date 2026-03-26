"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/500-hour-yoga-teacher-training-india/Yogattc500.module.css";
import seatStyles from "@/assets/style/500-hour-yoga-teacher-training-india/Yogattc500.module.css";
import HowToReach from "@/components/home/Howtoreach";

import Image from "next/image";
import heroImg from "@/assets/images/9.webp";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface Batch {
  _id: string;
  startDate: string;
  endDate: string;
  usdFee: string;
  inrFee: string;
  dormPrice: number;
  twinPrice: number;
  privatePrice: number;
  totalSeats: number;
  bookedSeats: number;
  note?: string;
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDateRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const s = new Date(start).toLocaleDateString("en-IN", opts);
  const e = new Date(end).toLocaleDateString("en-IN", opts);
  return `${s} - ${e}`;
}

/* ─────────────────────────────────────────
   TAB CONFIG
───────────────────────────────────────── */
const COURSE_TABS = [
  { label: "100 Hour", key: "100hr", apiPath: "/100hr-seats/get-all-batches" },
  { label: "200 Hour", key: "200hr", apiPath: "/200hr-seats/getAllBatches" },
  { label: "300 Hour", key: "300hr", apiPath: "/300hr-seats/all" },
  { label: "500 Hour", key: "500hr", apiPath: "/500hr-seats" },
] as const;

type TabKey = (typeof COURSE_TABS)[number]["key"];

/* ─────────────────────────────────────────
   SEAT BOOKING SECTION
───────────────────────────────────────── */
function SeatBookingSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("500hr");
  const [batchCache, setBatchCache] = useState<Record<string, Batch[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  const fetchBatches = async (tab: TabKey) => {
    if (batchCache[tab]) return;
    const apiPath = COURSE_TABS.find((t) => t.key === tab)?.apiPath;
    if (!apiPath) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api${apiPath}`);
      const data = await res.json();
      setBatchCache((prev) => ({ ...prev, [tab]: data?.data || [] }));
    } catch {
      setError("Failed to load batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const currentBatches: Batch[] = batchCache[activeTab] || [];
  const activeTabLabel = COURSE_TABS.find((t) => t.key === activeTab)?.label;

  return (
    <div className={seatStyles.wrapper}>
      {/* Tab Bar */}
      <div className={seatStyles.tabBar}>
        {COURSE_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${seatStyles.tab} ${activeTab === tab.key ? seatStyles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className={seatStyles.tableContainer}>
        {loading ? (
          <div className={seatStyles.stateBox}>🕉️ Loading batches...</div>
        ) : error ? (
          <div className={`${seatStyles.stateBox} ${seatStyles.stateError}`}>{error}</div>
        ) : currentBatches.length === 0 ? (
          <div className={seatStyles.stateBox}>
            No upcoming batches available for {activeTabLabel}.
          </div>
        ) : (
          <div className={seatStyles.tableScroll}>
            <table className={seatStyles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Fee (USD)</th>
                  <th>Fee (Indian)</th>
                  <th>Room Price</th>
                  <th>Seats</th>
                  <th>Apply</th>
                </tr>
              </thead>
              <tbody>
                {currentBatches.map((batch) => {
                  const isFull = batch.bookedSeats >= batch.totalSeats;
                  const remaining = batch.totalSeats - batch.bookedSeats;
                  return (
                    <tr key={batch._id}>
                      <td className={seatStyles.tdDate}>
                        <span className={seatStyles.calIcon}>📅</span>{" "}
                        {formatDateRange(batch.startDate, batch.endDate)}
                      </td>
                      <td>{batch.usdFee}</td>
                      <td>{batch.inrFee}</td>
                      <td className={seatStyles.tdRoom}>
                        Dorm <strong className={seatStyles.price}>${batch.dormPrice}</strong>{" "}
                        | Twin <strong className={seatStyles.price}>${batch.twinPrice}</strong>{" "}
                        | Private <strong className={seatStyles.price}>${batch.privatePrice}</strong>
                      </td>
                      <td>
                        {isFull ? (
                          <span className={seatStyles.fullyBooked}>Fully Booked</span>
                        ) : (
                          <span className={seatStyles.seatsAvailable}>
                            {remaining} / {batch.totalSeats} Seats
                          </span>
                        )}
                      </td>
                      <td>
                        {isFull ? (
                          <span className={seatStyles.applyDisabled}>Apply Now</span>
                        ) : (
                          <a
                            href={`/yoga-registration?batchId=${batch._id}&type=${activeTab}`}
                            className={seatStyles.applyLink}
                          >
                            Apply Now
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {currentBatches[0]?.note && (
          <p className={seatStyles.note}>
            <strong>Note:</strong> {currentBatches[0].note}
          </p>
        )}

        <div className={seatStyles.ctaRow}>
          <a href="#" className={seatStyles.joinBtn}>
            Join Your Yoga Journey
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   YOUTUBE EMBED
───────────────────────────────────────── */
const YouTubeEmbed = ({ videoId, title }: { videoId: string; title: string }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={styles.videoWrapper}>
      {playing ? (
        <iframe
          className={styles.videoIframe}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className={styles.videoThumb}
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className={styles.thumbImg}
            loading="lazy"
          />
          <span className={styles.playBtn}>
            <svg viewBox="0 0 68 48" width="58" height="42">
              <rect width="68" height="48" rx="10" fill="#e07b00" opacity="0.93" />
              <polygon points="26,13 53,24 26,35" fill="#fff" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   CAROUSEL
───────────────────────────────────────── */
const Carousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [idx, setIdx] = useState(0);
  const len = images.length;
  const [visibleCount, setVisibleCount] = useState(4);

  React.useEffect(() => {
    const update = () => {
      if (window.innerWidth < 576) setVisibleCount(1);
      else if (window.innerWidth < 768) setVisibleCount(2);
      else if (window.innerWidth < 992) setVisibleCount(3);
      else setVisibleCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const prev = () => setIdx((i) => (i - 1 + len) % len);
  const next = () => setIdx((i) => (i + 1) % len);
  const visible = Array.from({ length: visibleCount }, (_, o) => images[(idx + o) % len]);

  return (
    <div className={styles.carousel}>
      <button className={`${styles.carBtn} ${styles.carBtnL}`} onClick={prev} aria-label="Previous">‹</button>
      <div className={styles.carTrack} style={{ gridTemplateColumns: `repeat(${visibleCount}, 1fr)` }}>
        {visible.map((src, i) => (
          <div key={i} className={styles.carSlide}>
            <img src={src} alt={`${alt} ${i + 1}`} className={styles.carImg} loading="lazy" />
          </div>
        ))}
      </div>
      <button className={`${styles.carBtn} ${styles.carBtnR}`} onClick={next} aria-label="Next">›</button>
    </div>
  );
};

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
const Stars = ({ n = 5 }: { n?: number }) => (
  <div className={styles.stars}>{Array(n).fill("★").join("")}</div>
);

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
const OmDiv = () => (
  <div className={styles.omDiv}>
    <span className={styles.divLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.divLine} />
  </div>
);

/* ─────────────────────────────────────────
   IMAGES
───────────────────────────────────────── */
const accomImgs = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80",
];
const foodImgs = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
];

/* ─────────────────────────────────────────
   REVIEWS
───────────────────────────────────────── */
const reviews = [
  {
    name: "Christina Lin",
    platform: "on Google",
    avatar: "https://i.pravatar.cc/48?img=47",
    initial: "",
    text: "The teachers are very professional and patient\nThe courses are solid, Sanskrit singing, therapy courses, philosophy, anatomy, asana courses, meditation\nGive us in-depth and practical knowledge\nVery good at listening to students' voices\nThe kitchen is also very attentive in preparing meals for us\nEnjoy class every day\nThank you very much for every day I come here",
  },
  {
    name: "Priscila Saldivar",
    platform: "on Google",
    avatar: "https://i.pravatar.cc/48?img=48",
    initial: "",
    text: "It is a good school with good teachers. I had an overall nice experience living in Rishikesh. I dream of returning. Like any Yoga Alliance school, the contents are limited, and in that sense I imagined that I would learn more things, but in any case it was a good choice to study in India and I will gladly return. Grateful and forever in love with Rishikesh, Ganga Ma and its people.",
  },
  {
    name: "Tea Laurenchet",
    platform: "on Google",
    initial: "T",
    avatar: null,
    text: "I did my 200h YTT at AYM, it was an absolutely incredible experience. Everything lived up to my expectations, the teachers and staff were kind, attentive, patient, it was a real pleasure to share these moments here in Rishikesh!\nThe food is homemade every day (delicious), the rooms are as described and you can find shops and restaurants nearby if needed.\nThank you for everything, I will come back to complete my training in your ashram 🙏\nHari Om Tat Sat",
  },
  {
    name: "THAMY LILA PEZET CAHUIN",
    platform: "on Google",
    avatar: "https://i.pravatar.cc/48?img=50",
    initial: "",
    text: "My experience at AYM was amazing. I did the 200 hour Yoga TTC course, where I had excellent teachers, made new friends, and enjoyed vegetarian food. I learned more about the philosophy of Yoga with all the courses that were given to us as well as the day to day at school. I take pleasant memories. I hope to come back soon. Thanks.",
  },
];

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function YogaTTC500() {
  return (
    <div className={styles.page}>
      <div className={styles.mandalaTopLeft} aria-hidden="true" />
      <div className={styles.mandalaBottomRight} aria-hidden="true" />
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══ HERO ══ */}
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

      <section className={styles.heroSection2}>
        <div className="container px-3 px-md-4">
          <h1 className={styles.heroTitle}>
            500 Hour Yoga Teacher Training Course in Rishikesh
          </h1>
          <OmDiv />
          <div className={styles.bodyText}>
            <p>
              Welcome to our transformative 500 hour yoga teacher training course in Rishikesh, where
              ancient wisdom meets modern teaching methodologies. Join our esteemed 500 hour yoga teacher
              training program, registered with Yoga Alliance USA and recognized globally. This comprehensive
              course is designed to deepen your practice and enhance your flexibility while refining your
              teaching skills. Graduates will gain the confidence necessary to lead their classes.
            </p>
            <p>
              Over eight weeks, you will cultivate your yoga knowledge at an advanced level and develop your
              unique teaching style. Our program is offered in Rishikesh, India, every month, providing an
              enriching environment for your yoga journey. Elevate your practice and teaching abilities with us.
            </p>
            <p>
              AYM, our 500-hour yoga training course, is a meticulously structured and rigorous program that
              spans two months. This comprehensive course offers in-depth knowledge of yoga asanas, ranging
              from fundamental to advanced levels. Participants will engage in a diverse curriculum that
              includes classes on Meditation, Pranayama, and various styles of Asana such as Hatha Yoga,
              Ashtanga Yoga, and Multi-style Yoga. Additionally, the course covers Yoga Philosophy, Yoga
              Therapy, and Human Anatomy, ensuring a well-rounded education. Upon successfully completing the
              500 hour Teacher Training Course in Rishikesh, students will receive a certificate accredited
              by{" "}
              <a href="#" className={styles.inlineLink}>Yoga Alliance, USA</a>.
              Transform your practice and teaching capabilities with this transformative journey.
            </p>
            <p>
              If you are seeking an advanced 500 hour Yoga Teacher Training Course (TTC) in Rishikesh that
              offers comprehensive knowledge across a variety of yoga styles, look no further. Our 500 hour
              course is ideal for individuals who wish to complete both beginner and advanced-level yoga
              teacher training simultaneously.
            </p>
            <p>
              At AYM Yoga School, recognized as one of the best 500 hour yoga teacher training institutions
              in Rishikesh, we are dedicated to enhancing your teaching skills and effectiveness. Join us for
              a transformative experience that will deepen your practice and elevate your teaching capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* ══ WHAT MAKES AYM + GAINS ══ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>
              What makes AYM School's Yoga Teachers Training Courses stand apart from the rest?
            </h2>
            <div className={styles.blockUnderline} />
            <div className={styles.bodyText}>
              <p>
                Our school was established in 2005, and since then, thousands of yogis worldwide have marked
                their sacred yogic journeys through our Yoga TTC courses in India.
              </p>
              <p>
                This rich experience of over 17 years deep rooted in values, the guidance of our eminent
                founder - Yogi Mahesh Chetan Ji, the dedication of our well-qualified yoga teachers, and the
                fantastic feedback of our alums make us the best yoga teacher training school in Rishikesh, India.
              </p>
            </div>

            <h2 className={styles.blockTitle} style={{ marginTop: "2rem" }}>
              What do I gain from the 500 Hour Yoga Teacher Training Course in Rishikesh?
            </h2>
            <div className={styles.blockUnderline} />
            <div className={styles.bodyText}>
              <p>
                This 500 hours of yoga TTC not only gives you the credibility to begin your classes as an
                advanced-level yoga teacher, but it also equips you with in-depth knowledge and confidence.
                You can be assured that you are receiving the highest quality of yoga education and training.
              </p>
              <p>
                Not only that, but you'll also get the lifetime experience of immersing yourself in the rich
                cultural and spiritual heritage of Rishikesh, India. (Rishikesh is the land of yogis and
                spirituality.) Once you start your stay in the city, you can feel the spiritual vibes of this
                place for yourself, a truly unique and enriching experience.
              </p>
              <p>
                Your asana practices are bound to improve each day of the training sessions. This course
                deepens your understanding of the human body's anatomy, physiology, and kinesiology. This
                further helps you develop an effective yoga therapy sequence according to the requirements.
              </p>
              <p>
                Practising asanas with a group of yoga aspirants like you from diverse backgrounds is an
                experience that will broaden your vision. Our teachers always focus on bringing the best out
                of you. The feedback from our ex-students across the globe confirms the same.
              </p>
            </div>

            <div className={styles.shivaImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1599982890969-1b67c785e211?w=900&q=80"
                alt="Yoga practice in front of Shiva artwork"
                className={styles.shivaImg}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ SEAT BOOKING — NEW TABBED DESIGN ══ */}
      <section className={styles.section} id="dates">
        <div className="container px-3 px-md-4">
          <OmDiv />
          <h2 className={styles.sectionTitleCentered}>
            500 Hour Yoga Teacher Training India – Upcoming Batches
          </h2>
          <div className={styles.sectionUnderlineCentered} />

          <SeatBookingSection />

          <div className={styles.tableNote}>
            <p>
              <strong>Note:</strong> Course Fee: 1649 USD (Including: Dormitory Stay and Food) | For the
              upgrade you accommodation send us{" "}
              <a href="#" className={styles.inlineLink}>E-mail</a>. Available accommodation Categories:
              Shared, Private and Luxury.
            </p>
            <p>
              Airport pick up from Delhi airport to Yoga school Rishikesh will cost 90 USD and Round Trip 150 USD.
            </p>
          </div>

          <h3 className={styles.subHeadingCentered}>Accommodation</h3>
          <div className={styles.sectionUnderlineCentered} />
          <Carousel images={accomImgs} alt="Accommodation" />
        </div>
      </section>

      {/* ══ FOOD + INDIAN FEE + CREDIBILITY + DURATION ══ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <h3 className={styles.subHeadingCentered}>Food</h3>
          <div className={styles.sectionUnderlineCentered} />
          <Carousel images={foodImgs} alt="Food" />

          <div className={styles.indianFeeBlock}>
            <h3 className={styles.indianFeeTitle}>500 Hour Course Fee for Indian Students</h3>
            <div className={styles.sectionUnderlineCentered} />
            <div className="row g-3 justify-content-center mt-2">
              {["Dormitory: 44,999 INR", "Shared Room: 54,999 INR", "Private Room: 94,999 INR", "Luxury Room: 1,49,999 INR"].map((fee, i) => (
                <div key={i} className="col-6 col-sm-6 col-lg-3">
                  <div className={styles.feeChip}>{fee}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.block} style={{ marginTop: "2.5rem" }}>
            <h2 className={styles.blockTitleCentered}>What is The Credibility of This Course?</h2>
            <div className={styles.blockUnderlineCentered} />
            <div className={styles.bodyText}>
              <p>
                Well, that's a good question. Once you have completed this course from our yoga school, you
                are eligible to register with the Yoga Certification Board (YCB) of the Ministry of Ayush -
                Government of India, as well as with international yoga authorities like{" "}
                <strong>Yoga Alliance, USA</strong>.
              </p>
              <p>
                Yes, our courses are recognized at national as well as international levels. Upon completing
                this course, you get the conviction to design and conduct yoga classes as a well-qualified teacher.
              </p>
            </div>

            <h2 className={styles.blockTitleCentered} style={{ marginTop: "1.8rem" }}>
              How Long is The Duration of The Course?
            </h2>
            <div className={styles.blockUnderlineCentered} />
            <div className={styles.bodyText}>
              <p>
                This is a two-month-long course (It takes a total of eight weeks of stay in Rishikesh to
                complete this program.)
              </p>
              <p>
                The 500 hours yoga TTC is designed as a blended program of our{" "}
                <a href="#" className={styles.inlineLink}>200 hour yoga teachers training program in Rishikesh</a>{" "}
                and{" "}
                <a href="#" className={styles.inlineLink}>300 hours yoga teachers training program in rishikesh</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SYLLABUS + ELIGIBILITY + EVALUATION ══ */}
      <section className={styles.section}>
        <div className="container px-3 px-md-4">
          <div className={styles.block}>
            <h2 className={styles.blockTitleCentered}>Overview of Syllabus</h2>
            <div className={styles.blockUnderlineCentered} />
            <div className={styles.bodyText}>
              <p>
                Since this is a merged program of 200 hour of yoga TTC and 300 hour of yoga TTC courses,
                the curriculum is vast and advanced. The practice sessions are deep and intensive, which is
                beneficial for you to perfect your existing yoga practice.
              </p>
              <p>
                The entire course is covered in 14 modules. These sections give you a good understanding of
                the following concepts:
              </p>
            </div>

            <div className={styles.syllabusGrid}>
              {[
                { label: "The Yogic Philosophy:", text: "Here, you will learn the history of yoga, the various paths of yoga, Patanjali Yoga Sutras, etc." },
                { label: "Asana:", text: "Yoga Postures are taught in various styles (Hatha yoga, Ashtanga, Kundalini, Sivananda, power, flow, Iyengar style, etc.)" },
                { label: "Yoga Therapy:", text: "Sessions are planned in the second half of the 500 hours course on Yoga Therapy for the management of common diseases, etc." },
                { label: "Pranayama:", text: "Here, various types of breathing exercises are taught practically. It includes Ujjayi, Anulom Vilom (Alternate Nostril Breathing), Bhramari, Sheethali (Cooling pranayama), Sheetkari, Bhastrika, Surya Bhedana, Chandra Bhedana, etc." },
                { label: "Meditation:", text: "Various methods of meditation are taught here (e.g., chakra meditation, breath-based meditation, nada meditation, etc.)" },
                { label: "Anatomy Sessions & Alignment Classes:", text: "These sessions give you an idea about the structure of the human body and the effects of yoga on the body system (like the muscular system, skeletal system, respiratory system, etc.)" },
                { label: "Yoga Teaching Techniques:", text: "Through these various techniques, you can manage a group of people when you conduct your yoga sessions. You will be taught how to guide your students effortlessly to get into an asana, also on creating an effective yoga sequence for your sessions, etc." },
              ].map((s, i) => (
                <div key={i} className={styles.syllabusItem}>
                  <span className={styles.syllabusLabel}>{s.label}</span> {s.text}
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4 mt-2 align-items-start">
            <div className="col-12 col-md-6">
              <div className={styles.blockSmall}>
                <h3 className={styles.blockSmallTitle}>What are the Eligibility Criteria?</h3>
                <div className={styles.blockSmallLine} />
                <p className={styles.bodyPara}>
                  A dedicated mindset to learn yoga is required to join this course. If you are looking for
                  a one-time course to learn the basics of yoga to the advanced level, then this course is for you.
                </p>
              </div>
              <div className={styles.blockSmall} style={{ marginTop: "1.5rem" }}>
                <h3 className={styles.blockSmallTitle}>Is there an Evaluation Process for the Course?</h3>
                <div className={styles.blockSmallLine} />
                <p className={styles.bodyPara}>
                  At the end of each module, a <strong>written exam</strong> needs to be given (mostly open
                  book exams). This helps you to retain the knowledge.
                </p>
                <p className={styles.bodyPara}>
                  There are practice exams that are conducted during the yoga alignment classes.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <img
                src="https://images.unsplash.com/photo-1593810451137-5dc55105dace?w=600&q=80"
                alt="Student taking written exam in yoga class"
                className={styles.evalImg}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ INCLUDED / NOT INCLUDED + FACT FROM FICTION ══ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h3 className={styles.inclTitle}>Included in the package of 500-Hour Courses in India</h3>
              <div className={styles.inclLine} />
              <ol className={styles.inclList}>
                {[
                  "6 days yoga, meditation, and theory classes in a week, Sunday is free day",
                  "58 nights of accommodation with meals",
                  "One AYM t-shirt",
                  "One yoga Bag for books and study material.",
                  "One tour to local attraction during the course.",
                  "3 meals, tea, filtered water (seven days a week except for lunch on Sunday).",
                  "Teaching material, Course manual, common yoga mat in studio (not personal)",
                  "Yoga Anatomy, Teaching methodology, philosophy, Ayurveda theory classes",
                  "Free Wi-Fi, self-service laundry (washing machine)",
                  "Yoga Alliance recognized certification after graduation.",
                ].map((item, i) => <li key={i}>{item}</li>)}
              </ol>
              <p className={styles.inclNote}>
                <strong>Note:</strong> All items in the above included list are part of the course package.
                And incase you opt out any of these items, we will not be initiating a refund for that particular item.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <h3 className={styles.inclTitle}>Not Included</h3>
              <div className={styles.inclLine} />
              <ol className={styles.inclList}>
                {[
                  "Airfare.",
                  "Airport pickup (Extra Charges Applicable).",
                  "Bus/train transfer (Extra Charges Applicable).",
                  "Spa/massage treatments (Extra Charges Applicable).",
                  "Air conditioner room (Extra Charges Applicable).",
                  "Heater for a room (Extra Charges Applicable).",
                ].map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </div>
          </div>

          <div className={styles.fictionBox}>
            <h3 className={styles.fictionTitle}>
              500 Hour Yoga Teacher Training in Rishikesh, India: Separating Fact from Fiction
            </h3>
            <div className={styles.fictionUnderline} />
            <div className={styles.bodyText}>
              <p>
                Where 500 hrs yoga training, Search Blooms and Blossoms - AYM School of Yoga, Rishikesh - If
                you are seeking such a journey: One that unites deep spiritual knowledge, the right ambience,
                and like-minded people with truly inspired mentors, then Rishikesh, AYM Yoga School is the
                optimal doorway to give wings to your dream. Nestled in the foothills of the Himalaya, cradled
                by the sacred Ganga, imbued with the true spirit of Yoga, AYM (India Yoga Association)
                reverberates with the vibration of ancient wisdom while nurturing modern seekers and aspirants.
              </p>
              <p>
                The courses offered blend ancient with contemporary - Hatha, Ashtanga, Vinyasa, Yin and Yang
                Yoga, along with the deep study of anatomy, philosophy, pranayama, mudras, meditation and mantra
                chanting. Learners immerse themselves in timeless texts like the Patanjali Yoga Sutras, the
                Bhagavad Gita, and the Upanishads, and explore their deep-seated queries not only in books but
                also in lived experiences.
              </p>
              <p>
                You are what you eat. Food, which is fuel for the body, is next-level - wholesome, sumptuous,
                and Sattvic, even variegated as per your physical needs, saltless, spiceless, vegan or
                vegetarian, partaken in a warm and welcoming environment.
              </p>
              <p>
                The graduation ceremony, when the participants receive their certificates, seems more like a
                consecration - a renewed vigour and promise to live and carry the light of Yogic living into
                the world. AYM Yoga School, Rishikesh, is an ideal sojourn where every journey begins and ends
                in sacred fire. " Asto maa sad gamaya, Tamso maa jyotir gamaya".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STUDENT REVIEWS + REFUND + HOW TO APPLY ══ */}
      <section className={styles.section}>
        <div className="container px-3 px-md-4">
          <h2 className={styles.sectionTitleCentered}>Student's Reviews</h2>
          <div className={styles.sectionUnderlineCentered} />

          <div className="row g-4 mt-1">
            {reviews.map((r, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    {r.avatar ? (
                      <img src={r.avatar} alt={r.name} className={styles.reviewAvatar} />
                    ) : (
                      <div className={styles.reviewInitial}>{r.initial}</div>
                    )}
                    <div className="flex-grow-1 overflow-hidden">
                      <p className={styles.reviewName}>{r.name}</p>
                      <p className={styles.reviewPlatform}>{r.platform}</p>
                    </div>
                    <span className={styles.googleG}>G</span>
                  </div>
                  <Stars />
                  <p className={styles.reviewText}>{r.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <a href="#" className={styles.btnPrimary}>Read More Reviews</a>
          </div>

          <div className="row g-4 mt-4">
            <div className="col-12 col-md-6">
              <div className={styles.infoBlock}>
                <h3 className={styles.infoBlockTitle}>What are the Refund Rules for the Course Fee?</h3>
                <div className={styles.infoBlockLine} />
                <p className={styles.bodyPara}>
                  You can reserve your spot by paying an advance booking fee of 215 USD. However, for any
                  reason, if you couldn't join on the given date, a refund cannot be issued, but you will be
                  allowed to utilize the amount for booking another yoga TTC from AYM School within one year.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className={styles.infoBlock}>
                <h3 className={styles.infoBlockTitle}>How to Apply for the Course?</h3>
                <div className={styles.infoBlockLine} />
                <p className={styles.bodyPara}>
                  Fill out the online application form, and once you get our approval you could transfer the
                  initial advance payment fee (either through Paypal or through bank transfer) to reserve your
                  seat. You will get an email acknowledgment once we receive the advance fee.
                </p>
              </div>
            </div>
          </div>

          <OmDiv />
        </div>
      </section>

      <HowToReach />
    </div>
  );
}
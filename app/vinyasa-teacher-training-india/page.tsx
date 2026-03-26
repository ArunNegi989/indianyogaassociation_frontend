"use client";

import React, { useEffect, useState } from "react";
import styles from "@/assets/style/vinyasa-teacher-training-india/Ashtangavinyasattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/13.webp";
import api from "@/lib/api";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface SeatBatch {
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
  note: string;
}

/* ─────────────────────────────────────────
   DATE FORMATTER
───────────────────────────────────────── */
const formatDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
};

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
    {/* Petal ring */}
    <g fill="none" stroke={c1} strokeWidth={sw * 0.4} opacity="0.25">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const cx = 150 + 60 * Math.cos(r),
          cy = 150 + 60 * Math.sin(r);
        return (
          <ellipse
            key={deg}
            cx={cx}
            cy={cy}
            rx="18"
            ry="8"
            transform={`rotate(${deg},${cx},${cy})`}
          />
        );
      })}
    </g>
    <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
    <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.62" />
  </svg>
);

/* Lotus chakra petal decoration */
const LotusChakra = ({
  size = 60,
  color = "#e07b00",
}: {
  size?: number;
  color?: string;
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1.2" />
    <circle cx="50" cy="50" r="32" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" />
    <circle cx="50" cy="50" r="18" fill="none" stroke={color} strokeWidth="1" opacity="0.8" />
    <circle cx="50" cy="50" r="7" fill={color} opacity="0.45" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const r = (deg * Math.PI) / 180;
      return (
        <line
          key={deg}
          x1={50 + 20 * Math.cos(r)}
          y1={50 + 20 * Math.sin(r)}
          x2={50 + 44 * Math.cos(r)}
          y2={50 + 44 * Math.sin(r)}
          stroke={color}
          strokeWidth="1"
          opacity="0.55"
        />
      );
    })}
    <text x="50" y="56" textAnchor="middle" fontSize="20" fill={color} fontFamily="serif" opacity="0.9">
      ॐ
    </text>
  </svg>
);

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
const OmDivider = () => (
  <div className={styles.omDiv}>
    <span className={styles.omLine} />
    <LotusChakra size={28} color="#e07b00" />
    <span className={styles.omLine} />
  </div>
);

const SimpleDivider = () => (
  <div className={styles.simpleDivider}>
    <span className={styles.omLine} />
  </div>
);

/* ─────────────────────────────────────────
   CORNER ORNAMENT
───────────────────────────────────────── */
function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];
  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.cornerOrn}
      style={{ transform: flip }}
    >
      <path d="M2,2 L2,18 M2,2 L18,2" stroke="#b8860b" strokeWidth="1.5" fill="none" />
      <path d="M2,2 Q8,8 16,2 Q8,8 2,16" stroke="#b8860b" strokeWidth="0.7" fill="none" />
      <circle cx="2" cy="2" r="2" fill="#b8860b" opacity="0.7" />
      <circle cx="10" cy="10" r="1.5" fill="#b8860b" opacity="0.4" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   BORDER STRIP
───────────────────────────────────────── */
function BorderStrip() {
  return (
    <div className={styles.borderStrip}>
      <svg
        viewBox="0 0 800 14"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.borderSvg}
      >
        {Array.from({ length: 40 }, (_, i) => {
          const x = i * 20 + 10;
          return (
            <g key={i}>
              <polygon
                points={`${x},7 ${x + 6},2 ${x + 12},7 ${x + 6},12`}
                fill="none"
                stroke="#b8860b"
                strokeWidth="0.8"
              />
              <circle cx={x + 6} cy={7} r="1.2" fill="#b8860b" opacity="0.7" />
            </g>
          );
        })}
        <line x1="0" y1="7" x2="800" y2="7" stroke="#e07b00" strokeWidth="0.3" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   SEATS CELL — dynamic (same as 100hr)
───────────────────────────────────────── */
function SeatsCell({ booked, total }: { booked: number; total: number }) {
  const isFull = booked >= total;
  const remaining = total - booked;
  if (isFull) return <span className={styles.fullyBooked}>Fully Booked</span>;
  return <span className={styles.seatsAvailable}>{remaining} / {total} Seats</span>;
}

/* ─────────────────────────────────────────
   DATA — static content
───────────────────────────────────────── */
const learnItems = [
  "How to teach professionally.",
  "How to instruct classes.",
  "Practice different Ashtanga Vinyasa yoga sequences.",
  "Adjusting and correcting.",
  "Alignments.",
  "Adopt and modify fundamental postures.",
  "History of ashtanga Vinyasa yoga.",
  "Different strategies.",
];

const whoItems = [
  "Looking forward to becoming a qualified yoga teacher globally.",
  "Looking for the best Ashtanga vinyasa yoga teacher training in Rishikesh to gain experience and comfortable accommodation.",
  "Looking forward to deepening your knowledge, practice and skills.",
  "Looking forward to sharing the teachings with others for a happy and meaningful life.",
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function AshtangaVinyasaTTC() {
  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/vinyasa-seats/get-all-batches")
      .then((res) => setSeats(res.data.data ?? []))
      .catch((err) => console.error("Failed to fetch vinyasa seats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      {/* Fixed Mandala Decorations */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={420} c1="#e07b00" c2="#d4a017" sw={0.42} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={380} c1="#d4a017" c2="#e07b00" sw={0.42} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={220} c1="#e07b00" c2="#d4a017" sw={0.56} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={220} c1="#d4a017" c2="#e07b00" sw={0.56} />
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
          SECTION 1 — INTRO + COURSE DETAILS
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <h1 className={styles.heroTitle}>
            Ashtanga Vinyasa Yoga Teacher Training Course Rishikesh, India
          </h1>
          <SimpleDivider />

          <p className={styles.bodyPara}>
            Yoga is one of the most beneficial practices. Given its benefits, it
            is no surprise that people worldwide are participating in it. Among
            many styles, Ashtanga Vinyasa Yoga is the oldest and most common. We
            at AYM are the{" "}
            <strong>best Ashtanga Vinyasa yoga school in Rishikesh</strong> and
            are well-known for our services and teachings. So, if you're seeking
            inner peace and enlightenment, you've come to the right place.
          </p>

          {/* Course Details */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>
              Ashtanga Vinyasa Yoga Course Details
            </h2>
            <div className={styles.cardUnderline} />

            <p className={styles.bodyPara}>
              At AYM, the{" "}
              <strong>best Ashtanga Vinyasa yoga school in Rishikesh</strong>,
              our Course follows the Ashtanga Vinyasa yoga tradition. The course
              structure follows the Yoga Alliance standards. Our school teaches
              a variety of courses and programs that will help you not only
              learn but also become a certified teacher.
            </p>
            <p className={styles.bodyPara}>
              You'll learn everything from theory to practical for students of
              all levels- beginners, intermediate, and advanced. At our{" "}
              <strong>Ashtanga Vinyasa yoga course in Rishikesh</strong>, you'll
              learn:
            </p>

            {/* 2-column learn list */}
            <div className={styles.learnGrid}>
              {learnItems.map((item, i) => (
                <div key={i} className={styles.learnItem}>
                  <span className={styles.learnNum}>{i + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Who Can Apply */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>Who can Apply for this Course?</h2>
            <div className={styles.cardUnderline} />

            <p className={styles.bodyPara}>
              Ashtanga Vinyasa Yoga teacher training is not a retreat but a
              professional training course. It required preparation and
              dedication. Anyone who is interested and serious about learning
              the practice and philosophy can apply for an{" "}
              <strong>
                Ashtanga Vinyasa yoga teacher training course in Rishikesh.
              </strong>
            </p>
            <p className={styles.bodyPara}>
              With our Course, you can expand your knowledge and practice for
              your personal and professional life. Our{" "}
              <strong>ashtanga vinyasa yoga TTC in Rishikesh</strong> is best
              suited for you if you're:
            </p>

            <div className={styles.whoList}>
              {whoItems.map((item, i) => (
                <div key={i} className={styles.whoItem}>
                  <span className={styles.whoDot} />
                  <span>
                    {i + 1}. {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — PROMO BANNER + COMMUNITY + ACCOMMODATION
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          <OmDivider />

          {/* Promo banner */}
          <div className={styles.promoBanner}>
            <div className={styles.promoImgSide}>
              <img
                src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=85"
                alt="Vinyasa Yoga Teacher Training Rishikesh class"
                className={styles.promoImg}
                loading="lazy"
              />
              <div className={styles.promoImgOverlay} />
            </div>
            <div className={styles.promoTextSide}>
              <p className={styles.promoSmall}>AYM YOGA SCHOOL · RISHIKESH</p>
              <h2 className={styles.promoHeading}>
                Vinyasa Yoga
                <br />
                Teacher Training
              </h2>
              <p className={styles.promoLocation}>Rishikesh, INDIA</p>
              <div className={styles.promoDivLine} />
              <p className={styles.promoFee}>
                Online Fee: <strong>10,000 INR</strong>
              </p>
              <a href="#schedule" className={styles.promoBtn}>
                Book Your Spot
              </a>
            </div>
          </div>

          <OmDivider />

          {/* Certified Teachers */}
          <div className={styles.infoBlock}>
            <h2 className={styles.infoTitle}>
              Learn from Our Certified Yoga Teachers in Rishikesh
            </h2>
            <div className={styles.infoUnderline} />
            <p className={styles.bodyPara}>
              As the{" "}
              <strong>best Vinyasa yoga training centre in Rishikesh,</strong>{" "}
              we have the best certified yoga therapists and teachers. The
              teachers mainly focus on spreading awareness of yoga. Each teacher
              has years of experience and is completely dedicated to the growth
              and exploration of students.
            </p>
            <p className={styles.bodyPara}>
              The teachers use traditional teaching methods that encourage
              students to stay in the long term. So why wait when you can be
              inspired by the wisdom of great masters? Our instructors of the{" "}
              <strong>
                Best Ashtanga Vinyasa yoga teacher training in Rishikesh
              </strong>{" "}
              educate students on clear concepts. You can rely on them entirely
              for any issue.
            </p>
          </div>

          {/* Community */}
          <div className={`${styles.infoBlock} mt-4`}>
            <h2 className={styles.infoTitle}>
              Join Our Healing, Nurturing Community for Life
            </h2>
            <div className={styles.infoUnderline} />
            <p className={styles.bodyPara}>
              Whether you're enrolling for our{" "}
              <strong>500 hour Ashtanga Vinyasa yoga TTC in Rishikesh</strong>{" "}
              or the long-term{" "}
              <strong>Ashtanga Vinyasa yoga courses in Rishikesh, India</strong>
              , know that you'll be part of an empowering community. You'll
              learn and grow with people of different cultures and backgrounds
              but with a similar aim- to awaken the world and their potential
              through yoga. Whether you're already experienced or just a
              beginner, we openly welcome you to be a part of our large and
              thriving family. You'll gain all the support and learn to
              contribute to society.
            </p>
          </div>

          {/* Accommodation */}
          <div className={`${styles.infoBlock} mt-4`}>
            <h2 className={styles.infoTitle}>
              Enjoy Comfortable Accommodation During your Stay
            </h2>
            <div className={styles.infoUnderline} />
            <p className={styles.bodyPara}>
              We at AYM provide comfortable accommodation for both our teachers
              and students. All rooms have basic furniture and in-room amenities
              to ensure everyone enjoys comfort.
            </p>
            <p className={styles.bodyPara}>
              The atmosphere and sereneness are nourishing and encourage each to
              grow peacefully.
            </p>
            <p className={styles.bodyPara}>
              You'll also enjoy meals and free wifi connectivity and participate
              in fun nights like Kirtan, movies, etc. Overall, we ensure you'll
              enjoy your stay at AYM.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — CERTIFICATION + SCHEDULE + TESTIMONIAL
      ══════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.sectionDeep}`}
        id="schedule"
      >
        <div className="container px-3 px-md-4">
          {/* Certification */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>
              Our Teacher Training Course Certification
            </h2>
            <div className={styles.cardUnderline} />
            <p className={styles.bodyPara}>
              At AYM, we are the{" "}
              <strong>
                best Ashtanga vinyasa yoga teacher training in Rishikesh
              </strong>{" "}
              and are a Yoga Alliance, USA member. We are traditional in our
              teaching and modern in our approach, making everything easy and
              comfortable for our students. Once you receive your certification,
              you can start your session or career and provide classes in
              different areas.
            </p>

            <h3 className={styles.subHeading}>
              Deepen your Practices and Become Globally Renowned
            </h3>
            <div className={styles.subUnderline} />
            <p className={styles.bodyPara}>
              At AYM, we are your{" "}
              <strong>
                best ashtanga vinyasa yoga teacher training in Rishikesh.
              </strong>{" "}
              We are open to all and for people of all ages and only focus on a
              peaceful and healthy life. Once you experience it, you'll never go
              back. The moment you are certified, you'll be able to impart
              knowledge to others most effectively.
            </p>
          </div>

          {/* ── DATES TABLE — 100HR STYLE ── */}
          <BorderStrip />

          <div className={styles.datesSection}>
            <div className={styles.omDivider}>
              <div className={styles.divLineLeft} />
              <div className={styles.omDividerCenter}>
                <MandalaSVG size={52} c1="#e07b00" c2="#d4a017" sw={0.5} />
                <span className={styles.omDividerLabel}>Upcoming Batches</span>
              </div>
              <div className={styles.divLineRight} />
            </div>

            <div className={styles.datesVintageHeadingWrap}>
              <h2 className={styles.datesVintageHeading}>
                Upcoming Ashtanga Vinyasa Yoga Teacher Training Rishikesh
              </h2>
              <div className={styles.datesVintageHeadingUnderline}>
                <svg
                  viewBox="0 0 200 8"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.headingUndSvg}
                >
                  <path
                    d="M0,4 Q50,0 100,4 Q150,8 200,4"
                    stroke="#e07b00"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <circle cx="100" cy="4" r="3" fill="#e07b00" opacity="0.7" />
                  <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
                  <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
                </svg>
              </div>
            </div>

            <p className={styles.centerSubtext}>
              Choose your preferred accommodation. Prices include tuition and meals.
            </p>

            <div className={styles.tableContainer}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />

              <div className={styles.tableScroll}>
                {loading ? (
                  <p style={{ padding: "2rem", textAlign: "center", fontFamily: "serif", color: "#8b4513" }}>
                    Loading upcoming batches…
                  </p>
                ) : seats.length === 0 ? (
                  <p style={{ padding: "2rem", textAlign: "center", fontFamily: "serif", color: "#8b4513" }}>
                    No upcoming batches available at the moment.
                  </p>
                ) : (
                  <table className={styles.datesTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Fee</th>
                        <th>Fee (Indian)</th>
                        <th>Room Price</th>
                        <th>Seats</th>
                        <th>Apply</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seats.map((row) => {
                        const isFull = row.bookedSeats >= row.totalSeats;
                        return (
                          <tr key={row._id}>
                            <td>
                              <span className={styles.dateCal}>📅</span>{" "}
                              {formatDateRange(row.startDate, row.endDate)}
                            </td>
                            <td>{row.usdFee}</td>
                            <td>{row.inrFee}</td>
                            <td className={styles.roomPriceCell}>
                              Dorm <strong className={styles.priceAmt}>${row.dormPrice}</strong> |{" "}
                              Twin <strong className={styles.priceAmt}>${row.twinPrice}</strong> |{" "}
                              Private <strong className={styles.priceAmt}>${row.privatePrice}</strong>
                            </td>
                            <td>
                              <SeatsCell booked={row.bookedSeats} total={row.totalSeats} />
                            </td>
                            <td>
                              {isFull ? (
                                <span className={styles.applyDisabled}>Apply Now</span>
                              ) : (
                                <a
                                  href={`/yoga-registration?batchId=${row._id}&type=vinyasa`}
                                  className={styles.applyLink}
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
                )}
              </div>

              {seats.find((s) => s.note) && (
                <p className={styles.tableNote}>
                  <strong>Note:</strong> {seats.find((s) => s.note)?.note}
                </p>
              )}

              <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
                <a href="#" className={styles.joinBtn}>
                  🛒 Payments Page
                </a>
              </div>
            </div>
          </div>

          <BorderStrip />

          {/* Testimonial */}
          <div className={`${styles.testimonialBlock} mt-5`}>
            <h2 className={styles.testimTitle}>Testimonial</h2>
            <div className={styles.testimUnderline} />

            <p className={styles.testimIntro}>
              Let's see what Kaori Ueno from Japan experienced during her stay
              at AYM Yoga School:
            </p>

            <div className={styles.testimCard}>
              <div className={styles.quoteIcon}>"</div>
              <blockquote className={styles.quoteText}>
                "Every teachers are very knowledgeable, when student asks
                questions, they always explain a lot, sometimes we couldn't
                understand some English then they explained slowly and clearly.
                Accommodation is very clean and comfortable. I like this place
                which is in the mountain, quiet, we can see downtown and Ganga
                river. But sometimes it's noisy for under construction next
                building during class. Food is so delicious, there have many
                variations, I really enjoy every foods. I want to learn
                vegetarian recipes, and I would like to cook these in my
                country. Staff is very friendly too. Thank you so much for all
                of AYM staff. I learned and practiced so many about yoga. One
                month isn't enough, I want to learn more and more so after I'm
                back to my country, keep learning, practicing yoga."
              </blockquote>
              <div className={styles.testimAuthor}>
                <div className={styles.authorAvatar}>KU</div>
                <div>
                  <p className={styles.authorName}>Kaori Ueno</p>
                  <p className={styles.authorFrom}>from Japan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HowToReach />
    </div>
  );
}
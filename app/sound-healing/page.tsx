"use client";
import React from "react";
import styles from "@/assets/style/sound-healing/Soundhealingpage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Link from "next/link";

/* ─────────────────────────────────────────────────
   All images — verified working Unsplash URLs
───────────────────────────────────────────────── */
const IMG = {
  /* Hero — singing bowl close-up */
  hero: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1400&q=85",

  /* Collage strip — 7 varied wellness / bowl shots */
  c1: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  c2: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&q=80",
  c3: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
  c4: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80",
  c5: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  c6: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  c7: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80",

  /* Three-photo row */
  bowl1: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=85",
  bowl2: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&q=85",
  bowl3: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=85",

  /* Benefits side image */
  benefits: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=85",
};

/* ─── Level cards data ─── */
const levels = [
  {
    title: "Level 1 — 2 Days · 3 Hours/Day",
    items: [
      "Introduction & History of Sound Healing.",
      "How to play the bowls.",
      "Intro Drum Stick, Leather sticks & getting Creative with Sounds.",
      "Intensity of Sound.",
      "Charged water therapy.",
      "Tingsha Aura Cleansing.",
      "Bowl notes, Chakra notes.",
      "Metals used and benefits.",
      "Planet Connection.",
    ],
  },
  {
    title: "Level 2 — 3 Days · 3 Hours/Day",
    items: [
      "Understanding Signals of body.",
      "Sound Healing with intensity.",
      "Group Healing Session.",
      "Hot water Massage.",
      "Stick Massage.",
      "Sounds on herbs & Potli Sound.",
    ],
  },
  {
    title: "Level 3 — 5 Days · 3 Hours/Day",
    items: [
      "Chakra theory & 5 body element.",
      "Chakra balancing.",
      "Diseases therapies.",
      "Body Sound Massage.",
      "Distance Healing.",
      "Gong Therapy, Happy Pan, Rain stick, Shamanic Drum.",
      "Herb information.",
      "Brain Wave theory.",
      "Nada Yoga.",
    ],
  },
];

/* ─── Dummy seat-booking rows — 5 realistic batches ─── */
const scheduleRows = [
  {
    id: "sh-1",
    date: "Every Monday (Ongoing)",
    usdFee: "$100 / $180 / $250",
    inrFee: "₹8,999 / ₹14,999 / ₹19,999",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 20,
    bookedSeats: 6,
    note: "Fees are for Level 1 / Level 2 / Level 3 respectively.",
  },
  {
    id: "sh-2",
    date: "05 May 2025 – 06 May 2025",
    usdFee: "$100 / — / —",
    inrFee: "₹8,999 / — / —",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 15,
    bookedSeats: 10,
    note: "",
  },
  {
    id: "sh-3",
    date: "12 May 2025 – 16 May 2025",
    usdFee: "— / — / $250",
    inrFee: "— / — / ₹19,999",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 12,
    bookedSeats: 5,
    note: "",
  },
  {
    id: "sh-4",
    date: "02 Jun 2025 – 04 Jun 2025",
    usdFee: "— / $180 / —",
    inrFee: "— / ₹14,999 / —",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 10,
    bookedSeats: 10,
    note: "",
  },
  {
    id: "sh-5",
    date: "16 Jun 2025 – 20 Jun 2025",
    usdFee: "$100 / $180 / $250",
    inrFee: "₹8,999 / ₹14,999 / ₹19,999",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 20,
    bookedSeats: 3,
    note: "",
  },
];

/* ══════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════ */

type CornerPos = "tl" | "tr" | "bl" | "br";

function CornerOrnament({ pos }: { pos: CornerPos }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];

  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.shCornerOrn}
      style={{ transform: flip }}
      aria-hidden="true"
    >
      <path d="M2,2 L2,18 M2,2 L18,2" stroke="#b8860b" strokeWidth="1.5" fill="none" />
      <path d="M2,2 Q8,8 16,2 Q8,8 2,16" stroke="#b8860b" strokeWidth="0.7" fill="none" />
      <circle cx="2" cy="2" r="2" fill="#b8860b" opacity="0.7" />
      <circle cx="10" cy="10" r="1.5" fill="#b8860b" opacity="0.4" />
    </svg>
  );
}

function SeatsCell({ booked, total }: { booked: number; total: number }) {
  const isFull = booked >= total;
  const remaining = total - booked;

  if (isFull) {
    return <span className={styles.shFullyBooked}>Fully Booked</span>;
  }

  return (
    <span className={styles.shSeatsAvailable}>
      {remaining} / {total} Seats
    </span>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════ */
export default function SoundHealingPage() {
  return (
    <div className={styles.page}>

      {/* ══ HERO BANNER ══ */}
      <section className={styles.heroBanner}>
        <img
          src={IMG.hero}
          alt="Singing bowl on mandala cloth"
          className={styles.heroImg}
        />
        <div className={styles.heroTextOverlay}>
          <h1 className={styles.heroTitle}>SOUND HEALING COURSE</h1>
        </div>
      </section>

      {/* ══ COLLAGE ROW ══ */}
      <div className={styles.collageRow}>
        {[IMG.c1, IMG.c2, IMG.c3, IMG.c4, IMG.c5, IMG.c6, IMG.c7].map((src, i) => (
          <div key={i} className={styles.collageCell}>
            <img
              src={src}
              alt={`Sound healing session ${i + 1}`}
              className={styles.collageImg}
            />
          </div>
        ))}
      </div>

      {/* ══ INTRO ══ */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>
            Best Sound Healing Therapy Training Courses in Rishikesh, India
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>
          <p className={styles.bodyPara}>
            Are you someone looking for inner peace? Every person has a unique path they take to
            find the inner peace where their true selves reside. The sound healing course is the
            best solution for you. At AYM yoga school, we are the best centers that help you learn
            the best yoga sound healing. Be it self-realization or spiritual explorations. Sound
            healing yoga courses are a way of adding life to your lifestyle. Therefore, today sound
            healing is the growing trend used for healing.
          </p>
        </div>
      </section>

      {/* ══ WHAT IS A SOUND HEALING COURSE ══ */}
      <section className={styles.whatSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>What is a Sound Healing Course?</h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>
          <p className={styles.bodyPara}>
            Sound healing is a process that helps in releasing stress from the body. It has been
            demonstrated to be a successful process as this approach makes it simple to remove
            toxins from the body. The sound healing course relies on vibrational effects to reduce
            physical and mental stress. Overall, it profoundly affects a person's body and soul
            in addition to restoring mental equilibrium.
          </p>
          <div className={styles.levelsGrid}>
            {levels.map((lv) => (
              <div key={lv.title} className={styles.levelCard}>
                <h3 className={styles.levelTitle}>{lv.title}</h3>
                <ol className={styles.levelList}>
                  {lv.items.map((item, idx) => (
                    <li key={idx} className={styles.levelItem}>
                      {idx + 1}. {item}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3-PHOTO ROW + AIM ══ */}
      <section className={styles.aimSection}>
        <div className={styles.triPhotoRow}>
          {[IMG.bowl1, IMG.bowl2, IMG.bowl3].map((src, i) => (
            <div key={i} className={styles.triPhotoCell}>
              <img
                src={src}
                alt={`Sound healing bowl ${i + 1}`}
                className={styles.triPhotoImg}
              />
            </div>
          ))}
        </div>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>What Does Sound Healing Aim at?</h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>
          <p className={styles.bodyPara}>
            Stress is a major reason behind every toxicity and negativity. And this is what yoga
            sound healing course aims at. It helps in improving the health and well-being of a
            person. Used over the years, it has successfully achieved a place in the modern industry.
          </p>
          <p className={styles.bodyPara}>
            Sound healing aims to restore the body's natural frequencies and to cure humanity.
            Therefore, keeping in mind the well-being of humans and how badly stress can affect
            their lives, we at AYM have come up with a sound healing course in Rishikesh.
          </p>
        </div>
      </section>

      {/* ══ BENEFITS ══ */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>
            What are the Benefits of a Sound Healing Course?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitsText}>
              <p className={styles.bodyPara}>
                Why is sound healing so popular among youths? Sound healing has been growing,
                especially because of the benefits it offers — physical, mental, and emotional.
                Here are the most highly recognised benefits of our Sound Healing Courses in
                Rishikesh:
              </p>
              <p className={styles.bodyPara}>
                <strong>Relaxing :</strong> One of the greatest benefits of sound healing is deep
                relaxation. The noises penetrate our system, which as a result, helps in restoring
                it to balance.
              </p>
              <p className={styles.bodyPara}>
                <strong>Eliminates Energetic Blockages :</strong> The music's vibrations heal,
                open, clear, and balance the chakras before releasing trapped energy — acting as a
                deep tissue massage for the soul.
              </p>
              <p className={styles.bodyPara}>
                <strong>Improves Lifestyle :</strong> Be it depression, anxiety, or tension — all
                are decreased by sound healing. It restores mental equilibrium and clarity,
                resulting in a greater sensation of well-being and tranquillity.
              </p>
              <p className={styles.bodyPara}>
                <strong>Improves Health :</strong> All are improved with sound healing — from
                better sleep and lowered cholesterol to a decrease in chronic pain, blood pressure,
                and a lower risk of heart disease.
              </p>
            </div>
            <div className={styles.benefitsImgWrap}>
              <img
                src={IMG.benefits}
                alt="Sound healing teacher with bowls"
                className={styles.benefitsImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXPECT + WHY JOIN + SEAT BOOKING ══ */}
      <section className={styles.expectSection}>
        <div className={styles.container}>

          <h2 className={styles.secTitleOrange}>
            What can you Expect at AYM for Sound Healing Teacher Training Course?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>
          <p className={styles.bodyPara}>
            When looking for the best sound healing training course, you'll surely come across
            the Association for Yoga and Meditation. Whether you have past experience or are new
            in this field, you can acquire full knowledge and different forms of sound healing
            training courses.
          </p>
          <p className={styles.bodyPara}>
            We place a lot of emphasis during training sessions on students deepening their own
            practice. Our 3-day and 7-day programs will advance your knowledge of sound healing,
            cultivate your skills, and help you create your distinctive teaching methods.
          </p>
          <p className={styles.bodyPara}>
          Our team at AYM collaborates to train students to the point where they can develop self-deepened evaluation skills and self-assessing abilities to gauge the effectiveness of instructional strategies. Our 3 days course and 7 days program will advance your knowledge of sound healing, cultivate your sound healing skills, and help you create your distinctive teaching methods.
          </p>
           <p className={styles.bodyPara}>
         From regular listening to the sonic sound waves, sound healing instruments, sound healing therapy, drums, magnets, gong, and sound baths to every sound therapy treatment, you can expect to learn everything about AYM.
          </p>
           <p className={styles.bodyPara}>
        All our teachers are highly skilled, reputed, and trained to teach students in the best possible ways. Our sessions are effective and performed in a friendly environment. We also offer meals and other top-notch amenities at an additional cost.
          </p>

          <h2 className={styles.secTitleOrange} style={{ marginTop: "2.8rem" }}>
            Why Should You Join AYM?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>
          <p className={styles.bodyPara}>
           With so many availabilities of sound healing and YTT center, wondering why you should join AYM. We at the Association for Yoga and Meditation are the best choice for students. We offer licensed sound healing yoga training courses at affordable prices.
          </p>
          <p className={styles.bodyPara}>
           Students who successfully complete the 500-hour yoga TTC program will receive a certificate from Yoga Alliance, USA. Thanks to our YTT certification in international yoga certification, that helps students not only appreciate their abilities but also allows them to start their own journey immediately right after the completion of their course.
          </p>

          {/* ════════════════════════════════════
              SEAT BOOKING — Vintage 100hr Design
          ════════════════════════════════════ */}
          <div className={styles.shOmDivider} style={{ marginTop: "2.8rem" }}>
            <div className={styles.shDivLineLeft} />
            <div className={styles.shDivCenter}>
              <span className={styles.shDivLabel}>Upcoming Batches</span>
            </div>
            <div className={styles.shDivLineRight} />
          </div>

          <div className={styles.shHeadingWrap}>
            <h2 className={styles.shHeading}>
              Availability Of Sound Healing Program — 2026
            </h2>
            <div className={styles.shHeadingUnderline}>
              <svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" className={styles.shHeadingUndSvg}>
                <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#e07b00" strokeWidth="1.2" fill="none" />
                <circle cx="100" cy="4" r="3"   fill="#e07b00" opacity="0.7" />
                <circle cx="10"  cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
                <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
              </svg>
            </div>
          </div>

          <p className={styles.shCenterSubtext}>
            Choose your preferred level &amp; accommodation. Prices include tuition and meals.
          </p>

          <div className={styles.shTableContainer}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />

            <div className={styles.shTableScroll}>
              <table className={styles.shDatesTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Fee</th>
                    <th>Fee ( Indian )</th>
                    <th>Room Price</th>
                    <th>Seats</th>
                    <th>Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((row) => {
                    const isFull = row.bookedSeats >= row.totalSeats;
                    return (
                      <tr key={row.id}>
                        <td>
                          <span className={styles.shDateCal}>📅</span>{" "}
                          {row.date}
                        </td>
                        <td>{row.usdFee}</td>
                        <td>{row.inrFee}</td>
                        <td className={styles.shRoomPriceCell}>
                          Shared{" "}
                          <strong className={styles.shPriceAmt}>₹{row.roomPrice.shared}</strong>
                          {" | "}Twin{" "}
                          <strong className={styles.shPriceAmt}>₹{row.roomPrice.twin}</strong>
                          {" | "}Private{" "}
                          <strong className={styles.shPriceAmt}>₹{row.roomPrice.private}</strong>
                        </td>
                        <td>
                          <SeatsCell booked={row.bookedSeats} total={row.totalSeats} />
                        </td>
                        <td>
                          {isFull ? (
                            <span className={styles.shApplyDisabled}>Apply Now</span>
                          ) : (
                            <Link
                              href="/yoga-registration?type=sound-healing"
                              className={styles.shApplyLink}
                            >
                              Apply Now
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {scheduleRows.find((s) => s.note) && (
              <p className={styles.shTableNote}>
                <strong>Note:</strong> {scheduleRows.find((s) => s.note)?.note}
              </p>
            )}

            <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
              <Link href="/sound-healing" className={styles.shJoinBtn}>
                Book Your Sound Healing Journey
              </Link>
            </div>
          </div>
          {/* ══ END SEAT BOOKING ══ */}

        </div>
      </section>

      <div className={styles.bottomBorder} />
      <HowToReach />
    </div>
  );
}
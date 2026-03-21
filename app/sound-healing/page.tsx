"use client";
import React from "react";
import styles from "@/assets/style/sound-healing/Soundhealingpage.module.css";
import HowToReach from "@/components/home/Howtoreach";

/* ─────────────────────────────────────────────────
   Unsplash image URLs — free, embeddable
───────────────────────────────────────────────── */
const IMG = {
  // Hero — singing bowls on colourful mandala cloth
  hero: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1400&q=85",

  // Collage row (7 images)
  c1: "https://images.unsplash.com/photo-1591030617004-2e6acc8cd6f2?w=400&q=80",
  c2: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  c3: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&q=80",
  c4: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&q=80",
  c5: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80",
  c6: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
  c7: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&q=80",

  // Three-photo row (Screenshot 3)
  bowl1: "https://images.unsplash.com/photo-1591030617004-2e6acc8cd6f2?w=600&q=85",
  bowl2: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?w=600&q=85",
  bowl3: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&q=85",

  // Benefits side image (Screenshot 4)
  benefits: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=700&q=85",
};

/* ─── Level cards data ─── */
const levels = [
  {
    title: "Level 1 - 2 Day - 3 Hours/Day",
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
    title: "Level 2 - 3 Day - 3 Hours/Day",
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
    title: "Level 3 - 5 Day - 3 Hours/Day",
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

/* ─── Schedule table data ─── */
const scheduleRows = [
  {
    date: "Starts on Every Monday",
    l1: "$100 / 8,999 INR",
    l2: "$180 / 14,999 INR",
    l3: "$250 / 19,999 INR",
    avail: "Available",
  },
];


export default function SoundHealingPage() {
  return (
    <div className={styles.page}>

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO BANNER  (Screenshot 1 top)
      ══════════════════════════════════════════ */}
      <section className={styles.heroBanner}>
        <img src={IMG.hero} alt="Sound Healing bowls on mandala cloth" className={styles.heroImg} />
        <div className={styles.heroTextOverlay}>
          <h1 className={styles.heroTitle}>SOUND HEALING COURSE</h1>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COLLAGE ROW  (Screenshot 1 middle)
      ══════════════════════════════════════════ */}
      <div className={styles.collageRow}>
        {[IMG.c1, IMG.c2, IMG.c3, IMG.c4, IMG.c5, IMG.c6, IMG.c7].map((src, i) => (
          <div key={i} className={styles.collageCell}>
            <img src={src} alt={`Sound healing session ${i + 1}`} className={styles.collageImg} />
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          INTRO HEADING + PARA  (Screenshot 1 bottom)
      ══════════════════════════════════════════ */}
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
            Are you someone looking for inner peace? Every person has a unique path they take to find
            the inner peace where their true selves reside. The sound healing course is the best
            solution for you. At AYM yoga school, we are the best centers that help you learn the
            best yoga sound healing. Be it self-realization or spiritual explorations. Sound healing
            yoga courses are a way of adding life to your lifestyle. Therefore, today sound healing
            is the growing trend used for healing.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — WHAT IS A SOUND HEALING COURSE
          (Screenshot 2)
      ══════════════════════════════════════════ */}
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
            demonstrated to be a successful process as this approach makes it simple to remove toxins
            from the body. The sound healing course relies on vibrational effects to reduce physical
            and mental stress. Overall, it profoundly affects a person's body and soul in addition to
            restoring mental equilibrium.
          </p>

          {/* Three level cards */}
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

      {/* ══════════════════════════════════════════
          SECTION 3 — 3-PHOTO ROW + WHAT DOES SOUND HEALING AIM AT
          (Screenshot 3)
      ══════════════════════════════════════════ */}
      <section className={styles.aimSection}>
        {/* Three bordered photos */}
        <div className={styles.triPhotoRow}>
          {[IMG.bowl1, IMG.bowl2, IMG.bowl3].map((src, i) => (
            <div key={i} className={styles.triPhotoCell}>
              <img src={src} alt={`Sound healing bowl ${i + 1}`} className={styles.triPhotoImg} />
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
            Stress is a major reason behind every toxicity and negativity. And this is what yoga sound
            healing course aims at. It helps in improving the health and well-being of a person. Used
            over the years, it has successfully achieved a place in the modern industry.
          </p>
          <p className={styles.bodyPara}>
            Sound healing aims to restore the body's natural frequencies and to cure humanity.
            Therefore, keeping in mind the well-being of humans and how badly stress can affect their
            lives, we at AYM have come up with a sound healing course in rishikesh.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — BENEFITS  (Screenshot 4)
      ══════════════════════════════════════════ */}
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
            {/* Left — text */}
            <div className={styles.benefitsText}>
              <p className={styles.bodyPara}>
                Why is sound healing so popular among youths? Sound healing has been growing,
                especially because of the benefits it offers, both physical and mental and emotional.
                However here are the most highly recognized benefits of sound healing courses
                rishikesh:
              </p>

              <p className={styles.bodyPara}>
                <strong>Relaxing :</strong> One of the greatest benefits of sound healing is deep
                relaxation. The noises penetrate our system, which as a result, helps in restoring
                it to balance. Even on its own, a sound healing session can be extremely relaxing.
                At the Association for Yoga and Meditation, you could use relaxed energy with our
                hectic schedules.
              </p>

              <p className={styles.bodyPara}>
                <strong>Eliminates Energetic Blockages</strong>Another benefit of enrolling in a
                sound healing training certification course is that it helps eliminate energetic
                blockages. The music's vibrations heal and open, clear, and balance the chakras
                before releasing trapped energy. Overall, it acts as a deep tissue massage that
                rejuvenates you and your inner soul.
              </p>

              <p className={styles.bodyPara}>
                <strong>Improves Lifestyle :</strong> Be it mental, emotional or physical, sound
                healing helps improve overall lifestyle. Simply put, this technique is therapeutic.
                Be it depression, anxiety, or tension, and all are decreased by sound healing. It
                restores mental equilibrium and clarity, resulting in a greater sensation of
                enjoyment, well-being, and tranquillity.
              </p>

              <p className={styles.bodyPara}>
                <strong>Improves Health :</strong> All are improved with sound healing, from better
                sleep, lowered cholesterol levels, and a decrease in chronic pain and blood pressure
                to a lower risk of heart disease. However, make sure to make an appointment with a
                licensed medical professional to receive professional assistance with these
                conditions. We are the best registered sound healing course provider at AYM so you
                can expect the best classes with us.
              </p>
            </div>

            {/* Right — image */}
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

      {/* ══════════════════════════════════════════
          SECTION 5 — EXPECT + WHY JOIN + SCHEDULE
          (Screenshot 5)
      ══════════════════════════════════════════ */}
      <section className={styles.expectSection}>
        <div className={styles.container}>

          {/* What can you Expect */}
          <h2 className={styles.secTitleOrange}>
            What can you Expect at AYM for Sound Healing Teacher Training Course?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>

          <p className={styles.bodyPara}>
            When looking for the best sound healing training course near me, you'll surely come
            across the Association for Yoga and Meditation. This is because we top the list. Whether
            you've past experience or are new in this field, you can acquire full knowledge and
            different forms of sound healing training courses.
          </p>
          <p className={styles.bodyPara}>
            We place a lot of emphasis during training sessions on students deepening their own
            practice and making any necessary adjustments to their postures.
          </p>
          <p className={styles.bodyPara}>
            Our team at AYM collaborates to train students to the point where they can develop
            self-deepened evaluation skills and self-assessing abilities to gauge the effectiveness
            of instructional strategies. Our 3 days course and 7 days program will advance your
            knowledge of sound healing, cultivate your sound healing skills, and help you create
            your distinctive teaching methods.
          </p>
          <p className={styles.bodyPara}>
            From regular listening to the sonic sound waves, sound healing instruments, sound
            healing therapy, drums, magnets, gong, and sound baths to every sound therapy
            treatment, you can expect to learn everything about AYM.
          </p>
          <p className={styles.bodyPara}>
            All our teachers are highly skilled, reputed, and trained to teach students in the best
            possible ways. Our sessions are effective and performed in a friendly environment. We
            also offer meals and other top-notch amenities at an additional cost.
          </p>

          {/* Why Should You Join AYM */}
          <h2 className={styles.secTitleOrange} style={{ marginTop: "2.8rem" }}>
            Why Should You Join AYM?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>

          <p className={styles.bodyPara}>
            With so many availabilities of sound healing and YTT center, wondering why you should
            join AYM. We at the Association for Yoga and Meditation are the best choice for
            students. We offer licensed sound healing yoga training courses at affordable prices.
          </p>
          <p className={styles.bodyPara}>
            Students who successfully complete the 500-hour yoga TTC program will receive a
            certificate from Yoga Alliance, USA. Thanks to our YTT certification in international
            yoga certification, that helps students not only appreciate their abilities but also
            allows them to start their own journey immediately right after the completion of their
            course.
          </p>

          {/* Availability table */}
          <h2 className={styles.secTitleOrange} style={{ marginTop: "2.8rem" }}>
            Availability Of Sound Healing Program - 2025
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.schedTable}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>LEVEL 1 ( 2 DAYS – COURSE FEE )</th>
                  <th>LEVEL 2 ( 3 DAYS – COURSE FEE )</th>
                  <th>LEVEL 3 ( 5 DAYS – COURSE FEE )</th>
                  <th>AVAILABILITY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Starts on Every Monday</td>
                  <td>$100 / 8,999 INR</td>
                  <td>$180 / 14,999 INR</td>
                  <td>$250 / 19,999 INR</td>
                  <td className={styles.availCell}>Available</td>
                </tr>
                <tr className={styles.bookRow}>
                  <td><strong>Book Your Spot</strong></td>
                  <td>Register your spot</td>
                  <td>by Paying $55 only / 3,000 INR</td>
                  <td>
                    <a href="#" className={styles.paymentBtn}>
                      💳 Payment Option Page
                    </a>
                  </td>
                  <td>
                    <a href="#" className={styles.bookNowBtn}>Book Now</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* BOTTOM BORDER */}
      <div className={styles.bottomBorder} />
<HowToReach/>
    </div>
  );
}
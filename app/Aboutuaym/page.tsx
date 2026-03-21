"use client";

import React from "react";
import Image from "next/image";
import styles from "@/assets/style/Aboutaym/Aboutus.module.css";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/27.webp";
// ── DATA ─────────────────────────────────────────────────────────
const objectives = [
  "Establishment of yoga study centers in India and abroad.",
  "Developing standards for yoga teacher training programs and assisting other schools.",
  "Leading and integrating spiritual communities and yoga schools in India.",
  "Promotion of research in yoga and yoga institutes in India.",
];

const OmDivider = () => (
  <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
);

// ── COMPONENT ────────────────────────────────────────────────────
const AboutUs: React.FC = () => {
  return (
    <main className={styles.page}>

      {/* ══════════════════════════════════════
          BLOCK 1 — Yoga School in India
      ══════════════════════════════════════ */}
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
      <section className={styles.schoolSection}>
        <div className={styles.container}>

          {/* Heading */}
          <header className={styles.blockHeader}>
            <h1 className={styles.blockTitle}>Yoga School in India</h1>
             <OmDivider/>
          </header>

          {/* Logo badge */}
          <div className={styles.logoWrap}>
            <div className={styles.logoBadge}>
              {/* Replace with actual logo: <Image src="/images/aym-logo.png" alt="AYM Logo" width={120} height={120} /> */}
              <div className={styles.logoFallback}>
                <span className={styles.logoAbbr}>AYM</span>
                <span className={styles.logoFull}>ASSOCIATION FOR<br />YOGA &amp; MEDITATION</span>
                <span className={styles.logoIndia}>✦ INDIA ✦</span>
              </div>
            </div>
          </div>

          {/* Body text */}
          <div className={styles.schoolBody}>
            <p className={styles.para}>
              Association for Yoga and Meditation (AYM) Yoga School in Rishikesh is a non-profit
              organization registered with the government of India. Spiritual Master{" "}
              <strong>Yogi Chetan Mahesh</strong> leads the school. It was founded by famous Indian
              yogis in 2005. We aim to spread happiness and health through traditional and ancient
              yogic wisdom.
            </p>
            <p className={styles.para}>
              AYM Yoga School is a true spiritual yoga Ashram, lying 1 km away from the holy banks
              of Mother Ganga and in the lap of the lush green Himalayas. It is the largest yoga
              school in Rishikesh, providing yoga and meditation to its thousands of spiritual
              pilgrims from all corners of the Earth. With over 100 rooms, the facilities perfectly
              blend modern amenities with a traditional, spiritual feel and comfort.
            </p>
          </div>

          {/* Gallery — replace divs with <Image> in production */}
          <div className={styles.gallery}>
            <div className={`${styles.galleryCard} ${styles.galleryCardMain}`}>
              {/* <Image src="/images/aym-campus.jpg" alt="AYM Yoga School Campus" fill style={{objectFit:'cover'}} /> */}
              <div className={styles.galleryFill} data-label="AYM Yoga School — Campus" />
            </div>
            <div className={styles.galleryCard}>
              {/* <Image src="/images/aym-hall.jpg" alt="Yoga Practice Hall" fill style={{objectFit:'cover'}} /> */}
              <div className={styles.galleryFill} data-label="Yoga Practice Hall" />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          BLOCK 2 — Vision and Mission
      ══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.container}>

          <header className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>Vision and Mission</h2>
          
             <OmDivider/>
           
          </header>

          <div className={styles.prose}>
            <p className={styles.para}>
              AYM YOGA SCHOOL in Rishikesh has a vision of training highly trained teachers with deep
              knowledge and understanding of yoga. The primary focus of AYM is to train qualified yoga
              teachers who can spread yoga&apos;s benefits to society. We also have a mission to remove
              anxiety and depression from modern society. Additionally, we focus on healing personal and
              family problems by practising simple, authentic, and traditional yoga.
            </p>
            <p className={styles.para}>
              AYM Yoga training is based on classical teaching styles: asana, pranayama, meditation,
              stress management and detoxification techniques. AYM invites everyone to experience and
              realize the real meaning of yoga by understanding its simple, integrated and holistic
              techniques.
            </p>
            <p className={styles.para}>
              We want you to achieve health, harmony, and happiness while discovering your hidden
              potential. AYM aims to bring out human excellence at personal, professional, social and
              spiritual levels through Raja yoga, Karma yoga, Bhakti yoga, Jayana yoga, and Hatha
              yoga&apos;s Tantric culture.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          BLOCK 3 — Aims and Objectives
      ══════════════════════════════════════ */}
      <section className={`${styles.contentSection} ${styles.altBg}`}>
        <div className={styles.container}>

          <header className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>Aims and Objectives of AYM India</h2>
          
               <OmDivider/>
          
          </header>

          <div className={styles.prose}>
            <p className={styles.para}>
              The AYM YOGA SCHOOL aims to spread yoga through TTC education and specialized yoga
              classes in India. Our main objectives are:
            </p>

            <ol className={styles.objList}>
              {objectives.map((obj, i) => (
                <li key={i} className={styles.objItem}>
                  <span className={styles.objNum}>{i + 1}.</span>
                  <span className={styles.objText}>{obj}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          BLOCK 4 — History of AYM
      ══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.container}>

          <header className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>History of AYM</h2>
           
              <OmDivider/>
           
          </header>

          <div className={styles.prose}>
            <p className={styles.para}>
              In September 2005, it became apparent that a standard for yoga teacher training at the
              national level (in India) was necessary. Yogi Chetan Mahesh and other well-known yoga
              experts and great yoga Gurus decided to make a foundation to solve the matter. They
              registered an organization named{" "}
              <em>&apos;The Association for Yoga and Meditation&apos;</em> with the government of India.
            </p>
            <p className={styles.para}>
              The AYM YOGA SCHOOL in Rishikesh and other training institutes follow traditional and
              ancient yoga practices with a scientific approach. In 2005, AYM Yoga School of India also
              got the status as a National Organization of India and became a member of the (IYF)
              International Yoga Federation. AYM also sets standards for yoga study centres in India
              according to the IYF guidelines.
            </p>
            <p className={styles.para}>
              Graduates from AYM can register at IYF and the Yoga Alliance USA. National yoga
              associations organize yoga activities and sports nationally in most countries. The winners
              of national-level sports activities in India can be represented at international levels by
              IYF. In 2006, AYM passed a resolution to establish an administering body to maintain the
              international standards of yoga in the name of the Indian Yoga Alliance (IYA).
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          BLOCK 5 — Activities
      ══════════════════════════════════════ */}
      <section className={`${styles.contentSection} ${styles.altBg} ${styles.altBg2}`}>
        <div className={styles.container}>

          <header className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>Activities</h2>
          
              <OmDivider/>
         
          </header>

          <div className={styles.prose}>
            <p className={styles.para}>
              Association for Yoga and Meditation (AYM) is a national educational organization in India
              that popularises and promotes yoga education in its original and traditional form. To
              develop, promote, and integrate yoga, the Association for Yoga and Meditation set and
              followed the standards for teaching, training, and development of yoga.
            </p>
          </div>

        </div>
      </section>
<HowToReach/>
    </main>
  );
};

export default AboutUs;
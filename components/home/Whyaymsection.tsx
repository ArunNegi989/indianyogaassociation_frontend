'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../../assets/style/Home/Whyaymsection.module.css';
import Image from "next/image";
import image1 from '../../assets/images/certification-yoga-course-in-rishikesh-india.jpg'

interface Feature {
  title: string;
  desc: string;
}

const sideFeatures: Feature[] = [
  {
    title: 'The most experienced yoga teachers:',
    desc: "The main foundation of yoga teachers' training is laid by the wisdom imparted by the teachers and their mentorship. We have a team of the most experienced teachers in each major of the yoga teacher training curriculum. Our passionate and nurturing teachers make it easy for them to learn yoga at our yoga school.",
  },
  {
    title: 'The most experienced yoga school:',
    desc: 'Our school has been recognized for over 25 years for its comprehensive yoga training programs in Rishikesh and Goa, India. Our school employs both traditional and modern approaches to impart structured and authentic yoga training to our yogis.',
  },
  {
    title: 'Developed yoga curriculum:',
    desc: 'Research is a key aspect of any development in any field. Our yoga school in India is continuously developing its curriculum, teaching methodology, infrastructure, and classroom experience as a whole. Following this approach, our trainees find it easier to learn and grasp concepts more quickly compared to other trainees of other similar yoga institutions.',
  },
  {
    title: 'Most graduate students:',
    desc: 'We established our yoga teacher training center in Rishikesh, India, in 2000, and since then, more than 15,000 yogis have graduated from our 200-hour and 300-hour yoga courses in Rishikesh and Goa.',
  },
  
];

const bottomFeatures: Feature[] = [
    {
    title: 'Authentic, traditional, and holistic approach:',
    desc: 'We are committed to provide authentic, traditional, and original teachings of yoga as it is found in ancient yoga textbooks and with yogis of the Himalayas. We use a holistic and scientific approach in our yoga studio in rishikesh India. We do not just teach physical postures, but all components of yoga, so that a holistic personality develops after completing yoga training.',
  },
  {
    title: 'Most affordable:',
    desc: "Our school fee is the most affordable for joining our yoga teacher training course worldwide, while maintaining all standards, amenities, and quality of life. Many of our graduates appreciated this. Additionally, our mission is to bring yoga to everyone, and affordability enables us to reach millions.",
  },
    
  {
    title: 'Top-rated Accreditation and certification:',
    desc: 'There are many yoga schools and institutions in Rishikesh, but AYM Yoga Institute is the only one in Rishikesh that is recognized by the Yoga Certification Board of the Government of India. We have also been internationally recognised by the Yoga Alliance USA and worldwide yoga alliances since 2005. Our graduates get internationally recognised certification in rishikesh India, which they can enroll to get RYT 200 hours, RYT 300 or RYT 500 hours at Yoga Alliance, USA.',
  },
  {
    title: 'Yoga community - worldwide AYM family:',
    desc: 'AYM yoga community is a Global family of yoga practitioners and yoga teachers who graduate from AYM yoga school and share their innovative teaching and experiences on this platform. It helps to grow and get feedback, and assists the incoming graduates.',
  },
];

export const WhyAYMSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(`.${styles.fadeUp}`);
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.fadeUpVisible);
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>

      {/* ── Animated background Om & Swastik ── */}
      <div className={styles.bgLayer} aria-hidden="true">
        <span className={`${styles.bg} ${styles.bg1}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg2}`}>卐</span>
        <span className={`${styles.bg} ${styles.bg3}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg4}`}>卐</span>
        <span className={`${styles.bg} ${styles.bg5}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg6}`}>卐</span>
        <span className={`${styles.bg} ${styles.bg7}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg8}`}>卐</span>
      </div>

      {/* ── Top decorative border ── */}
      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ── Header ── */}
        <div className={`${styles.header} ${styles.fadeUp}`}>
          <p className={styles.superTitle}>Yoga Teacher Training in Rishikesh</p>
          <h2 className={styles.mainTitle}>
            What Makes AYM Yoga School Different from Other
            Yoga Schools in Rishikesh, India?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
          <p className={styles.introPara}>
            Namaste, yoga lovers! AYM Yoga School stands out among Rishikesh&apos;s yoga schools
            for its commitment to authentic teaching, experienced instructors, and a welcoming
            environment. Let&apos;s discuss what makes it special.
          </p>
        </div>

        {/* ── Image + Side Features ── */}
        <div className={styles.body}>

          {/* Left — Image */}
          <div className={`${styles.imageCol} ${styles.fadeUp}`}>
            <div className={styles.imageWrap}>
              <div className={styles.imageFrame}>
                <Image
                  src={image1}
                  alt="AYM Yoga School certified student"
                  className={styles.heroImg}
                  width={600}
                  height={400}
                />
              </div>
              {/* Floating badge */}
              <div className={styles.imgBadge}>
                <span className={styles.imgBadgeOm}>ॐ</span>
                <span className={styles.imgBadgeYear}>Est. 2005</span>
              </div>
              {/* Quote below image */}
              <blockquote className={styles.imgQuote}>
                <span className={styles.qMark}>&ldquo;</span>
                Where Ancient Yoga Lives &amp; Transforms Lives
                <span className={styles.qMark}>&rdquo;</span>
              </blockquote>
            </div>
          </div>

          {/* Right — Features */}
          <div className={styles.featuresCol}>
            {sideFeatures.map((f, i) => (
              <div
                key={i}
                className={`${styles.featureItem} ${styles.fadeUp}`}
                style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
              >
                <span className={styles.featureOm} aria-hidden="true">ॐ</span>
                <p className={styles.featureText}>
                  <strong className={styles.featureTitle}>{f.title}</strong>{' '}
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ornament divider ── */}
        <div className={styles.midDivider}>
          <span className={styles.dividerLine} />
          <span className={styles.midPattern}>✦ 卐 ✦ ॐ ✦ 卐 ✦</span>
          <span className={styles.dividerLine} />
        </div>

        {/* ── Bottom full-width features ── */}
        <div className={styles.bottomFeatures}>
          {bottomFeatures.map((f, i) => (
            <div
              key={i}
              className={`${styles.bottomItem} ${styles.fadeUp}`}
              style={{ '--d': `${i * 0.1}s` } as React.CSSProperties}
            >
              <span className={styles.featureOm} aria-hidden="true">卐</span>
              <p className={styles.featureText}>
                <strong className={styles.featureTitle}>{f.title}</strong>{' '}
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* ── Bottom decorative border ── */}
      <div className={styles.bottomBorder} />

    </section>
  );
};

export default WhyAYMSection;
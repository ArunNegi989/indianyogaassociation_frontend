'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../../assets/style/Home/Classcampusamenities.module.css';
import rightsectionimage from '../../assets/images/aym-class-size.webp';

const amenities = [
  'Accommodation ( Private / Shared / Dormitory )',
  'Spacious yoga hall',
  'Free Wi-Fi',
  'Lush Garden area',
  'Hot / Cold water 24x7',
];

const campusImages = [
  'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=500&q=80',  // yoga group outdoor
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',  // meditation pose
  'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80',  // yoga class
  'https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&q=80',     // yoga studio
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80',  // yoga practice
  'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=500&q=80',  // nature/meditation
];

const amenityImages = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=90',
  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=85',
  'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=85',
];

const fallbackImages = [
  'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
  'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&q=80',
  'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=400&q=80',
  'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
];

export const ClassCampusAmenities: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(`.${styles.reveal}`);
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.revealed);
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>

      {/* ── Animated BG symbols ── */}
      <div className={styles.bgLayer} aria-hidden="true">
        <span className={`${styles.bg} ${styles.bg1}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg2}`}>卐</span>
        <span className={`${styles.bg} ${styles.bg3}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg4}`}>卐</span>
        <span className={`${styles.bg} ${styles.bg5}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg6}`}>卐</span>
      </div>

      {/* ── Top border ── */}
      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ══════════════════════════════
            ROW 1 — CLASS SIZE + CAMPUS
        ══════════════════════════════ */}
        <div className={styles.topRow}>

          {/* ── AYM CLASS SIZE ── */}
          <div className={`${styles.classBlock} ${styles.reveal}`}>
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>Small Batches · Personal Attention</p>
              <h2 className={styles.blockTitle}>AYM CLASS SIZE</h2>
              <div className={styles.titleBar} />
            </div>

            <div className={styles.classImgWrap}>
              <div className={styles.classImgFrame}>
                {/* ✅ FIXED: rightsectionimage.src — webp static import ke liye */}
                <img
                  src={rightsectionimage.src}
                  alt="AYM Yoga Class Group"
                  className={styles.classImg}
                />
                <div className={styles.classImgOverlay}>
                  <span className={styles.welcomeScript}>Welcome to AYM Family</span>
                </div>
                <span className={styles.cornerTL} aria-hidden="true" />
                <span className={styles.cornerBR} aria-hidden="true" />
              </div>
            </div>

            <p className={styles.blockPara}>
              At AYM, only <strong className={styles.highlight}>25 students</strong> are admitted
              in one batch. The class size is consciously kept low to focus individual attention
              and seamless interactions between the faculty and students. We believe in creating
              a pleasant and safe environment for everyone to interact and learn from one another
              under the guidance of our knowledgeable yogis.
            </p>
          </div>

          {/* Vertical Ornament Divider */}
          <div className={styles.vertDivider} aria-hidden="true">
            <span className={styles.vertLine} />
            <span className={styles.vertOm}>ॐ</span>
            <span className={styles.vertLine} />
          </div>

          {/* ── AYM YOGA CAMPUS ── */}
          <div
            className={`${styles.campusBlock} ${styles.reveal}`}
            style={{ '--d': '0.15s' } as React.CSSProperties}
          >
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>5000 sq.mts. · Rishikesh</p>
              <h2 className={styles.blockTitle}>AYM YOGA CAMPUS</h2>
              <div className={styles.titleBar} />
            </div>

            {/* Campus mosaic */}
            <div className={styles.campusGrid}>
              <div className={styles.campusCenterCard}>
                <p className={styles.celebrating}>CELEBRATING</p>
                <p className={styles.theLife}>the life</p>
                <p className={styles.withText}>WITH</p>
                <p className={styles.schoolName}>AYM YOGA SCHOOL</p>
              </div>
              {campusImages.map((src, i) => (
                <div key={i} className={styles.campusThumb}>
                  <img
                    src={src}
                    alt={`Campus ${i + 1}`}
                    className={styles.campusThumbImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImages[i];
                    }}
                  />
                </div>
              ))}
            </div>

            <p className={styles.blockPara}>
              Spread across an expansive{' '}
              <strong className={styles.highlight}>5000 sq.mts.</strong>, the AYM campus is one
              of the lushest campuses in Rishikesh. The spacious and vast gardens maintain a
              peaceful ambience to learn, relax and rejuvenate in the lap of nature. On a site
              that feels so sacred, learning Rishikesh Yoga is a blissful experience.
            </p>
          </div>
        </div>

        {/* ── Section ornament separator ── */}
        <div className={styles.midOrnament}>
          <span className={styles.ornLine} />
          <span className={styles.ornPattern}>✦ 卐 ✦ ॐ ✦ 卐 ✦</span>
          <span className={styles.ornLine} />
        </div>

        {/* ══════════════════════════════
            ROW 2 — AMENITIES
        ══════════════════════════════ */}
        <div className={styles.amenitiesRow}>

          {/* Left — text */}
          <div className={`${styles.amenitiesLeft} ${styles.reveal}`}>
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>Comfort · Nature · Serenity</p>
              <h2 className={styles.amenitiesTitle}>AMENITIES</h2>
              <div className={styles.titleBar} />
            </div>

            <p className={styles.amenPara}>
              Students have fully furnished rooms amid lush gardens at this{' '}
              <strong className={styles.highlight}>yoga teacher training school</strong>. You
              can opt for private rooms or shared accommodation in a dormitory setup in a
              peaceful environment.
            </p>

            <p className={styles.blockParaSm}>Other amenities include:</p>

            <ul className={styles.amenityList}>
              {amenities.map((item, i) => (
                <li
                  key={i}
                  className={`${styles.amenityItem} ${styles.reveal}`}
                  style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
                >
                  <span className={styles.bullet} aria-hidden="true">ॐ</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — image mosaic */}
          <div
            className={`${styles.amenitiesRight} ${styles.reveal}`}
            style={{ '--d': '0.12s' } as React.CSSProperties}
          >
            <div className={styles.amenityMosaic}>
              <div className={styles.mosaicMain}>
                <img
                  src={amenityImages[0]}
                  alt="Furnished Room"
                  className={styles.mosaicImg}
                />
                <div className={styles.mosaicMainOverlay}>
                  <span className={styles.mosaicTag}>Furnished Rooms</span>
                </div>
              </div>
              <div className={styles.mosaicSide}>
                {amenityImages.slice(1).map((src, i) => (
                  <div key={i} className={styles.mosaicSmall}>
                    <img
                      src={src}
                      alt={`Amenity ${i + 1}`}
                      className={styles.mosaicImg}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── Bottom border ── */}
      <div className={styles.bottomBorder} />

    </section>
  );
};

export default ClassCampusAmenities;
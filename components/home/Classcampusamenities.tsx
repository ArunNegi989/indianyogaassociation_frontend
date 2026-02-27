"use client";

import React, { useEffect, useRef } from "react";
import styles from "../../assets/style/Home/Classcampusamenities.module.css";
import rightsectionimage from "../../assets/images/aym-class-size.webp";

import campus1 from "../../assets/images/aym-yoga-campus.webp";

import amenity1 from "../../assets/images/shared-room.webp";

const amenities = [
  "Accommodation ( Private / Shared / Dormitory )",
  "Spacious yoga hall",
  "Free Wi-Fi",
  "Lush Garden area",
  "Hot / Cold water 24x7",
];

const campusImages = [campus1.src];

const amenityImages = [amenity1.src];

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
      { threshold: 0.08 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.bgLayer} aria-hidden="true">
        <span className={`${styles.bg} ${styles.bg1}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg2}`}>卐</span>
        <span className={`${styles.bg} ${styles.bg3}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg4}`}>卐</span>
        <span className={`${styles.bg} ${styles.bg5}`}>ॐ</span>
        <span className={`${styles.bg} ${styles.bg6}`}>卐</span>
      </div>

      <div className={styles.topBorder} />

      <div className={styles.container}>
        <div className={styles.topRow}>
          {/* ── AYM CLASS SIZE ── */}
          <div className={`${styles.classBlock} ${styles.reveal}`}>
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>
                Small Batches · Personal Attention
              </p>
              <h2 className={styles.blockTitle}>AYM CLASS SIZE</h2>
              <div className={styles.titleBar} />
            </div>

            <div className={styles.classImgWrap}>
              <div className={styles.classImgFrame}>
                <img
                  src={rightsectionimage.src}
                  alt="AYM Yoga Class Group"
                  className={styles.classImg}
                />
                <div className={styles.classImgOverlay}>
                  <span className={styles.welcomeScript}>
                    Welcome to AYM Family
                  </span>
                </div>
                <span className={styles.cornerTL} aria-hidden="true" />
                <span className={styles.cornerBR} aria-hidden="true" />
              </div>
            </div>

            <p className={styles.blockPara}>
              At AYM, only{" "}
              <strong className={styles.highlight}>25 students</strong> are
              admitted in one batch. The class size is consciously kept low to
              focus individual attention and seamless interactions between the
              faculty and students. We believe in creating a pleasant and safe
              environment for everyone to interact and learn from one another
              under the guidance of our knowledgeable yogis.
            </p>
          </div>

          <div className={styles.vertDivider} aria-hidden="true">
            <span className={styles.vertLine} />
            <span className={styles.vertOm}>ॐ</span>
            <span className={styles.vertLine} />
          </div>

          <div
            className={`${styles.campusBlock} ${styles.reveal}`}
            style={{ "--d": "0.15s" } as React.CSSProperties}
          >
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>5000 sq.mts. · Rishikesh</p>
              <h2 className={styles.blockTitle}>AYM YOGA CAMPUS</h2>
              <div className={styles.titleBar} />
            </div>

            {campusImages.map((src, i) => (
              <div key={i} className={styles.campusThumb}>
                <img
                  src={src}
                  alt={`Campus ${i + 1}`}
                  className={styles.campusThumbImg}
                />
              </div>
            ))}

            <p className={styles.blockPara}>
              Spread across an expansive{" "}
              <strong className={styles.highlight}>5000 sq.mts.</strong>, the
              AYM campus is one of the lushest campuses in Rishikesh. The
              spacious and vast gardens maintain a peaceful ambience to learn,
              relax and rejuvenate in the lap of nature. On a site that feels so
              sacred, learning Rishikesh Yoga is a blissful experience.
            </p>
          </div>
        </div>
        <div className={styles.midOrnament}>
          <span className={styles.ornLine} />
          <span className={styles.ornPattern}>✦ 卐 ✦ ॐ ✦ 卐 ✦</span>
          <span className={styles.ornLine} />
        </div>
        <div className={styles.amenitiesRow}>
          {/* Left — text */}
          <div className={`${styles.amenitiesLeft} ${styles.reveal}`}>
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>Comfort · Nature · Serenity</p>
              <h2 className={styles.amenitiesTitle}>AMENITIES</h2>
              <div className={styles.titleBar} />
            </div>

            <p className={styles.amenPara}>
              Students have fully furnished rooms amid lush gardens at this{" "}
              <strong className={styles.highlight}>
                yoga teacher training school
              </strong>
              . You can opt for private rooms or shared accommodation in a
              dormitory setup in a peaceful environment.
            </p>

            <p className={styles.blockParaSm}>Other amenities include:</p>

            <ul className={styles.amenityList}>
              {amenities.map((item, i) => (
                <li
                  key={i}
                  className={`${styles.amenityItem} ${styles.reveal}`}
                  style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
                >
                  <span className={styles.bullet} aria-hidden="true">
                    ॐ
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`${styles.amenitiesRight} ${styles.reveal}`}
            style={{ "--d": "0.12s" } as React.CSSProperties}
          >
            <div className={styles.amenityMosaic}>
              <img
                src={amenityImages[0]}
                alt="Furnished Room"
                className={styles.mosaicImg}
              />
              <div className={styles.mosaicMainOverlay}>
                <span className={styles.mosaicTag}>Furnished Rooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </section>
  );
};

export default ClassCampusAmenities;

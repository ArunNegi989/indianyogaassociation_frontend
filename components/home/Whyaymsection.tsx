"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../../assets/style/Home/Whyaymsection.module.css";
import Image from "next/image";
import api from "@/lib/api";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface Feature {
  title: string;
  desc: string;
}

interface WhyAYMData {
  _id: string;
  superTitle: string;
  mainTitle: string;
  introPara: string;
  imageSrc: string;
  imageAlt: string;
  imgBadgeYear: string;
  imgQuote: string;
  sideFeatures: Feature[];
  bottomFeatures: Feature[];
}

/* ══════════════════════════════════════════════
   IMAGE URL HELPER
   DB mein /uploads/... stored hai → full URL
══════════════════════════════════════════════ */
const getImageUrl = (src: string): string => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${process.env.NEXT_PUBLIC_API_URL}${src}`;
};

/* ══════════════════════════════════════════════
   SKELETON LOADER
══════════════════════════════════════════════ */
const Skeleton = () => (
  <section className={styles.section}>
    <div className={styles.a} />
    <div className={styles.container}>
      <div className={`${styles.header}`}>
        <div
          style={{
            height: "16px",
            width: "220px",
            background: "rgba(160,120,64,0.15)",
            borderRadius: "6px",
            margin: "0 auto 1rem",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "28px",
            width: "80%",
            background: "rgba(160,120,64,0.15)",
            borderRadius: "6px",
            margin: "0 auto 0.6rem",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "28px",
            width: "60%",
            background: "rgba(160,120,64,0.12)",
            borderRadius: "6px",
            margin: "0 auto 1.5rem",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `}</style>
  </section>
);

/* ══════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════ */
export const WhyAYMSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<WhyAYMData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ────────────────────────────────────────────
     FETCH  →  GET /why-aym/get-all-why-aym
  ──────────────────────────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/why-aym/get-all-why-aym");
        setData(res.data.data || null);
      } catch (err) {
        console.error("WhyAYMSection fetch error:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ────────────────────────────────────────────
     INTERSECTION OBSERVER — fadeUp animation
     Data load hone ke baad run karo
  ──────────────────────────────────────────── */
  useEffect(() => {
    if (!data) return;

    /* Small timeout — DOM update hone do pehle */
    const timer = setTimeout(() => {
      const els = sectionRef.current?.querySelectorAll(`.${styles.fadeUp}`);
      if (!els) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add(styles.fadeUpVisible);
          });
        },
        { threshold: 0.08 },
      );

      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  /* ── Loading ── */
  if (isLoading) return <Skeleton />;

  /* ── Error ya data nahi ── */
  if (error || !data) return null;

  /* ── Image URL resolve ── */
  const heroImageUrl = getImageUrl(data.imageSrc);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* ── Top decorative border ── */}
      <div className={styles.a} />

      <div className={styles.container}>
        {/* ══ HEADER ══ */}
        <div className={`${styles.header} ${styles.fadeUp}`}>
          {/* superTitle — plain text */}
          <p className={styles.superTitle}>{data.superTitle}</p>

          {/* mainTitle — Jodit se HTML aa sakta hai */}
          <h2
            className={styles.mainTitle}
            dangerouslySetInnerHTML={{ __html: data.mainTitle }}
          />

          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>

          {/* introPara — Jodit se HTML aa sakta hai */}
          <p
            className={styles.introPara}
            dangerouslySetInnerHTML={{ __html: data.introPara }}
          />
        </div>

        {/* ══ BODY — image + side features ══ */}
        <div className={styles.body}>
          {/* ── Image Column ── */}
          <div className={`${styles.imageCol} ${styles.fadeUp}`}>
            <div className={styles.imageWrap}>
              <div className={styles.imageFrame}>
                {heroImageUrl ? (
                  /* External URL ya /uploads/... → next/image unoptimized */
                  data.imageSrc.startsWith("http") ? (
                    <img
                      src={heroImageUrl}
                      alt={data.imageAlt || "AYM Yoga School"}
                      className={styles.heroImg}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      src={heroImageUrl}
                      alt={data.imageAlt || "AYM Yoga School"}
                      className={styles.heroImg}
                      width={600}
                      height={400}
                      unoptimized
                    />
                  )
                ) : null}
              </div>

              {/* Badge Year */}
              {data.imgBadgeYear && (
                <div className={styles.imgBadge}>
                  <span className={styles.imgBadgeOm}>🔆</span>
                  <span className={styles.imgBadgeYear}>
                    {data.imgBadgeYear}
                  </span>
                </div>
              )}

              {/* Image Quote */}
              {data.imgQuote && (
                <blockquote className={styles.imgQuote}>
                  <span className={styles.qMark}>&ldquo;</span>
                  {data.imgQuote}
                  <span className={styles.qMark}>&rdquo;</span>
                </blockquote>
              )}
            </div>
          </div>

          {/* ── Side Features Column ── */}
          <div className={styles.featuresCol}>
            {data.sideFeatures.map((f, i) => (
              <div
                key={i}
                className={`${styles.featureItem} ${styles.fadeUp}`}
                style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
              >
                <span className={styles.featureOm} aria-hidden="true">
                  🧘
                </span>
                <p className={styles.featureText}>
                  {/* title — Jodit HTML */}
                  <strong
                    className={styles.featureTitle}
                    dangerouslySetInnerHTML={{ __html: f.title }}
                  />{" "}
                  {/* desc — Jodit HTML */}
                  <span dangerouslySetInnerHTML={{ __html: f.desc }} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ MID DIVIDER ══ */}
        <div className={styles.midDivider}>
          <span className={styles.dividerLine} />
          <span className={styles.midPattern}>✦ 卐 ✦ ॐ ✦ 卐 ✦</span>
          <span className={styles.dividerLine} />
        </div>

        {/* ══ BOTTOM FEATURES ══ */}
        <div className={styles.bottomFeatures}>
          {data.bottomFeatures.map((f, i) => (
            <div
              key={i}
              className={`${styles.bottomItem} ${styles.fadeUp}`}
              style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}
            >
              <span className={styles.featureOm} aria-hidden="true">
                🔆
              </span>
              <p className={styles.featureText}>
                {/* title — Jodit HTML */}
                <strong
                  className={styles.featureTitle}
                  dangerouslySetInnerHTML={{ __html: f.title }}
                />{" "}
                {/* desc — Jodit HTML */}
                <span dangerouslySetInnerHTML={{ __html: f.desc }} />
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </section>
  );
};

export default WhyAYMSection;

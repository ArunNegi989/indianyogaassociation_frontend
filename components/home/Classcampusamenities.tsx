"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../../assets/style/Home/Classcampusamenities.module.css";
import api from "@/lib/api";
import Image from "next/image";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

/* ─────────────────────────────────────────
   Type
───────────────────────────────────────── */
interface SectionData {
  classSizeSuperLabel: string;
  classSizeTitle: string;
  classSizeWelcomeText: string;
  classSizeHighlight: string;
  classSizePara: string;
  classSizeImage: string;
  campusSuperLabel: string;
  campusTitle: string;
  campusHighlight: string;
  campusPara: string;
  campusImages: string[];
  amenitiesSuperLabel: string;
  amenitiesTitle: string;
  amenitiesMainPara: string;
  amenitiesSubLabel: string;
  amenities: string[];
  amenityMosaicTag: string;
  amenityImage: string;
}

/* ─────────────────────────────────────────
   Skeleton — uses the SAME CSS classes
   (.topRow, .amenitiesRow etc.) as the real
   content, so the same media queries apply
   and the layout shape (2-col desktop /
   1-col mobile) never changes when real
   data replaces the skeleton. Only the
   shimmer blocks swap for real content —
   minimal CLS.
   Image ratios measured live via DevTools:
   classSizeImage  → 673 / 460.156
   campusImages[0] → 740.3 / 506.172
   amenityImage    → 708.609 / 708.609 (square)
───────────────────────────────────────── */
function ClassCampusAmenitiesSkeleton() {
  const shimmer: React.CSSProperties = {
    background:
      "linear-gradient(90deg, #fdf0dc 25%, #ffe8c2 50%, #fdf0dc 75%)",
    borderRadius: "8px",
    animation: "cca-pulse 1.5s ease-in-out infinite",
  };
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.classBlock}>
            <div
              style={{
                height: 32,
                width: "70%",
                margin: "0 auto 1.5rem",
                ...shimmer,
              }}
            />
            <div style={{ aspectRatio: "673 / 460.156", ...shimmer }} />
          </div>

          <div className={styles.vertDivider} aria-hidden="true">
            <span className={styles.vertLine} />
          </div>

          <div className={styles.campusBlock}>
            <div
              style={{
                height: 32,
                width: "70%",
                margin: "0 auto 1.5rem",
                ...shimmer,
              }}
            />
            <div style={{ aspectRatio: "740.3 / 506.172", ...shimmer }} />
          </div>
        </div>

        <div className={styles.amenitiesRow} style={{ marginTop: "3rem" }}>
          <div className={styles.amenitiesLeft}>
            <div
              style={{
                height: 32,
                width: "60%",
                marginBottom: "1.5rem",
                ...shimmer,
              }}
            />
            <div style={{ height: 200, ...shimmer }} />
          </div>

          <div className={styles.amenitiesRight}>
            <div
              style={{ aspectRatio: "708.609 / 708.609", ...shimmer }}
            />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes cca-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export const ClassCampusAmenities: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/class-campus-amenities");
        if (res.data.success && res.data.data?.length > 0) {
          setData(res.data.data[0]);
        }
      } catch (err) {
        console.error("ClassCampusAmenities fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;
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
  }, [data]);

  // FIX: skeleton (using the real CSS classes) instead of null —
  // reserves the correct layout shape at every breakpoint (CLS fix)
  if (loading) return <ClassCampusAmenitiesSkeleton />;
  if (!data) return null;

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        {/* ══ TOP ROW — Class Size + Campus ══ */}
        <div className={styles.topRow}>
          {/* ── AYM CLASS SIZE ── */}
          <div className={`${styles.classBlock} ${styles.reveal}`}>
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>{data.classSizeSuperLabel}</p>
              <h2 className={styles.blockTitle}>{data.classSizeTitle}</h2>
              <div className={styles.titleBar} />
            </div>

            <div className={styles.classImgWrap}>
              {/*
                ⚠️ FIX: measured live at 673×460.156 via DevTools Computed
                tab. aspect-ratio reserves the exact same box the image
                already renders at, so the displayed size/crop is
                identical — only the pop-in layout shift is gone.
              */}
              <div
                className={styles.classImgFrame}
                style={{ position: "relative", aspectRatio: "673 / 460.156" }}
              >
                <Image
                  src={getImageUrl(data.classSizeImage)}
                  alt="AYM Yoga Class Group"
                  className={styles.classImg}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
                <div className={styles.classImgOverlay}>
                  <span className={styles.welcomeScript}>
                    {data.classSizeWelcomeText}
                  </span>
                </div>
                <span className={styles.cornerTL} aria-hidden="true" />
                <span className={styles.cornerBR} aria-hidden="true" />
              </div>
            </div>

            <div
              className={styles.blockPara}
              dangerouslySetInnerHTML={{ __html: data.classSizePara }}
            />
          </div>

          {/* ── Vertical divider ── */}
          <div className={styles.vertDivider} aria-hidden="true">
            <span className={styles.vertLine} />
            <span className={styles.vertOm}>ॐ</span>
            <span className={styles.vertLine} />
          </div>

          {/* ── AYM YOGA CAMPUS ── */}
          <div
            className={`${styles.campusBlock} ${styles.reveal}`}
            style={{ "--d": "0.15s" } as React.CSSProperties}
          >
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>{data.campusSuperLabel}</p>
              <h2 className={styles.blockTitle}>{data.campusTitle}</h2>
              <div className={styles.titleBar} />
            </div>

            {data.campusImages?.[0] && (
              /*
                ⚠️ FIX: measured live at 740.300×506.172 via DevTools
                Computed tab.
              */
              <div
                className={styles.campusThumb}
                style={{
                  position: "relative",
                  aspectRatio: "740.3 / 506.172",
                }}
              >
                <Image
                  src={getImageUrl(data.campusImages[0])}
                  alt="AYM Yoga Campus"
                  className={styles.campusThumbImg}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            )}

            <div
              className={styles.blockPara}
              dangerouslySetInnerHTML={{ __html: data.campusPara }}
            />
          </div>
        </div>

        {/* ── Mid ornament ── */}
        <div className={styles.midOrnament}>
          <span className={styles.ornLine} />
          <span className={styles.ornPattern}>✦ 卐 ✦ ॐ ✦ 卐 ✦</span>
          <span className={styles.ornLine} />
        </div>

        {/* ══ AMENITIES ROW ══ */}
        <div className={styles.amenitiesRow}>
          {/* Left — text */}
          <div className={`${styles.amenitiesLeft} ${styles.reveal}`}>
            <div className={styles.blockHeader}>
              <p className={styles.superLabel}>{data.amenitiesSuperLabel}</p>
              <h2 className={styles.amenitiesTitle}>{data.amenitiesTitle}</h2>
              <div className={styles.titleBar} />
            </div>

            <div
              className={styles.amenPara}
              dangerouslySetInnerHTML={{ __html: data.amenitiesMainPara }}
            />

            {data.amenitiesSubLabel && (
              <p className={styles.blockParaSm}>{data.amenitiesSubLabel}</p>
            )}

            <ul className={styles.amenityList}>
              {data.amenities?.map((item, i) => (
                <li
                  key={i}
                  className={`${styles.amenityItem} ${styles.reveal}`}
                  style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
                >
                  <span className={styles.bullet} aria-hidden="true">
                    🔆
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — room image */}
          <div
            className={`${styles.amenitiesRight} ${styles.reveal}`}
            style={{ "--d": "0.12s" } as React.CSSProperties}
          >
            {/*
              ⚠️ FIX: measured live at 708.609×708.609 via DevTools
              Computed tab — exactly square.
            */}
            <div
              className={styles.amenityMosaic}
              style={{
                position: "relative",
                aspectRatio: "708.609 / 708.609",
              }}
            >
              <Image
                src={getImageUrl(data.amenityImage)}
                alt="Furnished Room"
                className={styles.mosaicImg}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
              {data.amenityMosaicTag && (
                <div className={styles.mosaicMainOverlay}>
                  <span className={styles.mosaicTag}>
                    {data.amenityMosaicTag}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassCampusAmenities;
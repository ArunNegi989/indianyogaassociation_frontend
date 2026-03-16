"use client";

import React, { useEffect, useState } from "react";
import styles from "../../assets/style/Home/Homeaboutsection.module.css";
import api from "@/lib/api";

interface Stat {
  value: string;
  label: string;
}

interface HomeAboutData {
  superTitle: string;
  mainTitle: string;
  stats: Stat[];
  paraOne: string;
  paraTwo: string;
  paraThree: string;
  accreditations: string[];
  quoteText: string;
  paraRight: string;
  yogaStyles: string[];
  paraSmall: string;
  ctaText: string;
  ctaLink: string;
}

export const HomeaboutSection = () => {
  const [data, setData] = useState<HomeAboutData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAbout = async () => {
    try {
      const res = await api.get("/home-about/get-home-about");
      setData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch home about");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  if (loading) {
    return <div className={styles.section}>Loading...</div>;
  }

  if (!data) return null;

  return (
    <section className={styles.section}>
      <div className={styles.topBorder} />

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <p className={styles.superTitle}>{data.superTitle}</p>

          <h2 className={styles.mainTitle}>{data.mainTitle}</h2>

          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
        </div>

        {/* STATS */}
        <div className={styles.statsRow}>
          {data.stats?.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* BODY */}
        <div className={styles.body}>
          {/* LEFT */}
          <div className={styles.bodyLeft}>
            <p className={styles.para}>{data.paraOne}</p>
            <p className={styles.para}>{data.paraTwo}</p>
            <p className={styles.para}>{data.paraThree}</p>

            <div className={styles.accreditations}>
              {data.accreditations?.map((a, i) => (
                <span key={i} className={styles.accBadge}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.bodyRight}>
            <blockquote className={styles.quote}>
              <span className={styles.quoteMarks}>"</span>
              {data.quoteText}
              <span className={styles.quoteMarks}>"</span>
            </blockquote>

            <p className={styles.para}>{data.paraRight}</p>

            <div className={styles.stylesBlock}>
              <h4 className={styles.stylesTitle}>Multi-Style Yoga Courses</h4>

              <div className={styles.stylesGrid}>
                {data.yogaStyles?.map((style, i) => (
                  <span key={i} className={styles.styleChip}>
                    {style}
                  </span>
                ))}
              </div>
            </div>

            <p className={styles.paraSmall}>{data.paraSmall}</p>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>{data.ctaText}</p>

          <a href={data.ctaLink} className={styles.ctaBtn}>
            Explore All Courses
            <span className={styles.ctaArrow}>→</span>
          </a>
        </div>
      </div>

      <div className={styles.bottomBorder} />
    </section>
  );
};

export default HomeaboutSection;
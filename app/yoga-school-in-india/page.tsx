"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/Aboutaym/Aboutus.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import {
  FaLeaf, FaHeart, FaBook, FaUsers, FaGraduationCap, FaLightbulb, FaFlask, FaHandsHelping,
  FaOm, FaStar, FaGlobe, FaMedal, FaCertificate, FaPrayingHands, FaSeedling, FaSun,
} from "react-icons/fa";
import type { IconType } from "react-icons";

/* ── Icon name (stored in backend) → actual component ── */
const ICON_MAP: Record<string, IconType> = {
  FaLeaf, FaHeart, FaBook, FaUsers, FaGraduationCap, FaLightbulb, FaFlask, FaHandsHelping,
  FaOm, FaStar, FaGlobe, FaMedal, FaCertificate, FaPrayingHands, FaSeedling, FaSun,
};

const getIcon = (name?: string): IconType => (name && ICON_MAP[name]) || FaStar;

/* ── Types (mirror the backend About model) ── */
interface IconItem {
  icon: string;
  title: string;
  description: string;
}

interface TimelineItem {
  year: string;
  title: string;
  paragraphs: string[];
  image?: string;
}

interface AboutData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;

  logoAbbr?: string;
  logoFullText?: string;
  logoIndiaText?: string;

  schoolBlockTitle?: string;
  schoolParagraphs?: string[];
  schoolGalleryImage?: string;
  schoolGalleryLabel?: string;

  highlights?: IconItem[];

  visionMissionBlockTitle?: string;
  visionTitle?: string;
  visionParagraphs?: string[];
  visionImage?: string;
  missionTitle?: string;
  missionParagraphs?: string[];
  missionImage?: string;
  visionMissionProseParagraphs?: string[];

  objectivesBlockTitle?: string;
  objectivesIntroParagraphs?: string[];
  objectives?: string[];

  historyBlockTitle?: string;
  timelineItems?: TimelineItem[];

  activitiesBlockTitle?: string;
  activitiesIntroParagraphs?: string[];
  activities?: IconItem[];
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>ॐ</span>
    <span className={styles.dividerLine} />
  </div>
);

/* ── Component ── */
const AboutUs: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/about-section");
        setData(res.data?.data ?? null);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className={styles.page}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <p>Loading…</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className={styles.page}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <p>Content coming soon.</p>
        </div>
      </main>
    );
  }

  const schoolParagraphs = data.schoolParagraphs ?? [];
  const highlights = data.highlights ?? [];
  const visionParagraphs = data.visionParagraphs ?? [];
  const missionParagraphs = data.missionParagraphs ?? [];
  const visionMissionProseParagraphs = data.visionMissionProseParagraphs ?? [];
  const objectivesIntroParagraphs = data.objectivesIntroParagraphs ?? [];
  const objectives = data.objectives ?? [];
  const timelineItems = data.timelineItems ?? [];
  const activitiesIntroParagraphs = data.activitiesIntroParagraphs ?? [];
  const activities = data.activities ?? [];

  return (
    <main className={styles.page}>
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      {data.heroImage && (
        <section className={styles.heroSection}>
          <img
            src={getImageUrl(data.heroImage)}
            alt={data.heroImageAlt || "Yoga Students Group"}
            className={styles.heroImage}
          />
        </section>
      )}

      {/* ══════════════════════════════════════
          BLOCK 1 — School Section
      ══════════════════════════════════════ */}
      <section className={styles.schoolSection}>
        <div className={styles.container}>
          {/* Logo at top */}
          {(data.logoAbbr || data.logoFullText || data.logoIndiaText) && (
            <div className={styles.logoWrap}>
              <div className={styles.logoBadge}>
                <div className={styles.logoFallback}>
                  {data.logoAbbr && <span className={styles.logoAbbr}>{data.logoAbbr}</span>}
                  {data.logoFullText && <span className={styles.logoFull}>{data.logoFullText}</span>}
                  {data.logoIndiaText && <span className={styles.logoIndia}>{data.logoIndiaText}</span>}
                </div>
              </div>
            </div>
          )}

          <div className={styles.schoolContentGrid}>
            {/* Left: Content */}
            <div className={styles.schoolContentLeft}>
              {data.schoolBlockTitle && (
                <header className={styles.blockHeader}>
                  <h1 className={styles.blockTitle}>{data.schoolBlockTitle}</h1>
                  <OmDivider />
                </header>
              )}

              <div className={styles.schoolBody}>
                {schoolParagraphs.map((html, idx) => (
                  <div key={idx} className={styles.para} dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </div>
            </div>

            {/* Right: Gallery Image */}
            {data.schoolGalleryImage && (
              <div className={styles.schoolImagesRight}>
                <div className={styles.schoolGalleryCard}>
                  <div
                    className={styles.schoolGalleryFill}
                    data-label={data.schoolGalleryLabel || ""}
                    style={{ backgroundImage: `url(${getImageUrl(data.schoolGalleryImage)})` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      {highlights.length > 0 && (
        <section className={styles.schoolSections}>
          <div className={styles.highlightsGrid}>
            {highlights.map((highlight, idx) => {
              const Icon = getIcon(highlight.icon);
              return (
                <div key={idx} className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    <Icon />
                  </div>
                  <h3 className={styles.highlightTitle}>{highlight.title}</h3>
                  <p className={styles.highlightDesc}>{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          BLOCK 2 — Vision and Mission
      ══════════════════════════════════════ */}
      {(data.visionMissionBlockTitle || visionParagraphs.length > 0 || missionParagraphs.length > 0) && (
        <section className={styles.contentSection}>
          <div className={styles.container}>
            {data.visionMissionBlockTitle && (
              <header className={styles.blockHeader}>
                <h2 className={styles.blockTitle}>{data.visionMissionBlockTitle}</h2>
                <OmDivider />
              </header>
            )}

            <div className={styles.visionMissionGrid}>
              <div className={styles.visionCard}>
                {data.visionImage && (
                  <div className={styles.vmImageWrapper}>
                    <img src={getImageUrl(data.visionImage)} alt={data.visionTitle || "Vision"} className={styles.vmImage} />
                  </div>
                )}
                {data.visionTitle && <h3 className={styles.vmTitle}>{data.visionTitle}</h3>}
                {visionParagraphs.map((html, idx) => (
                  <div key={idx} className={styles.para} dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </div>

              <div className={styles.missionCard}>
                {data.missionImage && (
                  <div className={styles.vmImageWrapper}>
                    <img src={getImageUrl(data.missionImage)} alt={data.missionTitle || "Mission"} className={styles.vmImage} />
                  </div>
                )}
                {data.missionTitle && <h3 className={styles.vmTitle}>{data.missionTitle}</h3>}
                {missionParagraphs.map((html, idx) => (
                  <div key={idx} className={styles.para} dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </div>
            </div>

            {visionMissionProseParagraphs.length > 0 && (
              <div className={styles.prose}>
                {visionMissionProseParagraphs.map((html, idx) => (
                  <div key={idx} className={styles.para} dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          BLOCK 3 — Aims and Objectives
      ══════════════════════════════════════ */}
      {(data.objectivesBlockTitle || objectives.length > 0) && (
        <section className={`${styles.contentSection} ${styles.altBg}`}>
          <div className={styles.container}>
            {data.objectivesBlockTitle && (
              <header className={styles.blockHeader}>
                <h2 className={styles.blockTitle}>{data.objectivesBlockTitle}</h2>
                <OmDivider />
              </header>
            )}

            <div className={styles.prose}>
              {objectivesIntroParagraphs.map((html, idx) => (
                <div key={idx} className={styles.para} dangerouslySetInnerHTML={{ __html: html }} />
              ))}

              {objectives.length > 0 && (
                <div className={styles.objectivesGrid}>
                  {objectives.map((obj, i) => (
                    <div key={i} className={styles.objectiveCard}>
                      <div className={styles.objectiveNumber}>{i + 1}</div>
                      <p className={styles.objectiveText}>{obj}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          BLOCK 4 — History of AYM
      ══════════════════════════════════════ */}
      {(data.historyBlockTitle || timelineItems.length > 0) && (
        <section className={`${styles.contentSection} ${styles.contentSectionLarge}`}>
          <div className={styles.container}>
            {data.historyBlockTitle && (
              <header className={styles.blockHeader}>
                <h2 className={styles.blockTitle}>{data.historyBlockTitle}</h2>
                <OmDivider />
              </header>
            )}

            <div className={styles.timelineContainer}>
              {timelineItems.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>{item.year}</div>
                  <div className={styles.timelineContent}>
                    {item.title && <h3 className={styles.timelineTitle}>{item.title}</h3>}
                    {(item.paragraphs ?? []).map((html, pIdx) => (
                      <div key={pIdx} className={styles.para} dangerouslySetInnerHTML={{ __html: html }} />
                    ))}
                  </div>
                  {item.image && (
                    <div className={styles.timelineImageWrapper}>
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title || `Timeline ${idx + 1}`}
                        className={styles.timelineImage}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          BLOCK 5 — Activities
      ══════════════════════════════════════ */}
      {(data.activitiesBlockTitle || activities.length > 0) && (
        <section className={`${styles.contentSection} ${styles.altBg} ${styles.altBg2}`}>
          <div className={styles.container}>
            {data.activitiesBlockTitle && (
              <header className={styles.blockHeader}>
                <h2 className={styles.blockTitle}>{data.activitiesBlockTitle}</h2>
                <OmDivider />
              </header>
            )}

            <div className={styles.prose}>
              {activitiesIntroParagraphs.map((html, idx) => (
                <div key={idx} className={styles.para} dangerouslySetInnerHTML={{ __html: html }} />
              ))}

              {activities.length > 0 && (
                <div className={styles.activitiesGrid}>
                  {activities.map((activity, idx) => {
                    const Icon = getIcon(activity.icon);
                    return (
                      <div key={idx} className={styles.activityItem}>
                        <div className={styles.activityIcon}>
                          <Icon />
                        </div>
                        <h4 className={styles.activityTitle}>{activity.title}</h4>
                        <p className={styles.activityDesc}>{activity.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <HowToReach />
    </main>
  );
};

export default AboutUs;
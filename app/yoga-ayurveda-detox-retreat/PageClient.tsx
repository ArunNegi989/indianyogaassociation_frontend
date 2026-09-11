// DetoxRetreat.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-ayurveda-detox-retreat/Detoxretreat.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import toast from "react-hot-toast";

// ===================== HELPER: Strip HTML Tags =====================
const stripHtml = (html: string): string => {
  if (!html) return "";
  // Remove HTML tags and decode entities
  const stripped = html.replace(/<[^>]*>/g, "").trim();
  // Decode common HTML entities
  return stripped
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

// ===================== TYPES =====================
interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

interface Step {
  title: string;
  desc: string;
}

interface SystemItem {
  description: string;
  providesLabel: string;
  providesList: string[];
}

interface DetoxData {
  _id?: string;
  heroImage: string;
  heroImageAlt: string;
  mainTitle: string;
  s1Para1: string;
  s1HighlightText: string;
  s1Para2: string;
  s1Image: string;
  s1ImageBadge: string;
  s1ConclusionQuote: string;
  s2Label: string;
  s2Title: string;
  s2Body: string;
  benefits: Benefit[];
  s3Label: string;
  s3Title: string;
  s3Body: string;
  steps: Step[];
  finalStepTitle: string;
  finalStepDesc: string;
  s4Label: string;
  s4Title: string;
  badges: string[];
  massageImage: string;
  overlayQuote: string;
  s5Label: string;
  s5Title: string;
  systems: SystemItem[];
  s6Label: string;
  s6Title: string;
  packages: string[];
  priceNote: string;
}

// ===================== DEFAULT LOADING STATE =====================
const LOADING_DATA: DetoxData = {
  heroImage: "",
  heroImageAlt: "Loading...",
  mainTitle: "Loading...",
  s1Para1: "",
  s1HighlightText: "",
  s1Para2: "",
  s1Image: "",
  s1ImageBadge: "",
  s1ConclusionQuote: "",
  s2Label: "",
  s2Title: "",
  s2Body: "",
  benefits: [],
  s3Label: "",
  s3Title: "",
  s3Body: "",
  steps: [],
  finalStepTitle: "",
  finalStepDesc: "",
  s4Label: "",
  s4Title: "",
  badges: [],
  massageImage: "",
  overlayQuote: "",
  s5Label: "",
  s5Title: "",
  systems: [],
  s6Label: "",
  s6Title: "",
  packages: [],
  priceNote: "",
};

// ===================== MAIN COMPONENT =====================
const DetoxRetreat: React.FC = () => {
  const [data, setData] = useState<DetoxData>(LOADING_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchDetoxData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get("/detox-retreat-section/active");
        
        if (response.data.success && response.data.data) {
          setData(response.data.data);
        } else {
          throw new Error("No data received from API");
        }
      } catch (err: any) {
        console.error("Error fetching detox retreat data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load detox retreat data");
        toast.error("Failed to load detox retreat data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetoxData();
  }, []);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading Detox Retreat Information...</p>
        </div>
      </div>
    );
  }

  if (error || !data.mainTitle) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Unable to load detox retreat data. Please try again later.</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.heroSection}>
        {data.heroImage ? (
          <Image
            src={data.heroImage}
            alt={data.heroImageAlt || "Detox Retreat Hero"}
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        ) : (
          <div className={styles.heroPlaceholder}>
            <span>🌿</span>
            <p>Detox Retreat</p>
          </div>
        )}
      </section>

      {/* ===== SECTION 1 — INTRO ===== */}
      <section className={styles.section}>
        <h1 className={styles.mainTitle}>{stripHtml(data.mainTitle)}</h1>

        <div className={styles.twoColumnLayout}>
          <div className={styles.textColumn}>
            {/* Paragraph 1 - Without HTML tags */}
            <p className={styles.bodyText}>{stripHtml(data.s1Para1)}</p>

            {/* Highlight Box */}
            {data.s1HighlightText && (
              <div className={styles.highlightBox}>
                <p className={styles.bodyText}>
                  <span className={styles.highlight}>The below image shows</span>
                  {" " + stripHtml(data.s1HighlightText)}
                </p>
              </div>
            )}

            {/* Paragraph 2 - Without HTML tags */}
            <p className={styles.bodyText}>{stripHtml(data.s1Para2)}</p>
          </div>

          <div className={styles.imageColumn}>
            <div className={styles.imageBox}>
              {data.s1Image ? (
                <Image
                  src={data.s1Image}
                  alt={data.s1ImageBadge || "Ayurveda detox"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.columnImage}
                  priority
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>🖼️</span>
                </div>
              )}
              {data.s1ImageBadge && (
                <div className={styles.imageOverlay}>
                  <span className={styles.imageBadge}>{stripHtml(data.s1ImageBadge)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conclusion Quote - Without HTML tags */}
        {data.s1ConclusionQuote && (
          <div className={styles.conclusionBox}>
            <p className={styles.bodyText}>
              <span className={styles.quoteIcon}>"</span>
              {stripHtml(data.s1ConclusionQuote)}
              <span className={styles.quoteIcon}>"</span>
            </p>
          </div>
        )}
      </section>

      {/* ===== SECTION 2 — HOW TO CORRECT (BENEFITS) ===== */}
      <section className={styles.correctSection}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>{stripHtml(data.s2Label)}</p>
          <h2 className={styles.sectionTitle}>{stripHtml(data.s2Title)}</h2>
          <div className={styles.titleUnderline} />
          
          <p className={styles.bodyText}>{stripHtml(data.s2Body)}</p>

          <div className={styles.benefitGrid}>
            {data.benefits && data.benefits.length > 0 ? (
              data.benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitCard}>
                  <span className={styles.benefitIcon}>{benefit.icon || "✨"}</span>
                  <h3 className={styles.benefitTitle}>{stripHtml(benefit.title)}</h3>
                  <p className={styles.benefitDesc}>{stripHtml(benefit.desc)}</p>
                </div>
              ))
            ) : (
              <p className={styles.noDataMessage}>No benefits available</p>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3 — COMPLETE METHOD (STEPS) ===== */}
      <section className={styles.methodSection}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>{stripHtml(data.s3Label)}</p>
          <h2 className={styles.sectionTitle}>{stripHtml(data.s3Title)}</h2>
          <div className={styles.titleUnderline} />
          
          <p className={styles.bodyText}>{stripHtml(data.s3Body)}</p>

          <div className={styles.stepsGrid}>
            {data.steps && data.steps.length > 0 ? (
              data.steps.map((step, index) => (
                <div key={index} className={styles.stepCard}>
                  <div className={styles.stepNum}>{index + 1}</div>
                  <div>
                    <h3 className={styles.stepTitle}>{stripHtml(step.title)}</h3>
                    <p className={styles.stepDesc}>{stripHtml(step.desc)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noDataMessage}>No steps available</p>
            )}

            {data.finalStepTitle && data.finalStepDesc && (
              <div className={`${styles.stepCard} ${styles.stepCardFull} ${styles.stepCardHighlight}`}>
                <div className={styles.stepNum}>{data.steps ? data.steps.length + 1 : 7}</div>
                <div>
                  <h3 className={styles.stepTitle}>{stripHtml(data.finalStepTitle)}</h3>
                  <p className={styles.stepDesc}>{stripHtml(data.finalStepDesc)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4 — MASSAGE ===== */}
      <section className={styles.massageSection}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>{stripHtml(data.s4Label)}</p>
          <h2 className={styles.sectionTitle}>{stripHtml(data.s4Title)}</h2>
          <div className={styles.titleUnderline} />

          <div className={styles.mediaTabRow}>
            <div className={styles.badgeRow}>
              {data.badges && data.badges.length > 0 ? (
                data.badges.map((badge, index) => (
                  <span key={index} className={styles.therapyBadge}>{stripHtml(badge)}</span>
                ))
              ) : (
                <span className={styles.therapyBadge}>Therapies</span>
              )}
            </div>
          </div>

          <div className={styles.massageImageBox}>
            {data.massageImage ? (
              <Image
                src={data.massageImage}
                alt="Ayurveda massage treatment"
                fill
                sizes="(max-width: 575px) 100vw, (max-width: 991px) 95vw, 1140px"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>💆</span>
              </div>
            )}
            {data.overlayQuote && (
              <div className={styles.massageImageOverlay}>
                <p className={styles.overlayQuote}>
                  &ldquo;{stripHtml(data.overlayQuote)}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5 — TWO SYSTEMS ===== */}
      <section className={styles.systemsSection}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>{stripHtml(data.s5Label)}</p>
          <h2 className={styles.sectionTitle}>{stripHtml(data.s5Title)}</h2>
          <div className={styles.titleUnderline} />

          <div className={styles.systemsGrid}>
            {data.systems && data.systems.length > 0 ? (
              data.systems.map((system, index) => (
                <div key={index} className={styles.systemCard}>
                  <div className={styles.systemCardHeader}>
                    <div className={styles.systemNum}>{index + 1}</div>
                    <p className={styles.systemCardDesc}>{stripHtml(system.description)}</p>
                  </div>
                  <div className={styles.systemCardBody}>
                    <p className={styles.providesLabel}>{stripHtml(system.providesLabel || "What to expect:")}</p>
                    <ul className={styles.providesList}>
                      {system.providesList && system.providesList.length > 0 ? (
                        system.providesList.map((item, idx) => (
                          <li key={idx} className={styles.providesItem}>
                            <div className={styles.providesDot}>
                              <div className={styles.providesDotInner} />
                            </div>
                            <span className={styles.providesText}>{stripHtml(item)}</span>
                          </li>
                        ))
                      ) : (
                        <li className={styles.providesItem}>
                          <span className={styles.providesText}>No items listed</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noDataMessage}>No systems available</p>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6 — PRICE AND PACKAGES ===== */}
      <section className={styles.packagesSection}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>{stripHtml(data.s6Label)}</p>
          <h2 className={styles.sectionTitle}>{stripHtml(data.s6Title)}</h2>
          <div className={styles.titleUnderline} />

          <div className={styles.packagesGrid}>
            {data.packages && data.packages.length > 0 ? (
              data.packages.map((pkg, index) => (
                <div key={index} className={styles.pkgCard}>
                  <div className={styles.pkgDays}>{stripHtml(pkg.split(" ")[0])}</div>
                  <div className={styles.pkgDaysLabel}>
                    {stripHtml(pkg.split(" ").slice(1).join(" ") || "Days")}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noDataMessage}>No packages available</p>
            )}
          </div>

          {data.priceNote && (
            <p className={styles.priceNote}>{stripHtml(data.priceNote)}</p>
          )}
        </div>
      </section>

      <HowToReach />
    </div>
  );
};

export default DetoxRetreat;
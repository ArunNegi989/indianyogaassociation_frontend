"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/Accreditationsection/Accreditationsection.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

/* ── Types (mirror the backend Affiliation model) ── */
interface CardItem {
  title: string;
  icon: string;
  description: string;
  color: string;
}

interface RysImageItem {
  image: string;
  alt: string;
}

interface CertItem {
  type: string;
  description: string;
  image: string;
}

interface AffiliationData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  accreditationCards?: CardItem[];
  galleryImages?: string[];
  mainTitle?: string;
  introCardTitle?: string;
  introParagraphs?: string[];
  rysImages?: RysImageItem[];
  highlightTitle?: string;
  highlightParagraphs?: string[];
  yogaAllianceUrl?: string;
  certsSectionTitle?: string;
  certsSectionSubtitle?: string;
  certs?: CertItem[];
  boardSectionTitle?: string;
  boardSectionSubtitle?: string;
  boardCertificateImage?: string;
  boardInfoTitle?: string;
  boardInfoText?: string;
  iyfSectionTitle?: string;
  iyfTitle?: string;
  iyfParagraphs?: string[];
  iyfFooterNotes?: string[];
  iyfLogoImage?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

/* ── Sub-components ── */

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className={styles.sectionTitleWrap}>
    <h2 className={styles.sectionTitle}>{children}</h2>
    {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
  </div>
);

const AccreditationCardComponent: React.FC<CardItem> = ({ title, icon, description, color }) => (
  <div className={styles.accreditationCard} style={{ borderTopColor: color }}>
    <div className={styles.cardIcon}>{icon}</div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardDescription}>{description}</p>
  </div>
);

/* ── Carousel Component (data-driven) ── */
const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay, images.length]);

  if (!images.length) return null;

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselTrack}>
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`${styles.carouselSlide} ${idx === currentIndex ? styles.active : ""}`}
            >
              {/* Dynamic backend images use a plain <img> (no next/image static import available) */}
              <img
                src={getImageUrl(img)}
                alt={`Carousel image ${idx + 1}`}
                className={styles.carouselImage}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button className={styles.carouselBtn} onClick={handlePrev} aria-label="Previous image">
              ‹
            </button>
            <button className={styles.carouselBtn} onClick={handleNext} aria-label="Next image">
              ›
            </button>

            <div className={styles.carouselDots}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ""}`}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ── */

const AccreditationSection: React.FC = () => {
  const [data, setData] = useState<AffiliationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/affiliation");
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
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p>Loading…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p>Content coming soon.</p>
      </div>
    );
  }

  const accreditationCards = data.accreditationCards ?? [];
  const galleryImages = data.galleryImages ?? [];
  const introParagraphs = data.introParagraphs ?? [];
  const rysImages = data.rysImages ?? [];
  const highlightParagraphs = data.highlightParagraphs ?? [];
  const certs = data.certs ?? [];
  const iyfParagraphs = data.iyfParagraphs ?? [];
  const iyfFooterNotes = data.iyfFooterNotes ?? [];

  return (
    <>
      {data.heroImage && (
        <section className={styles.heroSection}>
          <img
            src={getImageUrl(data.heroImage)}
            alt={data.heroImageAlt || "Yoga Students Group"}
            className={styles.heroImage}
          />
        </section>
      )}

      <section className={styles.section}>
        {/* ACCREDITATION CARDS SECTION */}
        {accreditationCards.length > 0 && (
          <div className={styles.container}>
            <SectionTitle>Why Choose AYM?</SectionTitle>
            <div className={styles.accreditationCardsGrid}>
              {accreditationCards.map((card, idx) => (
                <AccreditationCardComponent key={idx} {...card} />
              ))}
            </div>
          </div>
        )}

        {/* CAROUSEL SECTION */}
        {galleryImages.length > 0 && (
          <div className={styles.container}>
            <SectionTitle>AYM Yoga School Gallery</SectionTitle>
            <ImageCarousel images={galleryImages} />
          </div>
        )}

        {/* PART 1 - MAIN INTRO */}
        <div className={styles.container}>
          {data.mainTitle && <h1 className={styles.mainTitle}>{data.mainTitle}</h1>}

          {(data.introCardTitle || introParagraphs.length > 0) && (
            <div className={styles.introCard}>
              <div className={styles.introContent}>
                {data.introCardTitle && <h3 className={styles.introCardTitle}>{data.introCardTitle}</h3>}
                <div className={styles.introParagraphs}>
                  {introParagraphs.map((html, idx) => (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {rysImages.length > 0 && (
            <div className={styles.imgWrap}>
              {rysImages.map((r, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(r.image)}
                  alt={r.alt || "AYM Yoga School registration"}
                  className={styles.responsiveImgage}
                />
              ))}
            </div>
          )}

          {(data.highlightTitle || highlightParagraphs.length > 0) && (
            <div className={styles.highlightBox}>
              {data.highlightTitle && <h4 className={styles.highlightTitle}>{data.highlightTitle}</h4>}
              {highlightParagraphs.map((html, idx) => (
                <div key={idx} className={styles.highlightText} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
              {data.yogaAllianceUrl && (
                <p className={styles.highlightText}>
                  <a
                    href={data.yogaAllianceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {data.yogaAllianceUrl}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>

        {/* PART 2 - YOGA ALLIANCE CERTS */}
        {certs.length > 0 && (
          <div className={styles.container}>
            <SectionTitle subtitle={data.certsSectionSubtitle}>
              {data.certsSectionTitle || "Yoga Alliance Certifications"}
            </SectionTitle>

            <div className={styles.certGridEnhanced}>
              {certs.map((cert, idx) => (
                <div key={idx} className={styles.certCard}>
                  {cert.image && (
                    <div className={styles.certImageWrapper}>
                      <img
                        src={getImageUrl(cert.image)}
                        alt={`Yoga Alliance ${cert.type} certification logo`}
                        className={styles.responsiveImg}
                      />
                    </div>
                  )}
                  <div className={styles.certInfo}>
                    <h4 className={styles.certType}>{cert.type}</h4>
                    <p className={styles.certDescription}>{cert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PART 3 - YOGA CERTIFICATION BOARD */}
        {(data.boardSectionTitle || data.boardCertificateImage || data.boardInfoText) && (
          <div className={styles.container}>
            <SectionTitle>{data.boardSectionTitle || "Yoga Certification Board"}</SectionTitle>
            {data.boardSectionSubtitle && (
              <p className={styles.sectionDescription}>{data.boardSectionSubtitle}</p>
            )}

            <div className={styles.certBoardWrapper}>
              {data.boardCertificateImage && (
                <div className={styles.imgWrap1}>
                  <img
                    src={getImageUrl(data.boardCertificateImage)}
                    alt="Yoga Certification Board certificate"
                    className={styles.responsiveImg}
                  />
                </div>
              )}
              <div className={styles.certBoardInfo}>
                {data.boardInfoTitle && <h4>{data.boardInfoTitle}</h4>}
                {data.boardInfoText && <div dangerouslySetInnerHTML={{ __html: data.boardInfoText }} />}
              </div>
            </div>
          </div>
        )}

        {/* PART 4 - INTERNATIONAL YOGA FEDERATION */}
        {(data.iyfSectionTitle || iyfParagraphs.length > 0) && (
          <div className={styles.container}>
            <SectionTitle>{data.iyfSectionTitle || "International Yoga Federation"}</SectionTitle>

            <div className={styles.iyfSection}>
              <div className={styles.iyfContent}>
                {data.iyfTitle && <h3 className={styles.iyfTitle}>{data.iyfTitle}</h3>}
                <div className={styles.introParagraphs}>
                  {iyfParagraphs.map((html, idx) => (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: html }} />
                  ))}
                </div>

                {iyfFooterNotes.length > 0 && (
                  <div className={styles.iyfFooterNotes}>
                    {iyfFooterNotes.map((note, idx) => (
                      <div key={idx} className={styles.noteItem}>
                        <span className={styles.noteIcon}>✓</span>
                        <p>{note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {data.iyfLogoImage && (
                <div className={styles.iyfImageWrapper}>
                  <img
                    src={getImageUrl(data.iyfLogoImage)}
                    alt="International Yoga Federation official logo"
                    className={styles.responsiveImg}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <HowToReach />
    </>
  );
};

export default AccreditationSection;
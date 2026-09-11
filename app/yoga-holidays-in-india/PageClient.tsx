"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/yoga-holidays-in-india/Yogaholidays.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Link from "next/link";
import api from "@/lib/api";

/* ── Types (mirror backend Holidays model) ── */
interface TimeSlot { time: string; activity: string }
interface PricingCard { title: string; amount: string; detail: string; includes: string[] }

interface HolidaysData {
  _id: string;
  heroImage?: string; heroImageAlt?: string;

  mainTitle?: string;
  bodyParagraphs?: string[];
  mediaImage?: string; mediaImageAlt?: string;
  imageOverlayCaption?: string;
  videoEmbedUrl?: string;

  ayurvedaCalloutParagraphs?: string[];
  benefitsHeading?: string;
  benefits?: string[];
  ctaText?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;

  shivirTitle?: string;
  shivirSubtitle?: string;
  descriptionParagraphs?: string[];
  campImage?: string; campImageAlt?: string;
  campImageCaption?: string;

  datesHighlight?: string;
  durationRange?: string;
  dateNote?: string;
  datePeriods?: string[];

  timetableTitle?: string;
  timetableSubtitle?: string;
  timetableRows?: TimeSlot[];

  pricingCards?: PricingCard[];

  enrollTitle?: string;
  enrollSteps?: string[];
  seatsNote?: string;

  eligibilityTitle?: string;
  eligibilityText?: string;

  guidelinesTitle?: string;
  guidelines?: string[];

  moreInfoTitle?: string;
  moreInfoParagraphs?: string[];
  dressCodeTitle?: string;
  dressCodeMen?: string;
  dressCodeWomen?: string;
  dressCodeNote?: string;

  reachTitle?: string;
  reachText?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const YogaHolidays: React.FC = () => {
  const [data, setData] = useState<HolidaysData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/holidays-section");
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
      <div className={styles.pageWrapper}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}><p>Loading…</p></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}><p>Content coming soon.</p></div>
      </div>
    );
  }

  const bodyParagraphs = data.bodyParagraphs ?? [];
  const ayurvedaCalloutParagraphs = data.ayurvedaCalloutParagraphs ?? [];
  const benefits = data.benefits ?? [];
  const descriptionParagraphs = data.descriptionParagraphs ?? [];
  const datePeriods = data.datePeriods ?? [];
  const timetableRows = data.timetableRows ?? [];
  const pricingCards = data.pricingCards ?? [];
  const enrollSteps = data.enrollSteps ?? [];
  const guidelines = data.guidelines ?? [];
  const moreInfoParagraphs = data.moreInfoParagraphs ?? [];

  // Split the single ordered timetable list into two columns
  const half = Math.ceil(timetableRows.length / 2);
  const timetableCol1 = timetableRows.slice(0, half);
  const timetableCol2 = timetableRows.slice(half);

  return (
    <div className={styles.pageWrapper}>
      {data.heroImage && (
        <section className={styles.heroSection}>
          <img src={getImageUrl(data.heroImage)} alt={data.heroImageAlt || "Yoga Students Group"} className={styles.heroImage} />
        </section>
      )}

      {/* ===== SECTION 1 — WHITE BG ===== */}
      <section className={styles.whiteSection}>
        {data.mainTitle && <h1 className={styles.mainTitle}>{data.mainTitle}</h1>}

        <div className={styles.splitGrid}>
          <div className={styles.splitText}>
            {bodyParagraphs.map((html, idx) => (
              <div key={idx} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>

          <div className={styles.mediaStack}>
            {data.mediaImage && (
              <div className={styles.imageBox}>
                <img src={getImageUrl(data.mediaImage)} alt={data.mediaImageAlt || "Rishikesh"} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                {data.imageOverlayCaption && <div className={styles.imageOverlayCaption}>{data.imageOverlayCaption}</div>}
              </div>
            )}

            {data.videoEmbedUrl && (
              <div className={styles.videoBlock}>
                <iframe
                  src={data.videoEmbedUrl}
                  title="Life at AYM Rishikesh"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        {/* Ayurveda callout */}
        {ayurvedaCalloutParagraphs.length > 0 && (
          <div className={styles.ayurvedaCallout}>
            {ayurvedaCalloutParagraphs.map((html, idx) => (
              <div key={idx} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>
        )}

        {/* Benefits pills */}
        {benefits.length > 0 && (
          <div className={styles.benefitsWrap}>
            {data.benefitsHeading && (
              <p className={styles.benefitsHeading}><strong><u>{data.benefitsHeading}</u></strong></p>
            )}
            <div className={styles.pillsRow}>
              {benefits.map((b, idx) => (
                <span key={idx} className={styles.pill}>
                  <span className={styles.pillDot} />
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {(data.ctaText || data.ctaButtonText) && (
          <div className={styles.ctaBar}>
            {data.ctaText && <p className={styles.ctaText}>{data.ctaText}</p>}
            {data.ctaButtonText && (
              <Link href={data.ctaButtonLink || "#"} className={styles.ctaButton}>
                {data.ctaButtonText}
              </Link>
            )}
          </div>
        )}
      </section>

      {/* ===== SECTION 2 — BEIGE BG ===== */}
      <section className={styles.beigeSection}>
        <div className={styles.beigeInner}>
          {(data.shivirTitle || data.shivirSubtitle) && (
            <div className={styles.shivirHeader}>
              <div className={styles.headerAccent}></div>
              {data.shivirTitle && <h2 className={styles.shivirTitle}>{data.shivirTitle}</h2>}
              {data.shivirSubtitle && <h3 className={styles.shivirSubtitle}>{data.shivirSubtitle}</h3>}
            </div>
          )}

          {descriptionParagraphs.length > 0 && (
            <div className={styles.descriptionCard}>
              {descriptionParagraphs.map((html, idx) => (
                <div key={idx} className={styles.beigeBodyText} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
            </div>
          )}

          {data.campImage && (
            <div className={styles.imageWrapper}>
              <div className={styles.campImageBox}>
                <img src={getImageUrl(data.campImage)} alt={data.campImageAlt || "Yoga Camp"} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                {data.campImageCaption && (
                  <div className={styles.campImageCaption}><span>{data.campImageCaption}</span></div>
                )}
              </div>
            </div>
          )}

          {/* Dates & Duration */}
          {(data.datesHighlight || datePeriods.length > 0) && (
            <div className={styles.infoCard}>
              <h2 className={styles.sectionHeading}>Dates & Duration</h2>
              <div className={styles.datesGrid}>
                <div className={styles.dateBlock}>
                  {data.datesHighlight && <p className={styles.dateHighlight}>{data.datesHighlight}</p>}
                  {data.durationRange && <p className={styles.durationRange}>{data.durationRange}</p>}
                  {data.dateNote && <p className={styles.dateNote}>{data.dateNote}</p>}
                </div>
                <div className={styles.dateBlock}>
                  {datePeriods.map((p, idx) => (
                    <p key={idx} className={styles.datePeriod}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timetable */}
          {timetableRows.length > 0 && (
            <div className={styles.timetableCard}>
              <div className={styles.timetableHeader}>
                {data.timetableTitle && <h3 className={styles.timetableTitle}>{data.timetableTitle}</h3>}
                {data.timetableSubtitle && <p className={styles.timetableSubtitle}>{data.timetableSubtitle}</p>}
              </div>
              <div className={styles.timetableBody}>
                <div className={styles.timetableColumns}>
                  <div className={styles.timetableCol}>
                    {timetableCol1.map((row, idx) => (
                      <div key={idx} className={styles.timetableRow}>
                        <span className={styles.timeSlot}>{row.time}</span>
                        <span className={styles.activity}>{row.activity}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.timetableCol}>
                    {timetableCol2.map((row, idx) => (
                      <div key={idx} className={styles.timetableRow}>
                        <span className={styles.timeSlot}>{row.time}</span>
                        <span className={styles.activity}>{row.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {pricingCards.length > 0 && (
            <div className={styles.pricingGrid}>
              {pricingCards.map((card, idx) => (
                <div key={idx} className={styles.pricingCard}>
                  <h4 className={styles.pricingTitle}>{card.title}</h4>
                  <p className={styles.pricingAmount}>{card.amount}</p>
                  <p className={styles.pricingDetail}>{card.detail}</p>
                  <div className={styles.pricingIncludes}>
                    {(card.includes ?? []).map((inc, i) => <span key={i}>{inc}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enrollment */}
          {(data.enrollTitle || enrollSteps.length > 0) && (
            <div className={styles.enrollSection}>
              {data.enrollTitle && <h2 className={styles.sectionHeading}>{data.enrollTitle}</h2>}
              <div className={styles.enrollSteps}>
                {enrollSteps.map((step, idx) => (
                  <div key={idx} className={styles.step}>
                    <span className={styles.stepNumber}>{String(idx + 1).padStart(2, "0")}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
              {data.seatsNote && <p className={styles.seatsNote}>{data.seatsNote}</p>}
            </div>
          )}

          {/* Eligibility */}
          {(data.eligibilityTitle || data.eligibilityText) && (
            <div className={styles.eligibilityCard}>
              {data.eligibilityTitle && <h2 className={styles.sectionHeading}>{data.eligibilityTitle}</h2>}
              {data.eligibilityText && (
                <div className={styles.eligibilityText} dangerouslySetInnerHTML={{ __html: data.eligibilityText }} />
              )}
            </div>
          )}

          {/* Guidelines */}
          {guidelines.length > 0 && (
            <div className={styles.guidelinesSection}>
              {data.guidelinesTitle && <h2 className={styles.sectionHeading}>{data.guidelinesTitle}</h2>}
              <div className={styles.guidelinesGrid}>
                {guidelines.map((g, idx) => (
                  <div key={idx} className={styles.guidelineItem}>
                    <span className={styles.guidelineDot}></span>
                    <p>{g}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Info */}
          {(data.moreInfoTitle || moreInfoParagraphs.length > 0) && (
            <div className={styles.moreInfoSection}>
              {data.moreInfoTitle && <h2 className={styles.moreInfoTitle}>{data.moreInfoTitle}</h2>}
              {moreInfoParagraphs.map((html, idx) => (
                <div key={idx} className={styles.moreInfoText} dangerouslySetInnerHTML={{ __html: html }} />
              ))}

              {(data.dressCodeTitle || data.dressCodeMen || data.dressCodeWomen) && (
                <div className={styles.dressCodeBlock}>
                  {data.dressCodeTitle && <h3 className={styles.dressCodeTitle}>{data.dressCodeTitle}</h3>}
                  {data.dressCodeMen && (
                    <div className={styles.dressCodeItem} dangerouslySetInnerHTML={{ __html: data.dressCodeMen }} />
                  )}
                  {data.dressCodeWomen && (
                    <div className={styles.dressCodeItem} dangerouslySetInnerHTML={{ __html: data.dressCodeWomen }} />
                  )}
                  {data.dressCodeNote && (
                    <div className={styles.moreInfoText} dangerouslySetInnerHTML={{ __html: data.dressCodeNote }} />
                  )}
                </div>
              )}
            </div>
          )}

          {/* How to Reach */}
          {(data.reachTitle || data.reachText) && (
            <div className={styles.reachSection}>
              {data.reachTitle && <h2 className={styles.sectionHeading}>{data.reachTitle}</h2>}
              {data.reachText && (
                <div className={styles.beigeBodyText} dangerouslySetInnerHTML={{ __html: data.reachText }} />
              )}
            </div>
          )}
        </div>
      </section>

      <HowToReach />
    </div>
  );
};

export default YogaHolidays;
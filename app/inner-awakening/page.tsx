// InnerTransformation.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/assets/style/inner-awakening/Innertransformation.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

/* ─────────────────────── Types (mirrors the backend model) ─────────────────────── */
interface StatItem {
  value: string;
  label: string;
}
interface InsightCardItem {
  number: string;
  title: string;
  text: string;
}
interface ScheduleItem {
  time: string;
  activity: string;
}
interface GalleryImageItem {
  image?: string;
  caption: string;
  subcaption: string;
}
interface TermItem {
  term: string;
  desc: string;
}

interface InnerAwakeningData {
  _id: string;

  heroImage?: string;
  heroImageAlt?: string;

  heroBadge?: string;
  mainTitle?: string;
  subTitle?: string;
  whoTitle?: string;
  maharishiIntro?: string;
  maharishiImage?: string;
  maharishiImageAlt?: string;
  imageCaption?: string;
  heroStats?: StatItem[];

  whatBadge?: string;
  whatTitle?: string;
  quoteText?: string;
  bodyText?: string;
  insightCards?: InsightCardItem[];
  programNote?: string;

  scheduleBadge?: string;
  scheduleTitle?: string;
  weeksBadge?: string;
  weeksText?: string;
  card1Title?: string;
  points?: string[];
  cardFootnote?: string;
  card2Title?: string;
  morningLabel?: string;
  morningItems?: ScheduleItem[];
  breakText?: string;
  eveningLabel?: string;
  eveningItems?: ScheduleItem[];

  galleryBadge?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryImages?: GalleryImageItem[];

  definitionTitle?: string;
  terms?: TermItem[];
  participantTitle?: string;
  participantList?: string[];

  feeBadge?: string;
  feeTitle?: string;
  includedItems?: string[];
  pricingBadge?: string;
  priceUSD?: string;
  priceINR?: string;
  pricingDesc?: string;
  pricingNote?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

/* ---- Om Symbol SVG ---- */
const OmSVG: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" stroke="#e8600a" strokeWidth="2" fill="none" />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="26"
      fill="#e8600a"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

const Divider: React.FC = () => (
  <div className={styles.divider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>
      <OmSVG />
    </span>
    <span className={styles.dividerLine} />
  </div>
);

/* ═════════════════════════ MAIN COMPONENT ═════════════════════════ */
const InnerTransformation: React.FC = () => {
  const [data, setData] = useState<InnerAwakeningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/inner-awakening-section");
        const doc = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        setData(doc ?? null);
      } catch {
        setError(true);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  /* ── No content saved yet / fetch failed ── */
  if (!data || error) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <p>Content not available right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>

      {/* ===== HERO IMAGE ===== */}
      {data.heroImage && (
        <section className={styles.heroSection}>
          <Image
            src={getImageUrl(data.heroImage)}
            alt={data.heroImageAlt || "Hero"}
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        </section>
      )}

      {/* ===== HERO TITLE ===== */}
      <section className={styles.heroSection1}>
        <div className={styles.heroContent}>
          {data.heroBadge && (
            <div className={styles.heroBadge}>
              <span>{data.heroBadge}</span>
            </div>
          )}

          {data.mainTitle && <h1 className={styles.mainTitle}>{data.mainTitle}</h1>}

          {data.subTitle && (
            <div className={styles.subTitleWrapper}>
              <div className={styles.subTitleAccent}></div>
              <h2 className={styles.subTitle}>{data.subTitle}</h2>
              <div className={styles.subTitleAccent}></div>
            </div>
          )}

          {data.whoTitle && (
            <div className={styles.whoSection}>
              <div className={styles.whoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill="#e8600a"
                  />
                </svg>
              </div>
              <h3 className={styles.whoTitle}>{data.whoTitle}</h3>
            </div>
          )}

          {data.maharishiIntro && (
            <div className={styles.maharishiIntro}>
              <div className={styles.bodyText} dangerouslySetInnerHTML={{ __html: data.maharishiIntro }} />
            </div>
          )}

          {data.maharishiImage && (
            <div className={styles.imageWrapper}>
              <div className={styles.maharishiImageBox}>
                <Image
                  src={getImageUrl(data.maharishiImage)}
                  alt={data.maharishiImageAlt || "Guru"}
                  fill
                  sizes="(max-width: 575px) 100vw, (max-width: 991px) 85vw, 920px"
                  style={{ objectFit: "cover" }}
                  priority
                />
                {data.imageCaption && (
                  <div className={styles.imageCaption}>
                    <span>{data.imageCaption}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!!data.heroStats?.length && (
            <div className={styles.heroStats}>
              {data.heroStats.map((stat, i) => (
                <div className={styles.statBox} key={i}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== WHAT IS THE RETREAT ===== */}
      <section className={styles.whatSection}>
        <div className={styles.whatContainer}>
          <div className={styles.sectionHeader}>
            {data.whatBadge && <div className={styles.sectionBadge}>{data.whatBadge}</div>}
            {data.whatTitle && <h2 className={styles.sectionTitle}>{data.whatTitle}</h2>}
            <div className={styles.sectionUnderline}></div>
          </div>

          <div className={styles.retreatContent}>
            {data.quoteText && (
              <div className={styles.retreatQuote}>
                <div className={styles.quoteIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 11H6V15H10V11ZM18 11H14V15H18V11Z" fill="#e8600a" />
                    <path
                      d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z"
                      fill="#e8600a"
                    />
                  </svg>
                </div>
                <p className={styles.quoteText}>&quot;{data.quoteText}&quot;</p>
                <div className={styles.quoteLine}></div>
              </div>
            )}

            {data.bodyText && (
              <div className={styles.textBlock}>
                <div className={styles.bodyText} dangerouslySetInnerHTML={{ __html: data.bodyText }} />
              </div>
            )}

            {!!data.insightCards?.length && (
              <div className={styles.twoColumnLayout}>
                {data.insightCards.map((card, i) => (
                  <div className={styles.column} key={i}>
                    <div className={styles.insightCard}>
                      <div className={styles.insightNumber}>{card.number}</div>
                      <h4 className={styles.insightTitle}>{card.title}</h4>
                      <p className={styles.insightText}>{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.programNote && (
              <div className={styles.programNote}>
                <div className={styles.noteDot}></div>
                <p className={styles.noteText}>{data.programNote}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== SCHEDULE SECTION ===== */}
      <section className={styles.scheduleSection}>
        <div className={styles.scheduleContainer}>
          <div className={styles.scheduleHeader}>
            {data.scheduleBadge && <div className={styles.scheduleBadge}>{data.scheduleBadge}</div>}
            {data.scheduleTitle && <h2 className={styles.scheduleTitle}>{data.scheduleTitle}</h2>}
            <div className={styles.scheduleUnderline}></div>
            {(data.weeksBadge || data.weeksText) && (
              <div className={styles.weeksLabel}>
                {data.weeksBadge && <span className={styles.weeksBadge}>{data.weeksBadge}</span>}
                {data.weeksText && <span className={styles.weeksText}>{data.weeksText}</span>}
              </div>
            )}
          </div>

          <div className={styles.cardsRow}>
            {/* Card 1 - Points */}
            <div className={styles.scheduleCard}>
              <div className={styles.cardHeaderOrange}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M12 6L13.5 9.5L17.5 10L14.5 12.5L15.5 16.5L12 14.5L8.5 16.5L9.5 12.5L6.5 10L10.5 9.5L12 6Z"
                      fill="white"
                      opacity="0.8"
                    />
                  </svg>
                </div>
                <h3 className={styles.cardTitleOrange}>{data.card1Title}</h3>
              </div>
              <div className={styles.cardBodyWhite}>
                {!!data.points?.length && (
                  <ul className={styles.pointsList}>
                    {data.points.map((point, i) => (
                      <li key={i}>
                        <span className={styles.listDot}></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                {data.cardFootnote && (
                  <div className={styles.cardFootnote}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                        fill="#e8600a"
                      />
                    </svg>
                    <span>{data.cardFootnote}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 2 - Daily Schedule */}
            <div className={styles.scheduleCard}>
              <div className={styles.cardHeaderGreen}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                      fill="white"
                    />
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="white" />
                  </svg>
                </div>
                <h3 className={styles.cardTitleGreen}>{data.card2Title}</h3>
              </div>
              <div className={styles.cardBodyWhite}>
                <div className={styles.scheduleBlock}>
                  {data.morningLabel && (
                    <div className={styles.schedulePeriod}>
                      <span className={styles.periodLabel}>{data.morningLabel}</span>
                    </div>
                  )}
                  {data.morningItems?.map((item, i) => (
                    <div className={styles.scheduleItem} key={`morning-${i}`}>
                      <span className={styles.scheduleTime}>{item.time}</span>
                      <span className={styles.scheduleActivity}>{item.activity}</span>
                    </div>
                  ))}

                  {data.breakText && (
                    <div className={styles.breakBlock}>
                      <span className={styles.breakIcon}>🍽️</span>
                      <span className={styles.breakText}>{data.breakText}</span>
                    </div>
                  )}

                  {data.eveningLabel && (
                    <div className={styles.schedulePeriod}>
                      <span className={styles.periodLabel}>{data.eveningLabel}</span>
                    </div>
                  )}
                  {data.eveningItems?.map((item, i) => (
                    <div className={styles.scheduleItem} key={`evening-${i}`}>
                      <span className={styles.scheduleTime}>{item.time}</span>
                      <span className={styles.scheduleActivity}>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      {!!data.galleryImages?.length && (
        <section className={styles.gallerySection}>
          <div className={styles.galleryContainer}>
            <div className={styles.galleryHeader}>
              {data.galleryBadge && <div className={styles.galleryBadge}>{data.galleryBadge}</div>}
              {data.galleryTitle && <h2 className={styles.galleryTitle}>{data.galleryTitle}</h2>}
              <div className={styles.galleryUnderline}></div>
              {data.gallerySubtitle && <p className={styles.gallerySubtitle}>{data.gallerySubtitle}</p>}
            </div>

            <div className={styles.triImageGrid}>
              {data.galleryImages.map((img, i) => (
                <div className={styles.triImageItem} key={i}>
                  {img.image && (
                    <Image
                      src={getImageUrl(img.image)}
                      alt={img.caption || "Gallery image"}
                      fill
                      sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 400px"
                      style={{ objectFit: "cover" }}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.imageOverlay}>
                    <div className={styles.imageOverlayContent}>
                      {img.caption && <div className={styles.imageCaption}>{img.caption}</div>}
                      {img.subcaption && <div className={styles.imageSubcaption}>{img.subcaption}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== KEY CONCEPTS + WHO CAN PARTICIPATE ===== */}
      <section className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <div className={styles.infoCardsRow}>
            {/* Box 1 — Definitions */}
            {!!data.terms?.length && (
              <div className={styles.definitionCard}>
                <div className={styles.definitionHeader}>
                  <div className={styles.definitionIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                        fill="#e8600a"
                      />
                    </svg>
                  </div>
                  <h3 className={styles.definitionTitle}>{data.definitionTitle}</h3>
                </div>
                <div className={styles.definitionBody}>
                  {data.terms.map((t, i) => (
                    <div className={styles.termBlock} key={i}>
                      <span className={styles.term}>{t.term}</span>
                      <p className={styles.termDesc}>{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Box 2 — Who can participate */}
            {!!data.participantList?.length && (
              <div className={styles.participantCard}>
                <div className={styles.participantHeader}>
                  <div className={styles.participantIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <h3 className={styles.participantTitle}>{data.participantTitle}</h3>
                </div>
                <div className={styles.participantBody}>
                  <ul className={styles.participantList}>
                    {data.participantList.map((item, i) => (
                      <li key={i}>
                        <span className={styles.listCheck}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#e8600a" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== INCLUDED IN FEE ===== */}
      <section className={styles.feeSection}>
        <div className={styles.feeContainer}>
          <div className={styles.feeHeader}>
            {data.feeBadge && <div className={styles.feeBadge}>{data.feeBadge}</div>}
            {data.feeTitle && <h2 className={styles.feeTitle}>{data.feeTitle}</h2>}
            <div className={styles.feeUnderline}></div>
          </div>

          <div className={styles.feeContent}>
            {!!data.includedItems?.length && (
              <div className={styles.includedGrid}>
                {data.includedItems.map((item, i) => (
                  <div className={styles.includedItem} key={i}>
                    <div className={styles.includedIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                          fill="#e8600a"
                        />
                      </svg>
                    </div>
                    <span className={styles.includedText}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.pricingCard}>
              {data.pricingBadge && <div className={styles.pricingBadge}>{data.pricingBadge}</div>}
              {(data.priceUSD || data.priceINR) && (
                <div className={styles.pricingAmount}>
                  {data.priceUSD && (
                    <>
                      <span className={styles.currency}>$</span>
                      {data.priceUSD}
                    </>
                  )}
                  {data.priceUSD && data.priceINR && <span className={styles.or}> / </span>}
                  {data.priceINR && <span className={styles.inr}>₹{data.priceINR}</span>}
                </div>
              )}
              {data.pricingDesc && <p className={styles.pricingDesc}>{data.pricingDesc}</p>}
              {data.pricingNote && (
                <div className={styles.pricingNote}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                      fill="#e8600a"
                    />
                  </svg>
                  <span>{data.pricingNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <HowToReach />
    </div>
  );
};

export default InnerTransformation;
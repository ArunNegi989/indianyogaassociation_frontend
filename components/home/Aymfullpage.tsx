"use client";

import React, { useEffect, useState } from "react";
import styles from "../../assets/style/Home/Aymfullpage.module.css";
import api from "@/lib/api";
import Image1 from "../../assets/images/mainimages/41592874560_6470157aa8_b.jpg";
import Image2 from "../../assets/images/mainimages/43290572152_f2f8ffa96a_b.jpg";
import Image from "next/image";
import Link from "next/link";

/* ══════════ TYPES ══════════ */
interface BodyPlane {
  label: string;
  listItem: string;
}
interface CampusFacility {
  bold: string;
  text: string;
  imageUrl?: string;
  imageAlt?: string;
}
interface PromoCard {
  title: string;
  text: string;
  link: string;
}
interface JourneyPara {
  text: string;
}

interface PageData {
  alignTitle: string;
  salutation: string;
  alignPara1: string;
  alignPara2: string;
  alignPara3: string;
  bodyPlanes: BodyPlane[];
  planesPara: string;
  bodyPlanesImage: string;
  bodyPlanesImageAlt: string;
  outdoorImage: string;
  outdoorImageAlt: string;
  outdoorCaption: string;
  highlight1: string;
  highlight2: string;
  campusTitle: string;
  campusFacilities: CampusFacility[];
  promoCard1: PromoCard;
  promoCard2: PromoCard;
  ctaHeading: string;
  ctaSubtext: string;
  whatsappLink: string;
  masterQuote: string;
  masterAttrib: string;
  journeyParas: JourneyPara[];
  namesteText: string;
}

/* ══════════ HELPERS ══════════ */
const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const toAbsUrl = (path: string | undefined | null): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE}${path}`;
};

const AUTO_IMG: React.CSSProperties = { width: "100%", height: "auto" };

const IMG_W = 1600;
const IMG_H = 900;

const FALLBACK_CAMPUS_IMAGES = [
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
  "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
  "https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=800&q=80",
];

/* ══════════ COMPONENT ══════════ */
const AYMFullPage: React.FC = () => {
  const [data, setData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/aym-full-page/get");
        const raw = res.data.data;
        if (!raw) {
          setError("Content not found.");
          return;
        }

        setData({
          alignTitle: raw.alignTitle ?? "",
          salutation: raw.salutation ?? "",
          alignPara1: raw.alignPara1 ?? "",
          alignPara2: raw.alignPara2 ?? "",
          alignPara3: raw.alignPara3 ?? "",
          bodyPlanes: raw.bodyPlanes ?? [],
          planesPara: raw.planesPara ?? "",
          bodyPlanesImage: toAbsUrl(raw.bodyPlanesImage),
          bodyPlanesImageAlt: raw.bodyPlanesImageAlt ?? "",
          outdoorImage: toAbsUrl(raw.outdoorImage),
          outdoorImageAlt: raw.outdoorImageAlt ?? "",
          outdoorCaption: raw.outdoorCaption ?? "",
          highlight1: raw.highlight1 ?? "",
          highlight2: raw.highlight2 ?? "",
          campusTitle: raw.campusTitle ?? "",
          campusFacilities: (raw.campusFacilities ?? []).map((f: any) => ({
            bold: f.bold ?? "",
            text: f.text ?? "",
            imageUrl: toAbsUrl(f.imageUrl),
            imageAlt: f.imageAlt ?? "",
          })),
          promoCard1: {
            title: raw.promoCard1?.title ?? "",
            text: raw.promoCard1?.text ?? "",
            link: raw.promoCard1?.link ?? "#",
          },
          promoCard2: {
            title: raw.promoCard2?.title ?? "",
            text: raw.promoCard2?.text ?? "",
            link: raw.promoCard2?.link ?? "#",
          },
          ctaHeading: raw.ctaHeading ?? "",
          ctaSubtext: raw.ctaSubtext ?? "",
          whatsappLink: raw.whatsappLink ?? "#",
          masterQuote: raw.masterQuote ?? "",
          masterAttrib: raw.masterAttrib ?? "",
          journeyParas: raw.journeyParas ?? [],
          namesteText: raw.namesteText ?? "",
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className={`${styles.pageWrapper} ${styles.stateBox}`}>
        <p className={styles.stateText}>Loading…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !data) {
    return (
      <div className={`${styles.pageWrapper} ${styles.stateBox}`}>
        <p className={`${styles.stateText} ${styles.stateError}`}>
          {error ?? "Content unavailable."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* ══════════ ALIGNMENT SECTION ══════════ */}
      <section className={styles.alignSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2
              className={styles.sectionTitle}
              dangerouslySetInnerHTML={{ __html: data.alignTitle }}
            />
            <div className={styles.titleUnderline} />
          </div>

          <p className={styles.salutation}>{data.salutation}</p>

          <div
            className={styles.para}
            dangerouslySetInnerHTML={{ __html: data.alignPara1 }}
          />
          <div
            className={styles.para}
            dangerouslySetInnerHTML={{ __html: data.alignPara2 }}
          />
          <div
            className={styles.para}
            dangerouslySetInnerHTML={{ __html: data.alignPara3 }}
          />

          {/* Body planes grid */}
          <div className={styles.planesGrid}>
            <div className={styles.planesImageBlock}>
              <div className={styles.planesImagePlaceholder}>
                {data.bodyPlanesImage ? (
                  <div className={styles.diagramBox}>
                    <Image
                      src={data.bodyPlanesImage}
                      alt={
                        data.bodyPlanesImageAlt || "Yoga body planes diagram"
                      }
                      width={IMG_W}
                      height={IMG_H}
                      sizes="(max-width: 860px) 100vw, 50vw"
                      className={styles.diagramImage}
                      style={AUTO_IMG}
                      loading="lazy"
                    />
                    {data.bodyPlanes.length > 0 && (
                      <div className={styles.diagramLabelsRow}>
                        {data.bodyPlanes.map((plane, i) => (
                          <div key={i} className={styles.diagramLabel}>
                            {plane.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className={styles.planesInfoBlock}>
              <div
                className={styles.para}
                dangerouslySetInnerHTML={{ __html: data.planesPara }}
              />
              {data.bodyPlanes.length > 0 && (
                <ol className={styles.planesList}>
                  {data.bodyPlanes.map((plane, i) => (
                    <li key={i} className={styles.planesListItem}>
                      {plane.listItem}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Highlight paragraph */}
          <p className={styles.para}>
            According to Yogi Chetan Mahesh, every Yoga student or Yoga teacher
            trainer should master all exercises, such as flexion, extension,
            dorsiflexion, abduction, and adduction, among others, during asana
            practice. While searching for your Yoga training school, You should
            search for{" "}
            <strong className={styles.highlight}>{data.highlight1}</strong> or{" "}
            <strong className={styles.highlight}>{data.highlight2}</strong>
          </p>

          {/* Outdoor group photo */}
          {data.outdoorImage && (
            <div className={styles.groupPhotoBlock}>
              <div className={styles.groupPhotoBanner}>
                <Image
                  src={data.outdoorImage}
                  alt={data.outdoorImageAlt || "Outdoor Yoga Practice"}
                  width={IMG_W}
                  height={IMG_H}
                  sizes="100vw"
                  className={styles.groupPhotoImg}
                  style={AUTO_IMG}
                  loading="lazy"
                />
                {data.outdoorCaption && (
                  <div className={styles.groupPhotoOverlay}>
                    <span className={styles.groupPhotoText}>
                      {data.outdoorCaption}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ CAMPUS SECTION ══════════ */}
      <section className={styles.campusSection}>
        <div className={styles.a} />
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2
              className={styles.sectionTitle}
              dangerouslySetInnerHTML={{ __html: data.campusTitle }}
            />
            <div className={styles.titleUnderline} />
          </div>

          {/* Facilities — alternating */}
          <div className={styles.facilitiesList}>
            {data.campusFacilities.map((f, i) => {
              const imgSrc =
                f.imageUrl ||
                FALLBACK_CAMPUS_IMAGES[i % FALLBACK_CAMPUS_IMAGES.length];
              const imgAlt = f.imageAlt || f.bold || "Campus facility";

              return (
                <div key={i} className={styles.facilityItem}>
                  <div className={styles.facilityContent}>
                    <div className={styles.facilityHeader}>
                      <span className={styles.facilityDot}>✦</span>
                      <strong className={styles.facilityBold}>{f.bold}</strong>
                    </div>
                    <div className={styles.facilityUnderline} />
                    <div
                      className={styles.facilityText}
                      dangerouslySetInnerHTML={{ __html: f.text }}
                    />
                  </div>

                  <div className={styles.facilityImageWrap}>
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      width={IMG_W}
                      height={IMG_H}
                      sizes="(max-width: 860px) 100vw, 50vw"
                      className={styles.facilityImage}
                      style={AUTO_IMG}
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promo cards */}
          <div className={styles.promoCards}>
            <div className={styles.promoCard}>
              <div className={styles.promoContent}>
                <h3
                  className={styles.promoTitle}
                  dangerouslySetInnerHTML={{ __html: data.promoCard1.title }}
                />
                <div className={styles.promoUnderline} />
                <div
                  className={styles.promoText}
                  dangerouslySetInnerHTML={{ __html: data.promoCard1.text }}
                />
                <Link href={data.promoCard1.link} className={styles.promoLink}>
                  More information →
                </Link>
              </div>

              <div className={styles.promoImageWrap}>
                <Image
                  src={Image1}
                  alt="AYM Yoga promo"
                  className={styles.promoImage}
                  sizes="(max-width: 860px) 100vw, 50vw"
                  style={AUTO_IMG}
                />
              </div>
            </div>

            <div className={styles.promoCard}>
              <div className={styles.promoContent}>
                <h3
                  className={styles.promoTitle}
                  dangerouslySetInnerHTML={{ __html: data.promoCard2.title }}
                />
                <div className={styles.promoUnderline} />
                <div
                  className={styles.promoText}
                  dangerouslySetInnerHTML={{ __html: data.promoCard2.text }}
                />
                <Link href={data.promoCard2.link} className={styles.promoLink}>
                  More information →
                </Link>
              </div>

              <div className={styles.promoImageWrap}>
                <Image
                  src={Image2}
                  alt="AYM Yoga promo"
                  className={styles.promoImage}
                  sizes="(max-width: 860px) 100vw, 50vw"
                  style={AUTO_IMG}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottomBorder} />
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaContent}>
          <h2
            className={styles.ctaHeading}
            dangerouslySetInnerHTML={{ __html: data.ctaHeading }}
          />
          <div
            className={styles.ctaSubtext}
            dangerouslySetInnerHTML={{ __html: data.ctaSubtext }}
          />

          <Link
            href={`https://wa.me/919528023390?text=${encodeURIComponent(
              "Hello, I want to know more about your training course.",
            )}`}
            className={styles.whatsappBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.waIcon}>💬</span> Chat with Us on WhatsApp
          </Link>
        </div>

        <div className={styles.masterQuoteBlock}>
          <div
            className={styles.masterQuote}
            dangerouslySetInnerHTML={{ __html: data.masterQuote }}
          />
          <div className={styles.masterAttrib}>{data.masterAttrib}</div>
        </div>

        <div className={styles.container}>
          <div className={styles.journeyText}>
            <div className={styles.journeyContent}>
              {data.journeyParas.map((para, i) => {
                const isLast = i === data.journeyParas.length - 1;
                return (
                  <div
                    key={i}
                    className={
                      isLast ? `${styles.para} ${styles.namaste}` : styles.para
                    }
                    dangerouslySetInnerHTML={{ __html: para.text }}
                  />
                );
              })}

              {data.namesteText && (
                <p className={`${styles.para} ${styles.namaste}`}>
                  {data.namesteText} <strong>Namaste!</strong>
                </p>
              )}
            </div>

            {data.outdoorImage && (
              <div className={styles.journeyImage}>
                <div className={styles.journeyImageWrapper}>
                  <Image
                    src={data.outdoorImage}
                    alt={data.outdoorImageAlt || "Yoga Journey"}
                    width={IMG_W}
                    height={IMG_H}
                    sizes="(max-width: 860px) 100vw, 50vw"
                    style={AUTO_IMG}
                    loading="lazy"
                  />
                </div>
                {data.outdoorCaption && (
                  <p className={styles.journeyImageCaption}>
                    {data.outdoorCaption}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AYMFullPage;

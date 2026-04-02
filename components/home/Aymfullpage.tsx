"use client";

import React, { useEffect, useState } from "react";
import styles from "../../assets/style/Home/Aymfullpage.module.css";
import api from "@/lib/api";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   HELPER — relative path → absolute URL
══════════════════════════════════════════════ */
const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const toAbsUrl = (path: string | undefined | null): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE}${path}`;
};

/* ══════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════ */
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
      <div
        className={styles.pageWrapper}
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            color: "#a07840",
            fontStyle: "italic",
          }}
        >
          Loading…
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !data) {
    return (
      <div
        className={styles.pageWrapper}
        style={{
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#c44a00",
            fontStyle: "italic",
          }}
        >
          {error ?? "Content unavailable."}
        </p>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className={styles.pageWrapper}>
      {/* ══════════ ALIGNMENT SECTION ══════════ */}
      <section className={styles.alignSection}>
        <div className={styles.container}>
          {/* Section heading — rich text */}
          <div className={styles.sectionHeaderCenter}>
            <h2
              className={styles.sectionTitle}
              dangerouslySetInnerHTML={{ __html: data.alignTitle }}
            />
            <div className={styles.titleUnderline} />
          </div>

          {/* Salutation — plain text */}
          <p className={styles.salutation}>{data.salutation}</p>

          {/* Body paragraphs — rich text */}
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
            {/* Diagram image */}
            <div className={styles.planesImageBlock}>
              <div className={styles.planesImagePlaceholder}>
                {data.bodyPlanesImage ? (
                  <div className={styles.diagramBox}>
                    <img
                      src={data.bodyPlanesImage}
                      alt={
                        data.bodyPlanesImageAlt || "Yoga body planes diagram"
                      }
                      className={styles.diagramImage}
                    />
                    {/* Diagram labels from bodyPlanes array */}
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

            {/* Planes info — rich text intro + numbered list */}
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

          {/* Highlight paragraph — plain text injected into rich context */}
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
                <img
                  src={data.outdoorImage}
                  alt={data.outdoorImageAlt || "Outdoor Yoga Practice"}
                  className={styles.groupPhotoImg}
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
        <div className={styles.topBorder} />
        <div className={styles.container}>
          {/* Campus heading — rich text */}
          <div className={styles.sectionHeaderCenter}>
            <h2
              className={styles.sectionTitle}
              dangerouslySetInnerHTML={{ __html: data.campusTitle }}
            />
            <div className={styles.titleUnderline} />
          </div>

          {/* Facilities list */}
          <div className={styles.facilitiesList}>
            {data.campusFacilities.map((f, i) => (
              <div key={i} className={styles.facilityItem}>
                <div className={styles.facilityHeader}>
                  <span className={styles.facilityDot}>✦</span>
                  <strong className={styles.facilityBold}>{f.bold}</strong>
                </div>
                {/* facility text — rich text */}
                <div
                  className={styles.facilityText}
                  dangerouslySetInnerHTML={{ __html: f.text }}
                />
                {/* optional facility photo */}
                {f.imageUrl && (
                  <img
                    src={f.imageUrl}
                    alt={f.imageAlt || f.bold}
                    className={styles.facilityImage}
                    style={{
                      marginTop: "0.75rem",
                      maxWidth: "100%",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Promo cards */}
          <div className={styles.promoCards}>
            {/* Promo Card 1 */}
            <div className={styles.promoCard}>
              <h3
                className={styles.promoTitle}
                dangerouslySetInnerHTML={{ __html: data.promoCard1.title }}
              />
              <div className={styles.promoUnderline} />
              <div
                className={styles.promoText}
                dangerouslySetInnerHTML={{ __html: data.promoCard1.text }}
              />
              <a href={data.promoCard1.link} className={styles.promoLink}>
                More information →
              </a>
            </div>

            {/* Promo Card 2 */}
            <div className={styles.promoCard}>
              <h3
                className={styles.promoTitle}
                dangerouslySetInnerHTML={{ __html: data.promoCard2.title }}
              />
              <div className={styles.promoUnderline} />
              <div
                className={styles.promoText}
                dangerouslySetInnerHTML={{ __html: data.promoCard2.text }}
              />
              <a href={data.promoCard2.link} className={styles.promoLink}>
                More information →
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottomBorder} />
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaContent}>
          {/* CTA heading — rich text */}
          <h2
            className={styles.ctaHeading}
            dangerouslySetInnerHTML={{ __html: data.ctaHeading }}
          />

          {/* CTA subtext — rich text */}
          <div
            className={styles.ctaSubtext}
            dangerouslySetInnerHTML={{ __html: data.ctaSubtext }}
          />

          <a href={data.whatsappLink} className={styles.whatsappBtn}>
            <span className={styles.waIcon}>💬</span> Chat with Us on WhatsApp
          </a>
        </div>

        {/* Master quote block — rich text */}
        <div className={styles.masterQuoteBlock}>
          <div
            className={styles.masterQuote}
            dangerouslySetInnerHTML={{ __html: data.masterQuote }}
          />
          <div className={styles.masterAttrib}>{data.masterAttrib}</div>
        </div>

        {/* Journey paragraphs — rich text */}
        <div className={styles.container}>
          <div className={styles.journeyText}>
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

            {/* Closing namaste line */}
            {data.namesteText && (
              <p className={`${styles.para} ${styles.namaste}`}>
                {data.namesteText} <strong>Namaste!</strong>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AYMFullPage;

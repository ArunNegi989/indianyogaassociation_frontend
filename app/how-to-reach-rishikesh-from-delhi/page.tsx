"use client";
import React, {  useEffect, useRef, useState } from "react";
import styles from "@/assets/style/how-to-reach-rishikesh-from-delhi/Howtoreach.module.css";
import howtoreachusimage from "@/assets/images/how-to-reach-aym-yoga-school.jpg"
import Image from "next/image";

const TaxiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
    <circle cx="7.5" cy="17.5" r="1.5" />
    <circle cx="16.5" cy="17.5" r="1.5" />
    <path d="M5 9h14" />
  </svg>
);

const BusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="14" rx="2" />
    <path d="M3 9h18M8 21h8M12 17v4" />
    <circle cx="7" cy="17" r="1" />
    <circle cx="17" cy="17" r="1" />
  </svg>
);

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

const TrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="14" rx="3" />
    <path d="M4 11h16M8 19l-2 2M16 19l2 2M12 17v2" />
    <circle cx="9" cy="15" r="1" fill="currentColor" />
    <circle cx="15" cy="15" r="1" fill="currentColor" />
  </svg>
);

const transportCards = [
  {
    id: "taxi",
    title: "Taking the Taxi",
    subtitle: "Most convenient option",
    tag: "RECOMMENDED",
    Icon: TaxiIcon,
    color: "orange",
    content: (
      <>
        <p>AYM can arrange taxi pickup from the Delhi airport or the Dehradun airport. Charges for these services are as follows:</p>
        <div className={styles.pricingList}>
          <div className={styles.priceItem}>
            <span className={styles.priceFrom}>From Delhi</span>
            <span className={styles.priceAmount}>$90 <small>single</small></span>
          </div>
          <div className={styles.priceItem}>
            <span className={styles.priceFrom}>From Delhi</span>
            <span className={styles.priceAmount}>$150 <small>round trip</small></span>
          </div>
          <div className={styles.priceItem}>
            <span className={styles.priceFrom}>From Dehradun</span>
            <span className={styles.priceAmount}>$20</span>
          </div>
          <div className={styles.priceItem}>
            <span className={styles.priceFrom}>From Haridwar</span>
            <span className={styles.priceAmount}>$25</span>
          </div>
        </div>
        <p>Taxis will be available as you come out of the airports. Have the AYM address and contact information handy in case you need to contact us for directions!</p>
        <p>If you are feeling a bit nervous about getting here, don't worry — you can give us a call and we can help you through the process.</p>
      </>
    ),
  },
  {
    id: "bus",
    title: "Taking the Bus",
    subtitle: "Budget-friendly route",
    tag: "7–8 HRS",
    Icon: BusIcon,
    color: "teal",
    content: (
      <>
        <p>If you decide to take a bus to Rishikesh from the Delhi airport, you will first need to get to the ISBT (bus stand) by taxi. You can use <a href="http://www.upsrtc.com" target="_blank" rel="noopener noreferrer">upsrtc.com</a> to book your bus ticket beforehand.</p>
        <p>The bus ride from Delhi will take around <strong>7–8 hours</strong>.</p>
        <p>The Delhi bus stand is located <strong>30 km's</strong> from the airport. From there, take a bus to Rishikesh — a <strong>230 km</strong> ride. Once you arrive, a rickshaw / tuk tuk will take you to the AYM school.</p>
      </>
    ),
  },
  {
    id: "flight",
    title: "Taking the Plane",
    subtitle: "Fastest option via Dehradun",
    tag: "45 MIN FLIGHT",
    Icon: PlaneIcon,
    color: "blue",
    content: (
      <>
        <p>Wherever you're coming from, <strong>Indira Gandhi International Airport (IGI)</strong> in Delhi will be your entry point into India.</p>
        <p>There are no direct flights to Rishikesh. Your next destination will be <strong>Dehradun's Jolly Grant Airport</strong>.</p>
        <p>Catch a connecting flight from Delhi to Jolly Grant Airport in Dehradun (approx. 45 mins), then take a taxi directly to the AYM School — just <strong>23 km</strong> away.</p>
      </>
    ),
  },
  {
    id: "train",
    title: "Taking the Train",
    subtitle: "Scenic journey via Haridwar",
    tag: "VIA HARIDWAR",
    Icon: TrainIcon,
    color: "green",
    content: (
      <>
        <p>You can take a train from Delhi to Haridwar. From the Delhi airport, head to the <strong>Delhi Railway Station</strong> by taxi (22 km away), then board a train to Haridwar.</p>
        <p>From Haridwar, catch a bus to Rishikesh (<strong>29 km</strong>) and then a taxi to the AYM School.</p>
        <p className={styles.noteBox}><strong>Note:</strong> There are no direct trains to Rishikesh — you must go to Haridwar first if you decide to travel by train.</p>
      </>
    ),
  },
];

const HowToReach: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [headerVisible, setHeaderVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setVisibleCards((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.12 }
    );
    cardRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });

    const headerObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (headerRef.current) headerObs.observe(headerRef.current);

    const mapObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setMapVisible(true); },
      { threshold: 0.1 }
    );
    if (mapRef.current) mapObs.observe(mapRef.current);

    return () => { observer.disconnect(); headerObs.disconnect(); mapObs.disconnect(); };
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.grainOverlay} />
      <div className={styles.orbOrange} />
      <div className={styles.orbTeal} />

      <section className={styles.pageWrap}>

        {/* HEADER */}
        <div ref={headerRef} className={`${styles.headerWrap} ${headerVisible ? styles.headerIn : ""}`}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Travel Guide
            <span className={styles.eyebrowDot} />
          </span>

          <h1 className={styles.mainTitle}>
            How to Reach{" "}
            <span className={styles.titleHighlight}>Rishikesh</span>
            {" "}From Delhi
          </h1>

          <div className={styles.titleDivider}>
            <span className={styles.divLine} />
            <span className={styles.divOm}>✦</span>
            <span className={styles.divLine} />
          </div>

          <p className={styles.headerSubtext}>
            AYM Yoga School is nestled in the beautiful hills of <strong>Tapovan, Rishikesh</strong>.
            Depending on which Indian airport you fly into, there are several ways to reach us.
            Please read the following to understand your best travel option.
          </p>
        </div>

        {/* SECTION LABEL */}
        <div className={styles.sectionDivider}>
          <div className={styles.sdLine} />
          <span className={styles.sdLabel}>✦ Choose Your Route ✦</span>
          <div className={styles.sdLine} />
        </div>

        {/* CARDS */}
        <div className={styles.cardsGrid}>
          {transportCards.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className={`${styles.card} ${styles[`card_${card.color}`]} ${visibleCards.has(idx) ? styles.cardVisible : ""}`}
              style={{ "--delay": `${idx * 0.13}s` } as React.CSSProperties}
            >
              <div className={styles.cardShimmer} />
              <div className={styles.cTL} />
              <div className={styles.cBR} />

              <div className={`${styles.cardTag} ${styles[`tag_${card.color}`]}`}>{card.tag}</div>

              <div className={styles.cardTop}>
                <div className={`${styles.iconCircle} ${styles[`icon_${card.color}`]}`}>
                  <card.Icon />
                </div>
                <div className={styles.cardTitleBlock}>
                  <h2 className={styles.cardTitle}>{card.title}</h2>
                  <p className={styles.cardSubtitle}>{card.subtitle}</p>
                </div>
              </div>

              <div className={`${styles.accentBar} ${styles[`bar_${card.color}`]}`} />

              <div className={styles.cardBody}>{card.content}</div>
            </div>
          ))}
        </div>

        {/* MAP DIVIDER */}
        <div className={styles.sectionDivider} style={{ marginTop: "3.5rem" }}>
          <div className={styles.sdLine} />
          <span className={styles.sdLabel}>✦ Route Overview Map ✦</span>
          <div className={styles.sdLine} />
        </div>

        {/* MAP */}
        <div ref={mapRef} className={`${styles.mapWrap} ${mapVisible ? styles.mapIn : ""}`}>
          <div className={styles.mapFrame}>
            <div className={styles.mTL} />
            <div className={styles.mTR} />
            <div className={styles.mBL} />
            <div className={styles.mBR} />
           <Image
  src={howtoreachusimage}
  alt="Route map to AYM Yoga School Rishikesh"
  className={styles.mapImage}
  width={800}   // required
  height={500}  // required
/>
          </div>
          <p className={styles.mapCaption}>
            <span className={styles.mapCaptionDot} />
            Route map — all travel options to AYM Yoga School, Rishikesh
            <span className={styles.mapCaptionDot} />
          </p>
        </div>

      </section>
      
    </div>
  );
};

export default HowToReach;
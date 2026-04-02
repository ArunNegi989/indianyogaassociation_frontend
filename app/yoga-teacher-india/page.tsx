"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-teacher-india/yogateacherindia.module.css";
interface ImgItem {
  src: string;
  label: string;
}
const STATS = [
  { value: "20+", label: "Years Experience" },
  { value: "15,000+", label: "Students Trained" },
  { value: "12+", label: "Countries Visited" },
  { value: "2000", label: "Himalayan Pilgrimage" },
];

const YOGA_STYLES = [
  "Hatha Yoga",
  "Ashtanga Yoga",
  "Kundalini",
  "Pranayama",
  "Meditation",
  "Yoga Anatomy",
];

const ACCREDITATIONS = [
  "Certified by Yoga Alliance USA (RYT 500)",
  "International Yoga Federation Certified",
  "Master of Science in Yoga (2003)",
  "Morarji Desai National Institute of Yoga – Diploma Topper (1st Division, 1999–2000)",
  "Certified Yoga Speaker – XIth International Yoga Festival, Pondicherry (2003)",
];

/* ── Postures Row 1 (Image 2) ── */
const POSTURES_ROW1: ImgItem[] = [
  {
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=95&auto=format&fit=crop",
    label: "Ekapada Koundinyasana",
  },
  {
    src: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200&q=95&auto=format&fit=crop",
    label: "Dragon Fly Pose",
  },
  {
    src: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1200&q=95&auto=format&fit=crop",
    label: "Ekapada Galvasana (Flying Pigeon Pose)",
  },
  {
    src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=95&auto=format&fit=crop",
    label: "Hanumanasana",
  },
];

/* ── Postures Row 2 (Image 3) ── */
const POSTURES_ROW2: ImgItem[] = [
  {
    src: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=1200&q=95&auto=format&fit=crop",
    label: "Purna Natrajasana",
  },
  {
    src: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=1200&q=95&auto=format&fit=crop",
    label: "Urdhva Dhanurasana or Chakrasana",
  },
  {
    src: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=95&auto=format&fit=crop",
    label: "Vrischikasana",
  },
  {
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=95&auto=format&fit=crop",
    label: "Advance Purna Natraj Asana",
  },
];

/* ── Gallery / Teaching photos (Image 4) ── */
const GALLERY_IMAGES: ImgItem[] = [
  {
    src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1200&q=95&auto=format&fit=crop",
    label: "Eka Pada Chakrasana",
  },
  {
    src: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=95&auto=format&fit=crop",
    label: "Purna Kapotasan",
  },
  {
    src: "https://images.unsplash.com/photo-1510894347713-fc3dc6166b26?w=1200&q=95&auto=format&fit=crop",
    label: "Virabhadrasana (Traditional)",
  },
  {
    src: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1200&q=95&auto=format&fit=crop",
    label: "Eka Pada Bakasana",
  },
  {
    src: "https://images.unsplash.com/photo-1601925228847-f3f38c47b0e2?w=1200&q=95&auto=format&fit=crop",
    label: "Yoga with Retreat's Students",
  },
  {
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=95&auto=format&fit=crop",
    label: "Yoga Postures",
  },
  {
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=95&auto=format&fit=crop",
    label: "Meditation in India",
  },
  {
    src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=95&auto=format&fit=crop",
    label: "Asana in Water",
  },
];

/* ── Certificates Row 1 (Image 5) ── */
const CERTS_ROW1: ImgItem[] = [
  {
    src: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=1000&q=90&auto=format&fit=crop",
    label: "By Japan Fitness Yoga Association",
  },
  {
    src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000&q=90&auto=format&fit=crop",
    label: "By Morarji Desai National Inst.",
  },
  {
    src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1000&q=90&auto=format&fit=crop",
    label: "By True Fitness",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&q=90&auto=format&fit=crop",
    label: "By Yoga Corea Corp.",
  },
];

/* ── Certificates Row 2 (Image 6) ── */
const CERTS_ROW2: ImgItem[] = [
  {
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1000&q=90&auto=format&fit=crop",
    label: "By Maharashi Dayanand University",
  },
  {
    src: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=1000&q=90&auto=format&fit=crop",
    label: "By India Trade Promotion Org.",
  },
  {
    src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1000&q=90&auto=format&fit=crop",
    label: "By Yoga School, China",
  },
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&q=90&auto=format&fit=crop",
    label: "By Maharashi Dayanand University",
  },
];

/* ── South Korea (Image 7) ── */
const SOUTH_KOREA: ImgItem[] = [
  {
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&q=90&auto=format&fit=crop",
    label: "South Korea",
  },
  {
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1000&q=90&auto=format&fit=crop",
    label: "South Korea",
  },
  {
    src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1000&q=90&auto=format&fit=crop",
    label: "South Korea",
  },
  {
    src: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1000&q=90&auto=format&fit=crop",
    label: "South Korea",
  },
];

/* ── Malaysia (Image 8) ── */
const MALAYSIA: ImgItem[] = [
  {
    src: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&q=90&auto=format&fit=crop",
    label: "Malaysia",
  },
  {
    src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1000&q=90&auto=format&fit=crop",
    label: "Malaysia",
  },
  {
    src: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=1000&q=90&auto=format&fit=crop",
    label: "Malaysia",
  },
  {
    src: "https://images.unsplash.com/photo-1510894347713-fc3dc6166b26?w=1000&q=90&auto=format&fit=crop",
    label: "Malaysia",
  },
];

interface LightboxProps {
  images: ImgItem[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const img = images[activeIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className={styles.lbOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.lbPanel} onClick={(e) => e.stopPropagation()}>
        {/* counter */}
        <span className={styles.lbCounter}>
          {activeIndex + 1}
          <span className={styles.lbSlash}>/</span>
          {images.length}
        </span>

        {/* close */}
        <button className={styles.lbClose} onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* image + side arrows */}
        <div className={styles.lbBody}>
          {images.length > 1 && (
            <button
              className={`${styles.lbArrow} ${styles.lbArrowL}`}
              onClick={onPrev}
              aria-label="Previous"
            >
              ‹
            </button>
          )}
          <div className={styles.lbImgBox}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={img.src}
              src={img.src}
              alt={img.label}
              className={styles.lbImg}
            />
          </div>
          {images.length > 1 && (
            <button
              className={`${styles.lbArrow} ${styles.lbArrowR}`}
              onClick={onNext}
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>

        {/* caption */}
        <div className={styles.lbCaption}>
          <span className={styles.lbCaptionText}>{img.label}</span>
        </div>
      </div>
    </div>
  );
};

interface ClickCardProps {
  item: ImgItem;
  pool: ImgItem[];
  cardCls: string;
  imgCls: string;
  lblCls: string;
  aspect?: string;
  onOpen: (pool: ImgItem[], index: number) => void;
}

const ClickCard: React.FC<ClickCardProps> = ({
  item,
  pool,
  cardCls,
  imgCls,
  lblCls,
  onOpen,
}) => {
  const idx = pool.findIndex((p) => p.src === item.src);
  return (
    <button
      type="button"
      className={cardCls}
      onClick={() => onOpen(pool, idx)}
      aria-label={`View ${item.label}`}
    >
      <img
        src={item.src.replace("w=1200", "w=600").replace("w=1000", "w=500")}
        alt={item.label}
        className={imgCls}
        loading="lazy"
      />
      <div className={styles.cardHover}>
        <span className={styles.cardZoom}>⊕</span>
      </div>
      <div className={lblCls}>{item.label}</div>
    </button>
  );
};

/* ================================================================
   SMALL SHARED COMPONENTS
   ================================================================ */
const BorderStrip: React.FC = () => <div className={styles.borderStrip} />;

const OmDivider: React.FC<{ small?: boolean }> = ({ small }) => (
  <div className={styles.omDivider}>
    <div className={styles.divLine} />
    <span
      className={styles.omSym}
      style={small ? { fontSize: "1.4rem" } : undefined}
    >
      ॐ
    </span>
    <div className={styles.divLine} />
  </div>
);

const SecHeader: React.FC<{ sup: string; title: string }> = ({
  sup,
  title,
}) => (
  <div className={styles.secHeader}>
    <div className={styles.superTitle}>{sup}</div>
    <h2 className={styles.mainTitle}>{title}</h2>
    <OmDivider />
  </div>
);

const CountryHeading: React.FC<{ name: string }> = ({ name }) => (
  <div className={styles.countryHead}>{name}</div>
);

/* ================================================================
   PAGE
   ================================================================ */
const YogiChetanMaheshPage: React.FC = () => {
  /* lightbox state */
  const [lbPool, setLbPool] = useState<ImgItem[]>([]);
  const [lbIdx, setLbIdx] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);

  const openModal = useCallback((pool: ImgItem[], idx: number) => {
    setLbPool(pool);
    setLbIdx(idx);
    setLbOpen(true);
  }, []);

  const closeModal = useCallback(() => setLbOpen(false), []);
  const prevImg = useCallback(
    () => setLbIdx((i) => (i - 1 + lbPool.length) % lbPool.length),
    [lbPool.length],
  );
  const nextImg = useCallback(
    () => setLbIdx((i) => (i + 1) % lbPool.length),
    [lbPool.length],
  );
  const jumpImg = useCallback((i: number) => setLbIdx(i), []);

  return (
    <div className={styles.page}>
      {/* Modal */}
      {lbOpen && lbPool.length > 0 && (
        <Lightbox
          images={lbPool}
          activeIndex={lbIdx}
          onClose={closeModal}
          onPrev={prevImg}
          onNext={nextImg}
          onJump={jumpImg}
        />
      )}

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SECTION 1 — BIOGRAPHY
      ═══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          {/* ── Header ── */}
          <div className={styles.bioHeader}>
            <div className={styles.superTitle}>
              The Founder &amp; Spiritual Guide
            </div>
            <h1 className={styles.heroTitle}>YOGI CHETAN MAHESH JI</h1>
            <OmDivider />
          </div>

          {/* ── Profile Image (centred, large) ── */}
          <div className={styles.profileWrap}>
            <div className={styles.profileFrame}>
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=90&auto=format&fit=crop"
                alt="Yogi Chetan Mahesh Ji – Spiritual Yoga Master, AYM Yoga School Rishikesh"
                width={900}
                height={560}
                className={styles.profileImg}
                priority
              />
              {/* overlay badge */}
              <div className={styles.profileBadge}>
                <p>Yogi Chetan Mahesh</p>
                <p>Member Of</p>
                <p>AYM Yoga School</p>
              </div>
              <div className={styles.profileShade} />
            </div>
          </div>
          {/* ── Stats ── */}
          <div className={styles.statsRow}>
            {STATS.map((s) => (
              <div className={styles.statCard} key={s.label}>
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statLbl}>{s.label}</span>
              </div>
            ))}
          </div>
          {/* ── Biography Text (full width below image) ── */}
          <div className={styles.bioBody}>
            {/* left column */}
            <div className={styles.bioLeft}>
              <div className={styles.para}>
                <p>
                  <span className={styles.hl}>Yogi Chetan Mahesh Ji</span> is
                  the founder &amp; director of AYM Yoga School. He has an
                  experience of over <span className={styles.hl}>20 years</span>{" "}
                  in practicing and teaching Hatha yoga and Ashtanga yoga. He is
                  the best spiritual yoga master in Rishikesh who not only
                  practices yoga daily, but also imbibes yogic lifestyle among
                  his students by giving tips and points. Till date he and his
                  group of teachers have taught over{" "}
                  <span className={styles.hl}>15,000 yoga students</span> at AYM
                  who have passed out from the institution as successful yoga
                  teachers. And due to this reason, he is considered as one of
                  the best yoga instructors in India.
                </p>

                <p>
                  In <span className={styles.hl}>1999–2000</span>, he was
                  awarded for scoring meritorious (1st) position in Diploma in
                  Yoga by Morarji Desai National Institute of Yoga. In October
                  2001, he represented Swami Vivekananda College of Delhi
                  University and was one of the 3 judges at Delhi State Yoga
                  Championship held in Bal Bharti Public School. He was awarded
                  as certified yoga speaker at the XIth International Yoga
                  Festival held in 2003 in Pondicherry.
                </p>

                <p>
                  He was a continuous yoga sports champion for five years in
                  college and won All India Inter University Yoga Championship.
                  In 2000 he achieved another milestone when he was deputed to{" "}
                  <span className={styles.hl}>Germany</span> by the Government
                  of India to teach and promote yoga there. While in Germany
                  Mahesh Ji taught students the importance and its need in day
                  to day life to remain fit and healthy. He furthered his
                  qualification by doing a Masters in yoga anatomy yoga
                  physiology and teaching methodology. He is a certified yoga
                  master in India who also has certification from{" "}
                  <span className={styles.hl}>Yoga Alliance, USA</span>.
                </p>

                <p>
                  Yogi Chetan Mahesh choose Rishikesh to set up his school as he
                  understands and recognizes the city as one of historic
                  importance when it comes to teaching yoga and meditation.
                  Rishikesh is also known as the epicentre of yoga and
                  meditation all across the globe as it provides complete peace,
                  calm and connectivity with nature with the presence of
                  Himalayas and river Ganga, also known as the river of gods,
                  that was brought on earth to purify humans and lighten up
                  spirituality in them, according to Hindu mythology and
                  religious history.
                </p>
              </div>

              {/* Pull quote */}
              <div className={styles.pullQuote}>
                <span className={styles.qm}>"</span>
                Yoga is not just about touching your toes, it&apos;s about what
                you learn on the way down
                <span className={styles.qm}>"</span>
              </div>

              {/* Yoga style chips */}
              <div className={styles.stylesBlock}>
                <div className={styles.stylesTitle}>
                  Master of Traditional Yoga
                </div>
                <div className={styles.stylesGrid}>
                  {YOGA_STYLES.map((s) => (
                    <span className={styles.chip} key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* right column */}
            <div className={styles.bioRight}>
              <div className={styles.para}>
                <p>
                  In 2000, he also went to the Himalayas with his spiritual
                  Teacher <span className={styles.hl}>Swami Tannayananda</span>{" "}
                  and did spiritual practice and awakened his Kundalini power
                  and learned thousand types of breathing and meditation
                  techniques. After returning, he also completed{" "}
                  <span className={styles.hl}>
                    Master of Science in yoga in 2003
                  </span>{" "}
                  and got engaged in imparting yoga teachers training to
                  students in different parts of India. Later he visited China,
                  South Korea, Hong Kong, Singapore, Japan and Malaysia to
                  spread knowledge and education of yoga. He conducted classes
                  in all these countries with the help of some foreign friends.
                </p>

                <p>
                  He was also invited to the week-long International Yoga
                  Festival celebrations in China this year in 2016. Out there,
                  he showcased his expertise in Hatha and Ashtanga yoga postures
                  and got applaud from the audience. Due to his achievements in
                  the international arena, he is counted as one of the best yoga
                  teacher in India.
                </p>

                <p>
                  Currently he has dedicated himself to develop best yoga
                  teacher–yoga instructor quality in yoga ttc students in
                  Rishikesh at his{" "}
                  <span className={styles.hl}>AYM Yoga School</span>. He is also
                  well-versed in spirituality and meditation due to which he is
                  also counted as one of the best spiritual yoga teacher
                  training in India. Through his school, he runs{" "}
                  <span className={styles.hl}>200 hour yoga course</span>,{" "}
                  <span className={styles.hl}>
                    300 hour yoga teacher course
                  </span>{" "}
                  and{" "}
                  <span className={styles.hl}>
                    500 hour yoga teacher training course
                  </span>{" "}
                  to students who wish to become yoga teachers/yoga instructors
                  in future.
                </p>

                <p>
                  His AYM School is well recognized and certified by{" "}
                  <span className={styles.hl}>Yoga Alliance–USA</span> and{" "}
                  <span className={styles.hl}>
                    International Yoga Federation
                  </span>
                  . Students who pass out of AYM are qualified and certified to
                  teach yoga and set up their own yoga schools in any part of
                  the world. He aims to train{" "}
                  <span className={styles.hl}>100,000 yoga teachers</span> from
                  various countries of the world, in future.
                </p>
              </div>

              {/* Accreditations */}
              <div className={styles.accBox}>
                {ACCREDITATIONS.map((a) => (
                  <div className={styles.accBadge} key={a}>
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className={styles.ctaRow}>
            <p className={styles.ctaText}>
              Join the legacy of 15,000+ certified yoga teachers. Transform your
              life through authentic yogic wisdom at AYM Yoga School, Rishikesh.
            </p>
            <a href="#" className={styles.ctaBtn}>
              Explore Teacher Training
              <span className={styles.ctaArrow}>→</span>
            </a>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SECTION 2 — YOGA POSTURES (all clickable)
      ═══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.secAlt}`}>
        <div className={styles.container}>
          <SecHeader
            sup="Advanced Asana Practice"
            title="Yoga Postures Yogi Chetan Mahesh"
          />

          {/* Row 1 */}
          <div className={styles.grid4}>
            {POSTURES_ROW1.map((p) => (
              <ClickCard
                key={p.label}
                item={p}
                pool={POSTURES_ROW1}
                cardCls={styles.imgCard}
                imgCls={styles.imgCardPhoto}
                lblCls={styles.imgCardLabel}
                onOpen={openModal}
              />
            ))}
          </div>

          {/* Row 2 */}
          <div className={styles.grid4} style={{ marginTop: "1.4rem" }}>
            {POSTURES_ROW2.map((p) => (
              <ClickCard
                key={p.label}
                item={p}
                pool={POSTURES_ROW2}
                cardCls={styles.imgCard}
                imgCls={styles.imgCardPhoto}
                lblCls={styles.imgCardLabel}
                onOpen={openModal}
              />
            ))}
          </div>

          {/* Gallery rows (Image 4) */}
          <div className={styles.subHeadWrap}>
            <OmDivider small />
          </div>

          <div className={styles.grid4} style={{ marginTop: "1.6rem" }}>
            {GALLERY_IMAGES.map((g) => (
              <ClickCard
                key={g.label}
                item={g}
                pool={GALLERY_IMAGES}
                cardCls={styles.imgCard}
                imgCls={styles.imgCardPhotoLand}
                lblCls={styles.imgCardLabel}
                onOpen={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SECTION 3 — AWARDS (all clickable)
      ═══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SecHeader
            sup="Recognised Internationally"
            title="International & National Yoga Awards"
          />

          <div className={styles.grid4}>
            {CERTS_ROW1.map((c, i) => (
              <ClickCard
                key={`cert-r1-${i}`}
                item={c}
                pool={CERTS_ROW1}
                cardCls={styles.certCard}
                imgCls={styles.certPhoto}
                lblCls={styles.certLabel}
                onOpen={openModal}
              />
            ))}
          </div>

          <div className={styles.grid4} style={{ marginTop: "1.4rem" }}>
            {CERTS_ROW2.map((c, i) => (
              <ClickCard
                key={`cert-r2-${i}`}
                item={c}
                pool={CERTS_ROW2}
                cardCls={styles.certCard}
                imgCls={styles.certPhoto}
                lblCls={styles.certLabel}
                onOpen={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SECTION 4 — INTERNATIONAL TRIPS (all clickable)
      ═══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.secAlt}`}>
        <div className={styles.container}>
          <SecHeader
            sup="Global Yoga Ambassador"
            title="International Yoga Trips"
          />

          <p className={styles.tripIntro}>
            His recent trip to Korea has inspired the people of that country so
            much that students and yoga enthusiasts from Korea have started
            getting enrolled in various yoga courses offered by AYM Yoga School
            in Rishikesh. Same is the case with Malaysia where students and
            enthusiasts and all those interested in yoga inquired about yoga
            courses and yoga teacher training courses from Yogi Chetan Mahesh ji
            at the end of yoga classes taken by him in Malaysia. Some of them
            have even visited AYM in Rishikesh and returned after being
            transformed as Yoga Teachers, certified by Yoga Alliance–USA, an
            international governing and certification body. Mahesh ji is very
            famous for his workshops on Ashtanga yoga and Pranayama in South
            Korea and in Malaysia at the branches of &lsquo;True Yoga&rsquo;. He
            was also a yoga faculty in Choone College in yoga department in
            South Korea.
          </p>

          <CountryHeading name="South Korea" />
          <div className={styles.grid4}>
            {SOUTH_KOREA.map((t, i) => (
              <ClickCard
                key={`sk-${i}`}
                item={t}
                pool={SOUTH_KOREA}
                cardCls={styles.imgCard}
                imgCls={styles.imgCardPhotoLand}
                lblCls={styles.imgCardLabel}
                onOpen={openModal}
              />
            ))}
          </div>

          <CountryHeading name="Malaysia" />
          <div className={styles.grid4}>
            {MALAYSIA.map((t, i) => (
              <ClickCard
                key={`my-${i}`}
                item={t}
                pool={MALAYSIA}
                cardCls={styles.imgCard}
                imgCls={styles.imgCardPhotoLand}
                lblCls={styles.imgCardLabel}
                onOpen={openModal}
              />
            ))}
          </div>

          <div className={styles.ctaRow}>
            <p className={styles.ctaText}>
              Ready to begin your yoga journey with one of India&apos;s most
              respected masters? Join AYM Yoga School in Rishikesh.
            </p>
            <a href="#" className={styles.ctaBtn}>
              Explore Teacher Training
              <span className={styles.ctaArrow}>→</span>
            </a>
          </div>
        </div>
      </section>

      <BorderStrip />
    </div>
  );
};

export default YogiChetanMaheshPage;

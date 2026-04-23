"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/testimonials/Testimonialssection.module.css";
import HowToReach from "@/components/home/Howtoreach";

/* ═══════════════════════════════════════════
   TYPES
═══════════════════════════════════════════ */
interface VideoItem {
  id: string;
  title: string;
  dur?: string;
  sub?: string;
}

/* ═══════════════════════════════════════════
   STAR RATING
═══════════════════════════════════════════ */
const StarRating = ({
  score,
  total = 5,
}: {
  score: number;
  total?: number;
}) => (
  <div className={styles.stars} aria-label={`${score} out of ${total} stars`}>
    {Array.from({ length: total }).map((_, i) => {
      const fill = Math.min(Math.max(score - i, 0), 1);
      return (
        <span key={i} className={styles.starWrap}>
          <span className={styles.starEmpty}>★</span>
          <span className={styles.starFill} style={{ width: `${fill * 100}%` }}>
            ★
          </span>
        </span>
      );
    })}
  </div>
);

/* ═══════════════════════════════════════════
   VIDEO MODAL  (click-to-play)
═══════════════════════════════════════════ */
const VideoModal = ({
  video,
  onClose,
}: {
  video: VideoItem | null;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!video) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [video, onClose]);

  useEffect(() => {
    document.body.style.overflow = video ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [video]);

  if (!video) return null;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <button
        className={styles.modalClose}
        onClick={onClose}
        aria-label="Close video"
        type="button"
      >
        ✕
      </button>
      <div className={styles.modalInner}>
        <iframe
          className={styles.modalIframe}
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className={styles.modalTitle}>{video.title}</p>
    </div>
  );
};

/* ═══════════════════════════════════════════
   REEL CARD  (9:16  Instagram-style)
═══════════════════════════════════════════ */
const ReelCard = ({
  video,
  onPlay,
}: {
  video: VideoItem;
  onPlay: (v: VideoItem) => void;
}) => (
  <button
    className={styles.reelCard}
    onClick={() => onPlay(video)}
    aria-label={`Play: ${video.title}`}
    type="button"
  >
    <div className={styles.reelThumbWrap}>
      <img
        className={styles.reelThumb}
        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
        alt={video.title}
        loading="lazy"
      />
      <div className={styles.reelPlayBtn} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
          <polygon points="8,5 19,12 8,19" />
        </svg>
      </div>
      <div className={styles.reelOverlay}>
        <div className={styles.reelTitle}>{video.title}</div>
        {video.dur && <div className={styles.reelDuration}>{video.dur}</div>}
      </div>
    </div>
  </button>
);

/* ═══════════════════════════════════════════
   GRID CARD  (16:9  landscape)
═══════════════════════════════════════════ */
const GridCard = ({
  video,
  onPlay,
}: {
  video: VideoItem;
  onPlay: (v: VideoItem) => void;
}) => (
  <button
    className={styles.gridCard}
    onClick={() => onPlay(video)}
    aria-label={`Play: ${video.title}`}
    type="button"
  >
    <div className={styles.gridThumbWrap}>
      <img
        className={styles.gridThumb}
        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
        alt={video.title}
        loading="lazy"
      />
      <div className={styles.gridPlayIcon} aria-hidden="true">
        <svg viewBox="0 0 68 48" width="54" height="38">
          <rect width="68" height="48" rx="10" fill="#E8540A" opacity="0.95" />
          <polygon points="26,13 53,24 26,35" fill="#fff" />
        </svg>
      </div>
    </div>
    {video.sub && (
      <div className={styles.gridLabel}>
        <div className={styles.gridLabelText}>{video.title}</div>
        <div className={styles.gridLabelSub}>{video.sub}</div>
      </div>
    )}
  </button>
);

/* ═══════════════════════════════════════════
   OM DIVIDER
═══════════════════════════════════════════ */
const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.divLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.divLine} />
  </div>
);

/* ═══════════════════════════════════════════
   BLOCK TITLE
═══════════════════════════════════════════ */
const BlockTitle = ({
  title,
  chakra = "❋",
}: {
  title: string;
  chakra?: string;
}) => (
  <div className={styles.blockTitleWrap}>
    <div className={styles.chakraIcon}>{chakra}</div>
    <h2 className={styles.blockTitle}>{title}</h2>
    <div className={styles.blockUnderline} />
  </div>
);

/* ═══════════════════════════════════════════
   VIDEO HEADING
═══════════════════════════════════════════ */
const VideoHeading = ({ title }: { title: string }) => (
  <div className={styles.videoHeadingWrap}>
    <h2 className={styles.videoHeadingTitle}>{title}</h2>
    <div className={styles.videoHeadingLine} />
  </div>
);

/* ═══════════════════════════════════════════
   WRITTEN REVIEW BLOCK
═══════════════════════════════════════════ */
interface ReviewProps {
  categoryTitle?: string;
  categoryDesc?: string;
  text: string;
  author: string;
  program: string;
}

const ReviewBlock = ({
  categoryTitle,
  categoryDesc,
  text,
  author,
  program,
}: ReviewProps) => (
  <div className={styles.reviewEntry}>
    {(categoryTitle || categoryDesc) && (
      <div className={styles.reviewMeta}>
        {categoryTitle && (
          <p className={styles.reviewCatTitle}>
            <strong>{categoryTitle}</strong>
          </p>
        )}
        {categoryDesc && (
          <p className={styles.reviewCatDesc}>{categoryDesc}</p>
        )}
      </div>
    )}
    <blockquote className={styles.reviewQuote}>
      <span className={styles.openQuoteMark}>"</span>
      {text.split("\n\n").map((para, i) => (
        <p key={i} className={styles.reviewPara}>
          {para}
        </p>
      ))}
    </blockquote>
    <div className={styles.reviewFooter}>
      <div className={styles.reviewAuthorBlock}>
        <span className={styles.reviewAuthorLine}>
          Written by: <em>{author}</em>
        </span>
        <span className={styles.reviewProgramLine}>{program}</span>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   VIDEO DATA
═══════════════════════════════════════════ */
const reelVideos: VideoItem[] = [
  { id: "k5BPMRmOK3E", title: "200 Hour YTT Review — Jessica, England", dur: "3:42" },
  { id: "kOPvvbgLPrc", title: "Student Testimonial — Zois, AYM School", dur: "4:10" },
  { id: "pXU4_SXdNdY", title: "Alexander Shapiro — AYM Yoga Review", dur: "5:02" },
  { id: "VqvYnBNr2Jg", title: "Students Last Day — Rishikesh", dur: "2:55" },
  { id: "DmC6sNn8FtA", title: "AYM School Testimonial — RYS 200", dur: "3:18" },
  { id: "ZmvKhQeEbmI", title: "Graduation Day at AYM Yoga School", dur: "6:20" },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function TestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const play = (v: VideoItem) => setActiveVideo(v);
  const close = () => setActiveVideo(null);

  /** helper — build a VideoItem quickly */
  const v = (id: string, title: string, sub?: string): VideoItem => ({
    id,
    title,
    sub,
  });

  return (
    <section className={styles.section}>
      {/* Decorative mandala BG */}
      <div className={styles.mandalaTopLeft} aria-hidden="true" />
      <div className={styles.mandalaBottomRight} aria-hidden="true" />
      <div className={styles.chakraGlow} aria-hidden="true" />

      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ══════════════════════════════════════
            PAGE HEADER
        ══════════════════════════════════════ */}
        <header className={styles.pageHeader}>
          <p className={styles.superTitle}>Sacred Stories of Transformation</p>
          <h1 className={styles.mainTitle}>
            Yoga Teacher Training — Testimonials
          </h1>
          <OmDivider />
        </header>

        {/* ══════════════════════════════════════
            BLOCK 1 — Facebook & Google Ratings
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Facebook & Google Reviews" chakra="❋" />
          <div className={styles.ratingsGrid}>
            <div className={styles.ratingCard}>
              <h3 className={styles.ratingPlatform}>Facebook Reviews 👍</h3>
              <div className={styles.ratingUnderline} />
              <p className={styles.ratingScore}>4.8 / 5</p>
              <p className={styles.ratingCount}>Based on the opinion of 90 people</p>
              <StarRating score={4.8} />
              <a
                href="https://www.facebook.com/AYMYogaSchool"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.exploreLink}
              >
                Explore More &rsaquo;
              </a>
            </div>
            <div className={styles.ratingCard}>
              <h3 className={styles.ratingPlatform}>Google Reviews ⭐</h3>
              <div className={styles.ratingUnderline} />
              <p className={styles.ratingScore}>4.6 / 5</p>
              <p className={styles.ratingCount}>116 reviews on Google</p>
              <StarRating score={4.6} />
              <a
                href="https://www.google.com/search?q=AYM+Yoga+School+Rishikesh"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.exploreLink}
              >
                Explore More &rsaquo;
              </a>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            BLOCK 2 — Instagram-style Reel Strip
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Student Video Testimonials" chakra="🕉️" />
          <p className={styles.scrollHint}>← swipe to explore →</p>
          <div className={styles.reelsStrip}>
            {reelVideos.map((vid) => (
              <ReelCard key={vid.id + "-reel"} video={vid} onPlay={play} />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            BLOCK 3 — Video About AYM  (single)
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Video About AYM Yoga School" chakra="☀" />
          <div className={styles.singleVideoWrap}>
            <GridCard
              video={v("xFMGqECPKPg", "Welcome to AYM Yoga School in Rishikesh", "School Overview")}
              onPlay={play}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════
            BLOCK 4 — Video Testimonials (4-grid)
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Yoga Teacher Training — Video Testimonials" chakra="🪷" />
          <div className={styles.videoGrid2}>
            <GridCard video={v("k5BPMRmOK3E", "200 Hour Yoga Teacher Training Course Review by Jessica from England", "200 Hr TTC")} onPlay={play} />
            <GridCard video={v("kOPvvbgLPrc", "Student Testimonial of AYM Yoga Teacher Training School — Zois", "Student Review")} onPlay={play} />
            <GridCard video={v("pXU4_SXdNdY", "Yoga Testimonials: Alexander Shapiro About AYM Yoga School", "300 Hr TTC")} onPlay={play} />
            <GridCard video={v("VqvYnBNr2Jg", "Students Experiences / Yoga / Feedback / Review / Rishikesh", "Graduation")} onPlay={play} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            BLOCK 5 — Written Review: Berenice
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Student Written Testimonials" chakra="✦" />
          <ReviewBlock
            categoryTitle="Yoga Teacher Training India"
            categoryDesc="200-hour yoga teacher training in India registered with Yoga Alliance, USA at AYM Yoga School."
            text={`Life changing experience, I don't have enough words to express how coming to AYM help me transform my approach to yoga, and got my practice to the next level.

I came out of the course with a strong base on yoga philosophy and asana alignment. About the location, I thought it was far from the main street but actually it was perfect, so quiet and far from the hussle and bussle of Laxman Jhula. The view from the room windows in the mornings is breathtaking, watch the sunrise and feel the peace of the mountains.

The food is amazing, the chef and cooks try their best to please your request within their possibilities and the yogic diet regimen of course.

Overall an experience I would recommend and that is mainly because the teachers there are among the best in the whole Rishikesh town. From asana class to philosophy and anatomy, with lovely mantra classes and kirtan.

Thank you.
Hari ॐ`}
            author="Berenice Rivas Roldan"
            program="Yoga Teacher Training Rishikesh"
          />
        </div>

        {/* ══════════════════════════════════════
            BLOCK 6 — Videos Testimonials India (2) + meta
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <VideoHeading title="Yoga Teacher Training India — Videos Testimonials" />
          <div className={styles.videoGrid2}>
            <GridCard video={v("DmC6sNn8FtA", "AYM Yoga School Students Testimonial — RYS 200", "200 Hr TTC")} onPlay={play} />
            <GridCard video={v("ZmvKhQeEbmI", "Yoga Teachers Message on Graduation Day at AYM Yoga School", "Graduation Day")} onPlay={play} />
          </div>
          <div className={styles.videoBlockMeta}>
            <p className={styles.videoMetaTitle}>Yoga School — AYM Yoga School</p>
            <p className={styles.videoMetaDesc}>
              200-hour yoga teacher training in India registered with Yoga Alliance, USA at AYM Yoga School.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            BLOCK 7 — Written Reviews: Alison + Mekonnen
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <ReviewBlock
            text={`The students, teachers, and location make AYM a great school for doing your 200 hour yoga teacher training. Our group of 25 students were a very eclectic group ranging from age 19 to 62. They came from more than 10 different countries, and had had a varied level of yoga experience before joining. Most of all, they were all passionate and curious about yoga and were full of love, support, and joy for each other.

Our two yoga asana teachers were amazing. They were knowledgeable, patient and light-hearted. Starting each day with an Ashtanga Vinyasa practice quickly built up our strength, stamina, and familiarity with the poses. Later in the day, our awesome Hatha teacher took us slowly through different positions giving us individual attention. We focused on correct alignment and how to assist students. These practical classes were supported by theory classes on anatomy and physiology of asanas giving us a greater understanding of how our bodies work. Yoga philosophy, meditation and pranayama practice and theory classes gave us a holistic approach to yoga as a lifestyle choice.

AYM is perfectly located on the outskirts of Rishikesh, the yoga capital of the world. It is near enough to town for convenience, but far enough away for peace and quiet. Up a hill, surrounded by mountains, I cannot think of a nicer place to practice yoga. The huge yoga hall, the rooftop, and even the bedrooms provide stunning views of trees, mountains, and country life.

Studying at AYM was a life-changing experience – the support of the students, teachers, and staff made it feel like one big family beginning our yoga teaching journey together.`}
            author="Alison Alcobia"
            program="Yoga Teacher Training India"
          />

          <div className={styles.reviewSpacer} />

          <ReviewBlock
            categoryTitle="Yoga Teacher Training India"
            categoryDesc="200-hour yoga teacher training in India registered with Yoga Alliance, USA at AYM Yoga School."
            text={`I am so lucky that I chose AYM Teachers Training School in Rishikesh, wonderful location in the mountains — very able, understanding professional teachers & good vegetarian food. When I came to the school I was not sure if I could manage the training because of my age (62) and untrained body, but they did a wonderful job on me. Now I can do nearly all the poses. I can say that I'm literally changed for a better version of myself. I am Thankful.`}
            author="Mekonnen Welday"
            program="Yoga Teacher Training India"
          />
        </div>

        {/* ══════════════════════════════════════
            BLOCK 8 — Student Success Stories
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Student Success Stories" chakra="❋" />
          <div className={styles.successGrid}>
            {[
              { name: "Christina", course: "200 Hour",    link: "Stories and Experience",        by: "By Christina", avatar: "https://i.pravatar.cc/80?img=47", orange: true  },
              { name: "Hannah",    course: "200 Hour",    link: "Stories and Experience",        by: "By Hannah",    avatar: "https://i.pravatar.cc/80?img=48", orange: false },
              { name: "Naomi",     course: "200 Hour",    link: "Stories and Experience",        by: "By Naomi",     avatar: "https://i.pravatar.cc/80?img=49", orange: true  },
              { name: "XO Laura",  course: "108 YTT Tips",link: "Yogi Chetan — 108 YTT Tips",   by: "By xo Laura",  avatar: "https://i.pravatar.cc/80?img=50", orange: true  },
            ].map((s, i) => (
              <div
                key={i}
                className={styles.successCard}
                style={{ borderColor: i % 2 === 0 ? "#E8540A" : "#4caf50" }}
              >
                <div className={styles.avatarRing}>
                  <img src={s.avatar} alt={s.name} className={styles.avatar} loading="lazy" />
                </div>
                <p className={styles.successInfo}>Name: {s.name}</p>
                <p className={styles.successInfo}>Course: {s.course}</p>
                <a href="#" className={s.orange ? styles.successLinkOrange : styles.successLinkGray}>
                  {s.link}
                </a>
                <p className={styles.successBy}><strong>{s.by}</strong></p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            BLOCK 9 — More Videos (2) + Bryan review
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <VideoHeading title="Yoga Teacher Training India — Videos Testimonials" />
          <div className={styles.videoGrid2}>
            <GridCard video={v("kOPvvbgLPrc", "200 Hour (Beginners) Yoga TTC Student Review — Jasminj From Holland", "200 Hr TTC")} onPlay={play} />
            <GridCard video={v("pXU4_SXdNdY", "300 Hour Yoga TTC Review by Alexandria from USA — AYM Yoga School", "300 Hr TTC")} onPlay={play} />
          </div>
          <div className={styles.videoBlockMeta}>
            <p className={styles.videoMetaTitle}>Yoga Teacher Training India</p>
            <p className={styles.videoMetaDesc}>
              500-hour yoga teacher training in India registered with Yoga Alliance, USA at AYM Yoga School.
            </p>
          </div>
          <ReviewBlock
            text={`I am Bryan from California, USA. I am currently taking the 500 hour Yoga Teacher Training at AYM Yoga School, and overall I am very happy with the course. The Pranayama and Meditation class in the morning is refreshing, relaxing and a great start of the day. The Ashtanga Vinyasa can be difficult at times, but if you listen to your body and don't overstretch, with daily practice you will soon find yourself becoming substantially stronger and more flexible. The lectures are informative and tie everything together, giving a deeper meaning in the practice. AYM teaches yoga from a traditional, holistic perspective — you will be learning the whole package, not just asana. The Hatha class is perfect for developing awareness of correct alignment. The food is good, the facilities are likewise good, and the location is beautiful and great for fostering a meditation state of mind. If you just want to deepen your practice that is fine, and if you want to develop a firm teaching foundation, the course leaves nothing lacking.`}
            author="Bryan"
            program="Yoga Teacher Training India"
          />
        </div>

        {/* ══════════════════════════════════════
            BLOCK 10 — Didier review
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <div className={styles.videoBlockMeta}>
            <p className={styles.videoMetaTitle}>Yoga Teacher Training India</p>
            <p className={styles.videoMetaDesc}>
              500-hour yoga teacher training in India registered with Yoga Alliance, USA at AYM Yoga School.
            </p>
          </div>
          <ReviewBlock
            text={`I'm doing my 500 hrs teacher training in AYM and below is my overview after 2 months. I came first for the 200hrs on 15th January. The facilities at the ashram are clean, nice and comfortable. The Yoga hall is very large and full of light — a very good place to practice yoga. All courses are very interesting. We started with Pranayama/Meditation to begin slowly, then Ashtanga yoga to help you wake up. The lectures help you understand what you learn during the yoga practice and all the Yoga philosophy. Mahesh is an incredible teacher; he knows how to teach Yoga Asana and philosophy, you don't see the time going when you are in his course. That's why I decided to stay 1 month more to follow the 300hrs. This new month gave me the opportunity to go further in my Yoga practice, follow Yoga Therapy class and Ayurvedic introduction. I recommend very strongly coming to AYM ashram — the teaching is very good and the location is just amazing. I will probably come back as often as I can.

Thank you Mahesh.`}
            author="Didier Van Riet"
            program="Yoga Teacher Training India"
          />
        </div>

        {/* ══════════════════════════════════════
            BLOCK 11 — Review Videos (2) + Eana review
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <VideoHeading title="Yoga Teacher Training Review — Videos Testimonials" />
          <div className={styles.videoGrid2}>
            <GridCard video={v("VqvYnBNr2Jg", "It's a Hard and Emotional Time — Students Last Day at Yoga School", "Graduation")} onPlay={play} />
            <GridCard video={v("k5BPMRmOK3E", "Yoga TT Course Testimonial — June 2019, Rishikesh", "Student Review")} onPlay={play} />
          </div>
          <div className={styles.videoBlockMeta}>
            <p className={styles.videoMetaTitle}>Yoga Teacher Training India</p>
            <p className={styles.videoMetaDesc}>
              200-hour yoga teacher training in India registered with Yoga Alliance, USA at AYM Yoga School.
            </p>
          </div>
          <ReviewBlock
            text={`I'm Eana from Singapore and I started the 200 hours Yoga Teacher's Course in February. I must say I was taken by surprise by the weather here — the cold was not something I expected in Rishikesh. But I met some nice people on the first day. In addition, Mahesh, who is our head teacher, proved to be a very nice and accommodating person. I decided to stay on and I am glad I did.

The people attending the course are a great bunch and everything here has a nice and homely feel to it. Mahesh is a great teacher, very patient and detailed in his Asanas teaching. He taught us many ways of correcting and improving ourselves. His lectures are interesting, and often peppered with personal anecdotes. I realized I didn't know the true meaning of yoga until I attended the course here. This trip has had a profound impact on me. I have loved my stay here so much that I decided to sign up for the 300 hours course as well. So, I'LL BE BACK!!`}
            author="Eana"
            program="Yoga Teacher Training India"
          />
        </div>

        {/* ══════════════════════════════════════
            BLOCK 12 — Siddharth review + Asana videos
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <div className={styles.metaRowTwoCols}>
            <p className={styles.videoMetaTitle}>Yoga Teacher Training India</p>
            <p className={styles.videoMetaTitleRight}>Yoga Teacher Training India</p>
          </div>
          <p className={styles.videoMetaDescFull}>
            300-hour yoga teacher training in India registered with Yoga Alliance, USA at AYM Yoga School.
          </p>
          <ReviewBlock
            text={`Namaste... I am Siddharth Kothiyal. I did yoga teacher training at Association of Yoga and Meditation, Rishikesh, Uttrakhand. I had an amazing experience of yoga and spirituality at the school — it helped me understand the subject of yoga more deeply in terms of philosophy, science and way of living. Our teachers Yogi Chetan and Mahesh shared their divine knowledge of yoga on asana, meditation and philosophy — a precious treasure for my lifetime yoga practice. I am very thankful to our yoga ashtanga teacher Mr. Sachin and Miss Rajkumari who taught us various aspects of meditation, vedic chanting and devotion, and prepared us for asana, teaching us techniques of cleansing the body which helped me reach deeper levels of meditation and yogic practice. The beautiful location of the ashram and hygienic food helped us maintain good health. Special personal attention towards the students from the staff is very appreciable.

THANKING YOU FOR YOUR EFFORTS IN GIVING US THIS DIVINE KNOWLEDGE. HARI OM.`}
            author="Siddharth"
            program="Yoga Teacher Training India"
          />

          <div className={styles.videoGrid2} style={{ marginTop: "2rem" }}>
            <GridCard video={v("Ei_WwSSHyfw", "Surya Namaskar (B) — Yoga Poses, Yoga in Rishikesh", "Asana Practice")} onPlay={play} />
            <GridCard video={v("2MJGg-dUKh0", "Yoga Teacher Training in India — Surya Namaskar (A)", "Asana Practice")} onPlay={play} />
          </div>
        </div>

        {/* FOOTER OM */}
        <OmDivider />
      </div>

      <div className={styles.bottomBorder} />

      {/* ── VIDEO MODAL ── */}
      <VideoModal video={activeVideo} onClose={close} />

      <HowToReach />
    </section>
  );
}
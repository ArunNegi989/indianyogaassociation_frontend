"use client";

import React, { useState } from "react";
import styles from "@/assets/style/testimonials/Testimonialssection.module.css";
import HowToReach from "@/components/home/Howtoreach";

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   YOUTUBE EMBED — plays inline on click
───────────────────────────────────────── */
const YouTubeEmbed = ({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={styles.videoWrapper}>
      {playing ? (
        <iframe
          className={styles.videoIframe}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className={styles.videoThumb}
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className={styles.thumbImg}
            loading="lazy"
          />
          <span className={styles.playBtnWrap}>
            <svg viewBox="0 0 68 48" width="58" height="42">
              <rect
                width="68"
                height="48"
                rx="10"
                fill="#F15505"
                opacity="0.93"
              />
              <polygon points="26,13 53,24 26,35" fill="#fff" />
            </svg>
          </span>
          <span className={styles.videoLabel}>{title}</span>
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   REUSABLE: Om Divider
───────────────────────────────────────── */
const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.divLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.divLine} />
  </div>
);

/* ─────────────────────────────────────────
   REUSABLE: Block Title with chakra icon
───────────────────────────────────────── */
const BlockTitle = ({
  title,
  chakra = "❋",
}: {
  title: string;
  chakra?: string;
}) => (
  <>
    <div className={styles.chakraIcon}>{chakra}</div>
    <h2 className={styles.blockTitle}>{title}</h2>
    <div className={styles.blockUnderline} />
  </>
);

/* ─────────────────────────────────────────
   REUSABLE: Video-section orange heading (as seen in screenshots)
───────────────────────────────────────── */
const VideoHeading = ({ title }: { title: string }) => (
  <div className={styles.videoHeadingWrap}>
    <h2 className={styles.videoHeadingTitle}>{title}</h2>
    <div className={styles.videoHeadingLine} />
  </div>
);

/* ─────────────────────────────────────────
   REUSABLE: Written review block
───────────────────────────────────────── */
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
        {categoryDesc && <p className={styles.reviewCatDesc}>{categoryDesc}</p>}
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
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      {/* Decorative mandala BG */}
      <div className={styles.mandalaTopLeft} aria-hidden="true" />
      <div className={styles.mandalaBottomRight} aria-hidden="true" />
      <div className={styles.chakraGlow} aria-hidden="true" />

      <div className={styles.a} />

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
            IMAGE 1 — Facebook & Google Ratings
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Facebook & Google Reviews" chakra="❋" />
          <div className={styles.ratingsGrid}>
            {/* Facebook */}
            <div className={styles.ratingCard}>
              <h3 className={styles.ratingPlatform}>Facebook Reviews 👍</h3>
              <div className={styles.ratingUnderline} />
              <p className={styles.ratingScore}>4.8/5</p>
              <p className={styles.ratingCount}>
                Based on the opinion of 90 people
              </p>
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

            {/* Google */}
            <div className={styles.ratingCard}>
              <h3 className={styles.ratingPlatform}>Google Reviews</h3>
              <div className={styles.ratingUnderline} />
              <p className={styles.ratingScore}>4.6/5</p>
              <p className={styles.ratingCount}>116 reviews on Google</p>
              <StarRating score={4.6} />
              <a
                href="https://www.google.com"
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
            IMAGE 2 — Video About AYM
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle
            title="Yoga Teacher Training - Video About AYM"
            chakra="☀"
          />
          <div className={styles.singleVideoWrap}>
            <YouTubeEmbed
              videoId="6EjZPpDGMhg"
              title="Welcome to India: Welcome to AYM Yoga School in Rishikesh"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════
            IMAGE 2–3 — Video Testimonials (4 videos)
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle
            title="Yoga Teacher Training - Video Testimonials"
            chakra="🕉️"
          />
          <div className={styles.videoGrid2}>
            <YouTubeEmbed
              videoId="k5BPMRmOK3E"
              title="200 Hour Yoga Teacher Training Course Review by Jessica from England"
            />
            <YouTubeEmbed
              videoId="kOPvvbgLPrc"
              title="Student Testimonial of AYM Yoga Teacher Training School in India : Zois …"
            />
            <YouTubeEmbed
              videoId="pXU4_SXdNdY"
              title="Yoga Testimonials: Hear What Alexander Shapiro are Saying About AYM …"
            />
            <YouTubeEmbed
              videoId="VqvYnBNr2Jg"
              title="Students Experiences / Yoga / Yogini / Feedback / Review / Rishikesh / …"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════
            IMAGE 4 — Written Review: Berenice
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Student Written Testimonials" chakra="🪷" />
          <ReviewBlock
            categoryTitle="Yoga Teacher Training India"
            categoryDesc="200-hour yoga teacher training in india registered with yoga allinace, USA at AYM Yoga School."
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
            IMAGE 5 — Videos Testimonials India (2 videos)
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <VideoHeading title="Yoga Teacher Training India - Videos Testimonials" />
          <div className={styles.videoGrid2}>
            <YouTubeEmbed
              videoId="DmC6sNn8FtA"
              title="AYM Yoga School Students Testimonial - RYS 200"
            />
            <YouTubeEmbed
              videoId="ZmvKhQeEbmI"
              title="Yoga teachers message on graduation day at AYM Yoga School"
            />
          </div>
          <div className={styles.videoBlockMeta}>
            <p className={styles.videoMetaTitle}>
              Yoga School - AYM Yoga School
            </p>
            <p className={styles.videoMetaDesc}>
              200-hour yoga teacher training in india registered with yoga
              allinace, USA at AYM Yoga School.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            IMAGE 6 — Written Reviews: Alison + Mekonnen
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
            categoryDesc="200-hour yoga teacher training in india registered with yoga allinace, USA at AYM Yoga School."
            text={`I am so lucky that I chose AYM Teachers Training School in Rishikesh, wonderful location in the mountains very able, understanding professional teachers & good vegetarian food when I came to the school I was not sure if I could manage the training because of my age (62) and untrained body ,but they did a wonderful job on me, now I can do nearly all the poses,I can say that I m literally changed for a better version of myself. I am Thankful`}
            author="Mekonnen Welday"
            program="Yoga Teacher Training India"
          />
        </div>

        {/* ══════════════════════════════════════
            IMAGE 7 — Student Success Stories
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <BlockTitle title="Student Success Stories" chakra="✦" />
          <div className={styles.successGrid}>
            {[
              {
                name: "Christina",
                course: "200 Hour",
                link: "Stories and Experience",
                by: "By Christina",
                avatar: "https://i.pravatar.cc/80?img=47",
                orange: true,
              },
              {
                name: "Hannah",
                course: "200 Hour",
                link: "Stories and Experience",
                by: "By Hannah",
                avatar: "https://i.pravatar.cc/80?img=48",
                orange: false,
              },
              {
                name: "Naomi",
                course: "200 Hour",
                link: "Stories and Experience",
                by: "By Naomi",
                avatar: "https://i.pravatar.cc/80?img=49",
                orange: true,
              },
              {
                name: "XO Laura",
                course: "108 YTT Tips",
                link: "Yogi Chetan - 108 YTT Tips",
                by: "By xo Laura",
                avatar: "https://i.pravatar.cc/80?img=50",
                orange: true,
              },
            ].map((s, i) => (
              <div
                key={i}
                className={styles.successCard}
                style={{ borderColor: i % 2 === 0 ? "#F15505" : "#4caf50" }}
              >
                <div className={styles.avatarRing}>
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className={styles.avatar}
                    loading="lazy"
                  />
                </div>
                <p className={styles.successInfo}>Name: {s.name}</p>
                <p className={styles.successInfo}>Course: {s.course}</p>
                <a
                  href="#"
                  className={
                    s.orange ? styles.successLinkOrange : styles.successLinkGray
                  }
                >
                  {s.link}
                </a>
                <p className={styles.successBy}>
                  <strong>{s.by}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            IMAGE 8 — Videos Testimonials India (2 videos) + Bryan review
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <VideoHeading title="Yoga Teacher Training India - Videos Testimonials" />
          <div className={styles.videoGrid2}>
            <YouTubeEmbed
              videoId="kOPvvbgLPrc"
              title="200 Hour (Beginners) Yoga TTC Student Review - Jasminj From Holland …"
            />
            <YouTubeEmbed
              videoId="pXU4_SXdNdY"
              title="300 Hour Yoga TTC Review by Alexandria from USA - AYM Yoga School"
            />
          </div>
          <div className={styles.videoBlockMeta}>
            <p className={styles.videoMetaTitle}>Yoga Teacher Training India</p>
            <p className={styles.videoMetaDesc}>
              500-hour yoga teacher training in india registered with yoga
              allinace, USA at AYM Yoga School.
            </p>
          </div>
          <ReviewBlock
            text={`I am Bryan from California, USA. I am currently taking the 500 hour Yoga Teacher Training at AYM Yoga School, and an overall I am very happy with the course. The Pranayama and Meditation class in the morning is refreshing, relaxing and a great start of the day. The Ashtanga Vinyasa can be difficult at times, but if you listen to your body and dont overstretch, with daily practice you will soon find yourself becoming substantially stronger and more flexible. The lectures are informative and tie everything together, giving a deeper meaning in the practice. AYM teachers yoga from a traditional, hostile, perspective, so please be aware that you will be learning the whole package, not just asana. Asana is one of many sleeping stress to self-relaxation. The Hatha class is perfect for developing awareness of the correct and aligns others. The food is good, but you are always welcome to eat out at of any restaurants. The facilities are likewise good, and the location is beautiful and great for fostering a Meditation state of mind. There is a degree of freedom in the course, so you will get out of it what you put into it. If you just want to deeper in your practice, that is fine, and if you want to develop a firm teaching formation, the course leave nothing leaking.`}
            author="Bryan"
            program="Yoga Teacher Training India"
          />
        </div>

        {/* ══════════════════════════════════════
            IMAGE 9 — Didier review
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <div className={styles.videoBlockMeta}>
            <p className={styles.videoMetaTitle}>Yoga Teacher Training India</p>
            <p className={styles.videoMetaDesc}>
              500-hour yoga teacher training in india registered with yoga
              allinace, USA at AYM Yoga School.
            </p>
          </div>
          <ReviewBlock
            text={`Didier Van Riet - France - 37 years I'm doing my 500 hrs teacher training in AYM and you're going to find below my overview after 2 months. I came first for the 200hrs in 15th January. The facilities at the ashram are clean, nice and confortable. The Yoga hall is very large and full of light. It's a very good place to practice yoga. All course are very interesting, we started with Pranayama/Meditation just to start slowly, then Asthanga yoga to help you to wake up. The lecture helps you to understand what you learn during the yoga practice and all the Yoga philosophie. Mahesh is an incredible teacher, he knows how to teach you Yoga Asana and the phylosophie, you don't see the time going when you are in his course. That's why I decided to stay 1month more to follow the 300hrs. This new month just give me the opportunity to go further in my Yoga practice, follow Yoga Therapy class and Ayurvedic introduction. During January the weather was a little cold at the beginning and then cloudy and sunny… some day cold and some day warm… So, don't forget to take some warm cloths. The school wasn't completly finished when I arrived… time to time the noise was too much but now the school is almost finished and the noise decrease a lot and you can enjoy the view of the mountain and the Jungle. I recommend very strongly to come in AYM ashram, the teaching is very good and the location is just amazing. I'm probably come back as I can.

Thank you Mahesh.`}
            author="Didier Van Riet"
            program="Yoga Teacher Training India"
          />
        </div>

        {/* ══════════════════════════════════════
            IMAGE 10 — Review Videos (2 full-size) + Eana review
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <VideoHeading title="Yoga Teacher Training Review - Videos Testimonials" />
          <div className={styles.videoGrid2}>
            <YouTubeEmbed
              videoId="VqvYnBNr2Jg"
              title="It's a hard and emotional time, students last day at the yoga School"
            />
            <YouTubeEmbed
              videoId="k5BPMRmOK3E"
              title="Yoga TT Course Testimonial - June 2019, Rishikesh"
            />
          </div>
          <div className={styles.videoBlockMeta}>
            <p className={styles.videoMetaTitle}>Yoga Teacher Training India</p>
            <p className={styles.videoMetaDesc}>
              200-hour yoga teacher training in india registered with yoga
              allinace, USA at AYM Yoga School.
            </p>
          </div>
          <ReviewBlock
            text={`I'm Eana from Singapore and I started the 200 hours Yoga Teacher's Course in February. I must say I was taken by surprise by the weather here, a case of not checking the weather before coming to Rishikesh. The cold was not something I expected here. The ride from the Delhi International Airport was way too long for me too. I wanted to leave the next day. But I met some nice people on the first day. In addition, Mahesh, who is our head teacher, proved to be a very nice and accommodating person. I decided to stay on and I am glad I did. The people attending the course are a great bunch and everything here has a nice and homely feel to it. Mahesh is a great teacher, very patient and detailed in his Asanas teaching. He taught us many ways of correcting and improving ourselves. His lectures are interesting, and often peppered with personal anecdotes. I realized I didn't know the true meaning of yoga until I have attended the course here. This trip here has a profound impact on me. I am really going to need to examine my lifestyle and make the necessary changes. The accommodation is better than I expected. I have a good sized, single room with large windows and a balcony to sit out to take in the spectacular view. I have loved my stay here so much that I decided to sign up for the 300 hours course as well. So, I'LL BE BACK!!`}
            author="Eana"
            program="Yoga Teacher Training India"
          />
        </div>

        {/* ══════════════════════════════════════
            IMAGE 11 — Siddharth review + Asana videos
        ══════════════════════════════════════ */}
        <div className={styles.block}>
          <div className={styles.metaRowTwoCols}>
            <p className={styles.videoMetaTitle}>Yoga Teacher Training India</p>
            <p className={styles.videoMetaTitleRight}>
              Yoga Teacher Training India
            </p>
          </div>
          <p className={styles.videoMetaDescFull}>
            300-hour yoga teacher training in india registered with yoga
            allinace, USA at AYM Yoga School.
          </p>

          <ReviewBlock
            text={`Namaste...I am Siddharth Kothiyal I did yoga teachers training at Association of yoga and meditation Rishikesh Uttrakhand I had an amazing experience of yoga and spirituality at the school it helped me understanding the subject of yoga more deeply in terms of philosophy as well as science and way of living our teachers yogi Chetan Mahesh who shared his divine knowledge of yoga on asana meditation and as well as philosophy is a precious treasure for my life time yoga practice I am very thankful to our yoga ashtanga teacher Mr Sachin and miss Rajkumari who taught us various aspects of meditation vedic chanting and devotion and prepared us for asana and teaching us techniques of cleaning body which helped me to reach deeper levels of meditation and yogic practice . The beautiful location of ashram and hygienic food helped us to maintain good health special personal attention towards the students of the staff is very appreciable I am very thankful to my teachers and the entire staff of association of yoga and meditation ...THANKING YOU FOR YOUR EFFORTS IN GIVING US THIS DIVINE KNOWLEDGE HARI OM.`}
            author="Siddharth"
            program="Yoga Teacher Training India"
          />

          <div className={styles.videoGrid2} style={{ marginTop: "2rem" }}>
            <YouTubeEmbed
              videoId="Ei_WwSSHyfw"
              title="SURYA NAMASKAR (B), YOGA POSES, YOGA IN RISHIKESH,"
            />
            <YouTubeEmbed
              videoId="2MJGg-dUKh0"
              title="YOGA TEACHER TRAINING IN INDIA, SURYA NAMASKAR (A)"
            />
          </div>
        </div>

        {/* FOOTER OM */}
        <OmDivider />
      </div>
      <div className={styles.bottomBorder} />
      <HowToReach />
    </section>
  );
}

"use client";

import React, { useState, useRef } from "react";
import styles from "../../assets/style/Home/Hometestimonialssection.module.css";

interface Testimonial {
  id: number;
  name: string;
  country: string;
  flag: string;
  youtubeId: string;
  quote: string;
  course: string;
  rating: number;
}

interface TextReview {
  id: number;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

function getYoutubeId(input: string): string {
  if (!input) return "";
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const shorts = s.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return shorts[1];
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return watch[1];
  const short = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  const embed = s.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];
  return s;
}

const textReviews: TextReview[] = [
  {
    id: 1,
    name: "Vinita Rai",
    role: "Certified Yoga Teacher",
    avatar: "/images/reviews/vinita.jpg",
    quote:
      "This is truly the best yoga school for 200-hour Yoga Teacher Training. The environment is peaceful, supportive, and perfect for learning. The teachers are knowledgeable, the classes are well-structured, and the overall atmosphere helps you grow mentally, physically, and spiritually. Highly recommended for a transformative experience.",
    rating: 5,
  },
  {
    id: 2,
    name: "Alexandra Guzman",
    role: "Yoga Practitioner, Peruvian",
    avatar: "/images/reviews/alexandra.jpg",
    quote:
      "I completed the 300-hour Online Teacher Training with Stuti and had an excellent experience. The live sessions helped me learn various yoga styles, and the recorded material was equally valuable. The guidance was clear, supportive, and enriching. I highly recommend this program to anyone wanting to deepen their yoga practice.",
    rating: 5,
  },
  {
    id: 3,
    name: "Neeraj Neeru",
    role: "Yoga Practitioner",
    avatar: "/images/reviews/neeraj.jpg",
    quote:
      "I'm truly grateful for the AYM Teacher Training classes. The teachers' attention to detail and patient guidance helped me improve my practice. Special thanks to Vishnuji, Abhishekji, Latikaji, Sant Prakashji, Lataji, and Gaurabji for their support. The variety of classes suited my needs perfectly. Highly recommended!",
    rating: 5,
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Yoga Practitioner",
    avatar: "/images/reviews/priya.jpg",
    quote:
      "I completed the 300-hour Online Teacher Training with Stuti and had an excellent experience. The live sessions helped me learn various yoga styles, and the recorded material was equally valuable. The guidance was clear, supportive, and enriching. I highly recommend this program to anyone wanting to deepen their yoga practice.",
    rating: 5,
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marit",
    country: "Netherlands",
    flag: "🇳🇱",
    youtubeId: "https://youtube.com/shorts/l12jCvLqUQg?si=AjiGeADxSb4xiqrk",
    quote:
      "Namaste, my name is Marit. I am from the Netherlands and I came to AYM two weeks ago and I'm loving it so much. The teachers, they are amazing. They are guiding me through the practices very well and everybody else, they have such good eye for the little details and the day planning is also amazing. The food, the fellow students, I get so much energy from it. I even decided to do another 300 hours, besides the 200 hours that I'm doing now, just to be able to stay here longer.",
    course: "200hr YTT",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah",
    country: "United States",
    flag: "🇺🇸",
    youtubeId: "https://youtube.com/shorts/jUAovisMEfk?si=hOls1k7FfBqbsGHp",
    quote:
      "AYM has been a life-changing experience. The depth of knowledge our teachers carry is extraordinary — every session felt like peeling back another layer of yoga's true essence. The Himalayan setting along the Ganges is unlike anything I have experienced. I came seeking a certification and left with a complete shift in perspective.",
    course: "300hr YTT",
    rating: 5,
  },
  {
    id: 3,
    name: "Lena",
    country: "Germany",
    flag: "🇩🇪",
    youtubeId: "https://youtube.com/shorts/2lVpgxazEWw?si=xoJSbgjqH0541nAe",
    quote:
      "I have attended several yoga trainings across Europe but nothing compared to the authenticity and rigor of AYM. Yogi Chetan's lineage comes through in every aspect of the curriculum. The pranayama sessions alone were worth the journey. My practice deepened exponentially.",
    course: "200hr YTT",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={styles.star}>
          ★
        </span>
      ))}
    </div>
  );
}

function TextReviewSlider() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const total = textReviews.length;
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
  };

  return (
    <div className={styles.reviewSliderSection}>
      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.omSymbol}>ॐ</span>
        <span className={styles.dividerLine} />
      </div>
      <div className={styles.reviewSliderHeader}>
        <h2 className={styles.reviewSliderTitle}>
          Student Reviews &amp; Success Stories
        </h2>
        <p className={styles.reviewSliderSub}>
          Authentic stories of transformation from students who began just like
          you.
        </p>
      </div>
      <div
        className={styles.reviewViewport}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.reviewTrack}
          style={{
            transform: `translateX(calc(-${current} * var(--slide-width)))`,
          }}
        >
          {textReviews.map((review) => (
            <div key={review.id} className={styles.reviewSlide}>
              <div className={styles.reviewCardInner}>
                <div className={styles.reviewCardTop}>
                  <div className={styles.reviewAvatar}>
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className={styles.reviewAvatarImg}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = "none";
                        const fallback = img.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div className={styles.reviewAvatarFallback}>
                      {review.name.charAt(0)}
                    </div>
                  </div>
                  <div className={styles.reviewCardMeta}>
                    <span className={styles.reviewCardName}>{review.name}</span>
                    <span className={styles.reviewCardRole}>{review.role}</span>
                  </div>
                </div>
                <StarRating count={review.rating} />
                <div className={styles.reviewCardQuoteMark}>&ldquo;</div>
                <p className={styles.reviewCardQuote}>{review.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.reviewDots}>
        {textReviews.map((_, i) => (
          <button
            key={i}
            className={`${styles.reviewDot} ${i === current ? styles.reviewDotActive : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface VideoCardProps {
  testimonial: Testimonial;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

function VideoCard({
  testimonial,
  isActive,
  isPlaying,
  onClick,
}: VideoCardProps) {
  const vid = getYoutubeId(testimonial.youtubeId);
  return (
    <button
      type="button"
      className={`${styles.videoCard} ${isActive ? styles.videoCardActive : ""}`}
      onClick={onClick}
      aria-label={`View testimonial from ${testimonial.name}`}
    >
      <div className={styles.videoThumbWrap}>
        <img
          src={`https://img.youtube.com/vi/${vid}/mqdefault.jpg`}
          alt={testimonial.name}
          className={styles.videoThumbImg}
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
        <div className={styles.videoThumbFallback}>
          <span className={styles.videoFallbackOm}>ॐ</span>
        </div>
        <div className={styles.videoPlayOverlay}>
          <span className={styles.videoPlayBtn}>
            {isActive && isPlaying ? "⏸" : "▶"}
          </span>
        </div>
        <div className={styles.videoCardBadge}>{testimonial.course}</div>
      </div>
      <div className={styles.videoCardMeta}>
        <span className={styles.videoCardName}>{testimonial.name}</span>
        <span className={styles.videoCardCountry}>
          {testimonial.flag} {testimonial.country}
        </span>
      </div>
    </button>
  );
}

const HomeTestimonialsSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const active = testimonials[activeIdx];
  const activeVid = getYoutubeId(active.youtubeId);

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) {
      setIsPlaying((p) => !p);
      return;
    }
    setActiveIdx(idx);
    setAnimKey((k) => k + 1);
    setIsPlaying(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.topBorder} />
      <div className={styles.bgWatermark} aria-hidden="true">
        ॐ
      </div>
      <div
        className={`${styles.corner} ${styles.cornerTL}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.corner} ${styles.cornerTR}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.corner} ${styles.cornerBL}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.corner} ${styles.cornerBR}`}
        aria-hidden="true"
      />
      <div className={styles.container}>
        <TextReviewSlider />
        <div className={styles.omDivider}>
          <span className={styles.dividerLine} />
          <span className={styles.omSymbol}>ॐ</span>
          <span className={styles.dividerLine} />
        </div>
        <div className={styles.header}>
          <p className={styles.superTitle}>Voices from Our Global Sangha</p>
          <h2 className={styles.mainTitle}>Success Stories of Our Students</h2>
          <p className={styles.subtitle}>
            Hear the inspiring journeys of our students from around the world.
            Discover how their time in India transformed their practice and
            their lives.
          </p>
        </div>
        <div className={styles.mainCard} key={animKey}>
          <div className={styles.videoSection}>
            <div className={styles.videoFrame}>
              <div className={styles.videoInner}>
                {isPlaying ? (
                  <iframe
                    key={`yt-${active.id}-${activeVid}`}
                    className={styles.youtubeIframe}
                    src={`https://www.youtube.com/embed/${activeVid}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={`${active.name} testimonial`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${activeVid}/hqdefault.jpg`}
                      alt={`${active.name} video thumbnail`}
                      className={styles.videoThumbBg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0";
                      }}
                    />
                    <div className={styles.videoThumbFallbackLarge}>
                      <span className={styles.videoOmLarge}>ॐ</span>
                      <p className={styles.videoHint}>Video Testimonial</p>
                    </div>
                    <div
                      className={styles.videoPlayLarge}
                      role="button"
                      tabIndex={0}
                      aria-label="Play video"
                      onClick={() => setIsPlaying(true)}
                      onKeyDown={(e) => e.key === "Enter" && setIsPlaying(true)}
                    >
                      <span className={styles.videoPlayIconLarge}>▶</span>
                    </div>
                  </>
                )}
                <div className={styles.videoBadgeOverlay}>{active.course}</div>
              </div>
              <div className={`${styles.tape} ${styles.tapeTL}`} />
              <div className={`${styles.tape} ${styles.tapeTR}`} />
              <div className={`${styles.tape} ${styles.tapeBL}`} />
              <div className={`${styles.tape} ${styles.tapeBR}`} />
            </div>
            <div className={styles.studentInfo}>
              <div className={styles.studentAvatar}>
                {active.name.charAt(0)}
              </div>
              <div>
                <p className={styles.studentName}>{active.name}</p>
                <p className={styles.studentCountry}>
                  {active.flag} {active.country}
                </p>
                <StarRating count={active.rating} />
              </div>
            </div>
          </div>

          <div className={styles.quoteSection}>
            <div className={styles.quoteMark} aria-hidden="true">
              &ldquo;
            </div>
            <blockquote className={styles.quoteText}>{active.quote}</blockquote>
            <div className={styles.quoteFooter}>
              <div className={styles.quoteAuthorBlock}>
                <span className={styles.quoteAuthorName}>{active.name}</span>
                <span className={styles.quoteAuthorSeparator}>·</span>
                <span className={styles.quoteAuthorDetail}>
                  {active.country}
                </span>
                <span className={styles.quoteAuthorSeparator}>·</span>
                <span className={styles.quoteAuthorDetail}>
                  {active.course}
                </span>
              </div>
              <div className={styles.ornamentRow}>
                <span className={styles.ornamentLine} />
                <span className={styles.ornamentDiamond}>◆</span>
                <span className={styles.ornamentLine} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.thumbRow}>
          {testimonials.map((t, idx) => (
            <VideoCard
              key={t.id}
              testimonial={t}
              isActive={idx === activeIdx}
              isPlaying={isPlaying}
              onClick={() => handleSelect(idx)}
            />
          ))}
        </div>

        <div className={styles.dots} role="tablist">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              className={`${styles.dot} ${idx === activeIdx ? styles.dotActive : ""}`}
              onClick={() => handleSelect(idx)}
            />
          ))}
        </div>

        <div className={styles.trustStrip}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🌍</span>
            <span className={styles.trustLabel}>
              Students from 50+ Countries
            </span>
          </div>
          <span className={styles.trustDivider}>◆</span>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>⭐</span>
            <span className={styles.trustLabel}>4.9 / 5 Average Rating</span>
          </div>
          <span className={styles.trustDivider}>◆</span>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🧘</span>
            <span className={styles.trustLabel}>
              100,000+ Certified Teachers
            </span>
          </div>
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </section>
  );
};

export default HomeTestimonialsSection;

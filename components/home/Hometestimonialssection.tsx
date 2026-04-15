"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../../assets/style/Home/Hometestimonialssection.module.css";
import api from "@/lib/api";
import tripIcon from "../../assets/icons/showcase1.png";
import googleIcon from "../../assets/icons/showcase2.png";
import trustpilotIcon from "../../assets/icons/showcase3.png";
import truststar from "../../assets/icons/showcase4.png";

interface Testimonial {
  id: string;
  name: string;
  country: string;
  flag: string;
  youtubeId: string;
  quote: string;
  course: string;
  rating: number;
}

interface TextReview {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

interface SectionMeta {
  superTitle: string;
  mainTitle: string;
  subtitle: string;
  trustItems: { icon: string; label: string }[];
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

/* ── Fallback data (shown if API fails) ── */
const DEFAULT_META: SectionMeta = {
  superTitle: "Voices from Our Global Sangha",
  mainTitle: "Success Stories of Our Students",
  subtitle:
    "Hear the inspiring journeys of our students from around the world. Discover how their time in India transformed their practice and their lives.",
  trustItems: [
    { icon: "🌍", label: "Students from 50+ Countries" },
    { icon: "⭐", label: "4.9 / 5 Average Rating" },
    { icon: "🧘", label: "100,000+ Certified Teachers" },
  ],
};

/* ── Platform Rating Data ── */
const PLATFORM_RATINGS = [
  {
    name: "TripAdvisor",
    rating: 5.0,
    label: "5.0/5 Stars",
    sub: "Trip Advisor Testimonials",
    fullStars: 5,
    halfStar: false,
    color: "#00AA6C",
    icon: (
      <img
        src={tripIcon.src}
        alt="TripAdvisor"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    ),
  },
  {
    name: "Google Maps",
    rating: 4.9,
    label: "4.9/5 Stars",
    sub: "Google Maps Reviews",
    fullStars: 4,
    halfStar: true,
    color: "#4285F4",
    icon: (
      <img
        src={googleIcon.src}
        alt="TripAdvisor"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    ),
  },
  {
    name: "Yoga Alliance",
    rating: 4.9,
    label: "4.9/5 Stars",
    sub: "Yoga Alliance Verified Reviews",
    fullStars: 4,
    halfStar: true,
    color: "#7B4F8E",
    icon: (
      <img
        src={trustpilotIcon.src}
        alt="TripAdvisor"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    ),
  },
  {
    name: "Trustpilot",
    rating: 4.9,
    label: "4.9/5 Stars",
    sub: "Trustpilot Verified Reviews",
    fullStars: 4,
    halfStar: true,
    color: "#00B67A",
    icon: (
      <img
        src={truststar.src}
        alt="TripAdvisor"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    ),
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

/* ── Platform Stars ── */
function PlatformStars({ full, half }: { full: number; half: boolean }) {
  return (
    <div className={styles.platformStars}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} className={styles.platformStar}>
          ★
        </span>
      ))}
      {half && <span className={styles.platformStarHalf}>★</span>}
    </div>
  );
}

/* ── Ratings Summary Section ── */
function RatingsSummarySection() {
  return (
    <div className={styles.ratingsSection}>
      {/* Divider */}
      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.omSymbol}>ॐ</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.ratingsGrid}>
        {/* LEFT — Overall Rating Card */}
        <div className={styles.overallCard}>
          <div className={styles.overallCardBg} aria-hidden="true" />
          <div className={styles.overallCardContent}>
            <div className={styles.overallScoreWrap}>
              <div className={styles.overallScoreCircle}>
                <span className={styles.overallScore}>4.9</span>
                <span className={styles.overallScoreLabel}>Out Of 5 Stars</span>
                <div className={styles.overallStars}>
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className={styles.overallStar}>
                      ★
                    </span>
                  ))}
                  <span className={styles.overallStarHalf}>★</span>
                </div>
              </div>
            </div>
            <p className={styles.overallTotal}>
              Overall Rating of 1276+ Total Reviews
            </p>
            <p className={styles.overallDesc}>
              Over the past decade, we empowered more than 13K+ awesome Yoga
              Instructors — who are now successfully teaching on all 6
              continents.
            </p>
            <a href="#reviews" className={styles.overallBtn}>
              See Our Other Reviews
            </a>
          </div>
        </div>

        {/* RIGHT — Platform Ratings */}
        <div className={styles.platformsPanel}>
          <h3 className={styles.platformsTitle}>
            We Know This Is A Big Step For You
          </h3>
          <p className={styles.platformsSub}>
            So we do everything to make this the best investment of your life
          </p>

          <div className={styles.platformList}>
            {PLATFORM_RATINGS.map((p, i) => (
              <React.Fragment key={p.name}>
                <div className={styles.platformRow}>
                  <div className={styles.platformIconWrap}>{p.icon}</div>
                  <div className={styles.platformInfo}>
                    <PlatformStars full={p.fullStars} half={p.halfStar} />
                    <span className={styles.platformRating}>{p.label}</span>
                    <span className={styles.platformName}>{p.sub}</span>
                  </div>
                </div>
                {i < PLATFORM_RATINGS.length - 1 && (
                  <div className={styles.platformDivider} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Text Review Slider ── */
function TextReviewSlider({ reviews }: { reviews: TextReview[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const total = reviews.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  if (!reviews.length) return null;

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
          {reviews.map((review) => (
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
                <p
                  className={styles.reviewCardQuote}
                  dangerouslySetInnerHTML={{ __html: review.quote }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.reviewDots}>
        {reviews.map((_, i) => (
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

/* ── Video Card ── */
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

/* ── Skeleton loader ── */
function SectionSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div
          style={{
            textAlign: "center",
            padding: "4rem 0",
            fontFamily: "Cinzel, serif",
            color: "rgba(224,123,0,0.4)",
            fontSize: "2.5rem",
          }}
        >
          ॐ
        </div>
      </div>
    </section>
  );
}

/* ── Main Component ── */
const HomeTestimonialsSection: React.FC = () => {
  const [videos, setVideos] = useState<Testimonial[]>([]);
  const [textReviews, setTextReviews] = useState<TextReview[]>([]);
  const [meta, setMeta] = useState<SectionMeta>(DEFAULT_META);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ── Fetch both APIs ── */
  useEffect(() => {
    (async () => {
      try {
        const [videoRes, textRes] = await Promise.all([
          api.get("/testimonials/videos/all-videos"),
          api.get("/testimonials/text/all-reviews"),
        ]);

        const mappedVideos: Testimonial[] = (videoRes.data.data ?? [])
          .filter((d: any) => d.status !== "Inactive")
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((d: any) => ({
            id: d._id,
            name: d.name ?? "",
            country: d.country ?? "",
            flag: d.flag ?? "🌍",
            youtubeId: d.youtubeId ?? getYoutubeId(d.youtubeUrl ?? ""),
            quote: d.quote ?? "",
            course: d.course ?? "",
            rating: d.rating ?? 5,
          }));

        const mappedText: TextReview[] = (textRes.data.data ?? [])
          .filter((d: any) => d.status !== "Inactive")
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((d: any) => ({
            id: d._id,
            name: d.name ?? "",
            role: d.role ?? "",
            avatar: d.avatarSrc ?? "",
            quote: d.quote ?? "",
            rating: d.rating ?? 5,
          }));

        const metaSource =
          videoRes.data.data?.[0]?.sectionMeta ??
          textRes.data.data?.[0]?.sectionMeta;

        if (metaSource) {
          setMeta({
            superTitle: metaSource.superTitle ?? DEFAULT_META.superTitle,
            mainTitle: metaSource.mainTitle ?? DEFAULT_META.mainTitle,
            subtitle: metaSource.subtitle ?? DEFAULT_META.subtitle,
            trustItems: metaSource.trustItems?.length
              ? metaSource.trustItems
              : DEFAULT_META.trustItems,
          });
        }

        setVideos(mappedVideos);
        setTextReviews(mappedText);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) {
      setIsPlaying((p) => !p);
      return;
    }
    setActiveIdx(idx);
    setAnimKey((k) => k + 1);
    setIsPlaying(false);
  };

  if (isLoading) return <SectionSkeleton />;

  const active = videos[activeIdx];
  const activeVid = active ? getYoutubeId(active.youtubeId) : "";

  return (
    <section className={styles.section} id="testimonials">
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
        {/* ── Text Reviews ── */}
        {textReviews.length > 0 && <TextReviewSlider reviews={textReviews} />}

        {/* ── NEW: Ratings Summary Section ── */}
        <RatingsSummarySection />

        {/* ── Video Section ── */}
        {videos.length > 0 && active && (
          <>
            <div className={styles.omDivider}>
              <span className={styles.dividerLine} />
              <span className={styles.omSymbol}>ॐ</span>
              <span className={styles.dividerLine} />
            </div>

            <div className={styles.header}>
              <p className={styles.superTitle}>{meta.superTitle}</p>
              <h2 className={styles.mainTitle}>{meta.mainTitle}</h2>
              <p className={styles.subtitle}>{meta.subtitle}</p>
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
                          onKeyDown={(e) =>
                            e.key === "Enter" && setIsPlaying(true)
                          }
                        >
                          <span className={styles.videoPlayIconLarge}>▶</span>
                        </div>
                      </>
                    )}
                    <div className={styles.videoBadgeOverlay}>
                      {active.course}
                    </div>
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
                <blockquote
                  className={styles.quoteText}
                  dangerouslySetInnerHTML={{ __html: active.quote }}
                />
                <div className={styles.quoteFooter}>
                  <div className={styles.quoteAuthorBlock}>
                    <span className={styles.quoteAuthorName}>
                      {active.name}
                    </span>
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
              {videos.map((t, idx) => (
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
              {videos.map((_, idx) => (
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
          </>
        )}

        {/* ── Trust Strip ── */}
  
          <div className={styles.trustStripInner}>
            {meta.trustItems.map((item, i) => (
              <div className={styles.trustCard} key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={styles.trustCardGlow} aria-hidden="true" />
                <div className={styles.trustCardOrbit} aria-hidden="true">
                  <span className={styles.trustCardOrbitDot} />
                </div>
                <div className={styles.trustCardIconWrap}>
                  <span className={styles.trustCardIconRing} aria-hidden="true" />
                  <span className={styles.trustCardIcon}>{item.icon}</span>
                </div>
                <span className={styles.trustCardLabel}>{item.label}</span>
                <span className={styles.trustCardLine} aria-hidden="true" />
              </div>
            ))}
          
          <div className={styles.trustStripOm} aria-hidden="true">ॐ</div>
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </section>
  );
};

export default HomeTestimonialsSection;
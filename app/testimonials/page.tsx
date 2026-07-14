"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "@/assets/style/testimonials/Testimonialssection.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api"; // axios instance (baseURL = NEXT_PUBLIC_API_URL/api)

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface VideoReview {
  _id: string;
  courseType: string;
  name: string;
  country?: string;
  thumbnail?: string;
  videoUrl?: string;
  videoFile?: string;
  label?: string;
  rating?: number;
  status: "Active" | "Inactive";
}

interface TextReview {
  _id: string;
  courseType: string;
  name: string;
  country?: string;
  rating?: number;
  review: string;
  courseBadge?: string;
  date?: string;
  image?: string;
  status: "Active" | "Inactive";
}

/* ════════════════════════════════════════
   COURSE ORDER (display sequence)
════════════════════════════════════════ */
const COURSE_ORDER = [
  "100 Hour",
  "200 Hour",
  "300 Hour",
  "500 Hour",
  "Yoga Retreat",
  "Ayurveda",
];

/* ════════════════════════════════════════
   STAR RATING
════════════════════════════════════════ */
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
          <span
            className={styles.starFill}
            style={{ width: `${fill * 100}%` }}
          >
            ★
          </span>
        </span>
      );
    })}
  </div>
);

/* ════════════════════════════════════════
   VIDEO MODAL
════════════════════════════════════════ */
const VideoModal = ({
  video,
  onClose,
  baseUrl,
}: {
  video: VideoReview | null;
  onClose: () => void;
  baseUrl: string;
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
    return () => { document.body.style.overflow = ""; };
  }, [video]);

  if (!video) return null;

  /* ── helpers ── */
  const getYoutubeId = (url: string): string | null => {
    const patterns = [
      /youtube\.com\/watch\?v=([^&?/]+)/,
      /youtube\.com\/embed\/([^&?/]+)/,
      /youtu\.be\/([^&?/]+)/,
      /youtube\.com\/shorts\/([^&?/]+)/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  };

  const ytId = video.videoUrl ? getYoutubeId(video.videoUrl) : null;
  const hasYoutube = !!ytId;
  const hasDirectVideo = !!video.videoFile;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={video.name}
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
        {hasYoutube ? (
          /* YouTube — autoplay=1, mute=0 for sound, enablejsapi for control */
          <iframe
            className={styles.modalIframe}
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1`}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : hasDirectVideo ? (
          /* Uploaded video file — autoPlay + unmuted */
          <video
            className={styles.modalIframe}
            src={`${baseUrl}${video.videoFile}`}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <div className={styles.modalNoVideo}>
            <p>No video source available.</p>
          </div>
        )}
      </div>
      <p className={styles.modalTitle}>
        {video.name}
        {video.country ? ` — ${video.country}` : ""}
        {video.label ? ` · ${video.label}` : ""}
      </p>
    </div>
  );
};

/* ════════════════════════════════════════
   VIDEO CARD
════════════════════════════════════════ */
const VideoCard = ({
  video,
  onPlay,
  baseUrl,
  variant = "grid",
  tall = false,
}: {
  video: VideoReview;
  onPlay: (v: VideoReview) => void;
  baseUrl: string;
  variant?: "reel" | "grid";
  tall?: boolean;
}) => {
  const getYoutubeThumb = (url: string): string | null => {
    const patterns = [
      /youtube\.com\/watch\?v=([^&?/]+)/,
      /youtube\.com\/embed\/([^&?/]+)/,
      /youtu\.be\/([^&?/]+)/,
      /youtube\.com\/shorts\/([^&?/]+)/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
    }
    return null;
  };

  const thumb =
    video.thumbnail
      ? `${baseUrl}${video.thumbnail}`
      : video.videoUrl
      ? getYoutubeThumb(video.videoUrl)
      : null;

  if (variant === "reel") {
    return (
      <button
        className={styles.reelCard}
        onClick={() => onPlay(video)}
        aria-label={`Play: ${video.name}`}
        type="button"
      >
        <div className={styles.reelThumbWrap}>
          {thumb ? (
            <img
              className={styles.reelThumb}
              src={thumb}
              alt={video.name}
              loading="lazy"
            />
          ) : (
            <div className={styles.reelThumbPlaceholder} />
          )}
          <div className={styles.reelPlayBtn} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
              <polygon points="8,5 19,12 8,19" />
            </svg>
          </div>
          <div className={styles.reelOverlay}>
            <div className={styles.reelTitle}>{video.name}</div>
            {video.label && (
              <div className={styles.reelDuration}>{video.label}</div>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      className={styles.gridCard}
      onClick={() => onPlay(video)}
      aria-label={`Play: ${video.name}`}
      type="button"
    >
      <div className={tall ? styles.gridThumbWrapTall : styles.gridThumbWrap}>
        {thumb ? (
          <img
            className={styles.gridThumb}
            src={thumb}
            alt={video.name}
            loading="lazy"
          />
        ) : (
          <div className={styles.gridThumbPlaceholder} />
        )}
        <div className={styles.gridPlayIcon} aria-hidden="true">
          <svg viewBox="0 0 68 48" width="54" height="38">
            <rect width="68" height="48" rx="10" fill="#E8540A" opacity="0.95" />
            <polygon points="26,13 53,24 26,35" fill="#fff" />
          </svg>
        </div>
      </div>
      {(video.name || video.label) && (
        <div className={styles.gridLabel}>
          <div className={styles.gridLabelText}>{video.name}</div>
          {video.label && (
            <div className={styles.gridLabelSub}>{video.label}</div>
          )}
        </div>
      )}
    </button>
  );
};

/* ════════════════════════════════════════
   SLIDER COMPONENT
════════════════════════════════════════ */
function Slider<T>({
  items,
  renderItem,
  itemWidth,
  gap = 16,
  className,
}: {
  items: T[];
  renderItem: (item: T, i: number) => React.ReactNode;
  itemWidth: number;
  gap?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const visible = Math.floor(el.offsetWidth / (itemWidth + gap));
    setTotal(Math.max(0, items.length - visible));
  }, [items.length, itemWidth, gap]);

  const scrollTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, total));
      setCurrent(clamped);
      if (trackRef.current) {
        trackRef.current.scrollTo({
          left: clamped * (itemWidth + gap),
          behavior: "smooth",
        });
      }
    },
    [total, itemWidth, gap]
  );

  // sync scroll position → dot
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (itemWidth + gap));
      setCurrent(Math.max(0, Math.min(idx, total)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [itemWidth, gap, total]);

  return (
    <div className={`${styles.sliderRoot} ${className || ""}`}>
      {/* Prev */}
      <button
        className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
        onClick={() => scrollTo(current - 1)}
        disabled={current === 0}
        aria-label="Previous"
        type="button"
      >
        ‹
      </button>

      {/* Track */}
      <div className={styles.sliderTrackWrap}>
        <div className={styles.sliderTrack} ref={trackRef}>
          {items.map((item, i) => (
            <div
              key={i}
              className={styles.sliderItem}
              style={{ minWidth: itemWidth, maxWidth: itemWidth }}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      {/* Next */}
      <button
        className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
        onClick={() => scrollTo(current + 1)}
        disabled={current >= total}
        aria-label="Next"
        type="button"
      >
        ›
      </button>

      {/* Dots */}
      {total > 0 && (
        <div className={styles.sliderDots}>
          {Array.from({ length: total + 1 }).map((_, i) => (
            <button
              key={i}
              className={`${styles.sliderDot} ${
                i === current ? styles.sliderDotActive : ""
              }`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   TEXT REVIEW CARD
════════════════════════════════════════ */
const TextReviewCard = ({
  review,
  baseUrl,
}: {
  review: TextReview;
  baseUrl: string;
}) => (
  <div className={styles.textReviewCard}>
    <div className={styles.textReviewTop}>
      {review.image ? (
        <img
          src={`${baseUrl}${review.image}`}
          alt={review.name}
          className={styles.textReviewAvatar}
          loading="lazy"
        />
      ) : (
        <div className={styles.textReviewAvatarFallback}>
          {review.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className={styles.textReviewMeta}>
        <span className={styles.textReviewName}>{review.name}</span>
        {review.country && (
          <span className={styles.textReviewCountry}>{review.country}</span>
        )}
        {review.courseBadge && (
          <span className={styles.textReviewBadge}>{review.courseBadge}</span>
        )}
      </div>
      {review.rating != null && (
        <div className={styles.textReviewRating}>
          <StarRating score={review.rating} />
        </div>
      )}
    </div>
    <blockquote className={styles.textReviewBody}>
      <span className={styles.openQuoteMark}>"</span>
      {review.review}
    </blockquote>
    {review.date && (
      <p className={styles.textReviewDate}>
        {new Date(review.date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
        })}
      </p>
    )}
  </div>
);

/* ════════════════════════════════════════
   OM DIVIDER
════════════════════════════════════════ */
const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.divLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.divLine} />
  </div>
);

/* ════════════════════════════════════════
   BLOCK TITLE
════════════════════════════════════════ */
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

/* ════════════════════════════════════════
   LOADING SKELETON
════════════════════════════════════════ */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`${styles.skeleton} ${className || ""}`} />
);

/* ════════════════════════════════════════
   COURSE SECTION (video + text per course)
════════════════════════════════════════ */
const CourseSection = ({
  courseType,
  videos,
  texts,
  onPlay,
  baseUrl,
}: {
  courseType: string;
  videos: VideoReview[];
  texts: TextReview[];
  onPlay: (v: VideoReview) => void;
  baseUrl: string;
}) => {
  if (videos.length === 0 && texts.length === 0) return null;

  const chakras: Record<string, string> = {
    "100 Hour": "🌱",
    "200 Hour": "🪷",
    "300 Hour": "☀",
    "500 Hour": "🕉️",
    "Yoga Retreat": "❋",
    Ayurveda: "🌿",
  };

  /* ── Responsive video card width: show 3 at once on desktop, 2 on tablet, 1 on mobile ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoItemWidth, setVideoItemWidth] = useState(380);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const calc = () => {
      const w = el.offsetWidth;
      const gap = 16;
      if (w >= 900) {
        // 3 visible
        setVideoItemWidth(Math.floor((w - gap * 2) / 3));
      } else if (w >= 560) {
        // 2 visible
        setVideoItemWidth(Math.floor((w - gap) / 2));
      } else {
        // 1 visible
        setVideoItemWidth(w);
      }
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={styles.block} ref={containerRef}>
      <BlockTitle
        title={`${courseType} — Student Testimonials`}
        chakra={chakras[courseType] || "❋"}
      />

      {/* Video Slider */}
      {videos.length > 0 && (
        <>
          <p className={styles.sliderSectionLabel}>🎬 Video Testimonials</p>
          <Slider
            items={videos}
            itemWidth={videoItemWidth}
            gap={16}
            renderItem={(v) => (
              <VideoCard
                video={v}
                onPlay={onPlay}
                baseUrl={baseUrl}
                variant="grid"
                tall={true}
              />
            )}
          />
        </>
      )}

      {videos.length > 0 && texts.length > 0 && (
        <div className={styles.courseDivider} />
      )}

      {/* Text Slider */}
      {texts.length > 0 && (
        <>
          <p className={styles.sliderSectionLabel}>✍️ Written Reviews</p>
          <Slider
            items={texts}
            itemWidth={340}
            gap={16}
            renderItem={(t) => (
              <TextReviewCard review={t} baseUrl={baseUrl} />
            )}
          />
        </>
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   ALL VIDEOS BLOCK  (5 visible on desktop)
════════════════════════════════════════ */
const AllVideosBlock = ({
  allVideos,
  isLoading,
  onPlay,
  baseUrl,
}: {
  allVideos: VideoReview[];
  isLoading: boolean;
  onPlay: (v: VideoReview) => void;
  baseUrl: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(220);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const calc = () => {
      const w = el.offsetWidth;
      const gap = 12;
      if (w >= 1100) {
        setItemWidth(Math.floor((w - gap * 4) / 5)); // 5 visible
      } else if (w >= 860) {
        setItemWidth(Math.floor((w - gap * 3) / 4)); // 4 visible
      } else if (w >= 600) {
        setItemWidth(Math.floor((w - gap * 2) / 3)); // 3 visible
      } else if (w >= 380) {
        setItemWidth(Math.floor((w - gap) / 2));     // 2 visible
      } else {
        setItemWidth(w);                              // 1 visible
      }
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={styles.block} ref={containerRef}>
      <BlockTitle title="Student Video Testimonials" chakra="🕉️" />
      {isLoading ? (
        <div className={styles.skeletonReelRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={styles.skeletonReelItem} />
          ))}
        </div>
      ) : allVideos.length > 0 ? (
        <Slider
          items={allVideos}
          itemWidth={itemWidth}
          gap={12}
          renderItem={(v) => (
            <VideoCard
              video={v}
              onPlay={onPlay}
              baseUrl={baseUrl}
              variant="grid"
              tall={true}
            />
          )}
        />
      ) : (
        <p className={styles.emptyMsg}>No video testimonials yet.</p>
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function TestimonialsSection() {
  const [allVideos, setAllVideos] = useState<VideoReview[]>([]);
  const [allTexts, setAllTexts] = useState<TextReview[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingTexts, setLoadingTexts] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoReview | null>(null);

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  /* ── Fetch APIs ── */
  useEffect(() => {
    api
      .get("/video-reviews/get")
      .then(({ data }) => {
        const active = (data.data || []).filter(
          (v: VideoReview) => v.status === "Active"
        );
        setAllVideos(active);
      })
      .catch(console.error)
      .finally(() => setLoadingVideos(false));
  }, []);

  useEffect(() => {
    api
      .get("/student-reviews/get")
      .then(({ data }) => {
        const active = (data.data || []).filter(
          (t: TextReview) => t.status === "Active"
        );
        setAllTexts(active);
      })
      .catch(console.error)
      .finally(() => setLoadingTexts(false));
  }, []);

  /* ── helpers ── */
  const play = (v: VideoReview) => setActiveVideo(v);
  const close = () => setActiveVideo(null);

  /* Unique course types (ordered) */
  const allCourseTypes = Array.from(
    new Set([
      ...allVideos.map((v) => v.courseType),
      ...allTexts.map((t) => t.courseType),
    ])
  ).sort((a, b) => {
    const ai = COURSE_ORDER.indexOf(a);
    const bi = COURSE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const isLoading = loadingVideos || loadingTexts;

  return (
    <section className={styles.section}>
      {/* Decorative */}
      <div className={styles.mandalaTopLeft} aria-hidden="true" />
      <div className={styles.mandalaBottomRight} aria-hidden="true" />
      <div className={styles.chakraGlow} aria-hidden="true" />
      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ── PAGE HEADER ── */}
        <header className={styles.pageHeader}>
          <p className={styles.superTitle}>Sacred Stories of Transformation</p>
          <h1 className={styles.mainTitle}>
            Yoga Teacher Training — Testimonials
          </h1>
          <OmDivider />
        </header>

        {/* ── BLOCK 1: Ratings ── */}
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
                href="https://www.facebook.com/aymindia"
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

        {/* ── BLOCK 2: All Video Testimonials (Top — 5 per row) ── */}
        <AllVideosBlock
          allVideos={allVideos}
          isLoading={isLoading}
          onPlay={play}
          baseUrl={BASE_URL}
        />

        {/* ── BLOCKS 3+: Per-Course Sections (sorted) ── */}
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div className={styles.block} key={i}>
                <Skeleton className={styles.skeletonTitle} />
                <div className={styles.skeletonGrid}>
                  <Skeleton className={styles.skeletonCard} />
                  <Skeleton className={styles.skeletonCard} />
                  <Skeleton className={styles.skeletonCard} />
                </div>
              </div>
            ))}
          </>
        ) : (
          allCourseTypes.map((ct) => (
            <CourseSection
              key={ct}
              courseType={ct}
              videos={allVideos.filter((v) => v.courseType === ct)}
              texts={allTexts.filter((t) => t.courseType === ct)}
              onPlay={play}
              baseUrl={BASE_URL}
            />
          ))
        )}

        <OmDivider />
      </div>

      <div className={styles.bottomBorder} />

      {/* ── MODAL ── */}
      <VideoModal video={activeVideo} onClose={close} baseUrl={BASE_URL} />

      <HowToReach />
    </section>
  );
}
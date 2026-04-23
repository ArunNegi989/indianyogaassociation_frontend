"use client";
import React, { useState, useEffect } from "react";
import styles from "@/assets/style/Home/Reviewsection.module.css";
import api from "@/lib/api";

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
interface TextReview {
  name: string;
  country: string;
  image: string;
  rating: number;
  review: string;
  course: string;
  date: string;
}

interface VideoReview {
  name: string;
  country: string;
  thumbnail: string;
  videoUrl: string;
  label: string;
}

interface ReviewData {
  textReviews: TextReview[];
  videoReviews: VideoReview[];
  stats: { num: string; label: string }[];
  videoUrl: string;
}

// ✅ Zero required props — just call <ReviewSection />
export interface ReviewSectionProps {
  /** Optional: inject a ratings summary block between text reviews and video section */
  RatingsSummaryComponent?: React.ReactNode;
}

/* ══════════════════════════════════════════════════
   FALLBACK DATA
══════════════════════════════════════════════════ */
const fallbackVideoUrl =
  "https://youtube.com/shorts/lYeh7tUMLHQ?si=03G0hoIXn8S7neyp";

const fallbackTextReviews: TextReview[] = [
  {
    name: "Sarah Mitchell",
    country: "United States",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    review:
      "This 100-hour training completely transformed my understanding of yoga. The teachers were incredibly knowledgeable and patient. Rishikesh itself is magical — waking up to the sound of the Ganges every morning made the whole experience deeply spiritual. I came as a practitioner and left as a teacher.",
    course: "100 Hour YTTC",
    date: "March 2025",
  },
  {
    name: "Marco Rossi",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    rating: 5,
    review:
      "Excellent course structure and amazing teachers. The blend of Ashtanga, Vinyasa and Hatha gave me a well-rounded foundation. The accommodation was clean and comfortable, and the sattvic meals were delicious. I would highly recommend this school to anyone serious about yoga.",
    course: "100 Hour YTTC",
    date: "January 2025",
  },
  {
    name: "Yuki Tanaka",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    rating: 5,
    review:
      "The morning meditation sessions by the Ganges were life-changing. Our instructor's depth of knowledge about yoga philosophy was remarkable. The small batch size meant I got personal attention throughout. This is not just a certification course — it is a journey within.",
    course: "100 Hour YTTC",
    date: "February 2025",
  },
  {
    name: "Emma Clarke",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    rating: 5,
    review:
      "I was nervous coming as a beginner but the instructors made me feel so welcome. By the end of 13 days I could teach a full class confidently. The Yoga Alliance certification is a huge bonus. Rishikesh is the perfect backdrop for this kind of inner work.",
    course: "100 Hour YTTC",
    date: "April 2025",
  },
  {
    name: "David Chen",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    rating: 5,
    review:
      "Best investment I have made in myself. The combination of asana practice, pranayama, and philosophy made this so much more than just a physical training. The team genuinely cares about your growth. I left with skills, friends, and a completely new perspective on life.",
    course: "100 Hour YTTC",
    date: "December 2024",
  },
  {
    name: "Priya Sharma",
    country: "Canada",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
    rating: 5,
    review:
      "Coming to Rishikesh was a dream and this school made it even better. The curriculum is well-structured, the teachers are masters in their craft, and the energy of the place is unlike anywhere else. I came for the certificate but got so much more — peace, clarity, and purpose.",
    course: "100 Hour YTTC",
    date: "November 2024",
  },
];

const fallbackVideoReviews: VideoReview[] = [
  {
    name: "Jessica Williams",
    country: "USA",
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    videoUrl: fallbackVideoUrl,
    label: "Watch Review",
  },
  {
    name: "Thomas Müller",
    country: "Germany",
    thumbnail: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=600&q=80",
    videoUrl: fallbackVideoUrl,
    label: "Watch Review",
  },
  {
    name: "Aiko Nakamura",
    country: "Japan",
    thumbnail: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
    videoUrl: fallbackVideoUrl,
    label: "Watch Review",
  },
];

const fallbackStats = [
  { num: "500+", label: "Students Trained" },
  { num: "4.9★", label: "Average Rating" },
  { num: "40+", label: "Countries" },
];

/* ══════════════════════════════════════════════════
   VIDEO HELPERS
══════════════════════════════════════════════════ */
const getVideoType = (url: string) => {
  if (!url) return "none";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.endsWith(".mp4")) return "mp4";
  return "unknown";
};

const getYouTubeEmbed = (url: string) => {
  let videoId = "";
  if (url.includes("youtu.be")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
  else if (url.includes("shorts")) videoId = url.split("shorts/")[1]?.split("?")[0];
  else if (url.includes("watch?v=")) videoId = url.split("watch?v=")[1]?.split("&")[0];
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`
    : "";
};

const getInstagramEmbed = (url: string) => {
  const match = url.match(/instagram\.com\/reel\/([^/?]+)/);
  return match ? `https://www.instagram.com/reel/${match[1]}/embed` : "";
};

/* ══════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════ */
function DynamicVideo({ url }: { url: string }) {
  const type = getVideoType(url);
  if (type === "youtube") {
    const embedUrl = getYouTubeEmbed(url);
    if (!embedUrl) return <p>Invalid video URL</p>;
    return (
      <iframe
        className={styles.rvVideo}
        src={embedUrl}
        title="YouTube Video"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }
  if (type === "instagram") {
    return (
      <iframe
        className={styles.rvVideo}
        src={getInstagramEmbed(url)}
        title="Instagram Reel"
        frameBorder="0"
        allowFullScreen
      />
    );
  }
  if (type === "mp4") {
    return (
      <video autoPlay loop muted playsInline controls={false} className={styles.rvVideo}>
        <source src={url} type="video/mp4" />
      </video>
    );
  }
  return <p>No video available</p>;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className={styles.rvStarRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${styles.rvStar} ${i < count ? styles.rvStarFilled : styles.rvStarEmpty}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.rvOmDivider}>
      <div className={styles.rvDivLineLeft} />
      <div className={styles.rvOmDividerCenter}>
        {label && <span className={styles.rvOmDividerLabel}>{label}</span>}
      </div>
      <div className={styles.rvDivLineRight} />
    </div>
  );
}

function VintageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.rvVintageHeadingWrap}>
      <h2 className={styles.rvVintageHeading}>{children}</h2>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className={styles.rvSection}>
      <style>{`
        @keyframes rvShimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        .rv-skel {
          background: linear-gradient(90deg, #f0e8d8 25%, #e8d9c0 50%, #f0e8d8 75%);
          background-size: 200% 100%;
          animation: rvShimmer 1.4s infinite;
          border-radius: 6px;
        }
      `}</style>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div className="rv-skel" style={{ height: 16, width: 140, margin: "0 auto 12px" }} />
        <div className="rv-skel" style={{ height: 32, width: 300, margin: "0 auto 12px" }} />
        <div className="rv-skel" style={{ height: 16, width: 400, margin: "0 auto" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rv-skel" style={{ height: 220, borderRadius: 12 }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN EXPORT
   
   ✅ Zero props required:
      <ReviewSection />

   Optional:
      <ReviewSection RatingsSummaryComponent={<RatingsSummarySection />} />

   API: GET /reviews/get
   Expected response:
   {
     data: {
       videoUrl: string,        ← main video played in cards
       textReviews: TextReview[],
       videoReviews: VideoReview[],
       stats: { num, label }[]
     }
   }
   Falls back to built-in data if API fails or returns empty.
══════════════════════════════════════════════════ */
export default function ReviewSection({
  RatingsSummaryComponent,
}: ReviewSectionProps) {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [data, setData] = useState<ReviewData>({
    textReviews: fallbackTextReviews,
    videoReviews: fallbackVideoReviews,
    stats: fallbackStats,
    videoUrl: fallbackVideoUrl,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/reviews/get")
      .then((res) => {
        const d = res.data?.data;
        if (d) {
          setData({
            textReviews:
              Array.isArray(d.textReviews) && d.textReviews.length > 0
                ? d.textReviews
                : fallbackTextReviews,
            videoReviews:
              Array.isArray(d.videoReviews) && d.videoReviews.length > 0
                ? d.videoReviews
                : fallbackVideoReviews,
            stats:
              Array.isArray(d.stats) && d.stats.length > 0
                ? d.stats
                : fallbackStats,
            videoUrl: d.videoUrl || fallbackVideoUrl,
          });
        }
      })
      .catch(() => {
        // silently use fallback data
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ReviewSkeleton />;

  const { textReviews, videoReviews, stats, videoUrl } = data;

  return (
    <section className={styles.rvSection}>
      {/* ── HEADER ── */}
      <div className={styles.rvHeader}>
        <div className={styles.rvEyebrow}>Student Experiences</div>
        <VintageHeading>What Our Students Say</VintageHeading>
        <p className={styles.rvSubtitle}>
          Real stories from real yogis who transformed their lives at our Rishikesh ashram
        </p>
        <div className={styles.rvStatRow}>
          {stats.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className={styles.rvStatDiv} />}
              <div className={styles.rvStat}>
                <span className={styles.rvStatNum}>{s.num}</span>
                <span className={styles.rvStatLbl}>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── TEXT REVIEWS GRID ── */}
      <div className={styles.rvTextGrid}>
        {textReviews.map((r, i) => (
          <div
            key={i}
            className={styles.rvTextCard}
            style={{ "--tri": i } as React.CSSProperties}
          >
            <div className={styles.rvCardTop}>
              <div className={styles.rvAvatar}>
                <img src={r.image} alt={r.name} />
              </div>
              <div className={styles.rvInfo}>
                <div className={styles.rvName}>{r.name}</div>
                <div className={styles.rvCountry}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={styles.rvFlagIcon}
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2" />
                  </svg>
                  {r.country}
                </div>
                <StarRating count={r.rating} />
              </div>
              <div className={styles.rvCourseBadge}>{r.course}</div>
            </div>
            <div className={styles.rvQuoteIcon}>"</div>
            <p className={styles.rvReviewText}>{r.review}</p>
            <div className={styles.rvFooter}>
              <span className={styles.rvDate}>{r.date}</span>
              <div className={styles.rvVerified}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={styles.rvVerifiedIcon}
                >
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
                Verified Student
              </div>
            </div>
            <div className={styles.rvGlowLine} />
          </div>
        ))}
      </div>

      {/* ── RATINGS SUMMARY (optional slot) ── */}
      {RatingsSummaryComponent && (
        <div className={styles.rvRatingsWrap}>{RatingsSummaryComponent}</div>
      )}

      {/* ── VIDEO TESTIMONIALS ── */}
      <OmDivider label="Video Testimonials" />
      <div className={styles.rvVideoWrap}>
        <div className={styles.rvVideoGrid}>
          {videoReviews.map((vr, i) => (
            <div
              key={i}
              className={styles.rvVideoCard}
              style={{ "--vri": i } as React.CSSProperties}
            >
              <div
                className={styles.rvThumbWrap}
                onClick={() => setActiveVideo(activeVideo === i ? null : i)}
              >
                {activeVideo === i ? (
                  <div className={styles.rvVideoActive}>
                    {/* Each card uses its own videoUrl from API, falls back to section-level videoUrl */}
                    <DynamicVideo url={vr.videoUrl || videoUrl} />
                  </div>
                ) : (
                  <>
                    <img src={vr.thumbnail} alt={vr.name} className={styles.rvThumb} />
                    <div className={styles.rvOverlay} />
                    <div className={styles.rvPlayBtn}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className={styles.rvLabel}>{vr.label}</div>
                  </>
                )}
              </div>
              <div className={styles.rvVideoInfo}>
                <div className={styles.rvVideoName}>{vr.name}</div>
                <div className={styles.rvVideoCountry}>{vr.country}</div>
                <StarRating count={5} />
              </div>
            </div>
          ))}
        </div>

        {/* ── SIDE PANEL ── */}
        <div className={styles.rvSidePanel}>
          <div className={styles.rvSideInner}>
            <div className={styles.rvSideIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M15 10l4.553-2.277A1 1 0 0121 8.677V15.32a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <h3 className={styles.rvSideTitle}>Real Stories, Real Transformation</h3>
            <p className={styles.rvSideText}>
              Watch our students share their firsthand experiences of the 100-hour yoga teacher
              training in Rishikesh — from the first day to graduation.
            </p>
            <div className={styles.rvSideStats}>
              <div className={styles.rvSideStat}>
                <span className={styles.rvSideStatNum}>100+</span>
                <span className={styles.rvSideStatLbl}>Video Reviews</span>
              </div>
              <div className={styles.rvSideStat}>
                <span className={styles.rvSideStatNum}>98%</span>
                <span className={styles.rvSideStatLbl}>Recommend Us</span>
              </div>
            </div>
            <a href="#dates-fees" className={styles.rvSideBtn}>
              Join Next Batch
              <svg viewBox="0 0 16 16" fill="none" className={styles.rvSideBtnArrow}>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
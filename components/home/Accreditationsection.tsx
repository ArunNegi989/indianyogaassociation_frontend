"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../assets/style/Home/Accreditationsection.module.css";
import api from "@/lib/api";
import Link from "next/link";

const getImageUrl = (path: string) => {
  if (!path) return "";
  const cleanPath = path.replace(/\\/g, "/");
  return `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
};

function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function SmartVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isUserActive, setIsUserActive] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gate for the heavy YouTube iframe — only becomes true on click
  const [ytLoaded, setYtLoaded] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const showControls = () => {
    setIsUserActive(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setIsUserActive(false), 3000);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const youtubeVideoId = getYouTubeVideoId(src);

  if (youtubeVideoId) {
    // ── Not yet clicked: show a static thumbnail + play button.
    // The ~800KB YouTube player JS never downloads until the user clicks.
    if (!ytLoaded) {
      return (
        <button
          type="button"
          onClick={() => setYtLoaded(true)}
          aria-label="Play video: AYM Yoga School, Rishikesh"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            border: "none",
            padding: 0,
            cursor: "pointer",
            backgroundImage: `url(https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 68,
              height: 48,
            }}
          >
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.31 5.42 6.09C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.16 5.42-6.09C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                fill="#f00"
              />
              <path d="M45 24 27 14v20" fill="#fff" />
            </svg>
          </span>
        </button>
      );
    }

    // ── Clicked: now load the real iframe with autoplay
    const embedSrc = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&autoplay=1&mute=1&loop=1&controls=1&playsinline=1&playlist=${youtubeVideoId}`;
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <iframe
          src={embedSrc}
          title="AYM Yoga School, Rishikesh"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseEnter={showControls}
      onMouseMove={showControls}
      onTouchStart={showControls}
      onClick={showControls}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          cursor: "pointer",
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.72))",
          padding: "28px 14px 10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          opacity: isUserActive ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: isUserActive ? "auto" : "none",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            const v = videoRef.current;
            if (!v) return;
            v.paused ? v.play() : v.pause();
            showControls();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontSize: "20px",
            padding: "2px",
          }}
        >
          ⏯
        </button>
        <button
          onClick={toggleMute}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontSize: "18px",
            padding: "2px",
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          defaultValue={0}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const v = videoRef.current;
            if (!v) return;
            const vol = parseFloat(e.target.value);
            v.volume = vol;
            v.muted = vol === 0;
            setIsMuted(vol === 0);
            showControls();
          }}
          style={{ width: "70px", accentColor: "#fff", cursor: "pointer" }}
        />
        <input
          type="range"
          min={0}
          max={100}
          defaultValue={0}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const v = videoRef.current;
            if (!v) return;
            v.currentTime = (parseFloat(e.target.value) / 100) * v.duration;
            showControls();
          }}
          style={{ flex: 1, accentColor: "#e65c00", cursor: "pointer" }}
        />
      </div>

      {!isUserActive && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "12px",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: "20px",
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
          }}
        >
          🔇 Hover for controls
        </div>
      )}
    </div>
  );
}

/* ── Types ── */
interface AyushCourse {
  _id?: string;
  icon: string;
  level: string;
  name: string;
}

interface AwardCert {
  _id?: string;
  label: string;
  tag: string;
  alt?: string;
  image: string;
  descPara1?: string;
  descPara2?: string;
  metaPoint1?: string;
  metaPoint2?: string;
  metaPoint3?: string;
  metaPoint4?: string;
  pullQuote?: string;
  ayushSubtitle?: string;
  ayushCourses?: AyushCourse[];
  ayushFooter?: string;
}

/* ── Award Row — fully dynamic from API ── */
function AwardRow({ cert }: { cert: AwardCert }) {
  const metaPoints = [
    cert.metaPoint1,
    cert.metaPoint2,
    cert.metaPoint3,
    cert.metaPoint4,
  ].filter(Boolean) as string[];

  const ayushCourses: AyushCourse[] = cert.ayushCourses || [];

  return (
    <div className={styles.awardRow}>
      <div className={styles.awardImageCol}>
        <div className={styles.awardImgFrame}>
          <Image
            src={getImageUrl(cert.image)}
            alt={cert.alt || cert.label}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
          <div className={`${styles.corner} ${styles.tl}`} />
          <div className={`${styles.corner} ${styles.tr}`} />
          <div className={`${styles.corner} ${styles.bl}`} />
          <div className={`${styles.corner} ${styles.br}`} />
        </div>
        <span className={styles.awardBadge}>✦ {cert.tag} ✦</span>
      </div>

      <div className={styles.awardDescCol}>
        <h3 className={styles.awardName}>{cert.label}</h3>
        <div className={styles.descDivider} />

        {cert.descPara1 && <p className={styles.para}>{cert.descPara1}</p>}
        {cert.descPara2 && <p className={styles.para}>{cert.descPara2}</p>}

        {metaPoints.length > 0 && (
          <div className={styles.awardMeta}>
            {metaPoints.map((point, i) => (
              <div className={styles.metaItem} key={i}>
                <span className={styles.metaDot} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        )}

        {cert.pullQuote && (
          <div className={styles.awardPullQuote}>"{cert.pullQuote}"</div>
        )}
      </div>

      <div className={styles.ayushCol}>
        <div className={styles.ayushHeader}>
          <span className={styles.ayushLabel}>
            ✦ AYUSH Certified Courses ✦
          </span>
          {cert.ayushSubtitle && (
            <p className={styles.ayushSubtitle}>{cert.ayushSubtitle}</p>
          )}
        </div>

        {ayushCourses.length > 0 && (
          <div className={styles.coursesGrid}>
            {ayushCourses.map((course, i) => (
              <div className={styles.courseBox} key={course._id || i}>
                <span className={styles.courseIcon}>{course.icon}</span>
                <div className={styles.courseLevel}>{course.level}</div>
                <div className={styles.courseName}>{course.name}</div>
              </div>
            ))}
          </div>
        )}

        {cert.ayushFooter && (
          <div className={styles.ayushFooter}>{cert.ayushFooter}</div>
        )}
      </div>
    </div>
  );
}

/* ── Fixed-height skeleton — replaces the old plain "Loading..." text.
   Reserves roughly the same vertical space this section occupies once
   loaded, so nothing jumps into view and CLS stays low. Tune the
   min-heights below if your real content is taller/shorter. ── */
function AccreditationSkeleton() {
  const shimmer: React.CSSProperties = {
    background:
      "linear-gradient(90deg, #fdf0dc 25%, #ffe8c2 50%, #fdf0dc 75%)",
    borderRadius: "8px",
    animation: "acc-pulse 1.5s ease-in-out infinite",
  };
  return (
    <div style={{ padding: "3rem 1rem", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{ height: 32, width: "40%", margin: "0 auto 2rem", ...shimmer }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          minHeight: 320,
        }}
      >
        <div style={{ ...shimmer, minHeight: 320 }} />
        <div style={{ ...shimmer, minHeight: 320 }} />
      </div>
      <div style={{ height: 220, marginTop: "2rem", ...shimmer }} />
      <style>{`
        @keyframes acc-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export const AccreditationSection: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/accreditation");
        setData(res.data.data[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <AccreditationSkeleton />;
  if (!data) return null;

  const courseCerts: any[] = data.courseCerts || [];
  const awardCerts: AwardCert[] = data.awardCerts || [];

  return (
    <>
      {/* ══════════════ AUTHENTIC SECTION ══════════════ */}
      <section className={styles.authenticSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2 className={styles.sectionTitle}>{data.sectionTitle}</h2>
            <div className={styles.titleUnderline} />
          </div>

          <div className={styles.authGrid}>
            <div className={styles.authText}>
              <p className={styles.para}>{data.authPara1}</p>
              <p className={styles.para}>{data.authPara2}</p>
              <p className={styles.para}>{data.authPara3}</p>
              <p className={styles.para}>{data.authPara4}</p>
            </div>

            <div className={styles.authImageCol}>
              <div className={styles.authImageFrame}>
                <div className={styles.authImageInner}>
                  {/*
                    ⚠️ FIX: removed the second `priority` image.
                    Only ONE priority/preloaded image should exist per page —
                    that's the first hero slider slide (idx === 0 in
                    HomepageSlider). A second `priority` image here was
                    competing for the browser's high-priority fetch queue
                    and slowing down the real LCP element.
                    `loading="lazy"` is safe since this section renders
                    well below the fold.
                  */}
                  <Image
                    src={getImageUrl(data.mainImage)}
                    alt={data.imageCaption}
                    width={420}
                    height={300}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    loading="lazy"
                  />
                  <p className={styles.imageCaption}>{data.imageCaption}</p>
                </div>
                <div className={styles.frameCornerTL} />
                <div className={styles.frameCornerTR} />
                <div className={styles.frameCornerBL} />
                <div className={styles.frameCornerBR} />
              </div>

              <div className={styles.pullQuote}>
                <span className={styles.pullQMark}>"</span>
                {data.pullQuote}
                <span className={styles.pullQMark}>"</span>
              </div>
            </div>
          </div>

          <div className={styles.videoImmerse}>
            <div className={styles.videoBlock}>
              <div className={styles.videoPlaceholder}>
                <SmartVideo
                  src={data.videoSrc}
                  poster="/images/video-thumbnail.jpg"
                />
              </div>
            </div>

            <div className={styles.immerseBlock}>
              <h3 className={styles.immerseTitle}>{data.immerseTitle}</h3>
              <div className={styles.immerseDivider} />
              <p className={styles.para}>{data.immersePara1}</p>
              <p className={styles.para}>{data.immersePara2}</p>
              <Link href={data.immerseCtaLink} className={styles.knowMoreBtn}>
                {data.immerseCtaText}{" "}
                <span className={styles.btnArrow}>→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.bottomBorder} />
      </section>

      {/* ══════════════ RECOGNITION SECTION ══════════════ */}
      <section className={styles.recognitionSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2 className={styles.sectionTitle}>{data.recognitionTitle}</h2>
            <div className={styles.titleUnderline} />
          </div>

          <div className={styles.recognitionText}>
            <p className={styles.para}>{data.recognitionPara1}</p>
            <p className={styles.para}>{data.recognitionPara2}</p>
          </div>

          {courseCerts.length > 0 && (
            <div className={styles.certsBlock}>
              <div className={styles.certsBlockHeader}>
                <span className={styles.certsBlockDecor}>✦</span>
                <h3 className={styles.certsBlockTitle}>Our Best Courses</h3>
                <span className={styles.certsBlockDecor}>✦</span>
              </div>
              <div className={styles.certsBlockLine} />
              <div className={styles.certsGrid4}>
                {courseCerts.map((cert: any, index: number) => (
                  <div className={styles.certCard} key={index}>
                    <div className={styles.certImageWrap}>
                      <Image
                        src={getImageUrl(cert.image)}
                        alt={cert.alt || cert.label}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.certCardFooter}>
                      <span className={styles.certTag}>{cert.tag}</span>
                      <span className={styles.certCardLabel}>
                        {cert.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {awardCerts.length > 0 && (
            <div className={styles.certsBlock}>
              <div className={styles.certsBlockHeader}>
                <span className={styles.certsBlockDecor}>✦</span>
                <h3 className={styles.certsBlockTitle}>Awards</h3>
                <span className={styles.certsBlockDecor}>✦</span>
              </div>
              <div className={styles.certsBlockLine} />

              <div className={styles.awardsStack}>
                {awardCerts.map((cert: AwardCert, index: number) => (
                  <AwardRow key={cert._id || index} cert={cert} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AccreditationSection;
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../assets/style/Home/Accreditationsection.module.css";
import api from "@/lib/api";

const getImageUrl = (path: string) => {
  if (!path) return "";
  const cleanPath = path.replace(/\\/g, "/");
  return `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
};

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match)
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  return null;
}

function SmartVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isUserActive, setIsUserActive] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const youtubeEmbedUrl = getYouTubeEmbedUrl(src);
  if (youtubeEmbedUrl) {
    const embedSrc = `${youtubeEmbedUrl}&autoplay=1&mute=1&loop=1&controls=1&modestbranding=1&playsinline=1`;
    return (
      <div
        style={{ position: "relative", width: "100%", height: "100%" }}
        onMouseEnter={showControls}
        onMouseMove={showControls}
        onTouchStart={showControls}
      >
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

export const AccreditationSection: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalImg, setModalImg] = useState<any>(null);

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalImg(null);
    };
    if (modalImg) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalImg]);

  useEffect(() => {
    document.body.style.overflow = modalImg ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalImg]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  return (
    <>
      {/* ══════════════ AUTHENTIC SECTION ══════════════ */}
      <section className={styles.authenticSection}>
        <div className={styles.topBorder} />
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
                    priority
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
              <a href={data.immerseCtaLink} className={styles.knowMoreBtn}>
                {data.immerseCtaText}{" "}
                <span className={styles.btnArrow}>→</span>
              </a>
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

          {/* ── 3-2-1 Pyramid Grid ── */}
          <div className={styles.certsGrid}>

            {/* Row 1 — 3 cards */}
            <div className={styles.certsRow}>
              {data.certs.slice(0, 3).map((cert: any, index: number) => (
                <div
                  key={index}
                  className={styles.certCard}
                  onClick={() => setModalImg(cert)}
                >
                  <div className={styles.certImageWrap}>
                    <Image
                      src={getImageUrl(cert.image)}
                      alt={cert.alt}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.certCardFooter}>
                    <span className={styles.certTag}>{cert.tag}</span>
                    <span className={styles.certCardLabel}>{cert.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 — 2 cards */}
            <div className={styles.certsRow}>
              {data.certs.slice(3, 5).map((cert: any, index: number) => (
                <div
                  key={index + 3}
                  className={styles.certCard}
                  onClick={() => setModalImg(cert)}
                >
                  <div className={styles.certImageWrap}>
                    <Image
                      src={getImageUrl(cert.image)}
                      alt={cert.alt}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.certCardFooter}>
                    <span className={styles.certTag}>{cert.tag}</span>
                    <span className={styles.certCardLabel}>{cert.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3 — 1 card (centered) */}
            <div className={styles.certsRow}>
              {data.certs.slice(5, 6).map((cert: any, index: number) => (
                <div
                  key={index + 5}
                  className={styles.certCard}
                  onClick={() => setModalImg(cert)}
                >
                  <div className={styles.certImageWrap}>
                    <Image
                      src={getImageUrl(cert.image)}
                      alt={cert.alt}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.certCardFooter}>
                    <span className={styles.certTag}>{cert.tag}</span>
                    <span className={styles.certCardLabel}>{cert.label}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
          {/* ── End Pyramid Grid ── */}

          <div className={styles.badgesRow}>
            {data.badges.map((b: any, i: number) => (
              <React.Fragment key={i}>
                <div className={styles.badge}>
                  <span className={styles.badgeIcon}>{b.icon}</span>
                  <span className={styles.badgeText}>{b.text}</span>
                </div>
                {i < data.badges.length - 1 && (
                  <div className={styles.badgeSep}>✦</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ MODAL ══════════════ */}
      {modalImg && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setModalImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Certificate preview"
        >
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setModalImg(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className={styles.modalImageWrap}>
              <Image
                src={getImageUrl(modalImg.image)}
                alt={modalImg.alt}
                width={800}
                height={560}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "6px",
                }}
                priority
              />
            </div>

            <div className={styles.modalCaption}>
              <span className={styles.modalTag}>{modalImg.tag}</span>
              <h3 className={styles.modalLabel}>{modalImg.label}</h3>
              <p className={styles.modalAlt}>{modalImg.alt}</p>
            </div>

            <div className={styles.modalNav}>
              <button
                className={styles.modalNavBtn}
                onClick={() => {
                  const idx = data.certs.findIndex((c: any) => c === modalImg);
                  setModalImg(
                    data.certs[(idx - 1 + data.certs.length) % data.certs.length]
                  );
                }}
              >
                ← Prev
              </button>
              <span className={styles.modalNavCount}>
                {data.certs.findIndex((c: any) => c === modalImg) + 1} /{" "}
                {data.certs.length}
              </span>
              <button
                className={styles.modalNavBtn}
                onClick={() => {
                  const idx = data.certs.findIndex((c: any) => c === modalImg);
                  setModalImg(data.certs[(idx + 1) % data.certs.length]);
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccreditationSection;
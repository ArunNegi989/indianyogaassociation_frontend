"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../assets/style/Home/Accreditationsection.module.css";
import mainimage1 from "../../assets/images/yoga-teacher-training-syllabus.webp";
import modalimage1 from "../../assets/images/Minstry-Of-Ayush,-Government-of-India-for-web.webp";
import modalimage2 from "../../assets/images/500-hour-yoga-alliance-certiifcate-usa.jpg";
import modalimage3 from "../../assets/images/gea-thumb.webp";

const VIDEO_SRC = "https://youtu.be/A-Zcjg1_y5U?si=3dDAaSf25x1u8Wwa";

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

  // Autoplay when scrolled into view
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
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

const certImages = [
  {
    id: 1,
    src: modalimage1,
    alt: "Yoga Certification Board — Ministry of AYUSH, Government of India",
    label: "YCB — Govt. of India",
    tag: "Official Accreditation",
  },
  {
    id: 2,
    src: modalimage2,
    alt: "Yoga Alliance USA — Certificate of Registration RYS 500",
    label: "Yoga Alliance USA — RYS 500",
    tag: "International Recognition",
  },
  {
    id: 3,
    src: modalimage3,
    alt: "Global Excellence Awards 2019 — Certificate of Excellence, AYM Yoga Training School",
    label: "Global Excellence Awards 2019",
    tag: "Award of Excellence",
  },
];

export const AccreditationSection: React.FC = () => {
  const [modalImg, setModalImg] = useState<(typeof certImages)[0] | null>(null);

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

  return (
    <>
      <section className={styles.authenticSection}>
        <div className={styles.topBorder} />
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2 className={styles.sectionTitle}>
              Authentic, Internationally recognized Yoga Teacher Training
              Certification School in Rishikesh
            </h2>
            <div className={styles.titleUnderline} />
          </div>

          <div className={styles.authGrid}>
            <div className={styles.authText}>
              <p className={styles.para}>
                Our Yoga Teacher Training in Rishikesh is accredited by Yoga
                Alliance USA, ensuring a globally recognized certification. We
                also align with the Yoga Certification Board (YCB) of India,
                under the Ministry of Ayush, Govt. of India, making our
                certification highly valued among aspiring yoga teachers
                worldwide.
              </p>
              <p className={styles.para}>
                Our yoga school in Rishikesh offers a well-structured and
                updated curriculum for Beginner, Foundation, Intermediate, and
                Advanced Yoga TTC in Rishikesh, ensuring that each student
                receives the best and most comprehensive yoga education.
              </p>
              <p className={styles.para}>
                Our training is deeply rooted in traditional yoga practices,
                including asana, pranayama, meditation, and detoxification
                techniques. We also offer specialized programs such as{" "}
                <strong className={styles.highlight}>
                  Kundalini Yoga Teacher Training
                </strong>
                ,{" "}
                <strong className={styles.highlight}>
                  Prenatal Yoga Teacher Training
                </strong>
                , and{" "}
                <strong className={styles.highlight}>
                  Hatha Yoga Teacher Training
                </strong>
                .
              </p>
              <p className={styles.para}>
                In addition to our immersive teacher training courses, we
                provide online Rishikesh yoga class training, connecting yoga
                enthusiasts worldwide. Whether you are a beginner or an advanced
                practitioner, our TTC in Rishikesh will help you deepen your
                practice and become a certified yoga teacher.
              </p>
            </div>

            <div className={styles.authImageCol}>
              <div className={styles.authImageFrame}>
                <div className={styles.authImageInner}>
                  <Image
                    src={mainimage1}
                    alt="AYM Study Materials & Curriculum"
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
                  <p className={styles.imageCaption}>
                    AYM Study Materials &amp; Curriculum
                  </p>
                </div>
                <div className={styles.frameCornerTL} />
                <div className={styles.frameCornerTR} />
                <div className={styles.frameCornerBL} />
                <div className={styles.frameCornerBR} />
              </div>

              <div className={styles.pullQuote}>
                <span className={styles.pullQMark}>"</span>
                Learn, grow, and transform.
                <span className={styles.pullQMark}>"</span>
              </div>
            </div>
          </div>

          <div className={styles.videoImmerse}>
            <div className={styles.videoBlock}>
              <div className={styles.videoPlaceholder}>
                <SmartVideo
                  src={VIDEO_SRC}
                  poster="/images/video-thumbnail.jpg"
                />
              </div>
            </div>

            <div className={styles.immerseBlock}>
              <h3 className={styles.immerseTitle}>
                Immerse Yourself in Yoga in Rishikesh
              </h3>
              <div className={styles.immerseDivider} />
              <p className={styles.para}>
                Rishikesh, the Yoga Capital of the World, invites you to embark
                on a journey of self-discovery and transformation. Nestled
                amidst the majestic Himalayas and the sacred Ganges River, this
                spiritual haven offers the perfect setting to deepen your
                practice and reconnect with yourself.
              </p>
              <p className={styles.para}>
                From mastering breathwork and asanas to exploring meditation,
                learning yoga in Rishikesh is a truly enriching experience — a
                gift of wellness and inner peace that lasts a lifetime.
              </p>
              <a href="/about" className={styles.knowMoreBtn}>
                Know More About AYM <span className={styles.btnArrow}>→</span>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottomBorder} />
      </section>

      <section className={styles.recognitionSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2 className={styles.sectionTitle}>
              Recognition &amp; Endorsements
            </h2>
            <div className={styles.titleUnderline} />
          </div>

          <div className={styles.recognitionText}>
            <p className={styles.para}>
              At AYM Yoga School in Rishikesh, a leading Yoga Teacher Training
              School in Rishikesh, all our programs are accredited by the Yoga
              Certification Board (YCB), India, and Yoga Alliance, USA. After
              completing any Yoga Teacher Training in Rishikesh, students can
              register with Yoga Alliance USA and receive an internationally
              recognized certification, paving the way for teaching
              opportunities worldwide.
            </p>
            <p className={styles.para}>
              If you're looking for the best Yoga TTC in Rishikesh, AYM Yoga
              School is the perfect place to begin your journey. As a
              well-established Yoga Teacher Training School in Rishikesh, we
              ensure a transformative experience where you can train with the
              best, immerse yourself in authentic yogic traditions, and unlock
              new possibilities in the yoga capital of the world.
            </p>
          </div>

          <div className={styles.certsGrid}>
            {certImages.map((cert) => (
              <div
                key={cert.id}
                className={styles.certCard}
                onClick={() => setModalImg(cert)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setModalImg(cert)}
                aria-label={`View certificate: ${cert.label}`}
              >
                <div className={styles.certImageWrap}>
                  <div
                    className={styles.certImageContainer}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "248px",
                    }}
                  >
                    <Image
                      src={cert.src}
                      alt={cert.alt}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.certOverlay}>
                    <span className={styles.certZoomIcon}>🔍</span>
                    <span className={styles.certZoomText}>
                      Click to Enlarge
                    </span>
                  </div>
                </div>
                <div className={styles.certCardFooter}>
                  <span className={styles.certTag}>{cert.tag}</span>
                  <span className={styles.certCardLabel}>{cert.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.badgesRow}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🏅</span>
              <span className={styles.badgeText}>
                Yoga Alliance USA — RYS 200 &amp; 300 &amp; 500
              </span>
            </div>
            <div className={styles.badgeSep}>✦</div>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🏛️</span>
              <span className={styles.badgeText}>
                YCB — Ministry of AYUSH, Govt. of India
              </span>
            </div>
            <div className={styles.badgeSep}>✦</div>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🏆</span>
              <span className={styles.badgeText}>
                Global Excellence Awards 2019
              </span>
            </div>
          </div>
        </div>
      </section>

      {modalImg && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setModalImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Certificate preview"
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setModalImg(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className={styles.modalImageWrap}>
              <Image
                src={modalImg.src}
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
                  const idx = certImages.findIndex((c) => c.id === modalImg.id);
                  setModalImg(
                    certImages[
                      (idx - 1 + certImages.length) % certImages.length
                    ],
                  );
                }}
              >
                ← Prev
              </button>
              <span className={styles.modalNavCount}>
                {certImages.findIndex((c) => c.id === modalImg.id) + 1} /{" "}
                {certImages.length}
              </span>
              <button
                className={styles.modalNavBtn}
                onClick={() => {
                  const idx = certImages.findIndex((c) => c.id === modalImg.id);
                  setModalImg(certImages[(idx + 1) % certImages.length]);
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

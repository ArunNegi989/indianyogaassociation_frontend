"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "@/assets/style/gallery/Gallerypage.module.css";

/* ─────────────────────────────────────────────────────────
   IMAGE MAP — Unsplash free URLs grouped by section
───────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: "luxury",
    tab: "Luxury",
    heading: "Luxury Accommdation - AYM Yoga School",
    images: [
      {
        src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85",
        label: "Luxury Room",
      },
      {
        src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=85",
        label: "Luxury Room",
      },
      {
        src: "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=900&q=85",
        label: "Luxury Room",
      },
      {
        src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85",
        label: "Luxury Room Bath",
      },
    ],
  },
  {
    id: "private",
    tab: "Private",
    heading: "Private Accommdation - AYM Yoga School",
    images: [
      {
        src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
        label: "Private Room",
      },
      {
        src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85",
        label: "Private Room",
      },
      {
        src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=900&q=85",
        label: "Private Room",
      },
      {
        src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=85",
        label: "Private Room Bath",
      },
    ],
  },
  {
    id: "twin",
    tab: "Twin/Shared",
    heading: "Twin / Shared Accommdation - AYM Yoga School",
    images: [
      {
        src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=900&q=85",
        label: "Shared Room",
      },
      {
        src: "https://images.unsplash.com/photo-1558882224-dda166733046?w=900&q=85",
        label: "Shared Room",
      },
      {
        src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85",
        label: "Shared Room",
      },
      {
        src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85",
        label: "Shared Room Bath",
      },
    ],
    // ← layout: "twin" removed — ab standard grid use hoga
  },
  {
    id: "male-dorm",
    tab: "Male Dorm",
    heading: "Male Dormitory - AYM Yoga School",
    images: [
      {
        src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85",
        label: "Dormitory Room",
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85",
        label: "Dormitory Room",
      },
      {
        src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=85",
        label: "Dormitory Room Bath",
      },
    ],
    cols: 3,
  },
  {
    id: "female-dorm",
    tab: "Female Dorm",
    heading: "Female Dormitory - AYM Yoga School",
    images: [
      {
        src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
        label: "Dormitory Room",
      },
      {
        src: "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=900&q=85",
        label: "Dormitory Room",
      },
      {
        src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85",
        label: "Dormitory Room Bath",
      },
    ],
    cols: 3,
  },
  {
    id: "yoga-halls",
    tab: "Yoga Halls",
    heading: "Yoga School - Yoga Halls",
    images: [
      {
        src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85",
        label: "Yoga Hall",
      },
      {
        src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85",
        label: "Yoga Hall",
      },
      {
        src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=85",
        label: "Yoga Hall",
      },
      {
        src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=900&q=85",
        label: "Yoga Hall",
      },
    ],
  },
  {
    id: "food",
    tab: "Food",
    heading: "Food - AYM Yoga School",
    images: [
      {
        src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=85",
        label: "Food",
      },
      {
        src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&q=85",
        label: "Food",
      },
      {
        src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=85",
        label: "Food",
      },
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85",
        label: "Food",
      },
    ],
  },
  {
    id: "dining",
    tab: "Dining Hall",
    heading: "Dining Hall - AYM Yoga School",
    images: [
      {
        src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85",
        label: "Dinning Hall",
      },
      {
        src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85",
        label: "Dinning Hall",
      },
      {
        src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=85",
        label: "Dinning Hall",
      },
    ],
    cols: 3,
  },
  {
    id: "school",
    tab: "AYM School",
    heading: "AYM Yoga School",
    images: [
      {
        src: "https://images.unsplash.com/photo-1585348150499-4b9454cbaa06?w=900&q=85",
        label: "Garden",
      },
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
        label: "Garden",
      },
      {
        src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85",
        label: "Garden",
      },
      {
        src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=85",
        label: "Garden",
      },
      {
        src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85",
        label: "Garden",
      },
      {
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85",
        label: "Garden",
      },
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85",
        label: "Garden",
      },
      {
        src: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=900&q=85",
        label: "Garden",
      },
    ],
    cols: 4,
    rows2: true,
  },
];

/* ── ALL TABS for the tab bar ── */
const ALL_TABS = [{ id: "all", tab: "All" }, ...SECTIONS];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [modal, setModal] = useState<{
    src: string;
    label: string;
    allImgs: { src: string; label: string }[];
    idx: number;
  } | null>(null);

  /* Flatten all images for "All" tab */
  const allImages = SECTIONS.flatMap((s) =>
    s.images.map((img) => ({ ...img, section: s.heading }))
  );

  /* Close modal on Escape, navigate with arrow keys */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!modal) return;
      if (e.key === "Escape") setModal(null);
      if (e.key === "ArrowRight") {
        const next = (modal.idx + 1) % modal.allImgs.length;
        setModal({ ...modal, idx: next, src: modal.allImgs[next].src, label: modal.allImgs[next].label });
      }
      if (e.key === "ArrowLeft") {
        const prev = (modal.idx - 1 + modal.allImgs.length) % modal.allImgs.length;
        setModal({ ...modal, idx: prev, src: modal.allImgs[prev].src, label: modal.allImgs[prev].label });
      }
    },
    [modal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* Lock body scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  const openModal = (
    src: string,
    label: string,
    allImgs: { src: string; label: string }[],
    idx: number
  ) => setModal({ src, label, allImgs, idx });

  const visibleSections =
    activeTab === "all"
      ? SECTIONS
      : SECTIONS.filter((s) => s.id === activeTab);

  return (
    <div className={styles.page}>

      {/* ══════════════════════════════════
          PAGE HEADER
      ══════════════════════════════════ */}
      <section className={styles.pageHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>
            Explore Life at AYM Yoga School – Through the Lens
          </h1>
          <div className={styles.titleRule} />
          <p className={styles.headerPara}>
            Explore the vibrant life at AYM Yoga School in Rishikesh through our photo
            gallery—featuring yoga classes, serene accommodation, nutritious meals, and scenic
            surroundings. Get a glimpse into our authentic yogic lifestyle, peaceful location, and
            student experiences in every frame.
          </p>
        </div>
      </section>

      {/* Separator line */}
      <div className={styles.sepLine} />

      {/* ══════════════════════════════════
          TAB BAR
      ══════════════════════════════════ */}
      <div className={styles.tabBarWrap}>
        <div className={styles.tabBar}>
          {ALL_TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.tab}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          GALLERY SECTIONS
      ══════════════════════════════════ */}
      <div className={styles.gallerySections}>
        {visibleSections.map((sec) => {
          const cols = sec.cols ?? 4;

          return (
            <section key={sec.id} className={styles.gallerySection}>
              <div className={styles.container}>
                <h2 className={styles.secHeading}>{sec.heading}</h2>
                <div className={styles.secRule} />

                {/* Standard grid — all sections now use same layout */}
                <div
                  className={styles.stdGrid}
                  style={{ "--cols": cols } as React.CSSProperties}
                >
                  {sec.images.map((img, i) => (
                    <div
                      key={i}
                      className={styles.imgCard}
                      onClick={() => openModal(img.src, img.label, sec.images, i)}
                    >
                      <img src={img.src} alt={img.label} className={styles.cardImg} />
                      <span className={styles.imgLabel}>
                        <span className={styles.labelPin}>📍</span>
                        <span>{img.label}</span>
                        <span className={styles.labelSub}>AYM YOGA SCHOOL</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ══════════════════════════════════
          MODAL LIGHTBOX
      ══════════════════════════════════ */}
      {modal && (
        <div className={styles.modalBackdrop} onClick={() => setModal(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>

            {/* Close button */}
            <button className={styles.modalClose} onClick={() => setModal(null)} aria-label="Close">
              ✕
            </button>

            {/* Prev arrow */}
            <button
              className={`${styles.modalArrow} ${styles.modalPrev}`}
              onClick={() => {
                const prev = (modal.idx - 1 + modal.allImgs.length) % modal.allImgs.length;
                setModal({ ...modal, idx: prev, src: modal.allImgs[prev].src, label: modal.allImgs[prev].label });
              }}
              aria-label="Previous"
            >
              ‹
            </button>

            {/* Image */}
            <div className={styles.modalImgWrap}>
              <img src={modal.src} alt={modal.label} className={styles.modalImg} />
            </div>

            {/* Next arrow */}
            <button
              className={`${styles.modalArrow} ${styles.modalNext}`}
              onClick={() => {
                const next = (modal.idx + 1) % modal.allImgs.length;
                setModal({ ...modal, idx: next, src: modal.allImgs[next].src, label: modal.allImgs[next].label });
              }}
              aria-label="Next"
            >
              ›
            </button>

            {/* Caption */}
            <div className={styles.modalCaption}>
              <span className={styles.modalLabel}>{modal.label}</span>
              <span className={styles.modalCounter}>
                {modal.idx + 1} / {modal.allImgs.length}
              </span>
            </div>

            {/* Thumbnail strip */}
            <div className={styles.thumbStrip}>
              {modal.allImgs.map((img, i) => (
                <div
                  key={i}
                  className={`${styles.thumb} ${i === modal.idx ? styles.thumbActive : ""}`}
                  onClick={() => setModal({ ...modal, idx: i, src: img.src, label: img.label })}
                >
                  <img src={img.src} alt={img.label} className={styles.thumbImg} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.bottomBorder} />
    </div>
  );
}
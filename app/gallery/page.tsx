"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "@/assets/style/gallery/Gallerypage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
/* ─────────────────────────────────────────────────────────
   IMAGE MAP — Unsplash free URLs grouped by section
───────────────────────────────────────────────────────── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface GallerySection {
  _id: string;
  heading: string;
  tabLabel: string;
  order: number;
  images: any[];
  cols?: number;
}

interface ApiResponse {
  success: boolean;
  data: GallerySection[];
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modal, setModal] = useState<{
    src: string;
    label: string;
    allImgs: { src: string; label: string }[];
    idx: number;
  } | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get<ApiResponse>("/gallery-sections");

        if (res.data.success) {
          setSections(res.data.data.sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  /* Close modal on Escape, navigate with arrow keys */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!modal) return;
      if (e.key === "Escape") setModal(null);
      if (e.key === "ArrowRight") {
        const next = (modal.idx + 1) % modal.allImgs.length;
        setModal({
          ...modal,
          idx: next,
          src: modal.allImgs[next].src,
          label: modal.allImgs[next].label,
        });
      }
      if (e.key === "ArrowLeft") {
        const prev =
          (modal.idx - 1 + modal.allImgs.length) % modal.allImgs.length;
        setModal({
          ...modal,
          idx: prev,
          src: modal.allImgs[prev].src,
          label: modal.allImgs[prev].label,
        });
      }
    },
    [modal],
  );
  const formatImages = (images: any[]) =>
    images.map((im) => ({
      src: im.src.startsWith("http") ? im.src : `${BASE_URL}${im.src}`,
      label: im.label,
    }));
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* Lock body scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);
  const visibleSections =
    activeTab === "all"
      ? sections
      : sections.filter((s) => s.tabLabel === activeTab);
  const openModal = (
    src: string,
    label: string,
    allImgs: { src: string; label: string }[],
    idx: number,
  ) => setModal({ src, label, allImgs, idx });

  const ALL_TABS = [
    { id: "all", tab: "All" },
    ...Array.from(new Set(sections.map((s) => s.tabLabel))).map((tab) => ({
      id: tab,
      tab,
    })),
  ];
  if (loading) {
    return <div style={{ padding: "40px" }}>Loading gallery...</div>;
  }
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
            Explore the vibrant life at AYM Yoga School in Rishikesh through our
            photo gallery—featuring yoga classes, serene accommodation,
            nutritious meals, and scenic surroundings. Get a glimpse into our
            authentic yogic lifestyle, peaceful location, and student
            experiences in every frame.
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
  const formattedImages = formatImages(sec.images || []);
  const cols = sec.cols ?? 4;

  return (
    <section key={sec._id} className={styles.gallerySection}>
      <div className={styles.container}>
        <h2 className={styles.secHeading}>{sec.heading}</h2>
        <div className={styles.secRule} />

        <div
          className={styles.stdGrid}
          style={{ "--cols": cols } as React.CSSProperties}
        >
          {formattedImages.map((img, i) => (
            <div
              key={i}
              className={styles.imgCard}
              onClick={() => {
                openModal(img.src, img.label, formattedImages, i);
              }}
            >
              <img  src={img.src}
  alt={img.label}
  loading="lazy" />

              <span className={styles.imgLabel}>
                <span className={styles.labelPin}>📍</span>
                <span>{img.label}</span>
                <span className={styles.labelSub}>
                  AYM YOGA SCHOOL
                </span>
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
            <button
              className={styles.modalClose}
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Prev arrow */}
            <button
              className={`${styles.modalArrow} ${styles.modalPrev}`}
              onClick={() => {
                const prev =
                  (modal.idx - 1 + modal.allImgs.length) % modal.allImgs.length;
                setModal({
                  ...modal,
                  idx: prev,
                  src: modal.allImgs[prev].src,
                  label: modal.allImgs[prev].label,
                });
              }}
              aria-label="Previous"
            >
              ‹
            </button>

            {/* Image */}
            <div className={styles.modalImgWrap}>
              <img
                src={modal.src}
                alt={modal.label}
                className={styles.modalImg}
              />
            </div>

            {/* Next arrow */}
            <button
              className={`${styles.modalArrow} ${styles.modalNext}`}
              onClick={() => {
                const next = (modal.idx + 1) % modal.allImgs.length;
                setModal({
                  ...modal,
                  idx: next,
                  src: modal.allImgs[next].src,
                  label: modal.allImgs[next].label,
                });
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
                  onClick={() =>
                    setModal({
                      ...modal,
                      idx: i,
                      src: img.src,
                      label: img.label,
                    })
                  }
                >
                  <img
                    src={img.src}
                    alt={img.label}
                     loading="lazy"
                    className={styles.thumbImg}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <HowToReach />
    </div>
  );
}

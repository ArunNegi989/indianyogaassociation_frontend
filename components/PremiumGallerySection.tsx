"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import styles from "@/assets/style/500-hour-yoga-teacher-training-india/Yogattc500.module.css";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface GalleryImagesResponse {
  success: boolean;
  data: {
    accomImages: string[];
    foodImages: string[];
  };
}

/* ─────────────────────────────────────────
   PREMIUM IMAGE MODAL
───────────────────────────────────────── */
function PremiumImageModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose, onPrev, onNext]);

  function imgSrc(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  }

  return (
    <div className={styles.premiumModalOverlay} onClick={onClose}>
      <div className={styles.premiumModalContainer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.premiumModalClose} onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <button className={`${styles.premiumModalNav} ${styles.premiumModalNavPrev}`} onClick={onPrev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.premiumModalImageWrapper}>
          <img
            src={imgSrc(images[currentIndex])}
            alt={`Gallery ${currentIndex + 1}`}
            className={styles.premiumModalImage}
          />
          <div className={styles.premiumModalInfo}>
            <div className={styles.premiumModalCounter}>
              <span className={styles.premiumModalCurrent}>
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className={styles.premiumModalDivider}>/</span>
              <span className={styles.premiumModalTotal}>
                {String(images.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <button className={`${styles.premiumModalNav} ${styles.premiumModalNavNext}`} onClick={onNext}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.premiumModalThumbnails}>
          {images.slice(0, 8).map((img, idx) => (
            <div
              key={idx}
              className={`${styles.premiumModalThumb} ${
                idx === currentIndex ? styles.premiumModalThumbActive : ""
              }`}
              onClick={() => {
                const newIndex = idx;
                if (newIndex < currentIndex) {
                  for (let i = 0; i < currentIndex - newIndex; i++) onPrev();
                } else if (newIndex > currentIndex) {
                  for (let i = 0; i < newIndex - currentIndex; i++) onNext();
                }
              }}
            >
              <img src={imgSrc(img)} alt={`Thumb ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PREMIUM MASONRY GRID
───────────────────────────────────────── */
function PremiumMasonryGrid({ images, title }: { images: string[]; title: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  function imgSrc(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  }

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const getMasonryItems = () => {
    const items = [];
    for (let i = 0; i < Math.min(images.length, 12); i++) {
      let size = "medium";
      if (i === 0) size = "large";
      else if (i === 1) size = "tall";
      else if (i === 2) size = "small";
      else if (i === 5) size = "wide";
      else if (i === 7) size = "large";
      else if (i === 9) size = "tall";

      items.push({
        id: i,
        src: images[i],
        size: size,
      });
    }
    return items;
  };

  const masonryItems = getMasonryItems();

  return (
    <>
      <div className={styles.premiumMasonry}>
        <div className={styles.masonryGrid}>
          {masonryItems.map((item, idx) => (
            <div
              key={idx}
              className={`${styles.masonryItem} ${
                styles[`masonry${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`]
              }`}
              onClick={() => openModal(idx)}
            >
              <div className={styles.masonryInner}>
                <img src={imgSrc(item.src)} alt={`${title} ${idx + 1}`} loading="lazy" />
                <div className={styles.masonryOverlay}>
                  <div className={styles.masonryIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  <span className={styles.masonryText}>View Image</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length > 12 && (
          <div className={styles.masonryMore} onClick={() => openModal(12)}>
            <div className={styles.masonryMoreInner}>
              <span className={styles.masonryMoreCount}>+{images.length - 12}</span>
              <span className={styles.masonryMoreText}>More Photos</span>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <PremiumImageModal
          images={images}
          currentIndex={currentIndex}
          onClose={() => setModalOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   LOADING SKELETON
───────────────────────────────────────── */
const GallerySkeleton = () => (
  <div className={styles.gallerySkeleton}>
    <div className={styles.gallerySkeletonHeader}>
      <div className={styles.gallerySkeletonBadge} />
      <div className={styles.gallerySkeletonTitle} />
      <div className={styles.gallerySkeletonUnderline} />
      <div className={styles.gallerySkeletonSubtitle} />
    </div>
    <div className={styles.gallerySkeletonGrid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={styles.gallerySkeletonItem} />
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   PREMIUM GALLERY SECTION - Self-Contained Component
   Fetches images automatically from API
   ═══════════════════════════════════════════ */
interface PremiumGallerySectionProps {
  type: "accommodation" | "food" | "both";
  backgroundColor?: "white" | "light" | "warm";
  className?: string;
}

export default function PremiumGallerySection({
  type,
  backgroundColor = "white",
  className = "",
}: PremiumGallerySectionProps) {
  const [accomImages, setAccomImages] = useState<string[]>([]);
  const [foodImages, setFoodImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/yoga-500hr/content");
        if (data?.success && data?.data) {
          setAccomImages(data.data.accomImages || []);
          setFoodImages(data.data.foodImages || []);
        } else {
          setError("Failed to load gallery images.");
        }
      } catch (err) {
        console.error("Failed to fetch gallery images:", err);
        setError("Failed to load images. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) return <GallerySkeleton />;
  if (error) return null;

  const bgClass =
    backgroundColor === "white"
      ? styles.galleryBgWhite
      : backgroundColor === "light"
      ? styles.galleryBgLight
      : styles.galleryBgWarm;

  // Render both sections
  if (type === "both") {
    return (
      <>
        {accomImages.length > 0 && (
          <section className={`${styles.premiumGallerySection} ${bgClass} ${className}`}>
            <div className="container px-3 px-md-4">
              <div className={styles.premiumGalleryHeader}>
                <span className={styles.premiumGalleryBadge}>Peaceful Stay</span>
                <h2 className={styles.premiumGalleryTitle}>Accommodation</h2>
                <div className={styles.premiumGalleryUnderline}>
                  <span className={styles.premiumGalleryUnderlineLeft}></span>
                  <span className={styles.premiumGalleryUnderlineIcon}>✦</span>
                  <span className={styles.premiumGalleryUnderlineRight}></span>
                </div>
                <p className={styles.premiumGallerySubtext}>
                  Comfortable and serene living spaces designed for your spiritual journey
                </p>
              </div>
              <PremiumMasonryGrid images={accomImages} title="Accommodation" />
            </div>
          </section>
        )}

        {foodImages.length > 0 && (
          <section className={`${styles.premiumGallerySection} ${bgClass} ${className}`}>
            <div className="container px-3 px-md-4">
              <div className={styles.premiumGalleryHeader}>
                <span className={styles.premiumGalleryBadge}>Nourishing Meals</span>
                <h2 className={styles.premiumGalleryTitle}>Sattvic Food</h2>
                <div className={styles.premiumGalleryUnderline}>
                  <span className={styles.premiumGalleryUnderlineLeft}></span>
                  <span className={styles.premiumGalleryUnderlineIcon}>✦</span>
                  <span className={styles.premiumGalleryUnderlineRight}></span>
                </div>
                <p className={styles.premiumGallerySubtext}>
                  Wholesome vegetarian meals prepared with love and ancient Ayurvedic wisdom
                </p>
              </div>
              <PremiumMasonryGrid images={foodImages} title="Food" />
            </div>
          </section>
        )}
      </>
    );
  }

  // Render single section
  const images = type === "accommodation" ? accomImages : foodImages;
  const config = {
    accommodation: {
      badge: "Peaceful Stay",
      title: "Accommodation",
      subtitle: "Comfortable and serene living spaces designed for your spiritual journey",
    },
    food: {
      badge: "Nourishing Meals",
      title: "Sattvic Food",
      subtitle: "Wholesome vegetarian meals prepared with love and ancient Ayurvedic wisdom",
    },
  }[type];

  if (images.length === 0) return null;

  return (
    <section className={`${styles.premiumGallerySection} ${bgClass} ${className}`}>
      <div className="container px-3 px-md-4">
        <div className={styles.premiumGalleryHeader}>
          <span className={styles.premiumGalleryBadge}>{config.badge}</span>
          <h2 className={styles.premiumGalleryTitle}>{config.title}</h2>
          <div className={styles.premiumGalleryUnderline}>
            <span className={styles.premiumGalleryUnderlineLeft}></span>
            <span className={styles.premiumGalleryUnderlineIcon}>✦</span>
            <span className={styles.premiumGalleryUnderlineRight}></span>
          </div>
          <p className={styles.premiumGallerySubtext}>{config.subtitle}</p>
        </div>
        <PremiumMasonryGrid images={images} title={config.title} />
      </div>
    </section>
  );
}
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../assets/style/Home/Homepageslider.module.css";
import api from "@/lib/api";

interface Slide {
  _id: string;
  bannerName: string;
  link: string;
  image: string;
}

const AUTOPLAY_DELAY = 5000;

const HomepageSlider = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [progressKey, setProgressKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  /* FETCH BANNERS */

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/banners");

        if (res.data.success) {
          setSlides(res.data.data);
        }
      } catch (error) {
        console.error("Banner fetch error:", error);
      }
    };

    fetchBanners();
  }, []);

  /* NAVIGATION FUNCTIONS */

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgressKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => {
    if (!slides.length) return;
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const goPrev = useCallback(() => {
    if (!slides.length) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  const getImageUrl = (img: string) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_API_URL}${img}`;
  };
  /* AUTOPLAY */

  useEffect(() => {
    if (!slides.length) return;

    timerRef.current = setTimeout(goNext, AUTOPLAY_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goNext, slides.length]);

  /* KEYBOARD NAVIGATION */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  /* TOUCH SWIPE */

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;

    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 45) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  if (!slides.length) return null;

  return (
    <section
      className={styles.sliderWrapper}
      aria-label="Hero image slider"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <p className={styles.sanskritWatermark}>॥ योगः कर्मसु कौशलम् ॥</p>

      {slides.map((slide, idx) => (
        <div
          key={slide._id}
          className={`${styles.slide} ${idx === current ? styles.active : ""}`}
          aria-hidden={idx !== current}
        >
          <Image
            src={getImageUrl(slide.image)}
            alt={slide.bannerName}
            fill
            unoptimized
            className={styles.slideImage}
          />
          <div className={styles.slideOverlay} />

          <div className={styles.slideContent}>
            <h2 className={styles.slideTitle}>{slide.bannerName}</h2>

            <Link href={slide.link} className={styles.slideCta}>
              Explore
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </div>
      ))}

      {/* NAV BUTTONS */}

      <button
        className={`${styles.navBtn} ${styles.navPrev}`}
        onClick={goPrev}
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        className={`${styles.navBtn} ${styles.navNext}`}
        onClick={goNext}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* DOTS */}

      <div
        className={styles.dotsRow}
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Go to slide ${idx + 1}`}
            className={`${styles.dot} ${
              idx === current ? styles.activeDot : ""
            }`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>

      {/* COUNTER */}

      {/* <p className={styles.slideCounter}>
        <span className={styles.slideCounterCurrent}>
          {String(current + 1).padStart(2, "0")}
        </span>{" "}
        / {String(slides.length).padStart(2, "0")}
      </p> */}

      {/* PROGRESS BAR */}

      <div
        key={progressKey}
        className={`${styles.progressBar} ${styles.animating}`}
      />
    </section>
  );
};

export default HomepageSlider;

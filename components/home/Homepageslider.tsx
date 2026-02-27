"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";
import styles from "../../assets/style/Home/Homepageslider.module.css";
import Image1 from "../../assets/images/homepageslider/best-yoga-teacher-training-in-rishikesh-india-2024.webp";
import image2 from "../../assets/images/homepageslider/ayush-yoga-courses.webp";
import image3 from "../../assets/images/homepageslider/Yoga-Teacher-Training-in-rishikesh.webp";
import image4 from "../../assets/images/homepageslider/Live-love-laugh-in-rishikesh.webp";

interface Slide {
  id: number;
  src: StaticImageData;
  alt: string;
  tag: string;
  subtitle: string;
  title: string;
  cta: { label: string; href: string };
}

const slides: Slide[] = [
  {
    id: 1,
    src: Image1,
    alt: "200 Hour Yoga Teacher Training",
    tag: "Most Popular",
    subtitle: "Transform Your Life with",
    title: "200 Hours Yoga Teacher Training Course",
    cta: { label: "Explore Program", href: "/200-hour-ytt" },
  },
  {
    id: 2,
    src: image2,
    alt: "Yoga Retreat in Rishikesh",
    tag: "Rishikesh, India",
    subtitle: "Reconnect with Your Inner Self",
    title: "Sacred Yoga Retreats in the Himalayas",
    cta: { label: "View Retreats", href: "/yoga-retreats" },
  },
  {
    id: 3,
    src: image3,
    alt: "300 Hour Advanced Yoga Teacher Training",
    tag: "Advanced Level",
    subtitle: "Deepen Your Practice with",
    title: "300 Hours Advanced Yoga Teacher Training",
    cta: { label: "Learn More", href: "/300-hour-ytt" },
  },
  {
    id: 4,
    src: image4,
    alt: "Online Yoga Course",
    tag: "Learn from Home",
    subtitle: "Practice from Anywhere with",
    title: "Certified Online Yoga Courses",
    cta: { label: "Start Online", href: "/online-yoga-course" },
  },
];

const AUTOPLAY_DELAY = 5000;

export const HomepageSlider = () => {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgressKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    timerRef.current = setTimeout(goNext, AUTOPLAY_DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

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
          key={slide.id}
          className={`${styles.slide} ${idx === current ? styles.active : ""}`}
          aria-hidden={idx !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={idx === 0}
            sizes="100vw"
            className={styles.slideImage}
          />
          <div className={styles.slideOverlay} /> {/* Text */}
          <div className={styles.slideContent}>
            <span className={styles.slideTag}>{slide.tag}</span>
            <p className={styles.slideSubtitle}>{slide.subtitle}</p>
            <h2 className={styles.slideTitle}>{slide.title}</h2>
            <Link href={slide.cta.href} className={styles.slideCta}>
              {slide.cta.label}
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </div>
      ))}
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
            className={`${styles.dot} ${idx === current ? styles.activeDot : ""}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>
      <p className={styles.slideCounter}>
        <span className={styles.slideCounterCurrent}>0{current + 1}</span> / 0
        {slides.length}
      </p>
      <div
        key={progressKey}
        className={`${styles.progressBar} ${styles.animating}`}
      />
    </section>
  );
};

export default HomepageSlider;

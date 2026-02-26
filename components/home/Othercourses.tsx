'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../../assets/style/Home/Othercourses.module.css';

interface Course {
  image: string;
  days: string;
  label: string;
  title: string;
  style: string;
  duration: string;
  certificate: string;
  fee: string;
  detailsLink: string;
  bookLink: string;
}

const courses: Course[] = [
  {
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    days: '7 Days Program',
    label: 'PRENATAL',
    title: 'Prenatal Yoga Course',
    style: 'Prenatal',
    duration: '7 Days',
    certificate: '100 Hour',
    fee: '600 USD',
    detailsLink: '#',
    bookLink: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80',
    days: '24 Days Program',
    label: 'KUNDALINI YOGA',
    title: 'Kundalini Yoga Course',
    style: 'Kundalini / Ashtanga Yoga',
    duration: '24 Days',
    certificate: '200 RYT',
    fee: '1199 USD',
    detailsLink: '#',
    bookLink: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&q=80',
    days: '7 Days Program',
    label: 'MEDITATION',
    title: 'Meditation Course',
    style: 'Meditation',
    duration: '7 Days',
    certificate: '100 Hour',
    fee: '499 USD',
    detailsLink: '#',
    bookLink: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80',
    days: '7 Days Program',
    label: 'AYURVEDA',
    title: 'Ayurveda Course',
    style: 'Ayurveda',
    duration: '7 days',
    certificate: '35 Hours',
    fee: '399 USD',
    detailsLink: '#',
    bookLink: '#',
  },
];

export const OtherCourses: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(`.${styles.card}`);
    if (!cards) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.cardVisible);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Join Our Others Yoga Courses in Rishikesh</h2>
          <div className={styles.titleUnderline} />
        </div>

        {/* ── Cards Grid ── */}
        <div className={styles.grid}>
          {courses.map((course, i) => (
            <div
              key={i}
              className={styles.card}
              style={{ '--i': i } as React.CSSProperties}
            >
              {/* Image with overlay */}
              <div className={styles.imageWrap}>
                <img
                  src={course.image}
                  alt={course.title}
                  className={styles.cardImg}
                />
                <div className={styles.imgOverlay}>
                  <span className={styles.daysLabel}>{course.days}</span>
                  <span className={styles.courseLabel}>{course.label}</span>
                </div>
              </div>

              {/* Card body */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{course.title}</h3>
                <div className={styles.titleBar} />

                <div className={styles.infoTable}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Course Style:</span>
                    <span className={styles.infoVal}>{course.style}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Duration:</span>
                    <span className={styles.infoVal}>{course.duration}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Certificate:</span>
                    <span className={styles.infoVal}>{course.certificate}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Course Fee:</span>
                    <span className={styles.infoVal}>{course.fee}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className={styles.btnRow}>
                  <a href={course.detailsLink} className={styles.btnDetails}>
                    More Details
                  </a>
                  <a href={course.bookLink} className={styles.btnBook}>
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OtherCourses;
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import styles from '../../assets/style/Home/Yogacoursesteachers.module.css';
import founder from '../../assets/images/yogi-chetan-mahesh-ji.webp'
import teacher1 from '../../assets/images/yogi-mahesh.webp';
import teacher2 from '../../assets/images/multi-style-yoga-teacher.webp';
import teacher3 from '../../assets/images/yoga-teacher-anatomy.webp';
import teacher4 from '../../assets/images/ajay.webp';

// ── Data ─────────────────────────────────────────────────────────────
const courses = [
  {
    id: 1,
    hours: '100 HOUR YOGA',
    days: '14 Days Program',
    name: 'Beginner Yoga Course',
    style: 'Ashtanga / Hatha',
    duration: '14 Days',
    certificate: '100 Hour',
    fee: '500 USD / 550 USD',
    color: '#8B5E3C',
    img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80',
  },
  {
    id: 2,
    hours: '200 HOUR YOGA',
    days: '24 Days Program',
    name: 'Foundation Yoga Course',
    style: 'Hatha / Ashtanga Yoga',
    duration: '24 Days',
    certificate: '200 RYT',
    fee: '749 USD / 899 USD',
    color: '#2D5A27',
    img: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80',
  },
  {
    id: 3,
    hours: '300 HOUR YOGA',
    days: '28 Days Program',
    name: 'Intermediate Yoga Course',
    style: 'Multi-Style Yoga',
    duration: '28 Days',
    certificate: '300 RYT',
    fee: '849 USD / 999 USD',
    color: '#1A4A6B',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
  },
  {
    id: 4,
    hours: '500 HOUR YOGA',
    days: '56 Days Program',
    name: 'Advanced Yoga Course',
    style: 'Hatha / Multi-Style',
    duration: '56 Days',
    certificate: '500 RYT',
    fee: '1649 USD / 1949 USD',
    color: '#7B3F00',
    img: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80',
  },
];

const teachers = [
  {
    id: 1,
    name: 'Dr. Mahesh',
    surname: 'Bhatt',
    img: teacher1,
  },
  {
    id: 2,
    name: 'Yogi Deepak',
    surname: 'Bisht',
    img: teacher2,
  },
  {
    id: 3,
    name: 'Dr. Hemlata',
    surname: 'Saklani',
    img: teacher3,
  },
  {
    id: 4,
    name: 'Yogi Ajay',
    surname: 'Kumar',
    img: teacher4,
  },
];

// ── OM Particle component ─────────────────────────────────────────────
const OmParticles: React.FC = () => {
  const particles = Array.from({ length: 8 });
  return (
    <div className={styles.omParticles} aria-hidden="true">
      {particles.map((_, i) => (
        <span
          key={i}
          className={styles.omParticle}
          style={{
            left: `${10 + i * 11}%`,
            animationDelay: `${i * 0.9}s`,
            animationDuration: `${8 + (i % 4) * 2}s`,
            fontSize: `${1 + (i % 3) * 0.6}rem`,
            opacity: 0.06 + (i % 3) * 0.03,
          }}
        >
          ॐ
        </span>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────
export const YogaCoursesTeachers: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className={styles.wrapper}>

      {/* ══════════════════════════════════════════════
          SECTION 1 — COURSES
      ══════════════════════════════════════════════ */}
      <section className={styles.coursesSection}>
        <OmParticles />
        <div className={styles.topBorder} />

        <div className={styles.container}>
          {/* Heading */}
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Sacred Path of Yoga</p>
            <h2 className={styles.sectionTitle}>
              Join Our Yoga Teacher Training in Rishikesh
            </h2>
            <div className={styles.omDivider}>
              <span className={styles.divLine} />
              <span className={styles.divOm}>ॐ</span>
              <span className={styles.divLine} />
            </div>
            <p className={styles.sectionDesc}>
              Ready to embark on a transformative path with the power of Yoga? Join us today
              and discover clarity, peace of mind, and an overall healthy, happy spirit with
              the Indian Association for Yoga and Meditation.
            </p>
          </div>

          {/* Course Cards */}
          <div className={styles.coursesGrid}>
            {courses.map((course, i) => (
              <div
                key={course.id}
                className={styles.courseCard}
                style={{ '--card-color': course.color, '--delay': `${i * 0.1}s` } as React.CSSProperties}
                onMouseEnter={() => setHoveredCard(course.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image */}
                <div className={styles.cardImgWrap}>
                  <img
                    src={course.img}
                    alt={course.name}
                    className={styles.cardImg}
                    loading="lazy"
                  />
                  <div className={styles.cardImgOverlay} style={{ background: `linear-gradient(to top, ${course.color}ee 0%, ${course.color}88 40%, transparent 70%)` }} />
                  {/* Days badge */}
                  <span className={styles.cardDays}>{course.days}</span>
                  {/* Hours title */}
                  <div className={styles.cardHours}>{course.hours}</div>
                  {/* OM pulse on hover */}
                  <div className={styles.cardOmPulse}>ॐ</div>
                </div>

                {/* Body */}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{course.name}</h3>
                  <div className={styles.cardNameUnderline} />

                  <div className={styles.cardMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Course Style</span>
                      <span className={styles.metaVal}>{course.style}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Duration</span>
                      <span className={styles.metaVal}>{course.duration}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Certificate</span>
                      <span className={styles.metaVal}>{course.certificate}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Course Fee</span>
                      <span className={styles.metaVal}>{course.fee}</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <a href="#" className={styles.detailsBtn}>More Details</a>
                    <a href="#" className={styles.bookBtn}>Book Now</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottomBorder} />
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — WHO CAN JOIN
      ══════════════════════════════════════════════ */}
      <section className={styles.whoSection}>
        <OmParticles />
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Open to All Seekers</p>
            <h2 className={styles.sectionTitle}>Who Can Join Yoga TTC in Rishikesh?</h2>
            <div className={styles.omDivider}>
              <span className={styles.divLine} />
              <span className={styles.divOm}>ॐ</span>
              <span className={styles.divLine} />
            </div>
          </div>

          <div className={styles.whoGrid}>
            <div className={styles.whoText}>
              <p className={styles.para}>
                An internationally certified hatha yoga teacher training course in Rishikesh
                does not limit itself to those who wish to pursue it as a vocation. It is
                suited for everyone who wants to learn and deepen their Yoga practice.
              </p>
              <p className={styles.para}>
                As you become part of yoga training in India, you will slowly uncover its
                benefits to your body and the peace you feel in your mind. Anyone between
                the age of 18–50 can be a part of our yoga retreats in Rishikesh.
              </p>
              <p className={styles.para}>
                Whether you want to become a yoga teacher, maintain an active lifestyle,
                lose weight or just experience the positivity that this ancient practice
                brings to life, you can choose to enrol for our yoga certification course
                in Rishikesh. Students, working professionals or individuals from other
                walks of life can explore this holistic Rishikesh yoga lifestyle.
              </p>
              <p className={styles.para}>
                Several of our yoga teachers accelerated their personal and spiritual growth
                by spreading the knowledge of authentic and traditional forms of Yoga. Once
                you start sharing and teaching others, it is a relearning of the Yogic
                techniques opening up newer avenues for yourself.
              </p>
              <p className={styles.para}>
                With a certified yoga course from Rishikesh, you can also explore it as a
                career opportunity. Seek solace in helping others better their bodies and
                mind. With a Yoga Alliance certificate, you can teach yoga globally. It's
                an asset to become a certified Yoga professional in India and abroad.
              </p>
            </div>

            {/* Decorative right panel */}
            <div className={styles.whoDecor}>
              <div className={styles.whoDecorInner}>
                <div className={styles.bigOm}>ॐ</div>
                <div className={styles.whoDecorItems}>
                  {['Age 18–50 Welcome','All Levels','Career Opportunity','Global Certification','Mind & Body Growth','Spiritual Awakening'].map((item, i) => (
                    <div key={i} className={styles.whoDecorChip} style={{ animationDelay: `${i * 0.15}s` }}>
                      <span className={styles.chipDot}>✦</span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className={styles.whoDecorQuote}>
                  "Yoga is the journey of the self,<br/>through the self, to the self."
                  <span className={styles.whoDecorAttrib}>— Bhagavad Gita</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 — TEACHERS
      ══════════════════════════════════════════════ */}
      <section className={styles.teachersSection}>
        <OmParticles />
        <div className={styles.topBorder} />
        <div className={styles.container}>

          {/* Heading */}
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Masters of the Ancient Art</p>
            <h2 className={styles.sectionTitle}>Our Experienced Yoga Teachers</h2>
            <div className={styles.omDivider}>
              <span className={styles.divLine} />
              <span className={styles.divOm}>ॐ</span>
              <span className={styles.divLine} />
            </div>
          </div>

          {/* Intro paragraphs */}
          <div className={styles.teachersIntro}>
            <p className={styles.para}>
              AYM has a highly qualified team of Yoga professionals who conduct{' '}
              <strong className={styles.hl}>hatha yoga teacher training in Rishikesh</strong>.
              They impart their yogic wisdom and teach students to form deeper connections
              with themselves. You will learn from expert yogis who have mastered the art
              and movements throughout their years of dedicated practice.
            </p>
            <p className={styles.para}>
              Our aim goes beyond just yoga teacher training — we are committed to promoting
              the practice of yoga in institutes across India. To support this vision, we
              also offer{' '}
              <strong className={styles.hl}>online yoga instructor courses in Rishikesh</strong>.
              Our certified yoga teachers form the pillars of strength that uphold AYM's
              reputation as the best yoga school in Rishikesh.
            </p>
          </div>

          {/* Founder feature */}
          <div className={styles.founderBlock}>
            <div className={styles.founderImgCol}>
              <div className={styles.founderImgFrame}>
                <Image
  src={founder}
  alt="Yogi Chetan Mahesh — Founder of AYM Yoga School"
  className={styles.founderImg}
  width={500}
  height={600}
/>
                <div className={styles.founderImgOverlay}>
                  <span className={styles.founderImgName}>Yogi Chetan Mahesh</span>
                </div>
                {/* Vintage frame corners */}
                <div className={styles.fCornerTL} /><div className={styles.fCornerTR} />
                <div className={styles.fCornerBL} /><div className={styles.fCornerBR} />
              </div>
            </div>

            <div className={styles.founderTextCol}>
              <p className={styles.founderEyebrow}>Founder of AYM Yoga School</p>
              <h3 className={styles.founderName}>Yogi Chetan Mahesh</h3>
              <div className={styles.founderNameUnderline} />

              <p className={styles.para}>
                Yogi Chetan Mahesh, founder-director of AYM school has over 20 years of
                experience in teaching and practicing Hatha Yoga and Ashtanga Yoga.
              </p>
              <p className={styles.para}>
                His mastery of yogic practice serves as an extension for students to learn
                the best tips and techniques to perform yoga better. He and his group of
                teachers have taught more than 15,000 students at AYM, who are now
                successful yoga teachers. He is considered one of the best yoga instructors
                in India.
              </p>
              <p className={styles.para}>
                Achieving a significant milestone in his yogic journey, he is also a{' '}
                <strong className={styles.hl}>Gold Medal recipient</strong> in a
                district-level Yoga competition.
              </p>

              <div className={styles.founderActions}>
                <a href="#" className={styles.detailsBtn}>Know More About Yogi Chetan Mahesh</a>
                <a href="#" className={styles.bookBtn}>Book Now</a>
              </div>
            </div>
          </div>

          {/* Other teachers grid */}
          <div className={styles.teachersGrid}>
            {teachers.map((t, i) => (
              <div
                key={t.id}
                className={styles.teacherCard}
                style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}
              >
                <div className={styles.teacherImgWrap}>
                 <Image
  src={t.img}
  alt={`${t.name} ${t.surname}`}
  className={styles.teacherImg}
  width={300}
  height={350}
/>
                  <div className={styles.teacherImgOverlay}>
                    <span className={styles.teacherOm}>ॐ</span>
                  </div>
                </div>
                <div className={styles.teacherInfo}>
                  <strong className={styles.teacherName}>{t.name}</strong>
                  <span className={styles.teacherSurname}>{t.surname}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={styles.teachersCta}>
            <a href="#" className={styles.teachersCtaBtn}>
              Our Teachers' Information <span>→</span>
            </a>
          </div>

        </div>
        <div className={styles.bottomBorder} />
      </section>

    </div>
  );
};

export default YogaCoursesTeachers;
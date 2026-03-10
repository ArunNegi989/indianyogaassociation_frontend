"use client";

import React from "react";
import styles from "@/assets/style/yoga-teacher-training-in-rishikesh/Bestyogaschool.module.css";

/* ─────────────────────────────────────────
   INLINE SVG MANDALA
───────────────────────────────────────── */
const MandalaSVG = ({
  size = 300,
  c1 = "#e07b00",
  c2 = "#d4a017",
  sw = 0.5,
}: {
  size?: number;
  c1?: string;
  c2?: string;
  sw?: number;
}) => (
  <svg
    viewBox="0 0 300 300"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g fill="none" stroke={c1} strokeWidth={sw}>
      {[145, 125, 106, 88, 70, 52, 36, 22, 10].map((r, i) => (
        <circle key={i} cx="150" cy="150" r={r} />
      ))}
    </g>
    <g fill="none" stroke={c2} strokeWidth={sw * 0.65} opacity="0.45">
      {(
        [
          [150, 5, 150, 295],
          [5, 150, 295, 150],
          [47, 47, 253, 253],
          [253, 47, 47, 253],
          [10, 100, 290, 200],
          [10, 200, 290, 100],
          [100, 10, 200, 290],
          [200, 10, 100, 290],
        ] as number[][]
      ).map((d, i) => (
        <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} />
      ))}
    </g>
    <g fill="none" stroke={c2} strokeWidth={sw * 0.55} opacity="0.22">
      <ellipse cx="150" cy="150" rx="145" ry="60" />
      <ellipse cx="150" cy="150" rx="60" ry="145" />
      <ellipse cx="150" cy="150" rx="145" ry="95" />
      <ellipse cx="150" cy="150" rx="95" ry="145" />
    </g>
    <g fill="none" stroke={c1} strokeWidth={sw * 0.4} opacity="0.18">
      {[0, 30, 60, 90, 120, 150].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={150 + 148 * Math.cos(r)}
            y1={150 + 148 * Math.sin(r)}
            x2={150 - 148 * Math.cos(r)}
            y2={150 - 148 * Math.sin(r)}
          />
        );
      })}
    </g>
    <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
    <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.6" />
  </svg>
);

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
const OmDivider = () => (
  <div className={styles.omDiv}>
    <span className={styles.omLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.omLine} />
  </div>
);

/* ─────────────────────────────────────────
   CERTIFICATE IMAGE CARD
───────────────────────────────────────── */
const CertCard = ({
  label,
  badge,
  imgSrc,
}: {
  label: string;
  badge: string;
  imgSrc: string;
}) => (
  <div className={styles.certCard}>
    <div className={styles.certImgWrap}>
      <img src={imgSrc} alt={label} className={styles.certImg} loading="lazy" />
    </div>
    <div className={styles.certBadge}>{badge}</div>
    <p className={styles.certLabel}>{label}</p>
  </div>
);

/* ─────────────────────────────────────────
   COURSE CARD (alternating layout)
───────────────────────────────────────── */
interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  certificate: string;
  detailsLabel: string;
  detailsHref?: string;
  bookHref?: string;
  imgSrc: string;
  imgAlt: string;
  reverse?: boolean;
}

const CourseCard = ({
  title,
  description,
  duration,
  certificate,
  detailsLabel,
  detailsHref = "#",
  bookHref = "#",
  imgSrc,
  imgAlt,
  reverse = false,
}: CourseCardProps) => (
  <div className={`${styles.courseCard} ${reverse ? styles.courseCardRev : ""}`}>
    {/* Image side */}
    <div className={styles.courseImgWrap}>
      <img src={imgSrc} alt={imgAlt} className={styles.courseImg} loading="lazy" />
      <div className={styles.courseImgOverlay} />
    </div>

    {/* Text side */}
    <div className={styles.courseBody}>
      <h3 className={styles.courseTitle}>{title}</h3>
      <div className={styles.courseTitleLine} />
      <p className={styles.bodyPara}>{description}</p>
      <div className={styles.courseMeta}>
        <p className={styles.metaRow}>
          <strong className={styles.metaLabel}>Duration:</strong> {duration}
        </p>
        <p className={styles.metaRow}>
          <strong className={styles.metaLabel}>Certificate:</strong> {certificate}
        </p>
      </div>
      <div className={styles.courseBtns}>
        <a href={detailsHref} className={styles.btnOrange}>
          {detailsLabel}
        </a>
        <a href={bookHref} className={styles.btnOutline}>
          Book Now
        </a>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════ */
export default function BestYogaSchool() {
  return (
    <div className={styles.page}>

      {/* ── Fixed Mandala Decorations ── */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={400} c1="#e07b00" c2="#d4a017" sw={0.44} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={360} c1="#d4a017" c2="#e07b00" sw={0.44} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={210} c1="#e07b00" c2="#d4a017" sw={0.58} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={210} c1="#d4a017" c2="#e07b00" sw={0.58} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══════════════════════════════════════
          SECTION 1 — HERO INTRO + ACCREDITATIONS
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">

          {/* Title */}
          <h1 className={styles.heroTitle}>
            Best Yoga Teacher Training Rishikesh – Best Yoga School Rishikesh
          </h1>
          <OmDivider />

          {/* Body text */}
          <p className={styles.bodyPara}>
            <strong>Best Yoga Teacher Training in Rishikesh</strong> is written on every school
            website's wall. The world capital of yoga, lush green forests surround Rishikesh, the
            Holy River mother Ganga, and thousands of spiritual ashrams for learning the best yoga
            in the world. It is also a highly recommended and famous destination for{" "}
            <strong>the best yoga teacher training in rishikesh</strong>. Rishikesh is known as a
            spiritual energy spot. It attracts millions of devotees worldwide, seeking an inner
            spiritual journey through yoga.
          </p>
          <p className={styles.bodyPara}>
            The Association for Yoga and Meditation - the best yoga school in Rishikesh (AYM Yoga
            School in Rishikesh) is registered with the Yoga Alliance USA and situated in this
            beautiful lap of green mountains. Our primary objective is to train the best yoga
            teachers through the best yoga master, using the best modern technology to understand
            the ancient science of yoga. Our syllabus is designed to give the students complete
            exposure to yogic techniques in{" "}
            <a href="#" className={styles.inlineLink}>
              200 hour residential yoga teacher training in rishikesh
            </a>
            ,{" "}
            <a href="#" className={styles.inlineLink}>
              300 hour residential yoga teacher training in rishikesh
            </a>{" "}
            and{" "}
            <a href="#" className={styles.inlineLink}>
              500 hours residential yoga teacher teaching certifications in Rishikesh India
            </a>
            .
          </p>

          {/* ── Accreditations ── */}
          <div className={styles.accrSection}>
            <h2 className={styles.accrTitle}>Our Accreditations – AYM Yoga School</h2>
            <div className={styles.accrUnderline} />

            <div className={styles.certGrid}>
              <CertCard
                label="RYS 200 – Yoga Alliance"
                badge="RYS 200"
                imgSrc="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&q=80"
              />
              <CertCard
                label="RYS 300 – Yoga Alliance"
                badge="RYS 300"
                imgSrc="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&q=80"
              />
              <CertCard
                label="RYS 500 – Yoga Alliance"
                badge="RYS 500"
                imgSrc="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&q=80"
              />
              <CertCard
                label="Yoga Certification Board – Ministry of AYUSH"
                badge="YCB"
                imgSrc="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&q=80"
              />
            </div>
          </div>

          {/* Additional body text */}
          <p className={styles.bodyPara}>
            At AYM, we conduct the best yoga course in Rishikesh as we are dedicated to giving
            enough time for simulated teaching practice, which turns you into the best yoga teacher.
            It allows the trainees to gain the necessary experience to become the world's best yoga
            instructors. We focus a lot of energy on teaching the postures (Asanas) safely and
            securely. The anatomy and physiology of the human body are studied during the yoga
            course in Rishikesh. Studying anatomy provides insight into how yoga affects the human
            body. During yoga teacher training, we focus on adjusting students (correcting
            postures). It is a famous saying, "Practice makes perfect", so we allow our students to
            practice as much as possible. Our teacher Trainers use props such as ropes, blocks,
            blankets, boosters, tables, and chairs to decrease the chances of injury.
          </p>
          <p className={styles.bodyPara}>
            Thousands of sadhus, seers, yogis, and spiritual practitioners have meditated in
            Rishikesh for thousands of years, turning it into a unique destination for yoga. Some
            claim that one can feel Rishikesh's spiritual energy upon arrival. Tourists are welcomed
            here with happy smiles and warm hearts. Everyone here is glad to share the science of
            happiness they have learned through yoga. The natural setting and the spiritual
            environment make it the best place for yoga and spirituality worldwide.
          </p>
          <p className={styles.bodyPara}>
            Rishikesh has many yoga schools that offer{" "}
            <a href="#" className={styles.inlineLink}>
              best yoga teacher training for beginner in rishikesh
            </a>{" "}
            Still, AYM Yoga ttc in rishikesh is outstanding with its high standard of teaching and
            largest campus. The <strong>best yoga teacher training course in rishikesh</strong> is
            hard to find as many new yoga schools are coming daily. As with anything, when yoga
            continues to gain popularity worldwide, some are starting to skew its true essence by
            turning it into a business. There is a handful of that teaching yoga without proper
            experience or training. This is detrimental to the art and can result in student
            injuries. So, if you want a school to get the{" "}
            <strong>best yoga training in rishikesh</strong>, we urge you to research before
            signing up.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — COURSES (200 / 300 / 500 hr)
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">

          <h2 className={styles.sectionTitleCenter}>Our Yoga Teacher Training Courses</h2>
          <OmDivider />

          {/* 200 Hour — image LEFT, text RIGHT */}
          <CourseCard
            title="200 Hours Yoga Teacher Training in Rishikesh"
            description="Our 200 hour yoga course is thoughtfully crafted to offer a deep understanding of yoga principles, techniques, and philosophy. This comprehensive course covers various yoga practices, including asanas, pranayama, meditation, anatomy, and teaching methodology. Whether you're just starting or have been practising for a while, this course will help you enrich your practice and expand your knowledge of yoga. We invite you to join us for an immersive experience that will transform your personal practice and equip you to become a certified yoga instructor."
            duration="24 Days."
            certificate="Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional )."
            detailsLabel="200 Hour Details"
            imgSrc="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80"
            imgAlt="200 Hour Yoga Teacher Training Rishikesh — students in Vrikshasana"
            reverse={false}
          />

          {/* 300 Hour — image RIGHT (reverse), text LEFT */}
          <CourseCard
            title="300 Hours Yoga Teacher Training in Rishikesh"
            description="Our 300 hour yoga course is carefully designed to build upon the foundational knowledge gained in the 200-hour course. This advanced program delves deeper into yoga philosophy, advanced asanas, pranayama techniques, meditation, subtle anatomy, and the art of teaching. Geared towards experienced practitioners and certified yoga instructors, this course aims to refine and elevate your practice to a higher level. By joining this comprehensive program, you will gain the expertise and confidence to further your career as a skilled and knowledgeable yoga instructor. Immerse yourself in this transformative experience and take your yoga journey to new heights."
            duration="28 Days."
            certificate="Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional )."
            detailsLabel="300 Hour Details"
            imgSrc="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&q=80"
            imgAlt="300 Hour Yoga Teacher Training Rishikesh — advanced class"
            reverse={true}
          />

          {/* 500 Hour — image LEFT, text RIGHT */}
          <CourseCard
            title="500 Hours Yoga Teacher Training in Rishikesh"
            description="Our 500 hour yoga course is designed to deepen your practice and refine your teaching skills. This advanced program explores yoga philosophy, advanced asanas, pranayama techniques, meditation, subtle anatomy, and the art of teaching. Geared towards experienced practitioners and certified yoga instructors, this course aims to elevate your expertise and confidence, empowering you to further your career as a skilled and knowledgeable yoga instructor. Join us on this transformative journey and unlock your full potential."
            duration="56 Days."
            certificate="Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional )."
            detailsLabel="500 Hour Details"
            imgSrc="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80"
            imgAlt="500 Hour Yoga Teacher Training Rishikesh — large group class"
            reverse={false}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — AYURVEDA + SOUND HEALING
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDeep}`}>
        <div className="container px-3 px-md-4">

          <h2 className={styles.sectionTitleCenter}>Specialty Courses</h2>
          <OmDivider />

          {/* Ayurveda — text LEFT, image RIGHT */}
          <CourseCard
            title="Ayurveda Yoga Course in Rishikesh"
            description="Discover the transformative energy of traditional healing with the Ayurveda course at AYM Yoga School in Rishikesh. Our comprehensive program offers in-depth knowledge of Ayurvedic principles, herbal treatments, and lifestyle practices. Nestled in the serene surroundings of the Himalayas, students will learn from experienced instructors dedicated to holistic wellness. Immerse yourself in this ancient science and deepen your connection between mind, body, and spirit. Join AYM Yoga School and embark on your journey to health and balance today!"
            duration="7, 14 & 21 Days"
            certificate="AYM YOGA SCHOOL."
            detailsLabel="Ayurveda Courses"
            imgSrc="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=700&q=80"
            imgAlt="Ayurveda Yoga Course Rishikesh — shirodhara treatment"
            reverse={true}
          />

          {/* Sound Healing — text RIGHT, image LEFT */}
          <CourseCard
            title="Sound Healing Course in Rishikesh"
            description="Transform your well-being with the Sound Healing Course at AYM Yoga School in Rishikesh. Our expert instructors guide you through ancient techniques that harness the power of sound for relaxation and healing. Located in the tranquil ambiance of the Himalayas, this course offers a unique opportunity to explore the benefits of sound therapy for mind, body, and spirit. Join AYM Yoga School today and experience profound healing through sound, enhancing your holistic wellness journey!"
            duration="5 Days."
            certificate="Yoga Alliance, USA."
            detailsLabel="Sound Healing Details"
            imgSrc="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=700&q=80"
            imgAlt="Sound Healing Course Rishikesh — singing bowls"
            reverse={false}
          />
        </div>
      </section>

    </div>
  );
}
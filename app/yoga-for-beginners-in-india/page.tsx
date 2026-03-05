// YogaBeginners.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-for-beginners-in-india/Yogabeginners.module.css";
import beginners from "@/assets/images/yoga-for-beginners-in-india.jpg";
import yogatecherimage from "@/assets/images/yoga-techer-training-course-for-beginners.webp"

// ---- Om Divider ----
const OmSVG: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" stroke="#e8600a" strokeWidth="2" fill="none" />
    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
      fontSize="26" fill="#e8600a" fontFamily="serif">ॐ</text>
  </svg>
);

const Divider: React.FC = () => (
  <div className={styles.divider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}><OmSVG /></span>
    <span className={styles.dividerLine} />
  </div>
);

// ---- Pricing table data ----
const pricingRows = [
  { date: "05th Jan to 16th Jan 2025",  dorm: "$400", shared: "$500", private: "$550" },
  { date: "03th Feb to 14th Feb 2025",  dorm: "$400", shared: "$500", private: "$550" },
  { date: "03th Mar to 14th Mar 2025",  dorm: "$400", shared: "$500", private: "$550" },
  { date: "03th Apr to 14th Apr 2025",  dorm: "$400", shared: "$500", private: "$550" },
  { date: "03th May to 14th Dec 2025",  dorm: "$400", shared: "$500", private: "$550" },
  { date: "03th Jun to 14th Jun 2025",  dorm: "$400", shared: "$500", private: "$550" },
  { date: "03th Jul to 14th Jul 2025",  dorm: "$400", shared: "$500", private: "$550" },
];

// ===================== MAIN COMPONENT =====================
const YogaBeginners: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* ===== HERO IMAGE ===== */}
      <section className={styles.heroImageSection}>
        <div className={styles.heroImageBox}>
          {/* Replace with your actual image path */}
          <Image
            src={beginners}
            alt="Yoga Teacher Training Course for Beginners in Rishikesh"
            fill
            sizes="(max-width: 575px) 100vw, (max-width: 991px) 95vw, 1100px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </section>

      {/* ===== MAIN HEADING ===== */}
      <section className={styles.titleSection}>
        <h1 className={styles.mainTitle}>
          Yoga Teacher Training Course for Beginners in Rishikesh
        </h1>
        <Divider />
        <p className={styles.bodyText}>
          Are you one of those people who are planning to join a beginner&apos;s yoga course in Rishikesh, India,
          for the first time but are confused because you do not have much yoga experience?
        </p>
        <p className={styles.bodyText}>
          Yoga is a powerful practice that blends physical movement, breath control, and meditation. It offers
          numerous benefits for the body and mind. Although it can be daunting for beginners, embracing this journey
          with an open heart and mind can lead to profound personal growth and well-being.
        </p>
        <p className={styles.bodyText}>
          We understand you might have many questions about starting your yoga journey in Rishikesh. At AYM Yoga
          School, we&apos;re here to guide you every step of the way. We regularly conduct beginner-level courses in
          Rishikesh, India, each lasting around 12 days. Our school is peaceful and serene, perfect for yoga and
          meditation practice.
        </p>
      </section>

      {/* ===== UNDERSTANDING & BENEFITS — two col layout ===== */}
      <section className={styles.understandingSection}>
        <h2 className={styles.orangeTitle}>
          Understanding of Yoga &amp; Benefit for Beginners Course in Rishikesh
        </h2>
        <Divider />

        <div className={styles.twoColRow}>
          {/* Left — text */}
          <div className={styles.twoColText}>
            <h3 className={styles.colHeading}>Understanding of Yoga</h3>
            <p className={styles.bodyText}>
              Yoga is more than just a series of poses; it&apos;s a holistic approach to health. It originated in
              ancient India and emphasizes the connection between the body, mind, and spirit. The practice usually
              includes:
            </p>
            <p className={styles.bodyText}>
              <strong>Asanas (Postures):</strong> Physical positions that enhance flexibility, strength, and balance.
            </p>
            <p className={styles.bodyText}>
              <strong>Pranayama (Breath Control):</strong> Techniques that focus on breath awareness and control to
              promote relaxation and energy.
            </p>
            <p className={styles.bodyText}>
              <strong>Meditation:</strong> Practices aimed at calming the mind and promoting inner peace.
            </p>

            <h3 className={styles.colHeading}>Benefits of Yoga for Beginners</h3>
            <p className={styles.bodyText}>
              <strong>1. Increased Flexibility:</strong> Regular practice helps loosen tight muscles, improving
              overall flexibility and range of motion.
            </p>
            <p className={styles.bodyText}>
              <strong>2. Enhanced Strength:</strong> Many yoga poses require different muscle groups, helping build
              and tone muscles.
            </p>
            <p className={styles.bodyText}>
              <strong>3. Stress Relief:</strong> Yoga encourages relaxation and helps alleviate stress through
              mindfulness and deep breathing.
            </p>
            <p className={styles.bodyText}>
              <strong>4. Improved Focus:</strong> Mindfulness practices enhance concentration and mental clarity.
            </p>
            <p className={styles.bodyText}>
              <strong>5. Better Posture:</strong> Yoga promotes awareness of body alignment, which can lead to
              better posture and reduce the risk of injury.
            </p>
          </div>

          {/* Right — image */}
          <div className={styles.twoColImage}>
            <div className={styles.sideImageBox}>
              {/* Replace with your actual image path */}
              <Image
                src={yogatecherimage}
                alt="Yoga instructor assisting student"
                fill
                sizes="(max-width: 767px) 100vw, 480px"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STUDENTS QUESTIONS ===== */}
      <section className={styles.questionsSection}>
        <h2 className={styles.orangeTitle}>
          Yoga Beginners Course in Rishikesh - Students Questions
        </h2>
        <Divider />

        <div className={styles.twoColQA}>
          {/* Left Q */}
          <div className={styles.qaCol}>
            <h3 className={styles.qaQuestion}>
              What will be learned in the Yoga Beginners Course at AYM?
            </h3>
            <p className={styles.bodyText}>
              In this course, you will be learning about yoga postures (asanas), pranayamas (yogic breathing
              exercises), and meditation (for a peaceful and calm state of mind). There is also a yogic detox program
              included in the course (they are collectively known as shat kriyas), and you will also be chanting
              mantras during the sessions.
            </p>
            <p className={styles.bodyText}>
              You will be introduced to Hatha, Iyengar, Vinyasa, and Shivananda Yoga styles for the asana practice.
              We focus on alignment correction of our students using appropriate props (as per the Iyengar style of
              yoga).
            </p>
            <p className={styles.bodyText}>
              Many of you who want to start yoga might also be new to meditation. Here, you will get the beautiful
              experience of meditation. Our teachers will be guiding you in the process. You will also be familiarized
              with the correct way of yogic breathing and be made to practice the same in the session. Here, you will
              also learn about beginner-level yoga asanas and their benefits.
            </p>
            <p className={styles.bodyText}>
              Towards the end of the yoga practice session, we do deep relaxation through Yoga Nidra in the Shavasana
              pose (i.e., the corpse pose), which profoundly calms the body and mind. This practice is well known for
              removing stress from the nervous system. Join our yoga course for beginners and experience the yogic
              effect in your mental, emotional, and physical realms!
            </p>
            <p className={styles.bodyText}>
              Our participants said they felt more relaxed and peaceful after each yoga session.
            </p>
          </div>

          {/* Right Q */}
          <div className={styles.qaCol}>
            <h3 className={styles.qaQuestion}>
              I have completed a beginner yoga course in Rishikesh. What should I do to advance my practice?
            </h3>
            <p className={styles.bodyText}>
              That&apos;s great to hear that you&apos;ve completed a beginner yoga course in Rishikesh! To advance
              your practice.
            </p>
            <p className={styles.bodyText}>
              AYM Yoga School offers a certification program that includes a 200 hour yoga course, 300-hour yoga
              course, 500 hour yoga course, which are pretty intense. You may choose one of these courses which is
              the most appropriate for you. These advanced-level courses are beneficial for starting a career in yoga
              and deepening your yogic experience. These courses need commitment and dedication from the
              practitioners&apos; side. And it is worth all the effort. Thousands of our ex-students have testified
              the same. (Our yoga teachers&apos; training courses are approved by the Yoga Alliance, USA and YCB,
              Ministry of AYUSH, Govt of India.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MORE INFORMATION ===== */}
      <section className={styles.moreInfoSection}>
        <h2 className={styles.orangeTitle}>More Information on Beginners&apos; Yoga Course</h2>
        <Divider />

        <ul className={styles.bulletList}>
          <li>The course participants could avail one ayurvedic massage per week.</li>
          <li>They are provided with three meals a day.</li>
          <li>Private rooms with free wifi and attached bathrooms are available.</li>
          <li>The classes are conducted from Monday to Saturday, and normally there are no classes kept on Sunday.</li>
          <li>Tours in and around Rishikesh are also planned. (This is at the discretion of the course director)</li>
        </ul>

        <p className={styles.bodyText}>
          You may refer to the course start dates and end dates for each month, as well as the fee structure in the
          table given on this page. Please reach out to us to confirm your seats for the yoga course for beginners.
          We welcome you to be part of this course. Namaste.
        </p>
      </section>

      {/* ===== PRICING TABLE ===== */}
      <section className={styles.pricingSection}>
        <h2 className={styles.orangeTitle}>Yoga for Beginners in India 2025</h2>
        <Divider />

        <p className={styles.bodyText}>
          Residential Hatha and Ashtanga <strong>Yoga Courses for beginners in Rishikesh India</strong> - 2025 at{" "}
          <em>AYM Yoga School</em> in India.
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.pricingTable}>
            <thead>
              <tr>
                <th>DATE</th>
                <th>DORMITORY</th>
                <th>SHARED ROOM</th>
                <th>PRIVATE ROOM</th>
                <th>AVAILABILITY</th>
              </tr>
            </thead>
            <tbody>
              {pricingRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td>{row.dorm}</td>
                  <td>{row.shared}</td>
                  <td>{row.private}</td>
                  <td className={styles.availableCell}>Available</td>
                </tr>
              ))}
              <tr className={styles.bookRow}>
                <td><strong>Book Your Spot</strong></td>
                <td>Register your spot</td>
                <td>by Paying $110 only</td>
                <td colSpan={2}>
                  <a href="#" className={styles.paymentsBtn}>
                    🖩 Payments Page
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default YogaBeginners;
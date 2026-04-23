// YogaBeginners.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-for-beginners-in-india/Yogabeginners.module.css";
import beginners from "@/assets/images/yoga-for-beginners-in-india.jpg";
import yogatecherimage from "@/assets/images/yoga-techer-training-course-for-beginners.webp";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/37.png";

// ---- Om Divider ----
const OmSVG: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="30"
      cy="30"
      r="28"
      stroke="#e8600a"
      strokeWidth="2"
      fill="none"
    />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="26"
      fill="#e8600a"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

const Divider: React.FC = () => (
  <div className={styles.divider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>
      <OmSVG />
    </span>
    <span className={styles.dividerLine} />
  </div>
);

// ---- Pricing table data ----
const pricingRows = [
  {
    date: "05th Jan to 16th Jan 2025",
    dorm: "$400",
    shared: "$500",
    private: "$550",
  },
  {
    date: "03th Feb to 14th Feb 2025",
    dorm: "$400",
    shared: "$500",
    private: "$550",
  },
  {
    date: "03th Mar to 14th Mar 2025",
    dorm: "$400",
    shared: "$500",
    private: "$550",
  },
  {
    date: "03th Apr to 14th Apr 2025",
    dorm: "$400",
    shared: "$500",
    private: "$550",
  },
  {
    date: "03th May to 14th Dec 2025",
    dorm: "$400",
    shared: "$500",
    private: "$550",
  },
  {
    date: "03th Jun to 14th Jun 2025",
    dorm: "$400",
    shared: "$500",
    private: "$550",
  },
  {
    date: "03th Jul to 14th Jul 2025",
    dorm: "$400",
    shared: "$500",
    private: "$550",
  },
];

// ===================== MAIN COMPONENT =====================
const YogaBeginners: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <section className={styles.heroSection}>
        <Image
          src={heroImg}
          alt="Yoga Students Group"
          width={1180}
          height={540}
          className={styles.heroImage}
          priority
        />
      </section>
     {/* ===== HERO IMAGE ===== */}


{/* ===== MAIN HEADING ===== */}
<section className={styles.contentSection}>
  <div className={styles.contentContainer}>
    <h1 className={styles.mainTitle}>
      Yoga Teacher Training Course for Beginners in Rishikesh
    </h1>
    
    <Divider />
    
    <div className={styles.contentBlock}>
      <p className={styles.questionText}>
        Are you planning to join a beginner's yoga course in Rishikesh for the first time 
        but feel confused because you don't have much yoga experience?
      </p>
      
      <p className={styles.bodyText}>
        Yoga is a powerful practice that blends physical movement, breath control, and meditation. 
        It offers numerous benefits for the body and mind. Although it can be daunting for beginners, 
        embracing this journey with an open heart and mind can lead to profound personal growth and well-being.
      </p>
      
      <p className={styles.bodyText}>
        We understand you might have many questions about starting your yoga journey in Rishikesh. 
        At AYM Yoga School, we're here to guide you every step of the way. We regularly conduct 
        beginner-level courses in Rishikesh, India, each lasting around 12 days. Our school is 
        peaceful and serene, perfect for yoga and meditation practice.
      </p>
      
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.infoNumber}>12</span>
          <span className={styles.infoLabel}>Days Course</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoNumber}>Beginner</span>
          <span className={styles.infoLabel}>Friendly</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoNumber}>Peaceful</span>
          <span className={styles.infoLabel}>Ashram</span>
        </div>
      </div>
    </div>
  </div>
</section>
<section className={styles.heroSection}>
  <div className={styles.heroContainer}>
    <div className={styles.heroImageBox}>
      <Image
        src={beginners}
        alt="Yoga Teacher Training Course for Beginners in Rishikesh"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
  </div>
</section>
     {/* ===== BENEFITS SECTION - FULL WIDTH WHITE BACKGROUND ===== */}
<section className={styles.benefitsFullSection}>
  <div className={styles.benefitsFullContainer}>
    <div className={styles.benefitsHeader}>
      <h3 className={styles.benefitsFullTitle}>Benefits of Yoga for Beginners</h3>
      <div className={styles.benefitsUnderline}></div>
    </div>
    
    <div className={styles.benefitsGrid}>
      <div className={styles.benefitFullCard}>
        <div className={styles.benefitFullNumber}>01</div>
        <div className={styles.benefitFullContent}>
          <h4 className={styles.benefitFullName}>Increased Flexibility</h4>
          <p className={styles.benefitFullDesc}>Regular practice helps loosen tight muscles, improving overall flexibility and range of motion</p>
        </div>
      </div>
      
      <div className={styles.benefitFullCard}>
        <div className={styles.benefitFullNumber}>02</div>
        <div className={styles.benefitFullContent}>
          <h4 className={styles.benefitFullName}>Enhanced Strength</h4>
          <p className={styles.benefitFullDesc}>Many yoga poses require different muscle groups, helping build and tone muscles</p>
        </div>
      </div>
      
      <div className={styles.benefitFullCard}>
        <div className={styles.benefitFullNumber}>03</div>
        <div className={styles.benefitFullContent}>
          <h4 className={styles.benefitFullName}>Stress Relief</h4>
          <p className={styles.benefitFullDesc}>Yoga encourages relaxation and helps alleviate stress through mindfulness and deep breathing</p>
        </div>
      </div>
      
      <div className={styles.benefitFullCard}>
        <div className={styles.benefitFullNumber}>04</div>
        <div className={styles.benefitFullContent}>
          <h4 className={styles.benefitFullName}>Improved Focus</h4>
          <p className={styles.benefitFullDesc}>Mindfulness practices enhance concentration and mental clarity</p>
        </div>
      </div>
      
      <div className={styles.benefitFullCard}>
        <div className={styles.benefitFullNumber}>05</div>
        <div className={styles.benefitFullContent}>
          <h4 className={styles.benefitFullName}>Better Posture</h4>
          <p className={styles.benefitFullDesc}>Yoga promotes awareness of body alignment, which can lead to better posture and reduce injury risk</p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ===== MORE INFORMATION ===== */}
     {/* ===== MORE INFORMATION ===== */}
<section className={styles.moreInfoSection}>
  <div className={styles.sectionContainer}>
    <h2 className={styles.sectionTitle}>More Information on Beginners' Yoga Course</h2>
    <Divider />

    <div className={styles.infoGrid}>
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#e8600a"/>
          </svg>
        </div>
        <div className={styles.infoContent}>
          <h4 className={styles.infoTitle}>Ayurvedic Massage</h4>
          <p className={styles.infoDesc}>Course participants can avail one ayurvedic massage per week</p>
        </div>
      </div>
      
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" fill="#e8600a"/>
          </svg>
        </div>
        <div className={styles.infoContent}>
          <h4 className={styles.infoTitle}>Three Meals Daily</h4>
          <p className={styles.infoDesc}>Nutritious and healthy meals provided throughout the course</p>
        </div>
      </div>
      
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2h6v2h-6V6zm0 4h6v2h-6v-2zm-6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z" fill="#e8600a"/>
          </svg>
        </div>
        <div className={styles.infoContent}>
          <h4 className={styles.infoTitle}>Private Rooms</h4>
          <p className={styles.infoDesc}>Private rooms with free WiFi and attached bathrooms available</p>
        </div>
      </div>
      
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" fill="#e8600a"/>
          </svg>
        </div>
        <div className={styles.infoContent}>
          <h4 className={styles.infoTitle}>Class Schedule</h4>
          <p className={styles.infoDesc}>Classes conducted Monday to Saturday, Sundays off</p>
        </div>
      </div>
      
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#e8600a"/>
          </svg>
        </div>
        <div className={styles.infoContent}>
          <h4 className={styles.infoTitle}>Tours & Excursions</h4>
          <p className={styles.infoDesc}>Tours in and around Rishikesh planned (at course director's discretion)</p>
        </div>
      </div>
    </div>

    <div className={styles.noteBox}>
      <p className={styles.noteText}>
        You may refer to the course start dates and end dates for each month, as well as the fee structure 
        in the table below. Please reach out to us to confirm your seats for the yoga course for beginners. 
        We welcome you to be part of this course. <strong>Namaste.</strong>
      </p>
    </div>
  </div>
</section>

{/* ===== PRICING TABLE ===== */}
<section className={styles.pricingSection}>
  <div className={styles.sectionContainer}>
    <h2 className={styles.sectionTitle}>Yoga for Beginners in India 2025</h2>
    <Divider />

    <p className={styles.pricingIntro}>
      Residential Hatha and Ashtanga <strong>Yoga Courses for beginners in Rishikesh India</strong> - 2025 
      at <em>AYM Yoga School</em> in India.
    </p>

    <div className={styles.tableWrapper}>
      <table className={styles.pricingTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Dormitory</th>
            <th>Shared Room</th>
            <th>Private Room</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {pricingRows.map((row, idx) => (
            <tr key={idx}>
              <td className={styles.dateCell}>{row.date}</td>
              <td>{row.dorm}</td>
              <td>{row.shared}</td>
              <td>{row.private}</td>
              <td className={styles.availableCell}>Available</td>
            </tr>
          ))}
          <tr className={styles.bookRow}>
            <td colSpan={5}>
              <div className={styles.bookContent}>
                <div className={styles.bookInfo}>
                  <strong>Book Your Spot</strong>
                  <span>Register your spot by paying $110 only</span>
                </div>
                <a href="#" className={styles.paymentsBtn}>
                  Payments Page
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
      <HowToReach />
    </div>
  );
};

export default YogaBeginners;

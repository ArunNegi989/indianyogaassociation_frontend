import React from "react";
import styles from "@/assets/style/yoga-teacher-training/Yogatraining.module.css";
import Link from "next/link";

/* ─────────────────────────────────────────────
   CITY LINKS DATA
───────────────────────────────────────────── */
const cityLinks: { name: string; href: string }[] = [
  { name: "Jaipur", href: "/yoga-teacher-training/yoga-teacher-training-Jaipur" },
  { name: "Mysore", href: "/yoga-teacher-training/yoga-teacher-training-Mysore" },
  { name: "Haryana", href: "/yoga-teacher-training/yoga-teacher-training-Haryana" },
  { name: "Agra", href: "/yoga-teacher-training/yoga-teacher-training-Agra" },
  { name: "Mumbai", href: "/yoga-teacher-training/yoga-teacher-training-Mumbai" },
  { name: "Coimbatore", href: "/yoga-teacher-training/yoga-teacher-training-Coimbatore" },
  { name: "Uttrakhand", href: "/yoga-teacher-training/yoga-teacher-training-Uttrakhand" },
  { name: "Varkala", href: "/yoga-teacher-training/yoga-teacher-training-Varkala" },
  { name: "Gokarna", href: "/yoga-teacher-training/yoga-teacher-training-Gokarna" },
  { name: "Tamil Nadu", href: "/yoga-teacher-training/yoga-teacher-training-Tamil-Nadu" },
  { name: "Goa", href: "/yoga-teacher-training/yoga-teacher-training-Goa" },
  { name: "Kochi", href: "/yoga-teacher-training/yoga-teacher-training-Kochi" },
  { name: "Munger", href: "/yoga-teacher-training/yoga-teacher-training-Munger" },
  { name: "Dharamshala", href: "/yoga-teacher-training/yoga-teacher-training-Dharamshala" },
  { name: "Lonavala", href: "/yoga-teacher-training/yoga-teacher-training-Lonavala" },
  { name: "New Delhi", href: "/yoga-teacher-training/yoga-teacher-training-New-Delhi" },
  { name: "Kerala", href: "/yoga-teacher-training/yoga-teacher-training-Kerala" },
  { name: "Puducherry", href: "/yoga-teacher-training/yoga-teacher-training-Puducherry" },
  { name: "Pushkar", href: "/yoga-teacher-training/yoga-teacher-training-Pushkar" },
  { name: "Sikkim", href: "/yoga-teacher-training/yoga-teacher-training-Sikkim" },
  { name: "Gurugram", href: "/yoga-teacher-training/yoga-teacher-training-Gurugram" },
  { name: "Pune", href: "/yoga-teacher-training/yoga-teacher-training-Pune" },
  { name: "Chennai", href: "/yoga-teacher-training/yoga-teacher-training-Chennai" },
  { name: "Varanasi", href: "/yoga-teacher-training/yoga-teacher-training-Varanasi" },
  { name: "Maharashtra", href: "/yoga-teacher-training/yoga-teacher-training-Maharashtra" },
  { name: "Arambol", href: "/yoga-teacher-training/yoga-teacher-training-Arambol" },
  { name: "Thiruvananthapuram", href: "/yoga-teacher-training/yoga-teacher-training_Thiruvananthapuram" },
  { name: "Kolkata", href: "/yoga-teacher-training/yoga-teacher-training-Kolkata" },
  { name: "Rishikesh", href: "/yoga-teacher-training/yoga-teacher-training-Rishikesh" },
  { name: "Himachal Pradesh", href: "/yoga-teacher-training/yoga-teacher-training-Himachal-Pradesh-1" },
  { name: "Himachal Pradesh", href: "/yoga-teacher-training/yoga-teacher-training-Himachal-Pradesh-2" },
  { name: "Bengaluru", href: "/yoga-teacher-training/yoga-teacher-training-Bengaluru" },
  { name: "Auroville", href: "/yoga-teacher-training/yoga-teacher-training-Auroville" },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const YogaTrainingUttarakhand: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Top border */}
      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ══════════════════════════════════════
            PAGE TITLE
        ══════════════════════════════════════ */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Yoga Teacher Training in Uttarakhand</h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Image Left
            "200 Hour Yoga Course in Uttarakhand"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="200 Hour Yoga Course in Uttarakhand"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              200 Hour Yoga Cousre in Uttarakhand
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              If you are looking forward to a rewarding experience and advancing your yoga
              practice, you can count on us, "Association for Yoga and Meditation." We offer{" "}
              <strong className={styles.boldLink}>yoga teacher teaching courses in Uttarakhand</strong>{" "}
              to teachers, students, or enthusiasts whose interest has grown in this peaceful
              world. The{" "}
              <strong className={styles.boldLink}>yoga teacher training course near me</strong>{" "}
              that we offer provides individuals with accurate and current tools alongside
              techniques of yoga practices for those who aim to become licensed yoga trainers.
              Along with that, we help you gain support to develop a distinctive teaching approach
              that uniquely shapes others and helps you become a successful yoga teacher in
              Uttarakhand.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Image Right
            "Highly Recommend Yoga Teacher Training School in Uttarakhand"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Highly Recommend Yoga Teacher Training School in Uttarakhand"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Highly Recommend Yoga Teacher Training School in Uttarakhand
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Our{" "}
              <strong className={styles.boldLink}>yoga teacher training course in Uttarakhand</strong>{" "}
              can be the cornerstone of a fruitful career as a yoga instructor. As a future
              educator, you will be trained to encounter all the challenges in the real world after
              being introduced to this antiquated science course. Our yoga teacher training course
              in Uttarakhand is perfect for aspiring yoga instructors and those who want to reach
              the pinnacle of yogic understanding. Once you have completed the teacher training
              program, you will be entitled to receive the yoga teacher certification that will
              support your career further.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — Image Left
            "Excellent Teaching to Help You Become a Professional Teacher"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Excellent Teaching to Help You Become a Professional Teacher"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Excellent Teaching to Help You Become a Professional Teacher
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Highly qualified teachers offer our{" "}
              <strong className={styles.boldLink}>licensed yoga teacher training course in Uttarakhand</strong>.
              The yoga Gurus are real-world professionals. At our institute, we firmly believe that
              the knowledge of yoga grows only by teaching the correct values and techniques. Our
              trainers ensure that you are fit and are shaped into a flexible being who can quickly
              adapt to any yoga pose. Our{" "}
              <strong className={styles.boldLink}>YTT in Uttarakhand</strong> teaches you how to
              speak to your students, understand their problems without being judgmental and help
              them achieve a peaceful life. Once you get the{" "}
              <strong className={styles.boldLink}>YTT certification in Uttarakhand</strong>, you
              can start your classes and spread the word of positivity around.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — Image Right
            "Enlighten Your Yoga Knowledge Through Our Extensive Courses"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Enlighten Your Yoga Knowledge Through Our Extensive Courses"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Enlighten Your Yoga Knowledge Through Our Extensive Courses
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              At the Association for Yoga and Meditation, we have a well-researched and{" "}
              <strong className={styles.boldLink}>registered yoga teacher training course in Uttarakhand</strong>{" "}
              that nourishes and helps you to grow into a true professional. We do not demand that
              you have any prior knowledge about yoga besides motivation and dedication. Once you
              are passionate about learning all the yogic knowledge, we will encourage you and help
              you achieve a globally acclaimed yoga instructor certification. It is our motto to
              see the world experiencing a peaceful and healthy lifestyle and so as we move
              forward.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 5 — Image Left
            "Get Globally Accepted With Our Valuable Yoga Certification Course"
        ══════════════════════════════════════ */}
        <div
          className={`${styles.section} ${styles.sectionImageLeft}`}
          style={{ borderBottom: "none" }}
        >
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Get Globally Accepted With Our Valuable Yoga Certification Course"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Get Globally Accepted With Our Valuable Yoga Certification Course
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              At the Association for Yoga and Meditation, you will gain in-depth knowledge of how
              yoga works through our yoga therapy teacher training. Our{" "}
              <strong className={styles.boldLink}>YTT course in Uttarakhand</strong> teaches you
              how to help one manage their lifestyle, meditate, and adapt to new yogic ideas. With
              a team of knowledgeable and qualified trainers, we show you how to professionally
              teach advanced yoga to others. Not to mention, our{" "}
              <strong className={styles.boldLink}>yoga teacher training program in Uttarakhand</strong>{" "}
              holds both contemporary and conventional teaching methods. Once the course is done,
              you receive an international yoga certification, making your expertise highly
              valuable in today's competitive world.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            CITY LINKS
        ══════════════════════════════════════ */}
        <div className={styles.citySection}>
          <h3 className={styles.cityHeading}>
            Indian Yoga is also easily reachable from :
          </h3>
          <div className={styles.cityLinksWrap}>
            {cityLinks.map((city, i) => (
              <React.Fragment key={i}>
                <Link href={city.href} className={styles.cityLink}>
                  {city.name}
                </Link>
                {i < cityLinks.length - 1 && (
                  <span className={styles.citySep}>, </span>
                )}
              </React.Fragment>
            ))}
            <span className={styles.cityDot}>.</span>
          </div>
        </div>

      </div>

      {/* Bottom border */}
      <div className={styles.topBorder} />
    </div>
  );
};

export default YogaTrainingUttarakhand;
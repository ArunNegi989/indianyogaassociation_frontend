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
const YogaTrainingJaipur: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Top border */}
      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ══════════════════════════════════════
            PAGE TITLE
        ══════════════════════════════════════ */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Yoga Teacher Training in Jaipur</h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Image Left
            "Are you looking for Teacher Training in Jaipur"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Yoga class Rishikesh AYM school"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Are you looking for Teacher Training in Jaipur
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Yoga has been and is still a gift to the world for decades. Be it physical or mental,
              it is a powerful tool when it comes to well-being. It is famous worldwide due to the
              high demand of students who want to deepen their knowledge. Are you looking for a
              profound <strong className={styles.boldLink}>yoga teacher training course in Jaipur?</strong>
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              We at AYM are your best choice. We offer services in Rishikesh and around different
              locations. With us, you'll develop the necessary skills that will help you grow as a
              yoga teacher. Our courses are affordable and come with certification. So join us at
              AYM, the <strong className={styles.boldLink}>best yoga TTC in Jaipur</strong>, and
              learn to be fit and inspire others.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Image Right
            "Gain In-depth Knowledge from the Best Curriculum"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Yoga curriculum training students"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingScript} style={{ textAlign: "center" }}>
              Gain In-depth Knowledge from the Best Curriculum
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              We at AYM believe that yoga goes beyond just physical postures. Without proper
              knowledge, one cannot understand the yogic life. Keeping this in mind, we offer a
              comprehensive course through our Course of{" "}
              <strong className={styles.boldLink}>yoga teacher training in Jaipur</strong>. The
              curriculum and programs are designed to cater to the needs of all yoga enthusiasts
              and all levels- beginners, intermediate and advanced.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              Our <strong className={styles.boldLink}>yoga teacher training in Jaipur</strong>{" "}
              courses are well-detailed and covers all aspects of yoga. Our teachings go back to
              the traditional form but are learned in the modern way. You'll learn yoga techniques
              and gain the confidence to effectively share this knowledge with the world.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — Image Left
            (Continuation — numbered syllabus list)
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Yoga teacher guiding students in class"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <p className={styles.bodyText}>
              You'll also be involved in daily group practice, expert guidance, detailed
              instructions on theory and practical classes, receive additional and personalized
              attention and more. Furthermore, here are some examples of what you'll learn by
              enrolling on our{" "}
              <strong className={styles.boldLink}>yoga teacher training in Jaipur</strong>:
            </p>
            <ol className={styles.numberedList}>
              <li>1. Introduction of yoga.</li>
              <li>2. The yoga paths.</li>
              <li>3. Different yoga postures.</li>
              <li>4. Yoga and its philosophy and principles.</li>
              <li>5. 200/300/500-hour yoga TTC in Jaipur.</li>
              <li>6. Anatomy and physiology.</li>
              <li>7. Breathing techniques.</li>
              <li>8. Teaching methodologies</li>
            </ol>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — Image Right
            Two sub-headings + text
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight} ${styles.sectionAlignTop}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Yoga certification levels training Jaipur"
              className={styles.sectionImg}
              style={{ maxHeight: "640px" }}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            {/* Sub-section A */}
            <h2 className={styles.headingScript} style={{ textAlign: "center" }}>
              Learn Different Yoga Levels with Certification in Jaipur
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              We at AYM have covered you for candidates who want to learn yoga but need more time.
              In addition to our long-term courses, we offer short-term courses, such as{" "}
              <strong className={styles.boldLink}>200 hour yoga TTC in Jaipur</strong> and{" "}
              <strong className={styles.boldLink}>300 hour yoga TTC in Jaipur</strong>. Whether you
              want to deepen your knowledge or become a certified teacher, these courses are best
              suited for you.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              These courses involve all necessary skills and practices both in theory and practical
              form. Certified yoga teachers and experts will guide you. Upon completing your{" "}
              <strong className={styles.boldLink}>yoga teacher training in Jaipur</strong>, you'll
              also be rewarded with a certificate allowing you to teach anywhere in the world.
            </p>

            {/* Sub-section B */}
            <h2 className={styles.subHeadingSerif} style={{ textAlign: "center" }}>
              Learn Yoga from the Best Teachers and Get Certified
            </h2>
            <p className={styles.bodyText}>
              As the leading yoga teacher training provider in Jaipur India, we at AYM have the
              best teachers and professionals for you. By enrolling, you'll get the opportunity to
              learn with highly skilled and experienced yoga teachers. Be it any queries, the
              teachers will guide and support you in every step. You'll be confident as the
              teachers provide personal attention to all individuals.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              By completing your{" "}
              <strong className={styles.boldLink}>yoga teacher training in Jaipur</strong>, you'll
              feel completely skilled, knowledgeable and capable of sharing your ideas with the
              world. The best part is that you'll be certified with our Yoga Alliance certification
              and accreditation that meets the international standard. Once you receive it, you can
              start your own journey and turn your passion into your best occupation.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 5 — Image Left
            Two sub-headings + outcome list
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft} ${styles.sectionAlignTop}`}
          style={{ borderBottom: "none" }}
        >
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="AYM Yoga center facilities Jaipur"
              className={styles.sectionImg}
              style={{ maxHeight: "640px" }}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            {/* Sub-section A */}
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Our Yoga Center and its Facilities
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              At AYM the <strong className={styles.boldLink}>best yoga teacher training centre in Jaipur</strong>,
              we are committed to serving all aspiring and interested students irrespective of
              caste, culture and background. We are open to all and welcome you all to Rishikesh to
              be a part of our family. So, immerse yourself in our serene atmosphere and airy
              spaces. Besides, an open mind and friendly approach are the pillars of our school.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              We have top-notch amenities to ensure you enjoy a comfortable stay while you continue
              your <strong className={styles.boldLink}>yoga teacher training retreats in Jaipur</strong>.
              We are equipped with all modern needs and every necessary tool related to yoga.
              Overall, we aim to allow our students to complete their courses with flexibility and
              convenience.
            </p>

            {/* Sub-section B */}
            <h2 className={styles.subHeadingSerif} style={{ textAlign: "left" }}>
              What will be the outcome of this Course?
            </h2>
            <p className={styles.bodyText}>
              Should you enrol on this Course? Will this{" "}
              <strong className={styles.boldLink}>best yoga teacher training course in Jaipur</strong>{" "}
              be beneficial? Well, without any doubt, yes! Here is what will be the outcome of this
              Course:
            </p>
            <ol className={styles.numberedList}>
              <li>1. You'll have a deep understanding of yoga and its lifestyle.</li>
              <li>
                2. You'll cultivate mindfulness and learn to balance life and relationships.
              </li>
              <li>
                3. Our comprehensive{" "}
                <strong className={styles.boldLink}>yoga teacher training in Jaipur</strong> goes
                beyond physical practice; it comes with in-depth knowledge and guidance.
              </li>
              <li>
                4. In addition to gaining knowledge about yoga, you'll also learn effective
                teaching methods.
              </li>
              <li>
                5. By the time you finish your Course, you'll be considered a certified teacher
                and can continue your teachings globally.
              </li>
            </ol>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              For any reason, everyone has stress in their lives. But with yoga, you can heal your
              damages and learn to live healthy and happy forever. At AYM, we are a community of
              friends and family who live, take care of, and grow with each other. Life and yoga
              are not just for living but also for celebrating. So join our integrated yoga course
              and become an expert yoga professional.
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

export default YogaTrainingJaipur;
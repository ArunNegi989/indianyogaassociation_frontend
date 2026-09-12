import React from "react";
import styles from "@/assets/style/yoga-teacher-training/Yogatraining.module.css";
import Link from "next/link";

/* ─────────────────────────────────────────────
   CITY LINKS DATA
───────────────────────────────────────────── */
const cityLinks: { name: string; href: string }[] = [
  {
    name: "Jaipur",
    href: "/yoga-teacher-training/yoga-teacher-training-Jaipur-94-2194",
  },
  {
    name: "Mysore",
    href: "/yoga-teacher-training/yoga-teacher-training-Mysore-94-2170",
  },
  {
    name: "Haryana",
    href: "/yoga-teacher-training/yoga-teacher-training-Haryana-94-2186",
  },
  { name: "Agra", href: "/yoga-teacher-training/yoga-teacher-training-Agra-94-2197" },
  {
    name: "Mumbai",
    href: "/yoga-teacher-training/yoga-teacher-training-Mumbai-94-2175",
  },
  {
    name: "Coimbatore",
    href: "/yoga-teacher-training/yoga-teacher-training-Coimbatore-94-2182",
  },
  {
    name: "Uttrakhand",
    href: "/yoga-teacher-training/yoga-teacher-training-Uttrakhand-94-2173",
  },
  {
    name: "Varkala",
    href: "/yoga-teacher-training/yoga-teacher-training-Varkala-94-2188",
  },
  {
    name: "Gokarna",
    href: "/yoga-teacher-training/yoga-teacher-training-Gokarna-94-2180",
  },
  {
    name: "Tamil Nadu",
    href: "/yoga-teacher-training/yoga-teacher-training-Tamil%20Nadu-94-2187",
  },
  { name: "Goa", href: "/yoga-teacher-training/yoga-teacher-training-Goa-94-2167" },
  { name: "Kochi", href: "/yoga-teacher-training/yoga-teacher-training-Kochi-94-2190" },
  {
    name: "Munger",
    href: "/yoga-teacher-training/yoga-teacher-training-Munger-94-2177",
  },
  {
    name: "Dharamshala",
    href: "/yoga-teacher-training/yoga-teacher-training-Dharamshala-94-2169",
  },
  {
    name: "Lonavala",
    href: "/yoga-teacher-training/yoga-teacher-training-Lonavala-94-2174",
  },
  {
    name: "New Delhi",
    href: "/yoga-teacher-training/yoga-teacher-training-New%20Delhi-94-2176",
  },
  {
    name: "Kerala",
    href: "/yoga-teacher-training/yoga-teacher-training-Kerala-94-2168",
  },
  {
    name: "Puducherry",
    href: "/yoga-teacher-training/yoga-teacher-training-Puducherry-94-2185",
  },
  {
    name: "Pushkar",
    href: "/yoga-teacher-training/yoga-teacher-training-Pushkar-94-2192",
  },
  {
    name: "Sikkim",
    href: "/yoga-teacher-training/yoga-teacher-training-Sikkim-94-2198",
  },
  {
    name: "Gurugram",
    href: "/yoga-teacher-training/yoga-teacher-training-Gurugram-94-2195",
  },
  { name: "Pune", href: "/yoga-teacher-training/yoga-teacher-training-Pune-94-2171" },
  {
    name: "Chennai",
    href: "/yoga-teacher-training/yoga-teacher-training-Chennai-94-2184",
  },
  {
    name: "Varanasi",
    href: "/yoga-teacher-training/yoga-teacher-training-Varanasi-94-2183",
  },
  {
    name: "Maharashtra",
    href: "/yoga-teacher-training/yoga-teacher-training-Maharashtra-94-2189",
  },
  {
    name: "Arambol",
    href: "/yoga-teacher-training/yoga-teacher-training-Arambol-94-2181",
  },
  {
    name: "Thiruvananthapuram",
    href: "/yoga-teacher-training/yoga-teacher-training-Thiruvananthapuram-94-2193",
  },
  {
    name: "Kolkata",
    href: "/yoga-teacher-training/yoga-teacher-training-Kolkata-94-2196",
  },
  {
    name: "Rishikesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Rishikesh-94-2166",
  },
  {
    name: "Himachal Pradesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Himachal%20Pradesh-94-2178",
  },
  
  {
    name: "Bengaluru",
    href: "/yoga-teacher-training/yoga-teacher-training-Bengaluru-94-2179",
  },
  {
    name: "Auroville",
    href: "/yoga-teacher-training/yoga-teacher-training-Auroville-94-2191",
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const YogaTrainingHimachalPradesh: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Top border */}
      <div className={styles.a} />

      <div className={styles.container}>
        {/* ══════════════════════════════════════
            PAGE TITLE
        ══════════════════════════════════════ */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            Best Yoga Teacher Training School in Himachal Pradesh
          </h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Image Left
            "Yoga Teacher Training Course in Himachal Pradesh"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Yoga Teacher Training Course in Himachal Pradesh"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Yoga Teacher Training Course in Himachal Pradesh
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              People do yoga not just to improve their health but also to
              increase their strength and flexibility. It awakens consciousness
              and assists in uniting the mind and the body. However, you have
              become interested in the world of yoga. In that case, you can best
              enlighten others with its knowledge by taking up a{" "}
              <strong className={styles.boldLink}>
                yoga training course in Himachal Pradesh
              </strong>{" "}
              at the Association for Yoga and Meditation. We are the leading
              platform where you can enrol and learn all aspects of it through
              the{" "}
              <strong className={styles.boldLink}>
                licensed yoga teacher training course in Himachal Pradesh
              </strong>
              . Our courses help you build a vital profession and a healthy life,
              besides assisting others to achieve the same.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Image Right
            "Become A Professional Yoga Teacher With Us"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Become A Professional Yoga Teacher With Us"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Become A Professional Yoga Teacher With Us
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              At "The Association for Yoga and Meditation," we are the ones who
              will help you to develop yoga practice as a teacher through our
              exclusive{" "}
              <strong className={styles.boldLink}>
                yoga teacher training course near me
              </strong>
              . We ensure you are provided with a satisfactory experience under
              the guidance of skilled instructors. To become a great trainer and
              create a unique teaching style, our{" "}
              <strong className={styles.boldLink}>
                Registered yoga teacher training course in Himachal Pradesh
              </strong>{" "}
              offers traditional and modern yoga practices. With our{" "}
              <strong className={styles.boldLink}>
                yoga teacher teaching course in Himachal Pradesh
              </strong>
              , we make sure that you are moulded into a true professional to
              have a successful career in the future.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — Image Left
            "Enhance Yoga Knowledge With Our Extensive Course"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&q=80&fit=crop"
              alt="Enhance Yoga Knowledge With Our Extensive Course"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Enhance Yoga Knowledge With Our Extensive Course
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              We provide thorough programs to increase your expertise as one of
              the top{" "}
              <strong className={styles.boldLink}>
                accredited yoga instructor certifications near me
              </strong>
              . Our{" "}
              <strong className={styles.boldLink}>
                yoga teacher training in Himachal Pradesh
              </strong>{" "}
              encompasses all the elements necessary for a healthy lifestyle,
              from revealing the hidden depth of human potential to educating
              about whole personality development and addressing mental health
              issues. At the Association for Yoga and Meditation, we help you
              achieve total spirituality and a healthy way of life through our
              yoga therapy teacher training.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — Image Right
            "Get Globally Certified and Recognized Through Our Courses"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Get Globally Certified and Recognized Through Our Courses"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Get Globally Certified and Recognized Through Our Courses
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              As the best{" "}
              <strong className={styles.boldLink}>
                yoga teacher training courses provider in Himachal Pradesh
              </strong>
              , our yoga teacher certification will help you become completely
              prepared for the real world as a professional yoga teacher. With
              years of expertise and all the necessary abilities — our{" "}
              <strong className={styles.boldLink}>
                yoga teacher in Himachal Pradesh
              </strong>{" "}
              makes sure to transform you into a knowledgeable individual. You
              would be exposed to the principles of ancient science and given
              in-depth information about how yoga is applied in daily life.
              After completing the course, you must pass the exams to qualify
              for the{" "}
              <strong className={styles.boldLink}>
                yoga teacher training certification in Himachal Pradesh
              </strong>
              , a global certification to conduct yoga therapy classes anywhere
              globally as a registered trainer.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 5 — Image Left
            "Highly Valuable Yoga Teacher Training Course Program"
        ══════════════════════════════════════ */}
        <div
          className={`${styles.section} ${styles.sectionImageLeft}`}
          style={{ borderBottom: "none" }}
        >
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Highly Valuable Yoga Teacher Training Course Program"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Highly Valuable Yoga Teacher Training Course Program
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              At our institution of{" "}
              <strong className={styles.boldLink}>
                yoga teacher training program in Himachal Pradesh
              </strong>
              , our students know our speciality and the high calibre of the
              training. We ensure that our students are perfectly trained in
              modern classrooms with all the latest amenities. Our training
              leaves the students with a pleasant experience where they can
              learn the art and techniques of yoga from the experts. After you
              learn the aspects of yoga, you will be given the international
              certification accepted globally and can help you build a secured
              yoga career as a registered instructor.
            </p>
            <div style={{ marginTop: "1.5rem" }}>
              <Link
                href="/yoga-teacher-training"
                className={styles.bookNowBtn}
                style={{
                  display: "inline-block",
                  backgroundColor: "#f5b800",
                  color: "#fff",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "0.65rem 1.8rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  transition: "background 0.2s ease",
                }}
              >
                Book Now
              </Link>
            </div>
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
      <div className={styles.a} />
    </div>
  );
};

export default YogaTrainingHimachalPradesh;
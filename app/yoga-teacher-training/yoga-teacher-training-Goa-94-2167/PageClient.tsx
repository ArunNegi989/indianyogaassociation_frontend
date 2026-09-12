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
const YogaTrainingGoa: React.FC = () => {
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
            Yoga Teacher Training in Goa with World-Class Facilities
          </h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Image Left
            "Join Yoga, Teach Yoga Make the World a Happier Place"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Join Yoga, Teach Yoga Make the World a Happier Place"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Join Yoga, Teach Yoga Make the World a Happier Place
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              You've found the right site if you're looking to find your place
              in the worldwide Yoga community. Beautiful in its many forms, yoga
              has been shown to improve mental and physical wellness in
              countless people. And if you want to impact the world positively,
              our{" "}
              <strong className={styles.boldLink}>
                yoga teacher training in Goa
              </strong>{" "}
              is the best method to accomplish it. The Association for Yoga and
              Meditation can help you become the greatest yoga teacher in Goa by
              offering you an all-inclusive{" "}
              <strong className={styles.boldLink}>YTT Goa</strong> at a
              reasonable cost. Thousands of students are ready to walk out into
              the world and spread hope, and we have prepared them for this
              time.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Image Right
            "Gain A Solid Yoga Foundation, and Come Train With Us!"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Gain A Solid Yoga Foundation, and Come Train With Us!"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Gain A Solid Yoga Foundation, and Come Train With Us!
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Suppose you are in search of a{" "}
              <strong className={styles.boldLink}>
                yoga teacher training course near me
              </strong>
              . In that case, our{" "}
              <strong className={styles.boldLink}>
                yoga teacher certification program in Goa
              </strong>{" "}
              is widely regarded as the region's most thorough and spiritually
              enlightening. Knowledge of yoga postures and philosophy is
              beneficial but optional to enrol in our international yoga
              certification course.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              The course curriculum is internationally recognized, and you
              become a{" "}
              <strong className={styles.boldLink}>
                registered yoga teacher in Goa
              </strong>{" "}
              upon completion. Come to our workshops with nothing more than a
              genuine desire to learn and an open mind about the yogic practices
              we'll be employing. When you show initiative, we'll do everything
              we can to help you keep progressing toward completing the{" "}
              <strong className={styles.boldLink}>
                licensed yoga trainer program in Goa
              </strong>
              . As a result of visiting this page, we hope you'll be motivated
              and take charge of your learning. We are the pioneers in offering
              professional development by learning more about yoga through our
              world-class teacher training sessions in your area. We are the
              organization that wants to see you succeed in spiritual and
              academic endeavours if you are looking for a bright career as a
              yoga instructor.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — Image Left
            "Preexisting Conditions for High-Quality Education"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Preexisting Conditions for High-Quality Education"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Preexisting Conditions for High-Quality Education
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Our yoga classes in Goa take place in serene, state-of-the-art
              facilities. Through our yoga therapy teacher training program, we
              teach unique yoga methods. In that, we focus on the well-being of
              our participants. With our{" "}
              <strong className={styles.boldLink}>
                200-hour certified yoga teacher training program in Goa
              </strong>
              , you'll learn everything from scratch to advanced techniques,
              including over a hundred different poses and the attainment of
              maximum flexibility. To give you a complete understanding of yoga,
              we cover its practical uses and philosophical foundations. Our
              goal is to make you a master of both classical and contemporary
              forms of yoga through our{" "}
              <strong className={styles.boldLink}>
                licensed yoga teacher training course in Goa
              </strong>
              .
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — Image Right
            "Yoga Lessons By Industry Leaders"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Yoga Lessons By Industry Leaders"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Yoga Lessons By Industry Leaders
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Learn how to help others through yoga by enrolling in our
              intensive{" "}
              <strong className={styles.boldLink}>
                yoga training course in Goa
              </strong>
              . Classes are taught by trained yoga instructors who are all
              members of the Association for Yoga and Meditation staff. Since
              optimal performance in each position is paramount, instructors
              provide pupils customized instruction and pay special attention to
              their form. You will receive the globally recognized{" "}
              <strong className={styles.boldLink}>
                YTT certification in Goa
              </strong>{" "}
              only when you have been shaped into a true professional and are
              ready to serve the world.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 5 — Image Left
            "Deepen Your Yoga Experience"
        ══════════════════════════════════════ */}
        <div
          className={`${styles.section} ${styles.sectionImageLeft}`}
          style={{ borderBottom: "none" }}
        >
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Deepen Your Yoga Experience"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Deepen Your Yoga Experience
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              You've come to the correct place if enrolling in a top-notch{" "}
              <strong className={styles.boldLink}>
                yoga teacher training program in your locality
              </strong>{" "}
              is a top priority. Our{" "}
              <strong className={styles.boldLink}>
                yoga teacher certification in Goa
              </strong>{" "}
              has been helping aspiring yoga practitioners like you become
              successful in their future endeavours. Our all-inclusive training
              will prepare you to become a well-respected{" "}
              <strong className={styles.boldLink}>
                licensed yoga teacher in Goa
              </strong>
              . We will put all our enthusiasm into shaping you as a most
              sought-after professional after we thoroughly understand your
              current abilities and any areas where you may need to grow. More
              than only learning to keep your thoughts in check and your body in
              working order, you will also walk away from our training room
              knowing how to help others do the same.
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
      <div className={styles.a} />
    </div>
  );
};

export default YogaTrainingGoa;

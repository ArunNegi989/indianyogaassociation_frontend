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
const YogaTrainingKolkata: React.FC = () => {
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
            Yoga Teacher Training Course in Kolkata
          </h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Image Left
            "Highly Recommend Yoga school in Kolkata"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&q=80&fit=crop"
              alt="Highly Recommend Yoga school in Kolkata"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Highly Recommend Yoga school in Kolkata
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              It is impossible to stress the importance of making time for
              self-care and paying attention to your body. Isn't it? But yoga is
              a wonderful method to perform both. More is better when it comes
              to yoga, and you'll feel better and advance more with each new
              session you attend at the{" "}
              <strong className={styles.boldLink}>
                Yoga course in Kolkata
              </strong>
              . New to learning yoga and its different poses?
            </p>
            <p className={styles.bodyText}>
              We at the Association for Yoga and Meditation provide top-notch
              yoga classes to every student. Being the provider of the best{" "}
              <strong className={styles.boldLink}>
                yoga teaching course in Kolkata
              </strong>
              , we encourage you to move on if you feel stuck in the beginning.
              Yoga is flexible and so we are. Also when searching for{" "}
              <strong className={styles.boldLink}>
                yoga instructor certification near me
              </strong>{" "}
              we top the list as our experts and teachers are well recognized and
              popular.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Image Right
            "Explore and Experience Yoga with AYM in Kolkata"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Explore and Experience Yoga with AYM in Kolkata"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Explore and Experience Yoga with AYM in Kolkata
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              At the Association for Yoga and Meditation, we are the leading
              provider of{" "}
              <strong className={styles.boldLink}>
                registered yoga teacher training courses in Kolkata
              </strong>
              . We make sure that people acquire the capacity to study the right
              yoga techniques through our unique and best-in-class yoga therapy
              teacher training so that you can impart them to others in their
              professional lives. Our training courses positively impact people
              of all ages since they are well-designed and straightforward
              enough.
            </p>
            <p className={styles.bodyText}>
              Our teachers come with the best yoga teacher certification that
              makes it easy both for students and teachers to maintain a positive
              attitude throughout the journey. Unlike others, once your course is
              complete, we'll provide you with{" "}
              <strong className={styles.boldLink}>
                yoga teacher training certification in Kolkata
              </strong>{" "}
              international yoga certification. You can rest assured knowing that
              you'll be learning all techniques and methods from the best of
              teachers.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — Image Left
            "Affordable Yoga Teacher Training in Kolkata"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Affordable Yoga Teacher Training in Kolkata"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Affordable Yoga Teacher Training in Kolkata
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              When you choose Association for Yoga and Meditation, you get to
              learn about yoga and its every aspect. From teaching you how you
              can help to manage your lifestyle to engaging in meditation to
              adapting new yogic ideas, as the world's top{" "}
              <strong className={styles.boldLink}>
                yoga teacher training in Kolkata
              </strong>
              , we make sure you get deep knowledge in the field of yoga.
            </p>
            <p className={styles.bodyText}>
              We respect honesty and diversity, along with assisting others and
              bringing about positive changes. We genuinely care about
              everyone's well-being, and we want to give you advice and
              instruction so that you can feel better and become a renowned{" "}
              <strong className={styles.boldLink}>
                yoga teacher in Kolkata
              </strong>{" "}
              and worldwide.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — Image Right
            "Get Globally Accepted as the Best Yoga Teacher"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Get Globally Accepted as the Best Yoga Teacher"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Get Globally Accepted as the Best Yoga Teacher
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Holding a reputation for providing the best{" "}
              <strong className={styles.boldLink}>
                yoga training course in Kolkata
              </strong>
              , we ensure everyone is provided with the best quality knowledge.
              We aim to provide you with an experience that will boost your
              passion and help you in the future. Also, we conduct several tests
              to ensure you're well suited for a{" "}
              <strong className={styles.boldLink}>
                licensed yoga teacher training course in Kolkata
              </strong>
              .
            </p>
            <p className={styles.bodyText}>
              We value shaping you as the future of yoga and reaching heights of
              success. Moreover, you can expect to be guided and instructed in
              the best way through our world-class{" "}
              <strong className={styles.boldLink}>
                yoga teacher training program in Kolkata
              </strong>
              . Also, we ensure that when one searches for the best{" "}
              <strong className={styles.boldLink}>
                yoga teacher training course near me
              </strong>
              , you're one of them to top the list.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 5 — Image Left
            "Qualified yoga training in Kolkata India"
        ══════════════════════════════════════ */}
        <div
          className={`${styles.section} ${styles.sectionImageLeft}`}
          style={{ borderBottom: "none" }}
        >
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Qualified yoga training in Kolkata India"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Qualified yoga training in Kolkata India
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              AYM Yoga School is located in Rishikesh and Goa. We are a famous
              yoga and meditation institution in India, specializing in teacher
              training, yoga gurus. We are a non-profit organization that aims
              to teach quality yoga classes to anyone who wants to become a
              qualified yoga instructor. AYM Yoga School also helps you relieve
              emotional problems through yoga therapy retreat. In addition, if
              you are in Kolkata, AYM Yoga School will also fully operate our
              facilities here.
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

export default YogaTrainingKolkata;
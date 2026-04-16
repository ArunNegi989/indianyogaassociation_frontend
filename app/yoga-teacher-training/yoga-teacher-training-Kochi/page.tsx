import React from "react";
import styles from "@/assets/style/yoga-teacher-training/Yogatraining.module.css";
import Link from "next/link";

/* ─────────────────────────────────────────────
   CITY LINKS DATA
───────────────────────────────────────────── */
const cityLinks: { name: string; href: string }[] = [
  {
    name: "Jaipur",
    href: "/yoga-teacher-training/yoga-teacher-training-Jaipur",
  },
  {
    name: "Mysore",
    href: "/yoga-teacher-training/yoga-teacher-training-Mysore",
  },
  {
    name: "Haryana",
    href: "/yoga-teacher-training/yoga-teacher-training-Haryana",
  },
  { name: "Agra", href: "/yoga-teacher-training/yoga-teacher-training-Agra" },
  {
    name: "Mumbai",
    href: "/yoga-teacher-training/yoga-teacher-training-Mumbai",
  },
  {
    name: "Coimbatore",
    href: "/yoga-teacher-training/yoga-teacher-training-Coimbatore",
  },
  {
    name: "Uttrakhand",
    href: "/yoga-teacher-training/yoga-teacher-training-Uttrakhand",
  },
  {
    name: "Varkala",
    href: "/yoga-teacher-training/yoga-teacher-training-Varkala",
  },
  {
    name: "Gokarna",
    href: "/yoga-teacher-training/yoga-teacher-training-Gokarna",
  },
  {
    name: "Tamil Nadu",
    href: "/yoga-teacher-training/yoga-teacher-training-Tamil-Nadu",
  },
  { name: "Goa", href: "/yoga-teacher-training/yoga-teacher-training-Goa" },
  { name: "Kochi", href: "/yoga-teacher-training/yoga-teacher-training-Kochi" },
  {
    name: "Munger",
    href: "/yoga-teacher-training/yoga-teacher-training-Munger",
  },
  {
    name: "Dharamshala",
    href: "/yoga-teacher-training/yoga-teacher-training-Dharamshala",
  },
  {
    name: "Lonavala",
    href: "/yoga-teacher-training/yoga-teacher-training-Lonavala",
  },
  {
    name: "New Delhi",
    href: "/yoga-teacher-training/yoga-teacher-training-New-Delhi",
  },
  {
    name: "Kerala",
    href: "/yoga-teacher-training/yoga-teacher-training-Kerala",
  },
  {
    name: "Puducherry",
    href: "/yoga-teacher-training/yoga-teacher-training-Puducherry",
  },
  {
    name: "Pushkar",
    href: "/yoga-teacher-training/yoga-teacher-training-Pushkar",
  },
  {
    name: "Sikkim",
    href: "/yoga-teacher-training/yoga-teacher-training-Sikkim",
  },
  {
    name: "Gurugram",
    href: "/yoga-teacher-training/yoga-teacher-training-Gurugram",
  },
  { name: "Pune", href: "/yoga-teacher-training/yoga-teacher-training-Pune" },
  {
    name: "Chennai",
    href: "/yoga-teacher-training/yoga-teacher-training-Chennai",
  },
  {
    name: "Varanasi",
    href: "/yoga-teacher-training/yoga-teacher-training-Varanasi",
  },
  {
    name: "Maharashtra",
    href: "/yoga-teacher-training/yoga-teacher-training-Maharashtra",
  },
  {
    name: "Arambol",
    href: "/yoga-teacher-training/yoga-teacher-training-Arambol",
  },
  {
    name: "Thiruvananthapuram",
    href: "/yoga-teacher-training/yoga-teacher-training-Thiruvananthapuram",
  },
  {
    name: "Kolkata",
    href: "/yoga-teacher-training/yoga-teacher-training-Kolkata",
  },
  {
    name: "Rishikesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Rishikesh",
  },
  {
    name: "Himachal Pradesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Himachal-Pradesh-1",
  },
  {
    name: "Himachal Pradesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Himachal-Pradesh-2",
  },
  {
    name: "Bengaluru",
    href: "/yoga-teacher-training/yoga-teacher-training-Bengaluru",
  },
  {
    name: "Auroville",
    href: "/yoga-teacher-training/yoga-teacher-training-Auroville",
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const YogaTrainingKochi: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Top border */}
      <div className={styles.a} />

      <div className={styles.container}>
        {/* ══════════════════════════════════════
            PAGE TITLE
        ══════════════════════════════════════ */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Yoga Teacher Training in Kochi</h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Image Left
            No heading — 2 paragraphs on right
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Yoga Teacher Training in Kochi"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <p className={styles.bodyText}>
              Embark on a transformative journey with our{" "}
              <strong className={styles.boldLink}>
                Yoga Teacher Training (YTT) course in Kochi, India
              </strong>
              . Our comprehensive yoga teacher training program offers a perfect
              blend of traditional and modern yoga practices, providing aspiring
              yoga teachers with the knowledge, skills, and confidence to lead
              their classes.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              Throughout the training, participants will delve into various
              aspects of yoga, including asana, pranayama, meditation, anatomy,
              philosophy, teaching methodology, and more. Our experienced and
              passionate instructors will guide students through an immersive
              learning experience that will foster personal growth and deepen
              their understanding of yoga.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Image Right
            2 paragraphs on left side
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Yoga Teacher Training Program in Kochi"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <p className={styles.bodyText}>
              Located in Kochi, a serene and picturesque city, our training
              centre provides the ideal environment for self-reflection and
              learning. Participants can immerse themselves in India's rich
              culture and spiritual heritage, further enhancing their yoga
              journey.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              Upon completing the program, graduates will receive a Yoga
              Alliance, USA certification, allowing them to teach yoga with
              confidence and credibility worldwide. Whether you want to deepen
              your practice or pursue a career as a yoga instructor, our{" "}
              <strong className={styles.boldLink}>
                yoga teacher training program in Kochi
              </strong>{" "}
              offers a life-changing experience that will inspire and empower
              you.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — Image Left
            "Benefits of yoga course in Kochi" — numbered list
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Benefits of yoga course in Kochi"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Benefits of yoga course in Kochi
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              The yoga course in Kochi offers many benefits, encompassing
              physical, mental, and spiritual well-being. Through the practice
              of yoga, participants can expect the following benefits:
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>1. Physical Fitness:</strong> The course helps improve
              flexibility, strength, and balance, leading to a healthier and
              more resilient body.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>2. Stress Reduction:</strong> Yoga provides effective
              relaxation techniques that help reduce stress and promote calm and
              inner peace.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>3. Mental Clarity:</strong> Through mindfulness and
              meditation, participants can experience improved mental clarity,
              focus, and emotional well-being.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — Image Right
            Continued numbered list (4–6) + overall summary
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Benefits of yoga course in Kochi continued"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <p className={styles.bodyText}>
              <strong>4. Self-Exploration:</strong> The course offers a
              supportive environment for self-exploration and personal growth,
              allowing participants to deepen their understanding of themselves
              and others.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>5. Community and Support:</strong> A yoga course fosters a
              sense of community and provides a supportive network of
              like-minded individuals on a similar journey.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>6. Holistic Health:</strong> Yoga encourages a holistic
              approach to health, addressing physical fitness and mental and
              spiritual well-being.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              Overall, the yoga course in Kochi offers a transformative
              experience beyond physical practice, nurturing a balanced and
              harmonious way of living.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 5 — Image Left
            "Why should I join the yoga course in Kochi?" — numbered list
        ══════════════════════════════════════ */}
        <div
          className={`${styles.section} ${styles.sectionImageLeft}`}
          style={{ borderBottom: "none" }}
        >
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Why should I join the yoga course in Kochi?"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Why should I join the yoga course in Kochi?
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              There are several compelling reasons to join a yoga course in
              Kochi:
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>1. Spiritual Environment:</strong> with its serene and
              spiritual ambience, Kochi provides an ideal setting for immersing
              oneself in yoga and deepening one's spiritual connection.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>2. Experienced Instructors:</strong> The yoga courses in
              Kochi are led by experienced and knowledgeable instructors who can
              guide students on a transformative journey toward physical,
              mental, and spiritual well-being.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>3. Cultural Immersion:</strong> Kochi's rich cultural
              heritage and historical significance offer a unique backdrop for
              practising yoga, allowing participants to experience a deeper
              connection to the tradition and philosophy of yoga.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>4. Relaxing Surroundings:</strong> Kochi's natural beauty
              and tranquil surroundings create a peaceful and rejuvenating
              environment, perfect for self-reflection and personal growth.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              <strong>5. Yoga Alliance Certification:</strong> Completing a yoga
              course in Kochi can lead to a Yoga Alliance certification,
              enabling participants to teach yoga with credibility and
              confidence globally.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "0.75rem" }}>
              Overall, joining a yoga course in Kochi offers an enriching and
              transformative experience. It allows one to deepen one's practice
              and embrace a holistic approach to well-being.
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

export default YogaTrainingKochi;

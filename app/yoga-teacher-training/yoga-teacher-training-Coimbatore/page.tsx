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
const YogaTrainingCoimbatore: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Top border */}
      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ══════════════════════════════════════
            PAGE TITLE
        ══════════════════════════════════════ */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Yoga Teacher Training Course in Coimbatore</h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Image Left
            "Yoga Teacher Training with Experienced Yoga Teachers"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Yoga Teacher Training with Experienced Yoga Teachers"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Yoga Teacher Training with Experienced Yoga Teachers
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              It does not matter if you are a beginner, an intermediate, or an expert. If your
              interest has been drawn towards the world of yoga to help others live a peaceful
              life, then "The Association for Yoga and Meditation" are here to guide you through
              the process. As Coimbatore's top-rated yoga teacher training provider, we help you
              establish core knowledge to assist you in personal and professional growth. Our{" "}
              <strong className={styles.boldLink}>Yoga Teacher Training in Coimbatore</strong> is
              renowned all over, as we have an updated curriculum that focuses on traditional and
              modern ways of performing yoga practices at your convenience.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Image Right
            "Best Yoga and Meditation School in Coimbatore"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Best Yoga and Meditation School in Coimbatore"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Best Yoga and Meditation School in Coimbatore
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              As the leading provider of{" "}
              <strong className={styles.boldLink}>yoga teacher teaching courses in Coimbatore</strong>,
              our training program is well-designed and straightforward enough that it affects the
              lives of people of every age. We ensure that one earns the ability to learn detailed
              yoga skills correctly so they can pass it on to others in their career life. Besides
              that, our yoga teacher in Coimbatore will help you explore the origin of yoga and
              its roots. Through our{" "}
              <strong className={styles.boldLink}>yoga training course in Coimbatore</strong>, you
              will also learn all the techniques, alignment, and adjustments. Once the yoga course
              is completed and your skills are well-furnished, you will gain yoga instructor
              certification through an examination.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — Image Left
            "Best Yoga Teacher Training of Yoga"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Best Yoga Teacher Training of Yoga"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Best Yoga Teacher Training of Yoga
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              The Association for Yoga and Meditation offers international yoga certification
              through extensive courses. A team of knowledgeable and experienced yoga instructors
              will guide you well. Besides encouraging you to obtain yoga therapy teacher training,
              we ensure your talent and motivation live. Having created a positive and peaceful
              ambience, we ensure that every participant is offered one-on-one attention to
              nurturing themselves into true professionals. The core value of our{" "}
              <strong className={styles.boldLink}>yoga teacher training course in Coimbatore</strong>{" "}
              is to shape one and brush up on the skills.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — Image Right
            "Advanced and Extensive Yoga Teacher Training in Coimbatore"
        ══════════════════════════════════════ */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Advanced and Extensive Yoga Teacher Training in Coimbatore"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Advanced and Extensive Yoga Teacher Training in Coimbatore
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              As the most genuine{" "}
              <strong className={styles.boldLink}>licensed yoga teacher training course in Coimbatore</strong>,
              we focus on offering advanced courses to attendees who want to build a career in
              yoga. Our curriculum is highly advanced and completely updated, and we educate about
              the latest research on Yoga therapy. All the teachers help you dig deeper to adapt
              profound knowledge in yoga besides knowing how to transform life for the better. Our{" "}
              <strong className={styles.boldLink}>registered yoga teacher training course in Coimbatore</strong>{" "}
              is for people of all ages and gender. It does not matter how much you know about
              yoga. Before offering the yoga teacher training certification, we will enlighten you
              with every bit of it.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 5 — Image Left
            "Endure the Positive and Peaceful Way of Life"
        ══════════════════════════════════════ */}
        <div
          className={`${styles.section} ${styles.sectionImageLeft}`}
          style={{ borderBottom: "none" }}
        >
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Endure the Positive and Peaceful Way of Life"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Endure the Positive and Peaceful Way of Life
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Our yoga teacher training program believes in making you fit first before you train
              others. And through yoga, we have been able to spread knowledge to others. Once the
              course is done, the upcoming yoga instructors will receive a precious{" "}
              <strong className={styles.boldLink}>yoga teacher training certification in Coimbatore</strong>{" "}
              that is well-accepted everywhere in the world. As yoga helps one walk on the path of
              peace, calmness, and tranquillity, we look forward to eagerly witnessing its spread
              through our students.
            </p>
            <p className={styles.bodyText} style={{ marginTop: "1rem" }}>
              We look forward to a happy, healthy world where everyone is at peace.
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

export default YogaTrainingCoimbatore;
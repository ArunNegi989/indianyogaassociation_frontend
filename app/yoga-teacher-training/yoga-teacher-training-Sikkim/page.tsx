import React from "react";
import styles from "@/assets/style/yoga-teacher-training/Yogatraining.module.css";
import Link from "next/link";

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

const YogaTrainingSikkim: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.topBorder} />
      <div className={styles.container}>

        {/* PAGE TITLE */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Recognized Yoga Teacher Training Course in Sikkim</h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* SECTION 1 — Image Left */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Explore the Roots of Yoga with AYM"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Explore the Roots of Yoga with AYM
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              If you understand the importance of yoga and want to spread it to others, then the
              best thing you can do is make it your career. We at the "Association for Yoga and
              Meditation" can help you travel back to the roots where yoga originated.
              Additionally, as the top{" "}
              <strong className={styles.boldLink}>yoga teacher training in Sikkim</strong>, we
              can help you learn about both ancient and contemporary yoga practices.
            </p>
          </div>
        </div>

        {/* SECTION 2 — Image Right */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Advanced Yoga Teacher Training Course in Sikkim"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Advanced Yoga Teacher Training Course in Sikkim
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              When enrolling in a yoga teacher training course near me, you will discover our
              name at the top of the list. We allow you to develop your teaching skills while
              gaining a strong foundation in the ancient yogic tradition. Other than that, we
              assist you in strengthening your spiritual bond with yoga through our yoga teacher
              training in Sikkim. Our highly qualified, committed, and experienced teachers will
              support and guide you throughout our{" "}
              <strong className={styles.boldLink}>registered yoga teacher training course in Sikkim</strong>.
              In their presence, you will also get to understand and explore yourself and your
              capabilities.
            </p>
          </div>
        </div>

        {/* SECTION 3 — Image Left */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Brush Up Your Skills to Teach Yoga Through Our Extensive Course Program"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Brush Up Your Skills to Teach Yoga Through Our Extensive Course Program
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Our accredited yoga teaching course in Sikkim has established a solid reputation.
              We create a dynamic and serene environment to ensure you are surrounded by good
              energy during the{" "}
              <strong className={styles.boldLink}>licensed yoga teacher training course in Sikkim</strong>.
              You can communicate directly with the masters and get your questions answered during
              the yoga teacher course in Sikkim. In addition to practical instruction, in-depth
              theoretical information is included in our well-designed and comprehensive
              curriculum of yoga therapy teacher training.
            </p>
          </div>
        </div>

        {/* SECTION 4 — Image Right */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Transform Into a Licensed Yoga Teacher By Choosing Us"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Transform Into a Licensed Yoga Teacher By Choosing Us
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              You can confidently choose our yoga training course in Sikkim, knowing we will
              ensure you understand every little aspect. Regardless of your prior experience,
              we believe in teaching you from scratch so that you fully understand even the most
              minute details of yoga. Before teaching others, we, as the best{" "}
              <strong className={styles.boldLink}>yoga teacher training program in Sikkim</strong>,
              make sure that you get in shape and are flexible. We help you prepare for the real
              world and behave professionally before you receive yoga teacher certification. With
              us, you may develop into a real professional without putting too much pressure on
              yourself.
            </p>
          </div>
        </div>

        {/* SECTION 5 — Image Left */}
        <div
          className={`${styles.section} ${styles.sectionImageLeft}`}
          style={{ borderBottom: "none" }}
        >
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Learn and Educate Others A Peaceful Way of Life"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Learn and Educate Others A Peaceful Way of Life
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              You will build a strong foundation of discipline before receiving the yoga
              instructor certification near me. Our course encourages physical, mental,
              emotional, and spiritual growth from which you can naturally and confidently train
              others. Our course curriculum aims to develop excellent yoga teachers and provide
              them with{" "}
              <strong className={styles.boldLink}>YTT certification in Sikkim</strong>. No matter
              where you are, our international yoga certification is highly valuable everywhere.
              By deciding on us, you build a foundation of tranquillity and peace at a genuinely
              reasonable price.
            </p>
          </div>
        </div>

        {/* CITY LINKS */}
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
      <div className={styles.topBorder} />
    </div>
  );
};

export default YogaTrainingSikkim;
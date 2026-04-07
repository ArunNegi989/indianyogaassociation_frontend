import React from "react";
import styles from "@/assets/style/yoga-teacher-training/Yogatraining.module.css";
import Link from "next/link";

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

const YogaTrainingGurugram: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.topBorder} />
      <div className={styles.container}>
        {/* PAGE TITLE */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            Best Yoga Teacher Training in Gurugram
          </h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* SECTION 1 — Image Left */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Inculcating The Therapeutic Properties of Yoga in Gurugram"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Inculcating The Therapeutic Properties of Yoga in Gurugram
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Have you encountered the word yoga therapy and wondered why it is
              called therapy? After all, for many, yoga is just a form of
              exercise. Is that suitable? But at the same time, it is also very
              crucial to understand that one of the most essential components of
              yoga is that it is distressing and, at the same time, eventually
              an essential component for feeling relaxed. But to ensure that
              you, as students, feel the best, your instructor's proper training
              is crucial. This is where we come into the scene. If you are
              looking for the best{" "}
              <strong className={styles.boldLink}>
                Yoga teacher training in Gurugram
              </strong>
              , then worry no more because we have developed our professional
              training course, which will guide you with the best exposure as a
              yoga trainer.
            </p>
          </div>
        </div>

        {/* SECTION 2 — Image Right */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Yoga For the Healthy Soul and Body"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Yoga For the Healthy Soul and Body
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              If you are someone who often thinks that yoga is just for the body
              and a type of exercise, you are probably mistaken. One of the most
              promising factors about yoga is that it is known to be for the
              soul and body, and here, you try to feel the power of a firm
              being. There are a lot of yoga poses where you need to have a
              powerful mind, without which you will not be able to get the
              proper posture under any circumstances. To ensure that you have
              the proper guidance as an instructor and that your students
              eventually get the proper training, the Association for Yoga and
              Meditation is here with a comprehensive{" "}
              <strong className={styles.boldLink}>
                yoga teaching course in Gurugram
              </strong>
              . Don't hesitate to contact us and book your slots today.
            </p>
          </div>
        </div>

        {/* SECTION 3 — Image Left */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Most Promising Yoga Teacher Training Course in Gurugram"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Most Promising Yoga Teacher Training Course in Gurugram
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Gurugram is a city of enthusiasts; hence, people have a lot of
              interest and zeal to learn more. However, one of the most noted
              problems is that there needs to be more exposure for those who
              eventually want to take up yoga as a professional career and teach
              students. Because of this respect, we have designed a globally
              acclaimed{" "}
              <strong className={styles.boldLink}>
                yoga teacher training program in Gurugram
              </strong>
              , which is exceptionally well-structured. Along with the basics,
              we will also focus on the different schools of yoga. Yoga is a
              broad field; consequently, different schools follow different
              ideals. As an instructor, getting the right kind of exposure to
              all these different methods is necessary, and that is precisely
              what we have been doing so far.
            </p>
          </div>
        </div>

        {/* SECTION 4 — Image Right */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Registered Yoga Teacher Training Course in Gurugram"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Registered Yoga Teacher Training Course in Gurugram
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Regarding professional options for registered yoga teacher
              training courses in Gurugram, sadly, there are not many options.
              However, at the same time, the popularity and impact of yoga are
              such that many people want to take up the discipline
              professionally. For this reason, giving them exposure in the field
              is equally crucial. We have designed the{" "}
              <strong className={styles.boldLink}>
                licensed yoga teacher training course in Gurugram
              </strong>{" "}
              so that along with the theoretical knowledge, you are given
              optimum practical exposure for a better understanding of the
              subject and a promising consolidation towards a successful career.
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
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Affordable Choice for Yoga Teacher Training in Gurugram"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Affordable Choice for Yoga Teacher Training in Gurugram
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              We understand that, as students, it can sometimes be challenging
              to afford a YTT certification in Gurugram, which is priced
              exorbitantly. However, at the same time, before you start teaching
              anyone, it is crucial that you get registration and have your own
              license because, just as mentioned, yoga is nothing less than
              therapy. Hence, at AYM, we have carefully crafted the course to be
              affordable for all our students. Yet, they can get a globally
              accredited{" "}
              <strong className={styles.boldLink}>
                certification as a yoga instructor
              </strong>
              , which can kickstart their career in the mystic field of yoga.
              Always keep in mind that as a yoga instructor, you are teaching
              people how to excel in the correct poses and inculcating a way of
              life.
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

export default YogaTrainingGurugram;

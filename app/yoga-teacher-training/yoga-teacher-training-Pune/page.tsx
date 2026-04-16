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

const YogaTrainingPune: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.a} />
      <div className={styles.container}>
        {/* PAGE TITLE */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            Professional Yoga Teacher Training in Pune
          </h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* SECTION 1 — Image Left */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="Yoga Teacher Training in Pune with Certification"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Yoga Teacher Training in Pune with Certification
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              We strongly believe that yoga is no longer just a form of exercise
              you must master before you can start teaching students. As a yoga
              instructor, it is essential to measure that you have absorbed the
              yogic requirements and eventually started with the practice to
              teach your students the correct values. One such important course
              that we are going to help you with is none other than the{" "}
              <strong className={styles.boldLink}>
                yoga teacher training at Pune
              </strong>
              . It is a comprehensive program to get you started with the base
              and the advanced sectors, which is crucial for taking care of
              since its inception. Contact us at the Association For Yoga and
              Meditation and sign up for Pune's professional yoga teaching
              course today!
            </p>
          </div>
        </div>

        {/* SECTION 2 — Image Right */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Certification yoga teacher training course in Pune"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Certification Yoga Teacher Training Course in Pune
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              If you want to start your journey as a professional yoga teacher,
              one of the essential things you need to remember is that yoga is
              not in a single school, and there are different ways to perform
              the same. As an instructor or teacher, you always have to make
              sure you have a firm idea about each domain and then eventually
              select your specifications based on the same. We have ensured that
              our{" "}
              <strong className={styles.boldLink}>
                yoga therapy teacher training course
              </strong>{" "}
              is carefully crafted so that you have complete guidance. Not only
              that, once you are done with the training modules and have passed
              each of them with succession, you will also be accorded a
              certification, which is mandatory in a professional field like
              yoga. After all, everyone cannot choose to become a teacher.
            </p>
          </div>
        </div>

        {/* SECTION 3 — Image Left */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="One-on-One Interaction With Best Yoga Professionals In Pune"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              One-on-One Interaction With Best Yoga Professionals In Pune
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              One of the critical factors about Pune as a city is that it is
              incredibly fast-paced, so you need more time to sit back and
              relax. In such a frantic situation, it is wise to make sure that
              you do something that makes you feel good and keeps you motivated
              and focused as well. There is nothing better than yoga for your
              body and mind's peace; hence, the demand for a licensed instructor
              in Pune is entirely innate. Our course has been formulated so that
              our students can get in touch with the best experts and gather
              both knowledge and experience from them. The{" "}
              <strong className={styles.boldLink}>
                yoga teacher training program in Pune
              </strong>{" "}
              we designed ensures that each of the students who come on board,
              irrespective of whether they want to become instructors or not,
              are given the most prominent exposure to the yogic gurus.
            </p>
          </div>
        </div>

        {/* SECTION 4 — Image Right */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Get The Best Knowledge and Facilities With Modern Amenities"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Get The Best Knowledge and Facilities With Modern Amenities
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              People believe that yoga is all about using just the body weight.
              Although it is valid to a certain extent, you need to have some
              extra accessories as well, which will help you in the process, and
              we have access to the same in the studio. We have been acclaimed
              globally as one of the top options whenever you search for a{" "}
              <strong className={styles.boldLink}>
                yoga teacher training course near me
              </strong>
              , and that is also because of the resources we have made available
              over time. Exposure to such excellent resources guarantees that
              you can learn in every aspect. Here, the profound focus
              automatically enriches your experience. No matter the requirement,
              the Association for Yoga and Meditation has successfully included
              that in the curriculum.
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
              alt="Affordable Prices With Global Exposure As an Instructor"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Affordable Prices With Global Exposure As an Instructor
            </h2>
            <div
              className={styles.headingUnderline}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              A common myth says that if you are pursuing a Yoga teacher
              training certification in Pune, you need an international yoga
              teacher training certification, which can eventually deter you
              from setting up a career abroad. However, we have ensured that our
              certification helps you gain global recognition. You will
              eventually be able to set up global precedence. Moreover, we have
              kept the prices extremely affordable so that no matter your
              economic affiliation, you do not have any problem when you want to
              be a{" "}
              <strong className={styles.boldLink}>
                registered Yoga instructor in Pune
              </strong>
              .
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
      <div className={styles.a} />
    </div>
  );
};

export default YogaTrainingPune;

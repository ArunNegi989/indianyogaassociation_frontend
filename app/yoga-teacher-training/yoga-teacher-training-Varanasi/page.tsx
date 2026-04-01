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

const YogaTrainingVaranasi: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.topBorder} />
      <div className={styles.container}>

        {/* PAGE TITLE */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Certified Yoga Teacher Training in Varanasi</h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* SECTION 1 — Image Left */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop"
              alt="Get Started With Your Career As A Yoga Teacher in Varanasi"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Get Started With Your Career As A Yoga Teacher in Varanasi
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              The Association for Yoga and Meditation's inception was to ensure that all the
              individuals who want to set up a professional career for themselves as yoga
              instructors get the best exposure. Hence with the same concept in mind, we have
              designed the Yoga training course in such a way that you are able to have different
              perspectives and start your career as a yogic master who has innate knowledge to
              impart. An essential thing that you need to keep in mind as an instructor is that
              yoga is not only about being able to bend your body in different ways. It is about
              your mental and physical peace. You have to come to a state where you are able to
              be fit physically as well as mentally to be the{" "}
              <strong className={styles.boldLink}>yoga instructor</strong> that students need.
            </p>
          </div>
        </div>

        {/* SECTION 2 — Image Right */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop"
              alt="AYM Brings You The Best Resources and Complete Guidance For Your Career"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              AYM Brings You The Best Resources and Complete Guidance For Your Career
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              We understand that in a city like Varanasi, people really do not have much idea
              about how yoga is going to impact their health in the longer run. Hence, one of
              the major factors we have focused on in the{" "}
              <strong className={styles.boldLink}>yoga teacher training course in Varanasi</strong>{" "}
              is that we help you have a better understanding of what your opportunities are as
              a yoga instructor. Our course's fundamental objective is that people inclined to
              have a professional approach in the field should be given enough exposure.
              Essentially the Association for Yoga and Meditation helps you achieve that. All
              you need to do is sign up for our registered yoga teacher training course in
              Varanasi, and our experts will help you with precise guidance.
            </p>
          </div>
        </div>

        {/* SECTION 3 — Image Left */}
        <div className={`${styles.section} ${styles.sectionImageLeft}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop"
              alt="Yoga and Meditation School in Varanasi"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Yoga and Meditation School in Varanasi
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Both yoga and meditation go hand in hand, which makes us believe that understanding
              the right method for both of them is mandatory. Meditation also has the right
              process which requires quite some time to master. We have incorporated a system
              where the entire structure is based on the gurukul environment, and it automatically
              helps our students as well to stay in such a dimension and slowly master their bit
              of knowledge. We duly believe that not only the basics but the students who are
              enrolled with us at AYM also need to have a better understanding of the advanced
              sectors as well to develop their craft slowly. To make sure that you have been
              able to focus enough on each of the sectors and learn from it, you require passing
              every sector for a better{" "}
              <strong className={styles.boldLink}>consolidation</strong>.
            </p>
          </div>
        </div>

        {/* SECTION 4 — Image Right */}
        <div className={`${styles.section} ${styles.sectionImageRight}`}>
          <div className={styles.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop"
              alt="Get Licensed as A Yoga Teacher - Be an Acclaimed Instructor Globally"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Get Licensed as A Yoga Teacher - Be an Acclaimed Instructor Globally
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              The{" "}
              <strong className={styles.boldLink}>YTT certification course in Varanasi</strong>{" "}
              that we have got accords you with certification once you are done with the
              successful completion. One of the major perks of this certification is that it
              allows you to start with your career and you can choose to train students under
              you as well. You might have often seen that we consider Yoga as therapy and hence
              the therapist needs to be professionally trained as well. The course that we have
              framed is a yoga therapy teacher training course that trains you in the right way
              and helps you to start your career as an instructor. After all, would you ever
              choose to learn something like yoga from anyone who is not certified or licensed?
              The same question will come up to anyone's mind before joining your course. So
              you'll definitely need a certification that is globally accredited.
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
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop"
              alt="Quality Yoga Training Session With Pocket-Friendly Prices"
              className={styles.sectionImg}
              loading="lazy"
            />
          </div>
          <div className={styles.textWrap}>
            <h2 className={styles.headingSerif} style={{ textAlign: "center" }}>
              Quality Yoga Training Session With Pocket-Friendly Prices
            </h2>
            <div className={styles.headingUnderline} style={{ display: "flex", justifyContent: "center" }}>
              <div className={styles.headingUnderlineLine} />
            </div>
            <p className={styles.bodyText}>
              Contrary to the popular view, getting certified and being a yoga instructor does
              not cost you much money. At AYM, we focus on offering the ultimate exposure that
              you get as a professional that does not burn a hole in your pocket. It is because
              of these reasons our{" "}
              <strong className={styles.boldLink}>yoga teacher training program in Varanasi</strong>{" "}
              is designed at pocket-friendly rates. By just making a small investment, you will
              be able to get trained under a professional yoga teaching course in Jaipur, which
              gives your career the kickstart it deserves.
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

export default YogaTrainingVaranasi;
import React from "react";
import styles from "../../assets/style/Home/Homeaboutsection.module.css";

const stats = [
  { value: "2005", label: "Est. Year" },
  { value: "100K+", label: "Certified Teachers" },
  { value: "50+", label: "Countries" },
  { value: "20+", label: "Years Experience" },
];

const yogaStyles = [
  "Hatha Yoga",
  "Ashtanga Yoga",
  "Kundalini Yoga",
  "Vinyasa Flow",
  "Yin Yoga",
  "Pranayama",
];

export const HomeaboutSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.topBorder} />
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.superTitle}>
            Yoga Teacher Training in Rishikesh
          </p>
          <h2 className={styles.mainTitle}>
            Get Certified From the Oldest Yoga Teacher Training School in
            Rishikesh, India
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
        </div>
        <div className={styles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.body}>
          <div className={styles.bodyLeft}>
            <p className={styles.para}>
              Rishikesh, known globally as the{" "}
              <strong className={styles.highlight}>
                "Yoga Capital of the World,"
              </strong>{" "}
              is a sacred destination for yoga, meditation, and spiritual
              growth. Nestled in the Himalayan foothills along the holy Ganges
              River, it has been a spiritual hub for sages and seekers for
              centuries.
            </p>

            <p className={styles.para}>
              AYM Yoga School — one of the most respected and{" "}
              <strong className={styles.highlight}>
                oldest yoga teacher training institutes in Rishikesh
              </strong>
              .{" "}
              <strong className={styles.highlight}>
                Established in 2005 by Yogi Chetan Mahesh
              </strong>
              , a globally renowned yoga master, AYM has become a leading
              destination for authentic and affordable Yoga Teacher Training
              Courses (YTTC) in India.
            </p>

            <p className={styles.para}>
              With decades of experience, Yogi Chetan Mahesh founded AYM with a
              powerful vision — to train and certify{" "}
              <strong className={styles.highlight}>
                100,000+ yoga teachers internationally
              </strong>
              , promoting the true essence of yoga from India to the world.
            </p>
            <div className={styles.accreditations}>
              <span className={styles.accBadge}>
                🏅 Yoga Alliance USA — RYS 200 & 300
              </span>
              <span className={styles.accBadge}>
                🏛️ YCB — Ministry of AYUSH, Govt. of India
              </span>
            </div>
          </div>
          <div className={styles.bodyRight}>
            <blockquote className={styles.quote}>
              <span className={styles.quoteMarks}>"</span>
              Deepen Your Practice with Certified Yoga Teacher Training in
              Rishikesh, India
              <span className={styles.quoteMarks}>"</span>
            </blockquote>
            <p className={styles.para}>
              AYM Yoga School offers authentic, in-depth Yoga Teacher Training
              Courses for yoga enthusiasts, aspiring teachers, and wellness
              seekers from around the world. Our school is{" "}
              <strong className={styles.highlight}>
                internationally accredited
              </strong>{" "}
              by Yoga Alliance USA and the Yoga Certification Board (YCB),
              Ministry of AYUSH, Government of India — making AYM the{" "}
              <em>only</em> yoga school in Rishikesh with both international and
              Indian government recognition.
            </p>
            <div className={styles.stylesBlock}>
              <h4 className={styles.stylesTitle}>Multi-Style Yoga Courses</h4>
              <div className={styles.stylesGrid}>
                {yogaStyles.map((style) => (
                  <span key={style} className={styles.styleChip}>
                    {style}
                  </span>
                ))}
              </div>
            </div>
            <p className={styles.paraSmall}>
              Our curriculum covers physical postures (asanas), meditation,
              mindfulness, breathwork (pranayama), yoga philosophy, and
              self-awareness — ensuring a well-rounded and transformative yoga
              education.
            </p>
          </div>
        </div>
        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>
            List of different amazing life-changing and professional yoga
            courses at <strong>AYM Yoga School</strong>
          </p>
          <a href="/yoga-teacher-training" className={styles.ctaBtn}>
            Explore All Courses <span className={styles.ctaArrow}>→</span>
          </a>
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </section>
  );
};

export default HomeaboutSection;

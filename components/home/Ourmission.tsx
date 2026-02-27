import styles from "../../assets/style/Home/Ourmission.module.css";

export default function OurMission() {
  return (
    <section
      className={styles.missionSection}
      aria-labelledby="mission-heading"
    >
      <div className={styles.bgLotus} aria-hidden="true">
        ❋
      </div>
      <div className={styles.bgCornerTL} aria-hidden="true" />
      <div className={styles.bgCornerBR} aria-hidden="true" />
      <div className={styles.outerFrame}>
        <div className={styles.innerFrame}>
          <div className={styles.missionBlock}>
            <h2 id="mission-heading" className={styles.missionHeading}>
              Our Mission
            </h2>
            <div className={styles.headingRule} aria-hidden="true" />
            <p className={styles.seoTagline}>
              Yoga Teacher Training in Rishikesh India
            </p>
            <div className={styles.missionBody}>
              <p className={styles.para}>
                The practice of yoga extends far beyond the exercises; it's a
                mindful way of life. As yoga practitioners and advocates, we
                want to teach this to everyone and help them attain
                self-fulfilment. With our comprehensive yoga teacher training
                courses, we aim to introduce every budding yogi to the inner
                well-being attained through Yoga. We help students become
                certified yoga teachers in India.
              </p>
              <p className={styles.para}>
                Enhance your yoga journey paired with the spiritual vibe of
                Rishikesh, and watch the magic unwind yourself.
              </p>
            </div>
          </div>
          <div className={styles.ornamentRow} aria-hidden="true">
            <span className={styles.ornamentLine} />
            <span className={styles.ornamentSymbol}>✦ ॐ ✦</span>
            <span className={styles.ornamentLine} />
          </div>
          <div className={styles.whyBlock}>
            <h3 className={styles.whyHeading}>
              Why Yoga Teacher Training is for Everyone?
            </h3>
            <div className={styles.headingRule} aria-hidden="true" />
            <div className={styles.whyBody}>
              <p className={styles.para}>
                <strong className={styles.leadBold}>
                  What does the Journey Entail?
                </strong>{" "}
                Whether you are a student looking for clarity, a homemaker
                seeking balance or a professional longing to destress, YTTC is a
                way forward to return home — to you, yourself, where you truly
                belong. It is not mandatory that you become a teacher, but it
                surely prepares you to be a better human being, enabling you to
                handle your life well wherever you are placed. Unmindful of your
                age, gender, colour, caste, country, culture or career. Yoga is
                a universal learning that teaches you the art of living. To
                quote the Bhagavad Gita, "Yogastha kuru karmani" means perform
                your actions established in Yoga. Yoga, at its core, is the
                science of the union of body, breath, and being. When you begin
                doing Yoga, there comes a point when just doing Yoga is not
                enough; it ignites a deep, silent spark inside you — a whisper
                within — asking you to live Yoga. That is where the YTTC steps
                in, the best ever gift that you can give yourself because the
                training, particularly if taken in person, teaches you exactly
                that — how to think, act and move with awareness, breathe with
                grace and mindfulness, both on and off the mat. Yes, Yoga is a
                journey beyond the mat which every seeker needs to undertake and
                doing YTTC is an easy conduit to this journey.
              </p>
              <p className={styles.para}>
                It's Not About Poses — It's About Presence. In every Yoga
                journey, there comes a moment when the focus shifts from the
                external to internal, from the body to the mind, from perfecting
                a pose to perfecting presence — the complete alignment of body,
                breath and mind. Thus, YTT becomes a sacred bridge between the
                physical and the philosophical. As the days unfold, you discover
                that the greatest guru (teacher) is not the instructor, but the
                silence within. The training gently awakens the dormant layers
                of awareness. You begin to make sense of the choreography
                between the breath and consciousness — the Prana and the Chitta.
                Each asana becomes a prayer, each breath a mantra and every
                silence a mirror reflecting who you truly are. The course is
                more about 'learning to be' than about 'learning to teach'. In
                the silence between inhalation and exhalation, you find your own
                voice — quiet and unwavering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

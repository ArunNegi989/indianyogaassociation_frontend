import React from "react";
import styles from "../../assets/style/Home/Aymfullpage.module.css";
import yogaoutdoor from "../../assets/images/yoga-ttc-classes-outdoor.webp";
import yogaBodyPlanes from "../../assets/images/Alignment-and-Adjustment.jpg";

const campusFacilities = [
  {
    bold: "Location:",
    text: "Our campus is a spacious blend of natural beauty and airy buildings, creating a quiet and contemplative atmosphere. The AYM campus is one of the most lush campuses among Yoga TTC schools in Rishikesh. The spacious and vast gardens maintain a peaceful ambience to learn, relax, and rejuvenate in the lap of nature. Our yoga TTC ashram in Rishikesh spans 50,000 square feet of land in the heart of Rishikesh, complemented by the distant sound of mantras being chanted from the main hall. Our Authentic Yoga Ashram in Rishikesh is located in Upper Tapovan.",
  },
  {
    bold: "AYM Buildings/Wings:",
    text: "We have a total of six wings, each with 20 to 25 rooms, as well as yoga studios, a library, an Ayurveda spa centre, and a swimming pool. Each is built in such a way that it gets plenty of fresh air and sunlight.",
  },
  {
    bold: "AYM Accommodation:",
    text: "We have a variety of accommodations at our Transformative Yoga teacher training centre in Rishikesh. Like the Luxury room, a private deluxe air-conditioned room, deluxe double room, a twin-sharing room, a dormitory for boys, and a dormitory for girls. All rooms feature windows for natural light and fresh air.",
  },
  {
    bold: "AYM Garden:",
    text: "At the centre of our campus, we have a beautiful garden with lush greenery, featuring large mango and avocado trees, as well as swinging chairs. Sunlight dappled through the broad leaves of the mango tree, and the flower beds overflowed with vibrant colours.",
  },
  {
    bold: "AYM Yoga studios:",
    text: "Our campus has 10 Yoga halls designed to help you leave the outside world behind. Soft, wooden flooring and sun-drenched, large windows fill the space with natural light, creating a calm atmosphere perfect for yoga practice.",
  },
  {
    bold: "AYM Dining space and cuisine:",
    text: "Our dining hall is a peaceful space where mindful eating and nourishing, simple meals are served. We emphasize providing sattvic, healthy, Indian vegetarian, locally sourced meals that support yoga practice.",
  },
  {
    bold: "AYM Central Temple or Agnihotra shala:",
    text: "Agnihotra shala is a space for performing the Vedic healing ritual, which purifies the atmosphere and promotes physical, mental, and spiritual well-being. In this space, we burn fire using herbal medicine, sandalwood, and chant positive Mantras.",
  },
  {
    bold: "Swimming pool:",
    text: "A small pool in open air and in sunlight, designed for the Healing properties of water and being used for water yoga, pregnancy yoga, teacher training classes, water breathing exercise and contemplation.",
  },
  {
    bold: "AYM Ayurveda centre:",
    text: "You can step away from every tension into a world of relaxation, rejuvenation, and natural healing at AYM Ayurveda Center in Rishikesh India. Our campus also offers combined yoga and ayurveda teacher training courses in Rishikesh.",
  },
  {
    bold: "Sound / Reiki healing studios:",
    text: "We have three sound healing studios, a haven of peace featuring soothing light and many sound healers from the Himalayas.",
  },
  {
    bold: "A yoga library:",
    text: "The space is a blend of traditional and modern ambience. Having books on yoga philosophy, ayurveda, computers, and high-speed internet.",
  },
  {
    bold: "The atmosphere of AYM Yoga School in Rishikesh:",
    text: "The vibe of the Aym campus is full of spiritual energy, with a community of residential yoga teacher training certification students, long-stay students who indulge in self-practice of yoga, and yoga volunteers, as well as individuals pursuing Ayurveda courses and treatments, or hoteliers. The campus is peaceful, with the soft sound of nature, sparrows, and a modern community, all set against a fresh mountain breeze and sunlight.",
  },
];

const bodyPlanes = [
  "Sagittal (Longitudinal) plane.",
  "Coronal (frontal) plane.",
  "Transverse (Axial) plane.",
];

export const AYMFullPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <section className={styles.alignSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2 className={styles.sectionTitle}>
              Yoga Alliance's Alignment and Adjustment Certification course in
              India, at AYM
            </h2>
            <div className={styles.titleUnderline} />
          </div>

          <p className={styles.salutation}>Nameste! yogis</p>

          <p className={styles.para}>
            I was thinking of addressing this significant topic with you. There
            are numerous Yoga schools, colleges, institutes, and ashrams
            worldwide that offer Yoga certifications, diplomas, and degrees;
            however, how many of them incorporate the art of alignment and
            adjustment into their course curriculum? In Rishikesh, there are
            very few, almost none, except at our school.
          </p>

          <p className={styles.para}>
            There are very few experts in the universe who are the complete
            masters of the alignment and adjustment of asana or postures. There
            are three planes of the body that yoga experts frequently use in
            teaching yoga postures and describing how the body moves during
            entry into asanas or while holding asanas. For example, when
            practicing the triangle pose, students often move to the wrong plane
            because they lack anatomical knowledge about the body's planes.
          </p>

          <p className={styles.para}>
            By knowing the different body planes correctly, you can use this
            knowledge in designing your yoga lesson planning to ensure you're
            moving and strengthening your body in all the correct directions. A
            proper understanding of the three different planes of the body helps
            you comprehend the body in various asanas, and it brings better
            flexibility as the body is stretched in the correct direction of
            movement.
          </p>

          <div className={styles.planesGrid}>
            <div className={styles.planesImageBlock}>
              <div className={styles.planesImagePlaceholder}>
                <div className={styles.diagramBox}>
                  <img
                    src={yogaBodyPlanes.src}
                    alt="Yoga body planes diagram - Sagittal, Coronal and Transverse planes"
                    className={styles.diagramImage}
                  />
                  <div className={styles.diagramLabelsRow}>
                    <div className={styles.diagramLabel}>Sagittal plane</div>
                    <div className={styles.diagramLabel}>Coronal plane</div>
                    <div className={styles.diagramLabel}>Transverse plane</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.planesInfoBlock}>
              <p className={styles.para}>
                The three planes of movement in different postures of Yoga, and
                a Yoga teacher should have deep knowledge of them: the names
                are:
              </p>
              <ol className={styles.planesList}>
                {bodyPlanes.map((plane, i) => (
                  <li key={i} className={styles.planesListItem}>
                    {plane}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p className={styles.para}>
            According to Yogi Chetan Mahesh, every Yoga student or Yoga teacher
            trainer should master all exercises, such as flexion, extension,
            dorsiflexion, abduction, and adduction, among others, during asana
            practice. While searching for your Yoga training school, You should
            search for{" "}
            <strong className={styles.highlight}>
              200 Hour Yoga TTC in Rishikesh with Alignment Focus
            </strong>{" "}
            or{" "}
            <strong className={styles.highlight}>
              Advanced Yoga Teacher Training with Alignment in Rishikesh.
            </strong>
          </p>

          {/* Group yoga photo — Local Image */}
          <div className={styles.groupPhotoBlock}>
            <div className={styles.groupPhotoBanner}>
              <img
                src={yogaoutdoor.src}
                alt="Outdoor Yoga Practice by the Ganges, Rishikesh"
                className={styles.groupPhotoImg}
              />
              <div className={styles.groupPhotoOverlay}>
                <span className={styles.groupPhotoText}>
                  🌊 Outdoor Yoga Practice by the Ganges, Rishikesh
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.campusSection}>
        <div className={styles.topBorder} />
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <h2 className={styles.sectionTitle}>
              Campus: AYM Yoga school / Yoga ashram in Rishikesh
            </h2>
            <div className={styles.titleUnderline} />
          </div>

          <div className={styles.facilitiesList}>
            {campusFacilities.map((f, i) => (
              <div key={i} className={styles.facilityItem}>
                <div className={styles.facilityHeader}>
                  <span className={styles.facilityDot}>✦</span>
                  <strong className={styles.facilityBold}>{f.bold}</strong>
                </div>
                <p className={styles.facilityText}>{f.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.promoCards}>
            <div className={styles.promoCard}>
              <h3 className={styles.promoTitle}>Yoga for Beginners at AYM</h3>
              <div className={styles.promoUnderline} />
              <p className={styles.promoText}>
                New to Yoga? Join our short yet intensive 1 and 2-week-long yoga
                training programs in Rishikesh. Get acquainted with the yoga
                philosophy and learn Hatha yoga, Yoga Nidra and meditation.
              </p>
              <a href="#" className={styles.promoLink}>
                More information beginner course →
              </a>
            </div>
            <div className={styles.promoCard}>
              <h3 className={styles.promoTitle}>
                Yoga in India Compared to Yoga Around the World
              </h3>
              <div className={styles.promoUnderline} />
              <p className={styles.promoText}>
                India is the birthplace of Yoga, which proves the potential to
                learn and master the art from trained yogis within the country.
                The authenticity of yogic practices in India is strongly
                reflected in our yoga TTC in India. Laced with traditional
                Indian culture and traditions, mastering the mudras of ancient
                art here promises a holistic and affordable alternative. In a
                place where the spiritual aura imbibes so well, learning
                Rishikesh yoga is starkly different from taking your yoga
                training anywhere else in the world.
              </p>
              <a href="#" className={styles.promoLink}>
                More Information Compared to Yoga →
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottomBorder} />
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaHeading}>
            Begin Your Journey to Inner Peace
          </h2>
          <p className={styles.ctaSubtext}>
            Transform your mind, body, and spirit with our expert-led yoga
            classes. Connect with us now to start your personalized yoga
            experience.
          </p>
          <a href="https://wa.me/918476898395" className={styles.whatsappBtn}>
            <span className={styles.waIcon}>💬</span> Chat with Us on WhatsApp
          </a>
        </div>

        {/* Quote block below CTA banner */}
        <div className={styles.masterQuoteBlock}>
          <div className={styles.masterQuote}>
            "The beauty of Yoga is, it shows you fitness with a side of
            spirituality and happiness."
          </div>
          <div className={styles.masterAttrib}>— Yogi Chetan Mahesh Ji</div>
        </div>

        <div className={styles.container}>
          <div className={styles.journeyText}>
            <p className={styles.para}>
              Are you ready to witness the beauty of yogic practices? Tune into
              your spiritual self with us. Join our yoga teacher training
              courses in Rishikesh and take the transformative path.
            </p>
            <p className={styles.para}>
              Our courses are built to imbibe self-confidence and reach personal
              growth milestones. Learn to replace your negative emotions with
              positive-inducing thoughts, expand your consciousness, and learn
              to enjoy and live fully. Take the first step towards
              transformation to become a yoga teacher in India with AYM.
            </p>
            <p className={styles.para}>
              Learn from fellow yogis, cherish the moments spent mastering
              perfection and find your calm and inner peace. As you learn to
              live your life on yogic principles, watch your outlook towards
              life change positively. Grow within a like-minded community and
              nurture your skills.
            </p>
            <p className={styles.para}>
              Get in touch with us to enrol in our upcoming yoga teacher
              training programs in Rishikesh. Each batch of our yoga training
              certification courses has limited seats.
            </p>
            <p className={styles.para}>
              Start your journey to become a registered yoga teacher. The best
              yoga training school in Rishikesh looks forward to welcoming you.
            </p>
            <p className={`${styles.para} ${styles.namaste}`}>
              May you always be happy, healthy and peaceful.{" "}
              <strong>Namaste!</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AYMFullPage;

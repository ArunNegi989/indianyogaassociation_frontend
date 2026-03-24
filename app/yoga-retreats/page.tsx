"use client";
import React from "react";
import styles from "@/assets/style/Yoga-retreat/Yogaretreatpage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/33.webp";
/* ─────────────────────────────────────────
   Real Unsplash image URLs (free to use)
   Each URL is a direct, embeddable link.
───────────────────────────────────────── */
const IMAGES = {
  // Hero banner — Rishikesh mountains + river
  banner:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",

  // Photo strip (3 images)
  strip1:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80", // yoga pose river rocks
  strip2:
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80", // man meditation water
  strip3:
    "https://images.unsplash.com/photo-1532798442725-41036acc7489?w=600&q=80", // yoga forest green

  // Accommodation collage
  accomMain:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80", // bright yoga room
  accomThumb1:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", // room interior
  accomThumb2:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", // cosy room
  accomThumb3:
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80", // bedroom warm
  accomThumb4:
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&q=80", // colourful room
};

/* ─── DATA ─── */
const retreatPackages = [
  { title: "3 Days Yoga Retreat in Rishikesh", price: "75 USD / 6000 INR" },
  { title: "3 Days Ayurveda Retreat in Rishikesh", price: "105 USD / 9000 INR" },
  { title: "7 Days Yoga Retreat in Rishikesh", price: "175 USD / 14,000 INR" },
  { title: "7 Days Ayurveda Retreat in Rishikesh", price: "245 USD / 21,000 INR" },
  { title: "14 Days Yoga Retreat in Rishikesh", price: "350 USD / 28,000 INR" },
  { title: "14 Days Ayurveda Retreat in Rishikesh", price: "490 USD / 42,000 INR" },
];

const overviewItems = [
  { label: "Level", value: "Beginner to Advance." },
  { label: "Duration", value: "3, 7, 14 Days." },
  { label: "Accommodation & Food", value: "Private / 3 Vegetarian meals." },
  { label: "Language", value: "English & Hindi." },
  { label: "Yoga Retreats", value: "Mediation, Hatha & Ashtanga Class Everyday" },
  {
    label: "Ayurveda Retreat",
    value: "Mediation, Hatha, Ashtanga Class & 1 Ayurveda Treatment Everyday",
  },
];
const OmDivider = () => (
  <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
);

export default function YogaRetreatPage() {
  return (
    <div className={styles.page}>
<section className={styles.heroSection}>
        <Image
          src={heroImg}
          alt="Yoga Students Group"
          width={1180}
          height={540}
          className={styles.heroImage}
          priority
        />
      </section>
      {/* TOP BORDER */}
      <div className={styles.topBorder} />

      {/* ════════════════════════════════════════════
          SECTION 1 — HERO + INTRO (Screenshot 1)
      ════════════════════════════════════════════ */}
      <section className={styles.heroSection1}>
        <div className={styles.container}>

          <h1 className={styles.pageTitle}>The Best Yoga Retreats in Rishikesh, India</h1>
          <OmDivider/>

          {/* Banner image */}
          <div className={styles.bannerWrap}>
            <img
              src={IMAGES.banner}
              alt="Yoga Retreat in Rishikesh — people by the Ganga river"
              className={styles.bannerImg}
            />
            <div className={styles.bannerOverlay}>
              <p className={styles.bannerTag}>Yoga Retreat</p>
              <p className={styles.bannerTag}>in</p>
              <p className={styles.bannerTag}>Rishikesh</p>
            </div>
          </div>

          

        </div>
      </section>
        <section className={styles.heroSectionpara}>
        <div className={styles.container}>

        

          {/* Intro text — verbatim from screenshot 1 */}
          <p className={styles.bodyPara}>
            Rishikesh, also known as the <strong>Yoga Capital of the World</strong>, offers unique
            opportunities for individuals seeking a profound journey into{" "}
            <strong>Yoga and meditation.</strong> Located at the foothills of the Himalayas and
            blessed by the tranquil flow of the sacred Ganga River, Rishikesh exudes an
            unparalleled spiritual energy, making it one of the most sought-after destinations for
            a <strong>Yoga Retreat in India.</strong>
          </p>

          <p className={styles.bodyPara}>
            <strong>AYM Yoga School</strong> offers some of the{" "}
            <strong>best yoga retreats in India</strong>, guided by highly qualified and experienced
            teachers. Whether you're a beginner eager to explore yoga or an advanced practitioner
            looking to deepen your practice, our tailored programs provide a life-transforming
            experience and inspire you to reach new heights in your yoga journey.
          </p>

          <p className={styles.bodyPara}>
            In addition to yoga, our{" "}
            <strong>Ayurveda wellness school in India</strong> offers a holistic approach to
            well-being. Rejuvenate your mind, body, and soul with ancient Ayurvedic therapies at
            our <strong>Luxury Ayurvedic retreat in India</strong>, recognized among the{" "}
            <strong>best in the world.</strong>
          </p>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — SCHEDULE TABLE (Screenshot 2)
      ════════════════════════════════════════════ */}
      <section className={styles.scheduleSection} id="schedule">
        <div className={styles.container}>

          <h2 className={styles.secTitle}>
            Schedule of Best Yoga Retreats in Rishikesh, India.
          </h2>
          <OmDivider/>

          <p className={styles.scheduleIntro}>
            The Association of Yoga and Meditation (AYM) offers a flexible schedule for all its{" "}
            <strong>Rishikesh yoga courses.</strong> You can join on any date between the 3rd and
            the 18th of every month to complete your one-week yoga retreat. Stay options range from
            7 to 14 days.
          </p>

          <div className={styles.scheduleGrid}>
            {/* Left card */}
            <div className={styles.scheduleCard}>
              <h3 className={styles.cardHeading}>Yoga Retreats in Rishikesh</h3>
              <div className={styles.cardRule} />
              <ul className={styles.pkgList}>
                {retreatPackages.map((pkg) => (
                  <li key={pkg.title} className={styles.pkgRow}>
                    <span className={styles.pkgName}>{pkg.title}</span>
                    <span className={styles.pkgPrice}>- {pkg.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right card */}
            <div className={styles.scheduleCard}>
              <h3 className={styles.cardHeading}>Yoga Retreats Overview</h3>
              <div className={styles.cardRule} />
              <ul className={styles.ovList}>
                {overviewItems.map((item) => (
                  <li key={item.label} className={styles.ovRow}>
                    <span className={styles.ovLabel}>{item.label}:</span>{" "}
                    <span className={styles.ovValue}>{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.applyWrap}>
            <a href="#book" className={styles.applyBtn}>Apply Now</a>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — PHOTO STRIP + 3–7 DAYS (Screenshot 3)
      ════════════════════════════════════════════ */}
      <section className={styles.photoSection}>

        {/* Three-photo strip */}
        <div className={styles.photoStrip}>
          <div className={styles.photoCell}>
            <img src={IMAGES.strip1} alt="Yoga by the river Rishikesh" className={styles.stripImg} />
          </div>
          <div className={styles.photoCell}>
            <img src={IMAGES.strip2} alt="Meditation in water Rishikesh" className={styles.stripImg} />
          </div>
          <div className={styles.photoCell}>
            <img src={IMAGES.strip3} alt="Yoga in forest Rishikesh" className={styles.stripImg} />
          </div>
        </div>

        <div className={styles.container}>

          <h2 className={styles.secTitle}>3 to 7 Days Yoga Retreat in Rishikesh</h2>
          <OmDivider/>
          <p className={styles.bodyPara}>
            This is one of our shortest{" "}
            <strong>yoga and meditation Rishikesh</strong> programs. Take a small break from your
            busy work life and rejuvenate your body, mind, and soul. You can join us every month
            and attend morning yoga classes focused on meditation, detoxification, and Ashtanga
            yoga. Hatha yoga and mantra chanting sessions for healing and peace continue in the
            evening.
          </p>
          <p className={styles.bodyPara}>
            Our <strong>3 to 7 days yoga retreat Rishikesh</strong> costs{" "}
            <strong>25 USD / 2000 INR per day</strong> (food and accommodation included).
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            3 to 7 Days Yoga and Ayurveda Retreat in Rishikesh
          </h2>
         <OmDivider/>
          <p className={styles.bodyPara}>
            Integrate your yoga practice with the ancient science of Ayurveda. AYM also offers{" "}
            <strong>Yoga and Ayurveda detox retreats in Rishikesh</strong>, which promise total
            well-being at the end of your course. Too many toxins in the body can lead to constant
            illnesses and ailments. In this program, we teach you to heal by detoxifying your body
            through natural healing methods.
          </p>
          <p className={styles.bodyPara}>
            We follow the panchakarma process (a five-step detox routine) to eliminate bodily
            toxins. A combination of yoga and Ayurveda can give great relief to the body, mind, and
            soul.
          </p>
          <p className={styles.bodyPara}>
            The course schedule includes three yoga classes and an Ayurvedic treatment process
            daily. Our{" "}
            <strong>3 to 7 days Ayurveda retreats in Rishikesh</strong> cost{" "}
            <strong>35 USD / 3000 INR per day.</strong>
          </p>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4 — 7–14 DAYS + AFFORDABLE (Screenshot 4)
      ════════════════════════════════════════════ */}
      <section className={styles.altSection}>
        <div className={styles.container}>

          <h2 className={styles.secTitle}>
            7 to 14 Days Yoga Retreats India( Two Weeks Yoga Retreat )
          </h2>
           <OmDivider/>
          <p className={styles.bodyPara}>
            Experience a transformative journey into yoga and Ayurveda in the serene Tapovan area
            of Rishikesh. At AYM, one of the best yoga training centres in Rishikesh, we offer 7
            to 14-day immersive yoga retreats that empower you to continue your personal practice
            after you leave. Our experienced teachers guide you through each technique with clarity
            and depth, ensuring you gain a solid foundation.
          </p>
          <p className={styles.bodyPara}>
            Three classes are held daily, along with early morning meditation. Ashtanga yoga and
            Hatha yoga classes are scheduled in the evenings. Our two-week{" "}
            <strong>yoga retreats in Rishikesh</strong> cost between{" "}
            <strong>175 USD and 350 USD / 14,000 INR and 28,000 INR</strong> (private
            accommodation and meals included).
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            7 to 14 Day Yoga and Ayurveda Retreats in Rishikesh
          </h2>
          <OmDivider/>
          <p className={styles.bodyPara}>
            Dive into a holistic approach to healthy living with our{" "}
            <strong>Rishikesh yoga courses</strong>, which also cover Ayurvedic detoxification. You
            can learn about yoga, meditation, proper food, and a healthy lifestyle in two weeks. The{" "}
            <strong>Ayurveda retreats in Rishikesh</strong> are more suited for people who have
            extended work breaks and wish to devote their time to deep cleansing or
            detoxification.
          </p>
          <p className={styles.bodyPara}>
            The course schedule begins early in the morning with three yoga classes and two hours
            of Ayurveda treatment daily. Our{" "}
            <strong>2 week detox retreats Rishikesh</strong> cost between{" "}
            <strong>245 USD and 490 USD / 21,000 INR and 42,000 INR</strong>, inclusive of private
            accommodation and meals.
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            Affordable Yoga Retreats in Rishikesh
          </h2>
         <OmDivider/>
          <p className={styles.bodyPara}>
            AYM is among the best places to learn yoga. Whether you're seeking a{" "}
            <strong>yoga retreat for beginners</strong> or looking to pursue yoga professionally,
            our centre offers some of the{" "}
            <strong>most affordable yoga retreats in India.</strong>
          </p>
          <p className={styles.bodyPara}>
            Apart from our qualified instructors and constant curriculum updates, we offer
            nourishing vegan and vegetarian meals to assist you on your wellness course. Our large
            grounds comprise beautiful gardens, a large common hall for yoga practice, and several
            facilities for a pleasant and serene stay.
          </p>
          <p className={styles.bodyPara}>
            Located in the Tapovan area, you can also head out for quick sightseeing and marvel at
            the stunning surroundings.
          </p>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 5 — ACCOMMODATION PHOTOS +
          CLASS SCHEDULE + HOW TO BOOK + REFUND
          (Screenshot 5)
      ════════════════════════════════════════════ */}
      <section className={styles.accomSection}>

        {/* Accommodation photo collage */}
        <div className={styles.accomGrid}>
          <div className={styles.accomMain}>
            <img src={IMAGES.accomMain} alt="Main accommodation room" className={styles.accomImg} />
          </div>
          <div className={styles.accomThumbGrid}>
            <div className={styles.accomThumb}>
              <img src={IMAGES.accomThumb1} alt="Room view 1" className={styles.accomImg} />
            </div>
            <div className={styles.accomThumb}>
              <img src={IMAGES.accomThumb2} alt="Room view 2" className={styles.accomImg} />
            </div>
            <div className={styles.accomThumb}>
              <img src={IMAGES.accomThumb3} alt="Room view 3" className={styles.accomImg} />
            </div>
            <div className={styles.accomThumb}>
              <img src={IMAGES.accomThumb4} alt="Room view 4" className={styles.accomImg} />
            </div>
          </div>
        </div>

        <div className={styles.container}>

          <h2 className={styles.secTitle}>
            Schedule of yoga classes in Yoga Retreat India ( Rishikesh &amp; Goa )
          </h2>
          <OmDivider/>
          <p className={styles.bodyPara}>
            Our <strong>Rishikesh yoga courses</strong> offer a flexible schedule. Depending on
            your area of interest, you can opt for several courses, such as{" "}
            <strong>
              yoga and Ayurveda detox, Hatha yoga retreats, yoga and meditation, or Ashtanga yoga
              classes.
            </strong>{" "}
            Most of them are great options for spiritual improvement in yoga, teaching different
            aspects related to yoga in Rishikesh.
          </p>
          <p className={styles.bodyPara}>
            It is possible to attend multiple options simultaneously by participating in different
            individual yoga classes.
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            How to Book Yoga Retreat in Rishikesh?
          </h2>
          <OmDivider/>
          <p className={styles.bodyPara}>
            <a href="#" className={styles.inlineLink}>AYM's yoga ashram in Rishikesh</a> tends to
            fill up quickly, with bookings made one to two months in advance. We recommend
            pre-booking your yoga retreat by filling out the registration form and paying an advance
            deposit fee of <strong>55 USD.</strong>
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            Refund Rules
          </h2>
           <OmDivider/>
          <p className={styles.bodyPara}>
            Please note that no refunds are issued if you are unable to attend due to unforeseen
            circumstances. However, we are happy to accommodate you for your next available date
            within one year.
          </p>
          <p className={styles.bodyPara}>
            For more details, check out our{" "}
            <a href="#" className={styles.inlineLink}>Rule and Regulation - AYM YOGA SCHOOL</a>
          </p>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 6 — HOW TO REACH + BOOK NOW
          (Screenshot 6)
      ════════════════════════════════════════════ */}
      <section className={styles.reachSection} id="book">
        <div className={styles.container}>

          <h2 className={styles.secTitle}>
            How can you reach AYM Yoga School for Yoga Retreats in Rishikesh?
          </h2>
         <OmDivider/>
          <p className={styles.bodyPara}>
            The most reasonable option for foreign travellers is to arrive at Delhi Airport and
            then continue to Jolly Grant Airport in Dehradun by connecting with a domestic flight.
            You can also order a direct pick from Delhi for an extra fee. On the other hand, it is
            also possible to come to Rishikesh by train or bus, which is not the most comfortable
            but is the more affordable option.
          </p>

          <div className={styles.bookBtnGroup}>
            <a href="#" className={styles.bookNowBtn}>Yoga Retreats -Book Now</a>
            <a href="#" className={styles.paypalBtn}>
              <span className={styles.paypalText}>PayPal</span>
            </a>
          </div>

        </div>
      </section>
<HowToReach/>
      {/* BOTTOM BORDER */}
      <div className={styles.bottomBorder} />

    </div>
  );
}
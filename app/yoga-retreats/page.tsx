"use client";
import React from "react";
import styles from "@/assets/style/Yoga-retreat/Yogaretreatpage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/33.webp";
import PremiumGallerySection from "@/components/PremiumGallerySection";

const IMAGES = {
  banner:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",

  // Photo strip (3 images)
  strip1:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  strip2:
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80",
  strip3:
    "https://images.unsplash.com/photo-1532798442725-41036acc7489?w=600&q=80",

  // Accommodation collage
  accomMain:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
  accomThumb1:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  accomThumb2:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  accomThumb3:
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80",
  accomThumb4:
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&q=80",
};

/* ─── DATA ─── */
const retreatPackages = [
  { title: "3 Days Yoga Retreat in Rishikesh", price: "75 USD / 6000 INR" },
  {
    title: "3 Days Ayurveda Retreat in Rishikesh",
    price: "105 USD / 9000 INR",
  },
  { title: "7 Days Yoga Retreat in Rishikesh", price: "175 USD / 14,000 INR" },
  {
    title: "7 Days Ayurveda Retreat in Rishikesh",
    price: "245 USD / 21,000 INR",
  },
  { title: "14 Days Yoga Retreat in Rishikesh", price: "350 USD / 28,000 INR" },
  {
    title: "14 Days Ayurveda Retreat in Rishikesh",
    price: "490 USD / 42,000 INR",
  },
];

const overviewItems = [
  { label: "Level", value: "Beginner to Advance." },
  { label: "Duration", value: "3, 7, 14 Days." },
  { label: "Accommodation & Food", value: "Private / 3 Vegetarian meals." },
  { label: "Language", value: "English & Hindi." },
  {
    label: "Yoga Retreats",
    value: "Mediation, Hatha & Ashtanga Class Everyday",
  },
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
      <div className={styles.a} />

      <section className={styles.heroSection1}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>
            The Best Yoga Retreats in Rishikesh, India
          </h1>
          <OmDivider />

          <div className={styles.s1TwoCol}>
            {/* LEFT — text */}
            <div className={styles.s1TextCol}>
              <p className={styles.bodyPara}>
                Rishikesh, also known as the{" "}
                <strong>Yoga Capital of the World</strong>, offers unique
                opportunities for individuals seeking a profound journey into{" "}
                <strong>Yoga and meditation.</strong> Located at the foothills
                of the Himalayas and blessed by the tranquil flow of the sacred
                Ganga River, Rishikesh exudes an unparalleled spiritual energy,
                making it one of the most sought-after destinations for a{" "}
                <strong>Yoga Retreat in India.</strong>
              </p>
              <p className={styles.bodyPara}>
                <strong>AYM Yoga School</strong> offers some of the{" "}
                <strong>best yoga retreats in India</strong>, guided by highly
                qualified and experienced teachers. Whether you're a beginner
                eager to explore yoga or an advanced practitioner looking to
                deepen your practice, our tailored programs provide a
                life-transforming experience and inspire you to reach new
                heights in your yoga journey.
              </p>
              <p className={styles.bodyPara}>
                In addition to yoga, our{" "}
                <strong>Ayurveda wellness school in India</strong> offers a
                holistic approach to well-being. Rejuvenate your mind, body,
                and soul with ancient Ayurvedic therapies at our{" "}
                <strong>Luxury Ayurvedic retreat in India</strong>, recognized
                among the <strong>best in the world.</strong>
              </p>

              <div className={styles.s1Stats}>
                <div className={styles.s1Stat}>
                  <span className={styles.s1StatNum}>3–14</span>
                  <span className={styles.s1StatLbl}>Day Programs</span>
                </div>
                <div className={styles.s1StatDiv} />
                <div className={styles.s1Stat}>
                  <span className={styles.s1StatNum}>500+</span>
                  <span className={styles.s1StatLbl}>Happy Students</span>
                </div>
                <div className={styles.s1StatDiv} />
                <div className={styles.s1Stat}>
                  <span className={styles.s1StatNum}>15+</span>
                  <span className={styles.s1StatLbl}>Years Experience</span>
                </div>
                <div className={styles.s1StatDiv} />
                <div className={styles.s1Stat}>
                  <span className={styles.s1StatNum}>All</span>
                  <span className={styles.s1StatLbl}>Levels Welcome</span>
                </div>
              </div>
            </div>

            {/* RIGHT — image */}
            <div className={styles.s1ImgCol}>
              <img
                src={IMAGES.banner}
                alt="Yoga retreat in Rishikesh"
                className={styles.s1Img}
              />
              <div className={styles.s1ImgPanel}>
                <span className={styles.s1PanelOm}>ॐ</span>
                <div className={styles.s1PanelRule} />
                <p className={styles.s1PanelTag}>Yoga Retreat</p>
                <div className={styles.s1PanelRule} />
                <p className={styles.s1PanelTag}>in</p>
                <div className={styles.s1PanelRule} />
                <p className={styles.s1PanelTag}>Rishikesh</p>
              </div>
              <div className={styles.s1ImgCaption}>
                <span>
                  Est. 2010 · Tapovan, Rishikesh · Internationally Accredited
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section2 */}
      <section className={styles.scheduleSection} id="schedule">
        <div className={styles.container}>
          <h2 className={styles.secTitle}>
            Schedule of Best Yoga Retreats in Rishikesh, India
          </h2>
          <OmDivider />

          <p className={styles.scheduleIntro}>
            The Association of Yoga and Meditation (AYM) offers a flexible
            schedule for all its <strong>Rishikesh yoga courses.</strong> You
            can join on any date between the 3rd and the 18th of every month to
            complete your one-week yoga retreat. Stay options range from 7 to
            14 days.
          </p>

          <div className={styles.scheduleGrid}>
            {/* LEFT — Pricing card */}
            <div className={styles.scheduleCard}>
              <div className={styles.cardHead}>
                <span className={styles.cardHeadIcon}>🧘</span>
                <div>
                  <p className={styles.cardHeadTitle}>
                    Yoga Retreats in Rishikesh
                  </p>
                  <p className={styles.cardHeadSub}>Pricing &amp; Packages</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                {retreatPackages.map((pkg) => (
                  <div key={pkg.title} className={styles.pkgRow}>
                    <div className={styles.pkgLeft}>
                      <div className={styles.pkgDot} />
                      <span className={styles.pkgName}>{pkg.title}</span>
                    </div>
                    <span className={styles.pkgPrice}>{pkg.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Overview card */}
            <div className={styles.scheduleCard}>
              <div className={styles.cardHead}>
                <span className={styles.cardHeadIcon}>📋</span>
                <div>
                  <p className={styles.cardHeadTitle}>
                    Yoga Retreats Overview
                  </p>
                  <p className={styles.cardHeadSub}>What's Included</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                {overviewItems.map((item) => (
                  <div key={item.label} className={styles.ovRow}>
                    <div className={styles.ovContent}>
                      <p className={styles.ovLabel}>{item.label}</p>
                      <p className={styles.ovValue}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.applyWrap}>
            <a href="#book" className={styles.applyBtn}>
              Apply Now
            </a>
          </div>
        </div>
      </section>

      {/* section 3 */}
      <section className={styles.photoSection}>
        <div className={styles.photoStrip}>
          <div className={styles.stripCell}>
            <img
              src={IMAGES.strip1}
              alt="Yoga by the river Rishikesh"
              className={styles.stripImg}
            />
            <span className={styles.stripLabel}>Morning Practice</span>
          </div>
          <div className={styles.stripCell}>
            <img
              src={IMAGES.strip2}
              alt="Meditation Rishikesh"
              className={styles.stripImg}
            />
            <span className={styles.stripLabel}>Meditation</span>
          </div>
          <div className={styles.stripCell}>
            <img
              src={IMAGES.strip3}
              alt="Yoga in nature Rishikesh"
              className={styles.stripImg}
            />
            <span className={styles.stripLabel}>Nature &amp; Healing</span>
          </div>
        </div>

        <div className={styles.s3Inner}>
          <div className={styles.s3Grid}>
            {/* Block 1 */}
            <div className={styles.contentBlock}>
              <h2 className={styles.secTitle}>
                3 to 7 Days Yoga Retreat in Rishikesh
              </h2>
              <OmDivider />
              <p className={styles.bodyPara}>
                One of our shortest <strong>yoga and meditation Rishikesh</strong>{" "}
                programs. Take a small break from your busy work life and
                rejuvenate your body, mind, and soul. Join us every month and
                attend morning yoga classes focused on meditation,
                detoxification, and Ashtanga yoga. Hatha yoga and mantra
                chanting sessions for healing and peace continue in the evening.
              </p>
              <div className={styles.pricePill}>
                <span className={styles.priceLabel}>From</span>
                <span className={styles.priceVal}>25 USD / ₹2,000 per day</span>
              </div>
              <p className={styles.priceNote}>Food &amp; accommodation included.</p>
            </div>

            {/* Block 2 */}
            <div className={styles.contentBlock}>
              <h2 className={styles.secTitle}>
                3 to 7 Days Yoga &amp; Ayurveda Retreat in Rishikesh
              </h2>
              <OmDivider />
              <p className={styles.bodyPara}>
                Integrate your yoga practice with the ancient science of
                Ayurveda. AYM offers{" "}
                <strong>Yoga and Ayurveda detox retreats in Rishikesh</strong>,
                promising total well-being. We follow the panchakarma process —
                a five-step detox routine — to eliminate bodily toxins. A
                combination of yoga and Ayurveda gives profound relief to body,
                mind, and soul.
              </p>
              <p className={styles.bodyPara}>
                The schedule includes three yoga classes and one Ayurvedic
                treatment daily.
              </p>
              <div className={styles.pricePill}>
                <span className={styles.priceLabel}>From</span>
                <span className={styles.priceVal}>35 USD / ₹3,000 per day</span>
              </div>
              <p className={styles.priceNote}>Food &amp; accommodation included.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className={styles.altSection}>
        <div className={styles.s4Inner}>
          <div className={styles.s4TopGrid}>
            {/* Block 1 */}
            <div className={styles.contentBlock}>
              <h2 className={styles.secTitle}>7 to 14 Days Yoga Retreats India</h2>
              <OmDivider />
              <p className={styles.bodyPara}>
                Experience a transformative journey in the serene Tapovan area
                of Rishikesh. At AYM, we offer 7 to 14-day immersive yoga
                retreats that empower you to continue your personal practice
                after you leave. Our experienced teachers guide you through each
                technique with clarity and depth, ensuring a solid foundation.
              </p>
              <p className={styles.bodyPara}>
                Three classes are held daily along with early morning
                meditation. Ashtanga and Hatha yoga classes are scheduled in the
                evenings.
              </p>
              <div className={styles.pricePill}>
                <span className={styles.priceLabel}>From</span>
                <span className={styles.priceVal}>
                  175–350 USD / ₹14,000–28,000
                </span>
              </div>
              <p className={styles.priceNote}>
                Private accommodation &amp; meals included.
              </p>
            </div>

            {/* Block 2 */}
            <div className={styles.contentBlock}>
              <h2 className={styles.secTitle}>
                7 to 14 Day Yoga &amp; Ayurveda Retreats in Rishikesh
              </h2>
              <OmDivider />
              <p className={styles.bodyPara}>
                Dive into a holistic approach to healthy living with our{" "}
                <strong>Rishikesh yoga courses</strong>, which also cover
                Ayurvedic detoxification. Learn yoga, meditation, proper
                nutrition, and a healthy lifestyle in two weeks. The{" "}
                <strong>Ayurveda retreats in Rishikesh</strong> are ideal for
                those with extended breaks who wish to devote time to deep
                cleansing.
              </p>
              <p className={styles.bodyPara}>
                The schedule begins early morning with three yoga classes and
                two hours of Ayurveda treatment daily.
              </p>
              <div className={styles.pricePill}>
                <span className={styles.priceLabel}>From</span>
                <span className={styles.priceVal}>
                  245–490 USD / ₹21,000–42,000
                </span>
              </div>
              <p className={styles.priceNote}>
                Private accommodation &amp; meals included.
              </p>
            </div>
          </div>

          <div className={styles.s4Divider}>
            <span className={styles.s4DivLine} />
            <span className={styles.s4DivText}>Why Choose AYM</span>
            <span className={styles.s4DivLine} />
          </div>

          {/* Affordable block */}
          <div className={styles.affordableWrap}>
            <div className={styles.affordableText}>
              <h2
                className={styles.secTitle}
                style={{ textAlign: "left" }}
              >
                Affordable Yoga Retreats in Rishikesh
              </h2>
              <OmDivider />
              <p className={styles.bodyPara}>
                AYM is among the best places to learn yoga. Whether you're
                seeking a <strong>yoga retreat for beginners</strong> or
                looking to pursue yoga professionally, our centre offers some of
                the{" "}
                <strong>most affordable yoga retreats in India.</strong>
              </p>
              <p className={styles.bodyPara}>
                Apart from our qualified instructors and constant curriculum
                updates, we offer nourishing vegan and vegetarian meals. Our
                large grounds comprise beautiful gardens, a spacious yoga hall,
                and excellent facilities for a serene stay.
              </p>
              <p className={styles.bodyPara}>
                Located in the Tapovan area, you can also head out for quick
                sightseeing and marvel at the stunning Himalayan surroundings.
              </p>
            </div>

            <div className={styles.affordableCard}>
              <div className={styles.affordableCardHead}>
                <p className={styles.affordableCardHeadTitle}>
                  What Makes AYM Special
                </p>
                <p className={styles.affordableCardHeadSub}>Our Highlights</p>
              </div>
              <div className={styles.affordableCardBody}>
                {[
                  "Highly qualified & experienced teachers",
                  "Nourishing vegan & vegetarian meals",
                  "Beautiful gardens & spacious yoga hall",
                  "Private accommodation included",
                  "Located in scenic Tapovan, Rishikesh",
                  "Beginner to advanced levels welcome",
                ].map((f) => (
                  <div key={f} className={styles.affordableFeature}>
                    <div className={styles.featDot} />
                    <span className={styles.featText}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PremiumGallerySection type="both" backgroundColor="warm" />

      {/* section 6 */}
      <section className={styles.reachSection} id="book">
        <div className={styles.container}>
          <h2 className={styles.secTitle}>
            How Can You Reach AYM Yoga School for Yoga Retreats in Rishikesh?
          </h2>
          <OmDivider />

          <div className={styles.reachTwoCol}>
            {/* LEFT — text + CTAs */}
            <div className={styles.reachTextCol}>
              <p className={styles.bodyPara}>
                The most reasonable option for foreign travellers is to arrive
                at <strong>Delhi Airport</strong> and then continue to{" "}
                <strong>Jolly Grant Airport in Dehradun</strong> by connecting
                with a domestic flight. You can also arrange a direct pick-up
                from Delhi for an extra fee. It is also possible to come to
                Rishikesh by train or bus — not the most comfortable, but the
                more affordable option.
              </p>
              <p className={styles.bodyPara}>
                AYM Yoga School is located in the peaceful{" "}
                <strong>Tapovan area</strong>, just a short drive from Rishikesh
                city centre. Our team is happy to assist with travel arrangements
                upon request.
              </p>

              <div className={styles.bookBtnGroup}>
                <a href="#" className={styles.bookNowBtn}>
                  Yoga Retreats — Book Now
                </a>
                <a href="#" className={styles.paypalBtn}>
                  <span className={styles.paypalText}>PayPal</span>
                </a>
              </div>
            </div>

            {/* RIGHT — route cards */}
            <div className={styles.routesCol}>
              <div className={styles.routeCard}>
                <div className={styles.routeAccent} />
                <div className={styles.routeBody}>
                  <div className={styles.routeHead}>
                    <span className={styles.routeIcon}>✈️</span>
                    <span className={styles.routeTitle}>By Air — Recommended</span>
                    <span className={styles.routeBadge}>Best</span>
                  </div>
                  <p className={styles.routeDesc}>
                    Fly into Delhi (DEL), then take a domestic connection to Jolly
                    Grant Airport, Dehradun. A taxi to Rishikesh takes approx. 45
                    minutes.
                  </p>
                </div>
              </div>

              <div className={styles.routeCard}>
                <div className={styles.routeAccentDark} />
                <div className={styles.routeBody}>
                  <div className={styles.routeHead}>
                    <span className={styles.routeIcon}>🚗</span>
                    <span className={styles.routeTitle}>
                      Direct Pick-up from Delhi
                    </span>
                    <span className={styles.routeBadgeDark}>Extra Fee</span>
                  </div>
                  <p className={styles.routeDesc}>
                    We can arrange a direct car pick-up from Delhi Airport to AYM
                    Yoga School in Tapovan. Comfortable and hassle-free — contact
                    us to book.
                  </p>
                </div>
              </div>

              <div className={styles.routeCard}>
                <div className={styles.routeAccentMid} />
                <div className={styles.routeBody}>
                  <div className={styles.routeHead}>
                    <span className={styles.routeIcon}>🚂</span>
                    <span className={styles.routeTitle}>By Train or Bus</span>
                    <span className={styles.routeBadgeMid}>Budget</span>
                  </div>
                  <p className={styles.routeDesc}>
                    Trains run from Delhi to Haridwar (approx. 6 hrs), followed by
                    a 30-min taxi to Rishikesh. Buses are available but less
                    comfortable for long journeys.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowToReach />
      {/* BOTTOM BORDER */}
      <div className={styles.bottomBorder} />
    </div>
  );
}
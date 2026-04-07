// InnerTransformation.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/inner-awakening/Innertransformation.module.css";
import gurujiimage from "@/assets/images/inner-awakening.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/40.png";
// ---- Om Symbol SVG ----
const OmSVG: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="30"
      cy="30"
      r="28"
      stroke="#e8600a"
      strokeWidth="2"
      fill="none"
    />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="26"
      fill="#e8600a"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

const Divider: React.FC = () => (
  <div className={styles.divider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>
      <OmSVG />
    </span>
    <span className={styles.dividerLine} />
  </div>
);

// ===================== MAIN COMPONENT =====================
const InnerTransformation: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

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
      {/* ===== HERO TITLE ===== */}
      <section className={styles.heroSection1}>
        <h1 className={styles.mainTitle}>Inner Transformation Retreat</h1>
        <Divider />
        <h2 className={styles.subTitle}>
          Awake Your Inner Self – with Yogiraj Sri Yogi Chetan Maharishi
        </h2>
        <h3 className={styles.whoTitle}>Who is Sri Maharishi?</h3>
        <p className={styles.bodyText}>
          Yogi, Mystic, and Visionary. Himalayan Yogi{" "}
          <strong>Sri Maharishi</strong> belongs to the eternal Siddha
          Tradition, a lineage of perfected beings. He spent the last 30 years
          in meditation and practicing traditional Kryia Yoga at the Himalayas
          with enlightens gurus.
        </p>

        <div className={styles.imageWrapper}>
          <div className={styles.maharishiImageBox}>
            <Image
              src={gurujiimage}
              alt="Yogiraj Sri Yogi Chetan Maharishi"
              fill
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 85vw, 920px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ===== INNER AWAKENING ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          What is the inner awakening retreat?
        </h2>
        <p className={styles.bodyText}>
          We often go by in our daily lives in the automatic mode, running away
          from questions we don&apos;t know how to answer: &ldquo;Why am I doing
          all of this? Who am I? What is my true purpose in this life?&rdquo;
          When we are a disconnect from our true selves, those questions are
          nearly impossible to be answered because we try to answer them by
          looking outside, in material things, in the personalities we&apos;ve
          created for ourselves. But we are not our money; we are not our
          profession. So who are we?
        </p>
        <p className={styles.bodyText}>
          The Inner Transformation retreat is an invitation for you to look
          deeply inside yourself and connect with our higher self, who we are.
          The retreat is an opportunity for you to awaken yourself. It is
          self-realization. This transformation of the being takes place by a
          mind-swift, by changing the way you think trough constant self-inquire
          and exploration of the inner states of the self.
        </p>
        <p className={styles.bodyText}>
          Every single person has its path, its way to reach the space of inner
          tranquility inside us where our true self resides, where no longer the
          disorientation of everyday living cause us to be away from true
          well-being, where we are free. For that reason, the retreat has its
          base in freedom. Here every single person is presented each day by
          different kinds of methods, by different types of eastern philosophies
          (as Yoga, Jainism, and Taoism), and different kinds of techniques and
          knowledge to find its path, to find its practice.
        </p>
        <p className={styles.bodyText}>
          This retreat consists of a foundation; there is also a master program
          that can be offered.
        </p>
      </section>

      <Divider />

      {/* ===== SCHEDULE ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          What is the schedule, what is inside the retreat?
        </h2>
        <p className={styles.twoWeeksLabel}>Two weeks of foundation retreat</p>

        {/* Two cards side by side */}
        <div className={styles.cardsRow}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                7 Points of Inner Transformation Retreat:
              </h3>
            </div>
            <div className={styles.cardBody}>
              <ul className={styles.cardList}>
                <li>Sublimation</li>
                <li>Culmination</li>
                <li>Transformation</li>
                <li>Sadhana</li>
                <li>Satsang</li>
                <li>Meditation</li>
                <li>Self-realization</li>
                <li>
                  (To draw with the fruits as the first 6 points, leading to the
                  root of all things: self-realization)
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2 — Schedule */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                The program, a draft of a schedule:
              </h3>
            </div>
            <div className={styles.cardBody}>
              <ul className={styles.scheduleList}>
                <li className={styles.scheduleDay}>Morning</li>
                <li>6.30h – 8.00h : Meditation</li>
                <li>8.00h – 8.30h : Tea</li>
                <li>8.30h – 10.00h : Satsang or practice</li>
                <li>10.00h – 11.00h : Breakfast</li>
                <li>11.00h – 12.30h : Sadhana</li>
                <li>LUNCH + self practice/self study Free until 17h</li>
                <li className={styles.scheduleDay}>Evening</li>
                <li>17.00h – 19.30h : Evening Sadhana</li>
                <li>19.30h – 20.30h : Light Dinner</li>
                <li>9.00h – 10.00h : Kirtten</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ===== THREE IMAGES ===== */}
      <section className={styles.triImageSection}>
        <div className={styles.triImageGrid}>
          <div className={styles.triImageItem}>
            <Image
              src="/images/inner-transformation/woman-prayer.jpg"
              alt="Woman in prayer"
              fill
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 300px"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </div>
          <div className={styles.triImageItem}>
            <Image
              src="/images/inner-transformation/guru-meditation.jpg"
              alt="Guru in meditation"
              fill
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 300px"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </div>
          <div className={styles.triImageItem}>
            <Image
              src="/images/inner-transformation/woman-garland.jpg"
              alt="Woman with garland"
              fill
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 300px"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ===== TWO INFO BOXES ===== */}
      <section className={styles.section}>
        <div className={styles.infoCardsRow}>
          {/* Box 1 — Definitions */}
          <div className={styles.infoCardBordered}>
            <p className={styles.infoText}>
              <strong>Satsang:</strong> In Sanskrit, it means &ldquo;gathering
              together for the truth&rdquo; or, more simply, &ldquo;being with
              the truth&rdquo;
            </p>
            <p className={styles.infoText}>
              <strong>Sadhana:</strong> Consist of deep practices and routine of
              surrendering the ego through various activities like meditation,
              chanting or prayer.
            </p>
            <p className={styles.infoText}>
              <strong>Self-realization:</strong> To know your inner self, to
              know the very love, to touch the absoluteness, to be in bliss.
            </p>
          </div>

          {/* Box 2 — Who can participate */}
          <div className={styles.infoCardOrange}>
            <div className={styles.infoCardOrangeHeader}>
              <h3 className={styles.infoCardOrangeTitle}>
                Who can participate in inner transformation retreat in
                Rishikesh:
              </h3>
            </div>
            <div className={styles.infoCardOrangeBody}>
              <ul className={styles.infoList}>
                <li>
                  Anyone who has few hours sitting practice continuously
                  effortlessly with clam mind.
                </li>
                <li>
                  Anyone who has finished at least 200 hour yoga teacher
                  training or any other yoga certification.
                </li>
                <li>
                  Anyone who is searching for inner powers and willing to follow
                  the ashram lifestyle during the retreat.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ===== INCLUDED IN FEE ===== */}
      <section className={styles.feeSection}>
        <h2 className={styles.feeSectionTitle}>Included in Fee</h2>
        <ul className={styles.feeList}>
          <li>Private Accommodation with Mountain View.</li>
          <li>Sattvic Indian Food - 3 Meals/Day.</li>
          <li>Herbal Tea/Lemon-Ginner Tea - 24X7.</li>
          <li>Certificate and Course Material.</li>
          <li>Airport Pickup from Dehradun Airport</li>
        </ul>

        <h2 className={styles.ticketTitle}>
          Inner transformation retreat in Rishikesh Ticket: 1000 USD or 70,000
          INR
        </h2>
        <p className={styles.ticketDesc}>
          The price of the ticket includes two-week private room accommodation,
          Indian vegetarian food, a trip to spiritual temples around rishikesh
          and guidance from Yogi Guru for inner awakening.
        </p>
      </section>
      <HowToReach />
    </div>
  );
};

export default InnerTransformation;

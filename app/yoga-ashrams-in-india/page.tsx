// YogaAshrams.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-ashrams-in-india/Yogaashrams.module.css";
import yogaashramimg1 from "@/assets/images/yoga-ashram-in-india.jpg";
import yogaashramimg2 from "@/assets/images/yoga-ashram-in-rishikesh.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/35.png";

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
      fontSize="28"
      fill="#e8600a"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

// ---- Divider ----
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
const YogaAshrams: React.FC = () => {
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
      {/* ===== HERO ===== */}
      <section className={styles.heroSection1}>
        <h1 className={styles.mainTitle}>Yoga Ashrams in India</h1>
      </section>

      <Divider />

      {/* ===== TOP COLLAGE — single image ===== */}
      <section className={styles.collageWrapper}>
        <div className={styles.collageContainer}>
          <div className={styles.collageImageBox}>
            {/* apna image path yahan daalo */}
            <Image
              src={yogaashramimg1}
              alt="Yoga Ashrams in India"
              fill
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 90vw, 820px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className={styles.collageCaption}>YOGA ASHRAMS IN INDIA</div>
        </div>
      </section>

      <Divider />

      {/* ===== INTRO TEXT ===== */}
      <section className={styles.introSection}>
        <p className={styles.introText}>
          Welcome to AYM Yoga Ashram in Rishikesh. India, the land of religions,
          faith, traditions, and spirituality, is well-known worldwide for yoga
          and meditation practices. Many schools and yoga ashrams across India
          provide yoga and meditation training to all those seeking them. For
          this reason, people from all walks of life come to India to find calm
          and peace. Here, they come to learn and practice yoga and meditation
          and find peace for mind, body, and soul.
        </p>
        <p className={styles.introText}>
          <strong>Yoga Ashrams in India</strong> provide various yoga courses
          for one and all, starting from- Primary (Basic), Secondary
          (Intermediate) and Intensive (In-depth /Thorough). Yoga seekers,
          enthusiasts, and yoga travellers can choose the course of their choice
          according to the time they can give to learn them. AYM{" "}
          <strong>yoga ashram in rishikesh</strong> also provides many yoga
          activities like <strong>yoga retreats for beginners</strong>, yoga
          teacher training for those who want to be a yoga teacher and inner
          awakening for spiritual shadhakas.
        </p>
      </section>

      <Divider />

      {/* ===== ENTHRALLING EXPERIENCES ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Enthralling experiences in Yoga Ashrams Rishikesh &amp; Practice of
          Yoga &amp; Mediation
        </h2>
        <p className={styles.bodyText}>
          There has never been a better time to commence your Rishikesh yoga
          adventure. Enjoyment in every moment can be yours through learning and
          practising yoga, breathing, and meditation techniques. Imagine
          learning to live a genuinely fulsome life right in the heart of India
          - living in a large, comfortable ashram with other seekers worldwide.
          You will be creating memories of a lifetime. AYM{" "}
          <strong>yoga ashram in rishikesh</strong>, India, is well-known for
          traditional and authentic yoga. At our ashram, yoga seekers can stay
          and indulge in more profound practice in the presence of traditional
          gurus. The best part is that you will get the incredible opportunity
          to learn yoga from its pioneers, the experts who have learnt these
          techniques at the Vedic Gurukuls and yoga tradition. You have a unique
          and authentic opportunity to learn and grow at AYM Yoga Ashram in
          India.
        </p>
        <p className={styles.bodyText}>
          What distinguishes yoga learning at the AYM Rishikesh ashrams from the
          others is our commitment to providing comprehensive and thorough
          training. We ensure that the yoga practitioner will be educated in the
          foundational principles and science behind each pose. Our teachers are
          both skilled and experienced. They are experts who have experienced
          ultimate enlightenment and teach from their hearts, minds, and souls,
          instilling in you a deep sense of confidence in the quality of
          education you will receive.
        </p>
      </section>

      <Divider />

      {/* ===== BEST HOME FOR YOGA ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Yoga Ashrams in Rishikesh - Best Home for Yoga
        </h2>
        <p className={styles.bodyText}>
          Rishikesh, the holy city of India, famous for its landmark sites and
          temples; is famous all over the world as{" "}
          <a href="#">&ldquo;International Yoga hub&rdquo;</a>. People, who wish
          to rediscover themselves and those who want to find the real meaning
          of life through yoga and meditation, visit Rishikesh AYM Yoga Ashram.
          There are many <em>yoga ashrams in Rishikesh</em> that offer various
          yoga courses and in as many styles such as <a href="#">Hatha yoga</a>,{" "}
          <a href="#">Ashtanga</a>, Vinyasa, Vinyasa Flow, Iyengar, Kundalini
          and Power Yoga. Different yoga ashrams offer different courses of
          various durations, affording variety and choice. The courses offered
          include <a href="#">200 hours teacher training</a>,{" "}
          <a href="#">300 hour teacher training</a> and{" "}
          <a href="#">500 hours teacher training</a> and span from 25 days to 1
          month to about two months. All of the previous activities you will
          find at one home known as AYM Yoga Ashram in rishikesh. Once you have
          completed your course, you receive certificates which are verified and
          recognized by Yoga Alliance USA and International Yoga Federation.
        </p>
      </section>

      <Divider />

      {/* ===== BOTTOM ASHRAM PHOTO — single image ===== */}
      <section className={styles.ashramSection}>
        <div className={styles.ashramImageBox}>
          {/* apna image path yahan daalo */}
          <Image
            src={yogaashramimg2}
            alt="Yoga Ashram in Rishikesh"
            fill
            sizes="(max-width: 575px) 100vw, (max-width: 991px) 90vw, 720px"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </div>
        <div className={styles.ashramCaption}>Yoga Ashram in Rishikesh</div>
      </section>

      <Divider />

      {/* ===== WHAT IS AN ASHRAM ===== */}
      <section className={styles.whatSection}>
        <h2 className={styles.sectionTitle}>What is an Ashram?</h2>
        <p className={styles.bodyText}>
          An ashram is a home which remains away from the hustle-bustle of city
          life. It is a place usually located amidst a calm and peaceful
          environment ranging from hills to forests to riverside. People visit
          ashram for the practice of spirituality, meditation and learning yoga.
          While living in an ashram, you must wake up early and do mantra
          chanting and yoga practice. You must also be part of ashram lifestyle
          and do some work as your Karma. An ashram is a spiritual school where
          you learn to live a disciplined life. At AYM yoga ashram you can read
          and learn all about yoga and meditation through classes taken by yoga
          masters, and also by books on yoga that are available in an ashram.
          The ashram is a home away from home where students can stay, read,
          study and practice yoga in a peaceful, undisturbed environment.
        </p>
      </section>

      <Divider />

      {/* ===== WHY IS AYM BEST ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitleLink}>
          <a href="#">Why is AYM Yoga Ashrams best to learn yoga?</a>
        </h2>
        <p className={styles.bodyText}>
          Yoga ashram is considered the best place to learn yoga because it is
          located away from the hustle and bustle of daily life and is free from
          interruptions and disturbances. AYM Yoga ashram has experienced and
          qualified teachers who teach different styles and aspects of yoga.
          Regular yoga practice with various asanas allows people to have a
          healthy mind and body free of toxins and harmful things. It is an
          ashram where people learn to focus and concentrate on doing one
          particular thing at a time or a set of skills while doing a specific
          kind of work.
        </p>
        <p className={styles.bodyText}>
          Once at our ashram, people can focus on themselves and find who they
          are and what they want to do. Also, at AYM Yoga Ashram, people find
          the true meaning of life and find out how they can serve themselves by
          serving others. Once they have become well-versed in one or more
          styles of yoga and have learned to meditate, they can get back to
          their lives and work better and more efficiently. By doing so, they
          are equipped with life skills to start progressing.
        </p>
      </section>

      <Divider />

      {/* ===== ACTIVITIES ===== */}
      <section className={styles.activitiesSection}>
        <h2 className={styles.activitiesTitle}>
          Activities in AYM Rishikesh Yoga Ashram
        </h2>
        <p className={styles.bodyText}>
          AYM Yoga School located in Rishikesh is the{" "}
          <strong>best yoga teacher training ashrams in Rishikesh</strong> which
          offers various styles of yoga to students and yoga practioners. Other
          than running various Yoga Alliance-USA certified yoga in rishikesh,
          the Ashram also carried out other interesting activities for its
          students. Some of those activities include karma yoga (in which
          students are involved in ashram activities), keertans (singing of
          religious songs and mantras), watching movies based on yoga and
          meditation. Visit spiritual places once during the course, free Sunday
          for students to explore nearby areas and places of worship, discussion
          with teachers after classes on any or all aspects of life.
        </p>
        <p className={styles.bodyText}>
          At AYM, you have a lot to learn and discover about self as well as
          about the world. So don&apos;t just wait, come and learn the nuances
          of yoga and meditation at AYM{" "}
          <a href="#">
            <em>Yoga School in Rishikesh</em>
          </a>
          , India.
        </p>
        <div className={styles.coursesBlock}>
          <p className={styles.coursesHeading}>
            Various yoga courses offered by AYM yoga ashram in rishikesh are:
          </p>
          <ul className={styles.coursesList}>
            <li>
              <a href="#">100 Hour Yoga Teacher Training in Rishikesh</a>
            </li>
            <li>
              <a href="#">200 Hour Yoga Teacher Training in Rishikesh</a>
            </li>
            <li>
              <a href="#">300 Hour Yoga Teacher Training in Rishikesh</a>
            </li>
            <li>
              <a href="#">500 Hour Yoga Teacher Training in Rishikesh</a>
            </li>
          </ul>
        </div>
      </section>
      <HowToReach />
    </div>
  );
};

export default YogaAshrams;

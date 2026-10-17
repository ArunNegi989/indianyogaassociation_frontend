"use client";
import React from "react";
import styles from "@/assets/style/world-wide/yoga-teacher-training-in-vietnam/Vietnampage.module.css";
import yogaimage from "@/assets/images/yoga.svg";
import AymHomePage from "@/components/Aymhomepage";

/* ─── SVG Decorations ─── */
const Mandala: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 400 400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <circle
      cx="200"
      cy="200"
      r="195"
      stroke="#F15505"
      strokeWidth="0.8"
      strokeDasharray="4 6"
      opacity="0.4"
    />
    <circle
      cx="200"
      cy="200"
      r="185"
      stroke="#F15505"
      strokeWidth="0.4"
      opacity="0.3"
    />
    {Array.from({ length: 16 }).map((_, i) => {
      const a = ((i * 360) / 16) * (Math.PI / 180);
      const x1 = 200 + 160 * Math.cos(a),
        y1 = 200 + 160 * Math.sin(a);
      const x2 = 200 + 130 * Math.cos(a + 0.2),
        y2 = 200 + 130 * Math.sin(a + 0.2);
      const x3 = 200 + 130 * Math.cos(a - 0.2),
        y3 = 200 + 130 * Math.sin(a - 0.2);
      return (
        <path
          key={i}
          d={`M200,200 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 200,200`}
          stroke="#F15505"
          strokeWidth="0.7"
          fill="rgba(224,123,0,0.03)"
          opacity="0.5"
        />
      );
    })}
    {Array.from({ length: 8 }).map((_, i) => {
      const a = ((i * 360) / 8 + 22.5) * (Math.PI / 180);
      const x1 = 200 + 140 * Math.cos(a),
        y1 = 200 + 140 * Math.sin(a);
      const x2 = 200 + 105 * Math.cos(a + 0.35),
        y2 = 200 + 105 * Math.sin(a + 0.35);
      const x3 = 200 + 105 * Math.cos(a - 0.35),
        y3 = 200 + 105 * Math.sin(a - 0.35);
      return (
        <path
          key={i}
          d={`M200,200 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 200,200`}
          stroke="#f15505"
          strokeWidth="1"
          fill="rgba(224,123,0,0.05)"
          opacity="0.6"
        />
      );
    })}
    <circle
      cx="200"
      cy="200"
      r="110"
      stroke="#F15505"
      strokeWidth="0.8"
      opacity="0.35"
    />
    <circle
      cx="200"
      cy="200"
      r="90"
      stroke="#F15505"
      strokeWidth="0.4"
      strokeDasharray="3 5"
      opacity="0.3"
    />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = ((i * 360) / 12) * (Math.PI / 180);
      const x1 = 200 + 85 * Math.cos(a),
        y1 = 200 + 85 * Math.sin(a);
      const x2 = 200 + 62 * Math.cos(a + 0.28),
        y2 = 200 + 62 * Math.sin(a + 0.28);
      const x3 = 200 + 62 * Math.cos(a - 0.28),
        y3 = 200 + 62 * Math.sin(a - 0.28);
      return (
        <path
          key={i}
          d={`M200,200 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 200,200`}
          stroke="#F15505"
          strokeWidth="0.8"
          fill="rgba(224,123,0,0.06)"
          opacity="0.55"
        />
      );
    })}
    {Array.from({ length: 8 }).map((_, i) => {
      const a = ((i * 360) / 8) * (Math.PI / 180);
      return (
        <circle
          key={i}
          cx={200 + 70 * Math.cos(a)}
          cy={200 + 70 * Math.sin(a)}
          r="3"
          fill="#F15505"
          opacity="0.4"
        />
      );
    })}
    <circle
      cx="200"
      cy="200"
      r="50"
      stroke="#F15505"
      strokeWidth="1"
      opacity="0.4"
    />
    <circle
      cx="200"
      cy="200"
      r="36"
      stroke="#f15505"
      strokeWidth="0.6"
      opacity="0.35"
    />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = ((i * 360) / 8) * (Math.PI / 180);
      const x1 = 200 + 32 * Math.cos(a),
        y1 = 200 + 32 * Math.sin(a);
      const x2 = 200 + 22 * Math.cos(a + 0.4),
        y2 = 200 + 22 * Math.sin(a + 0.4);
      const x3 = 200 + 22 * Math.cos(a - 0.4),
        y3 = 200 + 22 * Math.sin(a - 0.4);
      return (
        <path
          key={i}
          d={`M200,200 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 200,200`}
          stroke="#F15505"
          strokeWidth="1"
          fill="rgba(224,123,0,0.1)"
          opacity="0.7"
        />
      );
    })}
    <circle cx="200" cy="200" r="8" fill="#F15505" opacity="0.35" />
    <circle cx="200" cy="200" r="4" fill="#F15505" opacity="0.5" />
  </svg>
);

const Chakra: React.FC<{ className?: string; color?: string }> = ({
  className,
  color = "#F15505",
}) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <circle
      cx="50"
      cy="50"
      r="46"
      stroke={color}
      strokeWidth="1.5"
      opacity="0.5"
    />
    <circle
      cx="50"
      cy="50"
      r="36"
      stroke={color}
      strokeWidth="0.8"
      opacity="0.4"
    />
    <circle
      cx="50"
      cy="50"
      r="10"
      stroke={color}
      strokeWidth="1.5"
      opacity="0.6"
    />
    <circle cx="50" cy="50" r="5" fill={color} opacity="0.4" />
    {Array.from({ length: 16 }).map((_, i) => {
      const a = ((i * 360) / 16) * (Math.PI / 180);
      return (
        <line
          key={i}
          x1={50 + 12 * Math.cos(a)}
          y1={50 + 12 * Math.sin(a)}
          x2={50 + 44 * Math.cos(a)}
          y2={50 + 44 * Math.sin(a)}
          stroke={color}
          strokeWidth="0.8"
          opacity="0.35"
        />
      );
    })}
    {Array.from({ length: 8 }).map((_, i) => {
      const a = ((i * 360) / 8 + 22.5) * (Math.PI / 180);
      const x1 = 50 + 38 * Math.cos(a),
        y1 = 50 + 38 * Math.sin(a);
      const x2 = 50 + 28 * Math.cos(a + 0.4),
        y2 = 50 + 28 * Math.sin(a + 0.4);
      const x3 = 50 + 28 * Math.cos(a - 0.4),
        y3 = 50 + 28 * Math.sin(a - 0.4);
      return (
        <path
          key={i}
          d={`M50,50 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 50,50`}
          stroke={color}
          strokeWidth="0.8"
          fill={`${color}10`}
          opacity="0.6"
        />
      );
    })}
  </svg>
);

/* ─── Main Component ─── */
const ItalyPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL} />
        <Mandala className={styles.heroBgMandalaR} />
        <div className={styles.heroContent}>
          {/* ── Plain image on the left ── */}
          <div className={styles.heroSilhouetteSide}>
            <img
              src={yogaimage.src}
              alt="Yoga Teacher Training In Germany"
              className={styles.heroSilhouette}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Italy</span>
            </h1>
            <a href="#content" className={styles.heroBtn}>
              Read More
            </a>
          </div>
        </div>
      </section>

      {/* ━━━━ CONTENT SECTION ━━━━ */}
      <section className={styles.contentSection} id="content">
        <Mandala className={styles.contentBgMandala} />
        <div className={styles.container}>
          <div className={styles.ornRow}>
            <span className={styles.ornL} />
            <span className={styles.ornSym}>❧</span>
            <span className={styles.ornL} />
          </div>

          <h2 className={styles.sectionTitle}>
            Discover The Best Yoga Association In Italy For Your Yoga Journey
          </h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#F15505" />
                <h4 className={styles.cardTitle}>
                  Begin Your Transformative Yoga Journey With AYM In Italy
                </h4>
              </div>
              <p className={styles.bodyText}>
                Embarking On A Yoga Journey Is About Much More Than Just
                Physical Fitness; It's A Transformative Experience That Has
                Touched The Lives Of Countless Individuals Worldwide. Despite
                The Common Myths Surrounding Yoga – Like The Belief That It's
                Only For The Flexible Or Athletically Inclined — Anyone Can
                Practice And Benefit From It. At The Association For Yoga And
                Meditation In Italy, We Invite You To Delve Deep Into The True
                Essence Of Yoga, Experiencing Its Rich History And Traditions
                Firsthand. Our Immersive 200-Hour Yoga Teacher Training In Italy
                Is Designed To Provide You With The Fundamental Knowledge,
                Skills, And Confidence Necessary To Develop Your Own Practice
                And Carve Out A Rewarding Career In Yoga.
              </p>
            </div>
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Why Choose ── */}
          <h3 className={styles.subTitle}>
            Why Choose Our 200-Hour Yoga Teacher Training Course In Italy?
          </h3>
          <p className={styles.bodyText}>
            When Searching For "Yoga Teacher Training Near Me," You'll Encounter
            Multiple Options – But What Sets Us Apart? At The Association For
            Yoga And Meditation, Our Program Emphasizes The Eight Limbs Of
            Ashtanga Yoga, Which Encompasses Philosophy, Pranayama (Breath
            Control), Meditation Techniques, And, Of Course, Asana Practice.
          </p>
          <p className={styles.bodyText}>
            Whether You're A Complete Beginner Or Looking To Refine Your
            Teaching Techniques, Our Nurturing Environment Supports Your Growth.
            Our Accomplished Yoga Instructors In Italy Are Passionate About
            Guiding You Through This Life-Changing Journey And Are Here To
            Answer Any Questions You May Have.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── AYM Stand Out ── */}
          <h3 className={styles.subTitle}>
            What Makes AYM Yoga School Stand Out?
          </h3>
          <p className={styles.bodyText}>
            At The Association For Yoga And Meditation In Italy, We Pride
            Ourselves On Being A Premier Provider Of Yoga Teacher Training. Our
            Courses Are Deeply Rooted In The Authentic Indian Yogic Tradition,
            And We Have A Wealth Of Experience Welcoming Students From Across
            The Globe To Our Esteemed YTT Programs.
          </p>
          <p className={styles.bodyText}>
            Our Teaching Team Consists Of A Thoughtful Blend Of Experienced Yoga
            Practitioners Who Uphold Diverse Traditions, Ensuring You Receive
            Top-Tier Instruction. We Focus On Providing Holistic And Insightful
            Education To Help You Elevate Your Yoga Practice.
          </p>

          {/* ── AYM Difference ── */}
          <h3 className={styles.subTitle}>
            The AYM Difference: Why We're The Best Choice For You
          </h3>
          <p className={styles.bodyText}>
            At AYM, We Strive To Create A Dynamic And Uplifting Space For
            Personal Growth, Mindfulness, And Relaxation. Here Are Some Reasons
            Why Our Yoga Teacher Certification Courses Will Suit You Best:
          </p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>
                <strong>Comprehensive Understanding:</strong> You'll Explore The
                Depths Of Yogic Philosophy And The Lifestyle That Accompanies
                It.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>
                <strong>Skill Advancement:</strong> Whether It's In Asanas,
                Pranayama, Or Meditation, Our Curriculum Aims To Elevate Your
                Skills.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>
                <strong>Supportive Community:</strong> Our Non-Competitive
                Environment Fosters Growth, Where You Can Thrive Alongside
                Fellow Students.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}>
                <strong>Anatomically Safe Practices:</strong> We Ensure All
                Courses Are Designed To Be Safe And Accessible For Every
                Participant.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}>
                <strong>Teaching Others:</strong> Our Courses Prepare You To
                Share The Gift Of Yoga, Helping Others Pursue A Life Of
                Fulfillment And Joy.
              </p>
            </div>
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Prepare Tips ── */}
          <h3 className={styles.subTitle}>
            Prepare For Your Yoga Journey: Tips For Success
          </h3>
          <p className={styles.bodyText}>
            Dreaming Of Becoming A Successful Yoga Teacher? Preparing For A Yoga
            Instructor Certification With Us Requires Both Dedication And The
            Right Mindset. Here Are Some Key Tips To Set You Up For Success:
          </p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>
                <strong>Read Books:</strong> Familiarize Yourself With
                Foundational Texts Such As "Autobiography Of A Yogi" By
                Paramahansa Yogananda And "Light On Yoga" By B.K.S. Iyengar.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>
                <strong>Be Physically & Mentally Prepared:</strong> Both
                Dimensions Are Crucial; Follow A Balanced Fitness Routine,
                Maintain Healthy Eating Habits, And Reflect On Your Training
                Experiences.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>
                <strong>Practice Daily:</strong> Commit To A Daily Yoga Practice
                To Enhance Your Abilities And Gain Insights Into Your Personal
                Strengths And Areas For Growth.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}>
                <strong>Nourish Your Body:</strong> Adopting A Sattvic Diet –
                Rich In Fresh Fruits, Whole Grains, And Legumes – Will Help
                Align Your Body And Mind With Your Yoga Training.
              </p>
            </div>
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Course Details ── */}
          <h3 className={styles.subTitle}>
            Course Details At The Association For Yoga And Meditation In Italy
          </h3>
          <p className={styles.bodyText}>
            Our Curriculum Is Thoughtfully Structured To Include A Variety Of
            Topics, From The History And Philosophy Of Yoga To Ashtanga
            Practices And Teaching Methodologies. Participants Will Also Engage
            In Workshops, Learn To Effectively Use Props, And Develop Their
            Teaching Skills Through Practical Assignments. As A Certified Yoga
            Teacher Training Course, We Empower You With The Confidence To Share
            Yoga With Others.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Global Certification ── */}
          <h3 className={styles.subTitle}>
            Achieve Global Certification As A Yoga Instructor
          </h3>
          <p className={styles.bodyText}>
            What Truly Sets Our Program Apart Is Our Globally Recognized
            Certification. Upon Completion, You'll Be Equipped To Teach Yoga
            Anywhere In The World, Carrying With You The Pride Of Being A
            Qualified Instructor Certified Through Our Esteemed Program In
            Italy.
          </p>

          {/* ── Course Fee ── */}
          <h3 className={styles.subTitle}>AYM Course Fee Overview</h3>
          <p className={styles.bodyText}>
            As A Registered Yoga Teacher Training Course, We Provide You With
            Relevant Tools And Techniques To Transition Into A Successful Yoga
            Teaching Career. Our Program Includes 23 Nights Of Accommodation,
            Nutritious Meals, Weekend Excursions, And Access To Resources Like
            Wi-Fi And Movie Nights To Enhance Your Learning Experience.
          </p>
          <p className={styles.bodyText}>
            It's Important To Note That Extra Class Expenses, Personal Needs,
            And Transport Costs Are Not Covered By The Course Fee, And Refunds
            Are Not Offered After Registration. Embark On A Fulfilling Journey
            Toward Inner Peace And Joy Through Our Yoga Training.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Begin Journey ── */}
          <h3 className={styles.subTitle}>
            Begin Your Journey As A Professional Yoga Teacher At AYM
          </h3>
          <p className={styles.bodyText}>
            Dive Into One Of The Most Exemplary Yoga Teacher Training
            Experiences In Italy. At AYM, We're Dedicated To Helping You Connect
            With The Profound World Of Yoga – Shaping You Into A Successful,
            Globally Recognized Instructor. Graduates Receive The Prestigious
            International Yoga Certification, Accredited By The International
            Yoga Association, Empowering You To Launch Your Career As A Yoga
            Teacher In Any Corner Of The Globe.
          </p>
          <p className={styles.bodyText}>
            Start Your Transformative Journey With Us Today And Unlock Your
            Potential As A Passionate Yoga Instructor!
          </p>

          <div className={styles.ornRow} style={{ marginTop: "2rem" }}>
            <span className={styles.ornL} />
            <span className={styles.ornSym}>❧</span>
            <span className={styles.ornL} />
          </div>
        </div>
      </section>
      <AymHomePage />
    </div>
  );
};

export default ItalyPage;

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
const NepalPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL} />
        <Mandala className={styles.heroBgMandalaR} />
        <div className={styles.heroContent}>
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
              200 Hour Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Nepal</span>
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
            Yoga Teacher Training In Nepal
          </h2>

          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#F15505" />
                <h4 className={styles.cardTitle}>
                  AYM Yoga School – Leading Yoga Institute In Nepal
                </h4>
              </div>
              <p className={styles.bodyText}>
                AYM Yoga School Is A Leading Yoga Institute In Nepal That Offers
                Transformative Yoga Teacher Training. Nestled In The Serene
                Himalayas, Our School Provides Certified Yoga In Nepal, Focusing
                On Authenticity And Spiritual Growth. We Offer A Variety Of Yoga
                Courses In Nepal, Including 200-Hour Yoga Teacher Training And
                Advanced Yoga Teacher Training. At AYM, You'll Receive An
                Internationally Recognised Yoga Certification In Nepal, A
                Testament To The Quality And Credibility Of Our Training, Guided
                By Experienced Teachers.
              </p>
            </div>
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Benefits ── */}
          <h3 className={styles.subTitle}>
            Benefits Of Yoga Teacher Training In Nepal
          </h3>

          <div className={styles.numberedList}>
            {[
              {
                bold: "Spiritual Growth And Self-Discovery:",
                text: "Nepal, With Its Rich Spiritual Heritage, Provides An Ideal Setting For Deepening Your Practice And Gaining A Deeper Understanding Of Yoga's Spiritual Aspects.",
              },
              {
                bold: "Stunning Natural Environment:",
                text: "The Serene And Majestic Backdrop Of The Himalayas Offers A Peaceful And Rejuvenating Environment For Yoga Practice And Self-Reflection.",
              },
              {
                bold: "Authentic Learning Experience:",
                text: "Immerse Yourself In The Birthplace Of Yoga And Learn From Experienced Instructors Who Embody The Rich Traditions And Philosophy Of Yoga.",
              },
              {
                bold: "Community And Connection:",
                text: "Connect With Like-Minded Individuals In A Supportive And Inclusive Community, Fostering Personal And Professional Relationships That Extend Beyond The Training.",
              },
              {
                bold: "Cultural Immersion:",
                text: "Experience Nepal's Vibrant And Diverse Culture, Enriching Your Journey With New Perspectives And Insights.",
              },
              {
                bold: "Teaching Skill Development:",
                text: "Gain Comprehensive Training In Asana, Pranayama, Meditation, Anatomy, And Teaching Methodology, Equipping You With The Skills To Become A Confident And Effective Yoga Teacher.",
              },
            ].map((item, i) => (
              <div key={i} className={styles.numberedItem}>
                <span className={styles.numBadge}>{i + 1}</span>
                <p className={styles.bodyText}>
                  <strong>{item.bold}</strong> {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Why AYM ── */}
          <h3 className={styles.subTitle}>
            Why Should You Opt For A Yoga Teacher Training Course From AYM Yoga
            School In Nepal?
          </h3>

          <div className={styles.numberedList}>
            {[
              {
                bold: "Authentic Learning Experience:",
                text: "Nepal, As The Birthplace Of Yoga, Offers An Unparalleled Opportunity To Learn From Experienced Instructors Deeply Rooted In Yoga's Rich Traditions And Philosophy.",
              },
              {
                bold: "Serene Himalayan Setting:",
                text: "Immerse Yourself In The Natural Beauty Of Nepal's Himalayas, Providing A Peaceful And Rejuvenating Environment For Deepening Your Practice And Self-Discovery.",
              },
              {
                bold: "Spiritual And Cultural Immersion:",
                text: "Connect With Nepal's Spiritual And Cultural Heritage, Gaining A Profound Understanding Of Yoga's Roots While Experiencing The Vibrant And Diverse Local Culture.",
              },
              {
                bold: "Community And Support:",
                text: "Join A Supportive And Inclusive Community Of Like-Minded Individuals, Fostering Personal Growth, Lifelong Connections, And A Sense Of Belonging.",
              },
              {
                bold: "Comprehensive Training:",
                text: "Receive Comprehensive Training In Yoga Philosophy, Asana, Pranayama, Meditation, Anatomy, And Teaching Methodology, Equipping You With The Knowledge And Skills To Become A Confident And Effective Yoga Teacher.",
              },
              {
                bold: "Transformative Journey:",
                text: "Embark On A Transformative Journey Of Self-Discovery, Personal Growth, And Holistic Well-Being, Guided By The Ancient Wisdom And Practices Of Yoga In A Setting That Inspires Mindfulness And Introspection.",
              },
            ].map((item, i) => (
              <div key={i} className={styles.numberedItem}>
                <span className={styles.numBadge}>{i + 1}</span>
                <p className={styles.bodyText}>
                  <strong>{item.bold}</strong> {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Overview ── */}
          <h3 className={styles.subTitle}>
            Overview Of Our Extensive Yoga Teacher Training Course In Nepal
          </h3>
          <p className={styles.bodyText}>
            At The Association For Yoga And Meditation In Nepal, Our Yoga
            Teacher Certification Courses Are Masterfully Designed And Upgraded,
            Keeping Both Traditional And Modern Yogic Knowledge In Mind. With A
            Team Of Highly Experienced Individuals, We Introduce Our Students To
            Every Aspect Of Yoga. From Understanding Human Anatomy To Human
            Physiology And More – We Train Individuals Entirely.
          </p>
          <p className={styles.bodyText}>
            Our Extensive YTT Course In Nepal Covers Different Chapters And
            Topics That Are Categorized Under Mastering The Asanas, Yoga
            Philosophy, Meditation And Mantra Chanting, Pranayama, And Ayurveda.
            Assignments And Activities Would Be Conducted From Time To Time
            Alongside Presentations Before The International Yoga Certification
            Is Handed Over. Moreover, Our Yoga Teacher Training Program Will
            Instruct You On How To Deal With Students In Real Professional Life
            And Build A Fulfilling Career.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Prepare Yourself ── */}
          <h3 className={styles.subTitle}>
            Prepare Yourself To Be A Part Of Our Advanced Yoga Teacher Training
            Course
          </h3>
          <p className={styles.bodyText}>
            We, As The Top-Rated Yoga Teacher Training Course Provider, Do Not
            Demand Anyone Have Any Prior Training Or Knowledge. However, We
            Recommend Our Students Be Prepared Beforehand So That It Becomes
            Easier For Them To Understand The Aspects Of Yoga. Therefore, A Few
            Things That We Suggest Include:
          </p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>
                <strong>Reading Books Related To Yoga:</strong> We Expect Our
                Students To Read Some Yoga Literature So That They Understand
                Where Yoga Originated And To Which Status It Lies Today. When
                You Read The Books, It Will Foster Your Learning Experience And
                Encourage Them To Seek A 500 Hour Yoga Teacher Training Course
                In Nepal.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>
                <strong>Mental And Physical Preparation:</strong> We Believe
                When Our Students Are Mentally And Physically Prepared To Take
                The Yoga Teacher Training Course, It Helps Them To Face The
                Challenges And Practice Yoga Themselves On A Serious Note. Also,
                It Helps To Understand How The World Of Yoga Works, Besides
                Making It Easier For Them To Attend The Classes And Stay
                Motivated Throughout.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>
                <strong>Following Yogic Food Diet:</strong> Also, We Suggest Our
                Fellow Students Follow A Complete Yogic Food Diet That May
                Include Fresh Organic Fruits And Vegetables, Beans, Lentils,
                Plant-Based Oils, Clarified Butter, Nuts, And Whole Grains. By
                Doing This, We Believe Our Students Will Transfer To A Healthy
                Lifestyle Before Becoming Educators Themselves.
              </p>
            </div>
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Premium Rates ── */}
          <h3 className={styles.subTitle}>
            Premium Rated Yoga Training Course Programme At Affordable Rates
          </h3>
          <p className={styles.bodyText}>
            As The Leading Yoga Training Centre In Nepal, We Offer Yoga Teacher
            Training Courses To Students At Highly Affordable Rates. Our
            Students Can Expect To Get 23 Nights Of Private Accommodation During
            The Course With Three Times Daily Nutritious Meals. We Also Offer
            Weekend Excursions, Movie Nights And Free Internet To The Students
            For Added Convenience.
          </p>
          <p className={styles.bodyText}>
            Besides That, Our Students Do Not Need To Worry About Buying Any
            Yoga Or Study Materials As We Have Included Everything In The Course
            Program Fees Themselves. However, Students Must Know That We Do Not
            Take Extra Class Expenses, Transportation, Medical And Personal
            Expenses Into Consideration. Once The Course Program Is Booked, We
            Offer A Complimentary Yoga Workshop Based On Pre-Recorded And Live
            Classes To The Students.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Refund Policy ── */}
          <h3 className={styles.subTitle}>Refund Policy</h3>
          <p className={styles.bodyText}>
            The Refund Policy For Our Yoga Teacher Training Program In Nepal Is
            As Follows:
          </p>

          <div className={styles.numberedList}>
            {[
              "Refund Requests Made More Than 60 Days Before The Start Of The Program Are Eligible For A Full Refund Minus An Administrative Fee.",
              "Refund Requests Made Between 30 And 60 Days Before The Start Of The Program Are Eligible For A 50% Refund.",
              "Refund Requests Made Less Than 30 Days Before The Start Of The Program Are Not Eligible For A Refund.",
              "We Will Allow You To Join The Course In The Future In The Event Of Unforeseen Circumstances Or Emergencies.",
            ].map((item, i) => (
              <div key={i} className={styles.numberedItem}>
                <span className={styles.numBadge}>{i + 1}</span>
                <p className={styles.bodyText}>{item}</p>
              </div>
            ))}
          </div>

          <p className={styles.bodyText}>
            Please Note That All Refund Requests Must Be Submitted In Writing To
            Our Administration Team. We Strive To Ensure Fairness And
            Transparency In Handling Refund Requests While Considering The
            Commitments And Resources Involved In Organizing Our Program.
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

export default NepalPage;

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
const HongKongPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL} />
        <Mandala className={styles.heroBgMandalaR} />
        <div className={styles.heroContent}>
          {/* ── Plain image on the left (Germany style) ── */}
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
              <span className={styles.heroTitleAccent}>Hong Kong</span>
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
            Yoga Teacher Training Hong Kong
          </h2>

          {/* ── Card: Get A Closer View ── */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#F15505" />
                <h4 className={styles.cardTitle}>
                  Get A Closer View Of The Yoga Teacher Training Program In Hong
                  Kong
                </h4>
              </div>
              <p className={styles.bodyText}>
                Yoga Has Experienced A Considerable Increase In Popularity In
                Recent Years. Everybody Around The World Is Learning About Its
                Benefits And The Way It Promotes A Balanced Life. Many Think It
                Is Simply Flexing And Stretching The Body, But It Is Not. The
                Yoga Teacher Training Course Program In Hong Kong That We
                Provide At The Association For Yoga And Meditation Offers A
                Clear Understanding Of It. Anyone Who Wants To Learn Yoga Or
                Share Knowledge With Others By Becoming A Yoga Teacher In Hong
                Kong Can Choose Our 500-Hour Yoga Teacher Training Program. Our
                Yoga Centre Has Been Recognized For Maintaining The Global
                Standard Of Excellence And Has Made The Course Accessible To
                Students At All Skill Levels. With Us, You Can Get The Chance To
                Become Your Authentic Self And Be Around Like-Minded Individuals
                Whom You Can Grow And Nurture With Time.
              </p>
            </div>
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Rely On Us ── */}
          <h3 className={styles.subTitle}>
            Rely On Us For A Smooth Yogic Journey At AYM
          </h3>
          <p className={styles.bodyText}>
            If You Live In Hong And Cannot Wait To Discover Yourself Alongside
            The Rest Of The World, Then Our Yoga Teacher Training Course In Hong
            Is What You Need. We Offer Complete Yoga Courses In Rishikesh To
            Students From All Across The World. From Assisting Our Students With
            Booking Their Flight Tickets To Arranging Accommodation And Serving
            Heartwarming Meals Three Times A Day – We Take Care Of Everything.
          </p>
          <p className={styles.bodyText}>
            All You Need To Do Is Make Up Your Mind To Take Up The 500-Hour Yoga
            Teacher Training Course In Hong Kong And Be Among Those Who Live A
            Balanced Lifestyle. At Our Yoga Centre, You Will Get To Feel Nature
            And Its Positive Impact On Yourself In The Best Way. Our Teachers
            Have Dealt With International Students Before So That You Will Be
            Well-Cared For At Our Institution.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── 500 Hour ── */}
          <h3 className={styles.subTitle}>
            Know Why 500-Hour Yoga Teacher Training Course In Hong Kong Is An
            Excellent Choice
          </h3>
          <p className={styles.bodyText}>
            Suppose You Have Always Dream Of Pursuing A Career As A Yoga
            Instructor. In That Case, We At The Association For Yoga And
            Meditation Offer The Best Yoga Teacher Training Therapy Course
            Program In Hong Kong. Through Our Courses, You Will Not Only Be
            Offered The Knowledge And Abilities To Enhance Your Practice But
            Also Gain The Confidence To Pursue Your Goals In The Same Career.
          </p>
          <p className={styles.bodyText}>
            We Assist You From The Very Start, Including Introducing You To
            Yogic Knowledge, Familiarizing You With Your Individuality And
            Diversifying Your Practice. Our 500-Hour Yoga Teacher Training
            Program In Hong Kong Will Help You Develop Your Practice While
            Learning About Yoga In A Tranquil Setting. You Can Engage With
            Like-Minded People, Develop Your Teaching Style, And Learn To
            Believe In Yourself. With Us, You Get A Chance To Step Into A New
            Era Of Development And Transformation.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Advantages ── */}
          <h3 className={styles.subTitle}>
            What Are The Advantages Of Our YTT Certification Courses At AYM?
          </h3>
          <p className={styles.bodyText}>
            After You Enroll In Our 500-Hour Course Program Of Yoga Teacher
            Training In Hong Kong – You Will Have To Qualify For The
            Certificate. At The Association For Yoga And Meditation, We Will
            Teach You Increasingly Challenging Poses And Help You Face Every
            Obstacle Quickly. We Assist You In Becoming Familiar With Both
            Modern And Contemporary Yogic Knowledge. But That's Not The Entire
            Thing.
          </p>
          <p className={styles.bodyText}>
            Our 200 Hour, 300 Hour And 500 Yoga Teacher Training Courses In Hong
            Kong Will Expose You To A Caring Environment Where Your Natural
            Capacity For Acceptance And Open-Mindedness Will Increase. Training
            Under Skilled Yoga Teachers Will Significantly Increase Your
            Capacity To Explore Your Mind More Fully And Allow You To Reach Your
            Full Potential. The Most Significant Benefit Of 500 Yoga Teacher
            Training Is That It Will Allow You To Continue Doing What You Love
            While Earning Money. Moreover, You Can Continue Your Career From Any
            Corner Of The World, Not Just Hongkong.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Facilities ── */}
          <h3 className={styles.subTitle}>
            What Facilities Do We Offer In Our Yoga Teacher Training Course
            Programme in Hong Kong?
          </h3>
          <p className={styles.bodyText}>
            The Yoga Teacher Training Course Program In Hongkong That We Offer
            Has Various Facilities That Make Life Easier But Are Also Vital To
            Overcoming Any Challenge. To Be Precise, Some Of The Facilities
            Include The Following.
          </p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>
                We Must Arrange Flight Tickets From Hong Kong And Manage Foreign
                Students Visas.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>
                We Offer Comfortable And Peaceful Accommodations To The
                Students.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>
                Our Students Will Get Meals Thrice A Day That Would Be Organic
                And Completely Healthy.
              </p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}>
                We Offer The Study Materials That May Be Required During The
                Completion Of The Course Program.
              </p>
            </div>
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Internationally Recognised ── */}
          <h3 className={styles.subTitle}>
            Transform Yourself Into An Internationally-Recognised Yoga
            Instructor
          </h3>
          <p className={styles.bodyText}>
            At The Association For Yoga And Meditation, We Offer Certifications
            To All Of Our Learners, Which Is Another Feature That Distinguishes
            Our Yoga Therapy Teacher Training In Hong Kong From Others. The
            Finest Thing Is That The Certificate Is Recognized All Over The
            World. After Completing Our Program, You Will Be Qualified To Begin
            Teaching Yoga Classes Worldwide. Thanks To This YTT Certification In
            Hong Kong, That Allows You To Feel The Sense Of Accomplishment Of
            Becoming Certified To Teach Anywhere And Anytime.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Reasonable Costs ── */}
          <h3 className={styles.subTitle}>
            Learn Yoga And Earn A Reputable Yoga Teaching Credential At
            Reasonable Costs
          </h3>
          <p className={styles.bodyText}>
            We At The Association For Yoga And Meditation Ensure That Everyone
            Has The Chance To Understand Their True Potential Without Even
            Needing To Go Beyond Their Financial Budget. This Is Why We Offer
            YTT In Hongkong At Highly Reasonable Rates Ensuring You Gain Optimal
            Knowledge. We Ensure That Everyone Has A Healthy Life And Knows The
            Yogic Benefits. Also, We Ensure That Every Student Who Pays The
            Course Cost Receives Yoga Study Materials, Wholesome Meals, Lodging,
            And Other Practice Facilities. Moreover, We Offer A Peaceful And
            Calm Environment For The Students To Feel Tranquillity In Their
            Souls. However, The Students Should Also Be Aware That There Is No
            Opportunity For A Refund After Enrolling In Our Yoga Therapy Teacher
            Training Program In Hongkong.
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

export default HongKongPage;

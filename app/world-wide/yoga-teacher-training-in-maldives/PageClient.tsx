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
const MaldivesPage: React.FC = () => {
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
              <span className={styles.heroTitleAccent}>Maldives</span>
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
            Yoga Teacher Training Maldives
          </h2>

          {/* ── Card: Leading Hub ── */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#F15505" />
                <h4 className={styles.cardTitle}>
                  Leading Hub For Yoga Teacher Training In Maldives
                </h4>
              </div>
              <p className={styles.bodyText}>
                If You Live In The Maldives And Have Developed The Curiosity To
                Learn Yoga, Then We At The Association For Yoga And Meditation
                Are The Best Place To Be. Our Yoga Centre Is At Rishikesh, Where
                We Offer Exclusive 200, 300, And 500-Hour Yoga Teacher Training
                Courses To The Students. With A Group Of Highly Knowledgeable
                And Well-Experienced Yoga Instructors, We Assist You In Learning
                The Aspects Of Yoga So That Happiness And Well-Being Can Be
                Achieved. Our Yoga Teacher Training Program In The Maldives Is
                Ideal For Anyone Who Seeks To Enlighten Themselves With The
                Knowledge Of Yoga, Besides Those Who Is Looking Forward To
                Developing A Career Out Of It.
              </p>
            </div>
          </div>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Facilities ── */}
          <h3 className={styles.subTitle}>
            What Facilities Do We Offer To Our Students Through The Courses?
          </h3>

          <p className={styles.bodyText}>
            When You Choose To Take Up The 200-Hour Yoga Teacher Training
            Program In The Maldives, You Will Not Have To Worry About Finding
            Food Or Lodging Because Everything Will Be Taken Care Of For You
            According To Your Preference At Our Rishikesh Centre. When You Leave
            For The Training Course, The Rooms Will Be Cleaned And Sanitized
            Everyday To Ensure Your Hygiene Is Not Compromised.
          </p>

          <p className={styles.bodyText}>
            After That, You Will Also Receive Vegetarian Meals That Would Be
            High In Nutritional Value Thrice A Day. The Meals Offered Would Be
            Well Prepared, Packed And Served. In Addition To Having Access To
            Clean, Filtered Water And Herbal Teas, Students Taking Up Registered
            Yoga Teacher Training Courses In The Maldives Will Get To Utilize
            Free Wifi. Furthermore, You Will Get A Chance To Live In A
            Non-Judgmental Environment Around Like-Minded People Who Will
            Respect The Cultural Differences And Diverse Opinions Of Each Other.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── 300 Hour ── */}
          <h3 className={styles.subTitle}>
            What Makes Our 300-Hour Yoga Teacher Training In Maldives Unique?
          </h3>

          <p className={styles.bodyText}>
            At The Association For Yoga And Meditation, Our 300-Hour Yoga
            Teacher Training Certification Program Near Me Has A Well-Researched
            Curriculum That Sets It Apart From The Rest. The Courses Are Run By
            Our Team Of Experienced And Real-Life Yoga Trainers Who Have The
            Bursting Energy To Welcome People From All Over The World And
            Enlighten Them With The Knowledge Of Yoga.
          </p>

          <p className={styles.bodyText}>
            Choosing Our 200-Hour Yoga Teacher Training Program In The Maldives
            Will Mark The Start Of A Trip That Provides Entirely New Prospects
            In One's Life. As A Student, You Can Expect To Delve Deeper Into The
            History Of Yoga And Discover New Aspects. Besides Providing
            Practical Training, We Offer Theoretical Knowledge To Students
            Through Our Registered Yoga Teacher Therapy Training Courses In The
            Maldives.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── International Certification ── */}
          <h3 className={styles.subTitle}>
            Pursue The International Yoga Teacher Certification At AYM
          </h3>

          <p className={styles.bodyText}>
            If You Live In The Maldives And Are Interested In Yoga And
            Meditation, You Should Get In Touch With Us. Our Yoga Centre In
            Rishikesh Has Been Set Up To Offer Extensive Course Programs Per The
            Students' Preferences. Rishikesh Was Chosen As The Location For
            Registered Yoga Teacher Training Courses Because Of The Serenity And
            Divine Spirituality It Offers. The Peaceful Environment And Lush
            Green Nature Give Students A Chance To Heal And Grow.
          </p>

          <p className={styles.bodyText}>
            During The Course, You Will Be Brought Closer To Nature And Trained
            In Different Yoga And Meditation Practices. Also, Various Tests,
            Assessments And Other Types Of Educational Programs Would Be
            Conducted During The 500-Hour Yoga Teacher Training Course In The
            Maldives. All This Is Done To Improve Your Existing Skills And Mould
            You Into A Real Professional. Once You Are Done With The Training,
            You Will Qualify To Receive The YTT International Certification.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>❦</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Understand Courses ── */}
          <h3 className={styles.subTitle}>
            Understand About Our Yoga Courses Briefly
          </h3>

          <p className={styles.bodyText}>
            We At Association For Yoga And Meditation Offer Comprehensive Yoga
            Teacher Training Course In The Maldives That Starts With
            Understanding Human Anatomy And Ends With The Latest Yogic
            Approaches. The Yoga Instructors Will Teach You Yogic Mantras,
            Various Breathing Techniques, Postures, Prayers And Whatnot.
            Students Are Made Flexible To Do Different Yoga Poses And Learn The
            History Of It As Well. Both Practical And Theoretical Tests Are
            Conducted Alongside Weekly Assessments, Weekend Excursions And More.
            Once You Qualify, You Will Become Eligible For The YTT Certification
            In The Maldives, Which Is Widely Regarded As One Of The Most
            Renowned Yoga Certificates. The Best Part About Our Certificates Is
            That It Is Accessible Anywhere In The World. As A Student, You Will
            Be Healed From Your Ailments Before You Are Prepared To Become A
            Professional.
          </p>

          {/* ── Dietary / Chakra Card ── */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#F15505" />
                <h4 className={styles.cardTitle}>
                  Keep Yourself Healthy With Nutritional Supplements And Manage
                  A Yogic Lifestyle
                </h4>
              </div>
              <p className={styles.bodyText}>
                When You Come To Us At Rishikesh To Enroll In A Yoga Teacher
                Training Course Program Near Me - You Will Soon Find Yourself
                Healing Spiritually, Mentally And Physically. Your Mind And
                Body's Capacity To Focus Will Get Enhanced With Time And You
                Will Find Yourself Taking More Care Of Your Well-Being.
              </p>
            </div>
          </div>

          <p className={styles.bodyText}>
            As You Continue To Study Yogic Philosophy At AYM By Taking Up A
            300-Hour Yoga Teacher Training Course Program, You Will Begin To
            Think, Eat, And Sleep More Like A Yogi. When Talking About Eating Or
            Food, You Will Not Have To Worry About A Thing. This Is Because We
            Take Complete Care Of Our Students By Providing Them With
            Nutritional, Organic And Hygienic Food Thrice A Day. We Understand
            How Our Physical Health Is Important Besides Emotional Health.
            During Our YTT Course In The Maldives, We Discuss Nutrition On A
            Much Wider Scale So That You Understand How Eating Balances Life.
          </p>

          <div className={styles.miniOm}>
            <span className={styles.ornLm} />
            <span className={styles.omT}>ॐ</span>
            <span className={styles.ornLm} />
          </div>

          {/* ── Renowned ── */}
          <h3 className={styles.subTitle}>
            Become A Renowned Yoga Instructor Around The World
          </h3>

          <p className={styles.bodyText}>
            After Completing The Course You Will Be Awarded The International
            Yoga Teacher Training Certification That Is Globally Recognized.
            With It, You Can Either Get A Job Anywhere In The World Or Start
            Your Yoga Classes If You Have Always Dreamt Of One.
          </p>

          <p className={styles.bodyText}>
            On The Other Hand, You Will Feel Successful Once You Complete Our
            Certified Yoga Teacher Training Program In The Maldives, But You
            Might Still Want To Further Your Study And Advance As A Yoga
            Instructor. As Learning Is A Lifelong Endeavor - We Support Students
            Entirely. Even If You Have Teaching Obligations, You Can Continue
            Learning With Us.
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

export default MaldivesPage;

"use client"
import React from "react";
import styles from "@/assets/style/world-wide/yoga-teacher-training-in-vietnam/Vietnampage.module.css";

/* ─── SVG Decorations ─── */
const Mandala: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="none">
    <circle cx="200" cy="200" r="195" stroke="#e07b00" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.4"/>
    <circle cx="200" cy="200" r="185" stroke="#e07b00" strokeWidth="0.4" opacity="0.3"/>
    {Array.from({length:16}).map((_,i)=>{
      const a=(i*360/16)*(Math.PI/180);
      const x1=200+160*Math.cos(a),y1=200+160*Math.sin(a);
      const x2=200+130*Math.cos(a+0.2),y2=200+130*Math.sin(a+0.2);
      const x3=200+130*Math.cos(a-0.2),y3=200+130*Math.sin(a-0.2);
      return <path key={i} d={`M200,200 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 200,200`} stroke="#e07b00" strokeWidth="0.7" fill="rgba(224,123,0,0.03)" opacity="0.5"/>;
    })}
    {Array.from({length:8}).map((_,i)=>{
      const a=(i*360/8+22.5)*(Math.PI/180);
      const x1=200+140*Math.cos(a),y1=200+140*Math.sin(a);
      const x2=200+105*Math.cos(a+0.35),y2=200+105*Math.sin(a+0.35);
      const x3=200+105*Math.cos(a-0.35),y3=200+105*Math.sin(a-0.35);
      return <path key={i} d={`M200,200 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 200,200`} stroke="#c46a00" strokeWidth="1" fill="rgba(224,123,0,0.05)" opacity="0.6"/>;
    })}
    <circle cx="200" cy="200" r="110" stroke="#e07b00" strokeWidth="0.8" opacity="0.35"/>
    <circle cx="200" cy="200" r="90" stroke="#e07b00" strokeWidth="0.4" strokeDasharray="3 5" opacity="0.3"/>
    {Array.from({length:12}).map((_,i)=>{
      const a=(i*360/12)*(Math.PI/180);
      const x1=200+85*Math.cos(a),y1=200+85*Math.sin(a);
      const x2=200+62*Math.cos(a+0.28),y2=200+62*Math.sin(a+0.28);
      const x3=200+62*Math.cos(a-0.28),y3=200+62*Math.sin(a-0.28);
      return <path key={i} d={`M200,200 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 200,200`} stroke="#e07b00" strokeWidth="0.8" fill="rgba(224,123,0,0.06)" opacity="0.55"/>;
    })}
    {Array.from({length:8}).map((_,i)=>{
      const a=(i*360/8)*(Math.PI/180);
      return <circle key={i} cx={200+70*Math.cos(a)} cy={200+70*Math.sin(a)} r="3" fill="#e07b00" opacity="0.4"/>;
    })}
    <circle cx="200" cy="200" r="50" stroke="#e07b00" strokeWidth="1" opacity="0.4"/>
    <circle cx="200" cy="200" r="36" stroke="#c46a00" strokeWidth="0.6" opacity="0.35"/>
    {Array.from({length:8}).map((_,i)=>{
      const a=(i*360/8)*(Math.PI/180);
      const x1=200+32*Math.cos(a),y1=200+32*Math.sin(a);
      const x2=200+22*Math.cos(a+0.4),y2=200+22*Math.sin(a+0.4);
      const x3=200+22*Math.cos(a-0.4),y3=200+22*Math.sin(a-0.4);
      return <path key={i} d={`M200,200 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 200,200`} stroke="#e07b00" strokeWidth="1" fill="rgba(224,123,0,0.1)" opacity="0.7"/>;
    })}
    <circle cx="200" cy="200" r="8" fill="#e07b00" opacity="0.35"/>
    <circle cx="200" cy="200" r="4" fill="#e07b00" opacity="0.5"/>
  </svg>
);

const Chakra: React.FC<{ className?: string; color?: string }> = ({ className, color="#e07b00" }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
    <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <circle cx="50" cy="50" r="36" stroke={color} strokeWidth="0.8" opacity="0.4"/>
    <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <circle cx="50" cy="50" r="5" fill={color} opacity="0.4"/>
    {Array.from({length:16}).map((_,i)=>{
      const a=(i*360/16)*(Math.PI/180);
      return <line key={i} x1={50+12*Math.cos(a)} y1={50+12*Math.sin(a)} x2={50+44*Math.cos(a)} y2={50+44*Math.sin(a)} stroke={color} strokeWidth="0.8" opacity="0.35"/>;
    })}
    {Array.from({length:8}).map((_,i)=>{
      const a=(i*360/8+22.5)*(Math.PI/180);
      const x1=50+38*Math.cos(a),y1=50+38*Math.sin(a);
      const x2=50+28*Math.cos(a+0.4),y2=50+28*Math.sin(a+0.4);
      const x3=50+28*Math.cos(a-0.4),y3=50+28*Math.sin(a-0.4);
      return <path key={i} d={`M50,50 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 50,50`} stroke={color} strokeWidth="0.8" fill={`${color}10`} opacity="0.6"/>;
    })}
  </svg>
);

/* ─── Main Component ─── */
const SwitzerlandPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL}/>
        <Mandala className={styles.heroBgMandalaR}/>
        <div className={styles.heroContent}>
          {/* ── Plain image on the left ── */}
          <div className={styles.heroSilhouetteSide}>
            <img
              src="/images/yoga-teacher-training-switzerland.jpg"
              alt="Yoga Teacher Training In Switzerland"
              className={styles.heroSilhouette}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Switzerland</span>
            </h1>
            <a href="#content" className={styles.heroBtn}>Read More</a>
          </div>
        </div>
      </section>

      {/* ━━━━ CONTENT SECTION ━━━━ */}
      <section className={styles.contentSection} id="content">
        <Mandala className={styles.contentBgMandala}/>
        <div className={styles.container}>

          <div className={styles.ornRow}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>

          <h2 className={styles.sectionTitle}>Best Of Yoga Teacher Training In Switzerland</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Transform Your Life With AYM Yoga Teacher Training In Switzerland</h4>
              </div>
              <p className={styles.bodyText}>Since The Past Decade, You Might Have Noticed That There Has Been An Overemphasis On The Word "Wellbeing." At The Association For Yoga And Meditation, We Have Tried To Take Up The Onus And Make Sure That We Can Train The Best Individuals Who Can Even Go Ahead And Impart The Knowledge Of Yoga To More Students Who Want To Learn. The 200-Hour Yoga Teacher Training Program In Switzerland Is Quite Affordable And Is Perfect For Beginners.</p>
              <p className={styles.bodyText}>Yoga Is Not Just A Form Of Exercise For Your Body, It Has Been Proved Extensively That Yoga Is A Medicine For Your Mind As Well. Learning Yoga From The Right Teacher Can Completely Change Your Life; Hence, If You Want To Be That Teacher, We Are Here To Guide You Throughout Your Journey With Our Yoga Therapy Teacher Training In Switzerland.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── How Does Yoga Calm ── */}
          <h3 className={styles.subTitle}>How Does Yoga Calm Your Mind And Body?</h3>
          <p className={styles.bodyText}>You Might Be Wondering That Yoga Is Simply Another Form Of Physical Exercise And What Is Special With Our Yoga Teacher Training Program In Switzerland. Yoga Has Been A Part Of Ayurveda And Has Been Mentioned In The Ancient Vedas For A Very Long Time Now. However, The Best Thing About Modern-Day Improvisations Is That There Have Been A Lot Of Adaptations For Yoga, And Each Of Them Tends To Take Care Of Different Aspects. For Example, If You Need A Form Of Yoga That Can Help You Lose Weight, Then You Can Go For Ashtanga And Vinyasa Yoga.</p>
          <p className={styles.bodyText}>The Best Thing About Our Yoga Therapy Teacher Training Course In Switzerland Is That You Do Not Need To Run On A Treadmill For Hours And Prove How Much You Can Exhaust Yourself Physically. Instead, You Discover Yourself Every Day, Move A Mile More, And Fall In Love With Your Body's Composition And Ability. Not Only That, Our Course Has Been Structured So We Can Provide You With A Registered Yoga Teacher Training Course In Switzerland That Can Be Accredited Worldwide.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Certification ── */}
          <h3 className={styles.subTitle}>Certification For Ashtanga Yoga In Switzerland</h3>
          <p className={styles.bodyText}>None Of Them Can Deny That The Popularity Of Yoga Has Now Crossed All The Boundaries, And It Has Reached The Land Of Switzerland. Hence, Our Licensed Yoga Teacher Training Course In Switzerland Is One Of A Kind. The Most Promising Component Of Yoga We Tend To Provide You With Is The Ashtanga Form Of Yoga, And The 200-Hour Yoga Training Program Starts From The Basics And Extends To The Advanced Sections.</p>
          <p className={styles.bodyText}>You Will Very Often Notice That People Who Have Just Started With The Practice Of Yoga Are Advised Not To Start With Ashtanga Yoga In The First Go Because It Is A Little Difficult To Master As Well As Understand. Once You Know That You Have A Deep Understanding Of What Yoga Is And The Basics Are Clear, You Will Be Able To Have A Better Grasp Of Ashtanga Yoga. Not Only That, But If You Search For Yoga Instructor Certification Near Me, The Association For Yoga And Meditation Is The Ultimate Option For Each Of You.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Dietary Requirements ── */}
          <h3 className={styles.subTitle}>Dietary Requirements To Excel In Ashtanga Yoga</h3>
          <p className={styles.bodyText}>It Would Not Be Wrong To Say That Practicing Ashtanga Yoga Is A Way Of Life; Hence, You Need To Take Care Of Your Dietary Inputs. If You Get In Touch With Us At Association For Yoga And Meditation For A Yoga Teacher Training Course In Switzerland, We Will Structure The Diet To Foster Your Learning Process In The Long Run. Some Of The Basics Are:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}><strong>No Toxication At All:</strong> The First And Most Important Rule You Must Remember When Practicing Ashtanga Yoga Is To Ensure That You Do Not Take Any Intoxicating Substances Like Alcohol, Tobacco, Or Other Forms Like Marijuana And Drugs. It Is Believed That It Tends To Hamper The Harmony Of The Chakras.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}><strong>Activation Of System Before Practice:</strong> The Next Thing You Need To Keep In Mind Is To Activate The System Before You Practice. For This, You Can Choose To Drink A Cup Of Warm Water With Squeezed Lime, And There Are Some Ayurvedic Teas That We Have Special Recipes For At Association For Yoga And Meditation. Our Inclusive 300 Hour Yoga Teacher Training Program In Switzerland Also Includes This System Activation.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}><strong>Whole Grains:</strong> The Next Very Important Dietary Inclusion Must Be Made: If You Are An Ashtanga Yoga Practitioner, You Need To Consume Whole Grains. One Of The Primary Reasons Is Because It Adds A Lot More Fiber To Your Diet And Makes You Flexible Enough To Perform The Yoga Postures.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Power Yoga ── */}
          <h3 className={styles.subTitle}>Power Yoga: The Ultimate Modern Choice For Working Professionals</h3>
          <p className={styles.bodyText}>Not Only For Those Who Want To Excel In The Field Of Ashtanga Yoga And Want To Teach The Same To Students, But We Have Also Incorporated The Concept Of Power Yoga For Our Trainees As Well. At The Association For Yoga And Meditation, We Know That Sometimes Practicing Yoga In Its Full Glory Could Be Time Taking And Hence Power Yoga Is The Answer. Here You Will Be Able To Render The Right Benefits Of Yoga, But At The Same Time, It Is Much More Compact As A Practice.</p>
          <p className={styles.bodyText}>At The Association Of Yoga And Meditation, Our International Yoga Certification Is Rewarded Through A 200-Hour Yoga Training Program. It Is For Everyone Who Wants To Kick Start Their Career And Wants To See Themselves As A Yoga Instructor!</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default SwitzerlandPage;
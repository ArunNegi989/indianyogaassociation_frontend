"use client"
import React from "react";
import styles from "@/assets/style/world-wide/yoga-teacher-training-in-vietnam/Vietnampage.module.css";
import yogaimage from "@/assets/images/yoga.svg"
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
const PhilippinesPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL}/>
        <Mandala className={styles.heroBgMandalaR}/>
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
              <span className={styles.heroTitleAccent}>Philippines</span>
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

          <h2 className={styles.sectionTitle}>200 Hours Yoga Teacher Training In Philippine</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>The Top Yoga School To Practice Yoga At - Association For Yoga And Meditation</h4>
              </div>
              <p className={styles.bodyText}>Yoga Is Much More Than Just A Well-Liked Type Of Physical Activity And Has Existed For Decades. However, There Are A Lot Of Myths Surrounding Yoga. The Yoga Practice Does Not Require Any Specific Body Type Or Level Of Flexibility – All That One Needs Is The Motivation To Learn And Benefit From It.</p>
              <p className={styles.bodyText}>At The Association For Yoga And Meditation, We Offer You The Chance To Study And Understand Yoga From A Closer Perspective, Especially If You Are Looking Forward To Enrolling In A 200-Hour Yoga Teacher Training Course In The Philippines. Our Courses Are Extensive And Designed To Give You The Skills You Need To Learn Yoga.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── 200 Hour Introduction ── */}
          <h3 className={styles.subTitle}>200 Hour Yoga Teacher Training Program - Introduction</h3>
          <p className={styles.bodyText}>There Are Undoubtedly Various Yoga Training Programs Available If You Search For A Yoga Teacher Training Program In The Philippines. But There Is A Reason That We Are Unique And Have Become A Sensation In Rishikesh. Well, Precisely Speaking About Our YTT In The Philippines At Association For Yoga And Meditation - Our Program Focuses On The Eight Limbs Of Ashtanga Yoga, Besides Other Meditation Techniques And More. We Ensure You Develop Yourself In The Optimal Setting At Our Yoga Center Regardless Of The Experience You Have. With An Updated Curriculum, We Bring Both Modern And Traditional Yoga Techniques To You. Our 500-Hour Yoga Teacher Training Course In The Philippines Has A Team Of Highly Qualified And Experienced Yoga Instructors Who Are Always Ready To Assist You In Every Way.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Reach Us ── */}
          <h3 className={styles.subTitle}>Reach Us To Enlighten Yourself With Well Updated Yogic Knowledge</h3>
          <p className={styles.bodyText}>The Name Of Our Institution - The Association For Yoga And Meditation, Has A Reputation For Being The Best, Showcasing What We Want To Teach And Instill In Our Members In Rishikesh. Our Student Base Exceeds Worldwide, And We Have Experience Dealing With Everyone Regardless Of Their Culture, Background, Knowledge, Country, Language, Caste, Age, And More. Once You Choose To Take Up YTT In The Philippines, We Arrange For You Everything From Flight Tickets To Accommodation So That You Can Have An Extremely Rich And Smooth Yogic Journey With Us At Rishikesh.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Why AYM ── */}
          <h3 className={styles.subTitle}>Why Select The AYM YOGA SCHOOL For A Well-Balanced Life?</h3>
          <p className={styles.bodyText}>At The Association For Yoga And Meditation, We Are The Leading Providers Of 200 Hour, 300 And 500-Hour Yoga Teacher Training Courses In Rishikesh. If You Are Tired Of Living A Busy Life In The Philippines And Want To Seek Inner Peace Or Tranquillity, Then We Should Be Your Next Stop.</p>
          <p className={styles.bodyText}>With Content Derived From The Indian Yogic Tradition And A Beautiful Ambiance Created - We Ensure You Reach The Peace Of Mind You Are Looking Forward To. Besides That, We Have A Lot Of Experience Handling International Students And Introducing Them To A Well-Balanced Life Through Our Yoga Teacher Training Therapy Course In The Philippines. We Take Great Pride In Providing Superior And Comprehensive Services. Once You Have Completed The Course And Qualified, You Will Immediately Be Rewarded With The Yoga Teacher Training Course Certification.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Follow Rules ── */}
          <h3 className={styles.subTitle}>Follow A Few Rules - Yoga Teacher Training Course</h3>
          <p className={styles.bodyText}>If You Aspire To Become A Yoga Teacher, Then You Must Stay Mentally And Physically Prepared Before Seeking Our Yoga Instructor Course In The Philippines. At The Association For Yoga And Meditation, We Assist You In Staying Encouraged By Following A Few Simple Things. To Be Precise, These Include The Following.</p>

          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Read Books :</h4>
              </div>
              <p className={styles.bodyText}>Start Studying Books About Yoga To Understand Where It Started And Where It Is Now. There Are Many Books Available Online As Well As Offline That You Can Read To Discover The Aspects Of Yoga. Doing This Would Make Your Journey During The 500-Hour Teacher Training Course In The Philippines Easier And Simple. Also, It Will Help You Be Psychologically Prepared For The Challenges You May Face.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Eating Healthy :</h4>
              </div>
              <p className={styles.bodyText}>It Does Not Matter How Motivated Or Knowledgeable You Are About Yoga - Without Eating Healthy Food, All Your Dedication Would Go In Vain. This Is Why It Is Important To Switch To Organic, Healthy And Non-Vegetarian Food Items That Benefit Your Gut Alongside Your Well-Being. Following A Yogic Diet That Includes Fresh Fruits, Nuts, Beans, And Others Can Contribute To Helping You Live A Well-Balanced Life.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Be Consistent :</h4>
              </div>
              <p className={styles.bodyText}>Consistency Is The Key To Everything You Do Or Would Be Doing, Including Yoga. Therefore, You Are Suggested To Practice Yoga To Enhance Your Skills Regularly And Become Aware Of Your Strengths And Shortcomings Before Enrolling In Our 500-Hour Yoga Teacher Training Program In The Philippines. When You Do This, Your Interest Will Grow, And You Will Soon Become A Professional.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Understand Yogic Journey ── */}
          <h3 className={styles.subTitle}>Understand The Yogic Journey At Our Leading Yoga Teacher Training</h3>
          <p className={styles.bodyText}>The Yoga Training Program In The Philippines We Offer At AYM Can Be Thought Of As A Place Of Joy, Vigour, And Vitality. It Is A Place For Tranquillity, Awareness, And Personal Relaxation. We Provide A Sanctuary At Our Yoga Center Where You Can Discover Motivation, Advance Spiritually Besides Deepening Your Practice, And Carry On Your Yoga Journey.</p>
          <p className={styles.bodyText}>Once You Come To Us To Enroll In The 200 Hour Yoga Teacher Training Course In Philippines - We Will Offer You Comfort Throughout The Stay And Understand What You Are Dealing With. Then We Assist You In Coming Closer To Yoga, Its Philosophy And The Yogic Way Of Living. We Provide Vegetarian, Organic And Healthy Meals For Your Internal Well-Being As Well. With Time, Your Learning And Fitness Will Tend To Improve. Our Friendly, Non-Competitive And Challenging Atmosphere Encourages You To Improve With Time.</p>
          <p className={styles.bodyText}>We Also Conduct Assessments, Tests And Practical Training During The 300-Hour Yoga Teacher Training Course. Once You Qualify For The Tests, You Will Be Considered To Be Eligible To Start Your Journey As A Yoga Instructor.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default PhilippinesPage;
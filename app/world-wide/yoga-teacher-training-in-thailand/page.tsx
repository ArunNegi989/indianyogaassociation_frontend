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
const ThailandPage: React.FC = () => {
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
              Yoga Teacher Training{" "}
              <span className={styles.heroTitleAccent}>Thailand</span>
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

          <h2 className={styles.sectionTitle}>Yoga Teacher Training Thailand</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Surrender Deeply With Our 300 Hour YTT Course Thailand</h4>
              </div>
              <p className={styles.bodyText}>A Full Heart, An Open Intellect, And A Calm Vibration Are The True Indicators Of Freedom. And Nothing Can Bring This Better Than Yoga. Yoga Has Always Been The Best Remedy In Human Life. To Help You Connect And Rediscover Your Inner Self, We At The Association For Yoga And Meditation Offer The Best Yoga Teacher Training Program In Thailand. Our YTT In Rishikesh Is Organized Around Various Strategies That Greatly Vary Depending On The Knowledge And Experience Of Our Diverse Team While Always Staying Connected To These Key Values.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Rishikesh Good ── */}
          <h3 className={styles.subTitle}>Is Rishikesh Good For YTT At AYM?</h3>
          <p className={styles.bodyText}>Rishikesh Is Well-Known For Its Beautiful Natural Appearance, Magnificent Rivers, Vibrant Communities, And Growing Popularity. As A Location For Yoga Teacher Training, Rishikesh Is Arguably One Of The Gorgeous Locations Where You May Take A 300 Hour Yoga Teacher Certification, Regardless Of Whether The Aim Is To Challenge Your Mind And Body, Deepen Your Yoga Practice, Learn How To Teach.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Overview 300 Hour ── */}
          <h3 className={styles.subTitle}>Overview Of Our 300-Hour Yoga Teacher Training Course Thailand</h3>
          <p className={styles.bodyText}>Thailand's 300 Hour Yoga Teaching Course Features Flexible Teacher Training That Emphasizes Multiple Yoga Styles. We Provide Advanced Ashtanga And Vinyasa Flow Classes. Our 28-Day, 300-Hour Yoga Teacher Training In Thailand Is A Rigorous Program. Even Though It Is Difficult, It Is Incredibly Exciting. You Can Learn Various Yoga Styles, Including Ashtanga, Iyengar, Power, Flow, Hatha Vinyasa, Sivananda, And Many More, In A 300-Hour Yoga Training Course In Thailand. Learning These Many Yogic Techniques Will Not Only Help You As A Student But Will Also Make You A Master Yogi And Automatically Increase Your Energy. Additionally, You Will Learn Yoga Therapy, A Rejuvenating Practice That Focuses On Physical Rehabilitation.</p>
          <p className={styles.bodyText}>Our First Aim Is To Emphasize Descriptive Yoga Knowledge That Articulates The Yoga Sutras' Philosophical Viewpoint. Also, This Magnificent 300 Hour Licensed Yoga Teacher Training Course In Thailand At AYM School Will Enhance Your Ability To Teach Yoga At An Advanced Level. So Sign Up For A Position In Our 300 Hour Yoga Program Thailand And Get The Chance To Develop Into A Knowledgeable Yoga Practitioner.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── What Makes AYM Best ── */}
          <h3 className={styles.subTitle}>What Makes AYM The Best Choice For Yoga?</h3>
          <p className={styles.bodyText}>When Looking For A Yoga Teacher Training Course Near Me, You'll Surely Come Across The Association For Yoga And Meditation This Is Because We Top The List. Wondering What Makes Us Different From Others? Something That Makes Us Unique At The Association For Yoga And Meditation Is That Our YTT Course In Thailand Certifies Students To Teach Anywhere In The World.</p>
          <p className={styles.bodyText}>As A Registered Yoga Teacher Training Course In Thailand, We Ensure Our Students Learn In A Top-Notch Environment Surrounded By The Beautiful Serenity Of Rishikesh. We Ensure They Learn In A Convenient Ambiance Throughout Their Journey. We Place A Lot Of Emphasis Throughout Training Sessions On Students' Deepening Their Practice. Our Yoga Therapy Teacher Training Team Collaborates To Train Students To The Point Where They May Develop Self-Deepened Evaluation Skills And Self-Assessing Abilities.</p>
          <p className={styles.bodyText}>We Provide All Of Your Dietary And Housing Needs. Every Day, Three Delicious Vegetarian Meals Are Prepared With Love And Care And Served In Clean, Sterilized Spaces. Along With Clean, Filtered Water And Herbal Teas, An Associated Wifi Connection And Other Conveniences Are Required. We Also Provide An International Yoga Certification Upon Course Completion, Enabling Graduates To Work As Yoga Instructors Anywhere Globally.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Benefits 300 Hour ── */}
          <h3 className={styles.subTitle}>What Are The Benefits Of Learning A 300-Hour YTT Course?</h3>
          <p className={styles.bodyText}>Wondering If Learning A 300-Hour YTT Course In Rishikesh Is Beneficial? Here Are Some Reasons Why It Is Worth It :</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>The 300 Hour YTTC Certification From AYM School At Rishikesh Will Be Awarded To The Students. The Students Will Get The Benefit Of Pursuing Their Careers Anywhere Around The World With This Certificate.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>Learn All There Is To Know About The Various Yoga Styles, The Yoga Philosophy, And The Physiology Of Yoga To Help Students Stay Fit And Healthy.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>Our Teaching Methodology Is Built On Providing Instruction To Our Students In A Way That Also Equips Them With The Ability To Teach Yoga, Enabling Them To Do So In The Future.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}>Our Yoga Teacher In Thailand Places A High Priority On Perfecting The Practice Of Pranayama And Meditation.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}>To Be Aware Of The Origins Of Yogic Lineages And The Manner In Which Yogic Sciences Came Into Being In The Modern Era And To Use This Knowledge To Transform Oneself.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Fee Structure ── */}
          <h3 className={styles.subTitle}>About The 300 Hour YTT Course Fee Structure</h3>
          <p className={styles.bodyText}>To Learn The Essentials Of Advanced Yoga From The Best Teachers At Affordable Prices. At The Association For Yoga And Meditation In Rishikesh, Our Course Fee Includes All Study Materials For Yoga, 23 Nights Of Private Accommodation, Movie Nights, Nutritious Meals And Free Wifi. However, Students Must Know That Once Registered. There Isn't Any Refund Option. Besides, Expenses Like Extra Classes, Medical, Personal, Or Transportation Are Not Included In The Course Fee. Furthermore, You Can Also Have Your Yoga Career As A Renowned And Professional Yoga Teacher.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Start Journey ── */}
          <h3 className={styles.subTitle}>Start Your Own Journey In The Real World</h3>
          <p className={styles.bodyText}>Are You Looking For A Yoga Instructor Certification Near Me? The Association For Yoga And Meditation Is The Ideal Place To Start If You're Seeking A Yoga Teacher Training Program That Will Provide You With The Information And Skills To Advance Your Practice And The Confidence To Pursue Your Goals And Open Your Own Yoga School. Even If You Don't Intend To Teach, We Recognize That You Are A Thoughtful Person Who Aspires To Broaden Your Practice And Way Of Life.</p>
          <p className={styles.bodyText}>Keeping This In Mind, We Make Sure All Our Students Are Taught In A Way That They Can Start Their Careers Ahead In Life. And For This Reason, We Offer International YTT Certification In Thailand. Students Will Receive 300-Hour YTT Certification From AYM School In Rishikesh Upon Successfully Completing The 300-Hour Yoga Teacher Training Course At AYM. Students Will Be Able To Apply To Become RYT 300 Yoga Teachers And Register With Yoga Alliance USA.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default ThailandPage;
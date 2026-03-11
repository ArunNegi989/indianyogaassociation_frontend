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

const YogaSilhouette: React.FC<{ className?: string }> = ({ className }) => {
  const words = [
    "MEDITATION","WELLNESS","TRANQUILITY","SPIRITUALITY","VITALITY","HEALTH",
    "RELAXATION","PEACE","HARMONY","BLISS","SOUL","NAMASTE","ASANA","PRANAYAMA",
    "CHAKRA","GURU","MANTRA","ANANDA","CONCENTRATION","BODY","AYURVEDA",
    "FITNESS","BEAUTY","CALM","EXERCISE","SPIRIT","AHIMSA","SOULVIT","BALANCE",
    "MINDFULNESS","GRATITUDE","STRENGTH","FLEXIBILITY","HEALING","ENERGY",
    "BREATH","FOCUS","SERENITY","CLARITY","WISDOM","COMPASSION","JOY",
    "NOURISH","FLOW","CENTERING","AWAKEN","UNITY","YOGA","MEDITATION",
    "WELLNESS","TRANQUILITY","SPIRITUALITY","VITALITY","HEALTH","RELAXATION",
    "PEACE","HARMONY","BLISS","SOUL","NAMASTE","ASANA","PRANAYAMA","CHAKRA",
    "GURU","MANTRA","ANANDA","CONCENTRATION","BODY","AYURVEDA","FITNESS",
    "BEAUTY","CALM","EXERCISE","SPIRIT","AHIMSA","BALANCE","MINDFULNESS",
    "GRATITUDE","STRENGTH","FLEXIBILITY","HEALING","ENERGY","BREATH","FOCUS",
    "SERENITY","CLARITY","WISDOM","YOGA","MEDITATION","WELLNESS","TRANQUILITY",
  ];
  const lines: { text: string; x: number; y: number; size: number; rotate: number }[] = [];
  let wordIdx = 0;
  for (let row = 0; row < 34; row++) {
    let x = (row % 2 === 0) ? 4 : -10;
    const y = 14 + row * 18;
    while (x < 620) {
      const w = words[wordIdx % words.length];
      const size = 7 + ((wordIdx * 3) % 7);
      const rot = (wordIdx % 5 === 0) ? 90 : (wordIdx % 7 === 0) ? -90 : 0;
      lines.push({ text: w, x, y, size, rotate: rot });
      x += w.length * size * 0.56 + 4;
      wordIdx++;
    }
  }
  return (
    <svg className={className} viewBox="0 0 620 580" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="yogaClipMY">
          <ellipse cx="310" cy="88" rx="58" ry="66"/>
          <rect x="290" y="148" width="40" height="26" rx="10"/>
          <ellipse cx="310" cy="255" rx="88" ry="108"/>
          <ellipse cx="196" cy="228" rx="66" ry="26" transform="rotate(-12 196 228)"/>
          <ellipse cx="116" cy="282" rx="58" ry="22" transform="rotate(-28 116 282)"/>
          <ellipse cx="66" cy="330" rx="36" ry="22" transform="rotate(-38 66 330)"/>
          <ellipse cx="424" cy="228" rx="66" ry="26" transform="rotate(12 424 228)"/>
          <ellipse cx="504" cy="282" rx="58" ry="22" transform="rotate(28 504 282)"/>
          <ellipse cx="554" cy="330" rx="36" ry="22" transform="rotate(38 554 330)"/>
          <ellipse cx="210" cy="420" rx="125" ry="58" transform="rotate(-10 210 420)"/>
          <ellipse cx="410" cy="420" rx="125" ry="58" transform="rotate(10 410 420)"/>
          <ellipse cx="118" cy="390" rx="52" ry="36" transform="rotate(-20 118 390)"/>
          <ellipse cx="502" cy="390" rx="52" ry="36" transform="rotate(20 502 390)"/>
          <ellipse cx="310" cy="502" rx="160" ry="46"/>
        </clipPath>
      </defs>
      <g clipPath="url(#yogaClipMY)">
        {lines.map((l, i) => (
          <text key={i} x={l.x} y={l.y} fontSize={l.size} fontFamily="'Arial Black','Arial',sans-serif" fontWeight="900" fill="#111111" opacity={0.6+(i%5)*0.07} transform={l.rotate!==0?`rotate(${l.rotate} ${l.x} ${l.y})`:undefined} letterSpacing="0.02em">{l.text}</text>
        ))}
      </g>
    </svg>
  );
};

/* ─── Main Component ─── */
const MalaysiaPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL}/>
        <Mandala className={styles.heroBgMandalaR}/>
        <div className={styles.heroContent}>
          <div className={styles.heroSilhouetteSide}>
            <YogaSilhouette className={styles.heroSilhouette}/>
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Malaysia</span>
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

          <h2 className={styles.sectionTitle}>Exclusive Yoga Teacher Training In Malaysia</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Choose Us For The Top Yoga Teacher Training Program Today</h4>
              </div>
              <p className={styles.bodyText}>The Growing Awareness Of Yoga Among People Is Mainly Due To The Tranquillity, Peace, And Fitness It Provides To One's Life. At The Association For Yoga And Meditation, We Provide Individuals With The Best Yoga Instruction Available, Ensuring They Are Knowledgeable About Every Facet Of It. Our 200-Hour Yoga Teacher Training In Malaysia Is Designed For Everyone, Including Those Who Want To Learn About It And Those Who Are Planning To Become An Instructor.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Build Skills ── */}
          <h3 className={styles.subTitle}>Build Your Yoga Teaching Skills With Us At AYM</h3>
          <p className={styles.bodyText}>In Rishikesh, We Are A Renowned And Accredited Provider Of Yoga Teacher Training Course Programs. Our Name Has Been Established Among Specialists As The Best In The Region. We Ensure That Our Students From India And Other Parts Of The World Feel Comfortable And Are Surrounded By Good Energy. Our Goal Is To Help Them Feel Free To Learn The Skills Required To Develop A Career As A Professional Yoga Teacher By Enrolling In Our Yoga Teacher Training Course Programs In Malaysia. At Our Yoga Centre, We Allow You To Communicate Directly With The Instructors And Settle Down With Like-Minded People. From In-Depth Theoretical Information To Exclusive Practical Training, Our YTT In Malaysia Will Help You Build The Skills Needed To Become A Real Professional.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Why AYM Best Location ── */}
          <h3 className={styles.subTitle}>Why Is AYM The Best Location For Yoga Teacher Training?</h3>
          <p className={styles.bodyText}>The Association For Yoga And Meditation In Rishikesh Is The Best Location For Enrolling In Yoga Teacher Training. And This Is Not Just For One Reason. To Be Precise, Some Of The Primary Reasons Why We Are The Leading And Most Preferred Choice Of Individuals From All Across The World Including As The Following:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>We Have Taught The Techniques And Yogic Sciences Here At The Association For Yoga And Meditation For More Than Ten Years.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>In Our Accredited 200 Hour Yoga Teacher Training Program In Malaysia, Each Student Gets A Live Instructor Renowned For Their Skill And Experience.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>All The Teachers At Our Yoga Center Are Knowledgeable And Real-Life Professionals. We Ensure To Offer One-On-One Attention To The Students To Help Them Develop Into Professional Yoga Instructors.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}>Among Our Offerings Is A 100 Hour Yoga Teacher Training Course Certification That Is Globally Accepted All Over The World.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}>Our Classes Are Delivered To Students In A Serene Setting So That Everyone Can Concentrate, Feel Motivated, And Feel At Peace. Our Classrooms Are Outfitted, Furnished, And Roomy With Large Windows. Our Spaces Are Connected To Nature Which Makes Healing More Manageable.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>6</span>
              <p className={styles.bodyText}>We Provide A Certified Yoga Teacher Training Program In Malaysia With A Modernized Curriculum. To Give You The Most Knowledge Possible, We Have Been Able To Cover Both Classic And Modern Yoga In Our Classes.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>7</span>
              <p className={styles.bodyText}>Our 300-Hour Yoga Teacher Training Course In Malaysia Offers Study Materials And All Necessary Equipment That May Be Required For Smooth Yogic Learning.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>8</span>
              <p className={styles.bodyText}>What Else? To Add To The Benefits, Even We Assist You In Getting Started With The Initial Batches Of Students.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Serve With Love ── */}
          <h3 className={styles.subTitle}>We Serve And Teach You With Love And Ultimate Care At AYM</h3>
          <p className={styles.bodyText}>Students Coming From Abroad, Like Malaysia To Rishikesh, Do Not Need To Worry About Compromising Their Everyday Life Comfort. Our Classes Do Not Interrupt The Personal Space Of Any Individual. But Whatever We Do For Our Students Comes Solely To Improve Their Lives. We At AYM Offer Students Filling Vegetarian Meals And Care For Them By Maintaining Their Hygiene. In Addition, Our 300-Hour Yoga Therapy Teacher Training In Malaysia Provides Additional Facilities, Including An Attached WiFi Connection And Hot And Cold Filtered Water Available Around The Clock. Students Will Also Be Given The Time To Understand The Indian Culture And Adore The Beauty Of The Surrounding With Like-Minded People. All You Have To Do Is Trust Us And Enroll With Us. After That, We Will Arrange Flight Tickets And Visas For You And Ensure You Step Ahead To A Fulfilling Journey Of Gaining Yogic Knowledge.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Course Fee ── */}
          <h3 className={styles.subTitle}>AYM Course Fee In Malaysia - Reasonable Way Of Adapting A Balanced Life</h3>
          <p className={styles.bodyText}>It Does Not Matter If You Wish To Live A Balanced Life Or Are Willing To Become An Excellent Yoga Instructor- Our Course Offers Authentic And Up-To-Date Techniques Of Yoga Practice Through Our 200 Hour Yoga Teacher Training Course In Malaysia. We Offer The Encouragement Required To Create A Unique Teaching Style And To Have A Fruitful Future Career As A Yoga Instructor.</p>
          <p className={styles.bodyText}>You Will Travel Far And Deep Within Yourself Throughout Your Time Here At Rishikesh To Discover Your Unrealized Potential. Furthermore, We Ensure Our Students Have A Convenient Stay During The 500 Hours Of The Yoga Teacher Training Course And Offered All The Facilities, Including Free Internet, Healthy Meals, Study Equipment, Weekend Excursions, And More. We Ensure That The Comfort Is Not Compromised, Yet The Challenges Are Offered For Optimum Development.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Grow As Teacher ── */}
          <h3 className={styles.subTitle}>Grow As A Yoga Teacher Pursuing Courses From AYM</h3>
          <p className={styles.bodyText}>Enrol In One Of Malaysia's Top-Rated And Most Prestigious Yoga Teacher Training Programs At The Association Of Yoga And Meditation. Our Goal Is To Mould The Lives Of Our Students Worldwide And Transform Them Into Licensed Teachers. We Train The Students In Such A Way At Our Yoga Centre In Rishikesh So That They Know How To Deal With The Students In Real Life. From Giving Them Practical Knowledge To Theoretical Ones - We Support Them Entirely. The Certification That We Offer Is Globally Recognized. Our Students Can Use The International Yoga Teacher Training Certification Anywhere In The World To Start Their Adventure Of Yoga Classes. Furthermore, They Can Even Get Jobs In Any Reputed Yoga Institution And Build A Bright Future For Themselves.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default MalaysiaPage;
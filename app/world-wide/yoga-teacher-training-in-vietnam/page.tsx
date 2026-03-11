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
        <clipPath id="yogaClipVN">
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
      <g clipPath="url(#yogaClipVN)">
        {lines.map((l, i) => (
          <text key={i} x={l.x} y={l.y} fontSize={l.size} fontFamily="'Arial Black','Arial',sans-serif" fontWeight="900" fill="#111111" opacity={0.6+(i%5)*0.07} transform={l.rotate!==0?`rotate(${l.rotate} ${l.x} ${l.y})`:undefined} letterSpacing="0.02em">{l.text}</text>
        ))}
      </g>
    </svg>
  );
};

/* ─── Main Component ─── */
const VietnamPage: React.FC = () => {
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
              <span className={styles.heroTitleAccent}>Vietnam</span>
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

          <h2 className={styles.sectionTitle}>Yoga Teacher Training Vietnam</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Learn About The Practice Of Yoga And Meditation At AYM</h4>
              </div>
              <p className={styles.bodyText}>Yoga Is Known To Be The Best Practice That Enhances A Person's Physical And Mental Wellness. However, Individuals Who Practice Yoga View It As Art That Should Be Shared With Others. If You Are One Of Them, Relying On The "Association For Yoga And Meditation" Is The Finest Way To Spread Yoga Worldwide. We Are The Top-Rated Provider Of Yoga Teacher Training Courses In Vietnam That Was Founded To Impart Knowledge Of Yoga And Its Profound Qualities To Others. By Adapting Our YTT Courses In Vietnam, You Can Transform Into A Conduit Who Aids Others In Obtaining The Resources Essential For Inner Development.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Who Can Enroll ── */}
          <h3 className={styles.subTitle}>Who Can Enroll In The Yoga Teacher Training Course In Vietnam?</h3>
          <p className={styles.bodyText}>You Are Quite Mistaken If You Believe That Our Yoga Centre In Rishikesh Only Offers Yoga Teacher Training Courses In Vietnam For Individuals Who Desire To Instruct Yoga To Others. In Reality, We Do Not Have Any Considerate Requirements For You To Become An Instructor To Take The Course. You Can Learn Yoga To Enhance Your Practice As Well. Our 200-Hour Yoga Teacher Training Course In Vietnam Will Help You To Discover Your Own Personal And Spiritual Growth, Besides Opening A New Dimension Within Yourself That May Be Needed To Share The Divine Wisdom Of This Practice In The Future. However, If You Want To Become An Instructor, Our Registered Yoga Teacher Training Course In Vietnam Can Help You Get Global Recognition And Set A Bright Future.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Facilities ── */}
          <h3 className={styles.subTitle}>What Facilities Does Our Yoga Campus Offer To The Students?</h3>
          <p className={styles.bodyText}>On Choosing Our 300-Hour Yoga Teacher Training Course In Vietnam, We Help You To Reach Our Campus At Rishikesh In A Hassle-Free Way. Once You Reach Our Yoga Centre, We Ensure To Treat You Like A Family So That You Do Not Feel Uncomfortable Or Left Out. For Additional Comfort, We Have Created Fully Equipped Rooms For Student Housing And Surrounded The Area With Lovely Gardens To Make It A Perfect Place For Enhancing Yoga And Meditation Practice. But There's More That We Offer To Our Students And These Include</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>Extremely Spacious Yoga Halls For The Entire Batch To Practice Freely.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>Availability Of Free Internet For Everyone.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>Various Lodging Options Are Available Including Private Rooms Shared Rooms And Dormitories.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}>Availability Of Both Hot And Cold Water 24 X 7 For The Students.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}>Weekend Excursions At The Beautiful Location Of Rishikesh And A Non-Judgmental Atmosphere To Live Freely.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>6</span>
              <p className={styles.bodyText}>Free, Hygienic, And Organic Meals To Be Served A Day Thrice.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>7</span>
              <p className={styles.bodyText}>Study Materials And Other Equipment Are To Be Offered When Required.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Foundation ── */}
          <h3 className={styles.subTitle}>Yoga At AYM Can Help You Build A Foundation Of Calm And Peace</h3>
          <p className={styles.bodyText}>You Will Build A Strong Foundation Of Discipline During The Yoga Teacher Training Course Program In Vietnam, Which Encourages Your Physical, Mental, Emotional And Spiritual Growth. Besides, The Courses We Offer Will Be A Firm Basis From Which You Can Naturally And Confidently Train Others.</p>
          <p className={styles.bodyText}>Our YTT Course In Vietnam Aims To Develop Excellent Yoga Teachers And Equip Them With All The Necessary Skills. We Train You In How You Can Teach Advanced Yoga To Others In Real Life. After Being Exposed To This Archaic Scientific Course, You Will Be Prepared To Face All The Difficulties In The Real World As A Future Instructor.</p>
          <p className={styles.bodyText}>Both Aspiring Yoga Instructors And Those Seeking The Highest Level Of Yogic Awareness Would Benefit Significantly From Our Yoga Centre In Rishikesh By Choosing Our Yoga Teacher Training Course Program In Vietnam.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Exclusive Courses ── */}
          <h3 className={styles.subTitle}>Exclusive And Advanced Yoga Teacher Training Courses In Vietnam</h3>
          <p className={styles.bodyText}>The Yoga Therapy Teacher Training In Vietnam Is Exclusive As It Holds Both Traditional And Modern Approaches. Be It A 200, 300, Or 500-Hour Yoga Teacher Training Program. Each One Is Designed Keeping Individual Needs In Mind. The Best Part Is That You Do Not Need Prior Knowledge Or Experience To Learn It. You Can Come To Us At Rishikesh With The Motivation Of Learning Yoga And Promoting This Ancient Form Of Physical And Mental Treatment. As You Go Through The Course, You Will Have To Be A Part Of Various Tests, Assessments And Practical Training To Qualify For The International Yoga Teacher Training Certification In Vietnam. This Certification Can Be Further Used In Any Corner Of The World As It Is Globally Recognized.</p>

          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Guaranteed And Successful Yoga Career With AYM</h4>
              </div>
              <p className={styles.bodyText}>Being In The Industry For Decades Now, We Have Been Offering Extensive Yoga Teacher Training Courses In Vietnam. So Far, We Have Shaped Thousands Of Individuals Into Real Professionals And Have Shaped Them To Face The Challenges Of The Real World. Anyone Wanting To Pursue The Yoga Course To Become A Professional Does Not Need To Worry. At The Association For Yoga And Meditation, You Will Learn In-Depth Information On How Yoga Functions. Anyone Is Eligible To Participate In Our 500 Hours Yoga Teacher Training Course In Vietnam And The International Certification. Using The Certificate, One Can Immediately Get A Job At Any Reputed Yoga Institution As An Instructor. Or, One Can Start Their Adventure Of Yoga Classes To Enlighten Others In Any Corner Of The World.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Embrace ── */}
          <h3 className={styles.subTitle}>Embrace The Yogic Concepts With Us || Get Detailed Knowledge Of Yoga And Meditation</h3>
          <p className={styles.bodyText}>Our YTT Program In Vietnam Teaches You How To Assist In Managing Your Lifestyle, Practicing Meditation, And Embracing Contemporary Yogic Concepts. By Using Cutting-Edge And Traditional Teaching Strategies - Students Are Prepared For Today's Cutthroat Environment. We Are Aware Of The Strengths And Areas That Require Improvement, And We Work Tirelessly To Help You Develop Them. Along With Teaching You How To Control Your Mind And Heal Your Body, We Guide You To Live A Well-Balanced Life Through A Registered Yoga Teacher Training Course In Vietnam. You Can Expect To Grow Physically, Mentally, And Spiritually With Us.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default VietnamPage;
"use client"
import React, { useState } from "react";
import styles from "@/assets/style/world-wide/yoga-teacher-training-in-new-zealand/Newzealandpage.module.css";

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

/* Yoga word-cloud silhouette */
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
  const lineH = 18;
  for (let row = 0; row < 34; row++) {
    let x = (row % 2 === 0) ? 4 : -10;
    const y = 14 + row * lineH;
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
        <clipPath id="yogaClipNZ">
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
      <g clipPath="url(#yogaClipNZ)">
        {lines.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            fontSize={l.size}
            fontFamily="'Arial Black', 'Arial', sans-serif"
            fontWeight="900"
            fill="#111111"
            opacity={0.6 + (i % 5) * 0.07}
            transform={l.rotate !== 0 ? `rotate(${l.rotate} ${l.x} ${l.y})` : undefined}
            letterSpacing="0.02em"
          >
            {l.text}
          </text>
        ))}
      </g>
    </svg>
  );
};

/* ─── Main Component ─── */
const NewZealandPage: React.FC = () => {
  const [form, setForm] = useState({ name:"", email:"", phone:"", message:"" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p=>({...p,[e.target.name]:e.target.value}));

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
              <span className={styles.heroTitleAccent}>New Zealand</span>
            </h1>
            <a href="#courses" className={styles.heroBtn}>Read More</a>
          </div>
        </div>
      </section>

      {/* ━━━━ CONTENT SECTION ━━━━ */}
      <section className={styles.contentSection}>
        <Mandala className={styles.contentBgMandala}/>
        <div className={styles.container}>

          <div className={styles.ornRow}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>

          <h2 className={styles.sectionTitle}>Yoga Teacher Training In NewZealand</h2>

          <div className={styles.dietaryList}>
            <div className={styles.dietaryItem}>
              <div className={styles.dietaryItemHeader}>
                <Chakra className={styles.dietaryChakra} color="#e07b00"/>
                <h4 className={styles.dietaryTitle}>Enroll In Premium Yoga Teacher Training Center Today</h4>
              </div>
              <p className={styles.bodyText}>Each Person Lives In The Era Of Self-Care And Self-Discovery, Where They Have A Distinctive Approach. Among All The Options Available In The World That Help Raise Self-Love, Yoga Is Particularly One Where People Find Their Soul And Mind Unwinding. The Yoga Retreat Is For Everyone. We At The Association For Yoga And Meditation Offer The Best Yoga Teacher Training Courses In New Zealand, Whose Advantage One Can Take To Spread Its Benefits With Others. We Have Existed For Over A Decade And Have Trained Thousands Of Individuals With Our Advanced 200 Hour Yoga Teacher Training Course At Our Yoga Centre In Rishikesh.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Dig Deeper ── */}
          <h3 className={styles.subTitle}>Dig Deeper To Understand All Aspects Of Yoga And Meditation</h3>

          <p className={styles.bodyText}>As One Of The Top 300-Hour Yoga Teacher Training Courses In New Zealand, We At The "Association For Yoga And Meditation" Would Assist You In Learning Every Minute Detail Of Yoga And Meditation That Exists. We Have Different Course Programs Available, Which You Can Choose From Depending On Your Preference. Through Our Registered Yoga Teacher Training Course In New Zealand, We Will Take You Back To The Roots Of Yoga From Where It Began And Then Help You Understand How It Has Evolved Over The Years And Where It Will Be In The Future. We Make Sure To Introduce You To Its Traditional And Modern Aspects. Our 300-Hour Yoga Teacher Training Course In New Zealand Includes Theoretical As Well As Practical Training Where Injury Avoidance Techniques And Unique Tricks Are Also Taught. The Yogis In Our YTT Centre In New Zealand Ensure To Offer One-On-One Attention To Every Student. You Can Expect To Resolve All Your Queries Related To Yoga And Get A Deeper Understanding Of How It Can Positively Impact Your Life.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Mental Health ── */}
          <h3 className={styles.subTitle}>How Does Yoga Impacts One's Mental Health?</h3>

          <p className={styles.bodyText}>The 500 Hours Of Yoga Teacher Training Course In New Zealand Is Known To Bring The Soul, Mind And Body Together, Further Aiding In Relieving Physical Ailments Alongside Unneeded Emotional Tension. In Simple Words, The YTT In New Zealand That We Offer Helps One With Physical Ailments And Positively Impacts Mental Health. To Be Precise, Here Are A Few Ways You Can Expect Yoga To Assist You In Improving Your Mental Health Including:</p>

          <div className={styles.dietaryList}>
            {[
              {
                title: "Improved Concentration:",
                text: "When You Enroll In Our 300 Hour Yoga Teacher Training Course In New Zealand, It Helps In Lowering Tension By Calming Your Body. If You Have Experienced Nervous Issues Over Time, Our Courses Can Make Things Unclear. However, Relying On Yoga Can Help You Deal With Difficulties Calmly."
              },
              {
                title: "Better Focus:",
                text: "Encountering Stressful Situations And Living A Stressful Life Have Become Common Today. There Are Times When You May Find Everything Interfering With Your Recovery. But Choosing Our 300-Hour Yoga Teacher Training Course In New Zealand Can Help Develop Strength And Focus Energy In The Right Direction."
              },
              {
                title: "Encourages Relaxation:",
                text: "At The Association Of Yoga And Meditation, We Have Licensed Yoga Teacher Therapy Training Courses In New Zealand That Include Stress Management Techniques. Various Calming Postures And Breathing Techniques Are Shown That Increase The Heart Rate And Blood Pressure, So That One Turns Into Their Normal State Immediately. The Main Goal Of Over-Courses Is To Provide You With The Mental Ease And Relaxation That You Are Looking For."
              },
              {
                title: "Enhanced Sleep:",
                text: "Many People Worldwide Find It Difficult To Sleep For Some Reason Or Another. As You Enroll In Our Yoga Centre In Rishikesh For The 300 Hours Of Yoga Teacher Training Course, You Will Learn About The Poses Which Encourage Sound Sleep. Besides Just Getting Better Sleep Quality, You Will Be Able To Know The Ways You Can Relax And Contribute To Your Overall Health."
              },
            ].map((item, i) => (
              <div key={i} className={styles.dietaryItem}>
                <div className={styles.dietaryItemHeader}>
                  <Chakra className={styles.dietaryChakra} color="#e07b00"/>
                  <h4 className={styles.dietaryTitle}>{item.title}</h4>
                </div>
                <p className={styles.bodyText}>{item.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Join Us ── */}
          <h3 className={styles.subTitle}>Join Us To Become A Professional Yoga Instructor At AYM</h3>

          <p className={styles.bodyText}>At The Association For Yoga And Meditation, We Offer Licensed Yoga Teacher Therapy Training Courses In New Zealand That Will Aid In Developing Your Yoga Practice As A Teacher. Our Training Courses Are Updated And Are Designed To Brush Up On Your Skills So That You Can Become An Instructor With A Distinctive Teaching Style. Under The Direction Of Knowledgeable Instructors, You Will Be Guided And Taught About Every Detailed Aspect. The Best Part About Choosing Our 200 Hour, 300 Hour And 500 Hours Yoga Teacher Training Course In New Zealand Is That You Will Be A Part Of Weekend Excursions In Rishikesh, Assignments, Assessments And Others Before You Qualify For The International Yoga Certification. Not To Mention, This Certification Can Be Used Further To Start Your Yoga Teaching Journey In Any Institute Or Start Up Your Yoga Classes In Any Corner Of The World.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Affordable Rates ── */}
          <h3 className={styles.subTitle}>Learn Yoga At The Association For Yoga And Meditation At Affordable Rates</h3>

          <p className={styles.bodyText}>Our Students Enrolling In A Yoga Teacher Training Course At Rishikesh Yoga Centre Must Know That We Are Reputed For Offering Top-Class Educational Services. We Have Been The First Choice Of Many Worldwide Because Our Students Know Our Expertise And The Excellent Caliber Of Training. We Aim To Offer 200 Hours Of Yoga Teacher Training Courses In New Zealand To Students In Cutting-Edge Classrooms Around The Serenity Of Rishikesh's Natural Beauty. We Ensure That You Are Surrounded By Positive Energy By Providing A Vibrant And Peaceful Environment. With All The Conveniences Equipped With Lodging, Free Internet, Hygienic Meals And More - Our Courses Leave Students With A Pleasant Experience. Once You Have Completed Our 500-Hour Yoga Teacher Training Course In New Zealand, We Will Reward You With An International Certificate That Is Globally Accepted And Recognized. By Choosing Us, You Create A Base Of Calmness And Quiet At An Affordable Cost.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

      

    </div>
  );
};

export default NewZealandPage;
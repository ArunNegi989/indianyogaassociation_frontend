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
const AsiaPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL}/>
        <Mandala className={styles.heroBgMandalaR}/>
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
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Asia</span>
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

          <h2 className={styles.sectionTitle}>Yoga Teacher Training Asia</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Asia Top Yoga And Meditation Center</h4>
              </div>
              <p className={styles.bodyText}>Suppose You Are Looking Forward To Learning Yoga And Spreading The Knowledge Of It Everywhere Around. In That Case, We At The Association For Yoga And Meditation Can Be The Best Location To Assist You In Every Way. We Are The Market-Leading Yoga Centre At Rishikesh That Has Been Offering Keen Education Related To Yoga And Meditation For Decades. The Lives Of People Of All Ages Are Impacted Positively By Our 200-Hour Yoga Teacher Training Course Program In Asia Because It Is Well-Designed And Straightforward. Though Our Classes Are Conducted In Rishikesh, We Have Managed To Gain A Reputation For Being The Best Provider Of Yoga Teacher Training Courses All Over Asia.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Get A Deeper Understanding ── */}
          <h3 className={styles.subTitle}>Get A Deeper Understanding Of Yoga With Us</h3>
          <p className={styles.bodyText}>When Choosing Our 200 Hour Yoga Teacher Training Course In Asia, Being A Novice Or Expert Does Not Matter. Our Courses In Rishikesh Are Designed For People Of All Ages, Genders, And Cultural Backgrounds. At Our Yoga Centre, The Students Will Get A Chance To Acquire The Capacity To Study Intricate Yoga Techniques Properly So They Can Impart Them To Others In Their Professional Lives.</p>
          <p className={styles.bodyText}>In Addition To Getting A Deeper Understanding Of The Origin Of Yoga, You Will Be Able To Learn All The Methods, Alignments, And Adjustments Through The YTT Course In Asia. At The Association For Yoga And Meditation, We Are Here To Support You Throughout The Process And Develop Foundational Knowledge That Focuses On Both Traditional And Modern Approaches. Once The Course Is Over And You Have The Necessary Skills, You Can Apply For The International Certificate Of Yoga In Asia.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── What Makes Our Yoga Center The Best ── */}
          <h3 className={styles.subTitle}>What Makes Our Yoga Center In Rishikesh The Best?</h3>
          <p className={styles.bodyText}>Students Willing To Take Up A Registered Yoga Teacher Training Course In Asia Must Know That Our Yoga Centre In Rishikesh Is Renowned For Multiple Reasons. Some Of These Include The Following:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}><strong>Hassle-Free Journey Of Yoga Learning:</strong> Our Courses Are Designed To Give You The Peace Of Mind You Deserve. All That Starts With Arranging Your Flight Tickets And Visas And Ensuring You Have A Smooth Journey After Picking Up Our 300-Hour Yoga Teacher Training Course In Asia. We Ensure You Reach Us Without Any Inconvenience And Begin Your Yoga Classes At Our Centre In Rishikesh Smoothly.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}><strong>Experienced Yoga Instructors:</strong> Our Yoga Centre In Rishikesh Has A Team Of Highly Experienced And Trained Real-Life Professionals. Each Yoga Instructor Ensures That They Pay Attention To The Students During The YTT Course In Asia. Using Their Extensive Knowledge, They Always Use Unique Techniques To Assist You And Make Your Learning Journey Easier.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}><strong>Updated Yoga Training Offered:</strong> The 200, 300, And 500-Hour Yoga Teacher Training Course In Asia That We Offer Is Completely Updated And Well-Researched. Each Of Our Courses Uses Traditional And Modern Yoga Approaches To Enlighten The Students. Students Are Taught About Unique Techniques Of Yoga That Have The Potential To Eliminate Physical, Spiritual, And Mental Ailments.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}><strong>Non-Judgmental And Peaceful Space:</strong> We Have Students Coming To Our Yoga Centre In Rishikesh From All Corners Of The World. This Is Primarily Because Of The Non-Judgmental And Peaceful Space We Have Created For Them. Besides Giving Them A Homely Feeling And Ensuring Comfort, Our YTT Centre In Asia Introduces Them To Like-Minded People Who Respect Others' Boundaries And Opinions.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Advanced Yoga Classes ── */}
          <h3 className={styles.subTitle}>Advanced Yoga Classes In A Fully Equipped Setting With Top Rated Facilities</h3>
          <p className={styles.bodyText}>You Will Discover Our Name, "Association For Yoga And Meditation," On Top While Looking For The Best Yoga Teacher Training Program In Asia. This Is Because We Allow You To Develop Teaching Skills Surrounded By The Beautiful Nature Of Rishikesh. With Us, You Can Gain A Strong Foundation In The Ancient Yogic Tradition And Advanced Knowledge In Modern Approaches.</p>
          <p className={styles.bodyText}>At The Association For Yoga And Meditation, We Entirely Base Our Yoga Therapy Teacher Training On The Gurukul System Without Compromising Your Modern Needs. The Teachers Will Support And Mentor You Throughout Your YTT In Asia Because They Are Highly Qualified, Committed, And Experienced. During Our 200, 300, And 500-Hour Yoga Teacher Training Courses In Asia, We Offer You All The Required Facilities For Survival, Including Free Wifi, Study Materials, Spacious Rooms, And Hygienic And Organic Meals.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Get Certified ── */}
          <h3 className={styles.subTitle}>Get Certified As A Yoga Instructor And Enjoy Global Recognition</h3>
          <p className={styles.bodyText}>You Can Confidently Choose Our Yoga Teacher Training Program In Asia, Knowing That You Will Be Globally Certified And Recognized As A Professional. It Does Not Matter If You Want To Learn Yoga For Yourself Or Teach Others About It – We Offer You A Yoga Teacher Training Course Certification In Asia After You Complete The Program.</p>
          <p className={styles.bodyText}>Our Teachers Ensure Not To Leave Even The Minute Details During The 500-Hour Yoga Teacher Therapy Training Course In Asia. We Teach And Train You From Scratch So That You Are Ready To Deal With The Outside World. Once You Are Titled As A Licensed Yoga Teacher In Asia With Our Globally Recognized Certification, You Can Proceed With Your Bright Career In The Future Easily.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default AsiaPage;
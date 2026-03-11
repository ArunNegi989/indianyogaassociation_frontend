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
const PokharaPage: React.FC = () => {
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
  src={yogaimage.src}
  alt="Yoga Teacher Training In Germany"
  className={styles.heroSilhouette}
  style={{ borderRadius: "8px", objectFit: "cover" }}
/>
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Yoga Teacher Training Course In{" "}
              <span className={styles.heroTitleAccent}>Pokhara</span>
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

          <h2 className={styles.sectionTitle}>Yoga Teacher Training Course In Pokhara</h2>

          {/* ── Enroll Today ── */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Enroll In The Best Yoga Teacher Training Course Today</h4>
              </div>
              <p className={styles.bodyText}>Yoga Is A Form Of Practice That Has Existed For Centuries And Has Gained Popularity In Recent Years. This Is Because People Have Become Aware Of The Tranquility, Peace, And Fitness It Brings To One's Life. If You Are Interested In Delving Deep Into The World Of Yoga And Continuing As An Instructor, Then Our Yoga Teacher Training In Pokhara Is All You Need. We At The Association For Yoga And Meditation Offer Top-Rated Yoga Training To Individuals, Ensuring They Are Enlightened With Every Aspect Of It.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Introduction ── */}
          <h3 className={styles.subTitle}>Introduction To Yoga In Pokhara – Explore Every Bit Of It</h3>
          <p className={styles.bodyText}>In AYM Pokhara, We Provide Extensive Yoga Teacher Training Courses To Individuals Who Are Beginners. Our Training Includes One And Two-Week Beginner Yoga Courses That Involve Intensive Yoga Practice And Philosophy Talks. As Beginners, You Can Enroll In Our Intermediate (200-Hour Yoga Teacher Training Pokhara) Course Program. However, Advanced Level (300-Hour Yoga Teacher Training Pokhara) Courses Are Available If You Want To Advance Your Yoga Practice. After That, You Can Get The YTT Certification That Is Globally Recognized And Get On Your Journey Of Success As A Yoga Instructor In Any Corner Of The World.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Diverse Programs ── */}
          <h3 className={styles.subTitle}>Discover About Our Diverse And Exclusive Yoga Teacher Training Course Program</h3>
          <p className={styles.bodyText}>At The Association For Yoga And Meditation, Our YTT Course In Pokhara Has Diverse Course Programs Designed Depending On Your Preference. To Be Precise, We Have Training Courses That Include 200 Hours, 300 Hours And 500-Hour Programs. In The 200-Hour Yoga Teacher Training Course, You Will Be Introduced To Hatha / Ashtanga Yoga, Which Lasts 21 Days. The 300-Hour Yoga Teacher Training Course Showcases The Aspects Of Multi-Style Yoga And Lasts Up To 28 Days. Lastly, Our 500-Hour Yoga Teacher Training Course Includes Hatha / Multi-Style Yoga That Lasts Up To 52 Days.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Like-Minded Yogis ── */}
          <h3 className={styles.subTitle}>Interact With Like-Minded Yogis And Enjoy The Facilities Throughout The Training Period</h3>
          <p className={styles.bodyText}>We Offer Individuals The Golden Opportunity To Interact With Like-Minded Yogis Through The Course Of Yoga Teachers In Pokhara. You Can Expect To Receive One-On-One Attention From Professionals And Get All Your Queries Resolved. Our Yoga Teaching Course, Pokhara Sessions, Will Help Enhance Your Knowledge And Help You Face The World's Real Challenges. At Our Training Centre, You Will Be Given A Peaceful Environment Surrounded By Lush Greenery And All The Amenities That Makes Life Easier.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Why AYM Best ── */}
          <h3 className={styles.subTitle}>Why Is AYM The Best Place For Yoga Teacher Training In Pokhara?</h3>
          <p className={styles.bodyText}>There Is Not One Reason Why We Are The Best Yoga Teacher Training Course Near Me. Here Are A Few Things That Make Our 200-Hour, 300-Hour And 500-Hour Yoga Teacher Training In Pokhara The Best:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}><strong>Experienced Yogis:</strong> At The Association For Yoga And Meditation, We Have Been Instructing The Methods And Knowledge Of The Yogic Sciences For More Than A Decade Now. All The Yogis In Our Licensed Yoga Teacher Training Course In Pokhara Have Active Instructors Who Are Known For Their Expertise.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}><strong>Globally Recognized Certification:</strong> Our Courses, Including Our 100-Hour Yoga Teacher Training Program, Have Been Certified By The World Yoga Association, Which Makes Us Globally Recognized. You Can Use Our Yoga Teacher Certification Anywhere In The World To Get A Job Or Begin Your School.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}><strong>Peaceful Environment:</strong> Our Courses Are Offered To The Students In A Peaceful Environment Where Everyone Feels Focused, Motivated And At Peace. All Our Classrooms Are Equipped, Furnished, Spacious With Big Windows, And Somehow Connected With Nature To Achieve The Taste Of Tranquillity.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}><strong>Facilities For Students:</strong> During The 200-Hour, 300-Hour And 500-Hour Yoga Teacher Training Course In Pokhara, We Make Sure To Offer You All The Facilities. From Serving Hearty Vegetarian Meals Daily To Taking Care Through Maintaining Hygiene. Other Than That, Our Yoga Therapy Teacher Training Includes Further Amenities Like A Wi-Fi Connection And 24×7 Filtered Water Both Hot And Cold.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}><strong>Updated And Advanced Courses:</strong> The Registered Yoga Teacher Training Course In Pokhara That We Offer Has An Updated And Advanced Curriculum. We Have Managed To Cover Both Traditional And Modern Yoga In Our Courses So That Your Knowledge Extends To The Maximum. Each Course Covers A Variety Of Topics Alongside Regular Assignments, And Tests Are Also Conducted.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Who Can Join ── */}
          <h3 className={styles.subTitle}>Who Can Join The Yoga Teacher Training Course In Pokhara?</h3>
          <p className={styles.bodyText}>You Are Quite Mistaken If You Believe That Yoga Teacher Training In Pokhara Is Solely For Individuals Who Desire To Instruct Yoga To Others. The Courses We Offer Are Beneficial For Anyone Looking Forward To Learning True Yoga To Enhance Their Practice. Once You Complete The YTT Course In Pokhara, You Will Discover Your Own Personal And Spiritual Growth To Be Further Accelerated. It Does Not Matter If You Are Experienced Or Someone With Zero Knowledge Of Yoga – Our Courses Are For Everyone Willing To Learn It.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Global Certification ── */}
          <h3 className={styles.subTitle}>Get Globally Recognized With Our Yoga Teacher Training Certification</h3>
          <p className={styles.bodyText}>Our YTT Certification Includes 200 RYT, 300 RYT And 500 RYT Depending On The Training You Have Chosen To Enrol In. Through Our Courses, We Make Sure That Our Students Are Thoroughly Trained And Are Introduced To Every Aspect Of It. Once You Have Completed The Training And The Assignments, You Will Have To Go Through A Test To Qualify Yourself In Order To Receive The Pokhara International Yoga Certification.</p>
          <p className={styles.bodyText}>It Is Certain That After Completing These Comprehensive And In-Depth Yoga Certification Courses, Your Proficiency And Confidence In Teaching Yoga Will Have Increased. Our Certification Is Accepted Globally And You Can Be A Part Of Any Recognized Institution As An Instructor To Begin Your Career. Other Than That, You Can Also Begin Your Own Yoga School To Spread The Knowledge Of Yoga And Make Others Aware Of Its Benefits.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default PokharaPage;
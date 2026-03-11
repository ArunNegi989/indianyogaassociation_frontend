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
const GermanyPage: React.FC = () => {
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
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Germany</span>
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

          <h2 className={styles.sectionTitle}>Elevate Your Journey With Our Yoga Teacher Training In Germany</h2>

          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Begin Your Transformative Yoga Journey With AYM</h4>
              </div>
              <p className={styles.bodyText}>Embark On An Enriching Journey With Our Yoga Teacher Training Program In Germany. This Thorough Course Is Crafted To Enhance Your Practice And Build The Expertise Required To Thrive As A Confident And Skilled Yoga Instructor. Throughout The Training, You Will Delve Into Yoga Philosophy, Anatomy, Alignment, And Effective Teaching Methodologies. Our Dedicated And Experienced Instructors Are Passionate About Supporting Your Growth And Unlocking Your Potential.</p>
              <p className={styles.bodyText}>In Addition To Mastering Teaching Techniques, You Will Have The Opportunity To Explore Various Yoga Styles, Helping You Discover Your Unique Teaching Voice. Whether You Are Drawn To Hatha, Vinyasa, Ashtanga, Or Any Other Style, Our Program Provides You With A Comprehensive Education, Paving The Way For A Successful Career In Yoga Instruction.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Benefits ── */}
          <h3 className={styles.subTitle}>Benefits Of Yoga Teacher Training In Germany</h3>
          <p className={styles.bodyText}>Pursuing Yoga Teacher Training In Germany Comes With Many Advantages. The Country Offers A Rich Blend Of Traditional Yoga Teachings And Contemporary Practices. Here Are Some Benefits Of Enrolling In Our Yoga Teacher Training Program:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}><strong>Intensive Immersion:</strong> Germany's Serene Landscapes And Peaceful Environments Create The Perfect Backdrop For An Immersive Learning Experience. This Setting Allows For Deep Focus And Self-Discovery.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}><strong>Expert Instructors:</strong> Our Programs Are Led By Seasoned Instructors Who Are Highly Trained And Knowledgeable. This Ensures High-Quality Education And Mentorship For All Participants.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}><strong>Globally Recognized Certification:</strong> Completing Your Training In Germany Equips You With An Internationally Recognized Certification. This Credential Can Expand Your Horizons For Teaching Yoga Worldwide And Enhance Your Credibility As An Instructor.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}><strong>Comprehensive Approach:</strong> Our Training Integrates Yoga Philosophy, Anatomy, Meditation, And Teaching Techniques Into A Cohesive Curriculum. This Holistic Approach Ensures You Receive A Well-Rounded Education.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}><strong>Personal Growth:</strong> The Intensive Nature Of Our Training Fosters Significant Personal Growth. Students Frequently Report Increased Self-Awareness, Improved Physical And Mental Well-Being, And A Strengthened Connection To Their Practice.</p>
            </div>
          </div>

          <p className={styles.bodyText}>Overall, Yoga Teacher Training In Germany Offers A Transformative Opportunity, Providing Aspiring Teachers With The Knowledge, Confidence, And Skills To Excel In Their Practice And Share The Transformative Experience Of Yoga.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Why Choose Us ── */}
          <h3 className={styles.subTitle}>Why Choose Our Yoga Teacher Training Course In Germany?</h3>
          <p className={styles.bodyText}>Choosing Our Yoga Teacher Training In Germany Comes With Compelling Reasons. The Unique Blend Of Traditional Yoga Practices And Modern Teaching Approaches Creates A Stimulating And Transformative Environment For Prospective Yoga Instructors. Here Are Some Key Reasons To Consider:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}><strong>Deep Learning Experience:</strong> Our Training Facilitates Profound Immersion Into Yoga Study And Practice. The Tranquil Surroundings Promote Focused Learning And Personal Exploration.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}><strong>Qualified Instructors:</strong> Learn From Experienced Instructors Who Bring Invaluable Knowledge And Practical Insight. Our Team's Expertise Guarantees Exceptional Education And Support.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}><strong>International Certification:</strong> Graduating From Our Program Grants You An Internationally Recognized Certification, Enhancing Your Prospects For Teaching Yoga Globally.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}><strong>Holistic Approach:</strong> Our Courses Present A Comprehensive Approach To Training, Intertwining Aspects Of Philosophy, Anatomy, Meditation, And Pedagogical Techniques, Providing Future Instructors With A Broad Skill Set.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}><strong>Personal Growth:</strong> The Immersive Experience Of Yoga Teacher Training Fosters Not Only Professional Skills But Significant Personal Growth And A Deeper Awareness Of Oneself And Others.</p>
            </div>
          </div>

          <p className={styles.bodyText}>By Selecting Our Yoga Teacher Training In Germany, You Will Embark On A Meaningful Journey That Equips You With The Tools, Knowledge, And Confidence Necessary To Thrive In Your Practice And Inspire Others Through The Profound Art Of Yoga.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Course Overview ── */}
          <h3 className={styles.subTitle}>Overview Of Our Comprehensive Yoga Teacher Training Course In Germany</h3>
          <p className={styles.bodyText}>Immerse Yourself In Our Comprehensive Yoga Teacher Training Course In Germany, Designed To Deepen Your Practice And Provide You With The Knowledge And Skills Needed To Become An Effective And Confident Yoga Instructor. Our Program Covers An In-Depth Study Of Yoga Philosophy, Anatomy, Alignment, And Teaching Methodologies, Ensuring You Are Well-Prepared For A Rewarding Career In Yoga Instruction.</p>
          <p className={styles.bodyText}>Guided By Experienced And Dedicated Instructors, You'll Explore Diverse Yoga Styles And Uncover Your Unique Teaching Identity. Join Us In Germany For An Unforgettable, Life-Changing Experience, Whether You Seek To Enrich Your Practice Or Embark On A Journey As A Yoga Teacher.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default GermanyPage;
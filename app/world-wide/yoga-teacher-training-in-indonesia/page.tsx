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
const IndonesiaPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL}/>
        <Mandala className={styles.heroBgMandalaR}/>
        <div className={styles.heroContent}>
          {/* ── Normal image on the left ── */}
          <div className={styles.heroSilhouetteSide}>
            <img
              src="/images/yoga-teacher-training-indonesia.jpg"
              alt="Yoga Teacher Training In Indonesia"
              className={styles.heroSilhouette}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Indonesia</span>
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

          <h2 className={styles.sectionTitle}>Yoga Teacher Training School In Indonesia</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Know About The Best Yoga School In Indonesia</h4>
              </div>
              <p className={styles.bodyText}>Yoga Passionates From All Over The World, And Being A Part Of It Has Become A Dream Of Many, Which We At AYM Yoga School Aim To Fulfil. We Continue To Offer Top-Notch Yoga Teacher Training Programs In Indonesia And Are One Of Rishikesh's Best And Biggest Yoga Schools. We Welcome And Build The Lives Of Thousands Of Students Every Year, National And International. And For This Reason, We Are Considered The Best Yoga Training Course In Indonesia.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── 300 Hour Course ── */}
          <h3 className={styles.subTitle}>About 300 Hour Yoga Teacher Training Course In Indonesia</h3>
          <p className={styles.bodyText}>At The Association For Yoga And Meditation In Rishikesh, Our 200-Hour Yoga Teacher Training Course Focuses On Vinyasa Yoga Practice, Pranayama, Chakra, Yoga Therapy, Meditation, Multi-Style Yoga Form And Much More. Overall, Your Ability To Teach Yoga At An Advanced Level Will Be Enhanced By Taking This Breath-Blowing 300-Hour Teacher Training Course At AYM.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Benefits ── */}
          <h3 className={styles.subTitle}>What Are The Benefits Of Learning Yoga?</h3>
          <p className={styles.bodyText}>Yoga Is A Skilful Practice That Harmonises The Mind, Body, And Spirit. Consistent Practice Enables The Practitioner To Achieve Self-Fulfilment, Encounter A Joyful Condition, And Undergo Transformation. Beyond The Mat, Yoga Promotes A Mindful Way Of Living. Should You Enroll For YTT In Indonesia At Our Yoga Centre In Rishikesh? Here Are Some Reasons Why It Is Worth It:</p>
          <p className={styles.bodyText}>Learn New Postures When Travelling Alone And Unsure Of The Route, Becoming Lost Is Simple. Like Any Visitor Exploring A New Location, You Need Directional Indications To Follow And Arrive At Your Destination. Similarly, Getting A Yoga Teacher Certification In Rishikesh Requires Some Guidance. Yoga Instructors' Instructions Assist Their Pupils In Visualizing The Pose And Following The Proper Path For Performing It Correctly. So, A Great Benefit Is That You'll Learn Indications For Direction So That You Can Perform The Postures Correctly And Safely.</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}><strong>Path To Personal Growth :</strong> Yoga Therapy Teacher Training Teaches Us That Although We Can't Change The Past, How We Respond To The Present Can Impact The Future. By Taking Part In Yoga Teacher Training At Our Yoga Centre In Rishikesh, You'll Be Able To Use Those Experiences As Instruments For Personal Growth, Seeking To Move Away From Old Habits And Bad Thoughts And Toward New, Constructive Behaviors.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}><strong>Next Level Practice :</strong> Another Benefit Of Learning Yoga Teacher Training Programs In Indonesia Is That You Allow Yourself To Learn For The Rest Of Your Life When You Decide To Study Yoga. There Is An Endless Supply Of Material Available On The Subject Of Yoga. Being A Teacher Trainee Gives You Access To Both The Fundamental Knowledge Needed To Teach And Lessons From More Seasoned Instructors And Mentors.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── What Can You Expect ── */}
          <h3 className={styles.subTitle}>What Can You Expect Throughout Your Training?</h3>
          <p className={styles.bodyText}>When Searching For The Yoga Teacher Training Course Near Me, You'll Come Across The Association For Yoga And Meditation. This Is Because We Top The List Regarding Yoga Teacher Training Courses. There Are Undoubtedly Several Others Too, But What Makes Us Stand Out Is The Facilities And Environment We Provide Wondering What Makes Us Different?</p>
          <p className={styles.bodyText}>As One Of The Licensed Yoga Teacher Training Courses In Indonesia, We Ensure Our Students Are Comfortable And Ready. In Addition To Teaching You Yoga, We At AYM Yoga Teacher Training In Rishikesh Make Sure That Our Students Have The Best Convenience Possible. We Ensure You Have Hassle-Free Travel By Providing 23 Nights Of Private Accommodations, Movie Nights, Three Nutritious Meals Per Day, Study Course Materials, Weekend Excursions, Kirtan's Night, Free Wifi, And Yoga Mats. Also, To Improve Your Daily Routine And Ensure You Have A Successful Career, Our Yoga Mentors Are Always Ready To Help And Solve All Your Queries. So Don't Only Learn Yoga But Also Prepare Yourself To Teach Others By Enrolling In The Association For Yoga And Meditation Yoga Training Program In Rishikesh. Additionally, The Curriculum Is Continually Reviewed To Ensure That The Students Get The Most Out Of Their Yoga Teacher Training In Indonesia.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Learn Under Best Experts ── */}
          <h3 className={styles.subTitle}>Learn Under The Best Yoga Experts At AYM</h3>
          <p className={styles.bodyText}>Do You Want To Turn Your Passion For Teaching Yoga Into A Successful Career? Are You Trying To Find A Real Yoga Practice In A Place For A Change? At The Association For Yoga And Meditation In Rishikesh, Yoga Instructors Are Skilled And Committed Instructors Who Share Yogic Knowledge In A Welcoming And Kind Way.</p>
          <p className={styles.bodyText}>Yoga And Yoga Institutes In India Are Being Popularized And Promoted By AYM In Addition To The Training Of Yoga Teachers. So Now That The Best Yoga Teacher'll Guide You In Indonesia And Professionals With Years Of Experience In The Field. Simply Put, We Are Prepared To Mould Your Lives, Whatever Motivation You Have For Wanting To Begin Your Yoga Adventure.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── How Will You Change ── */}
          <h3 className={styles.subTitle}>How Will You Change As A Result Of This Yoga Teacher Training In Indonesia?</h3>
          <p className={styles.bodyText}>During Yoga Teaching Courses In Indonesia, The Teachers At AYM School In Rishikesh Focus On Body Alignment And Repositioning. The Practitioner Can Only Fully Benefit From The Practice With Perfect Alignment. Hence It Is Given The Utmost Attention In Their Sessions. Furthermore, With Proper Focus, You'll Surely See A Change, Including:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>Comprehensive Understanding Of The History, Origin, And Philosophy Of Yoga.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>Deepen Your Awareness Of Yoga's Spiritual Aspects.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>Inexpensive 300 Advanced Yoga Certificate Completion Course.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}>Complete Body Cleansing Healing Through Meditation And Cutting-Edge Relaxation Methods.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}>Self-Assurance To Lead Large-Scale Yoga Sessions.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>6</span>
              <p className={styles.bodyText}>A Leaner Body With Improved Stamina And Core Strength.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>7</span>
              <p className={styles.bodyText}>Improved Stability And Flexibility. Guaranteed Inch And Weight Loss.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Get Globally Valid Certificate ── */}
          <h3 className={styles.subTitle}>Get Globally Valid Yoga Certificate At AYM</h3>
          <p className={styles.bodyText}>Searching For A Yoga Instructor Certification Near Me? At The Association For Yoga And Meditation, Every Program Has Received Approval From The Yoga Alliance In The United States And The Ministry Of Ayush In India. After Completing The Aforementioned Courses, You Can Sign Up With Yoga Alliance USA. The Best Yoga Training Institute Award Went To AYM School In 2019 Thanks To The Brand Empower.</p>
          <p className={styles.bodyText}>We Are A Registered Yoga Teacher Training Course In Indonesia With The Yoga Alliance. Our YTT Certification In Indonesia International Yoga Certification Programs For Yoga Is Accepted Worldwide. Because Of This, AYM Is Among The Top Institutions For Yoga Teacher Training Not Only In Rishikesh But All Over The World. Also, Our Alumni Community Of Thousands Of Yogis Is Dispersed Over The Globe, Assisting Other Souls In Leading Healthy, Joyful, And Peaceful Lives.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default IndonesiaPage;
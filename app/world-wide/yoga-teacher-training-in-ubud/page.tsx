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
const UbudPage: React.FC = () => {
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
              <span className={styles.heroTitleAccent}>Ubud</span>
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

          <h2 className={styles.sectionTitle}>Yoga Teacher Training In Ubud</h2>

          {/* ── Premium Yoga Teacher Training ── */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Premium Yoga Teacher Training Courses Available At AYM</h4>
              </div>
              <p className={styles.bodyText}>Everyone In The World Lives A Busy Life With Little Or No Peace. But As Times Change, People Are Becoming Aware Of How Expensive Peace Is And Are Seeking Ways To Achieve It. People Worldwide Are Getting Closer To Yoga As It Is A Way To A Well-Balanced Life. Suppose You Are Among Those Seeking A Peaceful Life Or Developing A Career Out Of Yoga. In That Case, We At The Association For Yoga And Meditation Are The Best Yoga Teacher Training Course In Ubud.</p>
              <p className={styles.bodyText}>Some Of The Most Well-Known Yogis From The World Teach At Our Yoga Teacher Training Course Centre In Rishikesh. The Location Rishikesh Was Chosen For Our Yoga Centre Because Of The Tranquillity And Pureness It Offers That Contribute To Healing The Souls Of Individuals Besides Making It Easier For Them To Adopt A Healthy Lifestyle.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Examine Yoga And Meditation ── */}
          <h3 className={styles.subTitle}>Examine Yoga And Meditation Practices At Association For Yoga And Meditation</h3>
          <p className={styles.bodyText}>The Practice Of Yoga Has Been Existing For Centuries And Has Proven Health Advantages. However, Most People View It As A Form Of Art And Look Forward To Spreading It To Everyone Around. At The Association For Yoga And Meditation, We Offer Registered Yoga Teacher Training Courses In Ubud With The Target Of Promoting It Rapidly. Our Goal As A Top Yoga Teacher Training Program In Ubud Is To Increase Awareness Of These Age-Old Practices And Help People Live A Worthy Lifestyle. We Take You Back To The History From Where It Began To The Time It Starts Now Or Is Expected To Be In The Future. The Deeper Understanding That We Offer Helps One Stay Encouraged As The Students Understand This Practice's Great Importance. Once You Enroll In Our Licensed Yoga Teacher Training Course In Ubud, We Will Help You To Become A Facilitator Who Can Further Direct Others To The Resources One May Need For Development.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── 300 Hour Yoga Books ── */}
          <h3 className={styles.subTitle}>Introduce Yourself To Yoga With 300 Hour Yoga Books</h3>
          <p className={styles.bodyText}>At The Association For Yoga And Meditation, We Suggest Our Students Go Through The 300-Hour Yoga Books. This Is Because Reading These Books Before The YTT Course In Ubud Makes One Familiar With All The Yoga-Related Information, Including Its History, Benefits, Aspects And More. When You Complete Reading The Book And Join The Yoga Teacher Therapy Training Courses, It Will Become Easier For You To Understand Everything That Will Be Taught During The Class. Moreover, Reading Books On Yoga Before Joining The 300-Hour Yoga Teacher Training Course Will Also Improve Your Comprehension. The Books Suggested By Our Yogis Are The Autobiography Of A Yogi Paramahansa Yogananda And The Light On Yoga – By B.K.S Iyengar. These Two Books Are No Less Than A Wealth Of Older Literature That Can Advance Your Spiritual Development And Make You A Better Yoga Instructor.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Prepare Yourself ── */}
          <h3 className={styles.subTitle}>How Can You Prepare Yourself Before Joining The Yoga Classes?</h3>
          <p className={styles.bodyText}>It Does Not Matter If You Are An Experienced Practitioner Or Just A Beginner – You Are Suggested To Prepare Yourself Before Joining The Classes. We Solely Demand This From Our Students As It Would Help To Smoothen Their Journey Of Learning Yoga Teacher Training Courses In Ubud. To Be Precise, A Few Things That One Can Do To Get Ready Include:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}>We Anticipate That Our Students Will Read To Comprehend Yoga's History And Current State.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}>Students Must Aim To Prepare Both Physically And Intellectually By Accepting The Fact That They Will Encounter Challenges During Their YTT In The Ubud Journey.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}>In Addition To Yoga Courses, Students Must Take Care Of Their Health Before, After, And During The Course. For This, They Must Only Adapt To Eating Organic And Healthy Food Items.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}>Students Must Stay Motivated Throughout Ubud's 200-Hour Yoga Teacher Training Course To Complete It And Achieve The Certification.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Understanding The Programs ── */}
          <h3 className={styles.subTitle}>Understanding The Programs Offered By The Association For Yoga And Meditation In Ubud</h3>
          <p className={styles.bodyText}>Students Coming From Ubud Must Know That Our Yoga Centre In Rishikesh Offers High-Level And In-Depth Knowledge Of Yoga Through Our Highly Experienced And Skilled Yoga Teachers. Whether 200, 300, Or 500-Hour Yoga Teacher Training Courses In Ubud – Each Of Them Is Designed Keeping The Future Of Our Students In Mind. Besides Offering In-Depth Knowledge Of Yoga, The Basics Of Human Anatomy, The Study Of Physiology, Postures, Yoga Philosophy, Meditation Techniques, And Ayurveda Knowledge Are Also Offered. The Yoga Instructors Employ Cutting-Edge Methodologies And Special Strategies To Ensure Each Student Gains The Confidence To Spread The Word About Yoga Correctly.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Utilize Your Learning ── */}
          <h3 className={styles.subTitle}>Utilize Your Learning About Yoga To Promote Your Awakening</h3>
          <p className={styles.bodyText}>The Yoga And Meditation Association Is The Place To Go If You Are Looking For Licensed Yoga Instructor Certification In Ubud. Once You Complete The Course, You Can Use It To Promote Your Awakening Or Enlighten Others With Yoga's Gifts. The 300-Hour Yoga Teacher Training Course In Ubud Covers All Minute Aspects Of Yoga, Not Simply The Meditation Techniques. One Does Not Need Prior Experience, Knowledge, Or Understanding To Take The Course. All You Need Is The Dedication To Switch To A Healthy Life Using Nature's Resources. Once You Complete The Course, You Will Be Given The International Yoga Teacher Training Certification In Ubud To Kick-Start Your Career.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Train Others ── */}
          <h3 className={styles.subTitle}>Train Others As A Yoga Teacher Anywhere In The World</h3>
          <p className={styles.bodyText}>You Will Be Prepared To Use Yoga To Ease The Mental Suffering Of Others By Completing Our Yoga Therapy Teacher Training Program In Ubud. Those Who Want To Become Yoga Teachers Can Study Through The Course In Our Yoga Centre In Rishikesh, Surrounded By Lush Green Gardens And A Serene Environment.</p>
          <p className={styles.bodyText}>We At AYM Provide A 500-Hour Yoga Teaching Course In Ubud That Will Give You The Training And Expertise You Need To Instruct Yoga And A Recognized And Highly-Regarded Yoga Teacher Certification. Enrolling In Our Prestigious Yoga Centre In Rishikesh Will Ensure That You Start A Successful Career And Develop Your Personal Abilities.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default UbudPage;
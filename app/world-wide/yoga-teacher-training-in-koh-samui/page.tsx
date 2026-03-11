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
const KohSamuiPage: React.FC = () => {
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
              src="/images/yoga-teacher-training-koh-samui.jpg"
              alt="Yoga Teacher Training In Koh Samui"
              className={styles.heroSilhouette}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Koh Samui</span>
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

          <h2 className={styles.sectionTitle}>Yoga Teacher Training Koh Samui</h2>

          {/* ── Card: Comprehensive Course ── */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Comprehensive Yoga Teacher Training Course In Koh Samui</h4>
              </div>
              <p className={styles.bodyText}>Yoga Is A Renowned Practice That Has Existed For Centuries And Is Benefitting The Lives Of Individuals In Every Way. With Growing Self-Care Awareness, People Are Now Looking Forward To Adopting Yoga Practices To Improve Their Lives. Keeping This In Mind, We At The Association For Yoga And Meditation Have Been Offering Yoga Teacher Training Course Programs In Koh Samui For Over Decades. Our Courses Are Expertly Crafted And Updated With Both Traditional And Contemporary Yogic Knowledge In Mind. Students Can Expect To Be Introduced To Every Facet Of Yoga With Highly Skilled Experts.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Overview Of 200 Hours ── */}
          <h3 className={styles.subTitle}>Overview Of 200 Hours Yoga Teacher Training Course At AYM</h3>
          <p className={styles.bodyText}>We At The Association For Yoga And Meditation Have Exclusive Yoga Course Programs Available For Students. Talking About Our 200 Hours Yoga Teacher Training Course In Koh Samui – It Trains One About Everything From Knowing Human Anatomy To Human Physiology And More. To Be Precise, Students Would Be Guided To Master The Asanas, Yoga Philosophy, Mantra Chanting, Meditation, Pranayama, Ayurveda, Yoga Postures, Breathing Techniques And Even A Yogic Diet. These Are Some Of The Few Chapters That Our 200 Hour, 300 Hour And 500 Yoga Teacher Training Program In Koh Samui Holds. However, There Is More That One Will Be Provided With. Not To Mention, Timely And Regular Assignments, Assessments, Weekend Excursions And Others Would Also Be Conducted For Students To Master Entirely.</p>
          <p className={styles.bodyText}>Once They Qualify For The Registered Yoga Teacher Training Course Program In Koh Samui, They Will Be Offered A Certification.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Premium Quality ── */}
          <h3 className={styles.subTitle}>Premium Quality Yoga Teacher Training In Koh Samui</h3>
          <p className={styles.bodyText}>If You Are From Koh Samui And Want To Start Your Yoga Career As An Instructor, Then We At AYM Can Assist You. We Offer A Specialized Curriculum For 300 Hours Yoga Teacher Training Program In Rishikesh To Our Students From All Over The World Including Koh Samui. Rishikesh Was Chosen As Our Location For The Yoga Centre Because Of Its Serenity, Tranquillity And Peacefulness. Once The Students Enroll In Our 500 Hours Yoga Teacher Training Course In Koh Samui, We Arrange Flight Tickets, Visas, Accommodation, Lodging And Others For A Hassle-Free Journey. Our Goal Is To Provide Students With The Best Yoga Education So They Can Become The Best Teachers. All Of Our Courses Are Masterfully Created Keeping The Diverse Ailments And Requirements Of The Students In Mind. Our Students Can Rely On Us To Support The Growth Of Your Unique Style In Both Teaching And Practice Environments.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Facilities ── */}
          <h3 className={styles.subTitle}>Facilities We Offer At AYM To Our Students In Yoga Courses</h3>
          <p className={styles.bodyText}>Our Students' Yoga Courses Are Created To Make Life Better In Every Way. When You Arrive At Rishikesh To Take Up The 200-Hour Yoga Teacher Training Course In Koh Samui, You Will Be Assisted In Many Different Ways Including:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}><strong>Healthy Organic Meals:</strong> Free Healthy And Organic Meals Would Be Offered Time To Ensure Your Health Is Not Compromised.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}><strong>Free Internet & Utilities:</strong> You Will Get The Availability Of Free Internet And Hot And Cold Water 24 X 7.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}><strong>Study Materials:</strong> Study Materials Would Be Offered That May Be Required For The Course Completion.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>4</span>
              <p className={styles.bodyText}><strong>Respectful Community:</strong> You Will Get A Chance To Be Around Nature And Like-Minded People Where Your Boundaries And Opinions Will Be Respected.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>5</span>
              <p className={styles.bodyText}><strong>Flexible Lodging Options:</strong> Different Lodging Options Are Available For The Students Like Private Rooms, Dormitories, Shared Rooms And More.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Why Choose Us ── */}
          <h3 className={styles.subTitle}>Why Should You Choose The Association For Yoga And Meditation In Koh Samui?</h3>
          <p className={styles.bodyText}>It Is Undoubtedly True That Practicing Yoga Regularly Enables You To Live A Healthy And Serene Life. But It Is Only Possible When You Learn It Correctly Under Yoga Centres Like Ours, "Association For Yoga And Meditation" In Rishikesh, Whose Objective Lies In Helping Others To Achieve A Meaningful Life. Our Vision Is To Help Individuals To Learn How To Live A Holistic Life And Reach Their Full Potential Through Our 300 Hours Of Yoga Teacher Training Course In Koh Samui. At Our Yoga Centre, Our Experts Guide Students To Delve Deeply Into The Knowledge Of Yoga And Meditation. You Can Fully Immerse Yourself In The Yoga Practice When You Enroll In One Of Our Long-Term Courses In YTT In Koh Samui. We Have Made A Reputation As One Of The Most Renowned Platforms That Have Worked Hard To Offer Authorized And Licensed Yoga Teacher Training Courses. Our Teaching Facility Provides A Calm Atmosphere That Ensures You Receive The Most Realistic Course Curriculum Through Efficiency.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Join Us ── */}
          <h3 className={styles.subTitle}>Join Us As We Explore The Art Of Yoga And Meditation</h3>
          <p className={styles.bodyText}>We Can Assist You In Learning About Every Aspect And Minute Detail Of Yoga Through Our Specialized Licensed Yoga Teacher Training Program In Koh Samui. Our Courses Are Carefully Selected And Frequently Updated To Aid Students In Understanding The Unique Features Of Yoga. You Will Get Powerfully Planned And Pre-Designed Lesson Templates At Our Registered Yoga Teacher Training Course. Moreover, We Also Offer Study Materials That May Be Required For Course Completion. In Addition To Showing Injury-Prevention Techniques, We Also Train The Pupils On How To Act As Professionals In Front Of Students. Once Trained Entirely, The Students Will Receive International Yoga Teacher Training Certification In Koh Samui, Globally Recognized In Every Corner Of The World.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Become A Yogic Expert ── */}
          <h3 className={styles.subTitle}>Become A Yogic Expert With Us At AYM</h3>
          <p className={styles.bodyText}>We At The Association For Yoga And Meditation Have Chosen A Distinctive Strategy To Train Students And Offer Them International YTT Certification In Koh Samui. As The Best Yoga Centre, We Focus On The Fundamentals And Provide Individuals With The Resources They Require To Become The Greatest Instructors They Can Be. We Support The Student's Personal And Professional Growth. Additionally, We Ensure They Have Access To A Selection Of Sequences They Can Use As Required During Their Yoga Teaching Career In The Future. Also, Our Students Can Use The International YTT Certification In Koh Samui To Start Their Yoga Classes Anytime.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default KohSamuiPage;
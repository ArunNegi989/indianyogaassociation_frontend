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
const KohPhanganPage: React.FC = () => {
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
              <span className={styles.heroTitleAccent}>Koh Phangan</span>
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

          <h2 className={styles.sectionTitle}>Yoga Teacher Training Koh Phangan</h2>

          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Choose The Top Yoga Teacher Training Program In Koh Phangan</h4>
              </div>
              <p className={styles.bodyText}>Yoga Is One Of The Best Practices That People End Up Choosing To Adopt A Life Of Peace, Calm And Tranquillity. With Each Passing Day, People Are Becoming Aware Of Its Importance And Are Choosing It Without A Second Thought. Some Focus On Learning It For Themselves, While Others Look Forward To Spreading Its Knowledge All Around. And For That, People Prefer To Choose Us At The Association For Yoga And Meditation For A 200 Hour Yoga Teacher Training Course In Koh Phangan. Anyone Interested In Becoming A Yoga Instructor Can Rely On Us As We Provide Individuals With The Best Yoga Instruction And Training. To Date, We Have Trained Thousands Of Pupils Through Our YTT In Koh Phangan, That Have Existed For Over A Decade.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          <h3 className={styles.subTitle}>Why Is AYM The Best Location To Learn Yoga And Meditation?</h3>
          <p className={styles.bodyText}>If You Are Looking Forward To 300 Hours Yoga Teacher Training Course In Koh Phangan, Then Know That We Are Indeed The One-Stop Platform In Rishikesh To Help You Through. There Are Multiple Reasons Why We Are The Best Choice For Everyone Including:</p>

          <div className={styles.cardList}>
            {[
              { title: "Different Course Programmes:", text: "We At AYM Have Different Programs, Including 200 Hour, 300 Hour And 500 Hour Yoga Teacher Training Courses In Koh Phangan. All The Courses Are Designed Keeping The Diverse Requirements Of The Students In Mind. Moreover, Our Courses Can Help One Develop A Well-Balanced Life, Which Is The Main Priority Of Every Student Taking The Course." },
              { title: "Advance Teaching Techniques:", text: "The Yogis At Rishikesh Provide Learning To Students Through Advanced Techniques. But That Does Not Mean That We Exclude The Traditional Approaches. Our 500 Hour Teacher Training Course Program In Koh Phangan Includes Both Contemporary And Modern Learning. Students Are Encouraged To Learn From Where Yoga Started To Where It Stands Today And Where It Will Be In The Future." },
              { title: "Experienced Yogis:", text: "The Best Part About Choosing Our Yoga Teacher Training Course In Koh Phangan Is That We Have Experienced Yogis To Impart Yogic Knowledge To The Students. Each Yogi Is A Real-Life Active Professional With Decades Of Experience And Looks Forward To Guiding Students Equally." },
              { title: "Hassle-Free Learning Journey:", text: "Students From Koh Phangan To Rishikesh Do Not Need To Worry About Anything. Our Yoga Teacher Therapy Training Course Includes Arranging Flight Tickets, Visas, Lodging, And Other Facilities For The Students. Besides That, Three Times Healthy Meals And Free Wifi Would Also Be Provided For Added Convenience." },
              { title: "International Certification:", text: "Students Will Be Given International Certification After Completing The 300 Hour Yoga Teacher Training Course In Koh Phangan. This Certification Is Globally Recognized, Which One Can Use To Proceed With Their Career In Yoga As An Instructor. Also, One Can Use The International Yoga Teacher Training Certification In Koh Phangan To Start Yoga Classes In Any Corner Of The World." },
              { title: "Motivated Atmosphere:", text: "Our Yoga Center In Rishikesh Has A Motivated And Non-Judgemental Atmosphere That Makes Learning Easier For Everyone. Our Classrooms Are Well-Equipped And Deeply Connected To Nature To Give Students A Sensation Of Serenity. Our Classes 200 Hours Yoga Teacher Training Course In Koh Phangan Are Delivered To Students In A Serene Setting So That Everyone Can Concentrate And Feel At Peace." },
            ].map((item, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardHeader}>
                  <Chakra className={styles.cardChakra} color="#e07b00"/>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                </div>
                <p className={styles.bodyText}>{item.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          <h3 className={styles.subTitle}>What Are The Benefits Of Learning Power Yoga?</h3>
          <p className={styles.bodyText}>It Is Crucial To Consider The Advantages It Will Have For You And The Students Who Will Be Studying Under You When You Wish To Launch A Successful Professional Career. Before Enrolling, Check Out The Following To Know The Significant Advantages Of Our 300-Hour Yoga Teacher Training Course.</p>

          <div className={styles.cardList}>
            {[
              { title: "Better Cardiovascular Health:", text: "When You Learn Yoga, You Can Find Its Positive Impact On Cardiovascular Health. At The Association For Yoga And Meditation, We Teach Various Poses That Raise The Heart Rate And Aid In Blood Circulation In A Better Way. As Taking Care Of Heart Health Is Important, Our Yoga Teacher Training Course In Koh Phangan Focuses On Improving It Besides The Overall Well-Being Of An Individual." },
              { title: "Loss Of Weight:", text: "Power Yoga Is The Best Weight Loss Exercise And Offers The Best Diet Plan. This Is Because It Heavily Impacts The Body As The Postures We Teach Help Burn Calories Down. Also, The Diet Plan Offered Is Extremely Healthy And Tasty And Does Not Let One Compromise Their Taste Buds. Our 200-Hour Yoga Teacher Training Course In Koh Phangan Focuses On The Specific Postures That May Be Required To Lose Weight." },
              { title: "Lowering Stress Levels:", text: "Everyone Lives A Stressful Life, And Yoga's Primary Goal Is To Bring Peace And Calmness To One's Life. Through Our Yoga Teacher Therapy Training Course, You Can Expect To Address The Issues Stressing You Out And Aid Them Accordingly. Our Yoga Classes Help To Relax The Muscles And Ensure That You Become Focused On Achieving The Peace You Deserve. Once You Have Obtained The 100-Hour YTT Certification In Koh Phangan From Us, You Can Concentrate On Specific Stress Management Workshops That Are Tailored To This Particular Field." },
            ].map((item, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardHeader}>
                  <Chakra className={styles.cardChakra} color="#e07b00"/>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                </div>
                <p className={styles.bodyText}>{item.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          <h3 className={styles.subTitle}>Understand Minute Details Of Yoga With Us At AYM</h3>
          <p className={styles.bodyText}>On Choosing Our Licensed Yoga Teacher Training Program In Koh Phangan, You Can Expect To Get A Detailed Review Or Learning Of How Yoga Began And Where It Lies Today. You Will Be Introduced To The Latest Aspects Of Yoga And Taught How You Could Transform Your Life Using It. As The Best Provider Of Registered Yoga Therapy Teacher Training Courses In Koh Phangan, We Ensure That You Are Molded To Become A True Professional. Also, You Will Be Trained To Deal With Students In The Future. Every Course Includes Different Topics Besides Assignments And Assessments. Once You Qualify, You Will Be Rewarded With The YTT International Certification.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default KohPhanganPage;
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
const PolandPage: React.FC = () => {
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
              src="/images/yoga-teacher-training-poland.jpg"
              alt="Yoga Teacher Training In Poland"
              className={styles.heroSilhouette}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Poland</span>
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

          <h2 className={styles.sectionTitle}>Get Certified With Power Yoga Teacher Training In Poland</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Begin Your Yoga Teaching Career With AYM In Poland</h4>
              </div>
              <p className={styles.bodyText}>Yoga And The Amazing Benefits It Renders To Our Mind And Body Are Multifaceted, And Hence, Practicing The Same Every Day Can Make You Feel Much Better. If You Have An Affinity In This Field And Want To Establish Yourself As A Potent Yoga Guru In The Domain, Then It Is Time That You Get In Touch With Us At The Association For Yoga And Meditation. Our Yoga Teaching Course In Poland Has Been Designed Such That Each Individual Who Wants To See Themselves As A Guru Gets Proper Guidance As Well As Certification For Legitimate Practices And Teaching.</p>
              <p className={styles.bodyText}>At The Association For Yoga And Meditation, We Try To Instill That Practice In You And Make Sure You Make A Name For Yourself As The Best Yoga Teacher In Poland. This Is A 100-Hour Yoga Training Program, Right From The Basics Of Power Yoga To The Lifestyle And The Advanced Sectors — We Will Cover It All.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Power Yoga Detox ── */}
          <h3 className={styles.subTitle}>Power Yoga – The Ultimate Modern Day Detox</h3>
          <p className={styles.bodyText}>We Have Often Noticed That To Achieve Wellness, People Tend To Spend Lakhs Of Rupees On Expensive Detox And Diets While The End Result Continues To Remain Stagnant At Zero. Our Motto Is To Make Sure That We Can Train Gurus Who Can Change Your Lifestyle Completely And Can Make You Aware That Yoga Does Not Need A Lot Of Things At Hand To Be Considered The Ultimate Form Of Lifestyle. The Only Thing You Would Need To Do Is Have The Right Mindset And An Expert Yoga Therapy Teacher Training Guide To Excel.</p>
          <p className={styles.bodyText}>Power Yoga, At Its Best, Is The Ultimate Resolution For Modern-Day Problems, And The Way It Has Culminated Into Practice Is Worth Resonating With. But At The Same Time, Having The Right Yoga Teacher Certification Is Very Important, And Hence, We Are Here To Help You With The Same.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Understanding Power Yoga ── */}
          <h3 className={styles.subTitle}>Understanding The Concept Of Power Yoga</h3>
          <p className={styles.bodyText}>Do You Know What Power Yoga Is? The Easiest Explanation For This Genre Is That It Is A Fast-Paced Cardiovascular Form Of Yoga Which Targets High Heart Activity By Focusing On Yoga Postures Which Are High Impact. Although Power Yoga Aims To Make You More Calm And Composed, There Are A Lot Of Physical Benefits Of The Same, And These Are Noticeable Once You Spend A Considerable Time Pursuing The Same.</p>
          <p className={styles.bodyText}>The Unique Thing About Our 200 Hour Yoga Training Program Poland Is It Is A Unique Blend Of Postures From The Different Branches Of Yoga, And This Is What Makes It Very High Impact As Well. This Is One Of The Primary Reasons Why Our Yoga Teacher Training Program In Poland Has Been Made Comprehensive So That We Can Reach Out To Those Who Aspire To Achieve Something In This Field.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Benefits of Power Yoga ── */}
          <h3 className={styles.subTitle}>Benefits Of Learning Power Yoga</h3>
          <p className={styles.bodyText}>When You Want To Set Up A Professional Career In A Certain Form Of Practice And Get Enrolled In The 300 Hour Yoga Teacher Training Program In Poland, You Must Go Beyond And Understand What The Benefit That It Is Going To Bring For You As Well As For Your Students. Some Of The Major Perks Of Practicing Power Yoga Are:</p>

          <div className={styles.numberedList}>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>1</span>
              <p className={styles.bodyText}><strong>Better Cardiovascular Health:</strong> The First And Most Promising Benefit Of Learning Power Yoga Is That It Is Great For Your Cardiovascular Health. Power Yoga Is A Form Of Exercise Which Is Completely Based On High-Impact Postures, Hence It Gets Your Heart Rate Higher And Helps In Better Circulation Of Blood. In The Given Times With The Kind Of Stress That Each And Every Individual Passes Through, Heart Health Is Something That We Have To Take Care Of Under All Circumstances.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>2</span>
              <p className={styles.bodyText}><strong>Weight Loss:</strong> While The World Is Going Crazy To Find Out The Best Workout And Diet Routines That Can Help Them Lose Weight, Power Yoga Is The Ultimate Answer. This Is A High-Impact Form Of Exercise, And Hence It Targets The Increase Of Your Heart Rate To A Great Extent. You Will Actually Be Able To Burn Loads Of Calories If You Practice It In The Right Form. Once You Are With Us For The Yoga Therapy Teacher Training Course, We Will Also Focus On Which Particular Postures You Need To Emphasize For Students Who Want To Lose Weight.</p>
            </div>
            <div className={styles.numberedItem}>
              <span className={styles.numBadge}>3</span>
              <p className={styles.bodyText}><strong>Reduction Of Stress Level:</strong> The Way We Run From One Domain To Another Each And Every Single Day Has Made Us Extremely Stressed, And This Is Something That Needs To Be Taken Care Of. Power Yoga Calms Your Nerves Down And Ensures That You Are Able To Do Something Where The Only Thing That You Focus On Is YOU. Once You Have Received The 100-Hour YTT Certification In Poland From Us, You Can Focus On Particular Stress Management Classes As Well.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Lifestyle Needs ── */}
          <h3 className={styles.subTitle}>Lifestyle Needs To Practice Power Yoga</h3>
          <p className={styles.bodyText}>Finally, As You Might Have Already Noticed, Practicing Power Yoga In The Right Form Is More Of A Practice That You Need To Master. Hence You Have To Train Your Mind And Body In The Same Way So That It Is Able To Give You The Flexibility That Is Important For The Pursuit. Try To Make Sure That You Do Not Take Any Kind Of Intoxication Because This Will Actually Mess With The Metabolic Rate Of Your Body And Will Slow Down Your Ability To Practice.</p>
          <p className={styles.bodyText}>Association For Yoga And Meditation Has Been In The Forte For Quite Some Time Now. Hence, It Is Our Onus To Get You The Best International Yoga Certification Which Will Add Credibility To Your Resume. You Can Immediately Start Training After The Completion, And Hence Get In Touch With Us Today To Enroll Yourself!</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default PolandPage;
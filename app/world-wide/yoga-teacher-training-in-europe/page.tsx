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
const EuropePage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* ━━━━ HERO ━━━━ */}
      <section className={styles.heroSection}>
        <Mandala className={styles.heroBgMandalaL}/>
        <Mandala className={styles.heroBgMandalaR}/>
        <div className={styles.heroContent}>
          <div className={styles.heroSilhouetteSide}>
            <img
              src="/images/yoga-teacher-training-europe.jpg"
              alt="Yoga Teacher Training In Europe"
              className={styles.heroSilhouette}
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Yoga Teacher Training In{" "}
              <span className={styles.heroTitleAccent}>Europe</span>
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

          <h2 className={styles.sectionTitle}>Learning To Teach Yoga In Europe: A 200-Hour Course In Europe</h2>

          {/* Intro card */}
          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Chakra className={styles.cardChakra} color="#e07b00"/>
                <h4 className={styles.cardTitle}>Yoga Teacher Training In Europe</h4>
              </div>
              <p className={styles.bodyText}>Embark On A Transformational Journey With Our Yoga Course In Europe. Set Amidst The Tranquil Landscapes Of Europe, Our Comprehensive Programs Combine Traditional Yoga Teachings With Modern Techniques To Provide A Comprehensive Learning Experience. Our Training Covers Various Aspects Of Yoga, Including Asana, Pranayama, Meditation, Anatomy And Philosophy, Led By Experienced And Knowledgeable Teachers.</p>
              <p className={styles.bodyText}>Immerse Yourself In Europe's Rich Cultural Heritage And Delve Deeper Into Your Yoga Practice. Whether You Are An Experienced Practitioner Or A Beginner, Our Training Suits People At All Levels. Come To Europe And Take Your First Steps Towards Becoming A Certified Yoga Teacher While Enjoying The Beauty And Tranquillity Of The European Continent.</p>
            </div>
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Benefits ── */}
          <h3 className={styles.subTitle}>Benefits Of Yoga Teacher Training In Europe</h3>

          <div className={styles.numberedList}>
            {[
              { bold:"Tranquil Environment:", text:"Immerse Yourself In Europe's Tranquil And Picturesque Landscapes, Providing The Perfect Backdrop For A Holistic And Peaceful Learning Experience." },
              { bold:"Cultural Immersion:", text:"Experience Europe's Rich History And Diverse Cultures, Which Will Give You A Unique And Enriching Yoga Training Experience Beyond The Classroom." },
              { bold:"Experienced Teachers:", text:"Learn From Qualified And Experienced Yoga Teachers Who Bring Their Knowledge And Expertise To Guide Your Yoga Journey." },
              { bold:"Certification:", text:"Upon Completing The Course, You Will Receive A Globally Recognized Yoga Teacher Certification, Enabling You To Teach Yoga And Share Your Passion Worldwide." },
              { bold:"Personal Growth:", text:"Engage In Self-Discovery And Personal Growth As Your Training Promotes Self-Reflection, Mindfulness, And Inner Balance." },
              { bold:"Networking Opportunities:", text:"Connect With Like-Minded People Worldwide To Build Meaningful Relationships And A Supportive Yoga Community." },
              { bold:"Lifestyle & Wellness:", text:"Incorporating Yoga Into A Balanced And Healthy Lifestyle Can Give You Insight Into Holistic Living, Mindfulness Practices And Overall Wellness." },
              { bold:"Explore:", text:"Combine Your Yoga Training With The Opportunity To Explore Europe's Famous Cities, Landmarks, And Natural Wonders, Creating Unforgettable Memories." },
            ].map((item, i) => (
              <div key={i} className={styles.numberedItem}>
                <span className={styles.numBadge}>{i+1}</span>
                <p className={styles.bodyText}><strong>{item.bold}</strong> {item.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Why Choose ── */}
          <h3 className={styles.subTitle}>Why You Should Choose Yoga Teacher Training In Europe</h3>
          <p className={styles.bodyText}>Choosing Yoga Teacher Training In Europe Can Be A Transformative And Enriching Experience For Several Reasons:</p>

          <div className={styles.numberedList}>
            {[
              { bold:"Cultural Diversity:", text:"Europe Has Diverse Cultures, Traditions And Landscapes That Provide A Unique Backdrop For Your Yoga Training." },
              { bold:"Experienced Teachers:", text:"Many Renowned Yoga Teachers And Leaders Host Training Programs In Europe, Offering Their Valuable Expertise And Guidance In An Inspiring Environment." },
              { bold:"Comprehensive Learning Environment:", text:"Europe's Calm And Peaceful Environment Creates An Ideal Setting For Deepening Your Yoga Practice, Introspection And Personal Growth." },
              { bold:"Global Recognition:", text:"Earning Your Yoga Teacher Certification In Europe Gives You International Recognition And Credibility, Increasing Your Chances Of Landing Teaching Jobs Worldwide." },
              { bold:"Networking Opportunities:", text:"Exchange Ideas With Like-Minded People From Different Backgrounds And Build Contacts And Friendships Within The Global Yoga Community." },
              { bold:"Personal Growth And Discovery:", text:"Immerse Yourself In Europe's Rich History, Art And Natural Beauty And Complement Your Yoga Training With An Enriching Cultural Experience." },
              { bold:"Marketing And Business Insights:", text:"Learn About European-Specific Yoga Business Practices And Marketing Strategies That Will Prepare You For Success As A Yoga Teacher." },
            ].map((item, i) => (
              <div key={i} className={styles.numberedItem}>
                <span className={styles.numBadge}>{i+1}</span>
                <p className={styles.bodyText}><strong>{item.bold}</strong> {item.text}</p>
              </div>
            ))}
          </div>

          <p className={styles.bodyText}>Overall, Enrolling In A Yoga Teacher Training Course In Europe Will Give You A Solid Foundation For Your Path As A Certified Yoga Teacher While Providing Opportunities For Personal Enrichment And Exploration.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Overview ── */}
          <h3 className={styles.subTitle}>Overview Of Our Comprehensive Yoga Teacher Training Course In Europe</h3>
          <p className={styles.bodyText}>Our Comprehensive Yoga Teacher Training Course In Europe Is Designed To Provide A Comprehensive And Intensive Learning Experience Encompassing Aspects Of Traditional And Contemporary Yoga Practices. The Key Highlights Of Our Program Include:</p>

          <div className={styles.numberedList}>
            {[
              { bold:"Comprehensive Curriculum:", text:"Our Curriculum Covers Asana, Pranayama, Meditation, Yoga Philosophy, Anatomy, Alignment, Teaching Techniques And More To Ensure A Comprehensive Training Experience." },
              { bold:"Experienced Teachers:", text:"Led By Experienced And Certified Yoga Teachers, Our Programs Provide Guidance And Mentorship From Experts In Their Field Who Provide Valuable Insights And Personal Support." },
              { bold:"Hands-On Teaching Experience:", text:"Our Training Includes Opportunities For Hands-On Teaching Practice To Help Students Improve Their Teaching Skills And Gain Confidence Leading Yoga Sessions." },
              { bold:"Cultural Immersion:", text:"Participants Are Encouraged To Explore The Local Culture And Heritage, Enriching The Overall Training Experience With Unique Perspectives." },
              { bold:"Certification:", text:"Upon Course Completion, Participants Will Receive A Globally Recognized Certification, Beginning Their Journey As A Certified Yoga Teacher." },
              { bold:"A Supportive Community:", text:"Our Training Fosters An Inclusive Environment, Facilitating Participants' Connection, Collaboration, And Personal Growth." },
            ].map((item, i) => (
              <div key={i} className={styles.numberedItem}>
                <span className={styles.numBadge}>{i+1}</span>
                <p className={styles.bodyText}><strong>{item.bold}</strong> {item.text}</p>
              </div>
            ))}
          </div>

          <p className={styles.bodyText}>Our Yoga Teacher Training Courses In Europe Are Designed To Provide Participants With A Transformative And Enriching Experience, Giving Them The Skills, Knowledge And Confidence To Share The Gift Of Yoga With Others.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Traditional Yogic Fare ── */}
          <h3 className={styles.subTitle}>Traditional Yogic Fare For A Yogic Way Of Life</h3>
          <p className={styles.bodyText}>Yoga Nutrition Goes Beyond Food Nutrients. When Choosing A Diet, You Should Also Consider Energy Since A Rigorous Yoga Practice Demands A Proper Nutrient Supply. After Hours Of Meditation, Many Followers Only Want To Eat Vegetarian Meals.</p>
          <p className={styles.bodyText}>Ayurveda Describes How Eating Impacts Mental, Spiritual, And Physical Health. "Sattva" In Ayurveda Means Pure Knowledge, Virtue, Consciousness, And Happiness. Sattvik Diets Enhance Physical And Mental Health And Promote A Serene And Open Mentality.</p>
          <p className={styles.bodyText}><strong>Sattvik Food Habit:</strong> 100% Vegetarian Sattvik Foods Are Ideal For Yogis. Because These Food Substances Don't Include Meat Or Dairy, No Animals Are Harmed And Are Organic In Nature Without Artificial Colors, Flavours, Or Preservatives.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Sattvic Meal ── */}
          <h3 className={styles.subTitle}>What's A Sattvic Meal?</h3>
          <p className={styles.bodyText}><strong>Sattvik Foods Include:</strong></p>

          <div className={styles.numberedList}>
            {["Organic Produce", "Healthy Whole Grains And Nut Butter", "Mammalian Milk And Ghee (Clarified Butter), Etc"].map((item, i) => (
              <div key={i} className={styles.numberedItem}>
                <span className={styles.numBadge}>{i+1}</span>
                <p className={styles.bodyText}>{item}</p>
              </div>
            ))}
          </div>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Genuine Yoga Methods ── */}
          <h3 className={styles.subTitle}>Explanations Of Genuine Yoga Methods</h3>
          <p className={styles.bodyText}>Those Who Are Interested Can Take Advantage Of The Licensed Yoga Teacher Training Course In Europe's Comprehensive Training Programs Offered By Us "Association For Yoga And Meditation." Through Our Courses, You Can Expect To Lead To Detailed Training And Then Achieve The Yoga Instructor Certification That Is Valid Worldwide. Our Team Comprises Yoga Experts With Significant Experience Passing On Their Knowledge To Others In The Field. At Our YTT Course In Europe, We Are Able To Give Each Student The Individualized Attention That They Require To Develop Into Fully Formed Experts.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>ॐ</span><span className={styles.ornLm}/></div>

          {/* ── Most Prestigious ── */}
          <h3 className={styles.subTitle}>The Most Prestigious Location In All Of Europe For In-Depth, State-Of-The-Art Yoga Teacher Training</h3>
          <p className={styles.bodyText}>Our Mission Is To Give Students The Most In-Depth Education That Is Currently Available In The Field Of Yoga Through Our Licensed Yoga Teacher Training Course In Europe So That Our Students Can Go On To Become The Most Highly Qualified Yoga Therapists. We Have Established A Cutting-Edge Curriculum That Is Continually Revised So That We Can Share The Most Recent Findings In The Field Of Yoga As A Treatment For Various Conditions.</p>
          <p className={styles.bodyText}>Everyone Of Any Age And Of Either Gender Is Welcome To Participate In Our Yoga Teacher Training In Europe. Regardless Of Whether Or Not You Have Previous Experience With Yoga, Our Yoga Teacher Training Europe Curriculum Will Teach You Everything There Is To Know About The Practice Before Awarding You The Europe International Yoga Instructor Certification.</p>

          <div className={styles.miniOm}><span className={styles.ornLm}/><span className={styles.omT}>❦</span><span className={styles.ornLm}/></div>

          {/* ── Give Your Support ── */}
          <h3 className={styles.subTitle}>Give Your Support To A Way Of Life That Is Peaceful And Joyful</h3>
          <p className={styles.bodyText}>Students From Our Yoga Teacher Training Program In Europe Are Spreading The Practice Of Yoga, Which Helps Individuals Discover Quiet, Serenity, And Peace Inside Themselves. Before Moving On To Instructing Others, Our Yoga Instructors Put The Health And Fitness Of The Students As A Top Priority. This Program For Yoga Therapy Teacher Training In Europe Focuses A Significant Emphasis On The Potential Of Yoga To Assist Its Participants In Developing Their Own Skills As Instructors. Students Who Earn The YTT Course In Europe Credential Are Considered Positively In Various Other Nations Worldwide.</p>

          <div className={styles.ornRow} style={{marginTop:"2rem"}}><span className={styles.ornL}/><span className={styles.ornSym}>❧</span><span className={styles.ornL}/></div>
        </div>
      </section>

    </div>
  );
};

export default EuropePage;
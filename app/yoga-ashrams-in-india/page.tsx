// YogaAshrams.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-ashrams-in-india/Yogaashrams.module.css";
import yogaashramimg1 from "@/assets/images/yoga-ashram-in-india.jpg";
import yogaashramimg2 from "@/assets/images/yoga-ashram-in-rishikesh.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/35.png";
import Link from "next/link";

// ---- Om Symbol SVG ----
const OmSVG: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="30"
      cy="30"
      r="28"
      stroke="#e8600a"
      strokeWidth="2"
      fill="none"
    />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="28"
      fill="#e8600a"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);


// ===================== MAIN COMPONENT =====================
const YogaAshrams: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
{/* ===== HERO SECTION - FIXED ===== */}
<section className={styles.heroSection}>
  <Image
    src={heroImg}
    alt="Yoga Students Group"
    width={1180}
    height={540}
    className={styles.heroImage}
    priority
  />
</section>

{/* ===== TITLE SECTION - SEPARATE ===== */}
<section className={styles.titleSection}>
  <div className={styles.titleContainer}>
    <h1 className={styles.mainTitle}>Yoga Ashrams in India</h1>
    
  </div>
</section>



{/* ===== FEATURE IMAGE ===== */}
<section className={styles.featureSection}>
  <div className={styles.featureContainer}>
    <div className={styles.featureImageBox}>
      <Image
        src={yogaashramimg1}
        alt="Yoga Ashrams in India"
        fill
        sizes="(max-width: 575px) 100vw, (max-width: 991px) 90vw, 820px"
        style={{ objectFit: "cover" }}
        priority
      />
      <div className={styles.featureQuote}>
        <span className={styles.quoteMark}>"</span>
        <p>Where spirituality meets serenity</p>
      </div>
    </div>
  </div>
</section>


{/* ===== WELCOME SECTION - STATS STYLE ===== */}
<section className={styles.welcomeSection}>
  <div className={styles.welcomeGrid}>
    <div className={styles.welcomeStats}>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>2000+</span>
        <span className={styles.statLabel}>Years of Tradition</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>500+</span>
        <span className={styles.statLabel}>Yoga Ashrams</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNumber}>100+</span>
        <span className={styles.statLabel}>Countries Visited</span>
      </div>
    </div>
    <div className={styles.welcomeContent}>
      <p className={styles.welcomeText}>
        Welcome to AYM Yoga Ashram in Rishikesh. India, the land of religions, faith, traditions, and spirituality, is well-known worldwide for yoga and meditation practices. Many schools and yoga ashrams across India provide yoga and meditation training to all those seeking them. For this reason, people from all walks of life come to India to find calm and peace. Here, they come to learn and practice yoga and meditation and find peace for mind, body, and soul.
      </p>
      <p className={styles.welcomeText}>
        <strong> Yoga Ashrams in India</strong> provide various yoga courses for one and all, starting from- Primary (Basic), Secondary (Intermediate) and Intensive (In-depth /Thorough). Yoga seekers, enthusiasts, and yoga travellers can choose the course of their choice according to the time they can give to learn them.  <strong>AYM yoga ashram in rishikesh</strong> also provides many yoga activities like yoga retreats for beginners, yoga teacher training for those who want to be a yoga teacher and inner awakening for spiritual shadhakas.
      </p>
      
    </div>
  </div>
</section>


{/* ===== EXPERIENCE SECTION - UPDATED WITH FULL CONTENT ===== */}
<section className={styles.experienceSection}>
  <div className={styles.experienceHeader}>
    <h2 className={styles.experienceTitle}>
      Enthralling experiences in Yoga Ashrams Rishikesh &amp; Practice of Yoga &amp; Mediation
    </h2>
  </div>

  <p className={`${styles.experienceBody} container`}>
    There has never been a better time to commence your Rishikesh yoga adventure. Enjoyment in every moment can be yours through learning and practising yoga, breathing, and meditation techniques. Imagine learning to live a genuinely fulsome life right in the heart of India - living in a large, comfortable ashram with other seekers worldwide. You will be creating memories of a lifetime. AYM <strong>yoga ashram in rishikesh</strong>, India, is well-known for traditional and authentic yoga. At our ashram, yoga seekers can stay and indulge in more profound practice in the presence of traditional gurus. The best part is that you will get the incredible opportunity to learn yoga from its pioneers, the experts who have learnt these techniques at the Vedic Gurukuls and yoga tradition. You have a unique and authentic opportunity to learn and grow at AYM Yoga Ashram in India.
  </p>

  <p className={`${styles.experienceBody} container`}>
    What distinguishes yoga learning at the AYM Rishikesh ashrams from the others is our commitment to providing comprehensive and thorough training. We ensure that the yoga practitioner will be educated in the foundational principles and science behind each pose. Our teachers are both skilled and experienced. They are experts who have experienced ultimate enlightenment and teach from their hearts, minds, and souls, instilling in you a deep sense of confidence in the quality of education you will receive.
  </p>

  <div className={styles.timelineGrid}>
    <div className={styles.timelineItem}>
      <div className={styles.timelineIcon}>🧘</div>
      <div className={styles.timelineContent}>
        <h3>Authentic Learning</h3>
        <p>Learn yoga from pioneers who mastered techniques at Vedic Gurukuls</p>
      </div>
    </div>
    <div className={styles.timelineItem}>
      <div className={styles.timelineIcon}>📚</div>
      <div className={styles.timelineContent}>
        <h3>Comprehensive Training</h3>
        <p>Foundation principles and science behind each yoga pose</p>
      </div>
    </div>
    <div className={styles.timelineItem}>
      <div className={styles.timelineIcon}>👨‍🏫</div>
      <div className={styles.timelineContent}>
        <h3>Expert Teachers</h3>
        <p>Skilled masters who teach from heart, mind, and soul</p>
      </div>
    </div>
    <div className={styles.timelineItem}>
      <div className={styles.timelineIcon}>🌿</div>
      <div className={styles.timelineContent}>
        <h3>Peaceful Environment</h3>
        <p>Large, comfortable ashram with seekers from worldwide</p>
      </div>
    </div>
  </div>
</section>


    {/* ===== BEST HOME FOR YOGA ===== */}
<section className={styles.bestSection}>
  <p className={styles.sectionLabel}>Yoga Capital of the World</p>
  <h2 className={styles.sectionTitle}>
    Yoga Ashrams in Rishikesh — Best Home for Yoga
  </h2>
  <div className={styles.bestGrid}>
    <div className={styles.highlightCard}>
      <h3 className={styles.highlightCardTitle}>About Rishikesh</h3>
      <p className={styles.bodyText}>
        Rishikesh, the holy city of India, is recognized worldwide as the{" "}
        <Link href="/international-yoga-competition">"International Yoga Hub"</Link>. People who wish to
        rediscover themselves visit Rishikesh AYM Yoga Ashram. There are many{" "}
        <em>yoga ashrams in Rishikesh</em> offering styles such as{" "}
        <Link href="/hatha-yoga-teacher-training-Rishikesh">Hatha Yoga</Link>, <Link href="/vinyasa-teacher-training-india">Ashtanga</Link>, Vinyasa,
        Vinyasa Flow, Iyengar, Kundalini and Power Yoga.
      </p>
      <p>AYM Yoga Ashram provides a peaceful and traditional environment where students from all over the world come together to learn authentic yoga practices. Surrounded by the beautiful Himalayas and the sacred river Ganga, the ashram offers a perfect atmosphere for spiritual growth, self-discovery, and inner peace.</p>
      <div className={styles.certBadges}>
        <span className={styles.badge}>Yoga Alliance USA</span>
        <span className={styles.badge}>Intl. Yoga Federation</span>
      </div>
    </div>
    <div className={styles.highlightCard}>
      <h3 className={styles.highlightCardTitle}>Courses Offered</h3>
      <p className={styles.bodyText}>
      Different yoga ashrams offer different courses of various durations, affording variety and choice. The courses offered include 200 hours teacher training, 300 hour teacher training and 500 hours teacher training and span from 25 days to 1 month to about two months. All of the previous activities you will find at one home known as AYM Yoga Ashram in rishikesh. Once you have completed your course, you receive certificates which are verified and recognized by Yoga Alliance USA and International Yoga Federation.
      </p>
      <div className={styles.coursePills}>
        <Link href="/200-hour-yoga-teacher-training-rishikesh" className={styles.pillLink}>200 Hours Teacher Training <span className={styles.pillArrow}>›</span></Link>
        <Link href="/300-hours-yoga-teacher-training-rishikesh" className={styles.pillLink}>300 Hours Teacher Training <span className={styles.pillArrow}>›</span></Link>
        <Link href="/500-hour-yoga-teacher-training-india" className={styles.pillLink}>500 Hours Teacher Training <span className={styles.pillArrow}>›</span></Link>
      </div>
    </div>
  </div>
</section>

{/* ===== BOTTOM ASHRAM PHOTO ===== */}
<section className={styles.photoSection}>
  <div className={styles.photoFrame}>
    <div className={styles.ashramImageBox}>
      <Image
        src={yogaashramimg2}
        alt="Yoga Ashram in Rishikesh"
        fill
        sizes="(max-width: 575px) 100vw, (max-width: 991px) 90vw, 860px"
        style={{ objectFit: "cover" }}
        loading="lazy"
      />
      <div className={styles.photoCaptionBar}>
        <p className={styles.photoCaptionTitle}>Yoga Ashram in Rishikesh</p>
        <span className={styles.photoCaptionSub}>AYM Yoga School · Rishikesh, Uttarakhand</span>
      </div>
    </div>
  </div>
</section>


{/* ===== WHAT IS AN ASHRAM ===== */}
<section className={styles.whatSection}>
  <p className={styles.sectionLabel}>Understanding the Space</p>
  <h2 className={styles.sectionTitle}>What is an Ashram?</h2>
  <div className={styles.whatInner}>
    <div className={styles.whatVisual}>
      {[
        { icon: "🏔", label: "Away from city" },
        { icon: "🧘", label: "Daily practice" },
        { icon: "📖", label: "Spiritual school" },
        { icon: "🌿", label: "Karma yoga" },
      ].map((item) => (
        <div key={item.label} className={styles.whatIconBlock}>
          <span className={styles.whatIcon}>{item.icon}</span>
          <span className={styles.whatIconLabel}>{item.label}</span>
        </div>
      ))}
    </div>
    <div className={styles.whatText}>
      <p className={styles.bodyText}>
        An ashram is a home which remains away from the hustle-bustle of city
        life. It is a place usually located amidst a calm and peaceful
        environment ranging from hills to forests to riverside. an ashram is a spiritual hermitage or a secluded community where students (sometimes called sadhakas or brahmacharins) live together under the direct guidance of a guru (spiritual teacher). The primary purpose of an ashram is to provide a disciplined, supportive environment for the intensive practice of yoga—not just physical postures (asana), but the full scope of yogic life.
      </p>
      <p className={styles.bodyText}>
        Living in an ashram offers a structured daily routine that nurtures both inner growth and outer discipline. From early morning meditation and yoga practices to mindful meals and self-reflection, every aspect of ashram life is designed to cultivate awareness and simplicity. Away from distractions, students develop a deeper understanding of yogic principles such as self-discipline, compassion, and detachment. This immersive environment not only enhances spiritual learning but also helps individuals reconnect with their true purpose and lead a more balanced and meaningful life.
      </p>
      <blockquote className={styles.pullquote}>
        The ashram is a home away from home — where students can stay, read,
        study and practice yoga in a peaceful, undisturbed environment.
      </blockquote>
      <p className={styles.bodyText}>
        While living in an ashram, you must wake up early and do mantra
        chanting and yoga practice...
      </p>
    </div>
  </div>
</section>


{/* ===== WHY IS AYM BEST ===== */}
<section className={styles.whySection}>
  <div className={styles.whyInner}>
    <p className={styles.sectionLabel}>Our Difference</p>
    <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>
      <Link href="/yoga-ttc-rishikesh">Why is AYM Yoga Ashram best to learn yoga?</Link>
    </h2>
    
    <p className={styles.whyBody}>
      Yoga ashram is considered the best place to learn yoga because it is located away from the hustle and bustle of daily life and is free from interruptions and disturbances. AYM Yoga ashram has experienced and qualified teachers who teach different styles and aspects of yoga. Regular yoga practice with various asanas allows people to have a healthy mind and body free of toxins and harmful things. It is an ashram where people learn to focus and concentrate on doing one particular thing at a time or a set of skills while doing a specific kind of work.
    </p>
    <p className={styles.whyBody}>
      Once at our ashram, people can focus on themselves and find who they are and what they want to do. Also, at AYM Yoga Ashram, people find the true meaning of life and find out how they can serve themselves by serving others. Once they have become well-versed in one or more styles of yoga and have learned to meditate, they can get back to their lives and work better and more efficiently. By doing so, they are equipped with life skills to start progressing.
    </p>
  </div>

  <div className={`${styles.whyGrid} container`}>
      {[
        { num: "01", label: "Location", title: "Free from distraction", desc: "Located away from the hustle of daily life, free from interruptions, with full focus on your practice." },
        { num: "02", label: "Teachers", title: "Experienced masters", desc: "Qualified teachers who teach different styles and aspects of yoga with heart, mind, and soul." },
        { num: "03", label: "Practice", title: "Holistic wellness", desc: "Regular yoga practice with various asanas allows people to have a healthy mind and body free of toxins." },
        { num: "04", label: "Purpose", title: "Life transformation", desc: "People find the true meaning of life and discover how they can serve themselves by serving others." },
      ].map((card) => (
        <div key={card.num} className={styles.whyCard}>
          <p className={styles.whyCardNum}>{card.num} — {card.label}</p>
          <h3 className={styles.whyCardTitle}>{card.title}</h3>
          <p className={styles.whyCardDesc}>{card.desc}</p>
        </div>
      ))}
    </div>
</section>


{/* ===== ACTIVITIES ===== */}
<section className={styles.actSection}>
  <p className={styles.sectionLabel}>Life at the Ashram</p>
  <h2 className={styles.sectionTitle}>Activities in AYM Rishikesh Yoga Ashram</h2>
  <p className={styles.bodyText}>
    AYM Yoga School is the{" "}
    <strong>best yoga teacher training ashram in Rishikesh</strong> offering
    various styles of yoga. Beyond certified programs, the Ashram also carries
    out other enriching activities for its students.
  </p>
  <div className={styles.actGrid}>
    {[
      { icon: "🙏", text: "Karma Yoga — students participate in ashram activities as service" },
      { icon: "🎶", text: "Keertans — singing of religious songs and mantras together" },
      { icon: "🎬", text: "Yoga & meditation films — curated viewing sessions" },
      { icon: "🛕", text: "Spiritual site visits — one excursion during the course" },
      { icon: "🌅", text: "Free Sundays — explore Rishikesh and nearby places of worship" },
      { icon: "💬", text: "Post-class discussions with teachers on all aspects of life" },
    ].map((a) => (
      <div key={a.text} className={styles.actCard}>
        <span className={styles.actIcon}>{a.icon}</span>
        <p>{a.text}</p>
      </div>
    ))}
  </div>
  <p className={styles.bodyText}>
    At AYM, you have a lot to learn. Don&apos;t wait — come and learn the
    nuances of yoga and meditation at AYM{" "}
    <Link href="/yoga-teacher-training-in-rishikesh"><em>Yoga School in Rishikesh</em></Link>, India.
  </p>
  <div className={styles.coursesBlock}>
    <p className={styles.coursesHeading}>
      Various yoga courses offered by AYM yoga ashram in Rishikesh:
    </p>
    <ul className={styles.coursesList}>
      <li><Link href="/100-hour-yoga-teacher-training-in-rishikesh">100 Hour Yoga Teacher Training in Rishikesh</Link></li>
      <li><Link href="/200-hour-yoga-teacher-training-rishikesh">200 Hour Yoga Teacher Training in Rishikesh</Link></li>
      <li><Link href="/300-hours-yoga-teacher-training-rishikesh">300 Hour Yoga Teacher Training in Rishikesh</Link></li>
      <li><Link href="/500-hour-yoga-teacher-training-india">500 Hour Yoga Teacher Training in Rishikesh</Link></li>
    </ul>
  </div>
</section>
      <HowToReach />
    </div>
  );
};

export default YogaAshrams;
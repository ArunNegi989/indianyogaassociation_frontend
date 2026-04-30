// YogaAshrams.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-ashrams-in-india/Yogaashrams.module.css";
import yogaashramimg1 from "@/assets/images/yoga-ashram-in-india.jpg";
import yogaashramimg2 from "@/assets/images/yoga-ashram-in-rishikesh.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/35.png";

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
        Welcome to AYM Yoga Ashram in Rishikesh. India, the land of religions,
        faith, traditions, and spirituality, is well-known worldwide for yoga
        and meditation practices. Many schools and yoga ashrams across India
        provide yoga and meditation training to all those seeking them.
      </p>
      <p className={styles.welcomeText}>
        Welcome to AYM Yoga Ashram in Rishikesh. India, the land of religions,
        faith, traditions, and spirituality, is well-known worldwide for yoga
        and meditation practices. Many schools and yoga ashrams across India
        provide yoga and meditation training to all those seeking them.
      </p>
      <p className={styles.welcomeText}>
        <strong>Yoga Ashrams in India</strong> provide various yoga courses
        for one and all, starting from Primary (Basic), Secondary
        (Intermediate) and Intensive (In-depth /Thorough). AYM{" "}
        <strong>yoga ashram in rishikesh</strong> also provides yoga retreats,
        teacher training, and inner awakening programs.
      </p>
    </div>
  </div>
</section>


{/* ===== EXPERIENCE SECTION - TIMELINE STYLE ===== */}
<section className={styles.experienceSection}>
  <div className={styles.experienceHeader}>
    <h2 className={styles.experienceTitle}>Enthralling Experiences</h2>
    <p className={styles.experienceSubtitle}>Practice of Yoga & Meditation</p>
  </div>
  
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
        <a href="#">"International Yoga Hub"</a>. People who wish to
        rediscover themselves visit Rishikesh AYM Yoga Ashram. There are many{" "}
        <em>yoga ashrams in Rishikesh</em> offering styles such as{" "}
        <a href="#">Hatha Yoga</a>, <a href="#">Ashtanga</a>, Vinyasa,
        Vinyasa Flow, Iyengar, Kundalini and Power Yoga.
      </p>
      <div className={styles.certBadges}>
        <span className={styles.badge}>Yoga Alliance USA</span>
        <span className={styles.badge}>Intl. Yoga Federation</span>
      </div>
    </div>
    <div className={styles.highlightCard}>
      <h3 className={styles.highlightCardTitle}>Courses Offered</h3>
      <p className={styles.bodyText}>
        Durations range from 25 days to 2 months. Upon completion you receive
        internationally recognised certificates.
      </p>
      <div className={styles.coursePills}>
        <a href="#" className={styles.pillLink}>200 Hours Teacher Training <span className={styles.pillArrow}>›</span></a>
        <a href="#" className={styles.pillLink}>300 Hours Teacher Training <span className={styles.pillArrow}>›</span></a>
        <a href="#" className={styles.pillLink}>500 Hours Teacher Training <span className={styles.pillArrow}>›</span></a>
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
      <a href="#">Why is AYM Yoga Ashram best to learn yoga?</a>
    </h2>
    <div className={styles.whyGrid}>
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
    <p className={styles.whyBody}>
      Once at our ashram, people can focus on themselves and find who they are
      and what they want to do. Once well-versed in yoga and meditation, they
      can return to their lives and work better and more efficiently.
    </p>
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
    <a href="#"><em>Yoga School in Rishikesh</em></a>, India.
  </p>
  <div className={styles.coursesBlock}>
    <p className={styles.coursesHeading}>
      Various yoga courses offered by AYM yoga ashram in Rishikesh:
    </p>
    <ul className={styles.coursesList}>
      <li><a href="#">100 Hour Yoga Teacher Training in Rishikesh</a></li>
      <li><a href="#">200 Hour Yoga Teacher Training in Rishikesh</a></li>
      <li><a href="#">300 Hour Yoga Teacher Training in Rishikesh</a></li>
      <li><a href="#">500 Hour Yoga Teacher Training in Rishikesh</a></li>
    </ul>
  </div>
</section>
      <HowToReach />
    </div>
  );
};

export default YogaAshrams;

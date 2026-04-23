// InnerTransformation.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/inner-awakening/Innertransformation.module.css";
import gurujiimage from "@/assets/images/inner-awakening.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/40.png";
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
      fontSize="26"
      fill="#e8600a"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

const Divider: React.FC = () => (
  <div className={styles.divider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>
      <OmSVG />
    </span>
    <span className={styles.dividerLine} />
  </div>
);

// ===================== MAIN COMPONENT =====================
const InnerTransformation: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

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
    {/* ===== HERO TITLE - FULL WIDTH ===== */}
{/* ===== HERO TITLE ===== */}
<section className={styles.heroSection1}>
  <div className={styles.heroContent}>
    <div className={styles.heroBadge}>
      <span>Inner Awakening</span>
    </div>
    <h1 className={styles.mainTitle}>Inner Transformation Retreat</h1>
    {/* <Divider /> */}
    
    <div className={styles.subTitleWrapper}>
      <div className={styles.subTitleAccent}></div>
      <h2 className={styles.subTitle}>
        Awake Your Inner Self – with Yogiraj Sri Yogi Chetan Maharishi
      </h2>
      <div className={styles.subTitleAccent}></div>
    </div>
    
    <div className={styles.whoSection}>
      <div className={styles.whoIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#e8600a"/>
        </svg>
      </div>
      <h3 className={styles.whoTitle}>Who is Sri Maharishi?</h3>
    </div>
    
    <div className={styles.maharishiIntro}>
      <p className={styles.bodyText}>
        <span className={styles.dropCap}>Y</span>ogi, Mystic, and Visionary. Himalayan Yogi{" "}
        <strong>Sri Maharishi</strong> belongs to the eternal Siddha
        Tradition, a lineage of perfected beings. He spent the last 30 years
        in meditation and practicing traditional Kryia Yoga at the Himalayas
        with enlightened gurus.
      </p>
    </div>

    <div className={styles.imageWrapper}>
      <div className={styles.maharishiImageBox}>
        <Image
          src={gurujiimage}
          alt="Yogiraj Sri Yogi Chetan Maharishi"
          fill
          sizes="(max-width: 575px) 100vw, (max-width: 991px) 85vw, 920px"
          style={{ objectFit: "cover" }}
          priority
        />
        <div className={styles.imageCaption}>
          <span>Yogiraj Sri Yogi Chetan Maharishi</span>
        </div>
      </div>
    </div>
    
    <div className={styles.heroStats}>
      <div className={styles.statBox}>
        <span className={styles.statValue}>30+</span>
        <span className={styles.statLabel}>Years of Meditation</span>
      </div>
      <div className={styles.statBox}>
        <span className={styles.statValue}>Siddha</span>
        <span className={styles.statLabel}>Tradition</span>
      </div>
      <div className={styles.statBox}>
        <span className={styles.statValue}>Kriya</span>
        <span className={styles.statLabel}>Yoga Master</span>
      </div>
    </div>
  </div>
</section>

      {/* <Divider /> */}

      <section className={styles.whatSection}>
  <div className={styles.whatContainer}>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionBadge}>Discover</div>
      <h2 className={styles.sectionTitle}>
        What is the inner awakening retreat?
      </h2>
      <div className={styles.sectionUnderline}></div>
    </div>
    
    <div className={styles.retreatContent}>
      <div className={styles.retreatQuote}>
        <div className={styles.quoteIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 11H6V15H10V11ZM18 11H14V15H18V11Z" fill="#e8600a"/>
            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z" fill="#e8600a"/>
          </svg>
        </div>
        <p className={styles.quoteText}>
          "Why am I doing all of this? Who am I? What is my true purpose in this life?"
        </p>
        <div className={styles.quoteLine}></div>
      </div>
      
      <div className={styles.textBlock}>
        <p className={styles.bodyText}>
          <span className={styles.highlight}>We often go by in our daily lives in the automatic mode</span>, running away
          from questions we don't know how to answer. When we are disconnected from our true selves, 
          those questions are nearly impossible to be answered because we try to answer them by 
          looking outside, in material things, in the personalities we've created for ourselves. 
          But we are not our money; we are not our profession. <strong>So who are we?</strong>
        </p>
      </div>

      <div className={styles.twoColumnLayout}>
        <div className={styles.column}>
          <div className={styles.insightCard}>
            <div className={styles.insightNumber}>01</div>
            <h4 className={styles.insightTitle}>Inner Exploration</h4>
            <p className={styles.insightText}>
              The Inner Transformation retreat is an invitation for you to look deeply inside yourself 
              and connect with your higher self. It is self-realization through constant self-inquiry 
              and exploration of the inner states of the being.
            </p>
          </div>
        </div>
        
        <div className={styles.column}>
          <div className={styles.insightCard}>
            <div className={styles.insightNumber}>02</div>
            <h4 className={styles.insightTitle}>Freedom Based</h4>
            <p className={styles.insightText}>
              Every person has their own path to reach inner tranquility. The retreat is based on freedom, 
              presenting different methods, Eastern philosophies (Yoga, Jainism, Taoism), and techniques 
              for each person to find their own practice.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.programNote}>
        <div className={styles.noteDot}></div>
        <p className={styles.noteText}>
          This retreat consists of a foundation program, with an advanced master program also available.
        </p>
      </div>
    </div>
  </div>
</section>

{/* <Divider /> */}

{/* ===== SCHEDULE SECTION - ENHANCED ===== */}
<section className={styles.scheduleSection}>
  <div className={styles.scheduleContainer}>
    <div className={styles.scheduleHeader}>
      <div className={styles.scheduleBadge}>Program Details</div>
      <h2 className={styles.scheduleTitle}>
        What is the schedule, what is inside the retreat?
      </h2>
      <div className={styles.scheduleUnderline}></div>
      <div className={styles.weeksLabel}>
        <span className={styles.weeksBadge}>Two weeks</span>
        <span className={styles.weeksText}>of foundation retreat</span>
      </div>
    </div>

    <div className={styles.cardsRow}>
      {/* Card 1 - 7 Points */}
      <div className={styles.scheduleCard}>
        <div className={styles.cardHeaderOrange}>
          <div className={styles.cardIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M12 6L13.5 9.5L17.5 10L14.5 12.5L15.5 16.5L12 14.5L8.5 16.5L9.5 12.5L6.5 10L10.5 9.5L12 6Z" fill="white" opacity="0.8"/>
            </svg>
          </div>
          <h3 className={styles.cardTitleOrange}>
            7 Points of Inner Transformation
          </h3>
        </div>
        <div className={styles.cardBodyWhite}>
          <ul className={styles.pointsList}>
            <li><span className={styles.listDot}></span>Sublimation</li>
            <li><span className={styles.listDot}></span>Culmination</li>
            <li><span className={styles.listDot}></span>Transformation</li>
            <li><span className={styles.listDot}></span>Sadhana</li>
            <li><span className={styles.listDot}></span>Satsang</li>
            <li><span className={styles.listDot}></span>Meditation</li>
            <li><span className={styles.listDot}></span>Self-realization</li>
          </ul>
          <div className={styles.cardFootnote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#e8600a"/>
            </svg>
            <span>The first 6 points lead to the root of all things: self-realization</span>
          </div>
        </div>
      </div>

      {/* Card 2 - Daily Schedule */}
      <div className={styles.scheduleCard}>
        <div className={styles.cardHeaderGreen}>
          <div className={styles.cardIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
              <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="white"/>
            </svg>
          </div>
          <h3 className={styles.cardTitleGreen}>
            Daily Schedule - Draft Program
          </h3>
        </div>
        <div className={styles.cardBodyWhite}>
          <div className={styles.scheduleBlock}>
            <div className={styles.schedulePeriod}>
              <span className={styles.periodLabel}>Morning Session</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleTime}>6:30 - 8:00</span>
              <span className={styles.scheduleActivity}>Meditation</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleTime}>8:00 - 8:30</span>
              <span className={styles.scheduleActivity}>Tea Break</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleTime}>8:30 - 10:00</span>
              <span className={styles.scheduleActivity}>Satsang / Practice</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleTime}>10:00 - 11:00</span>
              <span className={styles.scheduleActivity}>Breakfast</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleTime}>11:00 - 12:30</span>
              <span className={styles.scheduleActivity}>Sadhana</span>
            </div>
            
            <div className={styles.breakBlock}>
              <span className={styles.breakIcon}>🍽️</span>
              <span className={styles.breakText}>LUNCH + Self Practice / Study - Free until 17:00</span>
            </div>
            
            <div className={styles.schedulePeriod}>
              <span className={styles.periodLabel}>Evening Session</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleTime}>17:00 - 19:30</span>
              <span className={styles.scheduleActivity}>Evening Sadhana</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleTime}>19:30 - 20:30</span>
              <span className={styles.scheduleActivity}>Light Dinner</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleTime}>21:00 - 22:00</span>
              <span className={styles.scheduleActivity}>Kirtan / Chanting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* <Divider /> */}

      {/* ===== THREE IMAGES GALLERY ===== */}
<section className={styles.gallerySection}>
  <div className={styles.galleryContainer}>
    <div className={styles.galleryHeader}>
      <div className={styles.galleryBadge}>Visual Journey</div>
      <h2 className={styles.galleryTitle}>Moments of Inner Transformation</h2>
      <div className={styles.galleryUnderline}></div>
      <p className={styles.gallerySubtitle}>
        Experience the serene atmosphere and spiritual practices at our retreat
      </p>
    </div>
    
    <div className={styles.triImageGrid}>
      <div className={styles.triImageItem}>
        <Image
          src="/images/inner-transformation/woman-prayer.jpg"
          alt="Woman in prayer"
          fill
          sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 400px"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          <div className={styles.imageOverlayContent}>
            <div className={styles.imageCaption}>Sacred Prayer</div>
            <div className={styles.imageSubcaption}>Connecting with the divine</div>
          </div>
        </div>
      </div>
      <div className={styles.triImageItem}>
        <Image
          src="/images/inner-transformation/guru-meditation.jpg"
          alt="Guru in meditation"
          fill
          sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 400px"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          <div className={styles.imageOverlayContent}>
            <div className={styles.imageCaption}>Deep Meditation</div>
            <div className={styles.imageSubcaption}>Guidance from the master</div>
          </div>
        </div>
      </div>
      <div className={styles.triImageItem}>
        <Image
          src="/images/inner-transformation/woman-garland.jpg"
          alt="Woman with garland"
          fill
          sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 400px"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          <div className={styles.imageOverlayContent}>
            <div className={styles.imageCaption}>Blissful Offering</div>
            <div className={styles.imageSubcaption}>Surrender and devotion</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* <Divider /> */}

{/* ===== TWO INFO BOXES ===== */}
<section className={styles.infoSection}>
  <div className={styles.infoContainer}>
    <div className={styles.infoCardsRow}>
      {/* Box 1 — Definitions */}
      <div className={styles.definitionCard}>
        <div className={styles.definitionHeader}>
          <div className={styles.definitionIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#e8600a"/>
            </svg>
          </div>
          <h3 className={styles.definitionTitle}>Key Concepts</h3>
        </div>
        <div className={styles.definitionBody}>
          <div className={styles.termBlock}>
            <span className={styles.term}>Satsang</span>
            <p className={styles.termDesc}>In Sanskrit, it means "gathering together for the truth" or, more simply, "being with the truth"</p>
          </div>
          <div className={styles.termBlock}>
            <span className={styles.term}>Sadhana</span>
            <p className={styles.termDesc}>Consists of deep practices and routine of surrendering the ego through various activities like meditation, chanting or prayer</p>
          </div>
          <div className={styles.termBlock}>
            <span className={styles.term}>Self-realization</span>
            <p className={styles.termDesc}>To know your inner self, to know the very love, to touch the absoluteness, to be in bliss</p>
          </div>
        </div>
      </div>

      {/* Box 2 — Who can participate */}
      <div className={styles.participantCard}>
        <div className={styles.participantHeader}>
          <div className={styles.participantIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
            </svg>
          </div>
          <h3 className={styles.participantTitle}>Who Can Participate?</h3>
        </div>
        <div className={styles.participantBody}>
          <ul className={styles.participantList}>
            <li>
              <span className={styles.listCheck}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#e8600a"/>
                </svg>
              </span>
              Anyone who has few hours sitting practice continuously effortlessly with calm mind
            </li>
            <li>
              <span className={styles.listCheck}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#e8600a"/>
                </svg>
              </span>
              Anyone who has finished at least 200 hour yoga teacher training or any other yoga certification
            </li>
            <li>
              <span className={styles.listCheck}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#e8600a"/>
                </svg>
              </span>
              Anyone who is searching for inner powers and willing to follow the ashram lifestyle during the retreat
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

{/* <Divider /> */}

{/* ===== INCLUDED IN FEE ===== */}
<section className={styles.feeSection}>
  <div className={styles.feeContainer}>
    <div className={styles.feeHeader}>
      <div className={styles.feeBadge}>Investment</div>
      <h2 className={styles.feeTitle}>What's Included</h2>
      <div className={styles.feeUnderline}></div>
    </div>
    
    <div className={styles.feeContent}>
      <div className={styles.includedGrid}>
        <div className={styles.includedItem}>
          <div className={styles.includedIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="#e8600a" strokeWidth="1.5" fill="none"/>
              <path d="M12 12L20 7.5M12 12L4 7.5M12 12V21" stroke="#e8600a" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className={styles.includedText}>Private Accommodation with Mountain View</span>
        </div>
        <div className={styles.includedItem}>
          <div className={styles.includedIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" fill="#e8600a"/>
            </svg>
          </div>
          <span className={styles.includedText}>Sattvic Indian Food - 3 Meals/Day</span>
        </div>
        <div className={styles.includedItem}>
          <div className={styles.includedIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2h6v2h-6V6zm0 4h6v2h-6v-2zm-6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z" fill="#e8600a"/>
            </svg>
          </div>
          <span className={styles.includedText}>Herbal Tea / Lemon-Ginger Tea - 24X7</span>
        </div>
        <div className={styles.includedItem}>
          <div className={styles.includedIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="#e8600a"/>
            </svg>
          </div>
          <span className={styles.includedText}>Certificate and Course Material</span>
        </div>
        <div className={styles.includedItem}>
          <div className={styles.includedIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.7 2 6.9 5 8.6V22h10v-1.4c3-1.7 5-4.9 5-8.6 0-5.5-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="#e8600a"/>
            </svg>
          </div>
          <span className={styles.includedText}>Airport Pickup from Dehradun Airport</span>
        </div>
      </div>

      <div className={styles.pricingCard}>
        <div className={styles.pricingBadge}>Retreat Ticket</div>
        <div className={styles.pricingAmount}>
          <span className={styles.currency}>$</span>1000 <span className={styles.or}>/</span> <span className={styles.inr}>₹70,000</span>
        </div>
        <p className={styles.pricingDesc}>
          The price includes two-week private room accommodation, Indian vegetarian food, 
          a trip to spiritual temples around Rishikesh, and guidance from Yogi Guru for inner awakening.
        </p>
        <div className={styles.pricingNote}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#e8600a"/>
          </svg>
          <span>Limited seats available. Early booking recommended.</span>
        </div>
      </div>
    </div>
  </div>
</section>
      <HowToReach />
    </div>
  );
};

export default InnerTransformation;

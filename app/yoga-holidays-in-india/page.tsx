// YogaHolidays.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-holidays-in-india/Yogaholidays.module.css";
import image1 from "@/assets/images/Laxman-Jhula--rishikesh.jpg";
import image2 from "@/assets/images/Yoga-Camp-in-Rishikesh.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/36.png";
// ===================== MAIN COMPONENT =====================
const YogaHolidays: React.FC = () => {
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
      {/* ===== SECTION 1 — WHITE BG ===== */}
     {/* ===== SECTION 1 — WHITE BG ===== */}
<section className={styles.whiteSection}>
  <h1 className={styles.mainTitle}>
    Yoga Holidays in India / Yoga Vacations in India, Rishikesh at AYM
    Yoga Holiday Retreats
  </h1>

  {/* Two-column split: text left, media right */}
  <div className={styles.splitGrid}>
    <div className={styles.splitText}>
      <p className={styles.bodyText}>
        Stress and anxiety result from being caught up in a hectic work
        schedule and rushing around daily. At AYM, we understand that it is
        hard to remain relaxed and calm with the pressures of today&apos;s
        society, which can leave you feeling drained, lethargic, and depleted.
        At The <strong>Association of Yoga and Meditation</strong>, we have
        strategically designed a one-week detoxing and invigorating programme.
        A yoga Holiday in India will leave you feeling rejuvenated and energetic.
        Your body will be more flexible, melting away any tension and stress — you
        will be ready to take on the world.
      </p>
      <p className={styles.bodyText}>
        AYM is one of the best places to visit if you&apos;re looking for a{" "}
        <strong>Yoga Retreat</strong>. It is among the top yoga holiday centres
        in India. Your yoga holiday in Rishikesh will give you tremendous,
        noticeable results in just one week. We have a variety of holiday retreats
        at AYM, such as Iyengar Yoga, Ashtanga Yoga, and Kundalini Yoga ranging
        from 7 to 10 days.
      </p>
      <p className={styles.bodyText}>
        These Yoga holidays are for everyone — whether you are a fitness lover,
        a peace seeker or want an honest, authentic experience that will enhance
        your overall health. You can expect to sweat, stretch and detoxify,
        leaving you feeling strong, fresh, and lean.
      </p>
      <p className={styles.bodyText}>
        You will practice many different styles of yoga where you will feel the
        energy rise within and have lots of fun simultaneously. This holiday is
        great for meeting like-minded individuals but also perfect if you want
        some alone time to get to know yourself more.
      </p>
    </div>

    {/* Media stack: image + optional video */}
    <div className={styles.mediaStack}>
      <div className={styles.imageBox}>
        <Image
          src={image1}
          alt="Stunning View of Rishikesh - AYM Yoga Center"
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
        />
        <div className={styles.imageOverlayCaption}>
          Stunning View of Rishikesh — AYM Yoga Center
        </div>
      </div>

      {/* Video block — swap src for your YouTube/Vimeo embed URL */}
      <div className={styles.videoBlock}>
        {/* Option A: embed an iframe */}
        {/* <iframe
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0"
          title="Life at AYM Rishikesh"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        /> */}

        {/* Option B: placeholder until you have a video URL */}
        <div className={styles.videoPlaceholder}>
          <div className={styles.playBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polygon points="5,2 16,9 5,16" fill="white" />
            </svg>
          </div>
          <span className={styles.videoLabel}>Watch: Life at AYM Rishikesh</span>
        </div>
      </div>
    </div>
  </div>

  {/* Ayurveda callout */}
  <div className={styles.ayurvedaCallout}>
    <p className={styles.bodyText}>
      Many things can be combined with{" "}
      <strong>Yoga Holidays in Rishikesh</strong>, such as meditation and
      Ayurveda. Yoga and Ayurveda Spa will enhance your well-being — stimulating
      your mind and transforming your body. Meditation will calm your mind and
      body, reducing anxiety and tension. Practising{" "}
      <a href="#" className={styles.link}>Yoga with Ayurveda</a>{" "}
      will restore your inner vitality and give you a healthy mind, body and soul.
    </p>
  </div>

  {/* Benefits pills */}
  <div className={styles.benefitsWrap}>
    <p className={styles.benefitsHeading}>
      <strong><u>The benefits of our Yoga Holiday in Rishikesh :</u></strong>
    </p>
    <div className={styles.pillsRow}>
      {[
        "Peace of mind & clarity",
        "Relaxation",
        "Rejuvenation — Mind, Body & Soul",
        "Flexibility",
        "Strength — Physical & Mental",
        "Authentic Experience",
        "Lots of fun",
      ].map((b) => (
        <span key={b} className={styles.pill}>
          <span className={styles.pillDot} />
          {b}
        </span>
      ))}
    </div>
  </div>

  {/* CTA */}
  <div className={styles.ctaBar}>
    <p className={styles.ctaText}>
      For more detail about yoga holiday packages / vacations in Rishikesh, India.
    </p>
    <a href="#" className={styles.ctaButton}>
      Click Here to See Yoga Holidays Packages
    </a>
  </div>
</section>

      {/* ===== SECTION 2 — BEIGE BG ===== */}
<section className={styles.beigeSection}>
  <div className={styles.beigeInner}>
    {/* Header with decorative element */}
    <div className={styles.shivirHeader}>
      <div className={styles.headerAccent}></div>
      <h2 className={styles.shivirTitle}>Yog Shivir Haridwar, Rishikesh, India</h2>
      <h3 className={styles.shivirSubtitle}>Yoga Camps in Rishikesh / Yoga Shivir Rishikesh</h3>
    </div>

    {/* Main description card */}
    <div className={styles.descriptionCard}>
      <p className={styles.beigeBodyText}>
        AYM Yoga Ashram offers Residential Yoga Camps in lap of Himalayas,
        under guidance of Yoga Master Yogi Chetan Mahesh. The main Aim of yoga
        camps is to enrich general people including students with yoga
        knowledge to maintain health and cultivate yogic life style in
        students to avoid future coming diseases and stress. It also
        cultivates moral values and keeps Indian traditional values in the
        youth. Yoga Shivir is not a yoga teacher training course but it is for
        self-training and practice. AYM will give participation certificate
        after completion of yoga camp but not the yoga teaching certification.
      </p>
    </div>

    {/* Yoga Camp Image with caption */}
    <div className={styles.imageWrapper}>
      <div className={styles.campImageBox}>
        <Image
          src={image2}
          alt="Yoga Camp in Rishikesh - AYM"
          fill
          sizes="(max-width: 575px) 100vw, (max-width: 991px) 90vw, 700px"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <div className={styles.campImageCaption}>
          <span>Morning Yoga Session at AYM Camp</span>
        </div>
      </div>
    </div>

    {/* Dates & Duration Section */}
    <div className={styles.infoCard}>
      <h2 className={styles.sectionHeading}>Dates & Duration</h2>
      <div className={styles.datesGrid}>
        <div className={styles.dateBlock}>
          <p className={styles.dateHighlight}>
            Summer Yoga camps in Rishikesh conducted during school holidays
          </p>
          <p className={styles.durationRange}>7 to 21 Days</p>
          <p className={styles.dateNote}>Choose according to your convenience</p>
        </div>
        <div className={styles.dateBlock}>
          <p className={styles.datePeriod}>15 May - 05 June</p>
          <p className={styles.datePeriod}>06 June - 27 June</p>
          <p className={styles.datePeriod}>30 June - 15 July</p>
        </div>
      </div>
    </div>

    {/* Timetable Section */}
    <div className={styles.timetableCard}>
      <div className={styles.timetableHeader}>
        <h3 className={styles.timetableTitle}>Daily Schedule</h3>
        <p className={styles.timetableSubtitle}>Yoga Shivir Timetable</p>
      </div>
      
      <div className={styles.timetableBody}>
        <div className={styles.timetableColumns}>
          <div className={styles.timetableCol}>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>06:00 AM</span>
              <span className={styles.activity}>Wake Up</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>06:30 AM</span>
              <span className={styles.activity}>Asana Practice</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>08:00 AM</span>
              <span className={styles.activity}>Tea & Snacks</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>08:30 AM</span>
              <span className={styles.activity}>Pranayama</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>10:00 AM</span>
              <span className={styles.activity}>Breakfast</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>11:00 AM</span>
              <span className={styles.activity}>Yoga Philosophy</span>
            </div>
          </div>
          <div className={styles.timetableCol}>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>01:30 PM</span>
              <span className={styles.activity}>Lunch</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>02:00 PM</span>
              <span className={styles.activity}>Rest Period</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>03:30 PM</span>
              <span className={styles.activity}>Asana & Meditation</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>06:30 PM</span>
              <span className={styles.activity}>Dinner</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>08:00 PM</span>
              <span className={styles.activity}>Mantra Chanting</span>
            </div>
            <div className={styles.timetableRow}>
              <span className={styles.timeSlot}>10:00 PM</span>
              <span className={styles.activity}>Lights Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Pricing Section */}
    <div className={styles.pricingGrid}>
      <div className={styles.pricingCard}>
        <h4 className={styles.pricingTitle}>Course Fee</h4>
        <p className={styles.pricingAmount}>1,700 INR</p>
        <p className={styles.pricingDetail}>per day</p>
        <div className={styles.pricingIncludes}>
          <span>Accommodation</span>
          <span>Meals</span>
          <span>Yoga Classes</span>
        </div>
      </div>
      <div className={styles.pricingCard}>
        <h4 className={styles.pricingTitle}>Meals</h4>
        <p className={styles.pricingAmount}>Satvic</p>
        <p className={styles.pricingDetail}>Vegetarian Food</p>
        <div className={styles.pricingIncludes}>
          <span>Healthy</span>
          <span>Nutritious</span>
          <span>Traditional</span>
        </div>
      </div>
      <div className={styles.pricingCard}>
        <h4 className={styles.pricingTitle}>Accommodation</h4>
        <p className={styles.pricingAmount}>Shared Room</p>
        <p className={styles.pricingDetail}>Included in Package</p>
        <div className={styles.pricingIncludes}>
          <span>Private Room Available</span>
          <span>Extra Charges Apply</span>
        </div>
      </div>
    </div>

    {/* Enrollment Section */}
    <div className={styles.enrollSection}>
      <h2 className={styles.sectionHeading}>How to Enroll?</h2>
      <div className={styles.enrollSteps}>
        <div className={styles.step}>
          <span className={styles.stepNumber}>01</span>
          <p>Register 1 month in advance</p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>02</span>
          <p>Pay 5,000 INR advance booking fee</p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>03</span>
          <p>Submit personal details for registration</p>
        </div>
      </div>
      <p className={styles.seatsNote}>Seats are limited and fill quickly</p>
    </div>

    {/* Eligibility Section */}
    <div className={styles.eligibilityCard}>
      <h2 className={styles.sectionHeading}>Who Can Attend?</h2>
      <p className={styles.eligibilityText}>
        Anyone interested in learning yoga, aged <strong>15 - 60 years</strong>, provided the individual is physically fit.
      </p>
    </div>

    {/* Guidelines Section */}
    <div className={styles.guidelinesSection}>
      <h2 className={styles.sectionHeading}>Important Guidelines</h2>
      <div className={styles.guidelinesGrid}>
        <div className={styles.guidelineItem}>
          <span className={styles.guidelineDot}></span>
          <p>Bring bed sheets, mosquito coils, torch, stationery items</p>
        </div>
        <div className={styles.guidelineItem}>
          <span className={styles.guidelineDot}></span>
          <p>Dress code: Loose, light-colored clothing</p>
        </div>
        <div className={styles.guidelineItem}>
          <span className={styles.guidelineDot}></span>
          <p>No mobile phones during yoga sessions</p>
        </div>
        <div className={styles.guidelineItem}>
          <span className={styles.guidelineDot}></span>
          <p>Punctuality required for all sessions</p>
        </div>
        <div className={styles.guidelineItem}>
          <span className={styles.guidelineDot}></span>
          <p>No smoking, alcohol, or intoxicants on campus</p>
        </div>
        <div className={styles.guidelineItem}>
          <span className={styles.guidelineDot}></span>
          <p>No fast food or junk food during camp</p>
        </div>
        <div className={styles.guidelineItem}>
          <span className={styles.guidelineDot}></span>
          <p>Report by 6:00 PM day before camp starts</p>
        </div>
        <div className={styles.guidelineItem}>
          <span className={styles.guidelineDot}></span>
          <p>Stay until camp concludes after lunch</p>
        </div>
      </div>
    </div>

    {/* How to Reach */}
    <div className={styles.reachSection}>
      <h2 className={styles.sectionHeading}>How to Reach?</h2>
      <p className={styles.beigeBodyText}>
        Rishikesh is located 300 km from Delhi and is well-connected by road, train, and air.
        Use Google Maps and search "AYM Yoga Teacher Training School Rishikesh" for directions.
      </p>
    </div>
  </div>
</section>

      <HowToReach />
    </div>
  );
};

export default YogaHolidays;

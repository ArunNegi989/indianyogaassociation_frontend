// YogaHolidays.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-holidays-in-india/Yogaholidays.module.css";
import image1 from "@/assets/images/Laxman-Jhula--rishikesh.jpg"
import image2 from "@/assets/images/Yoga-Camp-in-Rishikesh.jpg"
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
      <section className={styles.whiteSection}>

        {/* Title */}
        <h1 className={styles.mainTitle}>
          Yoga Holidays in India / Yoga Vacations in India, Rishikesh at AYM Yoga Holiday Retreats
        </h1>

        {/* Intro paragraphs */}
        <p className={styles.bodyText}>
          Stress and anxiety result from being caught up in a hectic work schedule and rushing around daily. At AYM,
          we understand that it is hard to remain relaxed and calm with the pressures of today&apos;s society, which
          can leave you feeling drained, lethargic, and depleted. At The{" "}
          <strong>Association of Yoga and Meditation</strong>, we have strategically designed a one-week detoxing and
          invigorating. A yoga Holiday in India will leave you feeling rejuvenated and energetic. As well as this,
          your body will be more flexible, melting away any tension and stress you may have had - You will be ready
          to take on the world.
        </p>

        <p className={styles.bodyText}>
          AYM is one of the best places to visit if you&apos;re looking for a <strong>Yoga Retreat</strong>. It is
          among the top yoga holiday centres in India. Your yoga holiday in Rishikesh will give you tremendous,
          noticeable results in just one week. We have a variety of holiday retreats at AYM, such as Iyengar Yoga,
          Ashtanga Yoga, and Kundalini Yoga range from 7 to 10 days.
        </p>

        <p className={styles.bodyText}>
          These Yoga holidays are for everyone, whether you are a fitness lover, a peace seeker or want an honest,
          authentic experience that will enhance your overall health. You can expect to sweat, stretch and detoxify,
          leaving you feeling strong, fresh, and lean.
        </p>

        <p className={styles.bodyText}>
          You will practice many different styles of yoga where you will feel the energy rise within and have lots of
          fun simultaneously. This holiday is great for meeting like-minded individuals but is also a great place if
          you want some alone time to get to know yourself more.
        </p>

        {/* Rishikesh Image */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageBox}>
            {/* Replace src with your actual image path */}
            <Image
              src={image1}
              alt="Stunning View of Rishikesh - AYM Yoga Center"
              fill
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 90vw, 700px"
              style={{ objectFit: "cover" }}
              priority
            />
            <div className={styles.imageOverlayCaption}>
              Stunning View of Rishikesh - AYM Yoga Center
            </div>
          </div>
        </div>

        {/* More content */}
        <p className={styles.bodyText}>
          Many things can be combined with <strong>Yoga Holidays in Rishikesh</strong>, such as meditation and
          Ayurveda. Yoga and Ayurveda Spa will enhance your well-being. It will stimulate your mind and transform
          your body into a much more relaxed one. You can also combine your Yoga Vacation in India with meditation.
          Meditation will calm your mind and body, unite them to distress, and reduce anxiety and tension.
          Practising <a href="#" className={styles.link}>Yoga with Ayurveda</a> will restore your inner vitality and
          give you a healthy mind, body and soul.
        </p>

        {/* Benefits */}
        <p className={styles.benefitsHeading}>
          <strong><u>The benefits of our Yoga Holiday in Rishikesh :</u></strong>
        </p>
        <ul className={styles.benefitsList}>
          <li>Peace of mind and clarity</li>
          <li>Relaxation</li>
          <li>Rejuvenation - Mind, body and Soul</li>
          <li>Flexibility</li>
          <li>Strength - Physical and Mental</li>
          <li>Authenticity experience</li>
          <li>Lots of fun</li>
        </ul>

        {/* CTA */}
        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>
            For More detail about yoga holiday packages / vacations in rishikesh, India.
          </p>
          <a href="#" className={styles.ctaButton}>
            Click Here to See Yoga Holidays Packages
          </a>
        </div>
      </section>

      {/* ===== SECTION 2 — BEIGE BG ===== */}
      <section className={styles.beigeSection}>

        {/* Yog Shivir headings */}
        <h2 className={styles.shivirTitle}>Yog shivir Haridwar, Rishikesh, India</h2>
        <h3 className={styles.shivirSubtitle}>
          Yoga camps in Rishikesh/ Yoga shivir Rishikesh
        </h3>

        <p className={styles.beigeBodyText}>
          AYM Yoga Ashram offers Residential Yoga Camps in lap of Himalayas, under guidance of Yoga Master Yogi
          Chetan Mahesh. The main Aim of yoga camps is to enrich general people including students with yoga
          knowledge to maintain health and cultivate yogic life style in students to avoid future coming diseases and
          stress. It also cultivates moral values and keeps Indian traditional values in the youth. Yoga Shivir is
          not a yoga teacher training course but it is for self-training and practice. AYM will give participation
          certificate after completion of yoga camp but not the yoga teaching certification.
        </p>

        {/* Yoga Camp Image */}
        <div className={styles.imageWrapper}>
          <div className={styles.campImageBox}>
            {/* Replace src with your actual image path */}
            <Image
              src={image2}
              alt="Yoga Camp in Rishikesh - AYM"
              fill
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 90vw, 700px"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Dates and Duration */}
        <h2 className={styles.sectionHeading}>Dates and duration</h2>

        <p className={styles.beigeBodyText}>
          <strong>
            Summer Yoga camps in rishikesh will be conducted during school holidays and will be from 7 days to 21
            days. Any one can chose according to one&apos;s time.
          </strong>
          <br />
          Dates will be same every year for Yoga shivir in rishikesh India.
        </p>

        <p className={styles.beigeBodyText}>
          Choose / Select any date for 7 Days, 10 Days, 15 Days Starting From 15 May.
          <br />15 May - 05 June
          <br />06 June - 27 June
          <br />30 June - 15 July
        </p>

        {/* Timetable */}
        <div className={styles.timetableContainer}>
          <div className={styles.timetableHeader}>
            <h3 className={styles.timetableTitle}>Time Table for Yoga Shivir</h3>
          </div>
          <div className={styles.timetableBody}>
            <div className={styles.timetableYogi}>
              {/* Yogi silhouette — CSS drawn */}
              <div className={styles.yogiIcon}>🧘</div>
            </div>
            <div className={styles.timetableColumns}>
              <div className={styles.timetableCol}>
                <div className={styles.timetableRow}><span>06:00 AM -</span><span>6:30 Wakeup</span></div>
                <div className={styles.timetableRow}><span>06:30 AM -</span><span>8:00 Asana Practice</span></div>
                <div className={styles.timetableRow}><span>08:00 AM -</span><span>8:30 Tea and snacks</span></div>
                <div className={styles.timetableRow}><span>08:30 AM -</span><span>9:30 Pranayama</span></div>
                <div className={styles.timetableRow}><span>10:00 AM -</span><span>11:00 Breakfast</span></div>
                <div className={styles.timetableRow}><span>11:00 AM -</span><span>1:00 Yoga Darshan(philosophy)</span></div>
              </div>
              <div className={styles.timetableCol}>
                <div className={styles.timetableRow}><span>01:30 PM -</span><span>2:00 Lunch</span></div>
                <div className={styles.timetableRow}><span>02:00 PM -</span><span>3:00 Rest</span></div>
                <div className={styles.timetableRow}><span>03:30 PM -</span><span>5:30 Asana And Meditation</span></div>
                <div className={styles.timetableRow}><span>06:30 PM -</span><span>7:30 Dinner</span></div>
                <div className={styles.timetableRow}><span>08:00 PM -</span><span>9:00 Mantra Chanting/Spiritual Talk</span></div>
                <div className={styles.timetableRow}><span>10:00 PM -</span><span>Sleeping</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Price & Details */}
        <p className={styles.detailText}>
          <strong>Price :</strong> 1700 INR per day including accommodation, meals and yoga classes.
        </p>
        <p className={styles.detailText}>
          <strong>Meals :</strong> Satvic Vegetarian Food.
        </p>
        <p className={styles.detailText}>
          <strong>Accommodation Type 1 :</strong> Shared Room Included in Package.
        </p>
        <p className={styles.detailText}>
          <strong>Accommodation Type 2 :</strong> Private Room with Extra Charge.
        </p>

        {/* Enroll */}
        <h2 className={styles.sectionHeading}>How to enroll for Yoga shivir Rishikesh ?</h2>
        <p className={styles.beigeBodyText}>
          Seats are limited and get full in advance, so you need to complete registration before one month. Deposit
          5000 INR as advance booking fee to get registered in the course along with personal details.
        </p>

        {/* Who can attend */}
        <h2 className={styles.sectionHeading}>Who can attend Yoga camps in india Rishikesh ?</h2>
        <p className={styles.beigeBodyText}>
          Any one who is interested in learning yoga with age 15 - 60, provided individual is physically fit.
        </p>

        {/* How to reach */}
        <h2 className={styles.sectionHeading}>How to reach ?</h2>
        <p className={styles.beigeBodyText}>
          Rishikesh is located 300 km and is connected to rest of the country with ROAD, Train and Air. Use Google
          maps and search AYM Yoga Teacher Training School rishikesh and it will lead you to the yoga ashram.
        </p>

        {/* More info */}
        <h2 className={styles.sectionHeadingItalic}>
          More related information for yog shivir Rishikesh at AYM
        </h2>
        <p className={styles.beigeBodyText}>
          Participants are requested to bring necessary items such as bed-sheets, mosquito coils/mats, torch,
          stationery items (pen, pencil, rubber, sharpeners, writing pad/note book), toiletry articles for the
          entire duration of yoga camp.
        </p>

        <p className={styles.beigeBodyText}>
          <strong>Dress code for Yoga sessions</strong>
        </p>
        <p className={styles.beigeBodyText}>
          <strong>For Men :</strong> Loose T-shirt of any light color along with pyjayama and shorts.
          <br />
          <strong>For Women :</strong> Loosely made Salwar-Kameez (normal ladies suit) of light colour.
        </p>
        <p className={styles.beigeBodyText}>
          Shorts for men are allowed only in yoga sessions and not outside them.
        </p>
        <p className={styles.beigeBodyText}>
          Mobile phones, i-pods, i-pads, cd/dvd recorders and tape recorders are not allowed in yoga sessions.
        </p>
        <p className={styles.beigeBodyText}>
          All participants should report and attend yoga sessions on time.
        </p>
        <p className={styles.beigeBodyText}>
          Participants must report at camp&apos;s office a day before the camp, latest by 6:00 p.m. and can leave
          after lunch on the concluding day. Students are not allowed to leave the camp before its conclusion.
        </p>
        <p className={styles.beigeBodyText}>
          Going out of campus to smoke cigarette, cigar, for chewing paan, pan-masala, for drinking alcohol or any
          other intoxicants, is completely banned.
        </p>
        <p className={styles.beigeBodyText}>
          The participants must walk 2 kilometers and must climb stairs till 2nd floor daily, within the campus for
          various yoga and meditation sessions.
        </p>
        <p className={styles.beigeBodyText}>
          Participants are not allowed to eat any kind of fast food and junk food during the camp and during various
          sessions.
        </p>

      </section>

      <HowToReach/>
    </div>
  );
};

export default YogaHolidays;
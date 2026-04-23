// DetoxRetreat.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-ayurveda-detox-retreat/Detoxretreat.module.css";
import detoxHero from "@/assets/images/Ayurvea-and-detox.jpg";
import faceMassage from "@/assets/images/Massage.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/39.png";
// ===================== MAIN COMPONENT =====================
const DetoxRetreat: React.FC = () => {
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
      <section className={styles.section}>
  <h1 className={styles.mainTitle}>
    DETOXIFICATION RETREAT THROUGH HERBS, YOGA, AYURVEDA, AND NUTRITION
  </h1>

  <div className={styles.twoColumnLayout}>
    <div className={styles.textColumn}>
      <p className={styles.bodyText}>
        We have a responsibility to take care of this body and mind. What do
        we do to take care of it? Ever thought of it? We buy a car don&apos;t
        we service it regularly so that it doesn&apos;t break down when we go
        on a trip. If we own a car for 10 years, how many times would we
        service our car? Maybe more than 15 times at least? What happens if we
        don&apos;t? Now how many times we serviced or did maintenance of our
        body? From the time we were born until now we could have eaten all
        kinds of food, that may include good healthy food or bad, unhealthy
        food, chemical preservative, junk food, fast food, etc.
      </p>
      <div className={styles.highlightBox}>
        <p className={styles.bodyText}>
          <span className={styles.highlight}>The below image shows</span> the condition of the sewage pipe when new and
          ten years after use. The condition of our large intestine would be
          similar.
        </p>
      </div>
      <p className={styles.bodyText}>
        The toxin is any substance which hurts the body. The toxin can also
        look like the monster in the body, they are stranger substance in the
        body, and its presence is not needed for example heavy metals,
        artificial chemicals, a preservative that found in all the food items
        we eat from fruits to vegetable.
      </p>
    </div>

    <div className={styles.imageColumn}>
      <div className={styles.imageBox}>
        <Image
          src={detoxHero}
          alt="Ayurveda detoxification - herbs and treatment"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.columnImage}
          priority
        />
        <div className={styles.imageOverlay}>
          <span className={styles.imageBadge}>Ayurveda Detox</span>
        </div>
      </div>
    </div>
  </div>

  <div className={styles.conclusionBox}>
    <p className={styles.bodyText}>
      <span className={styles.quoteIcon}>"</span>
      It is said you are, what you eat, but more importantly, you are what
      you ate. That burger you ate one year ago would still be seating
      inside you. All the food like sugar, cheese, biscuits, namkeen, tea,
      coffee, chips all the things which don&apos;t come from mother nature
      becomes extremely difficult to digest and eliminate. It can stick to
      the walls of your intestines and forms a thick coating, most diseases
      like high cholesterol levels, diabetics, high blood pressure originate
      from here because of the accumulation of toxins in the body.
      <span className={styles.quoteIcon}>"</span>
    </p>
  </div>
</section>

     {/* ===== SECTION 2 — HOW TO CORRECT ===== */}
<section className={styles.correctSection}>
  <div className={styles.sectionInner}>
    <p className={styles.sectionLabel}>Holistic Healing</p>
    <h2 className={styles.sectionTitle}>HOW TO CORRECT THIS PROBLEM?</h2>
    <div className={styles.titleUnderline} />
    <p className={styles.bodyText}>
      We will help you get rid of this toxin/waste which gets accumulated
      inside your system. In other words, bathe your internal system. Once
      that happens you would automatically lose weight, have clearer skin,
      greater energy and much more mental clarity leading you towards a
      happy, healthy life.
    </p>
    <div className={styles.benefitGrid}>
      {[
        { icon: "⚖️", title: "Weight Loss", desc: "Eliminate accumulated waste and toxins to naturally shed excess weight." },
        { icon: "✨", title: "Clearer Skin", desc: "Purify from within for radiant, glowing skin free of blemishes." },
        { icon: "🧠", title: "Mental Clarity", desc: "Remove mental fog and gain focus, calmness and greater awareness." },
      ].map((b) => (
        <div key={b.title} className={styles.benefitCard}>
          <span className={styles.benefitIcon}>{b.icon}</span>
          <h3 className={styles.benefitTitle}>{b.title}</h3>
          <p className={styles.benefitDesc}>{b.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ===== SECTION 3 — COMPLETE METHOD ===== */}
<section className={styles.methodSection}>
  <div className={styles.sectionInner}>
    <p className={styles.sectionLabel}>Our Method</p>
    <h2 className={styles.sectionTitle}>
      COMPLETE METHOD TO DETOXIFICATION THROUGH YOGA, AYURVEDA, AND DIET
    </h2>
    <div className={styles.titleUnderline} />
    <p className={styles.bodyText}>
      It&apos;s a known fact that the body can heal itself if toxins are
      removed. As toxins leave the body, the immune system strengthens and
      fast healing begins. We bring out complete detoxification through the
      following steps.
    </p>
    <div className={styles.stepsGrid}>
      {[
        { n: 1, title: "Digestive Detox", desc: "Activate the digestive system to improve metabolism through herbs, therapies and metabolic changes." },
        { n: 2, title: "Gut Detox", desc: "Rectum and large intestine cleanse through herbal oils and enema therapies." },
        { n: 3, title: "Breathing & Lungs Detox", desc: "Carried out through medicated oil or steam and deep yoga breathing techniques." },
        { n: 4, title: "Muscles, Bones & Skin", desc: "Through herbal lepana, oil massage, steam therapy and yoga practice." },
        { n: 5, title: "Blood Purification", desc: "Deep cleansing of the blood through Ayurvedic herbs and purification rituals." },
        { n: 6, title: "Digital Detox", desc: "Step away from all mobile phones, laptops, games and social media entirely." },
      ].map((s) => (
        <div key={s.n} className={styles.stepCard}>
          <div className={styles.stepNum}>{s.n}</div>
          <div>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepDesc}>{s.desc}</p>
          </div>
        </div>
      ))}
      <div className={`${styles.stepCard} ${styles.stepCardFull} ${styles.stepCardHighlight}`}>
        <div className={styles.stepNum}>7</div>
        <div>
          <h3 className={styles.stepTitle}>Complete Detox</h3>
          <p className={styles.stepDesc}>
            The full integration of all six steps above — a total transformation
            of body, mind and spirit through Ayurveda, Yoga and Nutrition.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* ===== SECTION 4 — FACE MASSAGE IMAGE ===== */}
<section className={styles.massageSection}>
  <div className={styles.sectionInner}>
    <p className={styles.sectionLabel}>Experience</p>
    <h2 className={styles.sectionTitle}>AYURVEDA MASSAGE THERAPY</h2>
    <div className={styles.titleUnderline} />
    <div className={styles.mediaTabRow}>
      <div className={styles.badgeRow}>
        <span className={styles.therapyBadge}>Abhyanga</span>
        <span className={styles.therapyBadge}>Shirodhara</span>
        <span className={styles.therapyBadge}>Nasya</span>
      </div>
    </div>
    <div className={styles.massageImageBox}>
      <Image
        src={faceMassage}
        alt="Ayurveda face massage treatment"
        fill
        sizes="(max-width: 575px) 100vw, (max-width: 991px) 95vw, 1140px"
        style={{ objectFit: "cover" }}
        loading="lazy"
      />
      <div className={styles.massageImageOverlay}>
        <p className={styles.overlayQuote}>
          &ldquo;Healing begins where toxins end.&rdquo;
        </p>
      </div>
    </div>
  </div>
</section>

  {/* ===== SECTION 5 — TWO SYSTEMS ===== */}
<section className={styles.systemsSection}>
  <div className={styles.sectionInner}>
    <p className={styles.sectionLabel}>Our Approach</p>
    <h2 className={styles.sectionTitle}>
      WE HAVE TWO SYSTEMS FOR DETOXIFICATION AT AYM DETOX SCHOOL IN RISHIKESH
    </h2>
    <div className={styles.titleUnderline} />

    <div className={styles.systemsGrid}>
{/* Card 1 */}
<div className={styles.systemCard}>
  <div className={styles.systemCardHeader}>
    <div className={styles.systemNum}>1</div>
    <p className={styles.systemCardDesc}>
      In one, you can come to our yoga Ayurveda panchakama treatment
      centre in rishikesh. Our expert will start with the standard
      procedure for detoxification.
    </p>
  </div>
  <div className={styles.systemCardBody}>
    <p className={styles.providesLabel}>what to expect:</p>
    <ul className={styles.providesList}>
      {[
        "Personal consultation with our Ayurveda doctor on arrival.",
        "A customised detox plan designed specifically for your body type.",
        "Daily herbal treatments, oil therapies and Panchakarma sessions.",
        "Guided yoga and pranayama classes every morning and evening.",
        "Nutritious Ayurvedic meals prepared fresh to support your detox.",
      ].map((text) => (
        <li key={text} className={styles.providesItem}>
          <div className={styles.providesDot}><div className={styles.providesDotInner} /></div>
          <span className={styles.providesText}>{text}</span>
        </li>
      ))}
    </ul>
  </div>
</div>

      {/* Card 2 */}
      <div className={styles.systemCard}>
        <div className={styles.systemCardHeader}>
          <div className={styles.systemNum}>2</div>
          <p className={styles.systemCardDesc}>
            We will provide you all material and training at your door and will
            guide ayurveda, yoga and nutritionist experts to you. Either you can
            take our therapist services at our center or can do yourself through
            one time training with our expert through video and call.
          </p>
        </div>
        <div className={styles.systemCardBody}>
          <p className={styles.providesLabel}>we will provide you:</p>
          <ul className={styles.providesList}>
            {[
              "On phone consultation and guidance.",
              "A pack delivered at your door having all herbal medicine and oil after booking.",
              "Our therapist will demonstrate all the steps live or through video.",
              "Our yoga and ayurveda expert will visit you and will have consultation face to face. Also will teach you how to do each step or through video.",
              "During the detox process, we will guide and monitor and take feedback.",
            ].map((text) => (
              <li key={text} className={styles.providesItem}>
                <div className={styles.providesDot}><div className={styles.providesDotInner} /></div>
                <span className={styles.providesText}>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

{/* ===== SECTION 6 — PRICE AND PACKAGES ===== */}
<section className={styles.packagesSection}>
  <div className={styles.sectionInner}>
    <p className={styles.sectionLabel}>Plans</p>
    <h2 className={styles.sectionTitle}>PRICE AND PACKAGES</h2>
    <div className={styles.titleUnderline} />

    <div className={styles.packagesGrid}>
      {["3 Days", "7 Days", "10 Days", "15 Days"].map((pkg) => (
        <div key={pkg} className={styles.pkgCard}>
          <div className={styles.pkgDays}>{pkg.split(" ")[0]}</div>
          <div className={styles.pkgDaysLabel}>Days</div>
        </div>
      ))}
    </div>

    <p className={styles.priceNote}>
      Price will Let you know after Consultant with Our Ayurveda Doctor ( By Email)
    </p>
  </div>
</section>
      <HowToReach />
    </div>
  );
};

export default DetoxRetreat;

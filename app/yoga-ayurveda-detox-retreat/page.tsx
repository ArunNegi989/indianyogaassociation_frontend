// DetoxRetreat.tsx
import React from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-ayurveda-detox-retreat/Detoxretreat.module.css";
import detoxHero from "@/assets/images/Ayurvea-and-detox.jpg";
import faceMassage from "@/assets/images/Massage.jpg";

// ===================== MAIN COMPONENT =====================
const DetoxRetreat: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* ===== SECTION 1 — MAIN TITLE + INTRO ===== */}
      <section className={styles.section}>

        <h1 className={styles.mainTitle}>
          DETOXIFICATION RETREAT THROUGH HERBS, YOGA, AYURVEDA, AND NUTRITION
        </h1>

        <p className={styles.bodyText}>
          We have a responsibility to take care of this body and mind. What do we do to take care of it? Ever
          thought of it? We buy a car don&apos;t we service it regularly so that it doesn&apos;t break down when we
          go on a trip. If we own a car for 10 years, how many times would we service our car? Maybe more than 15
          times at least? What happens if we don&apos;t? Now how many times we serviced or did maintenance of our
          body? From the time we were born until now we could have eaten all kinds of food, that may include good
          healthy food or bad, unhealthy food, chemical preservative, junk food, fast food, etc.
        </p>
        <p className={styles.bodyText}>
          The below image shows the condition of the sewage pipe when new and ten years after use .the condition of
          our large intestine would be similar.
        </p>
        <p className={styles.bodyText}>
          The toxin is any substance which hurts the body. The toxin can also look like the monster in the body,
          they are stranger substance in the body, and its presence is not needed for example heavy metals,
          artificial chemicals, a preservative that found in all the food items we eat from fruits to vegetable.
        </p>

        {/* Hero split image */}
        <div className={styles.heroImageBox}>
          {/* Replace with your actual image path */}
          <Image
            src={detoxHero}
            alt="Ayurveda detoxification - herbs and treatment"
            fill
            sizes="(max-width: 575px) 100vw, (max-width: 991px) 95vw, 1140px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <p className={styles.bodyText} style={{ marginTop: "24px" }}>
          It is said you are, what you eat, but more importantly, you are what you ate. That burger you ate one year
          ago would still be seating inside you. All the food like sugar, cheese, biscuits, namkeen, tea, coffee,
          chips all the things which don&apos;t come from mother nature becomes extremely difficult to digest and
          eliminate. It can stick to the walls of your intestines and forms a thick coating, most diseases like high
          cholesterol levels, diabetics, high blood pressure originate from here because of the accumulation of
          toxins in the body.
        </p>
      </section>

      {/* ===== SECTION 2 — HOW TO CORRECT ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>HOW TO CORRECT THIS PROBLEM?</h2>
        <p className={styles.bodyText}>
          We will help you get rid of this toxin/waste which gets accumulated inside your system. In other words,
          bath your internal system. Once that happens you would automatically lose weight, have clearer skin,
          greater energy and much more mental clarity leading you towards a happy, healthy life.
        </p>
      </section>

      {/* ===== SECTION 3 — COMPLETE METHOD ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          COMPLETE METHOD TO DETOXIFICATION THROUGH YOGA, AYURVEDA, AND DIET:
        </h2>
        <p className={styles.bodyText}>
          It&apos;s a known the fact that the body can heal itself if toxins are out/remove from the body. As toxins
          removed from the body, the immune system develops and helps in fast healing. We bring out complete
          detoxification though following steps .
        </p>

        <ol className={styles.orderedList}>
          <li>
            <strong>Digestive detox:</strong> In this, we activate the digestive system to improve metabolism
            through herbs, therapies and metabolic changes.
          </li>
          <li>
            <strong>Guts detox:</strong> rectum and large intestine detox through herbal oils and Enema.
          </li>
          <li>
            <strong>Breathing detox/lungs detox:</strong> it is carried out through by medicated oil or steam and
            through yoga breathing.
          </li>
          <li>
            <strong>Muscles, bones, cartilage and skin detox</strong> through herbal lepana and oil massage and
            steam and yoga
          </li>
          <li>
            <strong>Blood purification detoxification</strong>
          </li>
          <li>
            <strong>Digital detox:</strong> keeping away all mobile phones, laptop, games or social media away
          </li>
          <li>
            <strong>Complete detox</strong> having the above steps.
          </li>
        </ol>
      </section>

      {/* ===== SECTION 4 — FACE MASSAGE IMAGE ===== */}
      <section className={styles.fullImageSection}>
        <div className={styles.fullImageBox}>
          {/* Replace with your actual image path */}
          <Image
            src={faceMassage}
            alt="Ayurveda face massage treatment"
            fill
            sizes="(max-width: 575px) 100vw, (max-width: 991px) 95vw, 1140px"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </div>
      </section>

      {/* ===== SECTION 5 — TWO SYSTEMS ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitleBold}>
          WE HAVE TWO SYSTEMS FOR DETOXIFICATION AT AYM DETOX SCHOOL IN RISHIKESH
        </h2>

        <ol className={styles.orderedList}>
          <li>
            In one, you can come to our yoga Ayurveda panchakama treatment centre in rishikesh. Our expert will
            start with the standard procedure for detoxification.
          </li>
          <li>
            We will provide you all material and training at your door and will guide ayurveda, yoga and nutritionist
            experts to you. Either you can take our therapist services at our center or can do yourself through one
            time training with our expert through video and call.

            <p className={styles.weProvideLabel}>we will provide you:</p>

            <ol className={styles.nestedList}>
              <li>On phone consultation and guidance.</li>
              <li>A pack delivered at your door having all herbal medicine and oil after booking.</li>
              <li>Our therapist will demonstrate all the steps live or through video.</li>
              <li>
                Our yoga and ayurveda expert will visit you and will have consultation face to face. Also will teach
                you how to do each step or through video.
              </li>
              <li>During the detox process, we will guide and monitor and take feedback.</li>
            </ol>
          </li>
        </ol>
      </section>

      {/* ===== SECTION 6 — PRICE AND PACKAGES ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>PRICE AND PACKAGES</h2>

        <ol className={styles.packagesList}>
          <li>3 Days</li>
          <li>7 Days</li>
          <li>10 Days</li>
          <li>15 Days</li>
        </ol>

        <p className={styles.priceNote}>
          Price will Let you know after Consultant with Our Ayurveda Doctor ( By Email)
        </p>
      </section>

    </div>
  );
};

export default DetoxRetreat;
"use client"
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/yoga-ayurveda-teacher-training-rishikesh/Ayurvedapage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/19.webp";
/* ─── Images ─── */
const IMG = {
  hero:      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1800&q=85",
  massage:   "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=900&q=80",
  herbs:     "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1100&q=80",
  spices:    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1100&q=80",
  rishikesh: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1100&q=80",
  sunset:    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1100&q=80",
  oils:      "https://images.unsplash.com/photo-1531171428720-d0d1c7a00ac5?w=700&q=80",
  panchakarma: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=900&q=80",
};

/* ─── Course cards data ─── */
const ayurvedaCourses = [
  { level: "Beginner", fee: "405 USD", days: "7 Days", cert: "Ayurveda Experience Certificate", color: "#e07b00", img: IMG.massage },
  { level: "Intermediate", fee: "800 USD", days: "15 Days", cert: "Ayurveda Experience Certificate", color: "#b85e00", img: IMG.oils },
  { level: "Advance", fee: "1000 USD", days: "20 Days", cert: "Ayurveda Experience Certificate", color: "#7a3f00", img: IMG.herbs },
];

const panchaKarmaCourses = [
  { level: "Beginner", fee: "330 USD", days: "7 Days", cert: "Ayurveda Experience Certificate", color: "#e07b00" },
  { level: "Intermediate", fee: "470 USD", days: "10 Days", cert: "Ayurveda Experience Certificate", color: "#888" },
  { level: "Advance", fee: "653 USD", days: "14 Days", cert: "Ayurveda Experience Certificate", color: "#e07b00" },
];

/* ─── Panchakarma therapies ─── */
const therapies = [
  {
    num: "1",
    name: "Abhyanga",
    desc: "A herbal oil massage designed to deeply penetrate the skin, relax the body, break up impurities, and boost blood and air circulation in the veins. It enhances the ability of nutrients to reach empty or partially filled cells and allows for the removal of extra nutrients from the body. This results in a heightened state of awareness, which then directs the internal healing system of the body and increases stamina and immunity.",
    icon: "🌿",
  },
  {
    num: "—",
    name: "Shirodhara",
    desc: "Administered gently and methodically by pouring warm herbalized oil over the forehead. Its work is to synchronize the brain waves in tandem with each other, and it profoundly helps coordinate and calm the mind, body, and soul.",
    icon: "🫙",
  },
  {
    num: "2",
    name: "Garshana",
    desc: "A kind of treatment which consists of a dry lymphatic skin which is brushed either with wool or with a silk glove. Dry and soft brushing enhances blood circulation and cleans the skin. This helps the subsequent oil and herbal treatments to penetrate deeply into freshly cleansed pores of the skin.",
    icon: "✋",
  },
  {
    num: "3",
    name: "Swedana",
    desc: "An herbal steam bath provided to a person in which the head and the heart are kept cool while the body is heated up — to remove physical, mental and emotional toxins that are lodged deeply within the skin's tissues. The cool head and heart provide a sense of calm and openness while the warm therapeutic steam penetrates and cleanses the body deeply.",
    icon: "♨️",
  },
  {
    num: "4",
    name: "Pizichili",
    desc: "A process in which continuous stream of warm herbal oil is poured over the body by two Ayurvedic therapists as they massage the body together, in perfect unison. The warmth of herbal oil along with synchronized massage combine to give deep tissue cleansing, supporting a heightened state of awareness that goes beyond any particular description.",
    icon: "💧",
  },
  {
    num: "5",
    name: "Udvartana",
    desc: "A kind of deep penetrating herbal paste used to give a lymphatic massage. This powerful exfoliation (removal of dead skin cells) treatment magically restores a person's natural radiance that conditions the skin, while pressing stagnant lymphatic toxins out of the body.",
    icon: "🌾",
  },
];

/* ─── Massage types ─── */
const massageTypes = [
  {
    num: "1",
    name: "Ayurvedic Massage",
    desc: "This type of massage starts with a head massage, shoulder massage, special back massage, massage of feet, hand massage followed by face massage in the end. Ayurveda Massage in Rishikesh includes a great variety of strokes/touches that are given all kinds of people who suffer from single or all 3 kinds of dosha namely 'Vata,' 'Pitta' and 'Kapha.' People with 'Vata' dosha receive fewer strokes and less pressure, people with 'Pitta' dosha are given medium pressure and medium strokes while people with 'Kapha' dosha are given fuller strokes and good pressure.",
  },
];

/* ─── Daily schedule ─── */
const dailySchedule = [
  { time: "7:00", activity: "Hatha yoga asana class" },
  { time: "8:15", activity: "Herbal tea with snacks" },
  { time: "8:30", activity: "Ayurveda practice" },
  { time: "10:00", activity: "Breakfast" },
  { time: "11:00", activity: "Ayurveda lecture" },
  { time: "1:00", activity: "Lunch" },
  { time: "5:30", activity: "Hatha yoga" },
  { time: "7:00", activity: "Dinner" },
];

const syllabus = [
  "Fundamental principle of Ayurveda",
  "Learning Body constitution",
  "Decision about appropriate massage therapies for general health and study of massage oil",
  "Practice of Ayurveda oil massage",
  "Learning shiro abhyangam (Head Massage)",
  "Padho abhyangam (Foot massage)",
  "Mukha Abhyangam (Face massage)",
];

const included = [
  "3 meals, Indian veg.",
  "Two yoga classes",
  "Ayurveda package",
  "Free Wi-Fi",
  "AYM Ayurveda Kit",
];

/* ─── Yoga TTC pricing ─── */
const yogaPricing = [
  { hrs: "200", title: "200 hour yoga ttc in India", price: "950 USD", note: "Accommodation Shared by two & Meals 100 USD per week" },
  { hrs: "300", title: "300 hour yoga ttc in India", price: "1250 USD", note: "Accommodation Shared by two & Meal 100 USD per week" },
  { hrs: "500", title: "500 hour yoga ttc in India", price: "2200 USD", note: "Accommodation Shared by two & Meal 100 USD per week" },
];

/* ─── Doshas ─── */
const doshas = [
  { name: "Vata", elements: "Air & Ether", color: "#5b8dd9", symbol: "🌬️", desc: "Governs movement, breathing, circulation and the nervous system. Vata types are creative, quick and enthusiastic." },
  { name: "Pitta", elements: "Fire & Water", color: "#e07b00", symbol: "🔥", desc: "Governs digestion, metabolism and energy production. Pitta types are sharp, intense and goal-oriented." },
  { name: "Kapha", elements: "Water & Earth", color: "#27ae60", symbol: "🌊", desc: "Governs structure, lubrication and growth. Kapha types are calm, steady, loving and grounded." },
];

/* ════════════════════════ MAIN ════════════════════════ */
export default function AyurvedaPage() {
  const [activeTab, setActiveTab] = useState<"ayurveda" | "panchakarma">("ayurveda");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add(styles.visible); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(`.${styles.reveal}`).forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.page}>

      {/* Global mandala watermark */}
      <div className={styles.pageWm} aria-hidden="true">
        <MandalaFull size={780} opacity={0.025} />
      </div>

      {/* ════════ HERO ════════ */}
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

      {/* ════════ INTRO ════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.introGrid}`}>
            <div className={styles.introText}>
              <span className={styles.superLabel}>Ancient Science of Life</span>
              <h2 className={styles.sectionTitle}>Introductory Course in Ayurveda<br />in Rishikesh India</h2>
              <OmBar align="left" />
              <p className={styles.para}>
                Welcome to Ayurveda Clinic and Panchakarma centre at AYM. The written findings of Ayurveda dates back to around <strong>5000 years ago</strong>, known as the "Science of life". It governs all the aspects by which a human being can live a healthy, peaceful and happy life, not only healing the body but also the mind and the soul.
              </p>
              <p className={styles.para}>
                Ayurveda gives lots of importance to prevention along with the cure. It helps the disease-free person to maintain good health and cures the diseased by eliminating the diseases from its roots. Introductory course in Ayurveda:
              </p>
              <ol className={styles.introList}>
                <li>How to bring and harmony between the nature and the body</li>
                <li>Learn the hidden secrets of life through the diet, lifestyle and therapies which completely rejuvenates the body and mind.</li>
              </ol>
            </div>
            <div className={styles.introImage}>
              <div className={styles.imgFrame}>
                <img src={IMG.massage} alt="Ayurveda massage Rishikesh" />
                <div className={styles.imgFrameVeil} />
              </div>
            </div>
          </div>

          {/* Spa welcome */}
          <div className={`${styles.reveal} ${styles.spaBox}`}>
            <div className={styles.spaBoxMandala} aria-hidden="true"><MandalaRing size={160} opacity={0.1} /></div>
            <p className={styles.para} style={{ margin: 0 }}>
              Welcome to <strong>Ayurveda Spa at AYM Yoga School</strong>. Ayurveda is the ancient science of life, how to live life healthy and happy. Recently Ayurveda is getting popularity as a natural and herbal treatment of common ailment without side effect. An introductory course in Ayurveda will enable the participant to think what to eat, which is healthy, and how to cook according to nature of a person to avoid disease and keep high energy — keeping all this in mind AYM has designed various courses in Ayurveda which will help the learners to keep healthy.
            </p>
          </div>
        </div>
      </section>

      {/* ════════ DOSHAS ════════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.mandalaBg} aria-hidden="true"><MandalaRing size={550} opacity={0.05} /></div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>The Three Bio-Energies</span>
            <h2 className={styles.sectionTitle}>Tridosha — The Three Doshas</h2>
            <OmBar />
            <p className={styles.paraCenter}>
              Ayurveda prescribes Panchakarma therapies for cleansing body toxins and reviving lost 'urjaa' (physical and spiritual energies). Panchakarma Therapy balances all Tridoshas — the 3 bioenergies that have 4 natural elements in the universe.
            </p>
          </div>
          <div className={`${styles.reveal} ${styles.doshaGrid}`}>
            {doshas.map((d) => (
              <div key={d.name} className={styles.doshaCard} style={{ "--dc": d.color } as React.CSSProperties}>
                <div className={styles.doshaTop} />
                <span className={styles.doshaIcon}>{d.symbol}</span>
                <div className={styles.doshaMandala} aria-hidden="true"><MandalaRing size={120} opacity={0.12} /></div>
                <h3 className={styles.doshaName}>{d.name}</h3>
                <p className={styles.doshaElements}>{d.elements}</p>
                <p className={styles.doshaDesc}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ AYURVEDA COURSES ════════ */}
      <section id="courses" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Programmes</span>
            <h2 className={styles.sectionTitle}>Ayurveda Courses in Rishikesh</h2>
            <OmBar />
          </div>

          {/* Tab switcher */}
          <div className={`${styles.reveal} ${styles.tabRow}`}>
            <button className={`${styles.tab} ${activeTab === "ayurveda" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("ayurveda")}>Ayurveda Courses</button>
            <button className={`${styles.tab} ${activeTab === "panchakarma" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("panchakarma")}>Panchakarma Courses</button>
          </div>

          {activeTab === "ayurveda" && (
            <div className={`${styles.reveal} ${styles.courseGrid}`}>
              {ayurvedaCourses.map((c) => (
                <div key={c.level} className={styles.courseCard}>
                  <div className={styles.courseCardImg}>
                    <img src={c.img} alt={`Ayurveda ${c.level}`} />
                    <div className={styles.courseCardOverlay} style={{ background: `linear-gradient(180deg,rgba(30,10,0,.1) 0%,rgba(40,15,0,.85) 100%)` }} />
                    <div className={styles.courseCardInfo}>
                      <h3 className={styles.courseCardTitle}>Ayurveda {c.level} Course Rishikesh</h3>
                      <p className={styles.courseCardFee}>{c.level} Fee: <strong>{c.fee}</strong></p>
                      <p className={styles.courseCardDur}>Duration: <strong>{c.days}</strong></p>
                      <p className={styles.courseCardCert}>Certification: {c.cert}</p>
                      <a href="#apply" className={styles.courseCardBtn}>Book Now</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "panchakarma" && (
            <div className={`${styles.reveal} ${styles.pkGrid}`}>
              {panchaKarmaCourses.map((c, i) => (
                <div key={c.level} className={styles.pkCard} style={{ "--pc": c.color, background: i === 1 ? "#666" : c.color } as React.CSSProperties}>
                  <h3 className={styles.pkTitle}>Panchakarma {c.level} Course</h3>
                  <p className={styles.pkFee}>{c.level} Fee: <strong>{c.fee}</strong></p>
                  <p className={styles.pkDur}>Duration: <strong>{c.days}</strong></p>
                  <p className={styles.pkCert}>Certification: {c.cert}</p>
                  <a href="#apply" className={styles.pkBtn}>Book Now</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════ AYURVEDA COURSES IN INDIA ════════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <h2 className={styles.sectionTitle}>Ayurveda Courses in India</h2>
            <OmBar />
          </div>

          <div className={`${styles.reveal} ${styles.panchBox}`}>
            <h3 className={styles.panchHeading}>About Panchakarma</h3>
            <p className={styles.para}>
              PANCHAKARMA is a set of five karma "procedures" that detoxify and rejuvenate the body. Ayurveda's principle is based on the five elements: air, water, fire, earth, and ether. The combination of air and ether forms Vata dosha, fire and water forms Pitta dosha, and water forms Kapha dosha from the earth. These three are the bio-energies of the body; a person is in a state of equilibrium and healthy (mentally, physically and spiritually) when these dosha are at a state of equilibrium. Panchakarma brings equilibrium, detoxification, and rejuvenation of the body and mind, helping to have a long, healthy, peaceful and happy life.
            </p>
            <p className={styles.para}>
              Ayurveda is the science and art of healing and appropriate living that helps people achieve longevity. It emphasizes preventive and healing therapies along with various methods of purification and rejuvenation for both healthy and unhealthy people. Panchakarma is a Sanskrit word that means 'five actions' and treats actions. The aim of Panchkarma therapies is to purify and detoxify the body.
            </p>
            <p className={styles.para}>
              AYM Kerala Panchakarma Center in Rishikesh includes five kinds of therapies that can be carried out in a sequential order.
            </p>
          </div>

          {/* Therapies */}
          <div className={`${styles.reveal} ${styles.therapiesGrid}`}>
            {therapies.map((t) => (
              <div key={t.name} className={styles.therapyCard}>
                <div className={styles.therapyHeader}>
                  <span className={styles.therapyIcon}>{t.icon}</span>
                  <div>
                    {t.num !== "—" && <span className={styles.therapyNum}>{t.num}.</span>}
                    <h4 className={styles.therapyName}>{t.name}</h4>
                  </div>
                </div>
                <p className={styles.therapyDesc}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SPICES IMAGE STRIP ════════ */}
      <div className={styles.imgStrip}>
        <img src={IMG.spices} alt="Ayurveda herbs and spices" className={styles.imgStripPhoto} />
        <div className={styles.imgStripVeil} />
        <div className={styles.imgStripContent}>
          <OmBar dark />
          <h3 className={styles.imgStripTitle}>Yoga and Panchakarma Training Course in India</h3>
        </div>
      </div>

      {/* ════════ PANCHAKARMA COURSES ════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.pkCardsFull}`}>
            {panchaKarmaCourses.map((c, i) => (
              <div key={c.level} className={styles.pkCardFull} style={{ "--pc": i === 1 ? "#888" : c.color } as React.CSSProperties}>
                <h3 className={styles.pkCardFullTitle}>Panchkarma {c.level} Course</h3>
                <div className={styles.pkCardFullRow}>
                  <span>{c.level} Fee: <strong>{c.fee}</strong></span>
                  <span>Duration: <strong>{c.days}</strong></span>
                </div>
                <p className={styles.pkCardFullCert}>Certification: {c.cert}</p>
                <a href="#apply" className={styles.pkCardFullBtn}>Book Now</a>
              </div>
            ))}
          </div>

          {/* Massage courses */}
          <div className={`${styles.reveal} ${styles.centered}`} style={{ marginTop: "3rem" }}>
            <h2 className={styles.sectionTitle}>Ayurveda Massage Courses Offered at AYM</h2>
            <OmBar />
            <p className={styles.paraCenter}>
              AYM Kerala Panchakarma Center in Rishikesh, India has come up with various Ayurveda treatment and massage courses for its students, which will be taught different types of massage therapies spanned over 7 to 15 days for Ayurvedic &amp; Deep tissue.
            </p>
            <p className={styles.paraCenter}>
              There are different types of massages that are offered to relieve a person's mind &amp; body and to remove toxins out of his/her body. Some of these that are offered at AYM Kerala Panchakarma center Rishikesh include:
            </p>
          </div>

          <div className={`${styles.reveal} ${styles.massageCard}`}>
            <div className={styles.massageNum}>1.</div>
            <div>
              <h4 className={styles.massageName}>Ayurvedic Massage</h4>
              <p className={styles.para}>{massageTypes[0].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ YOGA & AYURVEDIC MASSAGE TRAINING ════════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <h2 className={styles.sectionTitle} style={{ fontStyle: "italic" }}>Yoga and Ayurvedic Massage Training in India</h2>
            <OmBar />
          </div>

          <div className={`${styles.reveal} ${styles.trainingMeta}`}>
            <span><strong>Duration:</strong> 7 – 10 days</span>
            <span><strong>Cost:</strong> 28,000 – 40,000 INR</span>
            <span><strong>Dates:</strong> Open every month on 10th</span>
          </div>

          <div className={`${styles.reveal} ${styles.trainingGrid}`}>
            {/* Daily Schedule */}
            <div className={styles.trainingCol}>
              <h3 className={styles.trainingColTitle}>Daily Schedule:</h3>
              <div className={styles.scheduleList}>
                {dailySchedule.map((s) => (
                  <div key={s.time} className={styles.scheduleRow}>
                    <span className={styles.scheduleTime}>{s.time}</span>
                    <span className={styles.scheduleAct}>{s.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Syllabus */}
            <div className={styles.trainingCol}>
              <h3 className={styles.trainingColTitle}>Syllabus:</h3>
              <ol className={styles.syllabusList}>
                {syllabus.map((s, i) => (
                  <li key={i} className={styles.syllabusItem}>{s}</li>
                ))}
              </ol>
            </div>

            {/* What's included */}
            <div className={styles.trainingCol}>
              <h3 className={styles.trainingColTitle}>What's included in Fees:</h3>
              <ol className={styles.syllabusListNum}>
                {included.map((item, i) => (
                  <li key={i} className={styles.syllabusItem}>{item}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className={`${styles.reveal} ${styles.registrationBox}`}>
            <strong>Registration:</strong> To book your place in Ayurveda Center in Rishikesh you need to deposit <strong>210 US Dollars</strong> advance fee.{" "}
            <a href="#apply" className={styles.inlineLink}>See payment options →</a>
          </div>
        </div>
      </section>

      {/* ════════ SPIRITUAL ENVIRONMENT ════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Sacred Setting</span>
            <h2 className={styles.sectionTitle} style={{ fontStyle: "italic" }}>Spiritual Environment in Rishikesh</h2>
            <OmBar />
            <p className={styles.paraCenter}>
              To make the yoga experience eternal and remarkable, we have established our yoga place in a perfect place near the mountain valley and Ganga River in Rishikesh. The sacred river Ganges flows through Rishikesh. The river leaves the Shivalik Mountains in the Himalayas and flows out into the plains of northern India through Rishikesh.
            </p>
          </div>

          <div className={`${styles.reveal} ${styles.sunsetWrap}`}>
            <img src={IMG.sunset} alt="Spiritual yoga Rishikesh sunset" className={styles.sunsetImg} />
            <div className={styles.sunsetVeil} />
            <div className={styles.sunsetMandala} aria-hidden="true">
              <MandalaRing size={280} opacity={0.15} />
            </div>
          </div>

          <div className={`${styles.reveal}`}>
            <p className={styles.para}>
              Ashrams, ancient as well as new, can be found along the banks of the Ganges in Rishikesh. Due to all these spiritual spots and many spiritual masters, Rishikesh is the hub of spiritual energy that helps every learner of yoga to meditate easily. Rishikesh is one of the best destinations for spiritual holidays and rest. One must come to Rishikesh for learning ancient, original and traditional yoga.
            </p>
          </div>
        </div>
      </section>

      {/* ════════ PRICING ════════ */}
      <section className={`${styles.section} ${styles.pricingSection}`}>
        <div className={styles.pricingMandala} aria-hidden="true">
          <MandalaFull size={600} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Investment</span>
            <h2 className={styles.sectionTitle} style={{ fontStyle: "italic" }}>Details of Price for Different Courses</h2>
            <OmBar />
          </div>
          <div className={`${styles.reveal} ${styles.yogaPricingGrid}`}>
            {yogaPricing.map((p) => (
              <div key={p.hrs} className={styles.yogaPriceCard}>
                <div className={styles.yogaPriceHrs}>{p.hrs}<span>HR</span></div>
                <h3 className={styles.yogaPriceTitle}>{p.title}</h3>
                <OmBar />
                <p className={styles.yogaPriceAmt}>{p.price}</p>
                <p className={styles.yogaPriceNote}>({p.note})</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ HOW TO APPLY ════════ */}
      <section id="apply" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Enrolment</span>
            <h2 className={styles.sectionTitle} style={{ fontStyle: "italic" }}>How to Apply</h2>
            <OmBar />
          </div>
          <div className={`${styles.reveal} ${styles.applyBox}`}>
            <div className={styles.applyMandala} aria-hidden="true">
              <MandalaRing size={200} opacity={0.1} />
            </div>
            <p className={styles.para}>
              Fill the application form and send it to <a href="mailto:aymyogaschool@gmail.com" className={styles.inlineLink}>aymyogaschool[at]gmail.com</a>. After approval from yoga school deposit <strong>$200 in advance</strong> through pay pal or bank transfer to confirm your place in the course. We will send you an e-mail after receiving your advance fee.
            </p>
            <div className={styles.applyBtns}>
              <a href="mailto:aymyogaschool@gmail.com" className={styles.btnPrimary}>Apply Now →</a>
              <a href="#courses" className={styles.btnOutline}>Browse Courses</a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className={styles.footer}>
        <div className={styles.footerMandala} aria-hidden="true">
          <MandalaFull size={500} opacity={0.09} />
        </div>
        <div className={styles.footerInner}>
          <span className={styles.footerOm}>ॐ</span>
          <p className={styles.footerTitle}>AYM Ayurveda Clinic & Panchakarma Centre</p>
          <p className={styles.footerLoc}>Rishikesh, Uttarakhand, India</p>
          <a href="mailto:aymyogaschool@gmail.com" className={styles.footerMail}>aymyogaschool@gmail.com</a>
          <div className={styles.footerLine} />
          <p className={styles.footerTag}>5000 Years of Ancient Wisdom · Yoga Alliance Certified · AYM Est. 2001</p>
        </div>
      </footer>
      <HowToReach/>
    </div>
  );
}

/* ─── SHARED COMPONENTS ─── */
function OmBar({ align = "center", dark = false }: { align?: "center" | "left"; dark?: boolean }) {
  return (
    <div className={styles.omBar} style={{ justifyContent: align === "left" ? "flex-start" : "center" }}>
      <span className={styles.omLine} style={dark ? { background: "linear-gradient(90deg,transparent,rgba(245,184,0,.55),transparent)" } : {}} />
      <span className={styles.omGlyph} style={dark ? { color: "#f5b800" } : {}}>ॐ</span>
      <span className={styles.omLine} style={dark ? { background: "linear-gradient(90deg,transparent,rgba(245,184,0,.55),transparent)" } : {}} />
    </div>
  );
}

function MandalaRing({ size = 300, opacity = 0.08 }: { size?: number; opacity?: number }) {
  const c = size / 2;
  const rings = [0.46, 0.36, 0.26, 0.15].map((r) => r * size);
  const spokes = 24, petals = 16;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }} aria-hidden>
      <g stroke="#c46a00" strokeWidth="0.75" fill="none">
        {rings.map((r, i) => <circle key={i} cx={c} cy={c} r={r} />)}
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * 2 * Math.PI;
          return <line key={i} x1={c + rings[2] * Math.cos(a)} y1={c + rings[2] * Math.sin(a)} x2={c + rings[0] * Math.cos(a)} y2={c + rings[0] * Math.sin(a)} />;
        })}
        {Array.from({ length: petals }).map((_, i) => {
          const a = (i / petals) * 2 * Math.PI;
          const r = rings[1];
          return <ellipse key={i} cx={c + r * Math.cos(a)} cy={c + r * Math.sin(a)}
            rx={size * 0.065} ry={size * 0.022}
            transform={`rotate(${(i / petals) * 360} ${c + r * Math.cos(a)} ${c + r * Math.sin(a)})`} />;
        })}
      </g>
    </svg>
  );
}

function MandalaFull({ size = 600, opacity = 0.05 }: { size?: number; opacity?: number }) {
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }} aria-hidden>
      <g transform={`translate(${c},${c})`} stroke="#c46a00" fill="none">
        {[0.47, 0.39, 0.31, 0.23, 0.15, 0.08].map((r, i) => (
          <circle key={i} cx={0} cy={0} r={r * size} strokeWidth="0.65" />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          return <line key={i} strokeWidth="0.5"
            x1={size * 0.08 * Math.cos(a)} y1={size * 0.08 * Math.sin(a)}
            x2={size * 0.47 * Math.cos(a)} y2={size * 0.47 * Math.sin(a)} />;
        })}
        {[{ n: 8, r: 0.34 }, { n: 16, r: 0.22 }].map(({ n, r }, gi) =>
          Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * 2 * Math.PI;
            const R = r * size;
            return <ellipse key={`${gi}-${i}`} strokeWidth="0.55"
              cx={R * Math.cos(a)} cy={R * Math.sin(a)}
              rx={size * (gi === 0 ? 0.07 : 0.04)} ry={size * 0.02}
              transform={`rotate(${(i / n) * 360} ${R * Math.cos(a)} ${R * Math.sin(a)})`} />;
          })
        )}
      </g>
    </svg>
  );
}
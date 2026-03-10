"use client";

import React, { useState } from "react";
import styles from "@/assets/style/300-hours-yoga-teacher-training-rishikesh/Yogattc300.module.css";

/* ─────────────────────────────────────────
   YOUTUBE EMBED
───────────────────────────────────────── */
const YouTubeEmbed = ({ videoId, title }: { videoId: string; title: string }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={styles.videoWrapper}>
      {playing ? (
        <iframe
          className={styles.videoIframe}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button className={styles.videoThumb} onClick={() => setPlaying(true)} aria-label={`Play: ${title}`}>
          <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={title} className={styles.thumbImg} loading="lazy" />
          <span className={styles.playBtn}>
            <svg viewBox="0 0 68 48" width="58" height="42">
              <rect width="68" height="48" rx="10" fill="#e07b00" opacity="0.93" />
              <polygon points="26,13 53,24 26,35" fill="#fff" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   IMAGE CAROUSEL
───────────────────────────────────────── */
const Carousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const visible = [0, 1, 2, 3].map((offset) => images[(idx + offset) % images.length]);
  return (
    <div className={styles.carousel}>
      <button className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`} onClick={prev} aria-label="Previous">‹</button>
      <div className={styles.carouselTrack}>
        {visible.map((src, i) => (
          <div key={i} className={styles.carouselSlide}>
            <img src={src} alt={`${alt} ${i + 1}`} className={styles.carouselImg} loading="lazy" />
          </div>
        ))}
      </div>
      <button className={`${styles.carouselBtn} ${styles.carouselBtnRight}`} onClick={next} aria-label="Next">›</button>
    </div>
  );
};

/* ─────────────────────────────────────────
   FAQ ACCORDION ITEM
───────────────────────────────────────── */
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}>
      <button className={styles.faqQ} onClick={() => setOpen(!open)}>
        <span className={styles.faqIcon}>›</span>
        {question}
      </button>
      {open && <div className={styles.faqA}><p>{answer}</p></div>}
    </div>
  );
};

/* ─────────────────────────────────────────
   SYLLABUS TABS DATA
───────────────────────────────────────── */
const modules = [
  {
    label: "Module 1",
    title: "Concept and Meaning of Yoga Therapy",
    content: `This is the special segment of the 300-hour yoga teacher training course in India. The course includes History of yoga therapy, Characteristics of yoga therapy, Principles and the basis of the Integrated approach. Physiology of stress management through yoga. Yoga for a common psychosomatic ailment like back pain, Yoga for Sciatica, Yoga for Diabetes, high blood pressure, Asthma, IBS, constipation and many other diseases, yoga in pregnancy, prenatal yoga and post-natal yoga. This module will take one hour of class daily, usually in the evening. Yoga Master first explains the concept of the disease and then connects it with yoga to heal the body.`,
    list: [],
  },
  {
    label: "Module 2",
    title: "Yoga Philosophy",
    content: `In this section, the teacher will take yoga sutras for an explanation. Yoga sutra is an advanced philosophy, and it has four chapters. The teacher will select the main sutras from each section and discuss them with commentary. This module is taken in a one-hour class every day.`,
    list: [
      "Meaning and concept of Yoga as described in the Yoga texts.",
      "Brief introduction of the Four Paths of Yoga- Raja, Jnana, Bhakti and Karma Yoga.",
      "Prana and pranayama, prana and hatha Yoga.",
      "Chakras and their description.",
      "Description of Mooladhara chakra, Swadhisthana chakra, Manipura chakra, Anahata chakra, Vishudhi chakra, Ajana chakra, Shahshrar chakra.",
    ],
  },
  {
    label: "Module 3",
    title: "Yoga Anatomy and Ayurveda",
    content: `In this segment, we connect different systems to yoga healing. We discuss systems such as the Skeletal System, Muscular System, Introduction of Fascia, Nervous system, Endocrine System, Respiratory System, Circulatory System, and Prenatal Yoga. Also teacher combines with basic ayurveda`,
    list: [
      "1. Introduction to Ayurveda.",
      "2. Definition of Ayurveda.",
      "3. Doshas and their quality.",
      "4. Food according to Gunas.",
      "5. Tamsic, Rajsic and Satvic food.",
    ],
  },
  {
    label: "Module 4",
    title: "Static Multi-style",
    content: `Concept and meaning of static Multi-style Yoga. In this section, the teacher will teach yoga such as Iyengar yoga, restorative Yoga, and Sivananda Yoga. Yoga through rope, chairs, blocks, bolsters, and other props. This module is taken in a 90-minute class every day, during which the instructor explains details of asana, its alignment, and props.`,
    list: [],
  },
  {
    label: "Module 5",
    title: "Dynamic Multi-style",
    content: `The concept and meaning of dynamic Multi-style Yoga, such as the Ashtanga Vinyasa, Power and Flow Yoga, and Hatha Vinyasa, will be discussed and practised in his module, which will be taken every morning for 90 minutes. The teacher will explain the different types of lessons in dynamic Yoga.`,
    list: [],
  },
  {
    label: "Module 6",
    title: "Kriya or Detoxification",
    content: `This module will be taken on every alternate day for a one-hour class in the early morning. The teacher will first explain the process of each detoxification technique, including mudras and bandhas, and then a practice will be conducted. More details is given below.`,
    list: [
      "1. General purposes of detoxification.",
      "2. Sutra Neti for increasing breathing efficiency.",
      "3. Vamana Dhauti for the cure of food poisoning.",
      "4. Varisara Dhauti for deep cleaning of the stomach.",
      "5. Nauli for removing fat from the abdomen.",
      "6. Trataka for eyes health.",
      "7. Hand mudras for concentration.",
      "8. Body mudras for increasing body awareness.",
      "9. Moola bandha of root chakra lock.",
      "10. Uddyana bandha or abdominal lock.",
      "11. Jalendhar bandha or neck lock.",
    ],
  },
  {
    label: "Module 7",
    title: "Teaching Practice",
    content: `Advanced Teaching Methodology and principles of teaching practice. An expert instructor will lead this module in the afternoon. In this class, the teacher emphasises fundamental teaching practices and then progresses to more challenging lesson planning and teaching. This class lasts 60 to 90 minutes every day.`,
    list: [
      "1. Planning for different types of Yoga or Multistyle yoga.",
      "2. Selecting and designing over 15 yoga sequences.",
      "3. Considerations in lesson design.",
      "4. Creating a balanced sequence for healthy body and mind.",
      "5. Timing of different stages in a lesson.",
      "6. Demonstration vs. instructions.",
      "7. Art of Giving instructions.",
      "8. Classroom management.",
      "9. The physical environment.",
      "10. Improving teaching.",
    ],
  },
  {
    label: "Module 8",
    title: "Pranayama and Meditation",
    content: `We focus on advanced meditation and Pranayama. After completing 200 hours of yoga teacher training and learning the basics of pranayama and meditation, this module focuses on advanced-level pranayama and meditation techniques. This class is typically held one hour a day in the morning.`,
    subTitle: "Meditation techniques",
    list: [
      "1. Breath Mind Awareness meditations.",
      "2. Trataka or Inner Light Meditation.",
      "3. Nada Meditation Practices.",
      "4. Beginner Music Meditation.",
      "5. Om or Pranava Meditation.",
      "6. Advance Mantra Meditation or Mantra Japajapa.",
      "7. Kirtan singing meditation.",
      "8. Dynamic Moving Meditation (Osho).",
      "9. Muladhara Root Chakra Meditation.",
      "10. Swadhisthana Sacral Chakra Meditation'",
      "11. Manipura Neval Chakra Meditation.",
      "12. Anahata Heart Chakra Meditation.",
      "13. Visuddhi Throat Chakra Meditation.",
      "14. Ajna Third Eye Chakra Meditation.",
      "15. Sahasrara Crown Chakra Meditation.",
      "16. Kundalini Awakening Meditation.",
      "17. Vipassana meditation techniques.",
      "18. Breath Awareness.",
      "19. Mindfulness and Sensation.",
      "20. Total Awareness Practice.",
    ],
    twoCol: true,
  },
  {
    label: "Module 9",
    title: "Mantra Chanting",
    content: `In this module, basic and advanced-level mantra chanting and learning will be conducted every other day in the evening before bedtime. It helps in stress-free sleeping and develops healthy sleeping habits.`,
    list: [
      "1. Meaning of Mantras.",
      "2. Benefits of mantra chant?.",
      "3. What is the Om/Aum mantra?.",
      "4. Knowledge mantra? Gyatri Mantra.",
      "5. Mantra for teacher / Guru Brahma Chant.",
      "6. Yoga Opening mantra.",
      "7. Universal Brotherhood mantra -Asatoma Sadgamaya.",
      "8. Closing mantra of Yoga.",
      "9. Dhayana Mantra.",
      "10. Pranayama opening Mantra.",
      "11. Yogasana opening Mantra.",
      "12. Ashtanga vinyasa Opening mantra Prayer.",
      "13. Ashtanga Closing Prayer.",
    ],
  },
];

/* ─────────────────────────────────────────
   COURSE DATES
───────────────────────────────────────── */
const courseDates = [
  "5th Jan - 31st Jan 2026",
  "1st Feb - 28th Feb 2026",
  "1st Mar - 28th Mar 2026",
  "1st Apr - 28th Apr 2026",
  "1st May - 28th May 2026",
  "1st Jun - 28th Jun 2026",
  "1st Jul - 28th Jul 2026",
  "1st Aug - 28th Aug 2026",
  "1st Sep - 28th Sep 2026",
  "1st Oct - 28th Oct 2026",
  "1st Nov - 28th Nov 2026",
  "1st Dec - 28th Dec 2026",
];

/* ─────────────────────────────────────────
   ACCOMMODATION IMAGES (Unsplash yoga/room)
───────────────────────────────────────── */
const accomImages = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80",
];
const foodImages = [
  "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80",
  "https://images.unsplash.com/photo-1622597467836-f3e1fe5a4fdb?w=400&q=80",
  "https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?w=400&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
];
const luxuryImages = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80",
];
const heroImages = [
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
  "https://images.unsplash.com/photo-1593810451137-5dc55105dace?w=600&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&q=80",
];
const diplomaImg = "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1000&q=80";
const yogaGardenImg = "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1000&q=80";

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function YogaTTC300() {
  const [activeModule, setActiveModule] = useState(0);
  const mod = modules[activeModule];

  return (
    <div className={styles.page}>
      {/* Mandala decorations */}
      <div className={styles.mandalaTopLeft} aria-hidden="true" />
      <div className={styles.mandalaBottomRight} aria-hidden="true" />

      {/* ══════════════════════════════════════
          SECTION 1 — HERO (Image 1)
      ══════════════════════════════════════ */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          {heroImages.map((src, i) => (
            <div key={i} className={styles.heroImgWrap}>
              {i === 0 && <span className={styles.heroLabel300}>300 hour</span>}
              {i === 2 && <span className={styles.heroLabelScript}>Yoga Course</span>}
              <img src={src} alt={`Yoga TTC ${i + 1}`} className={styles.heroImg} loading="lazy" />
            </div>
          ))}
        </div>

        <div className="container">
          <div className={styles.topBorderLine} />
          <h1 className={styles.heroTitle}>300 Hour Yoga Teacher Training in Rishikesh India</h1>
          <div className={styles.omDivider}><span className={styles.divLine}/><span className={styles.omGlyph}>ॐ</span><span className={styles.divLine}/></div>

          <div className={styles.bodyText}>
            <p>The <strong>300 hour yoga teacher training course in Rishikesh</strong> is suitable for those who want to become highly qualified, advanced yoga instructors and have either completed a <strong>200 hour course</strong> or have extensive experience in yoga practice. This course certainly enhances your flexibility through challenging asana practice and the development of higher consciousness through advanced pranayama and meditation. To become a master yoga teacher, a best 300 hour yoga teacher training in india at AYM, gradually brings mastery of all components of yoga, as continuous learning is a crucial technique for excellence.</p>
            <p>This advanced yoga teacher training course covers advanced and modified yoga postures, the use of props like straps, blocks, and bolsters, as in Iyengar yoga, advanced methods of alignment and adjustments, and advanced sequencing of asana or advanced lesson planning.</p>
            <p>After completing 200 hour yoga teacher training course, when you start advanced 300-hour yoga ttc in Rishikesh, you wish that someone would provide guidance, correct you, and help you reach a higher level. You may wish to learn advanced Anatomy and deeper philosophy. Our school has 25 years of research, and we are integrating all learning domains into our 300 hour teacher training program, which you have been dreaming of.</p>
          </div>

          <h2 className={styles.sectionTitleOrange}>Top 300 Hour Yoga Teacher Training India</h2>
          <div className={styles.sectionUnderline} />
          <div className={styles.bodyText}>
            <p>According to Yogi Chetan Mahesh, a nation's progress depends on its healthy individuals who run various industries or businesses. To make a nation healthy, a yoga teacher has a significant responsibility. At AYM yoga school, our vision is to train exceptional yoga teachers who can spread yoga worldwide and bring peace and happiness to the world. For this purpose, we have built the largest 300 hour yoga training center in the heart of Rishikesh Tapovan, spanning about 5000 sq ft. of land area with dedicated and properly equipped yoga studios.</p>
            <p>AYM is one of the best 300 hour yoga teacher training schools in Rishikesh, India, offering a blend of traditional hatha yoga and modern, advanced multi-style yoga. All our courses are registered with the Yoga Alliance of the USA. This course is also beneficial if you wish to register as RYT 500 with the Yoga Alliance, since, at the end of the 300 hours yoga teacher training course in rishikesh india, you will have logged a collective 500 hours of training. Once you fulfil your 100 hour of teaching practice, you can apply for RYT 500 registration. It opens up an excellent opportunity to teach students globally.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — OVERVIEW + COURSE DATES (Image 2)
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          <h2 className={styles.sectionTitleOrange}>Overview of 300 Hour Multi-Style Yoga Teacher Training in Rishikesh, India</h2>
          <div className={styles.sectionUnderline} />

          <div className={styles.overviewList}>
            <p><strong>Name of the certification:</strong> 300-hour yoga teacher training / Yoga wellness instructor (YWI).</p>
            <p><strong>Course level:</strong> Level-II.</p>
            <p><strong>Requirement/Eligibility:</strong> Physically fit and open for all, but it is suggested that the candidate should have passed the 10th standard / secondary school certificate from a recognized board or completed 200 Yoga teacher training course.</p>
            <p><strong>Minimum age:</strong> No age limit.</p>
            <p><strong>Credit points for certificate:</strong> 14 credits.</p>
            <p><strong>Language:</strong> English, Hindi ( Seprate Groups ).</p>
          </div>

          <div className={styles.datesBox}>
            <h3 className={styles.datesTitle}>Upcoming Course Dates</h3>
            <p className={styles.datesSubtitle}>Choose your preferred accommodation. Prices include tuition and meals.</p>
            <div className={styles.datesTable}>
              {courseDates.map((date, i) => (
                <div key={i} className={styles.dateRow}>
                  <span className={styles.dateText}>{date}</span>
                  <span className={styles.datePrices}>
                    Dorm <strong className={styles.priceVal}>$849</strong>
                    <span className={styles.priceSep}> | </span>
                    Twin <strong className={styles.priceVal}>$999</strong>
                    <span className={styles.priceSep}> | </span>
                    Private <strong className={styles.priceVal}>$1199</strong>
                  </span>
                  <span className={styles.earlyBird}>● Early Bird</span>
                </div>
              ))}
            </div>
            <p className={styles.datesNote}><strong>Note:</strong> A $100 USD early bird discount is available on all accommodation types if booked 60 days in advance.</p>
            <div className="text-center mt-3">
              <a href="#" className={styles.btnPrimary}>Reserve Your Spot Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — INCLUDED / NOT INCLUDED (Image 3)
      ══════════════════════════════════════ */}
      <section className={`${styles.section}`}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <h3 className={styles.includedTitle}>Included in 300 Hour yoga ttc course in india</h3>
              <div className={styles.sectionUnderlineLeft} />
              <ol className={styles.inclList}>
                {[
                  "Six days of yoga, meditation, and theory classes each week; Sundays are free days.",
                  "28 nights of accommodation with vegetarian meals provided.",
                  "One AYM t-shirt available in white or yellow for 300 hr yoga course.",
                  "One yoga bag featuring the AYM printed logo for holding books and study materials.",
                  "One excursion to a local attraction during the 300 hr yoga classes in rishikesh.",
                  "Three meals, tea, and filtered water are available daily (except for lunch and dinner on Sundays).",
                  "Teaching materials, a course manual, and access to communal yoga mats in the studio.",
                  "Classes on yoga anatomy, teaching methodology, philosophy, and Ayurvedic theory.",
                  "Free Wi-Fi and self-service laundry facilities (washing machine available).",
                  "Yoga Alliance-recognized certification upon graduation.",
                  "can appear in YCB Examination for 400 hours or 800 hour.",
                  "one free massage, one free sound healing session with private accommodation.",
                  "free twice a week ayurvedic massage, two free sound healing sessions and swimming pool facility with luxury accommodation.",
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="col-md-6">
              <h3 className={styles.notIncludedTitle}>Not Included in 300 hour yoga ttc course in Rishikesh</h3>
              <div className={styles.sectionUnderlineLeft} />
              <ol className={styles.inclList}>
                {[
                  "Any Airfare.",
                  "Service of Airport pickup (Extra Charges Applicable).",
                  "Service of Bus/train transfer (Extra Charges Applicable).",
                  "Facility of Spa/massage treatments (Extra Charges Applicable).",
                  "Facility of Air conditioner room (Extra Charges Applicable).",
                  "Facility of Heater for a room (Extra Charges Applicable).",
                  "Facility of swimming pool( extra Charges Applicable).",
                  "YCB examination fee( extra Charges Applicable).",
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — SYLLABUS TABS (Images 4–12)
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          <h2 className={styles.sectionTitleOrange}>Outline of syllabus — Yoga teacher training in India</h2>
          <div className={styles.sectionUnderline} />
          <p className={styles.bodyPara}>Below is the summarized course syllabus of the 300-hour yoga instructor certification diploma (300 hrs YTTC). On the first day of training, students will get a handout with fine details of the syllabus and a brochure of teachers regarding their course. We designed the syllabus to provide the theoretical, practical, and experimental components of the 300-hour yoga course knowledge at AYM Rishikesh.</p>

          {/* Module tabs */}
          <div className={styles.moduleTabs}>
            {modules.map((m, i) => (
              <button
                key={i}
                className={`${styles.moduleTab} ${activeModule === i ? styles.moduleTabActive : ""}`}
                onClick={() => setActiveModule(i)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className={styles.moduleContent}>
            <h4 className={styles.moduleContentTitle}>{mod.title}</h4>
            <p className={styles.moduleContentText}>{mod.content}</p>
            {mod.subTitle && <p className={styles.moduleSubTitle}><strong>{mod.subTitle}</strong></p>}
            {mod.list && mod.list.length > 0 && (
              mod.twoCol ? (
                <div className="row">
                  <div className="col-md-6">
                    {mod.list.slice(0, 10).map((item, i) => <p key={i} className={styles.moduleListItem}>{item}</p>)}
                  </div>
                  <div className="col-md-6">
                    {mod.list.slice(10).map((item, i) => <p key={i} className={styles.moduleListItem}>{item}</p>)}
                  </div>
                </div>
              ) : (
                <div>
                  {mod.list.map((item, i) => <p key={i} className={styles.moduleListItem}>{item}</p>)}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — EVOLUTION & CERTIFICATION (Image 13)
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitleOrange}>Evolution and certification</h2>
          <div className={styles.sectionUnderline} />

          <p className={styles.bodyPara}>The primary purpose of an examination is to prepare students to become good teachers, rather than merely assigning a grade. There will be a practical and theoretical exam to obtain certification for a 300-hour Yoga TTC in Rishikesh India.</p>

          <h3 className={styles.subHeading}>Mark Distribution: 300 hour yoga teacher training course in india at AYM Yoga School</h3>
          <div className={styles.bodyText}>
            <p><strong>Total Marks of 300 hour yoga ttc examination</strong> : 200 Marks (Theory: 60 + Practical: 140).</p>
            <p><strong>In theory examination</strong> there will be an objective multiple-choice questions paper. It covers all classes that have lectures, and the total marks for it are 60. Theory examination will be from all lecture classes taught in 300 hour yoga certification in the school.</p>
            <p><strong>Practical examination</strong> has total marks of 140, and a student has to demonstrate practical skills acquired during 300 hour yoga classes in Rishikesh. The examiner may ask to demonstrate sun salutation, asanas, pranayama, meditation, and teaching practice.</p>
          </div>

          <p className={styles.bodyPara}>It's further marks distribution is as:</p>
          <ol className={styles.inclList}>
            <li>Demonstration Skills of Sunsalutation, Asana, Pranayama, Mudra, Meditation: 80 Marks.</li>
            <li>Teaching Skills: Lesson planning, Class control, Giving instruction, Alignment and Adjustments - 40 Marks.</li>
            <li>Application of knowledge: It covers behavior and discipline during ttc classes - 10 Marks.</li>
            <li>Field Experience: It covers practical experience of Karma yoga, Bhakti yoga and contentment - 10 Marks.</li>
          </ol>

          <h3 className={styles.subHeading} style={{ marginTop: "2rem" }}>Scope &amp; Career Opportunities</h3>
          <div className="row g-3 mt-1">
            {[
              "Yoga Instructor at the health clubs",
              "Yoga and Pilates Instructors",
              "Yoga Consultant",
              "Yoga instructor for celebrities",
              "Yoga Teacher",
              "Yoga Physician and Analyst",
              "Yoga Research Officials",
              "Yoga Therapists and Naturopaths",
              "Yoga Diet Specialist",
            ].map((career, i) => (
              <div key={i} className="col-md-4 col-sm-6">
                <div className={styles.careerChip}>{career}</div>
              </div>
            ))}
          </div>

          {/* Fee cards */}
          <div className="row g-4 mt-3">
            <div className="col-md-6">
              <div className={styles.feeCardLight}>
                <h4 className={styles.feeCardTitle}>300 Hour Yoga Teacher Training Online</h4>
                <p>Online Course Fee: 25,000 INR</p>
                <p>Weekly Online Course Fee: 25,000 INR</p>
                <p>Recorded TTC Course Fee: 18,000 INR</p>
                <p>Certification: Yoga Alliance, USA.</p>
                <a href="#" className={styles.btnOutlineWhite}>Read More</a>
              </div>
            </div>
            <div className="col-md-6">
              <div className={styles.feeCardDark}>
                <h4 className={styles.feeCardTitle}>300 Hour Yoga Teacher Training Course</h4>
                <p>Offline Fee: 25,000 INR - Dorm Shared (Indian Students)</p>
                <p>Offline Fee: 30,000 INR - Twin Shared (Indian Students)</p>
                <p>Offline Fee: 49,999 INR - Private (Indian Students)</p>
                <p>Certification: Yoga Alliance, USA.</p>
                <a href="#" className={styles.btnOutlineWhite}>Read More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — FAQ + ACCOMMODATION + FOOD (Image 14)
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          <h2 className={styles.sectionTitleOrange}>300 Hour Yoga Teacher Training in India</h2>
          <div className={styles.sectionUnderline} />

          <div className={styles.faqWrap}>
            <FaqItem
              question="Why 300 hour yoga TTC in Rishikesh at AYM?"
              answer="AYM Yoga School offers the most comprehensive 300-hour yoga teacher training in Rishikesh with 25 years of research, experienced teachers, Yoga Alliance USA certification, and a peaceful ashram environment near the Ganges River."
            />
            <FaqItem
              question="How long is a 300 hour yoga training course in Rishikesh?"
              answer="The 300 hour yoga teacher training course at AYM Yoga School spans 28 days (4 weeks). Classes run six days per week with Sundays as free days."
            />
            <FaqItem
              question="What do you learn in 300 hour yoga TTC in Rishikesh?"
              answer="You learn advanced yoga asanas, multi-style yoga (Iyengar, Ashtanga Vinyasa, Hatha, Restorative), advanced pranayama and meditation, yoga therapy, yoga philosophy (Yoga Sutras), teaching methodology, anatomy and Ayurveda, kriya practices, and mantra chanting."
            />
          </div>

          <h3 className={styles.subHeadingCentered}>Accommodation</h3>
          <div className={styles.sectionUnderlineCentered} />
          <Carousel images={accomImages} alt="Accommodation" />

          <h3 className={styles.subHeadingCentered} style={{ marginTop: "3rem" }}>Food</h3>
          <div className={styles.sectionUnderlineCentered} />
          <Carousel images={foodImages} alt="Food" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 7 — LUXURY ROOM & FEATURES (Image 15)
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitleCentered}>LUXURY ROOM &amp; FEATURES</h2>
          <div className={styles.sectionUnderlineCentered} />

          <div className="row align-items-start g-4">
            <div className="col-md-6">
              <ul className={styles.luxuryList}>
                {[
                  "Accommodation ( Private )",
                  "Complimentary Toiletries",
                  "Food as Guest Choice ( Vegetarians )",
                  "Water kettle (Unlimited Tea / Coffee)",
                  "Hair Styling Tools (Hair Dryer)",
                  "Swimming pool",
                  "3 Massage Free",
                  "Fancy Bathrobes",
                  "Kid-friendly Rooms and Products",
                  "Premium Bedding",
                ].map((f, i) => (
                  <li key={i}>
                    <span className={styles.luxuryBullet}>●</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              <div className="row g-2">
                {luxuryImages.map((src, i) => (
                  <div key={i} className={i === 2 ? "col-12" : "col-6"}>
                    <img src={src} alt={`Luxury room ${i + 1}`} className={styles.luxuryImg} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <img
              src={yogaGardenImg}
              alt="Yoga in garden"
              className={styles.fullWidthImg}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 8 — FEATURES + DAILY SCHEDULE (Image 16)
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          <h2 className={styles.sectionTitleOrange}>300 Hour Yoga Teacher Training in Rishikesh — Features</h2>
          <div className={styles.sectionUnderline} />

          <ol className={styles.featuresList}>
            {[
              "Students with basic, intermediate, or advanced knowledge of yoga are eligible for this yoga teacher training certification course in Rishikesh, India.",
              "Our 300-hour yoga course will embrace your teaching and designing skills.",
              "Our 300-hour YTT classes consist of different styles of yoga such as Sivananda, Power Flow, Vinyasa, Raja yoga, and Healing yoga treatments.",
              "Explore your knowledge of yoga by joining one of the top yoga schools under the supervision of the best yoga experts with the past 20 years of teaching experience and RYT 500.",
              "Our modest teacher training in Rishikesh, India, costs 1099 USD, including three daily meals and shared rooms with warm water facilities. We also provide teaching kits to our students.",
              "AYM yoga school/ashram is in a calm and friendly atmosphere surrounded by mountains not far from the city.",
              "The rejuvenating environment of yoga school will help you transform your mind and body. It gives you the experience of a sacred ashram lifestyle that has been proven to be beneficial for health and stress-free, happy living.",
            ].map((f, i) => (
              <li key={i}><strong>{i + 1}:</strong> {f}</li>
            ))}
          </ol>

          <div className="row g-4 mt-3">
            <div className="col-lg-6">
              <h3 className={styles.subHeadingOrange}>Daily Schedule</h3>
              <div className={styles.scheduleTable}>
                {[
                  ["06:30 AM", "Pranayama And Meditation/Kriya"],
                  ["08:00 AM", "Tea"],
                  ["08:15 AM", "Multi Style Yoga"],
                  ["10:00 AM", "Brunch"],
                  ["11:00 AM", "Karma Yoga"],
                  ["12:00 PM", "Teaching Methodology"],
                  ["01:00 PM", "Self Study / Ayurveda (If you choose Ayurveda Course)"],
                  ["02:00 PM", "Refreshment"],
                  ["03:00 PM", "Lecture On Anatomy"],
                  ["04:15 PM", "Yoga Therapy & Philosophy"],
                  ["05:30 PM", "advance Hatha Yoga"],
                  ["07:10 PM", "Dinner"],
                  ["08:00 PM", "Mantra"],
                  ["10:00 PM", "Light Off"],
                ].map(([time, activity], i) => (
                  <div key={i} className={styles.scheduleRow}>
                    <span className={styles.scheduleTime}>{time}</span>
                    <span className={styles.scheduleActivity}>{activity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-2 h-100">
                {[
                  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&q=80",
                  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
                  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80",
                ].map((src, i) => (
                  <div key={i} className={i === 0 ? "col-12" : "col-6"}>
                    <img src={src} alt={`Schedule ${i + 1}`} className={styles.scheduleImg} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 9 — LEARNING OUTCOMES + ELIGIBILITY + EVALUATION (Image 17)
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitleOrange}>Learning Outcomes of 300 Hour yoga teacher training course in Rishikesh</h2>
          <div className={styles.sectionUnderline} />
          <p className={styles.bodyPara}>On pursuing successful completion of 300 yoga teacher training course at AYM Rishikesh, participants will be able to attain following.</p>

          <ol className={styles.outcomesList}>
            {[
              "Upon completion, students will be awarded the prestigious 300-hour YTTC certification from AYM School, a mark of excellence in the field of yoga.",
              "Students will become eligible to register with Yoga Alliance, USA., as RYT 500 yoga teachers.",
              "Acquire full knowledge of different styles of yoga, its methodology, and its physiology, which will reinforce students' staying healthy and fit.",
              "Our 300 YTTC acts as the bedrock to enhance and develop students' self-confidence, which helps them attain balanced professional and financial status.",
              "During training sessions, we strongly emphasize students' deepened self-practice and the need for corrections in different yoga postures.",
              "Our team is dedicated to providing practical training, ensuring students can deepen their practice, and correcting and guiding others in various yoga postures.",
              "Our teaching pedagogy is based on training our students so that they can acquire yoga teaching skills and, in the future, instruct yoga in schools.",
              "Our team prioritizes the fine-tuning of meditation and pranayama practice.",
              "To acknowledge the roots of yogic lineages and how yogic sciences emerged in the modern era and use this knowledge to remodel themselves.",
              "Our 300 YTTC acts as the bedrock to enhance and develop students' self-confidence, which helps them attain balanced professional and financial status.",
              "During training sessions, we strongly emphasize students' deepened self-practice and required corrections in different yoga postures.",
              "Our team is dedicated to providing practical training, ensuring that students can deepen their practice, and correcting and guiding others in various yoga postures.",
              "Our teaching pedagogy is based on training our students so that they can acquire yoga teaching skills and, in the future, instruct yoga in schools.",
              "Our team prioritizes the fine-tuning of meditation and pranayama practice.",
              "To acknowledge the roots of yogic lineages and how yogic sciences emerged in the modern era and use this knowledge to remodel themselves.",
            ].map((item, i) => (
              <li key={i}><strong>{i + 1}:</strong> {item}</li>
            ))}
          </ol>

          <h2 className={styles.sectionTitleOrange} style={{ marginTop: "2.5rem" }}>300 Hour Yoga Teacher Training in Rishikesh</h2>
          <div className={styles.sectionUnderline} />
          <h3 className={styles.sectionTitleOrangeSmall}>Eligibility</h3>
          <div className={styles.sectionUnderline} />
          <p className={styles.bodyPara}>300 Hour yoga teacher certification is for individuals having a high degree of motivation and enthusiasm to complete the course after finishing the 200 Hour yoga course from any school. Individuals having any past experience with yoga can enroll themselves. We will assess your eligibility after you send us your application form. After going through it we will send you an email where you can proceed to Book your spot after successful deposition of 200 USD.</p>

          <h2 className={styles.sectionTitleOrange} style={{ marginTop: "2.5rem" }}>Evaluation and Certification — 300 Hour Yoga Teacher Training in India</h2>
          <div className={styles.sectionUnderline} />
          <p className={styles.bodyPara}>To accomplish a training certificate of 300 Hour yoga teacher training course students need to attend a four week course that includes eight modules. If any student had previously completed the module we will assess the student's capability. Assessment will be based on written assignment and practical evaluation. After you will get certification from Yoga Alliance USA.</p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 10 — YOGA ETHICS (Image 18)
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          <h2 className={styles.sectionTitleOrange}>Yoga ethics — Codes of conduct during 300 Hour Yoga TTC in Rishikesh at AYM</h2>
          <div className={styles.sectionUnderline} />

          <div className={styles.bodyText}>
            <p>Yoga is a spiritual discipline that combines physical, mental and spiritual elements; to make us cognitive.</p>
            <p className={styles.quoteText}>"The very heart of yoga is abhyasa means constant practice with steady effort in the direction you want to go. "</p>
            <p>According to yoga gurus, to actualize the naturalistic power of yoga one must have to follow proper yoga ethics and discipline or we can say Yama and Niyamas. Here are some guidelines we marked for our students to follow at our yoga school.</p>
          </div>

          {[
            "Students need to be obedient in classes and no unexcused absence is allowed in classes, 95% attendance is must for all students.",
            "Be courteous and polite with everyone although it's our responsibility to spread a positive environment.",
            "Do not make unnecessary noise as you are yoga learners. Adapt yourself to be harmonious and maintain silence in the ashram after 10 pm.",
            "Be punctual and try to complete the task in provided time and eat and sleep on given time that help you to be adaptive for a better lifestyle.",
            "Our yoga teacher training course is not only for providing you with an eligibility certificate it makes you eligible to do self-practice so always be prepared to attend different classes.",
          ].map((rule, i) => (
            <div key={i} className={styles.ethicsRule}>
              <span className={styles.ethicsNum}>{i + 1}-</span>
              <p className={styles.ethicsText}>{rule}</p>
            </div>
          ))}

          <div className="mt-4">
            <img
              src={diplomaImg}
              alt="Students with Diploma certificates"
              className={styles.fullWidthImg}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 11 — MISCONCEPTIONS (Image 19)
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.misconceptionsBox}>
            <h2 className={styles.sectionTitleOrange}>Misconceptions about 300 hour yoga teacher training Rishikesh India</h2>
            <div className={styles.sectionUnderline} />

            <p className={styles.bodyPara}><strong>Shake your myths:</strong> The 300-hour yoga teacher training is often seen as merely an advanced step for certified instructors, yet numerous misconceptions surround this transformative journey.</p>

            <ol className={styles.miscList}>
              {[
                "You think you are signing up to learn yoga, but what you are truly learning about is yourself, inside out.",
                "It is not just to become a teacher but to begin your journey of balance, better living, and be enriched with deeper meaning.",
                "It is not only for advanced practitioners but a call for all, beginners to seekers, a spiritual science not for dogmas but for experience.",
                "It is not just yoga asanas you learn about, but a deep dive into multiple folds of learning – inner and outer anatomy, philosophy, emotional release, discipline and stillness, rebuilding a stronger, deeper and profound foundation.",
                "The learning and self-healing are not just restricted to you but lead to a ripple effect, extending to families, communities and the world. When you evolve, you teach by conscious presence, not by presence. The world doesn't need more teachers; it needs more awakened beings. That is what 300 hour yoga teacher training course in india cultivates, as compared to the rest of the world. You may teach or not, but transformation and reshaping yourself - body, mind and heart is a sure shot to happen.",
                "The 300-hour yoga teacher training is not just a certification to become a teacher; it marks the beginning of a lifelong journey towards balance, purpose, and holistic well-being.",
                "Through this training, you are introduced to practices that cultivate inner peace, mindfulness, and a deeper understanding of yourself and the world. The experience enriches your life with greater meaning, helping you live more intentionally, embrace healthier habits, and foster resilience in the face of daily challenges. Ultimately, it is a transformative process that goes far beyond the classroom, inspiring you to grow continually.",
                "Many believe it is only for those wanting to teach professionally; in reality, it offers profound personal growth, regardless of teaching aspirations.",
                "Another common myth is that all best 300 hour yoga teacher training in india is physically demanding above all else, when in fact it emphasizes philosophy, advanced human anatomy, and holistic well-being as much as asana.",
                "Some expect immediate mastery over advanced poses, overlooking the importance of continuous practice. Others assume prior perfection in yoga asana is required.",
                "By dispelling these misconceptions, more yogis can appreciate the true value of the 300 hours yoga teacher training course, rishikesh India—not just as a certification, but as a meaningful path toward self-discovery, community, and lifelong learning.",
              ].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 12 — STUDENT REVIEWS & VIDEOS (Image 20)
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className="container">
          <h2 className={styles.sectionTitleDark}>Student Reviews &amp; Success Stories</h2>
          <p className={styles.sectionSubDark}>Authentic stories of transformation from students who began just like you.</p>

          <div className="row g-4 mt-2">
            {[
              {
                name: "Karina Miller",
                role: "Certified Yoga Teacher",
                initial: "K",
                avatar: "https://i.pravatar.cc/60?img=47",
                text: `My experience at AYM Yoga School was amazing! I did my 300hr YTT at this school and it far exceeded my expectations. The teachers at this school are phenomenal, and truly know their craft as well as live what they teach. The staff was so friendly and kind, and the massages by Mukesh are 100% amazing! The facilities themselves were good and the rooms are comfortable. I feel so equipped to actually start teaching and sharing the essence of yoga. If you are considering coming to AYM Yoga School for a teacher training, I say 'DO IT!`,
              },
              {
                name: "Patrick Reid",
                role: "Yoga Practitioner, USA",
                initial: "P",
                avatar: "https://i.pravatar.cc/60?img=33",
                text: `I followed the 300h YTT, 1 part in the school and 1 part online. I gained a lot of knowledge to work with in the future. It was the authentic Indian experience I was looking for.\nA great plus is the flexibility this school gives to find the right program for you if you have limited time in Rishikesh.\nI would recommend this experience to everyone 😄`,
              },
              {
                name: "LIU JIN",
                role: "Yoga Practitioner",
                initial: "L",
                avatar: null,
                text: `I have completed 300 hours of yoga teacher training here. The intensive training here for nearly a month is very fulfilling and satisfying.\nI don't want to leave school at all. I am really lucky to meet many professional teachers here, which makes me more confident. Confidence to face the future, I recommend you to come to AYM for classes.\nThank you very much.`,
              },
            ].map((r, i) => (
              <div key={i} className="col-md-4">
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    {r.avatar ? (
                      <img src={r.avatar} alt={r.name} className={styles.reviewAvatar} />
                    ) : (
                      <div className={styles.reviewInitial}>{r.initial}</div>
                    )}
                    <div>
                      <p className={styles.reviewName}>{r.name}</p>
                      <p className={styles.reviewRole}>{r.role}</p>
                    </div>
                  </div>
                  <div className={styles.reviewStars}>★★★★★</div>
                  <p className={styles.reviewText}>
                    <span className={styles.reviewOpenQ}>"</span>
                    {r.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mt-3">
            <div className="col-md-6">
              <YouTubeEmbed videoId="pXU4_SXdNdY" title="300 Hour Yoga TTC Review by Alex..." />
            </div>
            <div className="col-md-6">
              <YouTubeEmbed videoId="VqvYnBNr2Jg" title="Students Experiences / Yoga / Yog..." />
            </div>
          </div>

          <div className="text-center mt-4">
            <a href="#" className={styles.btnPrimary}>Read More Reviews</a>
          </div>
        </div>
      </section>

      {/* Footer OM */}
      <div className={styles.footerOm}>
        <span className={styles.divLine} />
        <span className={styles.omGlyph}>ॐ</span>
        <span className={styles.divLine} />
      </div>
    </div>
  );
}
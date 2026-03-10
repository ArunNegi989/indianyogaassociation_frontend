"use client"
import React, { useEffect, useRef, useState } from "react";
import styles from "@/assets/style/yoga-goa-in-india/Goayogapage.module.css";

/* ─── Images (Unsplash / Google) ─── */
const IMG = {
  hero: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1800&q=85",
  beach1: "https://images.unsplash.com/photo-1515940175183-6798529cb860?w=800&q=80",
  beach2: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
  beach3: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
  goa1: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
  schedule: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=700&q=80",
  campus: [
    { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", label: "Private Room" },
    { src: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&q=80", label: "Shared Room" },
    { src: "https://images.unsplash.com/photo-1574482620826-e5e2a3254c4e?w=800&q=80", label: "Swimming Pool" },
    { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", label: "Garden & Campus" },
    { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", label: "Sattvic Meals" },
    { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", label: "Organic Cuisine" },
    { src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80", label: "Community Yoga" },
    { src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80", label: "Sunset Sessions" },
  ],
};

/* ─── Data ─── */
const chakras = [
  { name: "Muladhara", color: "#c0392b", symbol: "◼", meaning: "Root · Stability" },
  { name: "Svadhisthana", color: "#e67e22", symbol: "◉", meaning: "Sacral · Creativity" },
  { name: "Manipura", color: "#f1c40f", symbol: "▲", meaning: "Solar Plexus · Power" },
  { name: "Anahata", color: "#27ae60", symbol: "✦", meaning: "Heart · Love" },
  { name: "Vishuddha", color: "#2980b9", symbol: "◎", meaning: "Throat · Truth" },
  { name: "Ajna", color: "#8e44ad", symbol: "◈", meaning: "Third Eye · Intuition" },
  { name: "Sahasrara", color: "#9b59b6", symbol: "✿", meaning: "Crown · Consciousness" },
];

const corePrograms = [
  { hrs: "100", tag: "Foundation", desc: "A foundational course for beginners or those looking to deepen their personal practice." },
  { hrs: "200", tag: "Standard", desc: "The internationally recognized standard certification to begin your journey as a yoga teacher." },
  { hrs: "300", tag: "Advanced", desc: "An advanced course for 200-hour certified teachers to expand their knowledge and skills." },
  { hrs: "500", tag: "Mastery", desc: "A comprehensive, advanced-level program for those seeking complete mastery in yoga instruction." },
];

const specialPrograms = [
  { title: "200-Hour Yoga TTC with Sound Healing", desc: "Combine foundational yoga teacher training with the therapeutic power of sound healing." },
  { title: "300-Hour Yoga TTC with Sound Healing", desc: "An advanced-level course integrating advanced yoga techniques with immersive sound healing modalities." },
];

const highlights = [
  { num: "01", title: "Ayurvedic Massages", body: "At our center in Goa, we provide ayurvedic massages, known for their detoxification, healing, and relaxing effects on the body. During yoga TTC, you can avail of these facilities for your benefit." },
  { num: "02", title: "Strength & Flexibility", body: "During the yoga TTC, you can notice for yourself that your body's strength and flexibility improve considerably." },
  { num: "03", title: "Deep Meditation", body: "We have designed several meditation practices in the course that soothes your nervous system and helps you relax your mind. The Yoga Nidra sessions (aka yogic sleep) are known for their deep calming effects." },
  { num: "04", title: "Yogic Vegetarian Diet", body: "Throughout your stay at our yoga school, you will be served a delicious yogic vegetarian diet." },
  { num: "05", title: "Experienced Teachers", body: "Our teachers are highly experienced in the realm of yoga, and they will gently guide you in your yogic journey." },
];

const learnings = [
  "Training programs focused on holistic development of your personality — physical, emotional, and spiritual realms.",
  "Daily meditation sessions planned to help manage stress and bring relaxation to the mind.",
  "Asana sessions alongside anatomy and physiology of the human body for deeper understanding.",
  "History, philosophy of yoga, pranayamas (yogic breathing techniques), meditation and Ayurvedic concepts.",
  "The art and science of designing and conducting your own yoga sessions with confidence.",
  "Create asana sequences effortlessly to lead students and guide them on their yogic journey.",
];

const mainFocus = [
  "Yoga Asanas (postures)", "Pranayama (breathing)", "Meditation & Nidra",
  "Yoga Philosophy", "Anatomy & Physiology", "Ayurveda",
  "Mantra Chanting", "Yoga Sutras", "Yogic Psychology",
];

const schedule = [
  { time: "06:30–07:30", activity: "Optional Early Morning Meditation" },
  { time: "07:30–08:30", activity: "Morning Yoga Class" },
  { time: "08:30–09:30", activity: "Breakfast" },
  { time: "09:30–10:30", activity: "Deep Meditation" },
  { time: "10:30–11:30", activity: "Pranayama Workshop" },
  { time: "11:30–12:30", activity: "Anatomy & Physiology Class" },
  { time: "12:30–01:30", activity: "Lunch" },
  { time: "01:30–02:30", activity: "Yogic Psychology Class" },
  { time: "02:30–03:30", activity: "Class on Ayurveda" },
  { time: "03:30–04:30", activity: "Hatha Yoga Class" },
  { time: "04:30–05:30", activity: "Vinyasa Yoga Class" },
  { time: "05:30–06:30", activity: "Yoga Philosophy Class" },
  { time: "06:30–07:30", activity: "Class on Yoga Sutras" },
  { time: "07:30–08:30", activity: "Dinner" },
  { time: "08:30–09:30", activity: "Musical Evening" },
  { time: "09:30–10:30", activity: "Yog Nidra" },
  { time: "10:30 pm", activity: "Lights Out — Good Night" },
];

const pricing200 = [
  { date: "JULY 05–27, 2025", shared: "$849", pvt: "$999" },
  { date: "AUGUST 05–27, 2025", shared: "$849", pvt: "$999" },
  { date: "SEPTEMBER 05–27, 2025", shared: "$849", pvt: "$999" },
  { date: "OCTOBER 05–27, 2025", shared: "$849", pvt: "$999" },
  { date: "NOVEMBER 05–27, 2025", shared: "$899", pvt: "$1099" },
  { date: "DECEMBER 05–27, 2025", shared: "$899", pvt: "$1099" },
  { date: "JANUARY 05–27, 2026", shared: "$899", pvt: "$1099" },
  { date: "FEBRUARY 05–27, 2026", shared: "$899", pvt: "$1099" },
  { date: "MARCH 05–27, 2026", shared: "$899", pvt: "$1099" },
  { date: "APRIL 05–27, 2026", shared: "$899", pvt: "$1099" },
  { date: "MAY 05–27, 2026", shared: "$899", pvt: "$1099" },
  { date: "JUN 05–27, 2026", shared: "$899", pvt: "$1099" },
];

const pricing300 = [
  { date: "JULY 05–30, 2025", shared: "$949", pvt: "$1099" },
  { date: "AUGUST 05–30, 2025", shared: "$949", pvt: "$1099" },
  { date: "SEPTEMBER 05–30, 2025", shared: "$949", pvt: "$1099" },
  { date: "OCTOBER 05–30, 2025", shared: "$949", pvt: "$1099" },
  { date: "NOVEMBER 05–30, 2025", shared: "$999", pvt: "$1199" },
  { date: "DECEMBER 05–30, 2025", shared: "$999", pvt: "$1199" },
  { date: "JANUARY 05–30, 2026", shared: "$999", pvt: "$1199" },
  { date: "FEBRUARY 05–30, 2026", shared: "$999", pvt: "$1199" },
  { date: "MARCH 05–30, 2026", shared: "$999", pvt: "$1199" },
  { date: "APRIL 05–30, 2026", shared: "$999", pvt: "$1199" },
  { date: "MAY 05–30, 2026", shared: "$999", pvt: "$1199" },
  { date: "JUN 05–30, 2026", shared: "$999", pvt: "$1199" },
];

const pricing500 = [
  { date: "05 JUNE–30 JULY, 2025", shared: "$1799", pvt: "$2099" },
  { date: "05 JULY–30 AUG, 2025", shared: "$1799", pvt: "$2099" },
  { date: "05 AUG–30 SEP, 2025", shared: "$1799", pvt: "$2099" },
  { date: "05 SEP–30 OCT, 2025", shared: "$1799", pvt: "$2099" },
  { date: "05 OCT–30 NOV, 2025", shared: "$1799", pvt: "$2099" },
  { date: "05 NOV–30 DEC, 2025", shared: "$1899", pvt: "$2199" },
  { date: "05 DEC–30 JAN, 2026", shared: "$1899", pvt: "$2199" },
  { date: "05 JAN–02 MAR, 2026", shared: "$1899", pvt: "$2199" },
  { date: "05 FEB–30 MAR, 2026", shared: "$1899", pvt: "$2199" },
  { date: "05 MAR–30 APR, 2026", shared: "$1899", pvt: "$2199" },
  { date: "05 APR–30 MAY, 2026", shared: "$1899", pvt: "$2199" },
  { date: "05 MAY–30 JUNE, 2026", shared: "$1899", pvt: "$2199" },
];

/* ════════════════ MAIN COMPONENT ════════════════ */
export default function GoaYogaPage() {
  const [activeTab, setActiveTab] = useState<"200" | "300" | "500">("200");
  const [modal, setModal] = useState<{ src: string; label: string } | null>(null);
  const [chakraHover, setChakraHover] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add(styles.visible); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(`.${styles.reveal}`).forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Close modal on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const pricingData = activeTab === "200" ? pricing200 : activeTab === "300" ? pricing300 : pricing500;
  const pricingLabel = activeTab === "200" ? "200 Hour Yoga TTC in GOA — 2025 & 2026"
    : activeTab === "300" ? "300 Hour Yoga TTC in GOA — 2025 & 2026"
    : "500 Hour Yoga Teacher Training in Goa 2025 & 2026";
  const bookLabel = activeTab === "500" ? "Reserve Your Spot" : "Book Your Spot";

  return (
    <div className={styles.page}>

      {/* ══ Fixed mandala watermark ══ */}
      <div className={styles.pageWatermark} aria-hidden="true">
        <MandalaFull size={700} opacity={0.03} />
      </div>

      {/* ════════ HERO ════════ */}
      <section className={styles.hero}>
        <img src={IMG.hero} alt="Yoga on Goa Beach" className={styles.heroBg} />
        <div className={styles.heroVeil} />

        {/* Floating chakra spine */}
        <div className={styles.chakraSpine} aria-label="7 chakras">
          {chakras.map((c, i) => (
            <button key={c.name} className={styles.chakraDot}
              style={{ "--cc": c.color } as React.CSSProperties}
              onMouseEnter={() => setChakraHover(i)}
              onMouseLeave={() => setChakraHover(null)}>
              <span className={styles.chakraSym}>{c.symbol}</span>
              {chakraHover === i && (
                <span className={styles.chakraTip}>
                  <strong>{c.name}</strong><br /><small>{c.meaning}</small>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mandala ring hero */}
        <div className={styles.heroMandalaLeft} aria-hidden="true">
          <MandalaRing size={380} opacity={0.13} />
        </div>
        <div className={styles.heroMandalaRight} aria-hidden="true">
          <MandalaRing size={260} opacity={0.08} />
        </div>

        <div className={styles.heroContent}>
          <p className={styles.heroPre}>AYM Yoga School · Arambol, Goa</p>
          <h1 className={styles.heroTitle}>
            Yoga Teacher<br />
            <em>Training in Goa</em>
          </h1>
          <OmDivider />
          <p className={styles.heroSub}>
            100 · 200 · 300 · 500 Hour · Yoga Alliance Certified
          </p>
          <div className={styles.heroBtns}>
            <a href="#programs" className={styles.btnPrimary}>Explore Programs</a>
            <a href="#apply" className={styles.btnOutline}>Apply Now</a>
          </div>
          {/* Stats */}
          <div className={styles.heroStats}>
            {[["500+", "Graduates"], ["20+", "Years Teaching"], ["4", "Programs"], ["Arambol", "Beach Location"]].map(([v, l]) => (
              <div key={l} className={styles.heroStat}>
                <span className={styles.heroStatVal}>{v}</span>
                <span className={styles.heroStatLbl}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ INTRO ════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.introGrid}`}>
            <div className={styles.introText}>
              <span className={styles.superLabel}>Why Goa?</span>
              <h2 className={styles.sectionTitle}>Yoga Teacher Training<br />in Goa</h2>
              <OmDivider align="left" />
              <p className={styles.para}>
                Have you considered attending a yoga teacher training in Goa? Goa is a popular destination for yoga enthusiasts,
                offering a variety of yoga teacher training programs. Goa is the second-largest yoga hub in India, with the most
                yoga training schools. With its beautiful beaches, serene atmosphere, and experienced teachers, Goa is the perfect
                place to deepen your yoga practice and become a certified yoga teacher.
              </p>
              <p className={styles.para}>
                Our AYM yoga school in Goa is located at <strong>Arambol</strong> — one of the favorite tourist destinations for
                many across the globe. Known for its cleanliness and greenery. Imagine practicing yoga at this amazing location —
                it will definitely be a transformative experience. And who doesn't want to enjoy the tranquil sunsets at the
                pristine beaches of Goa?
              </p>
              <p className={styles.paraSmall}>
                The best time to join is <strong>October to April</strong>. For lower fees, April to October is a good option as
                most schools offer discounts during the off-season.
              </p>
            </div>
            <div className={styles.introImages}>
              <div className={styles.imageStack}>
                <div className={styles.imgMain}>
                  <img src={IMG.beach1} alt="Yoga on Goa beach at sunset" />
                </div>
                <div className={styles.imgAccent}>
                  <img src={IMG.beach2} alt="Group yoga session" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PROGRAMS ════════ */}
      <section id="programs" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.mandalaBg} aria-hidden="true">
          <MandalaRing size={600} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Courses</span>
            <h2 className={styles.sectionTitle}>Our Certified Yoga Teacher<br />Training Programs in Goa</h2>
            <OmDivider />
            <p className={styles.paraCenter}>
              AYM has a yoga school in Goa, India. Here, we offer yoga instructor training courses and a range of health and wellness-related courses.
            </p>
          </div>

          {/* Core Programs */}
          <div className={`${styles.reveal}`}>
            <h3 className={styles.subHeading}>Core Yoga Teacher Training Programs</h3>
            <div className={styles.programsGrid}>
              {corePrograms.map((p) => (
                <div key={p.hrs} className={styles.programCard}>
                  <div className={styles.programHrs}>{p.hrs}<span>HR</span></div>
                  <div className={styles.programTag}>{p.tag}</div>
                  <h4 className={styles.programTitle}>{p.hrs}-Hour Yoga Teacher Training in Goa</h4>
                  <p className={styles.programDesc}>{p.desc}</p>
                  <a href="#pricing" className={styles.programLink}>View Dates & Fees →</a>
                </div>
              ))}
            </div>
          </div>

          {/* Specialized */}
          <div className={`${styles.reveal} ${styles.specialWrap}`}>
            <h3 className={styles.subHeading}>Specialized Programs: Yoga & Sound Healing</h3>
            <div className={styles.specialGrid}>
              {specialPrograms.map((p) => (
                <div key={p.title} className={styles.specialCard}>
                  <span className={styles.specialIcon}>🎵</span>
                  <h4 className={styles.specialTitle}>{p.title}</h4>
                  <p className={styles.specialDesc}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arambol description + 3 beach photos */}
          <div className={`${styles.reveal} ${styles.arambolBox}`}>
            <p className={styles.paraCenter}>
              AYM Yoga School in Goa is located at Arambol. Arambol Beach is a beautiful and serene destination located in Goa, India. It is known for its cleanliness, greenery, and tranquil atmosphere. The beach is a popular spot for yoga enthusiasts, offering a perfect setting for yoga practice. With its pristine waters, soft sand, and breathtaking sunsets, Arambol Beach is a must-visit destination for anyone looking to experience the beauty of Goa.
            </p>
            <div className={styles.beachPhotoRow}>
              {[IMG.beach1, IMG.beach2, IMG.goa1].map((src, i) => (
                <div key={i} className={styles.beachPhoto}>
                  <img src={src} alt={`Arambol beach yoga ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ HIGHLIGHTS ════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Experience</span>
            <h2 className={styles.sectionTitle}>Key Highlights of Our Yoga<br />Teachers' Training Program in Goa</h2>
            <OmDivider />
            <p className={styles.paraCenter}>
              While designing our <strong>yoga teacher training course in Goa</strong>, we have consciously added various fun activities to the program.
            </p>
          </div>
          <div className={`${styles.reveal} ${styles.highlightsGrid}`}>
            {highlights.map((h) => (
              <div key={h.num} className={styles.highlightCard}>
                <div className={styles.highlightNum}>{h.num}</div>
                <div className={styles.highlightBody}>
                  <h4 className={styles.highlightTitle}>{h.title}</h4>
                  <p className={styles.highlightText}>{h.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Best time */}
          <div className={`${styles.reveal} ${styles.bestTimeBox}`}>
            <h3 className={styles.subHeading}>When is the best time to attend the yoga teachers' training course in Goa?</h3>
            <OmDivider align="left" />
            <p className={styles.para}>
              From <strong>December to February</strong>, the weather is pleasant and quite conducive for taking sun baths on the beaches here. Many foreign students prefer this time of the year, as they plan their yoga TTC as well as a vacation in Goa together in one go. (As mostly it's winter time for many Western countries)
            </p>
          </div>
        </div>
      </section>

      {/* ════════ WHAT YOU LEARN ════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.mandalaBg} style={{ right: "-80px", left: "auto" }} aria-hidden="true">
          <MandalaRing size={500} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Curriculum</span>
            <h2 className={styles.sectionTitle}>What will you learn from our<br />yoga teachers' training course?</h2>
            <OmDivider />
          </div>
          <div className={`${styles.reveal} ${styles.learnGrid}`}>
            {learnings.map((l, i) => (
              <div key={i} className={styles.learnItem}>
                <span className={styles.learnNum}>{String(i + 1).padStart(2, "0")}</span>
                <p>{l}</p>
              </div>
            ))}
          </div>

          {/* Main Focus */}
          <div className={`${styles.reveal} ${styles.focusSection}`}>
            <h3 className={styles.subHeading}>Main Focus on Yoga Teacher Training in Goa</h3>
            <OmDivider align="left" />
            <p className={styles.para}>
              The syllabus will be same as taught in Rishikesh. Highly experienced yoga and meditation teachers will be hired in Goa to teach students. Guest teachers will also be invited from Rishikesh to deliver specific lectures. The main focus of the certified yoga instructor course will be on:
            </p>
            <div className={styles.focusChips}>
              {mainFocus.map((f) => (
                <span key={f} className={styles.focusChip}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ CHAKRAS SECTION ════════ */}
      <section className={`${styles.section} ${styles.chakraSection}`}>
        <div className={styles.chakraMandala} aria-hidden="true"><MandalaFull size={550} opacity={0.07} /></div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Sacred Energy</span>
            <h2 className={styles.sectionTitle}>Seven Chakras of the Body</h2>
            <OmDivider />
            <p className={styles.paraCenter}>Understanding and balancing the 7 chakras is at the heart of our yoga philosophy curriculum.</p>
          </div>
          <div className={`${styles.reveal} ${styles.chakraCardsGrid}`}>
            {chakras.map((c) => (
              <div key={c.name} className={styles.chakraCard} style={{ "--cc": c.color } as React.CSSProperties}>
                <div className={styles.chakraCardTop} />
                <div className={styles.chakraGlyph}>{c.symbol}</div>
                <h4 className={styles.chakraCardName}>{c.name}</h4>
                <p className={styles.chakraCardMeaning}>{c.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SCHEDULE ════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Daily Routine</span>
            <h2 className={styles.sectionTitle}>Daily Schedule for<br />200-Hour Yoga Course</h2>
            <OmDivider />
          </div>
          <div className={`${styles.reveal} ${styles.scheduleGrid}`}>
            <div className={styles.scheduleImage}>
              <img src={IMG.schedule} alt="Yoga by the river Goa" />
              <div className={styles.scheduleImageOverlay} />
            </div>
            <div className={styles.scheduleTable}>
              <div className={styles.scheduleHeader}>Daily Schedule for 200-hour yoga course</div>
              {schedule.map((s, i) => (
                <div key={i} className={`${styles.scheduleRow} ${i % 2 === 0 ? styles.scheduleRowAlt : ""}`}>
                  <span className={styles.scheduleTime}>{s.time}</span>
                  <span className={styles.scheduleActivity}>{s.activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PRICING ════════ */}
      <section id="pricing" className={styles.section}>
        <div className={styles.mandalaBg} style={{ right: "auto", left: "-100px" }} aria-hidden="true">
          <MandalaRing size={500} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Investment</span>
            <h2 className={styles.sectionTitle}>Course Fees & Dates</h2>
            <OmDivider />
          </div>
          {/* Tabs */}
          <div className={`${styles.reveal} ${styles.pricingTabs}`}>
            {(["200", "300", "500"] as const).map((t) => (
              <button key={t} className={`${styles.tab} ${activeTab === t ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(t)}>{t}-Hour</button>
            ))}
          </div>
          <div className={`${styles.reveal} ${styles.tableWrapper}`}>
            <h3 className={styles.tableTitle}>{pricingLabel}</h3>
            <div className={styles.tableScroll}>
              <table className={styles.pricingTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Price: Shared Accom.</th>
                    <th>Price: Private Accom</th>
                    <th>Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.date}</td>
                      <td className={styles.priceCell}>
                        <span className={styles.oldPrice}>{activeTab === "200" ? "$1199" : activeTab === "300" ? "$1799" : "$3199"}</span>
                        {" "}<strong>{row.shared}</strong>
                      </td>
                      <td className={styles.priceCell}>
                        <span className={styles.oldPrice}>{activeTab === "200" ? "$1499" : activeTab === "300" ? "$1899" : "$3299"}</span>
                        {" "}<strong>{row.pvt}</strong>
                      </td>
                      <td><span className={styles.available}>Available</span></td>
                    </tr>
                  ))}
                  <tr className={styles.bookRow}>
                    <td><strong>{bookLabel}</strong></td>
                    <td colSpan={2} className={styles.bookMid}>Register your spot – Pay advance fee ($110)</td>
                    <td><a href="#apply" className={styles.btnPrimary} style={{ fontSize: "0.72rem", padding: "0.55rem 1.2rem" }}>💳 Payments Page</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ CAMPUS GALLERY ════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>Our Home</span>
            <h2 className={styles.sectionTitle}>AYM Yoga School Goa<br />— Campus</h2>
            <OmDivider />
          </div>
          <div className={`${styles.reveal} ${styles.campusGrid}`}>
            {IMG.campus.map((img, i) => (
              <button key={i} className={styles.campusCard}
                onClick={() => setModal(img)}
                aria-label={`View ${img.label}`}>
                <img src={img.src} alt={img.label} />
                <div className={styles.campusOverlay}>
                  <span className={styles.campusLabel}>{img.label}</span>
                  <span className={styles.campusZoom}>⊕ View</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ADDRESS + HOW TO APPLY ════════ */}
      <section id="apply" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.infoGrid}`}>
            {/* Address */}
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📍</span>
              <h3 className={styles.infoTitle}>Address</h3>
              <OmDivider align="left" />
              <address className={styles.address}>
                <strong>AYM Yoga School</strong><br />
                Behind Lavish Restaurant<br />
                H.No. 621, Madhalawada, Arambol<br />
                Pernem, North Goa, 403512<br /><br />
                <a href="tel:+919528023388">+91-9528023388</a><br />
                <a href="tel:+917500277709">+91-7500277709</a>
              </address>
            </div>

            {/* How to reach */}
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>✈️</span>
              <h3 className={styles.infoTitle}>How to reach Arambol Beach, Goa</h3>
              <OmDivider align="left" />
              <p className={styles.para}>
                <strong>Via Air:</strong> The international airport in Goa is at Dabolim. It is 29 kilometers away from Panaji (Panaji is the capital city of Goa). From there you could reach Arambol, either by cab or by local bus. (Landmark - Love Temples Cottage).
              </p>
            </div>

            {/* How to Apply */}
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📝</span>
              <h3 className={styles.infoTitle}>How to Apply</h3>
              <OmDivider align="left" />
              <p className={styles.para}>
                Send us the following information through email at <a href="mailto:aymyogaschool@gmail.com" className={styles.emailLink}>aymyogaschool@gmail.com</a>. AYM Yoga School team will respond to you as soon as possible. Then you can deposit $310 US to confirm your seat.
              </p>
              <div className={styles.formFields}>
                {["Full Name", "Address", "Email", "Phone No", "Date of Birth", "Country", "Date of Joining", "Course Applied (200/100hr)"].map(f => (
                  <span key={f} className={styles.formField}>· {f}</span>
                ))}
              </div>
            </div>

            {/* Refund */}
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>🔄</span>
              <h3 className={styles.infoTitle}>Refund Rules</h3>
              <OmDivider align="left" />
              <p className={styles.para}>
                Please note that there won't be any refund, in case you are not able to come for the course due to any reason. However, you can attend in another batch as per your choice, as per available dates within one year.
              </p>
              <a href="#" className={styles.rulesLink}>Rules and Regulations at AYM →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER CTA ════════ */}
      <section className={styles.footerCta}>
        <div className={styles.footerMandala} aria-hidden="true">
          <MandalaFull size={500} opacity={0.1} />
        </div>
        <div className={styles.container}>
          <div className={styles.footerCtaInner}>
            <div className={styles.footerOm}>ॐ</div>
            <h2 className={styles.footerTitle}>Begin Your Sacred Journey in Goa</h2>
            <p className={styles.footerSub}>Join thousands of students who have transformed their lives at AYM Yoga School on the pristine beaches of Arambol</p>
            <div className={styles.heroBtns}>
              <a href="#pricing" className={styles.btnPrimary}>View Dates & Fees</a>
              <a href="mailto:aymyogaschool@gmail.com" className={styles.btnOutline}>Email Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MODAL ════════ */}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)} role="dialog" aria-modal="true">
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(null)} aria-label="Close">✕</button>
            <div className={styles.modalMandala} aria-hidden="true"><MandalaRing size={200} opacity={0.12} /></div>
            <img src={modal.src} alt={modal.label} className={styles.modalImg} />
            <div className={styles.modalCaption}>
              <OmDivider />
              <p>{modal.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SHARED SUB-COMPONENTS ─── */

function OmDivider({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <div className={styles.omDivider} style={{ justifyContent: align === "left" ? "flex-start" : "center" }}>
      <span className={styles.omLine} />
      <span className={styles.omGlyph}>ॐ</span>
      <span className={styles.omLine} />
    </div>
  );
}

function MandalaRing({ size = 300, opacity = 0.08 }: { size?: number; opacity?: number }) {
  const c = size / 2;
  const rings = [0.46, 0.36, 0.26, 0.14].map((r) => r * size);
  const spokes = 24;
  const petals = 12;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }} aria-hidden>
      <g stroke="#c46a00" strokeWidth="0.7" fill="none">
        {rings.map((r, i) => <circle key={i} cx={c} cy={c} r={r} />)}
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * 2 * Math.PI;
          return <line key={i}
            x1={c + rings[2] * Math.cos(a)} y1={c + rings[2] * Math.sin(a)}
            x2={c + rings[0] * Math.cos(a)} y2={c + rings[0] * Math.sin(a)} />;
        })}
        {Array.from({ length: petals }).map((_, i) => {
          const a = (i / petals) * 2 * Math.PI;
          const r = rings[1];
          return <ellipse key={i}
            cx={c + r * Math.cos(a)} cy={c + r * Math.sin(a)}
            rx={size * 0.07} ry={size * 0.025}
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
      <g stroke="#c46a00" strokeWidth="0.6" fill="none" transform={`translate(${c},${c})`}>
        {[0.46, 0.38, 0.3, 0.22, 0.14, 0.07].map((r, i) => (
          <circle key={i} cx={0} cy={0} r={r * size} />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          const r0 = size * 0.07, r1 = size * 0.46;
          return <line key={i} x1={r0 * Math.cos(a)} y1={r0 * Math.sin(a)} x2={r1 * Math.cos(a)} y2={r1 * Math.sin(a)} />;
        })}
        {[8, 16].map((n, ni) => Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * 2 * Math.PI;
          const r = size * (ni === 0 ? 0.32 : 0.2);
          return <ellipse key={`${ni}-${i}`} cx={r * Math.cos(a)} cy={r * Math.sin(a)}
            rx={size * (ni === 0 ? 0.065 : 0.04)} ry={size * 0.02}
            transform={`rotate(${(i / n) * 360} ${r * Math.cos(a)} ${r * Math.sin(a)})`} />;
        }))}
      </g>
    </svg>
  );
}
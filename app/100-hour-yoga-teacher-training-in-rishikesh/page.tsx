"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/assets/style/100-hour-yoga-teacher-training-in-rishikesh/Hundredhouryoga.module.css";

/* ══════════════════════════════════════════════════
   MANDALA SVG — 7-layer concentric chakra wheel
══════════════════════════════════════════════════ */
function MandalaSVG({ size = 400, opacity = 0.13 }: { size?: number; opacity?: number }) {
  const cx = 100, cy = 100;
  const petals12 = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);
  const petals8  = Array.from({ length: 8  }, (_, i) => (i * 45 * Math.PI) / 180);
  const petals6  = Array.from({ length: 6  }, (_, i) => (i * 60 * Math.PI) / 180);

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, opacity }}
    >
      {/* Outer rings */}
      {[95, 88, 80, 72, 60, 45, 30, 16].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} stroke="#8b4513" strokeWidth={i % 2 === 0 ? 0.7 : 0.3} fill="none" />
      ))}

      {/* 12-petal lotus outer */}
      {petals12.map((a, i) => {
        const x1 = cx + 60 * Math.cos(a), y1 = cy + 60 * Math.sin(a);
        const x2 = cx + 88 * Math.cos(a), y2 = cy + 88 * Math.sin(a);
        const lx = cx + 74 * Math.cos(a + 0.18), ly = cy + 74 * Math.sin(a + 0.18);
        const rx = cx + 74 * Math.cos(a - 0.18), ry = cy + 74 * Math.sin(a - 0.18);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b4513" strokeWidth="0.5" />
            <path d={`M ${x1} ${y1} Q ${lx} ${ly} ${x2} ${y2} Q ${rx} ${ry} ${x1} ${y1}`}
              stroke="#8b4513" strokeWidth="0.4" fill="rgba(139,69,19,0.04)" />
          </g>
        );
      })}

      {/* 8-petal lotus middle */}
      {petals8.map((a, i) => {
        const x1 = cx + 45 * Math.cos(a), y1 = cy + 45 * Math.sin(a);
        const x2 = cx + 60 * Math.cos(a), y2 = cy + 60 * Math.sin(a);
        const lx = cx + 52 * Math.cos(a + 0.25), ly = cy + 52 * Math.sin(a + 0.25);
        const rx = cx + 52 * Math.cos(a - 0.25), ry = cy + 52 * Math.sin(a - 0.25);
        return (
          <g key={i}>
            <path d={`M ${x1} ${y1} Q ${lx} ${ly} ${x2} ${y2} Q ${rx} ${ry} ${x1} ${y1}`}
              stroke="#b8860b" strokeWidth="0.5" fill="rgba(184,134,11,0.05)" />
          </g>
        );
      })}

      {/* Star of David / hexagram inner */}
      {petals6.map((a, i) => {
        const opp = a + Math.PI;
        return (
          <line key={i}
            x1={cx + 30 * Math.cos(a)}  y1={cy + 30 * Math.sin(a)}
            x2={cx + 30 * Math.cos(opp)} y2={cy + 30 * Math.sin(opp)}
            stroke="#8b4513" strokeWidth="0.6"
          />
        );
      })}

      {/* Dot ring */}
      {petals12.map((a, i) => (
        <circle key={i} cx={cx + 80 * Math.cos(a)} cy={cy + 80 * Math.sin(a)}
          r="1.8" fill="#8b4513" opacity="0.6" />
      ))}
      {petals8.map((a, i) => (
        <circle key={i} cx={cx + 45 * Math.cos(a)} cy={cy + 45 * Math.sin(a)}
          r="1.4" fill="#b8860b" opacity="0.5" />
      ))}

      {/* Triangles pointing inward */}
      {petals8.map((a, i) => {
        const r1 = 16, r2 = 28;
        const x0 = cx + r1 * Math.cos(a), y0 = cy + r1 * Math.sin(a);
        const xl = cx + r2 * Math.cos(a + 0.45), yl = cy + r2 * Math.sin(a + 0.45);
        const xr = cx + r2 * Math.cos(a - 0.45), yr = cy + r2 * Math.sin(a - 0.45);
        return <polygon key={i} points={`${x0},${y0} ${xl},${yl} ${xr},${yr}`}
          stroke="#b8860b" strokeWidth="0.4" fill="rgba(184,134,11,0.04)" />;
      })}

      {/* Centre Om placeholder circles */}
      <circle cx={cx} cy={cy} r="12" stroke="#8b4513" strokeWidth="0.8" fill="rgba(139,69,19,0.06)" />
      <circle cx={cx} cy={cy} r="5"  stroke="#8b4513" strokeWidth="0.6" fill="rgba(139,69,19,0.1)" />
      <circle cx={cx} cy={cy} r="2"  fill="#8b4513" opacity="0.5" />

      {/* Corner flourish tick marks every 15° */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const inner = i % 2 === 0 ? 91 : 93;
        return (
          <line key={i}
            x1={cx + inner * Math.cos(a)} y1={cy + inner * Math.sin(a)}
            x2={cx + 95 * Math.cos(a)}   y2={cy + 95 * Math.sin(a)}
            stroke="#8b4513" strokeWidth="0.5"
          />
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════
   DECORATIVE BORDER STRIP
══════════════════════════════ */
function BorderStrip() {
  return (
    <div className={styles.borderStrip}>
      <svg viewBox="0 0 800 14" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className={styles.borderSvg}>
        {/* repeating diamond chain */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = i * 20 + 10;
          return (
            <g key={i}>
              <polygon points={`${x},7 ${x+6},2 ${x+12},7 ${x+6},12`}
                fill="none" stroke="#b8860b" strokeWidth="0.8" />
              <circle cx={x + 6} cy={7} r="1.2" fill="#b8860b" opacity="0.7" />
            </g>
          );
        })}
        <line x1="0" y1="7" x2="800" y2="7" stroke="#e07b00" strokeWidth="0.3" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════
   OM SECTION DIVIDER
══════════════════════════════ */
function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.omDivider}>
      <div className={styles.divLineLeft} />
      <div className={styles.omDividerCenter}>
        <MandalaSVG size={52} opacity={0.55} />
        {label && <span className={styles.omDividerLabel}>{label}</span>}
      </div>
      <div className={styles.divLineRight} />
    </div>
  );
}

/* ══════════════════════════════
   VINTAGE CORNER ORNAMENT
══════════════════════════════ */
function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];
  return (
    <svg viewBox="0 0 40 40" className={styles.cornerOrn} style={{ transform: flip }}>
      <path d="M2,2 L2,18 M2,2 L18,2" stroke="#b8860b" strokeWidth="1.5" fill="none" />
      <path d="M2,2 Q8,8 16,2 Q8,8 2,16" stroke="#b8860b" strokeWidth="0.7" fill="none" />
      <circle cx="2" cy="2" r="2" fill="#b8860b" opacity="0.7" />
      <circle cx="10" cy="10" r="1.5" fill="#b8860b" opacity="0.4" />
    </svg>
  );
}

/* ══════════════════════════════
   DATA
══════════════════════════════ */
const upcomingDates = [
  { date: "05th Jan – 16th Jan 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Feb – 14th Feb 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Mar – 14th Mar 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Apr – 14th Apr 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd May – 14th May 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Jun – 14th Jun 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Jul – 14th Jul 2026",  usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Aug – 14th Aug 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Sep – 14th Sep 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Oct – 14th Oct 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Nov – 14th Nov 2026", usd: "550 USD", inr: "22,500 INR" },
  { date: "03rd Dec – 14th Dec 2026", usd: "550 USD", inr: "22,500 INR" },
];

const scheduleItems = [
  { text: "07:00 Am - 08:00 Am – Pranayama and Meditation.", link: "Meditation." },
  { text: "08:00 Am - 08:30 Am – Tea." },
  { text: "08.30 Am – 10:00 Am – Ashtanga Vinyasa", link: "Ashtanga Vinyasa" },
  { text: "10:00 Am - 10.45 Am – Brunch" },
  { text: "11.00 Am - 12.00 Pm – PhilosophyTeaching practice" },
  { text: "12.15 Pm - 01.15 Pm – Teaching practice" },
  { text: "01:00 Pm - 02:00 Pm – Refreshment" },
  { text: "02:00 Pm - 03:00 Pm – Self-Study ( Free Time )" },
  { text: "03:00 Pm - 04:00 Pm – Anatomy" },
  { text: "04.15 Pm - 05.45 Pm – Hatha Yoga", link: "Hatha Yoga" },
  { text: "07.30 Pm – 08.00 Pm – Dinner" },
  { text: "10.00 Pm – Light off" },
];

const included    = ["14 Days Accommodation and 3 Meals / Day","Course Metrial","1 T-Shirt, 1 Beg","ShatKarma Kit","Free WiFi"];
const notIncluded = ["Air Ticket and Airport Pickup","Visa","Toilet Paper - One Time","Personal Things","Massage"];

const sylLeft = [
  { title: "Practice of Yoga Techniques", desc: "Practice Yoga techniques like asana ( Hatha Yoga and Ashtanga Yoga ), breathing exercises, meditation techniques, and detoxification." },
  { title: "Yoga philosophy", desc: "This module includes topics on yoga philosophy, lifestyle, and ethics for yoga teachers as per the Yoga Alliance syllabus for yoga training. It includes what yoga is and different forms of yoga." },
  { title: "Teaching Methodology", desc: "This section includes the principles of demonstration of yoga techniques. Here, you will learn the art of assisting, correcting, and observing different variations during teaching. You will also learn the art of giving instruction and the qualities of a good yoga teacher." },
];
const sylRight = [
  { title: "Practicum", desc: "If you want to build your career as a yoga teacher, this section will help you. You will learn the art of teaching practice, receiving and giving feedback in front of your teacher." },
  { title: "Assignments", desc: "It includes Writing answers to the given questions, group discussions, and exams on knowledge of content taught in different classes." },
  { title: "Anatomy and Physiology", desc: "Applied Anatomy and Physiology in Connection with Yoga: Human physical anatomy and physiology are very important in understanding the scientific aspect of yoga. This section includes various systems, such as the digestive, endocrine, and muscular systems, and their practical application to yoga.." },
];

/* ══════════════════════════════
   PAGE COMPONENT
══════════════════════════════ */
export default function HundredHourYoga() {
  return (
    <div className={styles.root}>

      {/* ── Fixed mandala watermarks ── */}
      <div className={styles.mandalaFixed} aria-hidden="true">
        <div className={styles.mf1}><MandalaSVG size={700} opacity={0.055} /></div>
        <div className={styles.mf2}><MandalaSVG size={520} opacity={0.045} /></div>
        <div className={styles.mf3}><MandalaSVG size={400} opacity={0.04}  /></div>
        <div className={styles.mf4}><MandalaSVG size={300} opacity={0.035} /></div>
      </div>

      {/* ── Aged paper grain overlay ── */}
      <div className={styles.grainOverlay} aria-hidden="true" />

      {/* ══════════════════════════════
          TOP BORDER
      ══════════════════════════════ */}
      <BorderStrip />

      {/* ══════════════════════════════
          SCREENSHOT 1 — Hero + Intro
      ══════════════════════════════ */}
      <section className={styles.heroSection}>
        {/* Mandala behind hero */}
        <div className={styles.heroMandalaBg} aria-hidden="true">
          <MandalaSVG size={900} opacity={0.06} />
        </div>

        {/* Photo frame */}
        <div className={styles.heroFrame}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <a href="#apply" className={styles.registerBtn}>Register Now</a>
          {/* ↓ Replace with: <Image src="/images/group-photo.jpg" fill alt="AYM students" style={{objectFit:'cover'}} /> */}
          <div className={styles.heroImgPlaceholder}>
            <MandalaSVG size={260} opacity={0.18} />
          </div>
        </div>

        {/* Title below photo */}
        <div className={styles.heroTextWrap}>
          <div className={styles.heroTitleRow}>
            <div className={styles.heroTitleLine} />
            <h1 className={styles.heroTitle}>100 Hour Yoga Teacher Training Course in Rishikesh India</h1>
            <div className={styles.heroTitleLine} />
          </div>
          <p className={styles.bodyText}>
            100 Hour Yoga Teacher Training in Rishikesh, India, at Aym Yoga School, has gained immense popularity worldwide for its holistic benefits to mind, body, and spirit. Many people are seeking these benefits, which is why teacher training programs have become increasingly popular. Among these, the 100-hour yoga teacher training (YTT) stands out as an introductory yet transformative course for dedicated practitioners worldwide. Our yoga school is a leading yoga institution that explores the structure, significance, and impact of the 100-hour YTT.
          </p>
        </div>
      </section>

      <BorderStrip />

      {/* ══════════════════════════════
          SCREENSHOT 2
      ══════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true"><MandalaSVG size={320} opacity={0.07} /></div>
        <div className={styles.sectionMandalaR} aria-hidden="true"><MandalaSVG size={260} opacity={0.06} /></div>

        <VintageHeading>Transform Your Practice with a 100 Hour Yoga Course in Rishikesh</VintageHeading>
        <p className={styles.bodyText}>We at Aym Yoga School Transform Your Yoga Practice through authentic, traditional asana classes taught by experienced teachers who connect with you through nurturing energy. The connection with the teacher is such that if you are not able to come to class, you will miss their love and energy during the day. Our philosophy classes bring transformation in the present-day-to-day lives, as philosophy induces calmness in the thought waves by reducing stress.</p>
        <p className={styles.bodyText}>Pranayma classes focus on breath patterns and bring about transformation by removing defective breathing patterns. We usually have rapid or shallow breathing due to stress and tension, but the practice of pranayama helps keep breathing healthy.</p>

        <OmDivider />

        <VintageHeading>What is a 100 Hour Yoga Teacher Training?</VintageHeading>
        <p className={styles.bodyText}>A 100-hour YTT program is typically designed as a foundational course suitable for beginners or those starting their yoga journey. Unlike intensive certifications, the 100-hour course offers a manageable time and energy commitment, often completed over a few weeks.</p>

        <OmDivider />

        <VintageHeading>Why Choose AYM Yoga School for Your 100 Hour Yoga TTC</VintageHeading>
        <p className={styles.bodyText}>When considering where to begin your yoga learning, the choice of school is crucial. AYM Yoga School stands out as a leading institution for its 100 Hour Yoga Teacher Training Course, featuring experienced instructors, a comprehensive curriculum, and a supportive learning environment. AYM combines authentic yogic wisdom with traditional teaching approaches, ensuring students receive original knowledge and practical skills. The school's serene location, emphasis on community, and commitment to student growth make it an ideal setting for deepening your practice and building confidence as a future yoga teacher. Choosing AYM Yoga School means joining a global community to develop holistic well-being and lifelong learning.</p>

        <OmDivider />

        <VintageHeading>100 Hours Yoga TTC is suitable for:</VintageHeading>
        <ol className={styles.vintageList}>
          <li>If you want to understand and study yoga holistically from a solid foundation.</li>
          <li>If you are interested in a short course to find a balance in life through body and mind.</li>
          <li>If you are interested in yoga philosophy, meditation/pranayama and its practices.</li>
          <li>If you are registered with RYT and want to collect a certificate for continuing education training hours.</li>
        </ol>
      </section>

      <BorderStrip />

      {/* ══════════════════════════════
          SCREENSHOT 3 — Dates Table
      ══════════════════════════════ */}
      <section className={styles.datesSection} id="apply">
        <OmDivider label="Upcoming Batches" />
        <VintageHeading>Upcoming 100 Hour Yoga Teacher Training India - 2025</VintageHeading>

        <div className={styles.tableContainer}>
          {/* Corner ornaments on table */}
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <div className={styles.tableScroll}>
            <table className={styles.datesTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>FEE</th>
                  <th>FEE ( Indian )</th>
                  <th>Apply</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDates.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.usd}</td>
                    <td>{row.inr}</td>
                    <td><a href="#" className={styles.applyLink}>Apply Now</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ══════════════════════════════
          SCREENSHOT 4 — Syllabus
      ══════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true"><MandalaSVG size={280} opacity={0.07} /></div>

        <OmDivider label="Curriculum" />
        <VintageHeading>Syllabus of Premier - 100 Hour Yoga Teacher Training Course in Rishikesh, India</VintageHeading>

        <p className={styles.bodyText}>At AYM, we warmly welcome anyone who sincerely desires to grow besides learning the timeless tradition of this practice. Whether wanting to deepen the personal practice about this course or spreading the knowledge to others, the course offers an opportunity to understand every aspect of it. We at the Association for Yoga and Meditation have a comprehensive syllabus created for beginners as well as seasoned yogis. The <strong>100 hour yoga teacher training course</strong> aims to give students a thorough grasp of yoga and help them equip skills.</p>
        <p className={styles.bodyText}>With a team of skilled and qualified yoga instructors, they impart thorough knowledge about the course. Students can explore a broader range of topics that may help them become true professionals. Some of the topics covered in this course programme are Hatha, Ashtanga, Vinyasa, Iyengar, Pranayama, Meditation, Anatomy and many more. Both theoretical and practical learning are offered to provide a keen understanding of the <strong>100 hour Yoga TTC in India</strong>.</p>
        <p className={styles.bodyText}>Students are offered individualized attention throughout the 100-hour yoga course in Rishikesh so that they can fully immerse in this study while enjoying it at the same time. Additionally, they are instilled with confidence, which may be required to start a career as an instructor. Once the course is completed, students are offered valuable 100-hour yoga teacher training certifications, which they can use anywhere in the world to start their careers.</p>

        <div className={styles.syllabusGrid}>
          <div className={styles.syllabusCard}>
            {sylLeft.map((m, i) => (
              <div key={i} className={styles.syllabusModule}>
                <div className={styles.syllabusModuleIcon}><MandalaSVG size={28} opacity={0.6} /></div>
                <div>
                  <h3 className={styles.syllabusModuleTitle}>{m.title}</h3>
                  <p className={styles.syllabusModuleDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.syllabusCard}>
            {sylRight.map((m, i) => (
              <div key={i} className={styles.syllabusModule}>
                <div className={styles.syllabusModuleIcon}><MandalaSVG size={28} opacity={0.6} /></div>
                <div>
                  <h3 className={styles.syllabusModuleTitle}>{m.title}</h3>
                  <p className={styles.syllabusModuleDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ══════════════════════════════
          SCREENSHOT 5 — Daily Schedule
      ══════════════════════════════ */}
      <section className={styles.scheduleSection}>
        <div className={styles.scheduleLayout}>
          {/* Left ornament image */}
          <div className={styles.schedImgCol}>
            <div className={styles.schedImgOrnament}>
              <div className={styles.schedMandalaBg}><MandalaSVG size={340} opacity={0.25} /></div>
              {/* Replace with <Image src="/images/meditation.jpg" fill ... /> */}
              <div className={styles.schedImgPlaceholder} />
            </div>
          </div>

          {/* Right schedule */}
          <div className={styles.schedBoxCol}>
            <div className={styles.schedBox}>
              {/* Corner ornaments */}
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <div className={styles.schedHeader}>Daily Schedule</div>
              <ul className={styles.schedList}>
                {scheduleItems.map((item, i) => {
                  if (item.link) {
                    const parts = item.text.split(item.link);
                    return (
                      <li key={i} className={styles.schedItem}>
                        <span className={styles.schedDot}><MandalaSVG size={10} opacity={0.8} /></span>
                        <span>{parts[0]}<a href="#" className={styles.schedLink}>{item.link}</a>{parts[1] ?? ""}</span>
                      </li>
                    );
                  }
                  return (
                    <li key={i} className={styles.schedItem}>
                      <span className={styles.schedDot}><MandalaSVG size={10} opacity={0.8} /></span>
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ══════════════════════════════
          SCREENSHOT 6 — Why Enrol
      ══════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaR} aria-hidden="true"><MandalaSVG size={320} opacity={0.07} /></div>

        <OmDivider />
        {/* Class banner */}
        <div className={styles.classBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          {/* Replace with <Image src="/images/yoga-class.jpg" fill alt="Yoga Class" style={{objectFit:'cover'}} /> */}
          <div className={styles.classBannerPlaceholder}>
            <span className={styles.letYourSoul}>Let Your Soul Shine</span>
          </div>
        </div>

        <OmDivider />
        <VintageHeading>Why Enrol in AYM for a 100 hour Yoga Teacher Training Course in Rishikesh?</VintageHeading>
        <p className={styles.bodyText}>As the leading institute of Yoga teacher training, we at AYM have earned a reputation for offering quality learning. With a team of qualified instructors, our yoga teacher training course in Rishikesh focuses on mentoring many aspiring yogis to foster soulful instructors. Some of the other reasons why you must enrol in our institute include:</p>
        <ol className={styles.vintageList}>
          <li>We have a sattvic and spiritual atmosphere where your practice will deepen.</li>
          <li>Students are given Ayurvedic and yogic knowledge at our institute.</li>
          <li>Our <strong>Certified yoga teacher training course in Rishikesh</strong> will help you lead a healthy life while spreading its importance to others.</li>
          <li>At this intensive course, you can be accommodated in comfortable rooms and around like-minded people.</li>
          <li>Students are given access to study materials alongside an opportunity to go on yoga excursions.</li>
          <li>A complete diet is provided to the students to help them achieve a life of well-being.</li>
          <li>Students are given complete attention and support by our qualified instructors so that they can develop into true professionals.</li>
          <li>The instructors are highly qualified and real-time professionals who share their experiences with the students.</li>
        </ol>
      </section>

      <BorderStrip />

      {/* ══════════════════════════════
          SCREENSHOT 7 — Cert + Registration
      ══════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true"><MandalaSVG size={300} opacity={0.065} /></div>

        <OmDivider />
        <VintageHeading>Comprehensive 100 Hour Yoga Teacher Training Course in Rishikesh</VintageHeading>
        <p className={styles.bodyText}>As our students arrive at AYM, we conduct a unique orientation programme. Today, our students are given a warm welcome where they understand that they are a part of us. Be it a 100 hour or 500 hour yoga teacher training course in Rishikesh, India, students are also introduced to the staff, faculty members, and other students.</p>
        <p className={styles.bodyText}>Additionally, students are familiar with the course program and are given a tour of the institute. Once the students settle down, we provide them with the schedule, syllabus, and other details of the 100 Hour, 200 Hour, 300 Hour, and 500-hour yoga teacher training session for a thorough understanding.</p>

        <OmDivider />
        <VintageHeading>100 Hour Yoga Teacher Training Course Certification at AYM</VintageHeading>
        <p className={styles.bodyText}>At AYM, our courses are carried out in 12 days, where students can develop a strong foundation in every aspect of yoga. Students are taught by our instructors how to behave like professionals, carry out classes and spread knowledge to others. After completing the courses, the students are provided with a recognized <strong>100 hour yoga teacher training certification in Rishikesh</strong>, India, which is highly valuable. With this course certificate, one can use it anywhere in the world to teach yoga, including leading institutions.</p>

        <OmDivider />
        <VintageHeading>Registration Process</VintageHeading>
        <p className={styles.bodyText}>Registration or booking process: send us 110 usd ( 100 USD Fee + 10 USD PayPal Charges ) as advance fee to get register in 100 hour yoga course in rishikesh at AYM. The advance fee is non-refundable as per our terms and conditions.</p>

        {/* Included / Not Included */}
        <div className={styles.feeGrid}>
          <div className={styles.feeCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <div className={styles.feeCardHeaderGreen}>Included in Fee</div>
            <ul className={styles.feeList}>
              {included.map(it => (
                <li key={it}>
                  <span className={styles.feeDot}><MandalaSVG size={12} opacity={0.7} /></span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.feeCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <div className={styles.feeCardHeaderRed}>Not Included</div>
            <ul className={styles.feeList}>
              {notIncluded.map(it => (
                <li key={it}>
                  <span className={styles.feeDot}><MandalaSVG size={12} opacity={0.7} /></span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Bottom border ── */}
      <BorderStrip />

      {/* ── Footer mandala stamp ── */}
      <div className={styles.footerStamp}>
        <MandalaSVG size={120} opacity={0.35} />
        <p className={styles.footerStampText}>AYM Yoga School · Rishikesh, India</p>
      </div>

      <BorderStrip />
    </div>
  );
}

/* ── Helper: Vintage section heading ── */
function VintageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.vintageHeadingWrap}>
      <h2 className={styles.vintageHeading}>{children}</h2>
      <div className={styles.vintageHeadingUnderline}>
        <svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" className={styles.headingUndSvg}>
          <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#e07b00" strokeWidth="1.2" fill="none" />
          <circle cx="100" cy="4" r="3" fill="#e07b00" opacity="0.7" />
          <circle cx="10"  cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
          <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
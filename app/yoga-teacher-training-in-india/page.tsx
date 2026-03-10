"use client";

import React from "react";
import styles from "@/assets/style/yoga-teacher-training-in-india/Yogattcindia.module.css";

/* ─── MANDALA SVG ─── */
const MandalaSVG = ({ size = 300, c1 = "#e07b00", c2 = "#d4a017", sw = 0.5 }: {
  size?: number; c1?: string; c2?: string; sw?: number;
}) => (
  <svg viewBox="0 0 300 300" width={size} height={size} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="none" stroke={c1} strokeWidth={sw}>
      {[145,125,106,88,70,52,36,22,10].map((r,i)=><circle key={i} cx="150" cy="150" r={r}/>)}
    </g>
    <g fill="none" stroke={c2} strokeWidth={sw*.65} opacity="0.45">
      {([[150,5,150,295],[5,150,295,150],[47,47,253,253],[253,47,47,253],[10,100,290,200],[10,200,290,100],[100,10,200,290],[200,10,100,290]] as number[][]).map((d,i)=>(
        <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]}/>
      ))}
    </g>
    <g fill="none" stroke={c2} strokeWidth={sw*.5} opacity="0.2">
      <ellipse cx="150" cy="150" rx="145" ry="62"/>
      <ellipse cx="150" cy="150" rx="62" ry="145"/>
      <ellipse cx="150" cy="150" rx="145" ry="95"/>
      <ellipse cx="150" cy="150" rx="95" ry="145"/>
    </g>
    <g fill="none" stroke={c1} strokeWidth={sw*.38} opacity="0.18">
      {[0,30,60,90,120,150].map(deg=>{const r=deg*Math.PI/180; return <line key={deg} x1={150+148*Math.cos(r)} y1={150+148*Math.sin(r)} x2={150-148*Math.cos(r)} y2={150-148*Math.sin(r)}/>;  })}
    </g>
    <g fill="none" stroke={c1} strokeWidth={sw*.4} opacity="0.22">
      {[0,45,90,135,180,225,270,315].map(deg=>{const r=deg*Math.PI/180; const cx=150+60*Math.cos(r),cy=150+60*Math.sin(r); return <ellipse key={deg} cx={cx} cy={cy} rx="18" ry="8" transform={`rotate(${deg},${cx},${cy})`}/>;  })}
    </g>
    <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42"/>
    <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.62"/>
  </svg>
);

/* ─── CHAKRA SVG ─── */
const ChakraSVG = ({ size = 32, color = "#e07b00" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1.2"/>
    <circle cx="50" cy="50" r="32" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6"/>
    <circle cx="50" cy="50" r="18" fill="none" stroke={color} strokeWidth="1" opacity="0.8"/>
    <circle cx="50" cy="50" r="7" fill={color} opacity="0.45"/>
    {[0,45,90,135,180,225,270,315].map(deg=>{const r=deg*Math.PI/180; return <line key={deg} x1={50+20*Math.cos(r)} y1={50+20*Math.sin(r)} x2={50+44*Math.cos(r)} y2={50+44*Math.sin(r)} stroke={color} strokeWidth="1" opacity="0.55"/>;  })}
    <text x="50" y="56" textAnchor="middle" fontSize="20" fill={color} fontFamily="serif" opacity="0.9">ॐ</text>
  </svg>
);

/* ─── OM DIVIDER ─── */
const OmDivider = ({ slim = false }: { slim?: boolean }) => (
  <div className={`${styles.omDiv} ${slim ? styles.omSlim : ""}`}>
    <span className={styles.omLine}/>
    <ChakraSVG size={slim ? 22 : 30} color="#e07b00"/>
    <span className={styles.omLine}/>
  </div>
);

/* ─── ACCREDITATION BADGES ─── */
const AccredBadges = () => (
  <div className={styles.badgesRow}>
    {[
      { label: "Yoga Alliance", sub: "USA" },
      { label: "RYS", sub: "200" },
      { label: "RYS", sub: "300" },
      { label: "RYS", sub: "500" },
      { label: "Ministry of", sub: "AYUSH" },
    ].map((b, i) => (
      <div key={i} className={styles.badge}>
        <span className={styles.badgeTop}>{b.label}</span>
        <span className={styles.badgeSub}>{b.sub}</span>
      </div>
    ))}
  </div>
);

/* ─── QUOTE CARD ─── */
const QuoteCard = ({ quote, img, imgAlt }: { quote: string; img: string; imgAlt: string }) => (
  <div className={styles.quoteImgCard}>
    <img src={img} alt={imgAlt} className={styles.quoteImg} loading="lazy"/>
    <div className={styles.quoteOverlay}>
      <span className={styles.quoteBar}/>
      <p className={styles.quoteCaption}>{quote}</p>
    </div>
  </div>
);

/* ─── COURSE CARD ─── */
const CourseCard = ({ hours, title, desc, linkLabel, href = "#" }: {
  hours: string; title: string; desc: string | React.ReactNode; linkLabel: string; href?: string;
}) => (
  <div className={styles.courseCard}>
    <div className={styles.courseImgWrap}>
      <img
        src={`https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80`}
        alt={title}
        className={styles.courseImg}
        loading="lazy"
      />
      <div className={styles.courseImgOverlay}/>
      <div className={styles.courseHourBadge}>{hours} hr</div>
    </div>
    <div className={styles.courseBody}>
      <h3 className={styles.courseTitle}>{title}</h3>
      <div className={styles.courseLine}/>
      <p className={styles.courseDesc}>{desc}</p>
    </div>
    <a href={href} className={styles.courseBtn}>{linkLabel}</a>
  </div>
);

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function YogaTTCIndia() {
  return (
    <div className={styles.page}>

      {/* Fixed Mandalas */}
      <div className={styles.mandalaTL} aria-hidden="true"><MandalaSVG size={430} c1="#e07b00" c2="#d4a017" sw={0.42}/></div>
      <div className={styles.mandalaBR} aria-hidden="true"><MandalaSVG size={390} c1="#d4a017" c2="#e07b00" sw={0.42}/></div>
      <div className={styles.mandalaTR} aria-hidden="true"><MandalaSVG size={230} c1="#e07b00" c2="#d4a017" sw={0.55}/></div>
      <div className={styles.mandalaBL} aria-hidden="true"><MandalaSVG size={230} c1="#d4a017" c2="#e07b00" sw={0.55}/></div>
      <div className={styles.chakraGlow} aria-hidden="true"/>

      {/* ══════════════════════════════
          SECTION 1 — HERO + WHO WE ARE
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">

          {/* Hero heading */}
          <div className={styles.heroWrap}>
            <h1 className={styles.heroTitle}>YOGA TEACHER TRAINING IN INDIA</h1>
            <p className={styles.heroSub}>AYM YOGA SCHOOL – RISHIKESH, INDIA</p>
            <div className={styles.heroUnderline}/>
          </div>

          <p className={styles.bodyPara}>
            India, the birthplace of yoga, has shared its timeless yogic wisdom with the world, inspiring millions to live happier and healthier lives. If you truly wish to experience authentic yoga at its source, India — especially Rishikesh, the yoga capital — is the best place to begin your journey. Today, Rishikesh has become a global hub for yoga teacher training, attracting students from every corner of the world. At AYM Yoga School, we offer the best yoga TTC in Rishikesh India, blending traditional teachings with modern methodology. Our programs include the best{" "}
            <a href="#" className={styles.link}>200 hour yoga TTC in India</a>,{" "}
            <a href="#" className={styles.link}>300 hour yoga TTC India</a>, and specialized advanced courses. AYM is recognized for offering affordable yoga teacher training in India with the highest international standards. If you're ready to advance your yoga journey through a Yoga Alliance certified teacher training course in India, AYM provides the perfect environment with expert teachers, authentic practices, and complete yoga teacher training course with accommodation in India.
          </p>

          {/* Accreditation badges */}
          <AccredBadges/>

          {/* Who We Are */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>Who We Are</h2>
            <div className={styles.cardUnderline}/>
            <p className={styles.bodyPara}>
              Founded in 2005, AYM Yoga School stands among the top yoga teacher training schools in India, known for its excellence and authenticity. As a{" "}
              <a href="#" className={styles.link}>Yoga Alliance, USA registered school</a>, AYM has trained over fifteen thousand graduates from more than 100 countries. Our goal is to provide students with transformative learning experiences through comprehensive yoga teacher training programs and holistic retreats. Whether you are a beginner seeking foundational guidance through our 200-hour Yoga TTC, or a dedicated practitioner aiming to deepen your skills through the 300-hour Yoga TTC India, our experienced faculty ensures a life-changing journey. With world-class teachers, a serene Himalayan setting, nutritious meals, and comfortable accommodation, AYM continues to set the standard as the best yoga TTC in India for those who aspire to become confident and compassionate yoga instructors.
            </p>
          </div>

          {/* YTT Through AYM */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>Yoga Teacher Training in India through AYM Yoga School</h2>
            <div className={styles.cardUnderline}/>
            <p className={styles.bodyPara}>
              At AYM, we offer yoga teacher training in two distinct and inspiring locations in India:
            </p>
            <div className="row g-3 mt-1">
              <div className="col-12 col-md-6">
                <div className={styles.locationCard}>
                  <div className={styles.locationIcon}>
                    <ChakraSVG size={36} color="#e07b00"/>
                  </div>
                  <div>
                    <h3 className={styles.locationName}>Rishikesh</h3>
                    <p className={styles.locationDesc}>
                      Revered as the world's yoga capital, nestled in the foothills of the Himalayas along the sacred Ganges River. Mother Ganga had nourished thousands of yogis with its nectar and healed them to achieve samadhi.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles.locationCard}>
                  <div className={styles.locationIcon}>
                    <ChakraSVG size={36} color="#d4a017"/>
                  </div>
                  <div>
                    <h3 className={styles.locationName}>Goa</h3>
                    <p className={styles.locationDesc}>
                      A vibrant coastal paradise known for its stunning beaches and lively culture. Each location provides a unique environment for deepening your yoga practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 2 — RISHIKESH + GOA + 3 COURSES
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">

          {/* Rishikesh detail */}
          <div className={styles.locationDetail}>
            <h2 className={styles.locationDetailTitle}>Rishikesh</h2>
            <div className={styles.locationDetailLine}/>
            <p className={styles.bodyPara}>
              If you're drawn to the spiritual energy of the holy city of Rishikesh, where the sacred Ganges winds through the Himalayan foothills, our yoga school in Upper Tapovan offers an ideal setting for transformative yoga practice. The serene and relaxing environment here is ideal for deepening your yoga practice. Our school provides comfortable accommodations to ensure a pleasant and enriching stay during your training.
            </p>
          </div>

          {/* Goa detail */}
          <div className={styles.locationDetail}>
            <h2 className={styles.locationDetailTitle}>Goa</h2>
            <div className={styles.locationDetailLine}/>
            <p className={styles.bodyPara}>
              If you are a beach person and want to learn yoga at the beachside, join our AYM yoga school in Goa. Goa is one of India's best scenic beachside tourist destinations, and this is one spot you shouldn't miss if you plan to visit the beaches of India. In Goa, our school is located towards the.
            </p>
          </div>

          <OmDivider/>

          {/* 3 Course Cards */}
          <div className="row g-4 mt-1">
            <div className="col-12 col-md-4">
              <CourseCard
                hours="200"
                title="200 Hour Yoga Teacher Training Course in India"
                desc={<><a href="#" className={styles.link}>200 hour yoga teacher course in India</a> is a structured, intensive yoga course of traditional yoga in a modern pursuit. This training program will provide you with a comprehensive knowledge of yoga and develop strong teaching skills. You will learn various aspects of yoga, like pranayama, asana, mantras, physiology, and anatomy.</>}
                linkLabel="200 Hour More Information"
              />
            </div>
            <div className="col-12 col-md-4">
              <CourseCard
                hours="300"
                title="300 Hour Yoga Teacher Training Course in India"
                desc={<>India's <a href="#" className={styles.link}>300-hour yoga teacher training course</a> is an intensive yoga course registered under Yoga Alliance USA. It gives advanced knowledge of yoga to those who want to take their personal practice and teaching skills to another level. This specialized yoga course has been built for those who have completed their <strong>200 hour yoga.</strong></>}
                linkLabel="300 Hour More Information"
              />
            </div>
            <div className="col-12 col-md-4">
              <CourseCard
                hours="500"
                title="500 Hour Yoga Teacher Training Course in India"
                desc={<>The <a href="#" className={styles.link}>500 hour yoga teacher training course in India</a> is an advanced yoga course <strong>accredited with yoga alliance, USA. 500 hour yoga TTC in India</strong> is a multi-style intensive yoga course specializing in various yoga styles and specializations in yoga therapy and takes your teaching practice to another level.</>}
                linkLabel="500 Hour More Information"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 3 — WHY AYM + IMAGES + ARRIVAL + FEE
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDeep}`}>
        <div className="container px-3 px-md-4">

          <h2 className={styles.whyTitle}>Why AYM for Yoga Teachers Training Course?</h2>
          <div className={styles.whyUnderline}/>

          <p className={styles.bodyPara}>
            Yoga is not just the study of asanas, aka yogic poses, but a way of life. At AYM, we focus on this holistic aspect of yoga beyond the yogic postures, which includes the yogic way of life, breathing exercises, meditations, etc. Yes, yoga is an inward journey towards oneself. In a yoga teachers' training session, you will experience this.
          </p>
          <p className={styles.bodyPara}>
            Our teacher training courses in India (200 hours, 300 hours and 500 hours yoga teacher training course) are approved by the Ministry of Ayush, Govt. of India, and also by the Yoga Alliance, United States. Our experienced teachers will guide you on the path of yoga. With more than 20 years of experience teaching yoga to thousands of students from around the globe, we can guarantee that we provide the best yoga teacher training course in India.
          </p>

          {/* Two quote images */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <QuoteCard
                quote='"Everyday is a great day for yoga!"'
                img="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80"
                imgAlt="Yoga practice outdoors Rishikesh"
              />
            </div>
            <div className="col-12 col-md-6">
              <QuoteCard
                quote='"Yoga is a mirror to look at ourselves from within"'
                img="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80"
                imgAlt="Group yoga by the Ganges Rishikesh"
              />
            </div>
          </div>

          <OmDivider slim/>

          <p className={styles.bodyPara}>
            We welcome you to our yoga school in India to feel the magic of yoga and experience the transformation for yourselves. We offer courses like 200 hours of yoga teacher training program and 300 hours of yoga teacher training program. The 500 hours of the yoga teacher training program (a combined program of 200 hours of yoga ttc and 300 hours of yoga ttc), various yoga retreats, prenatal yoga sessions, yoga for beginners, yoga holiday retreats, yoga and ayurvedic detoxification programs, etc. This life-changing experience is certified by thousands of our graduates from various parts of the world.
          </p>

          {/* Arrival & Includes panels */}
          <div className="row g-4 mt-2">
            {/* Arrival & Departure */}
            <div className="col-12 col-md-6">
              <div className={styles.infoPanel}>
                <h3 className={styles.panelTitle}>Arrival &amp; Departure</h3>
                <div className={styles.panelUnderline}/>
                <ol className={styles.panelList}>
                  <li>Day before Start date: Arrival and Rest.</li>
                  <li>Starting Date: Includes opening ceremony and orientation.</li>
                  <li>Day-Off: Sunday will be off day.</li>
                  <li>Last Day: Departure after 2 pm (no extra charge for the last night).</li>
                  <li>Additional Stay: You are welcome to stay before or after the retreat by paying an additional charge of $20/day, includes all meals.</li>
                </ol>
              </div>
            </div>
            {/* Includes in Fee */}
            <div className="col-12 col-md-6">
              <div className={styles.infoPanel}>
                <h3 className={styles.panelTitle}>Includes in Fee</h3>
                <div className={styles.panelUnderline}/>
                <ol className={styles.panelList}>
                  <li>Accommodation and Food.</li>
                  <li>Yoga Classes.</li>
                  <li>Course Metrials. ( Book, Printed Manual, Notebook and Beg.)</li>
                  <li>T-shirt</li>
                  <li>1 Outtour ( Local Sightseen.)</li>
                  <li>One ayurvedic Massage</li>
                </ol>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
// ================================================================
//  RulesPage.tsx — AYM Yoga School · Student Rules Page
//  Exact match to provided image design
//  Chakras in background · No checkbox · Proper container spacing
//  Bootstrap 5 + CSS Modules · Fully responsive
// ================================================================
"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/Rulespage/Rulespage.module.css";

// ─── Chakra Lotus SVG (background decorative) ────────────────────
const ChakraLotus: React.FC<{
  color: string;
  size: number;
  petals?: number;
  className?: string;
}> = ({ color, size, petals = 8, className }) => {
  const outer = Array.from({ length: petals }, (_, i) => {
    const a = (i * 360) / petals;
    const r = (a * Math.PI) / 180;
    return { cx: size / 2 + Math.cos(r) * size * 0.3, cy: size / 2 + Math.sin(r) * size * 0.3, a };
  });
  const inner = Array.from({ length: petals }, (_, i) => {
    const a = (i * 360) / petals + 360 / petals / 2;
    const r = (a * Math.PI) / 180;
    return { cx: size / 2 + Math.cos(r) * size * 0.17, cy: size / 2 + Math.sin(r) * size * 0.17, a };
  });

  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size/2} cy={size/2} r={size*0.47} stroke={color} strokeWidth="0.9" strokeDasharray="5 4" fill="none"/>
      <circle cx={size/2} cy={size/2} r={size*0.38} stroke={color} strokeWidth="0.5" fill="none"/>
      <circle cx={size/2} cy={size/2} r={size*0.26} stroke={color} strokeWidth="0.4" strokeDasharray="2 5" fill="none"/>
      {outer.map(({ cx, cy, a }, i) => (
        <ellipse key={`o${i}`} cx={cx} cy={cy} rx={size*0.065} ry={size*0.22}
          transform={`rotate(${a+90},${cx},${cy})`} fill={`${color}18`} stroke={color} strokeWidth="0.8"/>
      ))}
      {inner.map(({ cx, cy, a }, i) => (
        <ellipse key={`i${i}`} cx={cx} cy={cy} rx={size*0.048} ry={size*0.13}
          transform={`rotate(${a+90},${cx},${cy})`} fill={`${color}22`} stroke={color} strokeWidth="0.6"/>
      ))}
      {Array.from({length:6},(_,i)=>{
        const a1=(i*60)*Math.PI/180, a2=(i*60+30)*Math.PI/180;
        const r1=size*0.22, r2=size*0.13;
        return <line key={`l${i}`} x1={size/2+Math.cos(a1)*r1} y1={size/2+Math.sin(a1)*r1}
          x2={size/2+Math.cos(a2)*r2} y2={size/2+Math.sin(a2)*r2} stroke={color} strokeWidth="0.6" opacity="0.7"/>;
      })}
      <circle cx={size/2} cy={size/2} r={size*0.08} fill={`${color}28`} stroke={color} strokeWidth="0.9"/>
    </svg>
  );
};

// ─── Mandala SVG ──────────────────────────────────────────────────
const Mandala: React.FC<{ size?: number; className?: string }> = ({ size = 80, className = "" }) => {
  const cx = size/2, cy = size/2, s = size/100;
  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={cx} cy={cy} r={size*0.46} stroke="#e07b00" strokeWidth="0.7" strokeDasharray="5 3" fill="none" opacity="0.65"/>
      <circle cx={cx} cy={cy} r={size*0.36} stroke="#e07b00" strokeWidth="0.4" fill="none" opacity="0.4"/>
      {Array.from({length:16},(_,i)=>{
        const a=(i*360/16)*Math.PI/180;
        const ex=cx+Math.cos(a)*size*0.27, ey=cy+Math.sin(a)*size*0.27;
        return <ellipse key={i} cx={ex} cy={ey} rx={5*s} ry={13*s}
          transform={`rotate(${i*360/16+90},${ex},${ey})`}
          fill="rgba(224,123,0,0.1)" stroke="#e07b00" strokeWidth="0.5" opacity="0.65"/>;
      })}
      {Array.from({length:8},(_,i)=>{
        const a=((i*360/8)+22.5)*Math.PI/180;
        const ex=cx+Math.cos(a)*size*0.16, ey=cy+Math.sin(a)*size*0.16;
        return <ellipse key={i} cx={ex} cy={ey} rx={4*s} ry={10*s}
          transform={`rotate(${i*360/8+22.5+90},${ex},${ey})`}
          fill="rgba(224,123,0,0.15)" stroke="#e07b00" strokeWidth="0.6" opacity="0.7"/>;
      })}
      <circle cx={cx} cy={cy} r={size*0.09} fill="rgba(224,123,0,0.12)" stroke="#e07b00" strokeWidth="0.9" opacity="0.6"/>
      <text x={cx} y={cy+5*s} textAnchor="middle" fontSize={16*s} fill="#e07b00" fontFamily="serif" opacity="0.85">ॐ</text>
    </svg>
  );
};

// ─── Om Divider ───────────────────────────────────────────────────
const OmDivider: React.FC = () => (
  <div className={styles.omDivider}>
    <span className={styles.divLine}/>
    <Mandala size={34}/>
    <span className={styles.divLine}/>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────
const RulesPage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div className={`${styles.page} ${visible ? styles.visible : ""}`}>

      {/* ════ CHAKRA BACKGROUND ════ */}
      <div className={styles.chakraBg} aria-hidden="true">

        {/* Left side */}
        <div className={`${styles.cp} ${styles.cpL1}`}>
          <ChakraLotus color="#c0392b" size={210} petals={4} className={styles.spinCW}/>
          <span className={styles.cLabel} style={{color:"#c0392b"}}>मूलाधार<em>Muladhara · Root</em></span>
        </div>
        <div className={`${styles.cp} ${styles.cpL2}`}>
          <ChakraLotus color="#d4ac0d" size={230} petals={10} className={styles.spinSlow}/>
          <span className={styles.cLabel} style={{color:"#d4ac0d"}}>मणिपूर<em>Manipura · Solar Plexus</em></span>
        </div>
        <div className={`${styles.cp} ${styles.cpL3}`}>
          <ChakraLotus color="#1a5276" size={200} petals={16} className={styles.spinCW}/>
          <span className={styles.cLabel} style={{color:"#1a5276"}}>विशुद्ध<em>Vishuddha · Throat</em></span>
        </div>
        <div className={`${styles.cp} ${styles.cpL4}`}>
          <ChakraLotus color="#6c3483" size={195} petals={2} className={styles.spinSlow}/>
          <span className={styles.cLabel} style={{color:"#6c3483"}}>आज्ञा<em>Ajna · Third Eye</em></span>
        </div>

        {/* Right side */}
        <div className={`${styles.cp} ${styles.cpR1}`}>
          <ChakraLotus color="#e67e22" size={195} petals={6} className={styles.spinCCW}/>
          <span className={styles.cLabel} style={{color:"#e67e22"}}>स्वाधिष्ठान<em>Svadhisthana · Sacral</em></span>
        </div>
        <div className={`${styles.cp} ${styles.cpR2}`}>
          <ChakraLotus color="#1e8449" size={215} petals={12} className={styles.spinCW}/>
          <span className={styles.cLabel} style={{color:"#1e8449"}}>अनाहत<em>Anahata · Heart</em></span>
        </div>
        <div className={`${styles.cp} ${styles.cpR3}`}>
          <ChakraLotus color="#922b21" size={205} petals={12} className={styles.spinSlow}/>
          <span className={styles.cLabel} style={{color:"#922b21"}}>सहस्रार<em>Sahasrara · Crown</em></span>
        </div>

        {/* Watermark mandalas */}
        <Mandala size={400} className={styles.wmL}/>
        <Mandala size={320} className={styles.wmR}/>
      </div>

      {/* ════ TOP BORDER ════ */}
      <div className={styles.topBorder}/>

      {/* ════ PAGE TITLE & OM DIVIDER ════ */}
      <div className={styles.headerWrap}>
        <div className={styles.outerPad}>
          <h1 className={styles.pageTitle}>
            Association for Yoga and Meditation's ( AYM Yoga School ) Rules for Students
          </h1>
          <OmDivider/>
        </div>
      </div>

      {/* ════ MAIN CONTENT — with left/right space ════ */}
      <div className={styles.outerPad}>
        <div className={styles.contentBox}>

          {/* Brown header bar */}
          <div className={styles.brownBar}>
            <Mandala size={19} className={styles.barIcon}/>
            <span>Rules for Yoga Teacher Training Students</span>
          </div>

          {/* Rules body */}
          <div className={styles.body}>

            <p className={styles.rule}>
              <b className={styles.rn}>1.</b>{" "}Yoga TTC student's behavior and attitude, both private and public while at the venue, should be respectful.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>2.</b>{" "}Student's Yoga TTC in India should maintain an atmosphere encouraging mutual respect, civil and congenial relationships and free from all forms of harassment and violence, where everyone can discuss their differences and exchange ideas openly, honestly and respectfully. -Use respectful language without using vulgarity, insults, abusive language, and verbal threats, will make the Yoga TTC course a memorable event.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>3.</b>{" "}Inappropriate Conduct during Yoga TTC Course in India -Student should avoid public displays of affection and public nudity. Celibacy should be kept during the Yoga course. -Students should not possess, use, or distribute alcoholic beverages or illegal or recreational drugs. -Any music played in your lodging should be played so as not to disturb others. Silence is to be maintained after 10:00 pm and before 09:00 am, with no talking or loud noises especially in the sleeping areas. -Students should not make false statements about others with malice to cause harm, or publicly disclose another's private information. -Students should avoid entering into intimate relationships where an imbalance of power or influence, a conflict of interest, or other type of bias exists, for example between staff and guest, or between teacher and student.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>4.</b>{" "}During Yoga TTC in India, Smoking, alcohol, non-prescription drugs, eating meat, fish, eggs are to be avoided to maximize the effect of yoga ttc in India.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>5.</b>{" "}Unless otherwise specified, photography or video filming is not allowed in the venue during Yoga ttc in India ay AYM, any times i.e. during Meditation, Satsang, Asana class, lectures, anywhere in the temple areas and during meals. This helps to maintain a tranquil and peaceful environment for all.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>6.</b>{" "}Pictures may be taken during training, workshops, retreats, or classes and used in any marketing or promotional capacity such as Facebook, Instagram, youtube, AYM's website, etc. Students give full permission to release this information by consenting to these terms.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>7.</b>{" "}For security reasons and to gain maximum benefit from yoga ttc in India, students are encouraged to remain in the same town venue throughout their stay. The program coordinator must agree beforehand all absences from the YTTC, particularly for night and weekend excursions. A 'free day' is incorporated into the weekly program for sightseeing or shopping outside the venue, which is Sunday.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>8.</b>{" "}Attendance and participation in scheduled classes of yoga ttc in india are mandatory. If students expect to be absent from any scheduled event for whatever reason, notice must be submitted to the program coordinator. Many absences from scheduled classes may result in the student being dismissed from the course and asked to leave the course.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>9.</b>{" "}Students leaving the yoga ttc course in India before completion are required to return all their teaching materials
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>10.</b>{" "}Karma Yoga is an integral part of yoga ttc in India. Karma Yoga is required for each student, every day. Karma Yoga is a practical approach to help eliminate egoistic and selfish tendencies in students
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>11.</b>{" "}<strong className={styles.boldKey}>Temple Guidelines:</strong> The purity of the temple areas is to be maintained, minimum of one hands, feet and face must be washed before entering the area. No unnecessary talk or noise in the temple area, which is regarded as a place of worship and meditation for all visitors.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>12.</b>{" "}All transaction fees for yoga ttc course are the responsibility of the registrant, in case of Cancellation or drop out or any other reason, no fee will be refunded but is possible to adjust in next course within one-year period in case of emergency. So before joining course make sure that you will manage to join the course.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>13.</b>{" "}Final confirmation of the Yoga ttc in india will happen at the time of deposit of advance fee. If you are making any travel arrangement prior to this confirmation, we would advise you to subscribe to a cancellation insurance as Association for Yoga and Meditation cannot be responsible to any cost incurred for cancellation of your travel. Usually there will be no cancellation of a yoga ttc course by school management but Association for yoga and meditation reserve the right to cancel any course in case of emergency.
            </p>

            <p className={styles.rule}>
              <b className={styles.rn}>14.</b>{" "}<strong className={styles.boldKey}>Liability Disclaimer:</strong> AYM Yoga School is not liable for cancellations, changes, or losses resulting from unforeseen circumstances beyond our control. These include, but are not limited to, natural disasters, acts of God, accidents, war, civil unrest, airport closures, or any other force majeure events. The school also holds no responsibility for any illnesses, injuries, or medical or psychiatric conditions that arise during or after the course.
            </p>

            {/* Separator */}
            <div className={styles.sep}/>

            {/* Agreement — verbatim from image */}
            <p className={styles.agreePara}>
              <strong className={styles.boldKey}>Agreement by student:</strong> As a Course Participant of the{" "}
              <strong>Association for Yoga and Meditation Organization</strong>, I do hereby agree to participate in all activities. I assume full responsibility for my personal property and myself and will endeavor to make a genuine effort towards my own self- improvement according to the teachings of Yoga. I understand that if I should break any of the rules I may be asked to leave. No refunds will be granted in any circumstance.
            </p>

            <p className={styles.agreePara}>
              I hereby confirm that I understand that the training program is of intense nature and will be challenging. The course is a full time commitment and does not allow any other activities. I declare that I have disclosed on this form all relevant details and by submitting these details to Association for Yoga and Meditation I take full responsibility for myself in attending the course.
            </p>

          </div>{/* /body */}
        </div>{/* /contentBox */}
      </div>

      {/* ════ BOTTOM BORDER ════ */}
      <div className={styles.bottomBorder}/>

      {/* ════ FOOTER ════ */}
      <footer className={styles.footer}>
        <Mandala size={22}/>
        <span>© AYM Yoga School · Association for Yoga and Meditation · Rishikesh, India</span>
        <Mandala size={22}/>
      </footer>

    </div>
  );
};

export default RulesPage;
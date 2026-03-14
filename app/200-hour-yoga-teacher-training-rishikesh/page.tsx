"use client";
import React, { useState } from "react";
import styles from "@/assets/style/200-hour-yoga-teacher-training-rishikesh/Twohundredhouryoga.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/200hours.svg";

/* ══════════════════════════════════════════════════
   MANDALA SVG — 7-layer concentric chakra wheel
══════════════════════════════════════════════════ */
function MandalaSVG({
  size = 400,
  opacity = 0.13,
}: {
  size?: number;
  opacity?: number;
}) {
  const cx = 100,
    cy = 100;
  const p12 = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);
  const p8 = Array.from({ length: 8 }, (_, i) => (i * 45 * Math.PI) / 180);
  const p6 = Array.from({ length: 6 }, (_, i) => (i * 60 * Math.PI) / 180);
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, opacity }}
    >
      {[95, 88, 80, 72, 60, 45, 30, 16].map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          stroke="#8b4513"
          strokeWidth={i % 2 === 0 ? 0.7 : 0.3}
          fill="none"
        />
      ))}
      {p12.map((a, i) => {
        const x1 = cx + 60 * Math.cos(a),
          y1 = cy + 60 * Math.sin(a);
        const x2 = cx + 88 * Math.cos(a),
          y2 = cy + 88 * Math.sin(a);
        const lx = cx + 74 * Math.cos(a + 0.18),
          ly = cy + 74 * Math.sin(a + 0.18);
        const rx = cx + 74 * Math.cos(a - 0.18),
          ry = cy + 74 * Math.sin(a - 0.18);
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#8b4513"
              strokeWidth="0.5"
            />
            <path
              d={`M ${x1} ${y1} Q ${lx} ${ly} ${x2} ${y2} Q ${rx} ${ry} ${x1} ${y1}`}
              stroke="#8b4513"
              strokeWidth="0.4"
              fill="rgba(139,69,19,0.04)"
            />
          </g>
        );
      })}
      {p8.map((a, i) => {
        const x1 = cx + 45 * Math.cos(a),
          y1 = cy + 45 * Math.sin(a);
        const x2 = cx + 60 * Math.cos(a),
          y2 = cy + 60 * Math.sin(a);
        const lx = cx + 52 * Math.cos(a + 0.25),
          ly = cy + 52 * Math.sin(a + 0.25);
        const rx = cx + 52 * Math.cos(a - 0.25),
          ry = cy + 52 * Math.sin(a - 0.25);
        return (
          <g key={i}>
            <path
              d={`M ${x1} ${y1} Q ${lx} ${ly} ${x2} ${y2} Q ${rx} ${ry} ${x1} ${y1}`}
              stroke="#b8860b"
              strokeWidth="0.5"
              fill="rgba(184,134,11,0.05)"
            />
          </g>
        );
      })}
      {p6.map((a, i) => (
        <line
          key={i}
          x1={cx + 30 * Math.cos(a)}
          y1={cy + 30 * Math.sin(a)}
          x2={cx + 30 * Math.cos(a + Math.PI)}
          y2={cy + 30 * Math.sin(a + Math.PI)}
          stroke="#8b4513"
          strokeWidth="0.6"
        />
      ))}
      {p12.map((a, i) => (
        <circle
          key={i}
          cx={cx + 80 * Math.cos(a)}
          cy={cy + 80 * Math.sin(a)}
          r="1.8"
          fill="#8b4513"
          opacity="0.6"
        />
      ))}
      {p8.map((a, i) => (
        <circle
          key={i}
          cx={cx + 45 * Math.cos(a)}
          cy={cy + 45 * Math.sin(a)}
          r="1.4"
          fill="#b8860b"
          opacity="0.5"
        />
      ))}
      {p8.map((a, i) => {
        const r1 = 16,
          r2 = 28;
        return (
          <polygon
            key={i}
            points={`${cx + r1 * Math.cos(a)},${cy + r1 * Math.sin(a)} ${cx + r2 * Math.cos(a + 0.45)},${cy + r2 * Math.sin(a + 0.45)} ${cx + r2 * Math.cos(a - 0.45)},${cy + r2 * Math.sin(a - 0.45)}`}
            stroke="#b8860b"
            strokeWidth="0.4"
            fill="rgba(184,134,11,0.04)"
          />
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r="12"
        stroke="#8b4513"
        strokeWidth="0.8"
        fill="rgba(139,69,19,0.06)"
      />
      <circle
        cx={cx}
        cy={cy}
        r="5"
        stroke="#8b4513"
        strokeWidth="0.6"
        fill="rgba(139,69,19,0.1)"
      />
      <circle cx={cx} cy={cy} r="2" fill="#8b4513" opacity="0.5" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const inner = i % 2 === 0 ? 91 : 93;
        return (
          <line
            key={i}
            x1={cx + inner * Math.cos(a)}
            y1={cy + inner * Math.sin(a)}
            x2={cx + 95 * Math.cos(a)}
            y2={cy + 95 * Math.sin(a)}
            stroke="#8b4513"
            strokeWidth="0.5"
          />
        );
      })}
    </svg>
  );
}

function BorderStrip() {
  return (
    <div className={styles.borderStrip}>
      <svg
        viewBox="0 0 800 14"
        preserveAspectRatio="none"
        className={styles.borderSvg}
      >
        {Array.from({ length: 40 }, (_, i) => {
          const x = i * 20 + 10;
          return (
            <g key={i}>
              <polygon
                points={`${x},7 ${x + 6},2 ${x + 12},7 ${x + 6},12`}
                fill="none"
                stroke="#b8860b"
                strokeWidth="0.8"
              />
              <circle cx={x + 6} cy={7} r="1.2" fill="#b8860b" opacity="0.7" />
            </g>
          );
        })}
        <line
          x1="0"
          y1="7"
          x2="800"
          y2="7"
          stroke="#e07b00"
          strokeWidth="0.3"
        />
      </svg>
    </div>
  );
}

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

function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];
  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.cornerOrn}
      style={{ transform: flip }}
    >
      <path
        d="M2,2 L2,18 M2,2 L18,2"
        stroke="#b8860b"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M2,2 Q8,8 16,2 Q8,8 2,16"
        stroke="#b8860b"
        strokeWidth="0.7"
        fill="none"
      />
      <circle cx="2" cy="2" r="2" fill="#b8860b" opacity="0.7" />
      <circle cx="10" cy="10" r="1.5" fill="#b8860b" opacity="0.4" />
    </svg>
  );
}

function VintageHeading({
  children,
  center = true,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={styles.vintageHeadingWrap}
      style={{ textAlign: center ? "center" : "left" }}
    >
      <h2 className={styles.vintageHeading}>{children}</h2>
      <div
        className={styles.vintageHeadingUnderline}
        style={{ justifyContent: center ? "center" : "flex-start" }}
      >
        <svg viewBox="0 0 200 8" className={styles.headingUndSvg}>
          <path
            d="M0,4 Q50,0 100,4 Q150,8 200,4"
            stroke="#e07b00"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="100" cy="4" r="3" fill="#e07b00" opacity="0.7" />
          <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
          <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

/* ── Star Rating ── */
function Stars({ n = 5 }: { n?: number }) {
  return <span className={styles.stars}>{"★".repeat(n)}</span>;
}

/* ════════════════════════════════════════
   DATA — exact from all 13 screenshots
════════════════════════════════════════ */

const stats = [
  {
    icon: "🕐",
    val: "21+",
    title: "Years of Excellence",
    desc: "Our syllabus has been developed over twenty years by dozens of experienced yoga masters.",
  },
  {
    icon: "👥",
    val: "9,075+",
    title: "Global Alumni",
    desc: "Join the world's most famous AYM yoga teacher training alumni network.",
  },
  {
    icon: "⭐",
    val: "4.5",
    title: "Star Rating",
    desc: "Rated 4.5 stars on Google, Yoga Alliance, and Facebook by our trainees.",
  },
  {
    icon: "🔆",
    val: "200",
    title: "Hour Certification",
    desc: "Yoga Alliance approved certification recognized worldwide.",
  },
];

const upcomingDates = [
  "5th Jan - 29th Jan 2026",
  "3rd Feb - 27th Feb 2026",
  "3rd Mar - 27th Mar 2026",
  "3rd Apr - 27th Apr 2026",
  "3rd May - 27th May 2026",
  "3rd Jun - 27th Jun 2026",
  "3rd Jul - 27th Jul 2026",
  "3rd Aug - 27th Aug 2026",
  "3rd Sep - 27th Sep 2026",
  "3rd Oct - 27th Oct 2026",
  "3rd Nov - 27th Nov 2026",
  "3rd Dec - 27th Dec 2026",
];

const includedFee = [
  "Six days of yoga, meditation, and theory classes each week; Sundays are free days.",
  "24 nights of accommodation with vegetarian meals provided.",
  "One AYM t-shirt available in white or yellow for 200 hr yoga course.",
  "One yoga bag featuring the AYM printed logo for holding books and study materials.",
  "One excursion to a local attraction during the 200 hr yoga classes in rishikesh.",
  "Three meals, tea, and filtered water are available daily (except for lunch and dinner on Sundays).",
  "Teaching materials, a course manual, and access to communal yoga mats in the studio.",
  "Classes on yoga anatomy, teaching methodology, philosophy, and Ayurvedic theory.",
  "Free Wi-Fi and self-service laundry facilities (washing machine available).",
  "Yoga Alliance-recognized certification upon graduation.",
  "Can appear in YCB Examination for 200 hours or 400 hour.",
  "One free massage, One free sound healing session with private accommodation.",
  "Free twice a week ayurvedic massage, two free sound healing sessions and swimming pool facility with luxury accommodation",
];

const notIncludedFee = [
  "Any Airfare.",
  "Service of Airport pickup (Extra Charges Applicable).",
  "Service of Bus/train transfer (Extra Charges Applicable).",
  "Facility of Spa/massage treatments (Extra Charges Applicable).",
  "Facility of Air conditioner room (Extra Charges Applicable).",
  "Facility of Heater for a room (Extra Charges Applicable).",
  "Facility of swimming pool( extra Charges Applicable).",
  "YCB examination fee( extra Charges Applicable).",
];

const mod1Philosophy = [
  "Introduction to Yoga.",
  "What does yoga mean?.",
  "Definitions of Yoga.",
  "What Yoga is Not.",
  "The History of Yoga – Pre-classical to Modern.",
  "6 Different Ways to Classify Yoga.",
  "Modern vs Traditional Yoga.",
  "Applications for Yoga.",
  "Ashtanga yoga/Raja yoga.",
  "Bhakti yoga.",
  "Karma yoga.",
  "Jnana yoga.",
];
const mod2Pranayama = [
  "What is Pranayama?",
  "The Scientific View.",
  "Pancha Pranas.",
  "UpaPranas.",
  "Preparatory Breathing Practices.",
  "Sectional breathing (abdominal, thoracic and clavicular).",
  "Yogic deep breathing.",
  "Concept of Puraka, Rechaka and Kumbhaka.",
  "Anulmoa Viloma/Nadi Shodhana.",
  "Sheetalee (without Kumbhaka).",
  "Bhramari (without Kumbhaka).",
];
const mod3Kriyas = [
  "Meaning and Concept.",
  "JalaNeti.",
  "Sutra Neti.",
  "VamanaDhauti.",
  "VarisaraDhauti.",
  "Nauli.",
  "Trataka.",
];
const mod4Anatomy = [
  "What are the different components of the body?",
  "Body Movement.",
  "The Skeletal System.",
  "The Muscular System.",
  "The Respiratory System.",
  "The Cardiovascular System.",
  "The Digestive System.",
];
const mod5Meditation = [
  "Definition Mechanisms of Meditation.",
  "Ways to Begin.",
  "Time for Meditation.",
  "Preparing for Meditation.",
  "Place of Meditation.",
  "Challenges in Meditating.",
  "The Physiological and Psychological Effects of Meditation.",
  "The Inner Light Meditation Method.",
  "Chakra mediation.",
  "Kundalini meditation.",
  "Japajapa meditation.",
  "Body and breath awareness.",
  "Yoga Nidra and many more",
];
const mod6Mantras = [
  "What are Mantras?",
  "Why do we chant?.",
  "What is Om/Aum?.",
  "Gayatri Mantra.",
  "Guru Brahma Chant.",
  "Opening Prayer.",
  "AsatormaSadgamaya.",
  "Closing Prayer.",
  "Dhayama Mantra.",
  "Pranayama Mantra.",
  "Yogasana Mantra.",
  "Ashtanga Opening Prayer.",
  "13. Ashtanga Closing Prayer",
];
const mod7Teaching = [
  "what is teaching and learning.",
  "Selecting and designing a sequence.",
  "Considerations in lesson design.",
  "Creating a balanced sequence.",
  "Timing of different stages in a lesson.",
  "Demonstration vs instructions.",
  "Giving instructions.",
  "Classroom management.",
  "The physical environment.",
  "Principles of teaching Yoga.",
  "Evaluation and feedback",
];
const mod8Asanas = [
  "Introduction-Definitions and Characteristics.",
  "Stages in Yogasana.",
  "The Classification of Asanas.",
  "The Distinctions between Yoga and Exericse.",
  "General Considerations.",
  "Standing Asanas.",
  "Backbends.",
  "Twisting Asanas.",
  "Inverted Asanas.",
  "Forward Bends.",
  "Asana Sequencing.",
];

const hatha43 = [
  { n: 1, name: "Samasthiti, Tadasana", sub: "Balance standing pose" },
  { n: 2, name: "Aswasanchalanasana", sub: "Horse riding pose" },
  { n: 3, name: "Plank Pose", sub: "Core strengthening pose" },
  { n: 4, name: "Adho Mukha Svanasana", sub: "Downward facing dog pose" },
  { n: 5, name: "Ardha Chandrasana", sub: "Standing Half backbend pose" },
  { n: 6, name: "Vrksha Asana", sub: "Tree pose" },
  { n: 7, name: "Trikonasana", sub: "Triangle pose" },
  { n: 8, name: "Virabhadrasana", sub: "Warrior pose" },
  { n: 9, name: "Parsvakonasana", sub: "Side angle pose" },
  {
    n: 10,
    name: "Utthita Parsvottanasana",
    sub: "Intense side stretching pose",
  },
  { n: 11, name: "Virabhadrasana-1", sub: "Warrior pose -1" },
  { n: 12, name: "Parivartita Trikonasana", sub: "Revolving triangle pose" },
  { n: 13, name: "Prasarita Padottanasana", sub: "Spread leg forward bend" },
  { n: 14, name: "Utthita Hasta Padangustasana", sub: "Hand to feet pose" },
  {
    n: 15,
    name: "Uttanasana or Padabastasana",
    sub: "Standing forward bending pose",
  },
  { n: 16, name: "Utkatasana", sub: "Chair pose" },
  { n: 17, name: "Marichiasana", sub: "Marichi sage pose" },
  { n: 18, name: "Janusirasana", sub: "Head to knee pose" },
  {
    n: 19,
    name: "Trinmuhkapaschimmotanasana",
    sub: "Three faced seated forward bending pose",
  },
  { n: 20, name: "Paschimottanasana", sub: "Seated head to knee pose" },
  { n: 21, name: "Purvottanasana", sub: "Front stretch pose" },
  { n: 22, name: "Mastendrasana", sub: "Sage pose" },
  { n: 23, name: "Upavistasana Konasana", sub: "Seated angle pose" },
  { n: 24, name: "Navasana", sub: "Boat pose" },
  { n: 25, name: "Badhakonasana", sub: "Butterfly pose" },
  {
    n: 26,
    name: "Urdhva Paschimottanasana",
    sub: "Upward balanced head to knee pose",
  },
  { n: 27, name: "Padmasana", sub: "Lotus pose" },
  { n: 28, name: "Bhujangasana", sub: "Cobra pose" },
  { n: 29, name: "Urdhva Mukha Svanasana", sub: "Upward facing dog pose" },
  { n: 30, name: "Chaturangadndasana", sub: "Four limb staff pose" },
  { n: 31, name: "Salbhasana", sub: "Locust pose" },
  { n: 32, name: "Dhanurasana", sub: "Seated staff pose" },
  { n: 33, name: "Ustrasana", sub: "Camel pose" },
  { n: 34, name: "Setubendhasana", sub: "Bridge pose" },
  { n: 35, name: "Sputa-Padangusthasana", sub: "Laying hand to feet pose" },
  { n: 36, name: "Chakrasana", sub: "Wheel pose" },
  { n: 37, name: "Vipreetakarniasana", sub: "Inversion pose" },
  { n: 38, name: "Sarvangasana", sub: "Shoulder stand pose" },
  { n: 39, name: "Halasana", sub: "Plough pose" },
  { n: 40, name: "Karnapeedasana", sub: "Knee to ear pose" },
  { n: 41, name: "Matsyasana", sub: "Twisting pose" },
  { n: 42, name: "Savasana", sub: "Corpse pose" },
  { n: 43, name: "Sirshasana", sub: "Head stand pose" },
];

const asanaFilters = ["All Poses", "Standing", "Sitting", "Lying", "Balancing"];

const scheduleRows = [
  { time: "06:45 AM - 08:00 AM", schedule: "Pranayama / Meditation" },
  { time: "08:00 AM - 08:30 AM", schedule: "Tea Break" },
  { time: "08:30 AM - 10:00 AM", schedule: "Ashtanga Yoga" },
  { time: "10:00 AM - 11:00 AM", schedule: "Brunch" },
  { time: "11:00 AM - 12:00 PM", schedule: "Karma Yoga" },
  { time: "12:00 PM - 01:00 PM", schedule: "Teaching Methodology" },
  {
    time: "01:00 PM - 02:00 PM",
    schedule: "Self Study / Ayurveda (If you choose Ayurveda Course)",
  },
  { time: "02:00 PM - 03:00 PM", schedule: "Refreshment" },
  { time: "03:00 PM - 04:00 PM", schedule: "Yoga Philosophy" },
  { time: "04:00 PM - 05:00 PM", schedule: "Yoga Anatomy" },
  { time: "05:30 PM - 07:00 PM", schedule: "Hatha Yoga" },
  { time: "07:10 PM - 08:00 PM", schedule: "Dinner" },
  { time: "08:00 PM - 09:00 PM", schedule: "Mantra ( Mon, Wed and Fri )" },
];

const newPrograms = [
  {
    title: "200 Hour Course + Prenatal Yoga",
    desc: "Combine foundational teaching skills with specialized prenatal yoga techniques to support mothers-to-be.",
    duration: "3 Weeks + 1 Week",
    start: "03rd of Every Month",
    oldPrice: "$1148",
    price: "$1034 ( Dormitory )",
  },
  {
    title: "200 Hour Course + Ayurveda",
    desc: "Integrate ancient Ayurvedic wisdom with your yoga practice for a holistic approach to health and wellness.",
    duration: "3 Weeks + 1 Week",
    start: "3rd of Every Month",
    oldPrice: "$1088",
    price: "$980 ( Dormitory )",
  },
  {
    title: "200 Hour Course + Sound Healing",
    desc: "Learn to incorporate therapeutic sound vibrations into your yoga classes for deeper healing experiences.",
    duration: "3 Weeks + 1 Week",
    start: "3rd of Every Month",
    oldPrice: "$1059",
    price: "$953 ( Dormitory )",
  },
  {
    title: "200 Hour Course + Aerial Yoga",
    desc: "Elevate your teaching skills with aerial yoga techniques that combine traditional poses with aerial arts.",
    duration: "3 Weeks + 1 Week",
    start: "3rd of Every Month",
    oldPrice: "$1059",
    price: "$953 ( Dormitory )",
  },
];

const reviews = [
  {
    name: "Belle Cheng",
    role: "Certified Yoga Teacher",
    text: "It's definitely the best yoga teacher training school you can find in Rishikesh. I have known the management for years and I have seen how they keep the school at the top from every aspect. It's a place that makes you wanna come back again and again not only because of their whole-hearted support but also it's the powerhouse of yoga knowledge.",
  },
  {
    name: "Flor Rodriguez",
    role: "Yoga Practitioner, USA",
    text: "I learned a lot in AYM school. The quality of all the teachers is very high and classes were quite inspirational. The staff is also very helpful. Location is beautiful, quiet, close to waterfalls, and still close to the lively areas. You can prepare Yoga Alliance certification and also Indian Government Certification (YCB). Sound healing extra-curricular course is also of high quality.",
  },
  {
    name: "Olga Kendysh",
    role: "Yoga Practitioner",
    text: "AYM yoga school left amazing memories. I have chosen the school by friend recommendation. Good accommodation and food. High level of teaching. Physiology class we even requested in exam preparation day. Also you can book taxi with them if you arrive alone to Delhi. My flight came late and driver was waiting for me. Highly recommend as it's one of the oldest schools here 🙏",
  },
];

const faqs = [
  "Is prior Yoga experience required to join the 200-hour YTT?",
  "Is this course suitable for beginners?",
  "What is the duration and schedule of the course?",
  "Is the certification internationally recognized?",
  "What styles of yoga are taught?",
  "What type of accommodation is provided?",
  "Can I start teaching immediately after this course?",
  "What is the cost of the program?",
  "How do I choose the right yoga school?",
  "Will I be certified to become a yoga trainer after completing this course?",
  "Do I need to bring anything, such as a mat or yoga equipment?",
];

/* ════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════ */
export default function TwoHundredHourYoga() {
  const [asanaFilter, setAsanaFilter] = useState("All Poses");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className={styles.root}>
      {/* Fixed mandala watermarks */}
      <div className={styles.mandalaFixed} aria-hidden="true">
        <div className={styles.mf1}>
          <MandalaSVG size={700} opacity={0.055} />
        </div>
        <div className={styles.mf2}>
          <MandalaSVG size={520} opacity={0.045} />
        </div>
        <div className={styles.mf3}>
          <MandalaSVG size={400} opacity={0.04} />
        </div>
        <div className={styles.mf4}>
          <MandalaSVG size={300} opacity={0.035} />
        </div>
      </div>
      <div className={styles.grainOverlay} aria-hidden="true" />

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
      <section className={styles.heroSection2}>
        <div className={styles.heroTextWrap}>
          <OmDivider />
          <VintageHeading>
            200 Hour Yoga Teacher Training in Rishikesh
          </VintageHeading>
          <p className={styles.bodyText}>
            Yoga means union, connection. Connection with what? In daily life,
            this means connecting deeply with present activities, such as
            eating, listening to music, painting, or studying. When you immerse
            yourself in your activities, you enjoy them more and experience less
            stress. In our 200 hour yoga instructor course in Rishikesh India,
            you will learn to become fit and flexible, gain stress management
            techniques, develop present-moment awareness, and foster personal
            development through meaningful daily engagement. This balance leads
            to personal growth, greater confidence, and reduced tension.
          </p>
          <p className={styles.bodyText}>
            With <strong>25 Years of Experience</strong> in curriculum
            development and teaching, our 200 hour yoga teacher training course
            in Rishikesh offers proven benefits. By completing our comprehensive
            module, students will build teaching confidence, acquire hands-on
            yoga adjustment and alignment skills, deepen their understanding of
            yoga theory, and graduate with a recognized qualification to
            successfully teach yoga worldwide.
          </p>
          <p className={styles.bodyText}>
            Each day of the 200-hour course includes sessions designed for
            holistic benefits. Morning breathing and meditation, accompanied by
            mudras and bandhas, bring a sense of peace. Ashtanga Vinyasa Flow
            Yoga builds fitness and flexibility. Classes in teaching
            methodology, anatomy support both scientific understanding and
            practical teaching ability. Hatha yoga and alignment/adjustment
            sessions develop your foundation for understanding postures. The
            final class of mantra chanting is designed to support deep sleep.
            Our 200-hour yoga multitype teacher training in India is designed so
            that your day begins with rejuvenation and peace and ends with
            relaxation and calmness.
          </p>
          <p className={styles.bodyText}>
            We are among the best 200-hour yoga ttc schools in Rishikesh. Our
            course is registered with Yoga Alliance, USA, and The Yoga
            Certification Board, Ministry of AYUSH, Govt. of India. The
            certification is suitable for aspiring teachers and practitioners
            who wish to deepen their yoga journey. People from India and abroad
            can become Registered Yoga Teachers (RYT) through this course.
          </p>
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statTitle}>{s.title}</span>
              <span className={styles.statDesc}>{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 2 — Aims + Overview + Dates
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true">
          <MandalaSVG size={320} opacity={0.07} />
        </div>

        <h3 className={styles.h3Left}>
          200 Hour Yoga Teacher Training Rishikesh India - Aims &amp; Objective
        </h3>
        <div className={styles.underlineBar} />
        <p className={styles.bodyText}>
          The 200 hour yoga teacher training in Rishikesh is carefully designed
          to nurture your body and mind with elements of spirituality. Yoga is a
          practical science that teaches us how to live peacefully and happily
          in perfect harmony with the universe. Yoga helps reduce unwanted
          stress and tension in life, harmonizing our body, mind, and soul. The
          main aim of yoga training at AYM yoga school is to provide you with
          those skills of yoga that can transform your life from misery to
          happiness.
        </p>
        <p className={styles.bodyText}>
          <strong>
            The key aims and objectives of our 200 Hour Multi-Style Yoga Teacher
            Training Course in Rishikesh India is:
          </strong>
        </p>
        <ul className={styles.bulletList}>
          <li>
            To deepen personal practice, Asanas to achieve fitness and
            flexibility.
          </li>
          <li>
            To build confidence and competence in teaching yoga through a strong
            foundation in teaching methodology.
          </li>
          <li>
            To promote rejuvenation, peace, and tranquility through the practice
            of yoga nidra and meditation.
          </li>
          <li>
            To support emotional healing through mantra, meditation, and the
            havan fire ceremony.
          </li>
          <li>
            To provide a strong foundation in the fundamental philosophical
            concepts of yoga.
          </li>
        </ul>
        <p className={styles.bodyText}>
          The 200-hour yoga training at AYM Yoga School in Rishikesh offers an
          immersive learning experience. You will explore traditional styles
          such as Hatha and Ashtanga, as well as pranayama, meditation, and the
          art of designing effective yoga sequences. Our certified instructors
          will support you throughout this transformative journey. This training
          helps you develop the practical skills and confidence to teach yoga
          with care and compassion. Upon completion, you will be certified as an
          RVT 200 yoga teacher by Yoga Alliance.
        </p>

        <OmDivider />
        <VintageHeading>
          Overview of 200 Hour Yoga Instructor Course Rishikesh India
        </VintageHeading>
        <div className={styles.overviewBox}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <p className={styles.bodyText}>
            <strong>Name of the certification:</strong> 200-hour yoga teacher
            training / Yoga Protocol Instructor (YPI).
          </p>
          <p className={styles.bodyText}>
            <strong>Course level:</strong> Level-I.
          </p>
          <p className={styles.bodyText}>
            <strong>Requirement/Eligibility:</strong> physically fit and open
            for all but it is suggested that the candidate should have passed
            10th standard / secondary school certificate.
          </p>
          <p className={styles.bodyText}>
            <strong>Minimum age:</strong> No age limit.
          </p>
          <p className={styles.bodyText}>
            <strong>Credit points for certificate:</strong> 12 credits.
          </p>
          <p className={styles.bodyText}>
            <strong>Language:</strong> English; Hindi ( Seprate Groups ).
          </p>
        </div>

        <OmDivider label="Upcoming Batches" />
        <VintageHeading>Upcoming Course Dates</VintageHeading>
        <p className={styles.centerSubtext}>
          Choose your preferred accommodation. Prices include tuition and meals.
        </p>

        <div className={styles.tableContainer}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <div className={styles.tableScroll}>
            <table className={styles.datesTable}>
              <tbody>
                {upcomingDates.map((date, i) => (
                  <tr key={i}>
                    <td className={styles.dateCell}>
                      <span className={styles.dateCal}>📅</span> {date}
                    </td>
                    <td className={styles.priceCell}>
                      Dorm <strong className={styles.priceAmt}>$749</strong> |
                      Twin <strong className={styles.priceAmt}>$849</strong> |
                      Private:{" "}
                      <strong className={styles.priceAmt}>$1099</strong>
                    </td>
                    <td className={styles.earlyCell}>
                      <span className={styles.earlyBird}>✦ Early Bird</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.tableNote}>
            <strong>Note:</strong> A $100 USD early bird discount is available
            on all accommodation types if booked 60 days in advance.
          </p>
          <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
            <a href="#" className={styles.joinBtn}>
              Join Your Yoga Journey
            </a>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 3 — Included / Not Included + Syllabus Intro + Modules 1-4
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaR} aria-hidden="true">
          <MandalaSVG size={280} opacity={0.07} />
        </div>

        <div className={styles.feeInclGrid}>
          {/* Included */}
          <div className={styles.feeInclCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <h3 className={styles.feeInclTitle}>
              Included in 200 Hour yoga ttc course in india
            </h3>
            <div className={styles.feeInclUl} />
            <ol className={styles.feeOl}>
              {includedFee.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
          </div>
          {/* Not Included */}
          <div className={styles.feeInclCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <h3 className={styles.feeInclTitle}>
              Not Included in 200 hour yoga ttc course in Rishikesh
            </h3>
            <div className={styles.feeInclUl} />
            <ol className={styles.feeOl}>
              {notIncludedFee.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
          </div>
        </div>

        <OmDivider label="Curriculum" />
        <h3 className={styles.h3Left}>
          200 Hour Yoga Teacher Training In Rishikesh India- The Syllabus
        </h3>
        <div className={styles.underlineBar} />
        <p className={styles.bodyText}>
          It is our commitment as yoga school to provide a safe environment for
          all to practice yoga without injuries. We strictly adhere to all
          health and safety guidelines, ensuring our facilities are clean and
          well-maintained. Our instructors and students are accountable for
          ensuring that their professional and personal behavior aligns with
          these values. Integrity is an essential concept in yoga, and we strive
          to create a supportive and respectful learning environment for all.
          Our programs are curated as per the standards of the{" "}
          <strong>
            Yoga Certification Board (YCB) - Ministry of Ayush- Govt. of India
          </strong>
          , and <strong>Yoga Alliance, USA</strong>.
        </p>
        <p className={styles.bodyText}>
          During this 200 Hour Yoga TTC in Rishikesh, you will be well-versed in
          conducting yoga sessions and efficiently imparting yogic wisdom. The
          course will familiarize you with the knowledge of how to get into a
          yogic picture and how to come out of the pose, alignment correction,
          usage of props, the benefits and contre-indications for each yoga
          asana, and also how to structure the sequence of yogic poses for your
          sessions.
        </p>
        <p className={styles.bodyText}>
          The curriculum we follow is quite deep, and it covers all the
          fundamentals you need to know on the path of yoga. It's categorized
          into several modules which help you know:
        </p>

        {/* Modules 1-4 */}
        <div className={styles.moduleGrid}>
          <ModuleCard
            title="Module 1: The Philosophy of Yoga"
            intro="The course covers some fundamental concepts underlying Ashtanga Yoga and other different aspect of principles of yoga."
            items={mod1Philosophy}
          />
          <ModuleCard
            title="Module 2: The Yogic Breathing Techniques/Pranayama"
            intro="You will learn about the different types of breathing used in pranayama with practice sessions and in-depth knowledge of yogic breathing. Pranayama are great techniques to remove pranic and emotional imbalances."
            items={mod2Pranayama}
          />
          <ModuleCard
            title="Module 3: The Shat Kriyas (Cleansing Detox)"
            intro="This is another important module that gives you an understanding of the importance of the detoxification process for healing the body. You will learn various techniques like:"
            items={mod3Kriyas}
          />
          <ModuleCard
            title="Module 4: Anatomy and Physiology"
            intro="In this section teacher will connect ancient science of yoga to the present science so that we can understand scientific meaning of yoga."
            items={mod4Anatomy}
          />
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 4 — Modules 5-8 + 8.1 Ashtanga
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true">
          <MandalaSVG size={300} opacity={0.07} />
        </div>

        <div className={styles.moduleGrid}>
          <ModuleCard
            title="Module 5: Knowledge of Meditation"
            intro="Meditation is the key part of yoga teacher training. It also helps us to transform our life. Our meditation teacher is passionate to share his wisdom in such a way that every one has some own meditation experience:"
            items={mod5Meditation}
          />
          <ModuleCard
            title="Module 6: Mantras, Chants, and Prayers"
            intro="Mantras are coded in Sanskrit native language of India. Mantras are very effective in physical, mental, social and emotional wellbeing of an individual."
            items={mod6Mantras}
          />
          <ModuleCard
            title="Module 7: Mastering the Art of Teaching Yoga"
            intro="This module gives you the confidence to take your yoga classes to the next level. Here we discuss various methods of yoga teaching and techniques to improve how you conduct sessions, including the planning of sessions, the way instructions are delivered, class management, etc. We also discuss the characteristics of a good teaching style and the effective use of feedback to improve the sessions further."
            items={mod7Teaching}
          />
          <ModuleCard
            title="Module 8: Knowledge of Asanas (Yoga Postures)"
            intro="By the end of your training, you will have learned all the poses known in Ashtanga Yoga and hatha yoga, become proficient at doing them correctly, and deeply understand their therapeutic benefits. In this Yoga Alliance 200 hour program, you can learn about the various yogic poses and their classifications, such as static and dynamic asanas. These yoga asanas are meditative and cultural, and so on."
            items={mod8Asanas}
          />
        </div>

        {/* Module 8.1 Ashtanga Vinyasa */}
        <OmDivider />
        <VintageHeading>Module 8.1: Ashtanga Vinyasa Yoga</VintageHeading>
        <p className={styles.centerSubtext}>
          Discover the transformative practice that synchronizes breath with
          movement
        </p>

        <div className={styles.moduleDetailGrid}>
          <div className={styles.moduleDetailImg}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80"
              alt="Ashtanga Vinyasa Yoga"
              className={styles.modImg}
            />
          </div>
          <div className={styles.moduleDetailText}>
            <p className={styles.bodyText}>
              This form of yoga practice combines breath and body movements into
              an ongoing progression of yoga postures. It is calming on the mind
              and is well-known for its effect on stress management. Ashtanga
              was first used about 2500 years ago in the work of Maharishi
              Patanjali, the father of yoga and later Pattabhi Joice develops
              Ashtanga vinyasa system of practice in 20th century.
            </p>
            <div className={styles.featurePills}>
              <span className={styles.pill}>
                📋 Breath-synchronized movement
              </span>
              <span className={styles.pill}>🧠 Calms the mind</span>
              <span className={styles.pill}>
                🕉️ Ancient practice with modern application
              </span>
            </div>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 5 — Primary Series + Module 8.2 Hatha
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.primaryCurrCard}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <h3 className={styles.h3Left}>Primary Series Curriculum</h3>
          <div className={styles.underlineBar} />
          <p className={styles.bodyText}>
            All students of 200 hour yoga teacher training will practice primary
            series which includes:
          </p>

          <div className={styles.foundationBox}>
            <div className={styles.foundationHeader}>
              <span className={styles.foundIcon}>📖</span>
              <strong>Foundation</strong>
            </div>
            <ul className={styles.foundList}>
              <li>Introduction to ashtanga vinyasa yoga and its guru</li>
              <li>Significance and Development of vinyasa yoga</li>
              <li>Bandha, breathing and Drishti of Ashtanga yoga</li>
              <li>Trishana of ashtanga</li>
              <li>History and concept</li>
              <li>Ashtanga opening mantra</li>
            </ul>
          </div>

          <div className={styles.weekGrid}>
            {[
              {
                week: "Week 1",
                icon: "☀️",
                items: [
                  {
                    t: "Sun Salutation A",
                    d: "Learning the foundational sequence that warms up the body",
                  },
                  {
                    t: "Sun Salutation B",
                    d: "Building strength and endurance with the second sequence",
                  },
                ],
              },
              {
                week: "Week 2",
                icon: "🚶",
                items: [
                  {
                    t: "Fundamental Postures",
                    d: "Mastering the basic poses that form the foundation",
                  },
                  {
                    t: "Standing Asanas",
                    d: "Building stability and balance through standing poses",
                  },
                ],
              },
              {
                week: "Week 3",
                icon: "🧘",
                items: [
                  {
                    t: "Sitting Asanas",
                    d: "Deepening practice with seated poses and hip openers",
                  },
                  {
                    t: "Finishing Asanas",
                    d: "Cooling down and integrating the practice",
                  },
                ],
              },
              {
                week: "Final Days",
                icon: "🏅",
                items: [
                  {
                    t: "Ashtanga Closing Mantra",
                    d: "Learning the traditional closing chant",
                  },
                  {
                    t: "Complete Series",
                    d: "Putting it all together in a full practice",
                  },
                ],
              },
            ].map((w, i) => (
              <div key={i} className={styles.weekCard}>
                <div className={styles.weekHeader}>
                  {w.week} <span>{w.icon}</span>
                </div>
                {w.items.map((it, j) => (
                  <div key={j} className={styles.weekItem}>
                    <span className={styles.weekDot}>●</span>
                    <div>
                      <strong>{it.t}</strong>
                      <br />
                      <span className={styles.weekDesc}>{it.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Module 8.2 Hatha */}
        <OmDivider />
        <VintageHeading>Module 8.2: Hatha Yoga</VintageHeading>
        <p className={styles.centerSubtext}>
          Discover the traditional, ancient and classical yoga practice
        </p>

        <div className={styles.moduleDetailGrid}>
          <div className={styles.moduleDetailImg}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80"
              alt="Hatha Yoga"
              className={styles.modImg}
            />
          </div>
          <div className={styles.moduleDetailText}>
            <p className={styles.bodyText}>
              Hatha yoga is the traditional, ancient and classical yoga we teach
              at our 200-hour yoga certification course. In this session our
              teachers will explain how to go in to the posture, how to correct
              and how to come out from the posture. The syllabus includes (ycb)
              yoga certification board level – 1 postures. The teacher will
              teach warmup, sukshma vyayama, traditional sun salutation of 12
              steps and will make different hatha yoga series from asana not
              limited to listed below.
            </p>
            <div className={styles.featurePills}>
              <span className={styles.pill}>
                📋 Traditional &amp; Ancient Practice
              </span>
              <span className={styles.pill}>
                🎓 YCB Certification Board Level-I
              </span>
              <span className={styles.pill}>
                ✋ Expert Guidance &amp; Correction
              </span>
            </div>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 6 — 43 Hatha Yoga Asanas
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaR} aria-hidden="true">
          <MandalaSVG size={260} opacity={0.07} />
        </div>
        <VintageHeading>Hatha Yoga Asanas</VintageHeading>
        <p className={styles.centerSubtext}>
          Master these 43 essential postures as part of your comprehensive
          training
        </p>

        <div className={styles.asanaFilterRow}>
          {asanaFilters.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${asanaFilter === f ? styles.filterActive : ""}`}
              onClick={() => setAsanaFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.asanaGrid}>
          {hatha43.map((a) => (
            <div key={a.n} className={styles.asanaCard}>
              <span className={styles.asanaNum}>{a.n}</span>
              <div>
                <div className={styles.asanaName}>{a.name}</div>
                <div className={styles.asanaSub}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 7 — Evaluation + Accommodation + Food
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true">
          <MandalaSVG size={280} opacity={0.07} />
        </div>

        <VintageHeading center={false}>
          Evolution and certification
        </VintageHeading>
        <p className={styles.bodyText}>
          There will be practical and theoretical exam to get certification of
          200 hour yoga ttc in Rishikesh India.
        </p>
        <p className={styles.bodyText}>
          <strong>Mark Distribution:</strong>
        </p>
        <p className={styles.bodyText}>
          Total Marks: 200 Marks (Theory: 60 + Practical: 140).
          <br />
          In theory examination there will be objective multiple choice
          questions (MCQ) paper. It covers all classes which has lectures and
          total marks for it is 60 Marks.
          <br />
          Practical examination has total marks of 140 and its distribution is
          as:
        </p>
        <ol className={styles.numberedListSimple}>
          <li>Demonstration Skills: 80 Marks.</li>
          <li>Teaching Skills: 40 Marks.</li>
          <li>Application of knowledge: 10 Marks.</li>
          <li>Field Experience: 10 Marks.</li>
        </ol>

        <OmDivider />
        <VintageHeading>Accommodation</VintageHeading>
        <div className={styles.photoSliderWrap}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <div className={styles.photoSlider}>
            {[
              "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
              "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80",
              "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&q=80",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Accommodation ${i + 1}`}
                className={styles.sliderImg}
              />
            ))}
          </div>
        </div>

        <OmDivider />
        <VintageHeading>Food</VintageHeading>
        <div className={styles.photoSliderWrap}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <div className={styles.photoSlider}>
            {[
              "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
              "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
              "https://images.unsplash.com/photo-1571197119669-df5e2a9e0cb5?w=400&q=80",
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Food ${i + 1}`}
                className={styles.sliderImg}
              />
            ))}
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 8 — Luxury Room + Indian Fee + Class Schedule
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaR} aria-hidden="true">
          <MandalaSVG size={300} opacity={0.065} />
        </div>

        <VintageHeading>LUXURY ROOM &amp; FEATURES</VintageHeading>
        <div className={styles.luxuryGrid}>
          <div className={styles.luxuryLeft}>
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
            ].map((it) => (
              <div key={it} className={styles.luxuryItem}>
                <span className={styles.luxuryDot}>
                  <MandalaSVG size={12} opacity={0.8} />
                </span>
                {it}
              </div>
            ))}
          </div>
          <div className={styles.luxuryRight}>
            <div className={styles.luxuryImgGrid}>
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80"
                alt="Luxury room"
                className={styles.luxuryImg}
              />
              <img
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80"
                alt="Luxury room 2"
                className={styles.luxuryImg}
              />
              <img
                src="https://images.unsplash.com/photo-1571197119669-df5e2a9e0cb5?w=800&q=80"
                alt="Pool"
                className={`${styles.luxuryImg} ${styles.luxuryImgWide}`}
              />
            </div>
          </div>
        </div>

        <OmDivider />
        <VintageHeading>200 Hour Course Fee for Indian Students</VintageHeading>
        <div className={styles.indianFeeGrid}>
          {[
            { label: "Dormitory:", price: "20,999 INR" },
            { label: "Shared Room:", price: "25,999 INR" },
            { label: "Private Room:", price: "44,999 INR" },
            { label: "Luxury Room:", price: "69,999 INR" },
          ].map((f) => (
            <div key={f.label} className={styles.indianFeeCard}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <span className={styles.indianFeeLabel}>{f.label}</span>
              <span className={styles.indianFeePrice}>{f.price}</span>
            </div>
          ))}
        </div>

        <OmDivider />
        <VintageHeading>
          200 Hour yoga teacher training in india - Yoga Class Schedule
        </VintageHeading>
        <p className={styles.bodyText}>
          Planning on teaching yoga? This 200 RYT yoga teacher training usually
          takes 24 days and will teach you everything you need to know. With a
          focus on yoga, this course is designed for aspiring or current
          teachers who want to deepen their understanding of the practice.
          You'll learn how to give safe, effective classes appropriate for all
          levels.
        </p>
        <p className={styles.bodyText}>
          You are required to attend the yoga teacher program from Monday to
          Saturday. The schedule for the classes is given below:
        </p>

        <div className={styles.schedLayout}>
          <div className={styles.schedTableWrap}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <table className={styles.schedTable}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Schedule</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.time}</td>
                    <td>{r.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.schedImgGrid}>
            {[
              "https://images.unsplash.com/photo-1545389336-cf090694435e?w=300&q=80",
              "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80",
              "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&q=80",
              "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=300&q=80",
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Yoga class ${i + 1}`}
                className={styles.schedImg}
              />
            ))}
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 9 — More Info + CTA Banner
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true">
          <MandalaSVG size={280} opacity={0.065} />
        </div>

        <OmDivider />
        <VintageHeading>
          More Information: 200 Hour Yoga School in Rishikesh
        </VintageHeading>

        <div className={styles.infoBlock}>
          <p className={styles.bodyText}>
            <strong>
              The medium of instruction of 200 hour yoga teacher training course
              in Rishikesh India:
            </strong>
          </p>
          <ol className={styles.numberedListSimple}>
            <li>English (course happens every month)</li>
            <li>Spanish (3 times a year)</li>
            <li>Chinese (3 times a year)</li>
          </ol>
          <p className={styles.bodyText}>
            (For Spanish &amp; Chinese medium of instruction, please inform us
            over an email for the confirmation of the course dates)
          </p>
        </div>
        <div className={styles.infoDivider} />
        <div className={styles.infoBlock}>
          <p className={styles.bodyText}>
            <strong>
              Eligibility criteria for attending 200 hour yoga teacher training
              India:
            </strong>
          </p>
          <p className={styles.bodyText}>
            A curious mind to learn and practice yoga, basic English knowledge,
            and self-discipline is all that you need for applying for this
            course! There is no upper age limit for the program. However, if you
            are below 15 years, you need to write to us.
          </p>
        </div>
        <div className={styles.infoDivider} />
        <div className={styles.infoBlock}>
          <p className={styles.bodyText}>
            <strong>Visa And Passport:</strong>
          </p>
          <p className={styles.bodyText}>
            1) You may need to have a valid tourist visa. You may reach out to
            the Indian embassy for visa arrangements. Please plan it well in
            advance to avoid last minute rush.
          </p>
          <p className={styles.bodyText}>
            2) Another option is to have a student visa. AYM school can give you
            an invitation letter after you have completed the registration
            process as well as the advance fee payment. You need to apply for
            the visa before you arrive in order to avoid last-minute
            inconveniences.
          </p>
        </div>

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <div className={styles.ctaBannerLeft}>
            <p className={styles.ctaBannerTitle}>
              We welcome you to AYM School for a wonderful yogic experience!
            </p>
            <p className={styles.ctaBannerSub}>
              Join us &amp; become part of the 5000+ international yoga teachers
              who are proud alumni of the AYM School.
            </p>
          </div>
          <div className={styles.ctaBannerRight}>
            <p className={styles.ctaBannerBook}>Book Your Spot Today!</p>
            <a href="#" className={styles.applyNowBtn}>
              Apply Now
            </a>
            <a href="tel:+919528023390" className={styles.phoneBtn}>
              📱 +91-9528023390
            </a>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 10 — New Programs + Global Cert
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaR} aria-hidden="true">
          <MandalaSVG size={300} opacity={0.065} />
        </div>

        <VintageHeading>Our New 200 Hour Yoga Programs</VintageHeading>
        <p className={styles.centerSubtext}>
          Expand your teaching expertise with our specialized certification
          combinations
        </p>

        <div className={styles.programGrid}>
          {newPrograms.map((p, i) => (
            <div key={i} className={styles.programCard}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <div className={styles.programIcon}>
                <MandalaSVG size={48} opacity={0.6} />
              </div>
              <h3 className={styles.programTitle}>{p.title}</h3>
              <p className={styles.programDesc}>{p.desc}</p>
              <div className={styles.programMeta}>
                <div>
                  <span className={styles.metaLabel}>Duration:</span>{" "}
                  {p.duration}
                </div>
                <div>
                  <span className={styles.metaLabel}>Start Date:</span>{" "}
                  {p.start}
                </div>
                <div>
                  <span className={styles.metaLabel}>Price:</span>{" "}
                  <s className={styles.oldPrice}>{p.oldPrice}</s>{" "}
                  <strong className={styles.newPrice}>{p.price}</strong>
                </div>
              </div>
              <a href="#" className={styles.learnMoreBtn}>
                Learn More
              </a>
            </div>
          ))}
        </div>

        <OmDivider />
        <VintageHeading>
          Learn the Art of Yoga and Meditation with Experts - Get Globally
          Certified
        </VintageHeading>
        <p className={styles.bodyText}>
          At Association for Yoga and Meditation, we have highly trained yoga
          teachers in Rishikesh who would guide you entirely. With years of
          knowledge and experience, they make sure that you are introduced to
          both the traditional and modern aspects of Yoga. Our specialized
          training is designed in such a way that you will have a distinctive
          approach when teaching students in the real world.
        </p>
        <p className={styles.bodyText}>
          As the best 200 Hour Yoga Teacher Teaching Course in Rishikesh, we aim
          in offering a firm base and authenticity to the teaching methodology.
          We help you to find a permanent and promising career as a yoga teacher
          and ways you can associate with your students in the process. When you
          search for the best yoga teacher training course near me, we are the
          one who comes to the top where you will learn to change people's lives
          for the better and help them recover both their physical and mental
          well-being.
        </p>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 11 — What you need to know
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true">
          <MandalaSVG size={280} opacity={0.065} />
        </div>

        <VintageHeading>
          What you need to know before start 200 hour yoga teacher training in
          Rishikesh
        </VintageHeading>

        <div className={styles.requirementsGrid}>
          <div className={styles.requirementsText}>
            <p className={styles.bodyText}>
              <strong>
                The requirements to be enrolled in this 200 hour Yoga Teacher
                Training program Rishikesh at AYM YOGA SCHOOL:
              </strong>
            </p>
            <p className={styles.bodyText}>
              AYM Yoga School provides a specialized 200 hour online yoga
              teacher training course designed for intermediate and beginner
              practitioners who want to become yoga instructors professionally.
              Participants who complete the 200 hours of the yoga course can
              register with the Yoga Alliance, USA, which can be a globally
              recognized yoga instructor certificate and designation. The RYT
              200 certification has an international reputation for your
              expertise, experience, and education. It is easy to hire you
              because they can trust that your skills and knowledge conform to
              the standards set by the Alliance.
            </p>
            <p className={styles.bodyText}>
              The basic requirements for a 200 hour RYT yoga training are to
              make your body flexible and prepared for the training, have a
              basic understanding of the physical anatomy, and be open-minded.
              Regarding flexibility for your yoga teacher training, you need at
              least an average level of flexibility to work with students who
              might not be as flexible as you are.
            </p>
          </div>
          <div className={styles.requirementsImg}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <img
              src="https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=600&q=80"
              alt="Yoga practitioner"
              className={styles.reqImg}
            />
          </div>
        </div>

        <p className={styles.bodyText}>
          The applicant must have, at the minimum, an entire year's Yoga
          experience before applying to the in-person component of this teacher
          education program. There are exceptions for those who demonstrate an
          unwavering dedication to learning or who have a well-established
          physical and spiritual routine that aligns with the philosophy of yoga
          and its practice.
        </p>
        <p className={styles.bodyText}>
          The basics of anatomy should include some knowledge about muscles and
          joints, including how these structures connect, so you can help
          students with alignment issues and better instruct them on what they
          should do when they cannot hold their pose.
        </p>

        {[
          {
            q: "What to expect in 200 hour yoga teacher training?",
            a: "As a master trainer, I observed that students are very dedicated and come to Rishikesh worldwide to learn yoga but do not know what to expect from their program. Every student should remember why I am joining yoga teacher training and make it clear to the yoga training school so that student expectations are met. Usually, people think yoga is good for health. Let's join a yoga course, but which one suits you? What duration suits you? And which style of yoga classes? There are many such questions that you have to answer before you join yoga teacher training.",
          },
          {
            q: "Which yoga course is suitable for you?",
            a: "As a yoga teacher, I advise you first to join the 200 hour yoga teacher training program in Rishikesh. It's a foundation course that helps you understand basic concepts to teach, proper alignment and adjustment of postures, and prepare yourself to advance the level of yoga practice.\n\nMany people have been doing yoga for the past 5 to 6 years and want to enroll in a 300-hour yoga teacher training program, but as a yoga mentor, I will advise you to join a 200 hour registered yoga instructor course.",
          },
          {
            q: "Many people argue about why I should join 200-hour yoga teacher training?",
            a: "First, If you wish to register with Yoga Alliance USA as a Registered Yoga Teacher (RYT), you must complete the first 200 hour intensive yoga teacher training in Rishikesh. The 200 Hour Yoga course is structured and includes every component of yoga training that yoga teachers or students need. With a 200-hour certification, you can register with Yoga Alliance, USA. You will need to learn the basic concept of yoga philosophy.",
          },
          {
            q: "Which style of 200 hour yoga teacher training course in rishikesh",
            a: "Many teacher training styles are trending in the world, like hatha yoga teacher training, ashtanga yoga teacher training, kundalini yoga teacher training, vinyasa yoga teacher training, yoga therapy training, multi-style yoga teacher training, Iyengar yoga, flow yoga, and many more. It is challenging to choose one with knowledge from a beginner. Select a yoga training course, Hatha and Ashtanga vinyasa yoga, along with pranayama, teaching methodology, yoga philosophy, and anatomy.\n\nHatha yoga teaches you the basics of classical asanas with alignment and develops flexibility. Ashtanga vinyasa teaches dynamic flow yoga to sweat, detoxify, and develop endurance. As per my experience, 200 hour hatha yoga teacher training in Rishikesh is the best option.",
          },
          {
            q: "How much does 200 hour yoga teacher training cost?",
            a: "The cost of 200 Hour yoga ttc in rishikesh varies from school to school. Many factors decide the cost of 200 hour yoga certification teacher training in rishikesh, such as location, teacher's experience, facilities and amenities. The cost increases if a yoga school is located in the heart of the spiritual area. Also, the cost increases if the campus is big with open space, a garden, and a spacious yoga studio. The most important part of 200 hours certified yoga instructor is the teachers. If teachers are experienced, they can learn a lot in a short period. Rishikesh's best 200 hour yoga training teacher will cost 999 USD to 1400 USD.",
          },
        ].map((item, i) => (
          <div key={i} className={styles.infoBlock}>
            <h4 className={styles.infoQ}>{item.q}</h4>
            {item.a.split("\n\n").map((para, j) => (
              <p key={j} className={styles.bodyText}>
                {para}
              </p>
            ))}
          </div>
        ))}
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 12 — Best 200hr + What's Included + Reviews
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaR} aria-hidden="true">
          <MandalaSVG size={280} opacity={0.065} />
        </div>

        <h4 className={styles.infoQ}>
          Best 200 hour yoga teacher training in India
        </h4>
        <p className={styles.bodyText}>
          Where is the best yoga teacher training in the world? This is
          definitely in Rishikesh, the world's capital of yoga. Rishikesh is the
          best place to learn yoga. In every street and house, there are yoga
          masters. The question is, which is the best yoga training school or
          yoga master? To answer which yoga teacher training is best in
          rishikesh. It would be best if you visited the leading schools.
        </p>

        <h4 className={styles.infoQ}>What's Included in Fee:</h4>
        <ol className={styles.numberedListSimple}>
          <li>Yoga course fee.</li>
          <li>Private/shared/Dormitory accommodation.</li>
          <li>Yoga alliance certificate.</li>
          <li>Three meals with tea.</li>
          <li>1 Out Tour - Sightseeing.</li>
          <li>1 Institute T-Shirt for 200 Hour and 300 Hour.</li>
          <li>1 Bag with Study material.</li>
          <li>9. Free Wi-Fi / Internet.</li>
          <li>Washing Machine for Self cloths wash.</li>
        </ol>

        <OmDivider label="Testimonials" />
        <VintageHeading>Student Reviews &amp; Success Stories</VintageHeading>
        <p className={styles.centerSubtext}>
          Authentic stories of transformation from students who began just like
          you.
        </p>

        <div className={styles.reviewsGrid}>
          {reviews.map((r, i) => (
            <div key={i} className={styles.reviewCard}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <div className={styles.reviewHeader}>
                <div className={styles.reviewAvatar}>
                  <MandalaSVG size={48} opacity={0.5} />
                </div>
                <div>
                  <div className={styles.reviewName}>{r.name}</div>
                  <div className={styles.reviewRole}>{r.role}</div>
                </div>
              </div>
              <Stars />
              <p className={styles.reviewText}>"{r.text}"</p>
            </div>
          ))}
        </div>

        <div className={styles.videoGrid}>
          {[
            {
              thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
              label: "Student Testimonial of AYM",
            },
            {
              thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
              label: "200 Hour (Beginners) Yoga",
            },
            {
              thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
              label: "Yoga Testimonials",
            },
          ].map((v, i) => (
            <div key={i} className={styles.videoThumb}>
              <img src={v.thumb} alt={v.label} className={styles.videoImg} />
              <div className={styles.videoPlay}>▶</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="#" className={styles.readMoreBtn}>
            Read More Reviews
          </a>
        </div>
      </section>

      <BorderStrip />

      {/* ═══════════════════════════════════════
          SCREENSHOT 13 — How to Book + FAQ
      ═══════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true">
          <MandalaSVG size={280} opacity={0.065} />
        </div>

        <VintageHeading>How to book your spot?</VintageHeading>
        <div className={styles.bookingSteps}>
          {[
            {
              icon: "💻",
              title: "Apply Now",
              text: "Click on Apply Now, and you'll be redirected to the application page where you'll enter necessary details about yourself.",
            },
            {
              icon: "👍",
              title: "Confirmation",
              text: "Once we recive your applciation. We'll review form within 24 hours and send confirmation to your email.",
            },
            {
              icon: "🏛",
              title: "Advance-Deposit",
              text: "After confirmation, you need to deposit an advance fee, Once you desposit an advance fee you will get confirmation email.",
            },
            {
              icon: "📝",
              title: "Refund Rules",
              text: "The advance deposit will not be refundable however, you can join us on other schedules in the span of one year.",
            },
          ].map((s, i) => (
            <div key={i} className={styles.bookingStep}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <div className={styles.bookingStepIcon}>{s.icon}</div>
              <div className={styles.bookingStepTitle}>{s.title}</div>
              <p className={styles.bookingStepText}>{s.text}</p>
            </div>
          ))}
        </div>

        <OmDivider />
        <VintageHeading>Frequently Asked Questions</VintageHeading>
        <div className={styles.faqList}>
          {faqs.map((q, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqBtn}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{q}</span>
                <span className={styles.faqIcon}>
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className={styles.faqAnswer}>
                  <p className={styles.bodyText}>
                    Please contact us for detailed information about this
                    question. Our team at AYM Yoga School is happy to help you
                    with any queries regarding the 200-hour yoga teacher
                    training course in Rishikesh.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <BorderStrip />
      <HowToReach />
    </div>
  );
}

/* ── Helper: Module Card ── */
function ModuleCard({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <div className={styles.moduleCard}>
      <h3 className={styles.moduleCardTitle}>{title}</h3>
      <div className={styles.moduleCardUl} />
      <p className={styles.moduleCardIntro}>{intro}</p>
      <ol className={styles.moduleOl}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ol>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import styles from "@/assets/style/Aymhomepage.module.css";

/* ══════════════════════════════════════════
   SVG DECORATIONS
══════════════════════════════════════════ */

const Mandala: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 400,
}) => {
  const cx = size / 2,
    cy = size / 2,
    r = size / 2;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.97}
        stroke="#c45e00"
        strokeWidth="0.8"
        strokeDasharray="4 6"
        opacity="0.35"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.88}
        stroke="#e07b00"
        strokeWidth="0.4"
        opacity="0.25"
      />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = ((i * 360) / 24) * (Math.PI / 180);
        const x1 = cx + r * 0.82 * Math.cos(a),
          y1 = cy + r * 0.82 * Math.sin(a);
        const x2 = cx + r * 0.65 * Math.cos(a + 0.14),
          y2 = cy + r * 0.65 * Math.sin(a + 0.14);
        const x3 = cx + r * 0.65 * Math.cos(a - 0.14),
          y3 = cy + r * 0.65 * Math.sin(a - 0.14);
        return (
          <path
            key={i}
            d={`M${cx},${cy} Q${x2},${y2} ${x1},${y1} Q${x3},${y3} ${cx},${cy}`}
            stroke="#e07b00"
            strokeWidth="0.6"
            fill="rgba(224,123,0,0.02)"
            opacity="0.45"
          />
        );
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i * 360) / 12 + 15) * (Math.PI / 180);
        const x1 = cx + r * 0.68 * Math.cos(a),
          y1 = cy + r * 0.68 * Math.sin(a);
        const x2 = cx + r * 0.5 * Math.cos(a + 0.28),
          y2 = cy + r * 0.5 * Math.sin(a + 0.28);
        const x3 = cx + r * 0.5 * Math.cos(a - 0.28),
          y3 = cy + r * 0.5 * Math.sin(a - 0.28);
        return (
          <path
            key={i}
            d={`M${cx},${cy} Q${x2},${y2} ${x1},${y1} Q${x3},${y3} ${cx},${cy}`}
            stroke="#c46a00"
            strokeWidth="0.9"
            fill="rgba(196,106,0,0.04)"
            opacity="0.6"
          />
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.55}
        stroke="#e07b00"
        strokeWidth="0.7"
        opacity="0.3"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.42}
        stroke="#e07b00"
        strokeWidth="0.4"
        strokeDasharray="3 5"
        opacity="0.25"
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = ((i * 360) / 8) * (Math.PI / 180);
        return (
          <circle
            key={i}
            cx={cx + r * 0.36 * Math.cos(a)}
            cy={cy + r * 0.36 * Math.sin(a)}
            r="3"
            fill="#e07b00"
            opacity="0.35"
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = ((i * 360) / 8) * (Math.PI / 180);
        const x1 = cx + r * 0.18 * Math.cos(a),
          y1 = cy + r * 0.18 * Math.sin(a);
        const x2 = cx + r * 0.12 * Math.cos(a + 0.5),
          y2 = cy + r * 0.12 * Math.sin(a + 0.5);
        const x3 = cx + r * 0.12 * Math.cos(a - 0.5),
          y3 = cy + r * 0.12 * Math.sin(a - 0.5);
        return (
          <path
            key={i}
            d={`M${cx},${cy} Q${x2},${y2} ${x1},${y1} Q${x3},${y3} ${cx},${cy}`}
            stroke="#e07b00"
            strokeWidth="1"
            fill="rgba(224,123,0,0.08)"
            opacity="0.7"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.07} fill="#e07b00" opacity="0.3" />
      <circle cx={cx} cy={cy} r={r * 0.03} fill="#e07b00" opacity="0.5" />
    </svg>
  );
};

const ChakraWheel: React.FC<{
  className?: string;
  color?: string;
  petals?: number;
}> = ({ className, color = "#e07b00", petals = 8 }) => (
  <svg
    className={className}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <circle
      cx="60"
      cy="60"
      r="56"
      stroke={color}
      strokeWidth="1.5"
      opacity="0.4"
    />
    <circle
      cx="60"
      cy="60"
      r="44"
      stroke={color}
      strokeWidth="0.8"
      opacity="0.35"
    />
    <circle
      cx="60"
      cy="60"
      r="14"
      stroke={color}
      strokeWidth="2"
      opacity="0.6"
    />
    <circle cx="60" cy="60" r="6" fill={color} opacity="0.45" />
    {Array.from({ length: petals * 2 }).map((_, i) => {
      const a = ((i * 360) / (petals * 2)) * (Math.PI / 180);
      return (
        <line
          key={i}
          x1={60 + 16 * Math.cos(a)}
          y1={60 + 16 * Math.sin(a)}
          x2={60 + 52 * Math.cos(a)}
          y2={60 + 52 * Math.sin(a)}
          stroke={color}
          strokeWidth="0.7"
          opacity="0.3"
        />
      );
    })}
    {Array.from({ length: petals }).map((_, i) => {
      const a = ((i * 360) / petals + 22.5) * (Math.PI / 180);
      const x1 = 60 + 46 * Math.cos(a),
        y1 = 60 + 46 * Math.sin(a);
      const x2 = 60 + 34 * Math.cos(a + 0.38),
        y2 = 60 + 34 * Math.sin(a + 0.38);
      const x3 = 60 + 34 * Math.cos(a - 0.38),
        y3 = 60 + 34 * Math.sin(a - 0.38);
      return (
        <path
          key={i}
          d={`M60,60 Q${x2},${y2} ${x1},${y1} Q${x3},${y3} 60,60`}
          stroke={color}
          strokeWidth="1"
          fill={`${color}18`}
          opacity="0.65"
        />
      );
    })}
  </svg>
);

const OmSymbol: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${styles.omSymbol} ${className || ""}`}>ॐ</div>
);

const Divider: React.FC = () => (
  <div className={styles.divider}>
    <span className={styles.dividerLine} />
    <ChakraWheel className={styles.dividerChakra} color="#c45e00" petals={6} />
    <span className={styles.dividerLine} />
  </div>
);

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */

const courses = [
  {
    id: 1,
    title: "100 Hour YTTC",
    desc: "100 Hour Yoga Teacher Training Course In Rishikesh",
    badge: null,
    href: "#",
  },
  {
    id: 2,
    title: "200 Hour YTTC",
    desc: "200 Hour Yoga Teacher Training Course In Rishikesh",
    badge: "RYS 200",
    href: "#",
  },
  {
    id: 3,
    title: "300 Hour YTTC",
    desc: "300 Hour Yoga Teacher Training Course In Rishikesh",
    badge: "RYS 300",
    href: "#",
  },
  {
    id: 4,
    title: "500 Hour YTTC",
    desc: "500 Hour Yoga Teacher Training Course In Rishikesh",
    badge: "RYS 500",
    href: "#",
  },
];

const fees = [
  {
    hours: "200 Hour Course",
    price: "1350",
    days: "21 Days Program",
    style: "Hatha / Ashtanga Yoga",
    materials: "Study Materials",
    accommodation: "Private / Shared",
    alliance: "Yoga Alliance, USA",
  },
  {
    hours: "300 Hour Course",
    price: "1500",
    days: "28 Days Program",
    style: "Multi Style Yoga",
    materials: "Study Materials",
    accommodation: "Private / Shared",
    alliance: "Yoga Alliance, USA",
  },
  {
    hours: "500 Hour Course",
    price: "2850",
    days: "56 Days Program",
    style: "Multi Style Yoga",
    materials: "Study Materials",
    accommodation: "Private / Shared",
    alliance: "Yoga Alliance, USA",
  },
];

/* ══════════════════════════════════════════
   RYS BADGE SVG
══════════════════════════════════════════ */
const RysBadge: React.FC<{ label: string }> = ({ label }) => (
  <svg
    viewBox="0 0 120 120"
    className={styles.rysBadge}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="60" cy="60" r="56" fill="#fff" stroke="#111" strokeWidth="3" />
    <circle cx="60" cy="60" r="50" fill="#fff" stroke="#111" strokeWidth="1" />
    <path
      d="M60 10 A50 50 0 0 1 110 60"
      fill="none"
      stroke="none"
      id={`arc-top-${label}`}
    />
    <text
      fontSize="9"
      fontWeight="700"
      fontFamily="Georgia,serif"
      letterSpacing="2"
      fill="#111"
    >
      <textPath href={`#arc-top-${label}`} startOffset="10%">
        REGISTERED YOGA SCHOOL
      </textPath>
    </text>
    <text
      x="60"
      y="52"
      textAnchor="middle"
      fontSize="9"
      fontWeight="700"
      fontFamily="Georgia,serif"
      fill="#111"
      letterSpacing="1"
    >
      RYS
    </text>
    <text
      x="60"
      y="72"
      textAnchor="middle"
      fontSize="26"
      fontWeight="900"
      fontFamily="Georgia,serif"
      fill="#111"
    >
      {label.replace("RYS ", "")}
    </text>
    <text
      x="60"
      y="86"
      textAnchor="middle"
      fontSize="10"
      fontStyle="italic"
      fontFamily="Georgia,serif"
      fill="#555"
    >
      yoga
    </text>
    <text
      x="60"
      y="96"
      textAnchor="middle"
      fontSize="7"
      fontWeight="700"
      fontFamily="Georgia,serif"
      fill="#111"
      letterSpacing="2"
    >
      ALLIANCE
    </text>
    {/* decorative arrows */}
    <polygon points="28,60 40,54 40,66" fill="#ccc" />
    <polygon points="92,60 80,54 80,66" fill="#ccc" />
  </svg>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const AymHomePage: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={styles.page}>
      {/* ════════ COURSES SECTION ════════ */}
      <section className={styles.section}>
        <Mandala className={styles.bgMandalaLeft} />
        <Mandala className={styles.bgMandalaRight} />

        <div className={styles.sectionHeader}>
          <OmSymbol />
          <h2 className={styles.sectionTitle}>
            Our <span className={styles.accent}>Courses</span>
          </h2>
          <div className={styles.titleUnderline} />
        </div>

        <div className={styles.coursesGrid}>
          {courses.map((c) => (
            <div key={c.id} className={styles.courseCard}>
              <ChakraWheel
                className={styles.cardChakraBg}
                color="#e07b00"
                petals={8}
              />
              {c.badge ? (
                <div className={styles.badgeWrap}>
                  <RysBadge label={c.badge} />
                </div>
              ) : (
                <div className={styles.noBadgeSpacer}>
                  <ChakraWheel
                    className={styles.noBadgeChakra}
                    color="#e07b00"
                    petals={12}
                  />
                </div>
              )}
              <h3 className={styles.courseTitle}>{c.title}</h3>
              <p className={styles.courseDesc}>{c.desc}</p>
              <a href={c.href} className={styles.btn}>
                Read More
              </a>
            </div>
          ))}
        </div>

        <Divider />
      </section>

      {/* ════════ ABOUT SECTION ════════ */}
      <section className={styles.section}>
        <Mandala className={styles.bgMandalaCenter} />

        <div className={styles.sectionHeader}>
          <OmSymbol />
          <h2 className={styles.sectionTitle}>
            <span className={styles.accent}>About</span> Us
          </h2>
          <div className={styles.titleUnderline} />
        </div>

        <div className={styles.aboutGrid}>
          <div className={styles.aboutImageWrap}>
            <div className={styles.aboutImageFrame}>
              <img
                src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80"
                alt="Yoga practice at AYM Rishikesh"
                className={styles.aboutRealImg}
              />
              <div className={styles.aboutImgOverlay} />
            </div>
            <Mandala className={styles.aboutMandalaCorner} size={200} />
          </div>

          <div className={styles.aboutContent}>
            <ChakraWheel
              className={styles.aboutChakraDecor}
              color="#c45e00"
              petals={6}
            />
            <h3 className={styles.aboutSubTitle}>
              Oldest Yoga School In Rishikesh, India
            </h3>
            <p className={styles.bodyText}>
              The AYM School Is Founded In 2005. Yogi Mahesh Chetan Ji Is The
              Founder &amp; Director Of The School. He Is Known For His Supreme
              Eminence In The Field Of Yoga. He Has Traveled To Many Countries
              And Trained Yoga Teachers At The International Level. And His
              Vision Is To Spread This Knowledge To The Larger Population By
              Creating At Least One Lakh Yoga Teachers Globally.
            </p>
            <p className={styles.bodyText}>
              These Yoga Certification Courses Are Globally Valid. And Every
              Year There Is A Constant Check On The Curriculum Such That The
              Students Get The Best Out Of Their Yoga Training Sessions. That Is
              Why AYM Is One Of The Best Yoga Teacher Training Schools In
              Rishikesh. And Their Alumni Group Of Thousands Of Yogis Is Spread
              Across Various Parts Of The World, Guiding Other Souls Towards A
              Healthy, Happy And Peaceful Life.
            </p>
            <a href="#" className={styles.btn}>
              Read More
            </a>
          </div>
        </div>

        <Divider />
      </section>

      {/* ════════ COURSE FEE SECTION ════════ */}
      <section className={`${styles.section} ${styles.feeSection}`}>
        <Mandala className={styles.bgMandalaLeft} />
        <Mandala className={styles.bgMandalaRight} />

        <div className={styles.sectionHeader}>
          <OmSymbol />
          <h2 className={styles.sectionTitle}>
            Our Course <span className={styles.accent}>Fee</span>
          </h2>
          <div className={styles.titleUnderline} />
        </div>

        <div className={styles.feeGrid}>
          {fees.map((f, i) => (
            <div
              key={i}
              className={`${styles.feeCard} ${i === 1 ? styles.feeCardCenter : ""}`}
            >
              <ChakraWheel
                className={styles.feeChakraBg}
                color={i === 1 ? "#e07b00" : "#c45e00"}
                petals={i === 1 ? 12 : 8}
              />
              <div className={styles.feeCardInner}>
                <h3 className={styles.feeHours}>{f.hours}</h3>
                <div className={styles.feePrice}>
                  <span className={styles.feeDollar}>$</span>
                  <span className={styles.feePriceNum}>{f.price}</span>
                  <span className={styles.feeMo}>/Mo</span>
                </div>
                <ul className={styles.feeList}>
                  {[
                    f.days,
                    f.style,
                    f.materials,
                    `Accommodation: ${f.accommodation}`,
                    f.alliance,
                  ].map((item, j) => (
                    <li key={j} className={styles.feeItem}>
                      <span className={styles.feeDot}>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#" className={styles.btn}>
                  More Info
                </a>
              </div>
            </div>
          ))}
        </div>

        <Divider />
      </section>

      {/* ════════ CONTACT SECTION ════════ */}
      <section className={styles.section}>
        <Mandala className={styles.bgMandalaCenter} />

        <div className={styles.sectionHeader}>
          <OmSymbol />
          <h2 className={styles.sectionTitle}>
            <span className={styles.accent}>Contact</span> Us
          </h2>
          <div className={styles.titleUnderline} />
        </div>

        <div className={styles.contactWrap}>
          <div className={styles.contactDecorLeft}>
            <div className={styles.contactImgWrap}>
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80"
                alt="Yoga meditation contact"
                className={styles.contactRealImg}
              />
              <div className={styles.contactImgOverlay} />
              <Mandala className={styles.contactImgMandala} size={200} />
            </div>
            <div className={styles.contactQuote}>
              <p>
                "Yoga Is The Journey Of The Self, Through The Self, To The
                Self."
              </p>
              <span>— Bhagavad Gita</span>
            </div>
          </div>

          <div className={styles.contactCard}>
            <ChakraWheel
              className={styles.contactChakraTop}
              color="#e07b00"
              petals={8}
            />
            <h3 className={styles.contactCardTitle}>Get In Touch</h3>

            <div className={styles.formGroup}>
              <input
                className={styles.formInput}
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                className={styles.formInput}
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                className={styles.formInput}
                type="tel"
                name="phone"
                placeholder="Your Number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                className={`${styles.formInput} ${styles.formTextarea}`}
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                rows={5}
              />
            </div>
            <button className={`${styles.btn} ${styles.btnFull}`}>
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className={styles.footer}>
        <Mandala className={styles.footerMandala} size={200} />
        <div className={styles.footerSocials}>
          {["f", "𝕏", "▶", "⊙"].map((icon, i) => (
            <a key={i} href="#" className={styles.socialIcon}>
              {icon}
            </a>
          ))}
        </div>
        <p className={styles.footerText}>
          Created By <span className={styles.footerBrand}>AYM YOGA SCHOOL</span>{" "}
          | All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default AymHomePage;

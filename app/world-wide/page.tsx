"use client";
import React, { useEffect } from "react";
import styles from "@/assets/style/world-wide/Worldwidepage.module.css";

/* ─── All worldwide locations ─── */
const locations = [
  {
    name: "Yoga Teacher Training In Germany",
    flag: "🇩🇪",
    href: "/world-wide/yoga-teacher-training-in-germany",
    region: "Europe",
  },
  {
    name: "Yoga Teacher Training In Italy",
    flag: "🇮🇹",
    href: "/world-wide/yoga-teacher-training-in-italy",
    region: "Europe",
  },
  {
    name: "Yoga Teacher Training In Switzerland",
    flag: "🇨🇭",
    href: "/world-wide/yoga-teacher-training-in-switzerland",
    region: "Europe",
  },
  {
    name: "Yoga Teacher Training In Poland",
    flag: "🇵🇱",
    href: "/world-wide/yoga-teacher-training-in-poland",
    region: "Europe",
  },
  {
    name: "Yoga Teacher Training In Pokhara",
    flag: "🇳🇵",
    href: "/world-wide/yoga-teacher-training-course-in-pokhara",
    region: "Asia",
  },
  {
    name: "Yoga Teacher Training In Nepal",
    flag: "🇳🇵",
    href: "/world-wide/yoga-teacher-training-in-nepal",
    region: "Asia",
  },
  {
    name: "Yoga Teacher Training In Europe",
    flag: "🌍",
    href: "/world-wide/yoga-teacher-training-in-europe",
    region: "Europe",
  },
  {
    name: "Yoga Teacher Training In Asia",
    flag: "🌏",
    href: "/world-wide/yoga-teacher-training-in-asia",
    region: "Asia",
  },
  {
    name: "Yoga Teacher Training In Ubud",
    flag: "🇮🇩",
    href: "/world-wide/yoga-teacher-training-in-ubud",
    region: "Asia",
  },
  {
    name: "Yoga Teacher Training in Koh Samui",
    flag: "🇹🇭",
    href: "/world-wide/yoga-teacher-training-in-koh-samui",
    region: "Asia",
  },
  {
    name: "Yoga Teacher Training in Maldives",
    flag: "🇲🇻",
    href: "/world-wide/yoga-teacher-training-in-maldives",
    region: "Asia",
  },
  {
    name: "Yoga Training in New Zealand",
    flag: "🇳🇿",
    href: "/world-wide/yoga-teacher-training-in-new-zealand",
    region: "Pacific",
  },
  {
    name: "Yoga Training In Koh Phangan",
    flag: "🇹🇭",
    href: "/world-wide/yoga-teacher-training-in-koh-phangan",
    region: "Asia",
  },
  {
    name: "Yoga Teacher Training in Vietnam",
    flag: "🇻🇳",
    href: "/world-wide/yoga-teacher-training-in-vietnam",
    region: "Asia",
  },
  {
    name: "Yoga Training in Thailand",
    flag: "🇹🇭",
    href: "/world-wide/yoga-teacher-training-in-thailand",
    region: "Asia",
  },
  {
    name: "Yoga Training In Philippines",
    flag: "🇵🇭",
    href: "/world-wide/yoga-teacher-training-in-philippines",
    region: "Asia",
  },
  {
    name: "Yoga Teacher Training in Malaysia",
    flag: "🇲🇾",
    href: "/world-wide/yoga-teacher-training-in-malaysia",
    region: "Asia",
  },
  {
    name: "Yoga Training In Hong Kong",
    flag: "🇭🇰",
    href: "/world-wide/yoga-teacher-training-in-hong-kong",
    region: "Asia",
  },
  {
    name: "Yoga Teacher Training in Indonesia",
    flag: "🇮🇩",
    href: "/world-wide/yoga-teacher-training-in-indonesia",
    region: "Asia",
  },
];

/* ─── Curriculum items ─── */
const curriculum = [
  "Foundations of yoga philosophy",
  "Different yoga and its poses",
  "Anatomy and physiology",
  "Panchakarma treatment in Rishikesh",
  "Shirodhara treatment in Rishikesh",
  "Pranayama and meditation",
  "Teaching methodologies",
];

/* ─── Benefits ─── */
const benefits = [
  {
    num: "01",
    text: "In addition to developing mindfulness, you'll thoroughly deepen your understanding of yoga.",
  },
  {
    num: "02",
    text: "By enrolling in our yoga teacher training course in Rishikesh and learning from highly qualified teachers, you'll become a proficient teacher.",
  },
  {
    num: "03",
    text: "You'll learn more about yourself, your goals, and your physical and mental well-being.",
  },
  {
    num: "04",
    text: "You'll learn and be able to handle relationships in a better way.",
  },
];

/* ─── Stats ─── */
const stats = [
  { val: "19+", label: "Countries" },
  { val: "500+", label: "Graduates" },
  { val: "20+", label: "Years Experience" },
  { val: "100%", label: "Yoga Alliance" },
];

/* ═══════════════════════ MAIN ═══════════════════════ */
export default function WorldwidePage() {
  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(`.${styles.reveal}`)
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Global mandala watermark ── */}
      <div className={styles.pageWm} aria-hidden="true">
        <MandalaFull size={800} opacity={0.025} />
      </div>

      {/* ════════ HERO SECTION ════════ */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg}>
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1800&q=85"
            alt="Yoga worldwide"
            className={styles.heroBgImg}
          />
          <div className={styles.heroVeil} />
        </div>
        <div className="container">
          <div className={`row justify-content-center ${styles.heroRow}`}>
            <div className="col-12 col-lg-9">
              <div className={styles.heroContent}>
                <MandalaRing size={320} opacity={0.12} />
                <div className={styles.heroText}>
                  <span className={styles.superLabel}>Global Community</span>
                  <h2 className={styles.heroTitle}>
                    Yoga Teacher Training
                    <br />
                    <em>Worldwide</em>
                    <br />
                    AYM YOGA SCHOOL
                  </h2>
                  <OmBar dark />
                  <p className={styles.heroPara}>
                    Yoga is a way of living that goes beyond stretching. It
                    offers complete benefits to both mind and body as well as
                    soul. You not only learn yoga but also get the chance to
                    deliver this ancient wisdom to others. Can't wait to gain
                    all the skills and spread positivity around you? Why wait?
                    Pamper yourself in luxury at our{" "}
                    <strong>
                      yoga teacher training course in Rishikesh, India
                    </strong>
                    , and our professionals will guide you. So join us and treat
                    yourself with the love you deserve.
                  </p>
                  <div className={styles.heroBtns}>
                    <a href="#locations" className={styles.btnPrimary}>
                      Explore Locations
                    </a>
                    <a href="#curriculum" className={styles.btnOutline}>
                      View Curriculum
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STATS BAR ════════ */}
      <div className={styles.statsBar}>
        <div className="container">
          <div className="row g-0">
            {stats.map((s) => (
              <div key={s.label} className="col-6 col-md-3">
                <div className={styles.statCell}>
                  <span className={styles.statVal}>{s.val}</span>
                  <span className={styles.statLbl}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ CURRICULUM ════════ */}
      <section id="curriculum" className={`${styles.section}`}>
        <div className={styles.mandalaBg} aria-hidden="true">
          <MandalaRing size={580} opacity={0.04} />
        </div>
        <div className="container">
          <div className={`row ${styles.reveal}`}>
            <div className="col-12 col-lg-6">
              <span className={styles.superLabel}>What You'll Study</span>
              <h2 className={styles.sectionTitle}>Course Curriculum</h2>
              <OmBar align="left" />
              <p className={styles.para}>
                Being one of the{" "}
                <strong>
                  best yoga teacher training course providers in Rishikesh
                </strong>
                , we at AYM offer a comprehensive yoga curriculum. Our courses
                are designed to provide in-depth knowledge and skills in theory
                and practical form. Our teachings will lead you to the path of
                healing and spiritual awakening.
              </p>
              <p className={styles.para}>
                You'll learn about different topics and techniques of all levels
                — beginners, intermediate and advanced. Our courses and programs
                are designed to empower you and help you empower others by
                verifying you as a yoga instructor. Moreover, by enrolling on
                our <strong>yoga teacher training course in Rishikesh</strong>,
                here is what you'll learn during the Course:
              </p>
              <ol className={styles.curriculumList}>
                {curriculum.map((c, i) => (
                  <li key={i} className={styles.curriculumItem}>
                    <span className={styles.currNum}>{String(i + 1)}.</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="col-12 col-lg-6 mt-4 mt-lg-0">
              <div className={styles.curriculumImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80"
                  alt="Yoga curriculum"
                  className={styles.curriculumImg}
                />
                <div className={styles.imgMandalaCorner} aria-hidden="true">
                  <MandalaRing size={180} opacity={0.18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TEACHER TEAM ════════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className="container">
          <div className={`row align-items-center ${styles.reveal}`}>
            <div className="col-12 col-lg-5 mb-4 mb-lg-0">
              <div className={styles.teamImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80"
                  alt="Experienced yoga teachers"
                  className={styles.teamImg}
                />
                <div className={styles.teamImgBadge}>
                  <span className={styles.teamBadgeVal}>20+</span>
                  <span className={styles.teamBadgeLbl}>Years Teaching</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-7 ps-lg-5">
              <span className={styles.superLabel}>Our Faculty</span>
              <h2 className={styles.sectionTitle}>
                Experienced Yoga Teacher Team
                <br />— AYM YOGA SCHOOL
              </h2>
              <OmBar align="left" />
              <p className={styles.para}>
                At AYM, our{" "}
                <strong>yoga teacher training course in Rishikesh</strong> is
                conducted by reputed teachers with years of experience. Our
                teachers and staff offer a safe space for you to explore and
                grow in different parts of the world. Our teachers are super
                friendly and are always ready to assist with any queries.
              </p>
              <p className={styles.para}>
                Whether you choose{" "}
                <strong>200 hour yoga TTC in Rishikesh</strong> or{" "}
                <strong>500 hour yoga TTC in Rishikesh</strong>, the teachers
                will guide you thoroughly. Through hard work, dedication and
                offering top-notch education and services, we are highly
                recognized for our Yoga Teacher Training course worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ BENEFITS ════════ */}
      <section className={styles.section}>
        <div className="container">
          <div className={`text-center mb-4 ${styles.reveal}`}>
            <span className={styles.superLabel}>Transformation</span>
            <h2 className={styles.sectionTitle}>
              How will you Benefit from this Course?
            </h2>
            <OmBar />
            <p
              className={`${styles.paraCenter} mx-auto`}
              style={{ maxWidth: 760 }}
            >
              How will the{" "}
              <strong>yoga teacher training course in Rishikesh</strong> benefit
              you? Well, here is what you need to know:
            </p>
          </div>
          <div className={`row g-3 ${styles.reveal}`}>
            {benefits.map((b) => (
              <div key={b.num} className="col-12 col-md-6">
                <div className={styles.benefitCard}>
                  <div className={styles.benefitNum}>{b.num}</div>
                  <p className={styles.benefitText}>{b.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Commit to wellness */}
          <div className={`${styles.wellnessBox} ${styles.reveal} mt-5`}>
            <div className={styles.wellnessMandala} aria-hidden="true">
              <MandalaRing size={200} opacity={0.1} />
            </div>
            <div className="row align-items-center">
              <div className="col-12 col-md-3 text-center mb-3 mb-md-0">
                <div className={styles.wellnessIcon}>🌿</div>
                <h3 className={styles.wellnessTitle}>
                  Commit to Wellness
                  <br />
                  and a Healthy Life
                </h3>
              </div>
              <div className="col-12 col-md-9">
                <p className={styles.para} style={{ margin: 0 }}>
                  Want to live a peaceful and healthy life? At AYM, we welcome
                  you as a part of our family and allow you to commit to mental
                  and physical wellness. Whether you enrol for a{" "}
                  <strong>300 hour yoga TTC in Rishikesh</strong> or{" "}
                  <strong>body massage in Rishikesh</strong>, you'll learn with
                  people of different cultures. Our program will give you
                  calmness and a deeper understanding of the lifestyle. You'll
                  spend quality time in nature and grow in our fun-loving
                  community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ JOIN COMMUNITY ════════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.mandalaBgR} aria-hidden="true">
          <MandalaRing size={500} opacity={0.04} />
        </div>
        <div className="container">
          <div className={`${styles.reveal}`}>
            <span className={styles.superLabel}>Worldwide Network</span>
            <h2 className={styles.sectionTitle}>
              Join an Empowering Community for Life
            </h2>
            <OmBar align="left" />
            <p className={styles.para} style={{ maxWidth: 880 }}>
              Whether you want to deepen your knowledge of yoga or take a step
              towards a new career, our{" "}
              <strong>yoga teacher training course in Rishikesh</strong> has got
              you covered. At AYM, we are known for the best, thorough yoga
              teacher training program worldwide. Once you complete, you'll gain
              knowledge and confidence to help you grow. Besides, if you plan to
              teach yoga less professionally, we guarantee this Course will help
              you learn about yourself, your desires, and your goals.
            </p>
          </div>
        </div>
      </section>

      {/* ════════ WORLDWIDE LOCATIONS GRID ════════ */}
      <section
        id="locations"
        className={`${styles.section} ${styles.locationsSection}`}
      >
        <div className="container">
          <div className={`text-center mb-5 ${styles.reveal}`}>
            <span className={styles.superLabel}>Our Global Reach</span>
            <h2 className={styles.sectionTitle}>
              Yoga Teacher Training
              <br />
              Locations Worldwide
            </h2>
            <OmBar />
          </div>
          <div className={`row g-3 ${styles.reveal}`}>
            {locations.map((loc) => (
              <div key={loc.name} className="col-12 col-sm-6 col-lg-4">
                <div className={styles.locationCard}>
                  <div className={styles.locationCardInner}>
                    {/* Mandala watermark per card */}
                    <div className={styles.cardMandala} aria-hidden="true">
                      <MandalaRing size={120} opacity={0.08} />
                    </div>
                    <div className={styles.locationTop}>
                      <span className={styles.locationFlag}>{loc.flag}</span>
                      <span className={styles.locationRegion}>
                        {loc.region}
                      </span>
                    </div>
                    <h3 className={styles.locationName}>{loc.name}</h3>
                    <a
                      href={loc.href}
                      className={styles.readMoreBtn}
                      aria-label={`Read more about ${loc.name}`}
                    >
                      <span className={styles.readMoreArrow}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                      <span className={styles.readMoreText}>Read more</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FOOTER CTA ════════ */}
      <section className={styles.footerCta}>
        <div className={styles.footerCtaMandala} aria-hidden="true">
          <MandalaFull size={600} opacity={0.09} />
        </div>
        <div className="container">
          <div className={`text-center ${styles.footerCtaInner}`}>
            <div className={styles.footerOm}>ॐ</div>
            <h2 className={styles.footerTitle}>Begin Your Sacred Journey</h2>
            <OmBar dark />
            <p className={styles.footerSub}>
              Join thousands of students who have transformed their lives at AYM
              Yoga School — teaching yoga worldwide since 2001
            </p>
            <div
              className={`d-flex flex-wrap justify-content-center gap-3 mt-3`}
            >
              <a href="/apply" className={styles.btnPrimary}>
                Apply Now
              </a>
              <a
                href="mailto:aymyogaschool@gmail.com"
                className={styles.btnGhost}
              >
                Email Us
              </a>
            </div>
            <div className={styles.footerMeta}>
              <span>Yoga Alliance Certified</span>
              <span className={styles.dot}>·</span>
              <span>Est. 2001</span>
              <span className={styles.dot}>·</span>
              <span>19+ Countries</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── SHARED COMPONENTS ─── */
function OmBar({
  align = "center",
  dark = false,
}: {
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div
      className={styles.omBar}
      style={{ justifyContent: align === "left" ? "flex-start" : "center" }}
    >
      <span
        className={styles.omLine}
        style={
          dark
            ? {
                background:
                  "linear-gradient(90deg,transparent,rgba(245,184,0,.55),transparent)",
              }
            : {}
        }
      />
      <span className={styles.omGlyph} style={dark ? { color: "#f5b800" } : {}}>
        ॐ
      </span>
      <span
        className={styles.omLine}
        style={
          dark
            ? {
                background:
                  "linear-gradient(90deg,transparent,rgba(245,184,0,.55),transparent)",
              }
            : {}
        }
      />
    </div>
  );
}

function MandalaRing({
  size = 300,
  opacity = 0.08,
}: {
  size?: number;
  opacity?: number;
}) {
  const c = size / 2;
  const rings = [0.46, 0.36, 0.26, 0.15].map((r) => r * size);
  const spokes = 24,
    petals = 16;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g stroke="#c46a00" strokeWidth="0.75" fill="none">
        {rings.map((r, i) => (
          <circle key={i} cx={c} cy={c} r={r} />
        ))}
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * 2 * Math.PI;
          return (
            <line
              key={i}
              x1={c + rings[2] * Math.cos(a)}
              y1={c + rings[2] * Math.sin(a)}
              x2={c + rings[0] * Math.cos(a)}
              y2={c + rings[0] * Math.sin(a)}
            />
          );
        })}
        {Array.from({ length: petals }).map((_, i) => {
          const a = (i / petals) * 2 * Math.PI;
          const r = rings[1];
          return (
            <ellipse
              key={i}
              cx={c + r * Math.cos(a)}
              cy={c + r * Math.sin(a)}
              rx={size * 0.065}
              ry={size * 0.022}
              transform={`rotate(${(i / petals) * 360} ${c + r * Math.cos(a)} ${c + r * Math.sin(a)})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function MandalaFull({
  size = 600,
  opacity = 0.05,
}: {
  size?: number;
  opacity?: number;
}) {
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g transform={`translate(${c},${c})`} stroke="#c46a00" fill="none">
        {[0.47, 0.39, 0.31, 0.23, 0.15, 0.08].map((r, i) => (
          <circle key={i} cx={0} cy={0} r={r * size} strokeWidth="0.65" />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          return (
            <line
              key={i}
              strokeWidth="0.5"
              x1={size * 0.08 * Math.cos(a)}
              y1={size * 0.08 * Math.sin(a)}
              x2={size * 0.47 * Math.cos(a)}
              y2={size * 0.47 * Math.sin(a)}
            />
          );
        })}
        {[
          { n: 8, r: 0.34 },
          { n: 16, r: 0.22 },
        ].map(({ n, r }, gi) =>
          Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * 2 * Math.PI;
            const R = r * size;
            return (
              <ellipse
                key={`${gi}-${i}`}
                strokeWidth="0.55"
                cx={R * Math.cos(a)}
                cy={R * Math.sin(a)}
                rx={size * (gi === 0 ? 0.07 : 0.04)}
                ry={size * 0.02}
                transform={`rotate(${(i / n) * 360} ${R * Math.cos(a)} ${R * Math.sin(a)})`}
              />
            );
          }),
        )}
      </g>
    </svg>
  );
}

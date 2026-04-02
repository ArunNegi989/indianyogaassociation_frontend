"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/yoga-ayurveda-teacher-training-rishikesh/Ayurvedapage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImgFallback from "@/assets/images/19.webp";
import api from "@/lib/api";

/* ─── Types ─── */
interface DailyScheduleItem {
  time: string;
  activity: string;
}
interface CourseItem {
  level: string;
  fee: string;
  days: string;
  cert: string;
  color?: string;
  image?: string;
}
interface Dosha {
  name: string;
  elements: string;
  color: string;
  symbol: string;
  desc: string;
}
interface Therapy {
  num: string;
  name: string;
  desc: string;
  icon: string;
}
interface MassageType {
  num: string;
  name: string;
  desc: string;
}
interface YogaPricing {
  hrs: string;
  title: string;
  price: string;
  note: string;
}

interface AyurvedaData {
  _id: string;
  heroImage?: string;
  heroImgAlt?: string;

  introSuperLabel?: string;
  introTitle?: string;
  introText1?: string;
  introText2?: string;
  introParagraphs?: string[];
  introList?: string;
  introRightImage?: string;

  spaBoxText?: string;

  doshasSuperLabel?: string;
  doshasTitle?: string;
  doshasDescription?: string;
  doshas?: Dosha[];

  coursesSuperLabel?: string;
  coursesSectionTitle?: string;
  ayurvedaCourses?: CourseItem[];
  panchaKarmaCourses?: CourseItem[];

  ayurvedaCoursesInIndiaTitle?: string;
  panchakarmaHeading?: string;
  pkPara1?: string;
  pkPara2?: string;
  pkPara3?: string;
  pkParagraphs?: string[];

  therapies?: Therapy[];

  spicesStripTitle?: string;
  spicesStripImage?: string;

  ayurvedaMassageCoursesHeading?: string;
  massagePara1?: string;
  massagePara2?: string;
  massageParagraphs?: string[];
  massageTypes?: MassageType[];

  yogaMassageTrainingHeading?: string;
  yogaMassageDuration?: string;
  yogaMassageCost?: string;
  yogaMassageDates?: string;
  trainingDesc?: string;
  trainingParagraphs?: string[];

  dailySchedule?: DailyScheduleItem[];
  syllabus?: string[];
  included?: string[];

  registrationBoxText?: string;
  registrationPaymentLink?: string;
  registrationAdvanceFee?: string;

  spiritualEnvironmentSuperLabel?: string;
  spiritualEnvironmentTitle?: string;
  spiritualCenterPara?: string;
  spiritualBottomPara?: string;
  spiritualParagraphs?: string[];

  sunsetImage?: string;

  pricingSuperLabel?: string;
  pricingSectionTitle?: string;
  yogaPricing?: YogaPricing[];

  applySuperLabel?: string;
  applyTitle?: string;
  applyText?: string;
  applyNowEmail?: string;
  browseCoursesHref?: string;

  footerTitle?: string;
  footerLoc?: string;
  footerMail?: string;
  footerTag?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const imgUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

/* Check if HTML string has visible text */
const hasContent = (html?: string) =>
  !!html && html.replace(/<[^>]*>/g, "").trim().length > 0;

/* Render HTML safely */
const Html = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

/* ════════════════════════ MAIN ════════════════════════ */
export default function AyurvedaPage() {
  const [activeTab, setActiveTab] = useState<"ayurveda" | "panchakarma">(
    "ayurveda",
  );
  const [data, setData] = useState<AyurvedaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/ayurveda-course")
      .then((res) => {
        const list = res.data?.data;
        if (Array.isArray(list) && list.length > 0) setData(list[0]);
      })
      .catch((err) => console.error("Ayurveda API error:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ── FIX: activeTab added as dependency so Observer re-runs on tab switch ── */
  useEffect(() => {
    if (loading) return;

    /* Small timeout so new tab's DOM is fully painted before observing */
    const timer = setTimeout(() => {
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
    }, 50);

    return () => clearTimeout(timer);
  }, [loading, activeTab]); /* 👈 activeTab dependency added */

  /* ── Pure dynamic data — no static fallbacks ── */
  const ayurvedaCourses: CourseItem[] = data?.ayurvedaCourses ?? [];
  const panchaKarmaCourses: CourseItem[] = data?.panchaKarmaCourses ?? [];
  const therapies = data?.therapies ?? [];
  const doshas = data?.doshas ?? [];
  const dailySchedule = data?.dailySchedule ?? [];
  const syllabus = data?.syllabus ?? [];
  const included = data?.included ?? [];
  const yogaPricing = data?.yogaPricing ?? [];
  const massageTypes: MassageType[] = data?.massageTypes ?? [];

  if (loading) {
    return (
      <div
        className={styles.page}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#c46a00", opacity: 0.7 }}>
          Loading...
        </p>
      </div>
    );
  }

  const heroImage = imgUrl(data?.heroImage);

  return (
    <div className={styles.page}>
      <div className={styles.pageWm} aria-hidden="true">
        <MandalaFull size={780} opacity={0.025} />
      </div>

      {/* ════ HERO ════ */}
      <section className={styles.heroSection}>
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={data?.heroImgAlt || "Ayurveda & Yoga"}
            className={styles.heroImage}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Image
            src={heroImgFallback}
            alt="Yoga Students Group"
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        )}
      </section>

      {/* ════ INTRO ════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.introGrid}`}>
            <div className={styles.introText}>
              <span className={styles.superLabel}>
                {data?.introSuperLabel || "Ancient Science of Life"}
              </span>
              <h2 className={styles.sectionTitle}>
                {(
                  data?.introTitle ||
                  "Introductory Course in Ayurveda\nin Rishikesh India"
                )
                  .split("\n")
                  .map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
              </h2>
              <OmBar align="left" />

              {hasContent(data?.introText1) && (
                <Html html={data!.introText1!} className={styles.para} />
              )}
              {hasContent(data?.introText2) && (
                <Html html={data!.introText2!} className={styles.para} />
              )}
              {hasContent(data?.introList) && (
                <Html html={data!.introList!} className={styles.introList} />
              )}
            </div>

            <div className={styles.introImage}>
              <div className={styles.imgFrame}>
                <img
                  src={imgUrl(data?.introRightImage) || ""}
                  alt="Ayurveda massage Rishikesh"
                />
                <div className={styles.imgFrameVeil} />
              </div>
            </div>
          </div>

          {hasContent(data?.spaBoxText) && (
            <div className={`${styles.reveal} ${styles.spaBox}`}>
              <div className={styles.spaBoxMandala} aria-hidden="true">
                <MandalaRing size={160} opacity={0.1} />
              </div>
              <Html html={data!.spaBoxText!} className={styles.para} />
            </div>
          )}
        </div>
      </section>

      {/* ════ DOSHAS ════ */}
      {doshas.length > 0 && (
        <section className={`${styles.section} ${styles.sectionTinted}`}>
          <div className={styles.mandalaBg} aria-hidden="true">
            <MandalaRing size={550} opacity={0.05} />
          </div>
          <div className={styles.container}>
            <div className={`${styles.reveal} ${styles.centered}`}>
              <span className={styles.superLabel}>
                {data?.doshasSuperLabel || "The Three Bio-Energies"}
              </span>
              <h2 className={styles.sectionTitle}>
                {data?.doshasTitle || "Tridosha — The Three Doshas"}
              </h2>
              <OmBar />
              {hasContent(data?.doshasDescription) ? (
                <Html
                  html={data!.doshasDescription!}
                  className={styles.paraCenter}
                />
              ) : (
                <p className={styles.paraCenter}>
                  Ayurveda prescribes Panchakarma therapies for cleansing body
                  toxins and reviving lost &apos;urjaa&apos;. Panchakarma
                  Therapy balances all Tridoshas.
                </p>
              )}
            </div>
            <div className={`${styles.reveal} ${styles.doshaGrid}`}>
              {doshas.map((d) => (
                <div
                  key={d.name}
                  className={styles.doshaCard}
                  style={{ "--dc": d.color } as React.CSSProperties}
                >
                  <div className={styles.doshaTop} />
                  <span className={styles.doshaIcon}>{d.symbol}</span>
                  <div className={styles.doshaMandala} aria-hidden="true">
                    <MandalaRing size={120} opacity={0.12} />
                  </div>
                  <h3 className={styles.doshaName}>{d.name}</h3>
                  <p className={styles.doshaElements}>{d.elements}</p>
                  <p className={styles.doshaDesc}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ COURSES (tabs) ════ */}
      <section id="courses" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {data?.coursesSuperLabel || "Programmes"}
            </span>
            <h2 className={styles.sectionTitle}>
              {data?.coursesSectionTitle || "Ayurveda Courses in Rishikesh"}
            </h2>
            <OmBar />
          </div>

          {/* ── Tab switcher ── */}
          <div className={`${styles.reveal} ${styles.tabRow}`}>
            <button
              className={`${styles.tab} ${activeTab === "ayurveda" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("ayurveda")}
            >
              Ayurveda Courses
            </button>
            <button
              className={`${styles.tab} ${activeTab === "panchakarma" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("panchakarma")}
            >
              Panchakarma Courses
            </button>
          </div>

          {/* ── Ayurveda tab ── */}
          {activeTab === "ayurveda" && (
            <div className={`${styles.reveal} ${styles.courseGrid}`}>
              {ayurvedaCourses.length === 0 ? (
                <p className={styles.para}>
                  No Ayurveda courses available at the moment.
                </p>
              ) : (
                ayurvedaCourses.map((c) => (
                  <div key={c.level} className={styles.courseCard}>
                    <div className={styles.courseCardImg}>
                      <img
                        src={imgUrl(c.image) || ""}
                        alt={`Ayurveda ${c.level}`}
                      />
                      <div
                        className={styles.courseCardOverlay}
                        style={{
                          background:
                            "linear-gradient(180deg,rgba(30,10,0,.1) 0%,rgba(40,15,0,.85) 100%)",
                        }}
                      />
                      <div className={styles.courseCardInfo}>
                        <h3 className={styles.courseCardTitle}>
                          Ayurveda {c.level} Course Rishikesh
                        </h3>
                        <p className={styles.courseCardFee}>
                          {c.level} Fee: <strong>{c.fee}</strong>
                        </p>
                        <p className={styles.courseCardDur}>
                          Duration: <strong>{c.days}</strong>
                        </p>
                        <p className={styles.courseCardCert}>
                          Certification: {c.cert}
                        </p>
                        <a href="#apply" className={styles.courseCardBtn}>
                          Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Panchakarma tab ── */}
          {activeTab === "panchakarma" && (
            <div className={`${styles.reveal} ${styles.courseGrid}`}>
              {panchaKarmaCourses.length === 0 ? (
                <p className={styles.para}>
                  No Panchakarma courses available at the moment.
                </p>
              ) : (
                panchaKarmaCourses.map((c) => (
                  <div key={c.level} className={styles.courseCard}>
                    <div className={styles.courseCardImg}>
                      <img
                        src={imgUrl(c.image) || ""}
                        alt={`Panchakarma ${c.level}`}
                      />
                      <div
                        className={styles.courseCardOverlay}
                        style={{
                          background:
                            "linear-gradient(180deg,rgba(30,10,0,.1) 0%,rgba(40,15,0,.85) 100%)",
                        }}
                      />
                      <div className={styles.courseCardInfo}>
                        <h3 className={styles.courseCardTitle}>
                          Panchakarma {c.level} Course Rishikesh
                        </h3>
                        <p className={styles.courseCardFee}>
                          {c.level} Fee: <strong>{c.fee}</strong>
                        </p>
                        <p className={styles.courseCardDur}>
                          Duration: <strong>{c.days}</strong>
                        </p>
                        <p className={styles.courseCardCert}>
                          Certification: {c.cert}
                        </p>
                        <a href="#apply" className={styles.courseCardBtn}>
                          Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* ════ AYURVEDA COURSES IN INDIA ════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <h2 className={styles.sectionTitle}>
              {data?.ayurvedaCoursesInIndiaTitle || "Ayurveda Courses in India"}
            </h2>
            <OmBar />
          </div>
          <div className={`${styles.reveal} ${styles.panchBox}`}>
            <h3 className={styles.panchHeading}>
              {data?.panchakarmaHeading || "About Panchakarma"}
            </h3>
            {hasContent(data?.pkPara1) && (
              <Html html={data!.pkPara1!} className={styles.para} />
            )}
            {hasContent(data?.pkPara2) && (
              <Html html={data!.pkPara2!} className={styles.para} />
            )}
            {hasContent(data?.pkPara3) && (
              <Html html={data!.pkPara3!} className={styles.para} />
            )}
          </div>

          {therapies.length > 0 && (
            <div className={`${styles.reveal} ${styles.therapiesGrid}`}>
              {therapies.map((t) => (
                <div key={t.name} className={styles.therapyCard}>
                  <div className={styles.therapyHeader}>
                    <span className={styles.therapyIcon}>{t.icon}</span>
                    <div>
                      {t.num !== "—" && (
                        <span className={styles.therapyNum}>{t.num}.</span>
                      )}
                      <h4 className={styles.therapyName}>{t.name}</h4>
                    </div>
                  </div>
                  <p className={styles.therapyDesc}>{t.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ SPICES IMAGE STRIP ════ */}
      <div className={styles.imgStrip}>
        <img
          src={imgUrl(data?.spicesStripImage) || ""}
          alt="Ayurveda herbs and spices"
          className={styles.imgStripPhoto}
        />
        <div className={styles.imgStripVeil} />
        <div className={styles.imgStripContent}>
          <OmBar dark />
          <h3 className={styles.imgStripTitle}>
            {data?.spicesStripTitle ||
              "Yoga and Panchakarma Training Course in India"}
          </h3>
        </div>
      </div>

      {/* ════ PANCHAKARMA FULL CARDS ════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          {panchaKarmaCourses.length > 0 && (
            <div className={`${styles.reveal} ${styles.pkCardsFull}`}>
              {panchaKarmaCourses.map((c, i) => (
                <div
                  key={c.level}
                  className={styles.pkCardFull}
                  style={
                    {
                      "--pc": i === 1 ? "#888" : c.color,
                    } as React.CSSProperties
                  }
                >
                  <h3 className={styles.pkCardFullTitle}>
                    Panchkarma {c.level} Course
                  </h3>
                  <div className={styles.pkCardFullRow}>
                    <span>
                      {c.level} Fee: <strong>{c.fee}</strong>
                    </span>
                    <span>
                      Duration: <strong>{c.days}</strong>
                    </span>
                  </div>
                  <p className={styles.pkCardFullCert}>
                    Certification: {c.cert}
                  </p>
                  <a href="#apply" className={styles.pkCardFullBtn}>
                    Book Now
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Massage */}
          <div
            className={`${styles.reveal} ${styles.centered}`}
            style={{ marginTop: "3rem" }}
          >
            <h2 className={styles.sectionTitle}>
              {data?.ayurvedaMassageCoursesHeading ||
                "Ayurveda Massage Courses Offered at AYM"}
            </h2>
            <OmBar />
            {hasContent(data?.massagePara1) && (
              <Html html={data!.massagePara1!} className={styles.paraCenter} />
            )}
            {hasContent(data?.massagePara2) && (
              <Html html={data!.massagePara2!} className={styles.paraCenter} />
            )}
          </div>

          {massageTypes.map((mt, i) => (
            <div key={i} className={`${styles.reveal} ${styles.massageCard}`}>
              <div className={styles.massageNum}>{mt.num}.</div>
              <div>
                <h4 className={styles.massageName}>{mt.name}</h4>
                <p className={styles.para}>{mt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ TRAINING ════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <h2 className={styles.sectionTitle} style={{ fontStyle: "italic" }}>
              {data?.yogaMassageTrainingHeading ||
                "Yoga and Ayurvedic Massage Training in India"}
            </h2>
            <OmBar />
          </div>

          <div className={`${styles.reveal} ${styles.trainingMeta}`}>
            <span>
              <strong>Duration:</strong> {data?.yogaMassageDuration || "—"}
            </span>
            <span>
              <strong>Cost:</strong> {data?.yogaMassageCost || "—"}
            </span>
            <span>
              <strong>Dates:</strong> {data?.yogaMassageDates || "—"}
            </span>
          </div>

          <div className={`${styles.reveal} ${styles.trainingGrid}`}>
            {dailySchedule.length > 0 && (
              <div className={styles.trainingCol}>
                <h3 className={styles.trainingColTitle}>Daily Schedule:</h3>
                <div className={styles.scheduleList}>
                  {dailySchedule.map((s, i) => (
                    <div key={i} className={styles.scheduleRow}>
                      <span className={styles.scheduleTime}>{s.time}</span>
                      <span className={styles.scheduleAct}>{s.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {syllabus.length > 0 && (
              <div className={styles.trainingCol}>
                <h3 className={styles.trainingColTitle}>Syllabus:</h3>
                <ol className={styles.syllabusList}>
                  {syllabus.map((s, i) => (
                    <li key={i} className={styles.syllabusItem}>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {included.length > 0 && (
              <div className={styles.trainingCol}>
                <h3 className={styles.trainingColTitle}>
                  What&apos;s included in Fees:
                </h3>
                <ol className={styles.syllabusListNum}>
                  {included.map((item, i) => (
                    <li key={i} className={styles.syllabusItem}>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className={`${styles.reveal} ${styles.registrationBox}`}>
            {hasContent(data?.registrationBoxText) ? (
              <Html
                html={data!.registrationBoxText!}
                className={styles.inlineBlock}
              />
            ) : (
              <span>
                <strong>Registration:</strong> Deposit{" "}
                <strong>
                  {data?.registrationAdvanceFee || "210 US Dollars"}
                </strong>{" "}
                advance fee to book your place.
              </span>
            )}{" "}
            <a
              href={data?.registrationPaymentLink || "#apply"}
              className={styles.inlineLink}
            >
              See payment options →
            </a>
          </div>
        </div>
      </section>

      {/* ════ SPIRITUAL ENVIRONMENT ════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {data?.spiritualEnvironmentSuperLabel || "Sacred Setting"}
            </span>
            <h2 className={styles.sectionTitle} style={{ fontStyle: "italic" }}>
              {data?.spiritualEnvironmentTitle ||
                "Spiritual Environment in Rishikesh"}
            </h2>
            <OmBar />
            {hasContent(data?.spiritualCenterPara) ? (
              <Html
                html={data!.spiritualCenterPara!}
                className={styles.paraCenter}
              />
            ) : (
              <p className={styles.paraCenter}>
                We have established our yoga place near the mountain valley and
                Ganga River in Rishikesh.
              </p>
            )}
          </div>

          <div className={`${styles.reveal} ${styles.sunsetWrap}`}>
            <img
              src={imgUrl(data?.sunsetImage) || ""}
              alt="Spiritual yoga Rishikesh sunset"
              className={styles.sunsetImg}
            />
            <div className={styles.sunsetVeil} />
            <div className={styles.sunsetMandala} aria-hidden="true">
              <MandalaRing size={280} opacity={0.15} />
            </div>
          </div>

          {hasContent(data?.spiritualBottomPara) && (
            <div className={styles.reveal}>
              <Html html={data!.spiritualBottomPara!} className={styles.para} />
            </div>
          )}
        </div>
      </section>

      {/* ════ PRICING ════ */}
      {yogaPricing.length > 0 && (
        <section className={`${styles.section} ${styles.pricingSection}`}>
          <div className={styles.pricingMandala} aria-hidden="true">
            <MandalaFull size={600} opacity={0.05} />
          </div>
          <div className={styles.container}>
            <div className={`${styles.reveal} ${styles.centered}`}>
              <span className={styles.superLabel}>
                {data?.pricingSuperLabel || "Investment"}
              </span>
              <h2
                className={styles.sectionTitle}
                style={{ fontStyle: "italic" }}
              >
                {data?.pricingSectionTitle ||
                  "Details of Price for Different Courses"}
              </h2>
              <OmBar />
            </div>
            <div className={`${styles.reveal} ${styles.yogaPricingGrid}`}>
              {yogaPricing.map((p) => (
                <div key={p.hrs} className={styles.yogaPriceCard}>
                  <div className={styles.yogaPriceHrs}>
                    {p.hrs}
                    <span>HR</span>
                  </div>
                  <h3 className={styles.yogaPriceTitle}>{p.title}</h3>
                  <OmBar />
                  <p className={styles.yogaPriceAmt}>{p.price}</p>
                  <p className={styles.yogaPriceNote}>({p.note})</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ HOW TO APPLY ════ */}
      <section id="apply" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {data?.applySuperLabel || "Enrolment"}
            </span>
            <h2 className={styles.sectionTitle} style={{ fontStyle: "italic" }}>
              {data?.applyTitle || "How to Apply"}
            </h2>
            <OmBar />
          </div>
          <div className={`${styles.reveal} ${styles.applyBox}`}>
            <div className={styles.applyMandala} aria-hidden="true">
              <MandalaRing size={200} opacity={0.1} />
            </div>
            {hasContent(data?.applyText) ? (
              <Html html={data!.applyText!} className={styles.para} />
            ) : (
              <p className={styles.para}>
                Fill the application form and send it to{" "}
                <a
                  href={`mailto:${data?.applyNowEmail || "aymyogaschool@gmail.com"}`}
                  className={styles.inlineLink}
                >
                  aymyogaschool[at]gmail.com
                </a>
                . Deposit <strong>$200 in advance</strong> to confirm your
                place.
              </p>
            )}
            <div className={styles.applyBtns}>
              <a
                href={`mailto:${data?.applyNowEmail || "aymyogaschool@gmail.com"}`}
                className={styles.btnPrimary}
              >
                Apply Now →
              </a>
              <a
                href={data?.browseCoursesHref || "#courses"}
                className={styles.btnOutline}
              >
                Browse Courses
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className={styles.footer}>
        <div className={styles.footerMandala} aria-hidden="true">
          <MandalaFull size={500} opacity={0.09} />
        </div>
        <div className={styles.footerInner}>
          <span className={styles.footerOm}>ॐ</span>
          <p className={styles.footerTitle}>
            {data?.footerTitle || "AYM Ayurveda Clinic & Panchakarma Centre"}
          </p>
          <p className={styles.footerLoc}>
            {data?.footerLoc || "Rishikesh, Uttarakhand, India"}
          </p>
          <a
            href={`mailto:${data?.footerMail || "aymyogaschool@gmail.com"}`}
            className={styles.footerMail}
          >
            {data?.footerMail || "aymyogaschool@gmail.com"}
          </a>
          <div className={styles.footerLine} />
          <p className={styles.footerTag}>
            {data?.footerTag ||
              "5000 Years of Ancient Wisdom · Yoga Alliance Certified · AYM Est. 2001"}
          </p>
        </div>
      </footer>

      <HowToReach />
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
              transform={`rotate(${(i / petals) * 360} ${c + r * Math.cos(a)} ${
                c + r * Math.sin(a)
              })`}
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
                transform={`rotate(${(i / n) * 360} ${R * Math.cos(a)} ${
                  R * Math.sin(a)
                })`}
              />
            );
          }),
        )}
      </g>
    </svg>
  );
}

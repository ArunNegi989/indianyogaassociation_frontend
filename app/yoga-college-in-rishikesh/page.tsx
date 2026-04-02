"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-college-in-rishikesh/Yogacollegerishikesh.module.css";
import yogabanner from "@/assets/images/yoga-college.jpg";
import image1 from "@/assets/images/200-hour-ayush-ministry-yoga-course-15-days.jpg";
import image2 from "@/assets/images/400-hour-yoga-program-ayush-ministry-28-days.jpg";
import image3 from "@/assets/images/800-hour-yoga.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/31.webp";
// ── Tab data ──────────────────────────────────────────────────────
const tabs = [
  {
    id: "protocol",
    label: "Yoga Protocol Instructor",
    content: {
      intro: `Yoga protocol instructor is a basic level of certification provided by AYM yoga school in Rishikesh for practitioners seeking a basic knowledge of yoga and its practices (yoga asanas) under the guidance of experienced yoga teachers. It is the best foundational yoga course for the practitioner who wants to teach yoga at the group level or an individual class.`,
      affiliation: `The yoga certification board accredits this 200-hour level-1 instructional yoga course by AYM yoga school in rishikesh.`,
      sections: [
        {
          title: "Aim and Objective",
          content: `To teach basic yoga at the group level in parks, community-level on/off the occasion of international yoga day.`,
          bullets: [
            "To promote health and wellness through the means of yoga.",
            "200 hours of instructional yoga course that can do in one go or parts.",
            "To cultivate yoga and its practices in the individual for his health and wellbeing.",
          ],
        },
        {
          title: "Duration of this course",
          content: `The duration of this 200 hour of instructional yoga course can be complete in the span of 1 to 3 months. If you complete this entire course in one go, you will complete it in 1 month as a full-time course or complete it in 3 months as a part-time.`,
        },
        {
          title: "Eligibility Criteria:",
          items: [
            {
              label: "Personal attributes",
              text: "Individual needs to possess good communication skills, self-confidence, patience, and skills to understand the requirement and body language of the trainees.",
            },
            {
              label: "Academic qualification",
              text: "Trainee should have passed at least 10th std from a recognized board",
            },
            {
              label: "Age",
              text: "Age is no bar while applying for this yoga course.",
            },
            { label: "The medium of instruction", text: "English and Hindi." },
          ],
        },
        {
          title: "Evaluation",
          content: `After completing the level-1 yoga course, you will evaluate your performance on the various assessment given by the AYM yoga school in Rishikesh.`,
          extra:
            "Total marks distribution: 200 (Theory: 60 and Practical: 140)",
        },
        {
          title: "Syllabus",
          theory: [
            "Introduction to Yoga and Yogic Practices",
            "Introduction to Yoga Texts",
            "Yoga for Health Promotion",
          ],
          practical: [
            "Demonstration Skills",
            "Teaching Skills",
            "Application of knowledge",
            "Field Experience",
          ],
        },
      ],
    },
  },
  {
    id: "wellness",
    label: "Yoga Wellness Instructor",
    content: {
      intro: `Yoga wellness instructor is a Level-2 yoga instructor course for those practitioners who wants to start their career as a professional yoga instructor and want to teach yoga in groups or a school or a wellness center. This instructional yoga course is best for those who wish to impart yoga to individuals or in mass to promote health and wellness. This AYM yoga school-certified yoga wellness instructor course is for those who want to learn yoga practices under the guidance of our certified yoga teachers.`,
      affiliation: `This 400 hour level-2 yoga wellness instructor is a course registered with the yoga certification board, Government of India.`,
      sections: [
        {
          title: "Objectives of this course",
          bullets: [
            "To prepare the trainee for providing yoga and its teaching at the mass level.",
            "To prepare the trainee to start his career as a professional yoga teacher",
            "This yoga wellness instructor course is structure by AYM yoga school to provide basic knowledge of yoga and its physical, mental, and wellness practices in your daily life",
            "A 400-hour instructional yoga course for a yoga wellness instructor can be a full-time course and a part-time course.",
          ],
        },
        {
          title: "Duration of this course",
          content: `This 400 hour of level-2 yoga wellness course can be completed in the span of 3 months as a full-time course or you can complete this as a part-time course in the duration of 6 months.`,
        },
        {
          title: "Eligibility criteria:",
          items: [
            {
              label: "Personal attributes",
              text: "The candidate should possess certain qualities such as confidence, self-discipline, patience, compassion and have a good command over the language so that one can teach with confidence.",
            },
            {
              label: "Academic qualification",
              text: "To pursue this course candidate should have completed his 12 th standard from a recognized board.",
            },
            {
              label: "Age",
              text: "Age is no bar while applying for this yoga course.",
            },
            { label: "The medium of instruction", text: "English and Hindi." },
          ],
        },
        {
          title: "Evaluation",
          content: `After the successful completion of this course your performance will be evaluated on the basis of your performance by AYM yoga school in Rishikesh.`,
          extra:
            "Total marks distribution: 200 (Theory: 60 and Practical: 140)",
        },
        {
          title: "Syllabus",
          theory: [
            "Introduction to Yoga and Yogic Practices",
            "Introduction to Yoga Texts",
            "Yoga for health and wellness",
          ],
          practical: [
            "Demonstration of your yogic skills",
            "Demonstration of your teaching skill",
            "Your applied knowledge",
            "Your field experience",
          ],
        },
      ],
    },
  },
  {
    id: "teacher",
    label: "Yoga Teacher and Evaluator",
    content: {
      intro: `AYM yoga school in Rishikesh has 800 hours of level-3 yoga teacher and evaluator vocational yoga course in accreditation with yoga certification board, Government of India. 800 hour of instructional yoga course is for practitioners looking forward to starting their careers as master yoga trainers in the premier yoga institution, yoga studios, college, universities, etc. Also, the practitioner will be able to work as an evaluator for yoga professionals and work as a master trainer for yoga teacher training programs.`,
      extra: `This 800 hour of training program by AYM yoga school in Rishikesh will train you as a master trainer of yoga and its practices.`,
      affiliation: `800 hours of level-3 yoga teacher and evaluator course is registered with yoga certification board.`,
      sections: [
        {
          title: "Objectives of this course",
          bullets: [
            "To prepare the student to teach yoga as a master yoga trainer so that he/she can teach yoga at apremier yoga institute.",
            "This 800 hour level-3 yoga teacher and evaluator training program structure by AYM yoga school in ishikesh will provide you with the all the knowledge of yoga and its practices. It will help you to master these skills and impart them in your life as well as your student's life.",
            "800 hour level-3 yoga course can be completed by the practitioner as a full-time course and also as a part-time course.",
          ],
        },
        {
          title: "Duration of this course",
          content: `One can complete this course in the duration of 9 months as a fulltime course. As a part-time: 15 months`,
        },
        {
          title: "Eligibility criteria:",
          items: [
            {
              label: "Age",
              text: "Age is no bar while applying for this yoga course.",
            },
            {
              label: "Personal qualification",
              text: "To take admission in this course the candidate should be graduate from a recognized college or university. However, there can be any other criteria of yoga institution they can impart.",
            },
            {
              label: "Personal attributes",
              text: "This vocational job requires the candidate to posses certain qualities such as good communication skill, active listening, confidence, patience, time management, command on the language, analytical skills, ability to engage with students and skills to teach students with care and dedication.",
            },
            { label: "The medium of instruction", text: "English and Hindi." },
          ],
        },
        {
          title: "Evaluation",
          content: `After the successful completion of this course your performance will be evaluated on the basis of your performance by AYM yoga school in Rishikesh.`,
          extra:
            "Total marks distribution: 200 (Theory: 60 and Practical: 140)",
        },
        {
          title: "Syllabus",
          theory: [
            "Introduction of yoga and its practices",
            "Brief introduction of yogic text",
            "Yoga and health",
            "Applied yoga knowledge",
          ],
          practical: [
            "Demonstration of your yogic skills",
            "Demonstration of your teaching skill",
            "Evaluation skills",
            "Your field experience",
            "Application of your yogic knowledge",
          ],
        },
      ],
    },
  },
  {
    id: "master",
    label: "Yoga Master",
    content: {
      isYogaMaster: true,
      title: "Yoga Master",
      details: [
        { label: "Name of the Certification", text: "Yoga Master (YM)" },
      ],
      eligibility: [
        "For open candidates there is no eligibility criteria",
        "For admission in the course it is suggested that the candidate should be graduate in any stream from a recognized University or equivalent. However, the Yoga Institutions can define their own eligibility.",
      ],
      extraDetails: [
        { label: "Minimum age", text: "No age limit" },
        { label: "Credit points for certificate", text: "92 credits" },
        { label: "Duration of course", text: "Not less than 1600 hours." },
        {
          label: "Mark Distribution",
          text: "Total Marks: 200 (Theory: 120+Practical: 80)",
        },
        {
          label: "Mode of Certification",
          text: "Offline / Online ( All sessions will be online LIVE on zoom platform and we will share the session recording also)",
        },
        { label: "Start Date", text: "Every Month" },
      ],
      contact:
        "For further information, you can please visit (www.indianyogaassociation.com) or contact on: +91-7500277709",
      syllabus: {
        theory: [
          "Philosophical Foundation of Yoga - 30 Marks",
          "Principles and Practices of Yoga in Traditional Texts - 30 Marks",
          "Allied Science - 30 Marks",
          "Applied Yoga - 30",
        ],
        practical: [
          "Demonstration Skills - 15",
          "Teaching Skills - 15",
          "Evaluation Skills - 20",
          "Application of knowledge - 20",
          "Field Experience - 10",
        ],
      },
    },
  },
];

// ── Certification cards ────────────────────────────────────────────
const certCards = [
  {
    title: "YOGA MASTER",
    exam: "Online / Offline.",
    fee: "10500 INR / 8500 INR",
  },
  {
    title: "ASSISTANT YOGA THERAPIST",
    exam: "Online / Offline.",
    fee: "9500 INR / 7500 INR",
  },
  {
    title: "YOGA THERAPIST",
    exam: "Online / Offline.",
    fee: "12500 INR / 10500 INR",
  },
];

// ── In-person courses ──────────────────────────────────────────────
const inPersonCourses = [
  {
    title: "24 Days - 200 Hour Yoga Course in Rishikesh",
    startDate: "03rd of Every Month",
    endDate: "27th of Every Month",
    duration: "24 Days",
    cert: "Yoga Certification Board - YCB.",
    accreditation: "Ministry of AYUSH, Government of India",
    fees: "35,000 INR",
    included: "Dormitory Accommodation + Food + Course Materials",
    image: image1,
  },
  {
    title: "28 Days - 400 Hour Yoga Course in Rishikesh",
    startDate: "01st of Every Month",
    endDate: "28th of Every Month",
    duration: "28 Days",
    cert: "Yoga Certification Board - YCB.",
    accreditation: "Ministry of AYUSH, Government of India",
    fees: "45,000 INR",
    included: "Dormitory Accommodation + Food + Course Materials",
    image: image2,
  },
  {
    title: "90 Days - 800 Hour Yoga Course in Rishikesh",
    startDate: "03rd of Every Month",
    endDate: "3 Months Program",
    duration: "90 Days",
    cert: "Yoga Certification Board - YCB.",
    accreditation: "Ministry of AYUSH, Government of India",
    fees: "1,20,000 INR",
    included: "Private Accommodation + Food + Course Materials",
    image: image3,
  },
];

// ── College courses ────────────────────────────────────────────────
const collegeCourses = [
  "Certificate Course in Yoga (6 months) - 15,000 INR",
  "PG Diploma in Yoga (1 year) - 25,000 INR",
  "M.A. in Yoga (2 years) - 25,000 INR / Year",
];

const maObjectives = [
  "To equip students with research-based yoga.",
  "To uplift the knowledge of yoga therapy for healing different diseases.",
  "To prepare students to open their own yoga centers.",
  "To prepare students for joining higher courses in yoga like Ph.D in Yoga.",
  "To provide them deep insight in yoga sutra of Patanjali, Bhagwat Gita, Hatha Yoga Pradapika and Gherund Samhita.",
];

// ── TabContent renderer ────────────────────────────────────────────
function TabContent({ tab }: { tab: (typeof tabs)[0] }) {
  const c = tab.content as any;

  if (c.isYogaMaster) {
    return (
      <div className={styles.tabPane}>
        <h3 className={styles.tabSectionTitle}>{c.title}</h3>
        {c.details.map((d: any, i: number) => (
          <p key={i} className={styles.tabBody}>
            <strong>{d.label}:</strong> {d.text}
          </p>
        ))}
        <p className={styles.tabLabel}>
          <strong>Requirement/ Eligibility:</strong>
        </p>
        <ol className={styles.tabOl}>
          {c.eligibility.map((e: string, i: number) => (
            <li key={i}>{e}</li>
          ))}
        </ol>
        {c.extraDetails.map((d: any, i: number) => (
          <p key={i} className={styles.tabBody}>
            <strong>{d.label}:</strong> {d.text}
          </p>
        ))}
        <p className={styles.tabBody}>{c.contact}</p>
        <h4 className={styles.tabSectionTitle}>Syllabus</h4>
        <div className={styles.syllabusGrid}>
          <div>
            <p className={styles.syllabusHead}>Theory</p>
            {c.syllabus.theory.map((t: string, i: number) => (
              <p key={i} className={styles.syllabusItem}>
                ✓{t}
              </p>
            ))}
          </div>
          <div>
            <p className={styles.syllabusHead}>Practical</p>
            {c.syllabus.practical.map((p: string, i: number) => (
              <p key={i} className={styles.syllabusItem}>
                ✓{p}
              </p>
            ))}
          </div>
        </div>
        <a href="#" className={styles.applyFullBtn}>
          Apply Now
        </a>
      </div>
    );
  }

  return (
    <div className={styles.tabPane}>
      <p className={styles.tabBody}>{c.intro}</p>
      {c.extra && <p className={styles.tabBody}>{c.extra}</p>}
      <p className={styles.tabBody}>
        <strong>Affiliation :</strong> {c.affiliation}
      </p>

      {c.sections.map((sec: any, i: number) => (
        <div key={i} className={styles.tabSection}>
          <h4 className={styles.tabSectionTitle}>{sec.title}</h4>

          {sec.content && <p className={styles.tabBody}>{sec.content}</p>}

          {sec.bullets && (
            <ul className={styles.tabUl}>
              {sec.bullets.map((b: string, j: number) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}

          {sec.extra && (
            <p className={styles.tabBody}>
              <strong>{sec.extra}</strong>
            </p>
          )}

          {sec.items &&
            sec.items.map((item: any, j: number) => (
              <p key={j} className={styles.tabBody}>
                <strong>{item.label}:</strong> {item.text}
              </p>
            ))}

          {sec.theory && (
            <div className={styles.syllabusGrid}>
              <div>
                <p className={styles.syllabusHead}>Theory</p>
                {sec.theory.map((t: string, j: number) => (
                  <p key={j} className={styles.syllabusItem}>
                    ✓{t}
                  </p>
                ))}
              </div>
              <div>
                <p className={styles.syllabusHead}>Practical</p>
                {sec.practical.map((p: string, j: number) => (
                  <p key={j} className={styles.syllabusItem}>
                    ✓{p}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <a href="#" className={styles.applySmallBtn}>
        Apply Now
      </a>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function YogaCollegeRishikesh() {
  const [activeTab, setActiveTab] = useState("protocol");

  return (
    <div className={styles.page}>
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
      {/* ══════════════════════════════════════
          SECTION 1 — Hero image gallery (Screenshot 1)
      ══════════════════════════════════════ */}
      <section className={styles.heroSection1}>
        <div className={styles.container}>
          <h2 className={styles.heroTitle}>Yoga College in Rishikesh</h2>
          <div className={styles.heroUnderline} />
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2–5 — YCB Tabs (Screenshots 2,3,4,5)
      ══════════════════════════════════════ */}
      <section className={`${styles.tabSection} ${styles.tabsectionmain}`}>
        <div className={styles.container}>
          {/* Tab headers */}
          <div className={styles.tabHeaders}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={styles.tabContent}>
            {tabs.map((tab) =>
              activeTab === tab.id ? (
                <TabContent key={tab.id} tab={tab} />
              ) : null,
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — Certification Cards + OM divider (Screenshot 6 top)
      ══════════════════════════════════════ */}
      <section className={styles.certSection}>
        <div className={styles.container}>
          <div className={styles.omDivider}>
            <span className={styles.omLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.omLine} />
          </div>
          <div className={styles.certGrid}>
            {certCards.map((card, i) => (
              <div key={i} className={styles.certCard}>
                <h3 className={styles.certTitle}>{card.title}</h3>
                <div className={styles.certRow}>
                  <span className={styles.certLabel}>Exam:</span> {card.exam}
                </div>
                <div className={styles.certRow}>
                  <span className={styles.certLabel}>Fee:</span> {card.fee}
                </div>
                <div className={styles.certBtns}>
                  <a href="#" className={styles.certBtnOutline}>
                    More Details
                  </a>
                  <a href="#" className={styles.certBtnFill}>
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 7–9 — In-Person Courses (Screenshots 6b, 7, 8)
      ══════════════════════════════════════ */}
      {inPersonCourses.map((course, i) => (
        <section key={i} className={styles.courseSection}>
          <div className={styles.container}>
            <div className={styles.omDivider}>
              <span className={styles.omLine} />
              <span className={styles.omSymbol}>ॐ</span>
              <span className={styles.omLine} />
            </div>
            <h3 className={styles.courseSectionTitle}>{course.title}</h3>
            <div className={styles.courseUnderline} />
            <div className={styles.courseRow}>
              <div className={styles.courseDetails}>
                <p>
                  <strong>Start Date:</strong> {course.startDate}
                </p>
                <p>
                  <strong>End Date:</strong> {course.endDate}
                </p>
                <p>
                  <strong>Duration:</strong> {course.duration}
                </p>
                <p>
                  <strong>Certification:</strong> {course.cert}
                </p>
                <p>
                  <strong>Accreditation:</strong> {course.accreditation}
                </p>
                <p>
                  <strong>Fees:</strong> {course.fees}
                </p>
                <p>
                  <strong>Included:</strong> {course.included}
                </p>
                <a href="#" className={styles.bookSpotBtn}>
                  Book Your Spot
                </a>
              </div>
              <div className={styles.courseImageWrap}>
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className={styles.courseImg}
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ══════════════════════════════════════
          SECTION 10 — Yoga College info (Screenshot 9)
      ══════════════════════════════════════ */}
      <section className={styles.collegeSection}>
        <div className={styles.container}>
          <div className={styles.omDivider}>
            <span className={styles.omLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.omLine} />
          </div>

          <p className={styles.collegePara}>
            AYM Yoga College was established on 21 June 2016 to spread the
            quality of higher yoga education in India. We are honored to inform
            everyone that AYM Yoga institutions has started AYM Yoga College
            (Yoga Mahavidhyalaya) in Rishikesh, India. The specialty of this
            college will be quality of teaching, research-oriented educational
            classes, participation of students in research projects, latest and
            up to date yoga and meditational practices, debates on yoga and
            meditational topics, guest lectures by known personalities from the
            field of yoga and meditation, job placements on national and
            international level.
          </p>

          <h3 className={styles.collegeSubTitle}>
            Courses offered by AYM Yoga College
          </h3>
          <div className={styles.courseUnderline} />
          <ol className={styles.collegeList}>
            {collegeCourses.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>

          <h3 className={styles.collegeSubTitle}>
            Master of Science in Yoga / Master of Yoga (M.A. Yoga) Objectives
          </h3>
          <div className={styles.courseUnderline} />
          <ol className={styles.collegeList}>
            {maObjectives.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 11 — MA Eligibility + How to Apply + Career (Screenshot 10)
      ══════════════════════════════════════ */}
      <section className={styles.maSection}>
        <div className={styles.container}>
          <h3 className={styles.collegeSubTitle}>
            Eligibility for M.A. - Yoga / PG-Dimploma
          </h3>
          <div className={styles.courseUnderline} />
          <p className={styles.collegePara}>
            Bachelor's Degree from any University in any subject.
          </p>
          <div className={styles.maDetails}>
            <p>
              <strong>Duration :</strong> 2 years
            </p>
            <p>
              <strong>Starting Date for Session :</strong> Addmission Open
            </p>
            <p>
              <strong>Cousre Fee : -</strong> 25,000 INR / Year.
            </p>
            <p>
              <strong>Types of Accommodations available :</strong> Dormitory,
              shared and single rooms. You will have to apply for the choice of
              accommodation at the time of admission.
            </p>
          </div>

          <h3 className={styles.collegeSubTitle}>
            How to Apply - Yoga College
          </h3>
          <div className={styles.courseUnderline} />
          <p className={styles.collegePara}>
            You can buy the prospectus for MA and PG Diploma from AYM Yoga
            College office and submit it on given date along with admission fee.
            Admission will be based as per Uttarakhand Sanskrit University
            norms.
          </p>

          <h3 className={styles.collegeSubTitle}>
            Career Option after completion of Diploma &amp; Masters
          </h3>
          <div className={styles.courseUnderline} />
          <p className={styles.collegePara}>
            The courses of Yoga and Meditation open a vast possibility and
            opportunities for job seeking aspirants. After completion of course,
            people can work in hospitals, health centers, health clubs or can
            practice on their own as yoga and meditation experts. They are also
            free to teach the same in colleges and universities. They can also
            start their career as research associate/scholar, research analyst,
            consultant, freelancer or even certified instructor. There are
            vacancies in yoga, meditation and other related fields, which keep
            appearing online and offline and one needs to keep oneself updated
            to get the job of interest. One can also start own work by becoming
            health advisor/counsellor and can offer people, their expert advice
            and services. Thus, this course has great potential when it comes to
            having good career prospects.
          </p>
        </div>
      </section>
      <HowToReach />
    </div>
  );
}

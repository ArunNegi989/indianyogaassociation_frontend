"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Yogacollegeadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface TextItem { text: string; }
interface LabelTextItem { label: string; text: string; }
interface LabelValItem { label: string; val: string; }

interface RegularCourseTab {
  label: string;
  hours: string;
  introText: string;
  extraText: string;
  affiliationText: string;
  aimObjectiveContent: string;
  aimObjectiveBullets: TextItem[];
  durationContent: string;
  eligibilityItems: LabelTextItem[];
  evaluationContent: string;
  evaluationExtra: string;
  syllabusTheory: TextItem[];
  syllabusPractical: TextItem[];
}

interface YogaMasterTab {
  label: string;
  hours: string;
  title: string;
  details: LabelTextItem[];
  eligibility: TextItem[];
  extraDetails: LabelTextItem[];
  contact: string;
  syllabusTheory: TextItem[];
  syllabusPractical: TextItem[];
}

interface CertCardItem { title: string; exam: string; fee: string; icon: string; }

interface InPersonCourseItem {
  title: string;
  startDate: string;
  endDate: string;
  duration: string;
  cert: string;
  accreditation: string;
  fees: string;
  included: string;
  badge: string;
  color: string;
  imageAlt: string;
  image?: string;
  _preview?: string;
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;
  heroTitle: string;
  heroSubtitle: string;

  // Shared aim images (used across the 3 regular course tabs)
  aimImage1Alt: string;
  _aimImage1Preview?: string;
  aimImage2Alt: string;
  _aimImage2Preview?: string;
  aimImage3Alt: string;
  _aimImage3Preview?: string;

  // Intro & Highlight Images
  introImageAlt: string;
  _introImagePreview?: string;
  highlightImageAlt: string;
  _highlightImagePreview?: string;

  // 3 regular course tabs
  protocolTab: RegularCourseTab;
  wellnessTab: RegularCourseTab;
  teacherTab: RegularCourseTab;

  // Yoga master tab
  masterTab: YogaMasterTab;

  // Full-width highlight section
  highlightBadge: string;
  highlightTitle: string;
  highlightSubtitle: string;

  // Certification section
  certSectionLabel: string;
  certSectionTitle: string;
  certCards: CertCardItem[];

  // In-person courses section
  coursesSectionLabel: string;
  coursesSectionTitle: string;
  coursesSectionSub: string;
  inPersonCourses: InPersonCourseItem[];

  // College section
  collegeSectionLabel: string;
  collegeHeading: string;
  collegeParagraph: string;
  collegeHighlights: TextItem[];
  collegeImageAlt: string;
  _collegeImagePreview?: string;
  collegeImageBadge: string;

  collegeCoursesHeading: string;
  collegeCourses: TextItem[];

  maObjectivesHeading: string;
  maObjectives: TextItem[];
  maObjectivesImageAlt: string;
  _maObjectivesImagePreview?: string;
  maObjectivesImageBadge: string;

  // MA Eligibility section
  admissionsSectionLabel: string;
  maEligibilityHeading: string;
  maEligibilityParagraph: string;
  maDetailsGrid: LabelValItem[];
  howToApplyHeading: string;
  howToApplyParagraph: string;

  // Career section
  careerSectionLabel: string;
  careerHeading: string;
  careerParagraphs: TextItem[];
  careerOptions: TextItem[];
  careerImageAlt: string;
  _careerImagePreview?: string;
  careerImageBadge: string;

  // CTA Links
  applyNowLink: string;
  bookNowLink: string;
  moreDetailsLink: string;
}

const INITIAL_REGULAR = (label: string, hours: string): RegularCourseTab => ({
  label,
  hours,
  introText: "",
  extraText: "",
  affiliationText: "",
  aimObjectiveContent: "",
  aimObjectiveBullets: [{ text: "" }],
  durationContent: "",
  eligibilityItems: [
    { label: "Personal attributes", text: "" },
    { label: "Academic qualification", text: "" },
    { label: "Age", text: "" },
    { label: "Medium of instruction", text: "English and Hindi." },
  ],
  evaluationContent: "",
  evaluationExtra: "Total marks distribution: 200 (Theory: 60 and Practical: 140)",
  syllabusTheory: [{ text: "" }],
  syllabusPractical: [{ text: "" }],
});

const INITIAL: FormData = {
  heroImageAlt: "Yoga College in Rishikesh",
  heroTitle: "Yoga College in Rishikesh",
  heroSubtitle: "AYM Yoga School — Ministry of AYUSH Certified Programs",

  aimImage1Alt: "Yoga practice 1",
  aimImage2Alt: "Yoga practice 2",
  aimImage3Alt: "Yoga practice 3",

  introImageAlt: "Yoga practice intro",
  highlightImageAlt: "Live yoga classes highlight",

  protocolTab: {
    ...INITIAL_REGULAR("Yoga Protocol Instructor", "200 HRS"),
    introText:
      "Yoga protocol instructor is a basic level of certification provided by AYM yoga school in Rishikesh for practitioners seeking a basic knowledge of yoga and its practices (yoga asanas) under the guidance of experienced yoga teachers. It is the best foundational yoga course for the practitioner who wants to teach yoga at the group level or an individual class.",
    extraText:
      "Additionally, this certification focuses on enhancing teaching skills, including class sequencing, communication, and student handling. Participants learn how to create a safe and supportive environment for beginners, making yoga accessible to people of all age groups. By the end of the course, students not only gain essential knowledge but also develop the ability to conduct group sessions effectively with clarity and confidence.",
    affiliationText:
      "The yoga certification board accredits this 200-hour level-1 instructional yoga course by AYM yoga school in rishikesh.",
    aimObjectiveContent:
      "To teach basic yoga at the group level in parks, community-level on/off the occasion of international yoga day.",
    aimObjectiveBullets: [
      { text: "To promote health and wellness through the means of yoga." },
      { text: "200 hours of instructional yoga course that can do in one go or parts." },
      { text: "To cultivate yoga and its practices in the individual for his health and wellbeing." },
    ],
    durationContent:
      "The duration of this 200 hour of instructional yoga course can be complete in the span of 1 to 3 months. If you complete this entire course in one go, you will complete it in 1 month as a full-time course or complete it in 3 months as a part-time.",
    eligibilityItems: [
      { label: "Personal attributes", text: "Individual needs to possess good communication skills, self-confidence, patience, and skills to understand the requirement and body language of the trainees." },
      { label: "Academic qualification", text: "Trainee should have passed at least 10th std from a recognized board" },
      { label: "Age", text: "Age is no bar while applying for this yoga course." },
      { label: "Medium of instruction", text: "English and Hindi." },
    ],
    evaluationContent:
      "After completing the level-1 yoga course, you will evaluate your performance on the various assessment given by the AYM yoga school in Rishikesh.",
    syllabusTheory: [
      { text: "Introduction to Yoga and Yogic Practices" },
      { text: "Introduction to Yoga Texts" },
      { text: "Yoga for Health Promotion" },
    ],
    syllabusPractical: [
      { text: "Demonstration Skills" },
      { text: "Teaching Skills" },
      { text: "Application of knowledge" },
      { text: "Field Experience" },
    ],
  },

  wellnessTab: {
    ...INITIAL_REGULAR("Yoga Wellness Instructor", "400 HRS"),
    introText:
      "Yoga wellness instructor is a Level-2 yoga instructor course for those practitioners who wants to start their career as a professional yoga instructor and want to teach yoga in groups or a school or a wellness center.",
    extraText:
      "Additionally, this course deepens the understanding of yoga by introducing advanced asanas, pranayama techniques, and meditation practices. It helps practitioners refine their alignment, improve teaching methodology, and gain confidence in handling diverse groups of students with different needs and abilities.",
    affiliationText:
      "This 400 hour level-2 yoga wellness instructor is a course registered with the yoga certification board, Government of India.",
    aimObjectiveContent: "",
    aimObjectiveBullets: [
      { text: "To prepare the trainee for providing yoga and its teaching at the mass level." },
      { text: "To prepare the trainee to start his career as a professional yoga teacher" },
      { text: "This yoga wellness instructor course is structured by AYM yoga school to provide basic knowledge of yoga and its physical, mental, and wellness practices in your daily life" },
      { text: "A 400-hour instructional yoga course for a yoga wellness instructor can be a full-time course and a part-time course." },
    ],
    durationContent:
      "This 400 hour of level-2 yoga wellness course can be completed in the span of 3 months as a full-time course or you can complete this as a part-time course in the duration of 6 months.",
    eligibilityItems: [
      { label: "Personal attributes", text: "The candidate should possess certain qualities such as confidence, self-discipline, patience, compassion and have a good command over the language so that one can teach with confidence." },
      { label: "Academic qualification", text: "To pursue this course candidate should have completed his 12th standard from a recognized board." },
      { label: "Age", text: "Age is no bar while applying for this yoga course." },
      { label: "Medium of instruction", text: "English and Hindi." },
    ],
    evaluationContent:
      "After the successful completion of this course your performance will be evaluated on the basis of your performance by AYM yoga school in Rishikesh.",
    syllabusTheory: [
      { text: "Introduction to Yoga and Yogic Practices" },
      { text: "Introduction to Yoga Texts" },
      { text: "Yoga for health and wellness" },
    ],
    syllabusPractical: [
      { text: "Demonstration of your yogic skills" },
      { text: "Demonstration of your teaching skill" },
      { text: "Your applied knowledge" },
      { text: "Your field experience" },
    ],
  },

  teacherTab: {
    ...INITIAL_REGULAR("Yoga Teacher & Evaluator", "800 HRS"),
    introText:
      "AYM yoga school in Rishikesh has 800 hours of level-3 yoga teacher and evaluator vocational yoga course in accreditation with yoga certification board, Government of India.",
    extraText:
      "This 800 hour of training program by AYM yoga school in Rishikesh will train you as a master trainer of yoga and its practices.",
    affiliationText:
      "800 hours of level-3 yoga teacher and evaluator course is registered with yoga certification board.",
    aimObjectiveContent: "",
    aimObjectiveBullets: [
      { text: "To prepare the student to teach yoga as a master yoga trainer so that he/she can teach yoga at a premier yoga institute." },
      { text: "This 800 hour level-3 yoga teacher and evaluator training program by AYM yoga school in Rishikesh will provide you with all the knowledge of yoga and its practices." },
      { text: "800 hour level-3 yoga course can be completed by the practitioner as a full-time course and also as a part-time course." },
    ],
    durationContent: "One can complete this course in the duration of 9 months as a fulltime course. As a part-time: 15 months",
    eligibilityItems: [
      { label: "Age", text: "Age is no bar while applying for this yoga course." },
      { label: "Personal qualification", text: "To take admission in this course the candidate should be graduate from a recognized college or university." },
      { label: "Personal attributes", text: "This vocational job requires good communication skill, active listening, confidence, patience, time management, command on the language, analytical skills, and ability to engage with students." },
      { label: "Medium of instruction", text: "English and Hindi." },
    ],
    evaluationContent:
      "After the successful completion of this course your performance will be evaluated on the basis of your performance by AYM yoga school in Rishikesh.",
    syllabusTheory: [
      { text: "Introduction of yoga and its practices" },
      { text: "Brief introduction of yogic text" },
      { text: "Yoga and health" },
      { text: "Applied yoga knowledge" },
    ],
    syllabusPractical: [
      { text: "Demonstration of your yogic skills" },
      { text: "Demonstration of your teaching skill" },
      { text: "Evaluation skills" },
      { text: "Your field experience" },
      { text: "Application of your yogic knowledge" },
    ],
  },

  masterTab: {
    label: "Yoga Master",
    hours: "1600 HRS",
    title: "Yoga Master",
    details: [{ label: "Name of the Certification", text: "Yoga Master (YM)" }],
    eligibility: [
      { text: "For open candidates there is no eligibility criteria" },
      { text: "For admission in the course it is suggested that the candidate should be graduate in any stream from a recognized University or equivalent. However, the Yoga Institutions can define their own eligibility." },
    ],
    extraDetails: [
      { label: "Minimum age", text: "No age limit" },
      { label: "Credit points for certificate", text: "92 credits" },
      { label: "Duration of course", text: "Not less than 1600 hours." },
      { label: "Mark Distribution", text: "Total Marks: 200 (Theory: 120 + Practical: 80)" },
      { label: "Mode of Certification", text: "Offline / Online (All sessions will be online LIVE on zoom platform and we will share the session recording also)" },
      { label: "Start Date", text: "Every Month" },
    ],
    contact: "For further information, you can please visit (www.indianyogaassociation.com) or contact on: +91-7500277709",
    syllabusTheory: [
      { text: "Philosophical Foundation of Yoga - 30 Marks" },
      { text: "Principles and Practices of Yoga in Traditional Texts - 30 Marks" },
      { text: "Allied Science - 30 Marks" },
      { text: "Applied Yoga - 30" },
    ],
    syllabusPractical: [
      { text: "Demonstration Skills - 15" },
      { text: "Teaching Skills - 15" },
      { text: "Evaluation Skills - 20" },
      { text: "Application of knowledge - 20" },
      { text: "Field Experience - 10" },
    ],
  },

  highlightBadge: "Live Yoga Classes",
  highlightTitle: "Experience the Energy of Rishikesh",
  highlightSubtitle: "Watch our students transform their practice in the yoga capital of the world",

  certSectionLabel: "Examinations",
  certSectionTitle: "Yoga Certification Exams",
  certCards: [
    { title: "YOGA MASTER", exam: "Online / Offline.", fee: "10500 INR / 8500 INR", icon: "🏆" },
    { title: "ASSISTANT YOGA THERAPIST", exam: "Online / Offline.", fee: "9500 INR / 7500 INR", icon: "🌿" },
    { title: "YOGA THERAPIST", exam: "Online / Offline.", fee: "12500 INR / 10500 INR", icon: "✨" },
  ],

  coursesSectionLabel: "In-Person Courses",
  coursesSectionTitle: "Yoga Courses in Rishikesh",
  coursesSectionSub: "Ministry of AYUSH certified programs with accommodation, meals & certification included",
  inPersonCourses: [
    {
      title: "24 Days — 200 Hour Yoga Course in Rishikesh",
      startDate: "03rd of Every Month",
      endDate: "27th of Every Month",
      duration: "24 Days",
      cert: "Yoga Certification Board — YCB",
      accreditation: "Ministry of AYUSH, Government of India",
      fees: "35,000 INR",
      included: "Dormitory Accommodation + Food + Course Materials",
      badge: "Level 1",
      color: "#F15505",
      imageAlt: "200 Hour Yoga Course in Rishikesh",
    },
    {
      title: "28 Days — 400 Hour Yoga Course in Rishikesh",
      startDate: "01st of Every Month",
      endDate: "28th of Every Month",
      duration: "28 Days",
      cert: "Yoga Certification Board — YCB",
      accreditation: "Ministry of AYUSH, Government of India",
      fees: "45,000 INR",
      included: "Dormitory Accommodation + Food + Course Materials",
      badge: "Level 2",
      color: "#b8860b",
      imageAlt: "400 Hour Yoga Course in Rishikesh",
    },
    {
      title: "90 Days — 800 Hour Yoga Course in Rishikesh",
      startDate: "03rd of Every Month",
      endDate: "3 Months Program",
      duration: "90 Days",
      cert: "Yoga Certification Board — YCB",
      accreditation: "Ministry of AYUSH, Government of India",
      fees: "1,20,000 INR",
      included: "Private Accommodation + Food + Course Materials",
      badge: "Level 3",
      color: "#1a4a4a",
      imageAlt: "800 Hour Yoga Course in Rishikesh",
    },
  ],

  collegeSectionLabel: "About AYM Yoga College",
  collegeHeading: "About AYM Yoga College",
  collegeParagraph:
    "AYM Yoga College was established on 21 June 2016 to spread the quality of higher yoga education in India. We are honored to inform everyone that AYM Yoga institutions has started AYM Yoga College (Yoga Mahavidhyalaya) in Rishikesh, India. The specialty of this college will be quality of teaching, research-oriented educational classes, participation of students in research projects, latest and up to date yoga and meditational practices, debates on yoga and meditational topics, guest lectures by known personalities from the field of yoga and meditation, job placements on national and international level.",
  collegeHighlights: [
    { text: "Quality Teaching" },
    { text: "Research-Oriented" },
    { text: "Guest Lectures" },
    { text: "Job Placement" },
  ],
  collegeImageAlt: "AYM Yoga College Rishikesh",
  collegeImageBadge: "Est. 2016",

  collegeCoursesHeading: "Courses Offered by AYM Yoga College",
  collegeCourses: [
    { text: "Certificate Course in Yoga (6 months) — 15,000 INR" },
    { text: "PG Diploma in Yoga (1 year) — 25,000 INR" },
    { text: "M.A. in Yoga (2 years) — 25,000 INR / Year" },
  ],

  maObjectivesHeading: "Master of Yoga (M.A. Yoga) — Objectives",
  maObjectives: [
    { text: "To equip students with research-based yoga." },
    { text: "To uplift the knowledge of yoga therapy for healing different diseases." },
    { text: "To prepare students to open their own yoga centers." },
    { text: "To prepare students for joining higher courses in yoga like Ph.D in Yoga." },
    { text: "To provide them deep insight in yoga sutra of Patanjali, Bhagwat Gita, Hatha Yoga Pradapika and Gherund Samhita." },
  ],
  maObjectivesImageAlt: "M.A. Yoga Program",
  maObjectivesImageBadge: "M.A. Yoga",

  admissionsSectionLabel: "Admissions",
  maEligibilityHeading: "Eligibility for M.A. Yoga / PG Diploma",
  maEligibilityParagraph: "Bachelor's Degree from any University in any subject.",
  maDetailsGrid: [
    { label: "Duration", val: "2 years" },
    { label: "Session Start", val: "Admission Open" },
    { label: "Course Fee", val: "25,000 INR / Year" },
    { label: "Accommodation", val: "Dormitory, Shared & Single rooms" },
  ],
  howToApplyHeading: "How to Apply",
  howToApplyParagraph:
    "You can buy the prospectus for MA and PG Diploma from AYM Yoga College office and submit it on given date along with admission fee. Admission will be based as per Uttarakhand Sanskrit University norms.",

  careerSectionLabel: "Career Prospects",
  careerHeading: "Career Option after Diploma & Masters",
  careerParagraphs: [
    { text: "The courses of Yoga and Meditation open a vast possibility and opportunities for job seeking aspirants. After completion of course, people can work in hospitals, health centers, health clubs or can practice on their own as yoga and meditation experts. They are also free to teach the same in colleges and universities." },
    { text: "They can also start their career as research associate/scholar, research analyst, consultant, freelancer or even certified instructor. There are vacancies in yoga, meditation and other related fields, which keep appearing online and offline and one needs to keep oneself updated to get the job of interest." },
    { text: "One can also start own work by becoming health advisor/counsellor and can offer people, their expert advice and services. Thus, this course has great potential when it comes to having good career prospects." },
  ],
  careerOptions: [
    { text: "Hospital & Health Centers" },
    { text: "Yoga Studios" },
    { text: "Colleges & Universities" },
    { text: "Research Scholar" },
    { text: "Freelancer / Consultant" },
    { text: "Own Yoga Center" },
  ],
  careerImageAlt: "Career options after yoga diploma",
  careerImageBadge: "Career Options",

  applyNowLink: "/yoga-registration",
  bookNowLink: "/yoga-registration",
  moreDetailsLink: "/",
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const joditConfig = {
  readonly: false,
  height: 160,
  toolbarAdaptive: false,
  buttons: [
    "bold", "italic", "underline", "|",
    "font", "fontsize", "brush", "|",
    "paragraph", "|", "ul", "ol", "|", "align", "|",
    "link", "unlink", "|", "undo", "redo", "|", "eraser", "fullsize",
  ],
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
  style: { fontFamily: "inherit", fontSize: "15px" },
};

/* ─────────────────────── Reusable: single rich-text field ─────────────────────── */
function RichTextField({
  control,
  name,
  label,
  required = false,
}: {
  control: Control<FormData, any>;
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.editorWrap}>
        <Controller
          name={name as any}
          control={control}
          rules={required ? { required: true } : undefined}
          render={({ field }) => (
            <JoditEditor value={field.value as string} config={joditConfig} onBlur={(c) => field.onChange(c)} />
          )}
        />
      </div>
    </div>
  );
}

/* ─────────────────────── Reusable: plain-text repeatable list ─────────────────────── */
function TextItemList({
  control,
  register,
  name,
  label,
  placeholder,
  max = 10,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  name: string;
  label: string;
  placeholder?: string;
  max?: number;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/{max}</span>
      </div>
      <div className={styles.itemsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{index + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={placeholder || "Text"}
                  {...register(`${name}.${index}.text` as any, { required: true })}
                />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => remove(index)} disabled={fields.length <= 1}>
              ✕
            </button>
          </div>
        ))}
      </div>
      {fields.length < max && (
        <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>
          + Add
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: label+text pair repeatable list ─────────────────────── */
function LabelTextList({
  control,
  register,
  name,
  label,
  max = 8,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  name: string;
  label: string;
  max?: number;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/{max}</span>
      </div>
      <div className={styles.itemsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{index + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Label"
                  {...register(`${name}.${index}.label` as any, { required: true })}
                />
              </div>
              <div className={styles.inputWrap}>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  rows={2}
                  placeholder="Text"
                  {...register(`${name}.${index}.text` as any, { required: true })}
                />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => remove(index)} disabled={fields.length <= 1}>
              ✕
            </button>
          </div>
        ))}
      </div>
      {fields.length < max && (
        <button type="button" className={styles.addBtn} onClick={() => append({ label: "", text: "" } as any)}>
          + Add
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: label+val pair repeatable list ─────────────────────── */
function LabelValList({
  control,
  register,
  name,
  label,
  max = 8,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  name: string;
  label: string;
  max?: number;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/{max}</span>
      </div>
      <div className={styles.itemsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{index + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.itemFieldsRow}>
                <div className={styles.inputWrap} style={{ flex: 1 }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Label"
                    {...register(`${name}.${index}.label` as any, { required: true })}
                  />
                </div>
                <div className={styles.inputWrap} style={{ flex: 1 }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Value"
                    {...register(`${name}.${index}.val` as any, { required: true })}
                  />
                </div>
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => remove(index)} disabled={fields.length <= 1}>
              ✕
            </button>
          </div>
        ))}
      </div>
      {fields.length < max && (
        <button type="button" className={styles.addBtn} onClick={() => append({ label: "", val: "" } as any)}>
          + Add
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: one regular course tab's fields ─────────────────────── */
function CourseTabFields({
  control,
  register,
  prefix,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  prefix: "protocolTab" | "wellnessTab" | "teacherTab";
}) {
  const bulletsArray = useFieldArray({ control, name: `${prefix}.aimObjectiveBullets` as any });
  const eligibilityArray = useFieldArray({ control, name: `${prefix}.eligibilityItems` as any });
  const theoryArray = useFieldArray({ control, name: `${prefix}.syllabusTheory` as any });
  const practicalArray = useFieldArray({ control, name: `${prefix}.syllabusPractical` as any });

  return (
    <div>
      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Tab Label</label>
          <div className={styles.inputWrap}>
            <input type="text" className={styles.input} placeholder="e.g. Yoga Protocol Instructor" {...register(`${prefix}.label` as any, { required: true })} />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Hours Badge</label>
          <div className={styles.inputWrap}>
            <input type="text" className={styles.input} placeholder="e.g. 200 HRS" {...register(`${prefix}.hours` as any, { required: true })} />
          </div>
        </div>
      </div>

      <RichTextField control={control} name={`${prefix}.introText`} label="Intro Paragraph" />
      <RichTextField control={control} name={`${prefix}.extraText`} label="Extra Paragraph" />

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Affiliation Text</label>
        <div className={styles.inputWrap}>
          <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register(`${prefix}.affiliationText` as any, { required: true })} />
        </div>
      </div>

      <div className={styles.formDivider} />

      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>Aim &amp; Objective</h3>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Aim/Objective Intro Text</label>
        <div className={styles.inputWrap}>
          <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register(`${prefix}.aimObjectiveContent` as any)} />
        </div>
      </div>
      <div className={styles.itemsList}>
        {bulletsArray.fields.map((field, i) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{i + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input type="text" className={styles.input} placeholder="Bullet point" {...register(`${prefix}.aimObjectiveBullets.${i}.text` as any, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => bulletsArray.remove(i)} disabled={bulletsArray.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addBtn} onClick={() => bulletsArray.append({ text: "" } as any)}>+ Add Bullet</button>

      <div className={styles.formDivider} />

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Duration Text</label>
        <div className={styles.inputWrap}>
          <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register(`${prefix}.durationContent` as any, { required: true })} />
        </div>
      </div>

      <div className={styles.formDivider} />

      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>Eligibility Criteria</h3>
        <span className={styles.sectionBadge}>{eligibilityArray.fields.length}/8</span>
      </div>
      <div className={styles.itemsList}>
        {eligibilityArray.fields.map((field, i) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{i + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input type="text" className={styles.input} placeholder="Label e.g. Age" {...register(`${prefix}.eligibilityItems.${i}.label` as any, { required: true })} />
              </div>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={2} placeholder="Text" {...register(`${prefix}.eligibilityItems.${i}.text` as any, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => eligibilityArray.remove(i)} disabled={eligibilityArray.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {eligibilityArray.fields.length < 8 && (
        <button type="button" className={styles.addBtn} onClick={() => eligibilityArray.append({ label: "", text: "" } as any)}>+ Add Eligibility Item</button>
      )}

      <div className={styles.formDivider} />

      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>Evaluation</h3>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Evaluation Text</label>
        <div className={styles.inputWrap}>
          <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register(`${prefix}.evaluationContent` as any, { required: true })} />
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Evaluation Extra (marks distribution)</label>
        <div className={styles.inputWrap}>
          <input type="text" className={styles.input} {...register(`${prefix}.evaluationExtra` as any, { required: true })} />
        </div>
      </div>

      <div className={styles.formDivider} />

      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>Syllabus — Theory</h3>
        <span className={styles.sectionBadge}>{theoryArray.fields.length}/12</span>
      </div>
      <div className={styles.itemsList}>
        {theoryArray.fields.map((field, i) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{i + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input type="text" className={styles.input} {...register(`${prefix}.syllabusTheory.${i}.text` as any, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => theoryArray.remove(i)} disabled={theoryArray.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {theoryArray.fields.length < 12 && (
        <button type="button" className={styles.addBtn} onClick={() => theoryArray.append({ text: "" } as any)}>+ Add Theory Topic</button>
      )}

      <div className={styles.formDivider} />

      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>Syllabus — Practical</h3>
        <span className={styles.sectionBadge}>{practicalArray.fields.length}/12</span>
      </div>
      <div className={styles.itemsList}>
        {practicalArray.fields.map((field, i) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{i + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input type="text" className={styles.input} {...register(`${prefix}.syllabusPractical.${i}.text` as any, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => practicalArray.remove(i)} disabled={practicalArray.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {practicalArray.fields.length < 12 && (
        <button type="button" className={styles.addBtn} onClick={() => practicalArray.append({ text: "" } as any)}>+ Add Practical Topic</button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function YogaCollegeAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [aimImage1File, setAimImage1File] = useState<File | null>(null);
  const [aimImage2File, setAimImage2File] = useState<File | null>(null);
  const [aimImage3File, setAimImage3File] = useState<File | null>(null);
  const [introImageFile, setIntroImageFile] = useState<File | null>(null);
  const [highlightImageFile, setHighlightImageFile] = useState<File | null>(null);
  const [collegeImageFile, setCollegeImageFile] = useState<File | null>(null);
  const [maObjectivesImageFile, setMaObjectivesImageFile] = useState<File | null>(null);
  const [careerImageFile, setCareerImageFile] = useState<File | null>(null);
  const [courseImageFiles, setCourseImageFiles] = useState<(File | null)[]>([null, null, null]);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "protocol" | "wellness" | "teacher" | "master" | "highlight" | "cert" | "courses" | "college" | "eligibility" | "career" | "links"
  >("hero");

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({ defaultValues: INITIAL, mode: "onChange" });

  const watchAll = watch();

  const certCardsArray = useFieldArray({ control, name: "certCards" });
  const inPersonCoursesArray = useFieldArray({ control, name: "inPersonCourses" });
  const masterDetailsArray = useFieldArray({ control, name: "masterTab.details" });
  const masterEligibilityArray = useFieldArray({ control, name: "masterTab.eligibility" });
  const masterExtraDetailsArray = useFieldArray({ control, name: "masterTab.extraDetails" });
  const masterTheoryArray = useFieldArray({ control, name: "masterTab.syllabusTheory" });
  const masterPracticalArray = useFieldArray({ control, name: "masterTab.syllabusPractical" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/yoga-college-section/${sectionId}`);
        const d = res.data.data;
        reset({
          ...INITIAL,
          ...d,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",
          _aimImage1Preview: d.aimImage1 ? getImageUrl(d.aimImage1) : "",
          _aimImage2Preview: d.aimImage2 ? getImageUrl(d.aimImage2) : "",
          _aimImage3Preview: d.aimImage3 ? getImageUrl(d.aimImage3) : "",
          _introImagePreview: d.introImage ? getImageUrl(d.introImage) : "",
          _highlightImagePreview: d.highlightImage ? getImageUrl(d.highlightImage) : "",
          _collegeImagePreview: d.collegeImage ? getImageUrl(d.collegeImage) : "",
          _maObjectivesImagePreview: d.maObjectivesImage ? getImageUrl(d.maObjectivesImage) : "",
          _careerImagePreview: d.careerImage ? getImageUrl(d.careerImage) : "",
          protocolTab: d.protocolTab?.label ? d.protocolTab : INITIAL.protocolTab,
          wellnessTab: d.wellnessTab?.label ? d.wellnessTab : INITIAL.wellnessTab,
          teacherTab: d.teacherTab?.label ? d.teacherTab : INITIAL.teacherTab,
          masterTab: d.masterTab?.title ? d.masterTab : INITIAL.masterTab,
          certCards: d.certCards?.length ? d.certCards : INITIAL.certCards,
          inPersonCourses: d.inPersonCourses?.length
            ? d.inPersonCourses.map((c: any) => ({ ...c, _preview: c.image ? getImageUrl(c.image) : "" }))
            : INITIAL.inPersonCourses,
          collegeHighlights: d.collegeHighlights?.length ? d.collegeHighlights.map((t: string) => ({ text: t })) : INITIAL.collegeHighlights,
          collegeCourses: d.collegeCourses?.length ? d.collegeCourses.map((t: string) => ({ text: t })) : INITIAL.collegeCourses,
          maObjectives: d.maObjectives?.length ? d.maObjectives.map((t: string) => ({ text: t })) : INITIAL.maObjectives,
          maDetailsGrid: d.maDetailsGrid?.length ? d.maDetailsGrid : INITIAL.maDetailsGrid,
          careerParagraphs: d.careerParagraphs?.length ? d.careerParagraphs.map((t: string) => ({ text: t })) : INITIAL.careerParagraphs,
          careerOptions: d.careerOptions?.length ? d.careerOptions.map((t: string) => ({ text: t })) : INITIAL.careerOptions,
        });
        setCourseImageFiles((d.inPersonCourses?.length ? d.inPersonCourses : INITIAL.inPersonCourses).map(() => null));
      } catch {
        toast.error("Failed to fetch yoga college section data");
        router.replace("/admin/yogacourse/ayush-course");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Image handlers ── */
  const makeImageHandler = (setFile: (f: File | null) => void, field: keyof FormData) => (file: File | null) => {
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue(field, e.target?.result as any);
    reader.readAsDataURL(file);
  };

  const handleHeroImage = makeImageHandler(setHeroFile, "_heroPreview");
  const handleAimImage1 = makeImageHandler(setAimImage1File, "_aimImage1Preview");
  const handleAimImage2 = makeImageHandler(setAimImage2File, "_aimImage2Preview");
  const handleAimImage3 = makeImageHandler(setAimImage3File, "_aimImage3Preview");
  const handleIntroImage = makeImageHandler(setIntroImageFile, "_introImagePreview");
  const handleHighlightImage = makeImageHandler(setHighlightImageFile, "_highlightImagePreview");
  const handleCollegeImage = makeImageHandler(setCollegeImageFile, "_collegeImagePreview");
  const handleMaObjectivesImage = makeImageHandler(setMaObjectivesImageFile, "_maObjectivesImagePreview");
  const handleCareerImage = makeImageHandler(setCareerImageFile, "_careerImagePreview");

  const handleCourseImage = (index: number, file: File | null) => {
    if (!file) return;
    setCourseImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    const reader = new FileReader();
    reader.onload = (e) => setValue(`inPersonCourses.${index}._preview`, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("heroTitle", data.heroTitle);
      formData.append("heroSubtitle", data.heroSubtitle);

      formData.append("aimImage1Alt", data.aimImage1Alt);
      formData.append("aimImage2Alt", data.aimImage2Alt);
      formData.append("aimImage3Alt", data.aimImage3Alt);

      formData.append("introImageAlt", data.introImageAlt);
      formData.append("highlightImageAlt", data.highlightImageAlt);

      formData.append(
        "protocolTab",
        JSON.stringify({ ...data.protocolTab, aimObjectiveBullets: data.protocolTab.aimObjectiveBullets.map((b) => b.text), syllabusTheory: data.protocolTab.syllabusTheory.map((b) => b.text), syllabusPractical: data.protocolTab.syllabusPractical.map((b) => b.text) })
      );
      formData.append(
        "wellnessTab",
        JSON.stringify({ ...data.wellnessTab, aimObjectiveBullets: data.wellnessTab.aimObjectiveBullets.map((b) => b.text), syllabusTheory: data.wellnessTab.syllabusTheory.map((b) => b.text), syllabusPractical: data.wellnessTab.syllabusPractical.map((b) => b.text) })
      );
      formData.append(
        "teacherTab",
        JSON.stringify({ ...data.teacherTab, aimObjectiveBullets: data.teacherTab.aimObjectiveBullets.map((b) => b.text), syllabusTheory: data.teacherTab.syllabusTheory.map((b) => b.text), syllabusPractical: data.teacherTab.syllabusPractical.map((b) => b.text) })
      );
      formData.append(
        "masterTab",
        JSON.stringify({
          ...data.masterTab,
          eligibility: data.masterTab.eligibility.map((b) => b.text),
          syllabusTheory: data.masterTab.syllabusTheory.map((b) => b.text),
          syllabusPractical: data.masterTab.syllabusPractical.map((b) => b.text),
        })
      );

      formData.append("highlightBadge", data.highlightBadge);
      formData.append("highlightTitle", data.highlightTitle);
      formData.append("highlightSubtitle", data.highlightSubtitle);

      formData.append("certSectionLabel", data.certSectionLabel);
      formData.append("certSectionTitle", data.certSectionTitle);
      formData.append("certCards", JSON.stringify(data.certCards));

      formData.append("coursesSectionLabel", data.coursesSectionLabel);
      formData.append("coursesSectionTitle", data.coursesSectionTitle);
      formData.append("coursesSectionSub", data.coursesSectionSub);
      formData.append(
        "inPersonCourses",
        JSON.stringify(
          data.inPersonCourses.map((c) => ({
            title: c.title, startDate: c.startDate, endDate: c.endDate, duration: c.duration,
            cert: c.cert, accreditation: c.accreditation, fees: c.fees, included: c.included,
            badge: c.badge, color: c.color, imageAlt: c.imageAlt, image: c.image,
          }))
        )
      );

      formData.append("collegeSectionLabel", data.collegeSectionLabel);
      formData.append("collegeHeading", data.collegeHeading);
      formData.append("collegeParagraph", data.collegeParagraph);
      formData.append("collegeHighlights", JSON.stringify(data.collegeHighlights.map((h) => h.text)));
      formData.append("collegeImageAlt", data.collegeImageAlt);
      formData.append("collegeImageBadge", data.collegeImageBadge);

      formData.append("collegeCoursesHeading", data.collegeCoursesHeading);
      formData.append("collegeCourses", JSON.stringify(data.collegeCourses.map((c) => c.text)));

      formData.append("maObjectivesHeading", data.maObjectivesHeading);
      formData.append("maObjectives", JSON.stringify(data.maObjectives.map((o) => o.text)));
      formData.append("maObjectivesImageAlt", data.maObjectivesImageAlt);
      formData.append("maObjectivesImageBadge", data.maObjectivesImageBadge);

      formData.append("admissionsSectionLabel", data.admissionsSectionLabel);
      formData.append("maEligibilityHeading", data.maEligibilityHeading);
      formData.append("maEligibilityParagraph", data.maEligibilityParagraph);
      formData.append("maDetailsGrid", JSON.stringify(data.maDetailsGrid));
      formData.append("howToApplyHeading", data.howToApplyHeading);
      formData.append("howToApplyParagraph", data.howToApplyParagraph);

      formData.append("careerSectionLabel", data.careerSectionLabel);
      formData.append("careerHeading", data.careerHeading);
      formData.append("careerParagraphs", JSON.stringify(data.careerParagraphs.map((p) => p.text)));
      formData.append("careerOptions", JSON.stringify(data.careerOptions.map((o) => o.text)));
      formData.append("careerImageAlt", data.careerImageAlt);
      formData.append("careerImageBadge", data.careerImageBadge);

      formData.append("applyNowLink", data.applyNowLink);
      formData.append("bookNowLink", data.bookNowLink);
      formData.append("moreDetailsLink", data.moreDetailsLink);

      if (heroFile) formData.append("heroImage", heroFile);
      if (aimImage1File) formData.append("aimImage1", aimImage1File);
      if (aimImage2File) formData.append("aimImage2", aimImage2File);
      if (aimImage3File) formData.append("aimImage3", aimImage3File);
      if (introImageFile) formData.append("introImage", introImageFile);
      if (highlightImageFile) formData.append("highlightImage", highlightImageFile);
      if (collegeImageFile) formData.append("collegeImage", collegeImageFile);
      if (maObjectivesImageFile) formData.append("maObjectivesImage", maObjectivesImageFile);
      if (careerImageFile) formData.append("careerImage", careerImageFile);
      courseImageFiles.forEach((file, i) => {
        if (file) formData.append(`courseImage_${i}`, file);
      });

      if (isEdit && sectionId) {
        await api.put(`/yoga-college-section/${sectionId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/yoga-college-section", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/ayush-course"), 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.formPage}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonField} style={{ height: "52px" }} />
          ))}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Yoga College Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabLabels: Record<string, string> = {
    hero: "① Hero",
    protocol: "② Protocol (200hr)",
    wellness: "③ Wellness (400hr)",
    teacher: "④ Teacher (800hr)",
    master: "⑤ Yoga Master (1600hr)",
    highlight: "⑥ Highlight Section",
    cert: "⑦ Certification Cards",
    courses: "⑧ In-Person Courses",
    college: "⑨ College Info",
    eligibility: "⑩ MA Eligibility",
    career: "⑪ Career",
    links: "⑫ CTA Links",
  };
  const tabOrder = ["hero", "protocol", "wellness", "teacher", "master", "highlight", "cert", "courses", "college", "eligibility", "career", "links"] as const;

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/yogacourse/ayush-course" className={styles.breadcrumbLink}>Yoga College</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Yoga College Section" : "Add Yoga College Section"}</h1>
        <p className={styles.pageSubtitle}>Fill in every part of the page — course tabs, certifications, college info, career and CTA links</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.tabNav}>
        {tabOrder.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ══════════ TAB — HERO ══════════ */}
          {activeTab === "hero" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Hero Banner</h3></div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hero Image</label>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleHeroImage(e.target.files?.[0] || null)} />
                  {watchAll._heroPreview ? <img src={watchAll._heroPreview} alt="preview" className={styles.imgPreview} /> : (
                    <><span className={styles.uploadIcon}>🏔️</span><span className={styles.uploadText}>Click to upload or drag &amp; drop</span></>
                  )}
                </label>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hero Image Alt Text</label>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input} {...register("heroImageAlt", { required: "Required" })} />
                </div>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Hero Title (H1)</label>
                  <div className={styles.inputWrap}>
                    <input type="text" className={styles.input} {...register("heroTitle", { required: "Required" })} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Hero Subtitle</label>
                  <div className={styles.inputWrap}>
                    <input type="text" className={styles.input} {...register("heroSubtitle", { required: "Required" })} />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Intro &amp; Highlight Images</h3></div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Intro Image (used across course tabs)</label>
                  <label className={styles.uploadArea}>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleIntroImage(e.target.files?.[0] || null)} />
                    {watchAll._introImagePreview ? <img src={watchAll._introImagePreview} alt="preview" className={styles.imgPreview} /> : (
                      <><span className={styles.uploadIcon}>🖼️</span><span className={styles.uploadText}>Click to upload or drag &amp; drop</span></>
                    )}
                  </label>
                  <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                    <input type="text" className={styles.input} placeholder="Alt text" {...register("introImageAlt", { required: "Required" })} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Highlight Image (full-width banner)</label>
                  <label className={styles.uploadArea}>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleHighlightImage(e.target.files?.[0] || null)} />
                    {watchAll._highlightImagePreview ? <img src={watchAll._highlightImagePreview} alt="preview" className={styles.imgPreview} /> : (
                      <><span className={styles.uploadIcon}>🖼️</span><span className={styles.uploadText}>Click to upload or drag &amp; drop</span></>
                    )}
                  </label>
                  <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                    <input type="text" className={styles.input} placeholder="Alt text" {...register("highlightImageAlt", { required: "Required" })} />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Aim/Practice Images (shared across the 3 course tabs)</h3></div>
              <div className={styles.threeCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image 1</label>
                  <label className={styles.uploadArea}>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleAimImage1(e.target.files?.[0] || null)} />
                    {watchAll._aimImage1Preview ? <img src={watchAll._aimImage1Preview} alt="preview" className={styles.imgPreview} /> : <span className={styles.uploadIcon}>📷</span>}
                  </label>
                  <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                    <input type="text" className={styles.input} placeholder="Alt text" {...register("aimImage1Alt", { required: true })} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image 2</label>
                  <label className={styles.uploadArea}>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleAimImage2(e.target.files?.[0] || null)} />
                    {watchAll._aimImage2Preview ? <img src={watchAll._aimImage2Preview} alt="preview" className={styles.imgPreview} /> : <span className={styles.uploadIcon}>📷</span>}
                  </label>
                  <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                    <input type="text" className={styles.input} placeholder="Alt text" {...register("aimImage2Alt", { required: true })} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image 3</label>
                  <label className={styles.uploadArea}>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleAimImage3(e.target.files?.[0] || null)} />
                    {watchAll._aimImage3Preview ? <img src={watchAll._aimImage3Preview} alt="preview" className={styles.imgPreview} /> : <span className={styles.uploadIcon}>📷</span>}
                  </label>
                  <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                    <input type="text" className={styles.input} placeholder="Alt text" {...register("aimImage3Alt", { required: true })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB — PROTOCOL / WELLNESS / TEACHER ══════════ */}
          {activeTab === "protocol" && <CourseTabFields control={control} register={register} prefix="protocolTab" />}
          {activeTab === "wellness" && <CourseTabFields control={control} register={register} prefix="wellnessTab" />}
          {activeTab === "teacher" && <CourseTabFields control={control} register={register} prefix="teacherTab" />}

          {/* ══════════ TAB — YOGA MASTER ══════════ */}
          {activeTab === "master" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tab Label</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("masterTab.label", { required: true })} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Hours Badge</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("masterTab.hours", { required: true })} /></div>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("masterTab.title", { required: true })} /></div>
              </div>

              <LabelTextList control={control} register={register} name="masterTab.details" label="Details (e.g. Certification Name)" max={4} />
              <TextItemList control={control} register={register} name="masterTab.eligibility" label="Eligibility Points" max={8} />
              <LabelTextList control={control} register={register} name="masterTab.extraDetails" label="Extra Detail Cards" max={10} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Contact Text</label>
                <div className={styles.inputWrap}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("masterTab.contact", { required: true })} />
                </div>
              </div>

              <div className={styles.formDivider} />
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Syllabus — Theory</h3><span className={styles.sectionBadge}>{masterTheoryArray.fields.length}/12</span></div>
              <div className={styles.itemsList}>
                {masterTheoryArray.fields.map((field, i) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>{i + 1}</span>
                    <div className={styles.itemFields}><div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`masterTab.syllabusTheory.${i}.text`, { required: true })} /></div></div>
                    <button type="button" className={styles.removeItemBtn} onClick={() => masterTheoryArray.remove(i)} disabled={masterTheoryArray.fields.length <= 1}>✕</button>
                  </div>
                ))}
              </div>
              {masterTheoryArray.fields.length < 12 && <button type="button" className={styles.addBtn} onClick={() => masterTheoryArray.append({ text: "" })}>+ Add Theory Topic</button>}

              <div className={styles.formDivider} />
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Syllabus — Practical</h3><span className={styles.sectionBadge}>{masterPracticalArray.fields.length}/12</span></div>
              <div className={styles.itemsList}>
                {masterPracticalArray.fields.map((field, i) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>{i + 1}</span>
                    <div className={styles.itemFields}><div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`masterTab.syllabusPractical.${i}.text`, { required: true })} /></div></div>
                    <button type="button" className={styles.removeItemBtn} onClick={() => masterPracticalArray.remove(i)} disabled={masterPracticalArray.fields.length <= 1}>✕</button>
                  </div>
                ))}
              </div>
              {masterPracticalArray.fields.length < 12 && <button type="button" className={styles.addBtn} onClick={() => masterPracticalArray.append({ text: "" })}>+ Add Practical Topic</button>}
            </div>
          )}

          {/* ══════════ TAB — HIGHLIGHT SECTION ══════════ */}
          {activeTab === "highlight" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Badge Text</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Live Yoga Classes" {...register("highlightBadge", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title (H2)</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Experience the Energy of Rishikesh" {...register("highlightTitle", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Subtitle</label>
                <div className={styles.inputWrap}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("highlightSubtitle", { required: "Required" })} />
                </div>
              </div>
              <p className={styles.fieldHint} style={{ marginTop: "0.4rem" }}>
                The image for this section is uploaded on the Hero tab (Highlight Image).
              </p>
            </div>
          )}

          {/* ══════════ TAB — CERTIFICATION CARDS ══════════ */}
          {activeTab === "cert" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Om Divider Label</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Examinations" {...register("certSectionLabel", { required: "Required" })} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Yoga Certification Exams" {...register("certSectionTitle", { required: "Required" })} /></div>
                </div>
              </div>

              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Certification Cards</h3><span className={styles.sectionBadge}>{certCardsArray.fields.length}/8</span></div>
              {certCardsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Card #{index + 1}</span>
                    <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={() => certCardsArray.remove(index)} disabled={certCardsArray.fields.length <= 1}>✕</button>
                  </div>
                  <div className={styles.itemFieldsRow}>
                    <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
                      <input type="text" className={styles.input} placeholder="🏆" {...register(`certCards.${index}.icon`, { required: true })} />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input type="text" className={styles.input} placeholder="e.g. YOGA MASTER" {...register(`certCards.${index}.title`, { required: true })} />
                    </div>
                  </div>
                  <div className={styles.twoCol} style={{ marginTop: "0.6rem" }}>
                    <div className={styles.inputWrap}>
                      <input type="text" className={styles.input} placeholder="e.g. Online / Offline." {...register(`certCards.${index}.exam`, { required: true })} />
                    </div>
                    <div className={styles.inputWrap}>
                      <input type="text" className={styles.input} placeholder="e.g. 10500 INR / 8500 INR" {...register(`certCards.${index}.fee`, { required: true })} />
                    </div>
                  </div>
                </div>
              ))}
              {certCardsArray.fields.length < 8 && (
                <button type="button" className={styles.addBtn} onClick={() => certCardsArray.append({ title: "", exam: "", fee: "", icon: "✦" })}>+ Add Certification Card</button>
              )}
            </div>
          )}

          {/* ══════════ TAB — IN-PERSON COURSES ══════════ */}
          {activeTab === "courses" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Om Divider Label</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. In-Person Courses" {...register("coursesSectionLabel", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Yoga Courses in Rishikesh" {...register("coursesSectionTitle", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Subtitle</label>
                <div className={styles.inputWrap}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("coursesSectionSub", { required: "Required" })} />
                </div>
              </div>

              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Course Cards</h3><span className={styles.sectionBadge}>{inPersonCoursesArray.fields.length}/6</span></div>
              {inPersonCoursesArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Course #{index + 1}</span>
                    <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={() => inPersonCoursesArray.remove(index)} disabled={inPersonCoursesArray.fields.length <= 1}>✕</button>
                  </div>

                  <div className={styles.itemFieldsRow} style={{ marginBottom: "0.8rem" }}>
                    <div className={styles.itemThumbInputWrap}>
                      <input type="file" accept="image/*" className={styles.itemThumbInput} onChange={(e) => handleCourseImage(index, e.target.files?.[0] || null)} />
                      {watchAll.inPersonCourses?.[index]?._preview ? (
                        <img src={watchAll.inPersonCourses[index]._preview} alt="" className={styles.itemThumb} />
                      ) : (
                        <div className={styles.itemThumbEmpty}>📷</div>
                      )}
                    </div>
                    <div className={styles.itemFields}>
                      <div className={styles.inputWrap}>
                        <input type="text" className={styles.input} placeholder="Course Title" {...register(`inPersonCourses.${index}.title`, { required: true })} />
                      </div>
                      <div className={styles.inputWrap}>
                        <input type="text" className={styles.input} placeholder="Image Alt Text" {...register(`inPersonCourses.${index}.imageAlt`, { required: true })} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Start Date" {...register(`inPersonCourses.${index}.startDate`, { required: true })} /></div>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="End Date" {...register(`inPersonCourses.${index}.endDate`, { required: true })} /></div>
                  </div>
                  <div className={styles.twoCol} style={{ marginTop: "0.6rem" }}>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Duration" {...register(`inPersonCourses.${index}.duration`, { required: true })} /></div>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Fees" {...register(`inPersonCourses.${index}.fees`, { required: true })} /></div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "0.6rem" }}>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Certification" {...register(`inPersonCourses.${index}.cert`, { required: true })} /></div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Accreditation" {...register(`inPersonCourses.${index}.accreditation`, { required: true })} /></div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="What's Included" {...register(`inPersonCourses.${index}.included`, { required: true })} /></div>
                  </div>
                  <div className={styles.twoCol}>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Badge e.g. Level 1" {...register(`inPersonCourses.${index}.badge`, { required: true })} /></div>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Accent Color e.g. #F15505" {...register(`inPersonCourses.${index}.color`, { required: true })} /></div>
                  </div>
                </div>
              ))}
              {inPersonCoursesArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => {
                    inPersonCoursesArray.append({
                      title: "", startDate: "", endDate: "", duration: "", cert: "", accreditation: "",
                      fees: "", included: "", badge: "", color: "#F15505", imageAlt: "",
                    });
                    setCourseImageFiles((prev) => [...prev, null]);
                  }}
                >
                  + Add Course
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB — COLLEGE INFO ══════════ */}
          {activeTab === "college" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Om Divider Label</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. About AYM Yoga College" {...register("collegeSectionLabel", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Heading</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("collegeHeading", { required: "Required" })} /></div>
              </div>
              <RichTextField control={control} name="collegeParagraph" label="Paragraph" />
              <TextItemList control={control} register={register} name="collegeHighlights" label="Highlight Chips" max={8} />

              <div className={styles.formDivider} />
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>College Image</h3></div>
              <div className={styles.fieldGroup}>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleCollegeImage(e.target.files?.[0] || null)} />
                  {watchAll._collegeImagePreview ? <img src={watchAll._collegeImagePreview} alt="preview" className={styles.imgPreview} /> : <span className={styles.uploadIcon}>🖼️</span>}
                </label>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Alt Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("collegeImageAlt", { required: true })} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Badge Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Est. 2016" {...register("collegeImageBadge", { required: true })} /></div>
                </div>
              </div>

              <div className={styles.formDivider} />
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Courses-Offered Heading</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("collegeCoursesHeading", { required: "Required" })} /></div>
              </div>
              <TextItemList control={control} register={register} name="collegeCourses" label="Courses Offered" max={10} />

              <div className={styles.formDivider} />
              <div className={styles.fieldGroup}>
                <label className={styles.label}>M.A. Objectives Heading</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("maObjectivesHeading", { required: "Required" })} /></div>
              </div>
              <TextItemList control={control} register={register} name="maObjectives" label="M.A. Objectives" max={10} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>M.A. Objectives Image</label>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleMaObjectivesImage(e.target.files?.[0] || null)} />
                  {watchAll._maObjectivesImagePreview ? <img src={watchAll._maObjectivesImagePreview} alt="preview" className={styles.imgPreview} /> : <span className={styles.uploadIcon}>🖼️</span>}
                </label>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Alt Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("maObjectivesImageAlt", { required: true })} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Badge Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. M.A. Yoga" {...register("maObjectivesImageBadge", { required: true })} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB — MA ELIGIBILITY ══════════ */}
          {activeTab === "eligibility" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Om Divider Label</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Admissions" {...register("admissionsSectionLabel", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Heading</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("maEligibilityHeading", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Paragraph</label>
                <div className={styles.inputWrap}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("maEligibilityParagraph", { required: "Required" })} />
                </div>
              </div>

              <LabelValList control={control} register={register} name="maDetailsGrid" label="Details Grid (Duration / Fee / etc.)" max={8} />

              <div className={styles.formDivider} />
              <div className={styles.fieldGroup}>
                <label className={styles.label}>"How to Apply" Heading</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("howToApplyHeading", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>"How to Apply" Paragraph</label>
                <div className={styles.inputWrap}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("howToApplyParagraph", { required: "Required" })} />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB — CAREER ══════════ */}
          {activeTab === "career" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Om Divider Label</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Career Prospects" {...register("careerSectionLabel", { required: "Required" })} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Heading</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("careerHeading", { required: "Required" })} /></div>
              </div>

              <TextItemList control={control} register={register} name="careerParagraphs" label="Paragraphs" max={6} />
              <TextItemList control={control} register={register} name="careerOptions" label="Career Option Chips" max={10} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Image</label>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleCareerImage(e.target.files?.[0] || null)} />
                  {watchAll._careerImagePreview ? <img src={watchAll._careerImagePreview} alt="preview" className={styles.imgPreview} /> : <span className={styles.uploadIcon}>🖼️</span>}
                </label>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Alt Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("careerImageAlt", { required: true })} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Badge Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Career Options" {...register("careerImageBadge", { required: true })} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB — CTA LINKS ══════════ */}
          {activeTab === "links" && (
            <div className={styles.sectionBlock}>
              <p className={styles.fieldHint} style={{ marginBottom: "1.2rem" }}>
                These links control where the call-to-action buttons across the page navigate to.
              </p>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>"Apply Now →" Link (course tabs + Yoga Master)</label>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input} placeholder="e.g. /yoga-registration" {...register("applyNowLink", { required: "Required" })} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>"Book Now" / "Book Your Spot →" Link (cert cards + course cards)</label>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input} placeholder="e.g. /yoga-registration" {...register("bookNowLink", { required: "Required" })} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>"More Details" Link (cert cards)</label>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input} placeholder="e.g. /yoga-certification-details" {...register("moreDetailsLink", { required: "Required" })} />
                </div>
              </div>
            </div>
          )}

          <div className={styles.formDivider} />

          <div className={styles.formActions}>
            <Link href="/admin/yogacourse/ayush-course" className={styles.cancelBtn}>← Cancel</Link>
            <div className={styles.actionsRight}>
              {activeTab !== "hero" && (
                <button type="button" className={styles.prevBtn} onClick={(e) => { e.preventDefault(); setActiveTab(tabOrder[tabOrder.indexOf(activeTab) - 1]); }}>
                  ← Previous
                </button>
              )}
              {activeTab !== "links" ? (
                <button type="button" className={styles.nextBtn} onClick={(e) => { e.preventDefault(); setActiveTab(tabOrder[tabOrder.indexOf(activeTab) + 1]); }}>
                  Next →
                </button>
              ) : (
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? (<><span className={styles.spinner} /> Saving…</>) : (<><span>✦</span> {isEdit ? "Update Section" : "Save Section"}</>)}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
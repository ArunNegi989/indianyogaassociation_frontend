"use client";
import React, { useState } from "react";
import styles from "@/assets/style/international-yoga-competition/Yogacompetition.module.css";
import Link from "next/link";
import HowToReach from "@/components/home/Howtoreach";
import Competitionimage from "@/assets/images/mainimages/43960229012_41cbf853a3_b.jpg"
import Image from "next/image";
import img1 from "@/assets/images/mainimages/28531495457_bfb39bbd82_b.jpg"
import img2 from "@/assets/images/mainimages/44085500521_468d1df423_b.jpg"
import img3 from "@/assets/images/mainimages/30887814928_8a7f1290e5_b.jpg"
/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const ageGroups = [
  { label: "Age Group: 8 to 14 years ( Group A )" },
  { label: "Age Group: 14 to 21 years ( Group B )" },
  { label: "Age Group: 21 to 25 years ( Group C )" },
  { label: "Age Group: 25 to 35 years ( Group D )" },
  { label: "Age Group: 35 above ( Group E )" },
];

const syllabusGroups = [
  {
    title: "Compulsory Asana: Age Group A - B",
    asanas: [
      "Padahastasana.",
      "Dhanurasana.",
      "Ardha Matsyendrasana",
      "Sarvangasana.",
      "Parivrtta (Revolving) Trikonasana.",
    ],
  },
  {
    title: "Compulsory Asana: Age Group C - D",
    asanas: [
      "Virasana 3 / Warrior 3.",
      "Hanumanasana.",
      "Purna Bhujangasana.",
      "Parivritta Passhrakonasna.",
      "Padam Bakasana.",
    ],
  },
  {
    title: "Compulsory Asana: Age Group E",
    asanas: [
      "Trikonasana.",
      "ardha Bandha Padma Paschimottanasana.",
      "Dhanurasana.",
      "Ardha Matsyendrasana",
      "Halasana.",
    ],
  },
];

const objectives = [
  "Main objective of conducting and organizing this International Yoga competition is to identify talent in yoga. (The Grand Master of Yoga 2026)",
  "To provide a platform for getting success in the yoga field.",
  "To increase the awareness about yoga and also to inspire more people to adopt yoga in their lifestyle in this situation ( Covid-19 Pandemic ).",
];

const rules = [
  "Each participant has to submit their video of 3 to 5 minutes.",
  "Each and every participant has to disclose the apps they have used to enhance the aesthetic of the video and should not temper with the speed of the video.",
  "It is expected from the candidate to shoot their video from the camera having at least 12 mp or higher and positioned in such a way all the body part get captured in the frame while performing.",
  "Candidates have to shoot their video to a white backdrop and must wear proper yogic attire.",
  "After that students have to save their video on any social media handle and send to the AYM yoga Email: aymyogaschool@gmail.com",
];

const previousWinners = [
  { place: "1st", name: "Ayushi Tripathi" },
  { place: "2nd", name: "Jagdeep Vikrant Bhatt" },
  { place: "3rd", name: "Aarti Gupta" },
];

const winnerImages = [img1, img2, img3];
const prizes = [
  { place: "1st Prize", amount: "5100 INR" },
  { place: "2nd Prize", amount: "3100 INR" },
  { place: "3rd Prize", amount: "2100 INR" },
];

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */
const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <h2 className={styles.sectionHeading}>{children}</h2>
    <div className={styles.sectionUnderline}>
      <div className={styles.sectionUnderlineLine} />
    </div>
  </>
);

const OrangeBtn: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick,
}) => (
  <button className={styles.btnOrange} onClick={onClick} type="button">
    {children}
  </button>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const YogaCompetition: React.FC = () => {
  return (
    <div className={styles.section}>
      <div className={styles.a} />

      <div className={styles.container}>

        {/* ── PAGE HEADER ── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            7th International Yoga Competition
          </h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ── INTRO ── */}
        <div className={styles.contentCard}>
          <div className={styles.prose}>
            <p>
              <strong>
                Association for Yoga and Meditation (AYM) yoga school in Rishikesh
              </strong>{" "}
              is organizing <strong>7th International Yoga championship</strong>.
              This Online and Offline yoga championship is open for participants
              worldwide to ensure that the maximum number of yogis can take part in
              these competitions. The participants to submit their videos before{" "}
              <strong>15th May 2026</strong>.
            </p>
            <ul>
              <li>The Video must not exceed 5 Minutes.</li>
              <li>The Video can contain background music ( Description ).</li>
            </ul>
          </div>

          <div className={styles.btnCenter}>
  <Link href="/">
    <OrangeBtn>Results Announced</OrangeBtn>
  </Link>
</div>

          {/* Objectives */}
          <SectionHeading>Objectives of the Competition</SectionHeading>
          <ul className={styles.objectivesList}>
            {objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>

          {/* Hero image */}
          <div className={styles.imgPlaceholder}>
           <Image
  src={Competitionimage}
  alt="Yoga Competition Performance"
  className={styles.image}
/>
          </div>
        </div>

        {/* ── ELIGIBILITY ── */}
        <SectionHeading>Eligibility</SectionHeading>

        <div className={styles.contentCard}>
          <p className={styles.registerNote}>
            This Online and Offline yoga competition is open to any participant as
            per age group any one from any part of the world.
          </p>

          <div className={styles.twoColGrid}>
            <div className={styles.subSection}>
              <div className={styles.subHeading}>Categories: Age Group</div>
              <ul className={styles.bulletList}>
                {ageGroups.map((g, i) => (
                  <li key={i}>{g.label}</li>
                ))}
              </ul>
            </div>

            <div className={styles.subSection}>
              <div className={styles.subHeading}>Dress Code</div>
              <ul className={styles.bulletList}>
                <li>Men: Tight Short.</li>
                <li>Women: Swimming Costume.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── SYLLABUS ── */}
        <SectionHeading>Syllabus</SectionHeading>

        <div className={styles.threeColGrid}>
          {syllabusGroups.map((group, i) => (
            <div className={styles.syllabusCard} key={i}>
              <div className={styles.syllabusCardTitle}>{group.title}</div>
              <div className={styles.syllabusSubNote}>
                Compulsory Any 4 Asana — Holding 30 Sec.
              </div>
              <ul className={styles.bulletList}>
                {group.asanas.map((asana, j) => (
                  <li key={j}>{asana}</li>
                ))}
              </ul>
              <div className={styles.syllabusNote}>
                After Performing, Participant need to choose any 3 asana by self
                — Holding 15 sec.
              </div>
            </div>
          ))}
        </div>

        {/* ── BOOK YOUR SPOT ── */}
        <div className={styles.bookRow}>
  {[0, 1, 2].map((i) => (
    <div className={styles.bookCard} key={i}>
      <Link href="/yoga-registration">
        <OrangeBtn>Book Your Spot</OrangeBtn>
      </Link>
    </div>
  ))}
</div>

        {/* ── HOW TO REGISTER ── */}
        <SectionHeading>How to Register?</SectionHeading>

        <div className={styles.contentCard}>
          <p className={styles.registerNote}>
            The participant can register in this international yoga championship by
            sending email on:{" "}
            <span className={styles.emailHighlight}>aymyogaschool@gmail.com</span>
          </p>

          <div className={styles.boldLabel}>Registration Fee</div>
          <ul className={styles.bulletList}>
            <li>Indian Students: 300 INR</li>
            <li>International Students: 10 USD</li>
          </ul>
        </div>

        {/* ── RULE & REGULATION ── */}
        <SectionHeading>Rule and Regulation</SectionHeading>

        <div className={styles.contentCard}>
          <p className={styles.registerNote}>
            The last date of registration for the 1st round of the international
            yoga competition is <strong>15th May 2026</strong> and the participants
            have to submit their performance video before 15th May 2026. After 15th
            May submission is not valid.
          </p>

          <div className={styles.noteBox}>
            <span className={styles.noteLabel}>Please note: </span>The 1st round
            results will be officially announced on our website on{" "}
            <strong>31st May 2026.</strong>
          </div>

          <p className={styles.registerNote} style={{ marginTop: "0.8rem" }}>
            Selected students from 1st round, will participate in the Final round
            of competition at AYM Yoga School on the{" "}
            <strong>21st of June 2026.</strong>
          </p>

          <ul className={styles.bulletList} style={{ marginTop: "0.6rem" }}>
            {rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* ── 6th COMPETITION RESULTS ── */}
        <SectionHeading>
          6th International Yoga Competition — Final Result — 21 June 2025
        </SectionHeading>

        <div className={styles.photoGrid}>
          {previousWinners.map((winner, i) => (
            <div className={styles.photoCard} key={i}>
              <div className={styles.winnerImgWrap}>
                <Image
  src={winnerImages[i]}
  alt={`${winner.place} winner ${winner.name}`}
  className={styles.winnerImg}
/>
                <div className={styles.winnerOverlay}>
                  <div className={styles.winnerOccasion}>
                    On the Occasion of International Yoga Day
                  </div>
                  <div className={styles.winnerCompTitle}>
                    International Yoga Competition
                  </div>
                  <div className={styles.winnerChamp}>
                    6th International yoga championship{" "}
                    <span className={styles.winnerYear}>2025</span>
                  </div>
                  <div className={styles.winnerName}>
                    ●●● {winner.place} winner{" "}
                    <strong style={{ color: "#f5b800" }}>{winner.name}</strong> ●●●
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 7th COMPETITION DETAILS ── */}
        <SectionHeading>
          7th International Yoga Competition — 21 June 2026 — Details
        </SectionHeading>

        <div className={styles.contentCard}>
          <div className={styles.finalRoundBox}>
            <span className={styles.finalRoundLabel}>Final Round: </span>
            Judges may ask participants to perform any asana from Categories A to E.
            Therefore, we recommend practicing asanas from all categories to be fully
            prepared.
          </div>
        </div>

        {/* ── SCHEDULE ── */}
        <SectionHeading>
          7th International Yoga Competition — 21 June 2026 — Schedule
        </SectionHeading>

        <div className={styles.scheduleTable}>
          <div className={styles.scheduleCell}>
            <div>Date: 21 June 2026.</div>
            <div style={{ marginTop: "0.4rem" }}>Starting Time: 8:30 AM</div>
          </div>
          <div className={styles.scheduleCell}>
            <div>Breakfast: 10:00 AM to 11:00 AM</div>
            <div style={{ marginTop: "0.4rem" }}>
              Refreshment: 2:00 PM to 3:00 PM
            </div>
          </div>
        </div>

        <p className={styles.scheduleNote}>
          <strong>Note:</strong> Stay and Food Charges: 800 INR / person.
        </p>

        {/* ── PRIZE ── */}
        <SectionHeading>
          7th International Yoga Competition — Prize
        </SectionHeading>

        <div className={styles.contentCard}>
          <div className={styles.prizeBlock}>
            {prizes.map((p, i) => (
              <div className={styles.prizeItem} key={i}>
                {p.place}: {p.amount}
              </div>
            ))}
          </div>
        </div>

        {/* ── REGISTRATION FORM ── */}
        <SectionHeading>Registration Form</SectionHeading>

        <div className={styles.submitRow}>
          <Link href="/yoga-registration">
            <button className={styles.btnOrange}>Submit Registration</button>
          </Link>
        </div>

        {/* ── PAYMENT OPTIONS ── */}
        <SectionHeading>Payment Option</SectionHeading>

        <div className={styles.paymentGrid}>
          {/* Card 1 - UPI */}
          <div className={styles.paymentCard}>
            <div className={styles.paymentCardTitle}>
              Pay By UPI / Bank / Debit / Credit Card
            </div>
            <div className={styles.paymentSubLabel}>For Indian Students</div>
           <div className={styles.btnCenter} style={{ marginBottom: "1rem" }}>
  <Link href="/yoga-registration">
    <OrangeBtn>Book Now</OrangeBtn>
  </Link>
</div>

<div className={styles.paymentSubLabel}>
  For International Students
</div>

<div className={styles.btnCenter}>
  <Link href="/yoga-registration">
    <OrangeBtn>Book Now</OrangeBtn>
  </Link>
</div>
          </div>

          {/* Card 2 - PhonePe */}
          <div className={styles.paymentCard}>
            <div className={styles.phonepeBadge}>
              <span style={{ fontSize: "1.1rem" }}>Ⓟ</span> PhonePe
            </div>
            <span className={styles.acceptedBadge}>Accepted Here</span>
            <p className={styles.phonepeMobile} style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              Scan &amp; Pay Using PhonePe App
            </p>
            <div className={styles.qrPlaceholder}>[ QR Code ]</div>
            <p className={styles.phonepeMobile}>
              or Pay to Mobile Number using PhonePe App
            </p>
            <div className={styles.phonepeName}>mahesh chand</div>
          </div>

          {/* Card 3 - Bank Transfer */}
          <div className={styles.paymentCard}>
            <div className={styles.paymentCardTitle}>Bank Transfer</div>
            <div className={styles.paymentInfo}>
              <div>A/C Name: Association for Yoga and Meditation</div>
              <div>Account Number: 50380526694</div>
              <div>Account Type: Current Account</div>
              <div>IFSC Code: IDIB000R639</div>
              <div>Name of bank: ALLAHABAD Bank</div>
              <div>
                Address: Utpal Plaza, Haridwar Road, Rishikesh, Uttarakhand India.
              </div>
              <div style={{ marginTop: "0.8rem" }}>
                International Students Pay via PayPal:
              </div>
              <div>PayPal ID — aymyogaschool@gmail.com</div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />
      </div>
      <HowToReach/>
    </div>
  );
};

export default YogaCompetition;
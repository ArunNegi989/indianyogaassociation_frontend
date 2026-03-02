"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import styles from "@/assets/style/Accreditationsection/Accreditationsection.module.css";

import yogabanner from "@/assets/images/aym-yoga-school-200-300-and-500-RYS.jpg";
import yogacetificate from "@/assets/images/Minstry-Of-Ayush,-Government-of-India-for-web.jpg";
import RYS200 from "@/assets/images/RYS-200.jpg";
import RYS300 from "@/assets/images/RYS-300.jpg";
import yogalogo from "@/assets/images/logo.jpg";

/* ── Data ── */
interface YogaCert {
  type: string;
  img: StaticImageData;
}

const yogaAllianceCerts: YogaCert[] = [
  { type: "RYS 200", img: RYS200 },
  { type: "RYS 300", img: RYS300 },
];

/* ── Sub-components ── */

const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.divLine} />
    <span className={styles.omSun}>☀</span>
    <span className={styles.divLine} />
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.sectionTitleWrap}>
    <OmDivider />
    <h2 className={styles.sectionTitle}>{children}</h2>
  </div>
);

/* ── Main Component ── */

const AccreditationSection: React.FC = () => {
  return (
    <section className={styles.section}>
      {/* PART 1 */}
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>
          Registered Yoga School in Rishikesh - Indian Yoga Association
        </h1>

        <div className={styles.introParagraphs}>
          <p>
            The <strong>Indian Yoga Association</strong>, also known as the
            Association for Yoga and Meditation, is a national non-profit
            organisation registered under the Societies Registration Act with
            the Government of India. The Association manages the AYM Yoga
            School, which offers teacher training programs in Rishikesh, Goa,
            and many other locations, coming soon. It is registered with the
            Yoga Certification Board, under the Ministry of AYUSH, Government of
            India and <strong> Yoga Alliance, USA.</strong>
          </p>

          <p>
            AYM is a Registered Yoga Alliance Yoga Teacher Training School
            offers 200 hour, 300 hour and 500 hour yoga alliance certification
            in rishikesh India and graduates can register them with Yoga
            Alliance USA as RYT 200 and RYT 500 after graduation from AYM yoga
            alliance yoga school. To register you need to login to yoga alliance
            website –{" "}
            <a
              href="https://www.yogaalliance.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              www.yogaalliance.org
            </a>{" "}
            and make your account and fill required information. After
            verification of your graduation certification from AYM yoga alliance
            ttc in rishikesh, you will get registered. .
          </p>
        </div>

        <OmDivider />

        <div className={styles.imgWrap}>
          <Image
            src={yogabanner}
            alt="AYM Yoga School in Rishikesh registered with Yoga Alliance USA"
            width={1200}
            height={600}
            className={styles.responsiveImg}
            sizes="(max-width: 768px) 100vw, 1100px"
            priority
          />
        </div>
      </div>

      {/* PART 2 */}
      <div className={styles.container}>
        <SectionTitle>YOGA ALLIANCE, USA - RYS 200 & 300</SectionTitle>

        <div className={styles.certGrid}>
          {yogaAllianceCerts.map((cert) => (
            <div key={cert.type} className={styles.imgWrap}>
              <Image
                src={cert.img}
                alt={`Yoga Alliance ${cert.type} certification logo`}
                className={styles.responsiveImg}
              />
            </div>
          ))}
        </div>
      </div>

      {/* PART 3 */}
      <div className={styles.container}>
        <SectionTitle>Yoga Certification Board</SectionTitle>

        <div className={styles.imgWrap}>
          <Image
            src={yogacetificate}
            alt="Yoga Certification Board certificate under Ministry of AYUSH Government of India"
            className={styles.responsiveImg}
          />
        </div>
      </div>

      {/* PART 4 */}
      <div className={styles.container}>
        <SectionTitle>International Yoga Federation</SectionTitle>

        <div className={styles.introParagraphs}>
          <p>
            Association for Yoga and Meditation school in rishikesh is also
            member and affiliated to International Yoga Federation is the
            largest yoga organization in the world and is open to all yogis and
            yoga organizations. IYF supports the minimum international standards
            for yoga teachers from 1987. Graduates from AYM Yoga School in
            rishikesh can also registered with International Yoga Federation and
            can get International Yoga teacher Card. For registration, graduated
            need to login to their website and has to create their account after
            filling needed information, you will get registered.
          </p>
        </div>
        <div className={styles.imgWraplogo}>
  <Image
    src={yogalogo}
    alt="International Yoga Federation official logo"
    width={800}
    height={500}
    className={styles.responsiveImg}
  />
</div>

        <OmDivider />

        <div className={styles.iyfFooterNotes}>
          <p>
            200, 300 and 500 hour yoga certifications at AYM School are
            recognized by Indian Yoga Alliance.
          </p>
          <p>
            Association for yoga and meditation is also lifetime member of Yoga
            Alliance International visit,
            http://www.yogaallianceinternational.net Visit{" "}
            <a
              href="http://www.yogaallianceinternational.net"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              yogaallianceinternational.net
            </a>
          </p>
          <p>
            International Quality Management System has recognized Association
            for Yoga and Meditation for its 200-hour, 300-hour and 500-hour yoga
            teacher training in rishikesh India.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AccreditationSection;

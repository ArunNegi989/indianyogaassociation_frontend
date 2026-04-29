"use client";

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "@/assets/style/Accreditationsection/Accreditationsection.module.css";
import RYS1 from "@/assets/images/RYS/RPYS.png";
import RYS2 from "@/assets/images/RYS/RYS200.png";
import RYS3 from "@/assets/images/RYS/RYS300.png";
import RYS4 from "@/assets/images/RYS/RYS500.png";

import yogacetificate from "@/assets/images/Minstry-Of-Ayush,-Government-of-India-for-web.jpg";
import RPYS from "@/assets/images/RYS/certi1.png";
import RYS200 from "@/assets/images/RYS/certi2.png";
import RYS300 from "@/assets/images/RYS/certi3.png";
import RYS500 from "@/assets/images/RYS/certi4.png";
import yogalogo from "@/assets/images/logo.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/26.webp";

// Carousel images
import carouselImg1 from "@/assets/images/mainimages/30736248347_790050d8b3_b.jpg";
import carouselImg2 from "@/assets/images/mainimages/45949950391_26d19913f1_b.jpg";
import carouselImg3 from "@/assets/images/mainimages/45840430941_d5eb250540_b.jpg";
import carouselImg4 from "@/assets/images/mainimages/43945288051_41cc9e9985_b.jpg";
import carouselImg5 from "@/assets/images/mainimages/31969564338_2b4e341845_b.jpg";
import carouselImg6 from "@/assets/images/mainimages/45840433241_d34be93857_b.jpg";

/* ── Data ── */
interface YogaCert {
  type: string;
  img: StaticImageData;
  description: string;
}

interface AccreditationCard {
  title: string;
  icon: string;
  description: string;
  color: string;
}

const yogaAllianceCerts: YogaCert[] = [
  { 
    type: "RYS", 
    img: RPYS,
    description: "RPYS Yoga Teacher Training Certification"
  },
  { 
    type: "RYS 200", 
    img: RYS200,
    description: "200-Hour Advanced Yoga Teacher Training Certification"
  },
  { 
    type: "RYS 300", 
    img: RYS300,
    description: "300-Hour Yoga Teacher Training Certification"
  },
  { 
    type: "RYS 500", 
    img: RYS500,
    description: "500-Hour Yoga Teacher Training Certification"
  },
];

const accreditationCards: AccreditationCard[] = [
  {
    title: "Yoga Alliance USA",
    icon: "🏆",
    description: "Internationally recognized certification for yoga teachers",
    color: "#F15505"
  },
  {
    title: "Ministry of AYUSH",
    icon: "🇮🇳",
    description: "Government of India official yoga certification",
    color: "#1e40af"
  },
  {
    title: "International Yoga Federation",
    icon: "🌍",
    description: "Global yoga standards and teacher recognition",
    color: "#059669"
  }
];

const carouselImages: StaticImageData[] = [
  carouselImg1,
  carouselImg2,
  carouselImg3,
  carouselImg4,
  carouselImg5,
  carouselImg6,
];

/* ── Sub-components ── */

const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>ॐ</span>
    <span className={styles.dividerLine} />
  </div>
);

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className={styles.sectionTitleWrap}>
    <h2 className={styles.sectionTitle}>{children}</h2>
    {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
  </div>
);

const AccreditationCardComponent: React.FC<AccreditationCard> = ({ title, icon, description, color }) => (
  <div className={styles.accreditationCard} style={{ borderTopColor: color }}>
    <div className={styles.cardIcon}>{icon}</div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardDescription}>{description}</p>
  </div>
);

/* ── Carousel Component ── */
const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselTrack}>
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className={`${styles.carouselSlide} ${
                idx === currentIndex ? styles.active : ""
              }`}
            >
              <Image
                src={img}
                alt={`Carousel image ${idx + 1}`}
                fill
                className={styles.carouselImage}
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          className={styles.carouselBtn}
          onClick={handlePrev}
          aria-label="Previous image"
        >
          ‹
        </button>
        <button
          className={styles.carouselBtn}
          onClick={handleNext}
          aria-label="Next image"
        >
          ›
        </button>

        {/* Dots Indicator */}
        <div className={styles.carouselDots}>
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${
                idx === currentIndex ? styles.activeDot : ""
              }`}
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */

const AccreditationSection: React.FC = () => {
  return (
    <>
      <section className={styles.heroSection}>
        <Image
          src={heroImg}
          alt="Yoga Students Group"
          width={1180}
          height={540}
          className={styles.heroImage}
          priority
        />
        {/* <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Our Accreditations & Certifications</h1>
          <p className={styles.heroSubtitle}>Recognized globally by leading yoga organizations</p>
        </div> */}
      </section>

      <section className={styles.section}>
        {/* ACCREDITATION CARDS SECTION */}
        <div className={styles.container}>
          <SectionTitle>Why Choose AYM?</SectionTitle>
          <div className={styles.accreditationCardsGrid}>
            {accreditationCards.map((card) => (
              <AccreditationCardComponent key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* CAROUSEL SECTION */}
        <div className={styles.container}>
          <SectionTitle>AYM Yoga School Gallery</SectionTitle>
          <ImageCarousel />
        </div>

        {/* PART 1 - MAIN INTRO */}
        <div className={styles.container}>
          <h1 className={styles.mainTitle}>
            Registered Yoga School in Rishikesh
          </h1>

          <div className={styles.introCard}>
            <div className={styles.introContent}>
              <h3 className={styles.introCardTitle}>Indian Yoga Association</h3>
              <div className={styles.introParagraphs}>
                <p>
                  The <strong>Indian Yoga Association</strong>, also known as the
                  Association for Yoga and Meditation, is a national non-profit
                  organisation registered under the Societies Registration Act with
                  the Government of India. The Association manages the AYM Yoga
                  School, which offers teacher training programs in Rishikesh, Goa,
                  and many other locations, coming soon.
                </p>

                <p>
                  It is registered with the Yoga Certification Board, under the 
                  <strong> Ministry of AYUSH, Government of India</strong> and 
                  <strong> Yoga Alliance, USA.</strong>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.imgWrap}>
            <Image
              src={RYS1}
              alt="AYM Yoga School in Rishikesh registered with Yoga Alliance USA"
              width={1200}
              height={600}
              className={styles.responsiveImgage}
              sizes="(max-width: 768px) 100vw, 1100px"
              priority
            />
            <Image
              src={RYS2}
              alt="AYM Yoga School in Rishikesh registered with Yoga Alliance USA"
              width={1200}
              height={600}
               className={styles.responsiveImgage}
              sizes="(max-width: 768px) 100vw, 1100px"
              priority
            />
            <Image
              src={RYS3}
              alt="AYM Yoga School in Rishikesh registered with Yoga Alliance USA"
              width={1200}
              height={600}
              className={styles.responsiveImgage}
              sizes="(max-width: 768px) 100vw, 1100px"
              priority
            />
            <Image
              src={RYS4}
              alt="AYM Yoga School in Rishikesh registered with Yoga Alliance USA"
              width={1200}
              height={600}
              className={styles.responsiveImgage}
              sizes="(max-width: 768px) 100vw, 1100px"
              priority
            />
          </div>

          <div className={styles.highlightBox}>
            <h4 className={styles.highlightTitle}>📋 Register with Yoga Alliance USA</h4>
            <p className={styles.highlightText}>
            AYM is a Registered Yoga Alliance Yoga Teacher Training School offers 200 hour, 300 hour and 500 hour yoga alliance certification in rishikesh India and graduates can register them with Yoga Alliance USA as RYT 200 and RYT 500 after graduation from AYM yoga alliance yoga school. To register you need to login to yoga alliance website – www.yogaalliance.org and make your account and fill required information. After verification of your graduation certification from AYM yoga alliance ttc in rishikesh, you will get registered.
            </p>
            <p className={styles.highlightText}>
              To register, you need to login to yoga alliance website –{" "}
              <a
                href="https://www.yogaalliance.org"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                www.yogaalliance.org
              </a>{" "}
              and make your account and fill required information. After verification of your graduation certification from AYM yoga alliance ttc in rishikesh, you will get registered.
            </p>
          </div>
        </div>

        {/* PART 2 - YOGA ALLIANCE CERTS */}
        <div className={styles.container}>
          <SectionTitle 
            subtitle="Internationally Recognized Certifications"
          >
            YOGA ALLIANCE, USA - RYS 200 & 300
          </SectionTitle>

          <div className={styles.certGridEnhanced}>
            {yogaAllianceCerts.map((cert) => (
              <div key={cert.type} className={styles.certCard}>
                <div className={styles.certImageWrapper}>
                  <Image
                    src={cert.img}
                    alt={`Yoga Alliance ${cert.type} certification logo`}
                    className={styles.responsiveImg}
                  />
                </div>
                <div className={styles.certInfo}>
                  <h4 className={styles.certType}>{cert.type}</h4>
                  <p className={styles.certDescription}>{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART 3 - YOGA CERTIFICATION BOARD */}
        <div className={styles.container}>
          <SectionTitle>Yoga Certification Board</SectionTitle>
          <p className={styles.sectionDescription}>
            Ministry of AYUSH, Government of India Official Recognition
          </p>

          <div className={styles.certBoardWrapper}>
            <div className={styles.imgWrap1}>
              <Image
                src={yogacetificate}
                alt="Yoga Certification Board certificate under Ministry of AYUSH Government of India"
                className={styles.responsiveImg}
              />
            </div>
            <div className={styles.certBoardInfo}>
              <h4>Government Recognition</h4>
              <p>
               AYM Yoga School is officially recognized by the Ministry of AYUSH (Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy), which reflects its commitment to maintaining the highest standards of yoga education and teacher training. This recognition ensures that the curriculum, teaching methodology, and overall learning environment align with authentic traditional practices as well as modern educational benchmarks. <br />

With this accreditation, students can be confident that they are receiving structured, credible, and globally respected training. The courses are thoughtfully designed to blend ancient yogic wisdom with contemporary teaching techniques, allowing practitioners not only to deepen their personal practice but also to become skilled and confident yoga instructors. <br />

{/* AYM Yoga School emphasizes holistic development—covering physical postures (asanas), breath control (pranayama), meditation, philosophy, anatomy, and teaching methodology. The experienced faculty, serene learning environment, and well-structured programs create an ideal space for transformation and growth.<br />

Moreover, certification from a recognized institution like AYM enhances career opportunities worldwide, as it adds authenticity and credibility to a yoga teacher’s profile. Whether your goal is self-growth, spiritual exploration, or building a professional teaching career, AYM Yoga School provides a strong and trusted foundation for your journey in yoga. */}
              </p>
            </div>
          </div>
        </div>

        {/* PART 4 - INTERNATIONAL YOGA FEDERATION */}
        <div className={styles.container}>
          <SectionTitle>International Yoga Federation</SectionTitle>
          
          <div className={styles.iyfSection}>
            <div className={styles.iyfContent}>
              <h3 className={styles.iyfTitle}>Global Recognition & Standards</h3>
              <div className={styles.introParagraphs}>
                <p>
                  Association for Yoga and Meditation school in Rishikesh is a member and 
                  affiliated to the <strong>International Yoga Federation</strong>, the largest 
                  yoga organization in the world. The IYF is open to all yogis and yoga 
                  organizations and supports minimum international standards for yoga teachers 
                  since 1987.
                </p>

                <p>
                  Graduates from AYM Yoga School in Rishikesh can register with the International 
                  Yoga Federation and receive an <strong>International Yoga Teacher Card</strong>. 
                  Registration is simple—just create an account on their website and submit your 
                  graduation credentials.
                </p>
              </div>

              <div className={styles.iyfFooterNotes}>
                <div className={styles.noteItem}>
                  <span className={styles.noteIcon}>✓</span>
                  <p>200, 300 and 500 hour yoga certifications at AYM School are recognized by Indian Yoga Alliance.</p>
                </div>
                <div className={styles.noteItem}>
                  <span className={styles.noteIcon}>✓</span>
                  <p>
                    Association for Yoga and Meditation is a lifetime member of Yoga Alliance International. 
                    Visit{" "}
                    <a
                      href="http://www.yogaallianceinternational.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      yogaallianceinternational.net
                    </a>
                  </p>
                </div>
                <div className={styles.noteItem}>
                  <span className={styles.noteIcon}>✓</span>
                  <p>
                    International Quality Management System has recognized Association for Yoga and Meditation 
                    for its 200-hour, 300-hour and 500-hour yoga teacher training in Rishikesh, India.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.iyfImageWrapper}>
              <Image
                src={yogalogo}
                alt="International Yoga Federation official logo"
                width={400}
                height={400}
                className={styles.responsiveImg}
              />
            </div>
          </div>
        </div>
      </section>

      <HowToReach />
    </>
  );
};

export default AccreditationSection;

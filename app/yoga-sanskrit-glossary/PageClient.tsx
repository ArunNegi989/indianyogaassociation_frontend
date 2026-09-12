// YogaGlossary.tsx — Redesigned
"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-sanskrit-glossary/Yogaglossary.module.css";
import sanskritglossary from "@/assets/images/Yoga-Sanskrit-Glossory.jpg";
import HowToReach from "@/components/home/Howtoreach";

/* ============================================================
   DATA — all original terms preserved
   ============================================================ */
const glossaryTerms = [
  { term: "Yoga", definition: "Yoga means union or connection. Yoga is a state of mind in which there is no modification of mind, which remains peaceful and silent. It is also a set of body techniques which allow one to connect with divine." },
  { term: "Asana", definition: "A set of yoga postures in which you are comfortable and stable. Asanas make muscles stress-free and increase their efficiency." },
  { term: "Pranayama", definition: "Control of Prana or regulation of breath to regulate energy within body and mind." },
  { term: "Mudra", definition: "Mudras are the shortcut to meditate. Usually they are hand and mind expressions to lead us to meditation." },
  { term: "Bandha", definition: "Bandhas are certain locks done to channelize the energy within. Bandhas are also used to align the backbone, and are usually practiced during asanas." },
  { term: "Kriya", definition: "Kriya means category of actions to clean and detoxify body and mind." },
  { term: "Sutra", definition: "Sutra is that in which knowledge is condensed in few words. A person has to decode sutras to get its meaning." },
  { term: "Yoga Sutra", definition: "The first 4 stages of yoga namely Samadhi, Sadhana, Vibhuti and Kaivalya are together known as yoga sutra, written by sage Patanjali." },
  { term: "Karma Yoga", definition: "It is a self-service to the holy divine in any and every way or form. It is yoga through hand." },
  { term: "Bhakti Yoga", definition: "It means devotion to the god almighty. It is the yoga through heart." },
  { term: "Gyan Yoga", definition: "It is the yoga through brain in which a person gets realization through wisdom." },
  { term: "Raj Yoga", definition: "Raja Yoga also called 'Royal Yoga' at times, includes all kinds of yoga including meditation. It emphasizes on benefits of meditation for realization of spiritual self and meaningful evolution of one's self-consciousness. It is a systematic yoga." },
  { term: "Hatha Yoga", definition: "Hatha yoga is that yoga which is balance flowing between left and right sides of the body. 'Ha' means sun (right-side) and 'Tha' means moon (left side), which together form Hatha meaning balance of two opposite energies." },
  { term: "Kriya Yoga", definition: "Kriya Yoga means union of finite (human) with infinite (God) through regular practice of yoga, meditation and mudra." },
  { term: "Ashtanga Yoga", definition: "It means practice of 8-limb yoga as defined by sage Patanjali in Yoga Sutras. It is a path of internal purification of self though 8 practices namely Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana and Samadhi." },
  { term: "Vinyasa Yoga", definition: "It is that style of yoga in which one goes from one pose to another through transition in a specific way and with controlled breathing." },
  { term: "Hatha Vinyasa Yoga", definition: "This style of yoga is a combination of Hatha and Vinyasa which is practice of Hatha yoga postures mixed with Chaturanga upward-downdog (Vinyasa) poses. Usually the poses are difficult." },
  { term: "Flow Yoga", definition: "Flow yoga is one in which poses are connected with each-other and the practitioner transits from one pose to another without any break." },
  { term: "Power Yoga", definition: "It is a fitness-based and calorie burning style of yoga which includes fast paced exercises and yoga postures and is aimed at strengthening physical, mental and spiritual strength." },
  { term: "Vinyasa Flow Yoga", definition: "It is a style of yoga in which yoga poses are done in a synchronized way, combined with controlled breathing (inhale and exhale). The poses are practiced in an inter-linked way including Chaturanga up-dog, down-dog." },
  { term: "Kundalini Yoga", definition: "Kundalini yoga is about awakening of Kundalini energies (Sleeping Prana or Unmanifested Prana) to Sahasara chakra." },
  { term: "Japa Yoga", definition: "Repetition of any mantra or repetition of god's name while doing certain yoga asanas is called Japa yoga." },
  { term: "Dhyana", definition: "Dhyana is one of the 8 limbs of yoga and concentrates on a particular point of focus, with the intention of knowing truth about it. Dhyana means meditation. It is derived from the Sanskrit root 'dhyai' meaning 'to think of'." },
  { term: "Dharana", definition: "Means fixing the mind at one point. We call it concentration of mind on one point. It is the 6th limb of yoga sutras." },
  { term: "Samadhi", definition: "State of autonomous and continuous flow of mind on any one object of meditation. The last of Patanjali's 8 limbs, state of UNION, all chakras open, absolute meditation state. It also means balance of mind." },
  { term: "Tark-Vitark", definition: "Debate." },
  { term: "Laya Yoga", definition: "It is that kind of yoga which merges the mind with any inner or outer sound. Those sounds might come from within and through them, one tries to connect with the almighty." },
  { term: "Traditional Yoga", definition: "It is the most real and authentic form of yoga which has been practiced for ages in India. Raja yoga and Hatha yoga are both considered as traditional yoga." },
  { term: "Nadi Shodhana", definition: "'Nadi' means 'energy channels', 'Shodhana' means 'purification'. Thus, Nadi Shodhana means purification of energy channels. It is the alternate nostril breathing technique which helps in keeping the mind calm, happy and peaceful." },
  { term: "Ujjayi", definition: "It is a conscious breathing in which our breath catches the windpipe. It is used to enhance Hatha yoga practice." },
  { term: "Bhastrika", definition: "Bhastrika in Sanskrit means 'bellows'. It is a kind of pranayama in which breathing exercise is done either in a slow or in a fast way to get maximum oxygen for the body through inhaling and exhaling." },
  { term: "Kapal Bhati", definition: "It is a breathing exercise done to clean the windpipe. It is also a part of pranayama which is done to remove toxins out of the body and cleanse it. It is done to treat stomach related disorders and to lose weight." },
  { term: "Bhramari", definition: "Bhramari comes from the Sanskrit word 'Bramar' which means the black Indian bee. In Bhramari pranayama, humming sound is produced during slow exhalation. One's eyes and ears are closed using fingers and a humming sound is made within mouth." },
  { term: "Bhrumadhya", definition: "Bhrumadhya (3rd Eye) is the location of Ajna chakra. It is located on the forehead, between two eyebrows. It is the centre-point of concentration." },
  { term: "Hastha", definition: "Hastha means hand and it represents the creativity of sun. Closed fist of a hand gives a person ability to achieve his/her goals and good manners. It is a drishti used in Ashtanga Vinyasa yoga." },
  { term: "Pada", definition: "Pada means foot and is used in Ashtanga. Pada also means 'connected' with what precedes it and what follows it." },
  { term: "Aikam", definition: "It means one in Sanskrit." },
  { term: "Dve", definition: "It means two in Sanskrit." },
  { term: "Treeni", definition: "It means three in Sanskrit." },
  { term: "Chatvaari", definition: "It means four in Sanskrit." },
  { term: "Pancha", definition: "It means five in Sanskrit." },
  { term: "Shat", definition: "It means six in Sanskrit." },
  { term: "Sapta", definition: "It means seven in Sanskrit." },
  { term: "Ashta", definition: "It means eight in Sanskrit." },
  { term: "Nava", definition: "It means nine in Sanskrit." },
  { term: "Dasha", definition: "It means ten in Sanskrit." },
  { term: "Ekaadasha", definition: "It means eleven in Sanskrit." },
  { term: "Dvaadasha", definition: "It means twelve in Sanskrit." },
  { term: "Trayodasha", definition: "It means thirteen in Sanskrit." },
  { term: "Chaturdash", definition: "It means fourteen in Sanskrit." },
  { term: "Panchadasha", definition: "It means fifteen in Sanskrit." },
  { term: "Shodash", definition: "It means sixteen in Sanskrit." },
  { term: "Saptadasha", definition: "It means seventeen in Sanskrit." },
  { term: "Ashtaadasha", definition: "It means eighteen in Sanskrit." },
  { term: "Navadasha", definition: "It means nineteen in Sanskrit." },
  { term: "Vimshatihi", definition: "It means twenty in Sanskrit." },
  { term: "Uddiyan Bandha", definition: "Abdominal lock used to align the lumber back." },
  { term: "Mula Bandha", definition: "Root lock used to align the lower back, sacral region and also used in pranayama." },
  { term: "Jalandhara Bandha", definition: "Chin lock used to activate the Vishuddhi chakra." },
  { term: "Chakra", definition: "Chakra means wheel of Nadis or energy channels. There are total 7 chakras." },
  { term: "Muladhara chakra", definition: "It is a basic chakra located on root of the spine." },
  { term: "Swadhistana chakra", definition: "It is the 2nd chakra located near Pubis bone. Its element is water and it controls all fluidity in the body." },
  { term: "Manipura chakra", definition: "This is the gem chakra or fire chakra which controls all energy within the body. It is located in the naval of human body." },
  { term: "Anahata chakra", definition: "Anahata is the heart chakra. Its element is air." },
  { term: "Vishuddhi chakra", definition: "It is the 5th basic chakra also known as the throat chakra with the element of aakash (space)." },
  { term: "Ajna chakra", definition: "It is the location of 3rd eye and is the master of all chakras. Mind is its element." },
  { term: "Nadi", definition: "Nadis are the energy channels through which Prana flows." },
  { term: "Ida Nadi", definition: "It is the main energy channel in the left side of the body and is feminine in nature." },
  { term: "Pingala Nadi", definition: "It is the main energy channel in the right side of the body and is masculine in nature." },
  { term: "Sushumna Nadi", definition: "It is the central energy channel and is the balance between feminine and masculine by nature." },
  { term: "Neti / Jal Neti", definition: "Neti is an important part of shatkriya and is a yogic system of clearing air passage-ways in the head. It is also used for nasal-cleansing." },
  { term: "Sutra Neti", definition: "Sutra means 'thread' and cleansing nose through waxed (Honey wax) cotton thread is called Sutra Neti." },
  { term: "Kunjal Kriya", definition: "Kunjal kriya is yogic vomiting which is done to purify stomach and cleanse the upper digestive tract." },
  { term: "Shankha Prakshalana", definition: "Shank means shell and Prakshalana means cleansing. Together it means cleaning the elementary canal from mouth to anus, by drinking saline water and doing a set of certain asanas." },
  { term: "Nauli", definition: "Nauli is a powerful technique, used to massage all muscles of abdomen. It is 1 of the 6 purification methods of Shatkarma." },
  { term: "Trataka", definition: "Trataka means yogic gazing where the gaze is fixed at an object for some time, after which it can be gazed through closed eyes." },
  { term: "Samatvam", definition: "Consistency." },
  { term: "Drishti", definition: "Point of focus while asana practice or meditation." },
  { term: "Mantra", definition: "MAN (Mind) + TRA (instrument) — a sacred sound or syllable used as an instrument of the mind." },
  { term: "Asteya", definition: "Non-Stealing." },
  { term: "Yama", definition: "1st of Patanjali's 8 limbs of Yoga." },
  { term: "Ahimsaa", definition: "Non violence." },
  { term: "Satya", definition: "Truth." },
  { term: "Guru", definition: "A spiritual teacher." },
  { term: "Brammcharya", definition: "Celibacy." },
  { term: "Aparigraha", definition: "Non-Possession." },
  { term: "Ananda", definition: "Happiness." },
  { term: "Prana", definition: "Means 'vital energy' or 'life force'. It is the force that exists in all living beings, small or large." },
  { term: "AUM or OM", definition: "Aum or OM is a mantra that represents the universe, where A represents the creation aspect of the universe, U represents the maintaining energy of the universe and M characterizes the transformative energy of the universe." },
  { term: "Shanti", definition: "Means tranquility, peace, is often chanted three times after one chant of Aum." },
  { term: "Chin-mudra", definition: "A common hand gesture used in meditation. Index finger and thumb touching each other." },
  { term: "Niyama", definition: "Means positive personal duties. It's a personal code of conduct of recommended activities and habits for healthy living, which should be observed every day." },
];

/* ============================================================
   HELPERS
   ============================================================ */
function groupByLetter(terms: typeof glossaryTerms) {
  const map = new Map<string, typeof glossaryTerms>();
  terms.forEach((t) => {
    const letter = t.term[0].toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(t);
  });
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

const ALL_LETTERS = [...new Set(glossaryTerms.map((t) => t.term[0].toUpperCase()))].sort();

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const YogaGlossary: React.FC = () => {
  const [query, setQuery]   = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = glossaryTerms;
    if (letter) list = list.filter((t) => t.term[0].toUpperCase() === letter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, letter]);

  const groups = useMemo(() => groupByLetter(filtered), [filtered]);

  return (
    <div className={styles.pageWrapper}>

      {/* ══════════════════════════
          HERO
      ══════════════════════════ */}
      <section className={styles.heroSection}>
        {/* spinning mandala */}
        <div className={styles.heroMandalaBg} aria-hidden="true">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="#F15505" strokeWidth="0.6" opacity="0.12">
              {[30, 60, 90, 120, 150, 180, 210, 240].map((r, i) => (
                <circle key={i} cx="250" cy="250" r={r} />
              ))}
              {Array.from({ length: 36 }, (_, i) => {
                const a = (((i * 360) / 36) * Math.PI) / 180;
                return (
                  <line key={i} x1="250" y1="250"
                    x2={250 + 240 * Math.cos(a)}
                    y2={250 + 240 * Math.sin(a)} />
                );
              })}
              {[80, 140, 200].map((r, i) => (
                <polygon key={i}
                  points={Array.from({ length: 8 }, (_, j) => {
                    const a = (((j * 360) / 8) * Math.PI) / 180;
                    return `${250 + r * Math.cos(a)},${250 + r * Math.sin(a)}`;
                  }).join(" ")}
                />
              ))}
            </g>
          </svg>
        </div>
        <div className={styles.heroOrb} style={{ top: "-60px", left: "-60px",
          width: "clamp(160px,25vw,300px)", height: "clamp(160px,25vw,300px)",
          background: "radial-gradient(circle, rgba(241,85,5,0.18) 0%, transparent 70%)" }} aria-hidden="true" />
        <div className={styles.heroOrb} style={{ bottom: "-40px", right: "-40px",
          width: "clamp(100px,18vw,220px)", height: "clamp(100px,18vw,220px)",
          background: "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)" }} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowLine} />
            AYM Yoga School · Rishikesh
            <span className={styles.heroEyebrowLine} />
          </div>
          <h1 className={styles.heroTitle}>
            Yoga Terms &amp; <span className={styles.heroTitleAccent}>Sanskrit</span> Glossary
          </h1>
          <p className={styles.heroSubtitle}>
            A comprehensive reference guide to essential Sanskrit terms, concepts, and practices
            used across all schools of yoga.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{glossaryTerms.length}</span>
              <span className={styles.heroStatLbl}>Total Terms</span>
            </div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{ALL_LETTERS.length}</span>
              <span className={styles.heroStatLbl}>Letters</span>
            </div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>5000+</span>
              <span className={styles.heroStatLbl}>Years of Yoga</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          BANNER IMAGE
      ══════════════════════════ */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerFrame}>
          <div className={styles.bannerCorner + " " + styles.bannerCornerTl} />
          <div className={styles.bannerCorner + " " + styles.bannerCornerTr} />
          <div className={styles.bannerCorner + " " + styles.bannerCornerBl} />
          <div className={styles.bannerCorner + " " + styles.bannerCornerBr} />
          <Image
            src={sanskritglossary}
            alt="AYM Yoga School — Sanskrit Glossary"
            fill
            sizes="(max-width:575px) 100vw, (max-width:991px) 90vw, 1000px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </section>

      {/* ══════════════════════════
          SEARCH + ALPHA BAR
      ══════════════════════════ */}
      <div className={styles.searchSection}>
        <div className={styles.searchInner}>
          {/* search input */}
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search terms or definitions…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLetter(null); }}
              aria-label="Search glossary"
            />
          </div>

          {/* alpha filter */}
          <div className={styles.alphaBar}>
            <button
              className={`${styles.alphaBtn} ${styles.alphaBtnAll} ${!letter && !query ? styles.alphaBtnActive : ""}`}
              onClick={() => { setLetter(null); setQuery(""); }}
              type="button"
            >All</button>
            {ALL_LETTERS.map((l) => (
              <button
                key={l}
                className={`${styles.alphaBtn} ${letter === l ? styles.alphaBtnActive : ""}`}
                onClick={() => { setLetter(letter === l ? null : l); setQuery(""); }}
                type="button"
              >{l}</button>
            ))}
          </div>

          {/* count */}
          <span className={styles.searchCount}>
            <span className={styles.searchCountNum}>{filtered.length}</span> terms
          </span>
        </div>
      </div>

      {/* ══════════════════════════
          GLOSSARY
      ══════════════════════════ */}
      <section className={styles.glossarySection}>
        {groups.length === 0 ? (
          <div className={styles.noResults}>
            <span className={styles.noResultsIcon}>ॐ</span>
            <p className={styles.noResultsText}>No terms found for "{query}"</p>
          </div>
        ) : (
          groups.map(([char, terms], gi) => (
            <div
              key={char}
              className={styles.letterGroup}
              style={{ "--lg": gi } as React.CSSProperties}
            >
              <div className={styles.letterHeading}>
                <span className={styles.letterChar}>{char}</span>
                <div className={styles.letterLine} />
                <span className={styles.letterCount}>{terms.length} {terms.length === 1 ? "term" : "terms"}</span>
              </div>
              <div className={styles.termGrid}>
                {terms.map((item, ti) => (
                  <div key={ti} className={styles.termCard}>
                    <div className={styles.termCardBgLetter}>{char}</div>
                    <h3 className={styles.termName}>{item.term}</h3>
                    <div className={styles.termNameDivider} />
                    <p className={styles.termDefinition}>{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Om divider before footer */}
      <div className={styles.omDivider}>
        <div className={`${styles.divLine} ${styles.divLineLeft}`} />
        <span className={styles.divOm}>ॐ</span>
        <div className={`${styles.divLine} ${styles.divLineRight}`} />
      </div>

      <HowToReach />
    </div>
  );
};

export default YogaGlossary;
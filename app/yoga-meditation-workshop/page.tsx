// MeditationPage.tsx
import React from "react";
import styles from "@/assets/style/yoga-meditation-workshop/Meditationpage.module.css";
import Image from "next/image";
import bannerImage from "@/assets/images/meditation.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/41.png";
/* ─── Types ─── */
interface PricingRow {
  date: string;
  usdFee: string;
  inrFee: string;
  dormPrice: number;
  twinPrice: number;
  privatePrice: number;
  totalSeats: number;
  bookedSeats: number;
  applyLink?: string;
}

/* ─── Data ─── */
const pricingData: PricingRow[] = [
  {
    date: "05th Jan to 29th Jan 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 8,
  },
  {
    date: "03rd Feb to 27th Feb 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 12,
  },
  {
    date: "03rd Mar to 27th Mar 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 5,
  },
  {
    date: "03rd Apr to 27th Apr 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 0,
  },
  {
    date: "03rd May to 27th May 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 20,
  },
  {
    date: "03rd Jun to 27th Jun 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 3,
  },
  {
    date: "03rd Jul to 27th Jul 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 7,
  },
  {
    date: "03rd Aug to 27th Aug 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 15,
  },
];

/* ─── Om Divider ─── */
const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>ॐ</span>
    <span className={styles.dividerLine} />
  </div>
);

/* ─── Corner Ornament (100hr style) ─── */
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
      className={styles.vintageCornerOrn}
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

/* ─── Seats Cell — exactly like 100hr ─── */
function SeatsCell({ booked, total }: { booked: number; total: number }) {
  const isFull = booked >= total;
  const remaining = total - booked;
  if (isFull)
    return <span className={styles.vintageFullyBooked}>Fully Booked</span>;
  return (
    <span className={styles.vintageSeatsAvail}>
      {remaining} / {total} Seats
    </span>
  );
}

/* ─── Component ─── */
const MeditationPage: React.FC = () => {
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
          SECTION 1 — HERO TITLE + BANNER
      ══════════════════════════════════════ */}
      <section className={styles.heroSection1}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>
            Meditation Yoga Teacher Training Course in Rishikesh India
          </h1>
          <OmDivider />
          <div className={styles.bannerWrap}>
            <Image
              src={bannerImage}
              alt="Learn to Meditate – Meditation Yoga Teacher Training in Rishikesh"
              className={styles.bannerImg}
              priority
            />
          </div>
          <h2 className={styles.secTitle} style={{ marginTop: "2rem" }}>
            Meditation Yoga Teacher Training in Rishikesh
          </h2>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — WHAT IS MEDITATION
      ══════════════════════════════════════ */}
      <section className={styles.altSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitle}>What is Meditation?</h2>
          <OmDivider />
          <p className={styles.bodyPara}>
            Meditation cannot be explained in words. Words serve as signposts,
            pointing toward something, but they are not the thing itself. As a
            great one once said, "words are the fingers pointing towards the
            moon but they are not the moon itself." So, what are those
            signposts? Meditation can be many different things. It is that vast
            inner space within you, a constant and complete bliss and joy. It is
            the connection to something so much bigger, in which you are
            connected to every living being in the universe. It is the space
            where you are the complete watcher of everything. You do nothing but
            watch life unfold in front of you and sit in complete, absolute
            awareness. Emotions, sounds, pleasures, or senses do not linger;
            they simply come, stay for a while, and go. It is when you
            understand that the entire universe dwells within you. You realize
            your entire life is inside of you, merely touched by outside
            circumstances. You sit and receive the wisdom of the world, learning
            more than in your entire education, yet finding no words that can
            express that knowledge. When you open yourself completely and
            surrender to God or the divine, that moment of surrender is when you
            fully accept your life is happening before you. You become the
            watcher, and everything works through you and for you. Meditation is
            digging deep within and constantly finding surprises about yourself,
            the world, the universe, and love. It is a beautiful process of
            unfolding or peeling to reach that complete, blissful core essence.
            Once you begin this inner journey, all desires vanish, and you want
            nothing but to go deeper.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — MEDITATION METHODS
      ══════════════════════════════════════ */}
      <section className={styles.methodSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitle}>
            What is your favorite method of meditation?
          </h2>
          <OmDivider />
          <p className={styles.bodyPara}>
            Vipassana involves sitting in a comfortable meditative posture.
            Focus on your breathing and the fact that you are now sitting. As
            you breathe, repeat in your mind: "in, out, sitting" or "rising,
            falling, sitting." You can focus either on your nostrils or on your
            abdomen. Repeat this a few times and keep your focus with the
            breath. Note that each round is an individual round. Keep repeating
            until you feel comfortable. Usually, after a few rounds of noting,
            meditation comes. If you lose concentration at any point, return
            your awareness to the breath. During meditation, if any thought or
            emotion comes up, try to remain the watcher. Do not attach to any of
            them; just see them come, stay a while, and go.
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            What is active meditation?
          </h2>
          <OmDivider />
          <p className={styles.bodyPara}>
            Active meditation uses the energy of the body to silence the mind.
            You use lots of energy before sitting still. This could involve
            exercises such as dancing or aerobatic movements. This type of
            meditation increases your blood circulation and heats up the body.
            Your mind's focus and energy shift fully onto the body instead of
            the brain or thoughts. Once the exercises are done, the meditator
            sits for a few minutes to absorb the changes in the body. Focus the
            energy on relaxing the muscles that have been working. This makes it
            easier for beginner meditators to focus and feel only positive
            feelings with minimal mind activity. This method is very new and not
            used traditionally. It is meant for the fast-paced life humans
            experience these days. It trains the mind to shift quickly from
            activity to calm. This method is usually used at the beginning of
            meditation. With practice, the meditator can move to traditional
            static meditation, where sitting still becomes easier.
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            What is static meditation?
          </h2>
          <OmDivider />
          <p className={styles.bodyPara}>
            Static meditation is a practice in which the meditator sits still,
            focusing inward until reaching a meditative state. Over time,
            meditation can expand into every action throughout the day,
            including brushing teeth, walking, doing chores, practicing Yoga,
            working, and other aspects of daily life. In this context,
            meditation means being fully mindful and aware of actions,
            sensations, and thoughts, both internally and externally. Unlike
            practices with vigorous movement, static meditation emphasizes
            stillness and doing each activity at its natural pace with complete
            energy and attention. This sustained and mindful practice sometimes
            takes more or less time but always centers on careful awareness.
            Through static meditation, one aims to connect to the universe's
            powers, attain advanced meditative stages, and possibly remain in
            such a state for extended periods. Vipassana meditation, as
            referenced above, exemplifies a method that can lead to traditional
            static meditation.
          </p>
          <p className={styles.bodyPara}>
            If you are interested in exploring a meditation yoga course in
            Rishikesh, meditation yoga classes in Rishikesh, or yoga and
            meditation courses in India, there are numerous opportunities for
            all levels. Whether you are seeking a meditation course for
            beginners in Rishikesh, a mindfulness meditation course in India, or
            prefer an online meditation yoga course in India, you will find
            programs tailored to your needs. For those wishing for a deeper
            experience, a spiritual meditation retreat in Rishikesh or
            meditation yoga training in Rishikesh offers unique chances for
            personal growth and self-discovery.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — ELEVATE + WHY CHOOSE
      ══════════════════════════════════════ */}
      <section className={styles.altSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitle}>
            Elevate Your Practice and Inspire Others
          </h2>
          <OmDivider />
          <p className={styles.bodyPara}>
            Are you ready to take your yoga journey to the next level and
            empower others in their mindfulness practices? Our{" "}
            <strong>Meditation Yoga Teacher Training program</strong> is crafted
            for those eager to explore the dynamic relationship between
            meditation and yoga. Join us as we embark on a transformative
            journey, equipping you to guide others confidently on their paths to
            self-awareness and tranquillity.
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            Why Choose Our Program?
          </h2>
          <OmDivider />
          <ol className={styles.whyList}>
            <li className={styles.whyItem}>
              <strong>1. Empowering Environment:</strong> Traditional meditation
              is that kind of meditation in which one focuses on the self and
              tries to unite the self with the almighty. This practice is also
              known as moksha or nirvana. The use of mala beads is done to do
              japa or chanting of a mantra repeatedly up to 108 times. This
              helps in focusing on oneself and getting free of distractions
              while meditating.
            </li>
            <li className={styles.whyItem}>
              <strong>2. Expert Instructors:</strong> Our experienced teachers
              are passionate about sharing their knowledge and expertise with
              you. They will provide you with the tools and feedback necessary
              to help you lead confidently and clearly.
            </li>
            <li className={styles.whyItem}>
              <strong>3. Comprehensive Curriculum:</strong> Our well-rounded
              curriculum covers essential topics, including yoga philosophy,
              anatomy, and meditation techniques. You'll gain a deep
              understanding of how to combine these elements to enhance your
              practice and teaching.
            </li>
            <li className={styles.whyItem}>
              <strong>4. Practical Experience:</strong> Get ready to step into
              your role as a teacher! Our program offers ample opportunities to
              lead meditation sessions and teach asanas, ensuring you are
              well-prepared to create a nurturing and effective environment for
              your future students.
            </li>
            <li className={styles.whyItem}>
              <strong>5. Transformational Journey:</strong> This training is
              designed for teaching and personal evolution. Cultivate profound
              insights and develop your mindfulness practice, enabling you to
              share authentic experiences with your students.
            </li>
            <li className={styles.whyItem}>
              <strong>6. Building a Strong Community:</strong> You'll connect
              with a network of driven individuals who share your passion.
              Together, you will share experiences and support one another in
              this empowering journey, forging strong relationships that last
              beyond the program.
            </li>
          </ol>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — SCHOOL + HIGHLIGHTS + TABLE
      ══════════════════════════════════════ */}
      <section className={styles.scheduleSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitle}>
            Meditation Course in Rishikesh – AYM Yoga School
          </h2>
          <OmDivider />

          <h3 className={styles.subSecTitle}>Program Highlights:</h3>
          <ul className={styles.highlightsList}>
            <li className={styles.highlightItem}>
              Daily meditation and yoga practices designed to ignite your
              confidence.
            </li>
            <li className={styles.highlightItem}>
              Engaging workshops on cutting-edge meditation techniques,
              breathwork, and mindfulness.
            </li>
            <li className={styles.highlightItem}>
              In-depth exploration of the anatomy and physiology related to
              meditation.
            </li>
            <li className={styles.highlightItem}>
              Thought-provoking discussions on the Eight Limbs of Yoga and
              various meditation traditions.
            </li>
            <li className={styles.highlightItem}>
              Flexible training options, available both online and in-person, to
              accommodate your lifestyle.
            </li>
          </ul>

          {/* ══ VINTAGE SEATS TABLE — all 6 columns exactly like 100hr ══ */}
          <div className={styles.vintageTableWrap}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />

            <div className={styles.vintageTableScroll}>
              <table className={styles.vintageTable}>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>FEE</th>
                    <th>FEE ( Indian )</th>
                    <th>ROOM PRICE</th>
                    <th>SEATS</th>
                    <th>APPLY</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map((row, idx) => {
                    const isFull = row.bookedSeats >= row.totalSeats;
                    return (
                      <tr key={idx}>
                        <td>
                          <span className={styles.vintageDateCal}>📅</span>
                          {row.date}
                        </td>
                        <td>{row.usdFee}</td>
                        <td>{row.inrFee}</td>
                        <td className={styles.vintageRoomPriceCell}>
                          Dorm{" "}
                          <strong className={styles.vintagePriceAmt}>
                            ${row.dormPrice}
                          </strong>{" "}
                          | Twin{" "}
                          <strong className={styles.vintagePriceAmt}>
                            ${row.twinPrice}
                          </strong>{" "}
                          | Private{" "}
                          <strong className={styles.vintagePriceAmt}>
                            ${row.privatePrice}
                          </strong>
                        </td>
                        <td>
                          <SeatsCell
                            booked={row.bookedSeats}
                            total={row.totalSeats}
                          />
                        </td>
                        <td>
                          {isFull ? (
                            <span className={styles.vintageApplyDisabled}>
                              Apply Now
                            </span>
                          ) : (
                            <a
                              href={
                                row.applyLink ??
                                "/yoga-registration?type=meditation"
                              }
                              className={styles.vintageApplyLink}
                            >
                              Apply Now
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.vintageTableCta}>
              <a href="#" className={styles.vintageJoinBtn}>
                Join Your Yoga Journey
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — CTA CLOSING
      ══════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitle}>
            Is This Meditation Program for You?
          </h2>
          <OmDivider />
          <p className={styles.bodyPara}>
            If you are passionate about yoga and eager to deepen your knowledge
            while sharing it with others, this training is for you. Whether you
            are a beginner or have extensive experience, we welcome dedicated
            individuals ready to embrace the powerful practice of mindfulness.
          </p>

          <h2 className={styles.secTitle} style={{ marginTop: "2.6rem" }}>
            Embark on Your Transformative Journey
          </h2>
          <OmDivider />
          <p className={styles.bodyPara}>
            Enroll in our Meditation Yoga Teacher Training program and take a
            significant step toward enhancing your practice and impacting the
            lives of others. Together, we will cultivate a world of mindful
            living, one breath at a time.
          </p>
        </div>
      </section>

      <HowToReach />
    </div>
  );
};

export default MeditationPage;

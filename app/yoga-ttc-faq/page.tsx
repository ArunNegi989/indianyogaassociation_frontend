"use client";
// YogaFAQ.tsx
import React, { useState } from "react";
import Image from "next/image";
import styles from "@/assets/style/yoga-ttc-faq/Yogafaq.module.css";
import yogaschool from "@/assets/images/front-yoga-school.jpg";
import yogabooks from "@/assets/images/Yoga-Books-Read-During-YTTC.jpg";
import aymyogaroom from "@/assets/images/Room.jpg";
import yogafood from "@/assets/images/Yogic-Foood.jpg";
import certificateimage from "@/assets/images/200-hours-yttc-sept.jpg";
import travelimage from "@/assets/images/Delhi-Airport-to-AYM-Yoga-School.jpg";

// ============================================================
//  MANDALA SVG
// ============================================================
const MandalaSVG: React.FC<{ size?: number; className?: string }> = ({
  size = 120, className = "",
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={className}
    aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    {Array.from({ length: 16 }).map((_, i) => (
      <ellipse key={`op${i}`} cx="100" cy="100" rx="6" ry="38"
        fill="none" stroke="#c8791a" strokeWidth="0.8" opacity="0.55"
        transform={`rotate(${i * 22.5} 100 100)`} />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <ellipse key={`mp${i}`} cx="100" cy="100" rx="4" ry="24"
        fill="none" stroke="#d4a44c" strokeWidth="0.9" opacity="0.65"
        transform={`rotate(${i * 30} 100 100)`} />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <ellipse key={`ip${i}`} cx="100" cy="100" rx="5" ry="14"
        fill="#f5e6c8" stroke="#c8791a" strokeWidth="1" opacity="0.75"
        transform={`rotate(${i * 45} 100 100)`} />
    ))}
    {[68, 55, 42, 30, 18].map((r) => (
      <circle key={r} cx="100" cy="100" r={r} fill="none"
        stroke="#c8791a" strokeWidth="0.6" opacity="0.4" strokeDasharray="3 4" />
    ))}
    {Array.from({ length: 16 }).map((_, i) => (
      <circle key={`d${i}`}
        cx={100 + 72 * Math.cos((i * Math.PI * 2) / 16)}
        cy={100 + 72 * Math.sin((i * Math.PI * 2) / 16)}
        r="2.5" fill="#d4a44c" opacity="0.7" />
    ))}
    <circle cx="100" cy="100" r="14" fill="#f5e6c8" stroke="#c8791a" strokeWidth="1.2" opacity="0.9" />
    <text x="100" y="105" textAnchor="middle" fontSize="16"
      fontFamily="serif" fill="#8b4513" opacity="0.9">ॐ</text>
  </svg>
);

// ============================================================
//  DIVIDER
// ============================================================
const Divider: React.FC = () => (
  <div className={styles.divider}>
    <span className={styles.divLine} />
    <MandalaSVG size={40} className={styles.divMandala} />
    <span className={styles.divLine} />
  </div>
);

// ============================================================
//  SECTION HEADER
// ============================================================
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className={styles.sectionHeader}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <span className={styles.sectionUnderline} />
  </div>
);

// ============================================================
//  FAQ ACCORDION
// ============================================================
interface FAQItemProps { question: string; answer: string; defaultOpen?: boolean; }
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.faqItem}>
      <button className={`${styles.faqQuestion} ${open ? styles.faqOpen : ""}`}
        onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{question}</span>
        <span className={styles.faqArrow}>{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className={styles.faqAnswer}>
          <p dangerouslySetInnerHTML={{ __html: answer }} />
        </div>
      )}
    </div>
  );
};

// ============================================================
//  Q&A BLOCK
// ============================================================
const QA: React.FC<{ q: string; a: React.ReactNode }> = ({ q, a }) => (
  <div className={styles.qaBlock}>
    <p className={styles.qaQuestion}>{q}</p>
    <div className={styles.qaAnswer}>{a}</div>
  </div>
);

// ============================================================
//  IMAGE BOX HELPER  ← KEY FIX
//
//  The div with position:relative MUST have an explicit height
//  for Next.js <Image fill> to render. We use a single wrapper
//  div (the "box") that carries both position:relative AND the
//  height, then center it with a flex outer div.
// ============================================================
const ImgBox: React.FC<{
  src: Parameters<typeof Image>[0]["src"];
  alt: string;
  boxClass: string;
  priority?: boolean;
}> = ({ src, alt, boxClass, priority = false }) => (
  <div className={styles.imgCenter}>
    {/* This single div must be position:relative + have height in CSS */}
    <div className={boxClass}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width:575px) 100vw, (max-width:991px) 90vw, 820px"
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority={priority}
      />
    </div>
  </div>
);

// ============================================================
//  MAIN COMPONENT
// ============================================================
const YogaFAQ: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>

      {/* HERO */}
      <header className={styles.heroSection}>
        <MandalaSVG size={90} className={styles.heroMandalaTL} />
        <MandalaSVG size={90} className={styles.heroMandalaTR} />
        <div className={styles.heroContent}>
          <h1 className={styles.mainTitle}>Yoga Teacher Training Courses in Rishikesh</h1>
          <span className={styles.mainTitleSub}>— FAQ —</span>
        </div>
      </header>

      {/* ABOUT AYM */}
      <section className={styles.section}>
        <p className={styles.aboutLabel}>About AYM - Association for Yoga and Mediation</p>
        <Divider />
        <ImgBox src={yogaschool} alt="AYM Yoga School - Rishikesh" boxClass={styles.schoolImageBox} priority />
        <p className={styles.bodyText}>
          AYM Yoga School is a non-profit organization registered with Govt. of India in 2005. AYM Yoga School is
          located at Upper Tapovan, Laxman Jhulla, Rishikesh. It is perfect for learning and practising yoga as it
          is surrounded by the Himalayas on all sides, full of lush green trees. The holy river Ganga flows through,
          providing a calm and peaceful effect on one&apos;s mind, body, and soul. The cool breeze that flows all
          around in the early morning and the evening makes life at the ashram so soothing and comfortable.
        </p>
        <p className={styles.bodyText}>
          There is a local auto rickshaw, which takes a few hundred rupees to take you to the ashram, or it will
          take 10 minutes by walk to reach the ashram from the main road. The ashram has ample space for comfortable living.
        </p>
      </section>

      <Divider />

      {/* COURSE FAQs */}
      <section className={styles.section}>
        <SectionHeader title="Course" />
        <QA q="Question 1: How much does tuition fee cost and what does it include?"
          a={<>
            <p className={styles.bodyText}><strong>Course Fee:</strong></p>
            <p className={styles.bodyText}><strong>200 Hour Course:</strong> $749 with Dormitory Accommodation / $899 with Shared Accommodation / $1099 with Private Accommodation.</p>
            <p className={styles.bodyText}><strong>300 Hour Course:</strong> $849 with Dormitory Accommodation / $999 with Shared Accommodation / $1199 with Private Accommodation.</p>
            <p className={styles.bodyText}><strong>500 Hour Course:</strong> $1649 with Dormitory Accommodation / $1949 with Shared Accommodation / $2349 with Private Accommodation.</p>
            <p className={styles.bodyText}><strong>Include in Course Fee:</strong></p>
            <ol className={styles.numberedList}>
              <li>Yoga course fee.</li><li>Private / Shared / Dormitory accommodation.</li>
              <li>Yoga Alliance Certificate.</li><li>Three meals with tea.</li>
              <li>Herbel Tea - 24 x 7</li><li>1 Out Tour - Sightseeing</li>
              <li>1 Institute T-Shirt for 200 Hour and 300 Hour / 2 T-shirt for 500-Hours.</li>
              <li>1 Bag with Study material.</li><li>Free Wi-Fi / Internet.</li>
              <li>Washing Machine for Self cloths wash.</li>
            </ol>
          </>} />

        <QA q="Question 2: What subjects do you cover in your curriculum?"
          a={<>
            <p className={styles.bodyText}><strong>Course Curriculum</strong></p>
            <ol className={styles.numberedList}>
              <li>200 Hours yoga curriculum : <a href="#" className={styles.link}>See 200 Hours Yoga Teacher Training in Rishikesh</a></li>
              <li>300 Hours yoga curriculum : <a href="#" className={styles.link}>See 300 Hours Yoga Teacher Training in Rishikesh</a></li>
              <li>500 Hours yoga curriculum : <a href="#" className={styles.link}>See 500 Hours Yoga Teacher Training in Rishikesh</a></li>
            </ol>
          </>} />

        <QA q="Question 3: How experienced in yoga do I need to be?/"
          a={<>
            <p className={styles.bodyText}><strong>200 Hours:</strong> You only need to have basic knowledge of yoga and what it is all about. 200 Hour yoga is for beginners, so there is no need for any experience.</p>
            <p className={styles.bodyText}><strong>300 Hours:</strong> Yes, you should complete 200 hour course before 300 hours yoga course.</p>
          </>} />

        <QA q="Question 4: Do I need to study anything beforehand?"
          a={<>
            <p className={styles.bodyText}>Yes, sure. You can read about the basic poses of yoga and meditation. This will help you during the course. You can also read a book on:</p>
            <ol className={styles.numberedList}>
              <li>Light on Yoga</li><li>Yoga Sutra</li>
              <li>Srimad Bhagavad Gita</li><li>Yoga Anatomy etc...</li>
            </ol>
            <ImgBox src={yogabooks} alt="Yoga books for YTTC" boxClass={styles.booksImageBox} />
          </>} />

        <QA q="Question 5: What exams do I need to pass in order to graduate?"
          a={<p className={styles.bodyText}>You need to Pass your <strong>Hatha and Ashtanga Yoga Practical Exam</strong> and <strong>25 Question</strong> Open book Exam.</p>} />
      </section>

      <Divider />

      {/* ACCOMMODATION & FOOD */}
      <section className={styles.section}>
        <SectionHeader title="Accommodation & Food" />
        <p className={styles.subLabel}>Accommodation at AYM</p>
        <ImgBox src={aymyogaroom} alt="AYM Accommodation rooms" boxClass={styles.schoolImageBox} />
        <p className={styles.bodyText}>
          The school provides residential accommodation to its students. They can choose a single room or shared room
          according to their requirement. There is a private bathroom with shower and geyser facilities in both-
          single and shared rooms. The rooms are kept clean and hygienic. Clean bedsheets, pillow-covers, and pillows
          are provided to make students feel good and happy. The rooms are airy and well-light through sunshine that
          comes through window that is there in each room.
        </p>
        <QA q="Question 1: Do I get a private room and shower?"
          a={<p className={styles.bodyText}>Yes you will get a private room and attached bathroom that comes equipped with shower and warm water.</p>} />
        <QA q="Question 2: Can I stay if I arrive a few nights early?"
          a={<p className={styles.bodyText}>Yes, you can come and stay a few nights before commencing of your course. But you will have to pay some amount for those extra days of stay.</p>} />
        <QA q="Question 3: How fast is your internet?"
          a={<p className={styles.bodyText}>Our internet is fast enough for surfing and studying online. The internet connectivity is good in the school&apos;s premises</p>} />
        <QA q="Question 4: Can i share a room with a friend or any significant person?"
          a={<p className={styles.bodyText}>Yes, We provide the facility for you to opt for single of shared accommodation.</p>} />
        <QA q="Question 5: Do you have laundry facilities?"
          a={<p className={styles.bodyText}>Yes we do provide laundry facility. But if you want, you can also wash your own clothes as we have a washing machine too.</p>} />
        <QA q="Question 5: A/C Rooms and Heater ?"
          a={<p className={styles.bodyText}>If you want A/C Room there is extra cost 100 USD per month, In winter Heater Charges 100 USD per month.</p>} />
      </section>

      <Divider />

      {/* FOOD / MEALS */}
      <section className={styles.section}>
        <SectionHeader title="Food / Meals at AYM" />
        <ImgBox src={yogafood} alt="Delicious Yogic Food at AYM" boxClass={styles.schoolImageBox} />
        <p className={styles.bodyText}>
          Ayurvedic food is provided thrice a day at AYM Yoga School. The food served is completely vegetarian Indian
          food, full of healing properties. The food is easy to digest and helps in maintaining good health while
          providing complete nutrition and improving stamina and immunity. The ayurvedic food also helps recover from
          various pains and injuries. Indian herbal spices such as turmeric powder, coriander, cinnamon, cloves, and
          ginger are used to cook food as these have medicinal properties which help in recovering from ailments and
          provide anti-bodies to the body to fight diseases.
        </p>
        <p className={styles.bodyText}><strong>Note</strong>: We do not provide eggs or non-vegetarian meals. We serve three meals i.e. breakfast, lunch, and dinner as well as tea.</p>
        <p className={styles.bodyText}><strong>Food during Yoga Teacher Training Course:</strong></p>
        <p className={styles.bodyText}><strong>TEA –</strong> Milk tea/Herbal tea/Ayurvedic tea.</p>
        <p className={styles.bodyText}><strong>BREAKFAST –</strong> It includes one solid item and some fruit salad or fruit juice or shake.</p>
        <p className={styles.bodyText}><strong>LUNCH –</strong> It includes pulses, vegetables, rice, chapatti and salad. The food is completely traditional Indian food.</p>
        <p className={styles.bodyText}><strong>DINNER/SUPPER –</strong> It is same as dinner except the fact that efforts are made to make dinner lighter than that given in lunch, as this helps in digestion.</p>
      </section>

      <Divider />

      {/* VISA */}
      <section className={styles.section}>
        <SectionHeader title="Visa" />
        <QA q="Type of Visa Needed - Indian Tourist Visa"
          a={<p className={styles.bodyText}>Please apply for a Tourist Visa only! The purpose of your visit to India should be travel (yoga and meditation, retreats in Rishikesh). Tourist Visa easy to get, and is of longer duration.</p>} />
        <QA q="Help for Visa - Invitation Letter"
          a={<>
            <p className={styles.bodyText}>You don&apos;t need an invitation letter to apply for tourist visa. While filling your visa application form, do not mention that you will be joining a yoga course or yoga retreat program, to avoid any complications. Registering for our yoga course will not help you to get a study or yoga visa.</p>
            <p className={styles.bodyText}>If needs be or if you are asked for an application, then we will provide you with an application.</p>
          </>} />
      </section>

      <Divider />

      {/* HEALTH & SAFETY */}
      <section className={styles.section}>
        <SectionHeader title="Health & Safety" />
        <QA q="Question 1: Is Rishikesh safe?"
          a={<p className={styles.bodyText}>Yes, absolutely. Rishikesh is a Holy city, and most of the people are friendly and helpful. You will find many tourists as it is a tourist destination. It is also safe at night as Rishikesh has a night-life and you are free to roam around even in the evening.</p>} />
        <QA q="Question 2: Is the water safe to drink in India?"
          a={<p className={styles.bodyText}>Yes it is safe to drink water in India. But you can also buy bottled/Bisleri water for your personal hygiene. When you reach AYM, you can fill your bottle with purified water available in kitchen.</p>} />
        <QA q="Question 3: Which vaccines should I get?"
          a={<p className={styles.bodyText}>There is no need as such to get any particular vaccines while traveling to India. But you can consult your doctor to satisfy your fears.</p>} />
        <QA q="Question 4: Should I bring any medicines?"
          a={<p className={styles.bodyText}>If you are suffering from any kind of ailment or disease then you can bring your own medicines, prescribed by your family doctor.</p>} />
      </section>

      <Divider />

      {/* CERTIFICATION */}
      <section className={styles.section}>
        <SectionHeader title="Certification" />
        <ImgBox src={certificateimage} alt="AYM Yoga School Certification ceremony" boxClass={styles.certImageBox} />
        <QA q="Question 1: Is your course certified to Yoga Alliance?"
          a={<p className={styles.bodyText}>Yes, our entire course are certified to and affiliated with Yoga Alliance USA &amp; International Yoga Federation.</p>} />
        <QA q="Question 2: How do I register as a yoga teacher once I have graduated?"
          a={<p className={styles.bodyText}>Once you have completed yoga teacher training course, you will be provided a certificate affiliated to Yoga Alliance USA. You can visit: <a href="#" className={styles.link}>Official website of Yoga Alliance</a> and get yourself registered with them as certified yoga teacher. After that, you will be able to teach yoga in any part of the world.</p>} />
      </section>

      <Divider />

      {/* TRAVEL */}
      <section className={styles.section}>
        <SectionHeader title="Travel" />
        <QA q="Question 1: Which airport should I fly to?"
          a={<>
            <p className={styles.bodyText}>You can take a flight to <strong>IGI Airport</strong> New Delhi.<br />We can provide pickup facility. Distance: (Delhi airport to Aym Yoga School - 250 Km.)</p>
            <p className={styles.bodyText}>Or</p>
            <p className={styles.bodyText}>You can also take the next flight <strong>Delhi to Jolly Grant Airport</strong> Dehradun.<br />We can provide pickup facility. Distance: (Jolly Grant Airport to Aym Yoga School - 20 Km.)</p>
          </>} />
        <QA q="Question 2: Do you provide transportation to/from airport?"
          a={<p className={styles.bodyText}>Yes we can provide pickup/taxi service but additional charges will apply for it.</p>} />
        <QA q="Question 3: How do I get to Rishikesh?"
          a={<>
            <ImgBox src={travelimage} alt="Transport options to Rishikesh" boxClass={styles.transportImageBox} />
            <p className={styles.bodyText}><strong>Pick Up Service By AYM</strong></p>
            <p className={styles.bodyText}>Pickup service from Delhi to AYM Yoga School in Rishikesh.</p>
            <ol className={styles.numberedList}><li>Transportation Charges: 90 US$ for single</li></ol>
            <p className={styles.bodyText}>In case you decide to book a return service also, then it will cost 150 USD (75 USD) each for coming &amp; returning.</p>
            <p className={styles.bodyText}><strong>Taxi –</strong> If you haven&apos;t booked pickup service with us then you can also hire taxi from outside the airport. They will charge 200-250 US$ from Airport to AYM Yoga School, Rishikesh.</p>
            <p className={styles.bodyText}><strong>Bus –</strong> If you choose to travel by bus then you must first travel from Airport to Delhi ISBT by auto or by taxi, which is around 20-30 Km away.</p>
            <ol className={styles.numberedList}>
              <li>From there you can take an a/c or non-a/c bus to ISBT Rishikesh.</li>
              <li>Both the buses will take 7 hrs. And their charges will vary accordingly</li>
              <li>After reaching ISBT Rishikesh, you can hire a taxi or an auto to come to AYM Yoga School.</li>
            </ol>
            <p className={styles.bodyText}><strong>Train –</strong> You can hire a taxi or an auto to reach New Delhi Railway station from Airport.</p>
            <ol className={styles.numberedList}>
              <li>You must then take a train from Delhi to Haridwar (No Direct Train from Delhi to Rishikesh).</li>
              <li>Once you have reached Haridwar railway station, you can hire a taxi or take a pickup service, which would cost you 20 US$.</li>
            </ol>
            <p className={styles.bodyText}><strong>From Dehradun (Jolly Grant Airport):-</strong></p>
            <p className={styles.bodyText}>Pickup service by school: from Dehradun (Jolly Grant Airport) to AYM Yoga School in Rishikesh.</p>
            <ol className={styles.numberedList}><li>Transportation Cost: 20 US$.</li></ol>
            <p className={styles.bodyText}><strong>Taxi –</strong> They will also charge 20 US$ from Airport to AYM Yoga School, Rishikesh.</p>
          </>} />
        <QA q="Question 4: When should I book my arrival flight?"
          a={<p className={styles.bodyText}>You can book your flight according to your convenience, but ensure that you should reach India a day in advance of the beginning of your course.</p>} />
        <QA q="Question 5: When should I book my departure flight?"
          a={<p className={styles.bodyText}>You can book your flight according to your convenience. You are free to leave the school a day after your course is completed.</p>} />
        <QA q="Question 6: What if I need to switch my course date?"
          a={<p className={styles.bodyText}>You can switch your course dates at least 1 week before the date booked by you so that the seat can be allotted to someone else. The course can be done within 1 year time from the date of your first booking.</p>} />
      </section>

      <Divider />

      {/* WHAT TO BRING */}
      <section className={styles.section}>
        <SectionHeader title="What to bring to the school?" />
        <QA q="Question 1: What should I pack?"
          a={<p className={styles.bodyText}>If you are coming in summers then bring some light cotton clothes. If your course is scheduled for winters, bring warm clothes such as sweater and woolen-ware with you.</p>} />
        <QA q="Question 2: How much money should I bring?"
          a={<p className={styles.bodyText}>You can bring money according to the course fee, your travel expenses and some extra money in case of emergency.</p>} />
      </section>

      <Divider />

      {/* PAYMENT OPTION */}
      <section className={styles.section}>
        <SectionHeader title="Payment Option" />
        <p className={styles.bodyText}>Our school would like it if you pay the rest of the balance amount on arrival on the first day of yoga ttc at school office. We accept :</p>
        <ol className={styles.numberedList}>
          <li>Cash in Indian Rupee, American Dollar, Australian currency or European currency.</li>
          <li>Transferwise: transferwise.com.</li>
          <li>Credit Cards/Debit Cards <strong>[ 3.5 % Extra Charge ]</strong></li>
        </ol>
      </section>

      <Divider />

      {/* COMMON QUESTIONS ACCORDION */}
      <section className={styles.section}>
        <SectionHeader title="Some Common Questions - Yoga Teacher Training" />
        <div className={styles.accordionWrapper}>
          <FAQItem question="How long did it take you to become a yoga teacher?"
            answer="You can enrol for our 200 hour yoga teacher training program, which is a complete program. The duration of the 200 hour yoga program is 24 days. After completion of that yoga program, you will become eligible to register yourself as an RYT 200 with Yoga Alliance, USA."
            defaultOpen={true} />
          <FAQItem question="Where can I do online yoga teacher training?"
            answer="You can enrol in our online yoga teacher training certificate programs. AYM yoga schools offer 200 hour and 300 hour online yoga teacher training programs. These yoga programs are offered in two modules: one is live yoga teacher training that is based on the live session via Zoom, and the second module is recorded yoga teacher training." />
          <FAQItem question="How to become a certified yoga teacher in India?"
            answer="You must enrol yourself in a yoga teacher training program in India from the yoga school that Yoga Alliance USA recognizes." />
          <FAQItem question="Where is the best pregnancy yoga teacher training?"
            answer="AYM Yoga School in Rishikesh offers the best pregnancy yoga teacher training. Our yoga program offers a balanced mix of theory and practical yoga teaching, specializing in pregnancy. It will equip you with the proper knowledge and tools so that you can teach yoga to a pregnant lady in a safe manner." />
          <FAQItem question="Where is the best yoga teacher training in India?"
            answer="AYM Yoga School in Rishikesh has the best yoga teacher training in India. Their yoga teacher training programs are structured and complete and make you an efficient yoga teacher with complete yogic knowledge." />
          <FAQItem question="How to become an Ayush certified yoga teacher?"
            answer="To become an Ayush-certified yoga teacher, you can enrol in Ayush-certified yoga courses offered by AYM yoga school in Rishikesh, the only YCB-recognized yoga school in Rishikesh" />
          <FAQItem question="Which is the best yoga school in Rishikesh?"
            answer="AYM yoga school in Rishikesh is one of the best yoga schools in Rishikesh. We have over a decade of offering Yoga Alliance-certified yoga teacher training courses." />
          <FAQItem question="What is the best place to learn yoga?"
            answer="Rishikesh, Kerala, Dharamshala, Goa and Mysore are some of the best places to learn yoga." />
          <FAQItem question="Is Rishikesh, India the best place for yoga?"
            answer="Yes, Rishikesh is one of the best places to learn yoga, as yoga was born in Rishikesh, and it is famous as the yoga capital of the world. Also, the spiritual aura of the river Ganga, a splendid natural landscape, makes Rishikesh a perfect place to learn yoga." />
        </div>
      </section>

      {/* FOOTER MANDALA */}
      <div className={styles.footerMandala}>
        <MandalaSVG size={160} />
      </div>

    </div>
  );
};

export default YogaFAQ;
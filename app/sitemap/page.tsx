import Link from "next/link";
import styles from "./sitemap-page.module.css";

export const metadata = {
    title: "Sitemap | AYM Yoga School",
};

const section0 = [
    { label: "Yoga Teacher Training in Rishikesh | Yoga TTC India - AYM", href: "/" },
    { label: "Yoga Alliance Registered Yoga School in Rishikesh, India", href: "/yoga-alliance-yoga-school" },
    { label: "Yoga School in India - Yoga School in Rishikesh - RYS 200", href: "/yoga-school-in-india" },
    { label: "Yoga TTC in India | Yoga TTC in Rishikesh", href: "/yoga-teacher-training-in-rishikesh" },
    { label: "Best Yoga Teacher in India | Yoga Teacher in Rishikesh- AYM Yoga School", href: "/yoga-teacher-in-rishikesh" },
    { label: "One & Two Week Yoga Retreat in Rishikesh, India", href: "/yoga-retreats-in-rishikesh" },
    { label: "Yoga Meditation Workshop in Rishikesh, India - AYM Yoga School", href: "/yoga-meditation-workshop-india" },
    { label: "Yoga Teacher Training in Goa, India - Yoga School in Goa", href: "/yoga-goa-in-india" },
    { label: "Yoga Teacher Training course Ubud Bali - Yoga Training Course in Ubud, Bali", href: "/yoga-teacher-training-course-bali" },
    { label: "Yoga Ayurveda Course in Rishikesh - India", href: "/yoga-ayurveda-teacher-training-rishikesh" },
    { label: "Online Yoga Courses in India - Online Yoga Teacher Training Rishikesh", href: "/online-yoga-course" },
    { label: "Yoga College in Rishikesh : M. A. Yoga Diploma", href: "/yoga-college-in-rishikesh" },
    { label: "Registered Yoga School in Rishikesh - Certificate Yoga course in Rishikesh", href: "/yoga-registration" },
    { label: "Yoga Teacher Training Fees in India | 200 Hour Yoga ttc", href: "/200-hour-yoga-ttc-fees" },
    { label: "Yoga Ashrams in India | Yoga Ashrams in Rishikesh - AYM Yoga", href: "/yoga-ashrams-in-india" },
    { label: "Yoga Holidays in India, Yoga Camps in Rishikesh, India", href: "/yoga-holidays-in-india" },
    { label: "Inner Awakening Program - Spiritual Transformation Yoga in Rishikesh, India", href: "/inner-awakening" },
    { label: "Yoga For Beginners in India | Yoga For Beginners in Rishikesh", href: "/yoga-for-beginners-in-india" },
    { label: "Yoga Ayurveda Detox Retreat in Rishikesh India", href: "/yoga-ayurveda-detox-retreat" },
    { label: "100 hour yoga teacher training in Rishikesh, India", href: "/100-hour-yoga-teacher-training-in-rishikesh" },
    { label: "200 Hour Yoga Teacher Training in Rishikesh | 200 Hour Yoga TTC India", href: "/200-hour-yoga-teacher-training-rishikesh" },
    { label: "300 Hour Yoga Teacher Training in Rishikesh | 300 Hour Yoga TTC India", href: "/300-hours-yoga-teacher-training-rishikesh" },
    { label: "500 Hour Yoga Teacher Training Rishikesh | 500 Hour Yoga Teacher Training in India", href: "/500-hour-yoga-teacher-training-india" },
    { label: "Best Yoga Teacher Training in Rishikesh - Yoga Teacher Training Rishikesh", href: "/yoga-teacher-training-in-rishikesh" },
    { label: "100 Hour Prenatal Yoga Teacher Training Course in Rishikesh India", href: "/prenatal-yoga-teacher-training-course" },
    { label: "Vinyasa Yoga Teacher Training in Rishikesh, India", href: "/vinyasa-teacher-training-india" },
    { label: "Yoga Teacher Training Photos Gallery | Yoga Picture in Rishikesh", href: "/yoga-photos-india" },
    { label: "Yoga Sanskrit Glossary : Yoga Teacher Training India", href: "/yoga-sanskrit-glossary" },
    { label: "Information about Yoga in India | Yoga in Rishikesh - FAQ", href: "/yoga-ttc-rishikesh" },
    { label: "Yoga Teacher Training India Reviews, Ratings & Testimonials", href: "/testimonials" },
    { label: "Yoga Volunteer Program at AYM Yoga School", href: "/yoga-volunteer" },
    { label: "Online International Yoga Competition", href: "/international-yoga-competition" },
    { label: "How To Reach Rishikesh at AYM yoga from Delhi", href: "/how-to-reach-rishikesh-from-delhi" },
    { label: "Yoga Center in Rishikesh - Yoga in India", href: "/contact" },
    { label: "Yoga Teacher Training Rishikesh India Blogs - AYM Studnets Blogs", href: "/yoga-teacher-training-rishikesh-india-blogs" },
    { label: "AYM Yoga School - Site Map", href: "/sitemap" },
    { label: "Yoga Teacher India | Yoga Guru in India", href: "/yoga-teacher-india" },
    { label: "Yoga Teacher Training in India - Yoga Teacher Training Course in India", href: "/yoga-teacher-training-in-india" },
    { label: "Hatha Yoga Teacher Training in India : Hatha Yoga Rishikesh", href: "/hatha-yoga-teacher-training-Rishikesh" },
];

const section1 = [
    { label: "Yoga Teacher Training India - AYM Yoga Blog", href: "/blog/aym-yoga-blog" },
    { label: "How To Select a Yoga Teacher Training Programs in Rishikesh India", href: "/blog/how-to-select-a-yoga-teacher-training-programs-in-india" },
    { label: "International Yoga Day : International Yoga Festival 2017", href: "/blog/international-yoga-festival-day" },
    { label: "Learning Yoga in India : Learn Yoga Teacher Training India", href: "/blog/learn-yoga-in-india" },
    { label: "What are some simple yoga poses for beginners?", href: "/blog/yoga-poses-for-beginners" },
    { label: "Pranayama for Beginners - Yoga Breathing Exercises", href: "/blog/pranayama" },
    { label: "Meditation in Rishikesh", href: "/blog/yoga-meditation-in-rishikesh" },
    { label: "Ashtanga Yoga Teacher Training in Rishikesh India - AYM", href: "/blog/ashtanga-yoga-teacher-training-india" },
    { label: "Iyengar Yoga India - utthita parsvakonasana", href: "/blog/utthita-parsvakonasana-or-side-angle-pose" },
    { label: "Teaching Yoga As a Profession - Consultants and Mentors", href: "/blog/teaching-yoga-as-a-profession-consultants-and-mentors" },
    { label: "How yoga makes you healthy and happy life?", href: "/blog/how-yoga-makes-you-healthy-and-happy-life" },
    { label: "Prevent injuries in yoga Steps to Preventing Injury at Yoga Class", href: "//blog/how-to-prevent-injuries-during-yoga-practice" },
    { label: "International Yoga Day 2018 - Prime Minister Modi Ji", href: "//blog/international-yoga-day-2018-with-prime-minister" },
    { label: "Sattvic Foods to Balance Your Body and Mind", href: "/blog/sattvic-foods-to-balance-your-body-and-mind" },
    { label: "Why Does Meditation Make You Feel So Rested?", href: "/blog/why-does-meditation-make-you-feel-so-relexed" },
    { label: "The Difference between Yoga and Yoga Therapy - AYM Yoga School", href: "/blog/the-difference-between-yoga-and-yoga-therapy" },
    { label: "Yoga in The Workplace can Reduce Back Pain and Sickness Absence", href: "/blog/yoga-in-the-workplace-can-reduce-back-pain-and-sickness-absence" },
    { label: "Yoga poses to boost the immune system to fight against covid", href: "/blog/yoga-poses-to-boost-the-immune-system" },
    { label: "Introduction of Asana - Yoga in India", href: "/blog/asana" },
    { label: "How to do Sun Salutations (Surya Namaskar) Steps and Benefits", href: "/blog/surya-namaskar" },
    { label: "Triangle Pose | Trikonasana : Benefits of Yoga", href: "/blog/triangle-pose-or-trikonasana-benefits" },
    { label: "Warrior Pose | Veerabhadrasana - Steps and Benefits", href: "/blog/warrior-pose" },
    { label: "Parivrtta Trikonasana (Triangle Pose) - Steps and Benefits", href: "/blog/parivrtta-trikonasana-and-benifits" },
    { label: "How Yoga Can Improve Your Corporate Culture", href: "/blog/how-yoga-can-improve-your-corporate-culture" },
    { label: "Importance of Yoga - Yoga Teacher Training", href: "/blog/importance-of-yoga" },
    { label: "Here\'s How Digestion Works & How to Improve Yours - How To Keep Your Digestive System As Healthy As Possible", href: "/blog/how-digestion-works-and-how-to-improve" },
    { label: "Celebrate Holi the festival of colours in your yoga class", href: "/blog/celebrate-holi-the-festival-of-colour" },
    { label: "Always Stay Positive with Yoga - 2021", href: "/blog/always-stay-positive-with-yoga" },
    { label: "Yoga to Open Your Mind", href: "/blog/yoga-to-open-your-mind" },
    { label: "Yoga for Neck and Shoulder Pain - 3 poses for neck and shoulder", href: "/blog/yoga-for-neck-and-shoulder-pain" },
    { label: "What is the relationship between Yoga and Ayurveda", href: "/blog/what-is-the-relationship-between-yoga-and-ayurveda" },
    { label: "Best Yoga Breathing Exercises, Both On and Off Your Mat", href: "/blog/best-yoga-breathing-exercises" },
    { label: "Yoga Poses to Practice First Thing in the Morning", href: "/blog/yoga-poses-to-practice-first-thing-in-the-morning" },
    { label: "The Meaning of Namaste - Why Do We Say It in Yoga?", href: "/blog/the-meaning-of-namaste" },
    { label: "Why yoga is better than gym? - 5 Reasons to choose yoga over gym", href: "/blog/5-reasons-to-choose-yoga-over-the-gym" },
    { label: "What is Mantra? Why do we sing mantra in every yoga class?", href: "/blog/why-do-we-sing-mantra-in-every-yoga-class" },
    { label: "5 Best Ways to Prevent Yoga Injuries |", href: "/blog/best-ways-to-prevent-yoga-injuries" },
    { label: "How to improve your immune system with food and yoga?", href: "/blog/best-yoga-pose-to-improve-your-immune-system" },
    { label: "Yoga Asanas for Better Hair Growth & help Accelerate Hair Growth", href: "/blog/yoga-asanas-for-better-hair-growth" },
    { label: "7 Best Yoga Poses for Diabetes Patient to Control Diabetes", href: "/blog/best-yoga-poses-for-diabetes-patient" },
    { label: "Face Yoga Exercises at Home", href: "/blog/face-yoga-exercises-at-home" },
    { label: "The 10 Best Things to Know Before Meditation", href: "/blog/the-10-best-things-to-know-before-meditation" },
    { label: "How to support your students wellbeing During Covid-19", href: "/blog/how-to-support-your-students-wellbeing-during-covid-19" },
    { label: "What to wear to your first yoga class", href: "/blog/what-to-wear-to-your-first-yoga-class" },
    { label: "prepare your space for deep sleep", href: "/blog/prepare-your-space-for-deep-sleep" },
    { label: "What is Coronavirus - Prevention of coronavirus", href: "/blog/prevention-of-coronavirus" },
    { label: "Six Helpful tips to becoming the best Yoga teacher in Rishikesh, India", href: "/blog/six-helpful-tips-to-becoming-the-best-yoga-teacher" },
    { label: "Top 10 300 Hour yoga Teacher Training School in India", href: "/blog/top-10-300-hour-yoga-teacher-training-school-in-india" },
    { label: "Top 10 - 200 Hour Yoga Course In Rishikesh, India", href: "/blog/top-10-200-hour-yoga-teacher-training-in-india" },
    { label: "Where should i complete 200 Hour Yoga Certification in Rishikesh", href: "/blog/200-hour-yoga-teacher-training-certification-courses" },
    { label: "Best place to learn Multistyle yoga teacher training in india", href: "/blog/multi-style-yoga-teacher-training" },
    { label: "Guidelines for Pregnant Yoga - Pregnant Yoga Course in Rishikesh", href: "/blog/pregnant-yoga-course-rishikesh" },
    { label: "Benefits of Ayurveda Yoga Teacher Training in Rishikesh India", href: "/blog/benefits-of-ayurveda-yoga-teacher-training-rishikesh" },
    { label: "What is the meaning of Om and How It is Used in Yoga?", href: "/blog/the-meaning-of-om" },
    { label: "Pregnancy Yoga Course in India - Pregnancy Yoga Rishikesh", href: "/blog/pregnancy-yoga-course-india" },
    { label: "June 21st International Yoga Day 2017 Rishikesh India", href: "/blog/international-yoga-day" },
    { label: "Types of Yoga Asanas and Poses - Yoga School in India", href: "/blog/types-of-yoga-asana" },
    { label: "Yoga for Increasing Concentration and Memory", href: "/blog/yoga-for-increasing-concentration-and-memory" },
    { label: "Breathing Techniques - Why are they essential to yoga", href: "/blog/breathing-techniques" },
    { label: "Plan your yogic journey this summer in Rishikesh India", href: "/blog/yogic-journey-this-summer-in-india" },
    { label: "Health Benefits of Yoga | Benefits of Yoga in Daily Life", href: "/blog/health-benefits-of-yoga" },
    { label: "Yoga Poses to Open Your Heart and Mind", href: "/blog/yoga-poses-to-open-heart-and-mind" },
    { label: "Yoga Poses to Helps with Migraine Headaches", href: "/blog/yoga-for-migraine-and-headache" },
    { label: "The Benefits of Asanas Yoga : Health Benefits of Yoga Asanas", href: "/blog/benefits-of-asana" },
    { label: "How Yoga Can Help with Anxiety : 5 Yoga Poses for Anxiety", href: "/blog/yoga-can-help-with-anxiety" },
    { label: "Yoga For Women | Benefits of Yoga", href: "/blog/yoga-for-women" },
    { label: "Yoga Gurus in India : 10 Yoga masters in India", href: "/blog/yoga-gurus-in-india" },
    { label: "Yoga Postures to Keep you refreshed on Travels", href: "/blog/yoga-poses-when-you-travel" },
    { label: "5 Effective Yoga asanas to treat PCOS", href: "/blog/yoga-asanas-to-relieve-symptoms-of-pcos" },
    { label: "5 Simple Yoga Asanas That Will Help Increase Your Height", href: "/blog/yoga-will-help-increase-your-height." },
    { label: "What is the difference between yoga, hatha yoga & power yoga?", href: "/blog/difference-between-hatha-yoga-and-power-yoga" },
    { label: "Benefits of yoga before sleeping at night", href: "/blog/benefits-of-yoga-before-sleeping-at-night" },
    { label: "What is Gayatri mantras & health benefits of Gayatri mantras?", href: "/blog/health-benefits-of-gayatri-mantras" },
    { label: "How are yoga and pranayama helpful for high blood pressure or BP?", href: "/blog/yoga-and-pranayama-helpful-for-high-blood-pressure" },
    { label: "What is Yoga Philosophy & Guidelines for Life?", href: "/blog/what-is-yoga-philosophy" },
    { label: "5 Powerful Reasons To Practice Pranayama - YOGA", href: "/blog/5-powerful-reasons-to-practice-pranayama" },
    { label: "Yoga Poses for Women - Yoga Poses in Rishikesh, India", href: "/blog/yoga-poses-for-women" },
    { label: "Yoga to Improve Sleep Disorder - Yoga Poses to Help Sleep Better", href: "/yblog/yoga-to-improve-sleep" },
    { label: "Trained you in performing various yoga postures perfectly", href: "/blog/trained-you-in-performing-various-yoga-postures-perfectly" },
    { label: "Reasons for practicing chair yoga - Yoga Training in Rishieksh", href: "/blog/reasons-for-practicing-chair-yoga" },
    { label: "How to Prepare Yourself for First Yoga Class : Yoga Courses India", href: "/blog/how-to-prepare-for-first-yoga-class" },
    { label: "Yoga for Naturally Glowing Skin - Skin Glow Tips", href: "/blog/yoga-for-glow-skin" },
    { label: "List of 20 yoga schools in Rishikesh : Yoga in Rishikesh", href: "/blog/list-of-top-yoga-schools-in-rishikesh" },
    { label: "Patanjali\'s yoga sutra | Patanjali\'s Niyamas", href: "/blog/patanjali-niyamas-of-yoga" },
    { label: "Why Rishikesh for Yoga ? - Yoga Courses in Rishikesh", href: "/blog/why-rishikesh-for-yoga" },
    { label: "Yoga For Stress Relief : Dealing Stress with Yoga", href: "/blog/yoga-for-stress-relief" },
    { label: "What is stress ? - How to deal stress with Yoga", href: "/blog/what-is-stress" },
    { label: "Kapalbhati Pranayama Techniques", href: "/blog/kapalabhati" },
    { label: "Sahaja Kapalabhati - Breathing Benefits", href: "/blog/sahaja-kapalabhati" },
    { label: "Important Mudras of Yoga : Yoga Mudras", href: "/blog/important-yoga-of-mudras" },
    { label: "7 Yoga Poses to Open Your Seven Chakras", href: "/blog/seven-chakras" },
    { label: "Kundalini Yoga : Benefits and Practices", href: "/blog/kundalini-yoga" },
    { label: "Ashtanga Vinyasa - Primary Series - Complete Sequence", href: "/blog/ashtanga-vinyasa-primary-series" },
    { label: "Warrior Pose II | Veerabhadrasana 2 - Steps and Benefits", href: "/blog/virbhadrasana-II" },
    { label: "What is yoga ? - Yoga Teacher Training In India", href: "/blog/what-is-yoga" },
    { label: "Yoga Mantra - Meaning : Sanskrit Mantra", href: "/blog/yoga-mantra" },
    { label: "Learn how to experience peace on yoga retreats and in ashrams", href: "/blog/learn-how-to-experience-peace-on-yoga-retreats" },
    { label: "Before You Start Doing Yoga - Yoga Teacher Training", href: "/blog/before-you-start-doing-yoga" },
    { label: "How to get your 200 hour yoga certification in india?", href: "/blog/yoga-teacher-training-certification" },
    { label: "Selecting a Yoga Center and Yoga Apparel", href: "/blog/selecting-yoga-center-and-yoga-apparel" },
    { label: "Benefits of Meditation and Yoga Practice in Rishikesh India", href: "/blog/benefits-of-meditation-and-yoga-practice" },
];

const section2 = [
    { label: "Yoga Teacher Training", href: "/world-wide" },
    { label: "Yoga Teacher Training In Germany", href: "/world-wide/yoga-teacher-training-in-germany" },
    { label: "Yoga Teacher Training In Italy", href: "/world-wide/yoga-teacher-training-in-italy" },
    { label: "Yoga Teacher Training In Switzerland", href: "/world-wide/yoga-teacher-training-in-switzerland" },
    { label: "Yoga Teacher Training In Poland", href: "/world-wide/yoga-teacher-training-in-poland" },
    { label: "Yoga Teacher Training Course in Pokhara", href: "/world-wide/yoga-teacher-training-course-in-pokhara" },
    { label: "Yoga Teacher Training in Koh Samui", href: "/world-wide/yoga-teacher-training-in-koh-samui" },
    { label: "Yoga Teacher Training in Maldives", href: "/world-wide/yoga-teacher-training-in-maldives" },
    { label: "Yoga Teacher Training in New Zealand", href: "/world-wide/yoga-teacher-training-in-new-zealand" },
    { label: "Yoga Teacher Training in Koh Phangan", href: "/world-wide/yoga-teacher-training-in-koh-phangan" },
    { label: "Yoga Teacher Training in Vietnam", href: "/world-wide/yoga-teacher-training-in-vietnam" },
    { label: "Yoga Teacher Training in Thailand", href: "/world-wide/yoga-teacher-training-in-thailand" },
    { label: "200 Hour Yoga Teacher Training in Nepal", href: "/world-wide/yoga-teacher-training-in-nepal" },
    { label: "200 Hour Yoga Teacher Training in Europe", href: "/world-wide/yoga-teacher-training-in-europe" },
    { label: "Yoga Teacher Training in Philippines", href: "/world-wide/yoga-teacher-training-in-philippines" },
    { label: "Yoga Teacher Training in Malaysia", href: "/world-wide/yoga-teacher-training-in-malaysia" },
    { label: "Yoga Teacher Training in Asia", href: "/world-wide/yoga-teacher-training-in-asia" },
    { label: "Yoga Teacher Training in Ubud", href: "/world-wide/yoga-teacher-training-in-ubud" },
    { label: "Yoga Teacher Training in Hong Kong", href: "/world-wide/yoga-teacher-training-in-hong-kong" },
    { label: "Yoga Teacher Training in Indonesia", href: "/world-wide/yoga-teacher-training-in-indonesia" },
];

const section3 = [
    { label: "Yoga Teacher Training India - AYM Yoga School", href: "/yoga-teacher-training" },
    { label: "Yoga Teacher Training Kerala - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Kerala-94-2168" },
    { label: "Yoga Teacher Training Jaipur - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Jaipur-94-2194" },
    { label: "Yoga Teacher Training Puducherry - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Puducherry-94-2185" },
    { label: "Yoga Teacher Training Mysore - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Mysore-94-2170" },
    { label: "Yoga Teacher Training Pushkar - AYM Yoga School", href: "/yyoga-teacher-training/yoga-teacher-training-Pushkar-94-2192" },
    { label: "Yoga Teacher Training Haryana - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Haryana-94-2186" },
    { label: "Yoga Teacher Training Sikkim - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Sikkim-94-2198" },
    { label: "Yoga Teacher Training Agra - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Agra-94-2197" },
    { label: "Yoga Teacher Training Gurugram - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Gurugram-94-2195" },
    { label: "Yoga Teacher Training Mumbai - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Mumbai-94-2175" },
    { label: "Yoga Teacher Training Pune - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Pune-94-2171" },
    { label: "Yoga Teacher Training Coimbatore - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Coimbatore-94-2182" },
    { label: "Yoga Teacher Training Chennai - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Chennai-94-2184" },
    { label: "Yoga Teacher Training Uttrakhand - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Uttrakhand-94-2173" },
    { label: "Yoga Teacher Training Varanasi - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Varanasi-94-2183" },
    { label: "Yoga Teacher Training Varkala - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Varkala-94-2188" },
    { label: "Yoga Teacher Training Maharashtra - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Maharashtra-94-2189" },
    { label: "Yoga Teacher Training Gokarna - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Gokarna-94-2180" },
    { label: "Yoga Teacher Training Arambol - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Arambol-94-2181" },
    { label: "Yoga Teacher Training Tamil Nadu - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Tamil%20Nadu-94-2187" },
    { label: "Yoga Teacher Training Thiruvananthapuram - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Thiruvananthapuram-94-2193" },
    { label: "Yoga Teacher Training Goa - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Goa-94-2167" },
    { label: "Yoga Teacher Training Kolkata - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Kolkata-94-2196" },
    { label: "Yoga Teacher Training Kochi - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Kochi-94-2190" },
    { label: "Yoga Teacher Training Rishikesh - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Rishikesh-94-2166" },
    { label: "Yoga Teacher Training Munger - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Munger-94-2177" },
    { label: "Yoga Teacher Training Himachal Pradesh - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Himachal%20Pradesh-94-2178" },
    { label: "Yoga Teacher Training Dharamshala - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Dharamshala-94-2169" },
    { label: "Yoga Teacher Training Bengaluru - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Bengaluru-94-2179" },
    { label: "Yoga Teacher Training Lonavala - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Lonavala-94-2174" },
    { label: "Yoga Teacher Training Auroville - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Auroville-94-2191" },
    { label: "Yoga Teacher Training New Delhi - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-New%20Delhi-94-2176" },
    { label: "Yoga Teacher Training Bihar - AYM Yoga School", href: "/yoga-teacher-training/yoga-teacher-training-Bihar-94-2172" },
];

export default function SitemapPage() {
    return (
        <main className={styles.sitemapPage}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Sitemap : AYM Yoga School</h1>

                <h2 className={styles.sectionTitle}>Important Link</h2>
                <div className={styles.linkGrid}>
                    {section0.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.linkBox}>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <h2 className={styles.sectionTitle}>AYM Yoga Blog</h2>
                <div className={styles.linkGrid}>
                    {section1.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.linkBox}>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <h2 className={styles.sectionTitle}>Yoga Teacher Training's World-Wide</h2>
                <div className={styles.linkGrid}>
                    {section2.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.linkBox}>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <h2 className={styles.sectionTitle}>Yoga Teacher Training's Locations</h2>
                <div className={styles.linkGrid}>
                    {section3.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.linkBox}>
                            {item.label}
                        </Link>
                    ))}
                </div>

               <h2 className={styles.sectionTitle}>Surya Namaskar PDF</h2>
<div className={styles.linkGrid}>
    <a
        href="/pdf/ashtanga-vinyasa.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkBox}
    >
        Ashtanga Vinyasa - Surya Namaskar PDF
    </a>
</div>
            </div>
        </main>
    );
}
// ═══════════════════════════════════════════════════
// FILE LOCATION: src/lib/blogs.ts
// ═══════════════════════════════════════════════════

export interface BlogImage {
  src: string;
  caption: string;
}

export interface BlogSection {
  type: "heading" | "subheading" | "paragraph" | "images" | "divider";
  text?: string;
  images?: BlogImage[];
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  category: string;
  image: string;
  tags?: string[];
  content?: BlogSection[];
}

export const allBlogs: Blog[] = [
  // ─────────────────────────────────────────────────────
  // BLOG 1
  // ─────────────────────────────────────────────────────
  {
    id: "1",
    slug: "top-5-advantages-yoga-teacher-training-course",
    title: "Top 5 Advantages of Yoga Teacher Training Course",
    excerpt:
      "Yoga studios are booming now in every nook and corner of the world. But how do we know if the trainers there are qualified enough to guide others on yoga? These days, thousands of yoga practitioners worldwide are taking their practice to the next level.",
    date: "04 July 2022",
    author: "Swami Arvind",
    category: "Yoga Teacher Training",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&q=80",
    tags: ["Yoga Teacher Training", "Rishikesh", "Yoga"],
    content: [
      {
        type: "heading",
        text: "What is Yoga Teacher Training?",
      },
      {
        type: "paragraph",
        text: "Yoga Teacher Training (YTT) is an immersive, transformative program designed for those who wish to deepen their personal yoga practice and share the ancient wisdom of yoga with others. Rooted in the traditions of Rishikesh — the yoga capital of the world — these programs blend classical teachings with modern pedagogical techniques to create well-rounded, confident teachers.",
      },
      {
        type: "paragraph",
        text: "Whether you aspire to become a certified yoga teacher or simply wish to deepen your understanding of yogic philosophy, a structured YTT course offers transformative benefits for your body, mind, and spirit. AYM Yoga School offers internationally accredited 200-hour, 300-hour, and 500-hour YTT programs recognized by Yoga Alliance.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
            caption: "Morning Asana Practice at AYM Yoga School, Rishikesh",
          },
          {
            src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            caption: "Students in guided group practice session",
          },
        ],
      },
      {
        type: "heading",
        text: "Top 5 Advantages of Yoga Teacher Training",
      },
      {
        type: "subheading",
        text: "1. Deepened Self-Awareness & Personal Transformation",
      },
      {
        type: "paragraph",
        text: "One of the most profound gifts of a YTT program is the journey inward. Through daily asana practice, pranayama, and meditation, students cultivate a heightened awareness of their physical and mental patterns. This self-knowledge becomes the foundation of authentic, compassionate teaching.",
      },
      {
        type: "subheading",
        text: "2. Mastery of Asana & Precise Alignment",
      },
      {
        type: "paragraph",
        text: "A well-structured YTT curriculum ensures students develop a safe, effective, and methodical approach to yoga postures. Understanding proper alignment protects practitioners from injury and allows teachers to guide students of all levels with confidence and clarity. You will learn anatomy, biomechanics, and hands-on adjustments.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
            caption: "Alignment coaching and hands-on adjustments",
          },
          {
            src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
            caption: "Advanced asana practice — Eka Pada Koundinyasana",
          },
          {
            src: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80",
            caption: "Partner yoga and trust-building exercises",
          },
        ],
      },
      {
        type: "subheading",
        text: "3. Understanding of Yogic Philosophy",
      },
      {
        type: "paragraph",
        text: "Beyond the physical postures lies a rich philosophical tradition — Patanjali's Yoga Sutras, the Bhagavad Gita, the eight limbs of yoga. YTT courses immerse students in this wisdom, providing context that elevates every aspect of their practice and teaching. Philosophy is not just theory — it becomes a lived experience.",
      },
      {
        type: "subheading",
        text: "4. Global Community & Lifelong Network",
      },
      {
        type: "paragraph",
        text: "YTT programs attract students from across the globe, creating a diverse and inspiring community. The bonds forged during these intensive courses often last a lifetime — a global network of fellow practitioners and teachers who share your values, passion, and dedication to yoga.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
            caption: "International students sharing the sacred journey at AYM",
          },
        ],
      },
      {
        type: "subheading",
        text: "5. Worldwide Career Opportunities",
      },
      {
        type: "paragraph",
        text: "A Yoga Alliance-certified YTT certificate from AYM Yoga School opens doors to teaching opportunities in studios, retreat centres, wellness resorts, cruise ships, and corporate wellness programs worldwide. The global demand for qualified yoga teachers continues to grow exponentially year after year, making this one of the most fulfilling career paths available today.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOG 2
  // ─────────────────────────────────────────────────────
  {
    id: "2",
    slug: "30-minute-yoga-sequence-to-refresh-rejuvenate",
    title: "30-Minute Yoga Sequence to Refresh & Rejuvenate",
    excerpt:
      "Any practice becomes perfect once there is a routine set for the same, to perform it every day for a given period of time. Are you wondering how to create a simple yoga sequence that you could follow every day?",
    date: "28 June 2022",
    author: "Priya Sharma",
    category: "Yoga",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    tags: ["Yoga", "Health", "Fitness"],
    content: [
      {
        type: "heading",
        text: "Why a 30-Minute Yoga Routine Works",
      },
      {
        type: "paragraph",
        text: "Consistency beats intensity every time. A focused 30-minute yoga sequence practiced daily will produce far greater benefits than an occasional hour-long session. This sequence has been designed by our senior teachers at AYM Yoga School to be accessible to all levels while offering depth for more experienced practitioners.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            caption: "Begin with gentle warm-up and centering breath",
          },
          {
            src: "https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=800&q=80",
            caption: "Sun Salutation — Surya Namaskar sequence",
          },
        ],
      },
      {
        type: "heading",
        text: "The Complete 30-Minute Sequence",
      },
      {
        type: "subheading",
        text: "Minutes 1–5: Grounding & Centering",
      },
      {
        type: "paragraph",
        text: "Begin seated in Sukhasana (Easy Pose). Close your eyes and observe your natural breath for 2 minutes. Then take 10 rounds of deep diaphragmatic breathing — inhale for 4 counts, hold for 2, exhale for 6. This activates the parasympathetic nervous system, preparing your body and mind for practice.",
      },
      {
        type: "subheading",
        text: "Minutes 6–15: Sun Salutation Flow",
      },
      {
        type: "paragraph",
        text: "Move through 4–5 rounds of Surya Namaskar A. Begin slowly, synchronising each movement with breath. By rounds 3 and 4, allow the flow to become more fluid and continuous. This sequence warms every major muscle group, lubricates the spine, and elevates your heart rate gently.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
            caption: "Warrior I — Virabhadrasana — building strength and focus",
          },
          {
            src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
            caption: "Triangle Pose — Trikonasana — opening the side body",
          },
          {
            src: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
            caption: "Seated forward fold — deep hamstring release",
          },
        ],
      },
      {
        type: "subheading",
        text: "Minutes 16–25: Standing & Floor Poses",
      },
      {
        type: "paragraph",
        text: "Move into Warrior I, Warrior II, Triangle, and Extended Side Angle to build strength and open the hips and chest. Transition to the floor for Bridge Pose, Supine Twist, and Happy Baby. Each pose is held for 5 full breaths, allowing the nervous system to deeply receive the benefits.",
      },
      {
        type: "subheading",
        text: "Minutes 26–30: Savasana & Integration",
      },
      {
        type: "paragraph",
        text: "Never skip Savasana. This is where the real transformation happens — when the body integrates everything it has experienced. Lie flat, arms slightly away from the body, palms facing up. Let go of all control of the breath. Simply be. Five minutes of quality Savasana will leave you feeling completely refreshed.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
            caption: "Final relaxation — Savasana, the most important pose",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOG 3
  // ─────────────────────────────────────────────────────
  {
    id: "3",
    slug: "the-connection-between-yoga-and-ayurveda",
    title: "The Connection Between Yoga and Ayurveda",
    excerpt:
      "Many of us have this doubt, whether Ayurveda and Yoga are connected, and if so, how? If you are one of them, then this blog is for you! These two ancient sciences originate from the same source.",
    date: "11 June 2022",
    author: "Dr. Meera Joshi",
    category: "Ayurveda",
    image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
    tags: ["Ayurveda", "Yoga", "Health"],
    content: [
      {
        type: "heading",
        text: "Two Sciences, One Source",
      },
      {
        type: "paragraph",
        text: "Yoga and Ayurveda are sister sciences that have evolved together from the vast body of Vedic knowledge. While Yoga focuses on the union of body, mind and spirit through physical and mental practices, Ayurveda — the science of life — focuses on maintaining health through diet, lifestyle, herbs and therapeutic treatments. Together, they form a complete system of holistic wellbeing.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1617651524211-23485a7a3e73?w=800&q=80",
            caption: "Ayurvedic herbs and oils — foundation of ancient healing",
          },
          {
            src: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=800&q=80",
            caption: "Abhyanga — Ayurvedic oil massage, perfect complement to yoga",
          },
        ],
      },
      {
        type: "heading",
        text: "Understanding the Three Doshas",
      },
      {
        type: "subheading",
        text: "Vata — The Energy of Movement",
      },
      {
        type: "paragraph",
        text: "Vata dosha is composed of air and space elements. People with dominant Vata are creative, enthusiastic, and quick-thinking but can become anxious, scattered, or depleted when out of balance. Grounding yoga practices — forward folds, slow flows, and restorative poses — combined with warm, nourishing Ayurvedic foods help balance Vata beautifully.",
      },
      {
        type: "subheading",
        text: "Pitta — The Energy of Transformation",
      },
      {
        type: "paragraph",
        text: "Pitta dosha, composed of fire and water, governs metabolism, digestion, and transformation. Pitta types are driven, intelligent, and focused but can become angry, overly competitive, or inflamed when excess arises. Cooling yoga practices — moon salutations, forward bends, and restorative poses — along with sweet, cooling foods help pacify Pitta.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
            caption: "Cooling moon salutation practice for Pitta balance",
          },
          {
            src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            caption: "Restorative yoga — perfect for Vata and Pitta pacification",
          },
          {
            src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
            caption: "Kapha-balancing dynamic flow — energise and invigorate",
          },
        ],
      },
      {
        type: "subheading",
        text: "Kapha — The Energy of Stability",
      },
      {
        type: "paragraph",
        text: "Kapha, composed of earth and water, provides structure, stability, and lubrication. Kapha types are loving, patient, and strong but can become lethargic, possessive, or congested when imbalanced. Dynamic, heating yoga practices — vigorous vinyasa, inversions, backbends — combined with light, spicy foods help stimulate and balance Kapha.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
            caption: "Integrating Ayurvedic principles into daily yoga practice",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOG 4
  // ─────────────────────────────────────────────────────
  {
    id: "4",
    slug: "10-signs-you-need-a-yoga-retreat",
    title: "10 Signs You Need a Yoga Retreat",
    excerpt:
      "Are you wondering what a yoga retreat is? A yoga retreat is a chance to step away from day-to-day life and focus on your practice and inner peace. Here are 10 clear signs it's time for you.",
    date: "06 June 2022",
    author: "Yogi Mahesh Chetan",
    category: "Yoga Retreats",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    tags: ["Yoga", "Retreat", "Lifestyle"],
    content: [
      {
        type: "heading",
        text: "What is a Yoga Retreat?",
      },
      {
        type: "paragraph",
        text: "A yoga retreat is a dedicated period — from a weekend to several weeks — set aside specifically for deepening your yoga and meditation practice, away from the demands and distractions of daily life. Retreats create a sacred container for transformation that is simply not possible in the ordinary flow of day-to-day living.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
            caption: "Himalayan retreat setting — where silence speaks loudest",
          },
          {
            src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
            caption: "Sunrise meditation overlooking the Ganges, Rishikesh",
          },
        ],
      },
      {
        type: "heading",
        text: "10 Signs It's Time for a Yoga Retreat",
      },
      {
        type: "subheading",
        text: "1–3: Stress, Exhaustion & Disconnection",
      },
      {
        type: "paragraph",
        text: "If you feel chronically stressed, mentally exhausted, or emotionally disconnected from yourself and others, your nervous system is crying out for a reset. Modern life's relentless pace depletes our inner resources. A retreat provides the space, structure, and support to genuinely rest and restore — not just take a holiday.",
      },
      {
        type: "subheading",
        text: "4–6: Your Practice Has Plateaued",
      },
      {
        type: "paragraph",
        text: "When your home practice feels stale, mechanical, or uninspired, it's a sign you need fresh guidance, immersion, and community. A retreat breaks through plateaus by offering consistent twice-daily practice, expert teaching, and the energy of a group of dedicated practitioners. Breakthroughs happen in retreats that never occur in regular classes.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
            caption: "Community practice — transformative energy of shared intention",
          },
          {
            src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
            caption: "Intensive morning practice sessions at AYM Yoga Retreat",
          },
          {
            src: "https://images.unsplash.com/photo-1510894347713-fc3dc6166ef5?w=800&q=80",
            caption: "Meditation and pranayama by the sacred Ganga",
          },
        ],
      },
      {
        type: "subheading",
        text: "7–10: Life Transitions & Seeking Purpose",
      },
      {
        type: "paragraph",
        text: "Major life changes — career shifts, relationship changes, loss, or simply a feeling that something is missing — often call us to step back and look within. A yoga retreat provides exactly the right conditions for this kind of deep reflection. Many retreat participants arrive at crossroads and leave with profound clarity about their path forward.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80",
            caption: "Evening satsang — spiritual discussions under the Himalayan stars",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOG 5
  // ─────────────────────────────────────────────────────
  {
    id: "5",
    slug: "how-yoga-can-improve-your-corporate-culture",
    title: "How Yoga Can Improve Your Corporate Culture",
    excerpt:
      "A study conducted by the American Institute of Stress quotes: Almost 75–90 percent of medical visits in the US are in one way or another correlated to stress. Yoga offers a powerful solution.",
    date: "01 June 2022",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200&q=80",
    tags: ["Yoga", "Lifestyle", "Health"],
    content: [
      {
        type: "heading",
        text: "The Corporate Stress Epidemic",
      },
      {
        type: "paragraph",
        text: "Workplace stress has reached epidemic proportions globally. The American Institute of Stress reports that stress-related illnesses account for the vast majority of medical visits, costing employers billions in lost productivity, absenteeism, and healthcare costs each year. Forward-thinking companies are now turning to yoga as a scientifically-backed solution.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80",
            caption: "Corporate yoga session — bringing mindfulness to the workplace",
          },
          {
            src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
            caption: "Desk yoga — simple stretches for office workers",
          },
        ],
      },
      {
        type: "heading",
        text: "How Yoga Transforms Corporate Culture",
      },
      {
        type: "subheading",
        text: "Reduces Stress & Improves Mental Clarity",
      },
      {
        type: "paragraph",
        text: "Regular yoga practice activates the parasympathetic nervous system, reducing cortisol levels and promoting a state of calm alertness. Employees who practice yoga consistently report significantly reduced stress, better emotional regulation, and markedly improved focus and decision-making clarity. These are not soft benefits — they directly impact performance metrics.",
      },
      {
        type: "subheading",
        text: "Enhances Team Cohesion & Communication",
      },
      {
        type: "paragraph",
        text: "Group yoga practice creates a shared experience that transcends hierarchies. When the CEO and a junior analyst practice side by side in downward dog, something shifts in the organisational culture. Yoga cultivates empathy, active listening, and non-competitive collaboration — exactly the qualities that define great team culture.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            caption: "Group meditation — building collective calm and focus",
          },
          {
            src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
            caption: "Morning yoga before work — setting positive intentions",
          },
          {
            src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
            caption: "Breathing techniques for high-pressure work environments",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOG 6
  // ─────────────────────────────────────────────────────
  {
    id: "6",
    slug: "importance-of-yoga-in-daily-life",
    title: "Importance of Yoga in Daily Life",
    excerpt:
      "Yoga is more than just physical exercise. It is a complete science of life that originated in India many thousands of years ago and continues to benefit millions worldwide.",
    date: "20 May 2022",
    category: "Yoga",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=80",
    tags: ["Yoga", "Health", "Lifestyle"],
    content: [
      {
        type: "heading",
        text: "Yoga: Far More Than Physical Exercise",
      },
      {
        type: "paragraph",
        text: "In the modern world, yoga is often reduced to a form of physical fitness — a way to become flexible, toned, or relaxed. While these are genuine benefits, they represent only the outermost layer of what yoga offers. At its heart, yoga is a complete science of living — a systematic approach to understanding the mind, body, and consciousness.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80",
            caption: "Early morning yoga at sunrise — establishing a sacred daily ritual",
          },
          {
            src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            caption: "Pranayama practice — the bridge between body and mind",
          },
        ],
      },
      {
        type: "heading",
        text: "Daily Benefits of a Consistent Practice",
      },
      {
        type: "subheading",
        text: "Physical Health & Vitality",
      },
      {
        type: "paragraph",
        text: "Daily yoga practice improves flexibility, strength, balance, and posture. It stimulates organ function, improves circulation, supports the immune system, and helps maintain healthy weight. Unlike high-impact exercise, yoga can be practiced well into old age, making it a lifelong investment in physical wellbeing.",
      },
      {
        type: "subheading",
        text: "Mental Health & Emotional Resilience",
      },
      {
        type: "paragraph",
        text: "Yoga's most underrated benefits are mental and emotional. Regular practice reduces anxiety, depression, and emotional reactivity. It cultivates equanimity — the ability to remain calm and centred regardless of external circumstances. In a world of increasing uncertainty and overstimulation, this quality is perhaps more valuable than any physical benefit.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
            caption: "Meditation — the deepest dimension of yoga practice",
          },
          {
            src: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
            caption: "Restorative yoga — restoring balance to an overstimulated nervous system",
          },
          {
            src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
            caption: "Community yoga — the power of practicing together",
          },
        ],
      },
      {
        type: "subheading",
        text: "Spiritual Growth & Self-Understanding",
      },
      {
        type: "paragraph",
        text: "At its deepest level, yoga is a path of self-inquiry and spiritual awakening. Through consistent practice, practitioners begin to perceive the deeper layers of their being — beyond thought, beyond emotion, to the spacious awareness that is their true nature. This is not a religious experience but a profoundly human one — available to all, regardless of belief.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1510894347713-fc3dc6166ef5?w=800&q=80",
            caption: "Sacred Ganga riverbank — where ancient yoga traditions live on",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOG 7
  // ─────────────────────────────────────────────────────
  {
    id: "7",
    slug: "heres-how-digestion-works-and-how-to-improve-yours",
    title: "Here's How Digestion Works & How to Improve Yours",
    excerpt:
      "Food has been a priority since Vedic times. The Upanishads regarded food as Brahma, the creator. Living things require food for survival, and digestion is the sacred fire that transforms it.",
    date: "26 July 2021",
    category: "Health",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
    tags: ["Health", "Ayurveda", "Lifestyle"],
    content: [
      {
        type: "heading",
        text: "Agni — The Sacred Fire of Digestion",
      },
      {
        type: "paragraph",
        text: "In Ayurvedic science, digestion is governed by Agni — the digestive fire. A strong, balanced Agni is the foundation of good health, immunity, and longevity. When Agni is weak, food is not properly broken down and absorbed, leading to the accumulation of Ama (toxic residue) in the body — the root cause of most disease according to Ayurveda.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
            caption: "Wholesome, sattvic foods — nourishment for body and mind",
          },
          {
            src: "https://images.unsplash.com/photo-1617651524211-23485a7a3e73?w=800&q=80",
            caption: "Ayurvedic herbs that support and strengthen digestive Agni",
          },
        ],
      },
      {
        type: "heading",
        text: "Yoga Poses That Transform Digestion",
      },
      {
        type: "subheading",
        text: "Twisting Poses — Wringing Out Toxins",
      },
      {
        type: "paragraph",
        text: "Seated and standing twists literally massage the abdominal organs, stimulating peristalsis — the wave-like contractions that move food through the digestive tract. Poses like Ardha Matsyendrasana (Half Lord of the Fishes) and Parivrtta Trikonasana (Revolved Triangle) are particularly powerful for digestive health.",
      },
      {
        type: "subheading",
        text: "Apanasana & Wind-Relieving Poses",
      },
      {
        type: "paragraph",
        text: "Apanasana (Knees-to-Chest Pose) and Pavanamuktasana (Wind-Relieving Pose) directly stimulate the large intestine and help release trapped gas and bloating. Practiced daily, these simple poses can dramatically improve digestive comfort and regularity.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
            caption: "Seated twist — powerful massage for abdominal organs",
          },
          {
            src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
            caption: "Wind-relieving pose — gentle but deeply effective",
          },
          {
            src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            caption: "Child's pose — compression and release for the digestive system",
          },
        ],
      },
      {
        type: "subheading",
        text: "Pranayama for Digestive Health",
      },
      {
        type: "paragraph",
        text: "Kapalabhati (Skull-Shining Breath) is perhaps the most powerful breathing practice for digestive health. The rapid abdominal contractions massage the digestive organs, stimulate metabolism, and generate heat that strengthens Agni. Practice 3 rounds of 30–50 repetitions before breakfast for best results.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=800&q=80",
            caption: "Abdominal massage — Ayurvedic technique for digestive support",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOG 8
  // ─────────────────────────────────────────────────────
  {
    id: "8",
    slug: "celebrate-holi-the-festival-of-colours-in-your-yoga-class",
    title: "Celebrate Holi — The Festival of Colours in Your Yoga Class",
    excerpt:
      "Holi — a festival of colors and joy. A celebration that reminds us of the victory of good over evil. The festival of Holi marks the arrival of spring and is a perfect occasion to infuse joy into your yoga practice.",
    date: "18 March 2021",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=1200&q=80",
    tags: ["Yoga", "Lifestyle", "International"],
    content: [
      {
        type: "heading",
        text: "The Spiritual Significance of Holi",
      },
      {
        type: "paragraph",
        text: "Holi is far more than a festival of colours. Rooted in Hindu mythology, it celebrates the divine love of Radha and Krishna, the victory of devotion over arrogance, and the triumph of spring over winter. For yogis, Holi represents the dissolution of ego — the colours symbolise the destruction of boundaries between self and other, merging all into one joyful celebration.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=800&q=80",
            caption: "Holi celebrations in Rishikesh — colour, joy, and divine love",
          },
          {
            src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
            caption: "Colour meditation — each hue carries a unique energy vibration",
          },
        ],
      },
      {
        type: "heading",
        text: "How to Bring Holi Into Your Yoga Practice",
      },
      {
        type: "subheading",
        text: "Colour-Themed Chakra Sequence",
      },
      {
        type: "paragraph",
        text: "Design a yoga class around the seven chakras and their corresponding colours. Begin with Muladhara (Root Chakra, red) in grounding standing poses, move through the orange of Svadhisthana in hip openers, the yellow of Manipura in core work, the green of Anahata in heart openers, and so on. By the time you reach Sahasrara (Crown, violet), the class has journeyed through the entire rainbow.",
      },
      {
        type: "subheading",
        text: "Bhakti Yoga & Devotional Practice",
      },
      {
        type: "paragraph",
        text: "Holi is deeply connected to Bhakti yoga — the yoga of devotion and love. Include kirtan (devotional chanting), mantra recitation, and a spirit of playful celebration in your practice. Drop the seriousness that can sometimes creep into yoga spaces and allow the pure joy of Holi to infuse every movement.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
            caption: "Kirtan and bhakti yoga — celebrating Holi through devotional practice",
          },
          {
            src: "https://images.unsplash.com/photo-1510894347713-fc3dc6166ef5?w=800&q=80",
            caption: "Community satsang — coming together in colour and song",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // BLOG 9
  // ─────────────────────────────────────────────────────
  {
    id: "9",
    slug: "always-stay-positive-with-yoga-2021",
    title: "Always Stay Positive with Yoga",
    excerpt:
      "2020 was hard on everyone and it has been anything that none of us has expected. It has taught us that life can be seriously unpredictable and sometimes overwhelming. Yoga offers a path back to positivity.",
    date: "05 March 2021",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1200&q=80",
    tags: ["Yoga", "Lifestyle", "Health"],
    content: [
      {
        type: "heading",
        text: "The Science of Positivity & Yoga",
      },
      {
        type: "paragraph",
        text: "Neuroscience has confirmed what yogis have known for thousands of years: the mind can be trained. The concept of neuroplasticity tells us that our brains are not fixed — through consistent practice, we can literally reshape neural pathways, moving from default patterns of anxiety and negativity to states of calm, gratitude, and positive perception. Yoga is one of the most effective tools for this transformation.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
            caption: "Yoga nidra — yoga of conscious deep sleep and positive programming",
          },
          {
            src: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80",
            caption: "Morning sun salutation — setting a positive tone for the day",
          },
        ],
      },
      {
        type: "heading",
        text: "Practices That Cultivate Positivity",
      },
      {
        type: "subheading",
        text: "Sankalpa — The Power of Positive Intention",
      },
      {
        type: "paragraph",
        text: "A Sankalpa is a heartfelt resolve — a short, positive statement of intention that is planted into the fertile soil of the subconscious mind during deep relaxation. Unlike affirmations, a Sankalpa is not about convincing yourself of something you don't believe. It is about watering the seed of your deepest true intention. With consistent practice, Sankalpas have remarkable power to shift deeply held patterns.",
      },
      {
        type: "subheading",
        text: "Gratitude Meditation — Rewiring the Default Mode",
      },
      {
        type: "paragraph",
        text: "A daily 10-minute gratitude meditation — simply sitting quietly and bringing to mind 5–10 things you are genuinely grateful for, with full sensory detail and emotional feeling — has been shown in clinical studies to significantly increase serotonin and dopamine levels, reduce cortisol, and shift the brain's default mode from threat-scanning to positive expectation.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            caption: "Yoga and meditation — ancient technologies of inner transformation",
          },
          {
            src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
            caption: "Savasana Sankalpa — planting seeds of positive intention",
          },
          {
            src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
            caption: "Community support — the positivity of practicing together",
          },
        ],
      },
      {
        type: "subheading",
        text: "Inversions — A New Perspective on Life",
      },
      {
        type: "paragraph",
        text: "Inversions literally turn your world upside down — and with it, your perspective. Headstand, Shoulderstand, and even a simple Legs-Up-the-Wall pose shift blood flow to the brain, stimulate the lymphatic system, and create an immediate shift in mood and perception. There is something profoundly liberating about seeing the world from a different angle.",
      },
      {
        type: "images",
        images: [
          {
            src: "https://images.unsplash.com/photo-1510894347713-fc3dc6166ef5?w=800&q=80",
            caption: "The sacred Ganga at dawn — a reminder of life's endless renewal",
          },
        ],
      },
    ],
  },
];
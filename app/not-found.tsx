import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Page Not Found | AYM Yoga School",
};

const quickLinks = [
  { label: "200 Hour Yoga TTC", href: "/200-hour-yoga-teacher-training-rishikesh" },
  { label: "300 Hour Yoga TTC", href: "/300-hours-yoga-teacher-training-rishikesh" },
  { label: "500 Hour Yoga TTC", href: "/500-hour-yoga-teacher-training-india" },
  { label: "Online Course", href: "/online-yoga-course" },
  { label: "AYUSH Course", href: "/yoga-college-in-rishikesh" },
  { label: "Blog", href: "/blog/aym-yoga-blog" },
  { label: "Certifications", href: "/yoga-alliance-yoga-school" },
  { label: "FAQs", href: "/yoga-ttc-rishikesh" },
  { label: "Registration", href: "/yoga-registration" },
];

export default function NotFound() {
  return (
    <section className={styles.page404}>
      {/* Floating background accents */}
      <div className={styles.bgAccents} aria-hidden="true">
        <span className={styles.om}>ॐ</span>
        <span className={styles.om}>ॐ</span>
        <span className={styles.om}>ॐ</span>
        <span className={styles.om}>ॐ</span>
        <span className={styles.om}>ॐ</span>
      </div>

      <div className={styles.container}>
        {/* Left: illustration + message */}
        <div className={styles.leftCol}>
          <div className={styles.artWrap} aria-hidden="true">
            {/* Glow ring */}
            <div className={styles.glowRing} />

            {/* Lotus SVG */}
            <svg
              viewBox="0 0 400 300"
              className={styles.art}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff9a3c" />
                  <stop offset="100%" stopColor="#ff5e62" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffb86c" />
                  <stop offset="100%" stopColor="#ff7a00" />
                </linearGradient>
              </defs>

              {/* Soft halo */}
              <circle cx="200" cy="140" r="115" fill="url(#grad2)" opacity="0.08" />
              <circle cx="200" cy="140" r="85" fill="url(#grad2)" opacity="0.12" />

              {/* Lotus petals */}
              <g transform="translate(200,190)">
                <path
                  d="M0,0 C-30,-40 -30,-80 0,-95 C30,-80 30,-40 0,0 Z"
                  fill="url(#grad1)"
                  opacity="0.85"
                />
                <path
                  d="M0,0 C-50,-30 -70,-70 -55,-95 C-20,-85 0,-50 0,0 Z"
                  fill="url(#grad1)"
                  opacity="0.65"
                />
                <path
                  d="M0,0 C50,-30 70,-70 55,-95 C20,-85 0,-50 0,0 Z"
                  fill="url(#grad1)"
                  opacity="0.65"
                />
                <path
                  d="M0,0 C-70,-15 -95,-50 -85,-80 C-45,-75 -15,-40 0,0 Z"
                  fill="url(#grad1)"
                  opacity="0.45"
                />
                <path
                  d="M0,0 C70,-15 95,-50 85,-80 C45,-75 15,-40 0,0 Z"
                  fill="url(#grad1)"
                  opacity="0.45"
                />
              </g>

              {/* 404 text */}
              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.artText}
              >
                404
              </text>

              {/* Sparkles */}
              <circle cx="70" cy="70" r="4" fill="#ff7a00" opacity="0.6" />
              <circle cx="330" cy="90" r="6" fill="#ff5e62" opacity="0.5" />
              <circle cx="340" cy="220" r="4" fill="#ff7a00" opacity="0.6" />
              <circle cx="60" cy="230" r="5" fill="#ff5e62" opacity="0.45" />
            </svg>
          </div>

          <h1 className={styles.heading}>
            Looks like you&apos;re <span>lost</span>
          </h1>
          <p className={styles.subtext}>
            The page you&apos;re looking for isn&apos;t available. It may have
            been moved, renamed, or never existed. Let&apos;s get you back on
            your path.
          </p>

          <div className={styles.btnRow}>
            <Link href="/" className={styles.homeBtn}>
              <span>Go to Homepage</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right: quick links */}
        <div className={styles.rightCol}>
          <p className={styles.tryText}>
            <span className={styles.tryDot} />
            Or explore these instead
          </p>

          <ul className={styles.linkGrid}>
            {quickLinks.map((link, i) => (
            <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
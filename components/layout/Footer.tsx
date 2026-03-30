import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../../assets/style/Footer.module.css";
import logo from "../../assets/icons/aym-yoga-school-logo.png";

const quickLinks = [
  { label: "Online Yoga Course", href: "/online-yoga-course" },
  { label: "AYUSH Course", href: "/yoga-college-in-rishikesh" },
  { label: "Student Reviews", href: "#testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Yoga Competition", href: "/yoga-competition" },
  { label: "Blog", href: "/aym-yoga-blog" },
  { label: "Payment", href: "/ttc-payment" },
  { label: "How to Reach", href: "#how-to-reach" },
  { label: "Contact", href: "/Contact-us" },
];

const courseLinks = [
  { label: "100 Hour Yoga Teacher Training", href: "/100-hour-yoga-teacher-training-in-rishikesh" },
  { label: "200 Hour Yoga Teacher Training", href: "/200-hour-yoga-teacher-training-rishikesh" },
  { label: "300 Hour Yoga Teacher Training", href: "/300-hours-yoga-teacher-training-rishikesh" },
  { label: "500 Hour Yoga Teacher Training", href: "/500-hour-yoga-teacher-training-india" },
  { label: "Kundalini Yoga", href: "/kundalini-yoga-teacher-training-in-rishikesh" },
 { label: "Yoga Teacher In Rishikesh", href: "/yoga-teacher-training-in-rishikesh" },
 { label: "Prenatal Yoga Teacher Training", href: "/prenatal-yoga-teacher-training-course" },
 


];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    color: "#1877F2",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    color: "#000000",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    color: "#E1306C",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    color: "#FF0000",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.965C5.12 20 12 20 12 20s6.88 0 8.59-.455a2.78 2.78 0 0 0 1.95-1.965A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/917500277709",
    color: "#25D366",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.103 1.523 5.824L.057 23.213a.5.5 0 0 0 .61.638l5.598-1.453A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.371l-.36-.214-3.733.968.997-3.63-.235-.374A9.867 9.867 0 0 1 2.1 12C2.1 6.534 6.534 2.1 12 2.1c5.466 0 9.9 4.434 9.9 9.9 0 5.466-4.434 9.9-9.9 9.9z" />
      </svg>
    ),
  },
];

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* ── Decorative top border ── */}
      <div className={styles.topAccent} />

      {/* ── Main grid ── */}
      <div className={styles.mainGrid}>

        {/* Col 1 — Brand + About */}
        <div className={styles.brandCol}>
          <div className={styles.logoWrap}>
            <Image src={logo} alt="AYM Yoga School" width={330} height={330} className={styles.logo} />
          </div>
          <p className={styles.tagline}>Authentic Yoga. Ancient Wisdom.</p>
          <p className={styles.aboutText}>
            Registered with <strong>Yoga Alliance, USA</strong> and{" "}
            <strong>Yoga Certification Board</strong>, Ministry of Ayush,
            Govt. of India. World-class authentic yoga education in the heart
            of Rishikesh.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>✦</span> RYS 200
            </span>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>✦</span> RYS 300
            </span>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>✦</span> AYUSH
            </span>
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div className={styles.linksCol}>
          <h4 className={styles.colHeading}>
            <span className={styles.headingLine} />
            Quick Links
          </h4>
          <ul className={styles.linkList}>
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  <span className={styles.linkArrow}>›</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Courses */}
        <div className={styles.linksCol}>
          <h4 className={styles.colHeading}>
            <span className={styles.headingLine} />
            Our Courses
          </h4>
          <ul className={styles.linkList}>
            {courseLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  <span className={styles.linkArrow}>›</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact + Social */}
        <div className={styles.contactCol}>
          <h4 className={styles.colHeading}>
            <span className={styles.headingLine} />
            Get In Touch
          </h4>

          <div className={styles.contactCards}>
            <a href="tel:+917500277709" className={styles.contactCard}>
              <div className={styles.contactIconWrap}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
              </div>
              <div>
                <span className={styles.contactMeta}>Phone</span>
                <span className={styles.contactVal}>+91 75002 77709</span>
              </div>
            </a>

            <a href="mailto:aymindia@gmail.com" className={styles.contactCard}>
              <div className={styles.contactIconWrap}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <span className={styles.contactMeta}>Email</span>
                <span className={styles.contactVal}>aymindia@gmail.com</span>
              </div>
            </a>

            <div className={styles.contactCard}>
              <div className={styles.contactIconWrap}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <span className={styles.contactMeta}>Address</span>
                <span className={styles.contactVal}>
                  Upper Tapovan, Rishikesh,<br />Uttarakhand 249192
                </span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className={styles.socialSection}>
            <p className={styles.socialLabel}>Follow Us</p>
            <div className={styles.socialRow}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={styles.socialBtn}
                  
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} AYM Yoga School. All rights reserved.
        </p>
        <nav className={styles.bottomNav}>
          <Link href="/sitemap" className={styles.bottomLink}>Sitemap</Link>
          <span className={styles.dot}>·</span>
          <Link href="/faq" className={styles.bottomLink}>FAQ</Link>
          <span className={styles.dot}>·</span>
          <Link href="/Contact-us" className={styles.bottomLink}>Contact</Link>
          <span className={styles.dot}>·</span>
          <Link href="/payment" className={styles.bottomLink}>Payment</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
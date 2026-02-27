import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../assets/style/Navbar.module.css";
import HamburgerMenu from "./Hamburgermenu";
import logo from "../../assets/icons/aym-yoga-school-logo.png";

export interface SubLink {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: SubLink[];
}

export const navLinks: NavLink[] = [
  {
    label: "Home",
    href: "/",
    children: [
      { label: "Affiliation", href: "/affiliation" },
      { label: "About AYM", href: "/about" },
      { label: "Yoga Rules", href: "/yoga-rules" },
      { label: "Our Teachers", href: "/our-teachers" },
    ],
  },
  {
    label: "Yoga Retreats",
    href: "/yoga-retreats",
    children: [
      { label: "Yoga Retreats", href: "/yoga-retreats" },
      { label: "Sound Healing Course", href: "/sound-healing" },
      { label: "Yoga Workshop", href: "/yoga-workshop" },
      { label: "Yoga Ashrams in India", href: "/yoga-ashrams" },
      { label: "Yoga Holidays & Camps", href: "/yoga-holidays" },
      { label: "Inner Awakening Retreat", href: "/inner-awakening" },
      { label: "Yoga Course for Beginners", href: "/beginners" },
      { label: "Ayurveda and Detox Retreat", href: "/ayurveda-detox" },
    ],
  },
  {
    label: "Yoga Teacher Training",
    href: "/yoga-teacher-training",
    children: [
      { label: "100 Hour Yoga Teacher Training", href: "/100-hour-ytt" },
      { label: "200 Hour Yoga Teacher Training", href: "/200-hour-ytt" },
      { label: "300 Hour Yoga Teacher Training", href: "/300-hour-ytt" },
      { label: "500 Hour Yoga Teacher Training", href: "/500-hour-ytt" },
      { label: "Kundalini Yoga Teacher Training", href: "/kundalini-ytt" },
      { label: "Yoga Teacher Training Rishikesh", href: "/ytt-rishikesh" },
      { label: "Prenatal Yoga Teacher Training", href: "/prenatal-ytt" },
      { label: "Vinyasa Yoga Teacher Training", href: "/vinyasa-ytt" },
      { label: "Yoga Teacher Training in India", href: "/ytt-india" },
      { label: "Hatha Yoga Teacher Training", href: "/hatha-ytt" },
      { label: "Yoga Teacher Training Goa", href: "/ytt-goa" },
      { label: "Yoga Teacher Training Bali", href: "/ytt-bali" },
      { label: "Ayurveda & Yoga TTC", href: "/ayurveda-yoga-ttc" },
      { label: "Yoga Teacher Training World Wide", href: "/ytt-worldwide" },
    ],
  },
  {
    label: "Online Yoga Course",
    href: "/online-yoga-course",
    children: [
      { label: "Online 200 Hour YTT", href: "/online-200-ytt" },
      { label: "Online 300 Hour YTT", href: "/online-300-ytt" },
      { label: "Online Meditation Course", href: "/online-meditation" },
      { label: "Online Pranayama Course", href: "/online-pranayama" },
    ],
  },
  {
    label: "AYUSH Courses",
    href: "/ayush-courses",
    children: [
      { label: "Ayurveda Course", href: "/ayurveda-course" },
      { label: "Naturopathy Course", href: "/naturopathy" },
      { label: "Panchakarma Course", href: "/panchakarma" },
    ],
  },
  { label: "Register", href: "/register" },
  { label: "Payment", href: "/payment" },
  { label: "Resource", href: "/resource" },
];

export const Navbar = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src={logo}
              alt="AYM Yoga School"
              width={130}
              height={65}
              priority
              className={styles.logo}
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <ul className={styles.navList}>
          {navLinks.map((link) => (
            <li
              key={link.href}
              className={`${styles.navItem} ${link.children ? styles.hasDropdown : ""}`}
            >
              <Link href={link.href} className={styles.navLink}>
                {link.label}
                {link.children && <span className={styles.arrow}>▾</span>}
              </Link>

              {link.children && (
                <ul className={styles.dropdown}>
                  <li className={styles.dropdownHeader}>{link.label}</li>
                  {link.children.map((child) => (
                    <li key={child.href} className={styles.dropdownItem}>
                      <Link href={child.href} className={styles.dropdownLink}>
                        <span className={styles.dropdownDot}>›</span>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger for mobile */}
        <HamburgerMenu navLinks={navLinks} />
      </nav>
    </header>
  );
};

export default Navbar;

"use client";

import React, { useRef } from "react";
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
  clickable?: boolean;
  children?: SubLink[];
  dropdownAlign?: "left" | "right";
}

export const navLinks: NavLink[] = [
  {
    label: "Home",
    href: "/",
    children: [
      { label: "Affiliation", href: "/Accreditationsection" },
      { label: "About AYM", href: "Aboutuaym" },
      { label: "Yoga Rules", href: "/yoga-rules" },
      { label: "Our Teachers", href: "/our-teachers" },
    ],
  },
  {
    label: "Yoga Retreats",
    href: "/yoga-retreats",
    clickable: false,
    children: [
      { label: "Yoga Retreats", href: "/yoga-retreats" },
      { label: "Sound Healing Course", href: "/sound-healing" },
      { label: "Yoga Workshop", href: "/yoga-meditation-workshop" },
      { label: "Yoga Ashrams in India", href: "/yoga-ashrams-in-india" },
      { label: "Yoga Holidays & Camps", href: "/yoga-holidays-in-india" },
      { label: "Inner Awakening Retreat", href: "/inner-awakening" },
      { label: "Yoga Course for Beginners", href: "/yoga-for-beginners-in-india" },
      { label: "Ayurveda and Detox Retreat", href: "/yoga-ayurveda-detox-retreat" },
    ],
  },
  {
    label: "Yoga Teacher Training",
    href: "/yoga-teacher-training",
    clickable: false,
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
    clickable: false,
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
    clickable: false,
    children: [
      { label: "Ayurveda Course", href: "/ayurveda-course" },
      { label: "Naturopathy Course", href: "/naturopathy" },
      { label: "Panchakarma Course", href: "/panchakarma" },
    ],
  },
  { label: "Register", href: "/register" },
  { label: "Payment", href: "/payment" },
  {
    label: "Resource",
    href: "/resource",
    clickable: false,
    dropdownAlign: "right",
    children: [
      { label: "Gallery", href: "/gallery" },
      { label: "Glossary", href: "/yoga-sanskrit-glossary" },
      { label: "Yoga FAQ", href: "/yoga-ttc-faq" },
      { label: "YTTC Reviews", href: "/yttt-reviews" },
      { label: "AYM Yoga Blog", href: "/aym-yoga-blog" },
      { label: "Post TTC Yoga Volunteer", href: "/yoga-volunteer" },
    ],
  },
];

export const Navbar = () => {
  const navRef = useRef<HTMLUListElement>(null);

  const closeAllDropdowns = () => {
    // Remove hover/focus state by blurring all focusable nav items
    navRef.current?.querySelectorAll<HTMLElement>("li[tabindex]").forEach((el) => el.blur());
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

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
        <ul className={styles.navList} ref={navRef}>
          {navLinks.map((link) => (
            <li
              key={link.href}
              className={`${styles.navItem} ${link.children ? styles.hasDropdown : ""}`}
              tabIndex={link.children ? 0 : undefined}
            >
              {link.clickable === false && link.children ? (
                <span className={`${styles.navLink} ${styles.navLabelOnly}`}>
                  {link.label}
                  <span className={styles.arrow}>▾</span>
                </span>
              ) : (
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                  {link.children && <span className={styles.arrow}>▾</span>}
                </Link>
              )}

              {link.children && (
                <ul
                  className={`${styles.dropdown} ${
                    link.dropdownAlign === "right" ? styles.dropdownRight : ""
                  }`}
                >
                  {link.children.map((child) => (
                    <li key={child.href} className={styles.dropdownItem}>
                      <Link
                        href={child.href}
                        className={styles.dropdownLink}
                        onClick={closeAllDropdowns}
                      >
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
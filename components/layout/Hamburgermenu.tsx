"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../../assets/style/Navbar.module.css";
import logo from "../../assets/icons/aym-yoga-school-logo.png";
import type { NavLink } from "./Navbar";

interface HamburgerMenuProps {
  navLinks: NavLink[];
}

const HamburgerMenu = ({ navLinks }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const openMenu = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setOpenAccordion(null);
    document.body.style.overflow = "";
  }, []);

  const toggleAccordion = useCallback((href: string) => {
    setOpenAccordion((prev) => (prev === href ? null : href));
  }, []);

  return (
    <>
      {/* Hamburger Toggle Button */}
      <button
        className={`${styles.hamburgerBtn} ${isOpen ? styles.open : ""}`}
        onClick={isOpen ? closeMenu : openMenu}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      {/* Backdrop overlay */}
      <div
        className={`${styles.mobileOverlay} ${isOpen ? styles.open : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <div
        id="mobile-drawer"
        className={`${styles.mobileDrawer} ${isOpen ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <Image
            src={logo}
            alt="AYM Yoga School"
            width={110}
            height={44}
            className={styles.drawerLogo}
          />
          <button
            onClick={closeMenu}
            className={styles.drawerClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable nav content */}
        <div className={styles.mobileNavScroll}>
          <ul className={styles.mobileNavList}>
            {navLinks.map((link) => {
              if (link.children && link.children.length > 0) {
                const isAccordionOpen = openAccordion === link.href;
                return (
                  <li key={link.href}>
                    {/* ── Label + arrow in one clickable row ── */}
                    <button
                      className={styles.mobileCategoryHeader}
                      onClick={() => toggleAccordion(link.href)}
                      aria-expanded={isAccordionOpen}
                    >
                      <span>{link.label}</span>
                      <span
                        className={`${styles.mobileAccordionArrow} ${
                          isAccordionOpen ? styles.open : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>

                    {/* Dropdown list */}
                    <ul
                      className={`${styles.mobileSubList} ${
                        isAccordionOpen ? styles.open : ""
                      }`}
                    >
                      {link.children.map((child) => (
                        <li key={child.href} className={styles.mobileSubItem}>
                          <Link
                            href={child.href}
                            className={styles.mobileSubLink}
                            onClick={closeMenu}
                          >
                            <span className={styles.mobileSubDot}>›</span>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={styles.mobilePlainLink}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
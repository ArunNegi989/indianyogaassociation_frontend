"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../assets/style/Admin/AdminLayout.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⌂" },

  {
    label: "Home",
    icon: "🏡",
    children: [
      { href: "/admin/dashboard/homebanner", label: "Hero Section" },
      { href: "/admin/home/about", label: "About Section" },
      { href: "/admin/home/gallery", label: "Gallery" },
      { href: "/admin/home/features", label: "Features / Highlights" },
      { href: "/admin/home/contact", label: "Contact Info" },
    ],
  },

  {
    label: "Courses",
    icon: "📜",
    children: [
      { href: "/admin/courses", label: "All Courses" },
      { href: "/admin/courses/add", label: "Add Course" },
    ],
  },
  {
    label: "Teachers",
    icon: "🧘",
    children: [
      { href: "/admin/teachers", label: "All Teachers" },
      { href: "/admin/teachers/add", label: "Add Teacher" },
    ],
  },
  {
    label: "Testimonials",
    icon: "✦",
    children: [{ href: "/admin/testimonials", label: "All Testimonials" }],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.adminShell}>
      {/* Mobile overlay */}
      <div
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.sidebarOverlayOpen : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarLogo}>
          <span className={styles.logoOm}>ॐ</span>
          <h1 className={styles.logoTitle}>AYM ADMIN</h1>
          <p className={styles.logoSub}>Yoga School Dashboard</p>
        </div>

        <nav className={styles.sidebarNav}>
          <span className={styles.navSectionLabel}>Navigation</span>

          {navItems.map((item) => (
            <div key={item.label}>
              {/* Simple Link (Dashboard) */}
              {!item.children && (
                <Link
                  href={item.href!}
                  className={`${styles.navLink} ${
                    pathname === item.href ? styles.navLinkActive : ""
                  }`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              )}

              {/* Dropdown Menu */}
              {item.children && (
                <>
                  <button
                    className={`${styles.navLink} ${styles.navDropdownBtn} ${
                      openMenu === item.label ? styles.navDropdownBtnOpen : ""
                    } ${
                      item.children.some((c) => pathname === c.href)
                        ? styles.navLinkActive
                        : ""
                    }`}
                    onClick={() =>
                      setOpenMenu(openMenu === item.label ? null : item.label)
                    }
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabelText}>{item.label}</span>
                    <span
                      className={`${styles.chevron} ${
                        openMenu === item.label ? styles.chevronOpen : ""
                      }`}
                    >
                      ›
                    </span>
                  </button>

                  <div
                    className={`${styles.dropdown} ${
                      openMenu === item.label ? styles.dropdownOpen : ""
                    }`}
                  >
                    <div className={styles.dropdownInner}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`${styles.dropdownLink} ${
                            pathname === child.href
                              ? styles.dropdownLinkActive
                              : ""
                          }`}
                        >
                          <span className={styles.dropdownDot}>◈</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>AYM Yoga School © 2025</div>
      </aside>

      {/* Main area */}
      <div className={styles.mainArea}>
        <div className={styles.ornamentStrip} />

        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.hamburger}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <span className={styles.pageTitleBar}>Admin Dashboard</span>
          </div>
          <div className={styles.topbarRight}>
            <Link href="/" className={styles.topbarLink}>
              ← View Site
            </Link>
            <span className={styles.topbarDivider} />

            {/* Profile Dropdown */}
            <div className={styles.profileWrapper} ref={profileRef}>
              <button
                className={`${styles.profileBtn} ${profileOpen ? styles.profileBtnOpen : ""}`}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
              >
                <div className={styles.topbarAvatar}>A</div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>Aryan</span>
                  <span className={styles.profileRole}>Administrator</span>
                </div>
                <span
                  className={`${styles.profileChevron} ${profileOpen ? styles.profileChevronOpen : ""}`}
                >
                  ›
                </span>
              </button>

              {/* Dropdown Panel */}
              <div
                className={`${styles.profileDropdown} ${profileOpen ? styles.profileDropdownOpen : ""}`}
              >
                <div className={styles.profileDropdownHeader}>
                  <div className={styles.profileDropdownAvatar}>A</div>
                  <div>
                    <p className={styles.profileDropdownName}>Aryan</p>
                    <p className={styles.profileDropdownEmail}>
                      admin@aymyoga.com
                    </p>
                  </div>
                </div>

                <div className={styles.profileDropdownDivider} />

                <Link
                  href="/admin/profile"
                  className={styles.profileDropdownItem}
                  onClick={() => setProfileOpen(false)}
                >
                  <span className={styles.profileDropdownIcon}>◉</span>
                  My Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className={styles.profileDropdownItem}
                  onClick={() => setProfileOpen(false)}
                >
                  <span className={styles.profileDropdownIcon}>⚙</span>
                  Settings
                </Link>
                <Link
                  href="/admin/change-password"
                  className={styles.profileDropdownItem}
                  onClick={() => setProfileOpen(false)}
                >
                  <span className={styles.profileDropdownIcon}>🔑</span>
                  Change Password
                </Link>

                <div className={styles.profileDropdownDivider} />

                <button
                  className={`${styles.profileDropdownItem} ${styles.profileDropdownLogout}`}
                >
                  <span className={styles.profileDropdownIcon}>⏻</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "../../assets/style/Admin/AdminLayout.module.css";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface NavChild {
  href: string;
  label: string;
}

interface NavSubGroup {
  label: string;
  icon?: string;
  children: NavChild[];
}

interface NavItem {
  href?: string;
  label: string;
  icon: string;
  children?: NavChild[];
  subGroups?: NavSubGroup[];
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "⌂" },
  {
    label: "Home",
    icon: "🏡",
    children: [
      { href: "/admin/dashboard/homebanner",           label: "Hero Section" },
      { href: "/admin/dashboard/yogateachertraning",   label: "About Section" },
      { href: "/admin/dashboard/homeCoursessection",   label: "Home Course Section" },
      { href: "/admin/dashboard/accreditationsection", label: "Accreditation Section" },
      { href: "/admin/dashboard/yogacoursespage",      label: "Yoga Courses Page" },
      { href: "/admin/dashboard/Classcampusameniti",   label: "Class Campus Ameniti" },
      { href: "/admin/dashboard/aymfullpage",          label: "Aym Full Page" },
      { href: "/admin/dashboard/ourmission",           label: "Our Mission" },
      { href: "/admin/dashboard/whyaymschool",         label: "Why Aym School" },
    ],
  },
  { href: "/admin/dashboard/Affiliation", label: "Affiliation",icon: "🖼" },
  { href: "/admin/dashboard/about-aym",  label: "About Aym", icon: "📋" },
  { href: "/admin/dashboard/yoga-rules",    label: "Yoga Rules",icon: "✏" },
  { href: "/admin/dashboard/yoga-retreat", label: "Yoga Retreat",icon: "🖼" },
  { href: "/admin/dashboard/yoga-ashram",  label: "Yoga Ashram", icon: "📋" },
  {
    label: "Courses",
    icon: "📜",
    subGroups: [
      {
        label: "100 Hours", icon: "①",
        children: [
          { href: "/admin/yogacourse/100hourscourse/100hr-seats",   label: "Seats & Dates" },
          { href: "/admin/yogacourse/100hourscourse/100hr-content", label: "Page Content" },
        ],
      },
      {
        label: "200 Hours", icon: "②",
        children: [
          { href: "/admin/yogacourse/200hourscourse/200hr-seats",   label: "Seats & Dates" },
          { href: "/admin/yogacourse/200hourscourse/200hr-content", label: "Page Content" },
        ],
      },
      {
        label: "300 Hours", icon: "③",
        children: [
          { href: "/admin/yogacourse/300hourscourse/300hr-seats",  label: "Seats & Dates" },
          { href: "/admin/yogacourse/300hourscourse/300-content1", label: "Page Content" },
          { href: "/admin/yogacourse/300hourscourse/300-content2", label: "Page Content Second" },
        ],
      },
      {
        label: "500 Hours", icon: "⑤",
        children: [
          { href: "/admin/yogacourse/500hourscourse/500hr-seats", label: "Seats & Dates" },
          { href: "/admin/yogacourse/500hourscourse/content",     label: "Page Content" },
        ],
      },
      {
        label: "Kundalini Yoga", icon: "🔱",
        children: [
          { href: "/admin/yogacourse/kundalini-yoga/kundalini-yoga-seat",             label: "Yoga Teacher Seat" },
          { href: "/admin/yogacourse/kundalini-yoga/kundalini-yoga-teacher-training", label: "Yoga Teacher India" },
        ],
      },
      {
        label: "Yoga Teacher Rishikesh", icon: "🏔",
        children: [
          { href: "/admin/yogacourse/yoga-teacher-in-rishikesh", label: "Yoga Teacher Rishikesh" },
        ],
      },
      {
        label: "Prenatal Yoga Course", icon: "🤱",
        children: [
          { href: "/admin/yogacourse/prenatal-yoga-course/prenatal-seats",   label: "Prenatal Yoga Seats" },
          { href: "/admin/yogacourse/prenatal-yoga-course/prenatal-content", label: "Prenatal Content" },
        ],
      },
      {
        label: "Vinyasa Teacher Training", icon: "🌊",
        children: [
          { href: "/admin/yogacourse/vinyasa-yoga-course/vinyasa-seats",            label: "Vinyasa Seat" },
          { href: "/admin/yogacourse/vinyasa-yoga-course/vinyasa-teacher-training", label: "Vinyasa Teacher Training" },
        ],
      },
      {
        label: "Yoga Teacher In India", icon: "🇮🇳",
        children: [
          { href: "/admin/yogacourse/yoga-teacher-in-india", label: "Yoga Teacher India" },
        ],
      },
      {
        label: "Hatha Yoga Teacher Training", icon: "🧘",
        children: [
          { href: "/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-training-seats",           label: "Hatha Yoga Seats" },
          { href: "/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-teacher-training-content", label: "Hatha Yoga Content" },
        ],
      },
      {
        label: "Yoga GOA in India", icon: "🌴",
        children: [
          { href: "/admin/yogacourse/yoga-goa-in-india/yoga-goa-200hr-seats", label: "200hr Seats in Goa" },
          { href: "/admin/yogacourse/yoga-goa-in-india/yoga-goa-300hr-seats", label: "300hr Seats in Goa" },
          { href: "/admin/yogacourse/yoga-goa-in-india/yoga-goa-500hr-seats", label: "500hr Seats in Goa" },
          { href: "/admin/yogacourse/yoga-goa-in-india/yoga-goa-content",     label: "Content in Goa" },
        ],
      },
      {
        label: "Yoga Course Bali", icon: "🌺",
        children: [
          { href: "/admin/yogacourse/yoga-course-bali", label: "Yoga Course Bali" },
        ],
      },
      {
        label: "Yoga Ayurveda Teacher", icon: "🌿",
        children: [
          { href: "/admin/yogacourse/yoga-ayurveda-teacher", label: "Yoga Ayurveda" },
        ],
      },
      {
        label: "World Wide", icon: "🌍",
        children: [
          { href: "/admin/yogacourse/world-wide", label: "World Wide" },
        ],
      },
    ],
  },
  {
    label: "Teachers", icon: "🧘",
    children: [
      { href: "/admin/our-teachers/founder",       label: "Founder" },
      { href: "/admin/our-teachers/teachers",      label: "All Teachers" },
      { href: "/admin/our-teachers/guestteachers", label: "All Guest Teachers" },
    ],
  },
  {
    label: "Home Testimonials", icon: "✦",
    children: [
      { href: "/admin/dashboard/testimonialsvideo", label: "Testimonials Video" },
      { href: "/admin/dashboard/testimonialstext",  label: "Testimonials Review Text" },
    ],
  },
  { href: "/admin/dashboard/gallery", label: "Gallery",icon: "🖼" },
  { href: "/admin/dashboard/blog",    label: "Blog",icon: "✏" },
  { href: "/admin/Registrationlist",  label: "Registration List", icon: "📋" },
  { href: "/admin/accommodation",     label: "Accommodation",icon: "🏠" },
  {
    label: "Testimonials", icon: "✦",
    children: [
      { href: "/admin/testimonial/text-testimonial",  label: "Text Testimonials" },
      { href: "/admin/testimonial/video-testimonial", label: "Video Testimonials" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // ✅ ALL hooks inside the component
  const { user, logout, loading } = useAuth();
  const router                    = useRouter();
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [openMenu, setOpenMenu]           = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu]     = useState<string | null>(null);
  const [profileOpen, setProfileOpen]     = useState(false);
  const [settingsSubOpen, setSettingsSubOpen] = useState(false);
  const profileRef                        = useRef<HTMLDivElement>(null);
  const pathname                          = usePathname();

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  // Close profile (and its settings sub-panel) on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setSettingsSubOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-open parent menu if current path matches
  useEffect(() => {
    navItems.forEach(item => {
      if (item.children?.some(c => pathname.startsWith(c.href))) {
        setOpenMenu(item.label);
      }
      if (item.subGroups) {
        item.subGroups.forEach(sg => {
          if (sg.children.some(c => pathname.startsWith(c.href))) {
            setOpenMenu(item.label);
            setOpenSubMenu(sg.label);
          }
        });
      }
    });
  }, [pathname]);

  const toggleMenu    = (label: string) => setOpenMenu(p  => p === label ? null : label);
  const toggleSubMenu = (label: string) => setOpenSubMenu(p => p === label ? null : label);

  const isMenuActive = (item: NavItem): boolean => {
    if (item.children)  return item.children.some(c => pathname.startsWith(c.href));
    if (item.subGroups) return item.subGroups.some(sg => sg.children.some(c => pathname.startsWith(c.href)));
    return false;
  };

  // ✅ Show nothing while checking session
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 48, color: "#f15505" }}>ॐ</div>
        <p style={{ color: "#f15505", fontFamily: "serif" }}>Checking session…</p>
      </div>
    );
  }

  // ✅ Show nothing while redirect is in progress
  if (!user) return null;

  return (
    <div className={styles.adminShell}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#1f2937", color: "#fff", borderRadius: "10px", padding: "12px 16px", fontSize: "14px" },
        }}
      />

      <div
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.sidebarOverlayOpen : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ════════════ SIDEBAR ════════════ */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoOm}>ॐ</span>
          <h1 className={styles.logoTitle}>AYM ADMIN</h1>
          <p className={styles.logoSub}>Yoga School Dashboard</p>
        </div>

        <nav className={styles.sidebarNav}>
          <span className={styles.navSectionLabel}>Navigation</span>

          {navItems.map(item => (
            <div key={item.label}>

              {!item.children && !item.subGroups && (
                <Link
                  href={item.href!}
                  className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              )}

              {item.children && (
                <>
                  <button
                    className={`${styles.navLink} ${styles.navDropdownBtn}
                      ${openMenu === item.label ? styles.navDropdownBtnOpen : ""}
                      ${isMenuActive(item) ? styles.navLinkActive : ""}`}
                    onClick={() => toggleMenu(item.label)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabelText}>{item.label}</span>
                    <span className={`${styles.chevron} ${openMenu === item.label ? styles.chevronOpen : ""}`}>›</span>
                  </button>

                  <div className={`${styles.dropdown} ${openMenu === item.label ? styles.dropdownOpen : ""}`}>
                    <div className={styles.dropdownInner}>
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`${styles.dropdownLink} ${pathname.startsWith(child.href) ? styles.dropdownLinkActive : ""}`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className={styles.dropdownDot}>◈</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {item.subGroups && (
                <>
                  <button
                    className={`${styles.navLink} ${styles.navDropdownBtn}
                      ${openMenu === item.label ? styles.navDropdownBtnOpen : ""}
                      ${isMenuActive(item) ? styles.navLinkActive : ""}`}
                    onClick={() => toggleMenu(item.label)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabelText}>{item.label}</span>
                    <span className={`${styles.chevron} ${openMenu === item.label ? styles.chevronOpen : ""}`}>›</span>
                  </button>

                  <div className={`${styles.dropdown} ${openMenu === item.label ? styles.dropdownOpen : ""}`}>
                    <div className={styles.dropdownInner}>
                      {item.subGroups.map(sg => {
                        const sgActive = sg.children.some(c => pathname.startsWith(c.href));
                        return (
                          <div key={sg.label}>
                            <button
                              className={`${styles.subGroupBtn}
                                ${openSubMenu === sg.label ? styles.subGroupBtnOpen : ""}
                                ${sgActive ? styles.subGroupBtnActive : ""}`}
                              onClick={() => toggleSubMenu(sg.label)}
                            >
                              <span className={styles.subGroupIcon}>{sg.icon}</span>
                              <span className={styles.subGroupLabel}>{sg.label}</span>
                              <span className={`${styles.subChevron} ${openSubMenu === sg.label ? styles.subChevronOpen : ""}`}>›</span>
                            </button>

                            <div className={`${styles.subDropdown} ${openSubMenu === sg.label ? styles.subDropdownOpen : ""}`}>
                              {sg.children.map(child => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`${styles.subDropdownLink} ${pathname.startsWith(child.href) ? styles.subDropdownLinkActive : ""}`}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <span className={styles.subDropdownDot}>▸</span>
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>AYM Yoga School © 2025</div>
      </aside>

      {/* ════════════ MAIN AREA ════════════ */}
      <div className={styles.mainArea}>
        <div className={styles.ornamentStrip} />

        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">☰</button>
            <span className={styles.pageTitleBar}>Admin Dashboard</span>
          </div>
          <div className={styles.topbarRight}>
            <Link href="/" className={styles.topbarLink}>← View Site</Link>
            <span className={styles.topbarDivider} />

            <div className={styles.profileWrapper} ref={profileRef}>
              <button
                className={`${styles.profileBtn} ${profileOpen ? styles.profileBtnOpen : ""}`}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
              >
                <div className={styles.topbarAvatar}>
                  {user?.name?.charAt(0).toUpperCase() ?? "A"}
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>{user?.name ?? "Admin"}</span>
                  <span className={styles.profileRole}>Administrator</span>
                </div>
                <span className={`${styles.profileChevron} ${profileOpen ? styles.profileChevronOpen : ""}`}>›</span>
              </button>

              <div className={`${styles.profileDropdown} ${profileOpen ? styles.profileDropdownOpen : ""}`}>
                <div className={styles.profileDropdownHeader}>
                  <div className={styles.profileDropdownAvatar}>
                    {user?.name?.charAt(0).toUpperCase() ?? "A"}
                  </div>
                  <div>
                    <p className={styles.profileDropdownName}>{user?.name ?? "Admin"}</p>
                    <p className={styles.profileDropdownEmail}>{user?.email ?? ""}</p>
                  </div>
                </div>

                <div className={styles.profileDropdownDivider} />

                {/* <Link
                  href="/admin/profile"
                  className={styles.profileDropdownItem}
                  onClick={() => setProfileOpen(false)}
                >
                  <span className={styles.profileDropdownIcon}>◉</span>My Profile
                </Link> */}

                {/* ── Settings toggle: reveals Change Password + Logout ── */}
                <button
                  className={`${styles.profileDropdownItem} ${styles.settingsToggleBtn} ${settingsSubOpen ? styles.settingsToggleBtnOpen : ""}`}
                  onClick={() => setSettingsSubOpen(p => !p)}
                  aria-expanded={settingsSubOpen}
                >
                  <span className={styles.profileDropdownIcon}>⚙</span>
                  <span style={{ flex: 1 }}>Settings</span>
                  <span className={`${styles.settingsChevron} ${settingsSubOpen ? styles.settingsChevronOpen : ""}`}>›</span>
                </button>

                <div className={`${styles.settingsSubPanel} ${settingsSubOpen ? styles.settingsSubPanelOpen : ""}`}>
                  <Link
                    href="/auth/change-password"
                    className={styles.settingsSubItem}
                    onClick={() => {
                      setProfileOpen(false);
                      setSettingsSubOpen(false);
                    }}
                  >
                    <span className={styles.profileDropdownIcon}>🔑</span>Change Password
                  </Link>

                  <button
                    className={`${styles.settingsSubItem} ${styles.profileDropdownLogout}`}
                    onClick={logout}
                  >
                    <span className={styles.profileDropdownIcon}>⏻</span>Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
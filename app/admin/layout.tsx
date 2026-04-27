"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../assets/style/Admin/AdminLayout.module.css";
import { Toaster } from "react-hot-toast";

/* ══════════════════════════════════════════════
   NAV TYPES
══════════════════════════════════════════════ */
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
  /** flat children — simple links */
  children?: NavChild[];
  /** nested subgroups — one more level deep */
  subGroups?: NavSubGroup[];
}

/* ══════════════════════════════════════════════
   NAV DATA
══════════════════════════════════════════════ */
const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "⌂" },

  {
    label: "Home",
    icon: "🏡",
    children: [
      { href: "/admin/dashboard/homebanner",            label: "Hero Section" },
      { href: "/admin/dashboard/yogateachertraning",    label: "About Section" },
      { href: "/admin/dashboard/homeCoursessection",  label: "Home Course Section" },
      { href: "/admin/dashboard/accreditationsection",  label: "Accreditation Section" },
      { href: "/admin/dashboard/yogacoursespage",       label: "Yoga Courses Page" },
      { href: "/admin/dashboard/Classcampusameniti",    label: "Class Campus Ameniti" },
      { href: "/admin/dashboard/aymfullpage",           label: "Aym Full Page" },
      { href: "/admin/dashboard/ourmission",            label: "Our Mission" },
      { href: "/admin/dashboard/whyaymschool",          label: "Why Aym School" },
    ],
  },

  /* ── Courses — 2-level ── */
  {
    label: "Courses",
    icon: "📜",
    subGroups: [
      {
        label: "100 Hours",
        icon: "①",
        children: [
          { href: "/admin/yogacourse/100hourscourse/100hr-seats",   label: "Seats & Dates" },
          { href: "/admin/yogacourse/100hourscourse/100hr-content", label: "Page Content" },
        ],
      },
      {
        label: "200 Hours",
        icon: "②",
        children: [
          { href: "/admin/yogacourse/200hourscourse/200hr-seats",   label: "Seats & Dates" },
           { href: "/admin/yogacourse/200hourscourse/200hr-content",   label: "page Content" },
            { href: "/admin/yogacourse/200hourscourse/200hrcontent2",   label: "page Content second" },
         
        ],
      },
      {
        label: "300 Hours",
        icon: "③",
        children: [
          { href: "/admin/yogacourse/300hourscourse/300hr-seats",   label: "Seats & Dates" },
          { href: "/admin/yogacourse/300hourscourse/300-content1", label: "Page Content" },
           { href: "/admin/yogacourse/300hourscourse/300-content2", label: "Page Content second" },
        ],
      },
      {
        label: "500 Hours",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/500hourscourse/500hr-seats",   label: "Seats & Dates" },
          { href: "/admin/yogacourse/500hourscourse/content", label: "Page Content" },
        ],
      },
      {
        label: "kundalini-yoga",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/kundalini-yoga/kundalini-yoga-seat",   label: "Yoga Teacher Seat" },
          { href: "/admin/yogacourse/kundalini-yoga/kundalini-yoga-teacher-training",   label: "Yoga Teacher India" },
        
        ],
      },
      {
        label: "Yoga Teacher Rishikesh",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/yoga-teacher-in-rishikesh",   label: "Yoga Teacher Rishikesh" },
        
        ],
      },
        {
        label: "Prenatal Yoga Course",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/prenatal-yoga-course/prenatal-seats",   label: "prenatal yoga seats "},
          { href: "/admin/yogacourse/prenatal-yoga-course/prenatal-content",   label: "prenatal content "},
        
        ],
      },
       {
        label: "Vinyasa Teacher Training",
        icon: "⑤",
        children: [
           { href: "/admin/yogacourse/vinyasa-yoga-course/vinyasa-seats",   label: "vinyasa Seat" },
          { href: "/admin/yogacourse/vinyasa-yoga-course/vinyasa-teacher-training",   label: "vinyasa teacher training" },
        
        ],
      },
      {
        label: "Yoga Teacher In India",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/yoga-teacher-in-india",   label: "Yoga Teacher India" },
        
        ],
      },
      {
        label: "Hatha Yoga Teacher Training",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-training-seats",   label: "Hatha Yoga Seats" },
          { href: "/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-teacher-training-content",   label: "Hatha Yoga Teacher Content" },
          
        
        ],
      },
    
       
     
       {
        label: "Yoga GOA in India",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/yoga-goa-in-india/yoga-goa-200hr-seats",   label: "200hr-seats-in-goa" },
          { href: "/admin/yogacourse/yoga-goa-in-india/yoga-goa-300hr-seats",   label: "300hr-seats-in-goa" },
          { href: "/admin/yogacourse/yoga-goa-in-india/yoga-goa-500hr-seats",   label: "500hr-seats-in-goa" },
          { href: "/admin/yogacourse/yoga-goa-in-india/yoga-goa-content",   label: "content-in-goa" },
        
        ],
      },
      {
        label: "Yoga Course Bali",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/yoga-course-bali",   label: "Yoga Course Bali" },
        
        ],
      },
      {
        label: "Yoga Ayurveda Teacher",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/yoga-ayurveda-teacher",   label: "Yoga Ayurveda " },
        
        ],
      },
      {
        label: "World Wide",
        icon: "⑤",
        children: [
          { href: "/admin/yogacourse/world-wide",   label: "World Wide" },
        
        ],
      },
    ],
  },

  {
    label: "Teachers",
    icon: "🧘",
    children: [
      { href: "/admin/our-teachers/founder",       label: "Founder" },
      { href: "/admin/our-teachers/teachers",      label: "All Teachers" },
      { href: "/admin/our-teachers/guestteachers", label: "All Guest Teachers" },
    ],
  },

  {
    label: "Testimonials",
    icon: "✦",
    children: [
      { href: "/admin/dashboard/testimonialsvideo",  label: "Testimonials Video" },
      { href: "/admin/dashboard/testimonialstext",   label: "Testimonials Review Text" },
    ],
  },

  { href: "/admin/dashboard/gallery", label: "Gallery", icon: "🖼" },
  { href: "/admin/dashboard/blog",    label: "Blog",    icon: "✏" },
   { href: "/admin/Registrationlist", label: "Registration List", icon: "🖼" },
  { href: "/admin/accommodation", label: "Accommodation", icon: "🏠" },
];

/* ══════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════ */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [openMenu, setOpenMenu]         = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu]   = useState<string | null>(null);
  const [profileOpen, setProfileOpen]   = useState(false);
  const profileRef                      = useRef<HTMLDivElement>(null);
  const pathname                        = usePathname();

  /* Close profile on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Auto-open parent menu if current path matches */
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

  const toggleMenu    = (label: string) => setOpenMenu(p  => p === label  ? null : label);
  const toggleSubMenu = (label: string) => setOpenSubMenu(p => p === label ? null : label);

  /* ── helpers ── */
  const isMenuActive = (item: NavItem): boolean => {
    if (item.children) return item.children.some(c => pathname.startsWith(c.href));
    if (item.subGroups) return item.subGroups.some(sg => sg.children.some(c => pathname.startsWith(c.href)));
    return false;
  };

  return (
    <div className={styles.adminShell}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#1f2937", color: "#fff", borderRadius: "10px", padding: "12px 16px", fontSize: "14px" },
        }}
      />

      {/* Mobile overlay */}
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

              {/* ── Simple link (no children) ── */}
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

              {/* ── Flat dropdown (children) ── */}
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

              {/* ── 2-level nested (subGroups) ── */}
              {item.subGroups && (
                <>
                  {/* Level-1 button */}
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

                  {/* Level-1 panel */}
                  <div className={`${styles.dropdown} ${openMenu === item.label ? styles.dropdownOpen : ""}`}>
                    <div className={styles.dropdownInner}>
                      {item.subGroups.map(sg => {
                        const sgActive = sg.children.some(c => pathname.startsWith(c.href));
                        return (
                          <div key={sg.label}>
                            {/* Level-2 button */}
                            <button
                              className={`${styles.subGroupBtn} ${openSubMenu === sg.label ? styles.subGroupBtnOpen : ""} ${sgActive ? styles.subGroupBtnActive : ""}`}
                              onClick={() => toggleSubMenu(sg.label)}
                            >
                              <span className={styles.subGroupIcon}>{sg.icon}</span>
                              <span className={styles.subGroupLabel}>{sg.label}</span>
                              <span className={`${styles.subChevron} ${openSubMenu === sg.label ? styles.subChevronOpen : ""}`}>›</span>
                            </button>

                            {/* Level-2 panel */}
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
                <span className={`${styles.profileChevron} ${profileOpen ? styles.profileChevronOpen : ""}`}>›</span>
              </button>

              <div className={`${styles.profileDropdown} ${profileOpen ? styles.profileDropdownOpen : ""}`}>
                <div className={styles.profileDropdownHeader}>
                  <div className={styles.profileDropdownAvatar}>A</div>
                  <div>
                    <p className={styles.profileDropdownName}>Aryan</p>
                    <p className={styles.profileDropdownEmail}>admin@aymyoga.com</p>
                  </div>
                </div>

                <div className={styles.profileDropdownDivider} />

                <Link href="/admin/profile"          className={styles.profileDropdownItem} onClick={() => setProfileOpen(false)}><span className={styles.profileDropdownIcon}>◉</span>My Profile</Link>
                <Link href="/admin/settings"         className={styles.profileDropdownItem} onClick={() => setProfileOpen(false)}><span className={styles.profileDropdownIcon}>⚙</span>Settings</Link>
                <Link href="/admin/change-password"  className={styles.profileDropdownItem} onClick={() => setProfileOpen(false)}><span className={styles.profileDropdownIcon}>🔑</span>Change Password</Link>

                <div className={styles.profileDropdownDivider} />

                <button className={`${styles.profileDropdownItem} ${styles.profileDropdownLogout}`}>
                  <span className={styles.profileDropdownIcon}>⏻</span>Logout
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
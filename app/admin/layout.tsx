"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../assets/style/Admin/AdminLayout.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⌂" },
  { href: "/admin/courses", label: "Courses", icon: "📜" },
  { href: "/admin/teachers", label: "Teachers", icon: "🧘" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "✦" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "✉" },
  { href: "/admin/blog", label: "Blog", icon: "✒" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={styles.adminShell}>
      {/* Mobile overlay */}
      <div
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.sidebarOverlayOpen : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoOm}>ॐ</span>
          <h1 className={styles.logoTitle}>AYM ADMIN</h1>
          <p className={styles.logoSub}>Yoga School Dashboard</p>
        </div>

        <nav className={styles.sidebarNav}>
          <span className={styles.navSectionLabel}>Navigation</span>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
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
            <span className={styles.pageTitleBar}>Control Panel</span>
          </div>
          <div className={styles.topbarRight}>
            <Link href="/" className={styles.topbarLink}>← View Site</Link>
            <span className={styles.topbarDivider} />
            <div className={styles.topbarAvatar}>A</div>
          </div>
        </header>

        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
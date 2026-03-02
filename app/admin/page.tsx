import Link from "next/link";
import styles from "../../assets/style/Admin/AdminDashboard.module.css";

const stats = [
  { label: "Total Enquiries", value: "1,284", icon: "✉", change: "+12 this week", accent: "#e07b00" },
  { label: "Active Courses", value: "24", icon: "📜", change: "3 starting soon", accent: "#5c2d00" },
  { label: "Certified Teachers", value: "100K+", icon: "🧘", change: "Global reach", accent: "#7a3f00" },
  { label: "Testimonials", value: "486", icon: "✦", change: "+8 pending review", accent: "#b85e00" },
];

const recentEnquiries = [
  { name: "Sarah Mitchell", course: "200hr TTC", country: "🇺🇸 USA", date: "27 Feb 2026", status: "New" },
  { name: "Marco Ricci", course: "300hr TTC", country: "🇮🇹 Italy", date: "26 Feb 2026", status: "Replied" },
  { name: "Aiko Tanaka", course: "Yin Yoga", country: "🇯🇵 Japan", date: "26 Feb 2026", status: "New" },
  { name: "Emma Clarke", course: "Pranayama", country: "🇬🇧 UK", date: "25 Feb 2026", status: "Closed" },
  { name: "Ravi Sharma", course: "Kundalini", country: "🇮🇳 India", date: "25 Feb 2026", status: "Replied" },
];

const quickLinks = [
  { href: "/admin/courses", label: "Add New Course", icon: "+" },
  { href: "/admin/teachers", label: "Add Teacher", icon: "+" },
  { href: "/admin/blog", label: "Write Blog Post", icon: "✒" },
  { href: "/admin/gallery", label: "Upload Gallery", icon: "🖼" },
];

function getBadgeClass(status: string, s: typeof styles) {
  if (status === "New") return `${s.badge} ${s.badgeNew}`;
  if (status === "Replied") return `${s.badge} ${s.badgeReplied}`;
  return `${s.badge} ${s.badgeClosed}`;
}

export default function AdminDashboard() {
  return (
    <>
      <h1 className={styles.dashHeading}>Namaste, Admin ॐ</h1>
      <p className={styles.dashSub}>Welcome to the AYM Yoga School control panel</p>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div
            key={s.label}
            className={styles.statCard}
            style={{ "--accent": s.accent } as React.CSSProperties}
          >
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statChange}>{s.change}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className={styles.dashBody}>
        {/* Enquiries table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Recent Enquiries</span>
            <Link href="/admin/enquiries" className={styles.cardAction}>
              View all →
            </Link>
          </div>
          <table className={styles.enqTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Country</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.map((e) => (
                <tr key={e.name}>
                  <td className={styles.enqName}>{e.name}</td>
                  <td>{e.course}</td>
                  <td>{e.country}</td>
                  <td className={styles.enqDate}>{e.date}</td>
                  <td>
                    <span className={getBadgeClass(e.status, styles)}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className={styles.rightColumn}>
          {/* Quick Actions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Quick Actions</span>
            </div>
            <div className={styles.quickLinks}>
              {quickLinks.map((q) => (
                <Link key={q.href} href={q.href} className={styles.quickLink}>
                  <span className={styles.quickLinkIcon}>{q.icon}</span>
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quote card */}
          <div className={`${styles.card} ${styles.quoteCard}`}>
            <span className={styles.quoteOm}>ॐ</span>
            <p className={styles.quoteVerse}>
              "Yoga is the journey of the self, through the self, to the self."
              <span className={styles.quoteSource}>— The Bhagavad Gita</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
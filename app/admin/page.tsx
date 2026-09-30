"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import styles from "../../assets/style/Admin/AdminDashboard.module.css";

const quickLinks = [
  { href: "/admin/our-teachers/teachers/add-new", label: "Add Teacher", icon: "+" },
  { href: "/admin/dashboard/blog/add-new", label: "Write Blog Post", icon: "✒" },
  { href: "/admin/dashboard/gallery", label: "Upload Gallery", icon: "🖼" },
];

interface Registration {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  country?: string;
  address?: string;
  howKnow?: string;
  course?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  coupon?: string;
  batchId?: string;
  createdAt: string;
}

/* ── Icons ── */
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DetailRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEnquiries, setTotalEnquiries] = useState("0");
  const [totalCourses, setTotalCourses] = useState("0");
  const [totalTeachers, setTotalTeachers] = useState("0");
  const [totalTestimonials, setTotalTestimonials] = useState("0");
  const [totalBlogs, setTotalBlogs] = useState("0");

  // Modal states
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete states
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [registrationsRes, coursesStatsRes, teachersRes, studentReviewsRes, blogsRes] = await Promise.allSettled([
        api.get("/registration/get"),
        api.get("/course-stats/count"),
        api.get("/teachers/get-all-teachers"),
        api.get("/student-reviews/get"),
        api.get("/blogs/get-all")
      ]);

      // Handle Registrations
      if (registrationsRes.status === 'fulfilled' && registrationsRes.value.data.success) {
        const data = registrationsRes.value.data.data;
        setRegistrations(data);
        setTotalEnquiries(data.length.toLocaleString());
      } else if (registrationsRes.status === 'fulfilled' && Array.isArray(registrationsRes.value.data)) {
        const data = registrationsRes.value.data;
        setRegistrations(data);
        setTotalEnquiries(data.length.toLocaleString());
      } else {
        setTotalEnquiries("0");
      }

      // Handle Course Stats
      if (coursesStatsRes.status === 'fulfilled' && coursesStatsRes.value.data?.success) {
        const courseCount = coursesStatsRes.value.data.total;
        setTotalCourses(courseCount.toLocaleString());
      } else {
        setTotalCourses("0");
      }

      // Handle Teachers
      if (teachersRes.status === 'fulfilled') {
        let teachersData = [];
        if (teachersRes.value.data?.success && Array.isArray(teachersRes.value.data.data)) {
          teachersData = teachersRes.value.data.data;
        } else if (Array.isArray(teachersRes.value.data)) {
          teachersData = teachersRes.value.data;
        } else if (teachersRes.value.data?.teachers && Array.isArray(teachersRes.value.data.teachers)) {
          teachersData = teachersRes.value.data.teachers;
        }
        setTotalTeachers(teachersData.length.toLocaleString());
      } else {
        setTotalTeachers("0");
      }

      // Handle Student Reviews
      if (studentReviewsRes.status === 'fulfilled') {
        let reviewsData = [];
        if (studentReviewsRes.value.data?.success && Array.isArray(studentReviewsRes.value.data.data)) {
          reviewsData = studentReviewsRes.value.data.data;
        } else if (Array.isArray(studentReviewsRes.value.data)) {
          reviewsData = studentReviewsRes.value.data;
        } else if (studentReviewsRes.value.data?.reviews && Array.isArray(studentReviewsRes.value.data.reviews)) {
          reviewsData = studentReviewsRes.value.data.reviews;
        }

        // Count only Active reviews
        const activeReviews = reviewsData.filter((r: any) =>
          r.status === "Active" || r.status === "active" || r.status === "approved" || r.status === "published"
        );
        const reviewCount = activeReviews.length > 0 ? activeReviews.length : reviewsData.length;
        setTotalTestimonials(reviewCount.toLocaleString());
      } else {
        setTotalTestimonials("0");
      }

      // Handle Blogs
      if (blogsRes.status === 'fulfilled') {
        let blogsData = [];
        if (blogsRes.value.data?.success && Array.isArray(blogsRes.value.data.data)) {
          blogsData = blogsRes.value.data.data;
        } else if (Array.isArray(blogsRes.value.data)) {
          blogsData = blogsRes.value.data;
        } else if (blogsRes.value.data?.blogs && Array.isArray(blogsRes.value.data.blogs)) {
          blogsData = blogsRes.value.data.blogs;
        }

        // Count only Published blogs
        const publishedBlogs = blogsData.filter((b: any) =>
          b.status === "Published" || b.status === "published"
        );
        const blogCount = publishedBlogs.length > 0 ? publishedBlogs.length : blogsData.length;
        setTotalBlogs(blogCount.toLocaleString());
      } else {
        setTotalBlogs("0");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setTotalCourses("0");
      setTotalTeachers("0");
      setTotalTestimonials("0");
      setTotalEnquiries("0");
      setTotalBlogs("0");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (reg: Registration) => {
    setSelectedUser(reg);
    setModalError(null);
    setModalLoading(true);

    try {
      const res = await api.get(`/registration/get/${reg._id}`);
      if (res.data.success) {
        setSelectedUser(res.data.data);
      } else {
        setModalError(res.data.message || "Could not load full record.");
      }
    } catch (err) {
      console.error("Single fetch error:", err);
      setModalError("Network error. Showing cached data.");
    } finally {
      setModalLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      const res = await api.delete(`/registration/delete/${id}`);
      if (res.data.success) {
        setRegistrations((prev) => prev.filter((r) => r._id !== id));
        setTotalEnquiries((prev) => (parseInt(prev) - 1).toLocaleString());
        setDeleteConfirm(null);
        if (selectedUser?._id === id) closeModal();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalError(null);
    setModalLoading(false);
  };

  const recentRegistrations = registrations.slice(0, 5);

  // Stats with real data
  const stats = [
    {
      label: "Total Enquiries",
      value: totalEnquiries,
      icon: "✉",
      change: "+12 this week",
      accent: "#F15505",
    },
    {
      label: "Active Courses",
      value: totalCourses,
      icon: "📜",
      change: "3 starting soon",
      accent: "#5c2d00",
    },
    {
      label: "Certified Teachers",
      value: totalTeachers,
      icon: "🧘",
      change: "Global reach",
      accent: "#7a3f00",
    },
    {
      label: "Testimonials",
      value: totalTestimonials,
      icon: "✦",
      change: "+8 pending review",
      accent: "#f15505",
    },
    {
      label: "Total Blogs",
      value: totalBlogs,
      icon: "📝",
      change: "Published articles",
      accent: "#8B5E3C",
    },
  ];

  return (
    <>
      <h1 className={styles.dashHeading}>Namaste, Admin ॐ</h1>
      <p className={styles.dashSub}>
        Welcome to the AYM Yoga School control panel
      </p>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div
            key={s.label}
            className={styles.statCard}
            style={{ "--accent": s.accent } as React.CSSProperties}
          >
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value === "0" && loading ? "..." : s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statChange}>{s.change}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className={styles.dashBody}>
        {/* Enquiries table with horizontal scroll */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Recent Enquiries</span>
            <Link href="/admin/Registrationlist" className={styles.cardAction}>
              View all →
            </Link>
          </div>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Loading registrations...</p>
            </div>
          ) : recentRegistrations.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No registrations found</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.enqTable}>
                <thead>
                  <tr>
                    <th>Seeker</th>
                    {/* <th>Contact</th> */}
                    <th>Course</th>
                    {/* <th>Location</th> */}
                    <th>Registered On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map((reg) => (
                    <tr key={reg._id}>
                      <td>
                        <div className={styles.nameCell}>

                          <div>
                            <p className={styles.namePrimary}>{reg.fullName}</p>
                            <p className={styles.nameSecondary}>{reg.gender || "—"}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={styles.courseBadge}>{reg.course || "—"}</span>
                      </td>

                      <td className={styles.enqDate}>{formatDate(reg.createdAt)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.actionBtn} ${styles.eyeBtn}`}
                            onClick={() => handleViewUser(reg)}
                            title="View Details"
                          >
                            <EyeIcon />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => setDeleteConfirm(reg._id)}
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className={styles.rightColumn}>

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

      {/* ══════════════════════════════
          DETAIL MODAL
      ══════════════════════════════ */}
      {selectedUser && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeroContent}>
                <div className={styles.modalAvatar}>
                  {selectedUser.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <h2 className={styles.modalName}>
                  {selectedUser.fullName || "Loading…"}
                </h2>
                {!modalLoading && !modalError && selectedUser.createdAt && (
                  <p className={styles.modalSince}>
                    Registered on {formatDate(selectedUser.createdAt)}
                  </p>
                )}
              </div>
              <button className={styles.closeBtn} onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>

            <div className={styles.modalBody}>
              {modalLoading && (
                <div className={styles.modalLoadingWrap}>
                  <div className={styles.modalSpinner} />
                  <p>Fetching full record…</p>
                </div>
              )}

              {!modalLoading && modalError && (
                <div className={styles.modalErrorWrap}>
                  <p>⚠️ {modalError}</p>
                  <button
                    className={styles.retryBtn}
                    onClick={() => handleViewUser(selectedUser)}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!modalLoading && !modalError && (
                <>
                  <div className={styles.sectionBlock}>
                    <h4 className={styles.sectionTitle}>
                      <span className={styles.sectionDot} />
                      Personal Information
                    </h4>
                    <div className={styles.detailGrid}>
                      <DetailRow label="Full Name" value={selectedUser.fullName} />
                      <DetailRow label="Email" value={selectedUser.email} />
                      <DetailRow label="Phone" value={selectedUser.phone} />
                      <DetailRow label="Birth Date" value={selectedUser.birthDate} />
                      <DetailRow label="Gender" value={selectedUser.gender} />
                      <DetailRow label="Nationality" value={selectedUser.nationality} />
                      <DetailRow label="Country" value={selectedUser.country} />
                      <DetailRow label="Address" value={selectedUser.address} />
                    </div>
                  </div>

                  <div className={styles.sectionBlock}>
                    <h4 className={styles.sectionTitle}>
                      <span className={styles.sectionDot} />
                      Course Details
                    </h4>
                    <div className={styles.detailGrid}>
                      <DetailRow label="Course" value={selectedUser.course} />
                      <DetailRow label="Start Date" value={selectedUser.startDate} />
                      <DetailRow label="End Date" value={selectedUser.endDate} />
                      <DetailRow label="Location" value={selectedUser.location} />
                      <DetailRow label="Batch ID" value={selectedUser.batchId} />
                      <DetailRow label="Coupon" value={selectedUser.coupon} />
                    </div>
                  </div>

                  <div className={styles.sectionBlock}>
                    <h4 className={styles.sectionTitle}>
                      <span className={styles.sectionDot} />
                      Additional Info
                    </h4>
                    <div className={styles.detailGrid}>
                      <DetailRow label="How Did They Know" value={selectedUser.howKnow} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {!modalLoading && (
              <div className={styles.modalFooter}>
                <button
                  className={styles.modalDeleteBtn}
                  onClick={() => {
                    closeModal();
                    setDeleteConfirm(selectedUser._id);
                  }}
                >
                  <TrashIcon /> Delete Record
                </button>
                <button className={styles.modalCloseBtn} onClick={closeModal}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          DELETE CONFIRM MODAL
      ══════════════════════════════ */}
      {deleteConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => !deleteLoading && setDeleteConfirm(null)}
        >
          <div
            className={`${styles.modal} ${styles.confirmModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmIcon}>⚠️</div>
            <h3 className={styles.confirmTitle}>Delete this record?</h3>
            <p className={styles.confirmText}>
              This action cannot be undone. The seeker&apos;s journey from our
              records will be erased permanently.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteLoading}
              >
                {deleteLoading ? <span className={styles.btnSpinner} /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
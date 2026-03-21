"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api"; // ← your axios instance
import styles from "@/assets/style/Admin/Registrationlist/Registrationlist.module.css";

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
const LotusIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.lotusIcon}>
    <path d="M32 52C32 52 12 40 12 26C12 18 20 12 32 12C44 12 52 18 52 26C52 40 32 52 32 52Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M32 52C32 52 20 36 20 26C20 20 25 16 32 16C39 16 44 20 44 26C44 36 32 52 32 52Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M32 52C32 52 26 38 26 26C26 20 28.5 14 32 14C35.5 14 38 20 38 26C38 38 32 52 32 52Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="32" cy="28" r="3" fill="currentColor"/>
  </svg>
);

const OmIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.omIcon}>
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fill="currentColor" fontFamily="serif">ॐ</text>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
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

/* ══════════════════════════════
   MAIN COMPONENT
══════════════════════════════ */
export default function RegistrationList() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  /* ── Fetch All ── */
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/registration/get");
      if (res.data.success) setRegistrations(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch Single (Eye Button) ── */
  const handleViewUser = async (reg: Registration) => {
    setSelectedUser(reg);        // instant open with list data
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

  /* ── Delete ── */
  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      const res = await api.delete(`/registration/delete/${id}`);
      if (res.data.success) {
        setRegistrations((prev) => prev.filter((r) => r._id !== id));
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filtered = registrations.filter(
    (r) =>
      r.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.course?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ══════════════════════════════
     RENDER
  ══════════════════════════════ */
  return (
    <div className={styles.page}>
      <div className={styles.bgTexture} />

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <LotusIcon />
            <div>
              <p className={styles.headerSub}>Admin Panel</p>
              <h1 className={styles.headerTitle}>Registrations</h1>
            </div>
          </div>
          <div className={styles.headerRight}>
            <OmIcon />
            <div className={styles.statsBox}>
              <span className={styles.statsNumber}>{registrations.length}</span>
              <span className={styles.statsLabel}>Total</span>
            </div>
          </div>
        </div>
        <div className={styles.ornament}>
          <span />
          <svg viewBox="0 0 40 10" className={styles.ornamentFlower}>
            <text x="50%" y="90%" textAnchor="middle" fontSize="10" fill="currentColor">❧</text>
          </svg>
          <span />
        </div>
      </header>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or course…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <p className={styles.resultCount}>
          Showing <strong>{filtered.length}</strong> of {registrations.length} seekers
        </p>
      </div>

      {/* ── Main ── */}
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading sacred records…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <LotusIcon />
            <p>No registrations found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Seeker</th>
                    <th>Contact</th>
                    <th>Course</th>
                    <th>Location</th>
                    <th>Registered On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((reg, i) => (
                    <tr key={reg._id} className={styles.tableRow}>
                      <td className={styles.indexCell}>{i + 1}</td>
                      <td>
                        <div className={styles.nameCell}>
                          <div className={styles.avatar}>
                            {reg.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={styles.namePrimary}>{reg.fullName}</p>
                            <p className={styles.nameSecondary}>{reg.gender || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className={styles.contactEmail}>{reg.email}</p>
                        <p className={styles.contactPhone}>{reg.phone || "—"}</p>
                      </td>
                      <td>
                        <span className={styles.courseBadge}>{reg.course || "—"}</span>
                      </td>
                      <td className={styles.locationCell}>{reg.location || "—"}</td>
                      <td className={styles.dateCell}>{formatDate(reg.createdAt)}</td>
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

            {/* Mobile Cards */}
            <div className={styles.cardGrid}>
              {filtered.map((reg, i) => (
                <div key={reg._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardAvatar}>
                      {reg.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.cardTitle}>
                      <h3>{reg.fullName}</h3>
                      <p>{reg.email}</p>
                    </div>
                    <span className={styles.cardIndex}>#{i + 1}</span>
                  </div>
                  <div className={styles.cardBody}>
                    {reg.course && (
                      <span className={styles.courseBadge}>{reg.course}</span>
                    )}
                    <p className={styles.cardDate}>📅 {formatDate(reg.createdAt)}</p>
                    {reg.location && (
                      <p className={styles.cardLocation}>📍 {reg.location}</p>
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.actionBtn} ${styles.eyeBtn}`}
                      onClick={() => handleViewUser(reg)}
                    >
                      <EyeIcon /> <span>View</span>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => setDeleteConfirm(reg._id)}
                    >
                      <TrashIcon /> <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ══════════════════════════════
          DETAIL MODAL
      ══════════════════════════════ */}
      {selectedUser && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

            <div className={styles.modalHeader}>
              <div className={styles.modalHeroPattern} />
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
              {/* Loading */}
              {modalLoading && (
                <div className={styles.modalLoadingWrap}>
                  <div className={styles.modalSpinner} />
                  <p className={styles.modalLoadingText}>Fetching full record…</p>
                </div>
              )}

              {/* Error */}
              {!modalLoading && modalError && (
                <div className={styles.modalErrorWrap}>
                  <p className={styles.modalErrorText}>⚠️ {modalError}</p>
                  <button className={styles.retryBtn} onClick={() => handleViewUser(selectedUser)}>
                    Retry
                  </button>
                </div>
              )}

              {/* Data */}
              {!modalLoading && (
                <>
                  <div className={styles.sectionBlock}>
                    <h4 className={styles.sectionTitle}>
                      <span className={styles.sectionDot} />
                      Personal Information
                    </h4>
                    <div className={styles.detailGrid}>
                      <DetailRow label="Full Name"   value={selectedUser.fullName} />
                      <DetailRow label="Email"       value={selectedUser.email} />
                      <DetailRow label="Phone"       value={selectedUser.phone} />
                      <DetailRow label="Birth Date"  value={selectedUser.birthDate} />
                      <DetailRow label="Gender"      value={selectedUser.gender} />
                      <DetailRow label="Nationality" value={selectedUser.nationality} />
                      <DetailRow label="Country"     value={selectedUser.country} />
                      <DetailRow label="Address"     value={selectedUser.address} />
                    </div>
                  </div>

                  <div className={styles.sectionBlock}>
                    <h4 className={styles.sectionTitle}>
                      <span className={styles.sectionDot} />
                      Course Details
                    </h4>
                    <div className={styles.detailGrid}>
                      <DetailRow label="Course"     value={selectedUser.course} />
                      <DetailRow label="Start Date" value={selectedUser.startDate} />
                      <DetailRow label="End Date"   value={selectedUser.endDate} />
                      <DetailRow label="Location"   value={selectedUser.location} />
                      <DetailRow label="Batch ID"   value={selectedUser.batchId} />
                      <DetailRow label="Coupon"     value={selectedUser.coupon} />
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
    </div>
  );
}
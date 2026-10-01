"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/assets/style/Admin/our-teachers/Teacher.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Teacher {
  _id: string;
  name: string;
  role: string;
  years: string;
  image: string;
  bio: string[];
  education: string[];
  expertise: string[];
  isGuest: boolean;
  order?: number;
}

export default function FacultyListPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers/get-all-teachers");
      const all: Teacher[] = res.data.data || [];
      setTeachers(all.filter((t) => !t.isGuest));
    } catch {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId || deleting) return;
    try {
      setDeleting(true);
      await api.delete(`/teachers/delete-teacher/${deleteId}`);
      setTeachers((prev) => prev.filter((t) => t._id !== deleteId));
      setDeleteId(null);
      toast.success("Teacher removed successfully");
    } catch {
      toast.error("Failed to delete teacher");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.loadingOm}>ॐ</div>
          <p className={styles.loadingText}>Loading faculty teachers…</p>
        </div>
      </div>
    );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Teaching Faculty</h1>
          <p className={styles.pageSubtitle}>
            Manage faculty teachers — full profiles with bio, education &amp;
            expertise
          </p>
        </div>
        <Link
          href="/admin/our-teachers/teachers/add-new"
          className={styles.primaryBtn}
        >
          + Add Faculty Teacher
        </Link>
      </div>

      {/* Ornament */}
      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statNum}>{teachers.length}</span>
          <span className={styles.statLbl}>Total Faculty</span>
        </div>
      </div>

      {/* Empty */}
      {teachers.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyOm}>ॐ</div>
          <p className={styles.emptyText}>
            No faculty teachers found. Add one to get started.
          </p>
          <Link
            href="/admin/our-teachers/teachers/add-new"
            className={styles.emptyBtn}
          >
            + Add Faculty Teacher
          </Link>
        </div>
      )}

      {/* Table */}
      {teachers.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thPhoto}>Photo</th>
                <th>Name</th>
                <th className={styles.hideMobile}>Role</th>
                <th className={styles.hideTablet}>Experience</th>
                <th className={styles.hideDesktop}>Expertise</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t._id} className={styles.tableRow}>
                  <td>
                    <div className={styles.avatarWrap}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${t.image}`}
                        alt={t.name}
                        className={styles.avatar}
                      />
                    </div>
                  </td>
                  <td>
                    <div className={styles.nameCell}>
                      <span className={styles.teacherName}>{t.name}</span>
                      <span className={styles.teacherRoleSub}>{t.role}</span>
                    </div>
                  </td>
                  <td className={styles.hideMobile}>
                    <span className={styles.roleTag}>{t.role}</span>
                  </td>
                  <td className={styles.hideTablet}>
                    <span className={styles.yearsBadge}>{t.years}</span>
                  </td>
                  <td className={styles.hideDesktop}>
                    <div className={styles.expertiseChips}>
                      {t.expertise?.slice(0, 3).map((e, i) => (
                        <span key={i} className={styles.chip}>
                          {e}
                        </span>
                      ))}
                      {(t.expertise?.length ?? 0) > 3 && (
                        <span className={styles.chipMore}>
                          +{t.expertise.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <Link
                        href={`/admin/our-teachers/teachers/${t._id}`}
                        className={styles.editBtn}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteId(t._id)}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to remove this teacher? This cannot be
              undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

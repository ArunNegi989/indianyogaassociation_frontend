"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/our-teachers/Teacher.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface GuestTeacher {
  _id: string;
  name: string;
  image: string;
  bio: string[];
  order?: number;
}

export default function GuestTeacherListPage() {
  const [teachers, setTeachers] = useState<GuestTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/guest-teachers/get-all-guest-teachers");
      setTeachers(res.data.data || []);
    } catch {
      toast.error("Failed to load guest teachers");
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
      await api.delete(`/guest-teachers/delete-guest-teacher/${deleteId}`);
      setTeachers((prev) => prev.filter((t) => t._id !== deleteId));
      setDeleteId(null);
      toast.success("Guest teacher removed successfully");
    } catch {
      toast.error("Failed to delete guest teacher");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.loadingOm}>ॐ</div>
          <p className={styles.loadingText}>Loading guest teachers…</p>
        </div>
      </div>
    );

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Guest &amp; Visiting Teachers</h1>
          <p className={styles.pageSubtitle}>
            Manage guest teachers — appear in the ornate-frame grid with name and photo
          </p>
        </div>
        <Link
          href="/admin/our-teachers/guestteachers/add-new"
          className={styles.primaryBtn}
        >
          + Add Guest Teacher
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
          <span className={styles.statLbl}>Total Guests</span>
        </div>
      </div>

      {/* Empty State */}
      {teachers.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyOm}>ॐ</div>
          <p className={styles.emptyText}>
            No guest teachers found. Add one to get started.
          </p>
          <Link
            href="/admin/our-teachers/guestteachers/add-new"
            className={styles.emptyBtn}
          >
            + Add Guest Teacher
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
                <th>Bio Preview</th>  {/* ← hideMobile हटाया */}
                <th>Order</th>        {/* ← hideTablet हटाया */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t._id} className={styles.tableRow}>

                  {/* Photo */}
                  <td>
                    <div className={styles.avatarWrap}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${t.image}`}
                        alt={t.name}
                        className={styles.avatar}
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td>
                    <div className={styles.nameCell}>
                      <span className={styles.teacherName}>{t.name}</span>
                      <span className={styles.guestBadge}>✨ Guest</span>
                    </div>
                  </td>

                  {/* Bio Preview — सभी devices पर दिखेगा */}
                  <td>  {/* ← hideMobile हटाया */}
                    <span className={styles.teacherRoleSub}>
                      {t.bio && t.bio.length > 0
                        ? String(t.bio[0]).slice(0, 60) +
                          (String(t.bio[0]).length > 60 ? "…" : "")
                        : <em style={{ opacity: 0.4 }}>No bio added</em>
                      }
                    </span>
                  </td>

                  {/* Order — सभी devices पर दिखेगा */}
                  <td>  {/* ← hideTablet हटाया */}
                    {t.order !== undefined ? (
                      <span className={styles.yearsBadge}>#{t.order}</span>
                    ) : (
                      <span className={styles.teacherRoleSub}>—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className={styles.actionBtns}>
                      <Link
                        href={`/admin/our-teachers/guestteachers/${t._id}`}
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
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteId(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to remove this guest teacher? This cannot be undone.
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
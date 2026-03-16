"use client";

import { useState, useEffect } from "react";
import styles from "@/assets/style/Admin/dashboard/yogateachertraning/Homeabout.module.css";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface AboutSection {
  superTitle: string;
  mainTitle: string;
  stats: { value: string; label: string }[];
  yogaStyles: string[];
  ctaLink: string;
}

export default function HomeAboutPage() {
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSection = async () => {
    try {
      const res = await api.get("/home-about/get-home-about");

      if (res.data.data) {
        setAbout(res.data.data);
      } else {
        setAbout(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete("/home-about/delete-home-about");

      setAbout(null);
      setDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className={styles.page}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Home About Section</h1>
          <p className={styles.pageSubtitle}>Manage the Home About content</p>
        </div>

        <Link
          href="/admin/dashboard/yogateachertraning/add-new"
          className={`${styles.addBtn} ${about ? styles.disabledBtn : ""}`}
          onClick={(e) => {
            if (about) {
              e.preventDefault();
              toast.error(
                "Home About already exists. Edit or delete it first.",
              );
            }
          }}
        >
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add Section</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {!about && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No about section found. Add your first section.</p>
        </div>
      )}

      {about && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Super Title</th>
                <th>Main Title</th>
                <th>Stats</th>
                <th>Yoga Styles</th>
                <th>CTA Link</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{about.superTitle}</td>

                <td>{about.mainTitle}</td>

                <td>📊 {about.stats?.length || 0}</td>

                <td>🧘 {about.yogaStyles?.length || 0}</td>

                <td>{about.ctaLink}</td>

                <td>
                  <div className={styles.actionBtns}>
                   <Link
  href="/admin/dashboard/yogateachertraning/edit"
  className={styles.editBtn}
>
  ✎ Edit
</Link>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteModal(true)}
                    >
                      ✕ Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}

      {deleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>

            <h3 className={styles.modalTitle}>Confirm Deletion</h3>

            <p className={styles.modalText}>
              Are you sure you want to delete this section?
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>

              <button className={styles.modalConfirm} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

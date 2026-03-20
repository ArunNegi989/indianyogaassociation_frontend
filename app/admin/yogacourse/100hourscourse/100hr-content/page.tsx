"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "@/assets/style/Admin/yogacourse/100hourscourse/Contentmodule.module.css";

/* ══════════════════════════════
   TYPE — matches actual API response
══════════════════════════════ */
interface ContentData {
  _id: string;
  bannerImage: string;
  heroTitle: string;
  heroParagraphs: string[];
  transformTitle: string;
  transformParagraphs: string[];
  whatIsTitle: string;
  whatIsParagraphs: string[];
  whyChooseTitle: string;
  whyChooseParagraphs: string[];
  suitableTitle: string;
  suitableItems: string[];
  syllabusTitle: string;
  syllabusParagraphs: string[];
  syllabusLeft: { title: string; desc: string }[];
  syllabusRight: { title: string; desc: string }[];
  scheduleImage: string;
  scheduleItems: { time: string; label: string }[];
  soulShineText: string;
  soulShineImage: string;
  enrollTitle: string;
  enrollParagraphs: string[];
  enrollItems: string[];
  comprehensiveTitle: string;
  comprehensiveParagraphs: string[];
  certTitle: string;
  certParagraphs: string[];
  registrationTitle: string;
  registrationParagraphs: string[];
  includedItems: string[];
  notIncludedItems: string[];
  createdAt: string;
  updatedAt: string;
}

/* ── Helpers ── */
const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "").trim() ?? "";
const truncate  = (str: string, n = 60) => str.length > n ? str.slice(0, n) + "…" : str;

/* ══════════════════════════════
   COMPONENT
══════════════════════════════ */
export default function ContentListPage() {
  const router = useRouter();
  const [content, setContent]         = useState<ContentData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting]       = useState(false);

  /* ── Fetch ── */
  useEffect(() => {
    api.get("/100hr-content/get")
      .then(res => setContent(res.data.data ?? null))
      .catch(() => toast.error("Failed to fetch content"))
      .finally(() => setLoading(false));
  }, []);

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete("/100hr-content/delete");
      setContent(null);
      setDeleteModal(false);
      toast.success("Content deleted successfully");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className={styles.page}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonCard}>
        {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonField} />)}
      </div>
    </div>
  );

  /* ════════════════════════════════
     RENDER
  ════════════════════════════════ */
  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>100 Hour — Page Content</h1>
          <p className={styles.pageSubtitle}>
            Manage all content sections of the 100 Hour YTT page
          </p>
        </div>
        <Link
          href="/admin/yogacourse/100hourscourse/100hr-content/add-new"
          className={`${styles.addBtn} ${content ? styles.disabledBtn : ""}`}
          onClick={e => {
            if (content) {
              e.preventDefault();
              toast.error("Content already exists. Edit or delete it first.");
            }
          }}
        >
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add Content</span>
        </Link>
      </div>

      {/* ── Ornament ── */}
      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* ══ EMPTY STATE ══ */}
      {!content ? (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No content found. Add your first page content.</p>
          <Link href="/admin/yogacourse/100hourscourse/100hr-content/add-new" className={styles.addBtn}>
            + Add Content
          </Link>
        </div>

      ) : (
        /* ══ TABLE — same pattern as teachers ══ */
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hero Title</th>
                <th>Syllabus Modules</th>
                <th>Schedule</th>
                <th>Enrol Items</th>
                <th>Fee Items</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.row}>

                {/* Hero Title */}
                <td>
                  <div className={styles.titlePreview}>
                    <span className={styles.teacherName}>{content.heroTitle}</span>
                    <span className={styles.teacherRoleSub}>
                      {truncate(stripHtml(content.heroParagraphs?.[0] ?? ""), 50)}
                    </span>
                  </div>
                </td>

                {/* Syllabus */}
                <td className={styles.tdCenter}>
                  <span className={styles.metaChip}>L: {content.syllabusLeft?.length ?? 0}</span>
                  <span className={styles.metaChip}>R: {content.syllabusRight?.length ?? 0}</span>
                </td>

                {/* Schedule */}
                <td className={styles.tdCenter}>
                  <span className={styles.metaChip}>
                    {content.scheduleItems?.length ?? 0} slots
                  </span>
                </td>

                {/* Enrol */}
                <td className={styles.tdCenter}>
                  <span className={styles.metaChip}>
                    {content.enrollItems?.length ?? 0} items
                  </span>
                </td>

                {/* Fee */}
                <td className={styles.tdCenter}>
                  <span className={styles.metaChip}>
                    ✓ {content.includedItems?.length ?? 0}
                  </span>
                  <span className={styles.metaChipRed}>
                    ✕ {content.notIncludedItems?.length ?? 0}
                  </span>
                </td>

                {/* Updated */}
                <td className={styles.tdCenter}>
                  <span className={styles.yearsBadge}>
                    {new Date(content.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </span>
                </td>

                {/* ✅ Actions — same as teacher: ID in URL */}
                <td>
                  <div className={styles.actionBtns}>
                    <Link
                      href={`/admin/yogacourse/100hourscourse/100hr-content/${content._id}`}
                      className={styles.editBtn}
                    >
                      ✎ Edit
                    </Link>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteModal(true)}
                    >
                      ✕
                    </button>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteModal && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete all page content? This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setDeleteModal(false)}
                disabled={deleting}
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
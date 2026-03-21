"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

interface Yoga200Item {
  id: string;
  metaTitle: string;
  slug: string;
  status: "Active" | "Inactive";
  updatedAt: string;
}

export default function Yoga200ListPage() {
  const [items, setItems]             = useState<Yoga200Item[]>([]);
  const [loading, setLoading]         = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting]       = useState(false);

  const isLimitReached = items.length >= 1;

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/yoga-200hr");
        if (res.data.success) {
          setItems(res.data.data.map((d: any) => ({
            id:        d._id,
            metaTitle: d.metaTitle || "—",
            slug:      d.slug      || "—",
            status:    d.status    || "Active",
            updatedAt: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : "—",
          })));
        }
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleStatus = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === "Active" ? "Inactive" : "Active" } : i));

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      await api.delete(`/yoga-200hr/${deleteModal}`);
      setItems(prev => prev.filter(i => i.id !== deleteModal));
      setDeleteModal(null);
      toast.success("Page deleted");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonCard}>
        {[...Array(3)].map((_, i) => <div key={i} className={styles.skeletonField} />)}
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <Toaster position="bottom-right" toastOptions={{ duration: 3000, style: { background: "#1f2937", color: "#fff", borderRadius: "10px", fontSize: "14px" } }} />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>200 Hour Yoga Teacher Training</h1>
          <p className={styles.pageSubtitle}>Manage main page content · {items.length} record{items.length !== 1 ? "s" : ""}</p>
        </div>
        {isLimitReached ? (
          <button className={styles.addBtn} onClick={() => toast("Page already exists. Edit or delete it first.", { icon: "🔒", style: { background: "#1f2937", color: "#fff", borderRadius: "10px", fontSize: "14px" } })}>
            <span className={styles.addPlus}>+</span><span className={styles.addLabel}>Add Page</span>
          </button>
        ) : (
          <Link href="/admin/yogacourse/200hourscourse/200hr-content/add-new" className={styles.addBtn}>
            <span className={styles.addPlus}>+</span><span className={styles.addLabel}>Add Page</span>
          </Link>
        )}
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.tableWrap}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyOm}>ॐ</span>
            <p>No page found. Add your 200 Hour Yoga page.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th><th>Meta Title</th><th>Slug</th><th>Status</th><th>Updated</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id}>
                  <td className={styles.tdCenter}>{i + 1}</td>
                  <td><div className={styles.cellTitle}>{item.metaTitle}</div></td>
                  <td><span className={styles.metaChip}>{item.slug}</span></td>
                  <td className={styles.tdCenter}>
                    <button className={`${styles.statusBadge} ${item.status === "Active" ? styles.statusActive : styles.statusInactive}`} onClick={() => toggleStatus(item.id)}>
                      <span className={styles.statusDot} />{item.status}
                    </button>
                  </td>
                  <td>{item.updatedAt}</td>
                  <td className={styles.tdCenter}>
                    <div className={styles.actionBtns}>
                      <Link href={`/admin/dashboard/yoga-200hr/edit/${item.id}`} className={styles.editBtn}>✎ Edit</Link>
                      <button className={styles.deleteBtn} onClick={() => setDeleteModal(item.id)}>✕ Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className={styles.modalOverlay} onClick={() => !deleting && setDeleteModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>Are you sure you want to delete this page? This cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setDeleteModal(null)} disabled={deleting}>Cancel</button>
              <button className={styles.modalConfirm} onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
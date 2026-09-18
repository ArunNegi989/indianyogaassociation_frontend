"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./HowToReachAdmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface HowToReachData {
  _id: string;
  mainTitle?: string;
  badgeText?: string;
  travelCards?: any[];
  pickupHighlights?: any[];
  mapLabel?: string;
  updatedAt?: string;
}

export default function HowToReachListPage() {
  const [data, setData] = useState<HowToReachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/how-to-reach-section");
        const doc = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        setData(doc ?? null);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!data?._id) return;
    try {
      setDeleting(true);
      await api.delete(`/how-to-reach-section/${data._id}`);
      toast.success("How To Reach section deleted");
      setData(null);
      setShowDeleteModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonField} style={{ height: "60px" }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.listPageHeader}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1 className={styles.pageTitle}>How To Reach Section</h1>
          <p className={styles.pageSubtitle}>Manage travel options, pickup &amp; drop, and map for Indian Yoga Association</p>
        </div>
        {data && (
          <Link href={`/admin/how-to-reach/${data._id}`} className={styles.addNewBtn}>✎ Edit Section</Link>
        )}
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {!data ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🕉️</div>
          <h3 className={styles.emptyTitle}>No How To Reach Content Yet</h3>
          <p className={styles.emptyText}>Add travel options, pickup &amp; drop details, and the location map.</p>
          <Link href="/admin/how-to-reach/add-new" className={styles.emptyAddBtn}>+ Add How To Reach Section</Link>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            <div className={styles.previewMeta}>
              <span className={styles.previewMetaTitle}>{data.mainTitle || "How to Reach Us"}</span>
              <span className={styles.previewMetaSub}>
                {data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}` : "Not yet updated"}
              </span>
            </div>
          </div>

          <div className={styles.previewSectionsGrid}>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Travel Options</span>
              <span className={styles.previewSectionVal}>{data.travelCards?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Pickup Highlights</span>
              <span className={styles.previewSectionVal}>{data.pickupHighlights?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Map Label</span>
              <span className={styles.previewSectionVal}>{data.mapLabel || "—"}</span>
            </div>
          </div>

          <div className={styles.previewActions}>
            <Link href={`/admin/how-to-reach/${data._id}`} className={styles.addNewBtn}>✎ Edit Section</Link>
            <button type="button" className={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>🗑 Delete</button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalBackdrop} onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Delete How To Reach Section?</h3>
            <p className={styles.modalText}>This will remove all travel options, pickup &amp; drop and map content. This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</button>
              <button className={styles.modalDeleteBtn} onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting…" : "🗑 Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
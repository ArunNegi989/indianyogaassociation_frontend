"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Detoxadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface DetoxData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  mainTitle?: string;
  benefits?: any[];
  steps?: any[];
  systems?: any[];
  packages?: any[];
  updatedAt?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export default function DetoxSectionListPage() {
  const [data, setData] = useState<DetoxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/detox-retreat-section");
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
      await api.delete(`/detox-retreat-section/${data._id}`);
      toast.success("Detox Retreat section deleted");
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeletonField} style={{ height: "60px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.listPageHeader}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1 className={styles.pageTitle}>Detox Retreat Page</h1>
          <p className={styles.pageSubtitle}>Manage the "Yoga & Ayurveda Detox Retreat" page content</p>
        </div>
        {data && (
          <Link href={`/admin/dashboard/detox-retreat/${data._id}`} className={styles.addNewBtn}>
            ✎ Edit Section
          </Link>
        )}
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {!data ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🌿</div>
          <h3 className={styles.emptyTitle}>No Detox Content Yet</h3>
          <p className={styles.emptyText}>Add the hero, intro, benefits, method, massage, systems and packages.</p>
          <Link href="/admin/dashboard/detox-retreat/add-new" className={styles.emptyAddBtn}>
            + Add Detox Section
          </Link>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            {data.heroImage && (
              <img src={getImageUrl(data.heroImage)} alt={data.heroImageAlt || "Hero"} className={styles.previewHero} />
            )}
            <div className={styles.previewMeta}>
              <span className={styles.previewMetaTitle}>{data.mainTitle || "Detoxification Retreat"}</span>
              <span className={styles.previewMetaSub}>
                {data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}` : "Not yet updated"}
              </span>
            </div>
          </div>

          <div className={styles.previewSectionsGrid}>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Benefits</span>
              <span className={styles.previewSectionVal}>{data.benefits?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Steps</span>
              <span className={styles.previewSectionVal}>{data.steps?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Systems</span>
              <span className={styles.previewSectionVal}>{data.systems?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Packages</span>
              <span className={styles.previewSectionVal}>{data.packages?.length ?? 0}</span>
            </div>
          </div>

          <div className={styles.previewActions}>
            <Link href={`/admin/dashboard/detox-retreat/${data._id}`} className={styles.addNewBtn}>
              ✎ Edit Section
            </Link>
            <button type="button" className={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>
              🗑 Delete
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalBackdrop} onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Delete Detox Retreat Section?</h3>
            <p className={styles.modalText}>
              This will remove the hero, intro, benefits, method steps, massage, systems and packages. This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Cancel
              </button>
              <button className={styles.modalDeleteBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "🗑 Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Retreatadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface RetreatData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  pageTitle?: string;
  packages?: { title: string; price: string }[];
  overview?: { label: string; value: string }[];
  photoStrip?: { image?: string; label: string }[];
  s3Blocks?: any[];
  s4Blocks?: any[];
  infoBlocks?: any[];
  routes?: any[];
  updatedAt?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export default function RetreatSectionListPage() {
  const [data, setData] = useState<RetreatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/yoga-retreat-section");
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
      await api.delete(`/yoga-retreat-section/${data._id}`);
      toast.success("Yoga Retreat section deleted");
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

  const totalPackages = data?.packages?.length ?? 0;
  const totalOverview = data?.overview?.length ?? 0;
  const totalBlocks = (data?.s3Blocks?.length ?? 0) + (data?.s4Blocks?.length ?? 0);
  const totalRoutes = data?.routes?.length ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.listPageHeader}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1 className={styles.pageTitle}>Yoga Retreat Page</h1>
          <p className={styles.pageSubtitle}>Manage the "Yoga Retreat in Rishikesh" page content</p>
        </div>
        {data && (
          <Link href={`/admin/dashboard/yoga-retreat/${data._id}`} className={styles.addNewBtn}>
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
          <div className={styles.emptyIcon}>🕉️</div>
          <h3 className={styles.emptyTitle}>No Retreat Content Yet</h3>
          <p className={styles.emptyText}>Add the hero, intro, pricing, blocks, and reach info for this page.</p>
          <Link href="/admin/dashboard/yoga-retreat/add-new" className={styles.emptyAddBtn}>
            + Add Retreat Section
          </Link>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            {data.heroImage && (
              <img src={getImageUrl(data.heroImage)} alt={data.heroImageAlt || "Hero"} className={styles.previewHero} />
            )}
            <div className={styles.previewMeta}>
              <span className={styles.previewMetaTitle}>{data.pageTitle || "Yoga Retreat in Rishikesh"}</span>
              <span className={styles.previewMetaSub}>
                {data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}` : "Not yet updated"}
              </span>
            </div>
          </div>

          <div className={styles.previewSectionsGrid}>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Packages</span>
              <span className={styles.previewSectionVal}>{totalPackages}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Overview Items</span>
              <span className={styles.previewSectionVal}>{totalOverview}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Content Blocks</span>
              <span className={styles.previewSectionVal}>{totalBlocks}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Routes</span>
              <span className={styles.previewSectionVal}>{totalRoutes}</span>
            </div>
          </div>

          <div className={styles.previewActions}>
            <Link href={`/admin/dashboard/yoga-retreat/${data._id}`} className={styles.addNewBtn}>
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
            <h3 className={styles.modalTitle}>Delete Yoga Retreat Section?</h3>
            <p className={styles.modalText}>
              This will remove the hero, intro, pricing, content blocks, and reach info. This action cannot be undone.
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
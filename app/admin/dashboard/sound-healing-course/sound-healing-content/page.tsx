"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Soundhealingadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface SoundHealingData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  introTitle?: string;
  levels?: any[];
  pills?: any[];
  benCards?: any[];
  expectCards?: any[];
  instruments?: any[];
  whyCards?: any[];
  updatedAt?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export default function SoundHealingListPage() {
  const [data, setData] = useState<SoundHealingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/sound-healing-section");
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
      await api.delete(`/sound-healing-section/${data._id}`);
      toast.success("Sound Healing section deleted");
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
          <h1 className={styles.pageTitle}>Sound Healing Page</h1>
          <p className={styles.pageSubtitle}>Manage the "Sound Healing Therapy Training" page content</p>
        </div>
        {data && (
          <Link href={`/admin/dashboard/sound-healing-course/sound-healing-content/${data._id}`} className={styles.addNewBtn}>
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
          <div className={styles.emptyIcon}>🎐</div>
          <h3 className={styles.emptyTitle}>No Content Yet</h3>
          <p className={styles.emptyText}>Add the hero, intro, levels, aim, benefits and expect content.</p>
          <Link href="/admin/dashboard/sound-healing-course/sound-healing-content/add-new" className={styles.emptyAddBtn}>
            + Add Section
          </Link>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            {data.heroImage && (
              <img src={getImageUrl(data.heroImage)} alt={data.heroImageAlt || "Hero"} className={styles.previewHero} />
            )}
            <div className={styles.previewMeta}>
              <span className={styles.previewMetaTitle}>{data.introTitle || "Sound Healing"}</span>
              <span className={styles.previewMetaSub}>
                {data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}` : "Not yet updated"}
              </span>
            </div>
          </div>

          <div className={styles.previewSectionsGrid}>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Levels</span>
              <span className={styles.previewSectionVal}>{data.levels?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Pills (Aim)</span>
              <span className={styles.previewSectionVal}>{data.pills?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Benefit Cards</span>
              <span className={styles.previewSectionVal}>{data.benCards?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Expect Cards</span>
              <span className={styles.previewSectionVal}>{data.expectCards?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Instruments</span>
              <span className={styles.previewSectionVal}>{data.instruments?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Why-Join Cards</span>
              <span className={styles.previewSectionVal}>{data.whyCards?.length ?? 0}</span>
            </div>
          </div>

          <div className={styles.previewActions}>
            <Link href={`/admin/dashboard/sound-healing-course/sound-healing-content/${data._id}`} className={styles.addNewBtn}>
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
            <h3 className={styles.modalTitle}>Delete Sound Healing Section?</h3>
            <p className={styles.modalText}>
              This will remove the hero, intro, levels, aim, benefits and expect content. This action cannot be undone.
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
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Yogaashramadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface AshramData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  mainTitle?: string;
  featureImage?: string;
  quoteText?: string;
  welcomeStats?: { num: string; label: string }[];
  timelineItems?: any[];
  coursePills?: any[];
  whyCards?: any[];
  activities?: any[];
  coursesList?: any[];
  updatedAt?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export default function AshramSectionListPage() {
  const [data, setData] = useState<AshramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/yoga-ashram-section");
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
      await api.delete(`/yoga-ashram-section/${data._id}`);
      toast.success("Yoga Ashram section deleted");
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

  const totalStats = data?.welcomeStats?.length ?? 0;
  const totalTimeline = data?.timelineItems?.length ?? 0;
  const totalCourses = (data?.coursePills?.length ?? 0) + (data?.coursesList?.length ?? 0);
  const totalWhyCards = data?.whyCards?.length ?? 0;
  const totalActivities = data?.activities?.length ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.listPageHeader}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1 className={styles.pageTitle}>Yoga Ashram Page</h1>
          <p className={styles.pageSubtitle}>Manage the "Yoga Ashrams in India" page content</p>
        </div>
        {data && (
          <Link href={`/admin/dashboard/yoga-ashram/${data._id}`} className={styles.addNewBtn}>
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
          <h3 className={styles.emptyTitle}>No Ashram Content Yet</h3>
          <p className={styles.emptyText}>
            Add the hero, welcome, experience, best-home, photo, why-choose and activities info for this page.
          </p>
          <Link href="/admin/dashboard/yoga-ashram/add-new" className={styles.emptyAddBtn}>
            + Add Ashram Section
          </Link>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            {data.heroImage && (
              <img src={getImageUrl(data.heroImage)} alt={data.heroImageAlt || "Hero"} className={styles.previewHero} />
            )}
            <div className={styles.previewMeta}>
              <span className={styles.previewMetaTitle}>{data.mainTitle || "Yoga Ashrams in India"}</span>
              <span className={styles.previewMetaSub}>
                {data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}` : "Not yet updated"}
              </span>
              {data.quoteText && (
                <span className={styles.previewMetaSub} style={{ fontStyle: "italic" }}>
                  "{data.quoteText}"
                </span>
              )}
            </div>
          </div>

          <div className={styles.previewSectionsGrid}>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Welcome Stats</span>
              <span className={styles.previewSectionVal}>{totalStats}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Timeline Items</span>
              <span className={styles.previewSectionVal}>{totalTimeline}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Course Links</span>
              <span className={styles.previewSectionVal}>{totalCourses}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Why-Choose Cards</span>
              <span className={styles.previewSectionVal}>{totalWhyCards}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Activities</span>
              <span className={styles.previewSectionVal}>{totalActivities}</span>
            </div>
          </div>

          <div className={styles.previewActions}>
            <Link href={`/admin/dashboard/yoga-ashram/${data._id}`} className={styles.addNewBtn}>
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
            <h3 className={styles.modalTitle}>Delete Yoga Ashram Section?</h3>
            <p className={styles.modalText}>
              This will remove the hero, welcome, experience, best-home, photo, why-choose and activities info. This
              action cannot be undone.
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
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Innerawakeningadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface InnerAwakeningData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  mainTitle?: string;
  heroStats?: { value: string; label: string }[];
  insightCards?: { number: string; title: string; text: string }[];
  points?: any[];
  morningItems?: any[];
  eveningItems?: any[];
  galleryImages?: any[];
  terms?: any[];
  participantList?: any[];
  includedItems?: any[];
  updatedAt?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export default function InnerAwakeningListPage() {
  const [data, setData] = useState<InnerAwakeningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/inner-awakening-section");
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
      await api.delete(`/inner-awakening-section/${data._id}`);
      toast.success("Inner Awakening section deleted");
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

  const totalStats = data?.heroStats?.length ?? 0;
  const totalInsights = data?.insightCards?.length ?? 0;
  const totalPoints = data?.points?.length ?? 0;
  const totalScheduleItems = (data?.morningItems?.length ?? 0) + (data?.eveningItems?.length ?? 0);
  const totalGallery = data?.galleryImages?.length ?? 0;
  const totalTerms = data?.terms?.length ?? 0;
  const totalParticipant = data?.participantList?.length ?? 0;
  const totalIncluded = data?.includedItems?.length ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.listPageHeader}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1 className={styles.pageTitle}>Inner Awakening Page</h1>
          <p className={styles.pageSubtitle}>Manage the "Inner Transformation Retreat" page content</p>
        </div>
        {data && (
          <Link href={`/admin/dashboard/inner-awakening/${data._id}`} className={styles.addNewBtn}>
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
          <h3 className={styles.emptyTitle}>No Inner Awakening Content Yet</h3>
          <p className={styles.emptyText}>
            Add the hero, guru intro, schedule, gallery, key concepts and fee details for this page.
          </p>
          <Link href="/admin/dashboard/inner-awakening/add-new" className={styles.emptyAddBtn}>
            + Add Inner Awakening Section
          </Link>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            {data.heroImage && (
              <img
                src={getImageUrl(data.heroImage)}
                alt={data.heroImageAlt || "Hero"}
                className={styles.previewHero}
              />
            )}
            <div className={styles.previewMeta}>
              <span className={styles.previewMetaTitle}>{data.mainTitle || "Inner Transformation Retreat"}</span>
              <span className={styles.previewMetaSub}>
                {data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}` : "Not yet updated"}
              </span>
            </div>
          </div>

          <div className={styles.previewSectionsGrid}>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Hero Stats</span>
              <span className={styles.previewSectionVal}>{totalStats}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Insight Cards</span>
              <span className={styles.previewSectionVal}>{totalInsights}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>7 Points</span>
              <span className={styles.previewSectionVal}>{totalPoints}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Schedule Items</span>
              <span className={styles.previewSectionVal}>{totalScheduleItems}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Gallery Images</span>
              <span className={styles.previewSectionVal}>{totalGallery}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Key Concepts</span>
              <span className={styles.previewSectionVal}>{totalTerms}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Participant Points</span>
              <span className={styles.previewSectionVal}>{totalParticipant}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Included Items</span>
              <span className={styles.previewSectionVal}>{totalIncluded}</span>
            </div>
          </div>

          <div className={styles.previewActions}>
            <Link href={`/admin/dashboard/inner-awakening/${data._id}`} className={styles.addNewBtn}>
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
            <h3 className={styles.modalTitle}>Delete Inner Awakening Section?</h3>
            <p className={styles.modalText}>
              This will remove the hero, guru intro, schedule, gallery, key concepts and fee info. This action
              cannot be undone.
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
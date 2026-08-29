"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Accreditationadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface AccreditationData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  mainTitle?: string;
  accreditationCards?: any[];
  galleryImages?: string[];
  rysImages?: any[];
  certs?: any[];
  iyfFooterNotes?: string[];
  updatedAt?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export default function AccreditationSectionListPage() {
  const [data, setData] = useState<AccreditationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/affiliation");
        // Singleton: backend returns either a single object or an array with 0/1 item
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
      await api.delete(`/affiliation/${data._id}`);
      toast.success("Accreditation section deleted");
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
          <h1 className={styles.pageTitle}>Accreditation Section</h1>
          <p className={styles.pageSubtitle}>
            Manage the "Registered Yoga School in Rishikesh" accreditations page
          </p>
        </div>
        {data && (
          <Link href={`/admin/dashboard/Affiliation/${data._id}`} className={styles.addNewBtn}>
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
          <h3 className={styles.emptyTitle}>No Accreditation Content Yet</h3>
          <p className={styles.emptyText}>
            Add the hero image, cards, gallery, certifications and other content for this page.
          </p>
          <Link href="/admin/dashboard/Affiliation/add-new" className={styles.emptyAddBtn}>
            + Add Accreditation Section
          </Link>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            {data.heroImage && (
              <img src={getImageUrl(data.heroImage)} alt={data.heroImageAlt || "Hero"} className={styles.previewHero} />
            )}
            <div className={styles.previewMeta}>
              <span className={styles.previewMetaTitle}>{data.mainTitle || "Registered Yoga School in Rishikesh"}</span>
              <span className={styles.previewMetaSub}>
                {data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}` : "Not yet updated"}
              </span>
            </div>
          </div>

          <div className={styles.previewSectionsGrid}>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Why Choose Cards</span>
              <span className={styles.previewSectionVal}>{data.accreditationCards?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Gallery Images</span>
              <span className={styles.previewSectionVal}>{data.galleryImages?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>RYS Logos</span>
              <span className={styles.previewSectionVal}>{data.rysImages?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>Certifications</span>
              <span className={styles.previewSectionVal}>{data.certs?.length ?? 0}</span>
            </div>
            <div className={styles.previewSectionTile}>
              <span className={styles.previewSectionLabel}>IYF Footer Notes</span>
              <span className={styles.previewSectionVal}>{data.iyfFooterNotes?.length ?? 0}</span>
            </div>
          </div>

          <div className={styles.previewActions}>
            <Link href={`/admin/dashboard/Affiliation/${data._id}`} className={styles.addNewBtn}>
              ✎ Edit Section
            </Link>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => setShowDeleteModal(true)}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalBackdrop} onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Delete Accreditation Section?</h3>
            <p className={styles.modalText}>
              This will remove all hero, cards, gallery, certification and IYF content. This action cannot be undone.
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
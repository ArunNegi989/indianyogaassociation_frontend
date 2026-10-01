"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/assets/style/Admin/our-teachers/Founder.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Founder {
  _id: string;
  name: string;
  subtitle: string;
  sectionLabel: string;
  estYear: string;
  image: string;
  bio: string[];
  ctaText: string;
}

export default function FounderListPage() {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [founder, setFounder] = useState<Founder | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchFounder = async () => {
    try {
      const res = await api.get("/founder/get-founder");
      setFounder(res.data.data || null);
    } catch {
      setFounder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFounder();
  }, []);
  const handleDelete = async () => {
    if (deleting) return;

    try {
      setDeleting(true);

      if (!founder?._id) return;

      await api.delete(`/founder/delete-founder/${founder._id}`);

      setFounder(null);
      setDeleteModal(false);
      toast.success("Founder section deleted successfully");
    } catch {
      toast.error("Failed to delete founder");
    } finally {
      setDeleting(false);
    }
  };

  /* ── Loading ── */
  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.loadingOm}>ॐ</div>
          <p className={styles.loadingText}>Loading founder data…</p>
        </div>
      </div>
    );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Founder &amp; Director</h1>
          <p className={styles.pageSubtitle}>
            Manage the Founder section displayed on the Teachers page
          </p>
        </div>
        <Link
          href="/admin/our-teachers/founder/add-new"
          className={`${styles.primaryBtn} ${founder ? styles.primaryBtnDisabled : ""}`}
          onClick={(e) => {
            if (founder) {
              e.preventDefault();
              toast.error(
                "Founder already exists. Please edit or delete first.",
              );
            }
          }}
        >
          + Add Founder
        </Link>
      </div>

      {/* Ornament */}
      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* Empty State */}
      {!founder && (
        <div className={styles.empty}>
          <div className={styles.emptyOm}>ॐ</div>
          <p className={styles.emptyText}>
            No founder section found. Add one to display it on the Teachers
            page.
          </p>
          <Link href="/admin/our-teachers/founder" className={styles.emptyBtn}>
            + Add Founder
          </Link>
        </div>
      )}

      {/* Founder Preview Card */}
      {founder && (
        <div className={styles.founderCard}>
          {/* Left — Photo */}
          <div className={styles.founderPhotoCol}>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${founder.image}`}
              alt={founder.name}
              className={styles.founderPhoto}
            />
            <div className={styles.founderEstBadge}>
              {founder.estYear || "Est. 2005"}
            </div>
          </div>

          {/* Right — Info */}
          <div className={styles.founderBody}>
            <div className={styles.founderSectionTag}>
              {founder.sectionLabel || "Founder & Director"}
            </div>
            <h2 className={styles.founderName}>{founder.name}</h2>
            <p className={styles.founderSubtitle}>{founder.subtitle}</p>

            <div className={styles.founderMetaRow}>
              <span className={styles.founderMetaChip}>
                📝 {founder.bio?.length || 0} Bio Paragraphs
              </span>
              {founder.ctaText && (
                <span className={styles.founderMetaChip}>
                  🔗 CTA: "{founder.ctaText.slice(0, 40)}
                  {founder.ctaText.length > 40 ? "…" : ""}"
                </span>
              )}
            </div>

            <div className={styles.founderBioPreview}>
              {founder.bio?.[0]?.slice(0, 200)}
              {(founder.bio?.[0]?.length ?? 0) > 200 ? "…" : ""}
            </div>

            <div className={styles.founderCardActions}>
              <Link
                href={`/admin/our-teachers/founder/${founder._id}`}
                className={styles.editBtn}
              >
                ✎ Edit Founder
              </Link>
              <button
                className={styles.deleteBtn}
                onClick={() => setDeleteModal(true)}
              >
                ✕ Delete
              </button>
            </div>
          </div>
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
              Are you sure you want to delete the entire Founder section? This
              action cannot be undone.
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

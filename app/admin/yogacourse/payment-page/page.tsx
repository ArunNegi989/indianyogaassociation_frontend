"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Paymentadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface PaymentData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  mainTitle?: string;
  paypalOptions?: any[];
  cards?: any[];
  banks?: any[];
  arrivalMethods?: any[];
  policies?: any[];
  updatedAt?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export default function PaymentSectionListPage() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/payment-section");
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
      await api.delete(`/payment-section/${data._id}`);
      toast.success("Payment section deleted");
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

  const tiles = [
    { label: "PayPal Options", val: data?.paypalOptions?.length ?? 0 },
    { label: "Card Options", val: data?.cards?.length ?? 0 },
    { label: "Bank Accounts", val: data?.banks?.length ?? 0 },
    { label: "Arrival Methods", val: data?.arrivalMethods?.length ?? 0 },
    { label: "Policies", val: data?.policies?.length ?? 0 },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.listPageHeader}>
        <div className={styles.pageHeader} style={{ marginBottom: 0 }}>
          <h1 className={styles.pageTitle}>Payment Section</h1>
          <p className={styles.pageSubtitle}>Manage the "Yoga Teacher Training — Payment Options" page</p>
        </div>
        {data && (
          <Link href={`/admin/yogacourse/payment-page/${data._id}`} className={styles.addNewBtn}>
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
          <div className={styles.emptyIcon}>💳</div>
          <h3 className={styles.emptyTitle}>No Payment Content Yet</h3>
          <p className={styles.emptyText}>Add hero, fees, PayPal, UPI, cards, bank details, arrival payment and policies.</p>
          <Link href="/admin/yogacourse/payment-page/add-new" className={styles.emptyAddBtn}>
            + Add Payment Section
          </Link>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <div className={styles.previewTop}>
            {data.heroImage && (
              <img src={getImageUrl(data.heroImage)} alt={data.heroImageAlt || "Hero"} className={styles.previewHero} />
            )}
            <div className={styles.previewMeta}>
              <span className={styles.previewMetaTitle}>{data.mainTitle || "Payment Options"}</span>
              <span className={styles.previewMetaSub}>
                {data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleString()}` : "Not yet updated"}
              </span>
            </div>
          </div>

          <div className={styles.previewSectionsGrid}>
            {tiles.map((t) => (
              <div key={t.label} className={styles.previewSectionTile}>
                <span className={styles.previewSectionLabel}>{t.label}</span>
                <span className={styles.previewSectionVal}>{t.val}</span>
              </div>
            ))}
          </div>

          <div className={styles.previewActions}>
            <Link href={`/admin/yogacourse/payment-page/${data._id}`} className={styles.addNewBtn}>
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
            <h3 className={styles.modalTitle}>Delete Payment Section?</h3>
            <p className={styles.modalText}>
              This will remove all payment options, QR images, bank details and policies. This action cannot be undone.
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
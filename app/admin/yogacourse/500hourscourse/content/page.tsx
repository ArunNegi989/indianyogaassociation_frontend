"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// ✅ Same CSS file as the form page
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface Page500hr {
  _id: string;
  slug: string;
  status: "Active" | "Inactive";
  pageMainH1: string;
  heroImage?: string;
  createdAt: string;
  updatedAt: string;
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─────────────────────────────────────────
   DELETE MODAL
───────────────────────────────────────── */
function DeleteModal({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalOm}>ॐ</div>
        <h3 className={styles.modalTitle}>Delete Page?</h3>
        <p className={styles.modalText}>
          Are you sure you want to delete <strong>"{title}"</strong>? This
          action cannot be undone.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalCancel} onClick={onCancel}>
            Cancel
          </button>
          {/* Using modalConfirm instead of modalDelete — matches Yoga500hr.module.css */}
          <button className={styles.modalConfirm} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STATS BAR
───────────────────────────────────────── */
function StatsBar({ pages }: { pages: Page500hr[] }) {
  const active = pages.filter((p) => p.status === "Active").length;
  const inactive = pages.filter((p) => p.status === "Inactive").length;

  const chips = [
    { num: pages.length, label: "Total Pages" },
    { num: active, label: "Active" },
    { num: inactive, label: "Inactive" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      {chips.map((c) => (
        <div
          key={c.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0.6rem 1.2rem",
            background: "rgba(224,123,0,0.06)",
            border: "1px solid rgba(224,123,0,0.2)",
            borderRadius: "10px",
            minWidth: "80px",
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#5c2d00",
              lineHeight: 1,
            }}
          >
            {c.num}
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.78rem",
              color: "#a07840",
              fontStyle: "italic",
              marginTop: "0.2rem",
            }}
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE CARD
───────────────────────────────────────── */
function PageCard({
  page,
  onEdit,
  onToggle,
  onDelete,
  isDeleting,
}: {
  page: Page500hr;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const isActive = page.status === "Active";

  return (
    <div className={styles.nestedCard} style={{ marginBottom: 0 }}>
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "160px",
          overflow: "hidden",
          borderBottom: "1px solid #e8d5b5",
          background: "#fdf7ee",
          flexShrink: 0,
        }}
      >
        {page.heroImage ? (
          <img
            src={BASE_URL + page.heroImage}
            alt={page.pageMainH1}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "2.5rem",
                color: "rgba(224,123,0,0.2)",
              }}
            >
              ॐ
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.78rem",
                color: "rgba(160,120,64,0.5)",
                fontStyle: "italic",
              }}
            >
              No Image
            </span>
          </div>
        )}

        {/* Status Badge over image */}
        <span
          className={`${styles.statusBadge} ${
            isActive ? styles.statusActive : styles.statusInactive
          }`}
          style={{ position: "absolute", top: "0.55rem", right: "0.55rem" }}
        >
          <span className={styles.statusDot} />
          {page.status}
        </span>
      </div>

      {/* Body */}
      <div className={styles.nestedCardBody}>
        <h3
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#3d1d00",
            margin: "0 0 0.3rem",
            letterSpacing: "0.04em",
            lineHeight: 1.4,
          }}
        >
          {page.pageMainH1 || "Untitled"}
        </h3>

        <span
          className={styles.slugBadge}
          style={{ marginBottom: "0.75rem", display: "inline-block" }}
        >
          /{page.slug}
        </span>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexDirection: "column",
            marginTop: "0.2rem",
          }}
        >
          <span className={styles.dateText}>
            Created: {formatDate(page.createdAt)}
          </span>
          <span className={styles.dateText}>
            Updated: {formatDate(page.updatedAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div
        className={styles.nestedCardHeader}
        style={{
          borderTop: "1px solid #e8d5b5",
          borderBottom: "none",
          justifyContent: "flex-start",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <button className={styles.editBtn} onClick={onEdit}>
          ✎ Edit
        </button>

        <button
          className={`${styles.statusBadge} ${
            isActive ? styles.statusInactive : styles.statusActive
          }`}
          onClick={onToggle}
          style={{
            cursor: "pointer",
            border: "1px solid",
            fontFamily: "'Cinzel', serif",
          }}
        >
          {isActive ? "⏸ Deactivate" : "▶ Activate"}
        </button>

        <button
          className={styles.deleteBtn}
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "…" : "✕ Delete"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN LIST PAGE
───────────────────────────────────────── */
export default function Yoga500hrList() {
  const router = useRouter();
  const [pages, setPages] = useState<Page500hr[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Page500hr | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ── Fetch ── */
  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/yoga-500hr/content");

      setPages(res.data.data ? [res.data.data] : []);
    } catch {
      toast.error("Failed to load 500hr pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    try {
      await api.delete(`/yoga-500hr/content/${deleteTarget._id}`);
      toast.success("Page deleted successfully");
      setPages((p) => p.filter((x) => x._id !== deleteTarget._id));
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  /* ── Toggle Status ── */
  const toggleStatus = async (page: Page500hr) => {
    const newStatus = page.status === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/yoga-500hr/content/update/${page._id}`, {
        status: newStatus,
      });

      setPages((p) =>
        p.map((x) => (x._id === page._id ? { ...x, status: newStatus } : x)),
      );
      toast.success(`Status changed to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ── Loading ── */
  if (loading)
    return (
      <div className={styles.loadingWrap}>
        <span className={styles.spinner} />
        <span>Loading 500hr pages…</span>
      </div>
    );

  return (
    <div className={styles.listPage}>
      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.pageMainH1}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>500 Hour Yoga TTC</h1>
          <p className={styles.pageSubtitle}>
            Manage page content ·{" "}
            <strong>
              {pages.length} record{pages.length !== 1 ? "s" : ""}
            </strong>
          </p>
        </div>
        <button
  className={styles.addBtn}
  onClick={async () => {
    try {
      const res = await api.get("/yoga-500hr/content");

      if (res.data.data?._id) {
        // 🔥 already exists → show toast
        toast.error("Only one page allowed. Please edit existing page.");
      } else {
        // ✅ allow navigation
        router.push("/admin/yogacourse/500hourscourse/content/add-new");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }}
>
  <span className={styles.addPlus}>＋</span>
  <span className={styles.addLabel}>Add New Page</span>
</button>
      </div>

      {/* ── Ornament ── */}
      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* ── Stats ── */}
      <StatsBar pages={pages} />

      {/* ── Empty State ── */}
      {pages.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyOm}>ॐ</span>
          <p className={styles.emptyText}>No pages created yet.</p>
          <Link
            href="/admin/yogacourse/500hourscourse/content/add-new"
            className={styles.addBtn}
            style={{ marginTop: "1rem" }}
          >
            ＋ Create First Page
          </Link>
        </div>
      )}

      {/* ── Cards Grid ── */}
      {pages.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {pages.map((page) => (
            <PageCard
              key={page._id}
              page={page}
              onEdit={() =>
                router.push(
                  `/admin/yogacourse/500hourscourse/content/${page._id}`,
                )
              }
              onToggle={() => toggleStatus(page)}
              onDelete={() => setDeleteTarget(page)}
              isDeleting={deletingId === page._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

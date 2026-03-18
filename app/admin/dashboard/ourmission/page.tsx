"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/ourmission/Ourmission.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

/* ── Types ── */
interface ContentBlock {
  heading:     string;
  seoTagline?: string;
  leadBold?:   string;
  paragraphs:  string[];
}

interface MissionRecord {
  _id:          string;
  missionBlock: ContentBlock;
  whyBlock:     ContentBlock;
  createdAt:    string;
}

/* ── Breakpoint hook ── */
function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return { isMobile: width < 480, isTablet: width >= 480 && width < 768, width };
}

/* ── Helper — strip HTML & truncate ── */
const stripHtml = (html: string, max = 90) => {
  const text = (html ?? "").replace(/<[^>]*>/g, "").trim();
  return text.length > max ? text.slice(0, max) + "…" : text;
};

/* ═══════════════════════════════════════════
   Page Component
═══════════════════════════════════════════ */
export default function OurMissionListPage() {
  const [records,     setRecords]     = useState<MissionRecord[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [isDeleting,  setIsDeleting]  = useState(false);
  const { isMobile, isTablet, width } = useBreakpoint();

  /* ── Fetch ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/our-mission/get-our-mission");
        setRecords(res.data.data ?? []);
      } catch (err) {
        toast.error("Failed to load mission content");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setIsDeleting(true);
      await api.delete(`/our-mission/delete-our-mission/${deleteModal}`);
      setRecords((prev) => prev.filter((r) => r._id !== deleteModal));
      toast.success("Record deleted successfully");
      setDeleteModal(null);
    } catch (err) {
      toast.error("Failed to delete record");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ── Actions ── */
  const Actions = ({ id }: { id: string }) => (
    <div className={styles.actionBtns}>
      <Link href={`ourmission/${id}`} className={styles.editBtn}>
        <span>✎</span>
        <span className={styles.btnLabel}> Edit</span>
      </Link>
      <button
        className={styles.deleteBtn}
        onClick={() => setDeleteModal(id)}
      >
        <span>✕</span>
        <span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  /* ── Loading screen ── */
  if (isLoading) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <p className={styles.successText}>Loading…</p>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────
     MOBILE CARDS
  ────────────────────────────────────────── */
  const MobileCards = () => (
    <div className={styles.cardList}>
      {records.map((r) => (
        <div key={r._id} className={styles.card}>

          {/* ── Our Mission block ── */}
          <div className={styles.cardHeader}>
            <div className={styles.cardBody}>
              <p className={styles.blockLabel}>Our Mission Block</p>
              <p className={styles.sectionHeading}>{r.missionBlock.heading}</p>
              {r.missionBlock.seoTagline && (
                <p className={styles.paraPreview}>
                  🔖 {r.missionBlock.seoTagline}
                </p>
              )}
              <p className={styles.paraPreview}>
                {stripHtml(r.missionBlock.paragraphs[0] ?? "")}
              </p>
              <div className={styles.cardMeta}>
                <span className={styles.metaChip}>
                  📝 {r.missionBlock.paragraphs.length} Para
                </span>
              </div>
            </div>
          </div>

          {/* ── Why YTTC block ── */}
          <div className={styles.cardHeader} style={{ borderTop: "1px solid #e8d9c0", paddingTop: "0.75rem" }}>
            <div className={styles.cardBody}>
              <p className={styles.blockLabel}>Why YTTC Block</p>
              <p className={styles.sectionHeading}>{r.whyBlock.heading}</p>
              {r.whyBlock.leadBold && (
                <span className={styles.leadBoldPreview}>
                  {r.whyBlock.leadBold}
                </span>
              )}
              <p className={styles.paraPreview}>
                {stripHtml(r.whyBlock.paragraphs[0] ?? "")}
              </p>
              <div className={styles.cardMeta}>
                <span className={styles.metaChip}>
                  📝 {r.whyBlock.paragraphs.length} Para
                </span>
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <Actions id={r._id} />
          </div>
        </div>
      ))}
    </div>
  );

  /* ──────────────────────────────────────────
     TABLET TABLE
  ────────────────────────────────────────── */
  const TabletTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Our Mission Block</th>
            <th>Why YTTC Block</th>
            <th style={{ width: 130 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r._id} className={styles.row}>
              <td className={styles.tdCenter}>
                <span className={styles.orderBadge}>{i + 1}</span>
              </td>

              {/* Mission block cell */}
              <td>
                <p className={styles.blockLabel}>Mission Block</p>
                <p className={styles.sectionHeading}>{r.missionBlock.heading}</p>
                {r.missionBlock.seoTagline && (
                  <p className={styles.paraPreview}>
                    🔖 {r.missionBlock.seoTagline}
                  </p>
                )}
                <p className={styles.paraPreview}>
                  {stripHtml(r.missionBlock.paragraphs[0] ?? "")}
                </p>
                <span className={styles.metaChip}>
                  📝 {r.missionBlock.paragraphs.length} Para
                </span>
              </td>

              {/* Why block cell */}
              <td>
                <p className={styles.blockLabel}>Why YTTC Block</p>
                <p className={styles.sectionHeading}>{r.whyBlock.heading}</p>
                {r.whyBlock.leadBold && (
                  <span className={styles.leadBoldPreview}>
                    {r.whyBlock.leadBold}
                  </span>
                )}
                <p className={styles.paraPreview}>
                  {stripHtml(r.whyBlock.paragraphs[0] ?? "")}
                </p>
                <span className={styles.metaChip}>
                  📝 {r.whyBlock.paragraphs.length} Para
                </span>
              </td>

              <td className={styles.tdCenter}>
                <Actions id={r._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ──────────────────────────────────────────
     DESKTOP TABLE
  ────────────────────────────────────────── */
  const DesktopTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 52 }}>#</th>
            <th>Our Mission Block</th>
            {width >= 1024 && <th>Mission Preview</th>}
            <th>Why YTTC Block</th>
            {width >= 1024 && <th>Why Preview</th>}
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r._id} className={styles.row}>
              <td className={styles.tdCenter}>
                <span className={styles.orderBadge}>{i + 1}</span>
              </td>

              {/* Mission heading + meta */}
              <td>
                <p className={styles.sectionHeading}>{r.missionBlock.heading}</p>
                {r.missionBlock.seoTagline && (
                  <p className={styles.paraPreview}>
                    🔖 {r.missionBlock.seoTagline}
                  </p>
                )}
                <span className={styles.metaChip}>
                  📝 {r.missionBlock.paragraphs.length} Para
                </span>
              </td>

              {/* Mission content preview */}
              {width >= 1024 && (
                <td>
                  <p className={styles.paraPreview}>
                    {stripHtml(r.missionBlock.paragraphs[0] ?? "")}
                  </p>
                </td>
              )}

              {/* Why heading + meta */}
              <td>
                <p className={styles.sectionHeading}>{r.whyBlock.heading}</p>
                {r.whyBlock.leadBold && (
                  <span className={styles.leadBoldPreview}>
                    {r.whyBlock.leadBold}
                  </span>
                )}
                <span className={styles.metaChip}>
                  📝 {r.whyBlock.paragraphs.length} Para
                </span>
              </td>

              {/* Why content preview */}
              {width >= 1024 && (
                <td>
                  <p className={styles.paraPreview}>
                    {stripHtml(r.whyBlock.paragraphs[0] ?? "")}
                  </p>
                </td>
              )}

              <td className={styles.tdCenter}>
                <Actions id={r._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── Render ── */
  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Our Mission Section</h1>
          <p className={styles.pageSubtitle}>
            {isMobile
              ? "Each record contains both Mission & Why YTTC blocks"
              : "Each row contains both Mission Block and Why YTTC Block"}
          </p>
        </div>

        {/* Add button — only show if no record exists yet */}
        {records.length === 0 && (
          <Link
            href="/admin/dashboard/ourmission/add-new"
            className={styles.addBtn}
          >
            <span className={styles.addPlus}>+</span>
            <span className={styles.addLabel}>Add Content</span>
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

      {/* Responsive views */}
      {records.length > 0 ? (
        <>
          {isMobile               && <MobileCards />}
          {isTablet               && <TabletTable />}
          {!isMobile && !isTablet && <DesktopTable />}
        </>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No mission content found. Add your first record.</p>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal !== null && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteModal(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this record? Both the Mission Block
              and Why YTTC Block will be permanently removed.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setDeleteModal(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
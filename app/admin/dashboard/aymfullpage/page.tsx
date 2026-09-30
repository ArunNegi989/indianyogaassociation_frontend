"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import styles from "@/assets/style/Admin/dashboard/aymfullpage/AymFullPage.module.css";
import tableStyles from "@/assets/style/Admin/dashboard/aymfullpage/Aymfullpagetable.module.css";
import api from "@/lib/api";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface PageRecord {
  id: string;
  alignTitle: string;
  campusTitle: string;
  ctaHeading: string;
  facilities: number;
  journeyParas: number;
  bodyPlanes: number;
  promoCard1: string;
  promoCard2: string;
  bodyPlanesImageUrl: string;
  outdoorImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface SearchForm { query: string; }

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const truncate = (s: string, n = 48) => (s.length > n ? s.slice(0, n) + "…" : s);

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const toAbsUrl = (path: string | undefined | null): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE}${path}`;
};

/* ══════════════════════════════════════════════
   LIST PAGE
══════════════════════════════════════════════ */
export default function AYMFullPageListPage() {
  const [records, setRecords] = useState<PageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, watch, resetField } = useForm<SearchForm>({
    defaultValues: { query: "" },
  });
  const search = watch("query");

  /* ══════════════════════════════════════════════
     FETCH → GET /aym-full-page/get
  ══════════════════════════════════════════════ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/aym-full-page/get");
        const raw = res.data.data;

        if (!raw) { setRecords([]); return; }

        const record: PageRecord = {
          id: raw._id,
          alignTitle: stripHtml(raw.alignTitle ?? ""),
          campusTitle: stripHtml(raw.campusTitle ?? ""),
          ctaHeading: stripHtml(raw.ctaHeading ?? ""),
          facilities: Array.isArray(raw.campusFacilities) ? raw.campusFacilities.length : 0,
          journeyParas: Array.isArray(raw.journeyParas) ? raw.journeyParas.length : 0,
          bodyPlanes: Array.isArray(raw.bodyPlanes) ? raw.bodyPlanes.length : 0,
          promoCard1: stripHtml(raw.promoCard1?.title ?? ""),
          promoCard2: stripHtml(raw.promoCard2?.title ?? ""),
          bodyPlanesImageUrl: toAbsUrl(raw.bodyPlanesImage),   // ✅ full URL
          outdoorImageUrl: toAbsUrl(raw.outdoorImage),       // ✅ full URL
          createdAt: raw.createdAt ?? new Date().toISOString(),
          updatedAt: raw.updatedAt ?? new Date().toISOString(),
        };

        setRecords([record]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load page data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ══════════════════════════════════════════════
     ADD NEW — toast if record already exists
  ══════════════════════════════════════════════ */
  const handleAddNew = () => {
    toast.error("Only one record allowed. Please edit the existing one.", {
      icon: "⚠️",
      duration: 3500,
    });
  };

  /* ══════════════════════════════════════════════
     DELETE → DELETE /aym-full-page/delete
  ══════════════════════════════════════════════ */
  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setIsDeleting(true);
      await api.delete("/aym-full-page/delete");
      setRecords([]);
      toast.success("Record deleted successfully.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete.");
    } finally {
      setIsDeleting(false);
      setDeleteModal(null);
    }
  };

  /* ── Filtered list ── */
  const filtered = records.filter((r) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      r.alignTitle.toLowerCase().includes(q) ||
      r.campusTitle.toLowerCase().includes(q) ||
      r.ctaHeading.toLowerCase().includes(q)
    );
  });

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />

      <div className={styles.page}>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>AYM Full Page</h1>
            <p className={styles.pageSubtitle}>
              Manage all content of the AYM Full page — Alignment · Campus Facilities · CTA
            </p>
          </div>

          {!isLoading && records.length === 0 ? (
            <Link href="/admin/dashboard/aymfullpage/add-new" className={styles.addBtn}>
              <span className={styles.addPlus}>+</span>
              <span className={styles.addLabel}>Add New</span>
            </Link>
          ) : (
            <button type="button" className={styles.addBtn} onClick={handleAddNew}>
              <span className={styles.addPlus}>+</span>
              <span className={styles.addLabel}>Add New</span>
            </button>
          )}
        </div>

        <div className={styles.ornament}>
          <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span>
          <div className={styles.ornamentLine} /><span>❧</span>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className={styles.loadingScreen}>
            <div className={styles.loadingOm}>ॐ</div>
            <p className={styles.loadingText}>Loading page content…</p>
          </div>
        ) : (
          <>
            {/* ── Search Row ── */}
            {records.length > 0 && (
              <div className={tableStyles.filtersRow}>
                <div className={tableStyles.searchWrap}>
                  <span className={tableStyles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    className={tableStyles.searchInput}
                    placeholder="Search by title, heading…"
                    {...register("query")}
                  />
                  {search && (
                    <button
                      type="button"
                      className={tableStyles.searchClear}
                      onClick={() => resetField("query")}
                    >✕</button>
                  )}
                </div>
                <span className={tableStyles.resultCount}>
                  {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* ── Table ── */}
            {filtered.length > 0 ? (
              <div className={tableStyles.tableWrap}>
                <table className={tableStyles.table}>
                  <thead>
                    <tr>
                      <th className={tableStyles.th} style={{ width: "2.5rem" }}>#</th>
                      <th className={tableStyles.th}>Alignment Title</th>
                      <th className={tableStyles.th}>Campus Title</th>
                      <th className={tableStyles.th}>CTA Heading</th>
                      <th className={tableStyles.th} style={{ width: "6rem" }}>Facilities</th>
                      <th className={tableStyles.th} style={{ width: "6rem" }}>Planes</th>
                      <th className={tableStyles.th} style={{ width: "6.5rem" }}>Journey §</th>
                      <th className={tableStyles.th}>Promo Card 1</th>
                      <th className={tableStyles.th}>Promo Card 2</th>
                      <th className={tableStyles.th} style={{ width: "5.5rem" }}>Images</th>
                      <th className={tableStyles.th} style={{ width: "6.5rem" }}>Created</th>
                      <th className={tableStyles.th} style={{ width: "6.5rem" }}>Updated</th>
                      <th className={tableStyles.th} style={{ width: "8rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx) => (
                      <tr
                        key={r.id}
                        className={`${tableStyles.tr} ${idx % 2 === 0 ? tableStyles.trEven : ""}`}
                      >
                        <td className={tableStyles.td}>
                          <span className={tableStyles.indexBadge}>{idx + 1}</span>
                        </td>

                        <td className={tableStyles.td}>
                          <span className={tableStyles.cellTitle} title={r.alignTitle}>
                            {truncate(r.alignTitle, 52)}
                          </span>
                        </td>

                        <td className={tableStyles.td}>
                          <span className={tableStyles.cellSubtitle} title={r.campusTitle}>
                            {truncate(r.campusTitle, 40)}
                          </span>
                        </td>

                        <td className={tableStyles.td}>
                          <span className={tableStyles.cellSubtitle} title={r.ctaHeading}>
                            {truncate(r.ctaHeading, 36)}
                          </span>
                        </td>

                        <td className={tableStyles.td} style={{ textAlign: "center" }}>
                          <span className={tableStyles.countBadge}>{r.facilities}</span>
                        </td>

                        <td className={tableStyles.td} style={{ textAlign: "center" }}>
                          <span className={tableStyles.countBadge}>{r.bodyPlanes}</span>
                        </td>

                        <td className={tableStyles.td} style={{ textAlign: "center" }}>
                          <span className={tableStyles.countBadge}>{r.journeyParas}</span>
                        </td>

                        <td className={tableStyles.td}>
                          <span className={tableStyles.promoBadge} title={r.promoCard1}>
                            {truncate(r.promoCard1, 30)}
                          </span>
                        </td>

                        <td className={tableStyles.td}>
                          <span className={tableStyles.promoBadge} title={r.promoCard2}>
                            {truncate(r.promoCard2, 30)}
                          </span>
                        </td>

                        <td className={tableStyles.td}>
                          <div className={tableStyles.imageThumbs}>
                            {r.bodyPlanesImageUrl && (
                              <div className={tableStyles.thumbWrap} title="Body Planes Diagram">
                                <img
                                  src={r.bodyPlanesImageUrl} alt="Body planes"
                                  className={tableStyles.thumb}
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                                <span className={tableStyles.thumbLabel}>Diagram</span>
                              </div>
                            )}
                            {r.outdoorImageUrl && (
                              <div className={tableStyles.thumbWrap} title="Outdoor Photo">
                                <img
                                  src={r.outdoorImageUrl} alt="Outdoor"
                                  className={tableStyles.thumb}
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                                <span className={tableStyles.thumbLabel}>Outdoor</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className={tableStyles.td}>
                          <span className={tableStyles.dateBadge}>{fmt(r.createdAt)}</span>
                        </td>

                        <td className={tableStyles.td}>
                          <span className={tableStyles.dateBadge}>{fmt(r.updatedAt)}</span>
                        </td>

                        <td className={tableStyles.td}>
                          <div className={tableStyles.actionBtns}>
                            <Link
                              href={`/admin/dashboard/aymfullpage/${r.id}`}
                              className={tableStyles.editBtnSm}
                            >✎ Edit</Link>
                            <button
                              type="button"
                              className={tableStyles.deleteBtnSm}
                              onClick={() => setDeleteModal(r.id)}
                            >✕</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.empty}>
                <span className={styles.emptyOm}>ॐ</span>
                <p>
                  {search
                    ? "No records match your search."
                    : "No page content found. Add your first record."}
                </p>
              </div>
            )}

            {/* ── Stats Summary ── */}
            {records.length > 0 && (
              <div className={tableStyles.summaryRow}>
                <div className={tableStyles.summaryCard}>
                  <span className={tableStyles.summaryIcon}>📋</span>
                  <div>
                    <p className={tableStyles.summaryNum}>{records.length}</p>
                    <p className={tableStyles.summaryLabel}>Total Records</p>
                  </div>
                </div>
                <div className={tableStyles.summaryCard}>
                  <span className={tableStyles.summaryIcon}>🏛️</span>
                  <div>
                    <p className={tableStyles.summaryNum}>{records.reduce((a, r) => a + r.facilities, 0)}</p>
                    <p className={tableStyles.summaryLabel}>Total Facilities</p>
                  </div>
                </div>
                <div className={tableStyles.summaryCard}>
                  <span className={tableStyles.summaryIcon}>🧘</span>
                  <div>
                    <p className={tableStyles.summaryNum}>{records.reduce((a, r) => a + r.bodyPlanes, 0)}</p>
                    <p className={tableStyles.summaryLabel}>Body Planes</p>
                  </div>
                </div>
                <div className={tableStyles.summaryCard}>
                  <span className={tableStyles.summaryIcon}>✨</span>
                  <div>
                    <p className={tableStyles.summaryNum}>{records.reduce((a, r) => a + r.journeyParas, 0)}</p>
                    <p className={tableStyles.summaryLabel}>Journey Paragraphs</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Delete Modal */}
        {deleteModal !== null && (
          <div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalOm}>ॐ</div>
              <h3 className={styles.modalTitle}>Confirm Deletion</h3>
              <p className={styles.modalText}>
                Are you sure you want to delete this record? All page content, facility entries,
                and uploaded images will be permanently removed.
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancel}
                  onClick={() => setDeleteModal(null)}
                  disabled={isDeleting}
                >Cancel</button>
                <button
                  type="button"
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
    </>
  );
}
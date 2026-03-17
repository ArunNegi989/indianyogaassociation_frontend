"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/accreditationsection/Accreditationsection.module.css";
import api from "@/lib/api";

/* ─────────────────────── Types ─────────────────────── */

const getImageUrl = (path: string) => {
  if (!path) return "";
  return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
};
interface AccreditationRecord {
  _id: string;
  sectionTitle: string;
  videoSrc: string;
  immerseTitle: string;
  recognitionTitle: string;
  certs?: any[];
  badges?: any[];

  certsCount: number;     // ✅ ADD THIS
  badgesCount: number;    // ✅ ADD THIS

  createdAt: string;
  updatedAt: string;
}

type SortField = "sectionTitle" | "certsCount" | "updatedAt";
type SortDir   = "asc" | "desc";

/* ─────────────────────── Main ─────────────────────── */
export default function AccreditationSectionListPage() {
  const router = useRouter();
  const [records, setRecords] = useState<AccreditationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir]     = useState<SortDir>("desc");
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get("/accreditation");
        const formatted = res.data.data.map((item: any) => ({
  ...item,
  certsCount: item.certs?.length || 0,
  badgesCount: item.badges?.length || 0,
}));
       setRecords(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  /* sort */
  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  /* filtered + sorted */
  const filtered = records
    .filter((r) =>
      r.sectionTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.recognitionTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.immerseTitle.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let av: string | number = a[sortField] as any;
      let bv: string | number = b[sortField] as any;
      if (sortField === "certsCount") { av = a.certsCount; bv = b.certsCount; }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  /* delete */
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/accreditation/${deleteId}`);
      setRecords((p) => p.filter((r) => r._id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? <span className={styles.sortActive}>{sortDir === "asc" ? " ↑" : " ↓"}</span>
      : <span className={styles.sortInactive}> ⇅</span>;

  /* loading skeleton */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard")}>Dashboard</button>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Accreditation</span>
        </div>
        <div className={styles.listPageHeader}>
          <div>
            <div className={styles.skeletonTitle} style={{ width: '300px', height: '36px', marginBottom: '8px' }} />
            <div className={styles.skeletonText} style={{ width: '400px', height: '20px' }} />
          </div>
        </div>
        <div className={styles.statsBar}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.skeletonStat} style={{ width: '150px', height: '60px' }} />
          ))}
        </div>
        <div className={styles.skeletonTable}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.skeletonField} style={{ height: '60px', marginBottom: '10px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard")}>Dashboard</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Accreditation</span>
      </div>

      {/* Header */}
      <div className={styles.listPageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Accreditation Sections</h1>
          <p className={styles.pageSubtitle}>Manage the Accreditation &amp; Recognition page content</p>
        </div>
        <Link href="/admin/dashboard/accreditationsection/add-new" className={styles.addNewBtn}>
          <span>✦</span> Add New Section
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.statPill}>
          <span className={styles.statPillIcon}>📄</span>
          <span className={styles.statPillLabel}>Total Sections</span>
          <span className={styles.statPillVal}>{records.length}</span>
        </div>
        <div className={styles.statPill}>
          <span className={styles.statPillIcon}>🏅</span>
          <span className={styles.statPillLabel}>Total Certs</span>
          <span className={styles.statPillVal}>{records.reduce((s, r) => s + r.certsCount, 0)}</span>
        </div>
        <div className={styles.statPill}>
          <span className={styles.statPillIcon}>🏆</span>
          <span className={styles.statPillLabel}>Total Badges</span>
          <span className={styles.statPillVal}>{records.reduce((s, r) => s + r.badgesCount, 0)}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input className={styles.searchInput}
            placeholder="Search by title, recognition, immerse…"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🪷</div>
          <h3 className={styles.emptyTitle}>{search ? "No results found" : "No sections yet"}</h3>
          <p className={styles.emptyText}>
            {search ? "Try a different search term" : "Click 'Add New Section' to create your first accreditation section"}
          </p>
          {!search && (
            <Link href="/admin/dashboard/accreditationsection/add-new" className={styles.emptyAddBtn}>
              + Add First Section
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={`${styles.th} ${styles.thSortable}`} onClick={() => toggleSort("sectionTitle")}>
                  Section Title <SortIcon field="sectionTitle" />
                </th>
                <th className={styles.th}>Video</th>
                <th className={styles.th}>Immerse Title</th>
                <th className={`${styles.th} ${styles.thSortable}`} onClick={() => toggleSort("certsCount")}>
                  Certs <SortIcon field="certsCount" />
                </th>
                <th className={styles.th}>Badges</th>
                <th className={`${styles.th} ${styles.thSortable}`} onClick={() => toggleSort("updatedAt")}>
                  Updated <SortIcon field="updatedAt" />
                </th>
                <th className={styles.th}>Preview</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, i) => (
                <tr key={rec._id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.tdNum}`}>{i + 1}</td>
                  <td className={styles.td}>
                    <div className={styles.titleCell}>
                      <span className={styles.titleText} title={rec.sectionTitle}>
                        {rec.sectionTitle.length > 60 ? rec.sectionTitle.slice(0, 60) + "…" : rec.sectionTitle}
                      </span>
                      <span className={styles.subText} title={rec.recognitionTitle}>{rec.recognitionTitle}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    {rec.videoSrc ? (
                      <a href={rec.videoSrc} target="_blank" rel="noopener noreferrer" className={styles.videoLink} title={rec.videoSrc}>
                        🎬 {rec.videoSrc.includes("youtu") ? "YouTube" : "Direct"}
                      </a>
                    ) : <span className={styles.naText}>—</span>}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.immerseTitleText} title={rec.immerseTitle}>
                      {rec.immerseTitle.length > 35 ? rec.immerseTitle.slice(0, 35) + "…" : rec.immerseTitle}
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.tdCenter}`}>
                    <span className={styles.countBadge}>{rec.certsCount}</span>
                  </td>
                  <td className={`${styles.td} ${styles.tdCenter}`}>
                    <span className={styles.countBadge}>{rec.badgesCount}</span>
                  </td>
                  <td className={`${styles.td} ${styles.tdDate}`}>{formatDate(rec.updatedAt)}</td>
                  <td className={styles.td}>
  {rec.certs?.[0]?.image ? (
    <img
      src={getImageUrl(rec.certs[0].image)}
      alt="cert"
      style={{ width: "50px", height: "50px", objectFit: "cover" }}
    />
  ) : (
    "—"
  )}
</td>
                  <td className={styles.td}>
                    <div className={styles.actionBtns}>
                      <button className={styles.editBtn}
                        onClick={() => router.push(`/admin/dashboard/accreditationsection/${rec._id}`)}>
                        ✏️ Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => setDeleteId(rec._id)}>
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Results count */}
      {filtered.length > 0 && (
        <p className={styles.resultCount}>
          Showing {filtered.length} of {records.length} section{records.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className={styles.modalBackdrop} onClick={() => !deleting && setDeleteId(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3 className={styles.modalTitle}>Delete Section?</h3>
            <p className={styles.modalText}>
              This will permanently remove the accreditation section and all its certificates &amp; badges. This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setDeleteId(null)} disabled={deleting}>
                Cancel
              </button>
              <button className={`${styles.modalDeleteBtn} ${deleting ? styles.modalDeleteBtnLoading : ""}`}
                onClick={handleDelete} disabled={deleting}>
                {deleting ? <><span className={styles.spinner} /> Deleting…</> : "Delete Section"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
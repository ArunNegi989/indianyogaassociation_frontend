"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/assets/style/Admin/dashboard/Classcampusameniti/Classcampusamenities.module.css";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface ClassCampusSection {
  id: string;
  classSizeSuperLabel: string;
  classSizeTitle: string;
  campusSuperLabel: string;
  campusTitle: string;
  amenitiesSuperLabel: string;
  amenitiesCount: number;
  status: "Active" | "Inactive";
  order: number;
}

/* ─────────────────────────────────────────
   Breakpoint hook — 5 tiers
───────────────────────────────────────── */
function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return {
    isMobile:  width < 480,
    isTablet:  width >= 480 && width < 768,
    isDesktop: width >= 768,
    isWide:    width >= 1024,
    width,
  };
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function ClassCampusAmenitiesListPage() {
  const [sections, setSections]       = useState<ClassCampusSection[]>([]);
  const [loading, setLoading]         = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const { isMobile, isTablet, isDesktop, isWide } = useBreakpoint();
  const dragIndex = useRef<number | null>(null);

  const isLimitReached = sections.length >= 1;

  /* ── Fetch ── */
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get("/class-campus-amenities");
        if (res.data.success) {
          const mapped: ClassCampusSection[] = res.data.data.map(
            (item: any, idx: number) => ({
              id:                  item._id,
              classSizeSuperLabel: item.classSizeSuperLabel || "",
              classSizeTitle:      item.classSizeTitle      || "",
              campusSuperLabel:    item.campusSuperLabel    || "",
              campusTitle:         item.campusTitle         || "",
              amenitiesSuperLabel: item.amenitiesSuperLabel || "",
              amenitiesCount:      item.amenities?.length   ?? 0,
              status:              "Active",
              order:               idx + 1,
            })
          );
          setSections(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  /* ── Drag reorder ── */
  const handleDragStart = (i: number) => { dragIndex.current = i; };
  const handleDragEnter = (i: number) => {
    if (dragIndex.current === null || dragIndex.current === i) return;
    const arr = [...sections];
    const [moved] = arr.splice(dragIndex.current, 1);
    arr.splice(i, 0, moved);
    dragIndex.current = i;
    setSections(arr.map((s, idx) => ({ ...s, order: idx + 1 })));
  };
  const handleDragEnd = () => {
    dragIndex.current = null;
    toast.success("Order saved successfully");
  };

  /* ── Move up / down ── */
  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...sections];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setSections(arr.map((s, idx) => ({ ...s, order: idx + 1 })));
  };
  const moveDown = (i: number) => {
    if (i === sections.length - 1) return;
    const arr = [...sections];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    setSections(arr.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const toggleStatus = (id: string) =>
    setSections(sections.map((s) =>
      s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
    ));

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      await api.delete(`/class-campus-amenities/${deleteModal}`);
      setSections(
        sections
          .filter((s) => s.id !== deleteModal)
          .map((s, i) => ({ ...s, order: i + 1 }))
      );
      setDeleteModal(null);
      toast.success("Section deleted successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to delete"
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ─────────────────────────────────────────
     Shared sub-components
  ───────────────────────────────────────── */
  const Status = ({ s }: { s: ClassCampusSection }) => (
    <button
      className={`${styles.statusBadge} ${s.status === "Active" ? styles.statusActive : styles.statusInactive}`}
      onClick={() => toggleStatus(s.id)}
      title="Click to toggle status"
    >
      <span className={styles.statusDot} />
      {s.status}
    </button>
  );

  const Arrows = ({ i }: { i: number }) => (
    <div className={styles.arrowGroup}>
      <button className={styles.arrowBtn} onClick={() => moveUp(i)}
        disabled={i === 0} title="Move up">▲</button>
      <button className={styles.arrowBtn} onClick={() => moveDown(i)}
        disabled={i === sections.length - 1} title="Move down">▼</button>
    </div>
  );

  const Actions = ({ s }: { s: ClassCampusSection }) => (
    <div className={styles.actionBtns}>
      <Link href={`/admin/dashboard/Classcampusameniti/${s.id}`} className={styles.editBtn}>
        <span>✎</span>
        <span className={styles.btnLabel}>Edit</span>
      </Link>
      <button className={styles.deleteBtn} onClick={() => setDeleteModal(s.id)}>
        <span>✕</span>
        <span className={styles.btnLabel}>Delete</span>
      </button>
    </div>
  );

  /* ─────────────────────────────────────────
     LOADING SKELETON
  ───────────────────────────────────────── */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonField} />)}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     MOBILE CARDS  (< 480px)
  ───────────────────────────────────────── */
  const MobileCards = () => (
    <div className={styles.cardList}>
      {sections.map((s, i) => (
        <div
          key={s.id}
          className={styles.card}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className={styles.cardStrip} />

          <div className={styles.cardHeader}>
            <div className={styles.cardOrderBlock}>
              <span className={styles.orderBadge}>{s.order}</span>
              <Arrows i={i} />
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardSuperTitle}>{s.classSizeSuperLabel}</p>
              <p className={styles.cardMainTitle}>{s.classSizeTitle}</p>

              <div className={styles.cardBlocks}>
                <div className={styles.cardBlockRow}>
                  <span className={styles.cardBlockDot} />
                  <span className={styles.cardBlockLabel}>Campus:</span>
                  <span className={styles.cardBlockValue}>{s.campusTitle}</span>
                </div>
                <div className={styles.cardBlockRow}>
                  <span className={styles.cardBlockDot} />
                  <span className={styles.cardBlockLabel}>Location:</span>
                  <span className={styles.cardBlockValue}>{s.campusSuperLabel}</span>
                </div>
                <div className={styles.cardBlockRow}>
                  <span className={styles.cardBlockDot} />
                  <span className={styles.cardBlockLabel}>Amenities:</span>
                  <span className={styles.cardBlockValue}>{s.amenitiesSuperLabel}</span>
                </div>
              </div>

              <div className={styles.cardMeta}>
                <span className={styles.metaChip}>✦ {s.amenitiesCount} Amenities</span>
              </div>

              <div className={styles.cardTags}>
                <Status s={s} />
              </div>
            </div>

            <span className={styles.cardDragHandle} title="Drag to reorder">⠿</span>
          </div>

          <div className={styles.cardFooter}>
            <Actions s={s} />
          </div>
        </div>
      ))}
    </div>
  );

  /* ─────────────────────────────────────────
     TABLET TABLE  (480px – 767px)
  ───────────────────────────────────────── */
  const TabletTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 56 }}>#</th>
            <th>Class Size · Campus</th>
            <th style={{ width: 88 }}>Items</th>
            <th style={{ width: 92 }}>Status</th>
            <th style={{ width: 118 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s, i) => (
            <tr
              key={s.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <td>
                <div className={styles.tdOrder}>
                  <span className={styles.orderBadge}>{s.order}</span>
                  <Arrows i={i} />
                </div>
              </td>

              <td>
                <p className={styles.sectionSuperTitle}>{s.classSizeSuperLabel}</p>
                <p className={styles.sectionMainTitle}>{s.classSizeTitle}</p>
                <p className={styles.sectionSuperTitle} style={{ marginTop: "0.3rem" }}>
                  {s.campusSuperLabel}
                </p>
                <p className={styles.sectionMainTitle}>{s.campusTitle}</p>
              </td>

              <td className={styles.tdCenter}>
                <span className={styles.metaChip}>✦ {s.amenitiesCount}</span>
              </td>

              <td className={styles.tdCenter}><Status s={s} /></td>
              <td className={styles.tdCenter}><Actions s={s} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ─────────────────────────────────────────
     DESKTOP TABLE  (768px+)
  ───────────────────────────────────────── */
  const DesktopTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 52 }}>#</th>
            <th style={{ width: 52 }}></th>
            <th>Class Size Block</th>
            <th>Campus Block</th>
            {isWide && <th style={{ width: 130 }}>Amenities</th>}
            {isWide && <th style={{ width: 175 }}>Amenities Label</th>}
            <th style={{ width: 108 }}>Status</th>
            <th style={{ width: 158 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s, i) => (
            <tr
              key={s.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <td className={styles.tdCenter}>
                <span className={styles.orderBadge}>{s.order}</span>
              </td>

              <td>
                <div className={styles.dragGroup}>
                  <span className={styles.dragHandle} title="Drag to reorder">⠿</span>
                  <Arrows i={i} />
                </div>
              </td>

              <td>
                <p className={styles.sectionSuperTitle}>{s.classSizeSuperLabel}</p>
                <p className={styles.sectionMainTitle}>{s.classSizeTitle}</p>
              </td>

              <td>
                <p className={styles.sectionSuperTitle}>{s.campusSuperLabel}</p>
                <p className={styles.sectionMainTitle}>{s.campusTitle}</p>
              </td>

              {isWide && (
                <td className={styles.tdCenter}>
                  <div className={styles.metaStack}>
                    <span className={styles.metaChip}>✦ {s.amenitiesCount} Items</span>
                  </div>
                </td>
              )}

              {isWide && (
                <td>
                  <p className={styles.sectionSuperTitle}>{s.amenitiesSuperLabel}</p>
                </td>
              )}

              <td className={styles.tdCenter}><Status s={s} /></td>
              <td className={styles.tdCenter}><Actions s={s} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Class, Campus & Amenities</h1>
          <p className={styles.pageSubtitle}>
            {isMobile
              ? "Drag cards or tap arrows to reorder"
              : "Drag rows to reorder · click status badge to toggle"}
          </p>
        </div>

        <Link
          href={isLimitReached ? "#" : "/admin/dashboard/Classcampusameniti/add-new"}
          className={`${styles.addBtn} ${isLimitReached ? styles.disabledBtn : ""}`}
          onClick={(e) => {
            if (isLimitReached) {
              e.preventDefault();
              toast("Section already exists. Please edit or delete first.", { icon: "⚠️" });
            }
          }}
        >
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add Section</span>
        </Link>
      </div>

      {/* ── Ornament ── */}
      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* ── Views ── */}
      {isMobile               && <MobileCards />}
      {isTablet && !isMobile  && <TabletTable />}
      {isDesktop && !isTablet && <DesktopTable />}

      {/* ── Empty State ── */}
      {sections.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No sections found. Add your first Class, Campus & Amenities section.</p>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteModal !== null && (
        <div className={styles.modalOverlay} onClick={() => !deleting && setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this section? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
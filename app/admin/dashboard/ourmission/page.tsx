"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/ourmission/Ourmission.module.css";
// import api from "@/lib/api";

/* ── Types ── */
interface MissionSection {
  id: string;
  /** Which block: "mission" | "why" */
  blockType: "mission" | "why";
  /** Heading shown in the section */
  heading: string;
  /** SEO tagline (mission block only) */
  seoTagline?: string;
  /** Lead bold text (why block only) */
  leadBold?: string;
  /** Short preview of first paragraph */
  paraPreview: string;
  /** Total paragraph count */
  paraCount: number;
  status: "Active" | "Inactive";
  order: number;
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

/* ── Mock data ── */
const MOCK: MissionSection[] = [
  {
    id: "1",
    blockType: "mission",
    heading: "Our Mission",
    seoTagline: "Yoga Teacher Training in Rishikesh India",
    paraPreview: "The practice of yoga extends far beyond the exercises; it's a mindful way of life…",
    paraCount: 2,
    status: "Active",
    order: 1,
  },
  {
    id: "2",
    blockType: "why",
    heading: "Why Yoga Teacher Training is for Everyone?",
    leadBold: "What does the Journey Entail?",
    paraPreview: "Whether you are a student looking for clarity, a homemaker seeking balance…",
    paraCount: 2,
    status: "Active",
    order: 2,
  },
];

const BLOCK_LABEL: Record<string, string> = {
  mission: "Mission Block",
  why: "Why YTTC Block",
};

export default function OurMissionListPage() {
  const [sections, setSections] = useState<MissionSection[]>([]);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const { isMobile, isTablet, width } = useBreakpoint();
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    // const res = await api.get("/our-mission");
    // setSections(res.data.data);
    setSections(MOCK);
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
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

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

  const handleDelete = async () => {
    // await api.delete(`/our-mission/${deleteModal}`);
    setSections(sections.filter((s) => s.id !== deleteModal).map((s, i) => ({ ...s, order: i + 1 })));
    setDeleteModal(null);
  };

  /* ── Sub-components ── */
  const Status = ({ s }: { s: MissionSection }) => (
    <button
      className={`${styles.statusBadge} ${s.status === "Active" ? styles.statusActive : styles.statusInactive}`}
      onClick={() => toggleStatus(s.id)}
    >
      <span className={styles.statusDot} />{s.status}
    </button>
  );

  const Arrows = ({ i }: { i: number }) => (
    <div className={styles.arrowGroup}>
      <button className={styles.arrowBtn} onClick={() => moveUp(i)} disabled={i === 0}>▲</button>
      <button className={styles.arrowBtn} onClick={() => moveDown(i)} disabled={i === sections.length - 1}>▼</button>
    </div>
  );

  const Actions = ({ s }: { s: MissionSection }) => (
    <div className={styles.actionBtns}>
      <Link href={`ourmission/edit/${s.id}`} className={styles.editBtn}>
        <span>✎</span><span className={styles.btnLabel}> Edit</span>
      </Link>
      <button className={styles.deleteBtn} onClick={() => setDeleteModal(s.id)}>
        <span>✕</span><span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  /* ── Mobile Cards ── */
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
          <div className={styles.cardHeader}>
            <div className={styles.cardOrderBlock}>
              <span className={styles.orderBadge}>{s.order}</span>
              <Arrows i={i} />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.blockLabel}>{BLOCK_LABEL[s.blockType]}</p>
              <p className={styles.sectionHeading}>{s.heading}</p>
              {s.seoTagline && (
                <p className={styles.paraPreview}>🔖 {s.seoTagline}</p>
              )}
              {s.leadBold && (
                <span className={styles.leadBoldPreview}>{s.leadBold}</span>
              )}
              <div className={styles.cardMeta}>
                <span className={styles.metaChip}>📝 {s.paraCount} Para</span>
              </div>
              <div className={styles.cardTags}>
                <Status s={s} />
              </div>
            </div>
            <span className={styles.dragHandle}>⠿</span>
          </div>
          <div className={styles.cardFooter}><Actions s={s} /></div>
        </div>
      ))}
    </div>
  );

  /* ── Tablet Table ── */
  const TabletTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 52 }}>#</th>
            <th>Block / Heading</th>
            <th style={{ width: 110 }}>Paras</th>
            <th style={{ width: 100 }}>Status</th>
            <th style={{ width: 130 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s, i) => (
            <tr
              key={s.id}
              className={styles.row}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <td className={styles.tdOrder}>
                <span className={styles.orderBadge}>{s.order}</span>
                <Arrows i={i} />
              </td>
              <td>
                <p className={styles.blockLabel}>{BLOCK_LABEL[s.blockType]}</p>
                <p className={styles.sectionHeading}>{s.heading}</p>
                <p className={styles.paraPreview}>{s.paraPreview}</p>
              </td>
              <td className={styles.tdCenter}>
                <span className={styles.metaChip}>📝 {s.paraCount}</span>
              </td>
              <td className={styles.tdCenter}><Status s={s} /></td>
              <td className={styles.tdCenter}><Actions s={s} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── Desktop Table ── */
  const DesktopTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 52 }}>#</th>
            <th style={{ width: 48 }}></th>
            <th style={{ width: 140 }}>Block Type</th>
            <th>Heading</th>
            {width >= 1024 && <th>Content Preview</th>}
            {width >= 1024 && <th style={{ width: 90 }}>Paras</th>}
            <th style={{ width: 110 }}>Status</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s, i) => (
            <tr
              key={s.id}
              className={styles.row}
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
                  <span className={styles.dragHandle}>⠿</span>
                  <Arrows i={i} />
                </div>
              </td>
              <td>
                <p className={styles.blockLabel}>{BLOCK_LABEL[s.blockType]}</p>
                {s.seoTagline && <p className={styles.paraPreview}>🔖 {s.seoTagline}</p>}
                {s.leadBold && <span className={styles.leadBoldPreview}>{s.leadBold}</span>}
              </td>
              <td>
                <p className={styles.sectionHeading}>{s.heading}</p>
              </td>
              {width >= 1024 && (
                <td>
                  <p className={styles.paraPreview}>{s.paraPreview}</p>
                </td>
              )}
              {width >= 1024 && (
                <td className={styles.tdCenter}>
                  <span className={styles.metaChip}>📝 {s.paraCount}</span>
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

  return (
    <div className={styles.page}>
      {savedToast && <div className={styles.toast}>✦ Order updated successfully</div>}

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Our Mission Section</h1>
          <p className={styles.pageSubtitle}>
            {isMobile ? "Drag cards · tap arrows to reorder" : "Drag rows to reorder · click status to toggle"}
          </p>
        </div>
        <Link href="/admin/dashboard/ourmission/add-new" className={styles.addBtn}>
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add Block</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {isMobile && <MobileCards />}
      {isTablet && <TabletTable />}
      {!isMobile && !isTablet && <DesktopTable />}

      {sections.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No mission blocks found. Add your first block.</p>
        </div>
      )}

      {deleteModal !== null && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this mission block? This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className={styles.modalConfirm} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/whyaymschool/Whyaym.module.css";
// import api from "@/lib/api";

/* ── Types ── */
interface WhyAYMRecord {
  id: string;
  superTitle: string;
  mainTitle: string;
  introPara: string;
  /** alt text of the hero image */
  imageAlt: string;
  /** URL/path of hero image */
  imageSrc: string;
  imgBadgeYear: string;
  imgQuote: string;
  sideFeatureCount: number;
  bottomFeatureCount: number;
  status: "Active" | "Inactive";
  order: number;
}

function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: width < 480, isTablet: width >= 480 && width < 768, width };
}

const MOCK: WhyAYMRecord[] = [
  {
    id: "1",
    superTitle: "Yoga Teacher Training in Rishikesh",
    mainTitle: "What Makes AYM Yoga School Different from Other Yoga Schools in Rishikesh, India?",
    introPara: "Namaste, yoga lovers! AYM Yoga School stands out among Rishikesh's yoga schools for its commitment to authentic teaching, experienced instructors, and a welcoming environment.",
    imageSrc: "/assets/images/certification-yoga-course-in-rishikesh-india.jpg",
    imageAlt: "AYM Yoga School certified student",
    imgBadgeYear: "Est. 2005",
    imgQuote: "Where Ancient Yoga Lives & Transforms Lives",
    sideFeatureCount: 4,
    bottomFeatureCount: 4,
    status: "Active",
    order: 1,
  },
];

export default function WhyAYMListPage() {
  const [records, setRecords] = useState<WhyAYMRecord[]>([]);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const { isMobile, isTablet, width } = useBreakpoint();
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    // const res = await api.get("/why-aym");
    // setRecords(res.data.data);
    setRecords(MOCK);
  }, []);

  /* ── Drag reorder ── */
  const handleDragStart = (i: number) => { dragIndex.current = i; };
  const handleDragEnter = (i: number) => {
    if (dragIndex.current === null || dragIndex.current === i) return;
    const arr = [...records];
    const [moved] = arr.splice(dragIndex.current, 1);
    arr.splice(i, 0, moved);
    dragIndex.current = i;
    setRecords(arr.map((r, idx) => ({ ...r, order: idx + 1 })));
  };
  const handleDragEnd = () => {
    dragIndex.current = null;
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...records];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setRecords(arr.map((r, idx) => ({ ...r, order: idx + 1 })));
  };
  const moveDown = (i: number) => {
    if (i === records.length - 1) return;
    const arr = [...records];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    setRecords(arr.map((r, idx) => ({ ...r, order: idx + 1 })));
  };

  const toggleStatus = (id: string) =>
    setRecords(records.map((r) => r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r));

  const handleDelete = async () => {
    // await api.delete(`/why-aym/${deleteModal}`);
    setRecords(records.filter((r) => r.id !== deleteModal).map((r, i) => ({ ...r, order: i + 1 })));
    setDeleteModal(null);
  };

  /* ── Sub-components ── */
  const Status = ({ r }: { r: WhyAYMRecord }) => (
    <button
      className={`${styles.statusBadge} ${r.status === "Active" ? styles.statusActive : styles.statusInactive}`}
      onClick={() => toggleStatus(r.id)}
    >
      <span className={styles.statusDot} />{r.status}
    </button>
  );

  const Arrows = ({ i }: { i: number }) => (
    <div className={styles.arrowGroup}>
      <button className={styles.arrowBtn} onClick={() => moveUp(i)} disabled={i === 0}>▲</button>
      <button className={styles.arrowBtn} onClick={() => moveDown(i)} disabled={i === records.length - 1}>▼</button>
    </div>
  );

  const Actions = ({ r }: { r: WhyAYMRecord }) => (
    <div className={styles.actionBtns}>
      <Link href={`whyaym/edit/${r.id}`} className={styles.editBtn}>
        <span>✎</span><span className={styles.btnLabel}> Edit</span>
      </Link>
      <button className={styles.deleteBtn} onClick={() => setDeleteModal(r.id)}>
        <span>✕</span><span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  /* ── Mobile Cards ── */
  const MobileCards = () => (
    <div className={styles.cardList}>
      {records.map((r, i) => (
        <div
          key={r.id} className={styles.card} draggable
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardOrderBlock}>
              <span className={styles.orderBadge}>{r.order}</span>
              <Arrows i={i} />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.blockLabel}>{r.superTitle}</p>
              <p className={styles.sectionHeading}>{r.mainTitle}</p>
              {r.imageSrc && (
                <div className={styles.cardThumbRow}>
                  <img src={r.imageSrc} alt={r.imageAlt} className={styles.cardThumb}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div className={styles.cardMeta}>
                <span className={styles.metaChip}>🔷 {r.sideFeatureCount} Side</span>
                <span className={styles.metaChip}>🔲 {r.bottomFeatureCount} Bottom</span>
              </div>
              <div className={styles.cardTags}><Status r={r} /></div>
            </div>
            <span className={styles.dragHandle}>⠿</span>
          </div>
          <div className={styles.cardFooter}><Actions r={r} /></div>
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
            <th>Super Title / Main Title</th>
            <th style={{ width: 100 }}>Features</th>
            <th style={{ width: 100 }}>Status</th>
            <th style={{ width: 130 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r.id} className={styles.row} draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <td className={styles.tdOrder}>
                <span className={styles.orderBadge}>{r.order}</span>
                <Arrows i={i} />
              </td>
              <td>
                <p className={styles.blockLabel}>{r.superTitle}</p>
                <p className={styles.sectionHeading}>{r.mainTitle}</p>
                <p className={styles.paraPreview}>{r.introPara}</p>
              </td>
              <td className={styles.tdCenter}>
                <div className={styles.metaStack}>
                  <span className={styles.metaChip}>🔷 {r.sideFeatureCount}</span>
                  <span className={styles.metaChip}>🔲 {r.bottomFeatureCount}</span>
                </div>
              </td>
              <td className={styles.tdCenter}><Status r={r} /></td>
              <td className={styles.tdCenter}><Actions r={r} /></td>
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
            <th style={{ width: 60 }}>Image</th>
            <th style={{ width: 180 }}>Super Title</th>
            <th>Main Title</th>
            {width >= 1024 && <th style={{ width: 130 }}>Features</th>}
            {width >= 1024 && <th style={{ width: 160 }}>Image Quote</th>}
            <th style={{ width: 110 }}>Status</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r.id} className={styles.row} draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <td className={styles.tdCenter}>
                <span className={styles.orderBadge}>{r.order}</span>
              </td>
              <td>
                <div className={styles.dragGroup}>
                  <span className={styles.dragHandle}>⠿</span>
                  <Arrows i={i} />
                </div>
              </td>
              <td className={styles.tdCenter}>
                {r.imageSrc && (
                  <img src={r.imageSrc} alt={r.imageAlt} className={styles.thumbTiny}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
              </td>
              <td><p className={styles.blockLabel}>{r.superTitle}</p></td>
              <td>
                <p className={styles.sectionHeading}>{r.mainTitle}</p>
                <p className={styles.paraPreview}>{r.introPara}</p>
              </td>
              {width >= 1024 && (
                <td className={styles.tdCenter}>
                  <div className={styles.metaStack}>
                    <span className={styles.metaChip}>🔷 {r.sideFeatureCount} Side</span>
                    <span className={styles.metaChip}>🔲 {r.bottomFeatureCount} Bottom</span>
                  </div>
                </td>
              )}
              {width >= 1024 && (
                <td><p className={styles.paraPreview}>&ldquo;{r.imgQuote}&rdquo;</p></td>
              )}
              <td className={styles.tdCenter}><Status r={r} /></td>
              <td className={styles.tdCenter}><Actions r={r} /></td>
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
          <h1 className={styles.pageTitle}>Why AYM Section</h1>
          <p className={styles.pageSubtitle}>
            {isMobile ? "Drag cards · tap arrows to reorder" : "Drag rows to reorder · click status to toggle"}
          </p>
        </div>
        <Link href="/admin/dashboard/whyaymschool/add-new" className={styles.addBtn}>
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add Section</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {isMobile && <MobileCards />}
      {isTablet && <TabletTable />}
      {!isMobile && !isTablet && <DesktopTable />}

      {records.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No records found. Add your first Why AYM section.</p>
        </div>
      )}

      {deleteModal !== null && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>Delete this Why AYM section? All features and image data will be removed.</p>
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
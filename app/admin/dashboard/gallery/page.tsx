"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/gallery/Gallery.module.css";
// import api from "@/lib/api";

/* ── Types ── */
interface GallerySection {
  id: string;
  tabLabel: string;
  heading: string;
  images: { src: string; label: string }[];
  cols: number;
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
  return {
    isMobile: width < 480,
    isTablet: width >= 480 && width < 768,
    width,
  };
}

/* ── Mock data (replace with api call) ── */
const MOCK_SECTIONS: GallerySection[] = [
  {
    id: "1", tabLabel: "Luxury", heading: "Luxury Accommodation - AYM Yoga School",
    images: [
      { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=60", label: "Luxury Room" },
      { src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=200&q=60", label: "Luxury Room" },
      { src: "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=200&q=60", label: "Luxury Room" },
      { src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&q=60", label: "Luxury Room Bath" },
    ],
    cols: 4, status: "Active", order: 1,
  },
  {
    id: "2", tabLabel: "Private", heading: "Private Accommodation - AYM Yoga School",
    images: [
      { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=60", label: "Private Room" },
      { src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=200&q=60", label: "Private Room" },
      { src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=200&q=60", label: "Private Room" },
      { src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&q=60", label: "Private Room Bath" },
    ],
    cols: 4, status: "Active", order: 2,
  },
  {
    id: "3", tabLabel: "Twin/Shared", heading: "Twin / Shared Accommodation - AYM Yoga School",
    images: [
      { src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=200&q=60", label: "Shared Room" },
      { src: "https://images.unsplash.com/photo-1558882224-dda166733046?w=200&q=60", label: "Shared Room" },
      { src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=60", label: "Shared Room" },
    ],
    cols: 3, status: "Active", order: 3,
  },
  {
    id: "4", tabLabel: "Yoga Halls", heading: "Yoga School - Yoga Halls",
    images: [
      { src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&q=60", label: "Yoga Hall" },
      { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&q=60", label: "Yoga Hall" },
      { src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=200&q=60", label: "Yoga Hall" },
      { src: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=200&q=60", label: "Yoga Hall" },
    ],
    cols: 4, status: "Active", order: 4,
  },
  {
    id: "5", tabLabel: "Food", heading: "Food - AYM Yoga School",
    images: [
      { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60", label: "Food" },
      { src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=60", label: "Food" },
      { src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60", label: "Food" },
    ],
    cols: 3, status: "Inactive", order: 5,
  },
];

export default function GalleryListPage() {
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const { isMobile, isTablet, width } = useBreakpoint();
  const dragIndex = useRef<number | null>(null);

  const fetchSections = async () => {
    try {
      // const res = await api.get("/gallery-sections");
      // if (res.data.success) setSections(res.data.data);
      setSections(MOCK_SECTIONS);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { fetchSections(); }, []);

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

  const handleDelete = async () => {
    try {
      // await api.delete(`/gallery-sections/${deleteModal}`);
      setSections(sections.filter((s) => s.id !== deleteModal).map((s, i) => ({ ...s, order: i + 1 })));
      setDeleteModal(null);
    } catch (error) {
      console.log(error);
    }
  };

  /* ── Sub-components ── */
  const Status = ({ s }: { s: GallerySection }) => (
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

  const Actions = ({ s }: { s: GallerySection }) => (
    <div className={styles.actionBtns}>
      <Link href={`gallery/edit/${s.id}`} className={styles.editBtn}>
        <span>✎</span><span className={styles.btnLabel}> Edit</span>
      </Link>
      <button className={styles.deleteBtn} onClick={() => setDeleteModal(s.id)}>
        <span>✕</span><span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  /* ── Thumb strip ── */
  const Thumbs = ({ images }: { images: GallerySection["images"] }) => (
    <div className={styles.thumbPreview}>
      {images.slice(0, 3).map((img, i) => (
        <img key={i} src={img.src} alt={img.label} className={styles.thumbTiny} />
      ))}
      {images.length > 3 && (
        <span className={styles.thumbMore}>+{images.length - 3}</span>
      )}
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
              <p className={styles.sectionTab}>{s.tabLabel}</p>
              <p className={styles.sectionHeading}>{s.heading}</p>
              <div className={styles.cardThumbRow}>
                {s.images.slice(0, 4).map((img, idx) => (
                  <img key={idx} src={img.src} alt={img.label} className={styles.cardThumb} />
                ))}
                {s.images.length > 4 && (
                  <div className={styles.cardThumbMore}>+{s.images.length - 4}</div>
                )}
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.imgCountBadge}>🖼 {s.images.length} Images</span>
                <span className={styles.imgCountBadge}>⊞ {s.cols} Cols</span>
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
            <th>Tab / Heading</th>
            <th style={{ width: 130 }}>Preview</th>
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
                <p className={styles.sectionTab}>{s.tabLabel}</p>
                <p className={styles.sectionHeading}>{s.heading}</p>
              </td>
              <td className={styles.tdCenter}><Thumbs images={s.images} /></td>
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
            <th style={{ width: 110 }}>Tab Label</th>
            <th>Section Heading</th>
            {width >= 1024 && <th style={{ width: 160 }}>Preview</th>}
            {width >= 1024 && <th style={{ width: 100 }}>Images</th>}
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
              <td><p className={styles.sectionTab}>{s.tabLabel}</p></td>
              <td><p className={styles.sectionHeading}>{s.heading}</p></td>
              {width >= 1024 && (
                <td className={styles.tdCenter}><Thumbs images={s.images} /></td>
              )}
              {width >= 1024 && (
                <td className={styles.tdCenter}>
                  <span className={styles.imgCountBadge}>🖼 {s.images.length}</span>
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
      {savedToast && (
        <div className={styles.toast}>✦ Order updated successfully</div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gallery Sections</h1>
          <p className={styles.pageSubtitle}>
            {isMobile
              ? "Drag cards · tap arrows to reorder"
              : "Drag rows to reorder · click status to toggle"}
          </p>
        </div>
        <Link href="/admin/dashboard/gallery/add-new" className={styles.addBtn}>
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

      {sections.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No gallery sections found. Add your first section.</p>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal !== null && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this gallery section? All images in it will be removed.
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
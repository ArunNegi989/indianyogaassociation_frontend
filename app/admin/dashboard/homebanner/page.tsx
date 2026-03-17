"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/assets/style/Admin/dashboard/homebanner/Herobanner.module.css";
import Link from "next/link";
import api from "@/lib/api";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  position: string;
  status: "Active" | "Inactive";
  order: number;
  image?: string;
}

function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return {
    isMobile: width < 480,
    isTablet: width >= 480 && width < 768,
    isSmallDesk: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

export default function HeroBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const { isMobile, isTablet, width } = useBreakpoint();
  const dragIndex = useRef<number | null>(null);

  const handleDragStart = (i: number) => {
    dragIndex.current = i;
  };
  const handleDragEnter = (i: number) => {
    if (dragIndex.current === null || dragIndex.current === i) return;
    const arr = [...banners];
    const [moved] = arr.splice(dragIndex.current, 1);
    arr.splice(i, 0, moved);
    dragIndex.current = i;
    setBanners(arr.map((b, idx) => ({ ...b, order: idx + 1 })));
  };
  const handleDragEnd = async () => {
    dragIndex.current = null;

    await updateOrderAPI(banners);

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };
  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...banners];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setBanners(arr.map((b, idx) => ({ ...b, order: idx + 1 })));
  };
  const moveDown = (i: number) => {
    if (i === banners.length - 1) return;
    const arr = [...banners];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    setBanners(arr.map((b, idx) => ({ ...b, order: idx + 1 })));
  };

  const toggleStatus = (id: string) =>
    setBanners(
      banners.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" }
          : b,
      ),
    );

  const handleDelete = async () => {
    try {
      await api.delete(`/banners/delete/${deleteModal}`);
      setBanners(
        banners
          .filter((b) => b.id !== deleteModal)
          .map((b, i) => ({ ...b, order: i + 1 })),
      );
      setDeleteModal(null);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await api.get("/banners");
      if (res.data.success) {
        const formatted = res.data.data.map((b: any) => ({
          id: b._id,
          title: b.bannerName,
          subtitle: "",
          position: "home",
          status: "Active",
          order: b.order,
          image: b.image,
        }));
        setBanners(formatted);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrderAPI = async (data: Banner[]) => {
    try {
      await api.put("/banners/reorder", {
        banners: data.map((b) => ({
          id: b.id,
          order: b.order,
        })),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  /* ── Preview ── */
const Preview = ({ image }: { image?: string }) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  let imageUrl = "";
  if (image) {
    if (image.startsWith("http")) {
      imageUrl = image;
    } else {
      imageUrl = `${baseURL}${image}`;
    }
  }

  return (
    <div className={styles.previewBox}>
      {image ? (
        <img
          src={imageUrl}
          className={styles.previewImage}
          alt="Banner"
        />
      ) : (
        <span className={styles.previewOm}>ॐ</span>
      )}
    </div>
  );
};
  /* ── Status ── */
  const Status = ({ b }: { b: Banner }) => (
    <button
      className={`${styles.statusBadge} ${b.status === "Active" ? styles.statusActive : styles.statusInactive}`}
      onClick={() => toggleStatus(b.id)}
    >
      <span className={styles.statusDot} />
      {b.status}
    </button>
  );

  /* ── Arrows ── */
  const Arrows = ({ i }: { i: number }) => (
    <div className={styles.arrowGroup}>
      <button
        className={styles.arrowBtn}
        onClick={() => moveUp(i)}
        disabled={i === 0}
      >
        ▲
      </button>
      <button
        className={styles.arrowBtn}
        onClick={() => moveDown(i)}
        disabled={i === banners.length - 1}
      >
        ▼
      </button>
    </div>
  );

  /* ── Actions ── */
  const Actions = ({ b }: { b: Banner }) => (
    <div className={styles.actionBtns}>
      <Link href={`homebanner/${b.id}`} className={styles.editBtn}>
        <span>✎</span>
        <span className={styles.btnLabel}> Edit</span>
      </Link>
      <button className={styles.deleteBtn} onClick={() => setDeleteModal(b.id)}>
        <span>✕</span>
        <span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  /* ── Mobile Cards (< 480px) ── */
  const MobileCards = () => (
    <div className={styles.cardList}>
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={styles.card}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardOrderBlock}>
              <span className={styles.orderBadge}>{b.order}</span>
              <Arrows i={i} />
            </div>
            <Preview image={b.image} />
            <div className={styles.cardBody}>
              <p className={styles.bannerTitle}>{b.title}</p>
              <p className={styles.bannerSubtitle}>{b.subtitle}</p>
              <div className={styles.cardTags}>
                <span className={styles.positionTag}>{b.position}</span>
                <Status b={b} />
              </div>
            </div>
            <span className={styles.dragHandle} title="Drag to reorder">
              ⠿
            </span>
          </div>
          <div className={styles.cardFooter}>
            <Actions b={b} />
          </div>
        </div>
      ))}
    </div>
  );

  /* ── Tablet (480–767px) ── */
  const TabletTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 56 }}>#</th>
            <th style={{ width: 100 }}>Preview</th>
            <th>Title</th>
            <th style={{ width: 100 }}>Status</th>
            <th style={{ width: 130 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((b, i) => (
            <tr
              key={b.id}
              className={styles.row}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <td className={styles.tdOrder}>
                <span className={styles.orderBadge}>{b.order}</span>
                <Arrows i={i} />
              </td>
              <td>
                <Preview image={b.image} />
              </td>
              <td>
                <p className={styles.bannerTitle}>{b.title}</p>
                <p className={styles.bannerSubtitle}>{b.subtitle}</p>
              </td>
              <td className={styles.tdCenter}>
                <Status b={b} />
              </td>
              <td className={styles.tdCenter}>
                <Actions b={b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── Desktop (768px+) ── */
  const DesktopTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 52 }}>#</th>
            <th style={{ width: 52 }}></th>
            <th style={{ width: 130 }}>Preview</th>
            <th>Title</th>
            {width >= 1024 && <th style={{ width: 110 }}>Position</th>}
            <th style={{ width: 110 }}>Status</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((b, i) => (
            <tr
              key={b.id}
              className={styles.row}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <td className={styles.tdCenter}>
                <span className={styles.orderBadge}>{b.order}</span>
              </td>
              <td>
                <div className={styles.dragGroup}>
                  <span className={styles.dragHandle}>⠿</span>
                  <Arrows i={i} />
                </div>
              </td>
              <td>
                <Preview image={b.image} />
              </td>
              <td>
                <p className={styles.bannerTitle}>{b.title}</p>
                <p className={styles.bannerSubtitle}>{b.subtitle}</p>
              </td>
              {width >= 1024 && (
                <td className={styles.tdCenter}>
                  <span className={styles.positionTag}>{b.position}</span>
                </td>
              )}
              <td className={styles.tdCenter}>
                <Status b={b} />
              </td>
              <td className={styles.tdCenter}>
                <Actions b={b} />
              </td>
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
          <h1 className={styles.pageTitle}>Hero Banners</h1>
          <p className={styles.pageSubtitle}>
            {isMobile
              ? "Drag cards · tap arrows to reorder"
              : "Drag rows to reorder · click status to toggle"}
          </p>
        </div>
        <Link
          href="/admin/dashboard/homebanner/add-new"
          className={styles.addBtn}
        >
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add Banner</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {isMobile && <MobileCards />}
      {isTablet && <TabletTable />}
      {!isMobile && !isTablet && <DesktopTable />}

      {banners.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No banners found. Add your first banner.</p>
        </div>
      )}

      {deleteModal !== null && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteModal(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this banner? This cannot be
              undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setDeleteModal(null)}
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

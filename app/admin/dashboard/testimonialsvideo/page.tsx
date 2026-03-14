"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/testimonialsvideo/Testimonials.module.css";
// import api from "@/lib/api";

/* ── Types ── */
type ReviewType = "video" | "text";

interface VideoTestimonial {
  id: string;
  type: "video";
  name: string;
  country: string;
  flag: string;
  youtubeId: string;
  quote: string;
  course: string;
  rating: number;
  status: "Active" | "Inactive";
  order: number;
}

interface TextReview {
  id: string;
  type: "text";
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  status: "Active" | "Inactive";
  order: number;
}

type AnyReview = VideoTestimonial | TextReview;

function useBreakpoint() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: width < 480, isTablet: width >= 480 && width < 768, width };
}

function getYoutubeId(input: string): string {
  if (!input) return "";
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const shorts = s.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return shorts[1];
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return watch[1];
  const short = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];
  const embed = s.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];
  return s;
}

/* ── Mock data ── */
const MOCK_VIDEO: VideoTestimonial[] = [
  { id: "v1", type: "video", name: "Marit", country: "Netherlands", flag: "🇳🇱", youtubeId: "l12jCvLqUQg", quote: "Namaste, my name is Marit. I am from the Netherlands and I came to AYM two weeks ago and I'm loving it so much. The teachers, they are amazing.", course: "200hr YTT", rating: 5, status: "Active", order: 1 },
  { id: "v2", type: "video", name: "Sarah", country: "United States", flag: "🇺🇸", youtubeId: "jUAovisMEfk", quote: "AYM has been a life-changing experience. The depth of knowledge our teachers carry is extraordinary.", course: "300hr YTT", rating: 5, status: "Active", order: 2 },
  { id: "v3", type: "video", name: "Lena", country: "Germany", flag: "🇩🇪", youtubeId: "2lVpgxazEWw", quote: "I have attended several yoga trainings across Europe but nothing compared to the authenticity and rigor of AYM.", course: "200hr YTT", rating: 5, status: "Active", order: 3 },
];

const MOCK_TEXT: TextReview[] = [
  { id: "t1", type: "text", name: "Vinita Rai", role: "Certified Yoga Teacher", avatar: "/images/reviews/vinita.jpg", quote: "This is truly the best yoga school for 200-hour Yoga Teacher Training. The environment is peaceful, supportive, and perfect for learning.", rating: 5, status: "Active", order: 1 },
  { id: "t2", type: "text", name: "Alexandra Guzman", role: "Yoga Practitioner, Peruvian", avatar: "/images/reviews/alexandra.jpg", quote: "I completed the 300-hour Online Teacher Training with Stuti and had an excellent experience.", rating: 5, status: "Active", order: 2 },
  { id: "t3", type: "text", name: "Neeraj Neeru", role: "Yoga Practitioner", avatar: "/images/reviews/neeraj.jpg", quote: "I'm truly grateful for the AYM Teacher Training classes. The teachers' attention to detail and patient guidance helped me improve my practice.", rating: 5, status: "Active", order: 3 },
];

/* ── Stars preview ── */
const StarsPreview = ({ count }: { count: number }) => (
  <span className={styles.starsPreview}>{"★".repeat(count)}{"☆".repeat(5 - count)}</span>
);

export default function TestimonialsListPage() {
  const [activeTab, setActiveTab] = useState<ReviewType>("video");
  const [videoList, setVideoList] = useState<VideoTestimonial[]>([]);
  const [textList, setTextList] = useState<TextReview[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ id: string; type: ReviewType } | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const { isMobile, isTablet, width } = useBreakpoint();
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    // const res = await api.get("/testimonials");
    setVideoList(MOCK_VIDEO);
    setTextList(MOCK_TEXT);
  }, []);

  const list: AnyReview[] = activeTab === "video" ? videoList : textList;
  const setList = (newList: AnyReview[]) => {
    if (activeTab === "video") setVideoList(newList as VideoTestimonial[]);
    else setTextList(newList as TextReview[]);
  };

  /* ── Drag reorder ── */
  const handleDragStart = (i: number) => { dragIndex.current = i; };
  const handleDragEnter = (i: number) => {
    if (dragIndex.current === null || dragIndex.current === i) return;
    const arr = [...list];
    const [moved] = arr.splice(dragIndex.current, 1);
    arr.splice(i, 0, moved);
    dragIndex.current = i;
    setList(arr.map((r, idx) => ({ ...r, order: idx + 1 })));
  };
  const handleDragEnd = () => {
    dragIndex.current = null;
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...list];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setList(arr.map((r, idx) => ({ ...r, order: idx + 1 })));
  };
  const moveDown = (i: number) => {
    if (i === list.length - 1) return;
    const arr = [...list];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    setList(arr.map((r, idx) => ({ ...r, order: idx + 1 })));
  };

  const toggleStatus = (id: string) => {
    setList(list.map((r) => r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r));
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    const newList = list.filter((r) => r.id !== deleteModal.id).map((r, i) => ({ ...r, order: i + 1 }));
    setList(newList);
    setDeleteModal(null);
  };

  /* ── Sub-components ── */
  const Status = ({ r }: { r: AnyReview }) => (
    <button className={`${styles.statusBadge} ${r.status === "Active" ? styles.statusActive : styles.statusInactive}`} onClick={() => toggleStatus(r.id)}>
      <span className={styles.statusDot} />{r.status}
    </button>
  );

  const Arrows = ({ i }: { i: number }) => (
    <div className={styles.arrowGroup}>
      <button className={styles.arrowBtn} onClick={() => moveUp(i)} disabled={i === 0}>▲</button>
      <button className={styles.arrowBtn} onClick={() => moveDown(i)} disabled={i === list.length - 1}>▼</button>
    </div>
  );

  const Actions = ({ r }: { r: AnyReview }) => (
    <div className={styles.actionBtns}>
      <Link href={`testimonials/edit/${r.id}?type=${r.type}`} className={styles.editBtn}>
        <span>✎</span><span className={styles.btnLabel}> Edit</span>
      </Link>
      <button className={styles.deleteBtn} onClick={() => setDeleteModal({ id: r.id, type: r.type })}>
        <span>✕</span><span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  /* ── Mobile Cards ── */
  const MobileCards = () => (
    <div className={styles.cardList}>
      {list.map((r, i) => {
        const vid = r.type === "video" ? getYoutubeId((r as VideoTestimonial).youtubeId) : "";
        return (
          <div key={r.id} className={styles.card} draggable
            onDragStart={() => handleDragStart(i)} onDragEnter={() => handleDragEnter(i)}
            onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
            <div className={styles.cardHeader}>
              <div className={styles.cardOrderBlock}>
                <span className={styles.orderBadge}>{r.order}</span>
                <Arrows i={i} />
              </div>
              <div className={styles.cardBody}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  {r.type === "video"
                    ? <span className={`${styles.reviewType} ${styles.reviewTypeVideo}`}>▶ Video</span>
                    : <span className={`${styles.reviewType} ${styles.reviewTypeText}`}>✦ Text</span>
                  }
                  <StarsPreview count={r.rating} />
                </div>
                <p className={styles.reviewName}>{r.name}</p>
                <p className={styles.reviewMeta}>
                  {r.type === "video"
                    ? `${(r as VideoTestimonial).flag} ${(r as VideoTestimonial).country} · ${(r as VideoTestimonial).course}`
                    : (r as TextReview).role}
                </p>
                <p className={styles.reviewQuotePreview}>{r.quote}</p>
                {r.type === "video" && vid && (
                  <div className={styles.cardMeta} style={{ marginTop: "0.4rem" }}>
                    <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" className={styles.ytThumb}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <div className={styles.cardTags}><Status r={r} /></div>
              </div>
              <span className={styles.dragHandle}>⠿</span>
            </div>
            <div className={styles.cardFooter}><Actions r={r} /></div>
          </div>
        );
      })}
    </div>
  );

  /* ── Tablet Table ── */
  const TabletTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 52 }}>#</th>
            <th>Name / Details</th>
            <th style={{ width: 90 }}>Rating</th>
            <th style={{ width: 100 }}>Status</th>
            <th style={{ width: 130 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r, i) => {
            const vid = r.type === "video" ? getYoutubeId((r as VideoTestimonial).youtubeId) : "";
            return (
              <tr key={r.id} className={styles.row} draggable
                onDragStart={() => handleDragStart(i)} onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
                <td className={styles.tdOrder}>
                  <span className={styles.orderBadge}>{r.order}</span>
                  <Arrows i={i} />
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                    {r.type === "video" && vid
                      ? <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" className={styles.ytThumb} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <div className={styles.avatarFallback}>{r.name.charAt(0)}</div>
                    }
                    <div>
                      <p className={styles.reviewName}>{r.name}</p>
                      <p className={styles.reviewMeta}>
                        {r.type === "video" ? `${(r as VideoTestimonial).flag} ${(r as VideoTestimonial).country}` : (r as TextReview).role}
                      </p>
                      <p className={styles.reviewQuotePreview}>{r.quote}</p>
                    </div>
                  </div>
                </td>
                <td className={styles.tdCenter}><StarsPreview count={r.rating} /></td>
                <td className={styles.tdCenter}><Status r={r} /></td>
                <td className={styles.tdCenter}><Actions r={r} /></td>
              </tr>
            );
          })}
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
            <th style={{ width: 70 }}>Preview</th>
            <th>Name</th>
            <th>{activeTab === "video" ? "Country / Course" : "Role"}</th>
            {width >= 1024 && <th>Quote Preview</th>}
            <th style={{ width: 90 }}>Rating</th>
            <th style={{ width: 110 }}>Status</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r, i) => {
            const vid = r.type === "video" ? getYoutubeId((r as VideoTestimonial).youtubeId) : "";
            return (
              <tr key={r.id} className={styles.row} draggable
                onDragStart={() => handleDragStart(i)} onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}>
                <td className={styles.tdCenter}><span className={styles.orderBadge}>{r.order}</span></td>
                <td>
                  <div className={styles.dragGroup}>
                    <span className={styles.dragHandle}>⠿</span>
                    <Arrows i={i} />
                  </div>
                </td>
                <td className={styles.tdCenter}>
                  {r.type === "video" && vid
                    ? <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" className={styles.ytThumb} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : <div className={styles.avatarFallback}>{r.name.charAt(0)}</div>
                  }
                </td>
                <td><p className={styles.reviewName}>{r.name}</p></td>
                <td>
                  <p className={styles.reviewMeta}>
                    {r.type === "video"
                      ? <>{(r as VideoTestimonial).flag} {(r as VideoTestimonial).country}<br /><span className={styles.metaChip}>{(r as VideoTestimonial).course}</span></>
                      : (r as TextReview).role}
                  </p>
                </td>
                {width >= 1024 && <td><p className={styles.reviewQuotePreview}>{r.quote}</p></td>}
                <td className={styles.tdCenter}><StarsPreview count={r.rating} /></td>
                <td className={styles.tdCenter}><Status r={r} /></td>
                <td className={styles.tdCenter}><Actions r={r} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.page}>
      {savedToast && <div className={styles.toast}>✦ Order updated successfully</div>}

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Testimonials</h1>
          <p className={styles.pageSubtitle}>
            {isMobile ? "Drag cards · tap arrows to reorder" : "Drag rows to reorder · click status to toggle"}
          </p>
        </div>
        <Link href={`/admin/dashboard/testimonialsvideo/add-new?type=${activeTab}`} className={styles.addBtn}>
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add {activeTab === "video" ? "Video" : "Text"} Review</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <button className={`${styles.tabBtn} ${activeTab === "video" ? styles.tabActive : ""}`} onClick={() => setActiveTab("video")}>
          ▶ Video ({videoList.length})
        </button>
        <button className={`${styles.tabBtn} ${activeTab === "text" ? styles.tabActive : ""}`} onClick={() => setActiveTab("text")}>
          ✦ Text ({textList.length})
        </button>
      </div>

      {isMobile && <MobileCards />}
      {isTablet && <TabletTable />}
      {!isMobile && !isTablet && <DesktopTable />}

      {list.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No {activeTab} testimonials found. Add your first one.</p>
        </div>
      )}

      {deleteModal && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>Delete this testimonial? This cannot be undone.</p>
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
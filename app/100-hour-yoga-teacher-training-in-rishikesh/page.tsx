"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/assets/style/100-hour-yoga-teacher-training-in-rishikesh/Hundredhouryoga.module.css";
import StickySectionNav from "@/components/common/StickySectionNav";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/6.webp";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
interface SylModule {
  title: string;
  desc: string;
}
interface ScheduleItem {
  time: string;
  label: string;
}

interface ContentData {
  bannerImage: string;
  heroTitle: string;
  heroParagraphs: string[];
  transformTitle: string;
  transformParagraphs: string[];
  whatIsTitle: string;
  whatIsParagraphs: string[];
  whyChooseTitle: string;
  whyChooseParagraphs: string[];
  suitableTitle: string;
  suitableItems: string[];
  syllabusTitle: string;
  syllabusParagraphs: string[];
  syllabusLeft: SylModule[];
  syllabusRight: SylModule[];
  scheduleImage: string;
  scheduleItems: ScheduleItem[];
  soulShineText: string;
  soulShineImage: string;
  enrollTitle: string;
  enrollParagraphs: string[];
  enrollItems: string[];
  comprehensiveTitle: string;
  comprehensiveParagraphs: string[];
  certTitle: string;
  certParagraphs: string[];
  registrationTitle: string;
  registrationParagraphs: string[];
  includedItems: string[];
  notIncludedItems: string[];
  videoUrl?: string;
}

interface SeatBatch {
  _id: string;
  startDate: string;
  endDate: string;
  usdFee: string;
  inrFee: string;
  dormPrice: number;
  twinPrice: number;
  privatePrice: number;
  totalSeats: number;
  bookedSeats: number;
  note: string;
}
const NAV_ITEMS = [
  { label: "DATES & FEES", id: "dates-fees" },
  { label: "CURRICULUM", id: "curriculum" },
  { label: "INCLUSIONS", id: "inclusions" },
  { label: "FACILITY", id: "facility" },
  { label: "LOCATION", id: "location" },
];
/* ══════════════════════════════
   IMAGE HELPER
══════════════════════════════ */
const imgUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${API_URL}${path}`;
};

/* ══════════════════════════════
   DATE FORMATTER
══════════════════════════════ */
const formatDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
};

const shortDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const d = (dt: Date) =>
    dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${d(s)} – ${d(e)}`;
};

const monthYear = (start: string) => {
  const s = new Date(start);
  return s.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

/* ══════════════════════════════
   SVG ICONS FOR INFO CARD
══════════════════════════════ */
const DurationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);
const LevelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="5" height="7" rx="1" />
    <rect x="9.5" y="9" width="5" height="12" rx="1" />
    <rect x="17" y="4" width="5" height="17" rx="1" />
  </svg>
);
const CertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 17v4M16 17v4M8 21h8" />
    <path d="M9 10l2 2 4-4" />
  </svg>
);
const StyleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="1.5" />
    <path d="M12 6v5.5" />
    <path d="M8.5 13c0 2 1.5 4 3.5 4.5 2-0.5 3.5-2.5 3.5-4.5" />
    <path d="M10 18l-1.5 3.5M14 18l1.5 3.5" />
    <path d="M7 11l5 2.5 5-2.5" />
  </svg>
);
const LangIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const DateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="currentColor" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
    <circle cx="16" cy="15" r="1" fill="currentColor" />
  </svg>
);

const getVideoType = (url: string) => {
  if (!url) return "none";

  if (url.includes("youtube.com") || url.includes("youtu.be"))
    return "youtube";

  if (url.includes("instagram.com"))
    return "instagram";

  if (url.endsWith(".mp4"))
    return "mp4";

  return "unknown";
};

const getYouTubeEmbed = (url: string) => {
  let videoId = "";

  if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("shorts")) {
    videoId = url.split("shorts/")[1]?.split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  }

  return videoId
  ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`
  : "";
};
const getInstagramEmbed = (url: string) => {
  const match = url.match(/instagram\.com\/reel\/([^/?]+)/);
  return match
    ? `https://www.instagram.com/reel/${match[1]}/embed`
    : "";
};

function DynamicVideo({ url }: { url: string }) {
  const type = getVideoType(url);

  if (type === "youtube") {
  const embedUrl = getYouTubeEmbed(url);

  if (!embedUrl) return <p>Invalid video URL</p>;

  return (
    <iframe
      className={styles.video}
      src={embedUrl}
      title="YouTube Video"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
}

  if (type === "instagram") {
    return (
      <iframe
        className={styles.video}
        src={getInstagramEmbed(url)}
        title="Instagram Reel"
        frameBorder="0"
        allowFullScreen
      />
    );
  }

  if (type === "mp4") {
    return (
<video
  autoPlay
  loop
  muted
  playsInline
  controls={false}
  className={styles.video}
>
  <source src="/uploads/yoga-video.mp4" type="video/mp4" />
</video>
    );
  }

  return <p>No video available</p>;
}

/* ══════════════════════════════════════════════════
   COURSE INFO CARD
══════════════════════════════════════════════════ */
function CourseInfoCard({ seats }: { seats: SeatBatch[] }) {
  const available = seats.filter((s) => s.totalSeats - s.bookedSeats > 0);
  const startingPrice = available.length > 0
    ? Math.min(...available.map((s) => s.dormPrice))
    : 499;
  const originalPrice = Math.round((startingPrice * 1.8) / 50) * 50;

  const details = [
    { icon: <DurationIcon />, label: "DURATION", value: "13 Days" },
    { icon: <LevelIcon />, label: "LEVEL", value: "Beginner" },
    { icon: <CertIcon />, label: "CERTIFICATION", value: "100 Hour" },
    {
      icon: <StyleIcon />, label: "YOGA STYLE",
      value: "Multistyle",
      sub: "Ashtanga, Vinyasa & Hatha",
    },
    { icon: <LangIcon />, label: "LANGUAGE", value: "English & Hindi" },
    { icon: <DateIcon />, label: "DATE", value: "1st to 13th of every month" },
  ];

  return (
    <div className={styles.icWrap}>
      <div className={styles.icCard}>
        {/* LEFT – details */}
        <div className={styles.icLeft}>
          <div className={styles.icHdr}>
            <span className={styles.icHdrTxt}>COURSE DETAILS</span>
          </div>
          <div className={styles.icGrid}>
            {details.map((d, i) => (
              <div key={i} className={styles.icItem}>
                <div className={styles.icIcon}>{d.icon}</div>
                <div className={styles.icBody}>
                  <div className={styles.icLbl}>{d.label}</div>
                  <div className={styles.icVal}>{d.value}</div>
                  {d.sub && <div className={styles.icSub}>{d.sub}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className={styles.icVDiv} />

        {/* RIGHT – fee */}
        <div className={styles.icRight}>
          <div className={styles.icFeeTop}>
            <span className={styles.icFeeLbl}>COURSE FEE</span>
            <span className={styles.icFeeFrom}>starting from</span>
          </div>
          <div className={styles.icPriceRow}>
            <span className={styles.icPriceOld}>${originalPrice}</span>
            <span className={styles.icPriceNew}>${startingPrice}</span>
            <span className={styles.icPriceCur}>USD</span>
          </div>
          <a href="#dates-fees" className={styles.icBookBtn}>
            BOOK NOW
            <svg viewBox="0 0 20 20" fill="none" className={styles.icBtnArrow}>
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}




/* ══════════════════════════════
   OM DIVIDER
══════════════════════════════ */
function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.omDivider}>
      <div className={styles.divLineLeft} />
      <div className={styles.omDividerCenter}>
        {label && <span className={styles.omDividerLabel}>{label}</span>}
      </div>
      <div className={styles.divLineRight} />
    </div>
  );
}

/* ══════════════════════════════
   CORNER ORNAMENT
══════════════════════════════ */
function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];
  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.cornerOrn}
      style={{ transform: flip }}
    >
      <path d="M2,2 L2,18 M2,2 L18,2" stroke="#b8860b" strokeWidth="1.5" fill="none" />
      <path d="M2,2 Q8,8 16,2 Q8,8 2,16" stroke="#b8860b" strokeWidth="0.7" fill="none" />
      <circle cx="2" cy="2" r="2" fill="#b8860b" opacity="0.7" />
      <circle cx="10" cy="10" r="1.5" fill="#b8860b" opacity="0.4" />
    </svg>
  );
}

/* ══════════════════════════════
   VINTAGE HEADING
══════════════════════════════ */
function VintageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.vintageHeadingWrap}>
      <h2 className={styles.vintageHeading}>{children}</h2>
      <div className={styles.vintageHeadingUnderline}>
        <svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" className={styles.headingUndSvg}>
          <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#e07b00" strokeWidth="1.2" fill="none" />
          <circle cx="100" cy="4" r="3" fill="#e07b00" opacity="0.7" />
          <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
          <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PREMIUM SEAT BOOKING SECTION
══════════════════════════════════════════════════ */
function PremiumSeatBooking({ seats }: { seats: SeatBatch[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (seats.length === 0) return;
    const firstAvailable = seats.find((s) => s.totalSeats - s.bookedSeats > 0);
    if (firstAvailable) setSelectedId(firstAvailable._id);
  }, [seats]);

  const selected = seats.find((s) => s._id === selectedId) ?? null;

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <VintageHeading>100 Hour Yoga Teacher Training India</VintageHeading>
      <p className={styles.psbSecSub}>
        Choose your dates &amp; preferred accommodation — prices include tuition and meals
      </p>
      <div className={styles.psbOrnLine}>
        <div className={styles.psbOrnL} />
        <div className={styles.psbOrnDiamond} />
        <div className={styles.psbOrnR} />
      </div>

      <div className={styles.psbLayout}>
        {/* LEFT */}
        <div className={styles.psbLeftPanel}>
          <div className={`${styles.psbCn} ${styles.psbCnTl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnTr}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBr}`} />

          <div className={styles.psbLph}>
            <span className={styles.psbLphTitle}>Select Your Batch</span>
            <div className={styles.psbLegend}>
              <div className={styles.psbLegItem}>
                <div className={`${styles.psbLegDot} ${styles.psbDGreen}`} />Available
              </div>
              <div className={styles.psbLegItem}>
                <div className={`${styles.psbLegDot} ${styles.psbDOrange}`} />Limited
              </div>
              <div className={styles.psbLegItem}>
                <div className={`${styles.psbLegDot} ${styles.psbDRed}`} />Full
              </div>
            </div>
          </div>

          {seats.length === 0 ? (
            <p className={styles.psbNoBatches}>No upcoming batches available at the moment.</p>
          ) : (
            <div className={styles.psbBatchGrid}>
              {seats.map((batch) => {
                const rem = batch.totalSeats - batch.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 5;
                const dotCls = full ? styles.psbDRed : low ? styles.psbDOrange : styles.psbDGreen;
                const txtCls = full ? styles.psbSRed : low ? styles.psbSOrange : styles.psbSGreen;
                const statusTxt = full ? "Fully Booked" : low ? "Limited" : "Available";
                const seatsPercent = Math.max(5, (rem / batch.totalSeats) * 100);
                const isSelected = selectedId === batch._id;

                return (
                  <div
                    key={batch._id}
                    className={[styles.psbBc, full ? styles.psbBcFull : "", isSelected ? styles.psbBcSel : ""].filter(Boolean).join(" ")}
                    onClick={() => { if (!full) setSelectedId(batch._id); }}
                  >
                    <div className={styles.psbBcTick}>
                      <svg viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={styles.psbBcMonth}>{monthYear(batch.startDate)}</div>
                    <div className={styles.psbBcDates}>{shortDateRange(batch.startDate, batch.endDate)}</div>
                    <div className={styles.psbBcStatus}>
                      <div className={`${styles.psbBcDot} ${dotCls}`} />
                      <span className={`${styles.psbBcStxt} ${txtCls}`}>{statusTxt}</span>
                    </div>
                    {!full && (
                      <>
                        <div className={styles.psbBcSeatsBar}>
                          <div className={styles.psbBcSeatsBarFill} style={{
                            width: `${seatsPercent}%`,
                            background: low ? "linear-gradient(90deg,#c8700a,#e09030)" : "linear-gradient(90deg,#3d6000,#6aa000)",
                          }} />
                        </div>
                        <span className={styles.psbBcSeatsBadge} style={{ color: low ? "#c8700a" : "#3d6000" }}>
                          {rem} / {batch.totalSeats} seats left
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className={styles.psbRightPanel}>
          <div className={`${styles.psbCn} ${styles.psbCnTl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnTr}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBr}`} />

          <div className={styles.psbRpHead}>
            <div className={styles.psbRpEyebrow}>Course Overview</div>
            <div className={styles.psbRpCourse}>100 Hour Yoga Teacher Training</div>
            <div className={styles.psbRpDur}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" />
                <path d="M8 4.5V8.5L10.5 10" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className={styles.psbRpDurTxt}>13 Days · Rishikesh, India</span>
            </div>
          </div>

          <div className={styles.psbRpBody}>
            <div className={styles.psbPriceLbl}>With Accommodation</div>
            <div className={styles.psbPriceRow}>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>${selected ? selected.privatePrice : "—"}<span className={styles.psbPcCur}>USD</span></div>
                <div className={styles.psbPcLbl}>Private Room</div>
              </div>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>${selected ? selected.twinPrice : "—"}<span className={styles.psbPcCur}>USD</span></div>
                <div className={styles.psbPcLbl}>Twin / Shared</div>
              </div>
            </div>

            <div className={styles.psbPriceLbl}>Without Accommodation</div>
            <div className={styles.psbPriceWide}>
              <div className={styles.psbPwLeft}>
                <span className={styles.psbPcAmt} style={{ fontSize: "1rem" }}>${selected ? selected.dormPrice : "—"}</span>
                <span className={styles.psbPcCur}>USD</span>
              </div>
              <span className={styles.psbFoodBadge}>Food Included</span>
            </div>

            {selected && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>Indian Price</span>
                <span className={styles.psbInrAmt}>{selected.inrFee}</span>
              </div>
            )}

            <div className={styles.psbDivider} />

            {selected && (
              <div className={styles.psbRpSeatsWrap}>
                {(() => {
                  const rem = selected.totalSeats - selected.bookedSeats;
                  const full = rem <= 0;
                  const low = !full && rem <= 5;
                  const pct = full ? 100 : Math.round((selected.bookedSeats / selected.totalSeats) * 100);
                  return (
                    <>
                      <div className={styles.psbRpSeatsRow}>
                        <span className={styles.psbRpSeatsLbl}>Seats Availability</span>
                        <span className={styles.psbRpSeatsBadge} style={{
                          color: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000",
                          borderColor: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000",
                        }}>
                          {full ? "Fully Booked" : `${rem} of ${selected.totalSeats} left`}
                        </span>
                      </div>
                      <div className={styles.psbRpSeatsBar}>
                        <div className={styles.psbRpSeatsBarFill} style={{
                          width: `${pct}%`,
                          background: full ? "#8a2c00" : low ? "linear-gradient(90deg,#c8700a,#e09030)" : "linear-gradient(90deg,#3d6000,#6aa000)",
                        }} />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <div className={styles.psbSelDisplay}>
              {selected ? (
                <>
                  <div className={styles.psbSelLabel}>Selected Batch</div>
                  <div className={styles.psbSelDate}>{shortDateRange(selected.startDate, selected.endDate)}, {monthYear(selected.startDate)}</div>
                </>
              ) : (
                <span className={styles.psbSelHint}>← Select a batch to continue</span>
              )}
            </div>

            {selected ? (
              <a href={`/yoga-registration?batchId=${selected._id}&type=100hr`} className={styles.psbBookBtn}>
                Book Now
                <svg className={styles.psbArrowIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff3d2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : (
              <span className={`${styles.psbBookBtn} ${styles.psbBookBtnDis}`}>Book Now</span>
            )}

            {selected?.note && (
              <p className={styles.psbNote}><strong>Note:</strong> {selected.note}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   SKELETON LOADER
══════════════════════════════ */
function SkeletonBlock({ h = 24, w = "100%" }: { h?: number; w?: string }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 6, marginBottom: 12,
      background: "linear-gradient(90deg,#f0e8d8 25%,#e8d9c0 50%,#f0e8d8 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

/* ══════════════════════════════
   PAGE COMPONENT
══════════════════════════════ */
export default function HundredHourYoga() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("include");

  useEffect(() => {
    Promise.all([
      api.get("/100hr-content/get"),
      api.get("/100hr-seats/get-all-batches"),
    ])
      .then(([contentRes, seatsRes]) => {
        setContent(contentRes.data.data ?? null);
        setSeats(seatsRes.data.data ?? []);
      })
      .catch((err) => console.error("Failed to fetch page data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className={styles.root} style={{ padding: "4rem 2rem" }}>
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        {[...Array(6)].map((_, i) => <SkeletonBlock key={i} h={i === 0 ? 400 : 28} />)}
      </div>
    );

  if (!content)
    return (
      <div className={styles.root} style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "serif", color: "#8b4513", fontSize: "1.2rem" }}>
          Content not available yet. Please check back soon.
        </p>
      </div>
    );

  return (
    <div className={styles.root}>
      <div className={styles.grainOverlay} aria-hidden="true" />

      {/* ══ HERO IMAGE ══ */}
      <section id="hero" className={styles.heroSection}>
        {content.bannerImage ? (
          <img
            src={imgUrl(content.bannerImage)}
            alt="100 Hour Yoga Teacher Training"
            className={styles.heroImage}
            style={{ width: "100%", objectFit: "cover" }}
          />
        ) : (
          <Image
            src={heroImg}
            alt="Yoga Students Group"
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        )}
      </section>

      {/* ══ COURSE INFO CARD (NEW) ══ */}
      <CourseInfoCard seats={seats} />
      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />
      {/* ══ HERO TEXT ══ */}
      <section className={styles.heroSection2}>
        <div className={styles.heroMandalaBg} aria-hidden="true" />
        <div className={styles.heroTextWrap}>
          <div className={styles.heroTitleRow}>
            <div className={styles.heroTitleLine} />
            <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
            <div className={styles.heroTitleLine} />
          </div>
          {content.heroParagraphs.map((para, i) => (
            <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      </section>

      {/* ══ TRANSFORM + WHAT IS + WHY CHOOSE + SUITABLE ══ */}
      <section className={styles.contentSection}>
        <VintageHeading>{content.transformTitle}</VintageHeading>
        {content.transformParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <OmDivider />
        <VintageHeading>{content.whatIsTitle}</VintageHeading>
        {content.whatIsParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <OmDivider />
        <VintageHeading>{content.whyChooseTitle}</VintageHeading>
        {content.whyChooseParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <OmDivider />
        <VintageHeading>{content.suitableTitle}</VintageHeading>
        <ol className={styles.vintageList}>
          {content.suitableItems.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      </section>

      {/* ══ PREMIUM SEAT BOOKING — id="dates-fees" is set inside ══ */}
      <PremiumSeatBooking seats={seats} />

      {/* ══ SYLLABUS ══ */}
      <section id="curriculum" className={styles.contentSection}>
        <OmDivider label="Curriculum" />
        <VintageHeading>{content.syllabusTitle}</VintageHeading>
        {content.syllabusParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <div className={styles.syllabusGrid}>
          <div className={styles.syllabusCard}>
            {content.syllabusLeft.map((m, i) => (
              <div key={i} className={styles.syllabusModule}>
                <div>
                  <h3 className={styles.syllabusModuleTitle}>{m.title}</h3>
                  <p className={styles.syllabusModuleDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.syllabusCard}>
            {content.syllabusRight.map((m, i) => (
              <div key={i} className={styles.syllabusModule}>
                <div>
                  <h3 className={styles.syllabusModuleTitle}>{m.title}</h3>
                  <p className={styles.syllabusModuleDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DAILY SCHEDULE ══ */}
 <section id="facility" className={styles.scheduleSection}>

  {/* background blobs */}
  <div className={styles.blob1} />
  <div className={styles.blob2} />

  <div className={styles.container}>

    {/* ── LEFT VIDEO ── */}
  <div className={styles.videoSide}>
  <div className={styles.videoWrapper}>
    <DynamicVideo url={content.videoUrl || "https://youtube.com/shorts/lYeh7tUMLHQ?si=03G0hoIXn8S7neyp"} />
  </div>

  <div className={styles.videoOverlay} />

  <div className={styles.videoBadge}>
    <span className={styles.pulseDot} />
    Live Classes Daily
  </div>
</div>

    {/* ── CENTER IMAGE (BACKEND) ── */}
    {content.scheduleImage && (
      <div className={styles.centerImage}>
        <img src={imgUrl(content.scheduleImage)} alt="Yoga" />
        <div className={styles.centerBadge}>Since 2010</div>
      </div>
    )}

    {/* ── RIGHT CARDS ── */}
    <div className={styles.cardsSide}>
      <span className={styles.eyebrow}>Our Routine</span>
      <h2 className={styles.heading}>Daily Schedule</h2>

      <div className={styles.scheduleGrid}>
        {content.scheduleItems.map((item, i) => (
          <div
            key={i}
            className={styles.chip}
            style={{ "--i": i } as React.CSSProperties}
          >
            <div className={styles.iconBox}>
              <span className={styles.num}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className={styles.chipText}>
              <span className={styles.time}>{item.time}</span>
              <p>{item.label}</p>
            </div>

            <div className={styles.glow} />
          </div>
        ))}
      </div>
    </div>

  </div>
</section>

      {/* ══ SOUL SHINE + ENROLL + FEE ══ */}
      <section id="inclusions" className={styles.contentSection}>
        <OmDivider />
        <div className={styles.classBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <img
            src={content.soulShineImage ? imgUrl(content.soulShineImage) : "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1400&q=80"}
            alt="Yoga class Rishikesh"
            className={styles.classBannerImg}
          />
          <div className={styles.classBannerOverlay} />
          <span className={styles.letYourSoul}>{content.soulShineText || "Let Your Soul Shine"}</span>
        </div>
        <OmDivider />
        <VintageHeading>{content.enrollTitle}</VintageHeading>
        {content.enrollParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <ol className={styles.vintageList}>
          {content.enrollItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ol>
        <OmDivider />
        <VintageHeading>{content.comprehensiveTitle}</VintageHeading>
        {content.comprehensiveParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <OmDivider />
        <VintageHeading>{content.certTitle}</VintageHeading>
        {content.certParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <OmDivider />
        <VintageHeading>{content.registrationTitle}</VintageHeading>
        {content.registrationParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <div className={styles.incWrap}>
  
  {/* Tabs */}
  <div className={styles.incTabs}>
    <button
      className={`${styles.incTab} ${activeTab === "include" ? styles.active : ""}`}
      onClick={() => setActiveTab("include")}
    >
      ✓ What Is Included?
    </button>

    <button
      className={`${styles.incTab} ${activeTab === "exclude" ? styles.active : ""}`}
      onClick={() => setActiveTab("exclude")}
    >
      ✕ What Is Not Included?
    </button>
  </div>

  {/* Content */}
  <div className={styles.incContent}>
    <ul className={styles.incList}>
      {(activeTab === "include"
        ? content.includedItems
        : content.notIncludedItems
      )?.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  </div>

</div>
      </section>

      {/* ══ LOCATION ══ */}
      <div id="location">
        <HowToReach />
      </div>
    </div>
  );
}
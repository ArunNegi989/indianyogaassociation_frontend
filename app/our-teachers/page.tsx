"use client";
import React, { useState, useEffect } from "react";
import styles from "@/assets/style/our-teachers/Teachers.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Link from "next/link";
import api from "@/lib/api";

interface Founder {
  _id: string; name: string; subtitle: string;
  sectionLabel?: string; estYear?: string; ctaText?: string;
  bio: string[]; image: string;
}
interface Teacher {
  _id: string; name: string; role: string; years: string;
  order?: number; bio: string[]; education: string[];
  expertise: string[]; image: string;
}
interface GuestTeacher {
  _id: string; name: string; image: string; bio: string[]; order?: number;
}

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 8;

// ── Ornate Gold SVG Frame ─────────────────────────────────────────
const OrnateFrame: React.FC<{ src: string; alt: string; size?: "lg" | "md" | "sm" }> = ({ src, alt, size = "md" }) => (
  <div className={`${styles.frameWrap} ${styles[`frame${size.toUpperCase()}`]}`}>
    <svg className={styles.frameOrnament} viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f5b800" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="140" cy="140" r="135" fill="url(#goldGlow)" />
      <circle cx="140" cy="140" r="108" fill="none" stroke="#c8900a" strokeWidth="4" />
      <circle cx="140" cy="140" r="104" fill="none" stroke="#f5b800" strokeWidth="1.5" opacity="0.85" />
      <circle cx="140" cy="140" r="99" fill="none" stroke="#d4a017" strokeWidth="0.8" opacity="0.5" />
      {Array.from({ length: 18 }, (_, i) => (
        <g key={i} transform={`rotate(${(i * 360) / 18}, 140, 140)`}>
          <ellipse cx="140" cy="31" rx="3" ry="7.5" fill="#c8900a" opacity="0.9" />
          <ellipse cx="140" cy="27" rx="1.8" ry="4" fill="#f5d040" opacity="0.85" />
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${(i * 360) / 8 + 22.5}, 140, 140)`}>
          <ellipse cx="140" cy="21" rx="7" ry="15" fill="#b87d08" opacity="0.9" />
          <ellipse cx="140" cy="16" rx="4" ry="8" fill="#d4a017" opacity="0.88" />
          <circle cx="140" cy="7" r="4" fill="#f5c030" opacity="0.95" />
          <circle cx="140" cy="3" r="2.2" fill="#fff0a0" opacity="0.9" />
        </g>
      ))}
      {[0, 90, 180, 270].map((angle) => (
        <g key={angle} transform={`rotate(${angle}, 140, 140)`}>
          <ellipse cx="140" cy="13" rx="11" ry="20" fill="#9a6a05" opacity="0.92" />
          <ellipse cx="140" cy="10" rx="6.5" ry="12" fill="#c8900a" opacity="0.88" />
          <ellipse cx="128" cy="20" rx="5" ry="11" fill="#b87d08" opacity="0.85" transform="rotate(-28, 128, 20)" />
          <ellipse cx="152" cy="20" rx="5" ry="11" fill="#b87d08" opacity="0.85" transform="rotate(28, 152, 20)" />
          <circle cx="140" cy="3" r="5" fill="#f5c030" opacity="0.97" />
          <circle cx="122" cy="12" r="3" fill="#f5b800" opacity="0.88" />
          <circle cx="158" cy="12" r="3" fill="#f5b800" opacity="0.88" />
          <circle cx="130" cy="27" r="2" fill="#f5d040" opacity="0.8" />
          <circle cx="150" cy="27" r="2" fill="#f5d040" opacity="0.8" />
        </g>
      ))}
      {[45, 135, 225, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle}, 140, 140)`}>
          <ellipse cx="140" cy="19" rx="4.5" ry="9" fill="#c8900a" opacity="0.72" />
          <ellipse cx="140" cy="15" rx="2.5" ry="5" fill="#f5b800" opacity="0.78" />
          <circle cx="140" cy="9" r="2.2" fill="#d4a017" opacity="0.72" />
        </g>
      ))}
      <circle cx="140" cy="140" r="92" fill="#f5e060" opacity="0.22" />
      <circle cx="140" cy="140" r="88" fill="#fdf8e8" opacity="0.55" />
    </svg>
    <img src={src} alt={alt} className={styles.framePhoto} />
  </div>
);

// ── Om Divider ────────────────────────────────────────────────────
const OmDivider: React.FC<{ color?: "saffron" | "gold" }> = ({ color = "saffron" }) => (
  <div className={`${styles.omDivider} ${color === "gold" ? styles.omDividerGold : ""}`}>
    <span className={styles.omLine} />
    <div className={styles.omCircle}><span className={styles.omGlyph}>ॐ</span></div>
    <span className={styles.omLine} />
  </div>
);

const GoldSep: React.FC = () => <div className={styles.goldSep} />;

// ── Guest Modal ───────────────────────────────────────────────────
const GuestModal: React.FC<{ teacher: GuestTeacher; apiUrl: string; onClose: () => void }> = ({ teacher, apiUrl, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalGoldTop} />
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <div className={styles.modalBody}>
          <div className={styles.modalImgWrap}>
            <OrnateFrame src={`${apiUrl}${teacher.image}`} alt={teacher.name} size="lg" />
            <div className={styles.modalDividerRow}>
              <span className={`${styles.modalDividerLine} ${styles.modalDividerLineLeft}`} />
              <span className={styles.modalDividerOm}>ॐ</span>
              <span className={`${styles.modalDividerLine} ${styles.modalDividerLineRight}`} />
            </div>
            <h3 className={styles.modalName}>{teacher.name}</h3>
            <span className={styles.modalBadge}>✨ Guest Faculty</span>
          </div>
          {teacher.bio && teacher.bio.length > 0 && (
            <div className={styles.modalBioWrap}>
              {teacher.bio.map((para, i) => (
                <p key={i} className={styles.modalBioPara}>{para}</p>
              ))}
            </div>
          )}
        </div>
        <div className={styles.modalGoldBottom} />
      </div>
    </div>
  );
};

// ── Teacher Card ─────────────────────────────────────────────────
const TeacherCard: React.FC<{ teacher: Teacher; idx: number }> = ({ teacher, idx }) => {
  const [open, setOpen] = useState(false);
  const isEven = idx % 2 === 1;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  return (
    <div className={`${styles.tCard} ${isEven ? styles.tCardReverse : ""}`}>
      <div className={styles.tImgCol}>
        <div className={styles.tImgWrapper}>
          <img src={`${API_URL}${teacher.image}`} alt={teacher.name} className={styles.tImg} />
          <div className={styles.tYearsBadge}>{teacher.years}</div>
          <div className={styles.tImgOverlay} />
        </div>
      </div>
      <div className={styles.tContent}>
        <div className={styles.tRoleTag}>{teacher.role}</div>
        <h3 className={styles.tName}>{teacher.name}</h3>
        <div className={styles.tDivider} />
        <div className={styles.tBio}>
          {Array.isArray(teacher.bio)
            ? teacher.bio.map((para, i) => <p key={i}>{para}</p>)
            : <p>{teacher.bio}</p>}
        </div>
        <div className={`${styles.tDetails} ${open ? styles.tDetailsOpen : ""}`}>
          <div className={styles.tDetailBlock}>
            <h4 className={styles.tDetailTitle}><span className={styles.tDetailIcon}>🎓</span> Education</h4>
            <ul className={styles.tList}>{teacher.education?.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
          <div className={styles.tDetailBlock}>
            <h4 className={styles.tDetailTitle}><span className={styles.tDetailIcon}>✦</span> Expertise</h4>
            <div className={styles.tChips}>
              {teacher.expertise?.map((e, i) => <span key={i} className={styles.tChip}>{e}</span>)}
            </div>
          </div>
        </div>
        <button className={styles.tToggle} onClick={() => setOpen(!open)}>
          {open ? "Show Less ▲" : "View Full Profile ▼"}
        </button>
      </div>
    </div>
  );
};

// ── Guest Faculty Section ─────────────────────────────────────────
const GuestFacultySection: React.FC<{
  guestTeachers: GuestTeacher[];
  loading: boolean;
  apiUrl: string;
  onSelect: (t: GuestTeacher) => void;
}> = ({ guestTeachers, loading, apiUrl, onSelect }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visibleTeachers = guestTeachers.slice(0, visibleCount);
  const hasMore = visibleCount < guestTeachers.length;
  const canCollapse = visibleCount > INITIAL_COUNT;

  return (
    <section className={styles.guestSection}>
      <div className={styles.outerPad}>
        <div className={styles.guestHeader}>
          <p className={styles.introEyebrow}>More Experts</p>
          <h2 className={styles.guestTitle}>Guest &amp; Visiting Faculty</h2>
          <OmDivider />
        </div>

        {loading ? (
          <p className={styles.guestLoadingText}>Loading guest teachers…</p>
        ) : guestTeachers.length > 0 ? (
          <>
            <div className={styles.guestGrid}>
              {visibleTeachers.map((t) => (
                <div key={t._id} className={styles.guestItem} onClick={() => onSelect(t)}>
                  <div className={styles.guestFrameWrap}>
                    <OrnateFrame src={`${apiUrl}${t.image}`} alt={t.name} size="sm" />
                    <div className={styles.guestFrameOverlay} />
                  </div>
                  <p className={styles.guestItemName}>{t.name}</p>
                  <p className={styles.guestItemHint}>tap to view</p>
                </div>
              ))}
            </div>

            <p className={styles.guestCounter}>
              Showing {visibleTeachers.length} of {guestTeachers.length} guest teachers
            </p>

            <div className={styles.guestBtnRow}>
              {hasMore && (
                <button
                  className={styles.guestReadMoreBtn}
                  onClick={() => setVisibleCount((p) => p + LOAD_MORE_COUNT)}
                >
                  <span className={styles.guestBtnIcon}>✦</span>
                  Load More Teachers
                  <span className={styles.guestBtnCount}>
                    +{Math.min(LOAD_MORE_COUNT, guestTeachers.length - visibleCount)}
                  </span>
                  <span className={styles.guestBtnArrow}>▼</span>
                </button>
              )}
              {canCollapse && (
                <button
                  className={styles.guestShowLessBtn}
                  onClick={() => setVisibleCount(INITIAL_COUNT)}
                >
                  <span className={styles.guestBtnIcon}>✦</span>
                  Show Less
                  <span className={styles.guestBtnArrow}>▲</span>
                </button>
              )}
            </div>
          </>
        ) : (
          <p className={styles.guestEmptyText}>No guest teachers found.</p>
        )}

        <GoldSep />
      </div>
    </section>
  );
};

// ── Main Component ────────────────────────────────────────────────
const Teachers: React.FC = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const [founder, setFounder] = useState<Founder | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [guestTeachers, setGuestTeachers] = useState<GuestTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<GuestTeacher | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [founderRes, teachersRes, guestRes] = await Promise.all([
          api.get("/founder/get-founder"),
          api.get("/teachers/get-all-teachers"),
          api.get("/guest-teachers/get-all-guest-teachers"),
        ]);
        setFounder(founderRes.data.data || null);
        setTeachers(teachersRes.data.data || []);
        setGuestTeachers(guestRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch teachers data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <>
      <div className={styles.page}>
        <div className={styles.topBorder} />

        {/* HERO */}
        <section className={styles.heroSection}>
          <div className={styles.heroBg} aria-hidden="true" />
          <div className={styles.heroInner}>
            <p className={styles.heroEyebrow}>Our Faculty</p>
            <h1 className={styles.heroTitle}>Yoga Teachers in Rishikesh<br />India at AYM Yoga School</h1>
            <OmDivider />
            <p className={styles.heroSub}>Each of our teachers brings decades of authentic practice, traditional ashram training, and a lifelong dedication to the sacred science of yoga.</p>
            <div className={styles.heroBreadcrumb}>
              <span>Home</span><span className={styles.breadSep}>/</span><span>Our Teachers</span>
            </div>
          </div>
        </section>

        {/* FOUNDER */}
        <section className={styles.founderSection}>
          <div className={styles.outerPad}>
            <div className={styles.secLabel}>{founder?.sectionLabel || "Founder & Director"}</div>
            <GoldSep />
            {loading ? (
              <div className={styles.founderSkeleton} />
            ) : founder ? (
              <div className={styles.founderGrid}>
                <div className={styles.founderImgCol}>
                  <OrnateFrame src={`${API_URL}${founder.image}`} alt={founder.name} size="lg" />
                  <div className={styles.founderImgBadge}>{founder.estYear || "Est. 2005"}</div>
                </div>
                <div className={styles.founderTextCol}>
                  <h2 className={styles.founderName}>{founder.name}</h2>
                  <p className={styles.founderSubtitle}>{founder.subtitle}</p>
                  <div className={styles.founderDivider} />
                  {founder.bio.map((p, i) => <p key={i} className={styles.founderPara}>{p}</p>)}
                  <Link href="/yoga-teacher-india">
                    <button className={styles.founderBtn}>
                      {founder.ctaText || "More Information about " + founder.name}
                      <span className={styles.founderBtnArrow}>→</span>
                    </button>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* FACULTY INTRO */}
        <section className={styles.facultyIntro}>
          <div className={styles.outerPad}>
            <GoldSep />
            <div className={styles.introWrap}>
              <p className={styles.introEyebrow}>Teaching Faculty</p>
              <h2 className={styles.introTitle}>Teaching Faculty — Aym Yoga School, Rishikesh</h2>
              <OmDivider />
              <p className={styles.introDesc}>Our teachers at Aym Yoga School are dedicated practitioners of traditional yoga, sharing authentic knowledge through discipline, compassion, and lived experience.</p>
            </div>
          </div>
        </section>

        {/* TEACHER CARDS */}
        <section className={styles.teachersSection}>
          <div className={styles.outerPad}>
            {loading ? (
              <p className={styles.loadingText}>Loading teachers…</p>
            ) : teachers.length > 0 ? (
              teachers.map((t, idx) => (
                <div key={t._id}>
                  {idx > 0 && <GoldSep />}
                  <TeacherCard teacher={t} idx={idx} />
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No teachers found.</p>
            )}
            <GoldSep />
          </div>
        </section>

        {/* GUEST FACULTY */}
        <GuestFacultySection
          guestTeachers={guestTeachers}
          loading={loading}
          apiUrl={API_URL}
          onSelect={(t) => setSelectedGuest(t)}
        />

        <div className={styles.topBorder} />
      </div>

      <HowToReach />

      {selectedGuest && (
        <GuestModal
          teacher={selectedGuest}
          apiUrl={API_URL}
          onClose={() => setSelectedGuest(null)}
        />
      )}
    </>
  );
};

export default Teachers;
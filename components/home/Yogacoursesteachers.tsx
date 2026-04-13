"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../../assets/style/Home/Yogacoursesteachers.module.css";
import api from "@/lib/api";

/* ══════════════════════════════════════════════════════
   IMAGE URL HELPER
══════════════════════════════════════════════════════ */
function getImageUrl(path: string | undefined | null): string {
  if (!path || path.trim() === "") return "";
  if (/^https?:\/\//.test(path)) return path;
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */
interface CourseItem {
  _id: string;
  hours: string;
  days: string;
  name: string;
  style: string;
  duration: string;
  certificate: string;
  feeShared: string;
  feePrivate: string;
  color: string;
  imgUrl: string;
  detailsLink: string;
  bookLink: string;
}

interface TeacherItem {
  _id: string;
  name: string;
  surname: string;
  imgUrl: string;
}

interface FounderData {
  eyebrow: string;
  name: string;
  imgUrl: string;
  imgAlt: string;
  para1: string;
  para2: string;
  para3: string;
  para3Highlight: string;
  detailsBtnText: string;
  detailsBtnLink: string;
  bookBtnText: string;
  bookBtnLink: string;
}

interface SectionHeader {
  eyebrow: string;
  sectionTitle: string;
  sectionDesc: string;
}

interface WhoData {
  eyebrow: string;
  sectionTitle: string;
  para1: string;
  para2: string;
  para3: string;
  para4: string;
  para5: string;
  chips: string[];
  quoteText: string;
  quoteAttrib: string;
}

interface TeachersHeaderData {
  eyebrow: string;
  sectionTitle: string;
  introPara1: string;
  introPara1Highlight: string;
  introPara2: string;
  introPara2Highlight: string;
  ctaBtnText: string;
  ctaBtnLink: string;
}

interface PageData {
  sectionHeader: SectionHeader;
  courses: CourseItem[];
  who: WhoData;
  teachersHeader: TeachersHeaderData;
  founder: FounderData;
  teachers: TeacherItem[];
}

/* ══════════════════════════════════════════════════════
   HIGHLIGHT HELPER
══════════════════════════════════════════════════════ */
function HighlightedPara({
  text,
  highlight,
  className,
}: {
  text: string;
  highlight: string;
  className?: string;
}) {
  if (!highlight || !text.includes(highlight)) {
    return <p className={className}>{text}</p>;
  }
  const [before, after] = text.split(highlight);
  return (
    <p className={className}>
      {before}
      <strong className={styles.hl}>{highlight}</strong>
      {after}
    </p>
  );
}

/* ══════════════════════════════════════════════════════
   TEACHER MODAL
══════════════════════════════════════════════════════ */
function TeacherModal({
  teacher,
  onClose,
}: {
  teacher: TeacherItem;
  onClose: () => void;
}) {
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdrop}>
      <div className={styles.modalCard}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className={styles.modalOmBg}>ॐ</div>
        <div className={styles.mCornerTL} />
        <div className={styles.mCornerTR} />
        <div className={styles.mCornerBL} />
        <div className={styles.mCornerBR} />
        <div className={styles.modalInner}>
          <div className={styles.modalImgFrame}>
            {getImageUrl(teacher.imgUrl) ? (
              <img
                src={getImageUrl(teacher.imgUrl)}
                alt={`${teacher.name} ${teacher.surname}`}
                className={styles.modalImg}
              />
            ) : (
              <div className={styles.modalImgPlaceholder}>🧘</div>
            )}
            <div className={styles.modalImgOverlay}>
              <span className={styles.modalOmIcon}>ॐ</span>
            </div>
          </div>
          <div className={styles.modalInfo}>
            <p className={styles.modalEyebrow}>Yoga Teacher</p>
            <h3 className={styles.modalName}>
              {teacher.name}{" "}
              <span className={styles.modalSurname}>{teacher.surname}</span>
            </h3>
            <div className={styles.modalNameUnderline} />
            <div className={styles.modalDivider}>
              <span className={styles.divLine} />
              <span className={styles.divOm}>🧘</span>
              <span className={styles.divLine} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   COURSE SLIDER — Custom (No react-slick)
══════════════════════════════════════════════════════ */
function CourseSlider({
  courses,
  hoveredCard,
  setHoveredCard,
}: {
  courses: CourseItem[];
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    function updateSlides() {
      const w = window.innerWidth;
      if (w <= 768) setSlidesToShow(1);
      else if (w <= 992) setSlidesToShow(2);
      else if (w <= 1200) setSlidesToShow(3);
      else setSlidesToShow(4);
    }
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const loopCourses = [...courses, ...courses];

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? courses.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => i + 1);
  };

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => i + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [mounted]);

  useEffect(() => {
    if (currentIndex >= courses.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [currentIndex, courses.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
  };

  if (!mounted) return null;

  const slideWidthPercent = 100 / slidesToShow;

  return (
    <div className={styles.sliderWrapper} style={{ marginTop: "2rem" }}>
      {slidesToShow > 1 && (
        <button
          className={`${styles.sliderArrow} ${styles.sliderArrowPrev}`}
          onClick={prev}
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      <div
        style={{ overflow: "hidden" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: "flex",
            transition: isTransitioning
              ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
            transform: `translateX(-${currentIndex * slideWidthPercent}%)`,
            willChange: "transform",
          }}
        >
          {loopCourses.map((course, i) => (
            <div
              key={`${course._id}-${i}`}
              style={{
                minWidth: `${slideWidthPercent}%`,
                maxWidth: `${slideWidthPercent}%`,
                padding: "0 10px",
                boxSizing: "border-box",
              }}
            >
              <div
                className={styles.courseCard}
                style={
                  {
                    "--card-color": course.color,
                    "--delay": `${i * 0.1}s`,
                  } as React.CSSProperties
                }
                onMouseEnter={() => setHoveredCard(course._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={styles.cardImgWrap}>
                  <img
                    src={getImageUrl(course.imgUrl)}
                    alt={course.name}
                    className={styles.cardImg}
                    loading="lazy"
                  />
                  <div
                    className={styles.cardImgOverlay}
                    style={{
                      background: `linear-gradient(to top, ${course.color}ee 0%, ${course.color}88 40%, transparent 70%)`,
                    }}
                  />
                  <span className={styles.cardDays}>{course.days}</span>
                  <div className={styles.cardHours}>{course.hours}</div>
                  <div className={styles.cardOmPulse}>🧘</div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{course.name}</h3>
                  <div className={styles.cardNameUnderline} />
                  <div className={styles.cardMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Course Style</span>
                      <span className={styles.metaVal}>{course.style}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Duration</span>
                      <span className={styles.metaVal}>{course.duration}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Certificate</span>
                      <span className={styles.metaVal}>{course.certificate}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>Course Fee</span>
                      <span className={styles.metaVal}>
                        {course.feeShared} USD / {course.feePrivate} USD
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <a href={course.detailsLink || "#"} className={styles.detailsBtn}>
                      More Details
                    </a>
                    <a href={course.bookLink || "#"} className={styles.bookBtn}>
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slidesToShow > 1 && (
        <button
          className={`${styles.sliderArrow} ${styles.sliderArrowNext}`}
          onClick={next}
          aria-label="Next"
        >
          ›
        </button>
      )}

      {/* Mobile dots */}
      {slidesToShow === 1 && (
        <div
          style={{
            display: "none",
            justifyContent: "center",
            gap: "6px",
            marginTop: "12px",
          }}
        >
          {courses.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex % courses.length ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background:
                  i === currentIndex % courses.length
                    ? "var(--saffron)"
                    : "var(--gold-border)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEACHER SLIDER — Custom
══════════════════════════════════════════════════════ */
function TeacherSlider({
  teachers,
  onSelect,
}: {
  teachers: TeacherItem[];
  onSelect: (t: TeacherItem) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    function updateSlides() {
      const w = window.innerWidth;
      if (w <= 768) setSlidesToShow(1);
      else if (w <= 992) setSlidesToShow(2);
      else if (w <= 1200) setSlidesToShow(3);
      else setSlidesToShow(4);
    }
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const loopTeachers = [...teachers, ...teachers];

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? teachers.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => i + 1);
  };

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => i + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [mounted]);

  useEffect(() => {
    if (currentIndex >= teachers.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 500);
    }
  }, [currentIndex, teachers.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
  };

  if (!mounted) return null;

  const slideWidthPercent = 100 / slidesToShow;

  return (
    <div className={styles.sliderWrapper}>
      {slidesToShow > 1 && (
        <button
          className={`${styles.sliderArrow} ${styles.sliderArrowPrev}`}
          onClick={prev}
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      <div
        style={{ overflow: "hidden" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: "flex",
            transition: isTransitioning
              ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
            transform: `translateX(-${currentIndex * slideWidthPercent}%)`,
            willChange: "transform",
          }}
        >
          {loopTeachers.map((t, i) => (
            <div
              key={`${t._id}-${i}`}
              style={{
                minWidth: `${slideWidthPercent}%`,
                maxWidth: `${slideWidthPercent}%`,
                padding: "0 8px",
                boxSizing: "border-box",
              }}
            >
              <div
                className={styles.teacherCard}
                style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
                onClick={() => onSelect(t)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSelect(t)}
              >
                <div className={styles.teacherImgWrap}>
                  {getImageUrl(t.imgUrl) ? (
                    <img
                      src={getImageUrl(t.imgUrl)}
                      alt={`${t.name} ${t.surname}`}
                      className={styles.teacherImg}
                    />
                  ) : (
                    <div className={styles.teacherImgPlaceholder}>🧘</div>
                  )}
                  <div className={styles.teacherImgOverlay}>
                    <span className={styles.teacherOm}>🔆</span>
                  </div>
                  <div className={styles.teacherClickHint}>View Profile</div>
                </div>
                <div className={styles.teacherInfo}>
                  <strong className={styles.teacherName}>{t.name}</strong>
                  <span className={styles.teacherSurname}>{t.surname}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slidesToShow > 1 && (
        <button
          className={`${styles.sliderArrow} ${styles.sliderArrowNext}`}
          onClick={next}
          aria-label="Next"
        >
          ›
        </button>
      )}

      {slidesToShow === 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginTop: "12px",
          }}
        >
          {teachers.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background:
                  i === currentIndex ? "var(--saffron)" : "var(--gold-border)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export const YogaCoursesTeachers: React.FC = () => {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/yoga-courses/get");
        if (res.data?.data) setData(res.data.data);
      } catch (err) {
        console.error("YogaCoursesTeachers fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <section className={styles.coursesSection}>
          <div className={styles.topBorder} />
          <div className={styles.container}>
            <div
              style={{
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.4,
              }}
            >
              <span style={{ fontFamily: "serif", fontSize: "2rem" }}>🧘</span>
            </div>
          </div>
          <div className={styles.bottomBorder} />
        </section>
      </div>
    );
  }

  if (!data) return null;

  const { sectionHeader, courses, who, teachersHeader, founder, teachers } = data;

  return (
    <div className={styles.wrapper}>
      {/* ══════════════════════════════════════════════════
          COURSES SECTION
      ══════════════════════════════════════════════════ */}
      <section className={styles.coursesSection}>
        <div className={styles.topBorder} />
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>{sectionHeader.eyebrow}</p>
            <h2 className={styles.sectionTitle}>{sectionHeader.sectionTitle}</h2>
            <div className={styles.omDivider}>
              <span className={styles.divLine} />
              <span className={styles.divOm}>🧘</span>
              <span className={styles.divLine} />
            </div>
            <p className={styles.sectionDesc}>{sectionHeader.sectionDesc}</p>
          </div>

          <CourseSlider
            courses={courses}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
          />
        </div>
        <div className={styles.bottomBorder} />
      </section>

     {/* ══════════════════════════════════════════════════
          WHO CAN JOIN — v4  (only backend data, no hardcoded stats)
          Purane whoSection block ko is se replace karo.
      ══════════════════════════════════════════════════ */}
     <section className={styles.whoSection}>
  <div className={styles.container}>
    <div className={styles.whoHero}>

          {/* ── LEFT — cream panel ── */}
          <div className={styles.whoLeft}>
            <div className={styles.whoEyebrow}>
              <span className={styles.whoEyeHr} />
              <span className={styles.whoEyeTxt}>{who.eyebrow}</span>
            </div>

            <h2 className={styles.whoH2}>{who.sectionTitle}</h2>

            {[who.para1, who.para2, who.para3, who.para4, who.para5].map(
              (para, i) => {
                if (!para) return null;
                return (
                  <React.Fragment key={i}>
                    {/* pull quote insert karo para3 ke baad */}
                    {i === 2 && (
                      <div className={styles.whoPull}>
                        <p>
                          "The mat holds space for the curious, the exhausted,
                          the broken, and the whole."
                        </p>
                        <span>Ancient Yoga Teaching</span>
                      </div>
                    )}
                    <p className={i === 0 ? styles.whoParaFirst : styles.whoPara}>
                      {para}
                    </p>
                  </React.Fragment>
                );
              }
            )}
          </div>

          {/* ── RIGHT — dark ink panel ── */}
          <div className={styles.whoRight}>
            <p className={styles.whoPanelLbl}>
              You belong here if you are —
            </p>

            <div className={styles.whoChipList}>
              {who.chips.map((item, i) => (
                <div
                  key={i}
                  className={styles.whoChip}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <span className={styles.whoChipN}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.whoChipT}>{item}</span>
                </div>
              ))}
            </div>

            <div className={styles.whoQWrap}>
              <p className={styles.whoQText}>"{who.quoteText}"</p>
              <div className={styles.whoQBar}>
                <span className={styles.whoQLine} />
                <span className={styles.whoQAttrib}>{who.quoteAttrib}</span>
              </div>
            </div>
          </div>
</div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TEACHERS SECTION
      ══════════════════════════════════════════════════ */}
      <section className={styles.teachersSection}>
        <div className={styles.topBorder} />
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>{teachersHeader.eyebrow}</p>
            <h2 className={styles.sectionTitle}>{teachersHeader.sectionTitle}</h2>
            <div className={styles.omDivider}>
              <span className={styles.divLine} />
              <span className={styles.divOm}>🧘</span>
              <span className={styles.divLine} />
            </div>
          </div>

          <div className={styles.teachersIntro}>
            <HighlightedPara
              text={teachersHeader.introPara1}
              highlight={teachersHeader.introPara1Highlight}
              className={styles.para}
            />
            <HighlightedPara
              text={teachersHeader.introPara2}
              highlight={teachersHeader.introPara2Highlight}
              className={styles.para}
            />
          </div>

          {/* Founder Block */}
          <div className={styles.founderBlock}>
            <div className={styles.founderImgCol}>
              <div className={styles.founderImgFrame}>
                {getImageUrl(founder.imgUrl) ? (
                  <img
                    src={getImageUrl(founder.imgUrl)}
                    alt={founder.imgAlt}
                    className={styles.founderImg}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: 300,
                      background: "linear-gradient(135deg,#fdf6ec,#e8d5b5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      opacity: 0.4,
                    }}
                  >
                    🧘
                  </div>
                )}
                <div className={styles.founderImgOverlay}>
                  <span className={styles.founderImgName}>{founder.name}</span>
                </div>
                <div className={styles.fCornerTL} />
                <div className={styles.fCornerTR} />
                <div className={styles.fCornerBL} />
                <div className={styles.fCornerBR} />
              </div>
            </div>
            <div className={styles.founderTextCol}>
              <p className={styles.founderEyebrow}>{founder.eyebrow}</p>
              <h3 className={styles.founderName}>{founder.name}</h3>
              <div className={styles.founderNameUnderline} />
              <p className={styles.para}>{founder.para1}</p>
              <p className={styles.para}>{founder.para2}</p>
              <HighlightedPara
                text={founder.para3}
                highlight={founder.para3Highlight}
                className={styles.para}
              />
              <div className={styles.founderActions}>
                <a href={founder.detailsBtnLink || "#"} className={styles.detailsBtn}>
                  {founder.detailsBtnText}
                </a>
                <a href={founder.bookBtnLink || "#"} className={styles.bookBtn}>
                  {founder.bookBtnText}
                </a>
              </div>
            </div>
          </div>

          {teachers.length > 0 && (
            <TeacherSlider teachers={teachers} onSelect={setSelectedTeacher} />
          )}

          <div className={styles.teachersCta}>
            <a
              href={teachersHeader.ctaBtnLink || "#"}
              className={styles.teachersCtaBtn}
            >
              {teachersHeader.ctaBtnText} <span>→</span>
            </a>
          </div>
        </div>
        <div className={styles.bottomBorder} />
      </section>

      {selectedTeacher && (
        <TeacherModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </div>
  );
};

export default YogaCoursesTeachers;
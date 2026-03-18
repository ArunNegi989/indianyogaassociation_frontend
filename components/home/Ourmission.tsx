"use client";

import { useEffect, useState } from "react";
import styles from "../../assets/style/Home/Ourmission.module.css";
import api from "../../lib/api";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Block {
  heading: string;
  seoTagline?: string;
  leadBold?: string;
  paragraphs: string[];
}

interface OurMissionData {
  _id: string;
  missionBlock: Block;
  whyBlock: Block;
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function MissionSkeleton() {
  return (
    <section className={styles.missionSection} aria-busy="true">
      <div className={styles.outerFrame}>
        <div className={styles.innerFrame}>
          <div className={styles.missionBlock}>
            {[80, 50, 100, 100, 60].map((w, i) => (
              <div
                key={i}
                style={{
                  height: i === 0 ? 32 : 16,
                  width: `${w}%`,
                  background: "rgba(180,150,100,0.15)",
                  borderRadius: 6,
                  marginBottom: 14,
                  animation: "pulse 1.4s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function OurMission() {
  const [data, setData] = useState<OurMissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/our-mission/get-our-mission")
      .then((res) => {
        // controller getAll → array, pick first doc
        const raw = res.data?.data ?? res.data;
        const doc: OurMissionData = Array.isArray(raw) ? raw[0] : raw;
        if (doc) setData(doc);
      })
      .catch((err) => {
        console.error("OurMission API error:", err?.response?.data ?? err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <MissionSkeleton />;

  // ── No data in DB yet → render nothing (or swap with a fallback UI) ──
  if (!data) return null;

  const { missionBlock, whyBlock } = data;

  return (
    <section
      className={styles.missionSection}
      aria-labelledby="mission-heading"
    >
      {/* decorative bg */}
      <div className={styles.bgLotus} aria-hidden="true">❋</div>
      <div className={styles.bgCornerTL} aria-hidden="true" />
      <div className={styles.bgCornerBR} aria-hidden="true" />

      <div className={styles.outerFrame}>
        <div className={styles.innerFrame}>

          {/* ── MISSION BLOCK ── */}
          <div className={styles.missionBlock}>
            <h2 id="mission-heading" className={styles.missionHeading}>
              {missionBlock.heading}
            </h2>
            <div className={styles.headingRule} aria-hidden="true" />

            {missionBlock.seoTagline && (
              <p className={styles.seoTagline}>{missionBlock.seoTagline}</p>
            )}

            <div className={styles.missionBody}>
              {missionBlock.paragraphs.map((para, i) => (
                <div
                  key={i}
                  className={styles.para}
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
            </div>
          </div>

          {/* ornament */}
          <div className={styles.ornamentRow} aria-hidden="true">
            <span className={styles.ornamentLine} />
            <span className={styles.ornamentSymbol}>✦ ॐ ✦</span>
            <span className={styles.ornamentLine} />
          </div>

          {/* ── WHY BLOCK ── */}
          <div className={styles.whyBlock}>
            <h3 className={styles.whyHeading}>{whyBlock.heading}</h3>
            <div className={styles.headingRule} aria-hidden="true" />

            <div className={styles.whyBody}>
              {whyBlock.paragraphs.map((para, i) => (
                <div key={i} className={styles.para}>
                  {i === 0 && whyBlock.leadBold && (
                    <strong className={styles.leadBold}>
                      {whyBlock.leadBold}{" "}
                    </strong>
                  )}
                  <span dangerouslySetInnerHTML={{ __html: para }} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
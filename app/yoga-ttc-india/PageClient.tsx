"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/Rulespage/Rulespage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

/* ── Decorative SVGs (kept static — not content, purely visual) ── */
const ChakraLotus: React.FC<{
  color: string;
  size: number;
  petals?: number;
  className?: string;
}> = ({ color, size, petals = 8, className }) => {
  const outer = Array.from({ length: petals }, (_, i) => {
    const a = (i * 360) / petals;
    const r = (a * Math.PI) / 180;
    return {
      cx: size / 2 + Math.cos(r) * size * 0.3,
      cy: size / 2 + Math.sin(r) * size * 0.3,
      a,
    };
  });
  const inner = Array.from({ length: petals }, (_, i) => {
    const a = (i * 360) / petals + 360 / petals / 2;
    const r = (a * Math.PI) / 180;
    return {
      cx: size / 2 + Math.cos(r) * size * 0.17,
      cy: size / 2 + Math.sin(r) * size * 0.17,
      a,
    };
  });

  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={size * 0.47} stroke={color} strokeWidth="0.9" strokeDasharray="5 4" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={size * 0.38} stroke={color} strokeWidth="0.5" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={size * 0.26} stroke={color} strokeWidth="0.4" strokeDasharray="2 5" fill="none" />
      {outer.map(({ cx, cy, a }, i) => (
        <ellipse
          key={`o${i}`}
          cx={cx}
          cy={cy}
          rx={size * 0.065}
          ry={size * 0.22}
          transform={`rotate(${a + 90},${cx},${cy})`}
          fill={`${color}18`}
          stroke={color}
          strokeWidth="0.8"
        />
      ))}
      {inner.map(({ cx, cy, a }, i) => (
        <ellipse
          key={`i${i}`}
          cx={cx}
          cy={cy}
          rx={size * 0.048}
          ry={size * 0.13}
          transform={`rotate(${a + 90},${cx},${cy})`}
          fill={`${color}22`}
          stroke={color}
          strokeWidth="0.6"
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const a1 = (i * 60 * Math.PI) / 180,
          a2 = ((i * 60 + 30) * Math.PI) / 180;
        const r1 = size * 0.22,
          r2 = size * 0.13;
        return (
          <line
            key={`l${i}`}
            x1={size / 2 + Math.cos(a1) * r1}
            y1={size / 2 + Math.sin(a1) * r1}
            x2={size / 2 + Math.cos(a2) * r2}
            y2={size / 2 + Math.sin(a2) * r2}
            stroke={color}
            strokeWidth="0.6"
            opacity="0.7"
          />
        );
      })}
      <circle cx={size / 2} cy={size / 2} r={size * 0.08} fill={`${color}28`} stroke={color} strokeWidth="0.9" />
    </svg>
  );
};

const Mandala: React.FC<{ size?: number; className?: string }> = ({ size = 80, className = "" }) => {
  const cx = size / 2,
    cy = size / 2,
    s = size / 100;
  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={cx} cy={cy} r={size * 0.46} stroke="#F15505" strokeWidth="0.7" strokeDasharray="5 3" fill="none" opacity="0.65" />
      <circle cx={cx} cy={cy} r={size * 0.36} stroke="#F15505" strokeWidth="0.4" fill="none" opacity="0.4" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (((i * 360) / 16) * Math.PI) / 180;
        const ex = cx + Math.cos(a) * size * 0.27,
          ey = cy + Math.sin(a) * size * 0.27;
        return (
          <ellipse
            key={i}
            cx={ex}
            cy={ey}
            rx={5 * s}
            ry={13 * s}
            transform={`rotate(${(i * 360) / 16 + 90},${ex},${ey})`}
            fill="rgba(224,123,0,0.1)"
            stroke="#F15505"
            strokeWidth="0.5"
            opacity="0.65"
          />
        );
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (((i * 360) / 8 + 22.5) * Math.PI) / 180;
        const ex = cx + Math.cos(a) * size * 0.16,
          ey = cy + Math.sin(a) * size * 0.16;
        return (
          <ellipse
            key={i}
            cx={ex}
            cy={ey}
            rx={4 * s}
            ry={10 * s}
            transform={`rotate(${(i * 360) / 8 + 22.5 + 90},${ex},${ey})`}
            fill="rgba(224,123,0,0.15)"
            stroke="#F15505"
            strokeWidth="0.6"
            opacity="0.7"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={size * 0.09} fill="rgba(224,123,0,0.12)" stroke="#F15505" strokeWidth="0.9" opacity="0.6" />
      <text x={cx} y={cy + 5 * s} textAnchor="middle" fontSize={16 * s} fill="#F15505" fontFamily="serif" opacity="0.85">
        ॐ
      </text>
    </svg>
  );
};

const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>ॐ</span>
    <span className={styles.dividerLine} />
  </div>
);

/* ── Types (mirror backend Rules model) ── */
interface RuleItem {
  num: number;
  title: string;
  content: string;
}

interface CategoryItem {
  category: string;
  rules: RuleItem[];
}

interface RulesData {
  _id: string;
  heroImage?: string;
  heroImageAlt?: string;
  pageTitle?: string;
  brownBarLabel?: string;
  categories?: CategoryItem[];
  agreementTitle?: string;
  agreementParagraphs?: string[];
  footerText?: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

/* ── Main Page ── */
const RulesPage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<RulesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/rules-section");
        setData(res.data?.data ?? null);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p>Loading…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p>Content coming soon.</p>
      </div>
    );
  }

  const categories = data.categories ?? [];
  const agreementParagraphs = data.agreementParagraphs ?? [];

  return (
    <>
      {data.heroImage && (
        <section className={styles.heroSection}>
          <img
            src={getImageUrl(data.heroImage)}
            alt={data.heroImageAlt || "Yoga Students Group"}
            className={styles.heroImage}
          />
        </section>
      )}

      <div className={`${styles.page} ${visible ? styles.visible : ""}`}>
        {/* ════ CHAKRA BACKGROUND (static decoration) ════ */}
        <div className={styles.chakraBg} aria-hidden="true">
          <div className={`${styles.cp} ${styles.cpL1}`}>
            <ChakraLotus color="#c0392b" size={210} petals={4} className={styles.spinCW} />
            <span className={styles.cLabel} style={{ color: "#c0392b" }}>
              मूलाधार<em>Muladhara · Root</em>
            </span>
          </div>
          <div className={`${styles.cp} ${styles.cpL2}`}>
            <ChakraLotus color="#d4ac0d" size={230} petals={10} className={styles.spinSlow} />
            <span className={styles.cLabel} style={{ color: "#d4ac0d" }}>
              मणिपूर<em>Manipura · Solar Plexus</em>
            </span>
          </div>
          <div className={`${styles.cp} ${styles.cpL3}`}>
            <ChakraLotus color="#1a5276" size={200} petals={16} className={styles.spinCW} />
            <span className={styles.cLabel} style={{ color: "#1a5276" }}>
              विशुद्ध<em>Vishuddha · Throat</em>
            </span>
          </div>
          <div className={`${styles.cp} ${styles.cpL4}`}>
            <ChakraLotus color="#6c3483" size={195} petals={2} className={styles.spinSlow} />
            <span className={styles.cLabel} style={{ color: "#6c3483" }}>
              आज्ञा<em>Ajna · Third Eye</em>
            </span>
          </div>
          <div className={`${styles.cp} ${styles.cpR1}`}>
            <ChakraLotus color="#e67e22" size={195} petals={6} className={styles.spinCCW} />
            <span className={styles.cLabel} style={{ color: "#e67e22" }}>
              स्वाधिष्ठान<em>Svadhisthana · Sacral</em>
            </span>
          </div>
          <div className={`${styles.cp} ${styles.cpR2}`}>
            <ChakraLotus color="#1e8449" size={215} petals={12} className={styles.spinCW} />
            <span className={styles.cLabel} style={{ color: "#1e8449" }}>
              अनाहत<em>Anahata · Heart</em>
            </span>
          </div>
          <div className={`${styles.cp} ${styles.cpR3}`}>
            <ChakraLotus color="#922b21" size={205} petals={12} className={styles.spinSlow} />
            <span className={styles.cLabel} style={{ color: "#922b21" }}>
              सहस्रार<em>Sahasrara · Crown</em>
            </span>
          </div>

          <Mandala size={400} className={styles.wmL} />
          <Mandala size={320} className={styles.wmR} />
        </div>

        {/* ════ TOP BORDER ════ */}
        <div className={styles.a} />

        {/* ════ PAGE TITLE & OM DIVIDER ════ */}
        {data.pageTitle && (
          <div className={styles.headerWrap}>
            <div className={styles.outerPad}>
              <h1 className={styles.pageTitle}>{data.pageTitle}</h1>
              <OmDivider />
            </div>
          </div>
        )}

        {/* ════ MAIN CONTENT ════ */}
        <div className={styles.outerPad}>
          <div className={styles.contentBox}>
            {data.brownBarLabel && (
              <div className={styles.brownBar}>
                <Mandala size={19} className={styles.barIcon} />
                <span>{data.brownBarLabel}</span>
              </div>
            )}

            <div className={styles.body}>
              {categories.length > 0 && (
                <>
                  {/* Category Tabs */}
                  <div className={styles.tabsContainer}>
                    <div className={styles.tabsList}>
                      {categories.map((cat, idx) => (
                        <button
                          key={idx}
                          className={`${styles.tabButton} ${activeTab === idx ? styles.active : ""}`}
                          onClick={() => setActiveTab(idx)}
                        >
                          {cat.category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rules Content for Active Tab */}
                  <div className={styles.tabContent}>
                    <div className={styles.rulesGrid}>
                      {(categories[activeTab]?.rules ?? []).map((rule, rIdx) => (
                        <div key={rIdx} className={styles.ruleBox}>
                          <div className={styles.ruleBoxHeader}>
                            <span className={styles.ruleNum}>Rule {rule.num}</span>
                            <h3 className={styles.ruleBoxTitle}>{rule.title}</h3>
                          </div>
                          <p className={styles.ruleBoxContent}>{rule.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.sep} />
                </>
              )}

              {/* Agreement Section */}
              {(data.agreementTitle || agreementParagraphs.length > 0) && (
                <div className={styles.agreementSection}>
                  {data.agreementTitle && <h2 className={styles.agreementTitle}>{data.agreementTitle}</h2>}
                  <div className={styles.agreementContent}>
                    {agreementParagraphs.map((html, idx) => (
                      <div key={idx} className={styles.agreePara} dangerouslySetInnerHTML={{ __html: html }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <HowToReach />

        {/* ════ BOTTOM BORDER ════ */}
        <div className={styles.bottomBorder} />

        {/* ════ FOOTER ════ */}
        {data.footerText && (
          <footer className={styles.footer}>
            <Mandala size={22} />
            <span>{data.footerText}</span>
            <Mandala size={22} />
          </footer>
        )}
      </div>
    </>
  );
};

export default RulesPage;
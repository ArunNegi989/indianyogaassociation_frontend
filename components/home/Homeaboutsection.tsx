import styles from "../../assets/style/Home/Homeaboutsection.module.css";
import api from "@/lib/api";
import Link from "next/link";

interface Stat {
  value: string;
  label: string;
}

interface HomeAboutData {
  superTitle: string;
  mainTitle: string;
  stats: Stat[];
  paraOne: string;
  paraTwo: string;
  paraThree: string;
  accreditations: string[];
  quoteText: string;
  paraRight: string;
  yogaStyles: string[];
  paraSmall: string;
  ctaText: string;
  ctaLink: string;
}

async function getHomeAboutData(): Promise<HomeAboutData | null> {
  try {
    const res = await api.get("/home-about/get-home-about");
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch home about");
    return null;
  }
}

/* Same responsive, art-directed background image used in the skeleton too,
   so it starts loading immediately regardless of data-fetch state. */
export const HomeAboutBackground = () => (
  <picture className={styles.bgWrap}>
    <source
      media="(max-width: 360px)"
      srcSet="/images/backgroundimage/360x2080.webp"
    />
    <source
      media="(max-width: 540px)"
      srcSet="/images/backgroundimage/510x1739.webp"
    />
    <source
      media="(max-width: 660px)"
      srcSet="/images/backgroundimage/660x1596.webp"
    />
    <source
      media="(max-width: 768px)"
      srcSet="/images/backgroundimage/768x1482.webp"
    />
    <source
      media="(max-width: 861px)"
      srcSet="/images/backgroundimage/861x1236.webp"
    />
    <source
      media="(max-width: 1100px)"
      srcSet="/images/backgroundimage/1100x1256.webp"
    />
    <source
      media="(max-width: 1366px)"
      srcSet="/images/backgroundimage/1366x1204.webp"
    />
    <source
      media="(max-width: 1680px)"
      srcSet="/images/backgroundimage/1680x1260.webp"
    />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/images/backgroundimage/1905x1150.webp"
      alt=""
      fetchPriority="high"
      decoding="async"
    />
  </picture>
);

export const HomeaboutSection = async () => {
  const data = await getHomeAboutData();

  if (!data) return null;

  return (
    <section className={styles.section}>
      <HomeAboutBackground />

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <p className={styles.superTitle}>{data.superTitle}</p>

          <h2 className={styles.mainTitle}>{data.mainTitle}</h2>

          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
        </div>

        {/* STATS */}
        <div className={styles.statsRow}>
          {data.stats?.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* BODY */}
        <div className={styles.body}>
          {/* LEFT */}
          <div className={styles.bodyLeft}>
            <div
              className={styles.para}
              dangerouslySetInnerHTML={{ __html: data.paraOne }}
            />
            <div
              className={styles.para}
              dangerouslySetInnerHTML={{ __html: data.paraTwo }}
            />
            <div
              className={styles.para}
              dangerouslySetInnerHTML={{ __html: data.paraThree }}
            />

            <div className={styles.accreditations}>
              {data.accreditations?.map((a, i) => (
                <span key={i} className={styles.accBadge}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.bodyRight}>
            <blockquote className={styles.quote}>
              <span className={styles.quoteMarks}>"</span>
              <span dangerouslySetInnerHTML={{ __html: data.quoteText }} />
              <span className={styles.quoteMarks}>"</span>
            </blockquote>

            <div
              className={styles.para}
              dangerouslySetInnerHTML={{ __html: data.paraRight }}
            />

            <div className={styles.stylesBlock}>
              <h4 className={styles.stylesTitle}>Multi-Style Yoga Courses</h4>

              <div className={styles.stylesGrid}>
                {data.yogaStyles?.map((style, i) => (
                  <span key={i} className={styles.styleChip}>
                    {style}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={styles.paraSmall}
              dangerouslySetInnerHTML={{ __html: data.paraSmall }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaRow}>
          <div
            className={styles.ctaText}
            dangerouslySetInnerHTML={{ __html: data.ctaText }}
          />

          <Link href={data.ctaLink} className={styles.ctaBtn}>
            Explore All Courses
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeaboutSection;
"use client";

import React from "react";
import styles from "../../assets/style/Home/Hometestimonialssection.module.css";
import tripIcon from "../../assets/icons/showcase1.png";
import googleIcon from "../../assets/icons/showcase2.png";
import trustpilotIcon from "../../assets/icons/showcase3.png";
import truststar from "../../assets/icons/showcase4.png";

/* ── Platform Rating Data ── */
const PLATFORM_RATINGS = [
  {
    name: "TripAdvisor",
    rating: 5.0,
    label: "5.0/5 Stars",
    sub: "Trip Advisor Testimonials",
    fullStars: 5,
    halfStar: false,
    color: "#00AA6C",
    icon: (
      <img
        src={tripIcon.src}
        alt="TripAdvisor"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    ),
  },
  {
    name: "Google Maps",
    rating: 4.9,
    label: "4.9/5 Stars",
    sub: "Google Maps Reviews",
    fullStars: 4,
    halfStar: true,
    color: "#4285F4",
    icon: (
      <img
        src={googleIcon.src}
        alt="TripAdvisor"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    ),
  },
  {
    name: "Yoga Alliance",
    rating: 4.9,
    label: "4.9/5 Stars",
    sub: "Yoga Alliance Verified Reviews",
    fullStars: 4,
    halfStar: true,
    color: "#7B4F8E",
    icon: (
      <img
        src={trustpilotIcon.src}
        alt="TripAdvisor"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    ),
  },
  {
    name: "Trustpilot",
    rating: 4.9,
    label: "4.9/5 Stars",
    sub: "Trustpilot Verified Reviews",
    fullStars: 4,
    halfStar: true,
    color: "#00B67A",
    icon: (
      <img
        src={truststar.src}
        alt="TripAdvisor"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    ),
  },
];

/* ── Platform Stars ── */
function PlatformStars({ full, half }: { full: number; half: boolean }) {
  return (
    <div className={styles.platformStars}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={i} className={styles.platformStar}>
          ★
        </span>
      ))}
      {half && <span className={styles.platformStarHalf}>★</span>}
    </div>
  );
}

/* ── Ratings Summary Section ── */
function RatingsSummarySection() {
  return (
    <div className={styles.ratingsSection}>
      {/* Divider */}
      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.omSymbol}>ॐ</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.ratingsGrid}>
        {/* LEFT — Overall Rating Card */}
        <div className={styles.overallCard}>
          <div className={styles.overallCardBg} aria-hidden="true" />
          <div className={styles.overallCardContent}>
            <div className={styles.overallScoreWrap}>
              <div className={styles.overallScoreCircle}>
                <span className={styles.overallScore}>4.9</span>
                <span className={styles.overallScoreLabel}>Out Of 5 Stars</span>
                <div className={styles.overallStars}>
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className={styles.overallStar}>
                      ★
                    </span>
                  ))}
                  <span className={styles.overallStarHalf}>★</span>
                </div>
              </div>
            </div>
            <p className={styles.overallTotal}>
              Overall Rating of 1276+ Total Reviews
            </p>
            <p className={styles.overallDesc}>
              Over the past decade, we empowered more than 13K+ awesome Yoga
              Instructors — who are now successfully teaching on all 6
              continents.
            </p>
            <a href="#reviews" className={styles.overallBtn}>
              See Our Other Reviews
            </a>
          </div>
        </div>

        {/* RIGHT — Platform Ratings */}
        <div className={styles.platformsPanel}>
          <h3 className={styles.platformsTitle}>
            We Know This Is A Big Step For You
          </h3>
          <p className={styles.platformsSub}>
            So we do everything to make this the best investment of your life
          </p>

          <div className={styles.platformList}>
            {PLATFORM_RATINGS.map((p, i) => (
              <React.Fragment key={p.name}>
                <div className={styles.platformRow}>
                  <div className={styles.platformIconWrap}>{p.icon}</div>
                  <div className={styles.platformInfo}>
                    <PlatformStars full={p.fullStars} half={p.halfStar} />
                    <span className={styles.platformRating}>{p.label}</span>
                    <span className={styles.platformName}>{p.sub}</span>
                  </div>
                </div>
                {i < PLATFORM_RATINGS.length - 1 && (
                  <div className={styles.platformDivider} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatingsSummarySection;

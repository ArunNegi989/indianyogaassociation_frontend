import styles from "../../assets/style/Home/Homeaboutsection.module.css";

export default function HomeaboutSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.container} style={{ minHeight: 500 }}>
        <div className={styles.header}>
          <div
            style={{
              height: 16,
              width: 220,
              margin: "0 auto 1rem",
              background: "rgba(160,120,64,0.15)",
              borderRadius: 6,
              animation: "hab-pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: 32,
              width: "60%",
              margin: "0 auto 2rem",
              background: "rgba(160,120,64,0.15)",
              borderRadius: 6,
              animation: "hab-pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <div className={styles.statsRow}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: 80,
                background: "rgba(160,120,64,0.12)",
                borderRadius: 8,
                animation: "hab-pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes hab-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
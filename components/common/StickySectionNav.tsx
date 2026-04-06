"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/Home/StickyNav.module.css";

type NavItem = {
  label: string;
  id: string;
};

export default function StickySectionNav({
  items,
  triggerId = "hero",
}: {
  items: NavItem[];
  triggerId?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(items[0]?.id);

  /* SHOW AFTER HERO */
  useEffect(() => {
    const hero = document.getElementById(triggerId);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [triggerId]);

  /* ACTIVE SECTION TRACK */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        {
          threshold: 0.25,
          rootMargin: "-100px 0px -50% 0px",
        }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  /* SCROLL FUNCTION */
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 100; // header + nav
    const top =
      el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className={`${styles.wrap} ${visible ? styles.show : ""}`}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`${styles.btn} ${
            active === item.id ? styles.active : ""
          }`}
          onClick={() => scrollTo(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import styles from '../../assets/style/Contact-us/ContactPage.module.css';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className={styles.page}>

      {/* Corner ornaments */}
      <span className={`${styles.cornerOrnament} ${styles.tl}`}>❧</span>
      <span className={`${styles.cornerOrnament} ${styles.tr}`}>❧</span>
      <span className={`${styles.cornerOrnament} ${styles.bl}`}>❧</span>
      <span className={`${styles.cornerOrnament} ${styles.br}`}>❧</span>
      <div className={styles.frame} />
      <div className={styles.watermark}>ॐ</div>

      {/* ── TOP HEADER ── */}
      <div className={styles.topBand}>
        <div className={styles.schoolName}>AYM Yoga School</div>
        <div className={styles.tagline}>Indian Yoga Association · Est. Rishikesh, Uttarakhand</div>
      </div>

      {/* ── INNER ── */}
      <div className={styles.inner}>

        <div className={styles.ornateDivider}>
          <span className={styles.line} />
          <span className={styles.diamond}>◆</span>
          <span className={styles.om}>ॐ</span>
          <span className={styles.diamond}>◆</span>
          <span className={styles.line} />
        </div>

        <h1 className={styles.sectionTitle}>Contact Us</h1>
        <p className={styles.sectionSubtitle}>We are here to guide you on your transformative yoga journey</p>

        {/* ── GRID ── */}
        <div className={styles.grid}>

          {/* FORM */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
              <div className={styles.formGroup}>
                <label>Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className={styles.formGroup}>
                <label>Message *</label>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Write your message here..." required />
              </div>
              <button type="submit" className={styles.submitBtn}>✦ Submit ✦</button>
              {submitted && (
                <p className={styles.successMsg}>
                  🙏 Thank you — our team shall reach you within 24 hours.
                </p>
              )}
            </form>
          </div>

          {/* INFO */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>How to Reach Us</h2>

            {[
              { icon: '🏫', title: 'AYM Yoga School', text: 'Upper Tapovan, Rishikesh\nUttarakhand – 249192' },
              { icon: '📞', title: 'Official Phone', text: '+91 75002 77709' },
              { icon: '✉️', title: 'Official Email', text: 'aymindia@gmail.com' },
              { icon: '🕘', title: 'Office Hours', text: '9:00 AM – 6:00 PM (IST)\nMonday to Saturday' },
            ].map((item) => (
              <div key={item.title} className={styles.infoItem}>
                <div className={styles.infoIcon}>{item.icon}</div>
                <div className={styles.infoContent}>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW TO REACH ── */}
        <div className={styles.reachCard}>
          <h2 className={styles.cardTitle}>How to Reach AYM Yoga School</h2>
          <div className={styles.reachGrid}>
            {[
              { icon: '✈', label: 'By Air', text: 'Nearest airport is Jolly Grant Airport (Dehradun), about 25 km / 45 minutes away. Taxis and airport pick-up are available.' },
              { icon: '🚂', label: 'By Train', text: 'Nearest station is Haridwar Junction, around 25 km from Rishikesh. Reachable by taxi or local bus.' },
              { icon: '🚌', label: 'By Road', text: 'Rishikesh is 240 km from Delhi (about 5–6 hours). Regular buses and private taxis operate from Delhi and Haridwar.' },
              { icon: '🚖', label: 'Pick-Up Service', text: 'We can arrange a private taxi from Delhi, Haridwar, or Dehradun Airport on request. Share travel details in advance.' },
            ].map((item) => (
              <div key={item.label} className={styles.reachItem}>
                <h4>{item.icon} {item.label}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAP ── */}
        <div className={styles.mapSection}>
          <h2 className={styles.mapTitle}>Visit Us in Rishikesh</h2>
          <div className={styles.mapWrapper}>
            <iframe
              src="https://maps.google.com/maps?q=Upper%20Tapovan%20Rishikesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              title="AYM Yoga School Map"
            />
          </div>
        </div>

        <div className={styles.ornateDivider} style={{ marginTop: '2rem' }}>
          <span className={styles.line} />
          <span className={styles.diamond}>◆</span>
          <span className={styles.om}>ॐ</span>
          <span className={styles.diamond}>◆</span>
          <span className={styles.line} />
        </div>

      </div>{/* /inner */}

      {/* ── FOOTER ── */}
      <div className={styles.footerBand}>
        <p>The Indian Yoga Association · Registered under Societies Registration Act · Affiliated with Yoga Certification Board, Ministry of AYUSH, Govt. of India</p>
      </div>

    </div>
  );
};

export default ContactPage;
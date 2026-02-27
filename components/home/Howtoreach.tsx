"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import styles from "../../assets/style/Home/Howtoreach.module.css";

const WHATSAPP_NUMBER = "918476898395";
const WHATSAPP_MSG = encodeURIComponent(
  "Namaste !! I would like to arrange a Pickup / Drop service for Indian Yoga Association, Rishikesh. Please guide me on the pickup point details.",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

interface ScheduleRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

interface ScheduleTableProps {
  headers: string[];
  rows: ScheduleRow[];
}

interface TravelCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  desc: string;
  headers: string[];
  rows: ScheduleRow[];
  btnText: string;
  btnHref: string;
  linkText: string;
  linkHref: string;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  altPhone: string;
  pickupLocation: string;
  dropLocation: string;
  arrivalDate: string;
  arrivalTime: string;
  guests: string;
  instructions: string;
  serviceType: string;
}

const flights: ScheduleRow[] = [
  { col1: "IndiGo", col2: "06:30 AM", col3: "07:30 AM", col4: "1h" },
  { col1: "Air India", col2: "09:15 AM", col3: "10:20 AM", col4: "1h 5m" },
  { col1: "Vistara", col2: "01:40 PM", col3: "02:45 PM", col4: "1h 5m" },
  { col1: "SpiceJet", col2: "05:55 PM", col3: "07:00 PM", col4: "1h 5m" },
];

const trains: ScheduleRow[] = [
  {
    col1: "Dehradun Shatabdi",
    col2: "06:45 AM",
    col3: "11:25 AM",
    col4: "Haridwar",
  },
  {
    col1: "Mussoorie Express",
    col2: "10:00 PM",
    col3: "05:30 AM",
    col4: "Haridwar",
  },
  {
    col1: "Jan Shatabdi Exp.",
    col2: "03:20 PM",
    col3: "09:00 PM",
    col4: "Haridwar",
  },
  {
    col1: "Nanda Devi Exp.",
    col2: "11:50 PM",
    col3: "05:10 AM",
    col4: "Haridwar",
  },
];

const buses: ScheduleRow[] = [
  { col1: "Volvo AC", col2: "06:00 AM", col3: "11:30 AM", col4: "AC" },
  {
    col1: "Sleeper Coach",
    col2: "09:00 PM",
    col3: "04:00 AM",
    col4: "Sleeper",
  },
  { col1: "AC Seater", col2: "02:00 PM", col3: "07:30 PM", col4: "AC" },
  { col1: "Deluxe Bus", col2: "11:00 PM", col3: "05:30 AM", col4: "Deluxe" },
];

const PlaneIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
  </svg>
);

const TrainIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C8 2 4 2.5 4 6v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2H18v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zm0 2c3.51 0 5.44.48 5.93 1H6.07C6.56 4.48 8.49 4 12 4zM6 9V7h5v2H6zm11 0h-5V7h5v2zm-1 7H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z" />
  </svg>
);

const BusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
  </svg>
);
const WhatsAppIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function ScheduleTable({
  headers,
  rows,
}: ScheduleTableProps): React.ReactElement {
  return (
    <div className={styles.scheduleTable}>
      <div className={styles.scheduleHeader}>
        {headers.map((h) => (
          <span key={h} className={styles.scheduleHeaderCell}>
            {h}
          </span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`${styles.scheduleRow} ${i % 2 !== 0 ? styles.scheduleRowAlt : ""}`}
        >
          {Object.values(row).map((cell, j) => (
            <span key={j} className={styles.scheduleCell}>
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function TravelCard({
  icon,
  title,
  subtitle,
  desc,
  headers,
  rows,
  btnText,
  btnHref,
  linkText,
  linkHref,
}: TravelCardProps): React.ReactElement {
  return (
    <article className={styles.travelCard}>
      <div className={styles.travelHeader}>
        <div className={styles.iconCircle} aria-hidden="true">
          {icon}
        </div>
        <div>
          <h3 className={styles.travelTitle}>{title}</h3>
          <p className={styles.travelSubtitle}>{subtitle}</p>
        </div>
      </div>
      <p
        className={styles.travelDesc}
        dangerouslySetInnerHTML={{ __html: desc }}
      />
      <ScheduleTable headers={headers} rows={rows} />
      <div className={styles.cardActions}>
        <a
          href={btnHref}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnPrimary}
        >
          {btnText}
        </a>
        <a href={linkHref} className={styles.linkSecondary}>
          {linkText} →
        </a>
      </div>
    </article>
  );
}

export default function HowToReach(): React.ReactElement {
  const [pickupOpen, setPickupOpen] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    altPhone: "",
    pickupLocation: "",
    dropLocation: "",
    arrivalDate: "",
    arrivalTime: "",
    guests: "",
    instructions: "",
    serviceType: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert("Pickup request submitted! We will contact you shortly.");
  };

  return (
    <section
      className={styles.reachSection}
      aria-label="How to Reach Indian Yoga Association"
    >
      <div className={styles.omWatermark} aria-hidden="true">
        ॐ
      </div>
      <div className={styles.topBorder} />

      <div className={styles.container}>
        <div className={styles.headerWrap}>
          <span className={styles.badge}>✦ Travel Guide</span>
          <h2 className={styles.mainTitle}>How to Reach Us</h2>
          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
          <p className={styles.subTitle}>
            Easy &amp; Comfortable Travel Options to Reach{" "}
            <strong>Indian Yoga Association</strong> in Rishikesh — Delhi to
            Rishikesh travel options by air, train &amp; bus.
          </p>
        </div>
        <div className={styles.splitLayout}>
          <div className={styles.leftPanel}>
            <div className={styles.cardsGrid}>
              <TravelCard
                icon={<PlaneIcon />}
                title="By Airways"
                subtitle="Fastest Way to Reach Rishikesh"
                desc="Fly from Delhi (Indira Gandhi International Airport) to <strong>Jolly Grant Airport, Dehradun</strong> — approximately 20 km from Rishikesh. Taxis and private transfers are easily available. Indian Yoga Association provides pickup &amp; drop facility on request."
                headers={["Airline", "Departs", "Arrives", "Duration"]}
                rows={flights}
                btnText="Check Flights on MakeMyTrip"
                btnHref="https://www.makemytrip.com/flights/"
                linkText="Get More Details About Air Travel"
                linkHref="#air-details"
              />
              <TravelCard
                icon={<TrainIcon />}
                title="By Train"
                subtitle="Affordable & Comfortable"
                desc="Travel from New Delhi Railway Station to Rishikesh or <strong>Haridwar Junction</strong> (25 km from Rishikesh). Taxis and auto-rickshaws are always available for the onward journey to Indian Yoga Association, Rishikesh."
                headers={["Train", "Departs", "Arrives", "Via"]}
                rows={trains}
                btnText="Book Train on IRCTC"
                btnHref="https://www.irctc.co.in/"
                linkText="Get More Details About Train Travel"
                linkHref="#train-details"
              />
              <TravelCard
                icon={<BusIcon />}
                title="By Bus"
                subtitle="Budget Friendly Option"
                desc="Regular <strong>Volvo, AC and sleeper buses</strong> operate daily from Delhi to Rishikesh. Travel time is approximately 5–6 hours via scenic NH58, passing through the beautiful Shivalik foothills."
                headers={["Bus", "Departs", "Arrives", "Type"]}
                rows={buses}
                btnText="Book Bus on RedBus"
                btnHref="https://www.redbus.in/"
                linkText="Get More Details About Bus Travel"
                linkHref="#bus-details"
              />
            </div>
            <div className={styles.pickupSection}>
              <label className={styles.checkboxLabel} htmlFor="pickup-toggle">
                <input
                  type="checkbox"
                  id="pickup-toggle"
                  className={styles.checkbox}
                  checked={pickupOpen}
                  onChange={() => setPickupOpen((prev) => !prev)}
                />
                <span className={styles.checkboxText}>
                  🚖 Need Pickup &amp; Drop Facility?
                </span>
              </label>

              {pickupOpen && (
                <div className={styles.pickupFormWrap}>
                  <hr className={styles.formDivider} />
                  <h4 className={styles.formHeading}>
                    Request Pickup / Drop Service
                  </h4>
                  <p className={styles.formSubtext}>
                    Fill in your details and we will arrange a comfortable
                    transfer in Rishikesh from airport, railway station or bus
                    stand.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="fullName">
                          Full Name *
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          placeholder="Your full name"
                          className={styles.formInput}
                          value={form.fullName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="email">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          className={styles.formInput}
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="phone">
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91 XXXXX XXXXX"
                          className={styles.formInput}
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="altPhone">
                          Alternate Phone
                        </label>
                        <input
                          id="altPhone"
                          name="altPhone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          className={styles.formInput}
                          value={form.altPhone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label
                          className={styles.formLabel}
                          htmlFor="serviceType"
                        >
                          Service Type *
                        </label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          required
                          className={styles.formSelect}
                          value={form.serviceType}
                          onChange={handleChange}
                        >
                          <option value="">Select service type…</option>
                          <option>Airport Pickup</option>
                          <option>Airport Drop</option>
                          <option>Railway Pickup</option>
                          <option>Bus Stand Pickup</option>
                          <option>Both Pickup &amp; Drop</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label
                          className={styles.formLabel}
                          htmlFor="pickupLocation"
                        >
                          Pickup Location
                        </label>
                        <select
                          id="pickupLocation"
                          name="pickupLocation"
                          className={styles.formSelect}
                          value={form.pickupLocation}
                          onChange={handleChange}
                        >
                          <option value="">Select location…</option>
                          <option>Jolly Grant Airport (Dehradun)</option>
                          <option>Haridwar Railway Station</option>
                          <option>Rishikesh Railway Station</option>
                          <option>Rishikesh Bus Stand</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label
                          className={styles.formLabel}
                          htmlFor="dropLocation"
                        >
                          Drop Location
                        </label>
                        <input
                          id="dropLocation"
                          name="dropLocation"
                          type="text"
                          placeholder="e.g. Indian Yoga Association, Rishikesh"
                          className={styles.formInput}
                          value={form.dropLocation}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="guests">
                          Number of Guests *
                        </label>
                        <input
                          id="guests"
                          name="guests"
                          type="number"
                          min="1"
                          max="50"
                          required
                          placeholder="e.g. 2"
                          className={styles.formInput}
                          value={form.guests}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label
                          className={styles.formLabel}
                          htmlFor="arrivalDate"
                        >
                          Arrival Date *
                        </label>
                        <input
                          id="arrivalDate"
                          name="arrivalDate"
                          type="date"
                          required
                          className={styles.formInput}
                          value={form.arrivalDate}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label
                          className={styles.formLabel}
                          htmlFor="arrivalTime"
                        >
                          Arrival Time *
                        </label>
                        <input
                          id="arrivalTime"
                          name="arrivalTime"
                          type="time"
                          required
                          className={styles.formInput}
                          value={form.arrivalTime}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroupFull}>
                        <label
                          className={styles.formLabel}
                          htmlFor="instructions"
                        >
                          Special Instructions
                        </label>
                        <textarea
                          id="instructions"
                          name="instructions"
                          placeholder="Any special requirements, accessibility needs, extra luggage, etc."
                          className={styles.formTextarea}
                          value={form.instructions}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={styles.formGroupFull}>
                        <div className={styles.formBtnRow}>
                          <button type="submit" className={styles.submitBtn}>
                            Request Pickup Service 🙏
                          </button>
                          <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappBtn}
                            aria-label="Contact on WhatsApp for pickup point details"
                          >
                            <WhatsAppIcon />
                            <span>Chat on WhatsApp</span>
                          </a>
                        </div>
                        <p className={styles.whatsappHelperText}>
                          💬 Want to discuss the pickup point directly?{" "}
                          <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappInlineLink}
                          >
                            Click here to chat on WhatsApp
                          </a>{" "}
                          — your message will be sent automatically.
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          <div className={styles.rightPanel}>
            <div className={styles.stickyWrap}>
              <div className={styles.mapCard}>
                <div className={styles.mapLabel}>
                  <span className={styles.mapLabelDot} />
                  <span>Indian Yoga Association, Rishikesh</span>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7440.500180811323!2d78.320039!3d30.132348!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909165c44bab785%3A0x4119a3fa1806f00c!2sAYM%20YOGA%20SCHOOL!5e1!3m2!1sen!2sin!4v1771998100416!5m2!1sen!2sin"
                  className={styles.mapIframe}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Indian Yoga Association Location Rishikesh"
                />

                <div className={styles.mapFooter}>
                  <a
                    href="https://maps.google.com/?q=Indian+Yoga+Association+Rishikesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapDirectionsBtn}
                  >
                    ↗ Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBorder} />
    </section>
  );
}

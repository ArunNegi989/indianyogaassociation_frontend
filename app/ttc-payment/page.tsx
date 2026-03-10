"use client";

import React, { useState } from "react";
import styles from "@/assets/style/ttc-payment/Paymentsection.module.css";

const PaymentSection = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const bank1 = [
    { label: "Account Holder", value: "Mahesh Chand" },
    { label: "Account Number", value: "07252020000801" },
    { label: "Account Type", value: "Current Account" },
    { label: "Swift Code", value: "HDFCINBB" },
    { label: "IFSC / MICR", value: "HDFC0000725" },
    { label: "Bank", value: "HDFC Bank" },
    { label: "Address", value: "53, MJ Mall, Railway Road Rishikesh, Uttarakhand India. Pin: 249201" },
  ];

  const bank2 = [
    { label: "Account Holder", value: "Mahesh Chand" },
    { label: "Account Number", value: "00000010576247358" },
    { label: "Account Type", value: "Saving Account" },
    { label: "IFSC Code", value: "SBIN0002493" },
    { label: "MICR Code", value: "249002104" },
    { label: "Bank", value: "State Bank of India" },
    { label: "Address", value: "Swargashram Rishikesh Dist: Pauri Garhwa Garhwal, Uttarakhand, Pauri Garhwal, 249304" },
  ];

  const paypalOptions = [
    { title: "Yoga Retreats / Sound Healing", icon: "🌿" },
    { title: "100 Hour / 200 Hour / 300 Hour", icon: "🕉️" },
    { title: "500 Hour", icon: "☀️" },
    { title: "Prenatal Yoga", icon: "🌸" },
    { title: "Meditation & Pranayama", icon: "🧘" },
    { title: "Online Course", icon: "📿" },
  ];

  const arrivalMethods = [
    { method: "Cash (INR, USD, AUD, EUR)", charge: "No Extra Charge" },
    { method: "Traveller Checks (USD)", charge: "No Extra Charge" },
    { method: "PayPal Payment", charge: "8% Extra Charge" },
    { method: "Credit / Debit Cards", charge: "3.5% Extra Charge" },
    { method: "American Express Cards", charge: "4.5% Extra Charge" },
  ];

  return (
    <section className={styles.section}>
      {/* Mandala background decoration */}
      <div className={styles.mandalaTopLeft} />
      <div className={styles.mandalaBottomRight} />
      <div className={styles.chakraCenter} />

      <div className={styles.topBorder} />

      <div className={styles.container}>

        {/* ── HEADER ── */}
        <header className={styles.header}>
          <p className={styles.superTitle}>Reserve Your Sacred Journey</p>
          <h1 className={styles.mainTitle}>Yoga Teacher Training — Payment Options</h1>
          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
          <p className={styles.headerDesc}>
            Payment option to pay advance fee to reserve your spot for{" "}
            <a href="#" className={styles.inlineLink}>200-hour yoga ttc</a> or{" "}
            <a href="#" className={styles.inlineLink}>300-hour yoga ttc</a> or 500-hour yoga ttc at AYM Yoga School in Rishikesh India.
          </p>
        </header>

        {/* ── REGISTRATION FEE ── */}
        <div className={styles.regFeeBlock}>
          <div className={styles.chakraIcon}>❋</div>
          <h2 className={styles.sectionTitle}>Registration Fee</h2>
          <div className={styles.sectionUnderline} />
          <p className={styles.regFeeText}>
            To reserve seats at 200-hour, 300-hour, and 500-hour yoga teacher training pay{" "}
            <strong>[₹$100 (Advance Fee) + $10 (Paypal Charge)] = $110</strong>. After we receive your advance fee we will
            send you a confirmation E-mail and information about your course. This advance fee will be deducted from the
            total fee of the course. The rest of the yoga fee can be paid on arrival.
          </p>
        </div>

        {/* ── PAYPAL SECTION ── */}
        <div className={styles.paymentBlock}>
          <div className={styles.chakraIcon}>✦</div>
          <h2 className={styles.sectionTitle}>Pay Via PayPal</h2>
          <div className={styles.sectionUnderline} />
          <div className={styles.paypalGrid}>
            {paypalOptions.map((opt, i) => (
              <div key={i} className={styles.paypalCard}>
                <div className={styles.paypalCardInner}>
                  <span className={styles.paypalCardIcon}>{opt.icon}</span>
                  <h3 className={styles.paypalCardTitle}>{opt.title}</h3>
                  <a
                    href="https://www.paypal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.paypalBtn}
                  >
                    <img
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                      alt="PayPal"
                      className={styles.paypalLogo}
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── UPI SECTION ── */}
        <div className={styles.paymentBlock}>
          <div className={styles.chakraIcon}>☸</div>
          <h2 className={styles.sectionTitle}>Pay via UPI</h2>
          <div className={styles.sectionUnderline} />
          <div className={styles.upiGrid}>
            <div className={styles.upiCard}>
              <div className={styles.upiCardHeader}>Mahesh Yogi Chetan — AYM Yoga</div>
              <div className={styles.qrWrapper}>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=maheshyogaexpert@okhdfcbank%26pn=MaheshYogiChetan"
                  alt="UPI QR Code - maheshyogaexpert@okhdfcbank"
                  className={styles.qrImage}
                />
              </div>
              <p className={styles.upiId}>UPI ID: <strong>maheshyogaexpert@okhdfcbank</strong></p>
              <p className={styles.upiScanText}>Scan to pay with any UPI app</p>
              <button
                className={styles.copyBtn}
                onClick={() => copyToClipboard("maheshyogaexpert@okhdfcbank", "upi")}
              >
                {copiedField === "upi" ? "✓ Copied!" : "Copy UPI ID"}
              </button>
            </div>

            <div className={styles.upiCard + " " + styles.upiCardBranded}>
              <div className={styles.aymBanner}>
                <span className={styles.aymBannerText}>AYM YOGA SCHOOL</span>
              </div>
              <div className={styles.qrWrapper}>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=aymyogaschool@upi%26pn=AYMYogaSchool&color=5c2d00&bgcolor=fff9f0"
                  alt="AYM Yoga School QR Code"
                  className={styles.qrImage}
                />
              </div>
              <div className={styles.aymBanner + " " + styles.aymBannerBottom}>
                <span className={styles.aymBannerText}>Scan and Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── DEBIT/CREDIT CARDS ── */}
        <div className={styles.paymentBlock}>
          <div className={styles.chakraIcon}>⚜</div>
          <h2 className={styles.sectionTitle}>Pay via Debit / Credit Cards</h2>
          <div className={styles.sectionUnderline} />
          <div className={styles.cardPayGrid}>
            {[
              {
                title: "For Indian Students — INR",
                desc: "You can pay via UPI, Wallet, Internet Banking and Debit/Credit Card. It's allowing to pay with Indian Account.",
                badge: "INR",
              },
              {
                title: "For International Students — USD",
                desc: "You can pay Advance fee via Debit / Credit Card. It's allowing to pay in USD.",
                badge: "USD",
              },
              {
                title: "For International Students — EURO",
                desc: "You can pay Advance fee via Debit / Credit Card. It's allowing to pay in Euro.",
                badge: "EUR",
              },
            ].map((card, i) => (
              <div key={i} className={styles.cardPayCard}>
                <div className={styles.cardPayBadge}>{card.badge}</div>
                <h3 className={styles.cardPayTitle}>{card.title}</h3>
                <div className={styles.cardPayDivider} />
                <p className={styles.cardPayDesc}>{card.desc}</p>
                <a href="#" className={styles.bookNowBtn}>Book Now</a>
              </div>
            ))}
          </div>
        </div>

        {/* ── BANK TRANSFER ── */}
        <div className={styles.paymentBlock}>
          <div className={styles.chakraIcon}>🪷</div>
          <h2 className={styles.sectionTitle}>Direct Bank Transfer</h2>
          <div className={styles.sectionUnderline} />
          <div className={styles.bankGrid}>
            {[{ title: "Direct Bank Transfer 1", data: bank1 }, { title: "Direct Bank Transfer 2", data: bank2 }].map(
              (bank, bi) => (
                <div key={bi} className={styles.bankCard}>
                  <div className={styles.bankCardHeader}>
                    <span className={styles.bankCardNum}>{bi + 1}</span>
                    <h3 className={styles.bankCardTitle}>{bank.title}</h3>
                  </div>
                  <div className={styles.bankFields}>
                    {bank.data.map((field, fi) => (
                      <div key={fi} className={styles.bankField}>
                        <span className={styles.bankFieldLabel}>{field.label}</span>
                        <span className={styles.bankFieldValue}>{field.value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={styles.copyBankBtn}
                    onClick={() =>
                      copyToClipboard(
                        bank.data.map((f) => `${f.label}: ${f.value}`).join("\n"),
                        `bank${bi}`
                      )
                    }
                  >
                    {copiedField === `bank${bi}` ? "✓ Copied!" : "Copy Bank Details"}
                  </button>
                </div>
              )
            )}
          </div>
          <p className={styles.gstNote}>⚠ Note: Any Amount paid online — 5% GST (Tax) will be applicable.</p>
        </div>

        {/* ── WESTERN UNION ── */}
        <div className={styles.paymentBlock}>
          <div className={styles.chakraIcon}>✧</div>
          <h2 className={styles.sectionTitle}>Western Money Union</h2>
          <div className={styles.sectionUnderline} />
          <div className={styles.westernCard}>
            <div className={styles.westernIcon}>💫</div>
            <p className={styles.westernText}>
              Western Money Union is also one of the fastest methods to send advance yoga deposit to reserve your seat in yoga TTC.
            </p>
            <div className={styles.westernDetails}>
              <div className={styles.westernField}>
                <span className={styles.westernLabel}>Send fee to:</span>
                <span className={styles.westernValue}>Mahesh Chand</span>
              </div>
              <div className={styles.westernField}>
                <span className={styles.westernLabel}>Address of recipient:</span>
                <span className={styles.westernValue}>AYM Yoga School</span>
              </div>
            </div>
            <p className={styles.westernNote}>
              Send us an email about the detail of your money transfer with the receipt and we will send you a confirmation
              for your course after receiving your payment. Applicant will bear all transition charges. Make sure the full
              amount of the course fee is available in an organization bank account.
            </p>
          </div>
        </div>

        {/* ── ARRIVAL PAYMENT ── */}
        <div className={styles.paymentBlock}>
          <div className={styles.chakraIcon}>🌺</div>
          <h2 className={styles.sectionTitle}>Payment Option on Arrival</h2>
          <div className={styles.sectionUnderline} />
          <p className={styles.arrivalIntro}>
            Our school would like it if you would pay the rest of the balance amount on arrival on the first day of yoga TTC at school office. We accept:
          </p>
          <div className={styles.arrivalGrid}>
            {arrivalMethods.map((item, i) => (
              <div key={i} className={styles.arrivalCard}>
                <div className={styles.arrivalMethod}>{item.method}</div>
                <div className={`${styles.arrivalCharge} ${item.charge.includes("No") ? styles.arrivalFree : styles.arrivalFee}`}>
                  {item.charge}
                </div>
              </div>
            ))}
          </div>
          <p className={styles.gstNote}>⚠ Note: Any Amount paid online or by bank transfer — GST rate of 5% is applicable.</p>
        </div>

        {/* ── POLICIES ── */}
        <div className={styles.policiesGrid}>
          {[
            {
              icon: "📜",
              title: "Terms & Conditions",
              text: "This policy applies to each participant of the Yoga TTC program and yoga retreat programs. After enrolling, students must adhere to all policies and conditions outlined by the school, acknowledge all information during registration, and strictly follow all disciplines and student guidelines during their stay.",
            },
            {
              icon: "🔒",
              title: "Privacy Policy",
              text: "We believe in keeping students' and participants' personal information confidential. Information provided during registration is solely for school purposes and kept strictly confidential. As a prestigious yoga institution, we will not share personal information with any third party unless required for contract registration.",
            },
            {
              icon: "↩️",
              title: "Cancellation & Refunds",
              text: "All payments for the courses are pre-contracted and hence cannot be refunded in case of any cancellation. The fees are non-negotiable. Students must inform the school beforehand via email so that space can be offered to someone else.",
            },
          ].map((policy, i) => (
            <div key={i} className={styles.policyCard}>
              <div className={styles.policyIcon}>{policy.icon}</div>
              <h3 className={styles.policyTitle}>{policy.title}</h3>
              <div className={styles.policyDivider} />
              <p className={styles.policyText}>{policy.text}</p>
            </div>
          ))}
        </div>

        {/* ── FOOTER DIVIDER ── */}
        <div className={styles.footerDivider}>
          <span className={styles.dividerLine} />
          <span className={styles.omSymbol}>ॐ</span>
          <span className={styles.dividerLine} />
        </div>

      </div>

      <div className={styles.bottomBorder} />
    </section>
  );
};

export default PaymentSection;
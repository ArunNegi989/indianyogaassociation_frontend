"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/ttc-payment/Paymentsection.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

/* ─────────────────────── Types (shape of backend document) ─────────────────────── */
interface KV { label: string; value: string }

interface PaymentData {
  heroImage?: string;
  heroImageAlt?: string;

  superTitle?: string;
  mainTitle?: string;
  headerDesc?: string;

  regFeeTitle?: string;
  regFeeHighlight?: string;
  regFeeText?: string;

  paypalTitle?: string;
  paypalLink?: string;
  paypalLogo?: string;
  paypalOptions?: { icon: string; title: string; link: string }[];

  upiTitle?: string;
  upiQr1?: string;
  upiQr1Alt?: string;
  upiId?: string;
  upiCopyLabel?: string;
  upiQr2?: string;
  upiQr2Alt?: string;
  upiId2?: string;
  upiCopyLabel2?: string;

  cardsTitle?: string;
  cardsBtnLabel?: string;
  cards?: { badge: string; title: string; desc: string; link: string }[];

  bankTitle?: string;
  banks?: { title: string; fields: KV[] }[];
  gstNoteOnline?: string;

  westernTitle?: string;
  westernText?: string;
  westernSendTo?: string;
  westernAddress?: string;
  westernNote?: string;

  arrivalTitle?: string;
  arrivalIntro?: string;
  arrivalMethods?: { method: string; charge: string }[];
  gstNoteArrival?: string;

  policies?: { icon: string; title: string; text: string }[];
}

/* ─────────────────────── Helpers ─────────────────────── */
const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href);

/* ─────────────────────── Component ─────────────────────── */
const PaymentSection = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/payment-section");
        const doc = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        setData(doc ?? null);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) return null;
  if (!data) return <HowToReach />;

  const heroSrc = getImageUrl(data.heroImage);
  const paypalLogoSrc = getImageUrl(data.paypalLogo);
  const qr1Src = getImageUrl(data.upiQr1);
  const qr2Src = getImageUrl(data.upiQr2);

  const paypalOptions = data.paypalOptions ?? [];
  const cards = data.cards ?? [];
  const banks = data.banks ?? [];
  const arrivalMethods = data.arrivalMethods ?? [];
  const policies = data.policies ?? [];

  const feeText = data.regFeeText ?? "";
  const hasHighlight = feeText.includes("{highlight}");
  const [feeBefore, feeAfter] = hasHighlight ? feeText.split("{highlight}") : [feeText, ""];

  const showUpi = !!(qr1Src || qr2Src);

  return (
    <>
      {heroSrc && (
        <section className={styles.heroSection}>
          <Image
            src={heroSrc}
            alt={data.heroImageAlt || ""}
            width={1180}
            height={540}
            className={styles.heroImage}
            unoptimized
            priority
          />
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.chakraCenter} />
        <div className={styles.a} />

        <div className={styles.container}>
          {/* ── HEADER ── */}
          <header className={styles.header}>
            {data.superTitle && <p className={styles.superTitle}>{data.superTitle}</p>}
            {data.mainTitle && <h1 className={styles.mainTitle}>{data.mainTitle}</h1>}
            <div className={styles.omDivider}>
              <span className={styles.dividerLine} />
              <span className={styles.omSymbol}>ॐ</span>
              <span className={styles.dividerLine} />
            </div>
            {data.headerDesc && (
              <div
                className={styles.headerDesc}
                dangerouslySetInnerHTML={{ __html: data.headerDesc }}
              />
            )}
          </header>

          {/* ── REGISTRATION FEE ── */}
          {(data.regFeeTitle || feeText) && (
            <div className={styles.regFeeBlock}>
              <div className={styles.chakraIcon}>❋</div>
              {data.regFeeTitle && <h2 className={styles.sectionTitle}>{data.regFeeTitle}</h2>}
              <div className={styles.sectionUnderline} />
              <p className={styles.regFeeText}>
                {feeBefore}
                {hasHighlight && <strong>{data.regFeeHighlight}</strong>}
                {feeAfter}
              </p>
            </div>
          )}

          {/* ── PAYPAL SECTION ── */}
          {paypalOptions.length > 0 && (
            <div className={styles.paymentBlock}>
              <div className={styles.chakraIcon}>✦</div>
              {data.paypalTitle && <h2 className={styles.sectionTitle}>{data.paypalTitle}</h2>}
              <div className={styles.sectionUnderline} />
              <div className={styles.paypalGrid}>
                {paypalOptions.map((opt, i) => (
                  <div key={i} className={styles.paypalCard}>
                    <div className={styles.paypalCardInner}>
                      <span className={styles.paypalCardIcon}>{opt.icon}</span>
                      <h3 className={styles.paypalCardTitle}>{opt.title}</h3>
                      <Link
                        href={opt.link || data.paypalLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.paypalBtn}
                      >
                        {paypalLogoSrc ? (
                          <Image
                            src={paypalLogoSrc}
                            alt="PayPal"
                            width={160}
                            height={50}
                            className={styles.paypalLogo}
                            unoptimized
                          />
                        ) : (
                          "PayPal"
                        )}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── UPI SECTION ── */}
          {showUpi && (
            <div className={styles.paymentBlock}>
              <div className={styles.chakraIcon}>☸</div>
              {data.upiTitle && <h2 className={styles.sectionTitle}>{data.upiTitle}</h2>}
              <div className={styles.sectionUnderline} />
              <div className={styles.upiGrid}>
                {qr1Src && (
                  <div className={styles.upiCard}>
                    <div className={styles.qrWrapper}>
                      <Image
                        src={qr1Src}
                        alt={data.upiQr1Alt || "UPI QR Code"}
                        width={400}
                        height={400}
                        className={styles.qrImage}
                        unoptimized
                      />
                    </div>
                    {data.upiId && (
                      <button
                        className={styles.copyBtn}
                        onClick={() => copyToClipboard(data.upiId as string, "upi1")}
                      >
                        {copiedField === "upi1" ? "✓ Copied!" : data.upiCopyLabel}
                      </button>
                    )}
                  </div>
                )}

                {qr2Src && (
                  <div className={styles.upiCard + " " + styles.upiCardBranded}>
                    <div className={styles.qrWrapper}>
                      <Image
                        src={qr2Src}
                        alt={data.upiQr2Alt || "UPI QR Code"}
                        width={400}
                        height={400}
                        className={styles.qrImage}
                        unoptimized
                      />
                    </div>
                    {data.upiId2 && (
                      <button
                        className={styles.copyBtn}
                        onClick={() => copyToClipboard(data.upiId2 as string, "upi2")}
                      >
                        {copiedField === "upi2" ? "✓ Copied!" : data.upiCopyLabel2}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DEBIT/CREDIT CARDS ── */}
          {cards.length > 0 && (
            <div className={styles.paymentBlock}>
              <div className={styles.chakraIcon}>⚜</div>
              {data.cardsTitle && <h2 className={styles.sectionTitle}>{data.cardsTitle}</h2>}
              <div className={styles.sectionUnderline} />
              <div className={styles.cardPayGrid}>
                {cards.map((card, i) => (
                  <div key={i} className={styles.cardPayCard}>
                    <div className={styles.cardPayBadge}>{card.badge}</div>
                    <h3 className={styles.cardPayTitle}>{card.title}</h3>
                    <div className={styles.cardPayDivider} />
                    <p className={styles.cardPayDesc}>{card.desc}</p>
                    <Link
                      href={card.link || "#"}
                      className={styles.bookNowBtn}
                      {...(isExternal(card.link)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {data.cardsBtnLabel}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BANK TRANSFER ── */}
          {banks.length > 0 && (
            <div className={styles.paymentBlock}>
              <div className={styles.chakraIcon}>🪷</div>
              {data.bankTitle && <h2 className={styles.sectionTitle}>{data.bankTitle}</h2>}
              <div className={styles.sectionUnderline} />
              <div className={styles.bankGrid}>
                {banks.map((bank, bi) => (
                  <div key={bi} className={styles.bankCard}>
                    <div className={styles.bankCardHeader}>
                      <span className={styles.bankCardNum}>{bi + 1}</span>
                      <h3 className={styles.bankCardTitle}>{bank.title}</h3>
                    </div>
                    <div className={styles.bankFields}>
                      {(bank.fields ?? []).map((field, fi) => (
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
                          (bank.fields ?? []).map((f) => `${f.label}: ${f.value}`).join("\n"),
                          `bank${bi}`,
                        )
                      }
                    >
                      {copiedField === `bank${bi}` ? "✓ Copied!" : "Copy Bank Details"}
                    </button>
                  </div>
                ))}
              </div>
              {data.gstNoteOnline && <p className={styles.gstNote}>{data.gstNoteOnline}</p>}
            </div>
          )}

          {/* ── WESTERN UNION ── */}
          {(data.westernTitle || data.westernText) && (
            <div className={styles.paymentBlock}>
              <div className={styles.chakraIcon}>✧</div>
              {data.westernTitle && <h2 className={styles.sectionTitle}>{data.westernTitle}</h2>}
              <div className={styles.sectionUnderline} />
              <div className={styles.westernCard}>
                <div className={styles.westernIcon}>💫</div>
                {data.westernText && <p className={styles.westernText}>{data.westernText}</p>}
                <div className={styles.westernDetails}>
                  {data.westernSendTo && (
                    <div className={styles.westernField}>
                      <span className={styles.westernLabel}>Send fee to:</span>
                      <span className={styles.westernValue}>{data.westernSendTo}</span>
                    </div>
                  )}
                  {data.westernAddress && (
                    <div className={styles.westernField}>
                      <span className={styles.westernLabel}>Address of recipient:</span>
                      <span className={styles.westernValue}>{data.westernAddress}</span>
                    </div>
                  )}
                </div>
                {data.westernNote && <p className={styles.westernNote}>{data.westernNote}</p>}
              </div>
            </div>
          )}

          {/* ── ARRIVAL PAYMENT ── */}
          {arrivalMethods.length > 0 && (
            <div className={styles.paymentBlock}>
              <div className={styles.chakraIcon}>🌺</div>
              {data.arrivalTitle && <h2 className={styles.sectionTitle}>{data.arrivalTitle}</h2>}
              <div className={styles.sectionUnderline} />
              {data.arrivalIntro && <p className={styles.arrivalIntro}>{data.arrivalIntro}</p>}
              <div className={styles.arrivalGrid}>
                {arrivalMethods.map((item, i) => (
                  <div key={i} className={styles.arrivalCard}>
                    <div className={styles.arrivalMethod}>{item.method}</div>
                    <div
                      className={`${styles.arrivalCharge} ${item.charge.includes("No") ? styles.arrivalFree : styles.arrivalFee
                        }`}
                    >
                      {item.charge}
                    </div>
                  </div>
                ))}
              </div>
              {data.gstNoteArrival && <p className={styles.gstNote}>{data.gstNoteArrival}</p>}
            </div>
          )}

          {/* ── POLICIES ── */}
          {policies.length > 0 && (
            <div className={styles.policiesGrid}>
              {policies.map((policy, i) => (
                <div key={i} className={styles.policyCard}>
                  <div className={styles.policyIcon}>{policy.icon}</div>
                  <h3 className={styles.policyTitle}>{policy.title}</h3>
                  <div className={styles.policyDivider} />
                  <p className={styles.policyText}>{policy.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── FOOTER DIVIDER ── */}
          <div className={styles.footerDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
        </div>

        <div className={styles.bottomBorder} />
      </section>
      <HowToReach />
    </>
  );
};

export default PaymentSection;
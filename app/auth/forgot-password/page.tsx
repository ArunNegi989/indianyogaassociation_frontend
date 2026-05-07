"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Auth/Forgotpassword.module.css";
import api from "@/lib/api";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");

  // ── Step state ───────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Shared state ─────────────────────────────────────────────
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Step 1: Send OTP ─────────────────────────────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ───────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      (prev as HTMLInputElement)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      e.preventDefault();
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp: otpString });
      setResetToken(res.data.resetToken);
      setStep("password");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        resetToken,
        newPassword,
      });
      setSuccess("Password reset successfully!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────
  const handleResendOTP = async () => {
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setOtp(["", "", "", "", "", ""]);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step meta ────────────────────────────────────────────────
  const stepMeta = {
    email: { num: 1, label: "Enter Email" },
    otp: { num: 2, label: "Verify OTP" },
    password: { num: 3, label: "New Password" },
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.card}>
        {/* Top accent bar */}
        <div className={styles.accentBar} />

        {/* Om symbol watermark */}
        <div className={styles.omWatermark}>ॐ</div>

        {/* Header */}
        <div className={styles.cardHeader}>
          <h1>Forgot Password</h1>
          <div className={styles.omDivider}>
            <span className={styles.line} />
            <span className={styles.omChar}>ॐ</span>
            <span className={styles.line} />
          </div>
          <p className={styles.subtitle}>
            {step === "email" && "Enter your registered email address"}
            {step === "otp" && `OTP sent to ${email}`}
            {step === "password" && "Set your new password"}
          </p>
        </div>

        {/* Step indicator */}
        <div className={styles.stepIndicator}>
          {(["email", "otp", "password"] as Step[]).map((s, i) => {
            const stepNum = i + 1;
            const currentNum = stepMeta[step].num;
            const isDone = currentNum > stepNum;
            const isActive = currentNum === stepNum;
            return (
              <div key={s} className={styles.stepItem}>
                <div
                  className={`${styles.stepCircle} ${isActive ? styles.active : ""} ${isDone ? styles.done : ""}`}
                >
                  {isDone ? "✓" : stepNum}
                </div>
                <span className={`${styles.stepLabel} ${isActive ? styles.activeLabel : ""}`}>
                  {stepMeta[s].label}
                </span>
                {i < 2 && (
                  <div className={`${styles.stepConnector} ${isDone ? styles.connectorDone : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1: Email ── */}
        {step === "email" && (
          <form className={styles.form} onSubmit={handleSendOTP}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner}>⟳</span>
              ) : (
                "Send OTP"
              )}
            </button>

            <Link href="/auth/login" className={styles.backLink}>
              ← Back to Sign In
            </Link>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === "otp" && (
          <form className={styles.form} onSubmit={handleVerifyOTP}>
            <p className={styles.otpHint}>
              Enter the 6-digit code sent to your email. Valid for 10 minutes.
            </p>

            <div className={styles.otpGrid} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  className={styles.otpInput}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}>⟳</span> : "Verify OTP"}
            </button>

            <div className={styles.resendRow}>
              <span>Didn&apos;t receive the OTP?</span>
              <button
                type="button"
                className={styles.resendBtn}
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>

            <button
              type="button"
              className={styles.textBtn}
              onClick={() => { setStep("email"); setError(""); setOtp(["","","","","",""]); }}
            >
              ← Change email
            </button>
          </form>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === "password" && (
          <form className={styles.form} onSubmit={handleResetPassword}>
            <div className={styles.inputGroup}>
              <label>New Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Password strength bar */}
            {newPassword && (
              <div className={styles.strengthBar}>
                <div
                  className={`${styles.strengthFill} ${
                    newPassword.length < 6
                      ? styles.weak
                      : newPassword.length < 10
                      ? styles.medium
                      : styles.strong
                  }`}
                />
                <span className={styles.strengthLabel}>
                  {newPassword.length < 6
                    ? "Weak"
                    : newPassword.length < 10
                    ? "Medium"
                    : "Strong"}
                </span>
              </div>
            )}

            {error && <p className={styles.errorMsg}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}>⟳</span> : "Reset Password"}
            </button>
          </form>
        )}

        {/* Bottom accent bar */}
        <div className={styles.accentBar} />
      </div>
    </main>
  );
}
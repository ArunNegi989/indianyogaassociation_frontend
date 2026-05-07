"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/assets/style/Auth/Changepassword.module.css";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Strength = "empty" | "weak" | "medium" | "strong";

function getStrength(pw: string): Strength {
  if (!pw) return "empty";
  if (pw.length < 6) return "weak";
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
  if (pw.length >= 10 && score >= 2) return "strong";
  return "medium";
}

const strengthMeta: Record<Strength, { label: string; width: string; color: string }> = {
  empty:  { label: "",        width: "0%",   color: "transparent" },
  weak:   { label: "Weak",    width: "28%",  color: "#e53935" },
  medium: { label: "Medium",  width: "62%",  color: "#f5b800" },
  strong: { label: "Strong",  width: "100%", color: "#2e7d32" },
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    newPw: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = getStrength(form.newPassword);
  const meta = strengthMeta[strength];

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const toggle = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setSuccess("Password changed successfully! Redirecting to login…");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

      // Log user out after 2s — new password invalidates sessions
      setTimeout(() => {
        setUser(null);
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── Page heading ── */}
      <div className={styles.pageHeading}>
        <div className={styles.headingLeft}>
          <span className={styles.omAccent}>ॐ</span>
          <div>
            <h1>Change Password</h1>
            <p>Update your admin account credentials</p>
          </div>
        </div>
        <button
          className={styles.backBtn}
          type="button"
          onClick={() => router.back()}
        >
          ← Back
        </button>
      </div>

      {/* ── Main grid ── */}
      <div className={styles.grid}>

        {/* ── LEFT: Form card ── */}
        <div className={styles.formCard}>
          <div className={styles.cardAccentTop} />

          <div className={styles.cardHeader}>
            <div className={styles.lockIcon}>🔐</div>
            <h2>Security Update</h2>
            <p>Enter your current password, then choose a new one</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Current password */}
            <div className={styles.fieldGroup}>
              <label htmlFor="current">Current Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🗝</span>
                <input
                  id="current"
                  type={show.current ? "text" : "password"}
                  placeholder="Enter current password"
                  required
                  value={form.currentPassword}
                  onChange={(e) => handleChange("currentPassword", e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => toggle("current")}
                  aria-label="Toggle visibility"
                >
                  {show.current ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className={styles.dividerLine}>
              <span />
              <span className={styles.dividerText}>new credentials</span>
              <span />
            </div>

            {/* New password */}
            <div className={styles.fieldGroup}>
              <label htmlFor="newPw">New Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  id="newPw"
                  type={show.newPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  required
                  value={form.newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => toggle("newPw")}
                  aria-label="Toggle visibility"
                >
                  {show.newPw ? "🙈" : "👁"}
                </button>
              </div>

              {/* Strength bar */}
              {form.newPassword && (
                <div className={styles.strengthRow}>
                  <div className={styles.strengthTrack}>
                    <div
                      className={styles.strengthFill}
                      style={{
                        width: meta.width,
                        background: meta.color,
                      }}
                    />
                  </div>
                  <span
                    className={styles.strengthLabel}
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className={styles.fieldGroup}>
              <label htmlFor="confirm">Confirm New Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔏</span>
                <input
                  id="confirm"
                  type={show.confirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => toggle("confirm")}
                  aria-label="Toggle visibility"
                >
                  {show.confirm ? "🙈" : "👁"}
                </button>
              </div>

              {/* Match indicator */}
              {form.confirmPassword && (
                <span
                  className={styles.matchHint}
                  style={{
                    color:
                      form.newPassword === form.confirmPassword
                        ? "#2e7d32"
                        : "#e53935",
                  }}
                >
                  {form.newPassword === form.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </span>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className={styles.errorMsg}>
                <span>⚠</span> {error}
              </div>
            )}
            {success && (
              <div className={styles.successMsg}>
                <span>✓</span> {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}>⟳</span> Updating…
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          <div className={styles.cardAccentBottom} />
        </div>

        {/* ── RIGHT: Tips card ── */}
        <div className={styles.tipsCard}>
          <div className={styles.tipsHeader}>
            <span className={styles.tipsOm}>ॐ</span>
            <h3>Password Tips</h3>
          </div>
          <ul className={styles.tipsList}>
            {[
              { icon: "🌿", text: "Use at least 8 characters for better security" },
              { icon: "🔡", text: "Mix uppercase and lowercase letters" },
              { icon: "🔢", text: "Include numbers and special characters (!@#$)" },
              { icon: "🚫", text: "Avoid using your name, email, or common words" },
              { icon: "🔄", text: "Change your password regularly every 90 days" },
              { icon: "🔑", text: "Never share your password with anyone" },
            ].map((tip, i) => (
              <li key={i} className={styles.tipItem}>
                <span className={styles.tipIcon}>{tip.icon}</span>
                <span>{tip.text}</span>
              </li>
            ))}
          </ul>

          <div className={styles.securityBadge}>
            <span className={styles.badgeIcon}>🛡</span>
            <div>
              <strong>Secure Session</strong>
              <p>Changing password will log out all other active sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
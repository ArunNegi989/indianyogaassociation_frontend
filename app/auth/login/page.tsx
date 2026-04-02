"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/assets/style/Auth/login.module.css";
import api from "@/lib/api";
import { setAccessToken } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  // ── Register State ──────────────────────────────────────────
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // ── Login State ─────────────────────────────────────────────
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);

    try {
      const res = await api.post("/auth/register", registerData);
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      router.push("/admin");
    } catch (err: any) {
      setRegisterError(
        err?.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await api.post("/auth/login", loginData);
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      router.push("/admin");
    } catch (err: any) {
      setLoginError(
        err?.response?.data?.message || "Invalid credentials. Try again.",
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <div
        className={`${styles.authWrapper} ${isActive ? styles.panelActive : ""}`}
        id="authWrapper"
      >
        {/* ── Register Form ─────────────────────────────────── */}
        <div className={`${styles.authFormBox} ${styles.registerFormBox}`}>
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <div className={styles.omDividerSmall}>
              <span className={styles.omLineBar} />
              <span className={styles.omChar}>ॐ</span>
              <span className={styles.omLineBar} />
            </div>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" aria-label="Google">
                <i className="fab fa-google" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
            <span>or use your email for registration</span>

            <input
              type="text"
              placeholder="Full Name"
              required
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />

            {registerError && (
              <p className={styles.errorMsg}>{registerError}</p>
            )}

            <button type="submit" disabled={registerLoading}>
              {registerLoading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className={styles.mobileSwitch}>
              <p>Already have an account?</p>
              <button type="button" onClick={() => setIsActive(false)}>
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* ── Login Form ────────────────────────────────────── */}
        <div className={`${styles.authFormBox} ${styles.loginFormBox}`}>
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <div className={styles.omDividerSmall}>
              <span className={styles.omLineBar} />
              <span className={styles.omChar}>ॐ</span>
              <span className={styles.omLineBar} />
            </div>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" aria-label="Google">
                <i className="fab fa-google" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
            <span>or use your account</span>

            <input
              type="email"
              placeholder="Email Address"
              required
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <a href="#">Forgot your password?</a>

            {loginError && <p className={styles.errorMsg}>{loginError}</p>}

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className={styles.mobileSwitch}>
              <p>Don&apos;t have an account?</p>
              <button type="button" onClick={() => setIsActive(true)}>
                Sign Up
              </button>
            </div>
          </form>
        </div>

        {/* ── Sliding Overlay Panel ─────────────────────────── */}
        <div className={styles.slidePanelWrapper}>
          <div className={styles.slidePanel}>
            <div
              className={`${styles.panelContent} ${styles.panelContentLeft}`}
            >
              <h1>Welcome Back!</h1>
              <p>
                Stay connected by logging in with your credentials and continue
                your spiritual journey
              </p>
              <button
                className={styles.transparentBtn}
                type="button"
                onClick={() => setIsActive(false)}
              >
                Sign In
              </button>
            </div>
            <div
              className={`${styles.panelContent} ${styles.panelContentRight}`}
            >
              <h1>Namaste!</h1>
              <p>
                Begin your amazing yoga journey by creating an account with us
                today
              </p>
              <button
                className={styles.transparentBtn}
                type="button"
                onClick={() => setIsActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

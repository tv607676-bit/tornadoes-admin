import { useState } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://api.tornadoes.co.in/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        // Store token and admin info in localStorage
        localStorage.setItem("admin_token", data.data.token);
        localStorage.setItem("admin_email", data.data.admin.email);
        localStorage.setItem("admin_id", data.data.admin.id);
        localStorage.setItem("admin_role", data.data.admin.role);
        onLogin();
      } else {
        setError(data.message || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-container">
        <div className="login-logo">
          <div className="logo-icon">T</div>
          <span className="logo-text">Tornadoes Academy</span>
        </div>

        <p className="login-subtitle">Admin Portal</p>

        <div className="login-card">
          <h1 className="card-title">Welcome Back</h1>
          <p className="card-desc">Sign in to access your account</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon"></span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@forcetuition.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon"></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>Sign In <span className="arrow">→</span></>
              )}
            </button>
          </form>

          <div className="demo-box">
            <p className="demo-title">Demo Credentials:</p>
            <p className="demo-cred">testadmin@example.com / TestPass123</p>
            <button
              className="demo-fill-btn"
              onClick={() => {
                setEmail("testadmin@example.com");
                setPassword("TestPass123");
              }}
            >
              Auto Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

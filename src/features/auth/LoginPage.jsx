// src/features/auth/LoginPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser } from "./authSlice";
import "../../styles/pages.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      Swal.fire({ icon: "warning", title: "Missing Fields", background: "#1a1a1a", color: "#f0f0f0" });
      return;
    }
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      Swal.fire({ icon: "success", title: "Welcome back!", timer: 1200, showConfirmButton: false, background: "#1a1a1a", color: "#f0f0f0" });
      setTimeout(() => navigate("/home"), 1200);
    } else {
      Swal.fire({ icon: "error", title: "Login Failed", text: res.payload || "Invalid credentials", background: "#1a1a1a", color: "#f0f0f0" });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <div className="auth-card__brand-icon">🍔</div>
          FoodCourt
        </div>
        <h2>Welcome back</h2>
        <p className="auth-card__sub">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Enter your password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</> : "Sign In →"}
          </button>
        </form>

        <p className="auth-footer">
          No account? <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
}
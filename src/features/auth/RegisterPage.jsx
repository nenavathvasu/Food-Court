// src/features/auth/RegisterPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser } from "./authSlice";
import "../../styles/pages.css";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      Swal.fire({ icon: "success", title: "Account created!", text: "You can now sign in.", timer: 1800, showConfirmButton: false, background: "#1a1a1a", color: "#f0f0f0" });
      setTimeout(() => navigate("/login"), 1800);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <div className="auth-card__brand-icon">🍔</div>
          FoodCourt
        </div>
        <h2>Create account</h2>
        <p className="auth-card__sub">Join thousands of food lovers</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Full Name</label>
            <input className="input" type="text" placeholder="Your name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="auth-form-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Create a password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating…</> : "Create Account →"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
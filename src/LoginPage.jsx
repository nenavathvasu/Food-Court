// src/LoginPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(form)).then((res) => {
  if (res.meta.requestStatus === "fulfilled") {
    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      timer: 1200,
      showConfirmButton: false,
    });

    setTimeout(() => navigate("/veg"), 1200);
  } else {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: res.payload,
    });
  }
});

  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ minWidth: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            No account? <a href="/register">Register</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

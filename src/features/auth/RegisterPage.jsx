// RegisterPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { registerUser } from "./authSlice";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "You can now login.",
          timer: 1800,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/login"), 1800);
      }
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ minWidth: "350px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && <p className="text-danger text-center mt-2">{error}</p>}
        </form>

        <div className="text-center mt-3">
          <small>
            Already have an account? <a href="/login">Login here</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

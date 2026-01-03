// src/LogoutButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "./authSlice";

function LogoutButton() {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(logout())}
      style={{ padding: "6px 12px", marginLeft: "12px" }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;

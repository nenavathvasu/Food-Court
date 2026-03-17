// src/features/menu/Veg.jsx
import React from "react";
import MenuPage from "../menu/Menupage";
import { fetchVeg, setVegPage, resetVegPage } from "./vegSlice";

export default function Veg() {
  return (
    <MenuPage
      title="Fresh From The Garden"
      subtitle="Handpicked veggies, cooked with love. Delivered hot to your door."
      tag="🌱 100% Vegetarian"
      heroImage="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
      fetchAction={fetchVeg}
      stateKey="veg"
      setPageAction={setVegPage}
      resetPageAction={resetVegPage}
      wishlistKey="vegWishlist"
      offerText="30% off all veg combos today"
    />
  );
}
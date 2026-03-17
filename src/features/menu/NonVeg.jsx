// src/features/menu/NonVeg.jsx
import React from "react";
import MenuPage from "../menu/Menupage";
import { fetchNonveg, setNonvegPage, resetNonvegPage } from "./nonvegSlice";

export default function NonVeg() {
  return (
    <MenuPage
      title="Flame‑Grilled Perfection"
      subtitle="Juicy kebabs, sizzling wings, and rich curries – crafted by master chefs."
      tag="🍗 Smoky & Spicy"
      heroImage="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
      fetchAction={fetchNonveg}
      stateKey="nonveg"
      setPageAction={setNonvegPage}
      resetPageAction={resetNonvegPage}
      wishlistKey="nonvegWishlist"
      offerText="Flash Sale! 30% off on all grills"
    />
  );
}
// src/pages/AboutUs.jsx
import React from "react";
import "../styles/pages.css";

const VALUES = [
  { icon: "🚀", title: "Speed",   desc: "We deliver in 30 minutes or less, every time." },
  { icon: "🛡️", title: "Hygiene", desc: "FSSAI certified kitchens and hygienic packaging." },
  { icon: "💛", title: "Quality", desc: "Only the freshest ingredients from trusted sources." },
  { icon: "📞", title: "Support", desc: "Our team is available 24/7 to assist you." },
];

const STATS = [
  { value: "500+",   label: "Restaurants" },
  { value: "50K+",   label: "Happy Customers" },
  { value: "30 Min", label: "Avg Delivery" },
  { value: "24/7",   label: "Support" },
];

const TEAM = [
  { name: "Arjun Reddy",   role: "Founder & CEO",       emoji: "👨‍💼" },
  { name: "Priya Sharma",  role: "Head of Operations",  emoji: "👩‍💼" },
  { name: "Karthik Rao",   role: "Tech Lead",            emoji: "👨‍💻" },
];

export default function AboutUs() {
  return (
    <div>
      <section className="about-hero">
        <div className="container">
          <h1>About FoodCourt 🍔</h1>
          <p>Delivering happiness to Hyderabad since 2020</p>
        </div>
      </section>

      {/* Who We Are */}
      <section style={{ padding: "72px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", marginBottom: 16 }}>Who We Are</h2>
          <p style={{ color: "var(--text-2)", maxWidth: 600, margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
            FoodCourt is Hyderabad's favourite food delivery platform, connecting hungry customers
            with the best local restaurants. We believe great food should reach everyone — hot, fresh, and on time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "60px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 800, color: "var(--primary)" }}>{s.value}</div>
                <div style={{ color: "var(--text-2)", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "72px 0" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", textAlign: "center", marginBottom: 36 }}>Our Values</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {VALUES.map((v) => (
              <div key={v.title} className="about-value-card">
                <div className="icon">{v.icon}</div>
                <h5>{v.title}</h5>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", padding: "72px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", marginBottom: 36 }}>Meet the Team</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 720, margin: "0 auto" }}>
            {TEAM.map((m) => (
              <div key={m.name} className="about-team-card">
                <div className="emoji">{m.emoji}</div>
                <h6 style={{ fontWeight: 700, marginBottom: 4 }}>{m.name}</h6>
                <p style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-3)", fontSize: "0.85rem" }}>
        © {new Date().getFullYear()} FoodCourt. Made with ❤️ in Hyderabad.
      </div>
    </div>
  );
}
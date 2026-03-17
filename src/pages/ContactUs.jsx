// src/pages/ContactUs.jsx
import React, { useState } from "react";
import "../styles/Pages.css";

const CONTACTS = [
  { icon: "📧", title: "Email Support", text: "support@foodcourt.com" },
  { icon: "📱", title: "Call Us",       text: "+91 98765 43210" },
  { icon: "💬", title: "Live Chat",     text: "Chat with our agent" },
  { icon: "📍", title: "Location",      text: "Hyderabad, India" },
];

const FAQS = [
  { q: "How long does delivery take?",       a: "Usually 25–40 minutes depending on your distance." },
  { q: "How can I track my order?",          a: "Live tracking is available in the Orders section after placing." },
  { q: "Can I cancel my order?",             a: "Yes, before the restaurant starts preparing your food." },
  { q: "What payment methods are accepted?", a: "UPI, Cards, Wallets, NetBanking and Cash on Delivery." },
  { q: "How do refunds work?",               a: "Refunds are processed within 5–7 working days to your source." },
];

export default function ContactUs() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      <section className="contact-hero">
        <div className="container">
          <h1>We'd Love to Hear From You 💬</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 12 }}>
            Support, feedback, or just say hello — we're always ready!
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: "60px 24px" }}>
        {/* Contact cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 48 }}>
          {CONTACTS.map((c) => (
            <div key={c.title} className="contact-info-card">
              <div className="icon">{c.icon}</div>
              <h5>{c.title}</h5>
              <p>{c.text}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          {/* Form */}
          <div className="contact-form-card">
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 20 }}>Send a Message ✉️</h4>
            <div className="contact-form-group">
              <input className="input" type="text" placeholder="Your Name" />
            </div>
            <div className="contact-form-group">
              <input className="input" type="email" placeholder="Your Email" />
            </div>
            <div className="contact-form-group">
              <input className="input" type="tel" placeholder="Phone Number" />
            </div>
            <div className="contact-form-group">
              <select className="input">
                <option>General Inquiry</option>
                <option>Order Issue</option>
                <option>Payment Problem</option>
                <option>Feedback & Suggestions</option>
              </select>
            </div>
            <div className="contact-form-group">
              <textarea className="input" rows="4" placeholder="Your Message" style={{ resize: "vertical" }} />
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 4 }}>
              Send Message 🚀
            </button>
          </div>

          {/* Map + Hours */}
          <div>
            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 20, border: "1px solid var(--border)" }}>
              <iframe
                title="location"
                src="https://maps.google.com/maps?q=Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%" height="240"
                style={{ border: 0, display: "block" }}
                loading="lazy"
              />
            </div>
            <div className="contact-hours-card">
              <h5>🕒 Support Hours</h5>
              <p>Mon – Fri: 8:00 AM – 10:00 PM</p>
              <p>Sat – Sun: 9:00 AM – 11:00 PM</p>
              <p>24/7 Chatbot Assistance Available 🤖</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="contact-faq">
          <h3>Frequently Asked Questions ❓</h3>
          {FAQS.map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-item__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}
                <i className={`bi bi-chevron-${openFaq === i ? "up" : "down"}`} style={{ color: "var(--text-3)" }} />
              </div>
              <div className={`faq-item__a${openFaq === i ? " open" : ""}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
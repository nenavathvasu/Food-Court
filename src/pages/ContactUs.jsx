import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ContactUs.css";

function ContactUs() {
  return (
    <div className="contact-page">

      {/* HERO */}
      <section className="contact-hero text-white text-center d-flex align-items-center">
        <div className="container">
          <h1 className="fw-bold display-5">We’d Love to Hear From You 💬</h1>
          <p className="lead">Support, feedback, or just say hello — we’re always ready!</p>
        </div>
      </section>

      <div className="container py-5">

        {/* QUICK CONTACT CARDS */}
        <div className="row g-4 text-center mb-5">
          {[
            { icon: "📧", title: "Email Support", text: "support@foodcourt.com" },
            { icon: "📱", title: "Call Us", text: "+91 98765 43210" },
            { icon: "💬", title: "Live Chat", text: "Chat with our agent" },
            { icon: "📍", title: "Our Location", text: "Hyderabad, India" },
          ].map((item, i) => (
            <div className="col-md-3" key={i}>
              <div className="contact-card p-4 h-100">
                <div className="icon">{item.icon}</div>
                <h5>{item.title}</h5>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">

          {/* CONTACT FORM */}
          <div className="col-lg-6">
            <div className="contact-form p-4">
              <h4 className="mb-3">Send a Message ✉️</h4>
              <form>
                <input type="text" className="form-control mb-3" placeholder="Your Name" />
                <input type="email" className="form-control mb-3" placeholder="Your Email" />
                <input type="tel" className="form-control mb-3" placeholder="Phone Number" />
                <select className="form-control mb-3">
                  <option>General Inquiry</option>
                  <option>Order Issue</option>
                  <option>Delivery Partner Support</option>
                  <option>Payment Problem</option>
                  <option>Restaurant Partner</option>
                  <option>Feedback & Suggestions</option>
                </select>
                <textarea className="form-control mb-3" rows="4" placeholder="Your Message"></textarea>
                <button type="submit" className="btn btn-contact w-100">
                  Send Message 🚀
                </button>
              </form>
            </div>
          </div>

          {/* MAP + BUSINESS HOURS */}
          <div className="col-lg-6">
            <div className="map-box mb-4">
              <iframe
                title="location"
                src="https://maps.google.com/maps?q=Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="250"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>

            <div className="business-hours p-4">
              <h5>🕒 Support Hours</h5>
              <p>Mon – Fri: 8:00 AM – 10:00 PM</p>
              <p>Sat – Sun: 9:00 AM – 11:00 PM</p>
              <p>24/7 Chatbot Assistance Available 🤖</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section mt-5">
          <h3 className="text-center mb-4 text-white">Frequently Asked Questions ❓</h3>
          <div className="accordion" id="faqAccordion">
            {[
              { q: "How long does delivery take?", a: "Usually 25–40 minutes depending on distance." },
              { q: "How can I track my order?", a: "Live tracking is available in the Orders section." },
              { q: "Can I cancel my order?", a: "Yes, before the restaurant starts preparing your food." },
              { q: "What payment methods are accepted?", a: "UPI, Cards, Wallets, NetBanking & COD." },
              { q: "How do refunds work?", a: "Refunds are processed within 5–7 working days." },
            ].map((item, i) => (
              <div className="accordion-item" key={i}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq${i}`}
                  >
                    {item.q}
                  </button>
                </h2>
                <div
                  id={`faq${i}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOCIAL */}
        <div className="text-center mt-5 text-white">
          <h5>Follow Us</h5>
          <div className="social-icons">
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
            <span>▶️</span>
            <span>💼</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;

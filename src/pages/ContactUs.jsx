import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ContactUs.css";

function ContactUs() {
  return (
    <div className="contact-page">

      {/* HERO HEADER */}
      <section className="contact-hero text-center text-white">
        <div className="container">
          <h1>📞 Get in Touch</h1>
          <p>We’re here to help — Reach out anytime!</p>
        </div>
      </section>

      <div className="container my-5">

        {/* CONTACT INFO CARDS */}
        <div className="row g-4 text-center mb-5">
          <div className="col-md-4">
            <div className="contact-card">
              <h5>📧 Email Support</h5>
              <p>support@foodcourt.com</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="contact-card">
              <h5>📱 Call Us</h5>
              <p>+91 98765 43210</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="contact-card">
              <h5>📍 Visit Us</h5>
              <p>Hyderabad, India</p>
            </div>
          </div>
        </div>

        {/* FORM + MAP */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="contact-form shadow-sm">
              <h4 className="mb-3">Send Us a Message</h4>
              <form>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Your Name" />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Your Email" />
                </div>
                <div className="mb-3">
                  <select className="form-control">
                    <option>General Inquiry</option>
                    <option>Order Issue</option>
                    <option>Payment Problem</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows="4" placeholder="Your Message"></textarea>
                </div>
                <button type="submit" className="btn btn-contact w-100">
                  Send Message 🚀
                </button>
              </form>
            </div>
          </div>

          {/* MAP */}
          <div className="col-md-6">
            <div className="map-box shadow-sm">
              <iframe
                title="location"
                src="https://maps.google.com/maps?q=Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="faq-section mt-5">
          <h3 className="text-center mb-4">❓ Frequently Asked Questions</h3>
          <div className="accordion" id="faqAccordion">
            {[
              {
                q: "How long does delivery take?",
                a: "Our average delivery time is 30 minutes depending on distance and traffic."
              },
              {
                q: "How can I track my order?",
                a: "You can track your order live from the Orders section in the app."
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept UPI, Debit/Credit cards, Wallets, and Cash on Delivery."
              }
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

        {/* SOCIAL LINKS */}
        <div className="text-center mt-5">
          <h5>Follow Us</h5>
          <div className="social-icons">
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
            <span>▶️</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;

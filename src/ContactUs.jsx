// ContactUs.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

function ContactUs() {
  return (
    <div className="container my-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Contact Us</h1>
        <p className="lead text-muted">
          We're here to help! Reach out to us anytime and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="row g-4">
        {/* Contact Info */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Get in Touch</h5>
              
              <p className="mb-2"><FaMapMarkerAlt className="me-2 text-danger"/> <strong>Address:</strong> Ameerpet, Hyderabad, Telangana, India</p>
              <p className="mb-2"><FaPhoneAlt className="me-2 text-success"/> <strong>Phone:</strong> +91 98765 43210</p>
              <p className="mb-2"><FaEnvelope className="me-2 text-primary"/> <strong>Email:</strong> support@sathyatech.com</p>
              <p className="mb-2"><FaClock className="me-2 text-warning"/> <strong>Working Hours:</strong> Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed</p>

              <div className="mt-4">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.614501582042!2d78.4731808749026!3d17.4365308058859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb915c1a276dcf%3A0x8b34e264a0f14c27!2sAmeerpet%2C%20Hyderabad%2C%20Telangana%2C%20India!5e0!3m2!1sen!2sin!4v1709767891234!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Send Us a Message</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" placeholder="Your Name" />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="Your Email" />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="5" placeholder="Your Message"></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-5">
        <h3 className="fw-bold mb-4 text-center">Frequently Asked Questions</h3>
        <div className="accordion" id="faqAccordion">

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faqOne" aria-expanded="true" aria-controls="faqOne">
                How can I track my order?
              </button>
            </h2>
            <div id="faqOne" className="accordion-collapse collapse show" aria-labelledby="faqHeadingOne" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                You can track your order using the tracking link sent to your email after your order is confirmed.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqTwo" aria-expanded="false" aria-controls="faqTwo">
                What payment methods do you accept?
              </button>
            </h2>
            <div id="faqTwo" className="accordion-collapse collapse" aria-labelledby="faqHeadingTwo" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                We accept all major credit/debit cards, UPI, and net banking. Cash on delivery is also available for select locations.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqThree" aria-expanded="false" aria-controls="faqThree">
                How long does delivery take?
              </button>
            </h2>
            <div id="faqThree" className="accordion-collapse collapse" aria-labelledby="faqHeadingThree" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                Delivery usually takes between 30 minutes to 1 hour depending on your location and order size.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingFour">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqFour" aria-expanded="false" aria-controls="faqFour">
                Can I cancel or modify my order?
              </button>
            </h2>
            <div id="faqFour" className="accordion-collapse collapse" aria-labelledby="faqHeadingFour" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                Yes, you can cancel or modify your order within 10 minutes of placing it. After that, changes may not be possible.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-5 text-muted">
        <p>We respond to all inquiries within 24 hours. Thank you for reaching out!</p>
      </div>
    </div>
  );
}

export default ContactUs;

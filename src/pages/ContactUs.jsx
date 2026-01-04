import React from "react";

function ContactUs() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Contact Us</h2>
      <p>If you have any questions, feedback, or support requests, please reach out to us!</p>

      <div className="card p-4 shadow-sm">
        <h5>Customer Support</h5>
        <p>Email: support@foodcourt.com</p>
        <p>Phone: +91 98765 43210</p>

        <h5>Address</h5>
        <p>123 Food Street, Culinary City, India</p>

        <h5>Feedback Form</h5>
        <form>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" placeholder="Your Name" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Your Email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea className="form-control" rows="4" placeholder="Your message"></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;

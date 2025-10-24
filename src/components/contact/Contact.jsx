import "./contact.css";
import Phone from "../../img/phone.png";
import Email from "../../img/email.png";
// import insta from "../../img/insta.webp";
import tele from "../../img/tt.png";
import link from "../../img/linkedin.png";
import github from "../../img/github.png";
import Address from "../../img/address.png";
// import { useContext} from "react";
import {  useRef, useState } from "react";

// import { ThemeContext } from "../../context";

const Result = () => {
  return (
    <p style={{ color: "green", fontWeight: "500" }}>
      Your message has been successfully sent. I will contact you soon.
    </p>
  );
};

const Contact = () => {
  const form = useRef();
  // const theme = useContext(ThemeContext);
  // const darkMode = theme.state.darkMode;
  const [result, showResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== Send data to API =====
  const sendDataToAPI = async (data) => {
    try {
      setLoading(true);

      const response = await fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Raw response:", response);
      const resData = await response.json();
      console.log("Response JSON:", resData);

      if (response.ok && resData.success) {
        showResult(true);
      } else {
        alert("Error: " + (resData.error || "Failed to send data"));
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      alert("Unable to reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Handle form submit =====
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const name = formData.get("name").trim();
    const subject = formData.get("subject").trim();
    const email = formData.get("email").trim();
    const phone = formData.get("phone").trim();
    const message = formData.get("message").trim();
    const feedback = formData.get("rating").trim();

    // ===== Email Validation =====
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // ===== Phone Number Validation (India) =====
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    const data = {
      fullName: name,
      subject,
      email,
      phone,
      message,
      feedback,
    };

    sendDataToAPI(data);
    e.target.reset();
  };

  return (
    <div className="c">
      <div className="c-bg"></div>
      <div className="c-wrapper">
        {/* ===== Left Info ===== */}
        <div className="c-left">
          <h1 className="c-title">Let’s Start a Conversation</h1>
          <div className="c-info">
            <div className="c-info-item">
              <img src={Phone} alt="" className="c-icon" />
              <a rel="noreferrer" href="tel:9650513361" target="_blank">
                +91-9650513361
              </a>
            </div>
            <div className="c-info-item">
              <img className="c-icon" src={Email} alt="" />
              <a
                rel="noreferrer"
                href="mailto:raonipun53@gmail.com"
                target="_blank"
              >
                raonipun53@gmail.com
              </a>
            </div>
            <div className="c-info-item">
              <img src={link} alt="" className="c-icon" />
              <a
                rel="noreferrer"
                href="https://www.linkedin.com/in/nipun-yadav-5bb736178/"
                target="_blank"
              >
                Nipun Yadav
              </a>
            </div>
            <div className="c-info-item">
              <img
                src={github}
                alt=""
                className="c-icon"
                style={{ backgroundColor: "white", borderRadius: 20 }}
              />
              <a rel="noreferrer" href="https://github.com/Nyadav123" target="_blank">
                Nyadav123
              </a>
            </div>
            <div className="c-info-item">
              <img src={tele} alt="" className="c-icon" />
              <a
                rel="noreferrer"
                href="https://mobile.twitter.com/NipunYadav123"
                target="_blank"
              >
                Nipunyadav123
              </a>
            </div>
            <div className="c-info-item">
              <img className="c-icon" src={Address} alt="" />
              <a
                rel="noreferrer"
                target="_blank"
                href="https://www.google.co.in/maps/place/Metro+Station+Samaypur+Badli/"
              >
                Delhi, India
              </a>
            </div>
          </div>
        </div>

        {/* ===== Right Form ===== */}
        <div className="c-right">
          <h1 className="c-title1">
            Open to collaborations and new ideas — always happy to connect</h1>
          <form ref={form} onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" name="name" required />
            <input type="text" placeholder="Subject" name="subject" required />
            <input type="email" placeholder="Email" name="email" required />
            <input type="text" placeholder="Phone No." name="phone" required />
            <textarea rows="5" placeholder="Message" name="message" />
            <textarea
              rows="5"
              placeholder="Any feedback (optional)"
              name="rating"
              className="feedback"
            />
            <button style={{ marginTop: 10 }} type="submit" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>

            <div style={{ marginTop: 10 }} className="row">
              {result && <Result />}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

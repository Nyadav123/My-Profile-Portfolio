import { Link } from "react-router-dom";
import "./intro.css";
import Me from "./../../img/121.png";

const Intro = () => {
  return (
    <div className="intro">
      {/* Navigation Bar */}
      <div id="mySidenav" className="sidenav">
        <Link to="/" id="about">Home<br/>&nbsp;&nbsp;&nbsp;&nbsp;&#9839;</Link>
        <Link to="/hobbies" id="projects">Project<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9745;</Link>
        <Link to="/about" id="blog">About<br/>&nbsp;&nbsp;&nbsp;&nbsp;&#9739;</Link>
        <Link to="/contact-us" id="contact">Contact<br/>&nbsp;&nbsp;&nbsp;&nbsp;&#9743;</Link>
      </div>

      {/* Left Section */}
      <div className="intro-left">
        <div className="intro-wrapper">
          <h2 className="intro-greet">Hello, I'm</h2>
          <h1 className="intro-name">Nipun Yadav</h1>
          <h3 className="intro-role">Cloud & DevOps Engineer</h3>

          <div className="i-title">
            <div className="i-title-wrapper">
              <div className="i-title-item">AWS</div>
              <div className="i-title-item">Python</div>
              <div className="i-title-item">Serverless</div>
              <div className="i-title-item">Automation</div>
              <div className="i-title-item">CI/CD</div>
              <div className="i-title-item">AI Solutions</div>
              <div className="i-title-item">Azure</div>
            </div>
          </div>

          <p className="intro-desc">
            
            Result-driven Cloud & DevOps Engineer specializing in AWS, Python automation, and CI/CD pipelines.
            Skilled in serverless architectures, cost optimization, and AI-integrated automation solutions.
            Passionate about scalable cloud innovations and efficient DevOps practices.

            
          </p>

          {/* ✅ Download CV Button */}
          <a href="/nipun_resume_2.docx" download className="btn-cv">
            📥 Download CV
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="intro-right">
        <div className="intro-bg"></div>
        <img src={Me} alt="Nipun Yadav" className="intro-img" />
      </div>
    </div>
  );
};

export default Intro;

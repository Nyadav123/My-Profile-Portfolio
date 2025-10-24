import "./about.css";

const About = () => {
  return (
    <div className="about">

      {/* Main Page Title */}
      <h1 className="about-main-title">About</h1>

      {/* Columns wrapper */}
      <div className="about-columns">

        {/* LEFT COLUMN - Professional Summary, Certifications & Achievements */}
        <div className="about-column left-column">

          {/* Professional Summary */}
          {/* <div className="about-section">
            <h2 className="about-subtitle">Professional Summary</h2>
            <p className="about-desc">
              I’m <b>Nipun Yadav</b>, a Cloud & DevOps Engineer with expertise in designing and automating cloud infrastructures.
              I specialize in <b>AWS, Python automation, Serverless architectures, and CI/CD pipelines</b> to build scalable,
              reliable, and cost-efficient solutions. I am passionate about leveraging cloud technologies and AI-integrated
              automation to enhance operational efficiency and business agility.
            </p>
          </div> */}

          {/* Certifications */}
          <div className="about-section">
            <h2 className="about-subtitle">Certifications</h2>
            <ul className="about-list">              
              <li>🎓 <a href="https://www.credly.com/badges/14e02403-cd50-408e-9082-17a96d3ebabd/public_url" target="_blank" rel="noreferrer" className="cert-link">Google Cloud Cybersecurity Certificate - Google Cloud</a></li>
              <li>🎓 <a href="https://coursera.org/share/2c1be7cd2d08fe57d27aaaffab9ad3b5" target="_blank" rel="noreferrer" className="cert-link">DevOps on AWS and Project Management - Coursera</a></li>
              <li>🎓 <a href="https://coursera.org/share/24d26ec5f520140af99ca6109de22759" target="_blank" rel="noreferrer" className="cert-link">DevOps on AWS - Coursera</a></li>
              <li>🎓 <a href="https://drive.google.com/file/d/1zmOHXY1RxT-Uyu1q1VX9Qz1UUWlxBxH9/view?usp=sharing" target="_blank" rel="noreferrer" className="cert-link">Architecting Serverless Applications - AWS</a></li>
              <li>🎓 <a href="https://drive.google.com/file/d/1mw6WE4ddzCa8Kqa4l54RnMV5eEf6dFgK/view?usp=sharing" target="_blank" rel="noreferrer" className="cert-link">Cloud Practitioner Essentials - AWS</a></li>
              <li>🎓 <a href="https://drive.google.com/file/d/1tsGnbqH9czjp-UbMMi-l5dICArYvO_1x/view?usp=sharing" target="_blank" rel="noreferrer" className="cert-link">Introduction to Amazon SageMaker - AWS</a></li>
              <li>🎓 <a href="https://drive.google.com/file/d/1NeKm6n6FfHsiWzegxG9Ol4PHm-xza2tT/view?usp=sharing" target="_blank" rel="noreferrer" className="cert-link">Scaling Serverless Architectures - AWS</a></li>
              <li>🎓 <a href="https://drive.google.com/file/d/1NZyXt8DgpAie6edmJbBTHsKqmsLpmGGa/view?usp=sharing" target="_blank" rel="noreferrer" className="cert-link">Developing Generative Artificial Intelligence Solutions - AWS</a></li>
              <li>🎓 <a href="https://drive.google.com/file/d/15WAvU2Lm_6KArKmm5zFjhLqnyVBrDfKQ/view?usp=sharing" target="_blank" rel="noreferrer" className="cert-link">Essentials of Prompt Engineering - AWS</a></li>
              <li>🎓 <a href="https://drive.google.com/file/d/17jT_85qv_lxqWKKKtabBSFUoeUV6XVI5/view?usp=sharing" target="_blank" rel="noreferrer" className="cert-link">AWS Technical Essentials - AWS</a></li>
            </ul>
          </div>

          {/* Achievements & Roles */}
          <div className="about-section">
            <h2 className="about-subtitle">Achievements & Roles</h2>
            <ul className="about-list">
              <li>🏆 1× “Silver Star” Award at Aye Finance Ltd</li>
              <li>🏆 4× “Aye Ka Tara” Award at Aye Finance Ltd</li>
              <li>🏆 4× Service Excellence recognition</li>
              <li>🌐 Campus Ambassador – Verzeo Platform</li>
              <li>🤝 Mentor – “Desh ke Mentor” Program by Delhi Govt</li>
            </ul>
          </div>

        </div>

{/* RIGHT COLUMN - Experience Only */}
<div className="about-column right-column">
  <div className="about-section">
    <h2 className="about-subtitle">Experience</h2>
    <ul className="about-list">
      <li>
        <b>Wise FinServ – Wealth Management Analyst Internship</b> (Sep. 2021 – Nov. 2021)
        <ul>
          <li>Gained hands-on experience in financial planning, portfolio analysis, and investment strategy.</li>
          <li>Collaborated with senior analysts to evaluate client data and create actionable insights.</li>
        </ul>
      </li>

      <li>
        <b>AD-Enterprises – Web Development Internship</b> (Dec. 2022 – Feb. 2023)
        <ul>
          <li>Developed responsive web applications using HTML, CSS, JavaScript, and Python.</li>
          <li>Contributed to focusing on interactive UI components and backend integration.</li>
        </ul>
      </li>

      <li>
        <b>Aye Finance Ltd – Graduate Trainee</b> (Jun. 2023 - Dec. 2023)
        <ul>
          <li>Assisted in deploying and monitoring AWS cloud environments and DevOps pipelines.</li>
          <li>Supported automation initiatives to improve efficiency and reduce manual workloads.</li>
        </ul>
      </li>

      <li>
        <b>Aye Finance Ltd – Assistant Manager (Cloud & IT)</b> (Dec. 2023 - Current)
        <ul>
          <li>Promoted to Assistant Manager after 6 months, responsible for architecting and automating AWS environments.</li>
          <li>Design and implement serverless solutions, optimize cloud costs, deploy CI/CD pipelines, and monitor resources.</li>
          <li>Implemented AI-assisted automation to improve team productivity and operational efficiency.</li>
          <li>Delivered projects that reduced overhead, improved reliability, and enhanced data-driven decision-making.</li>
        </ul>
      </li>
    </ul>
  </div>
</div>


      </div> {/* End of about-columns */}

    </div>
  );
};

export default About;

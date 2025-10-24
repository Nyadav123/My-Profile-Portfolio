import "./toggle.css";
import Sun from "../../img/sun.png";
import Moon from "../../img/moon.png";
import { useContext } from "react";
import { ThemeContext } from "../../context";
import { Link } from "react-router-dom";

const Toggle = () => {
  const theme = useContext(ThemeContext);

  const handleClick = () => {
    theme.dispatch({ type: "TOGGLE" });
  };
  return (<>
      {/* <div id="mySidenav" className="sidenav">
 <Link to="/" id="about">Home&nbsp;&nbsp;&#9839;</Link>
  <Link to="/hobbies" id="projects">Projects&nbsp;&nbsp;&#9745;</Link>
   <Link to="/about" id="blog">About&nbsp;&nbsp;&#9739;</Link>
  <Link to="/contact-us" id="contact">Contact&nbsp;&nbsp;&#9743;</Link>
 </div> */}
    <div className="t">

      <img src={Sun} alt="" className="t-icon" />
      <img src={Moon} alt="" className="t-icon" />
      <div
        className="t-button"
        onClick={handleClick}
        style={{ left: theme.state.darkMode ? 0 : 25 }}
      ></div>
    </div>
    </>
  );
};

export default Toggle;

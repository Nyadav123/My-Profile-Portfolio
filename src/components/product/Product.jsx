import "./product.css";
import { useRef } from "react";

const Product = ({ img, workflowImg, title, link, small, hoverable }) => {
  const overlayRef = useRef(null);
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverable) {
      if (overlayRef.current) overlayRef.current.classList.add("show");
      if (imgRef.current && workflowImg) imgRef.current.src = workflowImg;
    }
  };

  const handleMouseLeave = () => {
    if (hoverable) {
      if (overlayRef.current) overlayRef.current.classList.remove("show");
      if (imgRef.current) imgRef.current.src = img;
    }
  };

  return (
    <div
      className={`p ${small ? "small" : "large"} ${hoverable ? "hoverable" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href={link} target="_blank" rel="noreferrer">
        <img src={img} alt="project" className="p-img" ref={imgRef} />

        {hoverable && (
          <div className="p-overlay" ref={overlayRef}>
            <h3 className="p-title">{title}</h3>
          </div>
        )}
      </a>
    </div>
  );
};

export default Product;

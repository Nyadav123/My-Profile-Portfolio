import "./productList.css";
import Product from "../product/Product";
import { products } from "../../data";
import { useState, useEffect, useRef } from "react";

const ProductList = () => {
  const [index, setIndex] = useState(0);
  const isHoveredRef = useRef(false);
  const intervalRef = useRef(null);
  const AUTO_CHANGE_TIME = 2000;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isHoveredRef.current) {
        setIndex((prev) => (prev + 1) % products.length);
      }
    }, AUTO_CHANGE_TIME);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const handleResize = () => setIndex((prev) => prev);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVisibleProducts = () => {
    const width = window.innerWidth;
    if (width < 768) {
      return [products[index]];
    }
    const prevIndex = (index - 1 + products.length) % products.length;
    const nextIndex = (index + 1) % products.length;
    return [products[prevIndex], products[index], products[nextIndex]];
  };

  const visible = getVisibleProducts();

  return (
    <div className="pl">
      <div className="pl-texts">
        <h1 className="pl-title">
          <span>Projects</span>
        </h1>
        <p className="pl-desc">
          Explore cloud, DevOps & automation projects built with AWS, Python, Jenkins, Docker, Github, Node.js, and more.
          Hover on the project to see the workflow!
        </p>
      </div>

      <div
        className="showcase"
        onMouseEnter={() => (isHoveredRef.current = true)}
        onMouseLeave={() => (isHoveredRef.current = false)}
      >
        <div className="carousel-row" key={index}>
          {visible.map((p, i) => (
            <div
              key={i}
              className={`slide ${i === 1 ? "center" : "side"} ${i === 0 ? "left" : i === 2 ? "right" : ""}`}
            >
              <Product
                img={p.img}
                workflowImg={p.workflowImg} 
                link={p.link}
                small={i !== 1}
                hoverable={i === 1} 
                title={p.title} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

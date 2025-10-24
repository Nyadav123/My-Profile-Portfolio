import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context";
import About from "./components/about/About";
import ProductList from "./components/productList/ProductList";
import Contact from "./components/contact/Contact";
import Intro from "./components/intro/Intro";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ThemeProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/about" exact component={About} />
        <Route path="/intro" exact component={Intro} />
        <Route path="/contact-us" exact component={Contact} />
        <Route path="/hobbies" exact component={ProductList} />
      </Switch>
    </BrowserRouter>
  </ThemeProvider>
);

// App.js
import React, { useState } from "react";
import Herbs from "./pages/Herbs";
import Products from "./pages/Products";
import Calculation from "./pages/Calculation";
import About from "./pages/About";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Blogs from "./pages/Blogs";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      <Navbar setPage={setPage} currentPage={page} />

      {page === "home" && <Home />}
      {page === "herbs" && <Herbs />}
      {page === "products" && <Products />}
      {page === "calc" && <Calculation />}
      {page === "about" && <About />}
      {page === "blogs" && <Blogs />}
    </div>
  );
}

export default App;

// App.js
import React, { useState } from "react";
import Herbs from "./pages/Herbs";
import Products from "./pages/Products";
import Calculation from "./pages/Calculation";
import About from "./pages/About";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";

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
    </div>
  );
}

export default App;

// App.js
import React, { useState } from "react";
import Herbs from "./pages/Herbs";
import Products from "./pages/Products";
import Calculation from "./pages/Calculation";
import About from "./pages/About";
import Navbar from "./pages/Navbar";

function App() {
  const [page, setPage] = useState("herbs");

  return (
    <div>
      <Navbar setPage={setPage} currentPage={page} />

      {page === "herbs" && <Herbs />}
      {page === "products" && <Products />}
      {page === "calc" && <Calculation />}
      {page === "about" && <About />}
    </div>
  );
}

export default App;

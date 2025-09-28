// App.js
import React, { useState } from "react";
import Herbs from "./pages/Herbs";
import Products from "./pages/Products";
import Calculation from "./pages/Calculation";
import About from "./pages/About"; // add this import

function App() {
  const [page, setPage] = useState("herbs");

  return (
    <div>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "20px", backgroundColor: "pink" }}>
        <button onClick={() => setPage("herbs")} style={{ marginRight: "10px" }}>
          Herbs
        </button>
        <button onClick={() => setPage("products")} style={{ marginRight: "10px" }}>
          Products
        </button>
        <button onClick={() => setPage("calc")} style={{ marginRight: "10px" }}>Calculation</button>
        <button onClick={() => setPage("about")} style={{ marginRight: "10px" }}>
        About
      </button>
      </nav>
      

      {page === "herbs" && <Herbs />}
      {page === "products" && <Products />}
      {page === "calc" && <Calculation />}
      {page === "about" && <About />}

    </div>
  );
}

export default App;

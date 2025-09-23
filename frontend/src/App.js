// App.js
import React, { useState } from "react";
import Herbs from "./pages/Herbs";
import Products from "./pages/Products";
import Calculation from "./pages/Calculation";

function App() {
  const [page, setPage] = useState("herbs");

  return (
    <div>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "20px", backgroundColor:"pink" }}>
        <button onClick={() => setPage("herbs")} style={{ marginRight: "10px" }}>
          Herbs
        </button>
        <button onClick={() => setPage("products")} style={{ marginRight: "10px" }}>
          Products
        </button>
        <button onClick={() => setPage("calc")}>Calculation</button>
      </nav>

      {page === "herbs" && <Herbs />}
      {page === "products" && <Products />}
      {page === "calc" && <Calculation />}
    </div>
  );
}

export default App;

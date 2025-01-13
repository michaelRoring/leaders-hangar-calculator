import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import SeoCalculator from "./pages/SeoCalculator.jsx";
import ABMCalculator from "./pages/AbmCalculator.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/seo" element={<SeoCalculator />} />
        <Route path="/abm" element={<ABMCalculator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

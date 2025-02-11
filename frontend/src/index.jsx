import React from "react";
import { createRoot } from "react-dom/client"; // ✅ Correct import
import App from "./App"; // Ensure this path is correct

const root = document.getElementById("root"); // Ensure 'root' exists in index.html

if (root) {
  createRoot(root).render(<App />);
} else {
  console.error("Root element not found");
}

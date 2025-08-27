import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./providers/ThemeProvider"; // <- import your ThemeProvider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      {" "}
      {/* Wrap the app */}
      <App />
    </ThemeProvider>
  </StrictMode>
);

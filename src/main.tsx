import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The app root element was not found.");
}

if (window.location.pathname === "/" && rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <App />);
} else {
  createRoot(rootElement).render(<App />);
}

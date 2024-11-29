import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import MonstreProvider from "./context/monstre.context.tsx";
import { CookiesProvider } from "react-cookie";
import LangueProvider from "./context/langues.context.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider>
      <MonstreProvider>
        <LangueProvider>
            <App />
        </LangueProvider>
      </MonstreProvider>
    </CookiesProvider>
  </StrictMode>
);

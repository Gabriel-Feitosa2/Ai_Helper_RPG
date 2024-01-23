import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import ConfigContextProvider from "./context/configcontext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigContextProvider>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </ConfigContextProvider>
  </React.StrictMode>
);

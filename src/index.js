import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { SettingsProvider } from "./state/SettingsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);

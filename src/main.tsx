import React from "react";
import ReactDOM from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { MANIFAST_URL } from "consts";
import { RouterProvider } from "react-router-dom";
import "./reset.css";
import { router } from "router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={MANIFAST_URL}>
      <RouterProvider router={router} />
    </TonConnectUIProvider>
  </React.StrictMode>
);

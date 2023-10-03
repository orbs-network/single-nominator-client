import App from 'App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { MANIFAST_URL } from 'consts';
import './reset.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <GlobalStyle /> */}
    <TonConnectUIProvider manifestUrl={MANIFAST_URL}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);




import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SedesProvider } from "./context/SedesContext";
import './index.css'

const queryClient = new QueryClient();
// eslint-disable-next-line react-refresh/only-export-components -- This entry point mounts the lazy component.
const LocalAuthGate = import.meta.env.DEV && import.meta.env.LOCAL_AUTH_UI
  ? React.lazy(() => import("./dev/LocalAuthGate"))
  : null;

const app = (
  <QueryClientProvider client={queryClient}>
    <SedesProvider>
      <App />
    </SedesProvider>
  </QueryClientProvider>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {LocalAuthGate ? (
      <React.Suspense fallback={null}>
        <LocalAuthGate onSessionChange={() => queryClient.clear()}>
          {app}
        </LocalAuthGate>
      </React.Suspense>
    ) : app}
  </React.StrictMode>
);

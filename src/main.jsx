


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SedesProvider } from "./context/SedesContext";
import './index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SedesProvider>
        <App />
      </SedesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
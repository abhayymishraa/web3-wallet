import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-zinc-900 min-h-screen">
      <App />
      <Toaster />
    </div>
  </StrictMode>
);

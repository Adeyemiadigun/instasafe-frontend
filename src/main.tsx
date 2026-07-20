import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "@/providers/AuthProvider"
import QueryProvider from "@/providers/QueryProvider"
import ErrorBoundary from "./components/shared/ErrorBoundary"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <QueryProvider>
            <App />
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)

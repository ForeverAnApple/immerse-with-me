import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router";
import { ErrorBoundary } from '@/components/error/boundary';
import { RouteErrorBoundary } from '@/components/error/route-error-boundary';
import { Layout } from '@/components/layout'
import { ThemeProvider } from '@/components/theme-provider'
import { HomePage } from '@/pages/home'
import '@/index.css'
import { Toaster } from 'react-hot-toast'

// Handle module load failures (e.g., after deployment with stale chunks)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    element: <Layout><Outlet /></Layout>,
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <RouteErrorBoundary />,
      }
    ]
  }
]);

// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Uncommend this to enable auth */}
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
        <Toaster position="top-right" />
    </ThemeProvider>
  </StrictMode>,
)
   

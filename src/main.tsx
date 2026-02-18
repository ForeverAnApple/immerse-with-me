import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { ErrorBoundary } from '@/components/error/boundary';
import { RouteErrorBoundary } from '@/components/error/route-error-boundary';
import { HomePage } from '@/pages/home'
import '@/index.css'
import { Toaster } from 'react-hot-toast'
import { initTheme } from '@/hooks/use-theme'

// Handle module load failures (e.g., after deployment with stale chunks)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  }
]);

// Apply theme before first render to avoid flash
initTheme()

// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Uncommend this to enable auth */}
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <Toaster position="top-right" />
  </StrictMode>,
)
   

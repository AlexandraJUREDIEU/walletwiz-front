import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './routes/index.tsx'
import GlobalLoader from './components/system/GlobalLoader.tsx';
import './index.css'
import { Toaster } from "sonner";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <GlobalLoader />
    <AppRouter />
  </StrictMode>,
)
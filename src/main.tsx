import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './routes/index.tsx'
import GlobalLoader from './components/system/GlobalLoader.tsx';
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import './index.css'
import { Toaster } from "sonner";
import '@/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <GlobalLoader />
    <ThemeProvider defaultTheme='light'>
      <AppRouter />
    </ThemeProvider>
  </StrictMode>,
)
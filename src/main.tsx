import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

async function bootstrap() {
  if (useMocks) {
    const { worker } = await import('./api/mocks/browser')
    await worker.start({ onUnhandledRequest: 'warn' })
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()

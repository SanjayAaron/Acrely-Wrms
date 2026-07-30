import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ExperienceProvider } from './context/ExperienceContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ExperienceProvider>
        <App />
      </ExperienceProvider>
    </ThemeProvider>
  </StrictMode>,
);

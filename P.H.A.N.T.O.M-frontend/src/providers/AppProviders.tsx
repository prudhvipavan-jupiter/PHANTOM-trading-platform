import type { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { VoiceProvider } from '../contexts/VoiceContext';
import { PortfolioProvider } from '../contexts/PortfolioContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NotificationProvider } from '../contexts/NotificationContext';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <VoiceProvider>
            <PortfolioProvider>
              {children}
            </PortfolioProvider>
          </VoiceProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  </ThemeProvider>
);

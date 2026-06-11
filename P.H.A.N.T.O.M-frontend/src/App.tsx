import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import { AppProviders } from './providers/AppProviders';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <Suspense fallback={<Loading />}>
            <AppRoutes />
          </Suspense>
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

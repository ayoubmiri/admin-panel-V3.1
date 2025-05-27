// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';  // <-- import AuthProvider
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>            {/* Wrap Router here */}
        <AuthProvider>    {/* Now inside Router */}
          <App />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);

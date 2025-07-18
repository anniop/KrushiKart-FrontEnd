/*
 * We are now wrapping our App in TWO providers: one for the regular user
 * and a new one for the seller. This keeps their login states separate.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { UserProvider } from './context/UserContext.jsx';
import { SellerProvider } from './context/SellerContext.jsx'; // --- NEW ---

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <SellerProvider> {/* --- NEW --- */}
        <App />
      </SellerProvider>
    </UserProvider>
  </React.StrictMode>,
);

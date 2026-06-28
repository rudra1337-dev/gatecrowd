import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { CrowdProvider } from './context/CrowdContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CrowdProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CrowdProvider>
    </ThemeProvider>
  </React.StrictMode>
);

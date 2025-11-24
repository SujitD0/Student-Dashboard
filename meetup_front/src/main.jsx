import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global error listeners to surface runtime errors visibly on the page
window.addEventListener('error', (event) => {
  console.error('Global error', event.error || event.message);
  try {
    const pre = document.createElement('pre');
    pre.style.color = 'red';
    pre.style.background = 'rgba(0,0,0,0.05)';
    pre.style.padding = '8px';
    pre.style.whiteSpace = 'pre-wrap';
    pre.textContent = 'Error: ' + (event.error?.message || event.message || JSON.stringify(event));
    document.body.prepend(pre);
  } catch {
    // ignore
  }
});

window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled rejection', ev.reason);
  try {
    const pre = document.createElement('pre');
    pre.style.color = 'red';
    pre.style.background = 'rgba(0,0,0,0.05)';
    pre.style.padding = '8px';
    pre.style.whiteSpace = 'pre-wrap';
    pre.textContent = 'Unhandled Rejection: ' + (ev.reason?.message || String(ev.reason));
    document.body.prepend(pre);
  } catch {
    // intentionally left blank
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

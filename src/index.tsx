import React from 'react';
import ReactDOM from 'react-dom/client';
import ContadorDias from './contador-dias-corregido';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ContadorDias />
  </React.StrictMode>
);
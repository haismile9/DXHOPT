import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import '@mui/material/styles'; // nếu dùng custom theme (hoặc có thể bỏ nếu không dùng theme)
import './index.css'; // nếu có CSS global
import App from './App';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);

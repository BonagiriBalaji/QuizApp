import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';
import { CookiesProvider } from "react-cookie";
import { useCookies } from "react-cookie";


function Auth() {
  const [cookies,] = useCookies();

  axios.interceptors.request.use(
    config => {
      console.log((localStorage.getItem('access_token') != null) && (localStorage.getItem('access_token') != undefined) && (cookies.access_token != null) && (cookies.access_token != undefined))
      if ((localStorage.getItem('access_token') != null) && (localStorage.getItem('access_token') != undefined)) {
        config.headers['Authorization'] = ("Bearer " + localStorage.getItem('access_token'));
      } else if ((cookies.access_token != null) && (cookies.access_token != undefined)) {
        console.log(cookies.access_token)
        config.headers['Authorization'] = ("Bearer " + cookies.access_token);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  return (
    <></>
  )

}
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <Auth />
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

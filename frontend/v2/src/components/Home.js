import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../App";
import { useCookies } from "react-cookie";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Navbar from "./NavBar";

const MySwal = withReactContent(Swal)


export default function Home1({ error }) {
  const navigate = useNavigate();
  const [ping, setPing] = useState(true);
  const [db, setDb] = useState(true);
  localStorage.clear();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user_data, setUserData] = useState(parseJwt(cookies.access_token));
  const [first, setFirst] = useState(true);

  // axios.interceptors.request.use(
  //   (config) => {
  //     if (localStorage.getItem("scr_id") != null) {
  //       config.headers["X-Score-ID"] = localStorage.getItem("scr_id");
  //     }
  //     //    else if (cookies.access_token != null) {
  //     //     // console.log(cookies.access_token)
  //     //     config.headers['X-Score-ID'] = (cookies.scr_id);
  //     //   }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  async function pingServer() {
    const status = await axios({
      method: "get",
      url: "http://127.0.0.1:9003/ping/",
      timeout: 2000, // only wait for 2s
    }).catch((err) => {
      console.log(err)
      if (first) {
        MySwal.fire({
          title: 'Server Down',
          text: 'Looks like the server is unreachable',
          width: 2000,
          icon: 'warning',
          // padding: '3em',
          color: '#716add',
          background: '#fff url(/images/trees.png)',
          backdrop: `
            rgba(0,0,123,0.4)
            url("/images/nyan-cat.gif")
            blur(8px);
            left top
            no-repeat
          `
        }).then (() => {
          setFirst(false)
        })
      }
      setPing(false);
    });
    if (status.data != "pong") {
      setPing(false);
    } else {
      setPing(true);
    }
    console.log(ping);
  }

  useEffect(() => {
    pingServer();
  }, []);

  const handleClick = (e) => {
    pingServer();
    console.log(ping);
    if (ping && db) {
      navigate(e.target.value); //, { replace : true })
    }
  };

  if (error == "true") {
    setDb(false);
  }

  return (
    <>
      <Navbar user_data={user_data}/>
      <div className="container my-5">
        <h2>Select Any Subject from below</h2>
        <div className="list-group my-5">
          <button
            onClick={handleClick}
            type="button"
            className="list-group-item btn btn-primary"
            value="Python"
          >
            Python
          </button>
          <button
            onClick={handleClick}
            type="button"
            className="list-group-item btn btn-primary"
            value="Java"
          >
            Java
          </button>
          <button
            onClick={handleClick}
            type="button"
            className="list-group-item btn btn-primary"
            value="JavaScript"
          >
            JavaScript
          </button>
        </div>
        {!ping || !db ? (
          <div className="alert alert-danger" role="alert">
            Server Error! Try again after sometime
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

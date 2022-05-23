import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Navbar from "./NavBar";

const MySwal = withReactContent(Swal)

function Login() {
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [cookies, setCookie] = useCookies();

  const navigate = useNavigate();

  async function handleLogin(event) {
    // alert('A name was submitted: ' + event.target.value);
    event.preventDefault();
    // console.log(username, password, email)
    const details = {
      password: password,
      email: email,
    };
    const token = await axios({
      method: "post",
      url: "http://127.0.0.1:9003/api/token/",
      timeout: 2000, // only wait for 2s
      data: details
    }).then((resp) => {
      localStorage.setItem("access_token", resp.data.access);
      setCookie("access_token", resp.data.access, {
        path: "/",
        sameSite: "Strict",
        // secure: true,
      });
      const Toast = MySwal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
      })
      Toast.fire({
        icon: 'success',
        title: 'Logged in successfully, Redirecting'
      }).then(() => {
        navigate("/Dashboard");
      })

    }).catch((error) => {
      if (error.response) {
        // Request made and server responded
        MySwal.fire({
          title: 'Login Error',
          html: error.response.data['detail']+'<br>'+"or Wrong Email/Password combination",
          text2: "SEfsefsef",
          width: 600,
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
        })
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // (The request was made but no response was received)
        MySwal.fire({
          title: 'Server Down',
          text: 'Unable to Login, please try again later.',
          width: 600,
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
        })
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
    // console.log(token["access"])
    // console.log(token.data.access)
  }

  return (
    <>
    <Navbar login={true}/>
      <div className="wrapper fadeInDown">
        <div id="formContent">
          <div className=" first">
            <p className="my-5">User Login</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              id="email"
              className=" third mt-2 mb-3"
              name="login"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
            />
            <input
              type="password"
              id="password"
              className=" third mt-2 mb-3"
              name="login"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
            />
            <input type="submit" className=" fourth" value="Log In" />
          </form>
          <div id="formFooter">
            <a className="underlineHover" href="/Register">
              Register
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function Register() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  async function handleRegister(event) {
    // alert('A name was submitted: ' + event.target.value);
    event.preventDefault();
    console.log(username, password, email);
    const details = {
      username: username,
      password: password,
      email: email,
    };
    localStorage.removeItem('access_token')
    removeCookie('access_token')
    const token = await axios({
      method: "post",
      url: "http://127.0.0.1:9003/api/register/",
      timeout: 2000, // only wait for 2s
      data: details
    }).then(() => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
      Toast.fire({
        icon: 'success',
        title: 'User Created Successfully. Please Login'
      }).then(() => {
        navigate("/Login");
      })

    }).catch((error) => {
      if (error.response) {
        let err_msg;
        if (error.response.data['email'] != undefined) {
          err_msg = error.response.data['email'][0]
        } else if (error.response.data['username'] != undefined) {
          err_msg = error.response.data['username'][0]
        } else {
          err_msg = error.response.data['detail']
        }
        // console.log(err_msg, error.response['email'][0])
        // Request made and server responded
        MySwal.fire({
          title: 'Login Error',
          text: err_msg,
          width: 600,
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
        })
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // (The request was made but no response was received)
        MySwal.fire({
          title: 'Server Down',
          text: 'Unable to Login, please try again later.',
          width: 600,
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
        })
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
    // console.log(token["access"])
    // console.log(token.data.access)
  }

  return (
    <>
    <Navbar login={true}/>
      <div className="wrapper fadeInDown">
        <div id="formContent">
          <div className=" first">
            <p className="my-5">User Register</p>
          </div>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              id="username"
              className=" third mt-2 mb-3"
              name="login"
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter Your Username"
            />
            <input
              type="text"
              id="email"
              className=" third mt-2 mb-3"
              name="login"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
            />
            <input
              type="password"
              id="password"
              className=" third mt-2 mb-3"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
            />
            <input type="submit" className=" fourth" value="Register" />
          </form>
          <div id="formFooter">
            <a className="underlineHover" href="/Login">
              Log In
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function Logout() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    removeCookie('access_token');
    localStorage.removeItem('access_token');
    MySwal.fire({
      title: 'Signed Out',
      width: 600,
      icon: 'warning',
      // padding: '3em',
      color: '#716add',
      background: '#fff url(/images/trees.png)',
      timer: 1500,
      backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          blur(8px);
          left top
          no-repeat
        `
    }).then(() => {
      navigate("/", { replace: true })
    })
  }, [])

  return (<>
  </>
  )
}

export default Register;
export {
  Login,
  Logout
};

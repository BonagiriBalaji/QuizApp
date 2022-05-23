import Home from './components/Home_function';
import Home1 from './components/Home';
import Level from './components/Levels';
import NotFound from './components/404Notfound';
import './App.css';
import {
  Route,
  Routes
} from "react-router-dom";
import Register, { Login, Logout } from './components/Login';
import Dashboard from './components/Dashboard';

function parseJwt(token) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<NotFound/>} />
        <Route path="/" element={<Home1 />} />
        <Route path="/Python" element={<Home Subject="Python" level={1}/>} />
        <Route path="/Java" element={<Home Subject="Java" level={1}/>} />
        <Route path="/JavaScript" element={<Home Subject="JavaScript" level={1}/>} />
        <Route path="/Result" element={<Level />} exact />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
export {
  parseJwt
};

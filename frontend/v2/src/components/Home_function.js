import "../App.css";
import Home1 from './Home.js'
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
// import { useCookies } from "react-cookie";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function Pallet({ count, n, palletChange, eve, dict }) {

  var num = 1;

  let lst = []
  for (let i = 0; i < (Math.floor(n / 4) + 1); i++) {
    lst.push(<div className="row"></div>)
    for (let j = 0; j < 4; j++) {
      let v = num
      if (num > n) {
        break
      }

      lst.push(<button ref={(el) => eve[v] = el} className={`btn ${(dict[v - 1] == undefined) ? "btn-primary" : "btn-success"} mx-2 my-2 ${(count + 1 == v) ? "active" : ""}`} value={parseInt(num)} onClick={palletChange}> {String(num).padStart(2, '0')}</button>)
      num = num + 1;
    }
  }

  return (
    <>
      {lst}
    </>
  )
}

export default function Home(props) {

  // // console.log("Home")
  const state = useLocation()
  // console.log(state)
  const [loading, setLoading] = useState(true);
  // const [cookies, setCookie, remoceCookie] = useCookies();
  const navigate = useNavigate()
  const Subject = ((localStorage.getItem("Subject") != null) ? localStorage.getItem("Subject") : (state.state ? state.state.Subject : props.Subject))
  const lvl = ((localStorage.getItem("Level") != null) ? parseInt(localStorage.getItem("Level")) : (state.state ? (state.state.level ? state.state.level : 1) : 1))
  const Score = ((localStorage.getItem("Score") != null) ? JSON.parse(localStorage.getItem("Score")) : (state.state ? state.state.Score : []))
  const [Next, setNext] = useState("Next")
  // // console.log(parseInt(JSON.parse(localStorage.getItem("Selected"))[0]))
  // // console.log(localStorage.getItem("Count"), parseInt(localStorage.getItem("Count")))
  // console.log(Subject, lvl, localStorage.getItem("Selected"))
  const [select, setselect] = useState((localStorage.getItem("Selected") == null ? null : parseInt(JSON.parse(localStorage.getItem("Selected"))[0])))
  const [count, setcount] = useState(0)
  const [nextDisable, setnextDisable] = useState(false)
  const [prevDisable, setprevDisable] = useState(true)
  const [dict, setdict] = useState((localStorage.getItem("Selected") == null) ? {} : JSON.parse(localStorage.getItem("Selected")))
  const [list, setlist] = useState(
    [
      {
        "options": [],
        "question_data": ""
      }
    ]
  )
  // // console.log(JSON.parse(String(dict)))
  const [eve, seteve] = useState({})


  function shuffleArray(array, n = false, s = true) {
    if (!s) {
      return array;
    }
    if (n) {
      return array.slice(0, 20)
    }
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let url = 'http://127.0.0.1:9003/ques/' + Subject + '/' + lvl
      axios.get(url).then(
        res => {
          let data = res.data;

          if (data == "Error") {
            navigate("/", { state: { error: "true" } })
          }

          setlist((list) => shuffleArray(data["data"], true, true));

          // console.log(res.headers["x-score-id"])

          axios.interceptors.request.use(
            config => {
              if (res.headers["x-score-id"].length > 0) {
                config.headers['X-Score-ID'] = res.headers["x-score-id"];
              }
              return config;
            },
            error => {
              return Promise.reject(error);
            }
          );

          localStorage.setItem("scr_id", res.headers["x-score-id"])
          localStorage.setItem("Subject", Subject)
          localStorage.setItem("Level", lvl)
        }
      ).catch((err) => {
        MySwal.fire({
          title: 'Server Down',
          text: 'Looks like the server is unreachable',
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
      });
      setLoading(false);
    }
    fetchData()
  }, [Subject, lvl]);

  function SubmitAns() {
    setselect(dict[count + 1]);
    if (count < list.length - 2) {
      setprevDisable(false);
      setcount(count + 1);
      localStorage.setItem("Count", count + 1)
    } else if (count < list.length - 1) {
      setNext("Save");
      setcount(count + 1);
      localStorage.setItem("Count", count + 1)
    } else {
      setselect(dict[count]);
    }
    // // // console.log(list[count].question_data);
  };

  function PrevAns() {
    // // // console.log(list)
    //   // // console.log( dict[list[count - 1].question_data]);
    // eve[count - 1].className = eve[count - 1].className + " active"
    // eve[count - 1].className = eve[count - 1].className + " active"
    // // console.log(eve[count - 1].className)
    setselect(dict[count - 1]);
    if (count === 1) {
      setprevDisable(true);
    }
    setcount(count - 1);
    localStorage.setItem("Count", count - 1)
    setnextDisable(false);
    // // // console.log(list[count].question_data);
  };

  const handleChange = (event) => {
    // // // console.log(list)
    eve[count + 1].className = 'btn btn-success mx-2 my-2'
    seteve(eve => eve)
    let modifiedDict = dict;
    modifiedDict[count] = parseInt(event.target.value);
    setdict(modifiedDict);
    localStorage.setItem("Selected", JSON.stringify(dict))
    // // // console.log("ref");
    // // // console.log(select);
    // // // console.log(dict);
  }

  async function SubmitPaper() {
    const score = await axios.post("http://127.0.0.1:9003/submit/", { answers: dict , level: lvl}).catch((err) => { 
      MySwal.fire({
        title: 'Server Down',
        text: 'Looks like the server is unreachable',
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
    });
    // setScore(Score => score.data)
    // // // console.log("awdawd", )
    // // // console.log("sedfsefsefsefsefsef", Score)
    localStorage.setItem("Score", JSON.stringify([...Score, score.data]))
    console.log(list.length, list)
    navigate("/Result", { replace: true, state: { Score: [...Score, score.data], Subject: Subject, level: lvl, length: list.length } })
  }

  const palletChange = (e) => {
    setcount(e.target.value - 1)
    // // console.log("awdawd", count)
    localStorage.setItem("Count", e.target.value - 1)
    // // console.log("awdawd", count)
    setselect(dict[e.target.value - 1]);
    // // // console.log((e.target.value) == 20)
    if ((e.target.value - 1) === 0) {
      setprevDisable(true);
    } else if ((e.target.value) === 20) {
      setNext("Save");
    } else {
      setprevDisable(false);
    }
  }

  const arr = list[count].options
  // // console.log(Object.entries(dict).length, list.length, ((Object.entries(dict).length/list.length)*100))
  return (
    <>
      {loading && (
        <div class="spinner-border m-5 text-light" style={{ width: "5rem", height: "5rem" }} role="status">
          <span class="sr-only"></span>
        </div>
      )}
      {!loading && (<>
        <h1 className="mt-2">Level : {lvl}</h1>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: ((Object.entries(dict).length / list.length) * 100) + "%" }} aria-valuenow={((Object.entries(dict).length / list.length) * 100)} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div className="parent-container d-flex bd-highlight">
          <div className="p-2 w-100 bd-highlight">
            <div className="question my-5" value={list[count].question_data}>
              {list[count].question_data}
            </div>
            <div id="test" className="form-check" onChange={handleChange}>
              {arr.map((opt, i) => {
                return (
                  <>
                    <input
                      checked={select == opt.id}
                      onChange={e => {
                        setselect(e.target.value);
                        // seteve(e.target);
                      }}
                      type="radio"
                      name="flexRadioDefault"
                      id={"flexRadioDefault" + (i + 2)}
                      value={opt.id}
                    />
                    <label
                      className=" list-group-item list-group-item-action"
                      htmlFor={"flexRadioDefault" + (i + 2)}
                    >
                      {opt.option_data}
                    </label>
                  </>
                );
              })}
              <button
                className="btn btn-secondary btn px-5 mx-5 my-5"
                disabled={prevDisable}
                onClick={PrevAns}
              >
                Prev
              </button>
              <button
                className="btn btn-secondary btn px-5 mx-5"
                disabled={nextDisable}
                onClick={SubmitAns}
              >
                {Next}
              </button>
            </div>
            <button
              className="btn btn-secondary btn-lg px-5 mx-5"
              onClick={SubmitPaper}
            >
              Submit
            </button>
          </div>
          <div className="p-2 flex-shrink-0 bd-highlight mx-3" >
            <label className="mt-5 mb-4">Questions</label>
            <div>
              {/* {// // console.log(lst)} */}
              {/* {lst} */}
              <Pallet n={list.length} count={count} palletChange={palletChange} eve={eve} dict={dict} />
              {/* {// console.log(test)} */}
            </div>
          </div>
        </div>
      </>)}
    </>
  );
}


Home.defaultProps = {
  Subject: "Python",
  level: 1,
  Score: []
}
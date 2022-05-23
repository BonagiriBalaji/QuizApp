import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Percentage from "./Percentages"

export default function Level(props) {

  const state = useLocation();
  // const Score = state.state ? state.state.Score : props.Score;
  const Score = ((localStorage.getItem("Score") != null) ? JSON.parse(localStorage.getItem("Score")) : (state.state ? state.state.Score : props.Score))
  // localStorage.setItem("Score", JSON.stringify([...Score, score.data]))
  // console.log(Score)
  localStorage.clear()
  // console.log(Score)
  localStorage.setItem("Score", JSON.stringify(Score))
  const navigate = useNavigate();
  const Subject = state.state ? state.state.Subject : props.Subject;
  let lvl = state.state ? (state.state.level ? state.state.level : 1) : 1;
  // const Score = state.state ? state.state.Score : props.Score;
  // console.log(Subject, lvl, Percentage[Subject][lvl], Percentage, "sefsef")
  // console.log(state.state)
  // console.log(state.state.length, Score[lvl - 1])
  // console.log(((Score[lvl - 1]/state.state.length)*100))
  const next = (((Score[lvl - 1]/state.state.length)*100) >= Percentage[Subject][lvl]) ? true : false;

  function handleClick(e) {
    if (next) {
      lvl = lvl + 1;
    } else {
      Score.pop();
      localStorage.setItem("Score", JSON.stringify(Score))
    }
    navigate("/" + e.target.value, {
      replace: true,
      state: { Score: [...Score], Subject: Subject, level: lvl },
    });
  }
  try {
    if (Score[2] >= 1) {
      return (
        <>
          <div className="container my-5 result">
            <h2>Congratulations</h2>
            <div class="card my-5">
              <div class="card-body">
                {Score.map((src, i) => {
                  return (
                    <>
                      <h5 class="card-title">Level {i+1}</h5>
                      <h6 class="card-subtitle mb-2 text-muted">
                        Score : {src}
                      </h6>
                    </>
                  );
                })}
              </div>
            </div>
            <button
              className="btn btn-primary mx-5"
              onClick={handleClick.bind(this)}
              value=""
            >
              Go To Home
            </button>
          </div>
        </>
      );
    }
  } catch (err) {
    // console.log(err);
  }
  return (
    <div>
      <div className="container my-5">
        <h2>Your Percentage : {((Score[lvl - 1]/20)*100).toFixed(2)} %</h2>
        <div className="container my-5">
          <h1>Test {next ? "Passed" : "Failed"}</h1>
        </div>

        <button
          className="btn btn-primary mx-5"
          onClick={handleClick.bind(this)}
          value={Subject}
        >
          {next ? "Next Level" : "Try Again"}
        </button>
        <button
          className="btn btn-primary mx-5"
          onClick={handleClick.bind(this)}
          value=""
        >
          Go To Home
        </button>
      </div>
    </div>
  );
}

Level.defaultProps = {
  Score: [],
  Subject: "Python",
  level: 1,
};

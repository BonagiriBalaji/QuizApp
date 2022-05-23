import "../App.css";
import React, { Component } from "react";
import axios from 'axios';
import Level from './Levels'

class Home extends Component {
  constructor() {
    super();
    this.state = {
      Score: -1,
      Next: "Save & Next",
      Submit: true,
      select: null,
      count: 0,
      nextDisable: false,
      prevDisable: true,
      dict: {"1":0},
      list : [
          {
          "options": [],
          "question_data": ""
        }
      ]
    }

    this.handleChange = this.handleChange.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  componentDidMount(){
    axios.get('http://127.0.0.1:8000/ques/').then(
      res => {
        const data = res.data;
        // this.state.list = data
        this.setState({list: data});
        console.log(data)
      }
    )
  }

  SubmitAns = () => {
    this.setState({ select: this.state.dict[this.state.count + 1] });
    if (this.state.count < this.state.list.length - 2) {
      this.setState({ prevDisable: false });
      this.setState({ count: this.state.count + 1 });
    } else if (this.state.count < this.state.list.length - 1) {
      this.setState({ Next: "Save" });
      this.setState({ count: this.state.count + 1 });
      this.setState({ Submit: false });
    } else {
      this.setState({ select: this.state.dict[this.state.count] });
      this.setState({ Submit: false });
    }
    // console.log(list[count].question_data);
  };

  PrevAns = () => {
    //   console.log( this.state.dict[this.state.list[this.state.count - 1].question_data]);
    this.setState({ select: this.state.dict[this.state.count - 1] });
    if (this.state.count === 1) {
      this.setState({ prevDisable: true });
    }
    this.setState({ count: this.state.count - 1 });
    this.setState({ nextDisable: false });
    // console.log(list[count].question_data);
  };

  selectOption(e) {
    this.setState({ select: e.target.value });
  }

  handleChange(event) {
    let modifiedDict = this.state.dict;
    modifiedDict[this.state.count] = parseInt(event.target.value);
    this.setState({ dict: modifiedDict });
    // console.log("ref");
    // console.log(this.state.select);
    // console.log(this.state.dict);
  }

  SubmitPaper = () => {
    console.log("Submit")
    axios.post("http://127.0.0.1:8000/submit/", this.state.dict).then(
      res => {
        const data = res.data;
        this.setState({ Score : data });
        console.log(this.state.Score)
      }
    )

    // await axios.post("http://127.0.0.1:8000/submit/", this.state.dict);
    // console.log(this.state.dict);
  };


  render() {
    // console.log(this.state.list)
    let count = this.state.count;
    let list = this.state.list;
    let select = this.state.select;
    let Next = this.state.Next;
    console.log(this.state.Score)
    if (this.state.Score != -1){
      return (
        <>
          <Level Score={this.state.Score}/>
        </>
      )
    } else {
      return (
        <>
          <div className="container">
            <div className="question my-5" value={list[count].question_data}>
              {list[count].question_data}
            </div>
            <div id="test" className="form-check" onChange={this.handleChange}>
              {list[count].options.map((opt, i) => {
                return (
                  <>
                    <input
                      checked={select == opt.id}
                      onChange={this.selectOption}
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
                disabled={this.state.prevDisable}
                onClick={this.PrevAns}
              >
                Prev
              </button>
              <button
                className="btn btn-secondary btn px-5 mx-5"
                disabled={this.state.nextDisable}
                onClick={this.SubmitAns}
              >
                {Next}
              </button>
            </div>
            <button
              className="btn btn-secondary btn-lg px-5 mx-5"
              hidden={this.state.Submit}
              onClick={this.SubmitPaper}
            >
              Submit
            </button>
          </div>
        </>
      );
    }
    }
}

export default Home;

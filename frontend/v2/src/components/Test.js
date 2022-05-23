import React, { Component } from "react";

class RefExample extends Component {
  constructor() {
    super();

    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  onSubmitForm() {
    console.log(this.w.checked);
    this.w.checked = false;
  }

  render() {
    
    return (
        
      <div>
        <div>

        <div className="form-check">
                    <input ref={(myinput) => (this.input = myinput)} type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="1"/>
                    <label
                        className=" list-group-item list-group-item-action"
                        htmlFor="flexRadioDefault1"
                    >
                        test
                    </label>

                    <input ref={(e) => (this["w"] = e)} type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="2" />
                    <label
                        className="list-group-item list-group-item-action"
                        htmlFor="flexRadioDefault2"
                    >
                        est
                    </label>

                    <input ref={(myinput) => (this.t = myinput)} type="radio" name="flexRadioDefault" id="flexRadioDefault3" value="3" />
                    <label
                        className="list-group-item list-group-item-action"
                        htmlFor="flexRadioDefault3"
                    >
                        ttt
                    </label>

                    <input ref={this.input} type="radio" name="flexRadioDefault" id="flexRadioDefault4" value="4"/>
                    <label
                        className="list-group-item list-group-item-action"
                        htmlFor="flexRadioDefault4"
                    >
                        tttt
                    </label>


                <button className="btn btn-secondary btn-lg px-5 mx-5 my-5" >Prev</button>
                <button className="btn btn-secondary btn-lg px-5 mx-5" >Next</button>
                </div>

          <label>
            First Name :
            <input
              name="fname"
              type="text"
            />
          </label>
        </div>

        <div>
          <button onClick={this.onSubmitForm}>Submit</button>
        </div>
      </div>
    );
  }
}

export default RefExample;

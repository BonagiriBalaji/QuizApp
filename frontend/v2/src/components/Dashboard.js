import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";
import Chart from "react-apexcharts";
import { useCookies } from "react-cookie";
import { parseJwt } from "../App";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [series, setSeries] = useState([]);
  const [table, setTable] = useState([]);
  const navigate = useNavigate();
  const [cookies, setCookie, remoceCookie] = useCookies();
  const [user_data, setUserData] = useState(parseJwt(cookies.access_token))

  // const [options, setOptions] = useState({
  //     chart: {
  //     type: 'area',
  //     stacked: false,
  //     height: 350,
  //     zoom: {
  //       enabled: false
  //     },
  //   },
  //   dataLabels: {
  //     enabled: false
  //   },
  //   markers: {
  //     size: 0,
  //   },
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //         shadeIntensity: 1,
  //         inverseColors: false,
  //         opacityFrom: 0.45,
  //         opacityTo: 0.05,
  //         stops: [20, 100, 100, 100]
  //       },
  //   },
  //   yaxis: {
  //     labels: {
  //         style: {
  //             colors: '#8e8da4',
  //         },
  //         offsetX: 0,
  //     },
  //     axisBorder: {
  //         show: false,
  //     },
  //     axisTicks: {
  //         show: false
  //     }
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //     tickAmount: 20,
  //     min: new Date("04/15/2022").getTime(),
  //     labels: {
  //         rotate: -15,
  //         rotateAlways: true,
  //         formatter: function(val, timestamp) {
  //           return moment(new Date(timestamp)).format("mm:ss")
  //       }
  //     }
  //   },
  //   title: {
  //     text: 'Irregular Data in Time Series',
  //     align: 'left',
  //     offsetX: 14
  //   },
  //     tooltip: {
  //         x: {
  //             format: 'mm:ss'
  //         },
  //     shared: true
  // },
  //   legend: {
  //     position: 'top',
  //     horizontalAlign: 'right',
  //     offsetX: -10
  //   }
  //   });

  const [options, setOptions] = useState({
    name: "",
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      type: "datetime",
      tickAmount: 10,
      min: "",
      // labels: {
      //     rotate: -15,
      //     rotateAlways: true,
      //     formatter: function(val, timestamp) {
      //       return moment(new Date(timestamp)).format("HH:mm:ss")
      //   }
      // }
      labels: {
        datetimeUTC: false,
        format: "hh:mm:ss",
      }
    },
    tooltip: {
      x: {
        format: "hh:mm",
      },
      y: {
        max: 20.0
      },
      shared: true,
    },
  });

  // async function lol() {
  //     try {
  //         const resp = await axios.get("http://127.0.0.1:9003/scores/").catch((err) => { console.log("Submiting Error : ", err) });
  //         const ttt = resp.data[0].map((i, sub) => {
  //             console.log(i, sub)
  //         })
  //         const data = resp.data[0]['python'].map(i => i.score);
  //         const data2 = resp.data[0]['python'].map(i => i.created_at);
  //         series['name'] = 'python'
  //         series['data'] = data
  //         options['xaxis']['min'] = min
  //         // console.log(series)
  //         setSeries(series => [...series])
  //         setOptions({ ...options })
  //         // console.log(xaxis, yaxis)
  //         // console.log(series, options)
  //     } catch (err) {
  //         console.log(err)
  //     }
  // }

  // async function get_data() {
  //     const resp = await axios.get("http://127.0.0.1:9003/scores/").catch((err) => { console.log("Submiting Error : ", err) });
  //     // console.log(resp.data[0]['python'])
  //     // const testing = resp.data[0]['python'].map(function (el) { return el.created_at; });
  //     const lol = resp.data[0]['python'].map(i => i.created_at);
  //     const lol3 = resp.data[0]['python'].map(i => i.score);
  //     const lol2 = options
  //     lol2['xaxis']['categories'] = lol
  //     lol2['name'] = count
  //     const old = [{
  //         name: 'series'+count,
  //         data: lol3
  //     }]
  //     setOptions(lol2)
  //     setSeries(old)
  //     // console.log(lol)
  // }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios
          .get("http://127.0.0.1:9003/scores/")
          .catch((err) => {
            if (err.response.status == 404) {
              navigate("/Login");
            }
            // console.log("Submiting Error : ", err.response.status)
          });
        // const data = resp.data[0]['python'].map(i => i.score);
        const data2 = resp.data[0]["python"].map((i) => i.created_at);
        const obj = resp.data[0];
        let min = "";
        for (let key in obj) {
          let head = [];
          let body = [];
          head.push(
            <thead className="table table-light">
              <tr>
                <th style={{ width: "5%" }} rowspan="2">#</th>
                <th style={{ width: "15%" }} rowspan="2">Date</th>
                <th style={{ width: "15%" }} rowspan="2">Time</th>
                <th style={{ width: "25%" }} rowspan="2">Total Score</th>
                <th style={{ width: "40%" }} colspan="3">
                  Level Score
                </th>
              </tr>
              <tr>
                <th style={{ width: '13%' }}>1</th>
                <th style={{ width: "13%" }}>2</th>
                <th style={{ width: "13%" }}>3</th>
              </tr>
            </thead>
          );
          const sub_dit = {};
          sub_dit["name"] = key;
          sub_dit["data"] = obj[key].map((i, index) => {
            if (min == "") {
              min = i.created_at;
            } else {
              if (min > i.created_at) {
                min = i.created_at;
              }
            }
            const d = new Date(i.created_at)
            body.push(
              <tr>
                <td>{index}</td>
                <td>{d.toLocaleDateString()}</td>
                <td>{d.toLocaleTimeString()}</td>
                <td>{i.score}</td>
                <td>{(i.level_1 == -1) ? "NA" : i.level_1}</td>
                <td>{(i.level_2 == -1) ? "NA" : i.level_2}</td>
                <td>{(i.level_3 == -1) ? "NA" : i.level_3}</td>
              </tr>
            );
            return {
              y: i.score,
              x: d.getTime(),
            };
          });
          table.push(
            <>
              <h3 className="mt-5 mb-3">{key.toUpperCase()}</h3>
              <table className="table table-hover table-light table-striped caption-top">
                {head}
                <tbody>{body}</tbody>
              </table>
            </>
          );
          series.push(sub_dit);
        }
        setTable((table) => [...table]);
        // series[0]['name'] = count + "awdawd"
        // series[0]['data'] = data
        options["xaxis"]["min"] = min;
        // console.log(series)
        setSeries((series) => [...series]);
        setOptions({ ...options });
        // console.log(xaxis, yaxis)
        // console.log(series, options)
      } catch (err) {
        console.log(err, "error");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand mx-5">{user_data ? user_data.username : "Guest"}</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a className="nav-link" href="/">Menu</a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="/Logout">Logout</a>
              </li>
            </ul>
          </div>
        </nav>
        {loading && (
          <div
            className="spinner-border m-5 text-light"
            style={{ width: "5rem", height: "5rem" }}
            role="status"
          >
            <span className="sr-only"></span>
          </div>
        )}
        {!loading && (
          <>
            <div id="chart">
              <Chart
                options={options}
                series={series}
                type="area"
                height={300 + count}
              />
            </div>
            <div className="container">{table}</div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;

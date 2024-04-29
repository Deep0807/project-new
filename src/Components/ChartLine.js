import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const LineChart = () => {
  const [data, setData] = useState([]);
  const [detailValue, setDetailsValue] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [yearlyChange, setYearlyChange] = useState(0);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const navigate = useNavigate();
  const item = localStorage.getItem("rows");
  const details = localStorage.getItem("details");

  useEffect(() => {
    if (item) {
      const parsedItem = JSON.parse(item);
      const parsedData = parsedItem.map((element) => ({
        date: element.date,
        price: parseInt(element.price),
      }));
      setData(parsedData);
      calculateTotalPrice(parsedData);
      calculateYearlyChange(parsedData);
    }
    if (details) {
      const parsedItem = JSON.parse(details);
      setDetailsValue(parsedItem);
    }
  }, [item, details]);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: data.sort((a, b) => new Date(a.date) - new Date(b.date)).map((item) => item.date) ,
            datasets: [
              {
                label: "",
                data: data.map((item) => item.price),
                fill: false,
                tension: 0.5,
                backgroundColor: "rgb(134 162 223 / 33%)",
                borderColor: "#0f015b",
              },
            ],
          },
          options: {
            layout: {
              padding: {
                left: 20,
              },
            },
            scales: {
              x: {
                ticks: {
                  align: "start",
                },
              },
              y: {
                beginAtZero: true,
              },
            },
            onClick: handleChartClick,
          },
        });
      }
    }
  }, [data]);

  const handleChartClick = (event, chartElements) => {
    if (chartElements.length > 0) {
      const clickedIndex = chartElements[0].index;
      const clickedData = data[clickedIndex];
      openPieChart(clickedData);
    }
  };

  // const openPieChart = (clickedData = null) => {
  //   // Calculate percentage of each data point relative to the total
  //   const total = data.reduce((acc, curr) => acc + curr.price, 0);
  //   let percentagesClicked;
  //   let percentagesRest;
  
  //   if (clickedData) {
  //     // Calculate percentage for clicked item
  //     const clickedItemTotal = data.find((item) => item.date === clickedData.date).price;
  //     percentagesClicked = [{ label: clickedData.date, data: (clickedItemTotal / total) * 100 }];
  
  //     // Calculate percentage for rest of the data
  //     const restTotal = total - clickedItemTotal;
  //     percentagesRest = data.map((item) => ({
  //       label: item.date,
  //       data: item.date === clickedData.date ? 0 : (item.price / restTotal) * 100,
  //     }));
  //   } else {
  //     // If no chart element is clicked, show all data in the pie chart
  //     percentagesClicked = [];
  //     percentagesRest = data.map((item) => ({
  //       label: item.date,
  //       data: (item.price / total) * 100,
  //     }));
  //   }
  //   debugger
  
  //   // Combine percentages for clicked item and rest of the data
  //   const combinedPercentages = [...percentagesClicked, ...percentagesRest];
  
  //   // Check if pie chart already exists
  //   if (chartRef.current && chartRef.current.data) {
  //     // Update existing pie chart
  //     chartRef.current.data.labels = combinedPercentages.map((item) => item.label);
  //     chartRef.current.data.datasets[0].data = combinedPercentages.map((item) => item.data);
  //     chartRef.current.update();
  //   } else {
  //     // Create new pie chart
  //     const pieChartCanvas = document.createElement("canvas");
  //     pieChartCanvas.id = "pieChartCanvas";
  //     document.body.appendChild(pieChartCanvas);
    
  //     chartRef.current = new Chart(pieChartCanvas, {
  //       type: "pie",
  //       data: {
  //         labels: combinedPercentages.map((item) => item.label),
  //         datasets: [
  //           {
  //             data: combinedPercentages.map((item) => item.data),
  //             backgroundColor: [
  //               "rgba(255, 99, 132, 0.6)",
  //               "rgba(54, 162, 235, 0.6)",
  //               "rgba(255, 206, 86, 0.6)",
  //               "rgba(75, 192, 192, 0.6)",
  //               "rgba(153, 102, 255, 0.6)",
  //               "rgba(255, 159, 64, 0.6)",
  //               // Add more colors if needed
  //             ],
  //           },
  //         ],
  //       },
  //       options: {
  //         responsive: true,
  //       },
  //     });
  //   }
    
    
  // };

  const openPieChart = (clickedData = null) => {
   
    const total = data.reduce((acc, curr) => acc + curr.price, 0);
    let percentagesClicked;
  
    if (clickedData) {
     
      const clickedItemTotal = data.find((item) => item.date === clickedData.date).price;
      const clickedItemPercentage = (clickedItemTotal / total) * 100;
      percentagesClicked = [{ label: clickedData.date, data: clickedItemPercentage }];
    } else {
      percentagesClicked = [];
    }

    const restTotalPercentage = 100 - (percentagesClicked.length ? percentagesClicked[0].data : 0);
  console.log(restTotalPercentage);
    const combinedPercentages = [...percentagesClicked, { label: "Rest Data", data: restTotalPercentage }];

    if (chartRef.current && chartRef.current.data) {
      
      chartRef.current.data.labels = combinedPercentages.map((item) => item.label);
      chartRef.current.data.datasets[0].data = combinedPercentages.map((item) => item.data);
      chartRef.current.update();
    } else {
    
      const pieChartCanvas = document.createElement("canvas");
      pieChartCanvas.id = "pieChartCanvas";
      document.body.appendChild(pieChartCanvas);
  
      chartRef.current = new Chart(pieChartCanvas, {
        type: "pie",
        data: {
          labels: combinedPercentages.map((item) => item.label),
          datasets: [
            {
              data: combinedPercentages.map((item) => item.data),
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
                
              ],
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
  };
  
  
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const calculateTotalPrice = (data) => {
    const total = data.reduce((acc, curr) => acc + curr.price, 0);
    setTotalPrice(total);
  };

  const handleDelete = () => {
    localStorage.removeItem("rows");
    localStorage.removeItem("details");
    setDetailsValue({ type: "", description: "" });
    navigate("/graphform");
  };

  const calculateYearlyChange = (data) => {
    if (data.length < 2) return;

    const currentYearPrice = data[data.length - 1].price;
    const lastYearPrice = data[data.length - 2].price;

    const changePercentage =
      ((currentYearPrice - lastYearPrice) / lastYearPrice) * 100;
    setYearlyChange(changePercentage.toFixed(2));
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "rgb(159 173 248 / 33%)",
          height: "100vh",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container mt-5">
          <div className="row">
            <div className="col d-flex justify-content-end mb-3">
              <div className="me-2">
                <button onClick={toggleDetails} className="btn btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                  </svg>
                  &nbsp; view
                </button>
              </div>
              <div>
                <button className="btn btn-danger" onClick={handleDelete}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-archive"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <h3>{detailValue ? detailValue?.type : "N/A"}</h3>
              <h4 style={{ color: "grey" }}>
                {detailValue ? detailValue?.description : "N/A"}
              </h4>
              <canvas
                ref={chartRef}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                }}
              ></canvas>
            </div>
            {showDetails && (
              <div className="col-md-3">
                <div
                  className="card"
                  style={{
                    marginTop: "5px",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                    height: "98%",
                    padding: " 9px",
                  }}
                >
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Total Price</h5>
                      <p className="card-text">{totalPrice}</p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Yearly Change (%)</h5>
                      <p className="card-text">{yearlyChange}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {showDetails && (
            <div className="row mt-3">
              <div className="col">
                {detailValue && (
                  <ul>
                    <li>
                      <h3> {detailValue.type}</h3></li>
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LineChart;

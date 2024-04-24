import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GraphForm from "./Components/GraphForm";
import LoginForm from "./Components/Login";
import LineChart from "./Components/ChartLine";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === true) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", true);
  };

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   localStorage.removeItem("isLoggedIn");
  // };

   console.log(isLoggedIn);
  return (
    <Router>
      <Routes>
        {!isLoggedIn && (
          <Route path="*" element={<LoginForm onLogin={handleLogin} />} />
        )}

        {isLoggedIn && (
          <>
            <Route path="/" element={<Navigate to="/graphform" />} />
            <Route path="/graphform" element={<GraphForm />} />
            <Route path="/chart" element={<LineChart />} />
            <Route path="/logout" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;

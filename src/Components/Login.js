import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email) && validatePassword(password)) {
      onLogin();
      navigate("/graphform");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginContainer}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              style={
                emailError
                  ? { ...styles.input, backgroundColor: "#ffbfc6" }
                  : styles.input
              }
            />
            {emailError && <span style={styles.error}>{emailError}</span>}
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              style={
                passwordError
                  ? { ...styles.input, backgroundColor: "#ffbfc6" }
                  : styles.input
              }
            />
            {passwordError && <span style={styles.error}>{passwordError}</span>}
          </div>
          <button type="submit" style={styles.button}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loginContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  inputContainer: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    marginTop: "7px",
  },
  button: {
    backgroundColor: "rgb(0 29 60)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  label: {
    color: "grey",
    padding: "2px",
  },
};

export default LoginForm;

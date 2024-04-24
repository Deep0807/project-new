import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GraphForm = () => {
  const [rows, setRows] = useState([{ price: "", date: "" }]);
  const [details, setDetails] = useState({ type: "", description: "" });
  const [formValid, setFormValid] = useState(false); // State to track form validity
  const [buttonClicked, setButtonClicked] = useState(false); // State to track if add button clicked
  const navigate = useNavigate();

  useEffect(() => {
    // Check if form is valid
    const isValid = validateForm();
    setFormValid(isValid);
  }, [details, rows]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const handleChangeDet = (e) => {
    const { name, value } = e.target;
    setDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddRow = () => {
    setRows([...rows, { price: "", date: "" }]);
  };

  const addData = () => {
    localStorage.setItem("rows", JSON.stringify(rows));
    localStorage.setItem("details", JSON.stringify(details));
    alert('Data added successfully')
    setButtonClicked(true); 
  };

  const handleRemoveRow = (rowToRemove) => {
    const updatedRows = rows.filter((row) => row !== rowToRemove);
    setRows(updatedRows);
  };

  const validateForm = () => {
    // Validate if all required fields are filled
    return (
      details.type.trim() !== "" &&
      details.description.trim() !== "" &&
      rows.every((row) => row.price.trim() !== "" && row.date.trim() !== "")
    );
  };

  return (
    <div>
      <div style={{ ...styles.row, ...styles.customRow }}>
        <h3>Manage product price Trends </h3>
        <button
          type="button"
          onClick={addData}
          style={{
            ...styles.addButton,
            background: formValid ? "rgb(0 37 76)" : "grey",
            borderRadius: "4px",
          }}
          disabled={!formValid} // Disable the button if form is not valid
        >
          Add Changes
        </button>
        <button
          style={{
            ...styles.addButton,
            background: buttonClicked && formValid ? "rgb(0 37 76)" : "grey", // Enable button if add button clicked and form is valid
            borderRadius: "4px",
          }}
          onClick={() => navigate("/chart")}
          disabled={!buttonClicked || !formValid} // Disable the button if add button not clicked or form is not valid
        >
          Show Chart
        </button>
      </div>
      <hr style={styles.hr} />
      <div>
        <div style={styles.row}>
          <input
            type="text"
            name="type"
            onChange={(e) => handleChangeDet(e)}
            placeholder="Value"
            style={{ ...styles.input, width: "47%" }}
            required
          />
          <input
            type="text"
            name="description"
            onChange={(e) => handleChangeDet(e)}
            placeholder="Description"
            style={{ ...styles.input, width: "47%" }}
            required
          />
        </div>
      </div>
      <hr style={styles.hr} />

      <div>
        <div style={{ ...styles.addList }}>
          <div style={{ margin: "5px" }}>
            <input
              type="number"
              style={styles.input}
              name="price"
              placeholder="New price"
              onChange={(e) => handleChange(0, e)}
              required
            />
            <input
              type="date"
              name="date"
              style={styles.dateInput}
              onChange={(e) => handleChange(0, e)}
              required
            />
            <button
              type="button"
              onClick={handleAddRow}
              style={styles.addButton}
            >
              +
            </button>
          </div>
        </div>
        {rows.slice(1).map((row, index) => (
          <div key={index + 1} style={styles.addList}>
            <div style={{ margin: "5px" }}>
              <input
                type="number"
                style={styles.input}
                name="price"
                placeholder="New price"
                value={row.price}
                onChange={(e) => handleChange(index + 1, e)}
                required
              />
              <input
                type="date"
                name="date"
                style={styles.dateInput}
                value={row.date}
                onChange={(e) => handleChange(index + 1, e)}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveRow(row)}
                style={styles.removeButton}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    justifyContent: "center",
  },
  customRow: {
    justifyContent: "space-between",
    margin: "2px",
  },
  hr: {
    color: "grey",
    width: "99%",
    margin: "3px",
  },
  input: {
    marginRight: "10px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  addList: {
    marginBottom: "5px",
    display: "block",
    margin: "5px",
  },
  addButton: {
    padding: "8px 16px",
    borderRadius: "55%",
    border: "none",
    backgroundColor: "rgb(0 255 181)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "grey 5px 4px 4px 0px",
  },
  removeButton: {
    padding: "8px 16px",
    borderRadius: "55%",
    border: "none",
    backgroundColor: "red",
    color: "#fff",
    cursor: "pointer",
    width: "40px",
    boxShadow: "grey 5px 4px 4px 0px",
  },
  dateInput: {
    marginRight: "10px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    width: "200px",
    WebkitAppearance: "none",
    backgroundColor: "#fff",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    backgroundSize: "16px 16px",
    paddingRight: "24px",
    cursor: "pointer",
  },
};

export default GraphForm;

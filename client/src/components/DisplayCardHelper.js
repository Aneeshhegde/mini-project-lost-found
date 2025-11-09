import React from "react";

const DisplayCardHelper = ({ helper, number }) => {
  const { itemdetails, helpername, mobilenumber, hostelname, date } = helper;

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    margin: "15px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    border: "2px solid #4CAF50",
  };

  const headerStyle = {
    color: "#2c3e50",
    fontSize: "1.4rem",
    marginBottom: "10px",
  };

  const numberStyle = {
    color: "#4CAF50",
    fontSize: "1.2rem",
    fontWeight: "bold",
  };

  const labelStyle = {
    color: "#34495e",
    fontWeight: "bold",
  };

  const valueStyle = {
    color: "#16a085",
    fontSize: "1rem",
  };

  return (
    <div style={cardStyle}>
      <h2 style={headerStyle}>Helper Details:</h2>
      <h2 style={numberStyle}>No. {number}</h2>
      <p>
        <strong style={labelStyle}>Item helped for:</strong>{" "}
        <span style={valueStyle}>{itemdetails}</span>
      </p>
      <p>
        <strong style={labelStyle}>Helper Name:</strong>{" "}
        <span style={valueStyle}>{helpername}</span>
      </p>
      <p>
        <strong style={labelStyle}>Mobile Number:</strong>{" "}
        <span style={valueStyle}>{mobilenumber}</span>
      </p>
      <p>
        <strong style={labelStyle}>Hostel Name:</strong>{" "}
        <span style={valueStyle}>{hostelname}</span>
      </p>
      <p>
        <strong style={labelStyle}>Date:</strong>{" "}
        <span style={valueStyle}>{new Date(date).toLocaleString()}</span>
      </p>
    </div>
  );
};

export default DisplayCardHelper;

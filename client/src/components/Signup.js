import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import config from "./config";
import Spinner from "./Spinner";

const Base_URL = config.baseURL;

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [rollno, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRollNoChange = (e) => {
    setRollNo(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = {
      username: name,
      rollno: rollno,
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(`${Base_URL}/signup`, data);

      if (res.status === 201) {
        alert("Successfully registered, proceed to login!");
        setLoading(false);
        navigate("/sign-in");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 409) {
          // Duplicate email or rollno
          alert(error.response.data.message || "Email or Roll number already exists.");
        } else if (error.response.status === 400) {
          // Validation error
          const errors = error.response.data.errors;
          if (errors && errors.length > 0) {
            alert(errors.map(err => err.msg).join("\n"));
          } else {
            alert("Invalid input. Please check your details.");
          }
        } else {
          alert(error.response.data.message || "An error occurred during signup. Please try again.");
        }
      } else if (error.request) {
        // Request made but no response received
        alert("Cannot connect to server. Please make sure the server is running.");
      } else {
        // Something else happened
        alert("An error occurred during signup. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading state to false after signup attempt completes
    }
  };

  return (
    <>
      <Navbar />
      <div className="card signup-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Roll No:</label>
            <input
              type="text"
              id="rollno"
              name="rollno"
              value={rollno}
              onChange={handleRollNoChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <button
            className="submit-button"
            type="submit"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign Up"}{" "}
            {/* Show Spinner component when loading */}
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;

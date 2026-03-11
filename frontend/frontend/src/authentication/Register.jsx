import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:7000/api/auth/register",
        { name, email, password }
      );

      alert("Registration successful");

      navigate("/");

    } catch (err) {

      alert(err.response?.data?.message || "Some error occurred");

    }

  };

  return (

    <div className="login-container">

      <div className="login-card">

        <h1 className="logo">Create Account</h1>
        <p className="subtitle">Sign up to get started</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Register
          </button>

        </form>

        <p className="bottom-text">
          Already have an account? <Link to="/">Login</Link>
        </p>

      </div>

    </div>

  );
}

export default Register;
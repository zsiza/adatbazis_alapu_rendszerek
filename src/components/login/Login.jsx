import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [values, setValues] = React.useState({
    email: "",
    jelszo: "",
    jelszoUjra: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081")
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/login", values)
      .then((res) => {
        if (res.data.status === "success") {
          navigate("/");
          location.reload(true);
        } else {
          alert("Login failed");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div>
        <form className="loginsignupform" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div>
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="jelszo">
              <strong>Jelszó</strong>
            </label>
            <input
              type="password"
              name="jelszo"
              placeholder="Jelszó"
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="jelszoUjra">
              <strong>Jelszó újra</strong>
            </label>
            <input
              type="password"
              name="jelszoUjra"
              placeholder="Jelszó újra"
              onChange={handleInput}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import classes from "./LoginForm.module.css";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [psswrd, setPsswrd] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("login");

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePsswrd = (e) => setPsswrd(e.target.value);
  const onUsername = (e) => setUsername(e.target.value);

  const resetForm = () => {
    setEmail("");
    setPsswrd("");
    setUsername("");
  };
  const isLoginMode = mode === "login";
  const buttonContent = isLoginMode ? "Signup" : "Login";
  const partialURL = isLoginMode ? "login" : "signup";

  const onToggleMode = () => {
    if (mode === "login") {
      setMode("signup");
    } else {
      setMode("login");
    }
  };

  const submitLoginForm = async (e) => {
    e.preventDefault();

    if (email.trim() === "" && psswrd.trim() === "") {
      setEmail("");
      setPsswrd("");
      return;
    }

    const body = {
      email: email,
      password: psswrd,
    };

    if (mode === "signup") {
      body.username = username;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${partialURL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      let message = "Couldn't log you in.";
      if (mode === "signup") {
        message = "Couldn't sign you up.";
      }

      if (!response.ok) {
        throw new Error(message);
      }

      const responseData = await response.json();

      if (mode === "login") {
        dispatch(
          authActions.login({
            id: responseData.id,
            username: responseData.username,
            token: responseData.token,
          })
        );
        navigate("/chat");
      } else {
        resetForm();
        setMode("login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={classes["container"]}>
      <h2 className={classes["title"]}>Sechat</h2>
      <form className={classes["login"]}>
        <div className={classes["login-item"]}>
          <label className={classes["label"]} htmlFor="email">
            Email
          </label>
          <input
            className={classes["input"]}
            id="email"
            type="email"
            value={email}
            onChange={onChangeEmail}
            autoFocus
            autoComplete="off"
          />
        </div>
        <div className={classes["login-item"]}>
          <label className={classes["label"]} htmlFor="psswrd">
            Password
          </label>
          <input
            className={`${classes["input"]} ${classes["psswrd"]}`}
            id="psswrd"
            type="password"
            value={psswrd}
            onChange={onChangePsswrd}
            autoComplete="off"
          />
        </div>
        {!isLoginMode && (
          <div className={classes["login-item"]}>
            <label className={classes["label"]} htmlFor="nickname">
              Nickname
            </label>
            <input
              className={classes["input"]}
              id="nickname"
              type="text"
              value={username}
              onChange={onUsername}
              autoComplete="off"
            />
          </div>
        )}
        <button className={classes["button"]} onClick={submitLoginForm}>
          Send
        </button>
        <button
          type="button"
          className={classes["button"]}
          onClick={onToggleMode}
        >
          {buttonContent}
        </button>
      </form>
    </section>
  );
};

export default LoginForm;

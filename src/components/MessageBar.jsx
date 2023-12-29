import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import socketService from "../services/socketService";
// import { chatActions } from "../store/chat-slice";
import { authActions } from "../store/auth-slice";
import DataBar from "./DataBar";

import classes from "./MessageBar.module.css";

const fakeCommands = ["sechat --lg", "sechat -logout"];

const MessageBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username, token } = useSelector((state) => state.auth);
  const { id: chatId } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const onSetMessageHandler = (e) => setMessage(e.target.value);

  const sendMessage = () => {
    if (message.trim() === "") {
      return;
    }

    if (fakeCommands.includes(message.trim())) {
      dispatch(authActions.logout());
      navigate("/");
      return;
    }

    if (chatId) {
      socketService.emit(
        "send-message",
        JSON.stringify({
          id: chatId,
          content: message,
          author: username,
          token: token,
        })
      );
    }
    setMessage("");
  };

  const onSubmitMessage = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const saveMessageWithEnter = (e) => {
    if (e.key === "Enter" && e.target.matches("textarea")) {
      e.preventDefault();
      let timeEvent;

      timeEvent = setTimeout(() => {
        clearTimeout(timeEvent);
        sendMessage();
      }, 100);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", saveMessageWithEnter);

    return () => {
      window.removeEventListener("keydown", saveMessageWithEnter);
    };
  }, []);

  return (
    <section className={classes["message-bar"]}>
      <form onSubmit={onSubmitMessage} className={classes["form"]}>
        <div className={classes["form-section"]}>
          <label className={classes["user"]} htmlFor="message">
            @{username}:~/
          </label>
          <input
            id="message"
            className={classes["text-area"]}
            type="text"
            onInput={onSetMessageHandler}
            value={message}
            autoComplete="off"
          />
        </div>
        <button className={classes["submit"]}> =&gt;</button>
      </form>
      <DataBar />
    </section>
  );
};

export default MessageBar;

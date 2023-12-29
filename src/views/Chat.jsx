import Header from "../components/Header";
import MessageScreen from "../components/MessageScreen";
import SideBar from "../components/SideBar";
import MessageBar from "../components/MessageBar";
import { Outlet } from "react-router-dom";
import socketService from "../services/socketService";

import classes from "./Chat.module.css";
import { useEffect } from "react";

const Chat = () => {

  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <div className={classes['outlet']}>
        <Outlet />
      </div>
      <SideBar />
      <MessageBar />
    </>
  );
};

export default Chat;

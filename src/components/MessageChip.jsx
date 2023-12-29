import classes from "./MessageChip.module.css";

const MessageChip = (props) => {
  
  return (
    <li className={`${classes["message-chip"]} ${props.isMine && classes["is-mine"]}`}>
      <span className={classes["author"]}>@{props.author}:~$</span>
      <span className={classes["content"]}>{props.content}</span>
    </li>
  );
};

export default MessageChip;

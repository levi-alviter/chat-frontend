import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MessageChip from "./MessageChip";
import { chatActions } from "../store/chat-slice";
import socketService from "../services/socketService";
import classes from "./MessageScreen.module.css";

const MessageScreen = () => {
  const { userId: receiverId } = useParams();
  const messages = useSelector((state) => state.chat.messages);
  const amount = useSelector((state) => state.chat.totalQuantity);
  const { username: localAuthor, id: senderId } = useSelector(
    (state) => state.auth
  );
  const areThereMessages = amount > 0;
  const dispatch = useDispatch();
  const chatRef = useRef();
  let chatId = null;

  const onSocketAddMessage = (msg) => {
    const msgObj = JSON.parse(msg);
    dispatch(chatActions.addMessage(msgObj));
  };

  const getChat = async () => {
    const response = await fetch(
      `http://localhost:4000/api/chats?senderId=${senderId}&receiverId=${receiverId}`
    );

    if (!response.ok) {
      throw new Error("Failed to the chat.");
    }

    const responseData = await response.json();

    const messages = responseData.messages.map((message) => ({
      id: message.id,
      author: message.author,
      content: message.content,
    }));

    dispatch(chatActions.setId({ id: responseData.id }));

    dispatch(
      chatActions.populateMessages({
        messages,
        total: messages.length,
      })
    );

    socketService.on(`fetch-message-${responseData.id}`, onSocketAddMessage);
    chatId = responseData.id;
  };

  const createChat = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/chats/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
          receiverId: receiverId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed creating chat.");
      }

      const responseData = await response.json();

      dispatch(chatActions.setId({ id: responseData.id }));

      socketService.on(`fetch-message-${responseData.id}`, onSocketAddMessage);
      chatId = responseData.id;
    } catch (error) {
      throw new Error(error);
    }
  };

  const ifNotFetchThenCreate = async () => {
    try {
      await getChat();
    } catch (error) {
      await createChat();
    }
  };

  useEffect(() => {
    // autoscrolling when adding a new message
    chatRef.current.scrollTop = chatRef.current.scrollHeight;

    return () => {
      chatRef.current.scrollTop = 0;
    };
  }, [amount]);

  useEffect(() => {
    dispatch(chatActions.resetChat());
    ifNotFetchThenCreate();

    return () => {
      socketService.off(`fetch-message-${chatId}`, onSocketAddMessage);
      dispatch(chatActions.resetChat());
    };
  }, [receiverId]);

  return (
    <section className={classes["message-screen"]}>
      <ul className={classes["message-list"]} ref={chatRef}>
        {areThereMessages &&
          messages.map((message) => (
            <MessageChip
              key={message.id}
              author={message.author}
              content={message.content}
              isMine={message.author === localAuthor}
            />
          ))}
        {!areThereMessages && (
          <MessageChip author="Server" content="No messages yet!" />
        )}
      </ul>
    </section>
  );
};

export default MessageScreen;

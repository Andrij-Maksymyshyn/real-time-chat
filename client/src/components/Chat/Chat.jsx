import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

import icon from "../../images/emoji.svg";
import styles from "./Chat.module.css";

const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const { search } = useLocation();
  const [params, setParams] = useState({ room: "", user: "" });
  const [report, setReport] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);

    socket.emit("join", searchParams);
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setReport(_report => [..._report, data]);
    });
  }, []);

  const leftRoom = () => {};
  const handleChange = () => {};
  const onEmojiClick = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = () => {};

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params.room}</div>
        <div className={styles.users}>0 users in this room</div>
        <button className={styles.left} onClick={leftRoom}>
          left the room
        </button>
      </div>

      <div className={styles.messages}>
        {report.map(({ message }, i) => (
          <span key={i}>{message}</span>
        ))}
      </div>

      <form className={styles.form}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            value={message}
            placeholder="What do you want to say?"
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <div className={styles.emoji}>
          <img src={icon} alt="icon" />

          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className={styles.button}>
          <input
            type="submit"
            onSubmit={handleSubmit}
            value="Send a message "
          />
        </div>
      </form>
    </div>
  );
};

export default Chat;

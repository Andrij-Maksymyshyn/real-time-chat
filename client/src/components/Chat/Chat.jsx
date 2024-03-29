import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

import Messages from "../Messages";
import icon from "../../images/emoji.svg";
import styles from "./Chat.module.css";

const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: "", user: "" });
  const [report, setReport] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState(0);
  const [members, setMembers] = useState([]);
  const [buttonToUp, setButtonToUp] = useState(true);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);

    socket.emit("join", searchParams);
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setReport(_report => [..._report, data]);
      setButtonToUp(true);
    });
  }, []);

  const userId = report[0]?.userId;
  const userJoinedId = report[1]?.userId;

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users`);
        setMembers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [params]);

  const newUser = members[members.length - 1]?.userName;

  const leftRoom = () => {
    socket.emit("leftRoom", { params, userId, userJoinedId });
    navigate("/");
  };

  const handleChange = ({ target: { value } }) => {
    setMessage(value);
  };

  const onEmojiClick = ({ emoji }) => {
    setMessage(`${message} ${emoji}`);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!message) {
      return;
    }

    socket.emit("sendMessage", { message, params, userId, userJoinedId });
    setMessage("");
  };

  const toTop = () => {
    window.scrollTo(0, 0);
    setButtonToUp(!buttonToUp);
  };

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.title}>{params.room}</div>
          <div className={styles.user}>{users} users in this room</div>
          <button className={styles.left} onClick={leftRoom}>
            left the room
          </button>
        </div>

        <div className={styles.messages}>
          <Messages messages={report} name={newUser} />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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
            <img src={icon} alt="icon" onClick={() => setIsOpen(!isOpen)} />

            {isOpen && (
              <div className={styles.emojies}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <div className={styles.button}>
            <input type="submit" value="Send a message " />
          </div>
        </form>
      </div>
      {(report.length > 12) & buttonToUp && (
        <button onClick={toTop} className={styles.topBtn}>
          Up
        </button>
      )}
    </>
  );
};

export default Chat;

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const messageRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  useEffect(() => {
    getMessages();
  }, [currentChat]);

  const getMessages = async () => {
    const { data } = await axios.post(`/api/messages/getmsg`, {
      from: currentUser?._id,
      to: currentChat?._id,
    });
    setMessages(data);
  };

  const handleSendMsg = async (msg) => {
    const url = "/api/messages/addmsg";
    await axios.post(url, {
      from: currentUser?._id,
      to: currentChat?._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat?._id,
      from: currentUser?._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }

    messageRef.current.innerHTML = "";
  }, [arrivalMessage]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat?.username}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div className={`message ${msg.fromSelf ? "sent" : "received"}`}>
                <div className="content">
                  <p>{msg.message}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="typing" ref={messageRef}></div>
      </div>
      <ChatInput
        handleSendMsg={handleSendMsg}
        socket={socket}
        currentChat={currentChat}
        messageRef={messageRef}
      />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sent {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
  .typing {
    color: #d1d1d1;
    overflow-wrap: break-word;
    padding: 1rem;
    font-size: 1.2rem;
    border-radius: 1rem;
  }
`;

export default ChatContainer;

import React from "react";
import styled from "styled-components";
import roboGift from "../assets/robot.gif";

const Welcome = ({ currentUser }) => {
  return (
    <Container>
      <img src={roboGift} alt="robot" />
      <h1>
        Welcome, <span>{currentUser?.username}</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome;

import React from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";

const Logout = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <Container onClick={handleClick}>
      <BiPowerOff />
    </Container>
  );
};

const Container = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
export default Logout;

import { Outlet, Link } from "react-router-dom";
import styled from "styled-components";
import Logout from "./Logout";
import { BsFillChatDotsFill } from "react-icons/bs";
import { AiFillContacts } from "react-icons/ai";

const Scaffolding = () => {
  return (
    <Container>
      <main>
        <nav className="navBar">
          <Link to="/" className="home">
            <BsFillChatDotsFill />
            Home
          </Link>
          <Link to="/addContact" className="addContact">
            <AiFillContacts />
            Add
          </Link>
          <Logout />
        </nav>
        <section>
          <Outlet />
        </section>
      </main>
    </Container>
  );
};

const Container = styled.div`
  main {
    height: 100vh;
    background-color: #0d0d30;
  }
  .navBar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 2rem;
    padding: 1rem 2rem;
  }
  .home {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    svg {
      font-size: 1.5rem;
    }
    text-decoration: none;
    :hover {
      color: #ffffffa6;
    }
    transition: all 0.2s ease-in-out;
  }
  .addContact {
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    svg {
      font-size: 1.5rem;
    }
    :hover {
      color: #ffffffa6;
    }
    transition: all 0.2s ease-in-out;
  }
`;

export default Scaffolding;

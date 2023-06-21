import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddContact = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(undefined);
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
      setIsLoaded(true);
    }
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoaded(false);
    const { data } = await axios.get(
      `/api/auth/allusers/${currentUser?._id}?search=${search}`
    );
    setSearchResults(data.usersWithContacts);

    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  };

  const handleAddOrRemoveContact = async (contactId) => {
    const { data } = await axios.patch(`/api/auth/addContact/${contactId}`, {
      userId: currentUser._id,
    });

    if (data.isContact === false) {
      toast.error(data.message, toastOptions);
    } else {
      toast.success(data.message, toastOptions);
    }

    const updatedSearchResults = searchResults.filter((user) => {
      if (user._id === contactId) {
        user.isContact = data.isContact;
      }
      return user;
    });
    setSearchResults([...updatedSearchResults]);
  };

  return (
    <>
      <Container>
        <div className="container">
          <form onSubmit={handleSearch}>
            <div className="innerContainer">
              <input
                type="text"
                className="search"
                name="search"
                placeholder="Search for a user..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
          </form>
          <div className="searchResults">
            {isLoaded &&
              (searchResults?.length === 0 ? (
                <h3 className="message">No user found</h3>
              ) : (
                searchResults?.map((user) => (
                  <div className="userCard" key={user._id}>
                    <div className="userInfo">
                      <img
                        src={`data:image/svg+xml;base64,${user.avatarImage}`}
                        alt="avatar"
                        className="avatar"
                      />
                      <h3 className="username">@{user.username}</h3>
                    </div>
                    {user.isContact ? (
                      <button
                        className="removeContact"
                        onClick={() => handleAddOrRemoveContact(user._id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="addContact"
                        onClick={() => handleAddOrRemoveContact(user._id)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))
              ))}
            {isLoaded && searchResults === undefined && (
              <h3 className="message">Search for a user...</h3>
            )}
            {!isLoaded && <h3 className="message">Searching for users...</h3>}
          </div>
        </div>
        ;
      </Container>
      <ToastContainer />
    </>
  );
};

const Container = styled.div`
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    margin-top: 1rem;
    border-radius: 1rem;
    margin-right: auto;
    margin-left: auto;
  }
  .innerContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 100%;
  }
  .search {
    width: 80%;
    height: 100%;
    background-color: transparent;
    outline: none;
    color: white;
    font-size: 1.5rem;
    padding: 1rem;
    font-weight: 500;
    border-radius: 1rem;
    border: #66626276 1px solid;
    padding: 1rem 2rem;
    margin-top: 3rem;
    margin-left: auto;
    margin-right: auto;

    ::placeholder {
      color: white;
      font-size: 1.5rem;
      font-weight: 400;
      opacity: 0.5;
    }
  }
  .avatar {
    height: 3rem;
  }
  .searchResults {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 80%;
    border-radius: 1rem;
    margin-top: 3rem;
    margin-left: auto;
    margin-right: auto;
  }
  .userCard {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 80%;
    height: 5rem;
    background-color: #ababab;
    border-radius: 1rem;
    :hover {
      background-color: #ababab76;
      .username {
        color: #eaeaea;
      }
    }
    transition: 0.3s ease-in-out;
  }
  .userInfo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    width: 50%;
  }
  .username {
    font-size: 1.5rem;
    font-weight: 500;
    color: #000000;
  }
  .message {
    font-size: 1.5rem;
    font-weight: 500;
    color: #ffffff;
  }
  .addContact {
    background-color: #286300;
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .removeContact {
    background-color: #8f1818;
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    border: none;
    outline: none;
    cursor: pointer;
  }
`;

export default AddContact;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import classes from "./SideBar.module.css";
import socketService from "../services/socketService";

const SideBar = () => {
  const { id: localId } = useSelector((state) => state.auth);
  const [friends, setFriends] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const onUpdatingSearch = (e) => setSearch(e.target.value);
  const onResetSearch = () => setSearch("");

  const fetchFriends = async () => {
    if (!localId) {
      return;
    }

    try {
      setResult(null);
      setError(null);
      const response = await fetch(
        `http://localhost:4000/api/users/${localId}/friends`
      );

      if (!response.ok) {
        throw new Error("No friends found!");
      }

      const responseData = await response.json();
      
      responseData
        ? setFriends(responseData)
        : setResult("No friends found");

      socketService.on(`fetch-friend-${localId}`, (msg) => {
        const objectFriend = JSON.parse(msg);

        setFriends((currentFriends) => [
          ...currentFriends,
          {
            id: objectFriend.id,
            username: objectFriend.username,
          },
        ]);
      });
    } catch (error) {
      setError(error.message || "Something went wrong!");
    }
  };

  const searchUsers = async () => {
    try {
      setResult(null);
      setError(null);
      const response = await fetch(`http://localhost:4000/api/users/${search}`);

      if (!response.ok) {
        throw new Error("No users found!");
      }

      const responseData = await response.json();

      responseData.username
        ? setResult(responseData)
        : setResult("No users found!");
    } catch (error) {
      setError(error.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      if (search) {
        searchUsers();
      }
    }, 250);

    if (!search) {
      setResult("");
      setError("");
    }

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <nav className={classes["nav"]}>
      {!search && friends.length === 0 && (
        <ul className={`${classes["no-friends"]}`}>
          <li>No friends :c</li>
        </ul>
      )}
      {!search && friends.length > 0 && (
        <ul className={classes["nav-list"]}>
          <li>Your friends:</li>
          {friends.map((friend) => (
            <li key={friend.id}>
              <Link to={`/chat/${friend.id}`}>{friend.username}</Link>
            </li>
          ))}
          <li></li>
        </ul>
      )}
      {search && (
        <ul className={classes["nav-list"]}>
          {!error && !result && <li>@Server:~$ looking for {search}</li>}
          {result && (
            <>
              <li>@Server:~$:</li>
              <li>
                <Link to={`/chat/${result._id}`} onClick={onResetSearch}>
                  |--{result.username}
                </Link>
              </li>
            </>
          )}
          {error && <li>{error}</li>}
        </ul>
      )}
      <div className={classes["search-box"]}>
        <input
          className={classes["search"]}
          type="text"
          onInput={onUpdatingSearch}
          value={search}
          placeholder="Look for a friend"
        ></input>
        <button className={classes["search-button"]} onClick={onResetSearch}>
          &#9003;
        </button>
      </div>
    </nav>
  );
};

export default SideBar;

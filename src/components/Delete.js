import { Typography, Stack, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import Login from "./Login";

const Delete = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const status = window.localStorage.getItem("token");
    console.log(status);
    setLoggedIn(status != null);
  }, []);

  const onSubmit = async () => {
    // Make a post request to the database, create new user with info

    // Update database
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/Home/Delete${window.localStorage.getItem(
          "token"
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        const data = await response.json();
        if (data.successful) {
          window.localStorage.removeItem("token");
          setLoggedIn(false);
          window.location.assign("/Login");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const goHome = () => {
    window.location.assign("/Home");
  };

  return loggedIn ? (
    <div className="centered">
      <Stack
        spacing={5}
        sx={{
          borderRadius: 3,
          boxShadow: 5,
          alignItems: "center",
          backgroundColor: "#EDE9E8",
        }}
        p={3}
      >
        <Typography variant="h3" color="#E84A27">
          Match and Meet
        </Typography>
        <Typography variant="h5" color="#E84A27">
          Delete Your Account
        </Typography>
        <Button
          onClick={onSubmit}
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Delete Your Account
        </Button>
        <Button onClick={goHome} variant="contained" startIcon={<HomeIcon />}>
          Go Home
        </Button>
      </Stack>
    </div>
  ) : (
    <Login />
  );
};
export default Delete;

import { Typography, Stack, Button } from "@mui/material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Login from "./Login";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function Home(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedFriends, setExpandedFriends] = useState(false);
  const [expandedRequests, setExpandedRequests] = useState(false);

  useEffect(() => {
    const status = window.localStorage.getItem("token");
    console.log(status);
    setLoggedIn(status != null);
  }, []);

  const handleExpandedFriendsChange = async () => {
    if (!expandedFriends) {
      await getFriends();
    }
    setExpandedFriends(!expandedFriends);
  };

  const handleExpandedRequestsChange = async () => {
    if (!expandedRequests) {
      await getRequests();
    }
    setExpandedRequests(!expandedRequests);
  };

  const getRequests = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/requests/${window.localStorage.getItem(
          "token"
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        var friendRequests = await response.json();
        friendRequests = friendRequests[0][0].split(",");
        friendRequests.splice(-1);
        let fetchRequests = [];
        for (var ix = 0; ix < friendRequests.length; ++ix) {
          fetchRequests.push({
            id: ix,
            username: friendRequests[ix],
          });
        }
        setRequests(fetchRequests);
        console.log(friendRequests);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFriends = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/friends/${window.localStorage.getItem("token")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        var friendsList = await response.json();
        friendsList = friendsList[0][0].split(",");
        friendsList.splice(-1);
        console.log(friendsList);
        let fetchFriends = [];
        for (var ix = 0; ix < friendsList.length; ++ix) {
          fetchFriends.push({
            id: ix,
            username: friendsList[ix],
          });
        }
        setFriends(fetchFriends);
        console.log(fetchFriends);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const acceptRequests = async () => {
    for (const friendRequest of selectedRows) {
      let data = {
        username: window.localStorage.getItem("token"),
        new_request: friendRequest["username"],
      };
      const deleteRequest = await fetch("http://127.0.0.1:5000/requests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      data = {
        username: window.localStorage.getItem("token"),
        new_friend: friendRequest["username"],
      };

      const addFriend = await fetch("http://127.0.0.1:5000/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      data = {
        username: friendRequest["username"],
        new_friend: window.localStorage.getItem("token"),
      };

      const becomeFriend = await fetch("http://127.0.0.1:5000/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }
    await getRequests();
    await getFriends();
  };

  const rejectRequests = async () => {
    for (const friendRequest of selectedRows) {
      const data = {
        username: window.localStorage.getItem("token"),
        new_request: friendRequest["username"],
      };
      const response = await fetch("http://127.0.0.1:5000/requests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }
    await getRequests();
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setLoggedIn(false);
    window.location.assign("/Login");
  };

  const myFunction = () => {
    document.getElementById("myDropdown").classList.toggle("show");
  };

  window.onclick = function(event) {
    if (!event.target.matches(".dropbtn")) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };

  return loggedIn ? (
    <div className="centered">
      <Stack sx={{ width: "80%" }}>
        <div className="meet">
          <Typography variant="h2" color="#E84A27">
            Match and Meet
          </Typography>
        </div>

        <Typography variant="h4" color="#E84A27">
          Home
        </Typography>
        
        {/* <Stack direction="horizontal"> */}
        <div style={{width: "100%"}}>
          <Accordion
            expanded={expandedFriends}
            onChange={handleExpandedFriendsChange}
            sx={{ width: "100%" }}
          >
            
            <AccordionSummary
              aria-controls="friend-content"
              id="friend-header"
              expandIcon={
                expandedFriends ? (
                  <KeyboardArrowRightIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )
              }
            >
              <Typography>Your Friends</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ height: 200, width: "100%"}}>
                <DataGrid
                  rows={friends}
                  columns={[
                    { field: "username", headerName: "NetID", flex: 1 },
                  ]}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection
                />
              </div>
          
            </AccordionDetails>
          </Accordion>
          </div>
          <Accordion
            expanded={expandedRequests}
            onChange={handleExpandedRequestsChange}
            sx={{ width: "100%" }}
          >
            <AccordionSummary
              aria-controls="request-content"
              id="request-header"
              expandIcon={
                expandedRequests ? (
                  <KeyboardArrowRightIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )
              }
            >
              <Typography>Pending Friend Requests</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ height: 200, width: "100%" }}>
                <DataGrid
                  rows={requests}
                  columns={[
                    { field: "username", headerName: "NetID", flex: 1 },
                  ]}
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const rowsSelected = requests.filter((row) =>
                      selectedIDs.has(row.id)
                    );
                    setSelectedRows(rowsSelected);
                  }}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection
                />
              </div>
            </AccordionDetails>
            
            <Button
              onClick={acceptRequests}
              variant="contained"
              startIcon={<CheckIcon />}
              disabled={selectedRows.length === 0}
            >
              Accept
            </Button>
            <Button
              onClick={rejectRequests}
              variant="contained"
              startIcon={<CloseIcon />}
              disabled={selectedRows.length === 0}
            >
              Reject
            </Button>
          </Accordion>

          
        {/* </Stack> */}
       
        <div class="dropdown">
          <Button onClick={myFunction} class="dropbtn">
            Dropdown
          </Button>
          <div id="myDropdown" class="dropdown-content">
            <a href="/Home">Home</a>
            <a href="Home/EditProfile">Edit Profile</a>
            <a href="Home/Delete">Delete Account</a>
            <a href="Home/Search">Search User</a>
            <a href="Home/FindFriends">Find Matches</a>
            <Button onClick={logout}>Sign Out</Button>
          </div>
        </div>
  
      </Stack>
      
    </div>
  ) : (
    <Login />
  );
}

export default Home;

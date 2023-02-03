import { Stack, TextField, Button, Typography, Alert } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import Login from "./Login";

const Search = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [query, setCourse] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [requestsSent, setRequestsSent] = useState(false);

  useEffect(() => {
    const status = window.localStorage.getItem("token");
    console.log(status);
    setLoggedIn(status != null);
  }, []);

  useEffect(() => {
    console.log(selectedRows);
  }, [selectedRows]);

  const search = () => {
    const promise = load(`http://127.0.0.1:5000/Home/Search${query}`);
    promise.then(function(value) {
      myDisplayer(value);
    });
  };

  const goHome = () => {
    window.location.assign("/Home");
  };

  const sendRequests = async () => {
    for (const row of selectedRows) {
      const data = {
        new_request: window.localStorage.getItem("token"),
        username: row["NetID"],
      };
      try {
        const response = await fetch("http://127.0.0.1:5000/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        setRequestsSent(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  function myDisplayer(some) {
    let query_result = [];
    for (var ix = 0; ix < some.length; ++ix) {
      const entry = some[ix];
      query_result.push({
        id: ix,
        NetID: entry[0],
        FirstName: entry[1],
        LastName: entry[2],
      });
    }
    setResults(query_result);
  }

  const handleCourse = (e) => {
    setCourse(e.target.value);
  };

  function load(url) {
    return new Promise(async function(resolve, reject) {
      // do async thing
      const res = await fetch(url);

      // your custom code
      console.log("Yay! Loaded:", url);

      // resolve
      resolve(res.json()); // see note below!
    });
  }

  return loggedIn ? (
    <div className="centered">
      <Stack
        color="#E84A27"
        sx={{
          borderRadius: 3,
          boxShadow: 5,
          alignItems: "center",
          backgroundColor: "#EDE9E8",
          width: "80%",
        }}
        p={7}
        spacing={2.25}
      >
        <Typography variant="h3" color="#E84A27">
          Discover Classmates
        </Typography>
        <Stack direction="horizontal" sx={{ width: "30%" }}>
          <TextField
            id="outlined-basic"
            label="Search for Students in a Course"
            sx={{ width: "80%" }}
            value={query}
            onChange={handleCourse}
            size="small"
          />
          <Button
            onClick={search}
            variant="contained"
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Stack>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={results}
            columns={[
              { field: "NetID", headerName: "NetID", flex: 1 },
              { field: "FirstName", headerName: "First Name", flex: 1 },
              { field: "LastName", headerName: "Last Name", flex: 1 },
            ]}
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const rowsSelected = results.filter((row) =>
                selectedIDs.has(row.id)
              );
              setSelectedRows(rowsSelected);
            }}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
          />
        </div>
        <Button
          onClick={sendRequests}
          variant="contained"
          startIcon={<GroupAddIcon />}
          disabled={selectedRows.length === 0}
        >
          Send Friend Request
        </Button>
        {requestsSent && (
          <Alert
            severity="success"
            onClose={() => {
              setRequestsSent(false);
            }}
            variant="filled"
          >
            Friend Requests Sent!
          </Alert>
        )}
        <Button onClick={goHome} variant="contained" startIcon={<HomeIcon />}>
          Go Home
        </Button>
      </Stack>
    </div>
  ) : (
    <Login />
  );
};

export default Search;

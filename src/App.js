import React from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import EditProfile from "./components/EditProfile";
import Delete from "./components/Delete";
import Search from "./components/Search";
import FindFriends from "./components/FindFriends";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Home/EditProfile" element={<EditProfile />} />
          <Route path="/Home" element={<Home />} />

          <Route path="/Login" element={<Login />} />
          <Route path="/Home/Delete" element={<Delete />} />
          <Route path="/Home/Search" element={<Search />} />

          <Route path="/Home/FindFriends" element={<FindFriends />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

import React, { useState, useCallback } from 'react';
import { Routes, Route, Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // Import the new Sidebar component
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import User from "./pages/User";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CreateProfile from "./pages/CreateProfile";
import ProfilePage from "./pages/ProfilePage";
import UserProfiles from "./pages/UserProfiles";
import CreateContract from "./pages/CreateContract";
import ContractPage from "./pages/ContractPage";
import UserContracts from "./pages/UserContracts";
import CreateEvent from "./pages/CreateEvent";
import EventPage from "./pages/EventPage";
import './index.css'

function App() {
  const [navbarHeight, setNavbarHeight] = useState(0); // <-- State to store navbar height
  // Callback to receive height from Navbar.jsx
  // useCallback memoizes this function, preventing unnecessary re-renders of Navbar
  const handleNavbarHeightChange = useCallback((height) => {
    setNavbarHeight(height);
  }, []); // No dependencies, as it only sets state

  return (
    // THIS WRAPPING DIV IS CRUCIAL FOR THE LAYOUT
    <div className="flex flex-col min-h-screen">
      <Navbar onHeightChange={handleNavbarHeightChange} />

      {/* Main content area - needs padding-top */}
      <main
        //className="flex-1 p-4" // flex-1 makes it take remaining height
        //style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '0px' }} // Dynamic padding
      >
        <Routes>
          {/* Your Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/create" element={<CreateProfile />} />
          <Route path="/contract/create" element={<CreateContract />} />

          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/contract/:id" element={<ContractPage />} />
          <Route path="/user/:id/profiles" element={<UserProfiles />} />
          <Route path="/user/:id/contracts" element={<UserContracts />} />
          <Route path="/contract/:contract_id/event/create" element={<CreateEvent />} />
          <Route path="contract/:contract_id/event/:event_id" element={<EventPage />} />
        </Routes>
      </main>
      {/* Sidebar is fixed, so it doesn't need to be inside the flex container to work. */}
      {/* However, the flex container for main is important for ensuring it takes space. */}
      <Sidebar navbarHeight={navbarHeight} />
    </div>
  );
}

export default App;
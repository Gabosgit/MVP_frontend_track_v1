import { Routes, Route } from "react-router-dom";
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


function App() {
  return (
      <Routes>
        {/* Defining routes (pages) */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/create" element={<CreateProfile />} />
        <Route path="/contract/create" element={<CreateContract />} />
        
        {/* The `:id` parameter makes the route dynamic */}
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/contract/:id" element={<ContractPage />} />
        <Route path="/user/:id/profiles" element={<UserProfiles />} />
        <Route path="/user/:id/contracts" element={<UserContracts />} />
        <Route path="/contract/:contract_id/event/create" element={<CreateEvent />} />
        <Route path="contract/:contract_id/event/:event_id" element={<EventPage />} />
      </Routes>
  );
}

export default App;
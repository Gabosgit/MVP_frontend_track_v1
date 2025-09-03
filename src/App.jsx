import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import User from "./pages/User";
import SignUp from "./pages/SignUp";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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

  return (
    // THIS WRAPPING DIV IS CRUCIAL FOR THE LAYOUT
    <>
      <Navbar />
      {/* Sidebar is fixed, so it doesn't need to be inside the flex container to work. */}
      {/* However, the flex container for main is important for ensuring it takes space. */}
      <main className="pt-[90px]">
        <Routes>
          {/* Your Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/change_password" element={<ChangePassword />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/create" element={<CreateProfile />} />
          <Route path="/contract/create" element={<CreateContract />} />

          <Route path="/profile/:id" element={<CreateProfile />} />
          <Route path="/contract/:id" element={<ContractPage />} />
          <Route path="/user/:id/profiles" element={<UserProfiles />} />
          <Route path="/user/:id/contracts" element={<UserContracts />} />
          <Route path="/contract/:contract_id/event/create" element={<CreateEvent />} />
          <Route path="contract/:contract_id/event/:event_id" element={<EventPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
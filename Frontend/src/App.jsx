import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/auth/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Jobs from "./pages/job/Jobs.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import JobDetails from "./pages/job/JobDetails.jsx";
import Applications from "./pages/student/Applications.jsx";
import Profile from "./pages/student/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import PendingUsers from "./pages/admin/PendingUsers.jsx";
import PendingJobs from "./pages/admin/PendingJobs.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/authContext.jsx";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job/:jobId"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        {/* Admin Section */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<PendingUsers />} />
          <Route path="jobs" element={<PendingJobs />} />
          <Route path="logs" />
        </Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 Catch-all */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

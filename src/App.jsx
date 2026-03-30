import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './pages/frontpage';
import Login from './components/Aunthencation/Login';
import SignUpPage from './pages/signup';
import DriverFormPage from './pages/driverform';
import Dashboardhome from './components/Dashboard/Dashboardhome';
import Message from './components/Dashboard/message';
import Profile from './components/Dashboard/profile';
import Transaction from './components/Dashboard/transaction';
import RideHistory from './components/Dashboard/ridehistory';
import Support from './components/Dashboard/support';
import About from './components/Dashboard/about';
import OngoingBookings from './components/Dashboard/ongoingbookings';
import PendingBookings from './components/Dashboard/pendingbookings';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/home" element={<FrontPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/driver-application" element={<ProtectedRoute element={<DriverFormPage />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboardhome />} />} />
        <Route path="/pending-bookings" element={<ProtectedRoute element={<PendingBookings />} />} />
        <Route path="/ongoing-bookings" element={<ProtectedRoute element={<OngoingBookings />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/messages" element={<ProtectedRoute element={<Message />} />} />
        <Route path="/transaction" element={<ProtectedRoute element={<Transaction />} />} />
        <Route path="/rides-history" element={<ProtectedRoute element={<RideHistory />} />} />
        <Route path="/support" element={<ProtectedRoute element={<Support />} />} />
        <Route path="/about-us" element={<ProtectedRoute element={<About />} />} />
      </Routes>
    </Router>
  );
}